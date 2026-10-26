import {DETAILED_CASES} from "./case-details.js";
import {renderCasePack} from "./case-view.js";
import {appsScriptWebAppUrl,pollSeconds} from "./apps-script-config.js";
const query=new URLSearchParams(location.search);
const hosted=query.get("bridge")==="parent"&&window.parent!==window;
const demo=query.get("demo")==="1";
if(!hosted&&!demo&&appsScriptWebAppUrl&&window.top===window.self){
 const u=new URL(appsScriptWebAppUrl);u.searchParams.set("view","form");
 if(query.get("session"))u.searchParams.set("session",query.get("session"));
 window.location.replace(u.href);
}
const PHASES=DETAILED_CASES.map(d=>({name:d.label.toUpperCase(),title:d.title,intro:d.description,facts:d.facts,task:d.task,details:d}));
const caseCss=document.createElement("link");caseCss.rel="stylesheet";caseCss.href="./case-style.css";document.head.appendChild(caseCss);
const el=id=>document.getElementById(id), show=(id,v)=>el(id).classList.toggle("hide",!v);
const origin="https://sahaarty0.github.io";
let bridgeTarget=null,ready=false,seq=0,stage=1,session=null,group=null,pending=new Map(),lastStatus="",introShown=false,requestBusy=false;
let sessionId=query.get("session")||"",sessionKey=()=> "winners_arena_teamleader_"+sessionId;
const getSaved=()=>{try{return JSON.parse(localStorage.getItem(sessionKey())||"null")}catch{return null}};
const saveLeader=v=>localStorage.setItem(sessionKey(),JSON.stringify(v));
const uuid=()=>crypto.randomUUID()+crypto.randomUUID().replace(/-/g,"");
function notify(text,isError=true){el("errorCard").textContent=text;el("errorCard").classList.remove("hide");el("errorCard").classList.toggle("bad",isError);el("errorCard").classList.toggle("ok",!isError)}
function clearNotice(){show("errorCard",false)}
function bridgeEvent(event){
 if(event.source!==bridgeTarget)return false;
 try{const host=new URL(event.origin).hostname;return host==="script.google.com"||host.endsWith(".googleusercontent.com")}catch{return false}
}
window.addEventListener("message",e=>{
 if(!bridgeEvent(e))return;
 if(e.data?.arenaBridgeReady===true){ready=true;setStatus("متصل بـWinners Backend",true);if(sessionId)refresh();return}
 if(e.data?.arena===true&&pending.has(e.data.id)){
   const t=pending.get(e.data.id);pending.delete(e.data.id);clearTimeout(t.timer);
   e.data.error?t.reject(new Error(e.data.error)):t.resolve(e.data.result);
 }
});
function rpc(action,payload={},timeout=90000){
 if(demo)return Promise.reject(new Error("Local Demo"));
 if(!ready||!bridgeTarget)return Promise.reject(new Error("Backend لسه مش متصل. افتح رابط Web App المباشر."));
 const id="leader_"+Date.now()+"_"+(++seq);
 return new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>{pending.delete(id);reject(new Error("الاستجابة اتأخرت، راجع شاشة المحاضر قبل ما تعيد التسجيل أو الإرسال."))},timeout);
   pending.set(id,{resolve,reject,timer});
   bridgeTarget.postMessage({arena:true,id,action,payload},"*");
 });
}
function setStatus(message,good=false){el("liveStatus").textContent=message;el("liveDot").classList.toggle("ok",good)}
function defaultDemo(){return {sessionId:"WDEMOSESSION",title:"Winners AI for HR · Demo",currentStage:1,open:true,publicTeams:[],publicBoard:{}}}
function getTeamDraft(st){try{return JSON.parse(localStorage.getItem(sessionKey()+"_stage_"+st)||"null")}catch{return null}}
function storeDraft(){if(!group)return;localStorage.setItem(sessionKey()+"_stage_"+stage,JSON.stringify({answer:el("answerText").value,master:el("masterPrompt").value}))}
function restoreDraft(){let p=getTeamDraft(stage)||{};el("answerText").value=p.answer||"";el("masterPrompt").value=p.master||"";el("charCount").textContent=el("answerText").value.length+" / 12000 حرف"}
function makeMember(value=""){
 const wrap=document.createElement("div");wrap.className="member-item";
 const input=document.createElement("input");input.type="text";input.maxLength=90;input.placeholder="اسم عضو الفريق";input.value=value;input.setAttribute("aria-label","اسم عضو الفريق");
 const remove=document.createElement("button");remove.type="button";remove.textContent="✕";remove.title="حذف العضو";remove.addEventListener("click",()=>wrap.remove());
 wrap.append(input,remove);el("memberFields").append(wrap);input.focus();
}
function teamMembers(){return Array.from(el("memberFields").querySelectorAll("input")).map(x=>x.value.trim()).filter(Boolean)}
function validateRoster(){
 const leader=el("leaderName").value.replace(/\s+/g," ").trim(),members=teamMembers();
 if(leader.length<3)return "اكتب اسم الـLeader بالكامل";
 if(!members.length)return "اكتب على الأقل اسم عضو واحد من اللي معاك";
 if(members.some(m=>m.length<2))return "راجع أسماء أعضاء الفريق";
 if(new Set([leader,...members].map(x=>x.toLocaleLowerCase())).size!==members.length+1)return "في أسماء متكررة في الفريق";
 return null;
}
function render(){
 if(!session){show("identityCard",true);show("challengeCard",false);return}
 if(group){
   show("identityCard",false);show("challengeCard",true);
   const c=PHASES[Math.max(0,Math.min(2,Number(session.currentStage||1)-1))],newStage=Number(session.currentStage||1);
   if(newStage!==stage){storeDraft();stage=newStage;restoreDraft();show("receiptCard",false)}
   el("stagePill").textContent="STAGE "+String(stage).padStart(2,"0")+" · "+c.name;
   el("teamFocus").textContent="🏆 "+group.groupName+" · 👑 Leader: "+group.leaderName;
   el("welcomeTitle").textContent="تحدي فريق "+group.groupName;
   el("teamRosterSummary").textContent="أعضاء الفريق: "+[group.leaderName,...group.members].join(" · ");
   el("questionTitle").textContent=c.title;el("questionIntro").textContent=c.intro;
   el("questionFacts").replaceChildren(...c.facts.map(s=>{const li=document.createElement("li");li.textContent=s;return li}));
   el("questionTask").textContent=c.task;
   let sourcePanel=document.getElementById("caseEvidence");
   if(!sourcePanel){sourcePanel=document.createElement("div");sourcePanel.id="caseEvidence";el("questionTask").closest(".question").after(sourcePanel)}
   if(sourcePanel.dataset.stage!==String(stage)){renderCasePack(sourcePanel,c.details);sourcePanel.dataset.stage=String(stage)}

   show("masterBlock",stage>1);
   el("submitBtn").disabled=!session.open||requestBusy;
   el("submitHint").textContent=session.open?"الإجابة هتتحفظ باسم الفريق كله. Gemini هيعالجها إن كان متاحًا، والنتيجة لازم يراجعها المدرب.":"الجولة الحالية مقفولة من المحاضر.";
 }else{
   show("identityCard",true);show("challengeCard",false);
 }
}
async function refresh(){
 if(!sessionId){show("sessionField",true);setStatus("اطلب رابط الجلسة من المحاضر");return}
 try{
  const updated=demo?defaultDemo():await rpc("getPublicState",{sessionId},212000);
  if(!updated?.sessionId)throw Error("Session ID غير صحيح");
  const oldStage=stage;
  session=updated;
  if(group&&oldStage!==updated.currentStage){storeDraft();stage=Number(updated.currentStage);restoreDraft();show("receiptCard",false)}
  setStatus("الجولة "+session.currentStage+" · "+(session.open?"Open":"Closed"),true);
  render();clearNotice();
 }catch(e){setStatus("مشكلة اتصال",false);notify("تعذر تحميل السؤال: "+e.message)}
}
el("addMember").addEventListener("click",()=>{if(el("memberFields").children.length>=25)return notify("الحد الأقصى 25 عضو");makeMember()});
el("answerText").addEventListener("input",()=>{el("charCount").textContent=el("answerText").value.length+" / 12000 حرف";storeDraft()});
el("masterPrompt").addEventListener("input",storeDraft);
el("registerLeader").addEventListener("click",async()=>{
 clearNotice();
 if(requestBusy)return;const warning=validateRoster();if(warning)return notify(warning);
 if(!sessionId)return notify("محتاج رابط الجلسة أو Session ID من المحاضر");
 if(!session?.open)return notify("التسجيل غير مفتوح حاليًا");
 const leaderName=el("leaderName").value.trim(),members=teamMembers();
 const existing=getSaved(),leaderToken=existing?.leaderToken||uuid();
 const btn=el("registerLeader");requestBusy=true;btn.disabled=true;btn.textContent="جاري إنشاء الجروب...";
 try{
  const value=demo?{ok:true,groupId:"T1",groupName:"Group 01",leaderName,members}:
   await rpc("registerLeaderGroup",{sessionId,leaderName,members,leaderToken,honeypot:el("companyWebsite").value});
  group={groupId:value.groupId,groupName:value.groupName,leaderName:value.leaderName||leaderName,members:value.members||members,leaderToken};
  saveLeader(group);stage=Number(session.currentStage||1);render();restoreDraft();
  notify("تم تسجيل "+group.groupName+" باسم "+leaderName+". السؤال ظهر تحت.",false);
 }catch(e){notify("تعذر إنشاء الفريق: "+e.message)}
 finally{requestBusy=false;btn.disabled=false;btn.textContent="✅ تسجيل الفريق وعرض السؤال"}
});
el("submitBtn").addEventListener("click",async()=>{
 clearNotice();if(requestBusy)return;
 if(!group)return notify("سجل الفريق الأول");
 if(!session?.open)return notify("الجولة مقفولة");
 const answer=el("answerText").value.trim(),masterPrompt=el("masterPrompt").value.trim();
 if(answer.length<30)return notify("الإجابة محتاجة على الأقل 30 حرف");
 const btn=el("submitBtn");requestBusy=true;btn.disabled=true;btn.textContent="بيتم حفظ الإجابة ومعالجتها...";
 storeDraft();
 try{
  const response=demo?{ok:true,revision:1,processing:"SAVED_FOR_MANUAL_REVIEW",groupName:group.groupName}:await rpc("submitGroupAnswer",{sessionId,teamId:group.groupId,stage,leaderToken:group.leaderToken,answer,masterPrompt});
  if(!response?.ok)throw Error("لم يؤكد السيرفر حفظ الإجابة");
  show("receiptCard",true);el("receiptCard").scrollIntoView({behavior:"smooth",block:"center"});
  const judgeNote=response.processing==="GEMINI_PENDING_TRAINER_APPROVAL"?"Gemini حلّل الإجابة مبدئيًا، وهي في انتظار مراجعة المدرب.":"الإجابة محفوظة. التقييم اليدوي متاح للمدرب لو Gemini غير متاح.";
  el("receiptText").textContent="تم حفظ إجابة "+group.groupName+" · Revision "+response.revision+". "+judgeNote;
  if(response.processingNote)notify(response.processingNote,false);
 }catch(e){notify("لم يصل تأكيد حفظ الإجابة: "+e.message+". ما تضغطش إرسال تاني قبل مراجعة المدرب.")}
 finally{requestBusy=false;btn.disabled=false;btn.textContent="🚀 تسليم إجابة الفريق للمعالجة";render()}
});
el("editBtn").addEventListener("click",()=>{show("receiptCard",false);el("answerText").focus()});
el("sessionId").addEventListener("change",()=>{sessionId=el("sessionId").value.trim();if(!sessionId)return;let saved=getSaved();group=saved||null;refresh()});
function setup(){
 if(demo&&!sessionId)sessionId="WDEMOSESSION";
 el("sessionId").value=sessionId;
 el("memberFields").replaceChildren();makeMember();el("memberFields").querySelector("input")?.blur();
 group=getSaved();if(group){el("leaderName").value=group.leaderName;for(const m of group.members||[])makeMember(m)}
 if(demo){session=defaultDemo();setStatus("Demo — الأسماء والتقييمات مش بتتحفظ على السيرفر",true);render();restoreDraft();return}
 if(hosted){bridgeTarget=window.parent}
 else if(appsScriptWebAppUrl){
  const iframe=document.createElement("iframe");iframe.src=appsScriptWebAppUrl+(appsScriptWebAppUrl.includes("?")?"&":"?")+"embed=1";
  iframe.title="Winners Apps Script Bridge";iframe.style.cssText="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none";
  document.body.appendChild(iframe);bridgeTarget=iframe.contentWindow;
 }else{setStatus("Demo not enabled / Backend URL missing");show("sessionField",true);return}
 setStatus("جاري الاتصال بالـBackend...");
 setTimeout(()=>{if(!ready)notify("الاتصال اتأخر. افتح رابط Web App المباشر أو جرّب تحديث الصفحة.")},12000);
 setInterval(()=>{if(ready&&!document.hidden)refresh()},Math.max(10,Number(pollSeconds)||12)*1000);
}
setup();
