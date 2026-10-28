# Winners AI for HR — Premium Access (Sheet-controlled)

## Status
Prepared in branch `feature/premium-usecases-sheet-approval`; **the live site is intentionally unchanged** until the new Apps Script endpoint is deployed and tested.

## What is already set up
- Registrations spreadsheet: https://docs.google.com/spreadsheets/d/16M4wVXw6G-TwLqIYPLcN7hTVOAJx8BVcgbD-Bkg-2jU/edit
- Tab `Registrations`, column **I**: `Premium Access` with `Pending`, `Approved`, `Rejected`. Empty cells mean Pending. All existing registration rows were preserved.
- Hidden `PremiumCases` tab: 23 full original English case definitions, 17 Arabic core translations, and 6 advanced/visual cases. Do NOT publish or share this sheet with students.
- On the staged GitHub site, Free users keep Model Advisor (all 23 *titles*), Custom Prompt Builder, and Quality Check. They do NOT receive full case templates. Approved users receive case details only after email verification and server approval.

## One-time admin activation (required before merging)
1. In https://script.google.com/home/projects/create make a **NEW standalone Apps Script project**. **Do not replace the existing registration doPost**: it already handles signup and should stay working.
2. Replace its `Code.gs` with [premium-access/Code.gs](./Code.gs). This source contains no credentials.
3. In the project editor run a one-off function that reads the spreadsheet and requests mail permissions, e.g. choose `premiumInstallCheck` after it is added (or the editor will request permissions during deployment). Ensure the account executing the service can edit the registrations sheet and send email.
4. Deploy **New deployment → Web app**: Execute as **Me**; Who has access: **Anyone**. Copy its exact **/exec** URL.
5. In the feature branch `index.html`, replace `const PREMIUM_API_URL='';` with that URL. It is an endpoint, not a secret. Commit to the feature branch.
6. Test (a) unregistered email — no code and no data; (b) Pending email — no code and no data; (c) Approved email — six-digit email code arrives; (d) valid code — 23 cases are returned, UI unlocked; (e) Rejected or revoked email — new premium requests are denied; (f) free tools continue working. Also test mobile and two browsers.
7. After those checks, merge the branch/pull request into main. GitHub Pages will publish the new site. If there is any error, leave the branch unmerged.

## Daily administration
- User registers as before. Open the `Registrations` tab, locate **their registered email** in column D.
- Set **Premium Access** in column I to `Approved` (or `Rejected`). Blank is treated as `Pending`.
- Approved user opens HR Use Cases, enters the **same email**, clicks `Check approval & email my code`, enters their one-time 6-digit code, then clicks `Verify & unlock Premium`.
- OTP expires after 10 minutes; session lasts up to 6 hours and is checked against sheet status before issuing case data. Google Apps Script mail quotas apply.

## Security boundaries / honesty
- Hidden tabs are NOT permission boundaries: only administrators should have access to the underlying Google Sheet.
- The current publicly deployed GitHub `index.html` already contained all 23 case definitions; historic public Git commits may still expose them. This migration protects new visitors through the new UI and API, **not** previously published source or downloaded copies. For stronger intellectual-property protection, move proprietary future content to server-only storage and address public Git history.
- Do not use only frontend/LocalStorage flags or email address comparison for access control. OTP proves mailbox possession; the server verifies `Approved` before sending any premium JSON. The session token is short-lived and can expire early if Apps Script cache evicts it.
- Existing free registration still uses its separate existing Apps Script endpoint. Do not overwrite that deployment.
- Google Apps Script's ContentService response redirect and browser cross-origin behavior should be end-to-end tested after deployment. This has NOT been verified on the new endpoint yet.

## Source of truth
Google Sheet `Registrations!I:I` controls access, `PremiumCases!B:B` holds premium data. GitHub only holds public metadata and UI plus a standalone backend implementation.