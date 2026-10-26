# Winners AI Challenge Arena

**Official Winners AI for HR gamification project** using the exact approved Winners logo.

## OPEN NOW (Live frontend + offline backup)

- [Arena (redirects to live Apps Script)](https://sahaarty0.github.io/winners-ai-for-hr/arena/)
- [Direct live Web App](https://script.google.com/macros/s/AKfycbyZUW9VDB82FN37sM4DBaW559_-ClInkfpV3HlYPqFLZyonOXOcXDbF6LQ2FRTYDdBq/exec)
- [Local Demo (fictional scores)](https://sahaarty0.github.io/winners-ai-for-hr/arena/?demo=1)
- [Emergency Offline Manual Scoreboard](https://sahaarty0.github.io/winners-ai-for-hr/arena/?offline=1)
- [Real Backend Google Sheet](https://docs.google.com/spreadsheets/d/19zwo9t-NXAWZJla5eL5TrGgagR55v1KeIRJ_DRHFxu0/edit)

**Deployment status (26 Oct 2026):** The instructor deployed the [Google Apps Script Web App](https://script.google.com/macros/s/AKfycbyZUW9VDB82FN37sM4DBaW559_-ClInkfpV3HlYPqFLZyonOXOcXDbF6LQ2FRTYDdBq/exec). A browser inspection confirmed that the live Arena and all three stage cards render and that the bridge reports “Apps Script Connected”. **A group submission, Gemini grade, admin authorization and Google Sheets write have not yet been end-to-end tested.** The default GitHub Arena URL automatically launches the direct live Web App; use [Demo Mode](https://sahaarty0.github.io/winners-ai-for-hr/arena/?demo=1) for fictional local values or [Emergency Offline](https://sahaarty0.github.io/winners-ai-for-hr/arena/?offline=1) for manual scores with local CSV backup.

## Primary deployment path — NO BILLING

**GitHub Pages (UI) + Google Apps Script (server) + Google Sheets (storage) + Gemini Developer API (optional grader)**.

- [Free setup guide](./apps-script/INSTALL.md)
- [Apps Script server code to paste into your Sheet](./apps-script/Code.gs)
- [Public App Script URL configuration](./apps-script-config.js) — deployed Web App URL configured
- [Interactive frontend source](./app-free.js)
- [Official logo and presenter/team cards](./index.html)

**Completed by the instructor:** Web App published. **Next:** open the direct live Web App, enter the facilitator's private passphrase, press Create Session, save the team codes, then test one team submission and manual evaluation before using Gemini. If the Apps Script source is edited after deployment, redeploy its updated version through Manage deployments.

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
