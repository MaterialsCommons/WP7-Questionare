(async()=>{'use strict';
const kind=document.currentScript.dataset.assessment;
const data=await(await fetch(kind+'-questions.json',{cache:'no-store'})).json();
const KEY='materials-commons-experimental-'+kind+'-draft-v1';
let state={people:{},answers:{},page:0};try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved)state={...state,...saved}}catch{}
const $=id=>document.getElementById(id),E=(tag,cls,value)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(value!==undefined)el.textContent=value;return el};
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const get=q=>state.answers[q.id]||{},put=(q,key,value)=>{state.answers[q.id]??={};state.answers[q.id][key]=value;save()};
function control(q){const box=E('div');if(q.type==='text'||q.type==='textarea'){const input=E(q.type==='textarea'?'textarea':'input');if(q.type==='text')input.type='text';input.value=get(q).answer||'';input.oninput=()=>put(q,'answer',input.value);box.append(input)}
else for(const option of q.options||[]){const label=E('label','option'),input=E('input');input.type=q.type==='multi'?'checkbox':'radio';input.name=q.id;input.value=option;input.checked=q.type==='multi'?(get(q).selected||[]).includes(option):get(q).answer===option;input.onchange=()=>{if(q.type==='multi'){const old=get(q).selected||[];put(q,'selected',input.checked?[...new Set([...old,option])]:old.filter(v=>v!==option))}else put(q,'answer',option)};label.append(input,document.createTextNode(option));box.append(label)}return box}
function render(){const sec=data.sections[state.page];$('survey').replaceChildren();const group=E('section');group.append(E('h2',null,sec));data.questions.filter(q=>q.section===sec).forEach((q,i)=>{const item=E('div','assessment-question');item.append(E('h3',null,(i+1)+'. '+q.title),control(q));group.append(item)});$('survey').append(group);[...$('nav').children].forEach((b,i)=>b.classList.toggle('active',i===state.page));$('progressFill').style.width=(100*(state.page+1)/data.sections.length)+'%';$('prev').disabled=state.page===0;$('next').classList.toggle('hidden',state.page===data.sections.length-1);$('exportActions').classList.toggle('hidden',state.page!==data.sections.length-1);
requestAnimationFrame(() => {
  if (state.page === 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const top = nav.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
});
}
data.sections.forEach((sec,i)=>{const b=E('button',null,sec);b.type='button';b.onclick=()=>{state.page=i;save();render()};$('nav').append(b)});
document.querySelectorAll('[data-person]').forEach(el=>{const key=el.dataset.person;el.value=state.people[key]||'';el.oninput=()=>{state.people[key]=el.value;save()}});
$('intro').append(E('h2',null,'About this assessment'),E('p',null,data.scope));
$('prev').onclick=()=>{if(state.page){state.page--;save();render()}};
$('next').onclick=()=>{if(state.page<data.sections.length-1){state.page++;save();render()}};
$('clear').onclick=()=>{if(confirm('Clear the draft for this assessment only?')){localStorage.removeItem(KEY);location.reload()}};
function result(){return{project:data.project,version:data.version,assessmentType:kind,exportedAt:new Date().toISOString(),assessment:state.people,answers:data.questions.map(q=>({questionId:q.id,section:q.section,question:q.title,response:get(q)}))}}
function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0}
function zip(files){const enc=new TextEncoder(),parts=[],directory=[];let offset=0;const u16=n=>[n&255,n>>>8&255],u32=n=>[n&255,n>>>8&255,n>>>16&255,n>>>24&255];for(const file of files){const name=enc.encode(file.name),body=file.bytes,crc=crc32(body),local=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(body.length),...u32(body.length),...u16(name.length),...u16(0),...name]);parts.push(local,body);directory.push(new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(body.length),...u32(body.length),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...name]));offset+=local.length+body.length}const size=directory.reduce((a,b)=>a+b.length,0);return new Blob([...parts,...directory,new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(size),...u32(offset),...u16(0)])],{type:'application/zip'})}
$('saveBoth').onclick=async()=>{const button=$('saveBoth');button.disabled=true;$('exportStatus').textContent='Preparing export…';try{const snapshot=result(),pdf=window.MaterialsCommonsPDF.makePdf(snapshot),name='materials-commons-'+kind+'-'+new Date().toISOString().replace(/[:.]/g,'-');const bytes=new TextEncoder().encode(JSON.stringify(snapshot,null,2));const blob=zip([{name:name+'.json',bytes},{name:name+'.pdf',bytes:new Uint8Array(await pdf.arrayBuffer())}]);const a=E('a');a.href=URL.createObjectURL(blob);a.download=name+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);$('exportStatus').textContent='ZIP downloaded. Extract and upload both files manually.'}catch(e){$('exportStatus').textContent='Export failed: '+e.message}finally{button.disabled=false}};
render();
})();