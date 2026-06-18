# Journal Metrics Userscript

Tampermonkey userscript for PubMed, Google Scholar and common academic journal pages. It adds compact journal metrics, citation counts, OA/PDF status, Sci-Hub, PubPeer, filtering and export tools directly inside literature search results and article pages.

## Install

Recommended full offline install:

<https://raw.githubusercontent.com/char1eslu/journal-metrics-userscript/main/journal-metrics.full.user.js>

Lightweight install, with journal data loaded from `journal-data.json`:

<https://raw.githubusercontent.com/char1eslu/journal-metrics-userscript/main/journal-metrics.user.js>

Open either link in the browser and let Tampermonkey install the script. Tampermonkey detects updates through the userscript `@version` field.

## What It Shows

The metrics row is intentionally compact. It can show:

- `IF`: journal impact factor from the local journal data file.
- `JCR Q1-Q4`: JCR quartile.
- `CAS 1区-4区`: Chinese Academy of Sciences journal partition.
- `大类`: CAS broad subject category.
- `Top`: CAS top-journal flag.
- `Review`: journal review flag when present in the data.
- `预警`: warning tag when present in the data.
- `Cited <count>`: citation count. Hover the chip to see the source.
- `PDF`, `Repository`, `OA`, `No OA` or `Unknown`: OA status from Unpaywall.
- `Sci-Hub`: DOI/PMID entry through the configured Sci-Hub domain.
- `PubPeer`: PubPeer search link for DOI/PMID-backed articles.
- `Correction`, `Retraction`, `Update`: Crossref update/retraction relation signals.
- PubMed risk status when NCBI reports retraction-related publication metadata.

Click an IF/JCR/CAS chip to open a journal-detail popup with the matched journal, ISSN, data date and match route. Low-confidence page-text matches also show a `Check` chip.

When a result has DOI/title/citation data but no journal match, a small `Fix` chip can appear. Use it to map the page's journal text to a known journal name, abbreviation or ISSN. The alias is stored locally in Tampermonkey and can be cleared from Settings.

## Supported Sites

The script has dedicated handlers for:

- PubMed search results and article pages
- PMC articles
- Google Scholar result pages
- Crossref Search-style result pages
- Generic DOI/article pages that expose standard metadata

The generic article-page matcher reads standard metadata such as `citation_*`, `prism.*`, Dublin Core, JSON-LD DOI/ISSN fields, DOI links and visible DOI text. It has been tuned for many publisher and literature-discovery sites, including Europe PMC, DOI.org, Semantic Scholar, OpenAlex, Web of Science, Scopus, Dimensions, Lens, PubPeer, Connected Papers, ResearchRabbit, Litmaps, Nature, Science, Springer/SpringerOpen/BMC, ScienceDirect, Cell, The Lancet, JAMA Network, Oxford Academic, Wiley, ACM, IEEE Xplore, ACS, RSC, AIP, Taylor & Francis, SAGE, PLOS, BMJ, Frontiers, MDPI, bioRxiv, medRxiv, NEJM, AHA Journals, JCI, PNAS, APS, eLife, PeerJ, IOPscience, Royal Society, ASM, APS Physiology, Karger, Cambridge Core, De Gruyter/De Gruyter Brill, Emerald, World Scientific, Annual Reviews, University of Chicago Press, J-STAGE, LWW, Cochrane Library, Hindawi, Mary Ann Liebert, ATS Journals, Future Medicine, Thieme, ResearchGate, arXiv, SSRN and Preprints.org.

If a page exposes a DOI but no journal metadata, the row may only show citation, OA/PDF and Sci-Hub entries. When a title is available, the script can try Crossref/OpenAlex title resolution and fill journal metrics only when the title match is high-confidence.

## Result-Page Tools

On search result pages, the toolbar can:

- highlight or hide non-matching records
- filter by JCR Q1
- filter by CAS 1区
- filter by Top journal
- filter by minimum impact factor
- export visible or filtered results as RIS/BibTeX
- copy DOI, PMID, CSV, Markdown table or compact citation text
- export selected records as RIS, BibTeX, CSV or Markdown

PubMed uses its native result checkboxes for selected exports. Google Scholar gets a small checkbox added to each result.

Extra commands are grouped under `More` where possible to keep the main toolbar small. Floating UI surfaces such as `More`, settings, journal-detail popups and the article-page shortcut bar are rendered inside a Shadow DOM container to reduce interference from publisher CSS.

## Settings

Use `Journal Metrics: Settings` from the Tampermonkey menu or the toolbar `Settings` button. The settings panel can toggle:

- citation counts
- OA/PDF status
- Sci-Hub button
- PubPeer button
- Crossref status chips
- PubMed risk status
- article-page floating bar
- PubMed abstracts/snippets

The same panel shows current journal data date, Sci-Hub domain state, cache counts and manual alias count. It can refresh journal/Sci-Hub data and clear citation, OA, Crossref, risk and manual-alias caches.

## Citation Counts

The citation chip always displays as `Cited <count>`. Hover the chip to see the source:

1. Google Scholar visible citation count on Google Scholar result pages.
2. NIH iCite when a PMID is available, especially on PubMed.
3. OpenAlex by DOI or PMID.
4. Semantic Scholar by DOI or PMID as a fallback.

Google Scholar has no stable official public API for this use case. This script only reads the citation count already rendered on the current Google Scholar result card. Citation counts can differ across Google Scholar, NIH iCite, OpenAlex and Semantic Scholar because coverage, deduplication and update schedules differ.

## OA / PDF

When a DOI is available, the script checks Unpaywall and changes the OA chip to:

- `PDF`: a direct OA PDF URL is available.
- `Repository`: the best OA location is a repository copy.
- `OA`: an OA landing page is available.
- `No OA`: Unpaywall returned a valid response but did not find an OA copy.
- `Unknown`: lookup failed or timed out.

