(function(){
const G=(a,b)=>b?G(b,a%b):Math.abs(a);
const F=(p,q=1)=>{if(q<0){p=-p;q=-q}const g=G(p,q)||1;return[p/g,q/g]};
const add=(a,b)=>F(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),sub=(a,b)=>F(a[0]*b[1]-b[0]*a[1],a[1]*b[1]);
const mul=(a,b)=>F(a[0]*b[0],a[1]*b[1]),dv=(a,b)=>F(a[0]*b[1],a[1]*b[0]);
const z=a=>a[0]===0,isInt=a=>a[1]===1,eq1=a=>a[0]===1&&a[1]===1;
const fh=(n,d)=>`<span class="fr"><i>${n}</i><i>${d}</i></span>`;
const S=n=>String(n).replace('-','−');
let SC=1;const RR=(a,c)=>R(a,Math.max(a,Math.round(c*SC)));
function gen0(l){
  const x=l===11?-RR(1,8):RR(1,10);
  let a=1,b=0,c=0,d=0;
  const pos=n=>n; // helpers
  if(l===1){b=RR(1,9);d=x+b;}
  else if(l===2){a=RR(2,5);d=a*x;}
  else if(l===3){a=2;b=RR(1,9);d=a*x+b;}
  else if(l===4){a=RR(2,5);b=RR(1,12);d=a*x+b;}
  else if(l===5){b=-RR(1,9);d=x+b;}
  else if(l===6){a=RR(2,5);b=-RR(1,12);d=a*x+b;}
  else if(l===7){a=RR(2,4);c=1;b=RR(1,10);d=(a-c)*x+b;}
  else if(l===8){c=RR(1,3);a=c+RR(1,3);b=RR(1,9);d=(a-c)*x+b;}
  else if(l===9){c=RR(1,3);a=c+RR(1,3);b=-RR(1,9);d=(a-c)*x+b;}
  else if(l===10){c=RR(2,4);a=c+RR(1,3);b=RR(1,15);d=(a-c)*x+b;}
  else if(l===11){a=RR(2,4);b=RR(1,9);d=a*x+b;if(Math.random()<.5){c=1;d=(a-c)*x+b;}}
  else{c=RR(2,5);a=pick([1,2,3].filter(v=>v<c));b=RR(3,16);d=(a-c)*x+b;}
  // equation: a x + b = c x + d  where d may be negative etc; for l<7, c=0
  if(l<7){c=0;if(l===1||l===5)a=1;}
  if(l===12||l===11&&c===1){}
  return{L:{x:F(a),n:F(b)},Rr:{x:F(c),n:F(d)},sol:F(x)};
}

function gen(l){
  if(l>20)return gen2(l);
  if(l<=12)return gen0(l);
  const t=RR(1,6);let a,p,q,b,c,d,e,r;
  const mk=(lx,ln,rx,rn,x)=>({L:{x:lx,n:ln},Rr:{x:rx,n:rn},sol:x});
  if(l===13){a=RR(2,5);b=RR(2,9);return mk(F(1,a),F(0),F(0),F(b),F(a*b));}
  if(l===14){a=RR(2,9);b=RR(2,12);return mk(F(1,a),F(0),F(0),F(b),F(a*b));}
  if(l===15){a=RR(2,6);b=RR(1,9);return mk(F(1,a),F(b),F(0),F(t+b),F(a*t));}
  if(l===16){a=RR(2,6);b=RR(1,6);const tt=t+b;return mk(F(1,a),F(-b),F(0),F(tt-b),F(a*tt));}
  if(l===17){q=pick([3,4,5]);p=pick([2,3,4].filter(v=>v<q&&G(v,q)===1));return mk(F(p,q),F(0),F(0),F(p*t),F(q*t));}
  if(l===18){q=pick([3,4,5]);p=pick([2,3,4].filter(v=>v<q&&G(v,q)===1));b=RR(1,9);return mk(F(p,q),F(b),F(0),F(p*t+b),F(q*t));}
  if(l===19){a=pick([2,3,4]);b=RR(1,9);return mk(F(1,a),F(b),F(1),F(t+b-a*t),F(a*t));}
  q=pick([2,3,4,5]);r=RR(1,q-1);b=RR(1,9);return mk(F(r+1,q),F(b),F(r,q),F(b+t),F(q*t));
}
/* families 21+: flipped equations (x on the right), fraction answers, and a mixed boss */
const mir=E=>({L:E.Rr,Rr:E.L,sol:E.sol});
function gen2(f){
  const mk=(lx,ln,rx,rn,x)=>({L:{x:lx,n:ln},Rr:{x:rx,n:rn},sol:x});
  if(f===21)return mir(gen0(1));
  if(f===22)return mir(gen0(2));
  if(f===23)return mir(gen0(3));
  if(f===24)return mir(gen0(4));
  if(f===25)return mir(gen0(pick([5,6])));
  if(f===26)return mir(gen0(pick([7,8,9,10])));
  if(f===27)return mir(gen(pick([13,14,15,16])));
  if(f===28)return mir(gen(pick([17,18,19,20])));
  if(f===29){const a=RR(2,9);let p;do{p=RR(1,a*3);}while(p%a===0||G(p,a)!==1);return mk(F(a),F(0),F(0),F(p),F(p,a));}
  if(f===30){const a=RR(2,6),b=RR(1,9);let m;do{m=RR(1,a*3);}while(m%a===0||G(m,a)!==1);return mk(F(a),F(b),F(0),F(b+m),F(m,a));}
  if(f===31){const k=RR(2,4),c=RR(1,3),b=RR(1,9);let m;do{m=RR(1,k*4);}while(m%k===0||G(m,k)!==1);return mk(F(c+k),F(b),F(c),F(b+m),F(m,k));}
  const o=pick([...Array(31).keys()].map(i=>i+1));return o>20?gen2(o):gen(o);   // 32: boss mix
}
const genL=lv=>{const f=Math.ceil(lv/5),s=(lv-1)%5;SC=1+.5*s;try{let E;for(let i=0;i<60;i++){E=gen(f);if(Math.abs(E.sol[0]/E.sol[1])<=100)break;}return E;}finally{SC=1;}};
function termsHTML(s){
  const out=[];
  if(!z(s.x)){const[p,q]=s.x,neg=p<0,ap=Math.abs(p);
    const body=q===1?(ap===1?'x':ap+'x'):fh(ap===1?'x':ap+'x',q);out.push({neg,h:body});}
  if(!z(s.n)||!out.length){const[p,q]=s.n,neg=p<0,ap=Math.abs(p);out.push({neg,h:q===1?String(ap):fh(ap,q)});}
  return out.map((t,i)=>(i===0?(t.neg?'−':''):(t.neg?' − ':' + '))+t.h).join('');
}
const lit=termsHTML;
const lab=t=>String(t).replace(/(\d*x?)\/(\d+)/g,(m,a,b)=>fh(a,b));
const ftxt=a=>a[1]===1?S(a[0]):S(a[0])+'/'+a[1];

const xval=E=>E.sol[0]/E.sol[1];
const val=(side,xs)=>side.x[0]/side.x[1]*xs+side.n[0]/side.n[1];
const fz=a=>a[0]/a[1];
/* ---------- question tags: what a given equation really asks of the student ---------- */
const eqTxt=E=>{const side=S=>{const t=[];if(!z(S.x)){const[p,q]=S.x;t.push((p<0?'-':'')+(Math.abs(p)===1?'':Math.abs(p))+'x'+(q===1?'':'/'+q));}if(!z(S.n)||!t.length)t.push(ftxt(S.n));return t.join(' + ').replace(/\+ [-−]/g,'- ');};return side(E.L)+' = '+side(E.Rr);};
/* shortest solution: collect x on the side with the bigger x (keeps the coefficient positive), clear the constant there, then undo the coefficient */
function plan(E){
  let xs=E.L,os=E.Rr;if(!z(os.x)&&(z(xs.x)||fz(os.x)>fz(xs.x))){xs=E.Rr;os=E.L;}
  const both=!z(xs.x)&&!z(os.x),k=sub(xs.x,os.x),out=[];
  if(both)out.push({op:'sub',on:'x',by:os.x});
  if(!z(xs.n))out.push({op:xs.n[0]>0?'sub':'add',on:'n',by:[Math.abs(xs.n[0]),xs.n[1]]});
  if(k[1]!==1)out.push({op:'mul',on:'all',by:[k[1],1]});
  if(Math.abs(k[0])!==1)out.push({op:'div',on:'all',by:[Math.abs(k[0]),1]});
  return{moves:out,xs,os,both,k};
}
function analyse(E){
  const P=plan(E),ops=[...new Set(P.moves.map(m=>m.op))],steps=P.moves.length,tags=[];
  ops.forEach(o=>tags.push('op-'+o));if(steps===1)tags.push('only-'+ops[0]);
  tags.push('steps-'+Math.min(3,Math.max(1,steps)));
  tags.push(P.both?'x-both-sides':'x-one-side');
  const sides=[E.L,E.Rr],xt=sides.map(s=>s.x).filter(a=>!z(a)),all=[E.L.x,E.L.n,E.Rr.x,E.Rr.n];
  if(sides.some(s=>s.n[0]<0))tags.push('neg-const');
  if(E.sol[0]<0)tags.push('neg-answer');
  if(E.sol[1]>1)tags.push('frac-answer');
  if(P.xs===E.Rr&&(z(E.L.x)||fz(E.Rr.x)>fz(E.L.x)))tags.push('x-on-right');
  if(xt.some(a=>a[1]>1)||sides.some(s=>s.n[1]>1))tags.push('fractions');
  if(xt.some(a=>a[1]>1)){tags.push(xt.some(a=>a[1]>1&&Math.abs(a[0])>1)?'frac-nonunit':'frac-unit');}
  if(sides.some(s=>s.n[1]>1))tags.push('frac-const');
  if(P.both&&xt.length===2&&xt.every(a=>a[1]>1))tags.push('frac-both');
  const big=Math.max(...all.map(a=>Math.abs(a[0])),Math.abs(E.sol[0]));
  if(big>=30)tags.push('big-numbers');
  /* difficulty 1-10: how many moves, plus what makes each move harder */
  const has=t=>tags.includes(t);
  let d=steps+(has('x-both-sides')?1:0)+(has('neg-const')?.75:0)+(has('neg-answer')?.75:0)
       +(has('frac-unit')?1.5:0)+(has('frac-nonunit')?2.25:0)+(has('frac-both')?.75:0)+(has('frac-answer')?1.25:0)+(has('x-on-right')?.25:0)+(has('frac-const')?1:0)+Math.min(1.5,big/40);
  d=Math.max(1,Math.min(10,d*1.15));return{v:1,eq:eqTxt(E),tags:tags.sort(),ops,steps,diff:Math.round(d),score:Math.round(d*10)/10};
}
function tilesOf(side){
  const out=[];
  const x=side.x;if(x[0]!==0){const ap=Math.abs(x[0]);out.push({kind:'x',v:x,label:(x[0]<0?'−':'')+(ap===1?'':ap)+'x'+(x[1]===1?'':'/'+x[1])});}
  const n=side.n;if(n[0]!==0)out.push({kind:'n',v:n,label:ftxt(n)});
  return out;
}
const GX={'+':'＋','-':'−'};
REG.push({id:'balance',qmeta:lv=>levelFromSamples(()=>analyse(genL(lv))),qtest:{genL,plan,analyse,F,add,sub,mul,dv},name:'Balance Scale',emoji:'⚖️',color:'#6741d9',cat:'Algebra',
 desc:'A real balance! Drag x and 1 weights on and off the pans (both sides always change together), and swing the pointer on the base right to multiply or left to divide. Keep it level to find x.',skills:['solving equations','inverse operations','balancing method','fractions in equations'],
 levels:['x + a = b','Multiples: 2x = b','Two-step: 2x + a = b','Two-step: ax + b = c','Negatives: x − a = b','Negatives: ax − b = c','x on both sides (easy)','x on both sides','x on both sides + negatives','x on both sides · bigger numbers','Negative answers','Boss equations','x/a = b','x/a = b · bigger','x/a + b = c','x/a − b = c','Fractions: (p/q)x = c','Fractions: (p/q)x + b = c','x/a + b = x + c','Fractions on both sides','Flipped: b = x + a','Flipped: b = ax','Flipped: b = ax + a','Flipped: c = ax + b','Flipped negatives','Flipped: x on both sides','Flipped: x/a','Flipped: (p/q)x','Fraction answers: ax = b','Fraction answers: ax + b = c','Fraction answers: x on both sides','Boss 2: all equation types'].flatMap(n=>['warm-up','easy','medium','hard','tough'].map(d=>n+' · '+d)),
 how:'Drop an x or 1 weight on a pan to add it to BOTH sides. Drag a tile off a pan to take ALL of it away from both sides (tap a tile to take away just one). The tiles show the totals. On the base, swing the pointer right (×) or left (÷), flip +/− for negatives, then press Apply. Get x alone.',
 art:'<div class="minibal">⚖️</div>',
 mount(root,lv,ctx){
  let nUndo=0,nHint=0,nRestart=0,E,E0,snap=[],over=false,busy=false,ang=0,vel=0,tgt=0,raf=0,drag=null,kick=0,steps=[],solvedTxt=null;
  const W=()=>Math.max(260,Math.min(root.clientWidth||340,440));
  root.innerHTML=`<div class="sc"><div class="sc-top"><div class="sc-box"><div class="sc-lab">Weights</div><div class="sc-wts"><div class="wt xw" data-k="x">x</div><div class="wt uw" data-k="n">1</div></div></div><div class="sc-eq" id="eq"></div></div>
   <div class="sc-scene" id="scene"><div class="sc-opb" id="opb"></div><svg class="sc-svg" id="svg"></svg><div class="sc-beam" id="beam"><i></i></div>
    <div class="sc-pan" data-p="L"><div class="sc-tiles"></div><div class="sc-dish"></div></div><div class="sc-pan" data-p="Rr"><div class="sc-tiles"></div><div class="sc-dish"></div></div>
    <div class="sc-post"></div><div class="sc-base"><svg class="sc-gauge" id="gauge" viewBox="0 0 170 94"></svg><div class="sc-ctl"><div class="sgn" id="sgn"><i id="sthumb"></i><span data-s="1" class="on">+</span><span data-s="-1">−</span></div><button class="lv go" id="bgo">Apply ×1</button></div></div></div>
   <div class="msg" id="msg">&nbsp;</div><div class="bs-log" id="log"></div>
   <div class="toolrow"><button class="btn alt" id="un">↶ Undo</button><button class="btn alt" id="rs">⟲ Restart</button><button class="btn alt" id="hn">💡 Hint</button><button class="btn" id="nw">New equation ⏭</button></div></div>`;
  const scene=$('#scene'),svg=$('#svg'),beam=$('#beam'),pans={L:$('.sc-pan[data-p=L]',root),Rr:$('.sc-pan[data-p=Rr]',root)};
  const clone=o=>({L:{x:o.L.x,n:o.L.n},Rr:{x:o.Rr.x,n:o.Rr.n},sol:o.sol});
  function geom(){const w=scene.clientWidth||W(),pw=Math.round(w*.44),h=(w-pw)/2,cx=w/2,fy=58;return{w,pw,h,cx,fy};}
  function place(){
    const g=geom(),a=ang*Math.PI/180,s=Math.sin(a),c=Math.cos(a);
    const ex={L:[g.cx-g.h*c,g.fy+g.h*s],Rr:[g.cx+g.h*c,g.fy-g.h*s]};
    beam.style.width=(2*g.h+24)+'px';beam.style.left=(g.cx-g.h-12)+'px';beam.style.top=(g.fy-6)+'px';beam.style.transform=`rotate(${-ang}deg)`;
    let sv='';const pH=pans.L.offsetHeight||122;
    for(const p of['L','Rr']){const pe=pans[p],px=ex[p][0]-g.pw/2,py=ex[p][1]+38;
      pe.style.width=g.pw+'px';pe.style.left=px+'px';pe.style.top=py+'px';
      sv+=`<line x1="${ex[p][0]}" y1="${ex[p][1]}" x2="${px+10}" y2="${py+pH-5}" class="sc-str"/><line x1="${ex[p][0]}" y1="${ex[p][1]}" x2="${px+g.pw-10}" y2="${py+pH-5}" class="sc-str"/><circle cx="${ex[p][0]}" cy="${ex[p][1]}" r="4" class="sc-pin"/>`;}
    svg.setAttribute('viewBox',`0 0 ${g.w} 360`);svg.innerHTML=sv+`<circle cx="${g.cx}" cy="${g.fy}" r="9" class="sc-pin big"/>`;
  }
  function spring(){cancelAnimationFrame(raf);const step=()=>{vel+=(tgt-ang)*.11;vel*=.84;ang+=vel;place();if(Math.abs(vel)>.01||Math.abs(tgt-ang)>.04)raf=requestAnimationFrame(step);else{ang=tgt;place();}};raf=requestAnimationFrame(step);}
  ctx.cleanups.push(()=>cancelAnimationFrame(raf));
  const dif=()=>{const xs=xval(E);return val(E.L,xs)-val(E.Rr,xs);};
  const balanced=()=>Math.abs(dif())<1e-9;
  const target=()=>{const d=dif();return Math.abs(d)<1e-9?0:Math.sign(d)*Math.min(17,4+Math.abs(d)*1.6);};
  const solvedSide=(A,B)=>A.x[0]===1&&A.x[1]===1&&z(A.n)&&z(B.x);
  const eqHTML=S=>`${lit(S.L)} <b class="eqb">=</b> ${lit(S.Rr)}`;
  const opLabel=(kind,a)=>{const ab=[Math.abs(a[0]),a[1]],nu=kind==='x'&&ab[0]===1?'':ab[0];return (a[0]>0?'+':'−')+nu+(kind==='x'?'x':'')+(ab[1]===1?'':'/'+ab[1]);};
  const opFor=f=>{const neg=f[0]<0,a=Math.abs(f[0]);const w=t=>neg?`(−${t})`:String(t);return f[1]===1?'×'+w(a):'÷'+w(f[1]);};
  function recordStep(info){
    const last=steps[steps.length-1];
    if(info.t==='w'&&last&&last.t==='w'&&last.kind===info.kind){last.amt=add(last.amt,info.amt);
      if(last.amt[0]===0)steps.pop();else{last.op=opLabel(last.kind,last.amt);last.eq=eqHTML(E);}}
    else steps.push({t:info.t,kind:info.kind,amt:info.amt,op:info.op||opLabel(info.kind,info.amt),eq:eqHTML(E)});
  }
  function showBadge(){
    const l=steps[steps.length-1],b=$('#opb');
    if(!l){b.style.display='none';return;}
    const c=l.op[0];b.style.display='block';b.innerHTML=lab(l.op);b.className='sc-opb '+(c==='+'?'pl':c==='−'?'mi':c==='×'?'ml':'dv');
    void b.offsetWidth;b.classList.add('bump');
  }
  function update(anim,msg){
    $('#eq').innerHTML=`<div class="el orig">${eqHTML(E0)}</div>`+steps.map((t,i)=>`<div class="el ${i===steps.length-1?'last':'old'}"><span class="otg ${t.op[0]==='+'?'pl':t.op[0]==='−'?'mi':t.op[0]==='×'?'ml':'dv'}">${lab(t.op)}</span>${t.eq}<span class="otg ${t.op[0]==='+'?'pl':t.op[0]==='−'?'mi':t.op[0]==='×'?'ml':'dv'}">${lab(t.op)}</span></div>`).join('');
    if(solvedTxt)$('#eq').innerHTML+=`<div class="el fin">✅ x = ${lab(solvedTxt)}</div>`;
    $('#eq').scrollTop=1e5;showBadge();
    for(const p of['L','Rr']){const box=$('.sc-tiles',pans[p]);box.innerHTML='';
      tilesOf(E[p]).forEach((t,i)=>{const d=document.createElement('div');d.className='t chip '+(t.kind==='x'?'tx':'tn')+(t.v[0]<0?' ng':'')+(anim?' '+anim:'');
        if(anim)d.style.animationDelay=(i*25)+'ms';d.innerHTML=lab(t.label);d.dataset.p=p;d.dataset.kind=t.kind;d.dataset.v=t.v.join('/');
        d.addEventListener('pointerdown',ev=>startDrag(ev,{kind:t.kind,v:t.v,from:p,el:d}));box.appendChild(d);});}
    tgt=target();vel+=kick;kick=0;spring();
    $('#log').innerHTML='';
    if(over)return;
    if(msg)$('#msg').innerHTML=msg;
    else $('#msg').innerHTML=balanced()?'⚖️ Balanced':'⚠️ Out of balance — do the same to the other pan!';
    if(balanced()&&(solvedSide(E.L,E.Rr)||solvedSide(E.Rr,E.L))){over=true;const v=solvedSide(E.L,E.Rr)?E.Rr.n:E.L.n;
      $('#msg').innerHTML='✅ x = '+ftxt(v);solvedTxt=ftxt(v);try{const u=me();if(u){u.rv=u.rv||{};u.rv['balance_'+lv]={E0:clone(E0),E:clone(E),steps:JSON.parse(JSON.stringify(steps)),solved:solvedTxt};persist();}}catch(e){}
      $('#eq').innerHTML+=`<div class="el fin">✅ x = ${lab(solvedTxt)}</div>`;$('#eq').scrollTop=1e5;
      ctx.perf={moves:steps.length,best:ctx.q.steps,undos:nUndo,hints:nHint,restarts:nRestart};ctx.timeout(()=>ctx.win('Balanced!',`x = ${ftxt(v)}. You kept the scale level all the way.`,build,'New equation',{stay:true}),700);}
  }
  function commit(f,anim,msg,info){if(over||busy)return false;snap.push({E:clone(E),st:JSON.stringify(steps)});const ok=f();if(ok===false){snap.pop();return false;}if(info)recordStep(info);update(anim,msg);return true;}
  const addTile=(p,kind,v)=>{E[p]={...E[p],[kind]:add(E[p][kind],v)};};
  const addBoth=(kind,v)=>{addTile('L',kind,v);addTile('Rr',kind,v);};
  /* ---------- dragging ---------- */
  function startDrag(ev,spec){
    if(over||busy)return;ev.preventDefault();
    const g=document.createElement('div');g.className='ghost '+(spec.kind==='x'?'tx':'tn')+(spec.v[0]<0?' ng':'');g.innerHTML=spec.el?spec.el.innerHTML:(spec.kind==='x'?'x':'1');
    document.body.appendChild(g);if(spec.el)spec.el.classList.add('lifted');
    drag={spec,g,x0:ev.clientX,y0:ev.clientY,moved:false};mv(ev);
    window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  }
  function mv(ev){if(!drag)return;drag.g.style.left=ev.clientX+'px';drag.g.style.top=ev.clientY+'px';if(Math.hypot(ev.clientX-drag.x0,ev.clientY-drag.y0)>6)drag.moved=true;
    drag.g.style.display='none';const h=document.elementFromPoint(ev.clientX,ev.clientY);drag.g.style.display='';
    const pe=h&&h.closest&&h.closest('.sc-pan');Object.values(pans).forEach(x=>x.classList.toggle('hot',x===pe));}
  function up(ev){
    window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
    const d=drag;drag=null;if(!d)return;d.g.style.display='none';const h=document.elementFromPoint(ev.clientX,ev.clientY);d.g.remove();
    Object.values(pans).forEach(x=>x.classList.remove('hot'));if(d.spec.el)d.spec.el.classList.remove('lifted');
    const pe=h&&h.closest&&h.closest('.sc-pan'),to=pe?pe.dataset.p:null,{kind,v,from}=d.spec;
    if(!from){ if(to){kick=to==='L'?3:-3;commit(()=>addBoth(kind,v),null,null,{t:'w',kind,amt:v});} else if(d.moved)$('#msg').innerHTML='Drop the weight onto a pan.'; else toast('Drag me onto a pan'); return;}
    if(!d.moved){kick=from==='L'?-3:3;const sgn=v[0]<0?-1:1,one=Math.abs(v[0])>=v[1]?F(1):[Math.abs(v[0]),v[1]],nv=F(-sgn*one[0],one[1]);commit(()=>addBoth(kind,nv),null,null,{t:'w',kind,amt:nv});return;} // tap = take away just one
    if(!to){kick=from==='L'?-3:3;const nv=F(-v[0],v[1]);commit(()=>addBoth(kind,nv),null,null,{t:'w',kind,amt:nv});return;} // drag off = take away the WHOLE tile
    update();
  }
    const boxV=()=>F(1);
  root.querySelectorAll('.wt').forEach(w=>w.addEventListener('pointerdown',ev=>startDrag(ev,{kind:w.dataset.k,v:boxV(),from:null})));
  /* ---------- dial: right = × , left = ÷ ---------- */
  const PV=[85,84],RR=66,MAXA=70;let pp=0,sg=1;
  const ang2xy=(a,r)=>[PV[0]+r*Math.sin(a*Math.PI/180),PV[1]-r*Math.cos(a*Math.PI/180)];
  (function drawGauge(){
    let g='';
    const arc=(a0,a1,col)=>{const p0=ang2xy(a0,54),p1=ang2xy(a1,54);return`<path d="M${p0[0]} ${p0[1]}A54 54 0 0 1 ${p1[0]} ${p1[1]}" stroke="${col}" stroke-width="11" fill="none" stroke-linecap="butt" opacity=".9"/>`;};
    g+=arc(-MAXA,-2,'#22b8cf')+arc(2,MAXA,'#ff922b');
    for(let p=-11;p<=11;p++){const a=p/11*MAXA,i0=ang2xy(a,p%11===0||p===0?44:58),i1=ang2xy(a,p===0?68:63);g+=`<line x1="${i0[0]}" y1="${i0[1]}" x2="${i1[0]}" y2="${i1[1]}" stroke="#fff" stroke-width="${p===0?3:1.4}"/>`;}
    const L=[[-11,'÷12'],[-5,'÷6'],[0,'1'],[5,'×6'],[11,'×12']];
    L.forEach(([p,t])=>{const q=ang2xy(p/11*MAXA,p===0?76:77);g+=`<text x="${q[0]}" y="${q[1]+3}" text-anchor="middle" class="gl">${t}</text>`;});
    g+=`<g id="needle" style="transform-origin:${PV[0]}px ${PV[1]}px;transition:transform .2s cubic-bezier(.3,1.6,.5,1)"><line x1="${PV[0]}" y1="${PV[1]}" x2="${PV[0]}" y2="30" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><circle cx="${PV[0]}" cy="30" r="3.5" fill="#fff"/></g><circle cx="${PV[0]}" cy="${PV[1]}" r="9" fill="#fff"/>`;
    $('#gauge').innerHTML=g;
  })();
  const facLabel=()=>{const m=pp>0?'×'+(pp+1):pp<0?'÷'+(1-pp):'×1';return sg<0?m+' (−)':m;};
  const factor=()=>{const f=pp>0?F(pp+1):pp<0?F(1,1-pp):F(1);return sg<0?F(-f[0],f[1]):f;};
  function setP(v){pp=Math.max(-11,Math.min(11,v));$('#needle').style.transform=`rotate(${pp/11*MAXA}deg)`;$('#bgo').textContent='Apply '+facLabel();$('#bgo').className='lv go '+(pp<0?'dv':'ml');}
  function setSg(v){sg=v;root.querySelectorAll('#sgn span').forEach(e=>e.classList.toggle('on',+e.dataset.s===sg));$('#sthumb').style.transform=sg<0?'translateX(100%)':'none';$('#sthumb').className=sg<0?'neg':'';setP(pp);}
  const gp=ev=>{const r=$('#gauge').getBoundingClientRect(),sx=r.width/170,px=r.left+PV[0]*sx,py=r.top+PV[1]*sx;let a=Math.atan2(ev.clientX-px,py-ev.clientY)*180/Math.PI;a=Math.max(-MAXA,Math.min(MAXA,a));setP(Math.round(a/MAXA*11));};
  function applyDial(){const f=factor(),idle=pp===0&&sg===1,mult=pp>=0;if(idle){toast('Swing the pointer right (×) or left (÷) first');return;}scale(mult,f);setP(0);}
  $('#bgo').onclick=applyDial;
  $('#gauge').addEventListener('pointerdown',ev=>{ev.preventDefault();if(over||busy)return;gp(ev);
    const m=e=>gp(e),u=()=>{window.removeEventListener('pointermove',m);window.removeEventListener('pointerup',u);window.removeEventListener('pointercancel',u);};
    window.addEventListener('pointermove',m);window.addEventListener('pointerup',u);window.addEventListener('pointercancel',u);});
  root.querySelectorAll('#sgn span').forEach(e=>e.onclick=()=>setSg(+e.dataset.s));
  $('#sgn').addEventListener('click',ev=>{if(ev.target.id==='sgn'||ev.target.id==='sthumb')setSg(-sg);});
  const tooBig=o=>[o.L.x,o.L.n,o.Rr.x,o.Rr.n].some(a=>Math.abs(a[0])>240||a[1]>36);
  function scale(mult,f){ // f: rational factor
    if(over||busy)return;const nE=clone(E);for(const p of['L','Rr']){nE[p]={x:mul(nE[p].x,f),n:mul(nE[p].n,f)};}
    if(tooBig(nE)){$('#msg').innerHTML='Those numbers are getting too big — try something else.';return;}
    const info={t:'d',kind:'d',amt:f,op:opFor(f)};
    if(mult){commit(()=>{E=nE;},'pop',null,info);return;}
    busy=true;root.querySelectorAll('.t').forEach(t=>t.classList.add('squash'));
    setTimeout(()=>{busy=false;commit(()=>{E=nE;},'pop',null,info);},380);
  }
  /* ---------- buttons ---------- */
  function build(){E=genL(lv);E0=clone(E);ctx.q=analyse(E0);ctx.perf=null;nUndo=nHint=nRestart=0;snap=[];steps=[];solvedTxt=null;{const nb=$('#nw');if(nb){nb.textContent='New equation ⏭';nb.onclick=build;}}over=false;busy=false;ang=0;vel=0;setP(0);setSg(1);update();}
  $('#un').onclick=()=>{if(busy||over||!snap.length)return;nUndo++;over=false;const sn=snap.pop();E=sn.E;steps=JSON.parse(sn.st);update();};
  $('#rs').onclick=()=>{if(busy||over)return;nRestart++;E=clone(E0);snap=[];steps=[];over=false;update();};
  $('#nw').onclick=build;
  $('#hn').onclick=()=>{if(over)return;nHint++;let A=E.L,B=E.Rr,m;const nm=A===E.L?'left':'right';
    
    let side='left';if(z(A.x)&&!z(B.x)){[A,B]=[B,A];side='right';}
    if(!z(A.x)&&!z(B.x)){const s=Math.abs(fz(A.x))<=Math.abs(fz(B.x))?A.x:B.x;m=`x’s on both pans. Drag x weights off a pan, ${ftxt([Math.abs(s[0]),s[1]])} time${s[0]===1&&s[1]===1?'':'s'} — each one comes off both sides.`;}
    else if(!z(A.n)){const n=A.n;m=n[0]>0?`Drag a 1 off the number tile ${ftxt(n)} time${n[0]===1&&n[1]===1?'':'s'} — each one comes off both sides.`:`Drop the 1 weight onto a pan ${ftxt([-n[0],n[1]])} time(s) — each goes on both sides.`;}
    else if(A.x[0]<0)m='x is negative: set the switch to − (pointer in the middle, ×1) and press Apply.';
    else if(!eq1(A.x)){const[p,q]=A.x;m=q!==1?`The x-weight is a fraction. Swing the pointer right to ×${q} and press Apply${p!==1?`, then swing it left to ÷${p} and Apply`:''}.`:`${p} x-weights on one pan: swing the pointer left to ÷${p} and press Apply.`;}
    else m='Almost there!';
    $('#msg').innerHTML='💡 '+m;};
  window.addEventListener('resize',place);ctx.cleanups.push(()=>window.removeEventListener('resize',place));
  root.__E=()=>E;root.__bal=()=>balanced();
  root.__steps=()=>steps.map(t=>t.op);root.__test={add:(p,kind,v)=>commit(()=>addBoth(kind,F(v)),null,null,{t:'w',kind,amt:F(v)}),mul:f=>scale(true,F(f)),div:f=>{if(over)return;const nE=clone(E);for(const p of['L','Rr'])nE[p]={x:mul(nE[p].x,F(1,f)),n:mul(nE[p].n,F(1,f))};commit(()=>{E=nE;},'pop',null,{t:'d',kind:'d',amt:F(1,f),op:'÷'+f});}};
  function restore(rv){E=rv.E;E0=rv.E0;ctx.q=analyse(E0);steps=rv.steps;solvedTxt=rv.solved;snap=[];over=true;ang=0;update();$('#msg').innerHTML='📖 Your solution — tap <b>New equation</b> to play again';}
  {const u=me(),rv=u&&u.rv&&u.rv['balance_'+lv];if(rv){try{restore(rv);}catch(e){build();}}else build();}
 }});
})();
