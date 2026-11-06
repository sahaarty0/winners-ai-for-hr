# WINNERS — Job Architecture Challenge (Front-End V1)

Standalone white / Navy / Dark Yellow training game for four groups and four HR cases. This project is separate from the existing Winners AI Arena.

Live path: https://sahaarty0.github.io/winners-ai-for-hr/job-analysis-challenge/

## Structure

| Group | Case | Practical deliverable |
|---|---|---|
| 01 | Job Analysis — Undefined Sales Executive | Job Analysis Plan + Task Inventory |
| 02 | Role Clarification — HR Generalist vs Personnel | Responsibility Map + Mini RACI |
| 03 | Job Re-Design — Recruitment after ATS and AI | AS-IS / TO-BE + redesigned role and KPIs |
| 04 | Job Description — Broken JD | JD Audit + revised JD |

Each group runs PRE and POST against its own case. Each round has 3 open-ended reasoning challenges plus an external practical deliverable. The exported JSON file is a local artifact; it is NOT sent to a backend.

## Current frontend status

- Four real interactive case cards and corresponding details
- PRE / POST round switch
- On-device local draft saving and local JSON answer export
- Practical assignment instructions with link field
- Rubric-weight display, each out of 100
- Score cards pending until a real trusted grading backend provides trainer-approved scores
- An explicitly labeled Design Preview slider to demonstrate score-dependent coloring
- Reused official Winners logo from public Arena
- Responsive mobile layout, Arabic Egyptian phrasing, separate readable English HR terminology

## Color scale — classroom design thresholds, not standardized grades

0–49: red / needs development
50–69: amber / acceptable foundation
70–84: blue / good
85–100: green / advanced

## Backend plan (not yet built)

1. Teacher creates a training session and group registration credentials; one case is assigned to each of the four groups.
2. Google Apps Script validates group, case, round, revision, payload length, and submission token server-side.
3. Persist complete submission to Google Sheets first; only then run Gemini rubric grading.
4. Gemini returns a structured JSON proposed score per criterion, reasons, cited submission evidence, uncertainty flags and missing information.
5. Instructor reviews and explicitly approves scores. Never auto-publish raw Gemini grades.
6. A release switch controls which approved Pre/Post scores are visible. Public results must never include names, personal information, or complete answers.
7. Store GEMINI_API_KEY only in Apps Script Script Properties, never in GitHub.
8. Rate-limit requests, retry transient model failures with backoff, preserve submissions when quotas fail, and offer a manual instructor grading path.
9. External document URLs must be verified and their content retrieved with appropriate permission; a bare URL is not sufficient evidence for Gemini.
10. GitHub Pages to Google Apps Script requires a separately tested cross-origin submission and acknowledgement bridge; ordinary fetch POST JSON may fail due to Apps Script CORS behavior.

### Offline payload schema

schemaVersion = winners-job-architecture-submission-v1
appVersion = 1.0.0
rubricVersion = 1.0
groupId = group-01...group-04
caseId = 1...4
phase = pre / post
leaderName = string
responses = Q1...Q3 with answer text
practicalSummary = text
practicalDocumentUrl = URL or null
exportedAt = ISO timestamp
submissionStatus = NOT_SENT_TO_BACKEND

### Proposed backend tabs

Sessions: sessionId, status, pre window, post window
Groups: groupId, caseId, leader alias, token hash
Submissions: submissionId, groupId, caseId, phase, answersJson, summary, documentUrl, receivedAt, revision
Grades: submissionId, modelId, rubricVersion, criterionScoresJson, proposedTotal, reviewerAdjustments, approvedTotal, revealStatus
Audit: timestamp, actor role, action, entity, previous / new status

## Evaluation boundaries

- Group-level pre/post delta is the main skill measure; direct ranking between different cases is not automatically equivalent.
- Case-specific rubrics all total 100 points.
- Gemini grading is an instructor decision-support tool, not verified truth.
- Synthetic scenarios only; do not paste real candidate CVs or sensitive personnel data.
- The private instructor answer key must NOT be published to this repository.
