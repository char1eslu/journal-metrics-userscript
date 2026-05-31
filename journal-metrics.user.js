// ==UserScript==
// @name         Journal Metrics for Academic Sites
// @namespace    https://pubmed.ncbi.nlm.nih.gov/
// @version      0.3.29
// @description  Show journal impact factor, JCR quartile, CAS partition, citations, Unpaywall and Sci-Hub entries on academic pages.
// @author       charles_lu
// @license      MIT
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
// @match        https://www.semanticscholar.org/search*
// @match        https://openalex.org/works/*
// @match        https://openalex.org/search*
// @match        https://www.webofscience.com/wos/*
// @match        https://www.scopus.com/*
// @match        https://www.dimensions.ai/*
// @match        https://app.dimensions.ai/*
// @match        https://www.lens.org/*
// @match        https://pubpeer.com/*
// @match        https://www.connectedpapers.com/*
// @match        https://www.researchrabbit.ai/*
// @match        https://www.litmaps.com/*
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
// @match        https://journals.lww.com/*/Fulltext/*
// @match        https://journals.lww.com/*/Abstract/*
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
// @grant        GM_setClipboard
// @connect      raw.githubusercontent.com
// @connect      gist.githubusercontent.com
// @connect      api.openalex.org
// @connect      api.semanticscholar.org
// @connect      icite.od.nih.gov
// @connect      api.unpaywall.org
// @connect      eutils.ncbi.nlm.nih.gov
// @connect      api.crossref.org
// @connect      doi.org
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
    manualAliasesKey: "journal-metrics:manual-aliases:v1",
    citationsCacheKey: "journal-metrics:citations:v2",
    unpaywallCacheKey: "journal-metrics:unpaywall:v2",
    riskCacheKey: "journal-metrics:risk:v1",
    crossrefCacheKey: "journal-metrics:crossref:v2",
    settingsKey: "journal-metrics:settings:v1",
    filterStateKey: "journal-metrics:filters:v1",
    unpaywallEmail: "char1eslu@users.noreply.github.com",
    cacheMs: 7 * 24 * 60 * 60 * 1000,
    scihubCacheMs: 7 * 24 * 60 * 60 * 1000,
    citationsCacheMs: 7 * 24 * 60 * 60 * 1000,
    unpaywallCacheMs: 7 * 24 * 60 * 60 * 1000,
    riskCacheMs: 7 * 24 * 60 * 60 * 1000,
    crossrefCacheMs: 7 * 24 * 60 * 60 * 1000,
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
    filters: null,
    settings: null,
    manualAliases: {},
  };

  const STYLE_ID = "pjm-style";
  const BADGE_CLASS = "pjm-metrics";
  const UI_HOST_ID = "pjm-ui-host";

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

  function manualAliasKey(value) {
    return normalizeKey(value).toLowerCase();
  }

  function normalizeIssn(value) {
    const cleaned = String(value || "").toUpperCase().replace(/[^0-9X]/g, "");
    if (cleaned.length !== 8) return "";
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }

  function impactFactorValue(record) {
    const raw = String(record?.if || record?.impactFactor || record?.IF || "").replace(/[<>]/g, "");
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : null;
  }

  function isQ1(record) {
    return /Q1/i.test(String(record?.jcr || record?.jcrQuartile || ""));
  }

  function isCas1(record) {
    return String(record?.cas || "").trim() === "1";
  }

  function isTop(record) {
    return record?.top === true || String(record?.top).toLowerCase() === "true" || record?.top === "是";
  }

  function isReview(record) {
    return record?.review === true || String(record?.review).toLowerCase() === "true" || record?.review === "是";
  }

  function casLabel(record) {
    return record?.cas ? `${record.cas}区` : "";
  }

  function settingEnabled(key) {
    return STATE.settings?.[key] !== false;
  }

  function isVisibleNode(node) {
    if (!node) return false;
    const style = window.getComputedStyle(node);
    return style.display !== "none" && style.visibility !== "hidden" && !node.hidden;
  }

  function journalMetricDetails(record, match = null) {
    if (!record) return "";
    const details = [];
    const updated = STATE.data?.meta?.updated;
    if (record.journal) details.push(record.journal);
    if (match?.method) {
      details.push(matchDescription(match));
    }
    if (record.if || record.impactFactor || record.IF) details.push(`IF: ${record.if || record.impactFactor || record.IF}`);
    if (record.jcr || record.jcrQuartile) details.push(`JCR: ${record.jcr || record.jcrQuartile}`);
    if (record.cas) details.push(`CAS: ${record.cas}区`);
    if (record.casCategory) details.push(`CAS category: ${record.casCategory}`);
    if (isTop(record)) details.push("Top journal");
    if (isReview(record)) details.push("Review journal");
    if (record.warning) details.push(`Warning: ${record.warning}`);
    if (updated) details.push(`Data: ${updated}`);
    return details.join("\n");
  }

  function matchDescription(match = null) {
    if (!match?.method) return "";
    const confidence = match.confidence ? `, ${match.confidence}` : "";
    const source = match.source ? ` (${match.source})` : "";
    return `Matched by ${match.method}${confidence}${source}`;
  }

  function resolutionDescription(options = {}) {
    const parts = [];
    if (options.match?.method) parts.push(matchDescription(options.match));
    if (options.resolvedBy) parts.push(`Resolved by ${options.resolvedBy}`);
    if (!options.match?.method && !options.resolvedBy) {
      parts.push(options.record ? "Journal matched" : "Journal not matched");
    }
    if (options.scihubTarget || options.citationTarget) {
      const doi = normalizeDoi(options.scihubTarget || options.citationTarget);
      const pmid = normalizePmid(options.citationTarget || options.scihubTarget);
      if (doi) parts.push(`DOI: ${doi}`);
      else if (pmid) parts.push(`PMID: ${pmid}`);
    }
    return parts.join("\n");
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function parseJournalAbbrevFromCitation(citationText) {
    const text = String(citationText || "").replace(/\s+/g, " ").trim();
    const match = text.match(/^(.+?)\.\s+\d{4}\b/);
    return match ? match[1].trim() : text.split(".")[0].trim();
  }

  function parseJournalTitleFromCitation(citationText) {
    const text = String(citationText || "").replace(/\s+/g, " ").trim();
    const patterns = [
      /^(.+?)\s+\d+\s*\(\s*\d+\s*\)\s*[:：]/,
      /^(.+?)\s+\d+\s*[:：]\s*\w/,
      /^(.+?)\s+\d{4}\s*[;,]/,
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match?.[1]) return match[1].replace(/^[|,\s]+|[|,\s]+$/g, "");
    }
    return "";
  }

  function normalizeDoi(value) {
    const match = String(value || "").match(/10\.\d{4,9}\/[^\s"'<>]+/i);
    if (!match) return "";
    return match[0]
      .replace(/^doi:\s*/i, "")
      .replace(/[?#].*$/g, "")
      .replace(/[).,;]+$/g, "")
      .trim();
  }

  function normalizePmid(value) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    const explicit = text.match(/\bPMID\s*:?\s*(\d{5,9})\b/i);
    if (explicit) return explicit[1];
    return /^\d{5,9}$/.test(text) ? text : "";
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

  function getVisibleJournalTitle() {
    const selectors = [
      ".article-citation",
      ".ejp-article-citation",
      ".article-meta",
      ".article-info",
      ".citation",
      "[class*='citation']",
    ];
    for (const selector of selectors) {
      for (const node of document.querySelectorAll(selector)) {
        const journal = parseJournalTitleFromCitation(node.textContent || "");
        if (journal) return journal;
      }
    }
    return parseJournalTitleFromCitation(document.body?.textContent || "");
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

    const pageUrlDoi = root === document ? normalizeDoi(location.href) : "";
    if (pageUrlDoi) return pageUrlDoi;

    const textDoi = normalizeDoi(root.textContent || "");
    return textDoi;
  }

  function getPubmedId(root = document) {
    const metaPmid = normalizePmid(getMetaContent("citation_pmid"));
    if (metaPmid) return String(metaPmid).trim();
    return normalizePmid(root.querySelector?.(".docsum-pmid")?.textContent || "");
  }

  function getDoiFromPath() {
    const match = location.pathname.match(/\/doi\/(?:full\/|abs\/|abstract\/|epdf\/|pdf\/)?(10\.\d{4,9}\/.+)$/i);
    return normalizeDoi(match?.[1] || "");
  }

  function getScihubTarget(root = document) {
    return getDoiFromPath() || getArticleDoi(root) || getPubmedId(root);
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

  function unpaywallCacheKey(target) {
    return normalizeDoi(target).toLowerCase();
  }

  function readJsonObject(key) {
    try {
      return JSON.parse(GM_getValue(key, "{}")) || {};
    } catch {
      return {};
    }
  }

  function writeJsonObject(key, value) {
    GM_setValue(key, JSON.stringify(value));
  }

  async function fetchUnpaywall(target) {
    const doi = normalizeDoi(target);
    const key = unpaywallCacheKey(doi);
    if (!doi || !key) return null;

    const cache = readJsonObject(CONFIG.unpaywallCacheKey);
    const cached = cache[key];
    if (cached && Date.now() - cached.time < CONFIG.unpaywallCacheMs) return cached;

    const url = `https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=${encodeURIComponent(CONFIG.unpaywallEmail)}`;
    const data = await loadJsonViaGm(url);
    const oaLocation = data.best_oa_location || {};
    const pdfUrl = oaLocation.url_for_pdf || "";
    const landingUrl = oaLocation.url || oaLocation.url_for_landing_page || buildUnpaywallUrl(doi);
    const result = {
      isOa: Boolean(data.is_oa),
      status: data.oa_status || "",
      url: pdfUrl || landingUrl,
      pdfUrl,
      landingUrl,
      hasPdf: Boolean(pdfUrl),
      hostType: oaLocation.host_type || "",
      repositoryInstitution: oaLocation.repository_institution || "",
      time: Date.now(),
    };
    cache[key] = result;
    writeJsonObject(CONFIG.unpaywallCacheKey, cache);
    return result;
  }

  function citationCacheKey(target) {
    return String(target || "").trim().toLowerCase();
  }

  function citationSourceTitle(source) {
    const cleanSource = String(source || "").trim();
    if (cleanSource === "NIH iCite") return "Citation count from NIH iCite";
    if (cleanSource === "Google Scholar") return "Citation count shown on Google Scholar result";
    return cleanSource ? `Citation count from ${cleanSource}` : "Citation count";
  }

  function shortMetric(value) {
    return Number.parseFloat(value).toFixed(1).replace(/\.0$/, "");
  }

  function citationResultTitle(result) {
    const title = citationSourceTitle(result?.source);
    const details = [];
    if (Number.isFinite(result?.rcr)) details.push(`RCR ${shortMetric(result.rcr)}`);
    if (Number.isFinite(result?.citationsPerYear)) details.push(`${shortMetric(result.citationsPerYear)}/year`);
    return details.length ? `${title}; ${details.join("; ")}` : title;
  }

  function normalizePubmedStatus(summary) {
    const pubTypes = (summary?.pubtype || []).map((item) => String(item || ""));
    const references = summary?.references || [];
    const labels = [];
    if (pubTypes.some((item) => /retracted publication/i.test(item))) labels.push("Retracted");
    if (pubTypes.some((item) => /expression of concern/i.test(item))) labels.push("Concern");
    if (pubTypes.some((item) => /^retraction/i.test(item))) labels.push("Retraction");
    if (references.some((item) => /retraction in/i.test(String(item?.reftype || item?.refsource || "")))) labels.push("Retracted");
    if (references.some((item) => /expression of concern/i.test(String(item?.reftype || item?.refsource || "")))) labels.push("Concern");
    const uniqueLabels = unique(labels);
    return {
      label: uniqueLabels[0] || "",
      details: uniqueLabels.join(", "),
    };
  }

  async function fetchPubmedRisk(target) {
    const pmid = normalizePmid(target);
    if (!pmid) return null;
    const cache = readJsonObject(CONFIG.riskCacheKey);
    const cached = cache[pmid];
    if (cached && Date.now() - cached.time < CONFIG.riskCacheMs) return cached;

    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${encodeURIComponent(pmid)}&retmode=json`;
    const data = await loadJsonViaGm(url);
    const summary = data?.result?.[pmid] || null;
    const status = normalizePubmedStatus(summary);
    const result = {
      pmid,
      label: status.label,
      details: status.details,
      time: Date.now(),
    };
    cache[pmid] = result;
    writeJsonObject(CONFIG.riskCacheKey, cache);
    return result;
  }

  function crossrefStatusFromRelation(relation) {
    const labels = [];
    for (const [type, items] of Object.entries(relation || {})) {
      const text = String(type || "").toLowerCase();
      if (/correction|corrects|erratum/.test(text)) labels.push("Correction");
      if (/retraction|retracts|retracted/.test(text)) labels.push("Retraction");
      if (/update|updated|expression-of-concern|concern/.test(text)) labels.push("Update");
      for (const item of asArray(items)) {
        const id = String(item?.id || item?.["id-type"] || "").toLowerCase();
        if (/erratum|correction/.test(id)) labels.push("Correction");
        if (/retraction/.test(id)) labels.push("Retraction");
        if (/concern|update/.test(id)) labels.push("Update");
      }
    }
    return unique(labels);
  }

  function crossrefStatusFromUpdates(item) {
    const labels = [];
    for (const update of [...asArray(item?.["update-to"]), ...asArray(item?.["updated-by"])]) {
      const type = String(update?.type || update?.label || "").toLowerCase();
      if (/correction|erratum/.test(type)) labels.push("Correction");
      if (/retraction/.test(type)) labels.push("Retraction");
      if (/update|concern/.test(type)) labels.push("Update");
    }
    return labels;
  }

  function getCrossrefSourceInfo(item, queryTitle = "") {
    const title = firstText(...asArray(item?.title));
    const journal = firstText(...asArray(item?.["container-title"]), ...asArray(item?.["short-container-title"]));
    const issn = firstText(...asArray(item?.ISSN), item?.["ISSN-L"]);
    const doi = normalizeDoi(item?.DOI || item?.URL || "");
    const status = unique([
      ...crossrefStatusFromRelation(item?.relation || {}),
      ...crossrefStatusFromUpdates(item),
    ]);
    return {
      title,
      journal,
      issn,
      doi,
      status,
      similarity: queryTitle ? titleSimilarity(queryTitle, title) : 0,
      type: item?.type || "",
      source: "Crossref",
      time: Date.now(),
    };
  }

  function crossrefCandidateScore(info, queryTitle = "") {
    if (!info?.doi) return -1;
    const similarity = queryTitle ? titleSimilarity(queryTitle, info.title) : info.similarity || 0;
    if (queryTitle && similarity < 0.72) return -1;
    let score = similarity * 100;
    if (info.type === "journal-article") score += 20;
    if (info.type === "posted-content") score -= 30;
    if (info.journal) score += 30;
    if (normalizeIssn(info.issn)) score += 30;
    if (/10\.1101|10\.21203|10\.2139|10\.20944/i.test(info.doi)) score -= 40;
    if (/biorxiv|medrxiv|preprint|research square|ssrn/i.test(`${info.journal} ${info.title}`)) score -= 35;
    return score;
  }

  async function fetchCrossrefByTitle(title) {
    const cleanTitle = String(title || "").replace(/\s+/g, " ").trim();
    if (!cleanTitle) return null;
    const key = `title:${normalizeKey(cleanTitle).toLowerCase()}`;
    const cache = readJsonObject(CONFIG.crossrefCacheKey);
    const cached = cache[key];
    if (cached && Date.now() - cached.time < CONFIG.crossrefCacheMs) return cached;

    const url = `https://api.crossref.org/works?query.title=${encodeURIComponent(cleanTitle)}&rows=5&select=DOI,title,container-title,short-container-title,ISSN,relation,URL,update-to,updated-by,type`;
    const data = await loadJsonViaGm(url);
    const items = Array.isArray(data?.message?.items) ? data.message.items : [];
    const candidates = items
      .map((item) => getCrossrefSourceInfo(item, cleanTitle))
      .map((info) => ({ info, score: crossrefCandidateScore(info, cleanTitle) }))
      .filter((candidate) => candidate.score >= 0)
      .sort((left, right) => right.score - left.score);
    const result = candidates[0]?.info || null;
    cache[key] = result || { time: Date.now() };
    writeJsonObject(CONFIG.crossrefCacheKey, cache);
    return result;
  }

  async function fetchCrossrefByDoi(target) {
    const doi = normalizeDoi(target);
    if (!doi) return null;
    const key = `doi:${doi.toLowerCase()}`;
    const cache = readJsonObject(CONFIG.crossrefCacheKey);
    const cached = cache[key];
    if (cached && Date.now() - cached.time < CONFIG.crossrefCacheMs) return cached;

    const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
    const data = await loadJsonViaGm(url);
    const result = data?.message ? getCrossrefSourceInfo(data.message) : null;
    cache[key] = result || { time: Date.now() };
    writeJsonObject(CONFIG.crossrefCacheKey, cache);
    return result;
  }

  function buildOpenAlexUrl(target) {
    const doi = normalizeDoi(target);
    if (doi) {
      return `https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}?select=id,doi,cited_by_count`;
    }
    const pmid = normalizePmid(target);
    if (pmid) {
      return `https://api.openalex.org/works?filter=pmid:${encodeURIComponent(pmid)}&select=id,doi,cited_by_count&per-page=1`;
    }
    return "";
  }

  function buildOpenAlexSearchUrl(title) {
    const cleanTitle = String(title || "").replace(/\s+/g, " ").trim();
    if (!cleanTitle) return "";
    return `https://api.openalex.org/works?search=${encodeURIComponent(cleanTitle)}&select=id,doi,display_name,primary_location,locations,cited_by_count&per-page=5`;
  }

  function getOpenAlexSourceInfo(work) {
    const locations = [
      work?.primary_location,
      ...(Array.isArray(work?.locations) ? work.locations : []),
    ].filter(Boolean);
    const source = locations.find((location) => location?.source?.type === "journal")?.source
      || work?.primary_location?.source
      || locations.find((location) => location?.source)?.source
      || {};
    return {
      title: work?.display_name || "",
      journal: source.display_name || "",
      issn: firstText(source.issn_l, ...asArray(source.issn)),
      doi: normalizeDoi(work?.doi || ""),
      citedBy: work?.cited_by_count,
    };
  }

  function openAlexCandidateScore(info, queryTitle = "") {
    if (!info) return -1;
    const similarity = queryTitle ? titleSimilarity(queryTitle, info.title) : 0;
    if (queryTitle && similarity < 0.72) return -1;
    let score = similarity * 100;
    if (info.journal) score += 30;
    if (normalizeIssn(info.issn)) score += 30;
    if (/10\.1101|10\.21203|10\.2139|10\.20944/i.test(info.doi)) score -= 40;
    if (/biorxiv|medrxiv|preprint|research square|ssrn/i.test(`${info.journal} ${info.title}`)) score -= 35;
    return score;
  }

  async function fetchOpenAlexByTitle(title) {
    const url = buildOpenAlexSearchUrl(title);
    if (!url) return null;
    const data = await loadJsonViaGm(url);
    const works = Array.isArray(data.results) ? data.results : [];
    const candidates = works
      .map((work) => getOpenAlexSourceInfo(work))
      .map((info) => ({ info, score: openAlexCandidateScore(info, title) }))
      .filter((candidate) => candidate.score >= 0)
      .sort((left, right) => right.score - left.score);
    return candidates[0]?.info || null;
  }

  function buildSemanticScholarUrl(target) {
    const doi = normalizeDoi(target);
    if (doi) {
      return `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(doi)}?fields=citationCount,externalIds,url`;
    }
    const pmid = normalizePmid(target);
    if (pmid) {
      return `https://api.semanticscholar.org/graph/v1/paper/PMID:${encodeURIComponent(pmid)}?fields=citationCount,externalIds,url`;
    }
    return "";
  }

  function buildIciteUrl(target) {
    const pmid = normalizePmid(target);
    if (!pmid) return "";
    return `https://icite.od.nih.gov/api/pubs?pmids=${encodeURIComponent(pmid)}&fl=pmid,doi,citation_count,relative_citation_ratio,citations_per_year`;
  }

  async function fetchCitationCount(target) {
    const key = citationCacheKey(target);
    if (!key) return null;

    const cache = readJsonObject(CONFIG.citationsCacheKey);
    const cached = cache[key];
    if (cached && Date.now() - cached.time < CONFIG.citationsCacheMs) return cached;

    const iciteUrl = buildIciteUrl(target);
    if (iciteUrl) {
      try {
        const data = await loadJsonViaGm(iciteUrl);
        const pub = Array.isArray(data.data) ? data.data[0] : null;
        if (Number.isFinite(pub?.citation_count)) {
          const result = {
            count: pub.citation_count,
            source: "NIH iCite",
            rcr: Number.isFinite(pub.relative_citation_ratio) ? pub.relative_citation_ratio : null,
            citationsPerYear: Number.isFinite(pub.citations_per_year) ? pub.citations_per_year : null,
            time: Date.now(),
          };
          cache[key] = result;
          writeJsonObject(CONFIG.citationsCacheKey, cache);
          return result;
        }
      } catch {
        // Fall through to open citation indexes.
      }
    }

    const openAlexUrl = buildOpenAlexUrl(target);
    if (openAlexUrl) {
      try {
        const data = await loadJsonViaGm(openAlexUrl);
        const work = Array.isArray(data.results) ? data.results[0] : data;
        if (Number.isFinite(work?.cited_by_count)) {
          const result = { count: work.cited_by_count, source: "OpenAlex", time: Date.now() };
          cache[key] = result;
          writeJsonObject(CONFIG.citationsCacheKey, cache);
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
          writeJsonObject(CONFIG.citationsCacheKey, cache);
          return result;
        }
      } catch {
        // Leave the citation chip in failed state.
      }
    }

    const result = { count: null, source: "", time: Date.now() };
    cache[key] = result;
    writeJsonObject(CONFIG.citationsCacheKey, cache);
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

  function loadTextViaGm(url, headers = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers,
        timeout: 20000,
        onload(response) {
          if (response.status >= 200 && response.status < 300) {
            resolve(response.responseText || "");
          } else {
            reject(new Error(`HTTP ${response.status}`));
          }
        },
        onerror: reject,
        ontimeout: () => reject(new Error("Timed out while loading text.")),
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

  function defaultFilters() {
    return {
      q1: false,
      cas1: false,
      top: false,
      hideNonMatching: false,
      minIf: "",
    };
  }

  function defaultSettings() {
    return {
      pubmedAbstracts: false,
      showCited: true,
      showOa: true,
      showScihub: true,
      showPubpeer: true,
      showCrossrefStatus: true,
      showRisk: true,
      showArticleFloatingBar: true,
    };
  }

  function loadFilters() {
    try {
      return { ...defaultFilters(), ...(JSON.parse(GM_getValue(CONFIG.filterStateKey, "{}")) || {}) };
    } catch {
      return defaultFilters();
    }
  }

  function saveFilters(filters) {
    STATE.filters = { ...defaultFilters(), ...filters };
    GM_setValue(CONFIG.filterStateKey, JSON.stringify(STATE.filters));
  }

  function loadSettings() {
    try {
      return { ...defaultSettings(), ...(JSON.parse(GM_getValue(CONFIG.settingsKey, "{}")) || {}) };
    } catch {
      return defaultSettings();
    }
  }

  function saveSettings(settings) {
    STATE.settings = { ...defaultSettings(), ...settings };
    GM_setValue(CONFIG.settingsKey, JSON.stringify(STATE.settings));
  }

  function loadManualAliases() {
    return readJsonObject(CONFIG.manualAliasesKey);
  }

  function saveManualAliases(aliases) {
    STATE.manualAliases = aliases || {};
    GM_setValue(CONFIG.manualAliasesKey, JSON.stringify(STATE.manualAliases));
  }

  function cacheObjectCount(key) {
    try {
      const value = JSON.parse(GM_getValue(key, "{}"));
      return value && typeof value === "object" ? Object.keys(value).length : 0;
    } catch {
      return 0;
    }
  }

  function dateFromStoredTime(key) {
    const time = Number(GM_getValue(key, 0));
    return time ? new Date(time).toISOString().slice(0, 10) : "";
  }

  function clearCacheKeys(keys) {
    for (const key of keys) GM_setValue(key, "");
  }

  function reloadSoon() {
    window.setTimeout(() => location.reload(), 250);
  }

  function uiStyles() {
    return `
      :host {
        all: initial;
        color-scheme: light;
        font-family: Arial, sans-serif;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
      button, input, a, label {
        font-family: Arial, sans-serif;
      }
      #pjm-more-popover {
        position: fixed;
        display: grid;
        gap: 4px;
        z-index: 2147483645;
        min-width: 148px;
        padding: 5px;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12);
        color: #334155;
        font-size: 12px;
      }
      #pjm-more-popover button,
      .pjm-floating-bar a,
      .pjm-floating-bar button,
      .pjm-settings-head button,
      .pjm-settings-actions button,
      .pjm-detail-head button {
        appearance: none;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        background: #fff;
        color: #334155;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.12s ease, border-color 0.12s ease;
      }
      #pjm-more-popover button:hover,
      .pjm-floating-bar a:hover,
      .pjm-floating-bar button:hover,
      .pjm-settings-head button:hover,
      .pjm-settings-actions button:hover,
      .pjm-detail-head button:hover {
        border-color: #94a3b8;
        background: #f8fafc;
      }
      #pjm-more-popover button:focus-visible,
      .pjm-floating-bar a:focus-visible,
      .pjm-floating-bar button:focus-visible,
      .pjm-settings-head button:focus-visible,
      .pjm-settings-actions button:focus-visible,
      .pjm-detail-head button:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 1px;
      }
      #pjm-more-popover button {
        width: 100%;
        line-height: 18px;
        padding: 3px 7px;
        text-align: left;
      }
      #pjm-settings-modal {
        position: fixed;
        inset: 0;
        z-index: 2147483646;
        color: #334155;
        font-size: 13px;
      }
      .pjm-settings-backdrop,
      .pjm-detail-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.18);
      }
      .pjm-settings-dialog {
        position: fixed;
        top: 72px;
        right: 28px;
        width: min(320px, calc(100vw - 40px));
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background: #fff;
        box-shadow: 0 18px 46px rgba(15, 23, 42, 0.2);
      }
      .pjm-settings-head,
      .pjm-detail-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 9px 11px;
        border-bottom: 1px solid #e2e8f0;
      }
      .pjm-settings-head button,
      .pjm-detail-head button {
        width: 28px;
        height: 28px;
        padding: 0;
        line-height: 26px;
        text-align: center;
      }
      .pjm-settings-body {
        display: grid;
        gap: 7px;
        padding: 10px 11px;
      }
      .pjm-settings-row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 22px;
        margin: 0;
        padding: 0;
        line-height: 22px;
        cursor: pointer;
      }
      .pjm-settings-row input[type="checkbox"] {
        appearance: auto;
        -webkit-appearance: checkbox;
        display: inline-block;
        flex: 0 0 auto;
        width: 16px;
        height: 16px;
        min-width: 16px;
        min-height: 16px;
        margin: 0;
        opacity: 1;
        position: static;
        visibility: visible;
      }
      .pjm-settings-status {
        display: grid;
        gap: 5px;
        margin-top: 3px;
        padding-top: 8px;
        border-top: 1px solid #e2e8f0;
        color: #475569;
        font-size: 12px;
        line-height: 16px;
      }
      .pjm-settings-status-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }
      .pjm-settings-status-row span:first-child {
        color: #64748b;
        font-weight: 700;
      }
      .pjm-settings-status-row span:last-child {
        color: #334155;
        text-align: right;
        overflow-wrap: anywhere;
      }
      .pjm-settings-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
        padding: 10px 11px 11px;
        border-top: 1px solid #e2e8f0;
      }
      .pjm-settings-actions button {
        height: 28px;
        padding: 5px 6px;
        font-size: 12px;
        line-height: 16px;
      }
      .pjm-floating-bar {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 2147483644;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.16);
        font-size: 12px;
      }
      .pjm-floating-bar a,
      .pjm-floating-bar button {
        padding: 3px 7px;
        line-height: 18px;
      }
      .pjm-detail-modal {
        position: fixed;
        inset: 0;
        z-index: 2147483646;
        color: #334155;
        font-size: 13px;
      }
      .pjm-detail-dialog {
        position: fixed;
        width: min(360px, calc(100vw - 40px));
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background: #fff;
        box-shadow: 0 18px 46px rgba(15, 23, 42, 0.2);
      }
      .pjm-detail-body {
        display: grid;
        gap: 6px;
        padding: 10px 11px 12px;
      }
      .pjm-detail-row {
        display: grid;
        grid-template-columns: 82px minmax(0, 1fr);
        gap: 8px;
        align-items: start;
      }
      .pjm-detail-key {
        color: #64748b;
        font-weight: 700;
      }
      .pjm-detail-value {
        color: #334155;
        overflow-wrap: anywhere;
      }
      .pjm-detail-note {
        color: #64748b;
        font-size: 12px;
        line-height: 16px;
      }
      .pjm-hidden-by-setting {
        display: none !important;
      }
    `;
  }

  function uiRoot() {
    let host = document.getElementById(UI_HOST_ID);
    if (!host) {
      host = document.createElement("div");
      host.id = UI_HOST_ID;
      const root = host.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = uiStyles();
      root.append(style);
      document.documentElement.append(host);
    }
    return host.shadowRoot;
  }

  function removeUiNode(id) {
    uiRoot().getElementById(id)?.remove();
  }

  function eventPathHas(event, predicate) {
    return event.composedPath?.().some((node) => node instanceof Element && predicate(node));
  }

  function settingsRows() {
    const settings = { ...defaultSettings(), ...(STATE.settings || {}) };
    const labels = [
      ["showCited", "Citation counts"],
      ["showOa", "OA / PDF"],
      ["showScihub", "Sci-Hub"],
      ["showPubpeer", "PubPeer"],
      ["showCrossrefStatus", "Crossref status"],
      ["showRisk", "PubMed risk status"],
      ["showArticleFloatingBar", "Article floating bar"],
      ["pubmedAbstracts", "PubMed abstracts"],
    ];
    return labels.map(([key, label]) => `
      <label class="pjm-settings-row">
        <input type="checkbox" data-pjm-setting="${escapeHtml(key)}" ${settings[key] ? "checked" : ""}>
        <span>${escapeHtml(label)}</span>
      </label>
    `).join("");
  }

  function settingsStatusRows() {
    const rows = [
      ["Journal data", STATE.data?.meta?.updated || "embedded/sample"],
      ["Data cache", dateFromStoredTime(CONFIG.cacheTimeKey) || "embedded"],
      ["Sci-Hub domains", dateFromStoredTime(CONFIG.scihubDomainsCacheTimeKey) || (GM_getValue(CONFIG.scihubManualDomainsKey, "") ? "manual" : "fallback")],
      ["Current Sci-Hub", STATE.scihubDomains?.[0] || "none"],
      ["Manual aliases", String(Object.keys(STATE.manualAliases || {}).length)],
      ["Citation cache", String(cacheObjectCount(CONFIG.citationsCacheKey))],
      ["OA cache", String(cacheObjectCount(CONFIG.unpaywallCacheKey))],
      ["Crossref cache", String(cacheObjectCount(CONFIG.crossrefCacheKey))],
      ["Risk cache", String(cacheObjectCount(CONFIG.riskCacheKey))],
    ];
    return `
      <div class="pjm-settings-status" aria-label="Data status">
        ${rows.map(([key, value]) => `
          <div class="pjm-settings-status-row">
            <span>${escapeHtml(key)}</span>
            <span>${escapeHtml(value)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function openSettingsPanel() {
    removeUiNode("pjm-settings-modal");
    const modal = document.createElement("div");
    modal.id = "pjm-settings-modal";
    modal.innerHTML = `
      <div class="pjm-settings-backdrop" data-pjm-close-settings="1"></div>
      <div class="pjm-settings-dialog" role="dialog" aria-label="Journal Metrics settings">
        <div class="pjm-settings-head">
          <strong>Journal Metrics</strong>
          <button type="button" data-pjm-close-settings="1" title="Close">×</button>
        </div>
        <div class="pjm-settings-body">${settingsRows()}${settingsStatusRows()}</div>
        <div class="pjm-settings-actions">
          <button type="button" data-pjm-cache="data">Refresh data</button>
          <button type="button" data-pjm-cache="citations">Clear citations</button>
          <button type="button" data-pjm-cache="oa">Clear OA</button>
          <button type="button" data-pjm-cache="crossref">Clear Crossref</button>
          <button type="button" data-pjm-cache="aliases">Clear aliases</button>
        </div>
      </div>
    `;
    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-pjm-close-settings]")) {
        modal.remove();
        return;
      }
      const cacheButton = event.target.closest("button[data-pjm-cache]");
      if (!cacheButton) return;
      const cache = cacheButton.dataset.pjmCache;
      if (cache === "data") clearCacheKeys([CONFIG.cacheKey, CONFIG.cacheTimeKey, CONFIG.scihubDomainsCacheKey, CONFIG.scihubDomainsCacheTimeKey]);
      if (cache === "citations") clearCacheKeys([CONFIG.citationsCacheKey]);
      if (cache === "oa") clearCacheKeys([CONFIG.unpaywallCacheKey]);
      if (cache === "crossref") clearCacheKeys([CONFIG.crossrefCacheKey, CONFIG.riskCacheKey]);
      if (cache === "aliases") saveManualAliases({});
      window.alert("Cache cleared. Reloading page.");
      reloadSoon();
    });
    modal.addEventListener("change", (event) => {
      const input = event.target.closest("input[data-pjm-setting]");
      if (!input) return;
      saveSettings({ ...STATE.settings, [input.dataset.pjmSetting]: input.checked });
      syncFilterbar();
      applySettingsVisibility();
    });
    uiRoot().append(modal);
  }

  function moreMenuHtml() {
    return `
      <button type="button" data-pjm-action="export-ris" title="Copy visible records as RIS">RIS</button>
      <button type="button" data-pjm-action="export-bibtex" title="Copy visible records as BibTeX">BibTeX</button>
      <button type="button" data-pjm-action="export-selected-ris" title="Copy selected records as RIS">Selected RIS</button>
      <button type="button" data-pjm-action="export-selected-bibtex" title="Copy selected records as BibTeX">Selected BibTeX</button>
      <button type="button" data-pjm-action="export-selected-csv" title="Copy selected records as CSV">Selected CSV</button>
      <button type="button" data-pjm-action="export-selected-markdown" title="Copy selected records as Markdown">Selected Markdown</button>
      <button type="button" data-pjm-action="copy-doi" title="Copy visible DOI list">DOI</button>
      <button type="button" data-pjm-action="copy-cite" title="Copy compact citation text">Cite</button>
      <button type="button" data-pjm-action="toggle-abstracts" title="Show or hide PubMed abstracts">Abs</button>
      <button type="button" data-pjm-action="settings" title="Open settings">Settings</button>
      <button type="button" data-pjm-action="reset" title="Clear all filters">Reset</button>
    `;
  }

  function closeMorePopover() {
    removeUiNode("pjm-more-popover");
  }

  function closeDetailPanel() {
    removeUiNode("pjm-detail-modal");
  }

  function openManualAliasPrompt(metrics) {
    if (!metrics?.dataset?.pjmFixQuery) return;
    let query = null;
    try {
      query = JSON.parse(metrics.dataset.pjmFixQuery || "null");
    } catch {
      query = null;
    }
    if (!query) return;
    const source = firstText(query.journal, query.abbrev, ...(query.aliases || []));
    const input = window.prompt(
      source
        ? `Map this page journal text to a known journal:\n${source}\n\nEnter the exact journal name, abbreviation, or ISSN:`
        : "Enter the exact journal name, abbreviation, or ISSN:",
      ""
    );
    if (input === null) return;
    const target = String(input || "").trim();
    if (!target) return;
    const lookup = lookupJournalWithMatch({ journal: target, abbrev: target, issn: target, aliases: [target] });
    if (!lookup.record) {
      window.alert("No matching journal found in local data. Try the full journal name or ISSN.");
      return;
    }
    const aliases = { ...(STATE.manualAliases || {}) };
    let added = 0;
    for (const candidate of manualAliasCandidates(query)) {
      const key = manualAliasKey(candidate);
      if (!key) continue;
      aliases[key] = lookup.record.journal;
      added += 1;
    }
    if (!added) {
      window.alert("No source journal text was available for this result.");
      return;
    }
    saveManualAliases(aliases);
    window.alert(`Saved ${added} local alias${added === 1 ? "" : "es"} to ${lookup.record.journal}. Reloading page.`);
    reloadSoon();
  }

  function detailRows(record, match) {
    const updated = STATE.data?.meta?.updated || "";
    const rows = [
      ["Journal", record?.journal || ""],
      ["ISSN", asArray(record?.issn).join(", ")],
      ["IF", record?.if || record?.impactFactor || record?.IF || ""],
      ["JCR", record?.jcr || record?.jcrQuartile || ""],
      ["CAS", casLabel(record)],
      ["Category", record?.casCategory || ""],
      ["Top", isTop(record) ? "Yes" : ""],
      ["Review", isReview(record) ? "Yes" : ""],
      ["Warning", record?.warning || ""],
      ["Data", updated],
      ["Match", matchDescription(match)],
    ];
    return rows
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => `
        <div class="pjm-detail-row">
          <span class="pjm-detail-key">${escapeHtml(key)}</span>
          <span class="pjm-detail-value">${escapeHtml(value)}</span>
        </div>
      `).join("");
  }

  function openJournalDetail(metrics, anchor) {
    if (!metrics) return;
    let record = null;
    let match = null;
    try {
      record = JSON.parse(metrics.dataset.pjmRecord || "null");
      match = JSON.parse(metrics.dataset.pjmMatch || "null");
    } catch {
      record = null;
      match = null;
    }
    if (!record) return;
    closeDetailPanel();
    const modal = document.createElement("div");
    modal.id = "pjm-detail-modal";
    modal.className = "pjm-detail-modal";
    modal.innerHTML = `
      <div class="pjm-detail-backdrop" data-pjm-close-detail="1"></div>
      <div class="pjm-detail-dialog" role="dialog" aria-label="Journal details">
        <div class="pjm-detail-head">
          <strong>Journal Details</strong>
          <button type="button" data-pjm-close-detail="1" title="Close">×</button>
        </div>
        <div class="pjm-detail-body">${detailRows(record, match)}</div>
      </div>
    `;
    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-pjm-close-detail]")) closeDetailPanel();
    });
    uiRoot().append(modal);
    const dialog = modal.querySelector(".pjm-detail-dialog");
    const rect = anchor?.getBoundingClientRect?.() || { left: 24, right: 360, bottom: 90, top: 60 };
    const width = dialog.offsetWidth || 360;
    const height = dialog.offsetHeight || 240;
    const left = Math.max(12, Math.min(window.innerWidth - width - 12, rect.left));
    let top = rect.bottom + 8;
    if (top + height > window.innerHeight - 12) {
      top = Math.max(12, rect.top - height - 8);
    }
    dialog.style.left = `${left}px`;
    dialog.style.top = `${top}px`;
  }

  function openMorePopover(button) {
    const root = uiRoot();
    const existing = root.getElementById("pjm-more-popover");
    if (existing && existing.dataset.pjmOwner === button.dataset.pjmOwner) {
      existing.remove();
      return;
    }
    closeMorePopover();
    const popover = document.createElement("div");
    popover.id = "pjm-more-popover";
    popover.dataset.pjmOwner = button.dataset.pjmOwner;
    popover.innerHTML = moreMenuHtml();
    popover.addEventListener("click", (event) => {
      const actionButton = event.target.closest("button[data-pjm-action]");
      if (!actionButton) return;
      handleToolbarAction(actionButton.dataset.pjmAction);
      closeMorePopover();
    });
    root.append(popover);
    const rect = button.getBoundingClientRect();
    const width = popover.offsetWidth || 132;
    const height = popover.offsetHeight || 220;
    const left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.right - width));
    let top = rect.bottom + 4;
    if (top + height > window.innerHeight - 8) {
      top = Math.max(8, rect.top - height - 4);
    }
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
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

    GM_registerMenuCommand("Journal Metrics: Toggle PubMed abstracts", () => {
      saveSettings({ ...STATE.settings, pubmedAbstracts: !STATE.settings?.pubmedAbstracts });
      syncFilterbar();
      applyPubmedAbstracts();
    });

    GM_registerMenuCommand("Journal Metrics: Settings", () => openSettingsPanel());
    GM_registerMenuCommand("Journal Metrics: Refresh data caches", () => {
      clearCacheKeys([CONFIG.cacheKey, CONFIG.cacheTimeKey, CONFIG.scihubDomainsCacheKey, CONFIG.scihubDomainsCacheTimeKey]);
      window.alert("Journal data and Sci-Hub cache cleared. Reloading page.");
      reloadSoon();
    });
    GM_registerMenuCommand("Journal Metrics: Clear citation/OA/Crossref caches", () => {
      clearCacheKeys([CONFIG.citationsCacheKey, CONFIG.unpaywallCacheKey, CONFIG.crossrefCacheKey, CONFIG.riskCacheKey]);
      window.alert("Citation, OA, Crossref and risk caches cleared. Reloading page.");
      reloadSoon();
    });

    GM_registerMenuCommand("Journal Metrics: Export visible RIS", () => exportCurrentPage("ris", { scope: "visible" }));
    GM_registerMenuCommand("Journal Metrics: Export visible BibTeX", () => exportCurrentPage("bibtex", { scope: "visible" }));
    GM_registerMenuCommand("Journal Metrics: Export filtered RIS", () => exportCurrentPage("ris", { scope: "filtered" }));
    GM_registerMenuCommand("Journal Metrics: Export filtered BibTeX", () => exportCurrentPage("bibtex", { scope: "filtered" }));
    GM_registerMenuCommand("Journal Metrics: Copy DOI list", () => exportCurrentPage("doi", { scope: "visible" }));
    GM_registerMenuCommand("Journal Metrics: Copy PMID list", () => exportCurrentPage("pmid", { scope: "visible" }));
    GM_registerMenuCommand("Journal Metrics: Copy CSV", () => exportCurrentPage("csv", { scope: "visible" }));
    GM_registerMenuCommand("Journal Metrics: Copy Markdown table", () => exportCurrentPage("markdown", { scope: "visible" }));
    GM_registerMenuCommand("Journal Metrics: Copy citation", () => exportCurrentPage("cite", { scope: "visible" }));
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

  function manualAliasCandidates(query) {
    return unique([query?.journal, query?.abbrev, ...(query?.aliases || [])])
      .filter((candidate) => {
        const text = String(candidate || "").replace(/\s+/g, " ").trim();
        const key = manualAliasKey(text);
        return key.length >= 6 && !/\.{3,}|…/.test(text);
      });
  }

  function lookupManualAlias(query) {
    if (!query || !STATE.indexes) return { record: null, match: null };
    for (const candidate of manualAliasCandidates(query)) {
      const aliasKey = manualAliasKey(candidate);
      const targetName = aliasKey ? STATE.manualAliases?.[aliasKey] : "";
      const record = targetName ? STATE.indexes.byName.get(normalizeKey(targetName)) : null;
      if (record) {
        return { record, match: { method: "manual alias", confidence: "high", source: candidate } };
      }
    }
    return { record: null, match: null };
  }

  function lookupJournal(query) {
    return lookupJournalWithMatch(query).record;
  }

  function lookupJournalWithMatch(query) {
    if (!query || !STATE.indexes) return { record: null, match: null };
    const manual = lookupManualAlias(query);
    if (manual.record) return manual;

    const issn = normalizeIssn(query.issn);
    if (issn && STATE.indexes.byIssn.has(issn)) {
      return { record: STATE.indexes.byIssn.get(issn), match: { method: "ISSN", confidence: "high", source: issn } };
    }

    const candidates = unique([query.journal, query.abbrev, ...(query.aliases || [])]);
    for (const candidate of candidates) {
      const key = normalizeKey(candidate);
      if (key && STATE.indexes.byName.has(key)) {
        return { record: STATE.indexes.byName.get(key), match: { method: candidate === query.abbrev ? "abbreviation" : "journal title", confidence: "high", source: candidate } };
      }
    }

    return { record: null, match: null };
  }

  function findJournalInText(text) {
    return findJournalInTextWithMatch(text).record;
  }

  function findJournalInTextWithMatch(text) {
    const normalizedText = normalizeKey(text);
    if (!normalizedText) return { record: null, match: null };
    let best = null;
    let bestLength = 0;
    let bestName = "";
    for (const [name, record] of STATE.indexes.byName.entries()) {
      if (name.length < 8 || name.length <= bestLength) continue;
      if (normalizedText.includes(name)) {
        best = record;
        bestLength = name.length;
        bestName = name;
      }
    }
    return {
      record: best,
      match: best ? { method: "page text", confidence: "low", source: bestName } : null,
    };
  }

  function titleTokens(value) {
    const stop = new Set(["a", "an", "and", "are", "by", "for", "from", "in", "is", "of", "on", "or", "the", "to", "using", "with"]);
    return normalizeKey(value)
      .split(" ")
      .filter((token) => token.length > 2 && !stop.has(token.toLowerCase()));
  }

  function titleSimilarity(left, right) {
    const leftTokens = new Set(titleTokens(left));
    const rightTokens = new Set(titleTokens(right));
    if (!leftTokens.size || !rightTokens.size) return 0;
    let overlap = 0;
    for (const token of leftTokens) {
      if (rightTokens.has(token)) overlap += 1;
    }
    return overlap / Math.max(leftTokens.size, rightTokens.size);
  }

  function maybeJournalFromScholarMeta(metaText) {
    const text = String(metaText || "").replace(/\s+/g, " ").trim();
    const journalPart = text
      .split(/\s+-\s+/)
      .map((part) => part.trim())
      .find((part) => /\b(19|20)\d{2}\b/.test(part) || /journal|proceedings|transactions|letters|reviews|science|nature|kidney|cell/i.test(part));
    if (!journalPart) return "";
    return journalPart
      .replace(/\s*,?\s*\b(19|20)\d{2}\b.*$/, "")
      .replace(/\s+\.{3,}.*$/, "")
      .trim();
  }

  function getScholarResultTitle(result) {
    return firstText(result.querySelector(".gs_rt")?.textContent || "")
      .replace(/^(?:\[[^\]]+\]\s*)+/, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function parseScholarCitationText(text) {
    const normalized = String(text || "")
      .replace(/\u00a0/g, " ")
      .replace(/，/g, ",")
      .replace(/\s+/g, " ")
      .trim();
    const patterns = [
      /\bCited by\s*([\d,]+)/i,
      /被引用(?:次数)?\s*[:：]?\s*([\d,]+)/i,
      /(?:^|\s)引用\s*[:：]?\s*([\d,]+)(?:\s|$)/i,
    ];
    for (const pattern of patterns) {
      const match = normalized.match(pattern);
      if (!match) continue;
      const count = Number.parseInt(match[1].replace(/,/g, ""), 10);
      if (Number.isFinite(count)) return count;
    }
    return null;
  }

  function getScholarCitedCount(result) {
    const anchors = result.querySelectorAll("a");
    for (const anchor of anchors) {
      const count = parseScholarCitationText(anchor.textContent || "");
      if (Number.isFinite(count)) return count;
    }
    return parseScholarCitationText(result.textContent || "");
  }

  function scholarCitationResult(result) {
    const parsed = getScholarCitedCount(result);
    const stored = Number.parseInt(result?.dataset?.pjmScholarCited || "", 10);
    const count = Number.isFinite(parsed) ? parsed : stored;
    if (!Number.isFinite(count)) return null;
    result.dataset.pjmScholarCited = String(count);
    return { count, source: "Google Scholar" };
  }

  async function hydrateScholarResultFromOpenAlex(result, targetNode, metrics, title, scihubTarget) {
    if (!title || result.dataset.pjmOpenalexHydrated === "1") return;
    result.dataset.pjmOpenalexHydrated = "1";
    try {
      const info = await fetchOpenAlexByTitle(title);
      if (!info || titleSimilarity(title, info.title) < 0.72) return;
      const lookup = lookupJournalWithMatch({ journal: info.journal, issn: info.issn, aliases: [info.journal] });
      const { record, match } = lookup;
      const resolvedTarget = info.doi || scihubTarget;
      if (!record && !resolvedTarget) return;
      const citationResult = scholarCitationResult(result);
      if (metrics) {
        updateMetrics(metrics, record, { scihubTarget: resolvedTarget, citationResult, match, resolvedBy: "OpenAlex", root: result });
      } else {
        insertMetrics(targetNode, record, { scihubTarget: resolvedTarget, citationResult, match, resolvedBy: "OpenAlex" });
      }
    } catch {
      // Keep the locally parsed result when OpenAlex title resolution fails.
    }
  }

  async function hydrateResultFromCrossref(container, targetNode, metrics, title, currentTarget = "", currentRecord = null, currentMatch = null, currentCitationResult = null) {
    const currentDoi = normalizeDoi(currentTarget);
    if ((!title && !currentDoi) || (currentDoi && currentRecord) || container.dataset.pjmCrossrefHydrated === "1") return;
    container.dataset.pjmCrossrefHydrated = "1";
    try {
      const info = currentDoi ? await fetchCrossrefByDoi(currentDoi) : await fetchCrossrefByTitle(title);
      if (!info || !info.doi) return;
      if (!currentDoi && info.similarity < 0.82) return;
      const lookup = lookupJournalWithMatch({ journal: info.journal, issn: info.issn, aliases: [info.journal] });
      const record = lookup.record || currentRecord;
      const match = lookup.match || currentMatch;
      const resolvedDoi = info.doi || currentDoi;
      if (!record && !resolvedDoi) return;
      const options = {
        scihubTarget: resolvedDoi,
        citationTarget: resolvedDoi,
        citationResult: currentCitationResult,
        statuses: info.status,
        statusSource: "Crossref",
        resolvedBy: "Crossref",
        match,
        root: container,
      };
      if (metrics) updateMetrics(metrics, record, options);
      else insertMetrics(targetNode, record, options);
    } catch {
      // Keep the locally parsed result when Crossref title resolution fails.
    }
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
      .pjm-filterbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        margin: 8px 0 12px;
        padding: 6px 0;
        width: 100%;
        box-sizing: border-box;
        color: #334155;
        font-size: 12px;
      }
      .pjm-filterbar-group {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
      }
      .pjm-filterbar-spacer {
        flex: 0 0 8px;
        height: 1px;
      }
      .pjm-filterbar-pubmed {
        flex-wrap: nowrap;
        margin: 6px 0 18px;
        padding: 6px 8px;
        border: 1px solid #d7dee8;
        border-radius: 4px;
        background: #ffffff;
        box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
        overflow: visible;
      }
      .pjm-filterbar-pubmed .pjm-filterbar-group {
        flex-wrap: nowrap;
        gap: 5px;
        flex: 0 0 auto;
      }
      .pjm-filterbar-pubmed .pjm-filterbar-spacer {
        flex: 1 1 auto;
        min-width: 10px;
      }
      .pjm-filterbar-scholar {
        display: inline-flex;
        width: auto;
        max-width: 100%;
        margin: 8px 0 18px;
        padding: 0;
        gap: 5px;
      }
      .pjm-filterbar-scholar .pjm-filterbar-group {
        gap: 5px;
      }
      .pjm-filterbar-scholar .pjm-filterbar-spacer {
        flex: 0 0 1px;
        width: 1px;
        height: 20px;
        margin: 0 6px;
        background: #e5e7eb;
      }
      .pjm-filterbar button,
      .pjm-filterbar input {
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        background: #ffffff;
        color: #334155;
        font: inherit;
        line-height: 1.3;
        padding: 3px 7px;
      }
      .pjm-filterbar button {
        cursor: pointer;
        font-weight: 700;
      }
      .pjm-filterbar button.pjm-active {
        border-color: #2563eb;
        background: #eff6ff;
        color: #1d4ed8;
      }
      .pjm-selected-count {
        display: inline-flex;
        align-items: center;
        min-height: 24px;
        padding: 2px 7px;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        background: #f8fafc;
        color: #64748b;
        font-weight: 700;
        line-height: 18px;
        white-space: nowrap;
      }
      .pjm-selected-count-active {
        border-color: #7c3aed;
        background: #f5f3ff;
        color: #5b21b6;
      }
      .pjm-more-wrap {
        position: relative;
        display: inline-flex;
      }
      .pjm-filterbar label {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin: 0;
        white-space: nowrap;
        font-weight: 700;
      }
      .pjm-filterbar input[type="number"] {
        width: 70px;
        height: 27px;
        box-sizing: border-box;
        padding: 2px 5px;
      }
      .pjm-filterbar-pubmed input[type="number"] {
        width: 52px;
      }
      .pjm-filterbar-pubmed button,
      .pjm-filterbar-pubmed input[type="number"] {
        padding: 2px 6px;
        line-height: 18px;
      }
      .pjm-filterbar-pubmed label {
        gap: 3px;
      }
      .pjm-filterbar-scholar button,
      .pjm-filterbar-scholar input[type="number"] {
        min-width: 0 !important;
        min-height: 0 !important;
        height: 24px !important;
        border-radius: 4px;
        font-size: 12px !important;
        line-height: 18px !important;
        padding: 2px 8px !important;
      }
      .pjm-filterbar-scholar input[type="number"] {
        width: 48px !important;
        padding: 2px 4px !important;
      }
      .pjm-filterbar-scholar label {
        gap: 3px;
        font-size: 12px;
        line-height: 24px;
      }
      @media (max-width: 700px) {
        .pjm-filterbar-pubmed .pjm-filterbar-spacer {
          display: none;
        }
      }
      .pjm-filter-hidden {
        display: none !important;
      }
      .pjm-filter-dim {
        opacity: 0.38;
      }
      .pjm-filter-hit {
        border-left: 3px solid #2563eb;
        padding-left: 8px;
      }
      .pjm-scholar-select {
        display: inline-flex;
        align-items: center;
        margin-right: 6px;
        vertical-align: middle;
      }
      .pjm-scholar-select input {
        width: 14px;
        height: 14px;
        margin: 0;
      }
      .pjm-abstract-expanded {
        display: block !important;
        margin-top: 4px;
      }
      .pjm-chip {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        box-sizing: border-box !important;
        height: 22px !important;
        min-height: 22px !important;
        max-height: 22px !important;
        border-width: 1px !important;
        border-style: solid !important;
        border-color: #cbd5e1;
        border-radius: 4px !important;
        padding: 0 7px !important;
        margin: 0 !important;
        background: #f8fafc;
        color: #334155;
        font-family: Arial, sans-serif !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        line-height: 20px !important;
        white-space: nowrap;
        text-decoration: none !important;
        text-shadow: none !important;
        vertical-align: baseline !important;
      }
      button.pjm-chip {
        appearance: none !important;
        cursor: pointer;
        transition: filter 0.12s ease !important;
      }
      button.pjm-chip:hover {
        filter: brightness(0.96);
      }
      a.pjm-chip {
        transition: filter 0.12s ease, background 0.12s ease, color 0.12s ease !important;
      }
      .pjm-chip:focus-visible {
        outline: 2px solid #2563eb !important;
        outline-offset: 1px !important;
      }
      .pjm-hidden-by-setting {
        display: none !important;
      }
      .pjm-chip strong {
        margin-right: 3px;
        color: #475569;
        font-weight: 700;
        line-height: 20px !important;
      }
      .pjm-neutral {
        border-color: #94a3b8 !important;
        background: #f1f5f9 !important;
        color: #334155 !important;
      }
      .pjm-neutral strong {
        color: #334155 !important;
      }
      .pjm-q1, .pjm-b1 { border-color: #ef4444 !important; background: #fff1f2 !important; color: #991b1b !important; }
      .pjm-q2, .pjm-b2 { border-color: #f59e0b !important; background: #fffbeb !important; color: #92400e !important; }
      .pjm-q3, .pjm-b3 { border-color: #22c55e !important; background: #f0fdf4 !important; color: #166534 !important; }
      .pjm-q4, .pjm-b4 { border-color: #94a3b8 !important; background: #f1f5f9 !important; color: #475569 !important; }
      .pjm-top { border-color: #2563eb !important; background: #eff6ff !important; color: #1d4ed8 !important; }
      .pjm-warning { border-color: #dc2626 !important; background: #fef2f2 !important; color: #991b1b !important; }
      .pjm-check { border-color: #f59e0b !important; background: #fffbeb !important; color: #92400e !important; }
      .pjm-fix-journal { border-color: #64748b !important; background: #f8fafc !important; color: #334155 !important; }
      .pjm-risk {
        border-color: #dc2626 !important;
        background: #fef2f2 !important;
        color: #991b1b !important;
        text-decoration: none !important;
      }
      .pjm-risk.pjm-loading {
        display: none;
      }
      .pjm-pubpeer {
        border-color: #64748b !important;
        background: #f8fafc !important;
        color: #334155 !important;
        text-decoration: none !important;
      }
      .pjm-update {
        border-color: #0ea5e9 !important;
        background: #f0f9ff !important;
        color: #075985 !important;
      }
      .pjm-update.pjm-loading {
        display: none;
      }
      .pjm-cited { border-color: #7c3aed !important; background: #f5f3ff !important; color: #5b21b6 !important; }
      .pjm-cited.pjm-loading { border-color: #c4b5fd !important; background: #faf5ff !important; color: #7e22ce !important; }
      .pjm-cited.pjm-failed { border-color: #cbd5e1 !important; background: #f8fafc !important; color: #64748b !important; }
      .pjm-muted { color: #64748b; font-weight: 500; }
      .pjm-scihub {
        border-color: #0f766e !important;
        background: #ecfdf5 !important;
        color: #0f766e !important;
        text-decoration: none !important;
      }
      .pjm-unpaywall {
        border-color: #d97706 !important;
        background: #fff7ed !important;
        color: #9a3412 !important;
        text-decoration: none !important;
      }
      .pjm-unpaywall.pjm-oa {
        border-color: #16a34a !important;
        background: #f0fdf4 !important;
        color: #166534 !important;
      }
      .pjm-unpaywall.pjm-closed {
        border-color: #94a3b8 !important;
        background: #f8fafc !important;
        color: #64748b !important;
      }
      .pjm-unpaywall.pjm-unknown {
        border-color: #cbd5e1 !important;
        background: #f8fafc !important;
        color: #475569 !important;
      }
      .pjm-unpaywall.pjm-pdf {
        border-color: #dc2626 !important;
        background: #fef2f2 !important;
        color: #991b1b !important;
      }
      .pjm-scihub:hover {
        background: #ccfbf1 !important;
        color: #115e59 !important;
      }
      .pjm-unpaywall:hover {
        background: #ffedd5 !important;
        color: #7c2d12 !important;
      }
      a.pjm-pubpeer:hover,
      a.pjm-risk:hover {
        filter: brightness(0.97);
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

  function metricChip(label, value, className, record, match) {
    if (value === undefined || value === null || value === "") return "";
    const title = journalMetricDetails(record, match);
    const toneClass = className || "pjm-neutral";
    return `<button type="button" class="pjm-chip pjm-detail-chip ${toneClass}" title="${escapeHtml(title)}"><strong>${escapeHtml(label)}</strong>${escapeHtml(value)}</button>`;
  }

  function pubpeerUrl(target) {
    const doi = normalizeDoi(target);
    const pmid = normalizePmid(target);
    if (doi) return `https://pubpeer.com/search?q=${encodeURIComponent(doi)}`;
    if (pmid) return `https://pubpeer.com/search?q=${encodeURIComponent(`PMID:${pmid}`)}`;
    return "";
  }

  function scihubChip(target) {
    const url = buildScihubUrl(target);
    if (!url) return "";
    return `<a class="pjm-chip pjm-scihub" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" title="Open via Sci-Hub">${escapeHtml("Sci-Hub")}</a>`;
  }

  function unpaywallChip(target) {
    const url = buildUnpaywallUrl(target);
    if (!url) return "";
    return `<a class="pjm-chip pjm-unpaywall pjm-loading" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" data-pjm-unpaywall-target="${escapeHtml(target)}" title="Checking OA status via Unpaywall">${escapeHtml("OA...")}</a>`;
  }

  function citedChip(target, result = null) {
    if (result && Number.isFinite(result.count)) {
      return `<span class="pjm-chip pjm-cited" title="${escapeHtml(citationResultTitle(result))}"><strong>Cited</strong>${escapeHtml(String(result.count))}</span>`;
    }
    if (!target) return "";
    return `<span class="pjm-chip pjm-cited pjm-loading" data-pjm-citation-target="${escapeHtml(target)}" title="Checking citation count"><strong>Cited</strong>...</span>`;
  }

  function pubpeerChip(target) {
    const url = pubpeerUrl(target);
    if (!url) return "";
    return `<a class="pjm-chip pjm-pubpeer" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" title="Search this paper on PubPeer">${escapeHtml("PubPeer")}</a>`;
  }

  function riskChip(target) {
    if (!normalizePmid(target)) return "";
    return `<a class="pjm-chip pjm-risk pjm-loading" href="https://pubmed.ncbi.nlm.nih.gov/${escapeHtml(normalizePmid(target))}/" target="_blank" rel="noopener noreferrer" data-pjm-risk-target="${escapeHtml(target)}" title="Checking PubMed publication status">${escapeHtml("Status...")}</a>`;
  }

  function statusChip(statuses = [], source = "") {
    const status = asArray(statuses).find(Boolean);
    if (!status) return "";
    const className = /retraction|retracted/i.test(status) ? "pjm-risk" : "pjm-update";
    const title = source ? `${status} status from ${source}` : `${status} status`;
    return `<span class="pjm-chip ${className}" title="${escapeHtml(title)}">${escapeHtml(status)}</span>`;
  }

  function crossrefStatusChip(target) {
    if (!normalizeDoi(target)) return "";
    return `<span class="pjm-chip pjm-update pjm-loading" data-pjm-crossref-status-target="${escapeHtml(target)}" title="Checking Crossref update status">${escapeHtml("Update...")}</span>`;
  }

  function checkChip(match) {
    if (match?.confidence !== "low") return "";
    return `<button type="button" class="pjm-chip pjm-check pjm-detail-chip" title="${escapeHtml(`Low-confidence match. ${matchDescription(match)}`)}">${escapeHtml("Check")}</button>`;
  }

  function fixJournalChip(query, resolvedBy = "") {
    if (!query) return "";
    const source = firstText(query.journal, query.abbrev, ...(query.aliases || []));
    const note = resolvedBy ? `; ${resolvedBy} resolved DOI/title only` : "";
    return `<button type="button" class="pjm-chip pjm-fix-journal" title="${escapeHtml(`Set a local journal alias for this result${source ? ` (${source})` : ""}${note}`)}">${escapeHtml("Fix")}</button>`;
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
      const casValue = casLabel(record);
      parts.push(
        metricChip("IF", record.if || record.impactFactor || record.IF, "", record, options.match),
        metricChip("JCR", record.jcr || record.jcrQuartile, quartileClass(record.jcr || record.jcrQuartile), record, options.match),
        metricChip("CAS", casValue, casClass(casValue), record, options.match)
      );

      if (record.casCategory) parts.push(metricChip("大类", record.casCategory, "", record, options.match));
      if (isTop(record)) {
        parts.push(metricChip("", "Top", "pjm-top", record, options.match));
      }
      if (isReview(record)) {
        parts.push(metricChip("", "Review", "", record, options.match));
      }
      if (record.warning) {
        parts.push(chip("预警", record.warning, "pjm-warning"));
      }
      parts.push(checkChip(options.match));
    } else if (options.fixQuery) {
      parts.push(fixJournalChip(options.fixQuery, options.resolvedBy));
    }
    const citationTarget = options.citationTarget || options.scihubTarget;
    if (settingEnabled("showCited") && (citationTarget || options.citationResult)) {
      parts.push(citedChip(citationTarget, options.citationResult));
    }
    if (settingEnabled("showRisk") && (citationTarget || options.citationResult)) {
      parts.push(riskChip(citationTarget));
    }
    if (settingEnabled("showCrossrefStatus") && options.statuses?.length) {
      parts.push(statusChip(options.statuses, options.statusSource));
    }
    if (options.scihubTarget) {
      if (settingEnabled("showCrossrefStatus") && !options.statuses?.length) parts.push(crossrefStatusChip(options.scihubTarget));
      if (settingEnabled("showOa")) parts.push(unpaywallChip(options.scihubTarget));
      if (settingEnabled("showScihub")) parts.push(scihubChip(options.scihubTarget));
      if (settingEnabled("showPubpeer")) parts.push(pubpeerChip(options.scihubTarget));
    }

    const source = options.showSource && STATE.data?.meta?.updated
      ? `<span class="pjm-muted">data ${escapeHtml(STATE.data.meta.updated)}</span>`
      : "";

    const title = resolutionDescription({ ...options, record });
    return `<span class="${BADGE_CLASS}${options.inline ? " pjm-inline" : ""}" title="${escapeHtml(title)}">${parts.join("")}${source}</span>`;
  }

  function annotateMetrics(metrics, record, target, options = {}) {
    if (!metrics) return;
    metrics.dataset.pjmRecord = record ? JSON.stringify(record) : "";
    metrics.dataset.pjmTarget = String(target || "");
    metrics.dataset.pjmMatch = options.match ? JSON.stringify(options.match) : "";
    metrics.dataset.pjmFixQuery = options.fixQuery ? JSON.stringify(options.fixQuery) : "";
    metrics.dataset.pjmResolvedBy = options.resolvedBy || "";
    if (record?.journal) metrics.dataset.pjmJournal = record.journal;
  }

  function insertMetrics(target, record, options = {}) {
    if (!target || target.querySelector?.(`.${BADGE_CLASS}`)) return;
    if (!record && !options.scihubTarget && !options.citationTarget && !options.citationResult && !options.fixQuery) return;
    const wrapper = document.createElement(options.inline ? "span" : "div");
    wrapper.innerHTML = renderMetrics(record, options);
    const metrics = wrapper.firstElementChild;
    if (!metrics) return;
    annotateMetrics(metrics, record, options.scihubTarget || options.citationTarget, options);

    if (options.after) {
      target.insertAdjacentElement("afterend", metrics);
    } else if (options.prepend) {
      target.prepend(metrics);
    } else {
      target.append(metrics);
    }
    hydrateCitationChips(metrics);
    hydrateUnpaywallChips(metrics);
    hydrateRiskChips(metrics);
    hydrateCrossrefStatusChips(metrics);
    metrics.addEventListener("click", handleMetricsClick);
    applyFilters();
  }

  function updateMetrics(metrics, record, options = {}) {
    if (!metrics) return;
    let resolvedRecord = record;
    let resolvedMatch = options.match;
    let resolvedFixQuery = options.fixQuery;
    if (!resolvedRecord && metrics.dataset.pjmRecord) {
      try {
        resolvedRecord = JSON.parse(metrics.dataset.pjmRecord);
        resolvedMatch = resolvedMatch || (metrics.dataset.pjmMatch ? JSON.parse(metrics.dataset.pjmMatch) : null);
      } catch {
        resolvedRecord = record;
      }
    }
    if (!resolvedFixQuery && metrics.dataset.pjmFixQuery) {
      try {
        resolvedFixQuery = JSON.parse(metrics.dataset.pjmFixQuery);
      } catch {
        resolvedFixQuery = options.fixQuery;
      }
    }
    const wrapper = document.createElement("div");
    wrapper.innerHTML = renderMetrics(resolvedRecord, { ...options, match: resolvedMatch, fixQuery: resolvedRecord ? null : resolvedFixQuery });
    const next = wrapper.firstElementChild;
    if (!next) return;
    annotateMetrics(next, resolvedRecord, options.scihubTarget || options.citationTarget, { ...options, match: resolvedMatch, fixQuery: resolvedRecord ? null : resolvedFixQuery });
    metrics.replaceWith(next);
    next.addEventListener("click", handleMetricsClick);
    hydrateCitationChips(options.root || document);
    hydrateUnpaywallChips(options.root || document);
    hydrateRiskChips(options.root || document);
    hydrateCrossrefStatusChips(options.root || document);
    applyFilters();
  }

  function handleMetricsClick(event) {
    const fixNode = event.target.closest(".pjm-fix-journal");
    if (fixNode) {
      event.preventDefault();
      event.stopPropagation();
      openManualAliasPrompt(fixNode.closest(`.${BADGE_CLASS}`));
      return;
    }
    const chipNode = event.target.closest(".pjm-detail-chip");
    if (!chipNode) return;
    event.preventDefault();
    event.stopPropagation();
    openJournalDetail(chipNode.closest(`.${BADGE_CLASS}`), chipNode);
  }

  function applySettingsVisibility(root = document) {
    const settings = { ...defaultSettings(), ...(STATE.settings || {}) };
    root.querySelectorAll?.(".pjm-cited").forEach((node) => node.classList.toggle("pjm-hidden-by-setting", !settings.showCited));
    root.querySelectorAll?.(".pjm-unpaywall").forEach((node) => node.classList.toggle("pjm-hidden-by-setting", !settings.showOa));
    root.querySelectorAll?.(".pjm-scihub").forEach((node) => node.classList.toggle("pjm-hidden-by-setting", !settings.showScihub));
    root.querySelectorAll?.(".pjm-pubpeer").forEach((node) => node.classList.toggle("pjm-hidden-by-setting", !settings.showPubpeer));
    root.querySelectorAll?.(".pjm-risk").forEach((node) => node.classList.toggle("pjm-hidden-by-setting", !settings.showRisk));
    root.querySelectorAll?.(".pjm-update").forEach((node) => node.classList.toggle("pjm-hidden-by-setting", !settings.showCrossrefStatus));
    uiRoot().getElementById("pjm-floating-bar")?.classList.toggle("pjm-hidden-by-setting", !settings.showArticleFloatingBar);
    applyPubmedAbstracts();
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
        chipNode.title = citationResultTitle(result);
      }).catch(() => {
        chipNode.classList.remove("pjm-loading");
        chipNode.classList.add("pjm-failed");
        chipNode.innerHTML = "<strong>Cited</strong>NA";
        chipNode.title = "Citation count unavailable";
      });
    }
  }

  function hydrateUnpaywallChips(root = document) {
    const chips = root.querySelectorAll?.(".pjm-unpaywall[data-pjm-unpaywall-target]") || [];
    for (const chipNode of chips) {
      if (chipNode.dataset.pjmUnpaywallLoaded === "1") continue;
      chipNode.dataset.pjmUnpaywallLoaded = "1";
      const target = chipNode.dataset.pjmUnpaywallTarget;
      fetchUnpaywall(target).then((result) => {
        chipNode.classList.remove("pjm-loading", "pjm-oa", "pjm-closed", "pjm-pdf", "pjm-unknown");
        if (!result) {
          chipNode.classList.add("pjm-unknown");
          chipNode.textContent = "Unknown";
          chipNode.title = "OA status unavailable from Unpaywall";
          return;
        }
        if (result.url) chipNode.href = result.url;
        if (result.hasPdf) {
          chipNode.classList.add("pjm-pdf");
          chipNode.textContent = "PDF";
          chipNode.title = result.hostType
            ? `Open PDF from Unpaywall (${result.hostType})`
            : "Open PDF from Unpaywall";
        } else if (result.isOa) {
          chipNode.classList.add("pjm-oa");
          if (result.hostType === "repository") {
            chipNode.textContent = "Repository";
            chipNode.title = result.repositoryInstitution
              ? `Open repository copy from ${result.repositoryInstitution} via Unpaywall`
              : "Open repository copy via Unpaywall";
          } else {
            chipNode.textContent = "OA";
            chipNode.title = result.status
              ? `Open OA copy via Unpaywall (${result.status})`
              : "Open OA copy via Unpaywall";
          }
        } else {
          chipNode.classList.add("pjm-closed");
          chipNode.textContent = "No OA";
          chipNode.title = "No OA copy found by Unpaywall";
        }
      }).catch(() => {
        chipNode.classList.remove("pjm-loading", "pjm-oa", "pjm-closed", "pjm-pdf");
        chipNode.classList.add("pjm-unknown");
        chipNode.textContent = "Unknown";
        chipNode.title = "Unpaywall lookup failed";
      });
    }
  }

  function hydrateRiskChips(root = document) {
    const chips = root.querySelectorAll?.(".pjm-risk[data-pjm-risk-target]") || [];
    for (const chipNode of chips) {
      if (chipNode.dataset.pjmRiskLoaded === "1") continue;
      chipNode.dataset.pjmRiskLoaded = "1";
      const target = chipNode.dataset.pjmRiskTarget;
      fetchPubmedRisk(target).then((result) => {
        chipNode.classList.remove("pjm-loading");
        if (!result?.label) {
          chipNode.remove();
          return;
        }
        chipNode.textContent = result.label;
        chipNode.title = result.details ? `PubMed status: ${result.details}` : "PubMed publication status";
      }).catch(() => {
        chipNode.remove();
      });
    }
  }

  function hydrateCrossrefStatusChips(root = document) {
    const chips = root.querySelectorAll?.(".pjm-update[data-pjm-crossref-status-target]") || [];
    for (const chipNode of chips) {
      if (chipNode.dataset.pjmCrossrefStatusLoaded === "1") continue;
      chipNode.dataset.pjmCrossrefStatusLoaded = "1";
      const target = chipNode.dataset.pjmCrossrefStatusTarget;
      fetchCrossrefByDoi(target).then((result) => {
        chipNode.classList.remove("pjm-loading");
        const status = result?.status?.[0] || "";
        if (!status) {
          chipNode.remove();
          return;
        }
        chipNode.textContent = status;
        chipNode.classList.toggle("pjm-risk", /retraction|retracted/i.test(status));
        chipNode.classList.toggle("pjm-update", !/retraction|retracted/i.test(status));
        chipNode.title = `Crossref update status: ${result.status.join(", ")}`;
      }).catch(() => {
        chipNode.remove();
      });
    }
  }

  function isGenericResultListHost() {
    return [
      "search.crossref.org",
      "www.semanticscholar.org",
      "openalex.org",
      "europepmc.org",
      "www.researchgate.net",
    ].includes(location.hostname);
  }

  function genericResultItemSelector(options = {}) {
    const selectors = [
      "td.item-data",
      ".result-list-item",
      ".search-result",
      ".search-results-item",
      ".search-result-item",
      ".result-item",
      ".article-result",
      "[data-test='result-item']",
      "[data-testid='result-item']",
      "[data-test-id='result-item']",
      "[data-test-id='paper-row']",
      ".paper",
      ".paper-card",
      ".cl-paper-row",
    ];
    if (options.loose) selectors.push(".result", ".item");
    return selectors.join(",");
  }

  function genericResultItems() {
    const nodes = [...document.querySelectorAll(genericResultItemSelector({ loose: true }))];
    return nodes.filter((node) => !nodes.some((other) => other !== node && other.contains(node)));
  }

  function genericResultListAnchor() {
    if (!isGenericResultListHost()) return null;
    if (location.hostname === "search.crossref.org") {
      return document.querySelector("td.item-data")?.closest("table") || null;
    }
    const first = document.querySelector(genericResultItemSelector());
    if (!first) return null;
    return first.closest("[data-test='search-results'], [data-testid='search-results'], [data-test-id='search-results'], .search-results, .results, .result-list, .results-list, .paper-list, .article-list, main, #main-content") || first;
  }

  function resultListRoot() {
    if (location.hostname === "scholar.google.com") return document.querySelector("#gs_res_ccl_mid") || document.querySelector("#gs_res_ccl") || document.body;
    if (location.hostname === "pubmed.ncbi.nlm.nih.gov") return document.querySelector(".search-results-chunks") || document.querySelector("main") || document.body;
    if (isGenericResultListHost()) return genericResultListAnchor() || document.querySelector("main") || document.body;
    return document.querySelector("main") || document.body;
  }

  function getFilterbarMount() {
    if (location.hostname === "scholar.google.com") return document.querySelector("#gs_res_ccl_top") || document.querySelector("#gs_res_ccl") || document.body;
    return document.querySelector("main") || document.body;
  }

  function placeFilterbar(bar) {
    if (location.hostname === "scholar.google.com") {
      const list = document.querySelector("#gs_res_ccl_mid") || document.querySelector("#gs_res_ccl");
      if (list) {
        list.insertAdjacentElement("beforebegin", bar);
        return;
      }
    }
    if (location.hostname === "pubmed.ncbi.nlm.nih.gov") {
      const list = document.querySelector(".search-results-chunks");
      if (list) {
        list.insertAdjacentElement("beforebegin", bar);
        alignPubmedFilterbar(bar);
        return;
      }
    }
    if (isGenericResultListHost()) {
      const anchor = genericResultListAnchor();
      if (anchor) {
        anchor.insertAdjacentElement("beforebegin", bar);
        return;
      }
    }
    const mount = getFilterbarMount();
    if (mount === document.body || !mount.parentElement) {
      document.body.prepend(bar);
    } else {
      mount.insertAdjacentElement("afterend", bar);
    }
  }

  function alignPubmedFilterbar(bar) {
    if (location.hostname !== "pubmed.ncbi.nlm.nih.gov" || !bar) return;
    const anchor =
      document.querySelector(".search-results-chunks article.full-docsum .docsum-content") ||
      document.querySelector(".search-results-chunks .docsum-content") ||
      document.querySelector(".search-results-chunks article.full-docsum");
    const parent = bar.parentElement;
    if (!anchor || !parent) return;

    const parentRect = parent.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    const targetWidth = Math.round(anchorRect.width);
    if (!parentRect.width || !targetWidth || targetWidth < 320) {
      bar.style.marginLeft = "";
      bar.style.width = "";
      return;
    }

    const left = Math.max(0, Math.round(anchorRect.left - parentRect.left));
    const right = Math.max(0, Math.round(parentRect.right - anchorRect.right));
    bar.style.marginLeft = `${left}px`;
    bar.style.width = `calc(100% - ${left + right}px)`;
  }

  function handleToolbarAction(action) {
    if (!action) return;
    if (action === "reset") {
      saveFilters(defaultFilters());
      syncFilterbar();
      applyFilters();
    } else if (action === "export-ris") {
      exportCurrentPage("ris", { scope: "visible" });
    } else if (action === "export-bibtex") {
      exportCurrentPage("bibtex", { scope: "visible" });
    } else if (action === "export-selected-ris") {
      exportCurrentPage("ris", { scope: "selected" });
    } else if (action === "export-selected-bibtex") {
      exportCurrentPage("bibtex", { scope: "selected" });
    } else if (action === "export-selected-csv") {
      exportCurrentPage("csv", { scope: "selected" });
    } else if (action === "export-selected-markdown") {
      exportCurrentPage("markdown", { scope: "selected" });
    } else if (action === "copy-doi") {
      exportCurrentPage("doi", { scope: "visible" });
    } else if (action === "copy-cite") {
      exportCurrentPage("cite", { scope: "visible" });
    } else if (action === "toggle-abstracts") {
      saveSettings({ ...STATE.settings, pubmedAbstracts: !STATE.settings?.pubmedAbstracts });
      syncFilterbar();
      applyPubmedAbstracts();
    } else if (action === "settings") {
      openSettingsPanel();
    }
  }

  function ensureFilterbar() {
    if (!isResultListPage()) return;
    const existing = document.getElementById("pjm-filterbar");
    if (existing) {
      alignPubmedFilterbar(existing);
      return;
    }
    if (isGenericResultListHost() && !genericResultListAnchor()) return;
    const bar = document.createElement("div");
    bar.id = "pjm-filterbar";
    const classNames = ["pjm-filterbar"];
    if (location.hostname === "pubmed.ncbi.nlm.nih.gov") classNames.push("pjm-filterbar-pubmed");
    if (location.hostname === "scholar.google.com") classNames.push("pjm-filterbar-scholar");
    bar.className = classNames.join(" ");
    bar.innerHTML = `
      <span class="pjm-filterbar-group">
        <button type="button" data-pjm-filter="q1" title="Highlight JCR Q1 journals">Q1</button>
        <button type="button" data-pjm-filter="cas1" title="Highlight CAS zone 1 journals">CAS 1区</button>
        <button type="button" data-pjm-filter="top" title="Highlight Top journals">Top</button>
        <button type="button" data-pjm-filter="hideNonMatching" title="Hide results that do not match active filters">Hide</button>
        <label title="Set the minimum impact factor">IF >= <input type="number" step="0.1" min="0" data-pjm-filter="minIf" title="Minimum impact factor"></label>
      </span>
      <span class="pjm-filterbar-spacer" aria-hidden="true"></span>
      <span class="pjm-filterbar-group">
        <span class="pjm-more-wrap">
          <button type="button" data-pjm-action="more" data-pjm-owner="filterbar" title="More tools">More</button>
        </span>
        <span class="pjm-selected-count" data-pjm-selected-count title="Selected records">Selected 0</span>
      </span>
    `;
    bar.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      const filter = button.dataset.pjmFilter;
      const action = button.dataset.pjmAction;
      if (filter) {
        saveFilters({ ...STATE.filters, [filter]: !STATE.filters?.[filter] });
        syncFilterbar();
        applyFilters();
      } else if (action === "reset") {
        handleToolbarAction(action);
      } else if (action === "more") {
        openMorePopover(button);
      } else if (action) {
        handleToolbarAction(action);
        closeMorePopover();
      }
    });
    bar.addEventListener("input", (event) => {
      const input = event.target.closest("input[data-pjm-filter='minIf']");
      if (!input) return;
      saveFilters({ ...STATE.filters, minIf: input.value });
      applyFilters();
    });
    placeFilterbar(bar);
    syncFilterbar();
    updateSelectedCount();
  }

  function syncFilterbar() {
    const bar = document.getElementById("pjm-filterbar");
    if (!bar) return;
    const filters = STATE.filters || defaultFilters();
    for (const key of ["q1", "cas1", "top", "hideNonMatching"]) {
      bar.querySelector(`[data-pjm-filter="${key}"]`)?.classList.toggle("pjm-active", Boolean(filters[key]));
    }
    bar.querySelector("[data-pjm-action='toggle-abstracts']")?.classList.toggle("pjm-active", Boolean(STATE.settings?.pubmedAbstracts));
    const input = bar.querySelector("input[data-pjm-filter='minIf']");
    if (input && input.value !== String(filters.minIf || "")) input.value = filters.minIf || "";
    updateSelectedCount();
  }

  function selectedResultCount() {
    if (!isResultListPage()) return 0;
    const items = new Set();
    for (const metrics of document.querySelectorAll(`.${BADGE_CLASS}`)) {
      const item = resultItemForMetrics(metrics);
      if (isSelectedResultItem(item)) items.add(item);
    }
    return items.size;
  }

  function updateSelectedCount() {
    const node = document.querySelector("[data-pjm-selected-count]");
    if (!node) return;
    const count = selectedResultCount();
    node.textContent = `Selected ${count}`;
    node.classList.toggle("pjm-selected-count-active", count > 0);
  }

  function metricsMatchFilters(metrics) {
    const filters = STATE.filters || defaultFilters();
    if (!filters.q1 && !filters.cas1 && !filters.top && !filters.minIf) return true;
    let record = null;
    try {
      record = JSON.parse(metrics.dataset.pjmRecord || "null");
    } catch {
      record = null;
    }
    if (!record) return false;
    if (filters.q1 && !isQ1(record)) return false;
    if (filters.cas1 && !isCas1(record)) return false;
    if (filters.top && !isTop(record)) return false;
    if (filters.minIf) {
      const min = Number.parseFloat(filters.minIf);
      const value = impactFactorValue(record);
      if (Number.isFinite(min) && (value === null || value < min)) return false;
    }
    return true;
  }

  function resultItemForMetrics(metrics) {
    if (location.hostname === "pubmed.ncbi.nlm.nih.gov") {
      return metrics.closest("article.full-docsum")
        || metrics.closest(".docsum-content")?.closest("article.full-docsum")
        || metrics.closest(".docsum-content")
        || metrics.parentElement;
    }
    if (location.hostname === "scholar.google.com") {
      return metrics.closest(".gs_r.gs_or")
        || metrics.closest(".gs_ri")?.closest(".gs_r.gs_or")
        || metrics.closest(".gs_ri")
        || metrics.parentElement;
    }
    return metrics.closest(`.gs_r.gs_or, article.full-docsum, ${genericResultItemSelector({ loose: true })}`)
      || metrics.closest(".docsum-content")?.closest("article.full-docsum")
      || metrics.closest(".docsum-content")
      || metrics.parentElement;
  }

  function isSelectedResultItem(item) {
    if (!item) return false;
    if (location.hostname === "scholar.google.com") {
      return Boolean(item.querySelector(".pjm-scholar-select input[type='checkbox']")?.checked);
    }
    if (location.hostname === "pubmed.ncbi.nlm.nih.gov") {
      return Boolean(item.querySelector("input[type='checkbox']:checked"));
    }
    return Boolean(item.querySelector("input[type='checkbox']:checked"));
  }

  function applyFilters() {
    if (!isResultListPage()) return;
    const root = resultListRoot();
    const filters = STATE.filters || defaultFilters();
    for (const item of root.querySelectorAll(".pjm-filter-hidden, .pjm-filter-dim, .pjm-filter-hit")) {
      item.classList.remove("pjm-filter-hidden", "pjm-filter-dim", "pjm-filter-hit");
    }
    if (!filters.q1 && !filters.cas1 && !filters.top && !filters.minIf) return;
    for (const metrics of root.querySelectorAll(`.${BADGE_CLASS}`)) {
      const item = resultItemForMetrics(metrics);
      if (!item) continue;
      const matched = metricsMatchFilters(metrics);
      item.classList.toggle("pjm-filter-hit", matched);
      item.classList.toggle(filters.hideNonMatching ? "pjm-filter-hidden" : "pjm-filter-dim", !matched);
    }
  }

  function pubmedSnippetForArticle(article) {
    return article?.querySelector?.(".full-view-snippet, .docsum-snippet, .labs-docsum-snippet, .snippet, [class*='snippet']");
  }

  function applyPubmedAbstracts() {
    if (location.hostname !== "pubmed.ncbi.nlm.nih.gov") return;
    const enabled = Boolean(STATE.settings?.pubmedAbstracts);
    for (const article of document.querySelectorAll("article.full-docsum, .docsum-content")) {
      const snippet = pubmedSnippetForArticle(article);
      if (!snippet) continue;
      snippet.classList.toggle("pjm-abstract-expanded", enabled);
    }
  }

  function currentPageItems(options = {}) {
    const metricsNodes = [...document.querySelectorAll(`.${BADGE_CLASS}`)];
    const scope = options.scope || "all";
    return metricsNodes.filter((metrics) => {
      const item = resultItemForMetrics(metrics);
      if (scope === "visible") return !item || isVisibleNode(item);
      if (scope === "filtered") return item?.classList.contains("pjm-filter-hit");
      if (scope === "selected") return isSelectedResultItem(item);
      return true;
    }).map((metrics, index) => {
      const item = resultItemForMetrics(metrics);
      let record = null;
      try {
        record = JSON.parse(metrics.dataset.pjmRecord || "null");
      } catch {
        record = null;
      }
      const title = firstText(
        item?.querySelector?.(".gs_rt")?.textContent,
        item?.querySelector?.(".docsum-title")?.textContent,
        item?.querySelector?.(".lead")?.textContent,
        item?.querySelector?.(".title, .paper-title, .cl-paper-title, [data-test='title'], [data-test-id='title']")?.textContent,
        item?.querySelector?.("h1, h2, h3")?.textContent,
        document.querySelector("h1")?.textContent
      ).replace(/^(?:\[[^\]]+\]\s*)+/, "").trim();
      const meta = item?.querySelector?.(".gs_a, .docsum-journal-citation, .docsum-citation")?.textContent || "";
      const doi = normalizeDoi(metrics.dataset.pjmTarget || getArticleDoi(item || document));
      const pmid = getPubmedId(item || document);
      return {
        index,
        title,
        journal: record?.journal || metrics.dataset.pjmJournal || maybeJournalFromScholarMeta(meta),
        year: (meta.match(/\b(19|20)\d{2}\b/) || [])[0] || "",
        doi,
        pmid,
        url: item?.querySelector?.("a[href]")?.href || location.href,
        record,
        metrics,
      };
    }).filter((item) => item.title || item.doi || item.pmid || item.journal);
  }

  function risEscape(value) {
    return String(value || "").replace(/\r?\n+/g, " ").trim();
  }

  function fallbackRis(item) {
    const lines = ["TY  - JOUR"];
    if (item.title) lines.push(`TI  - ${risEscape(item.title)}`);
    if (item.journal) lines.push(`JO  - ${risEscape(item.journal)}`);
    if (item.year) lines.push(`PY  - ${risEscape(item.year)}`);
    if (item.doi) lines.push(`DO  - ${risEscape(item.doi)}`);
    if (item.pmid) lines.push(`ID  - PMID:${risEscape(item.pmid)}`);
    if (item.url) lines.push(`UR  - ${risEscape(item.url)}`);
    lines.push("ER  -");
    return lines.join("\n");
  }

  function bibKey(item) {
    const base = normalizeKey(item.title || item.journal || item.doi || `item-${item.index + 1}`)
      .split(" ")
      .slice(0, 5)
      .join("")
      .toLowerCase();
    return base || `item${item.index + 1}`;
  }

  function fallbackBibtex(item) {
    const fields = [];
    if (item.title) fields.push(`  title = {${item.title}}`);
    if (item.journal) fields.push(`  journal = {${item.journal}}`);
    if (item.year) fields.push(`  year = {${item.year}}`);
    if (item.doi) fields.push(`  doi = {${item.doi}}`);
    if (item.url) fields.push(`  url = {${item.url}}`);
    return `@article{${bibKey(item)},\n${fields.join(",\n")}\n}`;
  }

  function csvEscape(value) {
    return `"${String(value || "").replace(/"/g, '""')}"`;
  }

  function markdownCell(value) {
    return String(value || "").replace(/\|/g, "\\|").replace(/\r?\n+/g, " ").trim();
  }

  function chipText(item, selector) {
    return String(item?.metrics?.querySelector?.(selector)?.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function selectedExportRows(items) {
    return items.map((item) => ({
      title: item.title,
      journal: item.journal,
      year: item.year,
      doi: item.doi,
      pmid: item.pmid,
      ifValue: item.record?.if || item.record?.impactFactor || item.record?.IF || "",
      jcr: item.record?.jcr || item.record?.jcrQuartile || "",
      cas: item.record?.cas || "",
      cited: chipText(item, ".pjm-cited").replace(/^Cited\s*/i, ""),
      oa: chipText(item, ".pjm-unpaywall"),
      url: item.url,
    }));
  }

  function itemCitationText(item) {
    const pieces = [];
    if (item.title) pieces.push(item.title.replace(/\.$/, ""));
    if (item.journal) pieces.push(item.journal);
    if (item.year) pieces.push(item.year);
    if (item.doi) pieces.push(`doi: ${item.doi}`);
    else if (item.pmid) pieces.push(`PMID: ${item.pmid}`);
    return pieces.join(". ") + (pieces.length ? "." : "");
  }

  function exportPlainItems(items, format) {
    if (format === "doi") return unique(items.map((item) => item.doi)).join("\n");
    if (format === "pmid") return unique(items.map((item) => item.pmid)).join("\n");
    if (format === "csv") {
      const rows = [["Title", "Journal", "Year", "DOI", "PMID", "IF", "JCR", "CAS", "Cited", "OA", "URL"]];
      for (const item of selectedExportRows(items)) {
        rows.push([
          item.title,
          item.journal,
          item.year,
          item.doi,
          item.pmid,
          item.ifValue,
          item.jcr,
          item.cas,
          item.cited,
          item.oa,
          item.url,
        ]);
      }
      return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    }
    if (format === "markdown") {
      const lines = ["| Title | Journal | Year | IF | JCR | CAS | Cited | OA | DOI | URL |", "|---|---|---:|---:|---|---|---:|---|---|---|"];
      for (const item of selectedExportRows(items)) {
        lines.push(`| ${markdownCell(item.title)} | ${markdownCell(item.journal)} | ${markdownCell(item.year)} | ${markdownCell(item.ifValue)} | ${markdownCell(item.jcr)} | ${markdownCell(item.cas)} | ${markdownCell(item.cited)} | ${markdownCell(item.oa)} | ${markdownCell(item.doi)} | ${markdownCell(item.url)} |`);
      }
      return lines.join("\n");
    }
    if (format === "cite") return items.map(itemCitationText).filter(Boolean).join("\n");
    return "";
  }

  async function exportCurrentPage(format, options = {}) {
    const items = currentPageItems(options);
    if (!items.length) {
      window.alert("No Journal Metrics items found on this page.");
      return;
    }

    if (["doi", "pmid", "csv", "markdown", "cite"].includes(format)) {
      const text = exportPlainItems(items, format);
      if (!text) {
        window.alert(`No ${format.toUpperCase()} data found on this page.`);
        return;
      }
      if (typeof GM_setClipboard === "function") {
        GM_setClipboard(text, "text");
        window.alert(`Copied ${items.length} ${format.toUpperCase()} records.`);
      } else {
        window.prompt(`Copy ${format.toUpperCase()} records`, text);
      }
      return;
    }

    const chunks = [];
    for (const item of items) {
      if (item.doi) {
        const accept = format === "ris" ? "application/x-research-info-systems" : "application/x-bibtex";
        try {
          const citation = await loadTextViaGm(`https://doi.org/${encodeURI(item.doi)}`, { Accept: accept });
          chunks.push(citation.trim() || (format === "ris" ? fallbackRis(item) : fallbackBibtex(item)));
          continue;
        } catch {
          // Fall back to locally generated citation text.
        }
      }
      chunks.push(format === "ris" ? fallbackRis(item) : fallbackBibtex(item));
    }
    const text = chunks.join(format === "ris" ? "\n\n" : "\n\n");
    if (typeof GM_setClipboard === "function") {
      GM_setClipboard(text, "text");
      window.alert(`Copied ${items.length} ${format.toUpperCase()} records.`);
    } else {
      window.prompt(`Copy ${format.toUpperCase()} records`, text);
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
      const lookup = lookupJournalWithMatch({ abbrev, journal: abbrev });
      const { record, match } = lookup;
      const scihubTarget = getScihubTarget(article);
      const citationTarget = getPubmedId(article) || scihubTarget;
      const citationContainer = article.querySelector(".docsum-citation") || journalNode?.parentElement || article;
      insertMetrics(citationContainer, record, { scihubTarget, citationTarget, match, fixQuery: { journal: abbrev, abbrev, aliases: [journalNode?.textContent || ""] } });
    }
    applyPubmedAbstracts();
  }

  function processGoogleScholarResults() {
    if (location.hostname !== "scholar.google.com") return;
    const results = document.querySelectorAll(".gs_r.gs_or");
    for (const result of results) {
      if (result.dataset.pjmProcessed === "1") continue;
      const meta = result.querySelector(".gs_a")?.textContent || "";
      const title = getScholarResultTitle(result);
      const doi = getArticleDoi(result);
      const journal = maybeJournalFromScholarMeta(meta);
      const lookup = lookupJournalWithMatch({ journal, abbrev: journal, aliases: [meta, title] });
      const { record, match } = lookup;
      if (!record && !doi && !title) continue;
      result.dataset.pjmProcessed = "1";
      const target = result.querySelector(".gs_ri") || result;
      ensureScholarSelection(result, target);
      const citationResult = scholarCitationResult(result);
      const fixQuery = { journal, abbrev: journal, aliases: [meta, title] };
      insertMetrics(target, record, { scihubTarget: doi, citationResult, match, fixQuery });
      const metrics = target.querySelector(`.${BADGE_CLASS}`);
      hydrateScholarResultFromOpenAlex(result, target, metrics, title, doi);
      hydrateResultFromCrossref(result, target, metrics, title, doi, record, match, citationResult);
    }
  }

  function ensureScholarSelection(result, target) {
    if (!result || !target || target.querySelector(".pjm-scholar-select")) return;
    const titleNode = target.querySelector(".gs_rt") || target.firstElementChild || target;
    const label = document.createElement("label");
    label.className = "pjm-scholar-select";
    label.title = "Select for export";
    label.innerHTML = '<input type="checkbox" data-pjm-scholar-selected="1">';
    label.querySelector("input")?.addEventListener("change", updateSelectedCount);
    titleNode.insertAdjacentElement("afterbegin", label);
  }

  function processGenericResultLists() {
    if (!isGenericResultListHost()) return;

    const items = genericResultItems();
    for (const item of items) {
      if (item.dataset.pjmProcessed === "1") continue;
      const doi = getArticleDoi(item);
      const journal = firstText(
        crossrefResultJournal(item),
        item.querySelector("[data-test='journal-title']")?.textContent,
        item.querySelector("[data-testid='journal-title']")?.textContent,
        item.querySelector(".journal-title")?.textContent,
        item.querySelector(".journalTitle")?.textContent,
        item.querySelector(".publication-title")?.textContent,
        item.querySelector(".source-title")?.textContent,
        item.querySelector(".source")?.textContent,
        item.querySelector(".venue")?.textContent,
        item.querySelector(".journal")?.textContent
      );
      const title = firstText(item.querySelector("h1, h2, h3, .title, .paper-title, [data-test='title'], [data-testid='title']")?.textContent);
      const lookup = lookupJournalWithMatch({ journal, abbrev: journal, aliases: [title] });
      const { record, match } = lookup;
      if (!record && !doi) continue;
      item.dataset.pjmProcessed = "1";
      insertMetrics(item, record, { scihubTarget: doi, match, fixQuery: { journal, abbrev: journal, aliases: [title] } });
      hydrateResultFromCrossref(item, item, item.querySelector(`.${BADGE_CLASS}`), title, doi, record, match);
    }
  }

  function crossrefResultJournal(item) {
    if (location.hostname !== "search.crossref.org") return "";
    for (const span of item.querySelectorAll("p.extra span")) {
      const text = (span.textContent || "").replace(/\s+/g, " ").trim();
      if (!/^in\b/i.test(text)) continue;
      return firstText(span.querySelector("b")?.textContent, text.replace(/^in\s+/i, ""));
    }
    return "";
  }

  function isResultListPage() {
    if (location.hostname === "scholar.google.com") return true;
    if (location.hostname === "www.semanticscholar.org" && location.pathname.startsWith("/search")) return true;
    if (location.hostname === "search.crossref.org" && location.pathname.startsWith("/search/works")) return true;
    if (location.hostname === "europepmc.org" && location.pathname.startsWith("/search")) return true;
    if (location.hostname === "openalex.org" && location.pathname.startsWith("/search")) return true;
    if (location.hostname === "pubmed.ncbi.nlm.nih.gov" && document.querySelector("article.full-docsum, .docsum-content")) return true;
    return false;
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
      aliases: [ariaJournal, getMetaContent("citation_title"), document.querySelector("h1")?.textContent],
    };
  }

  function processArticlePage() {
    if (location.hostname !== "pubmed.ncbi.nlm.nih.gov") return;
    const lookup = lookupJournalWithMatch(getArticlePageQuery());
    const { record, match } = lookup;
    if (!record) return;

    const citationBlocks = document.querySelectorAll(".article-citation");
    for (const block of citationBlocks) {
      if (block.dataset.pjmProcessed === "1") continue;
      block.dataset.pjmProcessed = "1";
      const scihubTarget = getScihubTarget(block);
      insertMetrics(block, record, { showSource: true, scihubTarget, citationTarget: getPubmedId(document) || scihubTarget, match });
    }

    const shortCitation = document.querySelector(".short-citation .citation-journal");
    if (shortCitation && shortCitation.dataset.pjmProcessed !== "1") {
      shortCitation.dataset.pjmProcessed = "1";
      const scihubTarget = getScihubTarget(document);
      insertMetrics(shortCitation, record, { inline: true, after: true, scihubTarget, citationTarget: getPubmedId(document) || scihubTarget, match });
    }
  }

  function getGenericArticleQuery() {
    const jsonLd = getJsonLdArticleInfo();
    const visibleJournal = getVisibleJournalTitle();
    const scienceJournal = getScienceJournalFromPath();
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
      journal: journal || jsonLd.journal || scienceJournal || visibleJournal,
      abbrev,
      issn: issn || jsonLd.issn,
      aliases: [visibleJournal, getMetaContent("citation_publisher"), getMetaContent("prism.publisher"), getMetaContent("citation_title", "dc.Title", "dc.title", "og:title"), document.querySelector("h1")?.textContent],
    };
  }

  function getScienceJournalFromPath() {
    if (location.hostname !== "www.science.org" && location.hostname !== "science.org") return "";
    const path = location.pathname.toLowerCase();
    if (path.includes("/doi/") && path.includes("/sciadv.")) return "SCIENCE ADVANCES";
    if (path.includes("/doi/") && path.includes("/science.")) return "SCIENCE";
    return "";
  }

  function isScienceChallengePage() {
    if (location.hostname !== "www.science.org" && location.hostname !== "science.org") return false;
    return /just a moment/i.test(document.title || "")
      || /^www\.science\.org$/i.test(document.querySelector("h1")?.textContent?.trim() || "");
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
    if (isScienceChallengePage()) return;
    if (isResultListPage()) return;
    if (document.querySelector("article.full-docsum, .docsum-content")) return;

    const query = getGenericArticleQuery();
    const directLookup = lookupJournalWithMatch(query);
    const textLookup = directLookup.record ? { record: null, match: null } : findJournalInTextWithMatch(document.body?.textContent || "");
    const record = directLookup.record || textLookup.record;
    const match = directLookup.match || textLookup.match;
    const scihubTarget = getScihubTarget(document);
    const panel = document.querySelector(".pjm-panel");
    const existingMetrics = panel?.querySelector(`.${BADGE_CLASS}`);

    if (document.body.dataset.pjmGenericProcessed === "1") {
      if (existingMetrics && scihubTarget && existingMetrics.dataset.pjmTarget !== scihubTarget) {
        let previousRecord = null;
        try {
          previousRecord = JSON.parse(existingMetrics.dataset.pjmRecord || "null");
        } catch {
          previousRecord = null;
        }
        updateMetrics(existingMetrics, record || previousRecord, { showSource: true, scihubTarget, match, fixQuery: query, root: panel || document });
      }
      return;
    }

    if (!record && !scihubTarget) return;

    document.body.dataset.pjmGenericProcessed = "1";
    const nextPanel = panel || document.createElement("div");
    nextPanel.className = "pjm-panel";
    if (!panel) findGenericInsertTarget().insertAdjacentElement("afterend", nextPanel);
    insertMetrics(nextPanel, record, { showSource: true, scihubTarget, match, fixQuery: query });
    const title = firstText(getMetaContent("citation_title", "dc.Title", "dc.title", "og:title"), document.querySelector("h1")?.textContent);
    hydrateResultFromCrossref(document.body, nextPanel, nextPanel.querySelector(`.${BADGE_CLASS}`), title, scihubTarget, record, match);
  }

  function ensureFloatingArticleBar() {
    if (isResultListPage() || !settingEnabled("showArticleFloatingBar")) {
      removeUiNode("pjm-floating-bar");
      return;
    }
    const target = getScihubTarget(document);
    const doi = normalizeDoi(target);
    if (!target && !doi) {
      removeUiNode("pjm-floating-bar");
      return;
    }
    const root = uiRoot();
    const bar = root.getElementById("pjm-floating-bar") || document.createElement("div");
    bar.id = "pjm-floating-bar";
    bar.className = "pjm-floating-bar";
    const links = [];
    const oaUrl = doi ? buildUnpaywallUrl(doi) : "";
    const sciUrl = buildScihubUrl(target);
    const peerUrl = pubpeerUrl(target);
    if (settingEnabled("showOa") && oaUrl) links.push(`<a href="${escapeHtml(oaUrl)}" target="_blank" rel="noopener noreferrer" title="Open via Unpaywall">OA</a>`);
    if (settingEnabled("showScihub") && sciUrl) links.push(`<a href="${escapeHtml(sciUrl)}" target="_blank" rel="noopener noreferrer" title="Open via Sci-Hub">Sci-Hub</a>`);
    links.push('<button type="button" data-pjm-floating-cite="1" title="Copy citation">Cite</button>');
    if (settingEnabled("showPubpeer") && peerUrl) links.push(`<a href="${escapeHtml(peerUrl)}" target="_blank" rel="noopener noreferrer" title="Search PubPeer">PubPeer</a>`);
    bar.innerHTML = links.join("");
    bar.onclick = (event) => {
      if (!event.target.closest("[data-pjm-floating-cite]")) return;
      exportCurrentPage("cite", { scope: "visible" });
    };
    if (!bar.parentElement) root.append(bar);
  }

  function processPage() {
    if (!STATE.indexes || STATE.processing) return;
    STATE.processing = true;
    try {
      addStyle();
      ensureFilterbar();
      processSearchResults();
      processGoogleScholarResults();
      processGenericResultLists();
      processArticlePage();
      processGenericArticlePage();
      ensureFloatingArticleBar();
      applyPubmedAbstracts();
      applySettingsVisibility();
      applyFilters();
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
    window.addEventListener("resize", () => {
      closeMorePopover();
      window.clearTimeout(observePageChanges.resizeTimer);
      observePageChanges.resizeTimer = window.setTimeout(() => {
        const bar = document.getElementById("pjm-filterbar");
        alignPubmedFilterbar(bar);
      }, 120);
    });
    document.addEventListener("click", (event) => {
      if (
        event.target.closest(".pjm-more-wrap") ||
        eventPathHas(event, (node) => node.id === "pjm-more-popover" || node.id === "pjm-detail-modal" || node.id === "pjm-settings-modal")
      ) return;
      closeMorePopover();
    });
    document.addEventListener("change", (event) => {
      if (event.target.closest("input[type='checkbox']")) updateSelectedCount();
    });
  }

  async function main() {
    registerMenuCommands();
    const [data, scihubDomains] = await Promise.all([loadData(), loadScihubDomains()]);
    STATE.data = data;
    STATE.scihubDomains = scihubDomains;
    STATE.filters = loadFilters();
    STATE.settings = loadSettings();
    STATE.manualAliases = loadManualAliases();
    STATE.indexes = buildIndexes(STATE.data);
    processPage();
    observePageChanges();
  }

  main().catch((error) => {
    console.error("[Journal Metrics] Failed to initialize:", error);
  });
})();
