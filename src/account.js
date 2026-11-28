/* ---------- accounts, cloud sync, event log ---------- */
const PZC=window.PZ_CFG||{url:'',key:''};
const CLOUD=!!(PZC.url&&PZC.key);
let SYNC=CLOUD?'ok':'local';
const LS={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* sha-256 (WebCrypto when available, small JS fallback otherwise) */
function sha256js(m){const K=[];let p=2,n=0;const H=[];
  const isP=x=>{for(let i=2;i*i<=x;i++)if(x%i===0)return false;return true};
  while(n<64){if(isP(p)){if(n<8)H[n]=(Math.pow(p,.5)*4294967296)|0;K[n++]=(Math.pow(p,1/3)*4294967296)|0;}p++;}
  const b=unescape(encodeURIComponent(m)),l=b.length*8,w=[];
  for(let i=0;i<b.length;i++)w[i>>2]|=b.charCodeAt(i)<<(24-(i%4)*8);
  w[l>>5]|=0x80<<(24-l%32);w[(((l+64)>>9)<<4)+15]=l;
  for(let j=0;j<w.length;j+=16){const x=w.slice(j,j+16);let [a,b2,c,d,e,f,g,h]=H;
    for(let i=0;i<64;i++){if(i>=16){const g0=x[i-15],g1=x[i-2];x[i]=(x[i-16]+(((g0>>>7)|(g0<<25))^((g0>>>18)|(g0<<14))^(g0>>>3))+x[i-7]+(((g1>>>17)|(g1<<15))^((g1>>>19)|(g1<<13))^(g1>>>10)))|0;}
      const t1=(h+(((e>>>6)|(e<<26))^((e>>>11)|(e<<21))^((e>>>25)|(e<<7)))+((e&f)^(~e&g))+K[i]+x[i])|0,
      t2=((((a>>>2)|(a<<30))^((a>>>13)|(a<<19))^((a>>>22)|(a<<10)))+((a&b2)^(a&c)^(b2&c)))|0;
      h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b2;b2=a;a=(t1+t2)|0;}
    H[0]=(H[0]+a)|0;H[1]=(H[1]+b2)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0;}
  return H.map(v=>('00000000'+(v>>>0).toString(16)).slice(-8)).join('');}
async function sha256hex(str){
  try{if(window.crypto&&crypto.subtle){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(str));return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('');}}catch(e){}
  return sha256js(str);}
const pinHash=(name,pin)=>sha256hex('pz1:'+name.toLowerCase()+':'+pin);
const cleanName=n=>n.trim().replace(/\s+/g,' ').toUpperCase();
const validName=n=>/^[\p{L}\p{N}_ ]{2,16}$/u.test(n);

/* ---------- cloud calls ---------- */
async function rpc(fn,args){
  try{
    const r=await fetch(PZC.url.replace(/\/$/,'')+'/rest/v1/rpc/'+fn,{method:'POST',headers:Object.assign({'Content-Type':'application/json',apikey:PZC.key},PZC.key.startsWith('sb_')?{}:{Authorization:'Bearer '+PZC.key}),body:JSON.stringify(args)});
    if(!r.ok)return{ok:false,error:'server'};
    return await r.json();
  }catch(e){return{ok:false,error:'network'};}
}

/* ---------- merge two progress blobs ---------- */
function mergeData(a,b){
  const out={done:{},rv:{},plays:{},st:{}};
  [a,b].forEach(src=>{if(!src)return;
    for(const id in (src.done||{}))for(const l in src.done[id]){
      const r=src.done[id][l],cur=((out.done[id]=out.done[id]||{})[l]);
      if(!cur)out.done[id][l]=Object.assign({},r);
      else{const best=(r.n||0)>(cur.n||0)||((r.n||0)===(cur.n||0)&&(r.p||0)>(cur.p||0))?r:cur;
        const t=[cur.t,r.t].filter(x=>x!=null);out.done[id][l]=Object.assign({},best,{t:t.length?Math.min(...t):null});}
    }
    for(const k in (src.rv||{}))if(out.rv[k]==null)out.rv[k]=src.rv[k];
    for(const k in (src.plays||{}))out.plays[k]=Math.max(out.plays[k]||0,src.plays[k]||0);
    for(const g in (src.st||{})){const o=out.st[g]=out.st[g]||{l:{},k:{},e:{}},s=src.st[g];   /* counters only grow: keep the larger of each */
      for(const part of['l','k','e'])for(const x in (s[part]||{})){const v=s[part][x];
        if(typeof v==='number')o[part][x]=Math.max(o[part][x]||0,v);
        else{const c=o[part][x]=o[part][x]||{};for(const f in v)c[f]=Math.max(c[f]||0,v[f]||0);}}}
  });
  return out;
}
const dataOf=u=>({v:2,done:u.done,rv:u.rv||{},plays:u.plays||{},st:u.st||{}});

