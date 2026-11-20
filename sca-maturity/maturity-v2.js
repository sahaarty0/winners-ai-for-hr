"use strict";
(function(){
  const STORE="winners.sca.maturity.evidence.v2";
  const AXES=[
    {id:"A01",title:"استراتيجية الموارد البشرية",checks:"هل توجد استراتيجية HR مرتبطة بأهداف الجهة، وخطة تنفيذ ومؤشرات ومراجعات متابعة؟",examples:"استراتيجية معتمدة، HR Plan، تقارير متابعة وأهداف",from:"S01"},
    {id:"A02",title:"الهيكل التنظيمي والحوكمة",checks:"هل الهيكل والأدوار والتبعيات وRACI وDoA واضحة، معتمدة، وسارية ومطبقة؟",examples:"الهيكل الحالي، قرارات الاعتماد، RACI، DoA، محاضر اللجان",from:"F01 / S02 / S06"},
    {id:"A03",title:"الأهداف ومؤشرات الأداء",checks:"هل ترتبط أهداف الإدارات بنتائج الأعمال؟ وهل للمؤشرات تعريف ومصدر ومستهدف ومراجعات موثقة؟",examples:"KPI Cards، أهداف الإدارات، تقارير الأداء وسجلات المراجعة",from:"F06 / S01 / S08"},
    {id:"A04",title:"تخطيط القوى العاملة",checks:"هل خطة القوى العاملة سارية ومبنية على حجم العمل والفجوات والميزانية والاحتياجات التشغيلية؟",examples:"خطة القوى العاملة، بيانات الملاك، تحليل أعباء العمل، طلبات التعيين",from:"F02 / S03"},
    {id:"A05",title:"الوصف والتقييم الوظيفي",checks:"هل بطاقات وصف وتقييم الوظائف معتمدة وحديثة ومطابقة للمهام والمستويات الفعلية؟",examples:"دليل الوظائف، بطاقات الوصف، سجل الإصدارات والتحديثات",from:"S02 / F03"},
    {id:"A06",title:"إطار الجدارات الوظيفية",checks:"هل الجدارات الفنية والسلوكية والقيادية ومستويات إتقانها محددة، وتستخدم في التقييم والتطوير؟",examples:"Competency Framework، Skills Matrix، معايير مستويات الإتقان",from:"S03 / F07 / F08"},
    {id:"A07",title:"إدارة الأداء الوظيفي",checks:"هل توجد دورة أداء تشمل الأهداف والتقييم والتغذية الراجعة والمراجعة والتحسين؟",examples:"نماذج تقييم معتمدة، ملفات أداء، تغذية راجعة وتقارير متابعة",from:"F06"},
    {id:"A08",title:"الأجور والمزايا والحوافز",checks:"هل قواعد التعويضات والاستحقاقات والاستثناءات واضحة ومطبقة ومراقبة، وقراراتها معتمدة؟",examples:"سياسات البدلات والأجور، عينات المعاملات، تفويضات الصرف",from:"F09"},
    {id:"A09",title:"السياسات والإجراءات",checks:"هل السياسات وSOPs سارية ومعتمدة، وهل تثبت عينات المعاملات اتساق تطبيقها؟",examples:"سياسات وإجراءات معتمدة، سجل الإصدارات، عينات التطبيق",from:"F01 / F04 / F05"},
    {id:"A10",title:"بيانات الموارد البشرية والتقارير",checks:"هل تعريفات ومصادر البيانات متسقة وتجرى مطابقة وتصدر تقارير موثوقة لدعم القرارات؟",examples:"HR Data Dictionary، سجل مصادر البيانات، المطابقات، التقارير",from:"F11 / S08"}
  ];
  const LEVELS=[
    ["0","عدم وجود الممارسة مثبت بالفحص","لا يُستخدم عند غياب مستند فقط"],
    ["1","ممارسة فردية أو ارتجالية","أمثلة متناثرة بلا توحيد أو مسؤوليات معتمدة"],
    ["2","ممارسة متكررة غير متسقة","تنفيذ جزئي أو تفاوت بين الوحدات"],
    ["3","ممارسة موثقة ومعتمدة ومطبقة","إجراء أو سياسة سارية مع عينة تطبيق موثقة"],
    ["4","ممارسة مُدارة ومقاسة","مؤشرات دورية ومراجعات وتصحيح مثبت"],
    ["5","ممارسة تتحسن باستمرار","اتجاه نتائج وتحسينات موثقة وأثر متحقق"]
  ];
  const CASE=[
    ["E01","التوجهات الاستراتيجية","أولويات عامة للخدمات البحرية والسلامة وتطوير القدرات؛ لا تتضمن الحزمة استراتيجية HR أو خطة تنفيذ تفصيلية."],
    ["E02","الهيكل والصلاحيات","نسخة هيكل من 2023، ومسميات أحدث مختلفة؛ سريان لائحة الصلاحيات وتعديلات الهيكل غير متحقق."],
    ["E03","أهداف الإدارات ومؤشرات الأداء","تقارير لخمس إدارات بأساليب مختلفة دون بطاقات موحدة معتمدة لجميع المؤشرات."],
    ["E04","تخطيط القوى العاملة","خطة تاريخية تشمل 450 وظيفة وطلبات لشغل 35 وظيفة؛ لم تُرفق خطة سارية معتمدة."],
    ["E05","الوصف الوظيفي","عينة من 22 بطاقة وصف؛ لا يتوافر سجل مركزي لإصدارات البطاقات في الحزمة."],
    ["E06","الجدارات الفنية","قوائم مهارات متفرقة دون مستويات إتقان موحدة أو مصفوفة جدارات مرتبطة بالوظائف."],
    ["E07","إدارة الأداء","عينة من 20 ملفًا ونموذج تقييم سنوي؛ أدلة الربط بخطط التطوير غير كافية."],
    ["E08","الأجور والمزايا","سياسة عامة و12 معاملة بدلات؛ مستندات اعتماد غير مكتملة في معاملتين؛ مراجعات الاستثناءات غير مرفقة."],
    ["E09","سجلات العاملين","شؤون العاملين 482، والأجور 476، وخطة القوى العاملة التاريخية 450؛ فترات القطع والنطاق والتعريفات غير مثبتة."],
    ["E10","السياسات والإجراءات","أدلة للإجازات والتوظيف والتدريب والملفات بإصدارات مختلفة؛ قائمة الإصدارات السارية غير متوافرة."],
    ["E11","التدريب والتطوير","24 نشاطًا؛ تتوافر مستندات احتياج في 18 ملفًا، ولا تظهر في 6؛ أدلة قياس الأثر غير كافية."],
    ["E12","مقابلات المسؤولين","إفادات بشأن السياسات والموافقات والتدريب والمهارات؛ لا تثبت درجة النضج دون تحقق مستندي."]
  ];
  const $=id=>document.getElementById(id);
  const esc=v=>String(v===undefined||v===null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const newState=()=>({version:2,mode:"consultant",organization:"",assessor:"",scope:"",current:0,items:{},modified:null});
  let state=newState();
  let view="assessment";
  function get(i){
    const id=AXES[i].id;
    if(!state.items[id]||typeof state.items[id]!=="object")state.items[id]={score:"",evidence:"",reason:"",confidence:"",missing:"",gap:"",cause:"",action:"",priority:"",wave:"",owner:"",zeroConfirmed:false};
    return state.items[id];
  }
  function complete(a){return /^[0-5]$/.test(String(a.score))&&String(a.evidence||"").trim().length>0&&String(a.reason||"").trim().length>0;}
  function totals(){
    const accepted=[];let draft=0;
    AXES.forEach((axis,i)=>{const a=get(i);if(complete(a))accepted.push({axis,a,score:Number(a.score)});else if(a.score!==""||a.evidence||a.reason)draft++;});
    const n=accepted.length;return {accepted,n,draft,mean:n?accepted.reduce((s,x)=>s+x.score,0)/n:null,coverage:n*10,unrated:10-n};
  }
  function store(){
    state.modified=new Date().toISOString();
    try{localStorage.setItem(STORE,JSON.stringify(state));$("saveState").textContent="محفوظ على هذا الجهاز";}catch(e){$("saveState").textContent="تعذر الحفظ: صدّر نسخة JSON";}
  }
  function restore(){
    try{const p=JSON.parse(localStorage.getItem(STORE)||"null");if(p&&p.version===2&&p.items&&typeof p.items==="object"){state=Object.assign(newState(),p);state.current=Math.max(0,Math.min(9,Number(state.current)||0));}}
    catch(e){$("statusMessage").textContent="تعذر استعادة البيانات السابقة؛ يرجى استخدام ملف JSON احتياطي إن وجد.";}
  }
  function field(label,key,value,placeholder,rows){
    const attrs=' data-field="'+key+'" placeholder="'+esc(placeholder||"")+'"';
    const control=rows?'<textarea rows="'+rows+'"'+attrs+'>'+esc(value)+'</textarea>':'<input type="text"'+attrs+' value="'+esc(value)+'">';
    return '<label class="field"><span>'+label+'</span>'+control+'</label>';
  }
  function selectField(label,key,value,options){
    return '<label class="field"><span>'+label+'</span><select data-field="'+key+'">'+options.map(pair=>'<option value="'+esc(pair[0])+'"'+(String(value)===String(pair[0])?' selected':'')+'>'+esc(pair[1])+'</option>').join("")+'</select></label>';
  }
  function refresh(){
    const t=totals();
    $("metricCount").textContent=t.n+" / 10";
    $("metricMean").textContent=t.mean===null?"—":t.mean.toFixed(2)+" / 5";
    $("metricCoverage").textContent=t.coverage+"%";
    $("metricPending").textContent=t.draft+" مسودة";
    $("progressFill").style.width=t.coverage+"%";
  }
  function nav(){
    $("axisNav").innerHTML=AXES.map((x,i)=>{
      const a=get(i),status=complete(a)?a.score+"/5":(a.score!==""?"غير مكتمل":"غير مقيم");
      return '<button type="button" data-axis="'+i+'" class="axis-nav'+(i===state.current?' active':'')+'"><span class="num">'+(i+1)+'</span><span>'+esc(x.title)+'</span><small>'+esc(status)+'</small></button>';
    }).join("");
  }
  function renderCase(){
    const active=state.mode==="training";
    $("casePanel").hidden=!active;
    if(active)$("caseEvidence").innerHTML=CASE.map(x=>'<details><summary><b>'+x[0]+'</b> | '+esc(x[1])+'</summary><p>'+esc(x[2])+'</p></details>').join("");
  }
  function renderAxis(){
    const i=state.current,x=AXES[i],a=get(i);
    $("axisTitle").textContent=(i+1)+" / 10 — "+x.title;
    $("axisQuestions").textContent=x.checks;
    $("axisEvidenceHint").textContent=x.examples;
    const scoreOpts=[["","غير مقيم — الأدلة غير كافية"]].concat(LEVELS.map(l=>[l[0],l[0]+" — "+l[1]]));
    $("axisFields").innerHTML=
      '<div class="simple-assessment">'+
      selectField("1. درجة النضج (0–5)","score",a.score,scoreOpts)+
      '<details class="scale-toggle"><summary>شرح مستويات النضج 0–5 (اختياري)</summary><div class="scale">'+LEVELS.map(l=>'<div><strong>'+l[0]+' — '+esc(l[1])+'</strong><small>'+esc(l[2])+'</small></div>').join("")+'</div></details>'+
      field("2. مرجع الدليل أو رقم المستند","evidence",a.evidence,"مثال: E02 أو رقم/إصدار المستند",2)+
      field("3. مبرر اختيار الدرجة","reason",a.reason,"اشرح السبب في جملة أو جملتين",3)+
      '<p class="hint">لا تُحتسب أي درجة دون دليل ومبرر. إذا كانت الأدلة غير كافية اختر «غير مقيم»، فالدرجة صفر لا تعني غياب المستند بل غياب الممارسة المثبت بالفحص. تحليل الفجوات وخطة التحسين في صفحة النتائج.</p>'+
      '</div>';
    $("axisStatus").textContent=complete(a)?"مُقيّم — الدرجة "+a.score+"/5":a.score===""?"غير مقيم":"الدرجة لا تُحتسب قبل إضافة الدليل والمبرر";
    $("axisStatus").className="status-chip "+(complete(a)?"complete":"pending");
    $("backAxis").disabled=i===0;$("nextAxis").disabled=false;$("nextAxis").textContent=i===9?"عرض النتائج":"التالي";
  }
  function renderFormMeta(){
    $("workMode").value=state.mode;
    $("organization").value=state.organization||"";
    $("assessor").value=state.assessor||"";
    $("scopeName").value=state.scope||"";
  }
  function show(which){
    view=which;
    $("assessmentView").hidden=which!=="assessment";
    $("reportView").hidden=which!=="report";
    $("assessmentButton").classList.toggle("selected",which==="assessment");
    $("reportButton").classList.toggle("selected",which==="report");
    if(which==="report")renderReport();
    window.scrollTo({top:0,behavior:"auto"});
  }
  function renderAll(){renderFormMeta();renderCase();refresh();nav();renderAxis();if(view==="report")renderReport();}
  function csvSafe(value){
    let x=String(value===undefined||value===null?"":value).replace(/\r?\n/g," ");
    if(/^[\s]*[=+\-@]/.test(x))x="'"+x;
    return '"'+x.replace(/"/g,'""')+'"';
  }
  function download(filename,body,type){const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),600);}
  function exportJson(){download("SCA_Maturity_Assessment_v2.json",JSON.stringify({schema:"winners-sca-maturity-v2",exportedAt:new Date().toISOString(),state},null,2),"application/json;charset=utf-8");}
  function exportCsv(){
    const columns=["ID","المحور","الدرجة","حالة التقييم","الثقة","مرجع الدليل","المبرر","أدلة ناقصة","الفجوة","سبب افتراضي","الإجراء","الأولوية","المرحلة","المالك"];
    const rows=AXES.map((x,i)=>{const a=get(i);return [x.id,x.title,a.score,complete(a)?"مقيّم":"غير مقيم",a.confidence,a.evidence,a.reason,a.missing,a.gap,a.cause,a.action,a.priority,a.wave,a.owner];});
    download("SCA_Maturity_Assessment_v2.csv","\uFEFF"+[columns,...rows].map(r=>r.map(csvSafe).join(",")).join("\r\n"),"text/csv;charset=utf-8");
  }
  function importJson(file){
    const reader=new FileReader();
    reader.onload=()=>{try{
      const parsed=JSON.parse(String(reader.result||"")),s=parsed.state;
      if(parsed.schema!=="winners-sca-maturity-v2"||!s||s.version!==2||!s.items||typeof s.items!=="object")throw new Error("ملف غير متوافق مع الإصدار الجديد");
      const sanitized=newState();
      ["mode","organization","assessor","scope","current"].forEach(k=>{if(s[k]!==undefined)sanitized[k]=s[k]});
      sanitized.mode=["consultant","training"].includes(sanitized.mode)?sanitized.mode:"consultant";
      sanitized.current=Math.max(0,Math.min(9,Number(sanitized.current)||0));
      AXES.forEach(a=>{const old=s.items[a.id];if(old&&typeof old==="object"){const next={};["score","evidence","reason","confidence","missing","gap","cause","action","priority","wave","owner"].forEach(k=>{next[k]=String(old[k]===undefined?"":old[k]).slice(0,3000)});next.zeroConfirmed=old.zeroConfirmed===true;sanitized.items[a.id]=next;}});
      state=sanitized;store();renderAll();show("assessment");$("statusMessage").textContent="تم استيراد ملف الإصدار الثاني بنجاح.";
    }catch(e){$("statusMessage").textContent="لم يُستورد الملف: "+e.message;}};reader.readAsText(file);
  }
  function renderAdvisoryEditor(){
    const container=$("reportAdviceEditor");
    if(!container)return;
    container.innerHTML=AXES.map((axis,i)=>{
      const a=get(i),status=complete(a)?a.score+"/5":"غير مقيم";
      function advisoryField(name,key,value,placeholder,rows){
        return field(name,key,value,placeholder,rows).replace('data-field="'+key+'"','data-advisory="'+key+'" data-index="'+i+'"');
      }
      function advisorySelect(name,key,value,opts){
        return selectField(name,key,value,opts).replace('data-field="'+key+'"','data-advisory="'+key+'" data-index="'+i+'"');
      }
      return '<details class="advisory-item"><summary><strong>'+(i+1)+'. '+esc(axis.title)+'</strong><span>'+esc(status)+' · فتح التحليل والتوصيات</span></summary>'+
        '<div class="advisory-fields">'+
          advisoryField("الأدلة الناقصة / ما يحتاج تحققًا","missing",a.missing,"اذكر ما يجب التحقق منه قبل إصدار حكم",2)+
          advisoryField("الفجوة المثبتة أو الملاحظة","gap",a.gap,"ما الذي يثبته الدليل، وما الذي لا يثبته؟",2)+
          advisoryField("السبب الجذري المحتمل (فرضية)","cause",a.cause,"فرضية تحتاج للتحقق",2)+
          advisoryField("المبادرة أو الإجراء المقترح","action",a.action,"إجراء عملي ومخرج قابل للقياس",2)+
          advisorySelect("الأولوية","priority",a.priority,[["","غير محددة"],["high","مرتفعة"],["medium","متوسطة"],["low","منخفضة"]])+
          advisorySelect("مرحلة التنفيذ","wave",a.wave,[["","غير محددة"],["30","الأيام 1–30"],["60","الأيام 31–60"],["90","الأيام 61–90"]])+
          advisoryField("مالك التنفيذ المقترح","owner",a.owner,"يُحسم وفق RACI / DoA",0)+
          advisorySelect("درجة الثقة في التقييم","confidence",a.confidence,[["","غير محددة"],["high","مرتفعة"],["medium","متوسطة"],["low","منخفضة"]])+
        '</div><p class="hint">هذه توصيات مدخلَة من المقيّم وليست قرارات معتمدة أو نتائج مؤكدة تلقائيًا.</p></details>';
    }).join("");
  }
  function refreshAdvisoryOutputs(){
    const gaps=AXES.map((x,i)=>({x,a:get(i)})).filter(r=>r.a.gap||r.a.missing);
    $("reportGaps").innerHTML=gaps.length?gaps.map(r=>'<article><strong>'+esc(r.x.title)+'</strong><p><b>ملاحظة / فجوة:</b> '+esc(r.a.gap||"غير محددة")+'</p><p><b>تحتاج تحققًا:</b> '+esc(r.a.missing||"غير محدد")+'</p><p><b>سبب محتمل:</b> '+esc(r.a.cause||"غير محدد")+'</p></article>').join(""):'<p class="hint">لم تسجل فجوات بعد. افتح نموذج التحليل بأعلى الصفحة لإضافتها.</p>';
    const proposals=AXES.map((x,i)=>({x,a:get(i)})).filter(r=>r.a.action);
    const priorityLabel={high:"مرتفعة",medium:"متوسطة",low:"منخفضة"};
    $("reportTable").innerHTML=AXES.map((x,i)=>{const a=get(i);return '<tr><td>'+esc(x.title)+'</td><td>'+(complete(a)?esc(a.score)+"/5":"غير مقيم")+'</td><td>'+esc(a.evidence||"—")+'</td><td>'+esc(a.reason||"—")+'</td><td>'+esc(a.confidence||"—")+'</td></tr>';}).join("");
    $("reportPlan").innerHTML=proposals.length?proposals.map(r=>'<tr><td>'+esc(r.x.title)+'</td><td>'+esc(r.a.action)+'</td><td>'+esc(priorityLabel[r.a.priority]||"غير محددة")+'</td><td>'+esc(r.a.wave?r.a.wave+" يوم":"غير محددة")+'</td><td>'+esc(r.a.owner||"لم يحدد")+'</td></tr>').join(""):'<tr><td colspan="5">لا توجد مبادرات مسجلة. أدخلها في نموذج التحليل أعلى الصفحة.</td></tr>';
  }
  function renderReport(){
    const t=totals();
    $("reportMean").textContent=t.mean===null?"غير متاح":t.mean.toFixed(2)+" / 5";
    $("reportCoverage").textContent=t.coverage+"% ("+t.n+" من 10)";
    $("reportDraft").textContent=String(t.draft);
    $("reportOrg").textContent=state.organization||"لم يحدد";
    $("reportScope").textContent=state.scope||"العشرة محاور";
    $("reportDate").textContent=new Date().toLocaleDateString("ar-EG");
    $("reportDisclaimer").textContent=t.n<10?"تقييم جزئي: لا يعكس متوسط المحاور المُقيمة درجة نضج المنظومة بالكامل، والدرجة مشروطة بكفاية الأدلة والتثبت منها.":"متوسط استرشادي قائم على إدخالات المقيّم؛ لا يُعد تدقيقًا مؤسسيًا أو إثباتًا قانونيًا دون تحقق مستقل.";
    $("reportBars").innerHTML=AXES.map((x,i)=>{const a=get(i),ready=complete(a),v=ready?Number(a.score):0;return '<div class="barrow"><strong>'+esc(x.title)+'</strong><div class="bar-track"><span style="width:'+(v*20)+'%"></span></div><em>'+ (ready?esc(a.score)+"/5":"غير مقيم")+'</em></div>';}).join("");
    $("reportTable").innerHTML=AXES.map((x,i)=>{const a=get(i);return '<tr><td>'+esc(x.title)+'</td><td>'+(complete(a)?esc(a.score)+"/5":"غير مقيم")+'</td><td>'+esc(a.evidence||"—")+'</td><td>'+esc(a.reason||"—")+'</td><td>'+esc(a.confidence||"—")+'</td></tr>';}).join("");
    renderAdvisoryEditor();
    refreshAdvisoryOutputs();
    $("reportExecutive").textContent=t.mean===null?"لا توجد محاور مؤهلة للتقييم حتى الآن. ابدأ بتوثيق مرجع دليل ومبرر لكل درجة.":"تم تقييم "+t.n+" من 10 محاور، بمتوسط استرشادي "+t.mean.toFixed(2)+" من 5 وتغطية "+t.coverage+"%. عدد المحاور غير المقيمة "+t.unrated+". يجب استكمال مراجعة الأدلة، والتحقق من أسباب الفجوات والصلاحيات، قبل اعتماد التوصيات أو ترتيب التنفيذ.";
  }
  function hook(){
    $("axisNav").addEventListener("click",e=>{const b=e.target.closest("[data-axis]");if(b){state.current=Number(b.dataset.axis);store();nav();renderAxis();}});
    $("axisFields").addEventListener("input",e=>{
      const field=e.target.dataset.field;if(!field)return;
      const a=get(state.current);a[field]=e.target.value;
      store();refresh();nav();$("axisStatus").textContent=complete(a)?"مُقيّم — الدرجة "+a.score+"/5":"غير مقيم أو ينقصه مبرر / دليل";
      $("axisStatus").className="status-chip "+(complete(a)?"complete":"pending");
    });
    $("axisFields").addEventListener("change",e=>{
      const field=e.target.dataset.field;if(!field)return;
      const a=get(state.current);a[field]=e.target.value;
      if(field==="score") {store();renderAxis();}
      else {store();refresh();nav();}
    });
    $("reportAdviceEditor").addEventListener("input",e=>{
      const key=e.target.dataset.advisory,index=Number(e.target.dataset.index);
      if(!key||!Number.isInteger(index)||index<0||index>=AXES.length)return;
      const allowed=["missing","gap","cause","action","priority","wave","owner","confidence"];
      if(!allowed.includes(key))return;
      get(index)[key]=String(e.target.value).slice(0,3000);
      store();
      refreshAdvisoryOutputs();
    });
    $("reportAdviceEditor").addEventListener("change",e=>{
      const key=e.target.dataset.advisory,index=Number(e.target.dataset.index);
      if(key&&Number.isInteger(index)&&index>=0&&index<AXES.length){get(index)[key]=String(e.target.value).slice(0,3000);store();refreshAdvisoryOutputs();}
    });
    $("backAxis").addEventListener("click",()=>{if(state.current>0){state.current--;store();nav();renderAxis();}});
    $("nextAxis").addEventListener("click",()=>{if(state.current<9){state.current++;store();nav();renderAxis();}else show("report");});
    $("workMode").addEventListener("change",e=>{state.mode=e.target.value;store();renderCase();});
    [["organization","organization"],["assessor","assessor"],["scopeName","scope"]].forEach(pair=>$(pair[0]).addEventListener("input",e=>{state[pair[1]]=e.target.value.slice(0,200);store();}));
    $("assessmentButton").addEventListener("click",()=>show("assessment"));
    $("reportButton").addEventListener("click",()=>show("report"));
    $("exportJson").addEventListener("click",exportJson);
    $("importJson").addEventListener("click",()=>$("jsonFile").click());
    $("jsonFile").addEventListener("change",e=>{if(e.target.files&&e.target.files[0])importJson(e.target.files[0]);e.target.value="";});
    $("exportCsv").addEventListener("click",exportCsv);
    $("printReport").addEventListener("click",()=>{show("report");setTimeout(()=>window.print(),100);});
    $("resetState").addEventListener("click",()=>{if(confirm("مسح مدخلات الإصدار الحالي على هذا الجهاز؟ يمكنك حفظ نسخة JSON أولًا.")){state=newState();store();show("assessment");renderAll();$("statusMessage").textContent="بدأ تقييم جديد.";}});
  }
  function boot(){restore();hook();renderAll();show("assessment");}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
