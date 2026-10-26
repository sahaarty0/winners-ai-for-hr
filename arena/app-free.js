import {appsScriptWebAppUrl,defaultSessionId,pollSeconds} from "./apps-script-config.js";
const STAGES=[
{id:1,key:"discovery",name:"Discovery · Baseline",label:"Discovery",desc:"قبل التدريب — No AI · اكتشف طريقة التفكير",title:"Horizon Services — HR Challenge",description:"أنت ضمن فريق HR لشركة خدمات افتراضية بها 320 موظفًا. الإدارة تطلب خطة ذكية للتعامل مع ثلاث مشكلات HR. في هذه الجولة لا تستخدم أي مساعد AI.",facts:["90 CVs لوظيفتين مختلفتين؛ البيانات غير موحدة والمقارنة صعبة.","75 تعليقًا مجهول الهوية من الموظفين يحتاج تجميعًا موضوعيًا.","سياسة إجازات داخلية من 12 صفحة تحتاج شرحًا دقيقًا."],task:"حلل المشكلات، حدد الأولويات والخطوات والأدوات التي قد تساعد، والبيانات المطلوبة، وحدود تدخل الـAI والقرار البشري. بدون استخدام AI.",note:"مستوحى من Mission 00 الأصلي في Module 01. التقييم هنا Baseline تشخيصي، ولا يدخل مباشرة في ترتيب الفوز.",rubric:[["فهم المشكلة وتحديد الأولويات",25],["وضوح الإجراءات والمنطق",25],["اختيار الأدوات الملائمة",20],["البيانات والحوكمة والقرار البشري",20],["واقعية الحل",10]]},
{id:2,key:"growth",name:"Level Up · Growth",label:"Level Up",desc:"نهاية السيشن — Measure growth + Master Prompt",title:"Nova Retail — Smart Workforce Response",description:"توسع شركة Nova Retail الافتراضية خلق فجوة في التوظيف. ابدأ بالحل من فهمك قبل استخدام AI، ثم حسّنه بالـMaster Prompt الذي تدربت عليه.",facts:["عدد الموظفين الحالي: 18، والمستهدف: 24؛ الفجوة = 6 وظائف.","Store Associates من 12 إلى 16، Supervisors من 3 إلى 4، Cashiers من 3 إلى 4.","الفرع الجديد Store D؛ نحتاج Workforce Gap + Org Structure + JD + CBI Questions."],task:"الجزء الأول: اكتب تحليلًا وخطواتك بدون AI. الجزء الثاني: استخدم Master Prompt مع المعلومات المتاحة وقدّم ناتجًا محسّنًا مع مراجعة الافتراضات والأدلة.",note:"مستند إلى Day 2 Module 04 (Nova Retail)، مع استخدام Universal AI Execution Prompt من Module 02. قياس الـGrowth يحتاج مقارنة عادلة بالـBaseline؛ الدرجات ليست اختبارًا علميًا معتمدًا.",rubric:[["تحليل الفجوة قبل استخدام AI",25],["تصميم الإجراءات والحلول",20],["جودة Master Prompt",25],["التحقق من الأرقام والأدلة",20],["الوضوح وقابلية التطبيق",10]]},
{id:3,key:"final",name:"Grand Finale · Final Project",label:"Grand Finale",desc:"Return to Horizon · Professional Business Solution",title:"Horizon Services — End-to-End AI Solution",description:"ارجع الآن لنفس حالة Horizon Services من Stage 01. ابنِ حل HR متكاملًا باستخدام Prompt Engineering وAI Research وأدوات تحليل أو أتمتة مناسبة ومسموح بها.",facts:["320 موظفًا؛ 90 CVs لوظيفتين مع عدم توحيد الملفات.","75 تعليقًا مجهول الهوية؛ الحاجة لاستخراج Themes بدون تعميم زائد.","سياسة إجازات مكوّنة من 12 صفحة؛ أي شرح أو قرار يحتاج اعتماد HR."],task:"قدّم Problem Diagnosis وSolution Architecture وMaster Prompt قابل للتشغيل، وخطوات التنفيذ والتحقق والخصوصية، وخطة قياس القيمة. أدوات الـScraping/Automation اختيارية عندما تكون مرخّصة ومبررة.",note:"المخرجات: Executive Snapshot + HR Workflow + AI Tool Choice + Verifiable Deliverables + Risks + KPIs + Human Sign-off. لا تُسند قرارات التعيين أو الترقيات إلى AI.",rubric:[["عمق التشخيص وربطه بالأدلة",20],["جودة الحل وتصميم Workflow",25],["Prompt / AI Tools Implementation",20],["السلامة والخصوصية والتحقق",20],["القيمة التجارية وخطة القياس",15]]}
];
const DEMO_SEED=[
{id:"alpha",name:"Team Alpha",scores:{"1":42,"2":81,"3":91},feedback:{"1":"تحديد أولويات جيد؛ ناقش مصدر البيانات قبل اقتراح الأدوات.","2":"تحسن في صياغة الـPrompt وربط النتائج بالبيانات.","3":"حل متكامل مع خطة متابعة جيدة."}},
{id:"bravo",name:"Team Bravo",scores:{"1":61,"2":84,"3":87},feedback:{"1":"تشخيص قوي، والتحقق البشري يحتاج تفصيلًا.","2":"خطوات واضحة؛ حسّن الافتراضات المعلنة.","3":"نموذج عمل قابل للتطبيق مع بعض التحسينات."}},
{id:"charlie",name:"Team Charlie",scores:{"1":35,"2":78,"3":94},feedback:{"1":"ضعف في اختيار الأدوات وتوثيق البيانات.","2":"تقدم ممتاز؛ أصبح يربط القرار بالدليل.","3":"أفضل مقترح في مؤشرات القيمة والتحقق."}}
];
const KEY="winners-arena-demo-v1";
const defaults=()=>({stage:1,reveal:false,open:true,teams:structuredClone(DEMO_SEED),answers:{},lastTeam:"alpha",notes:{},edited:{},view:new URLSearchParams(location.search).get("view")==="team"?"team":"presenter"});
let demo;try{demo={...defaults(),...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{demo=defaults()}
if(!Array.isArray(demo.teams)||!demo.teams.length)demo.teams=structuredClone(DEMO_SEED);
const el=id=>document.getElementById(id);const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));const save=()=>localStorage.setItem(KEY,JSON.stringify(demo));const fmt=n=>typeof n==="number"?n.toFixed(1)+"%":"—";
const hosted=!!(new URLSearchParams(location.search).get("bridge")==="parent" && /^https:\/\/(script\.google\.com|[\w.-]+\.googleusercontent\.com)\//.test(document.referrer));
const mode=hosted||!!(appsScriptWebAppUrl && /^https:\/\/script\.google\.com\/macros\/s\//.test(appsScriptWebAppUrl));
let isAdmin=false,realSession=null,realEvals=[],joinedTeam=null,activeSessionId=new URLSearchParams(location.search).get("session")||defaultSessionId||localStorage.getItem("winners-arena-session")||"",liveError="",lastAdminSnapshot=null,bridgeReady=false,bridgeTarget=null;
function notify(msg){const t=el("toast");t.textContent=msg;t.classList.remove("hidden");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.add("hidden"),4200)}
function currentStage(){return mode&&realSession?realSession.currentStage:demo.stage}
function revealed(){return mode&&realSession?!!realSession.reveal:!!demo.reveal}
function isOpen(){return mode&&realSession?!!realSession.open:!!demo.open}
function publicTeams(){if(!mode)return demo.teams;return realSession?.publicTeams||[]}
function scoreInfo(team,stage){
if(!mode){const t=demo.teams.find(x=>x.id===team.id)||team;return {score:typeof t.scores?.[stage]==="number"?t.scores[stage]:null,feedback:t.feedback?.[stage]||""}}
const pub=realSession?.publicBoard?.[String(stage)]?.[team.id];
return {score:pub&&Number.isFinite(Number(pub.score))?Number(pub.score):null,feedback:pub?.feedback||""};
}
function renderStageNav(){let curr=currentStage();el("stageNav").innerHTML=STAGES.map(s=>'<button class="stage-pill '+(curr===s.id?"current":"")+'" data-stage="'+s.id+'" title="'+escape(s.desc)+'"><span class="num">'+String(s.id).padStart(2,"0")+'</span><span><strong>'+escape(s.label)+'</strong><small>'+escape(s.desc)+'</small></span></button>').join("")}
function renderCards(){const st=currentStage(),show=revealed(),teams=publicTeams();const ranked=[...teams].sort((a,b)=>{if(!show)return a.name.localeCompare(b.name);return (scoreInfo(b,st).score??-1)-(scoreInfo(a,st).score??-1)});
el("teamCount").textContent=teams.length+" Teams";
el("teamCards").innerHTML=teams.length?ranked.map((team,i)=>{let {score}=scoreInfo(team,st),rank=i+1,klass=show?["gold-card","silver-card","bronze-card"][Math.min(i,2)]:"silver-card",showScore=show&&score!==null;let chips=STAGES.map(stage=>{let si=scoreInfo(team,stage.id).score;return '<div class="mini"><b>'+((show&&stage.id===st&&si!==null)?Math.round(si):"—")+'</b>Stage '+stage.id+'</div>'}).join("");let growth=(show&&st===2&&scoreInfo(team,1).score!==null&&score!==null)?'<span class="positive">+'+(score-scoreInfo(team,1).score).toFixed(1)+' pts Growth</span>':'';return '<article class="team-card '+klass+'"><span class="shine"></span><div class="medal"><span class="medal-icon">'+(show?["🥇","🥈","🥉"][Math.min(i,2)]:"🛡")+'</span> '+(show?"RANK "+rank:"TEAM")+'</div><div><h3>'+escape(team.name)+'</h3><div class="subtitle">Winners AI Challenge Team</div></div><div><div class="score">'+(showScore?score.toFixed(1):"??")+'<small>'+(showScore?"%":"")+'</small></div><div class="xp-label">'+(showScore?"Gemini / Trainer Reviewed":"Awaiting Reveal")+'</div><div class="progress"><i style="width:'+(showScore?score:0)+'%"></i></div></div><div class="mini-chips">'+chips+'</div><div class="card-foot">'+growth+'</div></article>'}).join(""):'<div class="empty-state">مافيش فرق مسجلة لسه. إنشاء جلسة جديدة من شاشة المحاضر.</div>'}
function renderCase(){let s=STAGES[currentStage()-1];el("stageHeading").textContent=s.name;el("challengeStage").textContent="STAGE "+String(s.id).padStart(2,"0");el("caseTitle").textContent=s.title;el("caseDescription").textContent=s.description;el("caseFacts").innerHTML=s.facts.map(x=>'<li>'+escape(x)+'</li>').join("");el("caseTask").textContent=s.task;el("caseNote").textContent=s.note;el("rubricList").innerHTML=s.rubric.map(([name,w])=>'<div class="rubric-row"><span>'+escape(name)+'</span><span class="bar"><i style="width:'+w+'%"></i></span><b>'+w+'%</b></div>').join("");el("stageStatus").textContent=isOpen()?"التحدي مفتوح":"تم إغلاق التسليم";el("visibilityBadge").textContent=revealed()?"👁 Scores Revealed":"🙈 Scores Hidden";el("revealBtn").textContent=revealed()?"🙈 إخفاء الدرجات":"👁 إظهار الدرجات";el("freezeBtn").textContent=isOpen()?"⏸ إغلاق التحدي":"▶ فتح التحدي";el("connectionBadge").textContent=mode?(realSession?"● Google Sheets Live":bridgeReady?"● Apps Script Ready":"◉ Connecting to Apps Script"):"◉ Local Demo (Illustrative Scores)";el("sessionBadge").textContent="SESSION: "+(activeSessionId||"LOCAL");
el("masterField").classList.toggle("hidden",s.id===1);el("masterReference").classList.toggle("hidden",s.id===1);el("answerProblemLabel").textContent=s.id===1?"1. تشخيص المشكلة والخطوات — بدون AI":s.id===2?"1. تحليل أولي — بدون AI":"1. تحليل المشكلة وتحديد الأولويات";el("answerToolsLabel").textContent=s.id===1?"2. أدوات AI المناسبة ولماذا — بدون استخدامها":s.id===2?"2. الخطوات والأدوات بعد التدريب":"2. AI Tools / Workflow وخطة التنفيذ";el("answerEvidenceLabel").textContent="3. Evidence / Verification / Human Judgment";el("submitTeam").disabled=!isOpen();el("prevStage").disabled=s.id===1;el("nextStage").disabled=s.id===3}
function renderFeedback(){
const id=el("judgeTeam").value,stage=currentStage();
const e=realEvals.find(x=>x.teamId===id&&x.stage===stage);
const msg=e?.feedback||scoreInfo({id:id},stage).feedback||"";
const reasons=e?.criteria?.map(x=>x.name+": "+x.points+"/"+x.max+" — "+x.reason).join("\n");
el("judgeFeedback").textContent=msg?("◈ "+msg+(reasons?"\n"+reasons:"")):"✦ تقييم Gemini مساعد فقط. اختار الفريق واضغط تحميل تقييمات المحاضر، ثم اعتمد الدرجة قبل كشفها.";
}
function renderChoices(){let ts=publicTeams();let curJ=el("judgeTeam").value||ts[0]?.id,curT=el("teamSelect").value||demo.lastTeam;el("judgeTeam").innerHTML=ts.map(t=>'<option value="'+escape(t.id)+'">'+escape(t.name)+'</option>').join("");el("teamSelect").innerHTML=ts.map(t=>'<option value="'+escape(t.id)+'">'+escape(t.name)+'</option>').join("");if(ts.some(t=>t.id===curJ))el("judgeTeam").value=curJ;if(ts.some(t=>t.id===curT))el("teamSelect").value=curT}

const pending=new Map();
let rpcSeq=0;
function adminKey(){return el("adminKey").value.trim()}
function bridgeValidEvent(e){if(e.source!==bridgeTarget)return false;try{const u=new URL(e.origin);return u.protocol==="https:"&&(u.hostname==="script.google.com"||u.hostname.endsWith(".googleusercontent.com"))}catch{return false}}
window.addEventListener("message",e=>{
 if(!bridgeValidEvent(e))return;
 const msg=e.data||{};
 if(msg.arenaBridgeReady===true){bridgeReady=true;el("connectionBadge").textContent="● Apps Script Connected";if(activeSessionId)refreshPublic();return}
 if(msg.arena===true && msg.id && pending.has(msg.id)){
  const {resolve,reject,timer}=pending.get(msg.id);clearTimeout(timer);pending.delete(msg.id);msg.error?reject(new Error(msg.error)):resolve(msg.result);
 }
});
function call(action,payload={}){
 if(!mode)return Promise.reject(new Error("Live backend not configured; demo mode only"));
 if(!bridgeReady||!bridgeTarget)return Promise.reject(new Error("Apps Script connection is not ready. Try the direct Web App link."));
 const id="w"+Date.now()+"_"+(++rpcSeq);
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{pending.delete(id);reject(new Error("Backend response timed out. Check connection before submitting again."))},action==="evaluateSubmission"?58000:27000);
  pending.set(id,{resolve,reject,timer});
  bridgeTarget.postMessage({arena:true,id,action,payload},"*");
 });
}
function identity(){return {sessionId:activeSessionId,adminKey:adminKey()}}
function renderView(){
const v=demo.view;
el("presenterPanel").classList.toggle("hidden",v!=="presenter");el("teamPanel").classList.toggle("hidden",v!=="team");
el("presenterTab").classList.toggle("active",v==="presenter");el("teamTab").classList.toggle("active",v==="team");
el("loginBtn").hidden=true;
el("presenterPanel").querySelector(".tag").textContent=!mode?"DEMO":isAdmin?"PRESENTER AUTHORIZED":"PRESENTER PASSWORD REQUIRED";
el("codeField").classList.toggle("hidden",!mode);
el("teamSelect").disabled=mode&&!!joinedTeam;
el("joinTeam").disabled=!mode||!realSession;
el("teamIdentity").textContent=mode?(joinedTeam?"Joined: "+joinedTeam.name:"Not joined yet"):"Local Demo Team";
el("adminStatus").textContent=mode?(liveError||"للمحاضر: أدخل كلمة المرور ثم حمّل التقييمات، أو أنشئ Session وشارك رموز الجروبات."):"تجربة محلية فقط — لا توجد أي بيانات مشتركة أو تقييم Gemini.";
el("teamStatus").textContent=mode?(joinedTeam?"Connected to session: "+activeSessionId+" | Submissions persist in Google Sheets.":"اختر الفريق، اكتب الكود الخاص به واضغط دخول الفريق."):"Demo Mode — كل النتائج محلية على جهازك فقط.";
}
function render(){renderStageNav();renderChoices();renderCards();renderCase();renderFeedback();renderView();updateSelected()}
function updateSelected(){
const id=el("judgeTeam").value,st=currentStage();
const e=realEvals.find(x=>x.teamId===id&&x.stage===st);
const sc=e?.score??scoreInfo({id:id},st).score;
el("judgeScore").value=sc??0;el("judgeNote").value=e?.feedback||scoreInfo({id:id},st).feedback||"";
renderFeedback();
}
function updateAnswerForm(){
if(mode){for(const k of ["Problem","Tools","Evidence","Prompt"])el("answer"+k).value="";return}
const key=el("teamSelect").value+"_"+currentStage(),a=demo.answers[key]||{};
for(const k of ["Problem","Tools","Evidence","Prompt"])el("answer"+k).value=a[k.toLowerCase()]||"";
}
function setUrlSession(id){
activeSessionId=id;localStorage.setItem("winners-arena-session",id);
const u=new URL(location.href);u.searchParams.set("session",id);history.replaceState({},"",u);
el("sessionInput").value=id;
}
function changeView(v){demo.view=v;save();const u=new URL(location.href);u.searchParams.set("view",v);history.replaceState({}, "",u);render()}
el("presenterTab").addEventListener("click",()=>changeView("presenter"));
el("teamTab").addEventListener("click",()=>{changeView("team");updateAnswerForm()});
el("stageNav").addEventListener("click",async e=>{const b=e.target.closest("[data-stage]");if(b&&(!mode||isAdmin))await changeStage(Number(b.dataset.stage))});
el("prevStage").addEventListener("click",()=>changeStage(Math.max(1,currentStage()-1)));
el("nextStage").addEventListener("click",()=>changeStage(Math.min(3,currentStage()+1)));
async function changeStage(stage){
if(mode){
 try{if(!adminKey())throw Error("كلمة مرور المحاضر مطلوبة");
 const r=await call("setArenaState",{...identity(),stage,open:true,reveal:false});
 realSession=r.public;await refreshAdmin(true);render();notify("Stage "+stage+" is open")}
 catch(e){notify(e.message)}
}else{demo.stage=stage;demo.reveal=false;demo.open=true;save();render();updateAnswerForm()}
}
async function setState(changes){
if(mode){
 try{if(!adminKey())throw Error("كلمة مرور المحاضر مطلوبة");
 const r=await call("setArenaState",{...identity(),...changes});realSession=r.public;render();notify("تم تحديث حالة المنافسة")}
 catch(e){notify(e.message)}
}else{Object.assign(demo,changes);save();render()}
}
el("revealBtn").addEventListener("click",()=>setState({reveal:!revealed()}));
el("freezeBtn").addEventListener("click",()=>setState({open:!isOpen()}));
el("judgeTeam").addEventListener("change",updateSelected);
el("teamSelect").addEventListener("change",()=>{demo.lastTeam=el("teamSelect").value;joinedTeam=null;save();updateAnswerForm();render()});
el("refreshAdmin").addEventListener("click",()=>refreshAdmin());
el("adminKey").addEventListener("change",()=>{isAdmin=false;realEvals=[];render()});
async function refreshAdmin(quiet=false){
if(!mode||!activeSessionId||!adminKey())return;
try{const r=await call("getAdminState",identity());isAdmin=true;lastAdminSnapshot=r;realEvals=r.evaluations||[];realSession=r.public||realSession;liveError="";render();if(!quiet)notify("تم تحديث الإجابات والتقييمات من Sheets")}
catch(e){isAdmin=false;realEvals=[];liveError="فشل دخول المحاضر: "+e.message;render();if(!quiet)notify(liveError)}
}
el("manualBackup").addEventListener("click",()=>{notify("Manual Backup: اختر الفريق ثم اكتب Score وFeedback واضغط حفظ. لا يحتاج Gemini.");el("judgeScore").focus()});
el("saveManual").addEventListener("click",async()=>{
 const teamId=el("judgeTeam").value,score=Number(el("judgeScore").value),feedback=el("judgeNote").value.trim();
 if(!teamId||!Number.isFinite(score)||score<0||score>100)return notify("أدخل درجة 0–100");
 if(mode){
  try{const r=await call("approveScore",{...identity(),teamId,stage:currentStage(),score,feedback});notify("تم اعتماد تقييم "+teamId+" — نشره يتم بزر Reveal");await refreshAdmin(true)}
  catch(e){notify("لم يتم الحفظ: "+e.message)}
 }else{const t=demo.teams.find(x=>x.id===teamId);t.scores[currentStage()]=score;t.feedback[currentStage()]=feedback;save();render();notify("Saved locally in Demo")}
});
el("geminiEvaluate").addEventListener("click",async()=>{
 if(!mode)return notify("Demo only: Gemini scoring requires a deployed Apps Script Web App.");
 const teamId=el("judgeTeam").value;if(!teamId)return notify("اختر الفريق");
 const btn=el("geminiEvaluate");btn.disabled=true;btn.textContent="✦ Gemini جاري التقييم...";
 try{
  const r=await call("evaluateSubmission",{...identity(),teamId,stage:currentStage()});
  if(!r.ok&&r.fallback==="MANUAL"){notify(r.message+" — اضغط Manual Scoring لتكمل.");return}
  el("judgeScore").value=r.score;el("judgeNote").value=r.feedback||"";await refreshAdmin(true);
  notify("وصل تقييم Gemini. راجع البنود واعتمد الدرجة قبل الإظهار.");
 }catch(e){notify("Gemini unavailable — استخدم التقييم اليدوي. "+e.message)}
 finally{btn.disabled=false;btn.textContent="✦ تقييم Gemini أو Manual"}
});
el("openTeamLink").addEventListener("click",async()=>{
 const u=new URL(location.href);
 u.searchParams.delete("bridge");u.searchParams.set("view","team");
 if(activeSessionId)u.searchParams.set("session",activeSessionId);
 if(hosted){
 const published=new URLSearchParams(location.search).get("service");
 if(published&&/^https:\/\/script\.google\.com\/macros\/s\//.test(published)){
  const liveUrl=new URL(published);liveUrl.searchParams.set("session",activeSessionId);liveUrl.searchParams.set("view","team");
  u.href=liveUrl.href;
 }else{notify("رابط Apps Script لم يُضف للصفحة بعد — اطلبه من المحاضر");return}
}
 try{await navigator.clipboard.writeText(u.href);notify("تم نسخ رابط المتدربين")}catch{window.prompt("Team URL",u.href)}
});
el("sessionInput").value=activeSessionId;
el("sessionInput").addEventListener("change",async()=>{
 const id=el("sessionInput").value.trim();if(!id)return;
 setUrlSession(id);joinedTeam=null;realSession=null;realEvals=[];render();await refreshPublic();await refreshAdmin(true);
});
el("createSession").addEventListener("click",async()=>{
 if(!mode)return notify("Demo only — deploy Apps Script first");
 if(!adminKey())return notify("اكتب كلمة مرور المحاضر أولًا");
 const button=el("createSession");button.disabled=true;
 try{
  const r=await call("createSession",{...identity(),title:"Winners AI for HR — Live Class",teamNames:["Team Alpha","Team Bravo","Team Charlie"]});
  setUrlSession(r.sessionId);el("teamCodes").hidden=false;
  el("teamCodes").innerHTML="<b>انسخ الأكواد الآن، لأنها مش هتظهر مرة ثانية بعد تحديث الصفحة:</b> "+
  r.teams.map(t=>'<span class="tag">'+escape(t.name)+": "+escape(t.code)+'</span>').join(" ");
  notify("Session Created — Codes ready");await refreshPublic();await refreshAdmin(true);
 }catch(e){notify("تعذر إنشاء Session: "+e.message)}
 finally{button.disabled=false}
});
el("joinTeam").addEventListener("click",async()=>{
 if(!mode)return;
 const id=el("teamSelect").value,code=el("teamCode").value.trim();
 if(!id||!code)return notify("اختار الفريق واكتب الكود");
 try{const r=await call("verifyTeamCode",{sessionId:activeSessionId,teamId:id,code});joinedTeam=r;render();notify("تم دخول "+r.name)}
 catch(e){joinedTeam=null;notify("Team code error: "+e.message)}
});
el("submitTeam").addEventListener("click",async()=>{
 const id=mode?joinedTeam?.id:el("teamSelect").value;
 if(!id)return notify("اختار الفريق وأدخل الكود أولًا");
 if(!isOpen())return notify("المرحلة مغلقة");
 const answer={problem:el("answerProblem").value.trim(),tools:el("answerTools").value.trim(),evidence:el("answerEvidence").value.trim(),prompt:el("answerPrompt").value.trim()};
 if(answer.problem.length<25)return notify("اكتب 25 حرفًا على الأقل في تشخيص المشكلة");
 const btn=el("submitTeam");btn.disabled=true;
 try{
  if(mode){
   const r=await call("submitAnswer",{sessionId:activeSessionId,teamId:id,code:el("teamCode").value.trim(),stage:currentStage(),answer});
   notify("تم تسجيل الإجابة على Sheets ✅ Revision "+r.revision);
  }else{demo.answers[id+"_"+currentStage()]=answer;save();notify("تم حفظ إجابة Demo على هذا الجهاز فقط ✅")}
 }catch(e){notify("تعذر التسليم: "+e.message)}
 finally{btn.disabled=false}
});
el("clearTeam").addEventListener("click",()=>{for(const k of ["Problem","Tools","Evidence","Prompt"])el("answer"+k).value="";notify("تم مسح الحقول")});
el("copyMasterPrompt").addEventListener("click",async()=>{
 const t=el("universalPromptText").textContent;try{await navigator.clipboard.writeText(t);notify("تم نسخ Master Prompt الأصلي")}catch{window.prompt("Master Prompt",t)}
});
async function refreshPublic(){
 if(!mode||!activeSessionId||!bridgeReady)return;
 try{const r=await call("getPublicState",{sessionId:activeSessionId});
  if(!r.sessionId)throw Error("Missing session from backend");
  const oldStage=realSession?.currentStage;realSession=r;liveError="";
  render();if(oldStage&&oldStage!==r.currentStage)updateAnswerForm()
 }catch(e){liveError="البيانات الحية غير متاحة: "+e.message;el("adminStatus").textContent=liveError}
}
function setupBridge(){
 if(!mode)return;
 if(hosted){
  if(!window.parent||window.parent===window){liveError="Apps Script direct-host required";render();return}
  bridgeTarget=window.parent;
 }else{
  const f=document.createElement("iframe");f.id="arenaBridge";f.src=appsScriptWebAppUrl+(appsScriptWebAppUrl.includes("?")?"&":"?")+"embed=1";
  f.style.cssText="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none";
  f.title="Winners Secure Apps Script Bridge";document.body.appendChild(f);bridgeTarget=f.contentWindow;
 }
 setTimeout(()=>{if(!bridgeReady){liveError="تعذر تضمين Apps Script في الصفحة الحالية. افتح الرابط المباشر لـWeb App. Browser may block third-party frames.";notify(liveError);el("connectionBadge").textContent="⚠ Apps Script iframe blocked";if(!hosted){el("loginBtn").hidden=false;el("loginBtn").textContent="فتح رابط التشغيل المباشر";}}},11000);
}
el("loginBtn").addEventListener("click",()=>{if(appsScriptWebAppUrl)window.open(appsScriptWebAppUrl,"_blank","noopener,noreferrer")});
render();updateAnswerForm();setupBridge();
if(mode)setInterval(()=>{if(!document.hidden){refreshPublic();if(demo.view==="presenter"&&isAdmin)refreshAdmin(true)}},Math.max(10,Number(pollSeconds)||12)*1000);
