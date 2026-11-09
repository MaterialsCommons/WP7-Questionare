(async()=>{'use strict';
const data=await (await fetch('questionnaire.json?v=16',{cache:'no-store'})).json();
const KEY='materials-commons-infrastructure-assessment-v6';
let state={people:{},infrastructures:[],activeInfrastructureId:null,page:0,answers:{}};
try{const stored=JSON.parse(localStorage.getItem(KEY)||'null');if(stored)state={...state,...stored}}catch{}
const newId=()=>('infra-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9));
if(!Array.isArray(state.infrastructures))state.infrastructures=[];
if(!state.infrastructures.length)state.infrastructures=[{id:newId(),answers:state.answers&&typeof state.answers==='object'?state.answers:{},page:Number.isInteger(state.page)?state.page:0}];
if(!state.infrastructures.some(x=>x.id===state.activeInfrastructureId))state.activeInfrastructureId=state.infrastructures[0].id;
let current=state.infrastructures.find(x=>x.id===state.activeInfrastructureId);
state.answers=current.answers||{};state.page=current.page||0;
const E=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};
const save=()=>{current.answers=state.answers;current.page=state.page;state.activeInfrastructureId=current.id;localStorage.setItem(KEY,JSON.stringify({people:state.people,infrastructures:state.infrastructures,activeInfrastructureId:current.id}))};
const survey=document.getElementById('survey'),nav=document.getElementById('nav');
function set(id,k,v){state.answers[id]??={};state.answers[id][k]=v;save();if(id==='s1q1'&&k==='answer')renderInfrastructureSelector()}
function val(id,k,d=''){return state.answers[id]?.[k]??d}
function infraName(infra,index){return infra.answers?.s1q1?.answer?.trim()||'Infrastructure '+(index+1)}
function renderInfrastructureSelector(){
 const select=document.getElementById('infrastructureSelect');select.replaceChildren();
 state.infrastructures.forEach((infra,i)=>{const o=E('option',null,infraName(infra,i));o.value=infra.id;select.append(o)});
 select.value=current.id;
 document.getElementById('removeInfrastructure').disabled=state.infrastructures.length===1;
 document.getElementById('infrastructureCount').textContent=state.infrastructures.length+' infrastructure'+(state.infrastructures.length===1?'':'s')+' in this assessment';
}
function switchInfrastructure(id){
 const target=state.infrastructures.find(x=>x.id===id);if(!target||target===current)return;
 save();current=target;state.answers=current.answers||{};state.page=current.page||0;save();renderInfrastructureSelector();render();
}
document.getElementById('infrastructureSelect').onchange=e=>switchInfrastructure(e.target.value);
document.getElementById('addInfrastructure').onclick=()=>{
 save();const infra={id:newId(),answers:{},page:0};state.infrastructures.push(infra);
 current=infra;state.answers=infra.answers;state.page=0;save();renderInfrastructureSelector();render();
};
document.getElementById('removeInfrastructure').onclick=()=>{
 if(state.infrastructures.length<2)return;
 const index=state.infrastructures.indexOf(current);
 if(!confirm('Remove '+infraName(current,index)+' and all its locally saved answers? This cannot be undone.'))return;
 state.infrastructures.splice(index,1);current=state.infrastructures[Math.min(index,state.infrastructures.length-1)];
 state.answers=current.answers||{};state.page=current.page||0;save();renderInfrastructureSelector();render();
};
function text(q,key,label,type='text'){const l=E('label','answer-label',label),i=E(type==='textarea'?'textarea':'input');if(type!=='textarea')i.type=type;i.value=val(q.id,key);i.oninput=()=>set(q.id,key,i.value);l.append(i);return l}
function radio(q,key,opts){const w=E('div');opts.forEach(o=>{const l=E('label','option'),i=E('input');i.type='radio';i.name=q.id+'-'+key;i.checked=val(q.id,key)===o;i.onchange=()=>{if(i.checked)set(q.id,key,o)};l.append(i,document.createTextNode(o));w.append(l)});return w}
function multi(q,key,opts){const w=E('div'),bulk=E('div','bulk-select'),all=E('button','secondary small-action','Select all listed options'),clear=E('button','secondary small-action','Clear selections');all.type=clear.type='button';bulk.append(all,clear);w.append(bulk);const render=()=>{w.querySelectorAll('input[type=checkbox]').forEach(i=>i.checked=val(q.id,key,[]).includes(i.value));const od=w.querySelector('.other-detail');if(od)od.classList.toggle('hidden',!val(q.id,key,[]).includes('Other'));w.querySelectorAll('.domain-specify').forEach(d=>d.classList.toggle('hidden',!val(q.id,key,[]).includes(d.dataset.choice)))};opts.forEach(o=>{const l=E('label','option'),i=E('input');i.type='checkbox';i.value=o;i.onchange=()=>{let a=[...val(q.id,key,[])];if(i.checked&&!a.includes(o))a.push(o);if(!i.checked)a=a.filter(x=>x!==o);set(q.id,key,a);render()};l.append(i,document.createTextNode(o));w.append(l);if(q.optionDescriptions?.[o]){const hint=E('p','option-description',q.optionDescriptions[o]);w.append(hint)}});if(opts.includes('Other')){const od=text(q,key+'Other','Other (please specify)','text');od.classList.add('other-detail');w.append(od)}if(q.id==='s2q1'&&key==='selected'){
 for(const [option,field,label] of [
 ['Cross-domain','crossDomainSpecify','Cross-domain — please specify the materials domains'],
 ['General-purpose / no specific materials-domain mandate','generalPurposeSpecify','General-purpose — please specify the scope (optional)']
 ]){
  const detail=text(q,field,label,'textarea');detail.classList.add('domain-specify');detail.dataset.choice=option;const choice=Array.from(w.querySelectorAll('label.option')).find(l=>l.querySelector('input')?.value===option);if(choice){const hint=choice.nextElementSibling?.classList.contains('option-description')?choice.nextElementSibling:choice;hint.after(detail)}else w.append(detail);
 }
}all.onclick=()=>{set(q.id,key,opts.filter(x=>!['Other','Unknown','None','Not applicable'].includes(x)));render()};clear.onclick=()=>{set(q.id,key,[]);set(q.id,key+'Other','');render()};render();return w}
function renderControl(q){const f=E('div');if(q.type==='text')f.append(text(q,'answer','Response'));else if(q.type==='url')f.append(text(q,'answer','URL','url'));else if(q.type==='textarea')f.append(text(q,'answer','Response','textarea'));else if(q.type==='single')f.append(radio(q,'answer',q.options));else if(q.type==='capabilities'){
 f.append(multi(q,'selected',q.options));
 const details=E('fieldset','groupbox hpc-details');
 details.append(E('legend',null,'Computational resources (HPC / cloud) — additional details (optional)'));
 details.append(E('p','question-help','Specify whether this is a production service or a pilot, its access conditions and approximate capacity.'));
 const status=E('fieldset','groupbox');
 status.append(E('legend',null,'Operational status'),radio(q,'hpcStatus',['Operational / production service','Pilot / demonstration','Planned','Unknown']));
 const access=E('fieldset','groupbox');
 access.append(E('legend',null,'Access conditions'),multi(q,'hpcAccess',['Open access','Registration required','Restricted to eligible users or partners','Application / resource allocation required','Paid access','Other']));
 details.append(status,access,text(q,'hpcCapacity','Capacity or limitations (optional)','textarea'));
 const refresh=()=>details.classList.toggle('hidden',!val(q.id,'selected',[]).includes('Computational resources (HPC / cloud)'));
 f.addEventListener('change',refresh);refresh();f.append(details)
}else if(q.type==='membership'||q.type==='externalAccess'){
 f.append(radio(q,'status',q.options));
 const details=E('div','conditional-details');
 if(q.type==='membership'){
  details.append(text(q,'initiatives','Names of federations, consortia or research centres (and optional URLs)','textarea'));
 }else{
  details.append(text(q,'platforms','External platforms (names and optional URLs)','textarea'));
  const fs=E('fieldset','groupbox');
  fs.append(E('legend',null,'What is possible through these platforms?'));
  fs.append(multi(q,'capabilities',['Data or metadata discovery','Federated querying','Data or metadata retrieval','Other']));
  details.append(fs);
 }
 const refresh=()=>details.classList.toggle('hidden',!(q.type==='membership'?['Yes','Planned']:['Yes','Partly','Planned']).includes(val(q.id,'status')));
 f.addEventListener('change',refresh);refresh();f.append(details)
}else if(q.type==='multi')f.append(multi(q,'selected',q.options));else if(q.type==='groupmulti'){for(const [g,opts] of Object.entries(q.options)){const fs=E('fieldset','groupbox'),lg=E('legend',null,g);fs.append(lg,multi(q,'selected-'+g,opts));f.append(fs)}}else if(q.type==='nestedmulti'){
const mainWrap=E('div'),selected=[...val(q.id,'selected',[])],nestedBlocks={};
const syncNested=()=>{for(const [parent,fs] of Object.entries(nestedBlocks)){fs.classList.toggle('hidden',!val(q.id,'selected',[]).includes(parent))}const other=mainWrap.querySelector('.other-detail');if(other)other.classList.toggle('hidden',!val(q.id,'selected',[]).includes('Other'))};
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
if(q.options.main.includes('Other')){
 const other=text(q,'selectedOther','Other (please specify)','textarea');
 other.classList.add('other-detail');
 const otherOption=Array.from(mainWrap.querySelectorAll('label.option')).find(l=>l.querySelector('input')?.value==='Other');
 if(otherOption)otherOption.after(other);else mainWrap.append(other);
}
f.append(mainWrap);
syncNested()
}else if(q.type==='contact'){
 f.append(radio(q,'status',q.options));
 const contacts=E('div','contact-list'),add=E('button','secondary small-action','+ Add another contact');add.type='button';
 const draw=()=>{
  contacts.replaceChildren();
  const extras=val(q.id,'additionalContacts',[]);
  const count=1+extras.length;
  for(let n=0;n<count;n++){
   const card=E('fieldset','groupbox contact-entry');
   card.append(E('legend',null,'Technical contact '+(n+1)));
   if(n===0){
    card.append(text(q,'contactName','Name'),text(q,'contactTopic','Topic / area of responsibility'),text(q,'contactEmail','Email','email'));
   }else{
    const index=n-1;
    const addField=(key,label,type='text')=>{
     const l=E('label','answer-label',label),input=E('input');input.type=type;input.value=extras[index]?.[key]||'';
     input.oninput=()=>{const next=[...val(q.id,'additionalContacts',[])];next[index]={...next[index],[key]:input.value};set(q.id,'additionalContacts',next)};
     l.append(input);return l;
    };
    card.append(addField('name','Name'),addField('topic','Topic / area of responsibility'),addField('email','Email','email'));
    const remove=E('button','secondary small-action','Remove contact');remove.type='button';
    remove.onclick=()=>{set(q.id,'additionalContacts',val(q.id,'additionalContacts',[]).filter((_,i)=>i!==index));draw()};
    card.append(remove);
   }
   contacts.append(card);
  }
 };
 add.onclick=()=>{set(q.id,'additionalContacts',[...val(q.id,'additionalContacts',[]),{name:'',topic:'',email:''}]);draw()};
 f.append(contacts,add);draw();
}else if(q.type==='funding'){const d=E('div','detail-grid');d.append(text(q,'securedUntil','Funding secured until (year/date)'),text(q,'fundingOrganisation','Funding organisation(s) / programme(s)'));f.append(d,text(q,'fundingComments','Comments / unknowns','textarea'))}else if(q.type==='federation'){const a=E('fieldset','groupbox'),b=E('fieldset','groupbox');a.append(E('legend',null,'Technical willingness'),radio(q,'technical',['Yes','No','Unknown']));b.append(E('legend',null,'Legal / data reuse willingness'),radio(q,'legal',['Yes','No','Unknown']));f.append(a,b,text(q,'comments','Comments','textarea'));}else if(q.type==='scale'){
 const d=E('div','detail-grid');
 const fields=[
 ['records','Number of records','Individual database or catalogue entries, as defined by the infrastructure.'],
 ['datasets','Number of datasets','Distinct data collections managed or published by the infrastructure.'],
 ['digitalObjects','Number of other relevant digital research objects','Models, workflows, software or other identifiable digital objects; exclude datasets already counted.'],
 ['activeUsers','Number of active users','Users who accessed or used the infrastructure during the reporting period.'],
 ['registeredUsers','Number of registered users (total)','All registered accounts, including active and inactive users. Do not add this to active users.'],
 ['period','Reporting period','e.g. 2025 or last 12 months.'],
 ['otherScale','Other scale information / counting notes (optional)','Explain definitions, estimates or other usage indicators.']
 ];
 for(const [key,label,hint] of fields){const box=E('div','scale-field');box.append(text(q,key,label,key==='otherScale'?'textarea':'text'),E('p','question-help',hint));d.append(box)}
 f.append(d)
}else if(q.type==='futureScope'){
 const options=q.options||[],wrap=E('div');
 const details=E('div','future-scope-details');
 details.append(text(q,'plannedObjects','Planned additional domains or digital research objects','textarea'),text(q,'timeframe','Expected timeframe (optional)'));
 const refresh=()=>details.classList.toggle('hidden',val(q.id,'status')!=='Yes');
 options.forEach(o=>{const l=E('label','option'),i=E('input');i.type='radio';i.name=q.id+'-status';i.checked=val(q.id,'status')===o;i.onchange=()=>{if(i.checked){set(q.id,'status',o);refresh()}};l.append(i,document.createTextNode(o));wrap.append(l)});
 wrap.append(details);refresh();f.append(wrap)
}else if(q.type==='statusurls'){
 f.append(radio(q,'status',q.options));
 const wrap=E('div','schema-urls'),heading=E('p','question-help','Schema / documentation URLs (one URL per field)');
 wrap.append(heading);
 // Keep the original "details" answer as the first URL for existing saved drafts.
 let urls=val(q.id,'urls',null);
 if(!Array.isArray(urls))urls=[val(q.id,'details','')];
 const redraw=()=>{
  wrap.querySelectorAll('.schema-url-row').forEach(n=>n.remove());
  urls.forEach((url,index)=>{
   const row=E('div','schema-url-row'),field=E('input'),remove=E('button','secondary small-action','Remove');
   field.type='url';field.placeholder='https://example.org/schema';field.setAttribute('aria-label','Schema URL '+(index+1));field.value=url;
   field.oninput=()=>{urls[index]=field.value;set(q.id,'urls',[...urls]);if(index===0)set(q.id,'details',field.value)};
   row.append(field);
   if(urls.length>1){remove.type='button';remove.onclick=()=>{urls.splice(index,1);set(q.id,'urls',[...urls]);set(q.id,'details',urls[0]||'');redraw()};row.append(remove)}
   wrap.insertBefore(row,add);
  })
 };
 const add=E('button','secondary small-action','+ Add another schema URL');add.type='button';
 add.onclick=()=>{urls.push('');set(q.id,'urls',[...urls]);redraw()};
 wrap.append(add);redraw();f.append(wrap)
}else if(q.type==='statusurl'||q.type==='statusdetails'){f.append(radio(q,'status',q.options));f.append(text(q,'details',q.type==='statusurl'?'Schema / documentation URL':'Format / details','text'))}return f}
function render(){survey.innerHTML='';const sec=data.sections[state.page],h=E('section');h.append(E('h2',null,sec),E('p','muted',data.sectionPurposes[sec]||''));data.questions.filter(q=>q.section===sec).forEach((q,i)=>{const d=E('div','question');const heading=E('h3');
 if(q.id==='s1q8'){
  heading.append(document.createTextNode((i+1)+'. Is the infrastructure willing to join the '));
  const link=E('a',null,'Materials Commons federation');
  link.href='https://www.materialscommons.eu/';link.target='_blank';link.rel='noopener noreferrer';
  heading.append(link,document.createTextNode('?'));
 }else heading.textContent=(i+1)+'. '+q.title;
 d.append(heading);if(q.help)d.append(E('p','question-help',q.help));d.append(renderControl(q));h.append(d)});survey.append(h);[...nav.children].forEach((b,i)=>b.classList.toggle('active',i===state.page));document.getElementById('progressFill').style.width=((state.page+1)/data.sections.length*100)+'%';document.getElementById('prev').disabled=state.page===0;document.getElementById('next').classList.toggle('hidden',state.page===data.sections.length-1);document.getElementById('exportActions').classList.toggle('hidden',state.page!==data.sections.length-1);scrollTo({top:0,behavior:'smooth'})}
data.sections.forEach((s,i)=>{const b=E('button',null,s);b.type='button';b.onclick=()=>{state.page=i;save();render()};nav.append(b)});document.querySelectorAll('[data-person]').forEach(i=>{const k=i.dataset.person;i.value=state.people[k]||'';i.oninput=()=>{state.people[k]=i.value;save()}});
const intro=document.getElementById('intro');intro.className='intro';intro.append(E('h2','intro-title','Screening questionnaire'),E('p','intro-copy',data.scope));
function result(infra){return {project:data.project,version:data.version,exportedAt:new Date().toISOString(),assessment:state.people,infrastructure:infraName(infra,state.infrastructures.indexOf(infra)),answers:data.questions.map(q=>({questionId:q.id,section:q.section,question:q.title,response:infra.answers?.[q.id]||{}}))}}
function safeName(v){return String(v||'infrastructure').trim().replace(/[^a-z0-9_-]+/gi,'-').replace(/^-|-$/g,'').slice(0,70)||'infrastructure'}
function filename(infra,index,ext){return String(index+1).padStart(2,'0')+'-'+safeName(infraName(infra,index))+'.'+ext}
function respondentArchiveName(){
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
 button.disabled=true;save();
 status.textContent='Preparing JSON and PDF for '+state.infrastructures.length+' infrastructure(s)…';
 const sharepointWindow=window.open(folder,'_blank');if(sharepointWindow)sharepointWindow.opener=null;
 try{
  const files=[],encoder=new TextEncoder();
  for(let index=0;index<state.infrastructures.length;index++){
   const infra=state.infrastructures[index],snapshot=result(infra);
   files.push({name:filename(infra,index,'json'),bytes:encoder.encode(JSON.stringify(snapshot,null,2))});
   const pdf=window.MaterialsCommonsPDF.makePdf(snapshot);
   files.push({name:filename(infra,index,'pdf'),bytes:new Uint8Array(await pdf.arrayBuffer())});
  }
  download(zipFiles(files),respondentArchiveName());
  status.textContent='ZIP downloaded with '+files.length+' files (JSON and PDF for each infrastructure). IMPORTANT: Your assessment has NOT been submitted yet. Upload the downloaded ZIP file to the SharePoint folder to complete submission.'+(sharepointWindow===null?' If SharePoint did not open, use the link above.':'');
 }catch(err){status.textContent='Could not prepare the files: '+err.message}
 finally{button.disabled=false}
};
document.getElementById('prev').onclick=()=>{if(state.page>0){state.page--;save();render()}};document.getElementById('next').onclick=()=>{if(state.page<data.sections.length-1){state.page++;save();render()}};document.getElementById('clear').onclick=()=>{if(confirm('Clear all locally saved answers for this assessment?')){localStorage.removeItem(KEY);location.reload()}};renderInfrastructureSelector();render();})();