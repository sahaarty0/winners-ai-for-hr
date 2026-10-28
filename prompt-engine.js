'use strict';
// Winners AI for HR — platform-, effort- and HR-domain-aware prompt instructions.
// These are educational workflows, not a claim of API connectivity or feature availability.
const WAI_MODEL_GUIDES={
 ChatGPT:{
  en:['Work interactively: break the HR request into clear inputs, assumptions, actions and a usable deliverable.','Use structured sections/tables for review; if file or data-analysis tools are available in the approved workspace, use them only with authorized anonymized inputs.'],
  ar:['اشتغل تفاعليًا: قسّم مهمة HR إلى مدخلات وافتراضات وخطوات ومخرج عملي.','استخدم أقسام وجداول واضحة، وما تفترضش وجود رفع ملفات أو Data Analysis إلا لو متاحة ومعتمدة وبياناتها مجهولة.']},
 Claude:{
  en:['Follow a document-first workflow: establish scope, source priority and a coherent, editable HR document.','Separate direct evidence from interpretation; supply an executive summary, consistent sections and a revision checklist.'],
  ar:['اتبع Document-first workflow: حدّد النطاق وترتيب المصادر واكتب مستند HR متماسك وقابل للمراجعة.','افصل الأدلة والاقتباسات عن التفسير؛ وقدّم Executive Summary وأقسام متسقة وقائمة مراجعة.']},
 Gemini:{
  en:['Follow an evidence-first workflow: list what must be verified, compare available source material, and flag contradictions.','Provide a source-check table and distinguish facts, inference and recommendations; never invent citations or presume research tools are active.'],
  ar:['اتبع Evidence-first workflow: حدّد ما يحتاج تحقق وقارن المصادر واظهر التعارضات.','قدّم جدول للتحقق من المصادر وافصل الوقائع عن الاستنتاجات والتوصيات، ولا تختلق روابط أو تفترض وجود أدوات بحث.']},
 Copilot:{
  en:['Plan around the authorized Microsoft 365 deliverable: Word, Excel, PowerPoint or Teams; name actual inputs and output location.','Make the instructions actionable in the target app with access/approval checks; do not assume tenant connections, permissions or licensing.'],
  ar:['خطّط حسب مخرج Microsoft 365 المطلوب: Word أو Excel أو PowerPoint أو Teams، وحدد المدخلات ومكان التسليم.','قدّم خطوات تطبيق واضحة مع مراجعة الصلاحيات والاعتماد، ولا تفترض اتصالًا بملفات المؤسسة أو ترخيصًا معينًا.']}
};
const WAI_EFFORT_GUIDES={
 Low:{
  en:['FAST EXECUTION: provide one concise, usable deliverable directly, without a long methodology or unnecessary comparisons.','Mark essential missing information and run a short evidence/privacy check; human HR sign-off is still required for consequential decisions.'],
  ar:['LOW — تنفيذ سريع: سلّم مخرجًا واحدًا مختصرًا وقابلًا للاستخدام بدون شرح طويل أو مقارنات غير ضرورية.','اذكر أي مدخل ناقص مهم وراجع الدقة والخصوصية باختصار؛ القرارات المؤثرة ما زالت تتطلب Human Sign-off.']},
 Medium:{
  en:['STRUCTURED ANALYSIS: organize work into 3–5 stages, identify assumptions, evidence and trade-offs.','Compare at least two viable options when a choice is required; define actions, owners, checks and a decision-ready recommendation.'],
  ar:['MEDIUM — تحليل منظم: قسّم الشغل إلى 3–5 مراحل مع الافتراضات والأدلة والمفاضلات.','لو فيه قرار، قارن حلّين مناسبين على الأقل، وحدّد الإجراءات والمسؤولين والتحقق والتوصية النهائية.']},
 High:{
  en:['DEEP CONSULTING: define the business problem, scope, stakeholders, success criteria and data gaps before recommending action.','Test competing hypotheses/scenarios, evaluate alternatives against decision criteria, and distinguish facts from assumptions.','Provide risks, fairness/privacy/compliance checks, realistic KPIs and owners, implementation milestones and explicit human approval. Quantify impact only when verified inputs support it.'],
  ar:['HIGH — تحليل استشاري متعمق: عرّف Business Problem والنطاق وأصحاب المصلحة ومعايير النجاح وفجوات البيانات قبل التوصية.','اختبر فرضيات وسيناريوهات بديلة وقارن الحلول بمعايير واضحة وافصل الحقائق عن الافتراضات.','قدّم المخاطر والعدالة والخصوصية والامتثال وKPIs والمسؤوليات وخطة التنفيذ وHuman Approval؛ لا تحسب أثرًا بدون مدخلات موثقة.']}
};
const WAI_HR_CONTROLS={
 Recruitment:{en:'Use objective job-related evidence and fairness checks; no protected-attribute inference or automatic rejection.',ar:'استخدم أدلة موضوعية مرتبطة بالوظيفة وضوابط العدالة؛ لا تستنتج صفات محمية أو ترفض مرشحين تلقائيًا.'},
 'HR Operations':{en:'Separate company policy from current law; verify payroll formulas, personnel records and exceptions against authoritative evidence.',ar:'افصل سياسة الشركة عن القانون الساري وراجع Payroll والملفات والاستثناءات على أدلة معتمدة.'},
 'People Analytics':{en:'Define period, cohort, numerator, denominator, formula and source; check calculations and never treat correlation as proof of cause.',ar:'وضّح الفترة والعينة والبسط والمقام والمعادلة والمصدر؛ راجع الحسابات ولا تعتبر الارتباط دليل سببية.'},
 'HR Strategy':{en:'Link recommendations to business objectives, governance, decision owners and a realistic roadmap.',ar:'اربط التوصيات بأهداف Business والحوكمة وأصحاب القرار وRoadmap واقعية.'},
 'Learning & Development':{en:'Prove competency gaps and business need before selecting training interventions; define measurable outcomes.',ar:'أثبت فجوات الجدارات واحتياج الـBusiness قبل اقتراح التدريب، وحدّد نتائج قابلة للقياس.'},
 Performance:{en:'Specify fair KPI definitions, formulas, target assumptions and calibration or management approval.',ar:'حدّد تعريفات KPIs العادلة ومعادلاتها وافتراضات المستهدفات وCalibration والاعتماد الإداري.'},
 'Total Rewards':{en:'Use comparable job levels, verified market evidence and strict confidentiality; never invent benchmarks.',ar:'استخدم مستويات وظيفية قابلة للمقارنة ومصادر سوق موثقة وسرية صارمة؛ لا تختلق Benchmarks.'},
 'HR Digital Transformation':{en:'Specify user roles, authorization, process states, validations, approvals and acceptance tests.',ar:'حدّد الأدوار والصلاحيات ومراحل الإجراءات والتحقق والموافقات وحالات الاختبار.'}
};
function waiAdaptivePrompt(c,get){
 const ar=get('pLanguage')!=='en',k=ar?'ar':'en';
 const p=(WAI_MODEL_GUIDES[get('promptPlatform')]||WAI_MODEL_GUIDES.ChatGPT)[k];
 const e=(WAI_EFFORT_GUIDES[get('promptEffort')]||WAI_EFFORT_GUIDES.Medium)[k];
 const hr=WAI_HR_CONTROLS[c.module];
 const a=[ar?'منهج التنفيذ الخاص بالمنصة':'PLATFORM EXECUTION METHOD',...p.map(v=>'- '+v),'',
  ar?'مستوى التفكير وعمق التحليل':'REASONING DEPTH',...e.map(v=>'- '+v),'',
  ar?'ضوابط خاصة بمجال HR':'HR TASK SAFEGUARDS'];
 a.push('- '+(hr?hr[k]:(ar?'استخدم معايير مرتبطة بالوظيفة والأدلة وحوكمة القرار.':'Use job-relevant evidence and accountable HR decisions.')));
 if(c.adv)a.push('- '+(ar?'في المخرجات المرئية حافظ على الأبعاد والهوية والنص الحرفي ولا تفترض توفر تصدير ملف.':'For visual output preserve dimensions, brand identity and exact text; never assume export capabilities are enabled.'));
 if(['screen','payroll','audit','rewards','pms','succession','attrition','wfp'].includes(c.id))
  a.push('- '+(ar?'حتى في LOW: قرارات HR الحساسة تحتاج تحقق من العدالة والخصوصية والامتثال واعتماد بشري.':'Even on Low: consequential HR work requires fairness, privacy, compliance and human sign-off.'));
 return a;
}
function waiClarify(e,ar){
 const n=e==='Low'?2:e==='High'?5:4;
 return ar?'قبل التسليم اسأل حتى '+n+' أسئلة ضرورية فقط عن البيانات الناقصة وانتظر الإجابة.':'Ask at most '+n+' essential questions about missing inputs, then wait for answers.';
}
function waiVisualWorkflow(e,ask,ar){
 if(e==='Low')return ar?[
  'طريقة العمل — تنفيذ سريع','1) نفّذ تصميمًا مباشرًا'+(ask?' بعد سؤالين ضروريين بحد أقصى':'')+'، دون مراحل طويلة.','2) راجع دقة البيانات والنصوص والـBrand Kit وسلّم المخرج.'
 ]:[
  'WORKING METHOD — FAST DELIVERY','1) Build a direct visual'+(ask?', asking at most 2 essential questions':'')+'; avoid extended prework.','2) QA factual content, exact text and brand kit, then deliver.'
 ];
 if(e==='Medium')return ar?[
  'طريقة العمل — مرحلتان','1) اعرض Layout مختصر'+(ask?' واسأل حتى 4 أسئلة أساسية':'')+' قبل التنفيذ عند الحاجة.','2) نفّذ المخرج وراجع القراءة والهوية والحقائق.'
 ]:[
  'WORKING METHOD — 2 STAGES','1) Propose a brief layout'+(ask?' and ask up to 4 essential questions':'')+' before building when necessary.','2) Deliver and check readability, branding and factual fidelity.'
 ];
 return ar?[
  'طريقة العمل — 3 مراحل','1) حدّد هدف التصميم والجمهور والأدلة ومعايير النجاح'+(ask?' واسأل حتى 5 أسئلة مهمة':'')+' وانتظر اعتماد التصور.','2) نفّذ بالهوية والنص المعتمدين.','3) اختبر الدقة والمخاطر وسهولة القراءة والخصوصية وقدّم تقرير QA.'
 ]:[
  'WORKING METHOD — 3 STAGES','1) Define audience, objective, evidence and success criteria'+(ask?' with up to 5 targeted questions':'')+'; wait for concept approval.','2) Build the approved output with exact brand and text.','3) Challenge accuracy, legibility, bias and privacy; report QA results.'
 ];
}
