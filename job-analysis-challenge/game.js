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
function groupUrl(id){return (window.WINNERS_LIVE_MODE&&window.WINNERS_WEBAPP_URL?window.WINNERS_WEBAPP_URL+"?view=group&group="+id:"group.html?group="+id)+"&round="+state.round;}
function gameParams(){return window.WINNERS_LIVE_MODE&&window.WINNERS_ROUTE_PARAMS?new URLSearchParams(window.WINNERS_ROUTE_PARAMS):new URLSearchParams(location.search);}
function renderTrainer(){
document.querySelectorAll("[data-round]").forEach(b=>{b.classList.toggle("active",b.dataset.round===state.round);b.setAttribute("aria-pressed",String(b.dataset.round===state.round));b.onclick=()=>{state.round=b.dataset.round;saveState();renderTrainer();};});
$("revealScores").checked=!!state.reveal;$("revealScores").onchange=e=>{state.reveal=e.target.checked;saveState();};
$("trainerGroups").innerHTML="";
CASES.forEach(c=>{const a=document.createElement("a");a.className="group-link";a.dataset.group=String(c.id);a.href=groupUrl(c.id);a.target="_blank";a.rel="noopener";const no=document.createElement("span");no.className="label";no.textContent="GROUP "+String(c.id).padStart(2,"0");const title=document.createElement("strong");title.textContent=c.title;const en=document.createElement("small");en.textContent=c.name;const go=document.createElement("span");go.className="go";go.textContent="افتح رابط الجروب ↗";a.append(no,title,en,go);$("trainerGroups").append(a);});
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
const qs=gameParams(),id=Number(qs.get("group"));const c=CASES.find(x=>x.id===id);
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

/* ==== LIVE BACKEND ADAPTER (HTMLService + google.script.run) ====
   Connected only when this UI is served by its official Apps Script Web App.
   No public Github source contains a backend secret or Gemini API key.
*/
const WINNERS_LIVE = !!(window.WINNERS_LIVE_MODE && typeof google!=="undefined" && google.script && google.script.run);
const LIVE_STORE="winners_job_teacher_session_v2";
let liveTeacherCode="",liveTeacherConnected=false,liveBusy=false;
function liveFail(err){return String(err&&err.message||err||"خطأ غير معروف");}
function liveReadState(){
  if(!WINNERS_LIVE)return;
  google.script.run.withSuccessHandler((data)=>{
    if(!data||!data.mode)return;
    state.round=data.round;
    state.reveal=!!data.reveal;
    state.scores=data.scores||{pre:{},post:{}};
    renderArena();
    $("arenaState").textContent=data.reveal?"نتائج معتمدة من المحاضر":"الدرجات في انتظار اعتماد المحاضر وإظهارها";
  }).withFailureHandler(err=>{$("arenaState").textContent="تعذّر تحديث البيانات: "+liveFail(err);}).getPublicState();
}
function liveApplyTeacher(data){
  if(!data||!data.ok)return;
  liveTeacherConnected=true;
  state.round=data.round;
  state.reveal=!!data.reveal;
  state.scores={pre:{},post:{}};
  renderTrainer();
  $("teacherConnectionMsg").textContent="متصل بقاعدة البيانات · "+(data.geminiConfigured?"Gemini API جاهز":"مفتاح Gemini لسه مش مضاف")+" · "+(data.submissions||[]).length+" تسليم";
  $("teacherConnectionMsg").style.color="#1d754d";
  $("teacherRefresh").hidden=false;
  $("reviewSection").hidden=false;
  if($("liveAccessPanel"))$("liveAccessPanel").hidden=false;
  const accessBtn=$("accessToggle"),opened=!!data.accessOpen;
  if(accessBtn){
    accessBtn.textContent=opened?"اقفل استقبال الإجابات":"افتح استقبال إجابات الجروبات";
    accessBtn.disabled=false;
    accessBtn.onclick=()=>{
      if(!liveTeacherCode)return;
      accessBtn.disabled=true;
      google.script.run.withSuccessHandler(liveApplyTeacher).withFailureHandler(err=>{accessBtn.disabled=false;alert(liveFail(err));})
        .teacherSetAccess(liveTeacherCode,!opened);
    };
  }
  if($("accessLabel"))$("accessLabel").textContent=opened?"التحدّي مفتوح — "+(data.round==="post"?"POST":"PRE"):"التحدّي مغلق";
  // Return private links only to an authenticated trainer, not to unauthenticated site visitors.
  (data.groups||[]).forEach(g=>{
    const a=document.querySelector('#trainerGroups a[data-group="'+g.caseId+'"]');
    if(!a)return;
    a.href=g.link||"#";
    a.onclick=e=>{if(!g.link){e.preventDefault();alert("رابط الجروب غير مهيأ؛ شغّل setupChallenge.");}};
    const copy=document.createElement("button");copy.type="button";copy.className="btn subtle";
    copy.textContent="نسخ رابط الجروب";copy.style.minHeight="36px";copy.style.padding="5px 10px";
    copy.addEventListener("click",ev=>{
      ev.preventDefault();ev.stopPropagation();
      if(!g.link)return;
      if(navigator.clipboard&&navigator.clipboard.writeText)
        navigator.clipboard.writeText(g.link).then(()=>{copy.textContent="تم النسخ ✓";}).catch(()=>{window.prompt("انسخ الرابط ده:",g.link);});
      else window.prompt("انسخ الرابط ده:",g.link);
    });
    a.append(copy);
  });

  $("previewSection").hidden=true;
  const reveal=$("revealScores");reveal.checked=!!data.reveal;
  if($("liveRevealScores"))$("liveRevealScores").checked=!!data.reveal;
  const r=document.querySelector(".switch-control");if(r)r.style.opacity="1";
  const cases=CASES;
  const progress=$("progressSummary");if(progress){
    progress.replaceChildren();
    cases.forEach(c=>{
      const pre=(data.submissions||[]).find(s=>s.groupId==="group-"+String(c.id).padStart(2,"0")&&s.round==="pre"&&s.approved!==null);
      const post=(data.submissions||[]).find(s=>s.groupId==="group-"+String(c.id).padStart(2,"0")&&s.round==="post"&&s.approved!==null);
      const block=document.createElement("div");block.className="score-input";
      const heading=document.createElement("span");heading.textContent="GROUP "+String(c.id).padStart(2,"0");
      const label=document.createElement("div");label.style.fontSize="11px";label.textContent=c.name;
      const values=document.createElement("strong");values.style.display="block";values.style.fontSize="12px";
      values.textContent="PRE "+(pre?pre.approved:"—")+" / POST "+(post?post.approved:"—");
      const improvement=document.createElement("div");improvement.style.fontSize="12px";improvement.style.fontWeight="900";
      improvement.style.color="#a07517";
      improvement.textContent=pre&&post?"التطور: "+((post.approved-pre.approved)>=0?"+":"")+(post.approved-pre.approved)+" نقطة":"التطور: بعد اعتماد المرحلتين";
      block.append(heading,label,values,improvement);progress.append(block);
    });
  }
  const list=$("reviewList");list.replaceChildren();
  const items=(data.submissions||[]).slice().reverse();
  if(!items.length){const p=document.createElement("div");p.className="panel";p.textContent="لسه مفيش تسليمات من الجروبات. افتح الجولة وشارك روابط الحالات.";list.append(p);}
  items.forEach(sub=>{
    const card=document.createElement("article");card.className="panel";
    card.style.marginBottom="13px";
    const header=document.createElement("div");header.className="panel-head";
    header.textContent=sub.groupId.toUpperCase()+" · "+(sub.round==="pre"?"قبل التدريب":"بعد التدريب")+" · "+sub.leader;
    card.append(header);
    const meta=document.createElement("p");meta.className="hint";meta.textContent="التقييم: "+sub.gradeStatus+" · Gemini: "+(sub.proposed===null?"بانتظار النتيجة":sub.proposed+"/100")+
        " · المعتمد: "+(sub.approved===null?"—":sub.approved+"/100");
    card.append(meta);
    if(sub.answersJson){
      try{
        const d=document.createElement("details");const s=document.createElement("summary");s.textContent="راجع إجابات الجروب والحل العملي";
        d.append(s);
        JSON.parse(sub.answersJson).forEach((answer,i)=>{const p=document.createElement("p");p.className="hint";
          p.textContent="سؤال "+(i+1)+": "+answer;d.append(p);});
        const p=document.createElement("p");p.className="hint";p.textContent="ملخص المخرج العملي: "+sub.practicalSummary;d.append(p);
        if(sub.documentUrl){const link=document.createElement("a");link.textContent="افتح الملف العملي ↗";link.href=sub.documentUrl;link.rel="noopener noreferrer";link.target="_blank";d.append(link);}
        card.append(d);
      }catch(e){}
    }
    if(sub.criteria){
      try{
        const criteria=JSON.parse(sub.criteria);
        const details=document.createElement("details");
        const summary=document.createElement("summary");summary.textContent="تفاصيل Rubric واقتراح Gemini";
        details.append(summary);
        criteria.forEach(c=>{const p=document.createElement("p");p.className="hint";
          p.textContent=c.label+" — "+c.score+"/"+c.max+" | الدليل: "+c.evidence+" | التحسين: "+c.improvement;details.append(p);});
        if(sub.feedback){const f=document.createElement("p");f.className="hint";let obj;
          try{obj=JSON.parse(sub.feedback);}catch(e){obj=null;}
          f.textContent=obj?(obj.summary+" · "+obj.limitations):sub.feedback;details.append(f);}
        card.append(details);
      }catch(e){}
    }
    const controls=document.createElement("div");controls.className="form-actions";controls.style.alignItems="end";
    const label=document.createElement("label");label.className="field";label.textContent="الدرجة النهائية";
    const input=document.createElement("input");input.type="number";input.min="0";input.max="100";input.step="1";
    input.value=sub.approved!==null?sub.approved:(sub.proposed!==null?sub.proposed:"");
    input.style.width="115px";label.append(input);
    const button=document.createElement("button");button.className="btn primary";button.type="button";
    button.textContent=sub.approval==="APPROVED"?"تعديل الدرجة المعتمدة":"اعتماد الدرجة";
    button.onclick=()=>{
      const score=Number(input.value);
      if(input.value===""||!Number.isFinite(score)||score<0||score>100){alert("اختار درجة من 0 إلى 100.");return;}
      button.disabled=true;button.textContent="جاري الاعتماد...";
      google.script.run.withSuccessHandler(liveApplyTeacher).withFailureHandler(err=>{button.disabled=false;button.textContent="اعتماد الدرجة";alert(liveFail(err));})
        .teacherApprove(liveTeacherCode,sub.id,score,"Instructor");
    };
    controls.append(label,button);card.append(controls);list.append(card);
  });
  // Re-bind privileged controls AFTER demo render reset.
  document.querySelectorAll("[data-round]").forEach(button=>{
    button.onclick=()=>{
      if(!liveTeacherCode)return alert("ادخل كود المحاضر الأول.");
      const next=button.dataset.round;
      button.disabled=true;
      google.script.run.withSuccessHandler(liveApplyTeacher).withFailureHandler(err=>{button.disabled=false;alert(liveFail(err));})
      .teacherSetRound(liveTeacherCode,next);
    };
  });
  const changeReveal=e=>{
    const next=!!e.target.checked;
    google.script.run.withSuccessHandler(liveApplyTeacher).withFailureHandler(err=>{e.target.checked=!next;alert(liveFail(err));})
      .teacherSetReveal(liveTeacherCode,next);
  };
  $("revealScores").onchange=changeReveal;
  if($("liveRevealScores"))$("liveRevealScores").onchange=changeReveal;
}
function liveConnectTeacher(){
  const code=$("teacherCode").value.trim();
  if(!code){$("teacherConnectionMsg").textContent="اكتب كود المحاضر من شيت Guide.";return;}
  const btn=$("teacherConnect");btn.disabled=true;
  $("teacherConnectionMsg").textContent="جاري الاتصال بقاعدة البيانات...";
  google.script.run.withSuccessHandler((data)=>{
    btn.disabled=false;liveTeacherCode=code;
    try{sessionStorage.setItem(LIVE_STORE,code);}catch(e){}
    liveApplyTeacher(data);
  }).withFailureHandler(err=>{btn.disabled=false;liveTeacherConnected=false;$("teacherConnectionMsg").textContent=liveFail(err);})
   .teacherSnapshot(code);
}
function liveTrainerSetup(){
  const connect=$("teacherConnect");
  try{$("teacherCode").value=sessionStorage.getItem(LIVE_STORE)||"";}catch(e){}
  connect.addEventListener("click",liveConnectTeacher);
  $("teacherRefresh").addEventListener("click",()=>{
    if(!liveTeacherCode)return;
    google.script.run.withSuccessHandler(liveApplyTeacher)
    .withFailureHandler(err=>alert(liveFail(err))).teacherSnapshot(liveTeacherCode);
  });
  $("retryGrades").addEventListener("click",()=>{
    if(!liveTeacherCode)return;
    const btn=$("retryGrades");btn.disabled=true;btn.textContent="جاري التقييم...";
    google.script.run.withSuccessHandler(data=>{btn.disabled=false;btn.textContent="إعادة محاولة تقييم المعلّق";liveApplyTeacher(data);})
      .withFailureHandler(err=>{btn.disabled=false;btn.textContent="إعادة محاولة تقييم المعلّق";alert(liveFail(err));})
      .teacherRetryPending(liveTeacherCode);
  });
  const preview=$("previewSection");if(preview)preview.style.opacity=".45";
  $("revealScores").disabled=true;
  // Force the user to connect first, so demo changes never get mistaken for real scoring.
  document.querySelectorAll("[data-round]").forEach(button=>{
    button.onclick=()=>alert("اتصل بكود المحاضر الأول علشان تغيّر الجولة الحقيقية.");
  });
  document.querySelectorAll("#trainerGroups a").forEach(a=>{
    a.href="#";a.onclick=e=>{e.preventDefault();alert("اتصل بكود المحاضر الأول علشان يظهر الرابط الخاص بكل جروب.");};
  });
  const launch=$("launchArena");
  if(launch && window.WINNERS_WEBAPP_URL){launch.href=window.WINNERS_WEBAPP_URL+"?view=arena";launch.target="_blank";}
}
function liveGroupSubmit(e){
  e.preventDefault();e.stopImmediatePropagation();
  if(liveBusy)return;
  const qs=gameParams(),id=Number(qs.get("group")),c=CASES.find(x=>x.id===id);
  if(!c)return;
  const round=qs.get("round")==="post"?"post":"pre";
  const code=qs.get("token")||"";
  if(!code){$("formMessage").textContent="رابط الجروب غير صحيح. افتحوا الرابط اللي المحاضر بعته.";return;}
  const data={groupId:"group-"+String(id).padStart(2,"0"),round:round,accessCode:code,leaderName:$("leaderName").value.trim(),
    answers:c.questions.map((_,i)=>$("q"+i).value.trim()),practicalSummary:$("summary").value.trim(),
    practicalDocumentUrl:$("documentLink").value.trim()};
  if(data.leaderName.length<3||data.answers.some(x=>x.length<25)||data.practicalSummary.length<50){
    $("formMessage").textContent="راجعوا اسم القائد، إجابات الأسئلة الثلاثة وملخص الحل الأول.";return;
  }
  liveBusy=true;
  const submit=$("groupForm").querySelector("button[type=submit]");submit.disabled=true;
  $("formMessage").textContent="جاري تسجيل الحل في Google Sheets…";
  google.script.run.withSuccessHandler(result=>{
    liveBusy=false;
    $("formMessage").textContent="تم استلام وتسـجيل الحل ✅ رقم التسليم: "+result.submissionId+" · "+result.message;
    submit.textContent="تم التسليم";submit.disabled=true;
    document.querySelectorAll("#groupForm input, #groupForm textarea").forEach(el=>{if(el.id!=="groupCode")el.readOnly=true;});
    try{sessionStorage.setItem("winners_receipt_"+id+"_"+round,result.submissionId);}catch(e){}
  }).withFailureHandler(err=>{
    liveBusy=false;submit.disabled=false;
    $("formMessage").textContent="تعذّر التسليم: "+liveFail(err)+" · مسودتكم لسه محفوظة على الجهاز.";
  }).submitGroup(data);
}
function liveGroupSetup(){
  const qs=gameParams(),id=Number(qs.get("group"));
  $("groupCodeField").hidden=true;
  const submit=$("groupForm").querySelector("button[type=submit]");
  if(!qs.get("token")){
    submit.disabled=true;
    $("formMessage").textContent="الرابط اللي فتحته مش رابط الجروب المخصص؛ اطلب الرابط من المحاضر.";
  }
  if(submit)submit.textContent="سلّموا الحل للتقييم ↗";
  $("groupForm").addEventListener("submit",liveGroupSubmit,true);
  const round=qs.get("round")==="post"?"post":"pre";
  try{
    const saved=sessionStorage.getItem("winners_receipt_"+id+"_"+round);
    if(saved){submit.disabled=true;submit.textContent="تم التسليم";$("formMessage").textContent="تم تسليم الإجابة سابقًا. رقم التسليم: "+saved;}
  }catch(e){}
}
function liveSetup(){
  if(!WINNERS_LIVE)return;
  const view=document.body.dataset.view;
  if(view==="arena"){liveReadState();setInterval(liveReadState,8000);}
  if(view==="trainer")liveTrainerSetup();
  if(view==="group")liveGroupSetup();
}
document.addEventListener("DOMContentLoaded",liveSetup);
