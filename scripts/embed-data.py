#!/usr/bin/env python3
"""Embed journal-data.json into the userscript for offline installation."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


PLACEHOLDER = "embeddedData: null,"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--script", required=True, type=Path)
    parser.add_argument("--data", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    script = args.script.read_text(encoding="utf-8")
    data = json.loads(args.data.read_text(encoding="utf-8"))
    compact_data = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    replacement = f"embeddedData: {compact_data},"

    if PLACEHOLDER not in script:
        raise SystemExit(f"Could not find placeholder: {PLACEHOLDER}")

    args.output.write_text(script.replace(PLACEHOLDER, replacement, 1), encoding="utf-8")
    print(f"Wrote {args.output} ({args.output.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
