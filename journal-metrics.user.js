// ==UserScript==
// @name         Journal Metrics for Academic Sites
// @namespace    https://pubmed.ncbi.nlm.nih.gov/
// @version      0.2.2
// @description  Show journal impact factor, JCR quartile, CAS partition, citations, Unpaywall and Sci-Hub entries on academic pages.
// @author       charles_lu
// @match        https://pubmed.ncbi.nlm.nih.gov/*
// @match        https://www.ncbi.nlm.nih.gov/pmc/articles/*
// @match        https://pmc.ncbi.nlm.nih.gov/articles/*
// @match        https://europepmc.org/article/*
// @match        https://europepmc.org/search*
// @match        https://scholar.google.com/*
// @match        https://doi.org/10.*
// @match        https://dx.doi.org/10.*
// @match        https://search.crossref.org/*
// @match        https://www.semanticscholar.org/paper/*
// @match        https://openalex.org/works/*
// @match        https://*.nature.com/articles/*
// @match        https://www.science.org/doi/*
// @match        https://link.springer.com/article/*
// @match        https://link.springer.com/chapter/*
// @match        https://*.biomedcentral.com/articles/*
// @match        https://*.springeropen.com/articles/*
// @match        https://www.sciencedirect.com/science/article/*
// @match        https://www.cell.com/*/fulltext/*
// @match        https://www.thelancet.com/journals/*/article/*
// @match        https://jamanetwork.com/journals/*/fullarticle/*
// @match        https://academic.oup.com/*/article/*
// @match        https://onlinelibrary.wiley.com/doi/*
// @match        https://dl.acm.org/doi/*
// @match        https://ieeexplore.ieee.org/document/*
// @match        https://acsjournals.onlinelibrary.wiley.com/doi/*
// @match        https://pubs.acs.org/doi/*
// @match        https://pubs.rsc.org/*
// @match        https://pubs.aip.org/*/article/*
// @match        https://www.tandfonline.com/doi/*
// @match        https://journals.sagepub.com/doi/*
// @match        https://journals.plos.org/*/article*
// @match        https://bmj.com/content/*
// @match        https://*.bmj.com/content/*
// @match        https://www.frontiersin.org/journals/*/articles/*
// @match        https://www.mdpi.com/*
// @match        https://www.biorxiv.org/content/*
// @match        https://www.medrxiv.org/content/*
// @match        https://www.nejm.org/doi/*
// @match        https://www.ahajournals.org/doi/*
// @match        https://www.jci.org/articles/view/*
// @match        https://www.pnas.org/doi/*
// @match        https://journals.aps.org/*/abstract/*
// @match        https://elifesciences.org/articles/*
// @match        https://peerj.com/articles/*
// @match        https://iopscience.iop.org/article/*
// @match        https://royalsocietypublishing.org/doi/*
// @match        https://journals.asm.org/doi/*
// @match        https://journals.physiology.org/doi/*
// @match        https://karger.com/*/article/*
// @match        https://karger.com/Article/*
// @match        https://www.cambridge.org/core/journals/*/article/*
// @match        https://www.degruyter.com/document/doi/*
// @match        https://www.degruyterbrill.com/document/doi/*
// @match        https://www.emerald.com/insight/content/doi/*
// @match        https://www.worldscientific.com/doi/*
// @match        https://www.annualreviews.org/doi/*
// @match        https://www.journals.uchicago.edu/doi/*
// @match        https://www.jstage.jst.go.jp/article/*
// @match        https://journals.lww.com/*/fulltext/*
// @match        https://journals.lww.com/*/abstract/*
// @match        https://www.cochranelibrary.com/cdsr/doi/*
// @match        https://www.hindawi.com/journals/*/*/*
// @match        https://www.liebertpub.com/doi/*
// @match        https://www.atsjournals.org/doi/*
// @match        https://www.futuremedicine.com/doi/*
// @match        https://www.thieme-connect.com/products/ejournals/abstract/*
// @match        https://www.thieme-connect.com/products/ejournals/html/*
// @match        https://www.researchgate.net/publication/*
// @match        https://arxiv.org/abs/*
// @match        https://papers.ssrn.com/sol3/papers.cfm*
// @match        https://www.preprints.org/manuscript/*
// @downloadURL  https://raw.githubusercontent.com/char1eslu/journal-metrics-userscript/main/journal-metrics.user.js
// @updateURL    https://raw.githubusercontent.com/char1eslu/journal-metrics-userscript/main/journal-metrics.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      raw.githubusercontent.com
// @connect      gist.githubusercontent.com
// @connect      api.openalex.org
// @connect      api.semanticscholar.org
// @connect      localhost
// @connect      127.0.0.1
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    embeddedData: null,
    // Replace this with your own raw GitHub/Gist URL after generating a full data file.
    dataUrl: "https://raw.githubusercontent.com/char1eslu/journal-metrics-userscript/main/journal-data.json",
    scihubDomainsUrl: "https://raw.githubusercontent.com/char1eslu/journal-metrics-userscript/main/scihub-domains.json",
    unpaywallBaseUrl: "https://unpaywall.org/",
    cacheKey: "journal-metrics:data:v1",
    cacheTimeKey: "journal-metrics:data-time:v1",
    scihubDomainsCacheKey: "journal-metrics:scihub-domains:v1",
    scihubDomainsCacheTimeKey: "journal-metrics:scihub-domains-time:v1",
    scihubManualDomainsKey: "journal-metrics:scihub-manual-domains:v1",
    citationsCacheKey: "journal-metrics:citations:v1",
    cacheMs: 7 * 24 * 60 * 60 * 1000,
    scihubCacheMs: 7 * 24 * 60 * 60 * 1000,
    citationsCacheMs: 7 * 24 * 60 * 60 * 1000,
    fallbackScihubDomains: ["https://sci-hub.ren", "https://sci-hub.ee", "https://sci-hub.shop", "https://sci-hub.al", "https://sci-hub.mk", "https://sci-hub.vg", "https://sci-hub.st"],
    fallbackData: {
      meta: {
        name: "Journal Metrics sample data",
        updated: "2026-05-30",
        source: "Sample records. Replace CONFIG.dataUrl with a full generated JSON file.",
      },
      journals: [
        {
          journal: "NATURE REVIEWS NEPHROLOGY",
          aliases: ["Nat Rev Nephrol", "Nature reviews nephrology"],
          issn: ["1759-5061", "1759-507X"],
          if: "34.5",
          jcr: "Q1",
          cas: "1",
          casCategory: "医学",
          top: true,
          review: true,
          warning: "",
        },
        {
          journal: "JOURNAL OF THE AMERICAN SOCIETY OF NEPHROLOGY",
          aliases: ["J Am Soc Nephrol", "Journal of the American Society of Nephrology"],
          issn: ["1046-6673", "1533-3450"],
          if: "14.8",
          jcr: "Q1",
          cas: "1",
          casCategory: "医学",
          top: true,
          review: false,
          warning: "",
        },
        {
          journal: "LANCET",
          aliases: ["Lancet", "The Lancet"],
          issn: ["0140-6736", "1474-547X"],
          if: "98.4",
          jcr: "Q1",
          cas: "1",
          casCategory: "医学",
          top: true,
          review: false,
          warning: "",
        },
        {
          journal: "BRITISH POULTRY SCIENCE",
          aliases: ["Br Poult Sci", "British poultry science"],
          issn: ["0007-1668", "1466-1799"],
          if: "1.8",
          jcr: "Q3",
          cas: "4",
          casCategory: "农林科学",
          top: false,
          review: false,
          warning: "",
        },
      ],
    },
  };

  const STATE = {
    data: null,
    indexes: null,
    scihubDomains: CONFIG.fallbackScihubDomains,
    processing: false,
  };

  const STYLE_ID = "pjm-style";
  const BADGE_CLASS = "pjm-metrics";

  function normalizeKey(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .replace(/\b(the|journal|revista|revue)\b/gi, " ")
      .replace(/[^a-z0-9]+/gi, " ")
      .trim()
      .replace(/\s+/g, " ")
      .toUpperCase();
  }

  function normalizeIssn(value) {
    const cleaned = String(value || "").toUpperCase().replace(/[^0-9X]/g, "");
    if (cleaned.length !== 8) return "";
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function parseJournalAbbrevFromCitation(citationText) {
    const text = String(citationText || "").replace(/\s+/g, " ").trim();
    const match = text.match(/^(.+?)\.\s+\d{4}\b/);
    return match ? match[1].trim() : text.split(".")[0].trim();
  }

  function normalizeDoi(value) {
    const match = String(value || "").match(/10\.\d{4,9}\/[^\s"'<>]+/i);
    if (!match) return "";
    return match[0]
      .replace(/^doi:\s*/i, "")
      .replace(/[).,;]+$/g, "")
      .trim();
  }

  function getMetaContent(...names) {
    for (const name of names) {
      const selector = [
        `meta[name="${cssEscape(name)}"]`,
        `meta[property="${cssEscape(name)}"]`,
      ].join(",");
      const value = document.querySelector(selector)?.content?.trim();
      if (value) return value;
    }
    return "";
  }

  function firstText(...values) {
    for (const value of values.flat()) {
      const text = String(value || "").replace(/\s+/g, " ").trim();
      if (text) return text;
    }
    return "";
  }

  function asArray(value) {
    return Array.isArray(value) ? value : value ? [value] : [];
  }

  function parseJsonLdObjects() {
    const objects = [];
    for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const parsed = JSON.parse(script.textContent || "");
        const stack = asArray(parsed);
        while (stack.length) {
          const item = stack.shift();
          if (!item || typeof item !== "object") continue;
          objects.push(item);
          if (Array.isArray(item["@graph"])) stack.push(...item["@graph"]);
          if (item.mainEntity) stack.push(...asArray(item.mainEntity));
        }
      } catch {
        // Ignore malformed structured data.
      }
    }
    return objects;
  }

  function getJsonLdArticleInfo() {
    const objects = parseJsonLdObjects();
    for (const item of objects) {
      const type = asArray(item["@type"]).join(" ").toLowerCase();
      const isArticle = /(article|scholarlyarticle|medicalscholarlyarticle|report)/.test(type);
      if (!isArticle && !item.isPartOf && !item.publication) continue;

      const container = item.isPartOf || item.publication || item.publisher || {};
      const journal = firstText(
        container.name,
        container.alternateName,
        item.journal,
        item.periodical,
        item.sourceOrganization?.name
      );
      const issn = firstText(container.issn, item.issn);
      const doi = normalizeDoi(firstText(item.identifier, item.doi, item.sameAs, item.url));
      if (journal || issn || doi) return { journal, issn, doi };
    }
    return {};
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return CSS.escape(value);
    return String(value).replace(/["\\]/g, "\\$&");
  }

  function getArticleDoi(root = document) {
    const jsonLdDoi = root === document ? getJsonLdArticleInfo().doi : "";
    if (jsonLdDoi) return jsonLdDoi;

    const metaDoi = getMetaContent(
      "citation_doi",
      "dc.Identifier",
      "dc.identifier",
      "DC.Identifier",
      "dc.identifier.doi",
      "prism.doi",
      "doi"
    );
    if (metaDoi) return normalizeDoi(metaDoi);

    const doiLink = root.querySelector?.('a[href*="doi.org/10."], a[href*="/doi/10."], a[href*="dx.doi.org/10."]');
    const hrefDoi = normalizeDoi(doiLink?.href || "");
    if (hrefDoi) return hrefDoi;

    const textDoi = normalizeDoi(root.textContent || "");
    return textDoi;
  }

  function getPubmedId(root = document) {
    const metaPmid = getMetaContent("citation_pmid");
    if (metaPmid) return String(metaPmid).trim();
    return root.querySelector?.(".docsum-pmid")?.textContent?.trim() || "";
  }

  function getScihubTarget(root = document) {
    return getArticleDoi(root) || getPubmedId(root);
  }

  function buildScihubUrl(target) {
    const cleanTarget = String(target || "").trim();
    if (!cleanTarget || !STATE.scihubDomains.length) return "";
    return `${STATE.scihubDomains[0]}/${encodeURI(cleanTarget)}`;
  }

  function buildUnpaywallUrl(target) {
    const doi = normalizeDoi(target);
    if (!doi) return "";
    return `${CONFIG.unpaywallBaseUrl}${encodeURI(doi)}`;
  }

  function citationCacheKey(target) {
    return String(target || "").trim().toLowerCase();
  }

  function getCitationCache() {
    try {
      return JSON.parse(GM_getValue(CONFIG.citationsCacheKey, "{}")) || {};
    } catch {
      return {};
    }
  }

  function setCitationCache(cache) {
    GM_setValue(CONFIG.citationsCacheKey, JSON.stringify(cache));
  }

  function buildOpenAlexUrl(target) {
    const doi = normalizeDoi(target);
    if (doi) {
      return `https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}?select=id,doi,cited_by_count`;
    }
    const pmid = String(target || "").trim();
    if (/^\d+$/.test(pmid)) {
      return `https://api.openalex.org/works?filter=pmid:${encodeURIComponent(pmid)}&select=id,doi,cited_by_count&per-page=1`;
    }
    return "";
  }

  function buildSemanticScholarUrl(target) {
    const doi = normalizeDoi(target);
    if (doi) {
      return `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(doi)}?fields=citationCount,externalIds,url`;
    }
    const pmid = String(target || "").trim();
    if (/^\d+$/.test(pmid)) {
      return `https://api.semanticscholar.org/graph/v1/paper/PMID:${encodeURIComponent(pmid)}?fields=citationCount,externalIds,url`;
    }
    return "";
  }

  async function fetchCitationCount(target) {
    const key = citationCacheKey(target);
    if (!key) return null;

    const cache = getCitationCache();
    const cached = cache[key];
    if (cached && Date.now() - cached.time < CONFIG.citationsCacheMs) return cached;

    const openAlexUrl = buildOpenAlexUrl(target);
    if (openAlexUrl) {
      try {
        const data = await loadJsonViaGm(openAlexUrl);
        const work = Array.isArray(data.results) ? data.results[0] : data;
        if (Number.isFinite(work?.cited_by_count)) {
          const result = { count: work.cited_by_count, source: "OpenAlex", time: Date.now() };
          cache[key] = result;
          setCitationCache(cache);
          return result;
        }
      } catch {
        // Fall through to Semantic Scholar.
      }
    }

    const semanticScholarUrl = buildSemanticScholarUrl(target);
    if (semanticScholarUrl) {
      try {
        const data = await loadJsonViaGm(semanticScholarUrl);
        if (Number.isFinite(data?.citationCount)) {
          const result = { count: data.citationCount, source: "Semantic Scholar", time: Date.now() };
          cache[key] = result;
          setCitationCache(cache);
          return result;
        }
      } catch {
        // Leave the citation chip in failed state.
      }
    }

    const result = { count: null, source: "", time: Date.now() };
    cache[key] = result;
    setCitationCache(cache);
    return result;
  }

  function loadJsonViaGm(url) {
    return new Promise((resolve, reject) => {
      if (!url || url.includes("YOUR_NAME/")) {
        reject(new Error("Data URL is not configured."));
        return;
      }
      GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout: 20000,
        onload(response) {
          if (response.status >= 200 && response.status < 300) {
            try {
              resolve(JSON.parse(response.responseText));
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error(`HTTP ${response.status}`));
          }
        },
        onerror: reject,
        ontimeout: () => reject(new Error("Timed out while loading journal data.")),
      });
    });
  }

  async function loadData() {
    if (CONFIG.embeddedData) return CONFIG.embeddedData;

    const now = Date.now();
    const cachedRaw = GM_getValue(CONFIG.cacheKey, "");
    const cachedTime = Number(GM_getValue(CONFIG.cacheTimeKey, 0));

    if (cachedRaw && now - cachedTime < CONFIG.cacheMs) {
      try {
        return JSON.parse(cachedRaw);
      } catch {
        // Fall through and reload.
      }
    }

    try {
      const remoteData = await loadJsonViaGm(CONFIG.dataUrl);
      GM_setValue(CONFIG.cacheKey, JSON.stringify(remoteData));
      GM_setValue(CONFIG.cacheTimeKey, String(now));
      return remoteData;
    } catch (error) {
      console.info("[Journal Metrics] Using fallback sample data:", error.message);
      if (cachedRaw) {
        try {
          return JSON.parse(cachedRaw);
        } catch {
          // Fall through to embedded sample data.
        }
      }
      return CONFIG.fallbackData;
    }
  }

  async function loadScihubDomains() {
    const manualRaw = GM_getValue(CONFIG.scihubManualDomainsKey, "");
    if (manualRaw) {
      try {
        return normalizeDomainList(JSON.parse(manualRaw));
      } catch {
        GM_setValue(CONFIG.scihubManualDomainsKey, "");
      }
    }

    const now = Date.now();
    const cachedRaw = GM_getValue(CONFIG.scihubDomainsCacheKey, "");
    const cachedTime = Number(GM_getValue(CONFIG.scihubDomainsCacheTimeKey, 0));

    if (cachedRaw && now - cachedTime < CONFIG.scihubCacheMs) {
      try {
        return normalizeDomainList(JSON.parse(cachedRaw));
      } catch {
        // Fall through and reload.
      }
    }

    try {
      const remoteData = await loadJsonViaGm(CONFIG.scihubDomainsUrl);
      const domains = normalizeDomainList(remoteData);
      GM_setValue(CONFIG.scihubDomainsCacheKey, JSON.stringify(domains));
      GM_setValue(CONFIG.scihubDomainsCacheTimeKey, String(now));
      return domains;
    } catch (error) {
      console.info("[Journal Metrics] Using fallback Sci-Hub domains:", error.message);
      if (cachedRaw) {
        try {
          return normalizeDomainList(JSON.parse(cachedRaw));
        } catch {
          // Fall through to embedded fallback domains.
        }
      }
      return CONFIG.fallbackScihubDomains;
    }
  }

  function normalizeDomainList(value) {
    const domains = Array.isArray(value) ? value : value?.domains;
    const normalized = unique((domains || []).map((domain) => {
      const text = String(domain || "").trim().replace(/\/+$/, "");
      if (!text) return "";
      return /^https?:\/\//i.test(text) ? text : `https://${text}`;
    }));
    return normalized.length ? normalized : CONFIG.fallbackScihubDomains;
  }

  function registerMenuCommands() {
    if (typeof GM_registerMenuCommand !== "function") return;

    GM_registerMenuCommand("Journal Metrics: Set Sci-Hub domains", () => {
      const current = STATE.scihubDomains.join(", ");
      const input = window.prompt("Sci-Hub domains, comma or newline separated. First domain is used first.", current);
      if (input === null) return;
      const domains = normalizeDomainList(input.split(/[\n,]+/));
      GM_setValue(CONFIG.scihubManualDomainsKey, JSON.stringify(domains));
      STATE.scihubDomains = domains;
      window.alert(`Sci-Hub domains updated:\n${domains.join("\n")}`);
    });

    GM_registerMenuCommand("Journal Metrics: Clear manual Sci-Hub domains", () => {
      GM_setValue(CONFIG.scihubManualDomainsKey, "");
      GM_setValue(CONFIG.scihubDomainsCacheTimeKey, "0");
      window.alert("Manual Sci-Hub domains cleared. Reload the page to use remote defaults.");
    });
  }

  function buildIndexes(data) {
    const byName = new Map();
    const byIssn = new Map();

    for (const record of data.journals || []) {
      const names = unique([
        record.journal,
        record.fullName,
        record.abbrev,
        ...(record.aliases || []),
      ]);
      for (const name of names) {
        const key = normalizeKey(name);
        if (key && !byName.has(key)) byName.set(key, record);
      }

      for (const issn of record.issn || []) {
        const key = normalizeIssn(issn);
        if (key && !byIssn.has(key)) byIssn.set(key, record);
      }
    }

    return { byName, byIssn };
  }

  function lookupJournal(query) {
    if (!query || !STATE.indexes) return null;
    const issn = normalizeIssn(query.issn);
    if (issn && STATE.indexes.byIssn.has(issn)) return STATE.indexes.byIssn.get(issn);

    const candidates = unique([query.journal, query.abbrev, ...(query.aliases || [])]);
    for (const candidate of candidates) {
      const key = normalizeKey(candidate);
      if (key && STATE.indexes.byName.has(key)) return STATE.indexes.byName.get(key);
    }

    return null;
  }

  function addStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${BADGE_CLASS} {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 5px;
        margin-top: 7px;
        color: #243b53;
        font-size: 12px;
        line-height: 1.4;
      }
      .${BADGE_CLASS}.pjm-inline {
        display: inline-flex;
        margin: 0 0 0 8px;
        vertical-align: middle;
      }
      .pjm-chip {
        display: inline-flex;
        align-items: center;
        min-height: 18px;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 1px 6px;
        background: #f8fafc;
        color: #334155;
        font-weight: 600;
        white-space: nowrap;
      }
      .pjm-chip strong {
        margin-right: 3px;
        color: #475569;
        font-weight: 700;
      }
      .pjm-q1, .pjm-b1 { border-color: #ef4444; background: #fff1f2; color: #991b1b; }
      .pjm-q2, .pjm-b2 { border-color: #f59e0b; background: #fffbeb; color: #92400e; }
      .pjm-q3, .pjm-b3 { border-color: #22c55e; background: #f0fdf4; color: #166534; }
      .pjm-q4, .pjm-b4 { border-color: #94a3b8; background: #f1f5f9; color: #475569; }
      .pjm-top { border-color: #2563eb; background: #eff6ff; color: #1d4ed8; }
      .pjm-warning { border-color: #dc2626; background: #fef2f2; color: #991b1b; }
      .pjm-cited { border-color: #7c3aed; background: #f5f3ff; color: #5b21b6; }
      .pjm-cited.pjm-loading { border-color: #c4b5fd; background: #faf5ff; color: #7e22ce; }
      .pjm-cited.pjm-failed { border-color: #cbd5e1; background: #f8fafc; color: #64748b; }
      .pjm-muted { color: #64748b; font-weight: 500; }
      .pjm-scihub {
        border-color: #0f766e;
        background: #ecfdf5;
        color: #0f766e;
        text-decoration: none !important;
      }
      .pjm-unpaywall {
        border-color: #d97706;
        background: #fff7ed;
        color: #9a3412;
        text-decoration: none !important;
      }
      .pjm-scihub:hover {
        background: #ccfbf1;
        color: #115e59;
      }
      .pjm-unpaywall:hover {
        background: #ffedd5;
        color: #7c2d12;
      }
      .pjm-panel {
        margin: 12px 0;
        padding: 8px 0;
        border-top: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;
      }
    `;
    document.head.appendChild(style);
  }

  function chip(label, value, className = "") {
    if (value === undefined || value === null || value === "") return "";
    return `<span class="pjm-chip ${className}"><strong>${escapeHtml(label)}</strong>${escapeHtml(value)}</span>`;
  }

  function scihubChip(target) {
    const url = buildScihubUrl(target);
    if (!url) return "";
    return `<a class="pjm-chip pjm-scihub" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" title="Open via Sci-Hub">${escapeHtml("Sci-Hub")}</a>`;
  }

  function unpaywallChip(target) {
    const url = buildUnpaywallUrl(target);
    if (!url) return "";
    return `<a class="pjm-chip pjm-unpaywall" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" title="Open via Unpaywall">${escapeHtml("Unpaywall")}</a>`;
  }

  function citedChip(target) {
    if (!target) return "";
    return `<span class="pjm-chip pjm-cited pjm-loading" data-pjm-citation-target="${escapeHtml(target)}" title="Citation count from OpenAlex or Semantic Scholar"><strong>Cited</strong>...</span>`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function quartileClass(value) {
    const match = String(value || "").match(/[Qq]([1-4])/);
    return match ? `pjm-q${match[1]}` : "";
  }

  function casClass(value) {
    const match = String(value || "").match(/[B区\s]*([1-4])/i);
    return match ? `pjm-b${match[1]}` : "";
  }

  function renderMetrics(record, options = {}) {
    const parts = [];
    if (record) {
      const casValue = record.cas ? `${record.cas}区` : "";
      parts.push(
        chip("IF", record.if || record.impactFactor || record.IF),
        chip("JCR", record.jcr || record.jcrQuartile, quartileClass(record.jcr || record.jcrQuartile)),
        chip("CAS", casValue, casClass(casValue))
      );

      if (record.casCategory) parts.push(chip("大类", record.casCategory));
      if (record.top === true || String(record.top).toLowerCase() === "true" || record.top === "是") {
        parts.push(chip("", "Top", "pjm-top"));
      }
      if (record.review === true || String(record.review).toLowerCase() === "true" || record.review === "是") {
        parts.push(chip("", "Review"));
      }
      if (record.warning) {
        parts.push(chip("预警", record.warning, "pjm-warning"));
      }
    }
    if (options.scihubTarget) {
      parts.push(citedChip(options.scihubTarget));
      parts.push(unpaywallChip(options.scihubTarget));
      parts.push(scihubChip(options.scihubTarget));
    }

    const source = options.showSource && STATE.data?.meta?.updated
      ? `<span class="pjm-muted">data ${escapeHtml(STATE.data.meta.updated)}</span>`
      : "";

    return `<span class="${BADGE_CLASS}${options.inline ? " pjm-inline" : ""}" title="${escapeHtml(record?.journal || "")}">${parts.join("")}${source}</span>`;
  }

  function insertMetrics(target, record, options = {}) {
    if (!target || target.querySelector?.(`.${BADGE_CLASS}`)) return;
    if (!record && !options.scihubTarget) return;
    const wrapper = document.createElement(options.inline ? "span" : "div");
    wrapper.innerHTML = renderMetrics(record, options);
    const metrics = wrapper.firstElementChild;
    if (!metrics) return;

    if (options.after) {
      target.insertAdjacentElement("afterend", metrics);
    } else if (options.prepend) {
      target.prepend(metrics);
    } else {
      target.append(metrics);
    }
    hydrateCitationChips(metrics);
  }

  function hydrateCitationChips(root = document) {
    const chips = root.querySelectorAll?.(".pjm-cited[data-pjm-citation-target]") || [];
    for (const chipNode of chips) {
      if (chipNode.dataset.pjmCitationLoaded === "1") continue;
      chipNode.dataset.pjmCitationLoaded = "1";
      const target = chipNode.dataset.pjmCitationTarget;
      fetchCitationCount(target).then((result) => {
        if (!result || !Number.isFinite(result.count)) {
          chipNode.classList.remove("pjm-loading");
          chipNode.classList.add("pjm-failed");
          chipNode.innerHTML = "<strong>Cited</strong>NA";
          chipNode.title = "Citation count unavailable";
          return;
        }
        chipNode.classList.remove("pjm-loading", "pjm-failed");
        chipNode.innerHTML = `<strong>Cited</strong>${escapeHtml(String(result.count))}`;
        chipNode.title = `Citation count from ${result.source}`;
      }).catch(() => {
        chipNode.classList.remove("pjm-loading");
        chipNode.classList.add("pjm-failed");
        chipNode.innerHTML = "<strong>Cited</strong>NA";
        chipNode.title = "Citation count unavailable";
      });
    }
  }

  function processSearchResults() {
    const articles = document.querySelectorAll("article.full-docsum, .docsum-content");
    for (const article of articles) {
      if (article.dataset.pjmProcessed === "1") continue;
      article.dataset.pjmProcessed = "1";

      const journalNode =
        article.querySelector(".docsum-journal-citation.full-journal-citation") ||
        article.querySelector(".docsum-journal-citation.short-journal-citation") ||
        article.querySelector(".docsum-citation");

      const abbrev = parseJournalAbbrevFromCitation(journalNode?.textContent || "");
      const record = lookupJournal({ abbrev, journal: abbrev });
      const scihubTarget = getScihubTarget(article);
      const citationContainer = article.querySelector(".docsum-citation") || journalNode?.parentElement || article;
      insertMetrics(citationContainer, record, { scihubTarget });
    }
  }

  function processGoogleScholarResults() {
    if (location.hostname !== "scholar.google.com") return;
    const results = document.querySelectorAll(".gs_r.gs_or");
    for (const result of results) {
      if (result.dataset.pjmProcessed === "1") continue;
      const meta = result.querySelector(".gs_a")?.textContent || "";
      const doi = getArticleDoi(result);
      const chunks = meta.split(/\s+-\s+/).map((part) => part.trim()).filter(Boolean);
      const journal = chunks.length > 1 ? chunks[1].replace(/\s*,?\s*\d{4}.*$/, "") : "";
      const record = lookupJournal({ journal, abbrev: journal });
      if (!record && !doi) continue;
      result.dataset.pjmProcessed = "1";
      const target = result.querySelector(".gs_ri") || result;
      insertMetrics(target, record, { scihubTarget: doi });
    }
  }

  function processGenericResultLists() {
    const listHosts = [
      "search.crossref.org",
      "www.semanticscholar.org",
      "openalex.org",
      "europepmc.org",
      "www.researchgate.net",
    ];
    if (!listHosts.includes(location.hostname)) return;

    const selectors = [
      ".result-list-item",
      ".search-result",
      ".search-results-item",
      ".paper",
      ".cl-paper-row",
      ".result",
      ".item",
    ];
    const items = document.querySelectorAll(selectors.join(","));
    for (const item of items) {
      if (item.dataset.pjmProcessed === "1") continue;
      const doi = getArticleDoi(item);
      const journal = firstText(
        item.querySelector("[data-test='journal-title']")?.textContent,
        item.querySelector(".journal-title")?.textContent,
        item.querySelector(".publication-title")?.textContent,
        item.querySelector(".venue")?.textContent,
        item.querySelector(".journal")?.textContent
      );
      const record = lookupJournal({ journal, abbrev: journal });
      if (!record && !doi) continue;
      item.dataset.pjmProcessed = "1";
      insertMetrics(item, record, { scihubTarget: doi });
    }
  }

  function getArticlePageQuery() {
    const journalTitle = document.querySelector('meta[name="citation_journal_title"]')?.content || "";
    const publisherAbbrev = document.querySelector('meta[name="citation_publisher"]')?.content || "";
    const issn = document.querySelector('meta[name="citation_issn"]')?.content || "";
    const actionButton = document.querySelector(".journal-actions-trigger");
    const ariaJournal = (actionButton?.getAttribute("aria-label") || "").replace(/^Toggle dropdown menu for journal\s+/i, "");
    return {
      journal: journalTitle || ariaJournal,
      abbrev: publisherAbbrev,
      issn,
      aliases: [ariaJournal],
    };
  }

  function processArticlePage() {
    const record = lookupJournal(getArticlePageQuery());
    if (!record) return;

    const citationBlocks = document.querySelectorAll(".article-citation");
    for (const block of citationBlocks) {
      if (block.dataset.pjmProcessed === "1") continue;
      block.dataset.pjmProcessed = "1";
      insertMetrics(block, record, { showSource: true, scihubTarget: getScihubTarget(block) });
    }

    const shortCitation = document.querySelector(".short-citation .citation-journal");
    if (shortCitation && shortCitation.dataset.pjmProcessed !== "1") {
      shortCitation.dataset.pjmProcessed = "1";
      insertMetrics(shortCitation, record, { inline: true, after: true, scihubTarget: getScihubTarget(document) });
    }
  }

  function getGenericArticleQuery() {
    const jsonLd = getJsonLdArticleInfo();
    const journal = getMetaContent(
      "citation_journal_title",
      "citation_journal_abbrev",
      "prism.publicationName",
      "prism.publicationname",
      "prism.journal",
      "dc.Source",
      "dc.source",
      "dc.relation.ispartof",
      "journal_title",
      "og:site_name"
    );
    const abbrev = getMetaContent("citation_journal_abbrev", "citation_journal_abbreviation");
    const issn = getMetaContent("citation_issn", "prism.issn", "dc.ISSN", "dc.issn", "eprints.issn");
    return {
      journal: journal || jsonLd.journal,
      abbrev,
      issn: issn || jsonLd.issn,
      aliases: [getMetaContent("citation_publisher"), getMetaContent("prism.publisher")],
    };
  }

  function findGenericInsertTarget() {
    const candidates = [
      "h1",
      ".c-article-header",
      ".article-header",
      ".article__header",
      ".hlFld-Title",
      ".article-info",
      ".Publication-content",
      "main",
    ];
    for (const selector of candidates) {
      const node = document.querySelector(selector);
      if (node) return node;
    }
    return document.body;
  }

  function processGenericArticlePage() {
    if (location.hostname === "pubmed.ncbi.nlm.nih.gov") return;
    if (document.querySelector("article.full-docsum, .docsum-content, .article-citation")) return;
    if (document.body.dataset.pjmGenericProcessed === "1") return;

    const query = getGenericArticleQuery();
    const record = lookupJournal(query);
    const scihubTarget = getScihubTarget(document);
    if (!record && !scihubTarget) return;

    document.body.dataset.pjmGenericProcessed = "1";
    const panel = document.createElement("div");
    panel.className = "pjm-panel";
    findGenericInsertTarget().insertAdjacentElement("afterend", panel);
    insertMetrics(panel, record, { showSource: true, scihubTarget });
  }

  function processPage() {
    if (!STATE.indexes || STATE.processing) return;
    STATE.processing = true;
    try {
      addStyle();
      processSearchResults();
      processGoogleScholarResults();
      processGenericResultLists();
      processArticlePage();
      processGenericArticlePage();
    } finally {
      STATE.processing = false;
    }
  }

  function observePageChanges() {
    const observer = new MutationObserver(() => {
      window.clearTimeout(observePageChanges.timer);
      observePageChanges.timer = window.setTimeout(processPage, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  async function main() {
    registerMenuCommands();
    const [data, scihubDomains] = await Promise.all([loadData(), loadScihubDomains()]);
    STATE.data = data;
    STATE.scihubDomains = scihubDomains;
    STATE.indexes = buildIndexes(STATE.data);
    processPage();
    observePageChanges();
  }

  main().catch((error) => {
    console.error("[Journal Metrics] Failed to initialize:", error);
  });
})();
