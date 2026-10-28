/**
 * WINNERS AI FOR HR — CASE BANK v2
 * Adapted from:
 * M01 Mission 00/01/02/03 + M02 Universal Prompt + Day02 M04 Nova Retail.
 * ORIGINAL FACTS are preserved: Horizon=320 employees, 90 CVs/2 roles,
 * 75 anonymous comments, 12-page leave policy. Nova=18→24, gap=6.
 * ALL details marked "Synthetic expansion" are NEW FICTIONAL assessment data,
 * not quotes or original dataset findings.
 * Do not treat excerpt counts as company-wide results.
 */
const HORIZON_EVIDENCE=[
 {heading:"A | Recruitment Intake — الوظيفتان المحددتان",intro:"الحقيقة الأصلية: 90 CV لوظيفتين. التفاصيل التالية أُضيفت لهذا التحدي كمعلومات تدريبية افتراضية وليست من ملفات المتدربين الحقيقية.",
  columns:["Role ID","الوظيفة والشواغر","عدد CVs","الشروط الوظيفية المطلوب التحقق منها"],
  rows:[
   ["R-01","Customer Service Specialist — وظيفة واحدة، Giza","54","خبرة خدمة عملاء ≥2 سنوات؛ Working English؛ Excel Intermediate؛ مثال موثّق للتعامل مع Complaint"],
   ["R-02","Payroll & Personnel Coordinator — وظيفة واحدة، Giza","36","خبرة Payroll/Personnel ≥2 سنوات؛ Attendance & Leave Records؛ Excel lookup/Pivot؛ التعامل السري مع البيانات"]
  ],note:"54 + 36 = 90 CV. لم تُرفَق الـ90 سيرة الذاتية؛ الموجود أدناه 4 عينات افتراضية فقط. لا يجوز الجزم بأفضل مرشح من دون مقابلة/اختبار ومراجعة الأدلة."},
 {heading:"B | Candidate Profile Samples — عينات المقارنة",intro:"التقييم على بيانات أربع بطاقات فقط، وليس على كامل الـ90 CV. كلمة «غير مذكور» تعني دليلًا ناقصًا وليست فشلًا مثبتًا.",
  columns:["Candidate ID","مقدّم لوظيفة","الخبرة المعلنة","English / Excel / المهام","دليل ناقص للتحقق"],
  rows:[
   ["CS-01","R-01","3 سنوات Customer Service","English: Basic | Excel: Intermediate","لا يوجد مثال على حل شكوى عميل"],
   ["CS-02","R-01","2 سنوات Customer Service","English: Working | Excel: Basic","يدّعي معالجة 20 شكوى شهريًا؛ لا يوجد إثبات أو مثال سلوكي"],
   ["PP-01","R-02","3 سنوات Payroll & Personnel","Attendance Logs + Leave Records | Excel: Pivot/Lookup","إجراءات سرية البيانات لم توضح في الملف"],
   ["PP-02","R-02","سنة Payroll Assistant","Attendance Logs | Excel: Advanced","لا يوجد دليل على خبرة سنتين أو إعداد Payroll كامل"]
  ],note:"ابدأ بتحديد Meets / Partially Meets / Missing Evidence لكل متطلب، واقترح طريقة تحقق مناسبة. لا تستخدم أدوات AI في Discovery، ولا تصدر Hiring Decision."},
 {heading:"C | Employee Listening — تعليقات مكتوبة للتصنيف",intro:"وصل للشركة 75 تعليقًا مجهول الهوية. الـ12 تعليق التالي فقط متاح في هذه الحزمة التدريبية. المطلوب تصنيف الـ12 وتصميم خطة تحليل الـ63 الباقيين لاحقًا، وليس ادعاء معرفة محتواهم.",
  columns:["Comment ID","نص تعليق الموظف (Synthetic)"],
  rows:[
   ["E01","ضغط الشغل بيزيد في آخر الشهر ومش بنقدر نلحق الطلبات."],
   ["E02","محتاجين توزيع المهام في الشيفت بشكل أعدل."],
   ["E03","بنتأخر بعد نهاية الدوام علشان نخلص التذاكر المفتوحة."],
   ["E04","المدير نادرًا ما بيدينا Feedback واضح عن الأداء."],
   ["E05","مش عارف ليه تقييمي السنوي اتكتب بالشكل ده."],
   ["E06","نفسي يبقى فيه One-to-One مع المدير لمناقشة الأداء."],
   ["E07","مش عارف المعايير اللي على أساسها الترقيات بتحصل."],
   ["E08","فرص التطوير والتدريب المتاحة مش واضحة بالنسبة لي."],
   ["E09","الإعلانات عن قرارات الإدارة بتوصلنا بعد التنفيذ."],
   ["E10","مواعيد الاجتماعات الجديدة مش بتوصل لكل الشيفتات."],
   ["E11","زمايلي بيساعدوني، لكن مفيش خطة لتطوير مهارات Excel."],
   ["E12","إجراءات الشكاوى الداخلية مش مكتوبة بطريقة مفهومة."]
  ],note:"تقدر تستخدم فئات مثل Workload، Manager Feedback، Career/Development، Communication، Policy Clarity. لو تعليق يصلح لأكثر من فئة اذكر Primary وSecondary، ولا تخلط عدد التعليقات بعدد الموظفين. 12/75 ليست عينة ممثلة مثبتة."},
 {heading:"D | Leave Policy — نص البنود المتاحة فقط",intro:"المستند الأصلي المذكور 12 صفحة، لكن الحزمة لا تضم سوى البنود الثلاثة التالية؛ باقي الصفحات غير متاحة. البنود من نشاط Module 01 التعليمي.",
  columns:["Clause","النص المتاح"],
  rows:[
   ["LP-01","لازم الموظف يقدّم طلب الإجازة قبل بداية الإجازة بـ7 أيام تقويمية على الأقل (Calendar Days)."],
   ["LP-02","الموافقة تعتمد على إمكانية تغطية العمل ومراجعة المدير المباشر؛ الطلب مش موافقة تلقائية."],
   ["LP-03","الطلبات العاجلة والاستثناءات لازم يراجعها HR Manager."]
  ],note:"لا تفترض استحقاقات قانونية أو أسباب قبول أو رفض لم ترد في البنود."}
];
const NOVA_EVIDENCE=[
 {heading:"A | Workforce Baseline — العدد الفعلي والمستهدف",intro:"أرقام الوظائف الإجمالية (18→24) مأخوذة من ملف Day 2؛ توزيع الفرق الثلاثة الموجودة إلى المتاجر أدناه توضيحي جديد.",
  columns:["الوظيفة","Stores A+B+C (Current)","Store D (New)","Target Total","Gap"],
  rows:[
   ["Store Associate","12","4","16","+4"],
   ["Store Supervisor","3","1","4","+1"],
   ["Cashier","3","1","4","+1"],
   ["TOTAL","18","6","24","+6"]
  ],note:"توزيع المواقع الافتراضي: Store A = 5 Associates + 1 Supervisor + 1 Cashier = 7؛ Store B = 4+1+1 = 6؛ Store C = 3+1+1 = 5. المجموع = 18. لا تفترض أن الفرع الجديد له احتياج إضافي غير الست وظائف المحددة."},
 {heading:"B | Organization & Reporting — حدود الهيكل",intro:"سلسلة المناصب مبنية على إطار Module 04؛ تفاصيل مسؤولية المناصب هنا إضافات توضيحية للتقييم.",
  columns:["Role","Reports To","Verified Business Responsibility"],
  rows:[
   ["Head of Operations","غير موضح (خارج نطاق الحالة)","Operational direction and final escalation"],
   ["Regional Manager","Head of Operations","Oversight of Stores A, B, C & D"],
   ["Store Supervisor","Regional Manager","Shift coordination, coaching, stock-out escalation and operational reporting"],
   ["Store Associates / Cashier","Store Supervisor","Store service, sales support / cash handling under approved procedure"]
  ],note:"كل Store Supervisor مسؤول عن فريق متجره، لكن حقوق الاعتماد المالي وجداول الورديات التفصيلية وسياسات الأجور غير مذكورة؛ لا تخترعها."},
 {heading:"C | Store D Brief — بيانات قابلة للاستخدام",intro:"مدخلات إضافية افتراضية لدعم JD وRecruitment Planning، دون الادعاء أنها مستخرجة من دراسة سوق.",
  columns:["Field","Case Brief"],
  rows:[
   ["Location","Giza — new Store D; intended opening after 30 calendar days (training assumption)"],
   ["Vacancy Priority","Store Supervisor: 1; Associates: 4; Cashier: 1"],
   ["Supervisor Purpose","Coordinate daily shift coverage, customer service issues, team coaching and stock-out reporting"],
   ["Required Competency Areas","Shift planning; service recovery; stock awareness; coaching; incident escalation; accurate reporting"],
   ["Evidence in CBI","Past example with Situation, personal Action, measurable Result, and validation/learning"]
  ],note:"CBI Scoring: 1 = no concrete example; 3 = some actions but weak or unverified result; 5 = specific action plus verifiable result. لا تتخذ قرار تعيين تلقائيًا. لا تفترض مرتبًا أو قانون عمل أو Job Level من غير مستند."}
];
export const DETAILED_CASES=[
 {id:1,key:"discovery",name:"Discovery · Baseline",label:"Discovery",desc:"Beginner · 25 minutes · No AI",duration:"25 دقيقة",level:"Beginner",title:"Horizon Services | HR Evidence & Judgment",
  description:"أنت HR Coordinator انضمّيت لشركة Horizon Services الافتراضية في Giza، عددها 320 موظف. قبل اجتماع HR Director، قدامك 3 ملفات تشغيل. المطلوب منك ومن الجروب تفكّروا كمتخصصين HR من غير استخدام AI في هذه الجولة.",
  facts:["Recruitment: وظيفتان محددتان R-01 Customer Service Specialist (54 CV) وR-02 Payroll & Personnel Coordinator (36 CV)، وكل وظيفة شاغر واحد.","Employee Listening: وصل 75 تعليقًا مجهولًا؛ المتاح لتحليلك فعليًا 12 تعليق مكتوب E01–E12 فقط.","Annual Leave: مستند داخلي من 12 صفحة؛ المتاح للشرح 3 بنود فقط LP-01 إلى LP-03."],
  questions:[
   "Q1 — Recruitment: اعمل Screening Matrix للأربع بطاقات CS-01/CS-02/PP-01/PP-02 مقابل متطلبات كل Role. اكتب لكل مرشح ما تؤكده البيانات، وما لا يثبت، واختبارًا أو سؤال مقابلة مناسبًا. ممنوع تختار شخصًا للتعيين.",
   "Q2 — Employee Experience: صنّف التعليقات E01–E12 إلى موضوعات متكررة مع دليل Comment ID لكل تصنيف، واذكر عدد التعليقات داخل الـ12 فقط. ما البيانات المطلوبة قبل تعميم الاستنتاج على الـ75؟",
   "Q3 — HR Policy: اشرح LP-01/02/03 للموظف بلغة بسيطة. حل حالتي الإجازة يوم 2 و5 نوفمبر (بداية 10 نوفمبر)، وحدد مين يراجع الطلب، وما الذي لا تستطيع حسمه من دون باقي السياسة.",
   "Q4 — Human Judgment: حدّد خطوة مفيدة واحدة يمكن أن ينفذها AI في كل ملف لاحقًا، وخطوة مراجعة بشرية إلزامية قبل اتخاذ أي قرار."
  ],task:"سلّم إجابة واحدة من الفريق مقسمة Q1–Q4: مقارنة أربع بطاقات فقط، تصنيف التعليقات الاثني عشر بدليل، شرح شروط الإجازة وتواريخها، ودور AI وحدود القرار البشري. No AI في الجولة الأولى.",
  boundaries:["لا يوجد ملف 90 CV كامل؛ لا تقيّم إلا الـ4 عينات، واقترح منهجية لباقي الملفات.","لا يوجد نص الـ75 تعليق كامل؛ احسب التكرارات داخل الـ12 فقط ولا تعتبرها نسبًا لجميع الموظفين.","سياسة الإجازات 12 صفحة لكن المتاح 3 بنود فقط؛ لا تخترع Legal Entitlement أو Auto Approval.","الأمثلة والجداول افتراضية للتدريب، وليست ملف شركة حقيقية."],
  sections:HORIZON_EVIDENCE,source:"Original M01 Mission 00/01/02/03 + clearly marked synthetic extensions.",rubric:[
    ["تقييم متطلبات الوظيفتين والفجوات في أدلة 4 مرشحين",25],
    ["تصنيف تعليقات E01–E12 وربط الفئات بالأدلة دون تعميم على 75",25],
    ["قراءة LP-01/02/03 والحساب الصحيح لـ7 أيام",20],
    ["تمييز الأدلة الناقصة والقرار البشري والخصوصية",20],
    ["تنظيم Q1–Q4 بوضوح عملي",10]
  ]},
 {id:2,key:"growth",name:"Level Up · Master Prompt",label:"Level Up",desc:"Intermediate · 30 minutes · AI allowed after analysis",duration:"30 دقيقة",level:"Intermediate",title:"Nova Retail | Store D Workforce & Structured Hiring",
  description:"Nova Retail سلسلة Retail افتراضية عندها Stores A/B/C في نطاق Giza وبتجهز Store D. المطلوب Planning & Recruitment Package قابل للتنفيذ قبل الافتتاح المفترض خلال 30 يومًا، مع الفصل بين التحليل الأولي والتطبيق باستخدام AI.",
  facts:["Store A = 7، Store B = 6، Store C = 5 → الإجمالي الحالي 18 موظفًا (توزيع المتاجر توضيحي جديد).","Store D يحتاج 4 Store Associates + 1 Store Supervisor + 1 Cashier = 6 وظائف؛ الإجمالي المستهدف 24.","المطلوب: Workforce Gap + Reporting Lines + Supervisor JD بست Competencies + 3 أسئلة CBI وتقييم 1–5."],
  questions:[
    "Q1 — WITHOUT AI: احسب Headcount Gap لكل Role وبالإجمالي، واعمل Current → Target Table. وضّح توزيع الـ6 وظائف على Store D، ولا تضف وظيفة من عندك.",
    "Q2 — Organizational Design: حدد Reports-to Chain من Head of Operations إلى Regional Manager إلى Store Supervisor إلى Store Associates/Cashier، وارسم هيكلًا نصيًا صغيرًا يوضح الأربع متاجر.",
    "Q3 — Job Description: اكتب Store Supervisor JD خاص بـStore D يشمل Purpose، 4–6 Responsibilities، و6 Competencies محددة بناءً على Brief الحالة فقط. اذكر أي Missing Inputs قبل الاعتماد.",
    "Q4 — Structured CBI: اكتب 3 أسئلة تستخرج أدلة فعلية عن Stock-out، إدارة الشيفت، وموقف خدمة عميل. اعمل 1–5 Rating Anchors: 1 بلا مثال، 3 مثال جزئي، 5 نتيجة قابلة للتحقق.",
    "Q5 — AI Application: جهّز Master Prompt باستخدام Context/Task/Output/Constraints، ثم وضّح ما الذي يُراجع يدويًا في ناتج AI قبل استخدامه أو نشره."
  ],task:"قدّم Q1–Q5 بالترتيب: الحسابات أولًا بدون AI، ثم Org Structure، JD، CBI Scorecard، وأخيرًا Master Prompt واضح مع Validation Checklist. يجوز استخدام AI في الجزء الأخير فقط.",
  boundaries:["لا تخترع رواتب أو أوقات ورديات أو قوانين أو صلاحيات اعتماد غير متاحة.","الافتتاح بعد 30 يومًا افتراض تدريب، وليس وعدًا تشغيليًا.","أي Sourcing أو Scraping يكون من مصادر عامة مسموحة فقط، ولا تعرض بيانات أشخاص حقيقيين.","لا تجعل Gemini يقرر من يستحق التعيين بدل المقابلة والتقييم البشري."],
  sections:NOVA_EVIDENCE,source:"Day2 Module 04 Nova Retail + M02 worksheets; store allocation and extra operational data are synthetic extensions.",rubric:[
    ["حساب 18→24 والفجوات التفصيلية 4+1+1 دون أخطاء",25],
    ["دقة Reporting Lines وهيكل Store D",20],
    ["JD واقعي بست كفاءات و3 أسئلة CBI بسلم 1–5",25],
    ["Master Prompt منظم وفصل الحقائق عن الافتراضات",20],
    ["Validation وخطة تنفيذ قابلة للتطبيق",10]
  ]},
 {id:3,key:"final",name:"Grand Finale · Final Solution",label:"Grand Finale",desc:"Advanced · 45 minutes · End-to-end AI project",duration:"45 دقيقة",level:"Advanced",title:"Horizon Services | Auditable End-to-End HR AI Workflow",
  description:"دي نفس Horizon Services من الجولة الأولى: نفس الوظيفتين، نفس عينات السير الذاتية الأربع، نفس 12 تعليقًا المعروضين ضمن 75، ونفس 3 بنود إجازات. دلوقتي مطلوب تصميم AI Solution متكامل، لكن كل خطوة لازم تستند لبيانات الحالة أو تتوسم Missing Input.",
  facts:["R-01 Customer Service Specialist: شاغر 1 و54 CV؛ R-02 Payroll & Personnel Coordinator: شاغر 1 و36 CV؛ 4 بطاقات متاحة فقط.","Employee Listening: 75 تعليقًا مسجّلًا؛ نص 12 تعليقًا E01–E12 فقط متاح للتحليل الآن، والباقي يحتاج Source File.","Leave Policy: المستند 12 صفحة؛ البنود LP-01/02/03 فقط متاحة، وباقي الأحكام تتطلب مراجعة النسخة المعتمدة."],
  questions:[
   "Q1 — Executive Diagnosis: عرّف Problem Statement لكل مسار Recruitment/Employee Experience/Leave Policy، وحدد Known vs Missing Data وBusiness Risk لو AI اخترع إجابة.",
   "Q2 — Workflow Architecture: صمم Inputs → Preparation → AI Step → Human Verification → Approved Output لكل مسار. أدرج مكان تخزين البيانات ومن يستطيع الوصول إليها دون استخدام معلومات حقيقية.",
   "Q3 — Master Prompt Execution: اكتب Prompt نهائيًا لتوليد (A) Candidate Evidence Matrix من CS/PP الأربع دون اختيار موظف، (B) Feedback Theme Table مع Comment IDs من 12 نصًا فقط، (C) Employee Leave FAQ مقتبس من LP-01/02/03 مع Unknowns.",
   "Q4 — Evidence QA: اقترح 4 Acceptance Tests على الأقل (مثلًا: 54+36=90، مجموع تعليقات التصنيف الأساسية=12 عند اعتماد فئة أساسية واحدة، 2 Nov→10 Nov=8 أيام، ممنوع الإشارة للـ63 تعليق غير المتاحين كأنهم محلّلون).",
   "Q5 — Business Value & Controls: اختار 3 KPIs قابلة للقياس وحدد التعريف/مصدر البيانات/المسؤول وخط أساس Missing إن لم يكن متاحًا؛ اذكر Pilot Plan لمدة 30 يومًا، Responsible HR Owner وFinal Human Sign-off."
  ],task:"قدّم Project Proposal واحدة مكوّنة من Q1–Q5، مع مخطط Workflow، و3 Prompts/Template واضحين أو Master Prompt موحد قابل للاختبار، وأمثلة Output على البيانات المتاحة، وQA Checklist و3 KPIs و30-Day Pilot. الأدلة من حزمة الحالة فقط.",
  boundaries:["لا تدّعِ معالجة 90 CV أو 75 تعليقًا أو قراءة سياسة 12 صفحة كاملة؛ أُتيحت 4 CV samples و12 comments و3 clauses فقط.","المراجعة البشرية لازمة لقرارات التوظيف، اعتماد السياسات، الاستنتاجات الإدارية، ولأي أتمتة تؤثر في الأشخاص.","ممنوع رفع CVs أو HR Records حقيقية دون تصريح. استخدم بيانات Synthetic فقط.","لو استخدمت Web Research أو Scraping، لا تُنشئ بيانات سوق وهمية ولا تجمع معلومات خاصة؛ وثّق المصدر المسموح وتاريخ الوصول.","لا تعد بتخفيض وقت/تكلفة دون قياس Baseline فعلي؛ قدم KPI definitions وPilot methodology فقط."],
  sections:[...HORIZON_EVIDENCE,{
   heading:"E | Project Acceptance Tests — حالات تحقق محددة",intro:"اتفاقية اختبار للحل النهائي، مش نتائج محسوبة مسبقًا من ملفات غير موجودة.",
   columns:["Test ID","اختبار قبول مبدئي"],
   rows:[
    ["AT-01","Recruitment: 54 + 36 = 90، ولكن تحليل المرشحين الأربعة لا يمثل Ranking للـ90."],
    ["AT-02","Comments: صنّف E01–E12 مع Evidence IDs، ثم اذكر أن 63 تعليقًا لم تُقدّم."],
    ["AT-03","Policy: 2→10 Nov = 8 أيام تقويمية، 5→10 Nov = 5؛ لا تعلن موافقة تلقائية."],
    ["AT-04","Evidence: أي claim عن الرواتب، معدل الرضا، زمن التوظيف، أو قانون الإجازات غير متاح = Missing Input."],
    ["AT-05","Human Sign-off: Recruiter / HR Manager يراجع المخرجات ويعتمد قبل الإرسال أو القرار."]
   ],note:"المطلوب Demonstration + Validation Plan، وليس نظامًا Production يقرر مصائر الموظفين."}],
  source:"Exact original Horizon M01 basis reused from Discovery, with explicitly marked synthetic evidence and final-project constraints.",rubric:[
    ["التشخيص المترابط ودقة الأرقام وحدود الأدلة",20],
    ["3 Workflows واضحة من Input إلى Human Approval",25],
    ["Master Prompts قابلة للتنفيذ ومخرجات يمكن اختبارها",20],
    ["خمسة اختبارات قبول والخصوصية ومنع الافتراضات",20],
    ["3 KPI Definitions وPilot لمدة 30 يومًا والقيمة التشغيلية",15]
  ]}
];
