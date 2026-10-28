import {DETAILED_CASES} from "./case-details.js";
export const TRACK_OPTIONS=[
 {id:"recruitment",label:"Recruitment & Selection",short:"Recruitment",icon:"🎯",desc:"وظيفتين و 4 بطاقات مرشحين"},
 {id:"experience",label:"Employee Experience",short:"Employee Feedback",icon:"💬",desc:"12 تعليق متاح من 75 تعليق"},
 {id:"policy",label:"Personnel & HR Policies",short:"Leave Policy",icon:"📋",desc:"3 بنود من سياسة الإجازات و 4 حالات"}
];
const H=DETAILED_CASES[0],R=DETAILED_CASES[2];
/* كل الأسئلة بتتجاوب بخطوات مرقّمة. graderKey يروح لـ Gemini بس ومش بيظهر للفرق. */
const RUBRIC=[["ترتيب الخطوات ومنطقها",30],["ارتباط الخطوات ببيانات الحالة",30],["المراجعة البشرية والضوابط",25],["الوضوح",15]];
const ANSWER_FORMAT="جاوب كل سؤال من Q1 لـ Q4 على شكل خطوات مرقّمة (1، 2، 3…).";
const POLICY_CASES={heading:"E | حالات طلبات الإجازة",intro:"أربع حالات افتراضية للتدريب. كل الإجازات بتبدأ يوم 10 نوفمبر.",
 columns:["الحالة","التفاصيل"],
 rows:[
  ["A","الموظف قدّم الطلب يوم 2 نوفمبر."],
  ["B","الموظف قدّم الطلب يوم 5 نوفمبر."],
  ["C","الموظف قدّم الطلب يوم 1 نوفمبر، والمدير المباشر بيقول مفيش حد يغطي شغله في الفترة دي."],
  ["D","الموظف قدّم طلب عاجل يوم 9 نوفمبر بسبب ظرف عائلي."]
 ],note:"المتاح هو البنود الثلاثة بس. أي حاجة مش مذكورة فيها (الرصيد، المستندات، نوع الإجازة) تعتبر معلومة ناقصة."};
