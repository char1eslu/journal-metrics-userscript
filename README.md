# Journal Metrics Userscript

Tampermonkey userscript for common academic and journal sites. It displays journal impact factor, JCR quartile, CAS partition, citation count, Top, Review and warning tags, then appends compact OA/PDF, Sci-Hub and export/filter tools.

## Files

- `journal-metrics.user.js`: install this in Tampermonkey.
- `journal-data.sample.json`: small sample data for local testing and schema reference.
- `scihub-domains.json`: ordered Sci-Hub candidate domain list loaded by the userscript.
- `scripts/build-data-from-showjcr.py`: converts ShowJCR CSV files into the JSON consumed by the userscript.
- `scripts/embed-data.py`: creates a full offline `.user.js` by embedding `journal-data.json`.
- `scripts/update-scihub-domains.py`: discovers Sci-Hub candidates from configured sources and keeps reachable domains first.

## Install

Recommended full offline install:

<https://raw.githubusercontent.com/char1eslu/journal-metrics-userscript/main/journal-metrics.full.user.js>

Lightweight install, with journal data loaded from `journal-data.json`:

<https://raw.githubusercontent.com/char1eslu/journal-metrics-userscript/main/journal-metrics.user.js>

Open either link in the browser, then let Tampermonkey install it. After installation, open a supported academic page such as PubMed, Nature, ScienceDirect or a journal DOI page.

The script includes a tiny built-in sample dataset, so several common journals will render immediately. For real use, use either the offline build or a hosted JSON file.

## Supported Sites

The script has dedicated PubMed and Google Scholar result handling, plus generic metadata handling for many journal pages. Current match rules include PubMed/PMC, Europe PMC, Google Scholar, DOI.org, Crossref Search, Semantic Scholar, OpenAlex, Web of Science, Scopus, Dimensions, Lens, PubPeer, Connected Papers, ResearchRabbit, Litmaps, Nature, Science, Springer/SpringerOpen/BMC, ScienceDirect, Cell, The Lancet, JAMA Network, Oxford Academic, Wiley, ACM, IEEE Xplore, ACS, RSC, AIP, Taylor & Francis, SAGE, PLOS, BMJ, Frontiers, MDPI, bioRxiv, medRxiv, NEJM, AHA Journals, JCI, PNAS, APS, eLife, PeerJ, IOPscience, Royal Society, ASM, APS Physiology, Karger, Cambridge Core, De Gruyter/De Gruyter Brill, Emerald, World Scientific, Annual Reviews, University of Chicago Press, J-STAGE, LWW abstract/fulltext pages, Cochrane Library, Hindawi, Mary Ann Liebert, ATS Journals, Future Medicine, Thieme, ResearchGate, arXiv, SSRN and Preprints.org.

Generic journal pages are matched through standard `citation_*`, `prism.*`, Dublin Core, JSON-LD DOI/ISSN and journal-title metadata. If a page exposes DOI but no journal metadata, only the `Cited`, Unpaywall and Sci-Hub entries may appear.

## Result Tools

On supported result pages, the toolbar can highlight or hide records by:

- JCR Q1
- CAS 1区
- Top journal
- Minimum impact factor

The same toolbar can export detected page items as RIS or BibTeX. DOI-backed exports try citation content negotiation first and fall back to locally generated RIS or BibTeX when needed.

Extra result-page tools are grouped under `More` to keep the toolbar compact:

- `DOI`: copy visible DOI values.
- `Cite`: copy compact citation text.
- `Abs`: show or hide PubMed snippets/abstracts when PubMed has rendered them.
- `Selected RIS/BibTeX/CSV/Markdown`: export selected records. PubMed uses its native result checkboxes; Google Scholar gets a small checkbox per result.

The Tampermonkey menu also includes filtered RIS/BibTeX export, DOI/PMID lists, CSV and Markdown table export.

`Journal Metrics: Settings` opens a compact settings panel for toggling citation counts, OA, Sci-Hub, PubPeer, Crossref status chips, PubMed risk chips, PubMed abstracts and the article-page floating bar. The same panel can clear journal data, citation, OA and Crossref caches.

