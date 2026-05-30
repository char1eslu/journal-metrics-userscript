# Journal Metrics Userscript

Tampermonkey userscript for common academic and journal sites. It displays journal impact factor, JCR quartile, CAS partition, citation count, Top, Review and warning tags, then appends compact Unpaywall and Sci-Hub entries in the same metrics row.

## Files

- `journal-metrics.user.js`: install this in Tampermonkey.
- `journal-data.sample.json`: small sample data for local testing and schema reference.
- `scihub-domains.json`: ordered Sci-Hub candidate domain list loaded by the userscript.
- `scripts/build-data-from-showjcr.py`: converts ShowJCR CSV files into the JSON consumed by the userscript.
- `scripts/embed-data.py`: creates a full offline `.user.js` by embedding `journal-data.json`.
- `scripts/update-scihub-domains.py`: probes configured Sci-Hub candidate domains and keeps reachable domains first.

## Install

Recommended full offline install:

<https://raw.githubusercontent.com/char1eslu/journal-metrics-userscript/main/journal-metrics.full.user.js>

Lightweight install, with journal data loaded from `journal-data.json`:

<https://raw.githubusercontent.com/char1eslu/journal-metrics-userscript/main/journal-metrics.user.js>

Open either link in the browser, then let Tampermonkey install it. After installation, open a supported academic page such as PubMed, Nature, ScienceDirect or a journal DOI page.

The script includes a tiny built-in sample dataset, so several common journals will render immediately. For real use, use either the offline build or a hosted JSON file.

## Supported Sites

The script has dedicated PubMed search/article handling and generic metadata handling for many journal pages. Current match rules include PubMed, PMC, Nature, Science, SpringerLink, ScienceDirect, Cell, The Lancet, JAMA Network, Oxford Academic, Wiley, ACS, Taylor & Francis, SAGE, PLOS, BMJ, Frontiers, MDPI, bioRxiv, medRxiv, NEJM, AHA Journals, JCI, PNAS, eLife, PeerJ, IOPscience, Royal Society, ASM, APS and Karger.

Generic journal pages are matched through standard `citation_*`, `prism.*`, Dublin Core DOI/ISSN and journal-title metadata. If a page exposes DOI but no journal metadata, only the Sci-Hub entry may appear.

## Citation Count

The `Cited` chip is loaded asynchronously from public APIs:

1. OpenAlex, using DOI or PMID.
2. Semantic Scholar, as a fallback.

Google Scholar is not used because it does not provide a stable official public API for this use case and direct scraping is fragile.

## Sci-Hub Domains

The userscript loads `scihub-domains.json` weekly and opens the first configured domain with the page DOI or PMID. A GitHub Actions workflow discovers fresh candidates every Monday, probes that newly discovered set, and keeps reachable domains first. Discovery currently scrapes these candidate sources:

- <https://lovescihub.wordpress.com>
- <https://sci-hub.shop>

There is no reliable official machine-readable Sci-Hub domain feed. The automated list is rebuilt from the discovery sources each week.

Temporary override: from the Tampermonkey menu, use `Journal Metrics: Set Sci-Hub domains` to set comma- or newline-separated domains for the current browser. Use `Journal Metrics: Clear manual Sci-Hub domains` to return to the remote weekly list.

## Unpaywall

When a DOI is available, the metrics row also includes an `Unpaywall` button built as:

```js
var unpaywallBaseUrl = "https://unpaywall.org/";
```

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
  --script journal-metrics.user.js \
  --data journal-data.json \
  --output journal-metrics.full.user.js
```

Install `journal-metrics.full.user.js` in Tampermonkey. This is larger, but it does not need a remote data URL.

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

- It does not send article titles, PMIDs or search terms to any backend.
- DOI or PMID is sent to OpenAlex and, if needed, Semantic Scholar to fetch citation counts.
- The Sci-Hub button is rendered only inside the metrics row created by this script; it does not add floating buttons or modify other page links.
- JCR and CAS data licensing can be restrictive. Keep generated data for personal/internal use unless you have the right to redistribute it.

## Acknowledgements

This project was implemented with reference to:

- [EasyPubMed](https://github.com/naivenaive/EasyPubMed): PubMed journal metrics UX, PubMed abbreviation mapping ideas and data-shaping references.
- [ShowJCR](https://github.com/hitfyd/ShowJCR): JCR/CAS/warning CSV source format and local query model.
- [Sci-Hub Button](https://greasyfork.org/zh-CN/scripts/370246-sci-hub-button): userscript pattern for opening a DOI/PMID through Sci-Hub.
- [OpenAlex](https://openalex.org/) and [Semantic Scholar](https://www.semanticscholar.org/product/api): public citation-count sources used for the `Cited` chip.

The implementation here is independent and scoped to this userscript.
