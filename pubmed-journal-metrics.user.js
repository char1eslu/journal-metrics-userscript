// ==UserScript==
// @name         PubMed Journal Metrics
// @namespace    https://pubmed.ncbi.nlm.nih.gov/
// @version      0.1.0
// @description  Show journal impact factor, JCR quartile, CAS partition and warning tags on PubMed.
// @author       charles_lu
// @match        https://pubmed.ncbi.nlm.nih.gov/*
// @downloadURL  https://raw.githubusercontent.com/char1eslu/pubmed-journal-metrics-userscript/main/pubmed-journal-metrics.user.js
// @updateURL    https://raw.githubusercontent.com/char1eslu/pubmed-journal-metrics-userscript/main/pubmed-journal-metrics.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      raw.githubusercontent.com
// @connect      gist.githubusercontent.com
// @connect      localhost
// @connect      127.0.0.1
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    embeddedData: null,
    // Replace this with your own raw GitHub/Gist URL after generating a full data file.
    dataUrl: "https://raw.githubusercontent.com/char1eslu/pubmed-journal-metrics-userscript/main/journal-data.json",
    cacheKey: "pubmed-journal-metrics:data:v1",
    cacheTimeKey: "pubmed-journal-metrics:data-time:v1",
    cacheMs: 7 * 24 * 60 * 60 * 1000,
    fallbackData: {
      meta: {
        name: "PubMed Journal Metrics sample data",
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
      console.info("[PubMed Journal Metrics] Using fallback sample data:", error.message);
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
      .pjm-muted { color: #64748b; font-weight: 500; }
    `;
    document.head.appendChild(style);
  }

  function chip(label, value, className = "") {
    if (value === undefined || value === null || value === "") return "";
    return `<span class="pjm-chip ${className}"><strong>${escapeHtml(label)}</strong>${escapeHtml(value)}</span>`;
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
    if (!record) return "";
    const casValue = record.cas ? `${record.cas}区` : "";
    const parts = [
      chip("IF", record.if || record.impactFactor || record.IF),
      chip("JCR", record.jcr || record.jcrQuartile, quartileClass(record.jcr || record.jcrQuartile)),
      chip("CAS", casValue, casClass(casValue)),
    ];

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

    const source = options.showSource && STATE.data?.meta?.updated
      ? `<span class="pjm-muted">data ${escapeHtml(STATE.data.meta.updated)}</span>`
      : "";

    return `<span class="${BADGE_CLASS}${options.inline ? " pjm-inline" : ""}" title="${escapeHtml(record.journal || "")}">${parts.join("")}${source}</span>`;
  }

  function insertMetrics(target, record, options = {}) {
    if (!target || !record || target.querySelector?.(`.${BADGE_CLASS}`)) return;
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
      const citationContainer = article.querySelector(".docsum-citation") || journalNode?.parentElement || article;
      insertMetrics(citationContainer, record);
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
      insertMetrics(block, record, { showSource: true });
    }

    const shortCitation = document.querySelector(".short-citation .citation-journal");
    if (shortCitation && shortCitation.dataset.pjmProcessed !== "1") {
      shortCitation.dataset.pjmProcessed = "1";
      insertMetrics(shortCitation, record, { inline: true, after: true });
    }
  }

  function processPage() {
    if (!STATE.indexes || STATE.processing) return;
    STATE.processing = true;
    try {
      addStyle();
      processSearchResults();
      processArticlePage();
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
    STATE.data = await loadData();
    STATE.indexes = buildIndexes(STATE.data);
    processPage();
    observePageChanges();
  }

  main().catch((error) => {
    console.error("[PubMed Journal Metrics] Failed to initialize:", error);
  });
})();
