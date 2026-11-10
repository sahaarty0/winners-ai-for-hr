# Winners × SCA — HR Maturity Assessment (Research/Training Edition)

## Production URLs
- New SCA edition: https://sahaarty0.github.io/winners-ai-for-hr/sca-maturity/
- Code: https://github.com/sahaarty0/winners-ai-for-hr/tree/main/sca-maturity
- Original Winners tool, intentionally unchanged: https://sahaarty0.github.io/winners-ai-for-hr/maturity/
- SCA research knowledge base (Google Drive): https://drive.google.com/drive/folders/1-NWFxKX6auKtezNxe321AHa4Jl98M_Bs

## Clone and parity
This is a **separate copy** of the existing Winners HR Maturity engine, sharing its interface, assessment modes, scoring, stages and reports, but using an **SCA-specific bilingual question bank** and isolated localStorage namespaces.
- 20 cores (11 Functional / 9 Strategic), 5 questions per core, 100 tailored questions.
- Full, Functional (55 questions), or Focused (5 × selected cores) assessment.
- Binary 0/1 scoring with GREEN >= 80%, YELLOW >= 60%, RED < 60%.
- Unanswered questions stay unscored; cores outside the assessment scope show NOT ASSESSED.
- The selected-scope overall index is derived by the app, **not a legal compliance score and not a measure of the whole Authority in a limited assessment**.
- 30/60/90 exploratory verification/improvement roadmap; gap backlog; consultant review gate; separate client/consultant display modes; CSV, JSON and browser Print/PDF.
- Both original Winners logo (embedded source PNG) and SCA logo (`../arena/assets/sca-logo.png`) are reused, not redrawn.
- Saves only in the current browser localStorage; nothing is written to Sheets, Drive or Apps Script. The modes are **not** user authentication or role-based access.
- No Gemini evaluation/RAG is attached to this assessment; the question bank is a static source-controlled snapshot.

## Source methodology
SCA HR Knowledge: 93 indexed chunks, SCA Legal Knowledge: 45 indexed chunks, and Reality Mapping: 37 process research checks (snapshot dated 2026-11-10). The 100 question items refer to **81 unique research chunk IDs** in the combined repositories. A single question can cite multiple chunks.

Source references are *research pointers*, not proof that a process is performed, absent, authorized or legally current. In particular:
- **Do not** conflate the Suez Canal Authority with the Suez Canal Economic Zone, or Authority personnel with subsidiaries.
- **Do not** assume an unverified 2026 org chart, responsibilities, committee powers, digital systems or current working practices.
- **Do not** treat legal summaries as original statutory/regulatory text or assume the 2017 rules are the latest amendment.
- Verify current signed original rules, amendment history, authorized delegations, and actual operational records with the competent SCA body before any final conclusion.
- A “No / Not evidenced” answer is an **evidence-verification flag**, not proof that SCA lacks the process. The 30/60/90 improvement roadmap is illustrative and subject to validation.
- **Do not enter real staff personal information, secrets or internal confidential documents into this publicly hosted frontend.**

## Files
- `index.html`: cloned interface, SCA source disclaimer and original brand logos.
- `app.js`: original 0/1 assessment, CSV/JSON backup, SCA-specific advice and local browser state.
- `phase2.js`: consultant/client review, decision gate, handoff; SCA-specific localStorage keys.
- `questions.json`: 20 cores × 5 bilingual items; `sourceRefs`, `origin`, and `evidenceHintAr`.
- `phase2.css`, `scope.css`: original visual styles.

## Deployment
This is a GitHub Pages static site; committing to the `main` branch (Pages source workflow) deploys the frontend. **No Apps Script deployment is involved.** Always distinguish GitHub commit existence from the live Pages version and verify the actual URL after updates.

## QA record
- Structural checks: 100 unique IDs, exactly 5 questions per core, 20 cores, 81 research IDs, original thresholds.
- Live browser workflow (2026-11-10): Focused F01, 3 Yes + 2 No, score **60% / Yellow**, **2** flagged items, **19** cores NOT ASSESSED; both logos, roadmap, consultant review and report shown, no observed JavaScript errors.
- All answers in QA were fabricated for functional testing; **none** constitutes a finding about SCA.
- Follow-up regression checks for exports/import, printing, all 100 responses, mobile layout and any future changes should be performed before institutional rollout.

Created for Winners Business Consultation & Training Services, SCA research/training edition.