const T={
recruitment:{
 sections:H.sections.slice(0,2),
 intro:"شركة Horizon Services الافتراضية فيها 320 موظف، وعندها وظيفتين فاضيين: Customer Service Specialist (54 CV) و Payroll & Personnel Coordinator (36 CV). المتاح للمراجعة 4 بطاقات مرشحين بس: CS-01 و CS-02 و PP-01 و PP-02.",
 graderKey:"54 + 36 = 90 CV. Only 4 candidate cards exist. CS-01: English Basic (below Working English), no complaint example. CS-02: Excel Basic (below Intermediate), complaint claim unverified. PP-01: meets experience/Excel, confidentiality not shown. PP-02: 1 year only (below 2), Excel Advanced. No candidate may be hired or ranked from this data alone.",
 levels:[
  {title:"Recruitment | التقييم اليدوي",task:"ANSWER",questions:[
   "Q1: إيه خطواتك لتحديد متطلبات كل وظيفة من الـ Role Brief؟",
   "Q2: إيه خطواتك لتقييم المرشحين الأربعة على المتطلبات دي (Meets / Partially Meets / Missing Evidence)؟",
   "Q3: لما تلاقي دليل ناقص عند مرشح، إيه خطواتك للتحقق منه؟",
   "Q4: إيه الخطوات اللي لازم تحصل قبل قرار التعيين؟ ومين بيعمل كل خطوة؟"
  ]},
  {title:"Recruitment | التقييم باستخدام AI",task:"ANSWER",questions:[
   "Q1: إيه خطواتك لتجهيز بيانات المرشحين قبل ما تديها لـ AI؟ (إيه اللي تشيله وإيه اللي تسيبه)",
   "Q2: إيه التعليمات اللي هتديها لـ AI عشان يقيّم المرشحين؟ اكتبها نقاط.",
   "Q3: إيه خطواتك لمراجعة ناتج AI والتأكد إنه ما اخترعش معلومات وما رتّبش المرشحين للتعيين؟",
   "Q4: لو لقيت غلطة في ناتج AI، إيه خطواتك لتصحيحها قبل ما يوصل لمدير HR؟"
  ]},
  {title:"Recruitment | الحل للإدارة",task:"ANSWER",questions:[
   "Q1: إيه خطوات فرز الـ 90 CV من الاستلام لحد المقابلة؟ ومين مسؤول عن كل خطوة؟",
   "Q2: في أنهي خطوات يدخل AI؟ وفي أنهي خطوات لازم مراجعة بشرية؟",
   "Q3: إيه خطواتك لحماية بيانات المرشحين وضمان العدالة؟",
   "Q4: إيه خطوات تطبيق الحل في أول 30 يوم؟ وإزاي هتقيس نجاحه؟"
  ]}
]},
experience:{
 sections:H.sections.slice(2,3),
 intro:"شركة Horizon Services الافتراضية فيها 320 موظف، وجمعت 75 تعليق من غير أسماء في استبيان. المتاح نصّه 12 تعليق بس (من E01 لـ E12)، ومحتوى الـ 63 الباقيين مش معروف.",
 graderKey:"Only 12 of 75 comments are available. Reasonable themes: Workload (E01,E02,E03), Manager Feedback/Performance (E04,E05,E06), Career/Development (E07,E08,E11), Communication (E09,E10), Policy Clarity (E12). Primary counts must total 12. Results must not be generalized to 75 comments or 320 employees. No attempt to identify comment authors.",
 levels:[
  {title:"Employee Experience | التصنيف اليدوي",task:"ANSWER",questions:[
   "Q1: إيه خطواتك لقراءة الـ 12 تعليق وتصنيفهم لموضوعات؟",
   "Q2: إيه خطواتك لعدّ التعليقات في كل موضوع والتأكد إن العدّ صح؟",
   "Q3: إيه خطواتك لاختيار الموضوعات اللي تستحق متابعة الأول؟",
   "Q4: إيه الخطوات اللي محتاجها قبل ما تعمّم أي نتيجة على الـ 320 موظف؟"
  ]},
  {title:"Employee Experience | التحليل باستخدام AI",task:"ANSWER",questions:[
   "Q1: إيه خطواتك لتجهيز التعليقات قبل ما تديها لـ AI؟ (خصوصاً أي حاجة ممكن تكشف صاحب التعليق)",
   "Q2: إيه التعليمات اللي هتديها لـ AI عشان يصنّف التعليقات؟ اكتبها نقاط.",
   "Q3: إيه خطواتك لمراجعة ناتج AI: التصنيف، والعدد، والاستنتاجات؟",
   "Q4: لو لقيت غلطة، إيه خطواتك لتصحيحها قبل ما التقرير يتكتب؟"
  ]},
  {title:"Employee Experience | الحل للإدارة",task:"ANSWER",questions:[
   "Q1: إيه خطوات تحليل الـ 75 تعليق وأي استبيان جاي، من جمع التعليقات لحد التقرير؟ ومين مسؤول عن كل خطوة؟",
   "Q2: في أنهي خطوات يدخل AI؟ وفي أنهي خطوات لازم مراجعة بشرية؟",
   "Q3: إيه خطواتك لحماية هوية الموظفين؟",
   "Q4: إيه خطوات تطبيق الحل في أول 30 يوم؟ وإزاي هتقيس نجاحه؟"
  ]}
]},
policy:{
 sections:[...H.sections.slice(3,4),POLICY_CASES],
 intro:"شركة Horizon Services الافتراضية عندها سياسة إجازات من 12 صفحة، بس المتاح للتدريب 3 بنود: LP-01 و LP-02 و LP-03، ومعاهم 4 حالات طلبات إجازة (A و B و C و D).",
 graderKey:"LP-01: request at least 7 calendar days before leave start (10 Nov). Case A: 2 Nov = 8 days, meets notice; still needs manager approval (LP-02). Case B: 5 Nov = 5 days, does not meet notice; treat as exception for HR Manager (LP-03), not automatic rejection or approval. Case C: 1 Nov = 9 days, meets notice, but LP-02 coverage issue means approval is not automatic; manager decides. Case D: 9 Nov = 1 day, urgent request, must be reviewed by HR Manager (LP-03). Balance, documents, leave type and legal entitlements are NOT in the clauses and must be flagged as unknown, never invented.",
 levels:[
  {title:"Leave Policy | المراجعة اليدوية",task:"ANSWER",questions:[
   "Q1: إيه خطواتك لشرح البنود الـ 3 لموظف جديد؟",
   "Q2: إيه خطواتك لمراجعة أي طلب إجازة؟ طبّقها على الحالات الأربعة (A و B و C و D).",
   "Q3: إيه خطواتك لو الطلب اتقدّم في ميعاده بس مفيش تغطية للشغل؟ ولو الطلب عاجل؟",
   "Q4: إيه خطواتك لو موظف سأل سؤال البنود الـ 3 ما بترُدّش عليه؟"
  ]},
  {title:"Leave Policy | الرد باستخدام AI",task:"ANSWER",questions:[
   "Q1: إيه خطواتك لتجهيز البنود قبل ما تديها لـ AI؟",
   "Q2: إيه التعليمات اللي هتديها لـ AI عشان يرد على الموظفين؟ اكتبها نقاط.",
   "Q3: إيه خطواتك لمراجعة ردود AI؟ (حق اخترعه، موافقة تلقائية، حساب أيام غلط)",
   "Q4: لو لقيت غلطة، إيه خطواتك لتصحيحها قبل ما الرد يوصل للموظف؟"
  ]},
  {title:"Leave Policy | الحل للإدارة",task:"ANSWER",questions:[
   "Q1: إيه خطوات المساعد من سؤال الموظف لحد الرد النهائي؟ ومين مسؤول عن كل خطوة؟",
   "Q2: إمتى المساعد لازم يحوّل السؤال لـ HR بدل ما يرد بنفسه؟",
   "Q3: إيه خطواتك لما السياسة تتعدّل، عشان المساعد يرد بالنسخة المعتمدة الجديدة؟",
   "Q4: إيه خطوات تطبيق الحل في أول 30 يوم؟ وإزاي هتقيس نجاحه؟"
  ]}
]}};
export function getTrackStage(stage,id){
const t=T[id];if(!t||![1,2,3].includes(Number(stage)))return null;
const level=t.levels[Number(stage)-1],label=TRACK_OPTIONS.find(x=>x.id===id);
return {id:Number(stage),name:["Discovery","Level Up","Grand Finale"][Number(stage)-1]+" · "+label.short,label:label.label,track:id,title:level.title,
 description:t.intro,level:["Beginner","Intermediate","Advanced"][Number(stage)-1],duration:["25 دقيقة","30 دقيقة","45 دقيقة"][Number(stage)-1],facts:t.sections.flatMap(x=>x.note?[x.intro,x.note]:[x.intro]).slice(0,4),
 questions:level.questions,task:ANSWER_FORMAT,sections:t.sections,boundaries:[
 "كل البيانات افتراضية للتدريب. ممنوع استخدام بيانات حقيقية.",
 "استخدم البيانات المعروضة قدامك بس، ومتعمّمش على سجلات مش متاحة.",
 ...(Number(stage)===1?["المرحلة دي من غير أي أدوات AI."]:["مسموح وصف استخدام AI، بشرط مراجعة بشرية لأي ناتج."]),
 "AI ميتخدش قرار تعيين، ولا يعتمد سياسة، ولا يحكم على موظف."
 ],rubric:RUBRIC,graderKey:t.graderKey,source:"كل فريق بيشتغل على مشكلة HR واحدة في المراحل الثلاثة، على بيانات Horizon Services الافتراضية."};
}
export const TRACK_STAGE_DATA=T;
