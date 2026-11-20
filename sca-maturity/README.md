# WINNERS × SCA | Evidence-Based HR Maturity Assessment (v2)

**Production:** https://sahaarty0.github.io/winners-ai-for-hr/sca-maturity/

**Repository:** https://github.com/sahaarty0/winners-ai-for-hr/tree/main/sca-maturity

## Purpose
This research/training edition measures HR maturity as a **documented practice on a 0–5 scale**, rather than a yes/no presence checklist. This change responds to the WINNERS Maturity SCA training materials and replaces the 100-question interface with **10 assessments (one per domain)**. It is not an official evaluation of SCA and does not establish organizational, legal, or audit findings.

## Ten assessment domains
1. HR Strategy
2. Organization Structure & Governance
3. Objectives & KPIs
4. Workforce Planning
5. Job Description & Evaluation
6. Competency Framework
7. Performance Management
8. Compensation & Benefits
9. Policies & Procedures
10. HR Data & Reporting

## Scoring
- Levels **0–5**, with descriptions and indicative evidence requirements taken from the training methodology:
  0 = absence established by examination, not merely no file; 1 = ad hoc; 2 = recurring but inconsistent; 3 = approved/documented/applied; 4 = measured and managed; 5 = continuous improvement supported by results.
- "Not assessed" is used when there is insufficient evidence.
- A score is counted only if BOTH evidence reference and explanation are entered. Score 0 additionally requires explicit confirmation that absence was established by examination.
- Maturity average = sum of eligible scores / number of assessed domains. Coverage = assessed / 10 × 100. Neither is an official SCA score.
- Draft/partial entries and unassessed domains must not silently count as zero.
- No automatic equivalence, percent conversion, or score migration from v1 binary scoring.

## Training and practitioner use
Two display modes: **Consultant Assessment** and **Training Case Simulation**. The simulation exposes only summarized hypothetical evidence E01–E12 from the *unsolved* case in the Maturity SCA materials. **The solved model answer is not in the public site or its JavaScript.** Both modes are local browser tools, not authenticated access roles.

Evidence register, justification, confidence, missing evidence, gap, hypothetical root cause, proposed action, priority, suggested 30/60/90 wave and prospective owner are captured for each domain.

## Exports and reports
- Browser localStorage persists v2 inputs only on the same device/browser.
- JSON export/import for v2 backups.
- UTF-8 CSV export for spreadsheet analysis; leading formula characters are escaped.
- Printable report / browser Save as PDF with coverage, evaluated domain scores, references, explanations, verification gaps and user-entered roadmap.
- No backend, no Google Sheets write, no Gemini, and no institutional authentication or secure personnel data collection.
- Do not enter personal data, confidential employee details or internal proprietary documents in a publicly hosted frontend.
- Approval of recommendations and DoA must be validated with the authorized organization independently.

## Original edition
The original 100-question interface and its source files remain available at:
https://sahaarty0.github.io/winners-ai-for-hr/sca-maturity/legacy-v1.html

The original localStorage keys are **left untouched**. Users with pre-existing v1 browser data can open the legacy page and export their original records. V1 JSON is NOT compatible with v2 scoring, and the v2 import intentionally rejects it.

## Files
- index.html — v2 homepage, preserves original embedded WINNERS logo and linked SCA logo.
- maturity-v2.js — 10 domains, evidence-required maturity model, reports/export/import.
- maturity-v2.css — responsive white/navy/gold UI and print styles.
- legacy-v1.html — preserved v1 interface (100 binary questions).
- app.js, phase2.js, phase2.css, scope.css, questions.json, backend/ — retained as v1 legacy references, not loaded by v2 homepage.

## Reference and limitations
Sources: Maturity SCA training set (trainee guide, solved and unsolved hypothetical cases); SCA HR & Legal Knowledge Base (research reference snapshot dated 2026-11-10). Neither the training case nor the evidence pointers confirm actual SCA practices or current approval authority. Validate signed active regulations, amendments, structure and operational evidence with competent authorities before organizational recommendations.

## Release checklist
1. Validate script syntax and HTML element references.
2. Test all 10 domains, drafts, 0-level confirmation, save/restore, reports and CSV/JSON export.
3. Test browser Save as PDF, responsive layout, and legacy-v1 access.
4. Verify GitHub Pages live deployment and that both original logos render.
5. Test with fictitious data only before instructional rollout.

Developed for WINNERS Business Consultation & Training Services.