Floating UI surfaces such as `More`, `Settings`, journal-detail popups and the article-page shortcut bar are rendered inside an isolated Shadow DOM container to avoid publisher CSS overriding script controls.

## Citation Count

The citation chip always displays as `Cited <count>` to keep the metrics row compact. Hover over the chip to see the source:

1. Google Scholar visible citation count on Google Scholar result pages.
2. NIH iCite, used first when a PMID is available, especially on PubMed.
3. OpenAlex, using DOI or PMID.
4. Semantic Scholar, as a fallback.

Google Scholar still has no stable official public API for this use case, so the script only reads the citation count that Google Scholar has already rendered on the current result card. On other sites, citation counts may differ because each source has different coverage and deduplication.

## Integrity Signals

PubMed-backed items are checked against NCBI ESummary for publication-status warnings. A red status chip appears only when PubMed reports a retraction, retraction notice, or expression of concern. DOI-backed items also get a compact PubPeer search entry.

Crossref update metadata is checked for DOI-backed items and can surface `Correction`, `Retraction`, or `Update` chips when Crossref reports a relation. When a result has a title but no DOI, the script can resolve the DOI through Crossref only when the returned title is a high-confidence match.

Journal metric hover text includes the matching route, such as ISSN, journal title, abbreviation, or low-confidence page-text matching. Click an IF/JCR/CAS chip to open a copyable journal-detail popup. Low-confidence page-text matches also show a `Check` chip.

Article pages can show a small floating bar with OA, Sci-Hub, Cite and PubPeer shortcuts when the corresponding settings are enabled.

## Sci-Hub Domains

The userscript loads `scihub-domains.json` weekly and opens the first configured domain with the page DOI or PMID. A GitHub Actions workflow discovers fresh candidates every Monday, probes that newly discovered set, and keeps reachable domains first. Discovery currently scrapes these candidate sources:

- <https://lovescihub.wordpress.com>
- <https://sci-hub.shop>

There is no reliable official machine-readable Sci-Hub domain feed. The automated list is rebuilt from the discovery sources each week.

Temporary override: from the Tampermonkey menu, use `Journal Metrics: Set Sci-Hub domains` to set comma- or newline-separated domains for the current browser. Use `Journal Metrics: Clear manual Sci-Hub domains` to return to the remote weekly list.

## Unpaywall

When a DOI is available, the metrics row also includes an Unpaywall-based OA button. It checks the Unpaywall API and changes the chip to `PDF`, `Repository`, `OA`, or `No OA`. `No OA` means Unpaywall returned a valid result but found no OA copy; `Unknown` means the lookup failed or was unavailable. The base fallback URL is:

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

- It does not use a custom tracking backend. Public APIs are called directly from the browser.
- PMID is sent to NIH iCite when available. DOI or PMID is sent to OpenAlex and, if needed, Semantic Scholar to fetch citation counts. On Google Scholar, the article title may be sent to OpenAlex to resolve the journal and DOI.
- The Sci-Hub button is rendered only inside the metrics row created by this script; it does not add floating buttons or modify other page links.
- JCR and CAS data licensing can be restrictive. Keep generated data for personal/internal use unless you have the right to redistribute it.

## Acknowledgements

This project was implemented with reference to:

- [EasyPubMed](https://github.com/naivenaive/EasyPubMed): PubMed journal metrics UX, PubMed abbreviation mapping ideas and data-shaping references.
- [ShowJCR](https://github.com/hitfyd/ShowJCR): JCR/CAS/warning CSV source format and local query model.
- [Sci-Hub Button](https://greasyfork.org/zh-CN/scripts/370246-sci-hub-button): userscript pattern for opening a DOI/PMID through Sci-Hub.
- [NIH iCite](https://icite.od.nih.gov/), [OpenAlex](https://openalex.org/) and [Semantic Scholar](https://www.semanticscholar.org/product/api): public citation-count sources used for the citation chip.

The implementation here is independent and scoped to this userscript.