/* ---------- session ---------- */
const getSess=()=>LS.get('pz-sess',null);
const setSess=s=>{if(s)LS.set('pz-sess',s);else try{localStorage.removeItem('pz-sess')}catch(e){}};

function adoptUser(name,remoteData,h,legacyMerge){
  let u=DB.users[name];
  if(!u)u=DB.users[name]={created:Date.now(),done:{},rv:{},ev:[]};
  const m=mergeData(u,remoteData);u.done=m.done;u.rv=m.rv;u.plays=m.plays;u.st=m.st;u.h=CLOUD?undefined:h;if(!u.ev)u.ev=[];
  if(legacyMerge){const g=DB.users.Guest;if(g){const m2=mergeData(u,g);u.done=m2.done;u.rv=m2.rv;u.plays=m2.plays;u.st=m2.st;delete DB.users.Guest;}}
  DB.cur=name;done=u.done;
  setSess({name,h});LS.set('pz-last',name);persist();
}

async function nameFree(nameRaw){
  const name=cleanName(nameRaw);if(!validName(name))return{ok:false,state:'bad'};
  if(CLOUD){const r=await rpc('pz_name_free',{p_name:name});if(r&&r.ok)return{ok:true,state:r.free?'free':'taken'};return{ok:false,state:'unknown'};}
  return{ok:true,state:Object.keys(DB.users).some(k=>k.toLowerCase()===name.toLowerCase()&&k!=='Guest')?'taken':'free'};
}
async function doRegister(nameRaw,pin){
  const name=cleanName(nameRaw);
  if(!validName(name))return{ok:false,msg:'Name must be 2–16 letters or numbers.'};
  if(!/^\d{4}$/.test(pin))return{ok:false,msg:'PIN must be exactly 4 digits.'};
  const h=await pinHash(name,pin);
  let migrate=false;
  if(DB.users.Guest&&Object.keys(DB.users.Guest.done||{}).length)migrate=confirm('Move the progress saved under “Guest” on this device into your new account?');
  if(CLOUD){
    const r=await rpc('pz_register',{p_name:name,p_hash:h,p_data:{v:2,done:{},rv:{}}});
    if(!r.ok)return{ok:false,msg:r.error==='taken'?'That name is already taken. Please choose another one.':r.error==='network'?'Cannot reach the server. Check your internet and try again.':r.error==='bad_name'?'Name must be 2–16 letters or numbers.':'Could not register. Please try again.'};
    adoptUser(r.name||name,null,h,migrate);
  }else{
    if(Object.keys(DB.users).some(k=>k.toLowerCase()===name.toLowerCase()&&k!=='Guest'))return{ok:false,msg:'That name is already taken on this device. Please choose another one.'};
    adoptUser(name,null,h,migrate);
  }
  return{ok:true,name:DB.cur};
}
async function doLogin(nameRaw,pin){
  const name=cleanName(nameRaw);
  if(!name)return{ok:false,msg:'Please type your name.'};
  if(!/^\d{4}$/.test(pin))return{ok:false,msg:'PIN must be exactly 4 digits.'};
  const h=await pinHash(name,pin);
  if(CLOUD){
    const r=await rpc('pz_login',{p_name:name,p_hash:h});
    if(!r.ok)return{ok:false,msg:r.error==='no_user'?'No player with that name. Tap “New player” to register.':r.error==='bad_pin'?'Wrong PIN. Try again.':r.error==='locked'?'Too many wrong tries. Please wait 5 minutes.':r.error==='network'?'Cannot reach the server. Check your internet and try again.':'Could not log in. Please try again.'};
    adoptUser(r.name||name,r.data,h,false);
  }else{
    const key=Object.keys(DB.users).find(k=>k.toLowerCase()===name.toLowerCase()&&k!=='Guest');
    if(!key)return{ok:false,msg:'No player with that name on this device. Tap “New player” to register.'};
    const u=DB.users[key];
    if(u.h){if(u.h!==h)return{ok:false,msg:'Wrong PIN. Try again.'};}
    else if(u.pin){if(u.pin!==pin)return{ok:false,msg:'Wrong PIN. Try again.'};}
    adoptUser(key,null,h,false);
  }
  return{ok:true,name:DB.cur};
}
function logout(){setSess(null);DB.cur=null;done={};persist();renderMenu();if(ctx)goMenu();showLogin(true);}

