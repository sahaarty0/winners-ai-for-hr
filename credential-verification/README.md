# WINNERS | AI Document Fraud Detection & Credential Verification
Standalone private Google Apps Script web app (v1.0). One-page Arabic RTL upload → extraction → observations → HR action approval interface.
The GitHub Pages index is only a **local demo preview**, NOT a live Gemini backend. Never upload real applicant files into a public website. Open the private Apps Script Web App for actual analysis.

## Install — Only two code pastes + Gemini key
1. Open https://script.new while logged in as the account that will own the application.
2. Replace Code.gs with the complete content of [backend/Code.gs](./backend/Code.gs).
3. Add HTML file named **Index** (the name must be exactly Index) and paste [backend/Index.html](./backend/Index.html).
4. In Project settings → Script Properties, add **GEMINI_API_KEY** with your Gemini API key. Optional **GEMINI_MODEL=gemini-3.6-flash**, **GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite**.
5. Deploy → New deployment → Web App → Execute as **Me** → Who has access: **Only myself** → Deploy; accept Google permissions (Apps Script uses HTTP requests and will create one private audit Google Sheet only when a decision is saved).
6. Open YOUR newly generated /exec URL (never guess it from this repository). Test the **معاينة تجريبية** first; then upload **SAMPLE TRAINING DOCUMENT, not real personal data** and provide explicit consent before the Gemini analysis.
7. After updating source: Deploy → Manage deployments → Edit → New version → Deploy. GitHub updates never auto-publish Apps Script changes.

## Functional MVP
- Accepts **1–3 PDF/JPG/PNG/DOCX**, individual ≤1.9 MB, combined ≤4.5 MB.
- File signature check, SHA-256, preliminary metadata/PDF markers, DOCX text extraction.
- Gemini inline image/PDF vision or DOCX extracted text, configurable model with 5xx-only fallback.
- Fields: holder, issuer, qualification, issue date, ref number, language. Indicative image/AI-redraw observations. No fabricated proof of forgery.
- Review action + reviewer + reason + manual issuer evidence + private Audit Sheet. Export JSON/TXT, browser print to PDF.
- No document originals saved to Drive by the app; **file bytes are sent to Gemini only if checkbox is selected**.
- Model unavailability leaves limited technical results intact.

## Non-capabilities / honest safety boundaries
**This is a controlled pilot, not a production certified forensic product.** There is **no AV, pixel-level forensic detector, validated C2PA/SynthID detector, cryptographic PDF-signature chain verification, official issuer registry integration, biometrics, certified identity verification, independent validation of accuracy, or robust RBAC**. AI observations are clues only. Only signed-in owner should have access. No hiring rejection/accusation solely from the output. Do not process real candidate data without privacy and security approval.
- Public preview: https://sahaarty0.github.io/winners-ai-for-hr/credential-verification/
- Gemini API docs: https://ai.google.dev/gemini-api/docs/document-processing
- Apps Script HTML Service: https://developers.google.com/apps-script/guides/html/communication
- OWASP file upload: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
