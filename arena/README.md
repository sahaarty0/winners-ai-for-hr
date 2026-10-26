# Winners AI Challenge Arena

**Official Winners AI for HR gamification project** using the exact approved Winners logo.

## OPEN NOW (Live frontend + offline backup)

- [Arena (redirects to live Apps Script)](https://sahaarty0.github.io/winners-ai-for-hr/arena/)
- [Direct live Web App](https://script.google.com/macros/s/AKfycbyZUW9VDB82FN37sM4DBaW559_-ClInkfpV3HlYPqFLZyonOXOcXDbF6LQ2FRTYDdBq/exec)
- [Leader Form Preview (not connected to real participants)](https://sahaarty0.github.io/winners-ai-for-hr/arena/form.html?demo=1)
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

**2026-10-26 — New Team Leader Workflow:** Each team has **one Leader** who records their full name and the members of their group in the [Leader Registration Form](./form.html). The backend automatically creates Group 01, Group 02, etc., with no preset team count. The Leader then submits **one group answer per stage**. Gemini attempts to score it automatically after Sheets saves it (if configured); the presenter must approve the score before reveal. **The instructor MUST update and redeploy the Apps Script Code.gs version to activate this new workflow.** The old published Apps Script version cannot be changed by editing GitHub alone.

**Secrets never belong in GitHub.** Gemini quota exhaustion is handled via manual scoring; only presenter-approved and explicitly revealed grades become public.

## Live classroom workflow

1. Facilitator replaces Apps Script `Code.gs` with the **latest** [backend code](./apps-script/Code.gs) and deploys a **New Version** via Deploy → Manage deployments → Edit → Version: New version → Deploy. The existing `/exec` URL should remain unchanged.
2. Facilitator runs `setupArena()` once to verify backend tabs and settings; keep all secrets in Script Properties. Open the live Arena and create a **new** session with **0** teams.
3. Facilitator clicks **Copy Team Leader Form** and sends the link to all groups. Each group's Leader registers their name and member roster, creating `Group 01`, `Group 02`, etc.
4. All registered groups automatically appear on the presenter’s cards, and the roster is visible only to the facilitator. Each Leader sees the current HR scenario and submits one answer per stage.
5. The submission is **saved to Sheets before Gemini is called**. If Gemini quota fails, the submission stays available for Manual Scoring. Instructor approves and reveals scores.
6. Returning Leaders should use the **same device/browser** (their private team token is kept in local storage); otherwise ask the facilitator rather than creating duplicate groups.

## V2 case fidelity — available now on GitHub
The presenter and leader form now read the same [detailed Case Bank V2](./case-details.js) and display source evidence via [Case Evidence Renderer](./case-view.js). Stage 01 includes named positions, four candidate cards, 12 quoted comments, and 3 supplied leave-policy clauses. Stage 02 includes the Nova 18→24 staff allocation, Store D reporting structure, JD and CBI scoring anchors. Stage 03 uses the same Horizon evidence plus testable workflow and QA acceptance criteria.

**Trainer notice:** The [latest Code.gs](./apps-script/Code.gs) has now been updated so Gemini uses the exact V2 facts and task-weighted rubrics. The Apps Script copy saved **before** this update is outdated. To activate it, replace the contents of the existing Apps Script `Code.gs` with the latest GitHub file, save, and use **Deploy → Manage deployments → Edit → New version → Deploy**. No new Web App URL is needed, and `case-details.js` must **never** be pasted into Apps Script because it uses `export`.

**Current verification:** Offline JavaScript parse tests passed, the Stage 01 Leader Form was opened in a real demo browser and V2 evidence/required tasks displayed, and all three server rubric weights exactly match the V2 case data. **Actual Gemini live grading and Sheets persistence still require a smoke test after redeployment.**

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
