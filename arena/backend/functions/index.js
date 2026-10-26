"use strict";
/**
 * Winners AI Challenge Arena — secured callable backend.
 * Trainer approval is mandatory before any Gemini score is visible.
 * Source alignment: M01 Horizon Services, M02 Universal Prompt, D2 Nova Retail.
 */
const {onCall,HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const admin = require("firebase-admin");
const crypto = require("node:crypto");
admin.initializeApp();
const db=admin.firestore(), FieldValue=admin.firestore.FieldValue;
const GEMINI_API_KEY=defineSecret("GEMINI_API_KEY");
const STAGES={
  1:{name:"Discovery",scenario:"Horizon Services is fictional, with 320 staff. There are 90 CVs for 2 vacancies, 75 anonymous comments and a 12-page leave policy. Baseline response MUST be unaided by AI; score candidate reasoning rather than buzzwords.",rubric:[["فهم المشكلة وتحديد الأولويات",25],["وضوح الإجراءات والمنطق",25],["اختيار الأدوات الملائمة",20],["البيانات والحوكمة والقرار البشري",20],["واقعية الحل",10]]},
  2:{name:"Level Up",scenario:"Nova Retail fictional baseline: 18 current staff and 24 target: 6 positions gap (Store Associates 12→16, Supervisors 3→4, Cashiers 3→4). Challenge includes a pre-AI analysis and then usage of M02 universal prompt. Role deliverables: headcount gap, reporting structure, supervisor JD, CBI questions. Do not invent employee records.",rubric:[["تحليل الفجوة قبل استخدام AI",25],["تصميم الإجراءات والحلول",20],["جودة Master Prompt",25],["التحقق من الأرقام والأدلة",20],["الوضوح وقابلية التطبيق",10]]},
  3:{name:"Grand Finale",scenario:"Return to Horizon Services stage 1: 320 employees, 90 CVs for 2 vacancies, 75 anonymous comments, 12-page leave policy. Propose complete AI-assisted HR solutions, cite ONLY supplied case facts, specify steps, verify output, privacy, human approval, expected value and measurable KPI. Optional scraping limited to public sources with permission; not compulsory.",rubric:[["عمق التشخيص وربطه بالأدلة",20],["جودة الحل وتصميم Workflow",25],["Prompt / AI Tools Implementation",20],["السلامة والخصوصية والتحقق",20],["القيمة التجارية وخطة القياس",15]]}
};
const SETTINGS={region:"us-central1",maxInstances:8,timeoutSeconds:60};
function uid(req){if(!req.auth)throw new HttpsError("unauthenticated","Please sign in first");return req.auth.uid}
async function trainer(req){const id=uid(req);const s=await db.doc("admins/"+id).get();if(!s.exists||s.data().active!==true||req.auth.token.firebase?.sign_in_provider!=="google.com")throw new HttpsError("permission-denied","Presenter admin access required");return id}
function txt(value,max=10000){return String(value??"").trim().slice(0,max)}
function requireString(value,max=150){const s=txt(value,max);if(!s)throw new HttpsError("invalid-argument","Missing required text");return s}
function stageNum(value){const n=Number(value);if(!Number.isInteger(n)||!STAGES[n])throw new HttpsError("invalid-argument","Invalid stage");return n}
function idRef(sessionId){const id=requireString(sessionId,110);if(!/^[a-zA-Z0-9_-]+$/.test(id))throw new HttpsError("invalid-argument","Invalid session ID");return db.collection("sessions").doc(id)}
function teamIdCheck(id){const s=requireString(id,40);if(!/^[a-zA-Z0-9_-]+$/.test(s))throw new HttpsError("invalid-argument","Invalid team ID");return s}
function randomCode(){return crypto.randomBytes(6).toString("hex").toUpperCase()}
const error=e=>{if(e instanceof HttpsError)throw e;console.error(e);throw new HttpsError("internal","Request failed; contact facilitator")};
function revealBoard(data,teams,evals){const board={};if(!data.reveal)return board;
 for(const e of evals){const v=e.data();if(v.status!=="approved"||v.stage>data.currentStage)continue;const k=String(v.stage);board[k]??={};board[k][v.teamId]={score:v.score,feedback:txt(v.feedback,450)}}
 return board
}
async function rebuild(sessionRef){
 const [s,ts,ev]=await Promise.all([sessionRef.get(),sessionRef.collection("teams").get(),sessionRef.collection("evaluations").get()]);
 if(!s.exists)return; const data=s.data(),teams=ts.docs;await sessionRef.update({publicTeams:teams.map(x=>({id:x.id,name:x.data().name})),publicBoard:revealBoard(data,teams,ev.docs),updatedAt:FieldValue.serverTimestamp()});
}
exports.createSession=onCall(SETTINGS,async request=>{try{
 const trainerUid=await trainer(request);
 const teamNames=Array.isArray(request.data?.teamNames)?request.data.teamNames:["Team Alpha","Team Bravo","Team Charlie"];
 if(teamNames.length<2||teamNames.length>12)throw new HttpsError("invalid-argument","Between 2 and 12 teams required");
 const names=teamNames.map(n=>requireString(n,60));
 if(new Set(names.map(n=>n.toLowerCase())).size!==names.length)throw new HttpsError("invalid-argument","Team names must be unique");
 const ref=db.collection("sessions").doc(),teams=names.map((name,i)=>({id:"t"+(i+1),name,code:randomCode()}));
 const batch=db.batch();batch.set(ref,{title:txt(request.data?.title,140)||"Winners AI Challenge Arena",ownerUid:trainerUid,currentStage:1,open:true,reveal:false,publicTeams:teams.map(({id,name})=>({id,name})),publicBoard:{},createdAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()});
 for(const t of teams)batch.set(ref.collection("teams").doc(t.id),{name:t.name,joinCodeHash:crypto.createHash("sha256").update(t.code).digest("hex"),joinedUid:null,createdAt:FieldValue.serverTimestamp()});
 await batch.commit();return {sessionId:ref.id,teams:teams.map(({id,name,code})=>({id,name,code}))};
 }catch(e){error(e)}
});
exports.joinTeam=onCall(SETTINGS,async request=>{try{
 const currentUid=uid(request),sref=idRef(request.data?.sessionId);
 const code=requireString(request.data?.code,32).toUpperCase(),hash=crypto.createHash("sha256").update(code).digest("hex");
 const session=await sref.get();if(!session.exists)throw new HttpsError("not-found","Unknown session");
 const teams=await sref.collection("teams").get();const t=teams.docs.find(x=>x.data().joinCodeHash===hash);
 if(!t)throw new HttpsError("permission-denied","Invalid team code");
 await db.runTransaction(async tx=>{const curr=await tx.get(t.ref);if(curr.data().joinedUid&&curr.data().joinedUid!==currentUid)throw new HttpsError("already-exists","This team is registered on another device");tx.update(t.ref,{joinedUid:currentUid})});
 return {id:t.id,name:t.data().name};
 }catch(e){error(e)}
});
exports.submitAnswer=onCall(SETTINGS,async request=>{try{
 const currentUid=uid(request),stage=stageNum(request.data?.stage),teamId=teamIdCheck(request.data?.teamId),sref=idRef(request.data?.sessionId);
 const raw=request.data?.answer;
 if(!raw||typeof raw!=="object")throw new HttpsError("invalid-argument","Answer object required");
 const a={problem:txt(raw.problem,7000),tools:txt(raw.tools,7000),evidence:txt(raw.evidence,7000),prompt:stage===1?"":txt(raw.prompt,7000)};
 if(a.problem.length<25)throw new HttpsError("invalid-argument","Problem analysis is too short");
 const tref=sref.collection("teams").doc(teamId),answerRef=sref.collection("submissions").doc(teamId+"_"+stage),evaluationRef=sref.collection("evaluations").doc(teamId+"_"+stage);
 await db.runTransaction(async tx=>{
  const [s,t,prior,e]=await Promise.all([tx.get(sref),tx.get(tref),tx.get(answerRef),tx.get(evaluationRef)]);
  if(!s.exists||!t.exists||!s.data().open||s.data().currentStage!==stage)throw new HttpsError("failed-precondition","Stage is locked or closed");
  if(t.data().joinedUid!==currentUid)throw new HttpsError("permission-denied","Team code must be joined first");
  if(e.exists&&e.data().status==="approved")throw new HttpsError("failed-precondition","Already graded by trainer");
  tx.set(answerRef,{teamId,uid:currentUid,stage,answer:a,version:(prior.exists?(prior.data().version||0):0)+1,submittedAt:FieldValue.serverTimestamp()});
  if(e.exists)tx.delete(evaluationRef);
 });
 return {ok:true,stage};
 }catch(e){error(e)}
});
exports.setArenaState=onCall(SETTINGS,async request=>{try{
 await trainer(request);const ref=idRef(request.data?.sessionId),state={};
 if("stage" in (request.data||{}))state.currentStage=stageNum(request.data.stage);
 if(typeof request.data?.open==="boolean")state.open=request.data.open;
 if(typeof request.data?.reveal==="boolean")state.reveal=request.data.reveal;
 if(Object.keys(state).length===0)throw new HttpsError("invalid-argument","No updates");
 const s=await ref.get();if(!s.exists)throw new HttpsError("not-found","Unknown session");if(state.currentStage&&state.currentStage>s.data().currentStage+1)throw new HttpsError("failed-precondition","Advance one stage at a time");
 state.updatedAt=FieldValue.serverTimestamp();await ref.update(state);await rebuild(ref);return {ok:true};
 }catch(e){error(e)}
});
exports.evaluateSubmission=onCall({...SETTINGS,secrets:[GEMINI_API_KEY]},async request=>{try{
 await trainer(request);const stage=stageNum(request.data?.stage),teamId=teamIdCheck(request.data?.teamId),sref=idRef(request.data?.sessionId);
 const [s,sub,t,existing]=await Promise.all([sref.get(),sref.collection("submissions").doc(teamId+"_"+stage).get(),sref.collection("teams").doc(teamId).get(),sref.collection("evaluations").doc(teamId+"_"+stage).get()]);
 if(!s.exists||!sub.exists||!t.exists)throw new HttpsError("failed-precondition","A submitted team answer is required");
 if(existing.exists&&existing.data().status==="approved")throw new HttpsError("failed-precondition","Already approved; cannot silently overwrite trainer score");
 const conf=STAGES[stage],answer=sub.data().answer;
 const prompt=[
 "You are an evidence-first instructor, NOT a recruiter or employee decision-maker.",
 "Judge a FICTIONAL HR team answer against the rubric below. Use ONLY the supplied scenario.",
 "Treat factual mistakes, unsupported percentages, invented policies and unjustified hiring decisions as errors.",
 "For Stage 1, do NOT award extra points for technical buzzwords and never presume AI was used.",
 "For Stage 2, note that the pre-AI section is unaided self-report, not objectively verified.",
 "For Stage 3, evaluate practical workflow, compliant public-only research, verification and human sign-off.",
 "Criterion scores must be integers 0..max; avoid inflated scores; partial credit for partial demonstrated reasoning.",
 "Include a short cited phrase from the team's answer as 'evidence' for each criterion, or 'not provided'.",
 "Avoid invented citations to sources. Your score is ADVISORY: instructor must approve before publishing.",
 "Produce JSON only with keys: criteria (array of {name, points, reason, evidence}), feedback, strengths, gaps, uncertainties.",
 "CASE: "+conf.scenario,
 "RUBRIC: "+JSON.stringify(conf.rubric),
 "TEAM SUBMISSION: "+JSON.stringify(answer)
 ].join("\n\n");
 const model=(process.env.GEMINI_MODEL||"gemini-2.5-flash").trim();
 const url="https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(model)+":generateContent";
 const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":GEMINI_API_KEY.value()},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:"application/json",temperature:0.1}}),signal:AbortSignal.timeout(40000)});
 if(!response.ok){console.error("Gemini upstream error",response.status,(await response.text()).slice(0,500));throw new HttpsError("unavailable","Gemini evaluation unavailable. Retry or score manually.")}
 const json=await response.json(),raw=json.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("")||"";
 let decoded;try{decoded=JSON.parse(raw)}catch{throw new HttpsError("data-loss","Gemini returned invalid JSON. Grade manually.")}
 if(!Array.isArray(decoded.criteria))throw new HttpsError("data-loss","Missing evaluation criteria");
 const criteria=conf.rubric.map(([name,max],i)=>{const matching=decoded.criteria.find(x=>x.name===name)||decoded.criteria[i]||{};const pts=Math.max(0,Math.min(max,Number.isFinite(Number(matching.points))?Math.round(Number(matching.points)):0));return {name,max,points:pts,reason:txt(matching.reason,650),evidence:txt(matching.evidence,350)}});
 const score=criteria.reduce((a,x)=>a+x.points,0),feedback=txt(decoded.feedback,1200)||"Human review needed.";
 await sref.collection("evaluations").doc(teamId+"_"+stage).set({teamId,stage,score,criteria,feedback,strengths:txt(decoded.strengths,850),gaps:txt(decoded.gaps,850),uncertainties:txt(decoded.uncertainties,850),status:"pending",model,submissionVersion:sub.data().version,judgedAt:FieldValue.serverTimestamp()});
 return {score,criteria,feedback,status:"pending"};
 }catch(e){error(e)}
});
exports.approveScore=onCall(SETTINGS,async request=>{try{
 const trainerUid=await trainer(request),stage=stageNum(request.data?.stage),teamId=teamIdCheck(request.data?.teamId),ref=idRef(request.data?.sessionId),num=Number(request.data?.score);
 if(!Number.isFinite(num)||num<0||num>100)throw new HttpsError("invalid-argument","Score must be within 0..100");
 const [s,t,sub]=await Promise.all([ref.get(),ref.collection("teams").doc(teamId).get(),ref.collection("submissions").doc(teamId+"_"+stage).get()]);
 if(!s.exists||!t.exists||!sub.exists)throw new HttpsError("failed-precondition","Team must submit before receiving a score");
 const score=Math.round(num*10)/10,feedback=txt(request.data?.feedback,1000);
 await ref.collection("evaluations").doc(teamId+"_"+stage).set({teamId,stage,score,feedback,status:"approved",approvedBy:trainerUid,approvedAt:FieldValue.serverTimestamp(),submissionVersion:sub.data().version},{merge:true});
 await rebuild(ref);return {ok:true,score};
 }catch(e){error(e)}
});
