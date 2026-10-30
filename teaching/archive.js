const term=document.getElementById('term'),search=document.getElementById('search'),results=document.getElementById('results');
const buttons=[...document.querySelectorAll('[data-view]')];let view='speakers';
[...new Set(recordings.map(r=>r.term))].sort().forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;term.append(o)});
function node(tag,text,cls){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n}
function session(r,showSpeaker=false){const el=node('article','','session');el.append(node('div',r.titleStatus,'caption'),node('h3',r.title));if(showSpeaker)el.append(node('p',r.speaker));el.append(node('p',`${r.date?r.date+' · ':''}${r.term} · ${r.minutes} min`,'caption'));
 if(r.role)el.append(node('p',`${r.role} (at recording)`,'caption'));
 if(r.summary)el.append(node('p',r.summary));
 if(r.youtubeId&&/^[A-Za-z0-9_-]{11}$/.test(r.youtubeId)){
  const button=node('button','Play recording','button');button.type='button';button.setAttribute('aria-label',`Play ${r.title} by ${r.speaker}`);
  button.addEventListener('click',()=>{const frame=document.createElement('iframe');frame.src=`https://www.youtube-nocookie.com/embed/${r.youtubeId}`;frame.title=`${r.title} — ${r.speaker}`;frame.allow='encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';frame.style.cssText='width:100%;aspect-ratio:16/9;border:0;display:block;margin-top:15px';button.replaceWith(frame)});
  const link=node('a','Watch on YouTube');link.href=`https://www.youtube.com/watch?v=${r.youtubeId}`;link.target='_blank';link.rel='noopener noreferrer';link.style.marginLeft='18px';el.append(button,link);
 }else el.append(node('p','Recording awaiting publication','caption'));
 return el}
function render(){
 const q=search.value.trim().toLowerCase();const filtered=recordings.filter(r=>(!term.value||r.term===term.value)&&`${r.speaker} ${r.title} ${r.date} ${r.term}`.toLowerCase().includes(q));results.replaceChildren();
 if(view==='speakers'){
  const groups=new Map();filtered.filter(r=>r.kind==='guest').forEach(r=>{if(!groups.has(r.speaker))groups.set(r.speaker,[]);groups.get(r.speaker).push(r)});
  [...groups].sort((a,b)=>a[0].localeCompare(b[0])).forEach(([name,items])=>{const d=node('details','','speaker-entry');const s=node('summary',name);s.append(node('span',`${items.length} session${items.length===1?'':'s'}`,'session-count'));d.append(s);const topics=[...new Set(items.filter(r=>r.titleStatus!=='Title pending review').map(r=>r.title))];d.append(node('p',topics.length?topics.join(' · '):'Talk titles pending review','speaker-topics'));items.forEach(r=>d.append(session(r)));results.append(d)});
  document.getElementById('count').textContent=`${groups.size} speaker${groups.size===1?'':'s'} · Open a speaker to explore their sessions`;
 }else{const items=filtered.filter(r=>view==='videos'||r.kind==='course');items.forEach(r=>results.append(session(r,true)));document.getElementById('count').textContent=`${items.length} ${view==='course'?'course sessions':'videos'}`;}
 if(!results.childElementCount)results.append(node('p','No matches. Try another speaker, topic, or semester.'));
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
}
buttons.forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;render()}));search.addEventListener('input',render);term.addEventListener('change',render);render();
document.querySelectorAll('[data-archive-view]').forEach(a=>a.addEventListener('click',()=>{view=a.dataset.archiveView;search.value='';term.value='';render()}));
