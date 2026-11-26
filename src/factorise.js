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
REG.push({id:'factorise',name:'Factorise It!',emoji:'🧩',color:'#7048e8',cat:'Algebra',
 desc:'Factorise expressions like 12x² + 18x. Tap a term, enter its factors on the number pad — they appear as small blocks on the term. As soon as one factor is found in every term, the expression factorises itself — keep going until it cannot be simplified any more.',skills:['factorising','highest common factor','algebra','dividing terms'],
 levels:LV.map(l=>l.n),
 how:'Tap a term in the expression and the number pad opens. Enter one of its factors (a number, or a letter with its power like x²) and press Add — it appears as a small block on the corner of the term. Close the pad with ✕. As soon as the same factor is on EVERY term, the expression factorises, the blocks clear and a new line begins. Keep going until nothing more can be taken out.',
 art:'<div class="minibal">6(2x+3)</div>',
 mount(root,lv,ctx){
  const spec=LV[lv-1];let terms,orig,L,CF,lists,sel,buf,steps,ended;
  root.innerHTML=`<div class="fx" id="fxr"><div class="fx-top" id="fxt"></div><div class="fx-stage" id="fxs"></div><div class="msg" id="fxm">&nbsp;</div>
   <div class="toolrow"><button class="btn alt" id="fxh">💡 Hint</button><button class="btn alt" id="fxn">New question ⏭</button></div></div><div class="fxp" id="fxpad" style="display:none"></div>`;
  const msg=h=>{const a=$('#fxm'),b=$('#fxpm');if(a)a.innerHTML=h||'&nbsp;';if(b)b.innerHTML=h||'&nbsp;';};
  const cp=ts=>ts.map(t=>({c:t.c,p:Object.assign({},t.p)}));
  function build(){
    let q;do{q=gen(spec);}while(!q);
    const set=spec.L===1?[pick(SETS1)]:pick(SETS2),mp={x:set[0],y:set[1]||set[0]};
    terms=q.terms.map(t=>{const p={};for(const k in t.p){const nk=mp[k]||k;p[nk]=(p[nk]||0)+t.p[k];}return{c:t.c,p};});
    L=[...new Set(terms.flatMap(t=>Object.keys(t.p)))].sort();
    orig=cp(terms);CF={c:1,p:{}};steps=[];ended=false;sel=-1;msg('');startRound();
  }
  function startRound(){lists=terms.map(()=>({found:[]}));sel=-1;buf='';render();closePad();}
  const shownBuf=()=>buf.replace(/\^2/g,'²').replace(/\^3/g,'³');
  const tmTxt=(t,i)=>fmtT(t,i===0,true).trim();
  const pills=ts=>ts.map((t,i)=>`<span class="fx-tw" data-i="${i}"><span class="fx-sup">${lists[i].found.map(f=>`<i class="fx-sb">${f}</i>`).join('')}${i===sel&&buf?`<i class="fx-sb live">${shownBuf()}</i>`:''}</span><span class="fx-ln${i===sel&&!ended?' on':''}${lists[i].found.length?' has':''}"></span><span class="fx-tm${!ended&&i===sel?' cur':''}">${tmTxt(t,i)}</span></span>`).join(' ');
  function topHtml(){
    let h=`<div class="fx-expr">${steps.length?fmtExpr(orig):pills(terms)}</div>`;
    steps.forEach((s,k)=>{const last=k===steps.length-1;
      h+=`<div class="fx-step${last?' last':''}">= <span class="fx-out">${fmtT(s.CF,true)}</span>(${last&&!ended?pills(s.terms):fmtExpr(s.terms)})</div>`;});
    return h;
  }
  function render(){
    $('#fxt').innerHTML=topHtml();
    $('#fxt').querySelectorAll('.fx-tw').forEach(e=>e.onclick=()=>openPad(+e.dataset.i));
    $('#fxs').innerHTML=ended?`<div class="ex-res"><span class="ex-eq">Fully factorised! Nothing more can be taken out.</span></div>`:'';
  }
  function openPad(i){
    if(ended)return;sel=i;buf='';const pad=$('#fxpad');
    pad.style.display='';$('#fxr').classList.add('padopen');
    pad.innerHTML=`<div class="fxp-h"><span class="fxp-t" id="fxpt">Factors of <b>${fmtT(terms[i],true)}</b></span><button class="fxp-x" id="fxx">✕</button></div><div class="msg" id="fxpm">&nbsp;</div><div class="ex-pad" id="fxk"></div>`;
    $('#fxx').onclick=closePad;
    ['7','8','9','del','4','5','6','sq2','1','2','3','sq3','0',...L].forEach(k=>{const b=el('button','key'+(k==='del'?' del':'')+(L.includes(k)?' var':''),k==='del'?'⌫':k==='sq2'?'²':k==='sq3'?'³':k);b.onclick=()=>press(k);$('#fxk').appendChild(b);});
    const ok=el('button','key ok','Add ✓');ok.style.gridColumn='1 / -1';ok.onclick=()=>press('ok');$('#fxk').appendChild(ok);
    render();
    setTimeout(()=>{const t=document.getElementById('fxt');if(t)window.scrollBy(0,t.getBoundingClientRect().top-12);},30);
  }
  function closePad(){const pad=$('#fxpad');if(!pad)return;pad.style.display='none';pad.innerHTML='';const r=$('#fxr');if(r)r.classList.remove('padopen');if(sel!==-1){sel=-1;buf='';if(terms)render();}}
  function press(k){
    if(ended||sel<0||document.querySelector('.overlay'))return;
    if(k==='del')buf=/\^[23]$/.test(buf)?buf.slice(0,-2):buf.slice(0,-1);
    else if(k==='sq2'||k==='sq3'){if(/^[a-z]$/.test(buf))buf+='^'+k[2];}
    else if(L.includes(k)){if(buf==='')buf=k;}
    else if(k==='ok')return add();
    else if(/^\d{0,2}$/.test(buf)&&/^\d$/.test(k))buf+=k;
    render();
  }
  function add(){
    const t=terms[sel],ls=lists[sel],req=reqOf(t);let canon=null;
    if(/^\d{1,3}$/.test(buf))canon=String(+buf);
    else{const m=parseMono(buf,L);if(m&&m.c===1&&Object.keys(m.p).length===1){const k=Object.keys(m.p)[0];canon=k+sup(m.p[k]);}}
    if(canon==null){msg('Enter a number, or a letter with its power (x, x²).');return;}
    if(canon==='1'){msg('1 divides everything, so you do not need to add it.');buf='';return render();}
    if(ls.found.includes(canon)){msg('You already have '+canon+'.');buf='';return render();}
    if(!req.includes(canon)){
      msg('❌ '+(/^\d+$/.test(canon)?`${canon} does not divide ${Math.abs(t.c)} exactly.`:`${canon} is not part of ${fmtT(t,true)}.`));
      ctx.log('wrong',{stage:'list',term:fmtT(t,true),typed:canon,type:'not_a_factor'});buf='';return render();}
    ls.found.push(canon);
    ls.found.sort((a,b)=>(/^\d/.test(a)?0:1)-(/^\d/.test(b)?0:1)||(parseFloat(a)||0)-(parseFloat(b)||0)||a.localeCompare(b));
    buf='';
    if(lists.every(l=>l.found.includes(canon)))return factorise(canon);
    render();msg('✅ '+canon);
  }
  function factorise(canon){
    const blk=blkT(canon);CF=mulT(CF,blk);terms=terms.map(t=>divT(t,blk));
    steps.push({CF:{c:CF.c,p:Object.assign({},CF.p)},terms:cp(terms)});
    const cm=common(terms);
    if(cm.c===1&&!Object.keys(cm.p).length){ended=true;sel=-1;closePad();render();msg(`✅ ${canon} is in every term — factorised!`);return finish();}
    startRound();msg(`✅ ${canon} is on every term — factorised! Is there more to take out?`);
  }
  function finish(){const res=`${fmtT(CF,true)}(${fmtExpr(terms)})`;
    ctx.timeout(()=>ctx.win('Factorised!',`${fmtExpr(orig)} = ${res}`,build,'New question'),1000);}
  $('#fxh').onclick=()=>msg('💡 Tap a term to open the number pad, then add its factors (numbers like 2, 3, 6 — or letters like x, x²). When the SAME factor is on every term, the expression factorises itself.');
  $('#fxn').onclick=build;
  ctx.cleanups&&ctx.cleanups.push(()=>{const p=document.getElementById('fxpad');if(p)p.remove();});
  ctx.keys=e=>{const k=e.key.toLowerCase();if(k==='escape')return closePad();if(/^[0-9]$/.test(k))press(k);else if(L&&L.includes(k))press(k);else if(k==='^')press('sq2');else if(k==='backspace')press('del');else if(k==='enter')press('ok');};
  window.__fxq=()=>({get terms(){return terms},get sel(){return sel},get ended(){return ended},get lists(){return lists},get steps(){return steps},get CF(){return CF},press,select:openPad,close:closePad,common,reqs:()=>terms.map(reqOf)});
  build();
 }});
})();
