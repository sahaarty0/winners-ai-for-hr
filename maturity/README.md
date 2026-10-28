# WINNERS — HR Maturity Assessment Web App

A source-grounded, bilingual assessment based on **HR Maturity Assessment M&D (1).xlsx**.

## Open the app
- GitHub Pages: https://sahaarty0.github.io/winners-ai-for-hr/maturity/
- Repository: https://github.com/sahaarty0/winners-ai-for-hr/tree/main/maturity
- Original master file (unchanged): https://docs.google.com/spreadsheets/d/1ktAbKUblCeQ1BfZcv5yOAgk-6NO2KSGw/edit

## Exact scope from the source
- Functional Audit: 11 cores, 55 checklist questions (tabs F1/F2/F3)
- Strategic Audit: 9 cores, 45 checklist questions (tabs S1/S2/S3)
- 100 total source questions; 5 binary checks per core.
- Original scale: Available and evidenced = 1; Not available = 0.
- Core score = arithmetic average of 5 answers.
- Functional and Strategic results = average of corresponding core scores.
- Green >= 80%; Yellow >= 60% and <80%; Red <60%.
- Combined "Overall Maturity Index" is an **additional metric** produced by the app as the average of all 20 core scores; this is *not an existing formula in the original workbook*.

## Flexible scope — release 2026-10-28
Three scopes are selectable from the assessment page:
- **Full HR Maturity:** all 20 cores, 100 required answers.
- **Functional Assessment:** 11 functional cores, 55 required answers.
- **Focused Assessment:** any one or more of the 20 cores, 5 questions per selected core.

Completion is defined as **all questions in the selected scope answered**; 100 source questions are not mandatory for Functional or Focused mode. Per-core and track scores use exactly the original 0/1 rules. An excluded core shows **NOT ASSESSED** even if it has saved answers from a different scope. It is never counted as zero and never used in the selected-scope result.

The combined score and track scores in limited modes are **scoped estimates, not company-wide HR maturity**. Exports include the selected scope, and the consulting gate considers scoped completion. Changing scope does not erase previously entered answers; use "Start over" only to clear them.

The original Excel source is still read-only. No authenticated client login, cloud storage, automatic receipt of assessments or direct write-back is implemented.

## User workflow
1. Enter organization/assessor metadata (optional).
2. Answer the stages in the selected scope (5 questions per core).
3. Mark each requirement as Available and evidenced or Not Available; optionally write an auditor note.
4. The app saves answers in browser local storage, and stage progress is visible.
5. The report shows per-core scores once *every* question in that core has been answered. It does not silently treat unanswered questions as 0.
6. The executive report displays audit scores only after full coverage. Until then results are labeled provisional.
7. An improvement backlog lists each answered **Not Available** source question, with proposed core-level deliverables.
8. A prioritised illustrative 30/60/90-day improvement roadmap is generated from gap severity.
9. Export "Excel-ready CSV" with source tabs and row numbers, or export/import a JSON backup.
10. Print the report to PDF in the browser.

## Connection model — important
The source question bank is a **versioned snapshot transcribed from the Excel workbook**, not a live Google Sheets API connection. The original workbook is not modified by the app.

Currently:
- User responses remain on the local browser until manually exported.
- No answer is sent to Google Drive, GitHub, or any external server.
- The CSV includes Source Sheet, Source Row, Availability, Score, and Audit Comment, enabling review/import to the Excel workbook.
- The app loads source questions from the local versioned JSON file hosted alongside the site.

For **live multi-user, write-back and continuous question sync**, a separate authenticated backend and ideally a converted native Google Sheet should be configured and tested. A public GitHub Pages site **must not** include a service token or unprotected write-enabled Google Apps Script webhook. Never expose HR personal data, client secrets, or authentication tokens in frontend JavaScript.

## Design & methodology
Winners visual theme: deep Navy, cyan highlights, restrained gold, bilingual Arabic/English, core-by-core assessment.
Actions and the 30/60/90 timing are *consulting suggestions*, not data extracted from the source workbook. Legal and people-impact decisions require appropriate accountable review.

## Acceptance checks
- 11+9 cores and 55+45 questions, all IDs unique.
- Unanswered core has score = null, not red/0.
- 3 available / 2 not available -> 60% Yellow.
- 2 available / 3 not available -> 40% Red.
- 100 available -> 100% Green.
- No writes or live API calls to the source Excel workbook.
