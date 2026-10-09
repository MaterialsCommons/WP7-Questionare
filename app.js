(async()=>{'use strict';
const data=await (await fetch('questionnaire.json?v=13',{cache:'no-store'})).json();const KEY='materials-commons-infrastructure-assessment-v6';let state={people:{},answers:{},page:0};try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)state={...state,...s}}catch{};
const E=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e},save=()=>localStorage.setItem(KEY,JSON.stringify(state));const survey=document.getElementById('survey'),nav=document.getElementById('nav');
function set(id,k,v){state.answers[id]??={};state.answers[id][k]=v;save()}function val(id,k,d=''){return state.answers[id]?.[k]??d}
function text(q,key,label,type='text'){const l=E('label','answer-label',label),i=E(type==='textarea'?'textarea':'input');if(type!=='textarea')i.type=type;i.value=val(q.id,key);i.oninput=()=>set(q.id,key,i.value);l.append(i);return l}
function radio(q,key,opts){const w=E('div');opts.forEach(o=>{const l=E('label','option'),i=E('input');i.type='radio';i.name=q.id+'-'+key;i.checked=val(q.id,key)===o;i.onchange=()=>{if(i.checked)set(q.id,key,o)};l.append(i,document.createTextNode(o));w.append(l)});return w}
function multi(q,key,opts){const w=E('div'),bulk=E('div','bulk-select'),all=E('button','secondary small-action','Select all listed options'),clear=E('button','secondary small-action','Clear selections');all.type=clear.type='button';bulk.append(all,clear);w.append(bulk);const render=()=>{w.querySelectorAll('input[type=checkbox]').forEach(i=>i.checked=val(q.id,key,[]).includes(i.value));const od=w.querySelector('.other-detail');if(od)od.classList.toggle('hidden',!val(q.id,key,[]).includes('Other'))};opts.forEach(o=>{const l=E('label','option'),i=E('input');i.type='checkbox';i.value=o;i.onchange=()=>{let a=[...val(q.id,key,[])];if(i.checked&&!a.includes(o))a.push(o);if(!i.checked)a=a.filter(x=>x!==o);set(q.id,key,a);render()};l.append(i,document.createTextNode(o));w.append(l);if(q.optionDescriptions?.[o]){const hint=E('p','option-description',q.optionDescriptions[o]);w.append(hint)}});if(opts.includes('Other')){const od=text(q,key+'Other','Other (please specify)','text');od.classList.add('other-detail');w.append(od)}all.onclick=()=>{set(q.id,key,opts.filter(x=>!['Other','Unknown','None','Not applicable'].includes(x)));render()};clear.onclick=()=>{set(q.id,key,[]);set(q.id,key+'Other','');render()};render();return w}
function renderControl(q){const f=E('div');if(q.type==='text')f.append(text(q,'answer','Response'));else if(q.type==='url')f.append(text(q,'answer','URL','url'));else if(q.type==='textarea')f.append(text(q,'answer','Response','textarea'));else if(q.type==='single')f.append(radio(q,'answer',q.options));else if(q.type==='multi')f.append(multi(q,'selected',q.options));else if(q.type==='groupmulti'){for(const [g,opts] of Object.entries(q.options)){const fs=E('fieldset','groupbox'),lg=E('legend',null,g);fs.append(lg,multi(q,'selected-'+g,opts));f.append(fs)}}else if(q.type==='nestedmulti'){
const mainWrap=E('div'),selected=[...val(q.id,'selected',[])],nestedBlocks={};
const syncNested=()=>{for(const [parent,fs] of Object.entries(nestedBlocks)){fs.classList.toggle('hidden',!val(q.id,'selected',[]).includes(parent))}};
q.options.main.forEach(o=>{
  const l=E('label','option'),i=E('input');
  i.type='checkbox';i.value=o;i.checked=selected.includes(o);
  i.onchange=()=>{let a=[...val(q.id,'selected',[])];if(i.checked&&!a.includes(o))a.push(o);if(!i.checked)a=a.filter(x=>x!==o);set(q.id,'selected',a);syncNested()};
  l.append(i,document.createTextNode(o));mainWrap.append(l);
  const opts=(q.options.nested||{})[o];
  if(opts){
    const fs=E('fieldset','groupbox nested-options'),lg=E('legend',null,'Electronic-structure methods — select all that apply');
    const nestedWrap=multi(q,'nested-'+o,opts);
    fs.append(lg,nestedWrap);
    nestedBlocks[o]=fs;
    mainWrap.append(fs);
  }
});
f.append(mainWrap);
syncNested()
}else if(q.type==='contact'){f.append(radio(q,'status',q.options));const d=E('div','detail-grid');d.append(text(q,'contactName','Contact name'),text(q,'contactEmail','Contact email','email'));f.append(d)}else if(q.type==='funding'){const d=E('div','detail-grid');d.append(text(q,'securedUntil','Funding secured until (year/date)'),text(q,'fundingOrganisation','Funding organisation(s) / programme(s)'));f.append(d,text(q,'fundingComments','Comments / unknowns','textarea'))}else if(q.type==='federation'){const a=E('fieldset','groupbox'),b=E('fieldset','groupbox');a.append(E('legend',null,'Technical willingness'),radio(q,'technical',['Yes','No','Unknown']));b.append(E('legend',null,'Legal / data reuse willingness'),radio(q,'legal',['Yes','No','Unknown']));f.append(a,b,text(q,'comments','Comments','textarea'))}else if(q.type==='scale'){const d=E('div','detail-grid');d.append(text(q,'records','Number of records / datasets / relevant objects'),text(q,'activeUsers','Number of active users'),text(q,'period','Reporting period'),text(q,'otherScale','Other scale information'));f.append(d)}else if(q.type==='statusurl'||q.type==='statusdetails'){f.append(radio(q,'status',q.options));f.append(text(q,'details',q.type==='statusurl'?'Schema / documentation URL':'Format / details','text'))}return f}
function render(){survey.innerHTML='';const sec=data.sections[state.page],h=E('section');h.append(E('h2',null,sec),E('p','muted',data.sectionPurposes[sec]||''));data.questions.filter(q=>q.section===sec).forEach((q,i)=>{const d=E('div','question');d.append(E('h3',null,(i+1)+'. '+q.title));if(q.help)d.append(E('p','question-help',q.help));d.append(renderControl(q));h.append(d)});survey.append(h);[...nav.children].forEach((b,i)=>b.classList.toggle('active',i===state.page));document.getElementById('progressFill').style.width=((state.page+1)/data.sections.length*100)+'%';document.getElementById('prev').disabled=state.page===0;document.getElementById('next').classList.toggle('hidden',state.page===data.sections.length-1);document.getElementById('exportActions').classList.toggle('hidden',state.page!==data.sections.length-1);scrollTo({top:0,behavior:'smooth'})}
data.sections.forEach((s,i)=>{const b=E('button',null,s);b.type='button';b.onclick=()=>{state.page=i;save();render()};nav.append(b)});document.querySelectorAll('[data-person]').forEach(i=>{const k=i.dataset.person;i.value=state.people[k]||'';i.oninput=()=>{state.people[k]=i.value;save()}});
const intro=document.getElementById('intro');intro.className='intro';intro.append(E('h2','intro-title','Screening questionnaire'),E('p','intro-copy',data.scope));
function result(){return {project:data.project,version:data.version,exportedAt:new Date().toISOString(),assessment:state.people,answers:data.questions.map(q=>({questionId:q.id,section:q.section,question:q.title,response:state.answers[q.id]||{}}))}}
function filename(ext){const n=(val('s1q1','answer','')||'infrastructure').trim().replace(/[^a-z0-9_-]+/gi,'-').replace(/^-|-$/g,'')||'infrastructure';return 'materials-commons-assessment-'+n+'.'+ext}function respondentArchiveName(){
 const clean=value=>String(value||'').trim().replace(/[^a-z0-9_-]+/gi,'-').replace(/^-+|-+$/g,'').slice(0,70);
 const person=clean(state.people.Name)||'unnamed-respondent';
 const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 return person+'-materials-commons-assessment-'+stamp+'.zip';
}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
// A single ZIP download avoids browser restrictions on multiple automatic downloads.
function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
function zipFiles(files){
 const encoder=new TextEncoder(),parts=[],central=[];let offset=0;
 const u16=(v)=>[v&255,(v>>>8)&255],u32=(v)=>[v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];
 for(const file of files){
  const name=encoder.encode(file.name),body=file.bytes,crc=crc32(body);
  const local=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(body.length),...u32(body.length),...u16(name.length),...u16(0),...name]);
  parts.push(local,body);
  central.push(new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(body.length),...u32(body.length),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...name]));
  offset+=local.length+body.length;
 }
 const size=central.reduce((n,c)=>n+c.length,0);
 parts.push(...central,new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(size),...u32(offset),...u16(0)]));
 return new Blob(parts,{type:'application/zip'});
}
document.getElementById('saveBoth').onclick=async()=>{
 const status=document.getElementById('exportStatus');
 const folder=document.querySelector('.preamble-sharepoint-link').href;
 const button=document.getElementById('saveBoth');
 button.disabled=true;
 status.textContent='Preparing JSON and PDF in one ZIP download…';
 // Open while still in the direct click event, before asynchronous PDF processing.
 const sharepointWindow=window.open(folder,'_blank');
 if(sharepointWindow)sharepointWindow.opener=null;
 try{
  const snapshot=result(),pdf=window.MaterialsCommonsPDF.makePdf(snapshot);
  const files=[
   {name:filename('json'),bytes:new TextEncoder().encode(JSON.stringify(snapshot,null,2))},
   {name:filename('pdf'),bytes:new Uint8Array(await pdf.arrayBuffer())}
  ];
  download(zipFiles(files),respondentArchiveName());
  status.textContent='Downloaded one ZIP containing both JSON and PDF. Extract both files and upload them to SharePoint.'+
   (sharepointWindow===null?' If SharePoint did not open, use the yellow link above.':'');
 }catch(err){status.textContent='Could not prepare the files: '+err.message}
 finally{button.disabled=false}
};
document.getElementById('prev').onclick=()=>{if(state.page>0){state.page--;save();render()}};document.getElementById('next').onclick=()=>{if(state.page<data.sections.length-1){state.page++;save();render()}};document.getElementById('clear').onclick=()=>{if(confirm('Clear all locally saved answers for this assessment?')){localStorage.removeItem(KEY);location.reload()}};render();})();