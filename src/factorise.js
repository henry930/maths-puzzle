(function(){
const SETS1=['x','y','a','n','m','t'],SETS2=[['x','y'],['a','b'],['m','n'],['p','q']];
const r=(a,b)=>R(a,b),gcd=(a,b)=>b?gcd(b,a%b):a,gcdAll=a=>a.reduce(gcd);
const facs=n=>{const o=[];for(let i=1;i<=n;i++)if(n%i===0)o.push(i);return o;};
const SUP={2:'²',3:'³'},sup=e=>e===1?'':(SUP[e]||'^'+e);
const vs=p=>Object.keys(p).sort().map(k=>k+sup(p[k])).join('');
function fmtT(t,first,spaced){const neg=t.c<0,ac=Math.abs(t.c),v=vs(t.p),body=v?(ac===1?'':ac)+v:String(ac);
  if(first||!spaced)return(neg?'−':(first?'':'+'))+body;return(neg?' − ':' + ')+body;}
const fmtExpr=ts=>ts.map((t,i)=>fmtT(t,i===0,true)).join('');
const divT=(a,b)=>{const p={};for(const k in a.p){const e=a.p[k]-(b.p[k]||0);if(e>0)p[k]=e;}return{c:a.c/b.c,p};};
function parseMono(s,L){
  s=s.replace(/[−–]/g,'-').replace(/\s/g,'').replace(/²/g,'^2').replace(/³/g,'^3').replace(/^\+/,'');
  const lc=L.join('');const m=s.match(new RegExp('^(-?)(\\d*)((?:['+lc+'](?:\\^[2-9])?)*)$'));
  if(!m||(m[2]===''&&!m[3]))return null;
  const p={};const re=new RegExp('(['+lc+'])(\\^([2-9]))?','g');let x;
  while((x=re.exec(m[3])))p[x[1]]=(p[x[1]]||0)+(x[3]?+x[3]:1);
  return{c:(m[2]===''?1:+m[2])*(m[1]?-1:1),p};
}
const sameT=(a,b)=>{if(!a||a.c!==b.c)return false;const ka=Object.keys(a.p),kb=Object.keys(b.p);return ka.length===kb.length&&ka.every(k=>a.p[k]===b.p[k]);};
/* ---------- levels ---------- */
const LV=[
 {n:'Numbers only: 6x + 9',nT:2,H:[2,5],cv:[''],pool:['x',''],neg:0,L:1},
 {n:'Numbers only · with minus',nT:2,H:[2,6],cv:[''],pool:['x',''],neg:1,L:1},
 {n:'Numbers only · bigger numbers',nT:2,H:[6,12],cv:[''],pool:['x',''],neg:1,L:1},
 {n:'Numbers only · two letters',nT:2,H:[2,8],cv:[''],pool:['x','y'],neg:1,L:2},
 {n:'Take out the letter: x² + 3x',nT:2,H:[1,1],cv:['x'],pool:['x',''],neg:0,L:1},
 {n:'Number AND letter: 4x² + 6x',nT:2,H:[2,6],cv:['x'],pool:['x',''],neg:1,L:1},
 {n:'Two letters: 6xy + 9x',nT:2,H:[2,6],cv:['x'],pool:['y',''],neg:1,L:2},
 {n:'Three terms · numbers only',nT:3,H:[2,6],cv:[''],pool:['xx','x',''],neg:1,L:1},
 {n:'Three terms · with a letter',nT:3,H:[2,6],cv:['x'],pool:['xx','x',''],neg:1,L:1},
 {n:'A squared letter: x²',nT:2,H:[1,6],cv:['xx'],pool:['x','','y'],neg:1,L:2},
 {n:'Either letter can be taken out',nT:2,H:[2,8],cv:['x','y'],pool:['x','y','xy',''],neg:1,L:2},
 {n:'Take out xy',nT:2,H:[1,8],cv:['xy'],pool:['x','y','xy',''],neg:1,L:2},
 {n:'Three terms · two letters',nT:3,H:[2,6],cv:['x','y','xy'],pool:['x','y','xy',''],neg:1,L:2},
 {n:'Bigger numbers · up to 12',nT:3,H:[6,12],cv:['x','y','xy'],pool:['x','y','xy','xx',''],neg:1,L:2},
 {n:'Four terms',nT:4,H:[2,6],cv:['x'],pool:['xx','x','y',''],neg:1,L:2},
 {n:'Four terms · two letters',nT:4,H:[2,8],cv:['x','y','xy'],pool:['x','y','xy','xx','yy',''],neg:1,L:2},
 {n:'Squares and products',nT:3,H:[2,8],cv:['xx','xy','yy'],pool:['x','y','',],neg:1,L:2},
 {n:'Boss: anything goes!',nT:4,H:[2,12],cv:['x','y','xy','xx'],pool:['x','y','xy','xx','yy',''],neg:1,L:2}
];
const cnt=s=>{const p={};for(const ch of s)p[ch]=(p[ch]||0)+1;return p;};
function gen(spec){
  for(let at=0;at<500;at++){
    const H=r(spec.H[0],spec.H[1]),cvS=spec.cv[r(0,spec.cv.length-1)],cv=cnt(cvS);
    const pool=spec.pool.slice(),shapes=[];
    while(shapes.length<spec.nT&&pool.length){shapes.push(pool.splice(r(0,pool.length-1),1)[0]);}
    if(shapes.length<spec.nT)continue;
    const sh=shapes.map(cnt);
    let ok=true;for(const k in cv){if(!sh.some(s=>!s[k]))ok=false;} // keep the common power exactly what we chose
    // letters shared by every shape beyond cv would increase the common factor
    const all=new Set(shapes.join('').split(''));for(const k of all){if(sh.every(s=>s[k])&&!cv[k])ok=false;}
    if(!ok)continue;
    const ks=shapes.map(()=>r(1,7));if(gcdAll(ks)!==1)continue;
    const terms=shapes.map((s,i)=>{const p={};for(const k in cv)p[k]=(p[k]||0)+cv[k];for(const k in sh[i])p[k]=(p[k]||0)+sh[i][k];return{c:H*ks[i],p};});
    if(terms.some(t=>Object.values(t.p).some(e=>e>3)))continue;
    terms.sort((a,b)=>Object.values(b.p).reduce((x,y)=>x+y,0)-Object.values(a.p).reduce((x,y)=>x+y,0)||vs(a.p).localeCompare(vs(b.p)));
    terms.forEach((t,i)=>{if(i>0&&spec.neg&&Math.random()<.5)t.c=-t.c;});
    return{terms,H,cv};
  }
  return null;
}
window.__fx={LV,gen,fmtExpr,parseMono};
const mulT=(a,b)=>{const p=Object.assign({},a.p);for(const k in b.p)p[k]=(p[k]||0)+b.p[k];return{c:a.c*b.c,p};};
const blkT=s=>{if(/^\d+$/.test(s))return{c:+s,p:{}};const m=s.match(/^([a-z])([²³]?)$/);return{c:1,p:{[m[1]]:m[2]==='²'?2:m[2]==='³'?3:1}}};
const reqOf=t=>{const o=facs(Math.abs(t.c)).filter(n=>n>1).map(String);for(const k of Object.keys(t.p).sort())for(let e=1;e<=t.p[k];e++)o.push(k+sup(e));return o;};
const divides=(b,t)=>Math.abs(t.c)%b.c===0&&Object.keys(b.p).every(k=>(t.p[k]||0)>=b.p[k]);
const common=ts=>{const c=gcdAll(ts.map(t=>Math.abs(t.c))),p={};Object.keys(ts[0].p).forEach(k=>{const e=Math.min(...ts.map(t=>t.p[k]||0));if(e>0)p[k]=e;});return{c,p};};

function factAnim(hw,g){
  hw.innerHTML=`<div class="fa"><div class="fa-card" id="fac"><div class="fa-l1"><span class="fa-t" id="fa1"></span><span class="fa-pl">+</span><span class="fa-t" id="fa2"></span></div><div class="fa-l2" id="fal2"></div><div class="fa-bub" id="fab"></div><span class="fa-hand" id="fah">👆</span></div><div class="fa-cap" id="facap"></div><div class="fa-foot"><span class="fa-dots" id="fad"></span><span><button class="fa-rp" id="fav"></button> <button class="fa-rp" id="farp">↻ Replay</button> <button class="fa-tx" id="fatx">📖 Steps</button></span></div><div class="fa-how" id="fahow" hidden></div></div>`;
  const q=id=>hw.querySelector('#'+id),card=q('fac'),t1=q('fa1'),t2=q('fa2'),l2=q('fal2'),bub=q('fab'),hand=q('fah'),cap=q('facap'),dots=q('fad'),vb=q('fav');
  q('fahow').textContent=g.how;let tm=[],stopped=false,gen=0;
  const SS=window.speechSynthesis,CAN=!!(SS&&window.SpeechSynthesisUtterance);
  let voiceOn=CAN;try{if(localStorage.getItem('pz-voice')==='0')voiceOn=false;}catch(e){}
  let blocked=false;
  dots.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i>';
  const dot=n=>[...dots.children].forEach((d,i)=>d.classList.toggle('on',i<=n));
  const pop=e=>{e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop');};
  const go=(el,dx)=>{const r=el.getBoundingClientRect(),c=card.getBoundingClientRect();hand.style.left=(r.left-c.left+r.width/2-10+(dx||0))+'px';hand.style.top=(r.top-c.top+r.height-6)+'px';};
  const tap=()=>{hand.classList.remove('tap');void hand.offsetWidth;hand.classList.add('tap');};
  const vbLabel=()=>{if(!CAN){vb.style.display='none';return;}vb.textContent=!voiceOn?'🔇 Voice off':blocked?'🔊 Tap to hear':'🔊 Voice on';};
  function pickVoice(){const vs=SS.getVoices().filter(v=>/^en/i.test(v.lang));if(!vs.length)return null;
    const score=v=>(/en-GB/i.test(v.lang)?4:/en-US|en-AU|en-IE/i.test(v.lang)?2:0)+(/natural|neural|premium|enhanced|google|samantha|serena|daniel|karen|libby|sonia|aria|jenny/i.test(v.name)?3:0)+(/female|libby|sonia|serena|samantha|karen|aria|jenny/i.test(v.name)?1:0);
    return vs.slice().sort((a,b)=>score(b)-score(a))[0];}
  const at=(ms,fn)=>tm.push(setTimeout(()=>{if(!stopped)fn();},ms));
  // steps: do() runs when the step starts (it can schedule sub-actions with at()); say is spoken; min = least time (ms) in silent mode
  const STEPS=[
   {say:"Let's factorise thirty x plus twenty five.",cap:'Factorise 30x + 25',min:3800,d:0,do(){t1.className='fa-t';t2.className='fa-t';t1.innerHTML='30x';t2.innerHTML='25';l2.className='fa-l2';l2.innerHTML='';bub.className='fa-bub';hand.style.left='72%';hand.style.top='72%';}},
   {say:"First, tap a term.",cap:'① Tap a term',min:3600,d:1,do(){at(500,()=>go(t1));at(1800,()=>{tap();t1.classList.add('sel');});}},
   {say:"Type one of its factors. Five divides thirty, so type five.",cap:'② Type a factor: 5',min:5200,d:2,do(){bub.innerHTML='Factors of 30x <span class="fa-ty"></span>';bub.classList.add('on');at(2200,()=>{bub.querySelector('.fa-ty').textContent='5';});}},
   {say:"Thirty x becomes five times six x.",cap:'30x = 5 × 6x',min:4000,d:3,do(){bub.classList.remove('on');t1.classList.remove('sel');t1.innerHTML='5 × 6x';pop(t1);}},
   {say:"Now tap the other term.",cap:'③ Tap the other term',min:3400,d:3,do(){at(400,()=>go(t2));at(1700,()=>tap());}},
   {say:"Five divides twenty five too, so it splits by itself.",cap:'5 fits here too — it splits by itself!',min:4800,d:4,do(){t2.innerHTML='5 × 5';pop(t2);}},
   {say:"When every term has the same factor, that factor turns green.",cap:'④ Same factor in every term turns green',min:5200,d:4,do(){t1.innerHTML='<i class="fa-g">5</i> × 6x';t2.innerHTML='<i class="fa-g">5</i> × 5';}},
   {say:"Tap the green factor.",cap:'⑤ Tap the green factor',min:3600,d:5,do(){at(500,()=>go(t1.querySelector('.fa-g'),-2));at(1900,()=>tap());}},
   {say:"And that's it. Thirty x plus twenty five equals five times, six x plus five.",cap:'30x + 25 = 5(6x + 5)',min:5600,d:5,do(){l2.innerHTML='= <b>5</b>(6x + 5)';l2.classList.add('on');pop(l2);}}
  ];
  function speak(text,onDone){
    let done=false;const fin=()=>{if(!done){done=true;onDone();}};
    try{SS.cancel();const u=new SpeechSynthesisUtterance(text);const v=pickVoice();if(v){u.voice=v;u.lang=v.lang;}else u.lang='en-GB';u.rate=.88;u.pitch=1;
      let started=false;u.onstart=()=>{started=true;if(blocked){blocked=false;vbLabel();}};u.onend=fin;u.onerror=()=>{if(!started){blocked=true;vbLabel();}fin();};
      SS.speak(u);
      at(1500,()=>{if(!started&&!done){blocked=true;vbLabel();try{SS.cancel();}catch(e){}fin();}});
      at(Math.max(6000,text.length*160),fin); // safety
    }catch(e){blocked=true;vbLabel();fin();}
  }
  function runFrom(i,myGen){
    if(stopped||myGen!==gen)return;
    if(i>=STEPS.length){at(3500,()=>run());return;}
    const s=STEPS[i];s.do();cap.textContent=s.cap;dot(s.d);
    const start=Date.now();let proceed=false;
    const next=()=>{if(proceed||myGen!==gen)return;proceed=true;const wait=Math.max(0,s.min-(Date.now()-start))*(voiceOn&&!blocked?0:1);at(wait+(voiceOn&&!blocked?900:0),()=>runFrom(i+1,myGen));};
    if(voiceOn&&CAN&&!blocked)speak(s.say,next);else at(s.min,next);
  }
  function run(){
    gen++;tm.forEach(clearTimeout);tm=[];if(CAN){try{SS.cancel();}catch(e){}}
    vbLabel();runFrom(0,gen);
  }
  vb.onclick=()=>{if(blocked&&voiceOn){blocked=false;}else voiceOn=!voiceOn;try{localStorage.setItem('pz-voice',voiceOn?'1':'0');}catch(e){}vbLabel();run();};
  q('farp').onclick=()=>{blocked=false;run();};
  q('fatx').onclick=()=>{const h=q('fahow');h.hidden=!h.hidden;};
  if(CAN&&SS.onvoiceschanged!==undefined)SS.onvoiceschanged=()=>{};
  vbLabel();setTimeout(()=>{if(!stopped)run();},50);
  return()=>{stopped=true;gen++;tm.forEach(clearTimeout);if(CAN){try{SS.cancel();}catch(e){}}};
}
REG.push({id:'factorise',name:'Factorise It!',emoji:'🧩',color:'#7048e8',cat:'Algebra',
 desc:'Factorise expressions like 30x + 25. Tap a number or letter and break it into factors (30x → 5 × 6x → 5 × 2 × 3x…). When the same factor shows up in every term, press Factorise. Repeat until it cannot be simplified any more.',skills:['factorising','highest common factor','algebra','prime factors'],
 levels:LV.map(l=>l.n),
 how:'Tap a part of a term and enter one of its factors on the number pad — a number, a letter, or both together (for 9n² you can enter 9, n, n² or 9n). It splits into factor × something, e.g. 30x → 5 × 6x. If the next term you tap has that same factor, it splits automatically; otherwise you enter its factor yourself. Tap any part again to split it further (6x → 2 × 3x). Tap a × to join two parts back together. A split only lasts about 30 seconds. When the same factor appears in EVERY term, the common factor turns green — tap it and the factorised expression appears on the next line. Keep going until nothing more can be taken out.',
 art:'<div class="minibal">6(2x+3)</div>',anim:factAnim,
 mount(root,lv,ctx){
  const spec=LV[lv-1];let terms,orig,L,CF,chains,tok,selI,selJ,buf,steps,ended,lastBlk,lastI;const timers=[];
  root.innerHTML=`<div class="fx" id="fxr"><div class="fx-top" id="fxt"></div><div class="fx-stage" id="fxs"></div><div class="msg" id="fxm">&nbsp;</div>
   <div class="toolrow"><button class="btn alt" id="fxh">💡 Hint</button><button class="btn alt" id="fxn">New question ⏭</button></div></div><div class="fxp" id="fxpad" style="display:none"></div>`;
  const msg=h=>{const a=$('#fxm'),b=$('#fxpm');if(a)a.innerHTML=h||'&nbsp;';if(b)b.innerHTML=h||'&nbsp;';};
  const cp=ts=>ts.map(t=>({c:t.c,p:Object.assign({},t.p)}));
  const clearTimers=()=>{timers.splice(0).forEach(clearTimeout);};
  const absT=t=>({c:Math.abs(t.c),p:Object.assign({},t.p)});
  function build(){
    let q;do{q=gen(spec);}while(!q);
    const set=spec.L===1?[pick(SETS1)]:pick(SETS2),mp={x:set[0],y:set[1]||set[0]};
    terms=q.terms.map(t=>{const p={};for(const k in t.p){const nk=mp[k]||k;p[nk]=(p[nk]||0)+t.p[k];}return{c:t.c,p};});
    L=[...new Set(terms.flatMap(t=>Object.keys(t.p)))].sort();
    orig=cp(terms);CF={c:1,p:{}};steps=[];ended=false;selI=-1;selJ=-1;msg('');startRound();
  }
  function startRound(){lastBlk=null;lastI=-1;clearTimers();chains=terms.map(t=>[absT(t)]);tok=terms.map(()=>0);selI=-1;selJ=-1;buf='';render();closePad();}
  const shownBuf=()=>buf.replace(/\^2/g,'²').replace(/\^3/g,'³');
  const tkTxt=tk=>fmtT(tk,true);
  const leadOf=(t,i)=>t.c<0?(i===0?'−':'− '):(i===0?'':'+ ');
  function commonD(){
    if(!chains)return null;const keyOf=tk=>tkTxt(tk);
    const cnts=chains.map(ch=>{const m={};ch.forEach(tk=>{const k=keyOf(tk);m[k]=(m[k]||0)+1;});return m;});
    let D={c:1,p:{}},any=false;
    Object.keys(cnts[0]).forEach(k=>{const n=Math.min(...cnts.map(m=>m[k]||0));if(n>0){const tk=chains[0].find(x=>keyOf(x)===k);for(let r=0;r<n;r++){D=mulT(D,tk);any=true;}}});
    return any?D:null;
  }
  const commonBlk=()=>{const d=commonD();return d?fmtT(d,true):null;};
  function comMap(){ // which tokens are the common factor
    const d=ended?null:commonD();const res=chains.map(ch=>ch.map(()=>false));if(!d)return res;
    const cnts=chains.map(ch=>{const m={};ch.forEach(tk=>{const k=tkTxt(tk);m[k]=(m[k]||0)+1;});return m;});
    const need={};Object.keys(cnts[0]).forEach(k=>{const n=Math.min(...cnts.map(m=>m[k]||0));if(n>0)need[k]=n;});
    chains.forEach((ch,i)=>{const left=Object.assign({},need);ch.forEach((tk,j)=>{const k=tkTxt(tk);if(left[k]>0){left[k]--;res[i][j]=true;}});});
    return res;
  }
  const pills=ts=>{const cm=comMap();return ts.map((t,i)=>`<span class="fx-tw">${leadOf(t,i)}${chains[i].map((tk,j)=>`<span class="fx-tk${!ended&&i===selI&&j===selJ?' cur':''}${cm[i][j]?' com':''}" data-i="${i}" data-j="${j}">${tkTxt(tk)}</span>`).join('<span class="fx-x"> × </span>')}</span>`).join(' ');};
  function topHtml(){
    const btn='';
    let h=`<div class="fx-expr">${steps.length?fmtExpr(orig):pills(terms)+btn}</div>`;
    steps.forEach((s,k)=>{const last=k===steps.length-1;
      h+=`<div class="fx-step${last?' last':''}">= <span class="fx-out">${fmtT(s.CF,true)}</span>(${last&&!ended?pills(s.terms):fmtExpr(s.terms)})${last&&!ended?btn:''}</div>`;});
    return h;
  }
  function render(){
    $('#fxt').innerHTML=topHtml();updV();
    $('#fxt').querySelectorAll('.fx-tk').forEach(e=>e.onclick=()=>{if(e.classList.contains('com'))doFactorise();else tapToken(+e.dataset.i,+e.dataset.j);});
    $('#fxt').querySelectorAll('.fx-tw').forEach(w=>{const i=[...$('#fxt').querySelectorAll('.fx-tw')].indexOf(w);w.querySelectorAll('.fx-x').forEach((x,j)=>x.onclick=()=>merge(i,j));});
    $('#fxs').innerHTML=ended?`<div class="ex-res"><span class="ex-eq">Fully factorised! Nothing more can be taken out.</span></div>`:'';
  }
  function tapToken(i,j){
    if(ended)return;
    if(lastBlk&&i!==lastI){
      const tk=chains[i][j],key=fmtT(lastBlk,true),rest=divT(tk,lastBlk);
      if(!chains[i].some(x=>tkTxt(x)===key)&&divides(lastBlk,tk)&&!(rest.c===1&&!Object.keys(rest.p).length)){
        chains[i].splice(j,1,lastBlk,rest);touch(i);selI=-1;selJ=-1;buf='';closePad();render();
        const d=commonD();msg(d?`✅ ${fmtT(d,true)} is in every term — tap the green factor!`:`✅ ${key} is a factor of this term too: ${tkTxt(tk)} = ${key} × ${fmtT(rest,true)}`);return;}
    }
    openPad(i,j);
  }
  function openPad(i,j){
    if(ended)return;selI=i;selJ=j;buf='';const pad=$('#fxpad');
    pad.style.display='';$('#fxr').classList.add('padopen');
    pad.innerHTML=`<div class="fxp-h"><span class="fxp-t">Factors of <b>${tkTxt(chains[i][j])}</b></span><span class="fxp-v" id="fxv"></span><button class="fxp-x" id="fxx">✕</button></div><div class="msg" id="fxpm">&nbsp;</div><div class="ex-pad" id="fxk"></div>`;
    $('#fxx').onclick=closePad;
    ['7','8','9','del','4','5','6','sq2','1','2','3','sq3','0',...L].forEach(k=>{const b=el('button','key'+(k==='del'?' del':'')+(L.includes(k)?' var':''),k==='del'?'⌫':k==='sq2'?'²':k==='sq3'?'³':k);b.onclick=()=>press(k);$('#fxk').appendChild(b);});
    const ok=el('button','key ok','Add ✓');ok.style.gridColumn='1 / -1';ok.onclick=()=>press('ok');$('#fxk').appendChild(ok);
    render();
    setTimeout(()=>{const t=document.getElementById('fxt');if(t)window.scrollBy(0,t.getBoundingClientRect().top-12);},30);
  }
  function closePad(){const pad=$('#fxpad');if(!pad)return;pad.style.display='none';pad.innerHTML='';const r=$('#fxr');if(r)r.classList.remove('padopen');if(selI!==-1){selI=-1;selJ=-1;buf='';if(terms&&chains)render();}}
  function updV(){const v=document.getElementById('fxv');if(v)v.textContent=shownBuf();}
  function press(k){
    if(ended||selI<0||document.querySelector('.overlay'))return;
    if(k==='del')buf=/\^[23]$/.test(buf)?buf.slice(0,-2):buf.slice(0,-1);
    else if(k==='sq2'||k==='sq3'){if(/[a-z]$/.test(buf))buf+='^'+k[2];}
    else if(L.includes(k)){if(!buf.includes(k))buf+=k;}
    else if(k==='ok')return add();
    else if(/^\d$/.test(k)){if(!/[a-z]/.test(buf)&&buf.length<3)buf+=k;}
    updV();
  }
  function touch(i){const my=++tok[i];timers.push(setTimeout(()=>{if(tok[i]===my&&chains[i].length>1){chains[i]=[absT(terms[i])];render();}},30000));}
  function add(){
    const i=selI,j=selJ,tk=chains[i][j];
    const m=buf?parseMono(buf,L):null;
    if(!m||m.c<1){msg('Enter a number, letters, or both (like 9, n or 9n). Use ² for a square.');return;}
    const blk={c:m.c,p:m.p},canon=fmtT(blk,true);
    if(blk.c===1&&!Object.keys(blk.p).length){msg('1 divides everything, so it is no use here.');buf='';return updV();}
    if(!divides(blk,tk)){
      const bad=Math.abs(tk.c)%blk.c!==0?`${blk.c} does not divide ${tk.c} exactly.`:`${canon} is not part of ${tkTxt(tk)}.`;
      msg('❌ '+bad);ctx.log('wrong',{stage:'split',term:fmtT(terms[i],true),part:tkTxt(tk),typed:canon,type:'not_a_factor'});buf='';return updV();}
    const rest=divT(tk,blk);
    if(rest.c===1&&!Object.keys(rest.p).length){msg(`${canon} is the whole thing — enter a smaller factor.`);buf='';return updV();}
    chains[i].splice(j,1,blk,rest);lastBlk=blk;lastI=i;touch(i);buf='';selI=-1;selJ=-1;closePad();render();
    const d=commonD();msg(d?`✅ ${fmtT(d,true)} is in every term — tap the green factor!`:`✅ ${tkTxt(tk)} = ${canon} × ${fmtT(rest,true)}`);
  }
  function merge(i,j){
    if(ended)return;const a=chains[i][j],b=chains[i][j+1];if(!a||!b)return;
    chains[i].splice(j,2,mulT(a,b));if(chains[i].length>1)touch(i);selI=-1;selJ=-1;if(document.getElementById('fxpad').style.display!=='none')closePad();render();msg('');
  }
  function doFactorise(){
    const blk=commonD();if(!blk||ended)return;const cb=fmtT(blk,true);
    CF=mulT(CF,blk);terms=terms.map(t=>divT(t,blk));
    steps.push({CF:{c:CF.c,p:Object.assign({},CF.p)},terms:cp(terms)});clearTimers();
    const cm=common(terms);
    if(cm.c===1&&!Object.keys(cm.p).length){ended=true;selI=-1;closePad();render();msg(`✅ Factorised by ${cb} — nothing more to take out!`);return finish();}
    startRound();msg(`✅ Factorised by ${cb}. Is there more to take out?`);
  }
  function finish(){const res=`${fmtT(CF,true)}(${fmtExpr(terms)})`;
    ctx.timeout(()=>ctx.win('Factorised!',`${fmtExpr(orig)} = ${res}`,build,'New question'),1000);}
  $('#fxh').onclick=()=>msg('💡 Tap a part of a term and enter one of its factors (a number like 3, a letter like n, or both like 3n). Keep splitting until the SAME factor shows up in every term, then tap the green factor.');
  $('#fxn').onclick=build;
  ctx.cleanups&&ctx.cleanups.push(()=>{clearTimers();const p=document.getElementById('fxpad');if(p)p.remove();});
  ctx.keys=e=>{const k=e.key.toLowerCase();if(k==='escape')return closePad();if(/^[0-9]$/.test(k))press(k);else if(L&&L.includes(k))press(k);else if(k==='^')press('sq2');else if(k==='backspace')press('del');else if(k==='enter')press('ok');};
  window.__fxq=()=>({get terms(){return terms},get chains(){return chains},get ended(){return ended},get steps(){return steps},get CF(){return CF},press,select:openPad,tap:tapToken,close:closePad,common,commonBlk,factorise:doFactorise,merge,reqTok:(i,j)=>reqOf(chains[i][j]),expire:i=>{chains[i]=[absT(terms[i])];render();}});
  build();
 }});
})();