The fallback Unpaywall landing URL is:

```js
var unpaywallBaseUrl = "https://unpaywall.org/";
```

## Sci-Hub Domains

The userscript loads `scihub-domains.json` weekly and opens the first configured domain with the article DOI or PMID. A GitHub Actions workflow runs every Monday and updates the domain order when the discovered candidate set changes.

Current discovery sources:

- <https://lovescihub.wordpress.com>
- <https://sci-hub.shop>

There is no reliable official machine-readable Sci-Hub domain feed. The automated list is therefore best-effort only.

Manual override: from the Tampermonkey menu, use `Journal Metrics: Set Sci-Hub domains` to set comma- or newline-separated domains for the current browser. Use `Journal Metrics: Clear manual Sci-Hub domains` to return to the remote weekly list.

Legal note: the script only builds a link from the DOI/PMID to the configured domain. It does not host articles or bypass publisher pages itself. Users are responsible for complying with local law and institutional policy.

## Data Sources And Local Data

This repository includes a compact journal metric data file for convenience, but the code is designed so you can build and host your own `journal-data.json`.

The data schema supports:

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
      "if": "88.5",
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

Matching priority is ISSN first, then journal title, aliases and PubMed abbreviation. Search-result pages often expose only abbreviated journal citations, so adding PubMed abbreviation aliases is strongly recommended.

## Build Journal Data

The helper script can convert ShowJCR CSV files into the JSON consumed by the userscript:

```bash
python3 scripts/build-data-from-showjcr.py \
  --showjcr-dir /path/to/ShowJCR/中科院分区表及JCR原始数据文件 \
  --pubmed-abb /path/to/EasyPubMed/dist/data/pubmed_abb_data.json \
  --output journal-data.json
```

Then either host `journal-data.json` yourself and update:

```js
dataUrl: "https://raw.githubusercontent.com/YOUR_NAME/YOUR_REPO/main/journal-data.json";
```

or build a full offline userscript:

```bash
python3 scripts/embed-data.py \
  --script journal-metrics.user.js \
  --data journal-data.json \
  --output journal-metrics.full.user.js
```

Install `journal-metrics.full.user.js` if you want the data embedded directly in the userscript.

## Files

- `journal-metrics.user.js`: lightweight userscript, loads journal data from `CONFIG.dataUrl`.
- `journal-metrics.full.user.js`: full userscript with embedded journal data.
- `journal-data.json`: compact journal metrics data consumed by the script.
- `journal-data.sample.json`: small sample data for local testing and schema reference.
- `scihub-domains.json`: ordered Sci-Hub candidate domain list.
- `scripts/build-data-from-showjcr.py`: converts ShowJCR CSV exports into `journal-data.json`.
- `scripts/embed-data.py`: embeds `journal-data.json` into the userscript.
- `scripts/update-scihub-domains.py`: discovers and probes Sci-Hub domains.

## Privacy And Network Requests

The script does not use a custom tracking backend. It runs in the browser and calls public services directly.

Depending on the page and enabled features, it may send:

- DOI to Unpaywall, Crossref, OpenAlex, Semantic Scholar, PubPeer or Sci-Hub.
- PMID to NIH iCite, NCBI E-Utilities, OpenAlex or Semantic Scholar.
- Article title to Crossref or OpenAlex when DOI/journal metadata is missing.
- Sci-Hub candidate domains to the browser when opening Sci-Hub links.

The browser, Tampermonkey and those third-party services may have their own logging and terms.

## License And Third-Party Rights

Original source code and documentation authored in this repository are released under the MIT License. See [LICENSE](LICENSE).

The MIT license does not grant rights to third-party datasets, generated journal metric data, publisher content, external API data, or source code from referenced projects. In particular:

- JCR, CAS partition and warning-list data may have restrictive licensing or redistribution terms. Do not redistribute generated data unless you have the right to do so.
- `journal-data.json` and `journal-metrics.full.user.js` can contain generated journal metric data. Treat those data portions separately from the MIT-licensed source code.
- The script does not copy code from Sci-Hub Button, ShowJCR or EasyPubMed. They are acknowledged as references or data-format inspirations only.
- External services such as Unpaywall, Crossref, OpenAlex, Semantic Scholar, NIH iCite, NCBI and PubPeer retain their own data licenses, terms and attribution requirements.

This section is a practical project notice, not legal advice. If you redistribute a fork or a bundled data file, review the data sources and upstream licenses first.

## Acknowledgements

This project was implemented with reference to:

- [EasyPubMed](https://github.com/naivenaive/EasyPubMed): PubMed journal metrics UX, PubMed abbreviation mapping ideas and data-shaping references. EasyPubMed is published with an MIT license.
- [ShowJCR](https://github.com/hitfyd/ShowJCR): JCR/CAS/warning CSV source format and local query model. ShowJCR is published with a GPL-3.0 license, and its bundled data sources should be handled under their own terms.
- [Sci-Hub Button](https://greasyfork.org/en/scripts/370246-sci-hub-button): userscript pattern for opening a DOI/PMID through Sci-Hub. Its Greasy Fork page lists license as `N/A`, so this project does not reuse its source code.
- [Unpaywall](https://unpaywall.org/), [Crossref](https://www.crossref.org/), [OpenAlex](https://openalex.org/), [Semantic Scholar](https://www.semanticscholar.org/product/api), [NIH iCite](https://icite.od.nih.gov/), [NCBI E-Utilities](https://www.ncbi.nlm.nih.gov/books/NBK25501/) and [PubPeer](https://pubpeer.com/) for public metadata, OA, citation and discussion lookups.

The implementation here is independent and scoped to this userscript.
