# Winners AI Challenge Arena

**Standalone interactive training arena** at [Launch Arena](https://sahaarty0.github.io/winners-ai-for-hr/arena/).

**Status:** Frontend operational in **local demo mode**. Firebase + Gemini backend code has been committed but **is not deployed/connected** until the instructor completes Firebase configuration. No real participant scores or Gemini calls exist yet.

## What it does

- Presenter screen: theatrical Gold / Silver / Bronze cards, scores, criteria, Gemini-feedback area, Stage navigation, Freeze, Reveal, approval/manual scoring.
- Team screen: case narrative, facts, answers and submission flow.
- 3 training stages: **Discovery**, **Level Up**, **Grand Finale**.
- Local browser demo: team answers and manual scores persist in that browser only, with illustrative initial values. Demo is not shared across devices; it does not grade with AI.
- Optional Firebase backend: session creation, per-team random codes, team submission, Google presenter sign-in, stage locks, Gemini judging, instructor review and explicit score reveal. Only approved scores are mirrored to public leaderboard.

## Source alignment (original Google Drive files)

**Stage 1 — Horizon Services / Discovery:**
- Module 01 Gamified Business Cases (Mission 00)
  https://drive.google.com/file/d/1MrDenI0VwLoNBFSS2w6AXbJZUSj-flNp/view
- Module 01 Trainer Game Guide
  https://drive.google.com/file/d/15eiBQx0XaZ_BNKSXU9ts6pHERagncwFx/view

**Stage 2 — Nova Retail / Level Up:**
- Day 2 Master, Module 04, 18→24, 6-role hiring gap
  https://drive.google.com/file/d/1lMrVwd7JnFR9AJMJ1QfodeuOTQQlOLgb/view
- Module 02 Universal AI Execution Prompt
  https://drive.google.com/file/d/1WOMnFnOAcliF4ll2HyeGrZBLkM8MSJtY/view
- Module 02 Task Definition Worksheet
  https://drive.google.com/file/d/1y8FpDYsGQJ0M4H-ECD2XpXyf2Wlk3PfQ/view
- Module 02 Prompt Builder Worksheet
  https://drive.google.com/file/d/1VymCuoRlBP6s-FFqdTtnpiqN7XhVyNp1/view

**Stage 3 — Grand Finale:**
- Return to the **same Horizon Services** case, professional solution requiring traceability, HR review, controlled tool choice and measurable business value.
- Evidence checking principles and related trainer examples from Module 03.
  https://drive.google.com/file/d/1gZR9mwGNwnWNtRW1s49-hjuq6GE-4dMz/view

**Rubric disclaimer:** Stage 1/2/3 weightings are **design proposals**, not an approved scoring key. The original Module 01/03 XP rubrics are preserved as references; the Arena uses a new three-stage structure and should be reviewed before actual class evaluation.

## Activate Firebase + Gemini (one-time trainer setup)

1. Create a separate Firebase project at https://console.firebase.google.com/ (choose billing/plan appropriate for Cloud Functions). Register a **Web app**.
2. Enable **Cloud Firestore** and Authentication: **Anonymous** (teams), **Google** (presenter). Add `sahaarty0.github.io` as an authorized Auth domain.
3. In the Firebase project's Web App config, copy public identifiers into `../firebase-config.js`:
   `firebaseConfig = {apiKey,authDomain,projectId,appId}`. The **Firebase Web API key** is a public app identifier, not the Gemini secret. Limit Firebase access using Security Rules.
4. Install Node 22 and Firebase CLI: `npm i -g firebase-tools`, `firebase login`. Inside `arena/backend`, copy `.firebaserc.example` to `.firebaserc` with your Firebase project ID, then `cd functions && npm install && cd ..`.
5. Deploy rules + functions: `firebase deploy --only firestore:rules,functions`.
6. Store the Gemini API key **server-side only**: from `arena/backend`, run `firebase functions:secrets:set GEMINI_API_KEY`, then deploy functions as in step 5. Never commit this key to GitHub or expose it to students.
7. Sign in on the Arena as **Google Presenter**. Copy the authenticated user's UID from Firebase Authentication in the Firebase Console. Using the Firestore console as project owner, create `admins/{GOOGLE_UID}` with field `active: true` (Boolean). No client can self-appoint an admin.
8. Reload, log in as presenter, create a session. Copy the three generated **team codes immediately** and save them privately. They are returned once and stored hashed server-side. Give each team a code and the Team URL.
9. After a team submits a response, select it on the Presenter view, run **Gemini Evaluate**, review the rubric breakdown and evidence, click **Approve Score**, then **Reveal Scores**. Never assume model-produced scores are authoritative.

### Deployment notes and limitations

- Hosting stays on GitHub Pages. Firebase is a separate server service; GitHub alone cannot run protected Gemini API calls.
- This project intentionally keeps the model secret in Firebase Secret Manager and excludes HR/candidate personal data. The scenarios are fictional.
- Class participants must use one device per team code. Teams cannot join on a different UID/device once linked without a trainer-assisted reset.
- Stage 2 contains an unaided answer **self-declaration** plus an assisted prompt, not a technically enforced no-AI sandbox. Improvement across different cases is indicative, not a controlled learning-impact measurement.
- Current evaluator scores are advisory and require human approval, test against instructor gold answers before full use.
- Optional public-sources scraping is a learning proposal only; this frontend does not execute web scraping or automate external services.
- Firestore rules deny all client writes, and scores are only mirrored to the public board when approved and revealed.
- Session/score synchronization works when Firebase is deployed/configured. Without config, **local demo mode** works only in the browser where the answers are typed.

## Repository layout
```
arena/
  index.html             # official Winners logo embedded (exact PNG from Drive)
  app.js                 # presenter, cards, team answer flows + Firebase adapters
  firebase-config.js     # public config; null until configured
  backend/
    firebase.json
    firestore.rules
    .firebaserc.example
    functions/
      package.json
      index.js           # protected callable API + Gemini judge + approval
```

The previous **AI for HR Practical Toolkit** continues to run unchanged at
https://sahaarty0.github.io/winners-ai-for-hr/
