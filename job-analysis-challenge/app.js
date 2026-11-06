"use strict";

/*
 * WINNERS JOB ARCHITECTURE CHALLENGE — FRONT-END V1
 * Public GitHub Pages code. Synthetic learning cases only.
 * No API keys, model prompts, grading keys, or final instructor answers belong here.
 * Backend will be attached in a separate phase; until then export is an offline JSON receipt.
 */
const APP_VERSION = "1.0.0";
const RUBRIC_VERSION = "1.0";
const STORAGE_KEY = "winners_job_architecture_challenge_drafts_v1";

const CASES = [
  {
    id: 1, name: "Job Analysis", title: "الوظيفة اللي محدش عارف حدودها",
    company: "Delta Distribution · حالة تدريب افتراضية", glyph: "01",
    short: "الشركة عايزة تعيّن Sales Executive، لكن كل مدير فاهم الدور بطريقة مختلفة.",
    intro: "شركة توزيع متوسطة بتجهّز لإعلان وظيفة Sales Executive. مدير المبيعات شايف إن الدور هدفه فتح عملاء جدد، بينما مدير خدمة العملاء متوقع إنه يتابع شكاوى العملاء الحاليين. فريق الـ HR استلم عنوان الوظيفة فقط، ومطلوب منه يحدد الشغل الفعلي قبل ما يكتب أي Job Description.",
    objective: "اعمِلوا خطة Job Analysis قابلة للتنفيذ تحدد مصادر البيانات وطريقة جمعها، وتفرّق بين المهام الأساسية والمهام المختلف عليها.",
    facts: [
      "طلب التعيين مكتوب فيه Job Title فقط، من غير Job Purpose أو Reporting Line أو عدد الشواغر.",
      "مدير المبيعات بيقول: «أهم نتيجة متوقعة هي جذب عملاء جدد»، لكن ماقدّمش KPIs أو Targets معتمدة.",
      "خدمة العملاء بتقول: «الموظف الجديد لازم يرد على الشكاوى والمتابعات»، رغم وجود فريق Customer Service قائم.",
      "الموظفون الحاليون بيستخدموا CRM، لكن صلاحيات المستخدم الجديد وطريقة قياس الأداء مش محددين.",
      "مفيش Job Observation أو مقابلات مع شاغلي الوظائف الحالية اتعملت لحد دلوقتي.",
      "الإدارة طالبة نشر الإعلان سريعًا، لكن مش موافقة لسه على حدود مسؤولية الوظيفة."
    ],
    deliverables: [
      "Job Analysis Data Collection Plan: الأطراف المشاركة، الأسئلة، وأدوات جمع البيانات.",
      "Task Inventory: المهام المؤكدة والمختلف عليها والبيانات الناقصة.",
      "Draft Job Purpose وReporting Line مقترحين بوضوح إنهم محتاجين اعتماد."
    ],
    questions: [
      "إيه أهم 3 مصادر معلومات هترجعوا لها قبل كتابة الـ Job Description؟ وليه؟",
      "إزاي هتحسموا الخلاف بين المبيعات وخدمة العملاء من غير ما تفترضوا مهام من عندكم؟",
      "حدّدوا 4 عناصر لازم تكون موجودة في مخرجات الـ Job Analysis، واذكروا إيه اللي لسه محتاج اعتماد."
    ],
    rubric: [
      ["تشخيص فجوات البيانات وأوجه التعارض",20],
      ["اختيار طرق جمع المعلومات وأصحاب المصلحة",25],
      ["تحليل المهام والحدود الوظيفية",25],
      ["قابلية تنفيذ المخرجات وتنظيمها",20],
      ["إظهار الافتراضات ونقاط الاعتماد",10]
    ]
  },
  {
    id: 2, name: "Role Clarification", title: "مين مسؤول عن إيه بالضبط؟",
    company: "Nova Clinics · حالة تدريب افتراضية", glyph: "02",
    short: "تداخل متكرر بين HR Generalist وPersonnel Specialist بيأخر تنفيذ الإجراءات.",
    intro: "مجموعة عيادات عندها HR Generalist وPersonnel Specialist. الاتنين بيتدخلوا في بعض المهام، وفي مرات كتير المديرين بيطلبوا الشغل من الاتنين مع بعض. النتيجة تأخير، تكرار، وعدم وضوح مين عنده صلاحية يراجع أو يعتمد.",
    objective: "افصلوا مسؤوليات الوظيفتين، وحددوا نقاط التسليم والتصعيد والصلاحيات، من غير ما تخلطوا بين التنفيذ والاعتماد.",
    facts: [
      "الـ HR Generalist بيتابع التوظيف والتهيئة الأولية للموظفين، وبيراجع أحيانًا بيانات الحضور.",
      "الـ Personnel Specialist مسؤول حاليًا عن ملفات الموظفين والعقود وسجلات الحضور.",
      "المديرون بيرسلوا تصحيح بيانات الحضور للموظفين الاتنين، ومفيش Owner محدد للطلب.",
      "الـ Payroll بيتأخر لأن بيانات الحضور النهائية مش واضحة مين بيراجعها ومين بيعتمدها.",
      "مفيش RACI Matrix معتمدة أو SOP موحد يحدد نقطة تسليم البيانات.",
      "الوظيفتين بيرفعوا تقارير للـ HR Manager، لكن حدود توقيعه وموافقاته مش موثقة في الحالة."
    ],
    deliverables: [
      "Responsibility Map يحدد الدور الأساسي والمساند لكل مهمة.",
      "Mini RACI Matrix لخمس عمليات: التعيين، ملفات الموظفين، الحضور، مراجعة بيانات Payroll، والتصعيد.",
      "اقتراح Reporting Lines وApproval Points مع قائمة بالمعلومات التي تحتاج اعتماد."
    ],
    questions: [
      "فين التداخل الحقيقي بين الوظيفتين؟ وإيه مخاطره على الشغل والبيانات؟",
      "وزّعوا مسؤولية التنفيذ والمراجعة والاعتماد في عمليتين على الأقل، ووضحوا ليه.",
      "لو حصل خطأ في بيانات الحضور، إيه مسار التصحيح والتصعيد من غير ما نفترض صلاحية اعتماد؟"
    ],
    rubric: [
      ["تحديد التداخل ومخاطر التشغيل",25],
      ["توزيع واضح للمسؤوليات وOwnership",25],
      ["منطق RACI والفصل بين التنفيذ والاعتماد",20],
      ["وضوح نقاط التسليم والتصعيد",20],
      ["الافتراضات والصلاحيات غير المؤكدة",10]
    ]
  },
  {
    id: 3, name: "Job Re-Design", title: "الوظيفة اتغيرت… والوصف لسه قديم",
    company: "Orion Retail · حالة تدريب افتراضية", glyph: "03",
    short: "دخول ATS وAI خلّى مهام Recruitment Specialist محتاجة إعادة تصميم، مش تحديث كلمات.",
    intro: "شركة Retail بدأت تستخدم ATS مع أدوات AI لمساندة فريق التوظيف. قبل التغيير، Recruitment Specialist كان بيراجع CVs يدويًا وينسّق مواعيد المقابلات. دلوقتي النظام بيصنّف طلبات التوظيف وبيجهّز مسودات Shortlist. مع ذلك، الـ Job Description القديمة لسه بتعامل مراجعة كل CV يدويًا باعتبارها المهمة الأساسية.",
    objective: "اعملوا Job Re-Design حقيقي للدور: AS-IS → TO-BE، وتوزيع مهام بين الإنسان والتكنولوجيا، مع Competencies وKPIs وحدود قرار واضحة.",
    facts: [
      "الـ ATS بيستقبل التقديمات وبيسجل Status لكل طلب ويكشف الحقول الناقصة، لكنه مش بيثبت أهلية المرشح تلقائيًا.",
      "أداة AI بتقترح Summary أو تصنيف أولي، وممكن تنتج أخطاء أو تقييمات غير مدعومة بالمعلومات.",
      "Recruitment Specialist كان مسؤول عن Screening يدوي، ترتيب المقابلات، متابعة Hiring Managers، وتجهيز التقارير.",
      "الشركة لسه محتاجة Structured Interviews، مراجعة بشرية، والتأكد من عدالة المعايير المستخدمة.",
      "مفيش Baseline معتمد لوقت مراجعة الطلبات أو معدل التحويل من Shortlist إلى Interview.",
      "الإدارة طلبت تحديث الـ JD والـ KPIs، لكن محددتش إن في تقليل عمالة أو تفويض قرارات التعيين لـ AI."
    ],
    deliverables: [
      "AS-IS / TO-BE Task Matrix: أتمتة، مساعدة تقنية، أو مسؤولية بشرية.",
      "Redesigned Job Purpose وKey Responsibilities وCompetencies.",
      "3 KPIs قابلة للقياس + Human Review Gates + بيانات الـ Baseline المطلوبة."
    ],
    questions: [
      "إيه المهام اللي ممكن تتأتمت، وإيه اللي يفضل تحت Human Judgment؟ ادّوا مبرر لكل قرار.",
      "إزاي هيتغير Job Purpose والمهارات المطلوبة لـ Recruitment Specialist بعد دخول ATS وAI؟",
      "اقترحوا 3 KPIs عملية، مع مصدر البيانات وطريقة الحساب ونقطة المراجعة البشرية."
    ],
    rubric: [
      ["وضوح مقارنة AS-IS وTO-BE",20],
      ["منطق إعادة توزيع المهام وJob Re-Design",25],
      ["تحديث Job Purpose وCompetencies",20],
      ["KPIs قابلة للقياس مع مصدر البيانات",20],
      ["Human Oversight وضبط أخطار استخدام AI",15]
    ]
  },
  {
    id: 4, name: "Job Description", title: "الوصف الوظيفي اللي محتاج إنقاذ",
    company: "Harbor Services · حالة تدريب افتراضية", glyph: "04",
    short: "JD مكتوبة بعبارات عامة وغير قابلة للتقييم… والمطلوب إعادة بنائها من الصفر.",
    intro: "شركة خدمات أرسلت للـ HR مسودة Job Description لوظيفة Customer Support Team Lead. المسودة مليانة تعبيرات عامة، ومفيهاش هدف وظيفي واضح، ولا مسؤوليات محددة، ولا متطلبات مرتبطة بأداء الشغل.",
    objective: "شخّصوا عيوب الـ JD الحالية، واكتبوا نسخة عملية تفصل بين Job Purpose وResponsibilities وJob Requirements وKPIs.",
    facts: [
      "المسمى الحالي: Customer Support Team Lead — والقسم: Customer Support.",
      "النص المرسل: «مسؤول عن كل حاجة تخص خدمة العملاء، ولازم يحل كل المشاكل بسرعة».",
      "في المتطلبات: «لازم يكون سوبر ستار وخبرة طويلة جدًا»، من غير تحديد معنى الخبرة أو علاقتها بالدور.",
      "الـ Reporting Line غير مكتوب، وعدد الموظفين اللي هيقودهم الشخص غير متاح.",
      "الإدارة ذكرت إن الدور بيتابع جودة الردود ويصعّد الحالات المعقدة، لكن مفيش معيار جودة أو Target معتمد.",
      "البيانات الحالية لا تكفي لاعتماد Grade أو Salary أو عدد سنوات خبرة إلزامية؛ دي مدخلات مطلوبة من الإدارة."
    ],
    deliverables: [
      "JD Quality Audit مختصر بالأخطاء وتأثير كل خطأ.",
      "Job Description محسّنة: Job Purpose، Reporting Line (pending confirmation)، 5 Responsibilities، Requirements، Competencies.",
      "3 KPIs مع تعريف ومصدر بيانات، وقائمة بالمدخلات المطلوبة قبل الاعتماد."
    ],
    questions: [
      "حددوا 5 أخطاء جوهرية في الـ JD الحالية، واشرحوا تأثيرها على Recruitment أو Performance.",
      "إزاي هتكتبوا Job Purpose وثلاث مسؤوليات بصياغة محددة وقابلة للفهم؟",
      "إيه الفرق بين Job Requirements وCompetencies وKPIs في الحالة دي؟ وإيه اللي مينفعش نفترضه؟"
    ],
    rubric: [
      ["تشخيص عيوب الـ JD وربطها بالأثر",20],
      ["وضوح Job Purpose والمسؤوليات",25],
      ["ملاءمة Requirements وCompetencies",20],
      ["منطق KPIs والتعريفات ومصادر البيانات",20],
      ["الوضوح المهني والمعلومات الناقصة",15]
    ]
  }
];

