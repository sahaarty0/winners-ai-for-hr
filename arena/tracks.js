import {SCA_TRACKS,SCA_REFERENCE} from "./case-details.js";
export {SCA_REFERENCE};
export const TRACK_OPTIONS=[
 {id:"recruitment",label:"التعيينات وشغل الوظائف",short:"Staffing",icon:"🎯",desc:"التعامل مع احتياج وظيفي لم يكتمل مستنده"},
 {id:"experience",label:"تجربة العاملين والتنسيق الإداري",short:"Employee Experience",icon:"💬",desc:"فهم مشكلات التنسيق دون افتراض صلاحيات"},
 {id:"policy",label:"شئون العاملين واللوائح",short:"Personnel Policies",icon:"📋",desc:"طلب إجازة يحتاج إلى مراجعة اللائحة والصلاحية"}
];
const RUBRICS=[
 [["فهم الموقف وتحديد البيانات الناقصة",30],["تسلسل الحل بصورة عملية",25],["احترام المرجع القانوني وعدم اختراع اختصاصات",30],["وضوح الإجابة",15]],
 [["استخدام AI بشكل مناسب للمشكلة",25],["الاستناد إلى الدليل وتحديد ما لا نعرفه",30],["المراجعة البشرية والخصوصية",30],["وضوح الخطوات",15]],
 [["ملاءمة الحل للهيئة وتوزيع المسؤوليات بحذر",25],["قابلية التطبيق وخطة متابعة مبسطة",25],["دقة المراجع والضوابط والمراجعة البشرية",35],["مؤشر قياس واضح",15]]
];
export function getTrackStage(stage,id){
 const number=Number(stage),track=SCA_TRACKS[id];if(!track||![1,2,3].includes(number))return null;
 const level=track.levels[number-1],item=TRACK_OPTIONS.find(x=>x.id===id);
 return {
  id:number,
  name:["Discovery","Level Up","Grand Finale"][number-1]+" · "+item.short,
  label:track.label,track:id,title:level.title,
  description:track.intro,
  level:["Beginner","Intermediate","Advanced"][number-1],
  duration:["25 دقيقة","30 دقيقة","45 دقيقة"][number-1],
  facts:[track.intro, "الوثائق القانونية الأصلية والتفويضات المعتمدة لها الأولوية على الملخصات البحثية."],
  questions:[level.question],
  task:"سؤال واحد فقط: اكتب إجابة مترابطة بطريقتك، في فقرة أو خطوات متتابعة. لا توجد أسئلة Q1–Q4 ولا قالب إجابة إلزامي.",
  sections:track.sections,
  boundaries:[
   "الموقف والبيانات افتراضية؛ لا ترفع ملفات موظفين أو مرشحين حقيقية.",
   "لا تفترض درجات وظيفية أو سلطات اعتماد أو شروط إجازات غير مثبتة.",
   number===1?"هذه الجولة بدون استخدام AI.": "استخدام AI مسموح، لكن أي نتيجة تخضع لمراجعة بشرية.",
   "الملخصات داخل Drive أداة بحثية؛ عند التعارض أو عدم اكتمال النص القانوني اذكر أن الحسم يتطلب مراجعة النص الأصلي الساري."
  ],
  rubric:RUBRICS[number-1],
  graderKey:"Accept an open essay OR steps. Strong answers identify gaps, verify current SCA original acts, and avoid inventing job titles, legal entitlements, decision rights or any operational facts. No exact wording required.",
  source:"المرجع البحثي الرسمي للتدريب: SCA HR Knowledge Base & Legal Chunks — مراجعة "+SCA_REFERENCE.reviewedAsOf,
  referenceUrl:SCA_REFERENCE.folderUrl
 };
}
export const TRACK_STAGE_DATA=SCA_TRACKS;
