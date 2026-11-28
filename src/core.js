const $=(s,r=document)=>r.querySelector(s);
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[R(0,a.length-1)];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const el=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let DB={users:{},cur:null},CLASS={};
try{DB=JSON.parse(localStorage.getItem('pz-v3')||'null')||DB;CLASS=JSON.parse(localStorage.getItem('pz-class')||'{}')}catch(e){}
let done={};
const persist=()=>{try{localStorage.setItem('pz-v3',JSON.stringify(DB));localStorage.setItem('pz-class',JSON.stringify(CLASS))}catch(e){}if(typeof syncSoon==='function')syncSoon();};
const save=persist;
const me=()=>DB.cur&&DB.users[DB.cur];
function loadUser(){if(me())done=me().done;}
const isDone=(id,l)=>!!(done[id]&&done[id][l]);
const doneCount=id=>Object.keys(done[id]||{}).length;
const ptsOf=u=>{let s=0;for(const id in u.done)for(const l in u.done[id])s+=u.done[id][l].p||0;return s;};
const lvOf=u=>{let s=0;for(const id in u.done)s+=Object.keys(u.done[id]).length;return s;};
const lvPts=lv=>50+10*Math.min(lv,20);
function markDone(id,lv){
  const secs=ctx&&ctx.t0?Math.round((Date.now()-ctx.t0)/1000):null;
  let r=(done[id]=done[id]||{})[lv],gain;
  if(!r){r=done[id][lv]={n:1,t:secs,p:lvPts(lv)};gain=lvPts(lv);}
  else{r.n++;gain=r.n<=11?5:0;r.p+=gain;if(secs!=null&&(r.t==null||secs<r.t))r.t=secs;}
  logEvent(id,lv,'complete',{secs,n:r.n,gain});
  if(ctx)ctx.t0=Date.now();persist();return gain;
}
const REG=[];
let ctx=null;
const CATS=['All','GCSE Maths','General Puzzles','Basic Skills Practice','News and Video'];let curCat='All',curTag='All';
const TAGS=['Algebra','Geometry','Number and Arithmetic','Probability / Statistics','Strategies and planning','Calculus'];
const CAT_EMO={'GCSE Maths':'🎓','General Puzzles':'🧩','Basic Skills Practice':'✏️','News and Video':'📰'};
/* every game belongs to ONE category and can carry several tags */
const CATALOG={
 balance:['GCSE Maths',['Algebra']],expand:['GCSE Maths',['Algebra']],lines:['GCSE Maths',['Algebra','Geometry']],
 angles:['GCSE Maths',['Geometry']],transform:['GCSE Maths',['Geometry']],
 fraction:['GCSE Maths',['Number and Arithmetic']],percent:['GCSE Maths',['Number and Arithmetic']],factors:['GCSE Maths',['Number and Arithmetic']],
 chance:['GCSE Maths',['Probability / Statistics']],derby:['GCSE Maths',['Probability / Statistics']],
 factorise:['GCSE Maths',['Algebra','Number and Arithmetic']],quad:['GCSE Maths',['Algebra']],times:['Basic Skills Practice',['Number and Arithmetic']],digits:['Basic Skills Practice',['Number and Arithmetic']],grid:['Basic Skills Practice',['Number and Arithmetic']],
 g24:['General Puzzles',['Number and Arithmetic','Strategies and planning']],
 match:['General Puzzles',['Number and Arithmetic']],p2048:['General Puzzles',['Number and Arithmetic','Strategies and planning']],
 sudoku:['General Puzzles',['Strategies and planning']],river:['General Puzzles',['Strategies and planning']],nim:['General Puzzles',['Strategies and planning']],
 klotski:['General Puzzles',['Strategies and planning','Geometry']],euler:['General Puzzles',['Strategies and planning','Geometry']]};
const catOf=G=>(CATALOG[G.id]||['General Puzzles',[]])[0];
const tagsOf=G=>(CATALOG[G.id]||['General Puzzles',[]])[1];

function confetti(){
  const c=el('canvas','confetti');document.body.appendChild(c);c.width=innerWidth;c.height=innerHeight;
  const g=c.getContext('2d'),cols=['#ff7a45','#7c5cff','#17a2b8','#e8478b','#2eaa5e','#f5b301'];
  const P=Array.from({length:140},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.5,vx:(Math.random()-.5)*4,vy:2+Math.random()*4,s:5+Math.random()*7,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[R(0,5)]}));
  let t=0;(function f(){t++;g.clearRect(0,0,c.width,c.height);
    P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.vy+=.05;g.save();g.translate(p.x,p.y);g.rotate(p.r);g.fillStyle=p.c;g.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);g.restore()});
    if(t<200)requestAnimationFrame(f);else c.remove();})();
}
function toast(msg){
  let t=$('#toast');if(!t){t=el('div');t.id='toast';document.body.appendChild(t);}
  t.className='show';t.textContent=msg;clearTimeout(t._h);t._h=setTimeout(()=>t.className='',2200);
}
function shake(e){if(!e)return;e.classList.remove('shake');void e.offsetWidth;e.classList.add('shake');}

