import {DETAILED_CASES} from "./case-details.js";
export const TRACK_OPTIONS=[
 {id:"recruitment",label:"Recruitment & Selection",short:"Recruitment",icon:"🎯",desc:"Customer Service Specialist + Payroll & Personnel Coordinator · 4 candidate samples"},
 {id:"experience",label:"Employee Experience",short:"Employee Feedback",icon:"💬",desc:"12 documented comments from 75 anonymous responses"},
 {id:"policy",label:"Personnel & HR Policies",short:"Leave Policy",icon:"📋",desc:"3 available clauses from a 12-page leave policy"}
];
const H=DETAILED_CASES[0],R=DETAILED_CASES[2];
const T={
recruitment:{
 sections:H.sections.slice(0,2),
 intro:"Horizon Services: شركـة خدمات افتراضية، 320 موظف. وظيفتان شاغرتان: Customer Service Specialist (54 CV) وPayroll & Personnel Coordinator (36 CV). المتاح للمراجعة فقط 4 بطاقات مرشحين CS-01/CS-02/PP-01/PP-02.",
 levels:[
  {title:"Recruitment | Screening & Evidence",task:"حلّل وظيفة R-01 وR-02 ومتطلبات كل Role على حدة، ثم قارن المرشحين الأربعة واكتب فجوات الأدلة وأسئلة التحقق.",questions:[
   "Q1: حدد 4 متطلبات أو معايير تقييم لكل وظيفة واربط كل معيار بما هو مذكور في الـRole Brief.",
   "Q2: اعمل Screening Matrix منفصلة لكل وظيفة على عينات CS-01 وCS-02 وPP-01 وPP-02: Meets / Does Not Meet / Missing Evidence مع السبب.",
   "Q3: صمم سؤال CBI أو اختبارًا فنيًا لكل فجوة مؤثرة (Working English، Excel، Complaint Handling، Payroll Confidentiality).",
   "Q4: أجب في سطرين: أي أجزاء المقارنة تصلح للمساعدة بالـAI لاحقًا، وأي قرار لا يجوز أتمتته؟"
  ],rubric:[["مقارنة دقيقة حسب Role Criteria دون خلط الوظيفتين",35],["تحديد Gap أو Missing Evidence لكل مرشح",25],["اختبارات أو أسئلة تحقق مناسبة",20],["Human Judgment وخصوصية بيانات المرشحين",15],["عرض منظم بأدلة CS/PP",5]]},
  {title:"Recruitment | AI-Assisted Shortlisting Design",task:"اعمل تصميم Master Prompt وEvidence Matrix للـ4 Profiles المتاحة فقط، ثم خطة اختبار لمخرجات AI.",questions:[
   "Q1: صمم Structured Candidate Data Fields للوظيفتين مع Required / Missing / Needs Verification.",
   "Q2: جهز Master Prompt يحصر الـ4 مرشحين بالأدلة دون ترتيب توظيف نهائي أو استكمال بيانات ناقصة.",
   "Q3: اعمل Sample Output Matrix للـ4 IDs مع سبب كل Status، ووضح أي معلومات تحتاج مقابلة أو اختبار Excel.",
   "Q4: صمم 3 Quality Checks تمنع هلوسة مؤهلات أو رفض مرشح بسبب بيانات غير مذكورة."
  ],rubric:[["فهم متطلبات الوظيفتين وفصل البيانات",20],["Master Prompt مقيّد بالأدلة وسياق HR",35],["Sample Matrix وGap Flags قابلة للتحقق",25],["QA والعدالة والقرار البشري",15],["وضوح المخرجات",5]]},
  {title:"Recruitment | Auditable Screening Workflow",task:"ابنِ مشروع AI Recruitment Screening مصغّرًا باستخدام العينات الأربع، مع Workflow وخطة Pilot؛ لا تزعم تحليل 90 ملفًا لم تتسلمها.",questions:[
   "Q1: ارسم Intake→Anonymization→Data Extraction→Role Matching→Evidence Flag→HR Review→Interview Gate، مع تحديد مالك كل خطوة.",
   "Q2: اكتب Prompt نهائي يخرج Candidate Evidence Matrix للـ4 CV Samples مع Source ID وMissing Data دون Hiring Decision.",
   "Q3: قدم 4 Acceptance Tests تشمل مجموع 54+36=90، والتحقق من Required Skills لكل دور، وعدم اختراع أي خبرة، وعدم تقييم 86 ملفًا غير متاح.",
   "Q4: حدد KPI Definitions لاختبار Extraction Accuracy وMissing Evidence Rate وScreening Time؛ لا تخترع Baseline أو وفرًا ماليًا.",
   "Q5: قدم 30-Day Pilot Plan مع Recruiter Sign-off وحماية بيانات المرشحين."
  ],rubric:[["تصميم Workflow وتقسيم المسؤوليات",25],["Prompt/Output مضبوط بالأدلة",25],["Acceptance Tests للعينات الأربع وحدود البيانات",25],["KPIs وPilot وHuman Sign-off",20],["وضوح Business Value دون نتائج مختلقة",5]]}
]},
experience:{
 sections:H.sections.slice(2,3),
 intro:"Horizon Services تضم 320 موظفًا؛ جمعت 75 تعليقًا مجهولًا في Pulse Survey، لكن المتاح نصًا 12 تعليقًا E01–E12 فقط. لا نعرف محتوى الـ63 تعليقًا الأخرى.",
 levels:[
  {title:"Employee Experience | Classify & Count",task:"صنّف التعليقات الاثني عشر فقط لThemes واضحة مع معرفات الأدلة، واحذر تعميم الاستنتاج على جميع الموظفين.",questions:[
   "Q1: اقرأ E01–E12 وصنف كل تعليق في Primary Theme محددة؛ لو له Secondary Theme اذكرها بشكل منفصل.",
   "Q2: اعمل Count by Primary Theme مجموعها 12، مع سرد Comment IDs لكل فئة.",
   "Q3: حدد أكثر موضوعين يستحقان Follow-up ولماذا، من دون الادعاء بأنهما مشكلتان على مستوى الشركة.",
   "Q4: ما البيانات الإضافية التي تحتاجها لتحليل الـ75 تعليقًا أو معرفة أثر المشكلات؟"
  ],rubric:[["تصنيف Primary Theme مبرر بـIDs",35],["تكرارات صحيحة مجموعها 12",25],["استنتاجات حذرة وتجنب التعميم",20],["متطلبات التحقق التالية والخصوصية",15],["الوضوح",5]]},
  {title:"Employee Experience | AI Theme Analysis",task:"طبق Prompt Engineering لتصنيف تعليقات E01–E12 من غير استنتاج عن الـ63 تعليقًا غير المتاحين، ثم راجع النتائج يدويًا.",questions:[
   "Q1: حدد Taxonomy أولية لـWorkload وFeedback وCareer/Development وCommunication وPolicy Clarity مع إمكانية Others.",
   "Q2: اكتب Master Prompt يدخل 12 Comment IDs ويخرج Primary Theme + Secondary Theme (إن وجد) + Supporting Text.",
   "Q3: قدّم Theme Count Table للتصنيف الأساسي فقط مع إجمالي 12 وحدد الحالات الملتبسة أو متعددة التصنيف.",
   "Q4: صمم Manual QA لعينة التعليقات وتوثيق أي Classification Disagreement؛ لا تعيّن صاحب أي تعليق."
  ],rubric:[["تصنيف قابل للتكرار مع قواعد فئات واضحة",25],["Master Prompt قائم على المصدر",30],["Counts وEvidence IDs صحيحة",25],["QA وخصوصية وعدم التعميم",15],["وضوح التقرير",5]]},
  {title:"Employee Experience | Feedback Intelligence Pilot",task:"صمم نظام Feedback Analysis عملي للمجموعة المتاحة، مع Dashboard مبني على الأدلة وخطة لاكتمال تحليل الـ75 عندما تتوفر بياناتهم.",questions:[
   "Q1: ارسم Survey Import→PII Check→Clean/Deduplicate→AI Theme Tagging→Human Review→Aggregated Dashboard.",
   "Q2: اعرض Output Table تجريبيًا لكل Comment ID من E01 إلى E12 مع Theme والعبارة الداعمة والمراجعة.",
   "Q3: صمم 4 Acceptance Tests: عدم تحليل الـ63 غير المتاحة، مجموع Primary Counts=12، عدم كشف أصحاب التعليقات، وعدم اختلاق نسبة رضا.",
   "Q4: قدم 3 KPIs مثل Classification Agreement وReview Coverage وTime per Comment مع التعريف ومصدر البيانات وBaseline Missing.",
   "Q5: ضع Pilot 30-Day Plan وHR Survey Owner/Privacy Gate مع حدود ظهور فئات صغيرة."
  ],rubric:[["Privacy-First Workflow وHuman Review",25],["Evidence Mapping ومخرجات 12 تعليقًا فقط",25],["Acceptance Tests وحدود الـ75 تعليقًا",25],["KPIs وPilot Plan",20],["Business Value بدون تعميم",5]]}
]},
policy:{
 sections:H.sections.slice(3,4),
 intro:"Horizon Services لديها سياسة إجازات داخلية من 12 صفحة، لكن المتاح لهذا التدريب 3 بنود فقط LP-01 وLP-02 وLP-03. لا توجد أحكام قانونية أو رصيد إجازات في الحزمة.",
 levels:[
  {title:"Personnel | Leave Policy Judgment",task:"افهم 3 بنود الإجازات المتاحة، وميّز بين استيفاء مهلة التقديم وقرار الموافقة.",questions:[
   "Q1: اكتب Employee-Friendly Explanation لكل من LP-01/02/03 من غير تغيير الشرط الأصلي.",
   "Q2: قارن حالة A (تقديم 2 Nov لإجازة 10 Nov) وحالة B (تقديم 5 Nov لإجازة 10 Nov). احسب 8 و5 أيام تقويمية وحدد شرط المهلة.",
   "Q3: وضح Workflow المراجعة: مدير مباشر وتغطية العمل، وHR Manager للاستثناءات العاجلة.",
   "Q4: حدد 3 Unknowns لا يمكن حسمها من هذه البنود (مثلاً الرصيد، المستندات، المسار الكامل للموافقة)."
  ],rubric:[["تفسير الشروط الثلاثة بدقة",35],["حساب المهل 8 و5 أيام وتفسير النتائج",25],["سلسلة المراجعة والاستثناءات",20],["Missing Policy Evidence وعدم اختلاق حقوق",15],["وضوح FAQ",5]]},
  {title:"Personnel | Source-Grounded Policy Assistant",task:"اكتب Prompt يستخدم LP-01/02/03 فقط، ويرجع تفسيرًا مبسطًا دون ابتكار استحقاقات قانونية أو موافقات تلقائية.",questions:[
   "Q1: اكتب Master Prompt بحدود واضحة: cite Clause ID لكل إجابة، ولا يجيب عن السياسات غير المتاحة.",
   "Q2: أنتج 4 Employee FAQs تعتمد صراحة على LP-01/02/03؛ وضح ما الذي يحتاج HR Manager.",
   "Q3: طبّق على حالتي 2 و5 نوفمبر، وفرق بين Deadline Check وFinal Leave Approval.",
   "Q4: ضع Policy QA Checklist للتحقق من الاقتباسات والحالات غير المشمولة قبل نشر FAQ."
  ],rubric:[["Master Prompt والاقتباس بالبند الصحيح",30],["FAQ دقيقة وغير مضللة",25],["التواريخ والموافقة والاستثناءات",25],["QA وحدود الـ3 بنود فقط",15],["وضوح الموظف",5]]},
  {title:"Personnel | Controlled Leave Policy Workflow",task:"صمم HR Policy Assistant يُراجع الأسئلة ويصعّد الاستثناءات للبشر، مع قياس الجودة وخطة Pilot.",questions:[
   "Q1: صمم Approved Policy Import→Clause Search→AI Draft→Source Check→Manager/HR Review→Employee Response.",
   "Q2: قدم Prompt نهائي يربط كل إجابة بـLP-01/02/03 ويتوقف لو السؤال يحتاج البنود التسعة أو صفحات السياسة غير المتاحة.",
   "Q3: حدد 4 Acceptance Tests: مهلة 7 أيام، 2→10=8، 5→10=5، وعدم منح Auto Approval أو Legal Entitlement.",
   "Q4: صمم Metrics: Clause Citation Accuracy وUnsupported Answers وHR Escalation Completion مع Sources وOwners.",
   "Q5: قدم Pilot 30-Day Plan مع Legal/HR Policy Owner Sign-off ونسخ السياسة المعتمدة."
  ],rubric:[["Workflow من المصدر إلى اعتماد HR",25],["Prompt وFAQ مع Traceable Citations",25],["Acceptance Tests وتفادي الاختلاق",25],["KPIs والتصعيد وPilot",20],["وضوح الموظف والقيمة",5]]}
]}};
export function getTrackStage(stage,id){
const t=T[id];if(!t||![1,2,3].includes(Number(stage)))return null;
const level=t.levels[Number(stage)-1],label=TRACK_OPTIONS.find(x=>x.id===id);
return {id:Number(stage),name:["Discovery","Level Up","Grand Finale"][Number(stage)-1]+" · "+label.short,label:label.label,track:id,title:level.title,
 description:t.intro,level:["Beginner","Intermediate","Advanced"][Number(stage)-1],duration:["25 دقيقة","30 دقيقة","45 دقيقة"][Number(stage)-1],facts:t.sections.flatMap(x=>x.note?[x.intro,x.note]:[x.intro]).slice(0,4),
 questions:level.questions,task:level.task,sections:t.sections,boundaries:[
 "كل المدخلات Training Synthetic. لا تُرفع بيانات حقيقية.",
 "استخدم فقط العينة المعروضة أمامك، ولا تعمم على سجلات غير متاحة.",
 ...(Number(stage)===1?["No AI — الجولة الأولى بدون أدوات AI."]:["AI مسموح مع Evidence Check وHuman Approval."]),
 "لا يجوز لـAI اتخاذ قرار تعيين أو اعتماد سياسة أو إصدار حكم على موظف."
 ],rubric:level.rubric,source:"One selected HR track per team across all 3 stages; M01 Horizon evidence + training-only assessment expansion."};
}
export const TRACK_STAGE_DATA=T;