/* ---------- login / register dialog (cannot be dismissed) ---------- */
function showLogin(first){
  document.querySelectorAll('.overlay').forEach(o=>o.remove());
  let mode=LS.get('pz-last',null)||Object.keys(DB.users).some(k=>k!=='Guest')?'in':'new';
  const o=ov('','login');const box=o.querySelector('.modal');
  function draw(){
    box.innerHTML=`<div class="big-emo">👋</div><h2>${mode==='in'?'Welcome back!':'Create your player'}</h2>
     <div class="seg"><button class="${mode==='in'?'on':''}" data-m="in">Log in</button><button class="${mode==='new'?'on':''}" data-m="new">New player</button></div>
     <input id="un" class="tin" maxlength="16" placeholder="YOUR NAME (CAPITAL LETTERS)" autocomplete="username" autocapitalize="characters" value="${mode==='in'?esc(LS.get('pz-last','')):''}">
     ${mode==='new'?'<div class="avail" id="avail">&nbsp;</div>':''}
     <input id="up" class="tin" type="password" maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="4-digit PIN" autocomplete="${mode==='in'?'current-password':'new-password'}">
     ${mode==='new'?'<input id="up2" class="tin" type="password" maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="Type the PIN again" autocomplete="off"><p class="small">Names are always in CAPITAL LETTERS. Pick a name nobody else uses and a PIN you can remember. Your PIN keeps your progress safe.</p>':''}
     <div class="msg" id="lmsg">&nbsp;</div><div class="row"><button class="btn" id="go">${mode==='in'?'Log in ▶':'Register & play ▶'}</button></div>
     <p class="small">${CLOUD?'☁ Your progress is saved online.':'📱 Your progress is saved on this device only.'}</p>`;
    box.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{mode=b.dataset.m;draw();});
    const go=async()=>{
      const n=$('#un',box).value,p=$('#up',box).value.trim(),msg=$('#lmsg',box),btn=$('#go',box);
      if(mode==='new'&&p!==$('#up2',box).value.trim()){msg.textContent='The two PINs are not the same.';return;}
      btn.disabled=true;msg.textContent='Please wait…';
      const r=mode==='in'?await doLogin(n,p):await doRegister(n,p);
      btn.disabled=false;
      if(!r.ok){msg.textContent=r.msg;return;}
      o.remove();renderMenu();toast('Hi '+r.name+'! 👋');
      if(CLOUD){flushEvents();}
    };
    const un=$('#un',box);un.oninput=()=>{const a=un.selectionStart,z=un.selectionEnd;un.value=un.value.toUpperCase();try{un.setSelectionRange(a,z)}catch(e){}};
    if(mode==='new'){let tm=null,seq=0;const av=$('#avail',box);
      const chk=()=>{clearTimeout(tm);const v=un.value.trim();if(!v){av.className='avail';av.innerHTML='&nbsp;';return;}av.className='avail';av.textContent='Checking…';
        tm=setTimeout(async()=>{const my=++seq,r=await nameFree(v);if(my!==seq)return;
          av.className='avail '+(r.state==='free'?'ok':'bad');
          av.textContent=r.state==='free'?'✅ This name is free':r.state==='taken'?'❌ This name is already taken — try another':r.state==='bad'?'Use 2–16 letters or numbers':'Could not check the name right now';},450);};
      un.addEventListener('input',chk);}
    $('#go',box).onclick=go;box.querySelectorAll('input').forEach(i=>i.onkeydown=e=>{if(e.key==='Enter')go();});
  }
  draw();
}

