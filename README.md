# PubMed Journal Metrics Userscript

Tampermonkey userscript for PubMed. It displays journal impact factor, JCR quartile, CAS partition, Top, Review and warning tags on PubMed search result pages and article pages.

## Files

- `pubmed-journal-metrics.user.js`: install this in Tampermonkey.
- `journal-data.sample.json`: small sample data for local testing and schema reference.
- `scripts/build-data-from-showjcr.py`: converts ShowJCR CSV files into the JSON consumed by the userscript.
- `scripts/embed-data.py`: creates a full offline `.user.js` by embedding `journal-data.json`.

## Install

Recommended full offline install:

<https://raw.githubusercontent.com/char1eslu/pubmed-journal-metrics-userscript/main/pubmed-journal-metrics.full.user.js>

Lightweight install, with journal data loaded from `journal-data.json`:

<https://raw.githubusercontent.com/char1eslu/pubmed-journal-metrics-userscript/main/pubmed-journal-metrics.user.js>

Open either link in the browser, then let Tampermonkey install it. After installation, open PubMed, for example `https://pubmed.ncbi.nlm.nih.gov/?term=kidney+injury`.

The script includes a tiny built-in sample dataset, so several common journals will render immediately. For real use, use either the offline build or a hosted JSON file.

## Build Full Data From ShowJCR

Clone or download ShowJCR, then run:

```bash
python3 scripts/build-data-from-showjcr.py \
  --showjcr-dir /path/to/ShowJCR/中科院分区表及JCR原始数据文件 \
  --pubmed-abb /path/to/EasyPubMed/dist/data/pubmed_abb_data.json \
  --output journal-data.json
```

Upload `journal-data.json` to a GitHub repository or Gist, then set:

```js
dataUrl: "https://raw.githubusercontent.com/YOUR_NAME/YOUR_REPO/main/journal-data.json",
```

If you use another host, add its domain to the userscript metadata with `@connect`.

## Build Offline Full Userscript

After generating `journal-data.json`, run:

```bash
python3 scripts/embed-data.py \
  --script pubmed-journal-metrics.user.js \
  --data journal-data.json \
  --output pubmed-journal-metrics.full.user.js
```

Install `pubmed-journal-metrics.full.user.js` in Tampermonkey. This is larger, but it does not need a remote data URL.

## Data Schema

```json
{
  "meta": {
    "updated": "2026-05-30"
  },
  "journals": [
    {
      "journal": "LANCET",
      "aliases": ["Lancet", "The Lancet"],
      "issn": ["0140-6736", "1474-547X"],
      "if": "98.4",
      "jcr": "Q1",
      "cas": "1",
      "casCategory": "医学",
      "top": true,
      "review": false,
      "warning": ""
    }
  ]
}
```

Matching priority is ISSN first on article pages, then journal title and PubMed abbreviation. Search result pages usually expose only the abbreviated journal citation, so `--pubmed-abb` is strongly recommended.

## Notes

- The script is limited to `https://pubmed.ncbi.nlm.nih.gov/*`.
- It does not send article titles, PMIDs or search terms to any backend.
- JCR and CAS data licensing can be restrictive. Keep generated data for personal/internal use unless you have the right to redistribute it.
