/* ---------- Power Balance: powers, indices and logs, shown on a balance ----------
   Every question is an equation with a "?" on one pan. The pans show the two sides and the beam tilts as you type, so
   you SEE when both sides are equal. A button swaps the equation between its index form and its log form (or, for the
   log laws, between the log version and the index version). One question per level. */
(function(){
const TAG={
 'ix-repeat':['repeated multiplication','repeated multiplication'],'ix-eval':['evaluate a power','evaluate a power'],'ix-find-index':['find the index','find the index'],
 'ix-find-base':['find the base','find the base'],'ix-zero':['zero index','zero index'],'ix-neg':['negative index','negative index'],'ix-neg-frac-base':['negative index, fraction base','negative index, fraction base'],
 'ix-frac':['fractional index','fractional index'],'ix-frac-pq':['index p/q','index p/q'],'ix-frac-neg':['negative fractional index','negative fractional index'],
 'ix-law-mul':['index law: multiply','index law: multiply'],'ix-law-div':['index law: divide','index law: divide'],'ix-law-pow':['index law: power of a power','index law: power of a power'],
 'ix-law-neg':['laws with negative indices','laws with negative indices'],'ix-letters':['laws with letters','laws with letters'],'ix-missing':['missing index','missing index'],'ix-combine':['combine index laws','combine index laws'],
 'lg-convert':['index ↔ log form','index ↔ log form'],'lg-value':['find a log','find a log'],'lg-special':['log 1 and log a','log 1 and log a'],'lg-neg':['negative log','negative log'],
 'lg-frac':['fractional log','fractional log'],'lg-base':['find the base','find the base'],'lg-add':['log law: add','log law: add'],'lg-sub':['log law: subtract','log law: subtract'],
 'lg-pow':['log law: power','log law: power'],'lg-mix':['combine log laws','combine log laws'],'lg-simplify':['log laws to a number','log laws to a number']
};
Object.keys(TAG).forEach(k=>{TAXO[k]={g:'num',en:TAG[k][0],zh:TAG[k][1]};});

/* ---- number formatting ---- */
const fmtV=v=>{const neg=v<0,a=Math.abs(v);if(Math.abs(a-Math.round(a))<1e-9)return(neg?'−':'')+Math.round(a);
  for(let d=2;d<=1000;d++){const n=a*d;if(Math.abs(n-Math.round(n))<1e-7)return(neg?'−':'')+Math.round(n)+'/'+d;}return(neg?'−':'')+a.toFixed(3);};
const frH=s=>{const m=/^(−?)(\d+)\/(\d+)$/.exec(s);return m?`${m[1]}<span class="fr"><i>${m[2]}</i><i>${m[3]}</i></span>`:s;};
const H=v=>frH(fmtV(v));
const bv=b=>/^[a-z]$/i.test(String(b))?`<var>${b}</var>`:b;               /* letters are italic, like printed maths */
const xfr=e=>String(e).replace(/<span class="fr"><i>(.*?)<\/i><i>(.*?)<\/i><\/span>/g,'<span class="xf"><b>$1</b><b>$2</b></span>');   /* stacked fraction for use in an exponent */
const pw=(b,e)=>{const x=xfr(e),f=x!==String(e);return `<span class="pwr">${bv(b)}<sup${f?' class="sf"':''}>${x}</sup></span>`;};
const pe=(b,e)=>e===1?bv(b):pw(b,typeof e==='number'?eT(e):e);              /* x¹ is written x */
const lg=(b,x)=>`log<sub>${b}</sub> ${x}`;
const log2=x=>Math.log(x)/Math.LN2;
const tiles=(b,n)=>Array.from({length:n},()=>`<b class="btl">${b}</b>`).join('<span class="tmul">×</span>');
const par=s=>`(${s})`;
function parseT(buf){const s=String(buf).trim().replace('−','-');if(!s||s==='-')return null;const m=/^(-?)(\d*\.?\d+)(?:\/(\d*\.?\d+))?$/.exec(s);if(!m)return null;
  const a=parseFloat(m[2]),d=m[3]!=null?parseFloat(m[3]):1;if(!d)return null;return(m[1]?-1:1)*a/d;}
const typedH=buf=>{const s=String(buf).trim();return s?frH(s.replace('-','−')):'?';};
const num=s=>{const v=parseT(s);return v==null?null:{v,n:null,d:1};};

/* ---- the balance picture ----
   forms[i] = {L(T),R(T),tl(v),btn}:  L/R give the HTML of each pan (T = what has been typed so far),
   tl(v) = left − right in "steps" for a typed value v, and is 0 exactly when the balance is level. */
function Q(o){
  const q={k:o.k,q:o.q,ans:o.ans,ex:o.ex,forms:o.forms,form:0,start:o.start,build:o.build,hist:[],nopad:!!o.build,proc:o.proc||null,ms:0};
  const bs=o.build;if(o.build){q.st=mkSt(o.start);}
  const eh=e=>Math.abs(e)<1e-9?'1':Math.abs(e-1)<1e-9?bv(bs):pw(bs,eT(e));
  const OPS={p2:['pow',2,'( )²'],p3:['pow',3,'( )³'],r2:['root',2,'√'],r3:['root',3,'∛']};
  const rsym=k=>k===2?'√':k===3?'∛':`<sup>${k}</sup>√`;
  const hline=h=>{const t=h.kind==='mul'?`${eh(h.from)} × ${bv(bs)}`:h.kind==='div'?`${eh(h.from)} ÷ ${bv(bs)}`:h.kind==='pow'?`(${eh(h.from)})<sup>${h.k}</sup>`:`${rsym(h.k)}(${eh(h.from)})`;
    const tag=h.kind==='mul'?'×'+bs:h.kind==='div'?'÷'+bs:h.kind==='pow'?'( )'+(h.k===2?'²':'³'):rsym(h.k);
    return {t:`${t} <b>=</b> ${eh(h.to)}`,tag,cls:h.kind==='mul'||h.kind==='pow'?'ml':'dv'};};
  /* the scene uses the Balance Scale game's own classes: .sc-top / .sc-box / .sc-wts / .wt (weights), .sc-eq / .el / .otg (working lines),
     .sc-scene / .sc-beam / .sc-pan / .sc-tiles / .t (tiles) / .sc-dish / .sc-post / .sc-base (+ .lv.go buttons) */
  q.visf=function(buf,answered,ok){
    const f=q.forms[q.form||0];
    let v=answered?q.ans:parseT(buf);
    if(o.build&&!answered)v=evalSt(q.st);
    else if(v==null&&q.start!=null&&!answered)v=q.start;
    const T=answered?H(q.ans):(q.start!=null&&v!=null?H(v):typedH(buf));
    const tl=v==null?0:f.tl(v),level=v!=null&&Math.abs(tl)<1e-7;
    const ang=v==null?0:Math.max(-16,Math.min(16,tl*7));   /* same sign as Balance Scale: positive = left pan lower */
    const prev=q._a==null?0:q._a;q._a=ang;
    const dl=o.build?[]:[].concat(f.dis||[]),dz=dl.length&&q.dis&&!answered;const Lt=String(f.L(T,v)),Rt=o.build?stH(bs,q.st,true):String(f.R(T,v)),sp=sd=>dl.find(x=>(x.side||'L')===sd),nst=Math.max(0,...dl.map(x=>dsS(x).length)),stg=x=>{const a=dsS(x);return a[Math.min(q.dis|0,a.length)-1];},Lh=dz&&sp('L')?stg(sp('L')):Lt,Rh=dz&&sp('R')?stg(sp('R')):Rt;q._nst=nst;
    const gl=v==null&&Lh.includes('?'),gr=v==null&&Rh.includes('?');   /* dashed outline on the pan that still holds the “?” */
    const chip=(x,g,c)=>`<div class="t chip ${g?'q':c||'tn'} big">${`<span>${x}</span>`}</div>`;
    const dmk=sd=>{if(o.build)return '';const base=sd==='L'?Lt:Rt;if(f.conv===sd&&q.forms.length>1&&!answered)return ' cvb';return sp(sd)&&!base.includes('?')&&!answered?(dz?' dsv':' dsb'):'';};   /* cvb: tap converts log ↔ index form; dsb/dsv: tap dissolves into blocks / folds back */
    const tg=h=>h.replace('<div class="t chip',`<div data-st="${q.dis|0}/${nst}" class="t chip`);const left=tg(chip(Lh,gl,o.build?bcls(bs):'tn')).replace('t chip',`t chip${dmk('L')}`),right=o.build?Rh:tg(chip(Rh,gr,'tn')).replace('t chip',`t chip${dmk('R')}`);
    const ev=o.build?evalSt(q.st):null;
    let top;
    if(o.build){
      const lines=q.hist.map((x,i)=>{const h=hline(x);return `<div class="el ${i===q.hist.length-1&&!level?'last':'old'}"><span class="otg ${h.cls}">${h.tag}</span>${h.t}</div>`;}).join('');
      top=`<div class="sc-top"><div class="sc-box"><div class="sc-lab">Blocks</div><div class="sc-wts"><div class="wt ${bcls(bs)==='tx'?'xw':'uw'} src" data-d="1">${bs}</div>${o.neg?`<div class="wt ng src" data-d="-1">÷${bs}</div>`:''}</div></div>
        <div class="sc-eq" id="bklog"><div class="el orig">${Lh} <b class="eqn">≠</b> ${eh(q.start)}</div>${lines}${level?`<div class="el fin">✅ ${Lh} = ${eh(v)}</div>`:''}</div></div>`;
    }else top=`<div class="sc-top"><div class="sc-eq one"><div class="el orig">${Lt} <b class="${level?'eqb':'eqn'}">=</b> ${Rt}</div>${level?'<div class="el fin">✅ level</div>':''}</div></div>`;
    const PL=0;const mh=PL?`<div class="mth">${q.proc.slice(0,q.ms).map((x,i)=>`<div class="ms"><span class="mn1">${i+1}</span><div><b>${x[0]}</b>${x[1]}</div></div>`).join('')}<button class="lv go mbtn" id="mbtn">${q.ms===0?'🧭 Show the method':q.ms<PL?`Next: ${q.proc[q.ms][0]} ▶`:'✕ Hide the method'}</button></div>`:'';
    let ctl;
    if(o.build)ctl=answered?'':`<div class="opr">${(o.ops||[]).map(k=>`<button class="lv go op" data-op="${k}">${OPS[k][2]}</button>`).join('')}</div><div class="opr"><button class="lv go ml" id="bkmul">×${bs}</button>${o.neg?`<button class="lv go dv" id="bkdiv">÷${bs}</button>`:''}<button class="lv go" id="bkun" style="background:#868e96">↶</button><button class="lv go" id="chk" style="background:#2f9e44">Check ✓</button></div>`;
    else ctl=q.forms.length>1?`<button class="lv go dv" id="ftg">↔ ${f.btn}</button>`:'';
    return `${o.ladder?`<div class="pw-ladder">${o.ladder}</div>`:''}<div class="px ${level?'lv':''} ${answered?'done':''} ${o.ops&&o.ops.length&&!answered?'ops2':''}">${top}
     <div class="sc-scene" data-a="${ang}" data-p="${prev}"><svg class="sc-svg"></svg><div class="sc-beam"><i></i></div>
      <div class="sc-pan" data-p="L"><div class="sc-tiles">${left}</div><div class="sc-dish"></div></div><div class="sc-pan" data-p="R"><div class="sc-tiles">${right}</div><div class="sc-dish"></div></div>
      <div class="sc-post"></div><div class="sc-base">${ctl}</div></div></div>${mh}`;
  };
  q.after=(root,api)=>{const sc=root.querySelector('.sc-scene');if(!sc)return;cancelAnimationFrame(q._raf);
    const beam=sc.querySelector('.sc-beam'),svg=sc.querySelector('.sc-svg'),pans=[...sc.querySelectorAll('.sc-pan')];
    const tgt=+sc.dataset.a;let ang=+sc.dataset.p,vel=0;
    const place=()=>{const w=sc.clientWidth||320,pw=Math.round(w*.42),h=(w-pw)/2,cx=w/2,fy=34,r=ang*Math.PI/180,c=Math.cos(r),sn=Math.sin(r);
      const ex=[[cx-h*c,fy+h*sn],[cx+h*c,fy-h*sn]];
      beam.style.width=(2*h+24)+'px';beam.style.left=(cx-h-12)+'px';beam.style.top=(fy-6)+'px';beam.style.transform=`rotate(${-ang}deg)`;
      let sv='';pans.forEach((p,i)=>{const px=ex[i][0]-pw/2,py=ex[i][1]+30,ph=p.offsetHeight||70;p.style.width=pw+'px';p.style.left=px+'px';p.style.top=py+'px';
        sv+=`<line x1="${ex[i][0]}" y1="${ex[i][1]}" x2="${px+10}" y2="${py+ph-5}" class="sc-str"/><line x1="${ex[i][0]}" y1="${ex[i][1]}" x2="${px+pw-10}" y2="${py+ph-5}" class="sc-str"/><circle cx="${ex[i][0]}" cy="${ex[i][1]}" r="4" class="sc-pin"/>`;});
      svg.setAttribute('viewBox',`0 0 ${w} ${sc.clientHeight||260}`);svg.innerHTML=sv+`<circle cx="${cx}" cy="${fy}" r="9" class="sc-pin big"/>`;};
    const step=()=>{vel+=(tgt-ang)*.11;vel*=.84;ang+=vel;place();if(Math.abs(vel)>.01||Math.abs(tgt-ang)>.04)q._raf=requestAnimationFrame(step);else{ang=tgt;place();}};
    place();q._raf=requestAnimationFrame(step);
    {const mb=root.querySelector('#mbtn');if(mb&&api)mb.onclick=()=>{q.ms=q.ms>=q.proc.length?0:q.ms+1;(api.redraw||api.set)(api.buf());};}
    if(q.build&&api)bindBuild(root,api,pans[1]);
    else if(api&&api.open){root.querySelectorAll('.t.dsb,.t.dsv').forEach(t=>{t.style.cursor='pointer';t.onclick=()=>{q.dis=((q.dis|0)+1)%((q._nst||1)+1);api.set(api.buf());};});root.querySelectorAll('.t.cvb').forEach(t=>{t.style.cursor='pointer';t.onclick=()=>{q.form=1-(q.form||0);q.dis=0;api.set(api.buf());};});root.querySelectorAll('.t.q').forEach(t=>{t.style.cursor='pointer';t.onclick=api.open;});}};
  /* build mode: every operation (×a, ÷a, raise the whole pan to a power, take a root) acts on the right pan and adds a line to the working */
  function bindBuild(root,api,pan){
    const lg=root.querySelector('#bklog');if(lg)lg.scrollTop=1e5;
    if(!root.querySelector('#chk'))return;
    const commit=(kind,k,mut)=>{const from=evalSt(q.st),snap=cloneSt(q.st);mut();const to=evalSt(q.st);q.hist.push({kind,k,from,to,snap});api.set(fmtV(to));};
    const add=d=>commit(d>0?'mul':'div',1,()=>{(d>0?q.st.num:q.st.den).push('a');});
    const wrap=(kind,k)=>{if(!q.st.num.length&&!q.st.den.length)return;   /* nothing on the pan to raise or root */
      commit(kind,k,()=>{q.st={num:[{g:kind==='pow'?'p':'r',k,inner:q.st}],den:[]};});};
    const over=(x,y)=>{const p=pan.getBoundingClientRect();return x>p.left-30&&x<p.right+30&&y>p.top-50&&y<p.bottom+30;};
    const drag=(el,onDrop,onTap)=>el.addEventListener('pointerdown',ev=>{ev.preventDefault();const sx=ev.clientX,sy=ev.clientY;let g=null,moved=false;
      const mv=e=>{if(!moved&&Math.hypot(e.clientX-sx,e.clientY-sy)>8){moved=true;g=document.createElement('div');g.className='ghost '+(el.classList.contains('ng')?'ng ':'')+bcls(bs);g.textContent=el.textContent;document.body.appendChild(g);el.classList.add('lifted');}
        if(g){g.style.left=e.clientX+'px';g.style.top=e.clientY+'px';pan.classList.toggle('hot',over(e.clientX,e.clientY));}};
      const up=e=>{window.removeEventListener('pointermove',mv);if(g)g.remove();el.classList.remove('lifted');pan.classList.remove('hot');if(!moved)onTap();else onDrop(over(e.clientX,e.clientY));};
      window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up,{once:true});window.addEventListener('pointercancel',up,{once:true});});
    root.querySelectorAll('.wt.src').forEach(el=>{const d=+el.dataset.d;drag(el,hit=>{if(hit)add(d);},()=>add(d));});
    /* a block that sits directly on the pan can be tapped (or dragged off) to take it away */
    pan.querySelectorAll('.t.pb').forEach(el=>{const rm=()=>{const side=el.dataset.side==='d'?'den':'num',i=+el.dataset.i;
        commit(side==='num'?'div':'mul',1,()=>{q.st[side].splice(i,1);});};drag(el,hit=>{if(!hit)rm();},rm);});
    const m=root.querySelector('#bkmul'),dv=root.querySelector('#bkdiv');if(m)m.onclick=()=>add(1);if(dv)dv.onclick=()=>add(-1);
    root.querySelectorAll('.op').forEach(b=>{const [kind,k]=OPS[b.dataset.op];b.onclick=()=>wrap(kind,k);});
    const un=root.querySelector('#bkun');if(un)un.onclick=()=>{const h=q.hist.pop();if(h){q.st=h.snap;api.set(fmtV(evalSt(q.st)));}};
    root.querySelector('#chk').onclick=()=>{if(api.buf()==='')api.set(String(q.start));api.submit();};
  }
  return q;
}
/* an index equation  b^x = N  and its log form  x = log_b N  (answer x = e) */
function cbase(b,e){const N=Math.pow(b,e);for(let c=2;c<=b;c++){const u=Math.round(Math.log(b)/Math.log(c)),v=Math.round(Math.log(N)/Math.log(c));if(u>=1&&Math.abs(Math.pow(c,u)-b)<1e-9&&Math.abs(Math.pow(c,v)-N)<1e-9*Math.max(1,N)&&Math.abs(v)<=9)return{c,u,v};}return null;}
function idx(b,e,Nh,first,o){
  /* integer answer: N breaks into e blocks of the base. Otherwise both sides are written in a common base c: b = c^u (x groups of u blocks) and N = c^v (v blocks), so x = v ÷ u */
  const cb=cbase(b,e),D=Number.isInteger(e)&&Math.abs(e)<=8?{side:'R',op:'blk',b,n:e}:cb?[{side:'L',op:'cbl',b:cb.c,u:cb.u},{side:'R',op:'blk',b:cb.c,n:cb.v}]:null;
  const iF={dis:D,L:T=>pw(b,T),R:()=>Nh,tl:v=>v-e,btn:'Show as a log equation'};
  const lF={conv:'R',L:T=>T,R:()=>lg(b,Nh),tl:v=>v-e,btn:'Show as an index equation'};
  const c0=cb?cb.c:b,u0=cb?cb.u:1,v0=cb?cb.v:e,Nn=Math.pow(b,e);
  const proc=D?[['Same base',mstep(u0===1&&!cb?`${Nh} = ${pw(b,fmtV(e))}`:`${b} = ${pw(c0,u0)} and ${frH(String(Nh))} = ${pw(c0,fmtV(v0))}`,`write both sides as powers of ${c0}`)],
    ['Visualise',mstep(dsH(Array.isArray(D)?D[0]:D)+(Array.isArray(D)?` <b>=</b> ${dsH(D[1])}`:''),u0===1&&!cb?`count the blocks of ${b}: ${fmtV(e)}`:`x groups of ${u0} block${u0>1?'s':''} = ${Math.abs(v0)} block${Math.abs(v0)>1?'s':''}${v0<0?' under 1':''}, so x = ${fmtV(v0)} ÷ ${u0} = ${fmtV(e)}`)],
    ['Convert',mstep(`${pw(b,'x')} = ${Nh} <b>⇄</b> x = ${lg(b,Nh)}`,`so x = ${fmtV(e)}`)]]:null;
  return Q(Object.assign({forms:first==='log'?[lF,iF]:[iF,lF],proc},o));
}
const valQ=(X,Lh,o,dis)=>Q(Object.assign({forms:[{dis,L:()=>Lh,R:T=>T,tl:v=>v>0?log2(X/v):8}]},o));
const BASES=[2,3,4,5,10];
const exp=(b,n)=>Math.pow(b,n);
const ladder=(b,from,to,last)=>{const a=[];for(let e=from;e>=to;e--){const v=Math.pow(b,e);a.push(`<span class="lp">${pw(b,e<0?'−'+(-e):e)} = ${e===to&&last?'<b>?</b>':H(v)}</span>`);if(e>to)a.push(`<span class="lp d">÷${b}</span>`);}return a.join('');};

/* ---- build mode: blocks on the right pan.  e = net index (a-block = ×a, ÷a-block = ÷a); 0 blocks = 1 ---- */
const eT=e=>{const r=Math.round(e);return Math.abs(e-r)<1e-9?(r<0?'−'+(-r):String(r)):H(e);};   /* an exponent, whole or fractional */
const bcls=b=>/^\d/.test(String(b))?'tn':'tx';              /* Balance Scale weights: purple italic for letters, yellow for numbers */
/* the right pan is a little expression:  {num:[items],den:[items]}  where an item is 'a' (one block) or a group {g:'p'|'r',k,inner} = (inner)^k or the k-th root of inner */
const mkSt=e=>e>=0?{num:Array(e).fill('a'),den:[]}:{num:[],den:Array(-e).fill('a')};
const evalIt=it=>it==='a'?1:it.g==='p'?it.k*evalSt(it.inner):evalSt(it.inner)/it.k;
const evalSt=st=>st.num.reduce((t,i)=>t+evalIt(i),0)-st.den.reduce((t,i)=>t+evalIt(i),0);
const cloneSt=st=>JSON.parse(JSON.stringify(st));
const blockH=(b,top,side,i)=>`<div class="t chip ${bcls(b)} ${top?'pb':'pbi'}" ${top?`data-side="${side}" data-i="${i}"`:''}>${b}</div>`;
const ONE='<div class="t chip tn one">1</div>';
/* tap-to-dissolve: an index-law expression becomes coloured blocks of the base (colour 1 / colour 2) */
const dbk=(b,n,c,x)=>Array.from({length:n},()=>`<i class="db c${c}${x?' cx':''}">${bv(b)}</i>`).join('');
const rs=k=>k===2?'√':k===3?'∛':`<sup>${k}</sup>√`;
const NOTE={mul:'multiply → push the blocks together: the indices add',div:'divide → cancel the same blocks top and bottom: the indices subtract',pow:'a power of a power → groups of groups: the indices multiply',mix1:'groups of groups, then more blocks: multiply, then add',mix2:'put the blocks together, then cancel',mix3:'cancel inside each bracket, then repeat the bracket',neg2:'a negative index flips the blocks under 1',neg3:'a negative index flips the blocks under 1',lgs:'a log counts the blocks of the base: + puts blocks together, − cancels them',fcan:'the same number on top and bottom cancels; the blocks of the base are left'};
/* the method: 1 write everything in the same base, 2 picture it as blocks (group / ungroup / cancel), 3 convert between the power and log (or root) forms */
const mstep=(h,n)=>`<div class="mh">${h}${n?`<div class="mn">${n}</div>`:''}</div>`;
const rootProc=(N,p,q,r,neg)=>[['Same base',mstep(`${N} = ${pw(r,q)}`,`write ${N} as a power of ${r} (${q} equal factors)`)],
  ['Visualise',mstep(dsH({op:'root',r,q,p,neg}),`${q} equal groups of ${p} block${p>1?'s':''}: one group is the answer`)],
  ['Convert',mstep(`${pw(N,frH(p+'/'+q))} <b>⇄</b> ${p>1?`(${rs(q)}${N})<sup>${p}</sup>`:`${rs(q)}${N}`} = ${neg?'1 ÷ ':''}${p>1?pw(r,p):r}`,'fractional index ⇄ root and power')]];
const dB=(b,c,x)=>`<i class="db c${c}${x?' cx':''}">${bv(b)}</i>`;
const dFr=(t,u)=>`<span class="dz dfr"><span class="dg">${t}</span><span class="dg">${u}</span></span>`;
const dGp=(b,m,n)=>Array.from({length:n},(_,i)=>`<span class="dg gg">${dbk(b,m,i%2?2:1)}</span>`).join('<span class="tmul">×</span>');
const dDiv=(b,m,n,c)=>{const c2=c===1?2:1;return dFr(dbk(b,m-n,c)+dbk(b,n,c2,1),dbk(b,n,c2,1));};   /* n blocks cancel top against bottom */
const ONEB='<i class="db one">1</i>';
const dsH=d=>{const{op,b,m,n,k}=d;
  if(op==='mul')return `<span class="dz"><span class="dg">${dbk(b,m,1)}</span><span class="dg">${dbk(b,n,2)}</span></span>`;
  if(op==='div')return `<span class="dz">${dDiv(b,m,n,1)}</span>`;
  if(op==='pow')return `<span class="dz">${dGp(b,m,n)}</span>`;
  if(op==='mix1')return `<span class="dz">${dGp(b,m,n)}<span class="tmul">×</span><span class="dg">${dbk(b,k,3)}</span></span>`;
  if(op==='mix2'){const cs=[...Array(m).fill(1),...Array(n).fill(2)],keep=cs.slice(0,m+n-k),gone=cs.slice(m+n-k);
    const h=a=>a.map(c=>`<i class="db c${c}">${bv(b)}</i>`).join(''),x=a=>a.map(c=>`<i class="db c${c} cx">${bv(b)}</i>`).join('');
    return `<span class="dz">${dFr(h(keep)+x(gone),x(gone))}</span>`;}
  if(op==='mix3')return `<span class="dz">${Array.from({length:k},(_,i)=>dDiv(b,m,n,i%2?2:1)).join('<span class="tmul">×</span>')}</span>`;
  if(op==='cbl')return `<span class="gp"><span class="br">(</span>${dbk(b,d.u,1)}<span class="br">)</span><sup>?</sup></span>`;
  if(op==='blk')return `<span class="dz">${n<0?dFr(ONEB,dbk(b,-n,1)):n===0?ONEB:`<span class="dg">${dbk(b,n,1)}</span>`}</span>`;
  if(op==='root'){const nb=(c)=>`<i class="db c${c}">${d.r}</i>`,gp=(i,x)=>`<span class="dg gg${x?'':' gx'}">${Array.from({length:d.p},()=>nb(i%3+1)).join('')}</span>`;
    /* N = r^q is p·q blocks of r, split into q equal groups of p blocks: one group is the answer */
    const all=Array.from({length:d.q},(_,i)=>gp(i,i===0)).join('');
    return `<span class="dz">${all}${d.neg?`<span class="tmul">→</span>${dFr(ONEB,gp(0,1))}`:''}</span>`;}
  if(op==='fcan')return `<span class="dz">${dFr(`<i class="db c3 cx">${d.c}</i>`+dbk(b,d.k,1),`<i class="db c3 cx">${d.c}</i>`)}</span>`;
  if(op==='lgs'){const seq=[],bounds=[];d.add.forEach((c,gi)=>{for(let i=0;i<c;i++)seq.push([gi%3+1,gi]);});const tot=seq.length,gone=d.sub||0;let html='',last=-1;
    seq.forEach((x,i)=>{if(x[1]!==last){if(last>=0)html+='<span class="tmul">+</span>';html+=last>=0?'':'';last=x[1];}html+=`<i class="db c${x[0]}${i>=tot-gone?' cx':''}">${bv(b)}</i>`;});
    return `<span class="dz">${html}</span>`;}
  if(op==='neg2')return `<span class="dz">${dFr(ONEB,dbk(b,m,1)+dbk(b,n,2))}</span>`;
  if(op==='neg3')return `<span class="dz">${dFr(ONEB,dGp(b,m,n))}</span>`;
  return '';};
/* tap-by-tap stages: each tap on the pan changes it a little — same base → blocks → group / cancel / regroup → result */
const rep=(c,n)=>Array(n).fill(c);
const mg=(b,cols,gone)=>`<span class="dz"><span class="dg gg">${cols.map((c,i)=>`<i class="db c${c}${gone&&i>=cols.length-gone?' cx':''}">${bv(b)}</i>`).join('')}</span></span>`;
const grpCols=(sz,cnt)=>Array.from({length:sz*cnt},(_,i)=>Math.floor(i/sz)%2?2:1);
const dsS=d=>{const{op,b,m,n,k}=d,P=e=>`<span class="dz">${pw(b,e)}</span>`;
  switch(op){
  case 'mul':return [dsH(d),mg(b,[...rep(1,m),...rep(2,n)]),P(m+n)];
  case 'div':return [`<span class="dz">${dFr(dbk(b,m-n,1)+dbk(b,n,2),dbk(b,n,2))}</span>`,dsH(d),mg(b,rep(1,m-n)),P(m-n)];
  case 'pow':return [dsH(d),mg(b,grpCols(m,n)),P(m*n)];
  case 'mix1':return [dsH(d),mg(b,[...grpCols(m,n),...rep(3,k)]),P(m*n+k)];
  case 'mix2':{const cs=[...rep(1,m),...rep(2,n)],h=a=>a.map(c=>`<i class="db c${c}">${bv(b)}</i>`).join('');
    return [`<span class="dz">${dFr(h(cs),h(cs.slice(m+n-k)))}</span>`,dsH(d),mg(b,cs.slice(0,m+n-k)),P(m+n-k)];}
  case 'mix3':{const pf=i=>{const c=i%2?2:1,c2=c===1?2:1;return dFr(dbk(b,m-n,c)+dbk(b,n,c2),dbk(b,n,c2));};
    return [`<span class="dz">${Array.from({length:k},(_,i)=>pf(i)).join('<span class="tmul">×</span>')}</span>`,dsH(d),`<span class="dz">${dGp(b,m-n,k)}</span>`,mg(b,grpCols(m-n,k)),P((m-n)*k)];}
  case 'neg2':return [dsH(d),P('−'+(m+n))];
  case 'neg3':return [dsH(d),`<span class="dz">${dFr(ONEB,mg(b,grpCols(m,n)))}</span>`,P('−'+m*n)];
  case 'blk':return [P(n<0?'−'+(-n):n),dsH(d)];
  case 'cbl':return [`<span class="dz"><span class="pwr">(${pw(b,d.u)})<sup>?</sup></span></span>`,dsH(d)];
  case 'lgs':{const cnt=d.add.reduce((a,x)=>a+x,0)-(d.sub||0);return [dsH(d),mg(b,rep(1,cnt)),P(cnt)];}
  case 'fcan':{const num=`<i class="db c3">${d.c}</i>`;return [`<span class="dz">${dFr(num+dbk(b,d.k,1),num)}</span>`,dsH(d),mg(b,rep(1,d.k)),P(d.k)];}
  case 'root':{const{r,q,p,neg}=d,nb=c=>`<i class="db c${c}">${r}</i>`,gp=(i,solid,cnt)=>`<span class="dg gg${solid?'':' gx'}">${Array.from({length:cnt},()=>nb(i%3+1)).join('')}</span>`;
    const st=[`<span class="dz"><span class="pwr">(${pw(r,q)})<sup class="sf">${xfr(frH((neg?'−':'')+p+'/'+q))}</sup></span></span>`,
      `<span class="dz">${Array.from({length:p},(_,i)=>`<span class="dg gg">${Array.from({length:q},()=>nb(i%3+1)).join('')}</span>`).join('<span class="tmul">×</span>')}</span>`,
      `<span class="dz">${Array.from({length:q},(_,i)=>gp(i,1,p)).join('')}</span>`,
      dsH({op:'root',r,q,p,neg:0})];
    if(neg)st.push(dsH(d));return st;}
  default:return [dsH(d)];}};
const stH=(b,st,top)=>{
  const items=(its,side)=>its.map((it,i)=>it==='a'?blockH(b,top,side,i):grpH(b,it)).join('');
  const n=items(st.num,'n'),d=items(st.den,'d');
  return st.den.length?`<span class="fr bf"><i>${n||ONE}</i><i class="bi">${d}</i></span>`:(n||ONE);};
const grpH=(b,it)=>it.g==='p'?`<span class="gp"><span class="br">(</span>${stH(b,it.inner,false)}<span class="br">)</span><sup>${it.k}</sup></span>`
  :`<span class="gr">${it.k>2?`<sup class="rk">${it.k}</sup>`:''}<span class="rad">√</span><span class="rin">${stH(b,it.inner,false)}</span></span>`;
const bq=(k,b,t,s,qt,ex,o)=>Q(Object.assign({k,q:qt,ans:t,start:s,build:b,ex,forms:[{L:()=>(o&&o.L)||pe(b,t),R:()=>'',tl:v=>t-v,blocks:true}]},o||{}));
const BK=()=>pick(['a','x','y','m','n','2','3','5']);

const QT={
/* ---- build the power from blocks ---- */
B1(){const b=BK(),n=R(2,5);return bq('B1',b,n,0,`Make ${pe(b,n)}: add ${b}-blocks to the right pan until the balance levels.`,`${tiles(b,n)} = ${pe(b,n)}. ${n} blocks multiplied together.`);},
B2(){const b=BK(),n=R(1,3),m=n+R(1,3);return bq('B2',b,n,m,`The right pan holds ${pe(b,m)}. Take blocks away so it equals ${pe(b,n)}.`,`${pe(b,m)} ÷ ${pe(b,m-n)} = ${pe(b,n)}. Each block you take away divides by ${b}.`);},
B3(){const b=BK(),p=R(1,3),q=R(1,3);return bq('B3',b,p+q,0,`Build ${pe(b,p)} × ${pe(b,q)} with ${b}-blocks. How many blocks does it need?`,`${pe(b,p)} × ${pe(b,q)} = ${pe(b,p+q)}: ${p} block${p>1?"s":""} and ${q} block${q>1?"s":""} make ${p+q}. Add the indices.`,{L:pe(b,p)+' × '+pe(b,q)});},
B4(){const b=BK(),m=R(2,4);return bq('B4',b,0,m,`The right pan holds ${pe(b,m)}. Take away every ${b}-block. What is ${pe(b,0)}?`,`${pe(b,m)} ÷ ${pe(b,m)} = ${pe(b,0)} = 1. No blocks left means 1 (not 0).`);},
B5(){const b=BK(),n=R(1,3);return bq('B5',b,-n,0,`Make ${pe(b,'−'+n)}. Use the ÷${b} block: each one divides by ${b}.`,`${pe(b,'−'+n)} = 1 ÷ ${pe(b,n)}: ${n} divide-block${n>1?'s':''}.`,{neg:true});},
B6(){const b=BK();let s=R(-2,3),t=R(-3,4);if(t===s)t=s+1;return bq('B6',b,t,s,`Change the right pan from ${pe(b,eT(s))} to ${pe(b,eT(t))}.`,`${b}-blocks multiply, ÷${b}-blocks divide. From ${pe(b,eT(s))} to ${pe(b,eT(t))} is a change of ${t-s>0?'+':'−'}${Math.abs(t-s)} in the index.`,{neg:true});},
B7(){const b=BK(),p=R(1,4),q=p+R(1,3);return bq('B7',b,p-q,0,`Build ${pe(b,p)} ÷ ${pe(b,q)}. Use ${b}-blocks to multiply and ÷${b}-blocks to divide.`,`${pe(b,p)} ÷ ${pe(b,q)} = ${pe(b,eT(p-q))}: the index is ${p} − ${q} = ${p-q}.`,{neg:true,L:pe(b,p)+' ÷ '+pe(b,q)});},
B8(){const b=BK(),p=R(2,3),k=R(2,3);return bq('B8',b,p*k,p,`The right pan holds ${pe(b,p)}. Raise the whole pan to the power ${k}: ( )${k===2?'²':'³'}.`,`(${pe(b,p)})<sup>${k}</sup> = ${pe(b,p*k)}: multiply the indices, ${p} × ${k} = ${p*k}.`,{ops:['p2','p3'],L:`(${pe(b,p)})<sup>${k}</sup>`});},
B9(){const b=BK(),k=pick([2,3]),n=R(1,k===2?3:2);return bq('B9',b,n,k*n,`The right pan holds ${pe(b,k*n)}. Take the ${k===2?'square':'cube'} root of the whole pan.`,`${k===2?'√':'∛'}(${pe(b,k*n)}) = ${pe(b,n)}: divide the index by ${k}.`,{ops:['r2','r3']});},
B10(){const b=BK(),k=pick([2,3]),p=pick([1,2,3].filter(x=>x!==k));return bq('B10',b,p/k,0,`Make ${pe(b,p/k)}. Put down ${b}-blocks, then use the root and power buttons.`,`${pe(b,p/k)} means the ${k===2?'square':'cube'} root of ${b}${p>1?`, raised to the power ${p}`:''}: the index ${p}/${k} = ${p} × (1/${k}).`,{ops:['r2','r3','p2','p3']});},

/* ---- repeated multiplication ---- */
 R1(){const b=pick([2,3,4,5,10]),n=R(2,6);return Q({k:'R1',q:`The right pan holds ${n} copies of ${b} multiplied together. Write that as a power: ${pw(b,'?')}.`,ans:n,
   forms:[{L:T=>pw(b,T),R:()=>tiles(b,n),tl:v=>v-n,btn:''}],ex:`${b} is multiplied ${n} times, so ${tiles(b,n).replace(/<[^>]+>/g,'')} = ${pw(b,n)}. The index counts how many times the base is multiplied.`});},
 R2(){const b=pick([2,3,4,5,6,10]),n=R(2,{2:8,3:5,4:4,5:4,6:3,10:5}[b]),X=exp(b,n);return valQ(X,`${pw(b,n)}<div class="pw-sub">${tiles(b,n)}</div>`,{k:'R2',q:`Work out ${pw(b,n)}.`,ans:X,ex:`${tiles(b,n).replace(/<[^>]+>/g,'')} = ${X}`});},
 R3(){const b=pick(BASES),n=R(2,b===10?5:b===2?7:4);return idx(b,n,exp(b,n),'idx',{k:'R3',q:`${pw(b,'x')} = ${exp(b,n)}. What is x?`,ans:n,ex:`${b} multiplied by itself ${n} times gives ${exp(b,n)}, so x = ${n}. In log form: x = log<sub>${b}</sub> ${exp(b,n)} = ${n}.`});},
 R4(){const n=pick([2,3,4]),b=R(2,n===2?12:n===3?6:4),N=exp(b,n);
  return Q({k:'R4',q:`?<sup>${n}</sup> = ${N}. What is the base?`,ans:b,forms:[
   {L:T=>pw(par(T),n),R:()=>N,tl:v=>v>0?n*log2(v/b):-8,btn:'Show as a log equation'},
   {L:T=>lg(T,N),R:()=>n,tl:v=>(v>0&&v!==1)?Math.log(N)/Math.log(v)-n:8,btn:'Show as an index equation'}],ex:`${b}<sup>${n}</sup> = ${N}, so the base is ${b}.`});},
/* ---- zero index ---- */
 Z1(){const b=pick([2,3,5,10]);return valQ(1,pw(b,0),{k:'Z1',ladder:ladder(b,3,0,true),q:`Keep dividing by ${b}. What is ${pw(b,0)}?`,ans:1,ex:`Each step down divides by ${b}: ${exp(b,3)}, ${exp(b,2)}, ${b}, then ${b} ÷ ${b} = 1. So ${pw(b,0)} = 1.`});},
 Z2(){const b=pick([3,4,5,6,7,8,9,10,12,15,20,25,50,100]);return valQ(1,pw(b,0),{k:'Z2',q:`What is ${pw(b,0)}?`,ans:1,ex:`Any number (except 0) to the power 0 is 1, because ${pw(b,1)} ÷ ${b} = 1.`});},
 Z3(){const b=pick([3,5,7,9,12]),c=pick([2,4,6,8,10]),k=R(3,9),t=R(0,3);let L,X,w;
  if(t===0){L=`${pw(b,0)} + ${pw(c,0)}`;X=2;w='1 + 1';}else if(t===1){L=`${k} × ${pw(b,0)}`;X=k;w=`${k} × 1`;}else if(t===2){L=`${k} + ${pw(b,0)}`;X=k+1;w=`${k} + 1`;}else{L=`${k} − ${pw(b,0)}`;X=k-1;w=`${k} − 1`;}
  return valQ(X,L,{k:'Z3',q:`Work out ${L}.`,ans:X,ex:`Every power 0 equals 1: ${w} = ${X}.`});},
/* ---- negative index ---- */
 N1(){const b=pick([2,3,4,5,10]);return valQ(1/b,pw(b,'−1'),{k:'N1',ladder:ladder(b,1,-1,true),q:`Keep dividing by ${b}. What is ${pw(b,'−1')}?`,ans:1/b,ex:`${b}, then 1, then 1 ÷ ${b} = 1/${b}. So ${pw(b,'−1')} = 1/${b}.`});},
 N2(){const n=pick([2,3]),b=n===2?R(2,10):pick([2,3,4,5]),X=1/exp(b,n);return valQ(X,pw(b,'−'+n),{k:'N2',q:`Write ${pw(b,'−'+n)} as a fraction.`,ans:X,ex:`${pw(b,'−'+n)} = 1 ÷ ${pw(b,n)} = 1/${exp(b,n)}. A negative index means “one over”.`});},
 N3(){const c=pick([[10,1],[10,2],[10,3],[2,1],[2,2],[5,1],[5,2],[4,1]]),[b,n]=c,X=1/exp(b,n);return valQ(X,pw(b,'−'+n),{k:'N3',q:`Write ${pw(b,'−'+n)} as a decimal.`,ans:X,ex:`${pw(b,'−'+n)} = 1/${exp(b,n)} = ${X}.`});},
 N4(){const b=pick([2,3,4,5,10]),n=R(1,b===10?4:b===2?6:3),N=exp(b,n);
  return Q({k:'N4',q:`1/${N} = ${pw(b,'?')}. Find the index.`,ans:-n,forms:[
   {L:()=>frH('1/'+N),R:T=>pw(b,T),tl:v=>-n-v,btn:'Show as a log equation'},
   {L:T=>T,R:()=>lg(b,frH('1/'+N)),tl:v=>v+n,btn:'Show as an index equation'}],ex:`1/${N} = 1/${pw(b,n)} = ${pw(b,'−'+n)}, so the index is −${n}.`});},
 N5(){const f=pick([[1,2],[2,3],[1,3],[3,4],[2,5]]),n=R(1,2),[a,c]=f,X=Math.pow(c/a,n);
  return valQ(X,`${par(frH(a+'/'+c))}<sup>−${n}</sup>`,{k:'N5',q:`Write ${par(frH(a+'/'+c))}<sup>−${n}</sup> as a fraction.`,ans:X,ex:`A negative index flips the fraction: ${par(a+'/'+c)}<sup>−${n}</sup> = ${a===1?c:par(c+'/'+a)}<sup>${n}</sup> = ${fmtV(X)}.`});},
/* ---- fractional index ---- */
 F1(){const r=R(2,13),N=r*r;return Q({k:'F1',q:`What is ${pw(N,frH('1/2'))}? (It is the number that multiplies by itself to make ${N}.)`,ans:r,proc:rootProc(N,1,2,r),forms:[
   {dis:{op:'root',r,q:2,p:1},L:()=>pw(N,frH('1/2')),R:T=>T,tl:v=>v>0?log2(r/v):8,btn:'Show what it means: ? × ?'},
   {L:T=>`${T}<span class="tmul">×</span>${T}`,R:()=>N,tl:v=>v>0?2*log2(v/r):-8,btn:'Show as a power'}],ex:`${r} × ${r} = ${N}, so ${pw(N,frH('1/2'))} = √${N} = ${r}.`});},
 F2(){const r=R(2,10),N=r*r*r;return Q({k:'F2',q:`What is ${pw(N,frH('1/3'))}? (The number that multiplies three times to make ${N}.)`,ans:r,proc:rootProc(N,1,3,r),forms:[
   {dis:{op:'root',r,q:3,p:1},L:()=>pw(N,frH('1/3')),R:T=>T,tl:v=>v>0?log2(r/v):8,btn:'Show what it means: ? × ? × ?'},
   {L:T=>`${T}<span class="tmul">×</span>${T}<span class="tmul">×</span>${T}`,R:()=>N,tl:v=>v>0?3*log2(v/r):-8,btn:'Show as a power'}],ex:`${r} × ${r} × ${r} = ${N}, so ${pw(N,frH('1/3'))} = ∛${N} = ${r}.`});},
 F3(){const c=pick([[16,4,2],[81,4,3],[625,4,5],[32,5,2],[243,5,3],[10000,4,10]]),[N,k,r]=c;return Q({k:'F3',q:`What is ${pw(N,frH('1/'+k))}?`,ans:r,proc:rootProc(N,1,k,r),forms:[
   {dis:{op:'root',r,q:k,p:1},L:()=>pw(N,frH('1/'+k)),R:T=>T,tl:v=>v>0?log2(r/v):8,btn:`Show what it means`},
   {L:T=>Array(k).fill(T).join('<span class="tmul">×</span>'),R:()=>N,tl:v=>v>0?k*log2(v/r):-8,btn:'Show as a power'}],ex:`${Array(k).fill(r).join(' × ')} = ${N}, so ${pw(N,frH('1/'+k))} = ${r}.`});},
 F4(){const c=pick([[4,3,2,2],[9,3,2,3],[25,3,2,5],[16,3,4,2],[8,2,3,2],[27,2,3,3],[16,3,4,2],[4,5,2,2],[64,2,3,4],[125,2,3,5],[32,3,5,2],[81,3,4,3]]),[N,p,q,r]=c,X=Math.pow(r,p);
  return valQ(X,pw(N,frH(p+'/'+q)),{k:'F4',q:`What is ${pw(N,frH(p+'/'+q))}?`,ans:X,proc:rootProc(N,p,q,r),ex:`Root first, then power: the ${q===2?'square':q===3?'cube':q+'th'} root of ${N} is ${r}, and ${r}<sup>${p}</sup> = ${X}.`},{op:'root',r,q,p});},
 F5(){const c=pick([[4,1,2,2],[9,1,2,3],[25,1,2,5],[8,1,3,2],[27,1,3,3],[27,2,3,3],[16,3,4,2],[4,3,2,2],[8,2,3,2],[9,3,2,3]]),[N,p,q,r]=c,X=1/Math.pow(r,p);
  return valQ(X,pw(N,'−'+frH(p+'/'+q)),{k:'F5',proc:rootProc(N,p,q,r,1),q:`Write ${pw(N,'−'+frH(p+'/'+q))} as a fraction.`,ans:X,ex:`Negative → flip: 1 ÷ ${pw(N,frH(p+'/'+q))}. The ${q===2?'square':q===3?'cube':q+'th'} root of ${N} is ${r}, and ${r}<sup>${p}</sup> = ${Math.pow(r,p)}. So the answer is 1/${Math.pow(r,p)}.`},{op:'root',r,q,p,neg:1});},
 F6(){const c=pick([[9,3,1/2],[8,2,1/3],[16,2,1/4],[125,5,1/3],[4,8,3/2],[9,27,3/2],[8,4,2/3],[4,0.5,-1/2],[25,5,1/2],[27,9,2/3],[16,8,3/4]]),[b,N,e]=c;
  return idx(b,e,N===0.5?frH('1/2'):String(N),'idx',{k:'F6',q:`${pw(b,'x')} = ${fmtV(N)}. Find x (a fraction).`,ans:e,ex:`${b}<sup>${fmtV(e)}</sup> = ${fmtV(N)}, so x = ${fmtV(e)}.`});},
/* ---- index laws (numbers) ---- */
 L1(){const b=pick([2,3,5,7,10]),m=R(2,6),n=R(2,6),s=m+n;return lawQ('L1',b,`${pw(b,m)} × ${pw(b,n)}`,s,`log<sub>${b}</sub> ${pw(b,m)} + log<sub>${b}</sub> ${pw(b,n)}`,`${m} + ${n}`,`When you multiply powers of the same base you add the indices: ${m} + ${n} = ${s}.`,{op:'mul',b,m,n});},
 L2(){const b=pick([2,3,5,7,10]),n=R(2,5),m=n+R(1,5),s=m-n;return lawQ('L2',b,`${pw(b,m)} ÷ ${pw(b,n)}`,s,`log<sub>${b}</sub> ${pw(b,m)} − log<sub>${b}</sub> ${pw(b,n)}`,`${m} − ${n}`,`When you divide powers of the same base you subtract the indices: ${m} − ${n} = ${s}.`,{op:'div',b,m,n});},
 L3(){const b=pick([2,3,5,10]),m=R(2,5),n=R(2,4),s=m*n;return lawQ('L3',b,`${par(pw(b,m))}<sup>${n}</sup>`,s,`${n} × log<sub>${b}</sub> ${pw(b,m)}`,`${n} × ${m}`,`A power of a power: multiply the indices: ${m} × ${n} = ${s}.`,{op:'pow',b,m,n});},
 L4(){const b=pick([2,3,5]),t=R(0,2);let L,s,w,M4,k4;
  if(t===0){const m=R(3,7),n=R(1,m-1)+0,k=n;M4=m;k4=k;L=`${pw(b,m)} × ${pw(b,'−'+k)}`;s=m-k;w=`${m} + (−${k}) = ${s}`;}
  else if(t===1){const m=R(1,4),n=R(2,6);M4=m;k4=n;L=`${pw(b,'−'+m)} ÷ ${pw(b,n)}`;s=-m-n;w=`−${m} − ${n} = ${s}`;}
  else{const m=R(1,4),n=R(2,3);M4=m;k4=n;L=`${par(pw(b,'−'+m))}<sup>${n}</sup>`;s=-m*n;w=`−${m} × ${n} = ${s}`;}
  return lawQ('L4',b,L,s,null,null,`Use the index laws with the negative sign: ${w}.`,t===0?{op:'div',b,m:M4,n:k4}:t===1?{op:'neg2',b,m:M4,n:k4}:{op:'neg3',b,m:M4,n:k4});},
 L5(){const v=pick(['x','y','a','p','t']),t=R(0,2);let L,s,w,DS5;
  if(t===0){const m=R(2,9),n=R(2,9);L=`${pw(v,m)} × ${pw(v,n)}`;DS5={op:'mul',b:v,m,n};s=m+n;w=`${m} + ${n}`;}
  else if(t===1){const n=R(2,6),m=n+R(1,6);L=`${pw(v,m)} ÷ ${pw(v,n)}`;DS5={op:'div',b:v,m,n};s=m-n;w=`${m} − ${n}`;}
  else{const m=R(2,6),n=R(2,5);L=`${par(pw(v,m))}<sup>${n}</sup>`;DS5={op:'pow',b:v,m,n};s=m*n;w=`${m} × ${n}`;}
  return Q({k:'L5',proc:[['Same base',mstep(L,`every power has the letter ${bv(v)} as its base ✓`)],['Visualise',mstep(dsH(DS5),NOTE[DS5.op])],['Convert',mstep(`${pw(v,s)} <b>⇄</b> ${lg(v,pw(v,s))} = ${s}`,'index form ⇄ log form')]],q:`${L} = ${pw(v,'?')}. Find the missing index.`,ans:s,forms:[{dis:DS5,L:()=>L,R:T=>pw(v,T),tl:x=>s-x,btn:''}],ex:`Same letter, so use the index law: ${w} = ${s}.`});},
 L6(){const b=pick([2,3,5,10]),t=R(0,2);let L,e,N,s;
  if(t===0){const n=R(2,5),N0=n+R(2,5);L=T=>`${pw(b,T)} × ${pw(b,n)}`;N=N0;s=N0-n;e=x=>x+n;}
  else if(t===1){const m=R(6,10),N0=R(2,m-2);L=T=>`${pw(b,m)} ÷ ${pw(b,T)}`;N=N0;s=m-N0;e=x=>m-x;}
  else{const n=R(2,4),k=R(2,5);L=T=>`${par(pw(b,T))}<sup>${n}</sup>`;N=n*k;s=k;e=x=>x*n;}
  return Q({k:'L6',q:`${L('?')} = ${pw(b,N)}. Find the missing index.`,ans:s,forms:[{L:T=>L(T),R:()=>pw(b,N),tl:x=>e(x)-N,btn:''}],ex:`Use the index law backwards: the missing index is ${s}.`});},
 L7(){const b=pick([2,3,5]),t=R(0,2);let L,s,w,D7;
  if(t===0){const m=R(2,3),n=R(2,3),k=R(1,4);L=`${par(pw(b,m))}<sup>${n}</sup> × ${pw(b,k)}`;D7={op:'mix1',b,m,n,k};s=m*n+k;w=`${m}×${n} + ${k}`;}
  else if(t===1){const m=R(3,6),n=R(2,5),k=R(1,m+n-1);L=`${pw(b,m)} × ${pw(b,n)} ÷ ${pw(b,k)}`;D7={op:'mix2',b,m,n,k};s=m+n-k;w=`${m} + ${n} − ${k}`;}
  else{const m=R(4,9),n=R(1,3),k=R(2,3);L=`${par(pw(b,m)+' ÷ '+pw(b,n))}<sup>${k}</sup>`;D7={op:'mix3',b,m,n,k};s=(m-n)*k;w=`(${m} − ${n}) × ${k}`;}
  return lawQ('L7',b,L,s,null,null,`Use the laws one at a time: ${w} = ${s}.`,D7);},
 L8(){const b=pick([2,3,5]),n=R(2,4),m=n+R(1,3),X=exp(b,m-n);return valQ(X,`${pw(b,m)} ÷ ${pw(b,n)}`,{k:'L8',proc:[['Same base',mstep(`${pw(b,m)} ÷ ${pw(b,n)}`,`both powers have the base ${b} ✓`)],['Visualise',mstep(dsH({op:'div',b,m,n}),NOTE.div)],['Convert',mstep(`${pw(b,m-n)} <b>⇄</b> ${lg(b,pw(b,m-n))} = ${m-n}`,'index form ⇄ log form; then work out the value')]],q:`Work out ${pw(b,m)} ÷ ${pw(b,n)}.`,ans:X,ex:`Subtract the indices: ${pw(b,m-n)} = ${X}.`},{op:'div',b,m,n});},
/* ---- index ↔ log ---- */
 C1(){const b=pick(BASES),n=R(2,b===10?5:b===2?6:4),N=exp(b,n);return idx(b,n,N,'idx',{k:'C1',q:`${pw(b,'x')} = ${N}. Find x. (Tap the button to see it as a log equation.)`,ans:n,ex:`${pw(b,n)} = ${N}, so x = ${n}. In log form: x = log<sub>${b}</sub> ${N}.`});},
 C2(){const b=pick(BASES),n=R(1,b===10?5:b===2?7:4),N=exp(b,n);return idx(b,n,N,'log',{k:'C2',q:`Work out log<sub>${b}</sub> ${N}.`,ans:n,ex:`log<sub>${b}</sub> ${N} asks “${b} to the power what gives ${N}?”. ${pw(b,n)} = ${N}, so the answer is ${n}.`});},
 C3(){const n=R(-3,5),N=Math.pow(10,n),Nd=String(N);return idx(10,n,Nd,'log',{k:'C3',q:`Work out log<sub>10</sub> ${Nd}.`,ans:n,ex:`10<sup>${n}</sup> = ${Nd}, so log<sub>10</sub> ${Nd} = ${n}.`});},
 C4(){const b=pick([2,3,5,7,10]),t=R(0,2);let X,n;if(t===0){X='1';n=0;}else if(t===1){X=b;n=1;}else{n=R(2,4);X=pw(b,n);}
  return idx(b,n,X,'log',{k:'C4',q:`Work out log<sub>${b}</sub> ${X}.`,ans:n,ex:n===0?`${pw(b,0)} = 1, so log<sub>${b}</sub> 1 = 0 (for every base).`:n===1?`${pw(b,1)} = ${b}, so log<sub>${b}</sub> ${b} = 1.`:`log<sub>${b}</sub> ${pw(b,n)} = ${n}: the log undoes the power.`});},
 C5(){const c=pick([[2,-3,'1/8'],[3,-2,'1/9'],[5,-2,'1/25'],[2,-4,'1/16'],[10,-2,'1/100'],[9,0.5,3],[8,1/3,2],[4,1.5,8],[25,0.5,5],[27,1/3,3],[16,0.75,8],[16,0.25,2],[4,0.5,2]]),[b,e,N]=c;
  return idx(b,e,frH(String(N)),'log',{k:'C5',q:`Work out log<sub>${b}</sub> ${typeof N==='string'?frH(N):N}. (Negative or fraction answers are allowed.)`,ans:e,ex:`${b}<sup>${fmtV(e)}</sup> = ${N}, so log<sub>${b}</sub> ${N} = ${fmtV(e)}.`});},
 C6(){const n=pick([2,3,4]),b=R(2,n===2?10:n===3?5:3),N=exp(b,n);
  return Q({k:'C6',q:`log<sub>?</sub> ${N} = ${n}. What is the base?`,ans:b,forms:[
   {L:T=>lg(T,N),R:()=>n,tl:v=>(v>0&&v!==1)?Math.log(N)/Math.log(v)-n:8,btn:'Show as an index equation'},
   {L:T=>pw(par(T),n),R:()=>N,tl:v=>v>0?n*log2(v/b):-8,btn:'Show as a log equation'}],ex:`log in base ${b}: ${pw(b,n)} = ${N}, so the base is ${b}.`});},
 C8(){const c=pick([[5,3,125],[2,-4,'1/16'],[4,0.5,2],[9,-0.5,'1/3'],[8,2/3,4],[3,-3,'1/27'],[2,10,1024],[10,-1,'1/10'],[4,-1.5,'1/8'],[25,1.5,125]]),[b,e,N]=c;
  return idx(b,e,frH(String(N)),'idx',{k:'C8',q:`${pw(b,'x')} = ${typeof N==='string'?frH(N):N}. Find x.`,ans:e,ex:`Use logs: x = log<sub>${b}</sub> ${N} = ${fmtV(e)}.`});},
/* ---- log laws ---- */
 G1(){const b=pick([2,3,5,10]);let a,c,D=null;if(R(0,1)){const s1=R(1,3),t=R(1,3);a=exp(b,s1);c=exp(b,t);D={op:'lgs',b,add:[s1,t],sub:0};}else{a=R(2,9);c=R(2,9);}return logLaw('G1',b,`${lg(b,a)} + ${lg(b,c)}`,a*c,`${a} × ${c}`,`log<sub>${b}</sub> ? : add the logs → multiply inside. ${a} × ${c} = ${a*c}.`,D);},
 G2(){const b=pick([2,3,5,10]);let a,c,k,D=null;if(R(0,1)){const s1=R(2,4),t=R(1,s1-1);a=exp(b,s1);c=exp(b,t);k=a/c;D={op:'lgs',b,add:[s1],sub:t};}else{c=R(2,8);k=R(2,8);a=c*k;}return logLaw('G2',b,`${lg(b,a)} − ${lg(b,c)}`,k,`${a} ÷ ${c}`,`Subtract the logs → divide inside: ${a} ÷ ${c} = ${k}.`,D);},
 G3(){const b=pick([2,3,5,10]),n=pick([2,3]);let a,D=null;if(R(0,1)){const kk=R(1,2);a=exp(b,kk);D={op:'lgs',b,add:Array(n).fill(kk),sub:0};}else a=R(2,6);return logLaw('G3',b,`${n} × ${lg(b,a)}`,Math.pow(a,n),`${a}<sup>${n}</sup>`,`A number in front becomes a power: ${n} × log<sub>${b}</sub> ${a} = log<sub>${b}</sub> ${a}<sup>${n}</sup> = log<sub>${b}</sub> ${Math.pow(a,n)}.`,D);},
 G4(){const b=pick([2,3,5,10]);let A,C,d,X,D=null;if(R(0,1)){const s1=R(1,3),t=R(1,3),u=R(1,s1+t-1);A=exp(b,s1);C=exp(b,t);d=exp(b,u);X=exp(b,s1+t-u);D={op:'lgs',b,add:[s1,t],sub:u};}else{d=pick([2,3,4,6]);let g=0;do{A=R(2,9);C=R(2,9);g++;}while(((A*C)%d||A===d||C===d)&&g<500);X=A*C/d;}return logLaw('G4',b,`${lg(b,A)} + ${lg(b,C)} − ${lg(b,d)}`,X,`${A} × ${C} ÷ ${d}`,`Add → multiply, subtract → divide: ${A} × ${C} ÷ ${d} = ${X}.`,D);},
 G5(){const b=pick([2,3,5]),k=R(1,3),c=R(2,6),a=c*exp(b,k);return Q({k:'G5',proc:[['Same base',mstep(`${a} = ${c} × ${pw(b,k)}`,`write ${a} using ${b}s`)],['Visualise',mstep(dsH({op:'fcan',b,c,k}),NOTE.fcan)],['Convert',mstep(`${lg(b,a)} − ${lg(b,c)} <b>⇄</b> ${a} ÷ ${c}`,'log form ⇄ index form')]],q:`Work out ${lg(b,a)} − ${lg(b,c)}.`,ans:k,forms:[
   {conv:'L',L:()=>`${lg(b,a)} − ${lg(b,c)}`,R:T=>T,tl:v=>k-v,btn:'Show in index form'},
   {dis:{op:'fcan',b,c,k},L:()=>`${a} ÷ ${c}`,R:T=>pw(b,T),tl:v=>(k-v)*log2(b),btn:'Show in log form'}],ex:`Subtract logs → divide: ${a} ÷ ${c} = ${exp(b,k)} = ${pw(b,k)}, so the answer is ${k}.`});},
 G6(){const c=pick([[2,5,1],[4,25,2],[5,20,2],[2,50,2],[25,40,3],[8,125,3],[5,200,3],[20,50,3],[4,250,3]]),[a,d,k]=c;return Q({k:'G6',q:`Work out log ${a} + log ${d}. (log means log<sub>10</sub>)`,ans:k,forms:[
   {L:()=>`log ${a} + log ${d}`,R:T=>T,tl:v=>k-v,btn:'Show in index form'},
   {L:()=>`${a} × ${d}`,R:T=>pw(10,T),tl:v=>(k-v)*log2(10),btn:'Show in log form'}],ex:`Add logs → multiply: ${a} × ${d} = ${a*d} = ${pw(10,k)}, so the answer is ${k}.`});},
 G7(){const b=pick([2,3,5,10]);let c,m,D=null;if(R(0,1)){const t=R(1,2),u=R(1,2);c=exp(b,t);m=exp(b,u);D={op:'lgs',b,add:[2*t+u],sub:2*t};}else{c=R(2,4);m=R(2,5);}const a=c*c*m,X=m;return logLaw('G7',b,`${lg(b,a)} − 2 × ${lg(b,c)}`,X,`${a} ÷ ${c}<sup>2</sup>`,`2 × log<sub>${b}</sub> ${c} = log<sub>${b}</sub> ${c*c}. Then subtract → divide: ${a} ÷ ${c*c} = ${X}.`,D);},
 G8(){const b=pick([2,3,5]),k=R(1,3),n=R(2,4),a=exp(b,k);return Q({k:'G8',proc:[['Same base',mstep(`${a} = ${pw(b,k)}`,`write ${a} as a power of ${b}`)],['Visualise',mstep(dsH({op:'pow',b,m:k,n}),'a power of a power → groups of groups: multiply')],['Convert',mstep(`${lg(b,a+'<sup>'+n+'</sup>')} <b>⇄</b> ${pw(b,k*n)}`,'log form ⇄ index form')]],q:`Work out ${lg(b,a+'<sup>'+n+'</sup>')}.`,ans:k*n,forms:[
   {conv:'L',L:()=>lg(b,a+'<sup>'+n+'</sup>'),R:T=>T,tl:v=>k*n-v,btn:'Show in index form'},
   {dis:{side:'R',op:'pow',b,m:k,n},L:T=>pw(b,T),R:()=>`${a}<sup>${n}</sup>`,tl:v=>(v-k*n)*log2(b),btn:'Show in log form'}],ex:`${n} × log<sub>${b}</sub> ${a} = ${n} × ${k} = ${k*n}.`});}
};
/* an index-law question: balance of the numbers form, log version one tap away */
function lawQ(k,b,L,s,logL,logW,ex,dis){
  const forms=[{dis,L:()=>L,R:T=>pw(b,T),tl:v=>s-v,btn:logL?'Show the log version of this law':''}];
  if(logL)forms.push({L:()=>`${logL}`,R:T=>T,tl:v=>s-v,btn:'Show the index version'});
  const proc=dis?[['Same base',mstep(L,`every power has the base ${bv(b)} ✓`)],['Visualise',mstep(dsH(dis),NOTE[dis.op])],['Convert',mstep(logL?`${L} <b>⇄</b> ${logL}`:`${pw(b,s)} <b>⇄</b> ${lg(b,pw(b,s))} = ${s}`,'index form ⇄ log form')]]:null;
  return Q({k,q:`${L} = ${pw(b,'?')}. Find the missing index.`,ans:s,forms,ex,proc});
}
/* a log-law question: log version, with an index version (raise the base to both sides) one tap away */
function logLaw(k,b,Lh,X,indexH,ex,dis){
  const proc=dis?[['Same base',mstep(Lh,`write every number as a power of ${b}: count the ${b}s`)],['Visualise',mstep(dsH(dis),NOTE[dis.op])],['Convert',mstep(`${Lh} <b>⇄</b> ${indexH}`,'log form ⇄ index form')]]:null;
  return Q({k,proc,q:`${Lh} = ${lg(b,'?')}. What goes in the box?`,ans:X,forms:[
   {conv:'L',L:()=>Lh,R:T=>lg(b,T),tl:v=>v>0?log2(X/v):8,btn:'Show in index form'},
   {dis,L:()=>indexH,R:T=>T,tl:v=>v>0?log2(X/v):8,btn:'Show in log form'}],ex});
}

/* ---- levels: name, question types, and difficulty / tags per question type ---- */
const D={B8:[3,['ix-law-pow']],B9:[5,['ix-frac']],B10:[6,['ix-frac','ix-frac-pq']],B1:[1,['ix-repeat']],B2:[2,['ix-law-div']],B3:[2,['ix-law-mul']],B4:[3,['ix-zero']],B5:[3,['ix-neg']],B6:[4,['ix-law-mul','ix-law-div','ix-neg']],B7:[4,['ix-law-div','ix-neg']],R1:[1,['ix-repeat']],R2:[1,['ix-eval']],R3:[2,['ix-find-index','lg-convert']],R4:[3,['ix-find-base']],
 Z1:[2,['ix-zero']],Z2:[2,['ix-zero']],Z3:[3,['ix-zero','ix-eval']],
 N1:[3,['ix-neg']],N2:[3,['ix-neg']],N3:[3,['ix-neg']],N4:[4,['ix-neg','ix-find-index']],N5:[5,['ix-neg','ix-neg-frac-base']],
 F1:[4,['ix-frac']],F2:[4,['ix-frac']],F3:[5,['ix-frac']],F4:[6,['ix-frac','ix-frac-pq']],F5:[7,['ix-frac','ix-frac-pq','ix-frac-neg']],F6:[7,['ix-frac','ix-find-index']],
 L1:[3,['ix-law-mul']],L2:[3,['ix-law-div']],L3:[4,['ix-law-pow']],L4:[5,['ix-law-neg']],L5:[4,['ix-letters']],L6:[5,['ix-missing']],L7:[6,['ix-combine']],L8:[3,['ix-law-div','ix-eval']],
 C1:[4,['lg-convert','ix-find-index']],C2:[5,['lg-convert','lg-value']],C3:[5,['lg-value','lg-neg']],C4:[5,['lg-special']],C5:[7,['lg-value','lg-neg','lg-frac']],C6:[7,['lg-base']],C8:[8,['lg-convert','lg-neg','lg-frac']],
 G1:[6,['lg-add']],G2:[6,['lg-sub']],G3:[7,['lg-pow']],G4:[8,['lg-mix']],G5:[7,['lg-simplify','lg-sub']],G6:[7,['lg-simplify','lg-add']],G7:[8,['lg-mix','lg-pow']],G8:[7,['lg-pow','lg-simplify']]};
const clamp=d=>Math.max(1,Math.min(10,d));
/* one level = one question.  A level is named  “skill · easy|medium|hard”; the difficulty word is worked out from the question tags, the same way the player profile does it. */
const LVS=[
 ['Repeated multiplication',['R1','R3']],['Evaluate powers',['R2']],['Find the missing base',['R4','R3']],['Build a power',['B1','B2']],
 ['Zero index',['Z1','Z2','Z3']],['Build zero index',['B4']],
 ['Negative index',['N1','N2','N3']],['Negative index',['N4','N5','N2']],['Build negative index',['B5']],
 ['Fractional index',['F1','F2','F3']],['Fractional index',['F5','F4','F6']],
 ['Index law: multiply',['L1']],['Index law: divide',['L2','L8']],['Index law: power of a power',['L3']],['Index laws with negative indices',['L4']],['Index laws with letters',['L5']],['Index laws with a missing index',['L6','L7']],
 ['Build multiplying powers',['B3']],['Build dividing powers',['B7','B2']],['Build change the power',['B6']],['Build power of a power',['B8']],['Build roots',['B9']],['Build fractional index',['B10']],
 ['Index form and log form',['C1']],['Log values',['C2','C3']],['Special logs',['C4']],['Negative and fractional logs',['C5']],['Find the base',['C6','C2']],['Solve index equations with logs',['C8','C1']],
 ['Log law: add',['G1']],['Log law: subtract',['G2','G5']],['Log law: powers',['G3','G8']],['Log laws combined',['G4','G6','G7']],
 ['Mixed indices',['R2','Z3','N2','F4','L1','L4','L7']],['Mixed logs and laws',['C2','C5','G1','G2','G3','G4','G7']]];
const LV=LVS.map(([sk,pool])=>{const d=Math.round(clamp(pool.reduce((t,k)=>t+D[k][0],0)/pool.length));return[sk+' · '+(d<=3?'easy':d<=6?'medium':'hard'),pool];});
const POOL=LV.map(l=>l[1]);
const plain=h=>String(h).replace(/<sup>/g,'^(').replace(/<\/sup>/g,')').replace(/<\/i><i>/g,'/').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const qq=(key,cur)=>{const m=D[cur.k||key];if(!m)return null;return{v:1,tags:[...m[1]].sort(),diff:m[0],score:m[0],qt:cur.k||key,eq:plain(cur.q)};};
const qmeta=lv=>{const pool=[...new Set(POOL[lv-1])],ms=pool.map(k=>D[k]),all=new Set(ms.flatMap(m=>m[1])),tags=[...all].filter(t=>ms.every(m=>m[1].includes(t))).sort(),
  sometimes=[...all].filter(t=>!tags.includes(t)).sort(),d=ms.reduce((a,m)=>a+m[0],0)/ms.length;
  return{tags,sometimes,types:pool,diff:Math.round(clamp(d)),score:Math.round(clamp(d)*10)/10};};
window.__ix={QT,POOL,D,LV};
REG.push({id:'indices',name:'Power Balance',emoji:'🔋',color:'#0b7285',cat:'Algebra',qmeta,
 desc:'Powers, indices and logs on a balance. See why n⁰ = 1, why negative indices flip, what a fractional index means, and how every index law turns into a log law. Tap the button to swap an equation between index form and log form.',
 skills:['powers and indices','zero, negative and fractional indices','index laws','logarithms','log laws'],levels:LV.map(l=>l[0]),
 how:'Index levels: type the missing number (− for negative, / for a fraction). Build levels: drag ×a or ÷a blocks onto the right pan (some levels also have ( )ⁿ and √ buttons that act on the whole pan), then press Check.',
 art:'<div class="minibal">🔋</div>',
 mount(root,lv,ctx){mountQuiz(root,ctx,{single:true,popup:true,game:null,qq,QT,pool:POOL[lv-1],parse:num,slash:true,minus:true,compact:true,winTitle:'Power player!'});}});
})();
