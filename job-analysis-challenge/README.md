# Winners Job Architecture Challenge — V2

### Live pages
- [Instructor Control](https://sahaarty0.github.io/winners-ai-for-hr/job-analysis-challenge/) — rounds, group links, display-score preview
- [Game Arena](https://sahaarty0.github.io/winners-ai-for-hr/job-analysis-challenge/arena.html) — clean projector display, four cards only
- Group page: `group.html?group=1&round=pre` (groups 1–4; `round=post` for Post)

### Classroom workflow
1. Open Instructor Control on the presenter browser and choose PRE.
2. Open Game Arena in another tab/window on **the same browser origin**. LocalStorage synchronizes rounds and demo scores between tabs.
3. Send each group its own generated challenge link, where case evidence/questions and practical work appear. Answers are kept locally and exported to JSON, not sent anywhere until backend integration.
4. Select POST at the correct stage and distribute updated links.
5. After developing a secure Google Apps Script backend with Gemini and instructor approval, replace demo score input with authoritative results.

### Four Cases
1. Job Analysis — undefined Sales Executive role
2. Role Clarification — HR Generalist / Personnel conflict
3. Job Re-Design — Recruitment with ATS and AI
4. Job Description — flawed Team Lead JD

### Display score bands (illustrative)
- 0–49: red / needs development
- 50–69: yellow / foundation
- 70–84: blue / good
- 85–100: green / advanced

### Critical boundaries
- **No live grading** and **no backend submission** are deployed yet.
- Instructor controls and preview scores are **not authenticated** and must **not** be treated as secure production administration.
- LocalStorage only synchronizes tabs under the **same origin/browser profile**, not learners on different devices. Group links include an explicit round parameter to lock the URL to PRE or POST.
- The simulated score card appears only when the presenter enables score-preview reveal and enters a demo score.
- Each group has one separate case, with the same case repeated PRE/POST. Compare improvement **within** a group, not raw scores across unlike cases.
- Gemini API key must only be stored in server-side Script Properties; the score must be reviewed by a human instructor before release.
- Keep instructor model solutions outside this public GitHub repository.

### Files
- `index.html` — instructor screen
- `arena.html` — four-card arena
- `group.html` — challenge form
- `game.js` — round control, previews and local answer exports
- `game.css` — white/Navy/Gold responsive UI
- `case-bank.js` — four fictional public case briefs
- `logo.png` — official Winners logo, extracted from the existing Arena
- `app.js`, `style.css` — unreferenced V1 files retained for rollback

### Backend next phase
Use Google Sheets for submissions/grades, Google Apps Script for validation and server-side Gemini requests, and human approval before score release. First verify GitHub Pages-to-Apps Script cross-origin submission and authentication; do not assume public JavaScript can safely call an unrestricted grading endpoint.