const state = {
  phase: "pre",
  activeCase: null,
  preview: null,
  drafts: loadDrafts(),
  // Populated only by a future trusted backend adapter after trainer approval.
  approvedScores: {}
};
const el = (id) => document.getElementById(id);
const safeHtml = (text) => String(text == null ? "" : text).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const keyFor = (id, phase) => "g" + id + "_" + phase;
const validScore = (value) => Number.isFinite(value) && value >= 0 && value <= 100;
const stageLabel = (phase) => phase === "pre" ? "قبل التدريب" : "بعد التدريب";

function loadDrafts(){
  try{
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if(!data || typeof data !== "object" || Array.isArray(data)) return {};
    return data;
  }catch(_){return {};}
}
function saveDrafts(){
  try{localStorage.setItem(STORAGE_KEY, JSON.stringify(state.drafts));return true;}
  catch(_){return false;}
}
function scoreLevel(score){
  if(!validScore(score)) return "pending";
  if(score <= 49) return "red";
  if(score <= 69) return "amber";
  if(score <= 84) return "blue";
  return "green";
}
function scorePhrase(score){
  const l = scoreLevel(score);
  return {red:"يحتاج تطوير",amber:"أساس مقبول",blue:"أداء جيد",green:"متقدم",pending:"لسه مفيش تقييم"}[l];
}
function actualScores(id){
  const row=state.approvedScores[String(id)]||{};
  return {pre:validScore(row.pre)?row.pre:null,post:validScore(row.post)?row.post:null};
}
function displayScoreFor(id, phase){
  const actual=actualScores(id)[phase];
  if(validScore(actual)) return {value:actual,preview:false};
  if(state.preview && state.preview.id===id && state.preview.phase===phase) return {value:state.preview.score,preview:true};
  return {value:null,preview:false};
}
function showToast(text){
  const t=el("toast");
  t.textContent=text;t.hidden=false;
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>{t.hidden=true;},3800);
}
function renderCards(){
  el("caseCards").innerHTML=CASES.map((c)=>{
    const out=displayScoreFor(c.id,state.phase);
    const selected=state.activeCase===c.id;
    const draft=state.drafts[keyFor(c.id,state.phase)];
    const level=scoreLevel(out.value);
    const score=validScore(out.value)?'<strong>'+out.value+'</strong>/100':"في انتظار Gemini";
    const status=out.preview?"معاينة لون فقط":draft?"مسودة محفوظة":validScore(out.value)?"درجة معتمدة":"جاهز للتحدّي";
    return '<button class="case-card'+(selected?' is-selected':'')+(out.preview?' is-preview':'')+'" data-case="'+c.id+'" data-level="'+level+'" type="button" aria-pressed="'+selected+'">'+
    '<div class="card-head"><span class="group-label">GROUP '+String(c.id).padStart(2,"0")+'</span><span class="case-number">'+String(c.id).padStart(2,"0")+'</span></div>'+
    '<div class="card-icon" aria-hidden="true">'+c.glyph+'</div>'+
    '<span class="card-title-latin" lang="en" dir="ltr">'+safeHtml(c.name.toUpperCase())+'</span>'+
    '<h3>'+safeHtml(c.title)+'</h3><p>'+safeHtml(c.short)+'</p>'+
    '<div class="card-bottom"><span class="card-go">افتح الـ Case <span aria-hidden="true">←</span></span><span class="card-score'+(out.preview?' is-demo':'')+'">'+score+'</span></div>'+
    '<div class="visually-hidden" style="position:absolute;clip:rect(0 0 0 0);height:1px;width:1px;overflow:hidden">'+safeHtml(status)+'</div></button>';
  }).join("");
  Array.from(document.querySelectorAll("[data-case]")).forEach((btn)=>{
    btn.addEventListener("click",()=>selectCase(Number(btn.getAttribute("data-case"))));
  });
}
function renderScores(){
  el("scoreCards").innerHTML=CASES.map((c)=>{
    const approved=actualScores(c.id);
    const current=displayScoreFor(c.id,state.phase);
    const chosen=validScore(current.value)?current.value:
      validScore(approved.post)?approved.post:validScore(approved.pre)?approved.pre:null;
    const level=scoreLevel(chosen);
    const preLabel=validScore(approved.pre)?approved.pre:"—";
    const postLabel=validScore(approved.post)?approved.post:"—";
    const delta=validScore(approved.pre)&&validScore(approved.post)?approved.post-approved.pre:null;
    const msg=current.preview?"معاينة فقط — مش درجة معتمدة":validScore(chosen)?scorePhrase(chosen):"مستني تحليل Gemini واعتماد المدرب";
    const display=validScore(chosen)?chosen:"—";
    return '<article class="score-card" data-level="'+level+'"><div class="score-top"><span class="score-group">GROUP '+String(c.id).padStart(2,"0")+'</span><span class="score-state">'+(current.preview?"Preview":validScore(chosen)?"Approved":"Pending")+'</span></div>'+
      '<h3>'+safeHtml(c.name)+'</h3><div class="score-main"><strong>'+display+'</strong><small>/100</small></div>'+
      '<div class="score-breakdown"><div>قبل التدريب <b>'+preLabel+'</b></div><div>بعد التدريب <b>'+postLabel+'</b></div></div>'+
      '<div class="score-detail">'+safeHtml(msg)+(delta!==null?' · التحسّن '+(delta>=0?'+':'')+delta+' نقطة':'')+'</div></article>';
  }).join("");
}
function setPhase(phase){
  if(phase!=="pre"&&phase!=="post")return;
  captureDraft();
  state.phase=phase;
  Array.from(document.querySelectorAll(".phase-button")).forEach((btn)=>{
    const selected=btn.dataset.phase===phase;
    btn.classList.toggle("active",selected);btn.setAttribute("aria-pressed",String(selected));
  });
  renderCards();renderScores();
  if(state.activeCase!==null)renderWorkspace();
}
function selectCase(id){
  const item=CASES.find((c)=>c.id===id);
  if(!item)return;
  captureDraft();
  state.activeCase=id;
  renderCards();renderWorkspace();
  el("workspace").scrollIntoView({behavior:"smooth",block:"start"});
}
function makeElement(tag,className,text){
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined)node.textContent=text;
  return node;
}
function renderWorkspace(){
  const c=CASES.find((item)=>item.id===state.activeCase);
  if(!c){el("workspaceContent").hidden=true;el("workspaceEmpty").hidden=false;return;}
  el("workspaceEmpty").hidden=true;el("workspaceContent").hidden=false;
  el("workspaceBadge").textContent="GROUP "+String(c.id).padStart(2,"0")+" · "+stageLabel(state.phase);
  el("briefTitle").textContent=c.company;
  el("briefIntro").textContent=c.intro;
  el("briefObjective").textContent=c.objective;
  el("factList").replaceChildren(...c.facts.map((fact,i)=>{
    const li=makeElement("li");
    const num=makeElement("span","fact-number",String(i+1).padStart(2,"0"));
    li.append(num,makeElement("span","",fact));return li;
  }));
  el("deliverableList").replaceChildren(...c.deliverables.map((item)=>{
    const div=makeElement("div","deliverable");
    div.append(makeElement("i","","✓"),makeElement("span","",item));return div;
  }));
  el("rubricList").replaceChildren(...c.rubric.map(([label,weight])=>{
    const row=makeElement("div","rubric-item");
    const span=makeElement("span","",label);
    const bar=makeElement("div","rubric-bar");
    const inner=makeElement("i");
    inner.style.width=weight*4+"%";
    bar.append(inner);
    row.append(span,bar,makeElement("b","",weight+"%"));return row;
  }));
  el("answerRound").textContent=state.phase==="pre"?"PRE-TRAINING":"POST-TRAINING";
  el("phaseNotice").className="phase-notice"+(state.phase==="post"?" post":"");
  el("phaseNotice").textContent=state.phase==="pre"?
    "دي الجولة الأولى: اعتمدوا على معرفتكم الحالية وحاولوا تبرروا قراراتكم. الهدف إننا نعرف نقطة البداية الحقيقية.":
    "دي الجولة الثانية: استخدموا الأدوات اللي اتعلمتوها في التدريب، وارجعوا لنفس الحالة وقدّموا حل أقوى وأوضح ومبني على أدلة.";
  const container=el("questionsContainer");
  container.replaceChildren(...c.questions.map((question,i)=>{
    const block=makeElement("div","question-block");
    block.append(makeElement("span","question-badge","CHALLENGE "+String(i+1).padStart(2,"0")),makeElement("h4","",question));
    const field=makeElement("div","field");
    const label=makeElement("label","","تحليل الجروب");
    const textarea=makeElement("textarea");
    textarea.id="q"+(i+1);
    textarea.name="q"+(i+1);
    textarea.rows=4;
    textarea.maxLength=3500;
    textarea.placeholder="اكتبوا القرار، السبب، والأدلة اللي استندتوا عليها...";
    textarea.setAttribute("aria-label","إجابة السؤال "+(i+1));
    label.htmlFor=textarea.id;
    field.append(label,textarea);
    block.append(field);return block;
  }));
  const draft=state.drafts[keyFor(c.id,state.phase)]||{};
  const fallback=state.drafts[keyFor(c.id,"pre")]||{};
  el("leaderName").value=draft.leaderName||fallback.leaderName||"";
  c.questions.forEach((_,i)=>{el("q"+(i+1)).value=Array.isArray(draft.answers)?draft.answers[i]||"":"";});
  el("solutionSummary").value=draft.summary||"";
  el("solutionLink").value=draft.link||"";
  el("saveStatus").textContent=draft.savedAt?"آخر مسودة على الجهاز: "+new Date(draft.savedAt).toLocaleString("ar-EG"):"المسودة هتتحفظ على الجهاز ده فقط.";
  el("exportMessage").className="export-message";
  el("exportMessage").textContent="";
}
function extractDraft(){
  const c=CASES.find((item)=>item.id===state.activeCase);
  if(!c)return null;
  return {
    leaderName:el("leaderName").value.trim(),
    answers:c.questions.map((_,i)=>el("q"+(i+1)).value.trim()),
    summary:el("solutionSummary").value.trim(),
    link:el("solutionLink").value.trim(),
    savedAt:new Date().toISOString()
  };
}
function captureDraft(){
  if(state.activeCase===null || el("workspaceContent").hidden)return false;
  const draft=extractDraft();
  if(!draft)return false;
  state.drafts[keyFor(state.activeCase,state.phase)]=draft;
  return saveDrafts();
}
function downloadJson(filename,payload){
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function handleExport(event){
  event.preventDefault();
  const c=CASES.find((item)=>item.id===state.activeCase);
  if(!c)return;
  const draft=extractDraft();
  const msg=el("exportMessage");
  msg.className="export-message";
  if(draft.leaderName.length<3){
    msg.classList.add("error");msg.textContent="اكتب اسم قائد الجروب الأول.";el("leaderName").focus();return;
  }
  const badQuestion=draft.answers.findIndex((a)=>a.length<35);
  if(badQuestion>=0){
    msg.classList.add("error");msg.textContent="إجابة التحدّي "+(badQuestion+1)+" محتاجة شرح أكتر (35 حرف على الأقل).";el("q"+(badQuestion+1)).focus();return;
  }
  if(draft.summary.length<70){
    msg.classList.add("error");msg.textContent="ملخص الحل العملي محتاج شرح أكتر (70 حرف على الأقل).";el("solutionSummary").focus();return;
  }
  if(draft.link && !/^https:\/\/[^\s.]+\.[^\s]+/i.test(draft.link)){
    msg.classList.add("error");msg.textContent="استخدم لينك HTTPS صحيح للملف العملي، أو سيبه فاضي.";el("solutionLink").focus();return;
  }
  state.drafts[keyFor(c.id,state.phase)]=draft;
  saveDrafts();
  const payload={
    schemaVersion:"winners-job-architecture-submission-v1",
    appVersion:APP_VERSION,
    rubricVersion:RUBRIC_VERSION,
    groupId:"group-"+String(c.id).padStart(2,"0"),
    caseId:c.id,
    caseName:c.name,
    phase:state.phase,
    leaderName:draft.leaderName,
    responses:c.questions.map((prompt,i)=>({questionId:"Q"+(i+1),prompt,answer:draft.answers[i]})),
    practicalSummary:draft.summary,
    practicalDocumentUrl:draft.link||null,
    exportedAt:new Date().toISOString(),
    transport:"LOCAL_FILE_EXPORT",
    submissionStatus:"NOT_SENT_TO_BACKEND",
    gradingStatus:"PENDING_GEMINI_AND_INSTRUCTOR_APPROVAL"
  };
  downloadJson("Winners_Group_"+String(c.id).padStart(2,"0")+"_"+state.phase.toUpperCase()+"_Answer.json",payload);
  msg.classList.add("success");
  msg.textContent="اتصدّر ملف الإجابة بنجاح على جهازك. مهم: لسه مش متسلّم للمدرب ولا اتقيّم؛ ده هيحصل لما نوصل الـ Backend.";
  el("saveStatus").textContent="مسودة محفوظة محليًا — لم يتم الإرسال إلى السيرفر.";
  renderCards();
  showToast("تم تصدير نسخة الإجابة — غير مُرسلة إلى السيرفر.");
}
function handlePreview(){
  const id=Number(el("previewGroup").value);
  const score=Number(el("previewScore").value);
  el("previewScoreValue").textContent=score+" / 100";
  state.preview={id,phase:state.phase,score};
  renderCards();renderScores();
}
function clearPreview(){
  state.preview=null;
  renderCards();renderScores();
  showToast("اتلغت معاينة الدرجات. النتائج الفعلية لسه في انتظار التقييم.");
}
function init(){
  renderCards();renderScores();
  Array.from(document.querySelectorAll(".phase-button")).forEach((btn)=>btn.addEventListener("click",()=>setPhase(btn.dataset.phase)));
  el("answerForm").addEventListener("submit",handleExport);
  el("answerForm").addEventListener("input",()=>{
    const success=captureDraft();
    el("saveStatus").textContent=success?"المسودة محفوظة على الجهاز تلقائيًا.":"تعذّر الحفظ التلقائي؛ استخدم تصدير الإجابة.";
  });
  el("saveDraftBtn").addEventListener("click",()=>{
    const success=captureDraft();
    el("saveStatus").textContent=success?"تم حفظ المسودة على الجهاز.":"تعذّر الحفظ على هذا المتصفح.";
    showToast(success?"مسودة الجروب محفوظة محليًا.":"تعذّر الحفظ المحلي.");
  });
  el("previewGroup").addEventListener("change",handlePreview);
  el("previewScore").addEventListener("input",handlePreview);
  el("clearPreviewBtn").addEventListener("click",clearPreview);
  el("startBtn").addEventListener("click",()=>el("casesSection").scrollIntoView({behavior:"smooth",block:"start"}));
  el("resultsBtn").addEventListener("click",()=>el("resultsSection").scrollIntoView({behavior:"smooth",block:"start"}));
  el("guideBtn").addEventListener("click",()=>el("gameGuide").scrollIntoView({behavior:"smooth",block:"center"}));
  // The next version will attach backend score/submission adapters only after verified
  // Apps Script deployment, permissions, stable group tokens, and instructor approval.
}
document.addEventListener("DOMContentLoaded",init);