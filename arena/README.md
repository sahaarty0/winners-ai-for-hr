# Winners AI Challenge Arena

**Official Winners AI for HR gamification project** using the exact approved Winners logo.

## OPEN NOW (Demo)

- [Arena on GitHub Pages](https://sahaarty0.github.io/winners-ai-for-hr/arena/)
- [Emergency Offline Manual Scoreboard](https://sahaarty0.github.io/winners-ai-for-hr/arena/?offline=1)
- [Real Backend Google Sheet](https://docs.google.com/spreadsheets/d/19zwo9t-NXAWZJla5eL5TrGgagR55v1KeIRJ_DRHFxu0/edit)

**Important:** The public page remains in **Local Demo mode** until the Apps Script Web App is deployed by the Spreadsheet owner. Demo scores are fictional; not Gemini evaluations. The fallback `?offline=1` starts with no scores, and its CSV export can be reconciled after class. **A live production-ready connection has not been claimed or verified.**

## Primary deployment path — NO BILLING

**GitHub Pages (UI) + Google Apps Script (server) + Google Sheets (storage) + Gemini Developer API (optional grader)**.

- [Free setup guide](./apps-script/INSTALL.md)
- [Apps Script server code to paste into your Sheet](./apps-script/Code.gs)
- [Public App Script URL configuration](./apps-script-config.js) — currently **blank** until deployment
- [Interactive frontend source](./app-free.js)
- [Official logo and presenter/team cards](./index.html)

Start in the linked Google Sheet → Extensions → Apps Script, paste all `Code.gs`, add project Script Properties `ADMIN_PASSPHRASE` and optional `GEMINI_API_KEY`, run `setupArena`, deploy as a Web App (execute as owner, accessible to anyone), and open the resulting **/exec** URL. That Apps Script link can directly host the Winners Arena as an alternative to cross-origin iframe embedding.

**Secrets never belong in GitHub.** Gemini quota exhaustion is handled via manual scoring; only presenter-approved and explicitly revealed grades become public.

## Stages

| Stage | Source case | Assessment |
|---|---|---|
| 01 Discovery | Horizon Services 320 employees, 90 CVs, 75 comments and leave policy | Baseline HR reasoning (no AI) |
| 02 Level Up | Nova Retail 18 → 24 staff; six-position gap | Progress + Master Prompt application |
| 03 Grand Finale | Return to Horizon Services | Full business solution, methods, evidence, KPIs, controls |

The stage rubric criteria and weights are **provisional design choices** pending trainer approval, not an independently validated learning metric.

## Source documents from the AI for HR Drive folder

- [Module 01 Business Cases and Gamified Labs](https://drive.google.com/file/d/1MrDenI0VwLoNBFSS2w6AXbJZUSj-flNp/view)
- [Module 01 Trainer Guide](https://drive.google.com/file/d/15eiBQx0XaZ_BNKSXU9ts6pHERagncwFx/view)
- [Module 02 Universal Execution Prompt](https://drive.google.com/file/d/1WOMnFnOAcliF4ll2HyeGrZBLkM8MSJtY/view)
- [Day 02 Master / Nova Retail](https://drive.google.com/file/d/1lMrVwd7JnFR9AJMJ1QfodeuOTQQlOLgb/view)
- [Module 03 Evidence Review Participant](https://drive.google.com/file/d/1gZR9mwGNwnWNtRW1s49-hjuq6GE-4dMz/view)

## Reliability & safety

- The no-billing plan is suitable for a **small training cohort**, subject to Google's changing free-tier quotas. It cannot guarantee uninterrupted operation.
- **Manual Scoring** avoids Gemini dependency; **Emergency Offline Scoreboard** protects the class if Apps Script or the Internet is unavailable, but submissions cannot sync while offline.
- Use fictional/synthetic information exclusively. Never submit real candidates' CVs, employee records, confidential policies, or personally identifying data.
- Gemini free-tier usage may be used by the provider to improve its products.
- The old `backend/` Firebase code and `app.js` remain in the repo as **unused experimental alternatives**; `app-free.js` is the active script.
- The original [AI for HR Practical Toolkit](https://sahaarty0.github.io/winners-ai-for-hr/) is preserved unchanged.
