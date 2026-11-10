# SCA HR Maturity — Private Gemini Backend (Google Apps Script)

**Ready-to-install source; not yet a live Google Apps Script project.** The connected tools cannot create/deploy an Apps Script project in the owner's account. These setup steps must be completed by the account owner before any Gemini connection is live.

## Source files
- [Code.gs](./Code.gs): private server-side Gemini API adapter, model availability check, protected JSON assessment analysis, optional research context.
- [Index.html](./Index.html): private console for key status, Gemini test, assessment JSON upload and report export.
- [appsscript.json](./appsscript.json): optional Google Apps Script V8 manifest.

## Installation — account owner
1. Sign in to Google and open **https://script.new**. Create a standalone Apps Script project named **Winners SCA Maturity Gemini Backend**.
2. Replace the default **Code.gs** with the complete content of the Code.gs file linked above.
3. Add a new **HTML** file named **Index**. Paste the contents of Index.html.
4. Save. Open **Project Settings > Script Properties > Add script property**:
   - Property: `GEMINI_API_KEY`
   - Value: your Gemini API key from https://aistudio.google.com/apikey
   - Optional: `GEMINI_MODEL` (the code defaults to `gemini-3.5-flash`; verify model availability with the console; change as needed for your key/project).
   - Optional: `ALLOW_SCA_RESEARCH_CONTEXT` is **false by default**. Set to `true` only after approval to send selected research summaries from Drive to Gemini.
5. **Deploy > New deployment > Web app**. Set **Execute as: Me**, **Who has access: Only myself**. NEVER select Anyone or Anyone anonymous, because that would expose a key-backed callable analysis service.
6. Authorize the requested permissions from the Google account yourself, open the real /exec link, then run **اختبار Gemini API**.
7. Open the existing SCA Maturity Assessment at https://sahaarty0.github.io/winners-ai-for-hr/sca-maturity/ and download its JSON via **نسخة احتياطية**. Upload that file in the new private console; consent explicitly and run the analysis.

## Security and integration limits
- The original Winners Maturity tool and AI Arena are untouched.
- This is a **private Apps Script HTMLService console**, not an unauthenticated public HTTP API. Because of cross-origin and access restrictions, it does NOT yet do one-click browser-to-backend requests from GitHub Pages. The supported route is a deliberate JSON export/import.
- By default Gemini receives only selected question IDs, Arabic questions, source IDs and binary answers. **Company name, assessor name, free-text comments, personnel data and confidential documents are excluded.**
- Source lookups use only approved research CSV indexes, and are OFF until `ALLOW_SCA_RESEARCH_CONTEXT=true`. They are not original legal texts or verification of current SCA HR operations.
- The optional HR CSV research file ID is `1-cuxDw0unLLioVt6IrzgyE6oDfPRmJ25` and legal CSV index file ID is `1Vnf_C91C3l_h5NwEB6actbInEQo2JhZC`. The Apps Script owner must have Drive access.
- No API connection, deployment, quotas or account permissions can be verified until the owner completes the Google Apps Script project setup.
- Use only a private **Only myself** deployment and never insert API keys into HTML, GitHub or chat.

## Diagnosing Gemini HTTP 503

- 503 = Gemini service temporarily busy. It is **not** proof that an API key or billing is invalid (those are distinct errors).
- Updated Code.gs retries 503/500/502/504 at most **twice** (3 attempts total), with short pauses; 429 is **not** retried automatically.
- Test in this order: **اختبار Gemini API** (model/key listing), **اختبار توليد نص صغير** (real generation), and only then upload a test SCA JSON.
- To try a less-loaded model, list models available to your own key and set `GEMINI_MODEL` to one of those IDs in Apps Script > Project Settings > Script Properties. E.g. `gemini-3.5-flash-lite` only **if listed** for your project.
- Updating GitHub **does not update a live Apps Script deployment**: replace Code.gs and Index.html in the owner project, Save, then Deploy > Manage deployments > Edit > New version > Deploy.
- If 503 persists on multiple available models, check Google's Gemini API status and Apps Script > Executions; no code-side fix can force an overloaded upstream model to accept a request.

## Official references
- https://developers.google.com/apps-script/guides/web
- https://developers.google.com/apps-script/guides/html/communication
- https://ai.google.dev/api
