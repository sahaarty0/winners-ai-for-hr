export function renderCasePack(container,data) {
  if (!container || !data) return;
  container.replaceChildren();
  const make=(p,tag,text,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;p.append(e);return e};
  const head=make(container,"section",undefined,"case-brief");
  make(head,"h3","المهام المطلوبة • "+data.level+" • "+data.duration);
  const qs=make(head,"ol",undefined,"case-questions");
  for(const item of data.questions)make(qs,"li",item);
  make(head,"h3","Source Evidence Pack — البيانات المقدمة");
  make(head,"p","كل التفاصيل المضافة هي بيانات تدريبية افتراضية. لا تعمم النتائج على سجلات غير متاحة.","case-disclaimer");
  for(const [i,part] of data.sections.entries()){
    const d=make(container,"details",undefined,"case-evidence-section");
    if(i===0)d.open=true;
    make(d,"summary",part.heading);
    const body=make(d,"div",undefined,"case-section-body");
    make(body,"p",part.intro,"case-small");
    const wrap=make(body,"div",undefined,"case-table-scroll"),t=make(wrap,"table",undefined,"case-table");
    const th=make(t,"thead"),tr=make(th,"tr");
    for(const col of part.columns)make(tr,"th",col);
    const tb=make(t,"tbody");
    for(const row of part.rows){const r=make(tb,"tr");for(const cell of row)make(r,"td",String(cell))}
    if(part.note)make(body,"p","ملاحظة: "+part.note,"case-note");
  }
  const limits=make(container,"section",undefined,"case-boundaries");
  make(limits,"h3","القيود وحدود الأدلة");
  const list=make(limits,"ul");for(const item of data.boundaries)make(list,"li",item);
  make(limits,"p",data.source,"case-source");
}