let introStop=null;
function closeIntro(){if(introStop){try{introStop()}catch(e){}introStop=null;}document.querySelectorAll('.intro').forEach(o=>o.remove());document.body.style.overflow='';}
function showIntro(g){
  closeIntro();const o=el('div','intro');
  o.innerHTML='<div class="in-top"><button class="in-v" id="inv"></button><button class="in-x" id="inx">Skip ✕</button></div><div class="in-body" id="inb"></div>';
  document.body.appendChild(o);document.body.style.overflow='hidden';
  $('#inx').onclick=closeIntro;
  const au=new Audio();au.preload='auto';introStop=g.anim(o.querySelector('#inb'),{close:closeIntro,voiceBtn:o.querySelector('#inv'),audio:au});
}
function cleanup(){closeIntro();if(!ctx)return;ctx.cleanups.forEach(f=>{try{f()}catch(e){}});ctx=null;document.querySelectorAll('.overlay').forEach(o=>o.remove());}
const ROOT=(()=>{let p=location.pathname.replace(/index\.html$/,'');const sg=p.split('/').filter(Boolean);if(sg.length&&/^[a-z0-9_-]+$/.test(sg[sg.length-1])&&window.__GAME_PAGE){sg.pop();}return '/'+sg.join('/')+(sg.length?'/':'');})();
function pushUrl(path,rep){try{if(location.pathname!==path){history[rep?'replaceState':'pushState'](null,'',path+location.search.replace(/[?&]l=\d+/,''));}}catch(e){}}
function goMenu(nopush){cleanup();if(nopush!==true)pushUrl(ROOT);$('#game').hidden=true;$('#menu').hidden=false;renderMenu();window.scrollTo(0,0);}
const curLv={};
function openGame(id,lv,fromRoute){
  cleanup();const g=REG.find(x=>x.id===id);lv=lv||curLv[id]||1;curLv[id]=lv;const N=g.levels.length;
  $('#menu').hidden=true;$('#game').hidden=false;
  $('#gtitle').innerHTML=`<span class="gemo">${g.emoji}</span> ${g.name}`;
  document.documentElement.style.setProperty('--gc',g.color);$('#gbar').style.setProperty('--c',g.color);
  const pills=$('#glevels');pills.innerHTML='';pills.classList.toggle('long',N>24);
  g.levels.forEach((n,i)=>{const b=el('button','pill'+(i+1===lv?' on':'')+(isDone(id,i+1)?' dn':''),String(i+1));b.title=n;b.onclick=()=>openGame(id,i+1);pills.appendChild(b);});
  if(N>24){const cur=pills.children[lv-1];if(cur)setTimeout(()=>{try{pills.scrollLeft=cur.offsetLeft-pills.clientWidth/2+cur.offsetWidth/2}catch(e){}},0);}
  $('#glvname').innerHTML=`<b>Level ${lv}/${N}</b> · ${g.levels[lv-1]}`;
  const root=$('#groot');root.innerHTML='';
  ctx={id,lv,N,t0:Date.now(),cleanups:[],keys:null,
    log(kind,detail){logEvent(id,lv,kind,detail);},
    interval(fn,ms){const h=setInterval(fn,ms);this.cleanups.push(()=>clearInterval(h));return h},
    timeout(fn,ms){const h=setTimeout(fn,ms);this.cleanups.push(()=>clearTimeout(h));return h},
    win(title,text,again,againLabel,opt){const gain=markDone(id,lv),first=gain===lvPts(lv);const chip=pills.children[lv-1];if(chip)chip.classList.add('dn');showWin(title,text+(gain?` <b class="gain">+${gain} pts ⭐</b>`:''),again,againLabel,first,opt&&opt.stay);}};
  {const hw=$('#howto'),hb=$('#hbtn');hw.classList.remove('anim');if(g.anim){hw.hidden=true;hb.hidden=false;hb.onclick=()=>showIntro(g);}else{hw.hidden=false;hw.textContent=g.how;hb.hidden=true;}}
  window.scrollTo(0,0);
  try{const base=ROOT+id+'/',hs='#'+lv;if(location.pathname!==base||location.hash!==hs){const u=base+location.search.replace(/[?&]l=\d+/,'')+hs;history[fromRoute?'replaceState':'pushState'](null,'',u);}}catch(e){}
  document.title=g.name+' · Level '+lv+' · Maths Puzzle Arcade';
  g.mount(root,lv,ctx);
  if(g.anim){let seen=false;try{seen=localStorage.getItem('pz-intro-'+id)==='1';}catch(e){}if(!seen){try{localStorage.setItem('pz-intro-'+id,'1');}catch(e){}setTimeout(()=>{if(ctx&&ctx.id===id)showIntro(g);},200);}}
}
function showWin(title,text,again,againLabel,first,stay){
  confetti();const id=ctx.id,lv=ctx.lv,N=ctx.N;
  const o=el('div','overlay soft');
  const nextLv=first&&lv<N;
  o.innerHTML=`<div class="winbar"><div class="wb-t"><span>🎉</span> ${title}</div><div class="wb-x">${text}</div><div class="wb-n">${stay?'Review your steps ✓':nextLv?'Next: level '+(lv+1)+' ▶':again?'Next puzzle ▶':lv<N?'Next: level '+(lv+1)+' ▶':'All done! Tap to close'}</div><i class="wb-bar"></i></div>`;
  document.body.appendChild(o);
  let fin=false;
  const go=()=>{if(fin||!o.isConnected)return;fin=true;o.remove();
    if(nextLv)openGame(id,lv+1);else if(again)again();else if(lv<N)openGame(id,lv+1);};
  if(stay){const rm=()=>o.remove();o.querySelector('.winbar').onclick=rm;setTimeout(rm,2600);return;}
  o.querySelector('.winbar').onclick=go;
  setTimeout(go,2600);
}
document.addEventListener('keydown',e=>{if(ctx&&ctx.keys&&!e.target.matches('input,textarea'))ctx.keys(e)});
$('#back').onclick=()=>{goMenu();document.title='Maths Puzzle Arcade';};
function routeNow(){const sg=location.pathname.split('/').filter(Boolean);const gid=sg[sg.length-1];if(REG.some(x=>x.id===gid)){const m=/^#(\d+)$/.exec(location.hash);const g=REG.find(x=>x.id===gid);const n=m?+m[1]:0;openGame(gid,n>=1&&n<=g.levels.length?n:undefined,true);}else goMenu(true);}
window.addEventListener('popstate',routeNow);

/* reusable number pad: returns element; onKey gets '0'-'9','-','.','del','ok' */
function numpad(onKey,opts={}){
  const p=el('div','npad');
  const keys=['7','8','9','4','5','6','1','2','3',opts.minus?'-':(opts.slash?'/':'del'),'0',opts.minus||opts.slash?'del':'ok'];
  keys.forEach(k=>{const b=el('button','key'+(k==='del'?' del':''),k==='del'?'⌫':k==='-'?'−':k==='ok'?'✓':k);b.onclick=()=>onKey(k);p.appendChild(b);});
  if(opts.minus||opts.slash){const b=el('button','key ok','Enter ✓');b.style.gridColumn='span 3';b.onclick=()=>onKey('ok');p.appendChild(b);}
  return p;
}

function renderMenu(){
  const bar=$('#cats');bar.innerHTML='';
  CATS.forEach(c=>{const b=el('button','cat'+(c===curCat?' on':''),(CAT_EMO[c]?CAT_EMO[c]+' ':'')+c);b.onclick=()=>{curCat=c;curTag='All';renderMenu()};bar.appendChild(b);});
  const g=$('#cards');g.innerHTML='';
  const total=REG.reduce((a,G)=>a+doneCount(G.id),0),all=REG.reduce((a,G)=>a+G.levels.length,0);
  const u=me()||{done:{}};$('#overall').innerHTML=`<button class="who" id="who">👤 ${esc(DB.cur||'Player')} ▾</button><span class="pts">⭐ ${ptsOf(u)} pts</span><span>${total} / ${all} levels</span>`;$('#who').onclick=()=>me()?showProfile():showLogin(true);
  const tb=$('#tagbar');tb.innerHTML='';
  if(curCat==='News and Video'){tb.hidden=true;renderNews(g);return;}
  tb.hidden=false;
  const inCat=REG.filter(G=>curCat==='All'||catOf(G)===curCat);
  const mk=(t,n)=>{const b=el('button','tagc'+(t===curTag?' on':''),`${t==='All'?'All topics':t} <small>${n}</small>`);b.onclick=()=>{curTag=t;renderMenu()};tb.appendChild(b);};
  mk('All',inCat.length);TAGS.forEach(t=>mk(t,inCat.filter(G=>tagsOf(G).includes(t)).length));
  const list=inCat.filter(G=>curTag==='All'||tagsOf(G).includes(curTag));
  if(!list.length){g.innerHTML=`<div class="empty">🚧<b>No games here yet</b><span>${curTag==='Calculus'?'Calculus games are coming soon!':'Pick another topic.'}</span></div>`;return;}
  list.forEach(G=>{
    const c=el('button','card');c.style.setProperty('--c',G.color);const d=doneCount(G.id);
    c.innerHTML=`<div class="art">${G.art}<span class="tag">${CAT_EMO[catOf(G)]||''} ${catOf(G)}</span></div><h3>${G.name}</h3><p>${G.desc}</p><div class="tagrow">${tagsOf(G).map(t=>`<span>${t}</span>`).join('')}</div><div class="skills">${G.skills.map(s=>`<span>${s}</span>`).join('')}</div>
    <div class="solved"><div class="pbar"><i style="width:${d/G.levels.length*100}%"></i></div>${d}/${G.levels.length} levels</div>`;
    c.onclick=()=>openGame(G.id,Math.min(G.levels.length,d+1));g.appendChild(c);
  });
}
function renderNews(g){
  if(!NEWS.length){g.innerHTML='<div class="empty">📰<b>News and Video — coming soon</b><span>Maths news, short explainer videos and study tips will appear here.</span></div>';return;}
  NEWS.forEach(n=>{const a=el('a','card news');a.href=n.url;a.target='_blank';a.rel='noopener noreferrer';a.style.setProperty('--c',n.type==='video'?'#e03131':'#1c7ed6');
    a.innerHTML=`<div class="art">${n.type==='video'?'▶️':'📰'}<span class="tag">${n.type==='video'?'Video':'News'}</span></div><h3>${esc(n.title)}</h3><p>${esc(n.desc||'')}</p><div class="skills"><span>${esc(n.date||'')}</span></div>`;g.appendChild(a);});
}

/* ---------- user system ---------- */
function ov(html,cls){const o=el('div','overlay');o.innerHTML=`<div class="modal ${cls||''}">${html}</div>`;document.body.appendChild(o);return o;}
function progressCode(){
  const u=me(),g={};for(const id in u.done)g[id]=Object.keys(u.done[id]).length;
  const o={n:DB.cur,p:ptsOf(u),l:lvOf(u),g,at:Date.now()};
  return 'PZ1:'+btoa(unescape(encodeURIComponent(JSON.stringify(o))));
}
function parseCode(c){try{c=c.trim();if(!c.startsWith('PZ1:'))return null;const o=JSON.parse(decodeURIComponent(escape(atob(c.slice(4)))));if(!o||typeof o.n!=='string'||typeof o.p!=='number')return null;o.n=o.n.slice(0,16);return o;}catch(e){return null;}}
function copyText(t,msg){const done=()=>toast(msg||'Copied!');
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,()=>fb());else fb();
  function fb(){const a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');done();}catch(e){prompt('Copy this:',t);}a.remove();}}
function showClassLocal(){
  // merge device players + imported codes
  const rows={};
  Object.keys(CLASS).forEach(n=>rows[n]=Object.assign({src:'code'},CLASS[n]));
  Object.keys(DB.users).forEach(n=>{const u=DB.users[n],g={};for(const id in u.done)g[id]=Object.keys(u.done[id]).length;rows[n]={n,p:ptsOf(u),l:lvOf(u),g,src:'device',at:Date.now()};});
  const list=Object.values(rows).sort((a,b)=>b.p-a.p);
  const o=ov(`<h2>🏫 Class board</h2><p class="small">Players on this device appear automatically. Ask each student to tap <b>Share my progress</b> and send you the code, then paste codes below.</p>
   <div class="ctab">${list.map((r,i)=>`<div class="crow"><span class="cr">${i+1}</span><span class="cn">${esc(r.n)}</span><span class="cp">⭐${r.p}</span><span class="cl">${r.l} lv</span></div>`).join('')||'<i>No players yet.</i>'}</div>
   <textarea id="cin" class="tin" rows="3" placeholder="Paste progress codes here (one or many, one per line)"></textarea>
   <div class="msg" id="cmsg">&nbsp;</div>
   <div class="row"><button class="btn" id="cim">Import codes</button><button class="btn alt" id="ccs">Copy as table (CSV)</button><button class="btn alt" id="cclr">Clear imported</button><button class="btn alt" id="cx">Close</button></div>`,'big');
  $('#cx',o).onclick=()=>o.remove();
  $('#cim',o).onclick=()=>{let n=0;$('#cin',o).value.split(/\s+/).forEach(c=>{const p=parseCode(c);if(p){if(!DB.users[p.n]){CLASS[p.n]=p;}n++;}});persist();o.remove();if(n)showClassLocal();else toast('No valid codes found');};
  $('#ccs',o).onclick=()=>{const head=['Name','Points','Levels',...REG.map(G=>G.name)];const csv=[head.join(',')].concat(list.map(r=>[r.n.replace(/,/g,' '),r.p,r.l,...REG.map(G=>(r.g||{})[G.id]||0)].join(','))).join('\n');copyText(csv,'Table copied — paste into Excel / Sheets');};
  $('#cclr',o).onclick=()=>{CLASS={};persist();o.remove();showClassLocal();};
}
