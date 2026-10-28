// يحط النص العربي والإنجليزي في عنصر واحد من غير ما يتلخبط ترتيبهم:
// كل جملة إنجليزي بتتعزل جوه <bdi dir="ltr"> فتفضل مقروءة جوه السطر العربي.
// بيلقط: (1) معادلات أرقام زي 54 + 36 = 90 أو 18→24، (2) أي جملة إنجليزي متصلة.
const LATIN_RUN=/\d+(?:\s*[+=×→]\s*\d+)+(?:\s+[A-Za-z]+)?|[A-Za-z][\w&+.'’\-]*(?:[ \/&+|→\-–]+[A-Za-z0-9][\w&+.'’\-]*)*/g;
export function bidiFill(el,text){
  if(!el)return el;
  el.replaceChildren();
  const s=String(text??"");let last=0;
  for(const m of s.matchAll(LATIN_RUN)){
    if(m.index>last)el.append(s.slice(last,m.index));
    const run=m[0].replace(/[.\-–]+$/,"");// النقطة في آخر الجملة تفضل برّه عشان تقف في مكانها الصح
    const b=document.createElement("bdi");b.dir="ltr";b.textContent=run;el.append(b);
    last=m.index+run.length;
  }
  if(last<s.length)el.append(s.slice(last));
  return el;
}
export function renderCasePack(container,data) {
  if (!container || !data) return;
  container.replaceChildren();
  container.dir="rtl";
  const make=(p,tag,text,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)bidiFill(e,text);p.append(e);return e};
  const head=make(container,"section",undefined,"case-brief");
  make(head,"h3","الأسئلة المطلوبة • "+data.duration);
  const qs=make(head,"ul",undefined,"case-questions");
  for(const item of data.questions){
    const li=make(qs,"li"),m=String(item).match(/^(Q\d+)\s*[:：—\-]\s*/);
    if(m){const tag=document.createElement("span");tag.className="q-tag";tag.textContent=m[1];li.append(tag);make(li,"span",String(item).slice(m[0].length),"q-text")}
    else make(li,"span",item,"q-text");
  }
  if(data.task)make(head,"p",data.task,"case-answer-format");
  make(head,"h3","البيانات المتاحة للحالة");
  make(head,"p","كل البيانات دي افتراضية للتدريب. متعمّمش النتائج على سجلات مش متاحة.","case-disclaimer");
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
  make(limits,"h3","القواعد");
  const list=make(limits,"ul");for(const item of data.boundaries)make(list,"li",item);
  make(limits,"p",data.source,"case-source");
}
