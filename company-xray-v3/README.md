# COMPANY X-RAY — Research.gs v3.2 (Observed Salaries UI Fix)

## Company X-Ray v3.2 — source figures visible when survey conditions fail

**Problem addressed:** The public UI displayed "Insufficient data" and "0% - Low" even when the backend located numerical salary observations. v3.1 rightly blocked unsupported market ranges and company offers, but the frontend hid the available source numbers.

**Files:**
- **Research.gs** is the complete replacement for the existing Apps Script Research.gs. Its new salary.presentation.published_salary_mentions displays one numeric source observation per row, with pay basis, URL, date and an explicit source-page-verification flag. Verified benchmarks remain separate and strict. Includes explicit Tech Recruiter / Technical Recruiter / IT Recruiter role-title aliases, and rejects unrelated company-name aliases such as Winners Developer.
- **ReportUIFix.html** is a *small additive UI snippet*, not a replacement for the approved current Index.html. It displays the new figures and changes the misleading 0%-Low confidence text to Not assessed when the backend returned null.

**Installation — preserve existing design and URL:**
1. Back up current Apps Script Research.gs and Index.html. Replace full Research.gs with the GitHub file; leave Code.gs, API handlers and other modules untouched.
2. Paste the entire ReportUIFix.html code immediately before the closing body tag in the existing Index.html. Do NOT replace the existing Index.html.
3. Locate the existing successful backend response callback (after google.script.run.withSuccessHandler). Immediately AFTER its original report-render call, insert this one line:

    if (window.xrayEnhanceReportV32) window.xrayEnhanceReportV32(result);

   Use the callback's actual result parameter name if different; do not change the original render function. The existing code and layout remain intact.
4. Apps Script function runCompanyXRayV3SelfTest returns **22/22 PASS** on the updated code. testFullCompanyXRay performs real Serper/Gemini research and prints short QA diagnostics.
5. Deploy > Manage deployments > Edit existing deployment > New version > Deploy. Do not use New deployment; the public /exec URL should stay unchanged.

**QA already performed before delivery:**
- Syntax PASS and 22/22 synthetic self-tests.
- Mocked full search/response cases with two non-comparable salary sources (shown individually), 3 gross-pay independent publisher sources (sample-only indicative market band), mixed pay basis, wrong location and a single publisher (all correctly blocked from a benchmark).
- UI adapter tested against a simulated DOM: showed 16,000 EGP and 20,000–25,000 EGP separately with verification warnings and changed null confidence from 0%-Low to Not assessed. These are artificial fixtures, not verified Winners compensation figures.
- No actual public web app deployment or browser API completion of v3.2 was performed. The actual live Apps Script Index.html file was not accessible through connected code/Drive tools; the adapter is an additive patch tested in isolation, not yet integrated with that live file.

**Safety:** Search snippets are unverified source excerpts and may be stale, lack pay basis, or differ from source pages. Do not treat them as verified payroll, a market salary survey, or a factual employer offer. Market-range percentiles and employer-offer figures remain null without independently documented representative evidence.


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
4. Press **Save**. Select and Run `runCompanyXRayV3SelfTest`. Expected execution log: `{"passed":18,"total":18,"ok":true,"failures":[]}`. If any test fails, DO NOT deploy.
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
- Offline self-tests: **18/18 PASS**
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

### v3.1 Production test follow-up — 29 Oct 2026
A live Apps Script editor run of `testFullCompanyXRay` on Eagle Chemicals Group (HR Specialist, Junior, Cairo) reached `Company X-Ray completed` after a transient Gemini 503 retry. **28 merged salary extraction records**, of which **26 were excluded**, **2 remained contextual public search snippets** and **0 qualified for a comparable benchmark**. This is a valid `INSUFFICIENT_DATA` result, not proof that the Egyptian labor market lacks salary figures.

Changes in v3.1:
- The execution log distinguishes `observed_snippet_signals`, `benchmark_qualified` and `excluded_extraction_records` instead of misleadingly logging `Salary accepted evidence: 0`.
- Salary results expose `evidence_audit.reason_counts` and `observed_public_signals`, containing each figure, source, date and **page_content_verified: false**. The app **has NOT validated the source page body**; Google or Serper snippets can differ from the current linked page.
- `testFullCompanyXRay` now emits a compact diagnostic summary instead of the full 45+ source JSON output (which was truncated in the user's execution log). The complete response is still returned programmatically.
- Added a targeted Egypt Indeed salary search query in place of one broad multi-provider query, and support for Egyptian Arabic digits, thousands separator, and `ج.م.` in the deterministic salary parser.
- Company notes no longer repeat unsupported AI claims about a specific branch or city without source-level verification.
- Local synthetic regression suite expanded to **18 tests**; dates use live current date rather than a fixture that will become stale.

**Important source caveat:** In the observed live run, a Wuzzuf salary snippet showed EGP 20K–25K, but the publicly opened job listing showed no published salary field. That figure must remain **unverified context**, never a confirmed company pay rate. An Indeed Cairo HR Specialist page updated 7 Oct 2026 reported EGP 11,517 per month (14 reported salaries), which is **another context observation with a limited sample**, not a representative independent survey. Different pay bases and datasets must not be averaged without comparability evidence.

After copying this version to the original Apps Script project, run `runCompanyXRayV3SelfTest` (expect **18/18 PASS**) and then `testFullCompanyXRay` (expect a short output with source counts and reason codes). For the web app to reflect the code, update the existing deployment via **Manage deployments → Edit → New version**. Existing `Index.html` may not yet display new fields such as `observed_public_signals`; its presentation requires a separate review of that file. No live App Script code/deployment is modified by the GitHub commit alone.
