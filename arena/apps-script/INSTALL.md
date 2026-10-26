# Winners AI Challenge Arena — FREE deployment

**Status 26 Oct 2026:** **Updated group-leader registration code must still be copied to Apps Script and deployed as a New Version.** The instructor published the [Apps Script Web App](https://script.google.com/macros/s/AKfycbyZUW9VDB82FN37sM4DBaW559_-ClInkfpV3HlYPqFLZyonOXOcXDbF6LQ2FRTYDdBq/exec). The live Arena loaded successfully in a browser and displayed the Presenter/Team controls, with “Apps Script Connected”. **Admin login, Sheets submissions and Gemini scoring still require end-to-end classroom smoke tests.** The setup steps below are retained for future re-deployment.

**Training database**: https://docs.google.com/spreadsheets/d/19zwo9t-NXAWZJla5eL5TrGgagR55v1KeIRJ_DRHFxu0/edit

## One-time setup — no Firebase, no billing subscription

1. Open the linked Google Sheet. Use **Extensions → Apps Script** to create a bound script.
2. Open **[Code.gs](Code.gs)** on GitHub, copy its entire content into the Apps Script editor (replace the auto-generated `Code.gs` text). Save the project.
3. In Apps Script **Project Settings → Script properties**:
   - Set `ADMIN_PASSPHRASE` to a strong private passphrase (at least 14 characters). **Never paste it in GitHub or into public chats.**
   - Set `GEMINI_API_KEY` to your private Gemini Developer API key. Optional: if absent or quota is exceeded, use Manual Scoring.
   - Optional `GEMINI_MODEL` = `gemini-2.5-flash-lite` (subject to current availability and free-tier limits).
4. Run `setupArena` from the Apps Script editor **once** and grant requested Sheets permissions. It records the sheet ID and verifies the presenter passphrase.
5. Click **Deploy → New deployment → Type: Web app**. Set **Execute as: Me** and **Who has access: Anyone** (required for teams without Google sign-in). Click Deploy, complete OAuth authorization and copy the URL ending in `/exec`.
6. **Recommended live presentation URL:** open the new `/exec` link directly. This launches the official Bavel-style Github Arena **inside the Apps Script host** via a nested website iframe. This route avoids depending solely on third-party Apps Script iframe embedding, which has shown intermittent browser issues in 2026. Verify on your exact devices before class.
7. **Optional GitHub direct live link:** update `arena/apps-script-config.js` with your public **/exec URL only**. Do **not** include Gemini API key or `ADMIN_PASSPHRASE` there.
8. **New group-leader workflow:** In the Presenter screen, enter the secret and click **Create Session** (this now creates *zero predefined groups*). Press **Copy Team Leader Form** and distribute to each group's designated Leader. Each Leader enters their name and team members and receives an automatically numbered Group 01, 02, 03, etc. They then submit one answer on behalf of the group. There are **no team codes to distribute**. The leader's private browser token authenticates future submissions.
9. **For an existing /exec deployment:** after pasting the updated `Code.gs`, select **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same. Run `setupArena()` if not already run. Always create a **new classroom session** after upgrading to avoid legacy fixed groups.

## Operating the 3-stage training

- Stage 1: **Discovery** — Horizon Services, 320 staff, 90 CVs, 75 comments, 12-page leave policy. No AI. Baseline skill.
- Stage 2: **Level Up** — Nova Retail 18→24 staff, gap of 6 (4 associates, 1 supervisor, 1 cashier). Pre-AI reasoning and Master Prompt.
- Stage 3: **Grand Finale** — Return to Horizon Services; full source-grounded HR solution, implementation, KPIs, risks and human approval.

**Rubric (provisional):** 5 criteria totaling 100 points per stage. The 40/60 Stage 2/3 champion weighting is a suggested future enhancement and **not yet implemented as a validated final ranking**. Score is an instructional indicator, not a professional competency certification.

## Real-time updates & safety

- Presenter and team client communicate with `google.script.run` through an Apps Script bridge hosted over HTTPS. This avoids exposing the Gemini API key and keeps public scores separated from private responses.
- The presenter view polls Google Sheets roughly every 12 seconds, not true push real-time. Leaders can revise their one team answer **until** grading is approved. Each Leader should use the same browser across three stages.
- Only approved scores for explicitly revealed stages become public; anonymous responses are not displayed in the leaderboard.
- Gemini is optional. If unavailable or rate-limited, the presenter enters a score and feedback manually without blocking the training. If **Apps Script itself** or the network is unavailable, submissions cannot reach the shared Sheet: use paper/offline fallback and reconcile later.
- Use fictional/synthetic training data only, no real employee or candidate personal data. Gemini free tier may use content to improve the provider's products; **do not send confidential HR data**.
- Team codes are random, hashed in the sheet; one code per team. Presenter password is in Apps Script Script Properties and transmitted only for authenticated management calls, not committed to GitHub. The `/exec` API runs as the sheet owner, so use a strong private passphrase and never publicly share it.
- Dedicated `/exec` link is accessible to anyone with the link, but write operations still verify the team code or presenter password.
- Apps Script and Gemini have free usage quotas. Test full class load **before training**, and consider a backup offline Scoreboard.

## Links

- Arena GitHub UI: https://sahaarty0.github.io/winners-ai-for-hr/arena/
- Arena GitHub source: https://github.com/sahaarty0/winners-ai-for-hr/tree/main/arena/
- Google Sheets database: https://docs.google.com/spreadsheets/d/19zwo9t-NXAWZJla5eL5TrGgagR55v1KeIRJ_DRHFxu0/edit
- Original AI Prompt Toolkit (unchanged): https://sahaarty0.github.io/winners-ai-for-hr/
