
/* Phase 2: UX modes, provisional improvements and consultant-only decision handoff.
   Mode switching is NOT authentication or an access-control mechanism.
   This site does NOT write back to Google Sheets; exports require deliberate sharing. */
(function(){
"use strict";
const MODE_KEY="winners.hr.maturity.mode.v2";
const REVIEW_KEY="winners.hr.maturity.review.v2";
const ACTIVE_ROLE={consultant:"Consultant Assessment",client:"Client Self-Assessment"};
let mode=localStorage.getItem(MODE_KEY)==="client"?"client":"consultant";
let review={};
const $p=id=>document.getElementById(id);
const escape2=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const strip=v=>String(v||"").replace(/\r/g,"").trim();
function caseKey(){
 const company=strip(typeof STATE==="undefined"?"":STATE.company),assessor=strip(typeof STATE==="undefined"?"":STATE.assessor);
 return (company||"unnamed")+"\u00b7"+(assessor||"unknown");
}
function safeLoadReview(){
 try{const all=JSON.parse(localStorage.getItem(REVIEW_KEY)||"{}");const entry=all[caseKey()];return entry&&typeof entry==="object"?entry:{};}
 catch(e){return {};}
}
function saveReview(){
 try{const all=JSON.parse(localStorage.getItem(REVIEW_KEY)||"{}");all[caseKey()]=review;localStorage.setItem(REVIEW_KEY,JSON.stringify(all));}catch(e){}
}
function progress(){
 if(typeof allQs!=="function")return{done:0,total:100,gaps:[]};
 const qs=scopeQs(),done=qs.filter(q=>answer(q)!==null).length;
 const gaps=typeof CORES==="undefined"?[]:scopeCores().map(getCoreResult).filter(x=>x.gaps.length);
 return{done,total:qs.length,gaps};
}
function suggestions(){
 if(typeof CORES==="undefined"||!CORES.length)return[];
 const a=scopeCores().map(getCoreResult).filter(x=>x.gaps.length);
 return a.sort((x,y)=>{
  const severity=x=>(x.complete?(x.score<.6?3:x.score<.8?2:1):2);
  return severity(y)-severity(x)||y.gaps.length-x.gaps.length
 });
}
function modeLabel(){
 const t=mode==="consultant"?"Consultant-led Assessment":"Client Self-Assessment";
 return{title:t,description:mode==="consultant"
 ?"حضرتك أو فريقك بيدخل البيانات ويراجع الأدلة، وبعدها بتقرر بنفسك هل الحالة جاهزة للـHR Consulting Skills."
 :"العميل يجاوب على الأسئلة في النطاق المختار، ويشوف الـDiagnostic Results والـImprovement Suggestions المبدئية، ثم يصدّر ملف التقييم لإرساله للاستشاري بطريقة آمنة."};
}
function setMode(val){
 if(!["consultant","client"].includes(val))return;
 mode=val;localStorage.setItem(MODE_KEY,mode);paintMode();paintDecision();
}
function paintMode(){
 const m=modeLabel(),title=$p("phase2-current-mode"),description=$p("phase2-current-description");
 if(title)title.textContent=m.title;
 if(description)description.textContent=m.description;
 document.querySelectorAll("[data-p2mode]").forEach(b=>{
  b.setAttribute("aria-pressed",String(b.dataset.p2mode===mode));
 });
 const pre=$p("phase2-client-intro");
 if(pre)pre.textContent=mode==="client"?"CLIENT SUBMISSION → CONSULTANT REVIEW":"CONSULTANT ASSESSMENT → EVIDENCE REVIEW";
}
function mount(){
 const hero=document.querySelector(".hero"),meta=hero?.querySelector(".meta");
 if(!hero||!meta||$p("phase2-mode"))return;
 const block=document.createElement("section");
 block.className="phase2-mode-panel";
 block.id="phase2-mode";
 block.innerHTML='<div class="p2-title">طريقة تنفيذ التقييم / Assessment Mode</div><p class="p2-subtitle">نفس الأسئلة ونفس الـScoring في الوضعين. دور العميل هو توفير الإجابات؛ والمراجعة الاستشارية والقرار النهائي عندك.</p><div class="phase2-mode-buttons"><button type="button" class="phase2-mode" data-p2mode="consultant" aria-pressed="true">👨‍💼 Consultant Assessment</button><button type="button" class="phase2-mode" data-p2mode="client" aria-pressed="false">🏢 Client Self-Assessment</button></div><p id="phase2-current-description" class="phase2-explain"></p><div class="phase2-disclaimer">الوضعين لتسهيل الاستخدام فقط، مش نظام Login أو صلاحيات. نسخة الاختبار دي بتحفظ الإجابات على نفس المتصفح ولا ترسلها تلقائيًا للشيت أو للاستشاري. العميل لازم يصدّر نسخة ويشاركها بنفسه بقناة آمنة.</div>';
 hero.insertBefore(block,meta);
 block.addEventListener("click",e=>{const b=e.target.closest("[data-p2mode]");if(b)setMode(b.dataset.p2mode);});
 const result=$p("reportScreen");
 if(!result)return;
 const section=document.createElement("section");
 section.id="phase2-report";
 section.className="panel phase2-report";
 section.innerHTML='<div class="section-head"><div><div class="eyebrow">DIAGNOSTIC OUTPUT · PRELIMINARY</div><h2>Improvement Recommendations & Consultant Gate</h2></div><span class="pill" id="phase2-client-intro"></span></div><p><strong>Important:</strong> نتائج المقياس والأسئلة مصدرها الـMaster Workbook. فرص التحسين اللي تحت استرشادية ومربوطة بالـGaps المُبلّغ عنها، لكنها <b>مش Root Cause Analysis</b> ولا Solution Design نهائي. الاستشاري وحده يقرر الانتقال للمنهجية الكاملة.</p><div class="phase2-stats" id="phase2-stats"></div><div class="phase2-choices" id="phase2-recos"></div><div id="phase2-client-section" class="phase2-gate phase2-hide"><h3>Client Handover · تسليم التقييم للاستشاري</h3><p>حمّل بيانات التقييم وأرسلها للاستشاري عن طريق قناة آمنة. لا تشارك بيانات شخصية أو مستندات سرية باستخدام رابط GitHub العام.</p><div class="p2-actions"><button class="btn gold" type="button" id="p2ClientExport">تحميل إجابات التقييم JSON</button><button class="btn line" type="button" id="p2ClientCsv">تحميل الإجابات CSV</button></div></div><div id="phase2-consultant-section" class="phase2-gate phase2-hide"><h3>Consultant Review & Decision Gate</h3><p>تأكد من البيانات، الأدلة، والسياق التجاري قبل تمرير الحالة إلى Dr. Saied HR Strategic Consulting. اختيارات المراجعة دي مش اعتماد قانوني ولا إثبات مستقل للدقة.</p><label><input id="p2EvidenceReviewed" type="checkbox"> راجعت الأدلة المتاحة وتأكدت من حدود البيانات المبلّغ عنها</label><label><input id="p2DecisionOwned" type="checkbox"> أنا مسؤول عن قرار استكمال الاستشارة واختيار التدخلات النهائية</label><div class="p2-actions"><button class="btn gold" id="p2ExportConsulting" type="button">تصدير HR Consulting Handoff</button><button class="btn line" id="p2CopyBrief" type="button">نسخ Consulting Brief</button></div><div id="p2GateMessage" class="phase2-message">التقرير مبدئي حتى استكمال كل أسئلة النطاق المختار والمراجعة. يمكن تجهيز Handoff مبدئي، لكن لا يعتبر موافقة على تنفيذ حلول.</div></div>';
 result.insertBefore(section,result.firstChild);
 section.addEventListener("change",e=>{
  if(e.target.matches("[data-p2review]")){const id=e.target.dataset.p2review;review[id]=review[id]||{};review[id].status=e.target.value;saveReview();updateGate();}
  if(e.target.matches("[data-p2note]")){const id=e.target.dataset.p2note;review[id]=review[id]||{};review[id].note=e.target.value.slice(0,500);saveReview();}
  if(e.target.id==="p2EvidenceReviewed"||e.target.id==="p2DecisionOwned"){review.gate=review.gate||{};review.gate.evidence=!!$p("p2EvidenceReviewed").checked;review.gate.ownership=!!$p("p2DecisionOwned").checked;saveReview();updateGate();}
 });
 section.addEventListener("click",e=>{
  if(e.target.closest("#p2ClientExport"))$p("exportJson")?.click();
  if(e.target.closest("#p2ClientCsv"))$p("exportCsv")?.click();
  if(e.target.closest("#p2ExportConsulting"))downloadBrief();
  if(e.target.closest("#p2CopyBrief"))copyBrief();
 });
 section.addEventListener("input",e=>{if(e.target.matches("[data-p2note]")){const id=e.target.dataset.p2note;review[id]=review[id]||{};review[id].note=e.target.value.slice(0,500);saveReview();}});
 const observer=new MutationObserver(()=>{if(result.classList.contains("active"))paintDecision();});
 observer.observe(result,{attributes:true,attributeFilter:["class"]});
 const metaFields=[$p("company"),$p("assessor")];
 metaFields.forEach(input=>input?.addEventListener("change",()=>{review=safeLoadReview();paintDecision();}));
 paintMode();
}
function paintDecision(){
 const p=progress();const rec=suggestions();const stats=$p("phase2-stats"),list=$p("phase2-recos");
 if(!stats||!list)return;
 stats.innerHTML='<div class="phase2-chip">'+p.done+' / '+p.total+' Questions Answered</div><div class="phase2-chip gold">'+rec.length+' Priority Core(s)</div><div class="phase2-chip">'+rec.reduce((n,x)=>n+x.gaps.length,0)+' Source-linked Gaps</div>';
 list.innerHTML=rec.length?rec.map((c,i)=>{
  const guide=GUIDES[c.core.name]||["تحسين الإجراءات والضوابط بعد مراجعة الأدلة.","سجل إجراءات ومؤشرات متابعة."];
  const id=c.core.id,rr=review[id]||{};
  const status=rr.status||"needs-review";
  return '<article class="phase2-item"><div class="phase2-item-head"><div class="phase2-item-title">'+(i+1)+'. '+escape2(c.core.name)+' · '+(c.complete?Math.round(c.score*100)+"%":"Pending")+'</div><small>'+c.gaps.length+' gap(s) / '+escape2(c.track.title)+'</small></div><p><strong>Improvement Opportunity:</strong> '+escape2(guide[0])+'</p><p><strong>Suggested Evidence/Deliverable:</strong> '+escape2(guide[1])+'</p><p><strong>Traceable Findings:</strong> '+c.gaps.map(q=>escape2(q.id)).join(", ")+'</p><div class="'+(mode==="consultant"?"":"phase2-hide")+'"><label class="muted">قرار المراجعة: <select data-p2review="'+escape2(id)+'"><option value="needs-review" '+(status==="needs-review"?"selected":"")+'>Needs Evidence Review</option><option value="accepted" '+(status==="accepted"?"selected":"")+'>Accepted for Further Diagnosis</option><option value="deferred" '+(status==="deferred"?"selected":"")+'>Deferred</option><option value="not-applicable" '+(status==="not-applicable"?"selected":"")+'>Not Applicable After Review</option></select></label><textarea data-p2note="'+escape2(id)+'" placeholder="Consultant comments / Evidence required">'+escape2(rr.note||"")+'</textarea></div></article>';
 }).join(""):'<p class="phase2-message">لسه مفيش Gaps بإجابات «غير موجود». التقييم غير المكتمل مش معناه إن كل الـControls متوفرة.</p>';
 $p("phase2-client-section")?.classList.toggle("phase2-hide",mode!=="client");
 $p("phase2-consultant-section")?.classList.toggle("phase2-hide",mode!=="consultant");
 const gate=review.gate||{};
 if($p("p2EvidenceReviewed"))$p("p2EvidenceReviewed").checked=!!gate.evidence;
 if($p("p2DecisionOwned"))$p("p2DecisionOwned").checked=!!gate.ownership;
 updateGate();paintMode();
}
function updateGate(){
 const msg=$p("p2GateMessage");if(!msg)return;
 const p=progress(),rec=suggestions(),statuses=rec.map(x=>review[x.core.id]?.status||"needs-review");
 const accepted=statuses.filter(x=>x==="accepted").length,unreviewed=statuses.filter(x=>x==="needs-review").length;
 if(p.total===0||p.done!==p.total){msg.textContent="التقييم غير مكتمل ("+p.done+"/"+p.total+" من النطاق المختار). Handoff مبدئي فقط؛ استكمال باقي إجابات النطاق مطلوب قبل أي قرار استشاري.";}
 else if(!(review.gate?.evidence&&review.gate?.ownership)){msg.textContent=scopeLabel()+" · "+p.done+"/"+p.total+" مكتملة ضمن النطاق. مراجعة الأدلة والمسؤولية عن القرار لم يتم تأكيدهما، والنتيجة ليست تقييمًا شاملًا خارج النطاق.";}
 else{msg.textContent="Ready for Consultant-Led Diagnosis: "+accepted+" فرص تحسين مقبولة لمزيد من الفحص، "+unreviewed+" قيد المراجعة. ده لا يغني عن PESTLE / 7S / RCA ولا يمثل اعتماد الحلول.";}
}
function buildBrief(){
 const p=progress(),coreData=typeof CORES==="undefined"?[]:scopeCores().map(getCoreResult);
 const f=coreData.filter(x=>x.track.id==="functional"),s=coreData.filter(x=>x.track.id==="strategic");
 const avg=x=>x.length&&x.every(c=>c.complete)?Math.round(x.reduce((a,b)=>a+b.score,0)/x.length*100)+"%":"Incomplete";
 const lines=[
"DR. KOLIVERA — HR MATURITY ASSESSMENT · CONSULTING HANDOFF",
"Created by Dr. Saied El Saharty | Source: HR Maturity Assessment M&D (1).xlsx",
"Company: "+(STATE.company||"Not specified"),"Assessor: "+(STATE.assessor||"Not specified"),
"Assessment mode: "+ACTIVE_ROLE[mode],"Assessment scope: "+scopeLabel(),"Selected Core Areas: "+scopeCores().map(c=>c.core.name).join("; "),"Coverage: "+p.done+"/"+p.total+" within selected scope",
"Functional Maturity: "+avg(f),"Strategic Maturity: "+avg(s),
"Status: "+(p.total>0&&p.done===p.total?"Complete within selected scope; evidence still needs independent review":"PRELIMINARY – selected scope incomplete"),
"",
"SCOPING WARNING: Answers are respondent-reported. Scores cover ONLY the selected scope, not all HR functions. Unselected cores are NOT ASSESSED. Scores do not prove root causes. Suggested improvements are hypotheses for further validation.",
"",
"IMPROVEMENT OPPORTUNITIES — REVIEWED BY CONSULTANT IF AVAILABLE:"
 ];
 for(const c of suggestions()){
  const guide=GUIDES[c.core.name]||["Further diagnosis needed.","Evidence required"];
  const rr=review[c.core.id]||{};
  lines.push("",c.core.name+" — "+(c.complete?Math.round(c.score*100)+"%":"Incomplete")+" | "+c.gaps.length+" gaps",
  "Review decision: "+(rr.status||"Needs evidence review"),
  "Suggested improvement: "+guide[0],
  "Suggested deliverable/evidence: "+guide[1],
  "Consultant note: "+(rr.note||"Not supplied"));
  for(const q of c.gaps)lines.push("- ["+q.origin+"] "+q.en+" | "+q.ar+" | Auditor note: "+(STATE.answers[q.id]?.note||"Not provided"));
 }
 lines.push("","NEXT STAGE — EXECUTE ONLY AFTER CONSULTANT DECISION:",
 "1. Executive Diagnostic Snapshot: Company context, business objectives, impact, evidence and missing inputs.",
 "2. PESTLE: Validate external Opportunities and Threats with sources.",
 "3. McKinsey 7S: Assess internal Strengths and Weaknesses; verify source evidence.",
 "4. SWOT: S/W only from 7S; O/T only from PESTLE.",
 "5. RCA: Fishbone and 5 Whys; do not infer causes from low maturity scores alone.",
 "6. HR Module Selection: Primary / Supporting / Deferred based on validated cause and business value.",
 "7. TWO HR Models only: one Primary, one Supporting from approved toolkit; justify both.",
 "8. Strategic Solution Tracks: Distinguish Strategic / Administrative / Legal-Compliance actions.",
 "9. BSC or HR KPIs Dashboard: المهمة | الهدف | المراد تحقيقه | المتوقع | مؤشر القياس | الوزن النسبي.",
 "10. 30/60/90 Roadmap: owners, evidence, baseline, checkpoints, dependencies.",
 "",
 "Decision owner: Dr. Saied / Authorized HR Consultant. No final solutions, budgets, targets, legal opinions or approvals are generated by this assessment.",
 "Required remaining context: business model/targets, external factors, org chart, HR process evidence, HRIS metrics, policy versions, stakeholder interviews, legal jurisdiction.",
 "",
 "COPY-READY CONSULTING PROMPT:",
 "Use the Dr. Saied HR Strategic Consulting Skill / Dr. Saied Consulting OS. Treat the attached HR Maturity Assessment as a respondent-reported diagnostic input. Do not fabricate PESTLE or 7S. Build an Executive Diagnostic Snapshot and evidence request first; execute the approved chain only when source evidence supports the next stage. Select exactly two HR models for full consulting, never from maturity scores alone. I retain decision rights over priority, diagnosis and final solutions."
 );
 return lines.join("\n");
}
function downloadBrief(){
 const text=buildBrief();
 const blob=new Blob([text],{type:"text/plain;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="Dr_Kolivera_HR_Consulting_Handoff.txt";document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1200);
}
async function copyBrief(){
 const txt=buildBrief();
 try{await navigator.clipboard.writeText(txt);alert("Consulting Brief اتنسخ. ابدأ جلسة مع Dr. Saied HR Strategic Consulting Skill وأرفق ملف بيانات التقييم.");}
 catch(e){downloadBrief();alert("تعذر النسخ للحافظة، فنزّلت ملف Handoff بدلًا منه.");}
}
document.addEventListener("DOMContentLoaded",()=>{review=safeLoadReview();mount();});
})();
