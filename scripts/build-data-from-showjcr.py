#!/usr/bin/env python3
"""Build a compact journal metrics JSON file from ShowJCR CSV exports.

Expected inputs are the CSV files distributed with ShowJCR:
- JCR2025-UTF8.csv
- FQBJCR2025-UTF8.csv
- GJQKYJMD2025.csv

Optional input:
- EasyPubMed dist/data/pubmed_abb_data.json, used only to add PubMed journal
  abbreviations and PubMed journal titles as aliases.

The output schema is intentionally simple so the userscript can run without a
backend service.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from collections import OrderedDict
from datetime import date
from pathlib import Path


def norm_journal(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip().upper()


def split_issns(value: str) -> list[str]:
    hits = re.findall(r"\b\d{4}-[\dXx]{4}\b", value or "")
    return sorted({hit.upper() for hit in hits})


def add_alias(record: dict, alias: str) -> None:
    alias = re.sub(r"\s+", " ", alias or "").strip()
    if not alias:
        return
    existing = {item.casefold() for item in record["aliases"]}
    if alias.casefold() not in existing and alias.casefold() != record["journal"].casefold():
        record["aliases"].append(alias)


def cas_block(value: str) -> str:
    match = re.search(r"\b([1-4])\b", value or "")
    return match.group(1) if match else ""


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def latest_csv(path: Path, prefix: str) -> Path:
    candidates = []
    pattern = f"{prefix}*.csv" if prefix == "GJQKYJMD" else f"{prefix}*-UTF8.csv"
    for item in path.glob(pattern):
        match = re.search(r"(\d{4})", item.name)
        if match:
            candidates.append((int(match.group(1)), item))
    if not candidates:
        raise FileNotFoundError(f"No {prefix} CSV files found in {path}")
    return max(candidates)[1]


def source_label(path: Path) -> str:
    return re.sub(r"-UTF8\.csv$|\.csv$", "", path.name)


def row_value(row: dict[str, str], *names: str) -> str:
    for name in names:
        if name in row:
            return row.get(name, "")
    lowered = {key.casefold(): key for key in row}
    for name in names:
        key = lowered.get(name.casefold())
        if key:
            return row.get(key, "")
    return ""


def best_quartile(values: list[str]) -> str:
    priority = {"Q1": 1, "Q2": 2, "Q3": 3, "Q4": 4, "N/A": 5}
    clean = [value.strip().upper() for value in values if value and value.strip()]
    if not clean:
        return ""
    return min(clean, key=lambda value: priority.get(value, 99))


def better_quartile(new: str, current: str) -> str:
    return best_quartile([new, current])


def ensure_record(records: OrderedDict[str, dict], journal: str) -> dict:
    key = norm_journal(journal)
    if key not in records:
        records[key] = {
            "journal": key,
            "aliases": [],
            "issn": [],
            "if": "",
            "jcr": "",
            "cas": "",
            "casCategory": "",
            "top": False,
            "review": False,
            "warning": "",
        }
    return records[key]


def merge_jcr(records: OrderedDict[str, dict], path: Path) -> None:
    for row in read_csv(path):
        journal = row.get("Journal", "")
        if not journal:
            continue
        record = ensure_record(records, journal)
        record["issn"] = sorted(
            set(record["issn"])
            | set(split_issns(row_value(row, "ISSN")))
            | set(split_issns(row_value(row, "eISSN", "EISSN")))
        )

        impact = next(
            (value.strip() for key, value in row.items() if re.fullmatch(r"IF\(\d{4}\)", key or "") and value.strip()),
            "",
        )
        quartile = best_quartile([
            value
            for key, value in row.items()
            if re.fullmatch(r"IF Quartile\(\d{4}\)(?:_\d+)?", key or "")
        ])
        if impact and not record["if"]:
            record["if"] = impact

        # JCR can contain several categories per journal. Use the best quartile.
        if quartile:
            record["jcr"] = better_quartile(quartile, record["jcr"])


def merge_cas(records: OrderedDict[str, dict], path: Path) -> None:
    for row in read_csv(path):
        journal = row.get("Journal", "")
        if not journal:
            continue
        record = ensure_record(records, journal)
        record["issn"] = sorted(set(record["issn"]) | set(split_issns(row.get("ISSN/EISSN", ""))))
        record["review"] = row.get("Review", "").strip() == "是"
        record["top"] = row.get("Top", "").strip() == "是"
        record["casCategory"] = row.get("大类", "").strip() or record["casCategory"]

        block = cas_block(row.get("大类分区", ""))
        if block:
            current = record["cas"]
            if not current or int(block) < int(current):
                record["cas"] = block


def merge_warning(records: OrderedDict[str, dict], path: Path) -> None:
    if not path.exists():
        return
    rows = read_csv(path)
    if not rows:
        return
    warning_column = next((name for name in rows[0].keys() if name and name != "Journal"), "")
    for row in rows:
        journal = row.get("Journal", "")
        if not journal:
            continue
        record = ensure_record(records, journal)
        record["warning"] = row.get(warning_column, "").strip() if warning_column else "预警"


def merge_pubmed_aliases(records: OrderedDict[str, dict], path: Path | None) -> None:
    if not path or not path.exists():
        return

    issn_to_records: dict[str, list[dict]] = {}
    for record in records.values():
        for issn in record.get("issn", []):
            issn_to_records.setdefault(issn, []).append(record)

    with path.open("r", encoding="utf-8") as handle:
        rows = json.load(handle)

    for row in rows:
        row_issns = set()
        for field in ("issn", "pubmed_issn", "pubmed_eissn"):
            row_issns.update(split_issns(row.get(field, "")))

        matched_records = []
        for issn in row_issns:
            matched_records.extend(issn_to_records.get(issn, []))

        for record in matched_records:
            add_alias(record, row.get("abb", ""))
            add_alias(record, row.get("pubmed_journal", ""))


def prune_empty(record: dict) -> dict:
    return {
        key: value
        for key, value in record.items()
        if value not in ("", [], None)
    }


def build_data(showjcr_dir: Path, pubmed_abb: Path | None = None) -> dict:
    records: OrderedDict[str, dict] = OrderedDict()
    jcr_path = latest_csv(showjcr_dir, "JCR")
    cas_path = latest_csv(showjcr_dir, "FQBJCR")
    warning_path = latest_csv(showjcr_dir, "GJQKYJMD")
    merge_jcr(records, jcr_path)
    merge_cas(records, cas_path)
    merge_warning(records, warning_path)
    merge_pubmed_aliases(records, pubmed_abb)

    journals = [prune_empty(record) for record in records.values()]
    journals.sort(key=lambda item: item["journal"])
    sources = ", ".join(source_label(path) for path in (jcr_path, cas_path, warning_path))
    return {
        "meta": {
            "name": "Journal Metrics data",
            "updated": date.today().isoformat(),
            "source": f"Generated from ShowJCR CSV files: {sources}.",
        },
        "journals": journals,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--showjcr-dir", required=True, type=Path, help="Directory containing ShowJCR CSV files.")
    parser.add_argument("--pubmed-abb", type=Path, help="Optional EasyPubMed dist/data/pubmed_abb_data.json path.")
    parser.add_argument("--output", required=True, type=Path, help="Output journal-data.json path.")
    args = parser.parse_args()

    data = build_data(args.showjcr_dir, args.pubmed_abb)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, ensure_ascii=False, separators=(",", ":"))
    print(f"Wrote {len(data['journals'])} journals to {args.output}")


if __name__ == "__main__":
    main()
