'use strict';
/* Winners HR Maturity Assessment. Source: HR Maturity Assessment M&D (1).xlsx.
   Original scoring: checkbox Yes=1 / No=0, five questions per core, Green>=.80, Yellow>=.60.
   Unanswered questions do not receive a score. All enhancements/priority rules are illustrative. */
const STORE_KEY='winners.hr.maturity.assessment.v1';
const GUIDES={
'HR Governance & Policies': ['إعداد واعتماد سجل موحد للسياسات والصلاحيات ومصفوفة اعتماد ومراجعة دورية.','سياسات معتمدة، Delegation of Authority، وسجل الاستثناءات.'],
'Workforce Planning & Manpower':['ربط خطة القوى العاملة بالتوقعات التشغيلية والميزانية ومراجعة الفجوات دوريًا.','Annual Manpower Plan، نموذج Headcount Gap، ومتابعة التكلفة.'],
'Personnel & HR Operations':['توحيد إجراءات شؤون العاملين وتحديد SLAs ومسؤولية مراجعة الملفات والسجلات.','Personnel SOPs، قوائم فحص الملفات، ومؤشرات زمن إنجاز الخدمة.'],
'Compliance & HR Risk':['تنفيذ مراجعة قانونية موثقة وتحديث سجل المخاطر وضوابط الامتثال وفق الاختصاص القانوني.','Compliance Register، Risk Register، ومراجعة قانونية معتمدة.'],
'Talent Acquisition & Onboarding':['ضبط دورة التوظيف من Requisition إلى Onboarding مع معايير تقييم موحدة.','Recruitment SOP، Interview Scorecard، وخطة Onboarding.'],
'Performance Management':['ربط KPIs بأهداف العمل مع جلسات مراجعة وأدلة تقييم وضبط المعايرة.','KPI Library، Appraisal Calendar، وCalibration Notes.'],
'Learning & Development':['بناء TNA قائم على الفجوات الفعلية وقياس التعلم والتحسن في الأداء.','TNA Matrix، Learning Plan، وLearning Effectiveness Measures.'],
'Talent Management & Succession':['تحديد الوظائف الحرجة والبدائل ومعايير الجاهزية وخطط التطوير.','Critical Roles Register، Succession Grid، وIDPs.'],
'Compensation & Benefits':['توثيق هيكل الدرجات والرواتب والمراجعة السوقية وضوابط الاستحقاق.','Salary Bands، Pay Governance SOP، وCompensation Review.'],
'Employee Relations & Engagement':['تأسيس قنوات شكاوى ومشاركة وتحليل موضوعات الموظفين دون افتراض الأسباب.','Grievance Process، Engagement Survey، وAction Tracker.'],
'HRIS, Data & Analytics':['توحيد Data Dictionary وتحديد صلاحيات HRIS والتحقق من جودة البيانات والتقارير.','HR Data Dictionary، Access Matrix، وHR Dashboard.'],
'Business & HR Strategy Alignment':['تحويل أولويات الاستراتيجية إلى HR Objectives ومبادرات ومؤشرات أثر أعمال.','HR Strategy Map، Strategic HR KPIs، ومراجعة تنفيذ فصلية.'],
'Organization Design & Structure':['مراجعة الهيكل والصلاحيات وSpan of Control وربط التصميم بمخرجات الأعمال.','Approved Org Chart، RACI، وجداول Authority & Span.'],
'Workforce Capability':['تحديد القدرات المستقبلية وربط بناء المهارات بالأولويات التجارية.','Future Skills Matrix، Capability Gap Assessment، وUpskilling Roadmap.'],
'Leadership & Talent':['تطبيق معايير لقياس قدرات القيادة والمواهب والبدائل وتطوير القادة.','Leadership Competency Model، Talent Review، وSuccession Plan.'],
'Culture & Organizational Health':['قياس الثقافة والسلوكيات والتعاون والمساءلة ثم متابعة تدخلات قابلة للقياس.','Culture Diagnostic، Leadership Behaviors، وPulse Tracker.'],
'HR Operating Model':['توضيح الأدوار بين HRBP وCoE وOperations وخدمات الموظفين وأطر القرار.','HR Operating Model، Service Catalogue، وRACI / SLA.'],
'HR Technology & Digital Maturity':['وضع خارطة HR Technology وتحديد تكامل الأنظمة والاعتماد الرقمي والمخاطر.','HR Tech Roadmap، Integration Map، وAdoption Measures.'],
'HR Analytics & Business Impact':['اختيار مؤشرات مرتبطة بأسئلة البيزنس وإظهار أثر قرارات الموارد البشرية.','HR KPI Dictionary، Business Impact Dashboard، وROI Method.'],
'Change & Transformation Readiness':['تقييم الجاهزية وأصحاب المصلحة والمقاومة ثم تصميم خطة تبني وقياس نتائج.','Change Impact Assessment، Communication Plan، وAdoption KPIs.']
};
let BANK=null, CORES=[], STATE={answers:{},company:'',assessor:'',stage:0,scope:{mode:'full',selected:[]}}, stage=0;
const $=(id)=>document.getElementById(id);
function esc(v){return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function loadLocal(){try{const raw=localStorage.getItem(STORE_KEY);if(raw){const d=JSON.parse(raw);if(d&&typeof d==='object'){STATE.answers=d.answers&&typeof d.answers==='object'?d.answers:{};STATE.company=String(d.company||'').slice(0,120);STATE.assessor=String(d.assessor||'').slice(0,120);STATE.stage=Number.isInteger(d.stage)?d.stage:0;STATE.scope=(d.scope&&typeof d.scope==='object')?d.scope:{mode:'full',selected:[]};}}}catch(e){}}
function save(){STATE.stage=stage;try{localStorage.setItem(STORE_KEY,JSON.stringify(STATE));}catch(e){$('error').textContent='تعذر الحفظ المحلي. نزّل نسخة احتياطية للتقييم.';$('error').classList.remove('hide');}}
function allQs(){return CORES.flatMap(x=>x.core.questions);}

function normalizeScope(){
 const s=STATE.scope||{},mode=['full','functional','focused'].includes(s.mode)?s.mode:'full';
 const valid=new Set(CORES.map(c=>c.core.id));
 let selected=Array.isArray(s.selected)?[...new Set(s.selected.filter(id=>typeof id==='string'&&valid.has(id)))]:[];
 if(mode==='focused'&&!selected.length&&CORES.length)selected=[CORES[0].core.id];
 STATE.scope={mode,selected};
}
function scopeCores(){
 const mode=STATE.scope?.mode||'full';
 if(mode==='full')return CORES;
 if(mode==='functional')return CORES.filter(c=>c.track.id==='functional');
 const set=new Set(STATE.scope?.selected||[]);
 return CORES.filter(c=>set.has(c.core.id));
}
function scopeQs(){return scopeCores().flatMap(c=>c.core.questions);}
function scopeLabel(){return STATE.scope.mode==='functional'?'Functional Assessment (55)':STATE.scope.mode==='focused'?'Focused Assessment ('+scopeQs().length+')':'Full HR Maturity (100)';}
function scopeComplete(){const qs=scopeQs();return qs.length>0&&qs.every(q=>answer(q)!==null);}
function renderScopeControls(){
 const inputs=document.querySelectorAll('[name="assessmentScope"]');
 inputs.forEach(i=>{i.checked=i.value===STATE.scope.mode;});
 const container=$('focusedScopeList');
 if(!container)return;
 const visible=STATE.scope.mode==='focused';
 container.hidden=!visible;
 container.innerHTML=visible?BANK.tracks.map(t=>'<fieldset class="scope-fieldset"><legend>'+esc(t.title)+'</legend>'+t.cores.map(c=>'<label class="scope-core"><input type="checkbox" data-scope-core="'+esc(c.id)+'" '+(STATE.scope.selected.includes(c.id)?'checked':'')+'> <span>'+esc(c.name)+'</span></label>').join('')+'</fieldset>').join(''):'';
 const label=$('scopeDescription');
 if(label)label.textContent=scopeLabel()+' · '+scopeQs().length+' selected questions / 100 in source · Original scoring retained';
}

function answer(q){const a=STATE.answers[q.id];return a&&[0,1].includes(a.value)?a.value:null;}
function getCoreResult(c){let yes=0,answered=0,gaps=[];for(const q of c.core.questions){const a=answer(q);if(a!==null){answered++;yes+=a;if(a===0)gaps.push(q);}}return Object.assign({},c,{yes,answered,gaps,complete:answered===c.core.questions.length,score:answered===c.core.questions.length?yes/c.core.questions.length:null});}
function flag(s){if(s===null)return 'pending';if(s>=BANK.scoring.greenMin)return 'green';if(s>=BANK.scoring.yellowMin)return 'yellow';return 'red';}
function pct(s){return s===null?'—':Math.round(s*100)+'%';}
function trackData(id){return CORES.filter(c=>c.track.id===id).map(getCoreResult);}
function meanReady(items){return items.every(c=>c.complete)&&items.length>0?items.reduce((s,c)=>s+c.score,0)/items.length:null;}
function stageName(c){return c.core.name;}

function counters(){
 const qs=scopeQs(),done=qs.filter(x=>answer(x)!==null).length,missing=qs.filter(x=>answer(x)===0).length;
 $('progressNum').textContent=done+' / '+qs.length;
 $('progressBar').style.width=(qs.length?100*done/qs.length:0)+'%';
 $('answeredStat').textContent=done;$('gapStat').textContent=missing;
 const p=$('scopeProgress');if(p)p.textContent=done+'/'+qs.length+' selected questions';
}
function renderNav(){
 let html='';const selected=new Set(scopeCores().map(x=>x.core.id));
 BANK.tracks.forEach(t=>{
 const cores=t.cores.filter(c=>selected.has(c.id));if(!cores.length)return;
 html+='<div class="group-title">'+esc(t.title)+' · '+cores.length+' SELECTED CORES</div>';
 for(const core of cores){
 const i=CORES.findIndex(c=>c.core===core),a=getCoreResult(CORES[i]);
 html+='<button class="stage-link '+(i===stage?'active ':'')+(a.complete?'done':'')+'" data-stage="'+i+'"><span>'+String(i+1).padStart(2,'0')+' · '+esc(core.name)+'</span><small>'+a.answered+'/5</small></button>';
 }
 });$('stageNav').innerHTML=html;
}

function renderStage(){const chosen=scopeCores(),indices=chosen.map(c=>CORES.indexOf(c));if(!indices.includes(stage))stage=indices[0]??0;const pos=indices.indexOf(stage);$('stageScreen').classList.remove('hide');$('reportScreen').classList.remove('active');const p=CORES[stage],c=p.core,r=getCoreResult(p);$('stageEyebrow').textContent=p.track.title+' · '+c.sheet;$('stageTitle').textContent=c.name;$('stageDesc').textContent=c.descriptionAr||c.descriptionEn;$('stageCount').textContent=String(pos+1).padStart(2,'0')+' / '+chosen.length;$('stageAnswered').textContent=r.answered+' من 5 أسئلة مكتملة';
$('questions').innerHTML=c.questions.map((q,n)=>{const a=STATE.answers[q.id]||{},v=answer(q);return '<article class="question" data-qid="'+esc(q.id)+'"><div class="q-top"><span class="qno">Q'+(n+1)+'</span><div style="flex:1"><div class="q-ar">'+esc(q.ar)+'</div><div class="q-en" lang="en">'+esc(q.en)+'</div></div></div><div class="choices"><button type="button" class="choice yes '+(v===1?'selected':'')+'" data-choice="1" aria-pressed="'+(v===1)+'">☑ موجود ومثبت بدليل</button><button type="button" class="choice no '+(v===0?'selected':'')+'" data-choice="0" aria-pressed="'+(v===0)+'">☐ غير موجود / غير مثبت</button><button type="button" class="btn line" data-clear="1" title="حذف الإجابة" style="font-size:11px">مسح الاختيار</button></div><textarea class="note" data-note="'+esc(q.id)+'" placeholder="ملاحظات المدقق أو مرجع الدليل (اختياري)">'+esc(a.note||'')+'</textarea><div class="muted" style="margin-top:6px">المصدر: '+esc(q.origin)+'</div></article>';}).join('');
$('prevStage').disabled=pos===0;$('nextStage').textContent=pos===chosen.length-1?'عرض النتائج':'التالي';$('nextStage').disabled=false;renderNav();counters();save();}

function showReport(){
 const selected=scopeCores(),selectedIds=new Set(selected.map(c=>c.core.id));
 const res=selected.map(getCoreResult);
 const fun=res.filter(x=>x.track.id==='functional'),str=res.filter(x=>x.track.id==='strategic');
 const fs=meanReady(fun),ss=meanReady(str),overall=meanReady(res);
 $('stageScreen').classList.add('hide');$('reportScreen').classList.add('active');
 const q=scopeQs(),done=q.filter(q=>answer(q)!==null).length;
 const full=q.length>0&&done===q.length;
 $('reportStatus').textContent=(full?'SCOPE COMPLETE':'PROVISIONAL')+' · '+scopeLabel()+' · '+done+'/'+q.length+' ANSWERS';
 const cards=[
 ['Functional Audit'+(STATE.scope.mode!=='full'?' · Scoped':''),fs],
 ['Strategic Audit'+(STATE.scope.mode!=='full'?' · Scoped':''),ss],
 ['Selected-Scope Maturity Index · App Derived',overall]
 ];
 $('reportScores').innerHTML=cards.map(x=>'<div class="score-box"><b>'+pct(x[1])+'</b><span>'+esc(x[0])+'</span><div class="score-bar"><i style="width:'+((x[1]||0)*100)+'%"></i></div><small class="muted">'+(x[1]===null?'Not calculated / scope not fully answered':flag(x[1]).toUpperCase())+'</small></div>').join('');
 $('coreResults').innerHTML=CORES.map(c=>{
 const inScope=selectedIds.has(c.core.id),r=inScope?getCoreResult(c):null;
 const name=esc(c.core.name),track=esc(c.track.title),status=!inScope?'NOT ASSESSED':!r.complete?'PENDING':flag(r.score).toUpperCase();
 const color=!inScope?'pending':flag(r.score);
 return '<div class="core-item"><div style="display:flex;justify-content:space-between;gap:8px"><h4>'+name+'</h4><span class="risk '+color+'">'+status+'</span></div><small>'+track+'</small><div style="display:flex;justify-content:space-between;align-items:center;margin-top:9px"><b>'+(!inScope?'—':pct(r.score))+'</b><small>'+(!inScope?'Outside selected scope':r.answered+'/5 answered · '+r.gaps.length+' gaps')+'</small></div><div class="score-bar"><i style="width:'+((r?.score||0)*100)+'%"></i></div></div>';
 }).join('');
 const disclaimer=$('assessmentScopeNotice');
 if(disclaimer)disclaimer.textContent=STATE.scope.mode==='full'?'Full assessment selected: company-wide maturity figures remain provisional until every required answer is completed.':'Limited scope: only the selected '+selected.length+' Core(s) / '+q.length+' questions were assessed. Scores must NOT be represented as company-wide HR Maturity.';
 renderRoadmap(res);renderGaps(res);window.scrollTo({top:0,behavior:'smooth'});
}

function severity(c){if(c.complete)return c.score<.6?3:c.score<.8?2:1;return c.gaps.length>0?2:0;}
function gapCores(res){return res.filter(x=>x.gaps.length).sort((a,b)=>severity(b)-severity(a)||b.gaps.length-a.gaps.length);}
function renderRoadmap(res){const active=gapCores(res),waves=[active.slice(0,5),active.slice(5,11),active.slice(11)],labels=[['01 · FIRST 30 DAYS','تحديد المالك، التوثيق الأساسي، وتصحيح نقاط المخاطر الأعلى'],['02 · DAYS 31–60','تطبيق الضوابط ومراجعة الأدلة وقياس الأداء'],['03 · DAYS 61–90','تثبيت التحسينات ومراقبة المؤشرات وإعادة تقييم المحاور']];$('roadmap').innerHTML=labels.map((p,i)=>'<div class="phase"><b>'+p[0]+'</b><div class="muted">'+p[1]+'</div>'+(waves[i].length?'<ul>'+waves[i].map(c=>'<li><strong>'+esc(c.core.name)+'</strong>: '+esc((GUIDES[c.core.name]||['مراجعة الفجوات وإعداد خطة تنفيذ موثقة.'])[0])+'</li>').join('')+'</ul>':'<p class="muted">لا توجد فجوات إضافية مرصودة لهذه المرحلة.</p>')+'</div>').join('');}
function renderGaps(res){const arr=gapCores(res);$('gapList').innerHTML=arr.length?arr.map(c=>{const guide=GUIDES[c.core.name]||['توثيق الضوابط وتحديد المسؤوليات ثم إعادة الاختبار.','سجل متابعة وتحقيق.'];return '<div class="gap"><div style="display:flex;gap:10px;justify-content:space-between;flex-wrap:wrap"><h4>'+esc(c.core.name)+' · '+c.gaps.length+' Gap(s)</h4><span class="risk '+flag(c.score)+'">'+(c.complete?flag(c.score).toUpperCase():'PENDING')+'</span></div><p><strong>الإجراء المقترح:</strong> '+esc(guide[0])+'</p><p><strong>الأدلة المطلوبة للتوثيق:</strong> '+esc(guide[1])+'</p><ol style="padding-right:19px;font-size:12px;line-height:2">'+c.gaps.map(q=>'<li>'+esc(q.ar)+' <small>['+esc(q.origin)+']</small></li>').join('')+'</ol></div>';}).join(''):'<div class="notice">لا توجد إجابات «غير متوفر» مسجلة حتى الآن. النتائج لا تعتمد إلا بعد استكمال كل أسئلة النطاق المختار والتحقق من الأدلة.</div>';}
function download(name,text,mime){const blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function jsonBackup(){download('Winners_HR_Maturity_Assessment_Backup.json',JSON.stringify({schemaVersion:1,exportedAt:new Date().toISOString(),source:BANK.source,answers:STATE.answers,company:STATE.company,assessor:STATE.assessor,stage,scope:STATE.scope},null,2),'application/json');}
function csvCell(t){const x=String(t??'');return '"'+x.replace(/"/g,'""')+'"';}
function csvReport(){const lines=[['Assessment Scope','Source Sheet','Source Row','Core','Question EN','Question AR','Availability','Score','Audit Comment']];for(const c of scopeCores())for(const q of c.core.questions){const a=answer(q),record=STATE.answers[q.id]||{};lines.push([scopeLabel(),q.sourceSheet,q.sourceRow,c.core.name,q.en,q.ar,a===null?'Not Assessed':a===1?'☑':'☐',a===null?'':a,record.note||'']);}download('Winners_HR_Maturity_Assessment_Responses.csv','\ufeff'+lines.map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');}
function error(text){$('error').textContent=text;$('error').classList.remove('hide');}
function bind(){ $('stageNav').addEventListener('click',e=>{const b=e.target.closest('[data-stage]');if(b){stage=Number(b.dataset.stage);renderStage();}});$('questions').addEventListener('click',e=>{const b=e.target.closest('[data-choice],[data-clear]');if(!b)return;const id=b.closest('[data-qid]')?.dataset.qid;if(!id)return;const v=b.dataset.clear?null:Number(b.dataset.choice);const old=STATE.answers[id]||{};if(v===null){delete STATE.answers[id];if(old.note)STATE.answers[id]={note:old.note};}else STATE.answers[id]={...old,value:v};renderStage();});$('questions').addEventListener('input',e=>{if(e.target.matches('[data-note]')){const id=e.target.dataset.note;STATE.answers[id]=Object.assign({},STATE.answers[id]||{}, {note:e.target.value.slice(0,1200)});save();}});$('prevStage').onclick=()=>{const indices=scopeCores().map(x=>CORES.indexOf(x)),p=indices.indexOf(stage);stage=indices[Math.max(0,p-1)]??stage;renderStage();};$('nextStage').onclick=()=>{const indices=scopeCores().map(x=>CORES.indexOf(x)),p=indices.indexOf(stage);if(p>=indices.length-1){showReport();}else{stage=indices[p+1];renderStage();}};$('viewReport').onclick=showReport;$('backAudit').onclick=renderStage;$('printReport').onclick=()=>window.print();$('exportCsv').onclick=csvReport;$('exportJson').onclick=jsonBackup;$('importJson').onclick=()=>$('jsonFile').click();$('jsonFile').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text());if(d.schemaVersion!==1||typeof d.answers!=='object'||Array.isArray(d.answers))throw Error('Invalid backup');const known=new Set(allQs().map(q=>q.id));const ans={};for(const [id,v] of Object.entries(d.answers)){if(known.has(id)&&v&&typeof v==='object'){const val=[0,1].includes(v.value)?v.value:null, note=String(v.note||'').slice(0,1200);ans[id]={note};if(val!==null)ans[id].value=val;}}STATE.answers=ans;STATE.company=String(d.company||'').slice(0,120);STATE.assessor=String(d.assessor||'').slice(0,120);STATE.scope=d.scope&&typeof d.scope==='object'?d.scope:{mode:'full',selected:[]};normalizeScope();stage=Number.isInteger(d.stage)?Math.max(0,Math.min(19,d.stage)):0;renderScopeControls();$('company').value=STATE.company;$('assessor').value=STATE.assessor;renderStage();alert('تم استرجاع التقييم بنجاح.');}catch(err){alert('ملف النسخة الاحتياطية غير صالح أو غير متوافق.');}e.target.value='';});$('reset').onclick=()=>{if(confirm('حذف كل الإجابات المحفوظة على هذا الجهاز وبدء تقييم جديد؟')){STATE.answers={};STATE.company='';STATE.assessor='';stage=0;$('company').value='';$('assessor').value='';renderScopeControls();renderStage();}};for(const name of ['company','assessor'])$(name).addEventListener('input',e=>{STATE[name]=e.target.value.slice(0,120);save();});}

function bindScopeControls(){
 const wrapper=$('assessmentScopeControls');
 if(!wrapper)return;
 wrapper.addEventListener('change',e=>{
  const radio=e.target.closest('[name="assessmentScope"]'),check=e.target.closest('[data-scope-core]');
  if(radio){
   STATE.scope.mode=radio.value;normalizeScope();
  }else if(check){
   const id=check.dataset.scopeCore,ids=new Set(STATE.scope.selected);
   if(check.checked)ids.add(id);
   else ids.delete(id);
   if(!ids.size){check.checked=true;return;}
   STATE.scope.selected=[...ids];normalizeScope();
  }else return;
  const first=scopeCores()[0];if(first)stage=CORES.indexOf(first);
  renderScopeControls();renderStage();save();
 });
}
async function init(){try{const response=await fetch('questions.json',{cache:'no-cache'});if(!response.ok)throw new Error('Question bank HTTP '+response.status);BANK=await response.json();CORES=BANK.tracks.flatMap(t=>t.cores.map(core=>({track:t,core})));if(CORES.length!==20||allQs().length!==100)throw new Error('Master audit mismatch');loadLocal();normalizeScope();stage=Math.max(0,Math.min(19,STATE.stage));$('company').value=STATE.company;$('assessor').value=STATE.assessor;bind();bindScopeControls();renderScopeControls();renderStage();}catch(err){error('تعذر تحميل الـMaster Questions: '+err.message+'. افتح الأداة من GitHub Pages وليس من ملف HTML محلي.');$('stageNav').textContent='فشل التحميل';}}
init();