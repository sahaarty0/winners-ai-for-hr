# COMPANY X-RAY — Research.gs v3.0
## Winners Business Consultation & Training Services
**Safety-first salary research upgrade | 29 October 2026**

### What is fixed (without redesigning the existing app)
- Removed the automatic **-15%** reduction to externally observed salaries. Public facts are preserved.
- Removed guessed company-size salary premiums, derived most-probable-offer and strong-candidate ranges.
- A single salary page no longer produces a fabricated +/-10% band. At least **3 usable, dated signals** from **2 independent publishers**, matching role, seniority, city and pay basis, are required for an **indicative public range**.
- **P25, P50 and P75 remain null** unless actual survey microdata and auditable methodology exist; search snippets are not a salary survey.
- Prevented Gross, Net, Basic and Total Cash from being mixed; unsupported basis remains context-only.
- Discards untraceable AI-extracted amounts that do not match a number+period in the linked search result, and rejects unrelated roles.
- References with missing/old dates (more than 18 months) do not qualify as CURRENT market evidence.
- Source domains are normalized: regional subdomains do not count as independent publishers; duplicate pages are not separate salary observations.
- Added **evidence_ledger** with source URL, title, reported amount, pay basis, publication date, freshness, geographic match, inclusion, reason and clear "SEARCH_SNIPPET_ONLY" verification level.
- Company details, benefit claims and employee-feedback themes now require appropriate matching public sources. Employee feedback remains **LIMITED** or **INSUFFICIENT**; no fictional employee satisfaction score.
- Gemini extraction failures fall back to deterministic salary snippet processing; any unverified data stays insufficient.
- Added self-contained **runCompanyXRayV3SelfTest** with 14 offline checks.

### Important distinction
This is a full replacement for the **existing Research.gs** business-logic file. It is **not** a replacement for Code.gs, Config.gs, Gemini.gs, Search.gs or Index.html and does not contain any API credentials. It is prepared from the latest accessible user-supplied `Research.gs` **v2.3 (5 Oct 2026)**; the live Apps Script code cannot be read or edited through the public `/exec` deployment URL. Check for changes made to your project after that date before replacing the live file.

### Install in the EXISTING Apps Script project (not a new deployment)
1. Open the owner account at https://script.google.com/home and select the Company X-Ray project.
2. Open `Research.gs`; copy its existing content to a safe versioned backup before replacement.
3. Copy the full content of [Research.gs](./Research.gs) into the existing `Research.gs`. Keep `Config.gs`, `Code.gs`, `Gemini.gs`, `Search.gs`, `Index.html` and Script Properties as they are.
4. Press **Save**. Select and Run `runCompanyXRayV3SelfTest`. Expected execution log: `{"passed":14,"total":14,"ok":true,"failures":[]}`. If any test fails, DO NOT deploy.
5. In **Deploy > Manage deployments**, edit the *existing* Web app deployment, choose **New version** and **Deploy**. Using Manage deployments preserves the existing /exec URL; creating a different deployment may not.
6. Run one **Quick**, one **Professional** and one **Deep Research** end-to-end report, e.g. company: Vodafone Egypt; role: HR Specialist; city: Cairo; level: 3–5 years. Observe whether Serper and Gemini return current, comparable sources.
7. QA the existing `Index.html` output components: if they previously display `confidence_score` as "80%" or `market_range` as P25–P75, update labels to **Evidence Grade** and **Indicative Public Range**. A null field must be displayed as **Not established** (never 0 EGP). The frontend source is not included with the accessible Research.gs snapshot and therefore its display behavior is **NOT YET VERIFIED**.

### Salary decision rules
- **Current / comparable**: publication date no older than 18 months, exact/close role and matching seniority, source mentions the requested city, explicit salary amount and period, compatible pay basis, at least 3 distinct source URLs across 2 independent publishers.
- **Eligible market range**: literal min/max across the accepted observations, NO arbitrary adjustment, no statistical percentile claim.
- **One / two sources**: show contextual evidence ledger, but no numeric market range.
- **Employer-specific compensation**: only explicit, dated, city-appropriate public employer evidence; no size-based pay predictions; not proof of actual payroll or total rewards.
- **Salary survey**: only a separate dataset with individual records and documented sample size, dates, sector, city, level, pay components and sampling design can substantiate percentiles.
- **Employee feedback**: review snippets are not a representative anonymous employee survey. Do not infer satisfaction ratings or company-wide sentiment.

### Verification status
- Local V8 syntax: **PASS**
- Offline self-tests: **14/14 PASS**
- Full Gemini / Serper live integration: **NOT TESTED**
- Existing Apps Script deployment update: **NOT PERFORMED**
- Existing Index.html source/display: **NOT TESTED**
- Employee review end-to-end traceability: **PARTIAL** (logic hardened; actual live evidence not available)

### Official regulatory reference — not a salary benchmark
Egypt's National Wages Council announced a private-sector monthly minimum of **EGP 7,000 effective 1 March 2025**. It is a legal-context reference, **not** an HR Specialist market salary percentile or a reason to multiply source observations. Verify later legal changes before relying on it:
- https://sis.gov.eg/en/media-center/news/egypt-raises-minimum-wage-for-private-sector-to-egp-7-000
- https://moic.gov.eg/news/1998

### What is intentionally not claimed
No real-time 2026 compensation survey was purchased, licensed or ingested. Results cannot become a legitimate independent Salary Survey by changing an AI prompt. Any market data without sufficient traceable evidence remain **INSUFFICIENT_DATA**. This is a deliberate safety and quality improvement.
