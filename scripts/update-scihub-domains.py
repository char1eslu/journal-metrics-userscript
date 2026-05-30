#!/usr/bin/env python3
"""Discover and probe Sci-Hub domains, keeping reachable domains first."""

from __future__ import annotations

import argparse
import json
import re
import ssl
import urllib.request
from datetime import date
from pathlib import Path


DISCOVERY_SOURCES = [
    "https://lovescihub.wordpress.com",
    "https://sci-hub.shop",
]


def request_url(url: str, timeout: int):
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    context = ssl._create_unverified_context()
    return urllib.request.urlopen(request, timeout=timeout, context=context)


def probe(url: str, timeout: int) -> tuple[bool, int | None]:
    try:
        with request_url(url, timeout) as response:
            return 200 <= response.status < 500, response.status
    except Exception:
        return False, None


def normalize_domain(value: str) -> str:
    domain = re.sub(r"^https?://", "", value.strip(), flags=re.I)
    domain = re.sub(r"^www\.", "", domain, flags=re.I)
    domain = domain.strip("/.,);:'\"<>")
    if not re.fullmatch(r"sci-hub\.[A-Za-z0-9.-]+", domain):
        return ""
    if domain.endswith(".html"):
        return ""
    return f"https://{domain.lower()}"


def discover_domains(sources: list[str], timeout: int) -> tuple[list[str], dict[str, list[str]]]:
    discovered = []
    by_source = {}
    pattern = re.compile(r"https?://(?:www\.)?sci-hub\.[A-Za-z0-9.-]+|(?:www\.)?sci-hub\.[A-Za-z0-9.-]+", re.I)

    for source in sources:
        try:
            with request_url(source, timeout) as response:
                html = response.read().decode("utf-8", errors="ignore")
        except Exception:
            by_source[source] = []
            continue

        domains = []
        for hit in pattern.findall(html):
            domain = normalize_domain(hit)
            if domain and domain not in domains:
                domains.append(domain)
            if domain and domain not in discovered:
                discovered.append(domain)
        by_source[source] = domains

    return discovered, by_source


def unique(values: list[str]) -> list[str]:
    result = []
    for value in values:
        if value and value not in result:
            result.append(value)
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", default="scihub-domains.json", type=Path)
    parser.add_argument("--timeout", default=8, type=int)
    parser.add_argument("--no-discovery", action="store_true")
    args = parser.parse_args()

    data = json.loads(args.file.read_text(encoding="utf-8"))
    sources = DISCOVERY_SOURCES
    discovered, by_source = ([], {})
    if not args.no_discovery:
        discovered, by_source = discover_domains(sources, args.timeout)
        if not discovered:
            raise SystemExit("No Sci-Hub domains discovered; leaving existing file unchanged.")

    domains = unique(data.get("domains") or []) if args.no_discovery else unique(discovered)
    reachable = []
    unreachable = []
    statuses = {}

    for domain in domains:
        ok, status = probe(domain, args.timeout)
        statuses[domain] = status
        (reachable if ok else unreachable).append(domain)

    data["updated"] = date.today().isoformat()
    data["sources"] = sources
    data["discovered"] = by_source
    data["domains"] = reachable + unreachable
    data["status"] = statuses
    args.file.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"reachable={len(reachable)} unreachable={len(unreachable)}")


if __name__ == "__main__":
    main()