/* ---------- profile ---------- */
/* ---------- skill status: one row per knowledge point (levels of a game grouped by name) ---------- */
const STAGE_RE=/ · (warm-up|easy|medium|hard|tough)$/;
const BAND=d=>d==null?-1:d<=3?0:d<=6?1:2;            /* difficulty 1-10 (from the level tags) -> Easy / Medium / Hard */
const BAND_NAME=['Easy','Medium','Hard'];
function skillsOf(G){
  const m=new Map();
  G.levels.forEach((nm,i)=>{const k=String(nm).replace(STAGE_RE,'');if(!m.has(k))m.set(k,[]);m.get(k).push(i+1);});
  return [...m].map(([name,lvs])=>{
    const d=done[G.id]||{};
    let best=-1,any=false;                                   /* best = hardest difficulty band among the cleared levels */
    lvs.forEach(l=>{if(!d[l])return;any=true;const q=levelMeta(G,l);best=Math.max(best,q?BAND(q.diff):0);});
    return{name,achieved:any?Math.max(best,0):-1};
  });
}
function skillHtml(G){
  return skillsOf(G).map(s=>`<div class="srow"><span class="sn">${esc(s.name)}</span>${s.achieved>=0?`<span class="sbd sbd-${s.achieved}">${BAND_NAME[s.achieved]}</span>`:'<span class="sst">–</span>'}</div>`).join('');
}

function syncLabel(){return !CLOUD?'📱 Saved on this device':SYNC==='ok'?'☁ Saved online':SYNC==='pending'?'⏳ Saving…':'⚠ Offline — will sync when you are back online';}
function showProfile(gid){
  const u=me(),G=gid&&REG.find(x=>x.id===gid);
  const rows=G?`<h3 class="pgt">${G.emoji} ${esc(G.name)} — your level</h3><div class="sk">${skillHtml(G)}</div>`:'';
  const o=ov(`<h2>👤 ${esc(DB.cur)}</h2><p class="pbig">⭐ <b>${ptsOf(u)}</b> points · <b>${lvOf(u)}</b> levels cleared</p><p class="small" id="psync">${syncLabel()}</p><div class="plist">${rows}</div>
   <p class="small">Points: first clear of a level = 50 + 10 × level (up to level 20). Replaying a level gives +5.</p>
   <div class="row"><button class="btn" id="psw">Log out</button><button class="btn alt" id="pcl">🏫 Teacher board</button>${CLOUD?'':'<button class="btn alt" id="psh">📤 Share my progress</button>'}<button class="btn alt" id="prs">Reset my progress</button><button class="btn alt" id="pcx">Close</button></div>`,'big');
  $('#pcx',o).onclick=()=>o.remove();
  $('#psw',o).onclick=()=>{o.remove();logout();};
  const sh=$('#psh',o);if(sh)sh.onclick=()=>copyText(progressCode(),'Progress code copied — send it to your teacher');
  $('#pcl',o).onclick=()=>{o.remove();showClass();};
  let armed=false;$('#prs',o).onclick=function(){if(!armed){armed=true;this.textContent='Tap again to erase';return;}
    logEvent('account',0,'reset',{points:ptsOf(u),levels:lvOf(u)});
    u.done={};u.rv={};u.st={};done=u.done;persist();o.remove();renderMenu();toast('Progress reset');};
}

/* ---------- teacher board ---------- */
function showClass(){
  if(!CLOUD)return showClassLocal();
  const key=LS.get('pz-tkey','');
  const o=ov(`<h2>🏫 Teacher board</h2><p class="small">Enter the teacher key to see every player.</p>
   <input id="tk" class="tin" type="password" placeholder="Teacher key" value="${esc(key)}"><div class="msg" id="tmsg">&nbsp;</div>
   <div class="row"><button class="btn" id="tgo">Show players</button><button class="btn alt" id="tx">Close</button></div><div id="tout"></div>`,'big');
  $('#tx',o).onclick=()=>o.remove();
  $('#tgo',o).onclick=async()=>{
    const k=$('#tk',o).value;$('#tmsg',o).textContent='Loading…';
    const r=await rpc('pz_admin',{p_key:k});
    if(!r||r.ok===false){$('#tmsg',o).textContent=r&&r.error==='bad_key'?'Wrong teacher key.':'Could not load. Try again.';return;}
    LS.set('pz-tkey',k);$('#tmsg',o).innerHTML='&nbsp;';
    const list=(r.players||[]).map(p=>{const d=(p.data&&p.data.done)||{};let pts=0,lv=0;const g={};for(const id in d){g[id]=Object.keys(d[id]).length;lv+=g[id];for(const l in d[id])pts+=d[id][l].p||0;}
      return{n:p.name,p:pts,l:lv,g,seen:p.last_seen};}).sort((a,b)=>b.p-a.p);
    const ago=t=>{if(!t)return '–';const m=Math.round((Date.now()-new Date(t))/60000);return m<60?m+' min ago':m<1440?Math.round(m/60)+' h ago':Math.round(m/1440)+' d ago';};
    $('#tout',o).innerHTML=`<div class="ctab">${list.map((x,i)=>`<div class="crow"><span class="cr">${i+1}</span><span class="cn">${esc(x.n)}</span><span class="cp">⭐${x.p}</span><span class="cl">${x.l} lv</span><span class="cl">${ago(x.seen)}</span></div>`).join('')||'<i>No players yet.</i>'}</div>
     <div class="row"><button class="btn alt" id="tcsv">Copy as table (CSV)</button></div>`;
    $('#tcsv',o).onclick=()=>{const head=['Name','Points','Levels','Last seen',...REG.map(G=>G.name)];
      copyText([head.join(',')].concat(list.map(x=>[x.n.replace(/,/g,' '),x.p,x.l,x.seen||'',...REG.map(G=>x.g[G.id]||0)].join(','))).join('\n'),'Table copied — paste into Excel / Sheets');};
  };
}

