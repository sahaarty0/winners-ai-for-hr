# AI Arena Challenge — Suez Canal Authority Edition (SCA)

**Approved scope (10 November 2026):** three HR tracks × three progressive stages. Each track/stage has **ONE simple free-form question**. A team can answer as an essay or sequential steps. No required Q1–Q4 and no compulsory Master Prompt field.

## Official research reference (not legislation)
- [SCA HR Knowledge Base & Legal Chunks — Google Drive](https://drive.google.com/drive/folders/1-NWFxKX6auKtezNxe321AHa4Jl98M_Bs)
- HR knowledge file: `1ia85QIe6di6jnHvbPgrbE4gTl0m4z_v7` (93 records)
- Legal knowledge file: `1CDKAUiDeoqpfr2YEItsa6NE7t95hQwZo` (45 records)
- **Legal caveat:** these are research summaries, NOT certified up-to-date consolidated legal texts. Verify original applicable laws, staff bylaws and amendments as well as delegated authority before any real-world decision.

## The three tracks
1. **Staffing & Recruitment:** incomplete staffing request; do not invent an approved role, grade, hiring requirement or decision authority.
2. **Employee Experience & Coordination:** four *fictional* comments about cross-departmental instructions and delayed coordination; do not infer responsibilities without approved reporting/authority documents.
3. **Personnel & HR Policies:** a leave request with incomplete facts; do not invent leave-day rules or entitlements.

## The three stages
- Discovery (25 min): one scenario question, human reasoning only.
- Level Up (30 min): same scenario, use AI thoughtfully and verify its output.
- Grand Finale (45 min): same scenario, concise implementable workflow with human sign-off and a measurable KPI.

## Gemini grading architecture
The **server-side** Google Apps Script reads fixed, known Drive JSONL file IDs with `DriveApp.getFileById`; it ranks relevant case-specific chunks and includes a bounded set in Gemini's evaluation instructions. Participants cannot control the Drive query. Chunk IDs are cross-checked against those supplied in the prompt. If retrieval fails, AI grading **must not proceed**: use Manual Scoring. The trainer must approve each score before public reveal.

This is keyword-based chunk retrieval, **not embedding/vector semantic search**, and it does not recursively read every file in the reference folder. New legal uploads must be indexed into the referenced JSONL corpus to be used automatically. There is no live legal certification, and no confidential employee data may be used.

## Required live deployment steps
**A GitHub commit does not redeploy the Apps Script Web App.** The owner must:
1. Open the bound Apps Script project behind [Arena database](https://docs.google.com/spreadsheets/d/19zwo9t-NXAWZJla5eL5TrGgagR55v1KeIRJ_DRHFxu0/edit).
2. Replace `Code.gs` with the current [SCA backend](./apps-script/Code.gs).
3. Save, then run `scaKnowledgeHealthCheck()` in the Apps Script editor, authorizing Drive access and verifying 93 HR and 45 legal chunks can be read. A failure means no AI grading should be used until fixed.
4. Keep the existing `GEMINI_API_KEY`, `GEMINI_MODEL`, `ADMIN_PASSPHRASE` securely in **Script Properties**. Do not put secrets on GitHub.
5. **Deploy → Manage deployments → Edit → New version → Deploy** for the existing Web App. Do not create another URL unless necessary.
6. Create a **new training session** to avoid old group/case data; complete one controlled test with a team answer, Gemini draft score, instructor approval and Google Sheets persistence.

## Addresses
- [Arena access](https://sahaarty0.github.io/winners-ai-for-hr/arena/)
- [GitHub code](https://github.com/sahaarty0/winners-ai-for-hr/tree/main/arena)
- [Direct Apps Script Web App](https://script.google.com/macros/s/AKfycbyZUW9VDB82FN37sM4DBaW559_-ClInkfpV3HlYPqFLZyonOXOcXDbF6LQ2FRTYDdBq/exec)

**Deployment status:** GitHub source is updated; until Apps Script deployment and the full end-to-end smoke test are confirmed, do not claim the live grader uses the Drive chunks.
