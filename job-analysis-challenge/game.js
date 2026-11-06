"use strict";
/* FRONTEND ONLY. Scores are clearly marked simulation until backend approval. */
const CASES=window.WINNERS_CASES || [];
const KEY="winners_job_architecture_game_v2",DRAFT="winners_job_architecture_drafts_v2";
const $=id=>document.getElementById(id);
const valid=v=>Number.isFinite(v)&&v>=0&&v<=100;
const defaults=()=>({round:"pre",reveal:false,scores:{pre:{},post:{}},updatedAt:null});
function loadState(){try{const o=JSON.parse(localStorage.getItem(KEY)||"null"); if(o&&["pre","post"].includes(o.round)&&o.scores?.pre&&o.scores?.post)return o;}catch(e){}return defaults();}
let state=loadState();
function saveState(){state.updatedAt=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
const roundAr=()=>state.round==="pre"?"قبل التدريب":"بعد التدريب";
const grade=n=>!valid(n)?"pending":n<=49?"red":n<=69?"amber":n<=84?"blue":"green";
const levelName=l=>({pending:"بانتظار التقييم",red:"يحتاج تطوير",amber:"أساس مقبول",blue:"أداء جيد",green:"متقدم"}[l]||"بانتظار التقييم");
const scoreFor=id=>{const n=state.scores?.[state.round]?.[id];return n===null||n===undefined||n===""?null:valid(Number(n))?Number(n):null};
function groupUrl(id){return "group.html?group="+id+"&round="+state.round;}
function renderTrainer(){
document.querySelectorAll("[data-round]").forEach(b=>{b.classList.toggle("active",b.dataset.round===state.round);b.setAttribute("aria-pressed",String(b.dataset.round===state.round));b.onclick=()=>{state.round=b.dataset.round;saveState();renderTrainer();};});
$("revealScores").checked=!!state.reveal;$("revealScores").onchange=e=>{state.reveal=e.target.checked;saveState();};
$("trainerGroups").innerHTML="";
CASES.forEach(c=>{const a=document.createElement("a");a.className="group-link";a.href=groupUrl(c.id);a.target="_blank";a.rel="noopener";const no=document.createElement("span");no.className="label";no.textContent="GROUP "+String(c.id).padStart(2,"0");const title=document.createElement("strong");title.textContent=c.title;const en=document.createElement("small");en.textContent=c.name;const go=document.createElement("span");go.className="go";go.textContent="افتح رابط الجروب ↗";a.append(no,title,en,go);$("trainerGroups").append(a);});
$("trainerScores").innerHTML="";
CASES.forEach(c=>{const box=document.createElement("div");box.className="score-input";const lab=document.createElement("label");lab.htmlFor="score"+c.id;lab.textContent=c.name;const t=document.createElement("span");t.textContent="GROUP "+String(c.id).padStart(2,"0");const input=document.createElement("input");input.type="number";input.min=0;input.max=100;input.step=1;input.id="score"+c.id;input.placeholder="—";input.value=scoreFor(c.id)??"";input.onchange=()=>{const v=input.value.trim();if(v==="" ){delete state.scores[state.round][c.id];saveState();return;}const n=Number(v);if(!valid(n)){input.value="";delete state.scores[state.round][c.id];}else{state.scores[state.round][c.id]=n;}saveState();};box.append(t,lab,input);$("trainerScores").append(box);});
$("clearScores").onclick=()=>{state.scores[state.round]={};state.reveal=false;saveState();renderTrainer();};
}
function renderArena(){
$("arenaRound").textContent=roundAr()+" · "+state.round.toUpperCase();
$("arenaCards").innerHTML="";
CASES.forEach(c=>{const score=state.reveal?scoreFor(c.id):null;const l=grade(score);const card=document.createElement("article");card.className="arena-card";card.dataset.level=l;
const no=document.createElement("div");no.className="group-no";no.textContent="GROUP "+String(c.id).padStart(2,"0");
const glyph=document.createElement("div");glyph.className="glyph";glyph.textContent=String(c.id).padStart(2,"0");
const title=document.createElement("h2");title.textContent=c.name;
const arabic=document.createElement("div");arabic.className="arabic-title";arabic.textContent=c.title;
const val=document.createElement("div");val.className="score"+(score===null?" pending":"");val.textContent=score===null?"بانتظار التقييم":String(score)+" /100";
const level=document.createElement("div");level.className="level";level.textContent=levelName(l);
card.append(no,glyph,title,arabic,val,level);$("arenaCards").append(card);});
$("arenaState").textContent=state.reveal?"معاينة درجات أدخلها المحاضر — ليست نتيجة Gemini":"النتائج في انتظار التقييم";
}
function loadDraft(k){try{return JSON.parse(localStorage.getItem(k)||"null")||{};}catch(e){return {};}}
function saveDraft(k,data){try{localStorage.setItem(k,JSON.stringify(data));return true;}catch(e){return false;}}
function download(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
function renderGroup(){
const qs=new URLSearchParams(location.search),id=Number(qs.get("group"));const c=CASES.find(x=>x.id===id);
const round=qs.get("round")==="post"?"post":qs.get("round")==="pre"?"pre":state.round;
$("groupRound").textContent=round.toUpperCase();if(!c){$("groupNotFound").hidden=false;return;}
$("groupContent").hidden=false;$("groupLabel").textContent="GROUP "+String(id).padStart(2,"0")+" / "+round.toUpperCase();
$("groupTitle").textContent=c.title;$("groupSubtitle").textContent=c.company+" · "+c.name;
$("caseIntro").textContent=c.intro;$("caseGoal").textContent=c.objective;
c.facts.forEach(t=>{const li=document.createElement("li");li.textContent=t;$("caseFacts").append(li);});
c.deliverables.forEach(t=>{const li=document.createElement("li");li.textContent=t;$("caseDeliverables").append(li);});
c.questions.forEach((q,i)=>{const wrap=document.createElement("div");wrap.className="question";const tag=document.createElement("div");tag.className="index";tag.textContent="CHALLENGE "+String(i+1).padStart(2,"0");const title=document.createElement("strong");title.textContent=q;const input=document.createElement("textarea");input.id="q"+i;input.rows=4;input.maxLength=3500;input.placeholder="اكتبوا القرار والمبررات والأدلة…";input.setAttribute("aria-label","إجابة التحدي "+(i+1));wrap.append(tag,title,input);$("caseQuestions").append(wrap);});
const k=DRAFT+"_g"+id+"_"+round,prior=loadDraft(k),pre=loadDraft(DRAFT+"_g"+id+"_pre");
$("leaderName").value=prior.leader||pre.leader||"";$("summary").value=prior.summary||"";$("documentLink").value=prior.link||"";
c.questions.forEach((_,i)=>{$("q"+i).value=prior.answers?.[i]||"";});
const extract=()=>({leader:$("leaderName").value.trim(),summary:$("summary").value.trim(),link:$("documentLink").value.trim(),answers:c.questions.map((_,i)=>$("q"+i).value.trim()),savedAt:new Date().toISOString()});
$("saveDraft").onclick=()=>{$("formMessage").textContent=saveDraft(k,extract())?"المسودة اتحفظت على الجهاز ده.":"تعذّر الحفظ على الجهاز.";};
$("groupForm").addEventListener("input",()=>saveDraft(k,extract()));
$("groupForm").addEventListener("submit",e=>{e.preventDefault();const d=extract();
if(d.leader.length<3){$("formMessage").textContent="اكتبوا اسم قائد الجروب.";return;}
if(d.answers.some(x=>x.length<25)){$("formMessage").textContent="كل تحدّي محتاج شرح 25 حرف على الأقل.";return;}
if(d.summary.length<50){$("formMessage").textContent="ملخص الحل محتاج شرح 50 حرف على الأقل.";return;}
if(d.link && !/^https:\/\/\S+\.\S+/i.test(d.link)){$("formMessage").textContent="لينك الملف لازم يبدأ بـ https:// أو سيبوه فاضي.";return;}
saveDraft(k,d);
download({schemaVersion:"winners-job-architecture-submission-v1",groupId:"group-"+String(id).padStart(2,"0"),caseId:id,caseName:c.name,phase:round,leaderName:d.leader,responses:c.questions.map((prompt,i)=>({questionId:"Q"+(i+1),prompt,answer:d.answers[i]})),practicalSummary:d.summary,practicalDocumentUrl:d.link||null,exportedAt:new Date().toISOString(),submissionStatus:"NOT_SENT_TO_BACKEND",gradingStatus:"PENDING_GEMINI_AND_INSTRUCTOR_APPROVAL"},"Winners_Group_"+id+"_"+round+".json");
$("formMessage").textContent="تم تصدير إجابة الجروب على الجهاز. ده مش إرسال للمدرب؛ الربط هيشتغل مع الـ Backend.";
});
}
function init(){const view=document.body.dataset.view;if(view==="trainer")renderTrainer();if(view==="arena"){renderArena();window.addEventListener("storage",e=>{if(e.key===KEY){state=loadState();renderArena();}});}if(view==="group")renderGroup();}
document.addEventListener("DOMContentLoaded",init);