/* ---------- saving progress online ---------- */
let syncT=null,syncing=false,dirty=false;
function syncSoon(){
  if(!CLOUD||!me()||!getSess())return;
  dirty=true;SYNC='pending';clearTimeout(syncT);syncT=setTimeout(pushNow,1500);
}
async function pushNow(){
  const s=getSess();if(!CLOUD||!s||!me()||syncing||!dirty)return;
  syncing=true;dirty=false;
  const r=await rpc('pz_save',{p_name:s.name,p_hash:s.h,p_data:dataOf(me())});
  syncing=false;
  if(r&&r.ok)SYNC=dirty?'pending':'ok';else{SYNC='offline';dirty=true;}
  const el2=document.getElementById('psync');if(el2)el2.textContent=syncLabel();
  if(dirty&&SYNC==='pending')syncT=setTimeout(pushNow,1500);
}
window.addEventListener('online',()=>{if(CLOUD){dirty=true;pushNow();flushEvents();}});
setInterval(()=>{if(CLOUD&&SYNC==='offline')pushNow();},20000);

/* ---------- event log: every answer detail worth analysing later ---------- */
function logEvent(game,level,kind,detail){
  const ev={g:game,l:level,k:kind,d:detail||{},at:Date.now()};
  const u=me();if(!u)return;
  if(CLOUD){const q=LS.get('pz-evq',[]);q.push(ev);if(q.length>2000)q.splice(0,q.length-2000);LS.set('pz-evq',q);evSoon();}
  else{u.ev=u.ev||[];u.ev.push(ev);if(u.ev.length>5000)u.ev.splice(0,u.ev.length-5000);try{localStorage.setItem('pz-v3',JSON.stringify(DB))}catch(e){}}
}
let evT=null,evBusy=false;
function evSoon(){clearTimeout(evT);evT=setTimeout(flushEvents,4000);}
async function flushEvents(){
  const s=getSess();if(!CLOUD||!s||evBusy)return;
  let q=LS.get('pz-evq',[]);if(!q.length)return;
  evBusy=true;const batch=q.slice(0,200);
  const r=await rpc('pz_log',{p_name:s.name,p_hash:s.h,p_events:batch});
  evBusy=false;
  if(r&&r.ok){q=LS.get('pz-evq',[]).slice(batch.length);LS.set('pz-evq',q);if(q.length)evSoon();}
}
document.addEventListener('visibilitychange',()=>{if(document.hidden){flushEvents();pushNow();}});

/* ---------- start-up ---------- */
async function bootAccount(){
  const s=getSess();
  if(s&&DB.users[s.name]){DB.cur=s.name;loadUser();
    if(CLOUD){
      const r=await rpc('pz_login',{p_name:s.name,p_hash:s.h});
      if(r&&r.ok){const u=me(),m=mergeData(u,r.data);u.done=m.done;u.rv=m.rv;u.plays=m.plays;u.st=m.st;done=u.done;LS.set('pz-v3',DB);dirty=true;pushNow();renderMenu();flushEvents();}
      else if(r&&(r.error==='bad_pin'||r.error==='no_user')){setSess(null);DB.cur=null;done={};showLogin(true);}
    }
  }else if(s&&CLOUD){ // session but no local cache: pull from the cloud
    const r=await rpc('pz_login',{p_name:s.name,p_hash:s.h});
    if(r&&r.ok){adoptUser(r.name||s.name,r.data,s.h,false);renderMenu();}else{setSess(null);showLogin(true);}
  }else{DB.cur=null;done={};showLogin(true);}
}
