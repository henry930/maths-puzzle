(function(){
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const LV=[
 {n:'x² + 5x + 6 · all positive',a1:1,sg:'pp',r:[1,5]},
 {n:'All positive · up to 6',a1:1,sg:'pp',r:[1,6]},
 {n:'All positive · up to 9',a1:1,sg:'pp',r:[1,9]},
 {n:'All positive · up to 12',a1:1,sg:'pp',r:[1,12]},
 {n:'Minus in the middle: x² − 5x + 6',a1:1,sg:'nn',r:[1,5]},
 {n:'Minus in the middle · up to 8',a1:1,sg:'nn',r:[1,8]},
 {n:'Minus in the middle · up to 10',a1:1,sg:'nn',r:[1,10]},
 {n:'Minus in the middle · up to 12',a1:1,sg:'nn',r:[1,12]},
 {n:'Minus at the end: x² + x − 6',a1:1,sg:'mix',r:[1,6]},
 {n:'Minus at the end · up to 8',a1:1,sg:'mix',r:[1,8]},
 {n:'Minus at the end · up to 10',a1:1,sg:'mix',r:[1,10]},
 {n:'Minus at the end · up to 12',a1:1,sg:'mix',r:[1,12]},
 {n:'Difference of two squares: x² − 9',a1:1,sg:'dos',r:[2,9]},
 {n:'Difference of two squares · up to 12',a1:1,sg:'dos',r:[2,12]},
 {n:'Mixed signs · all kinds',a1:1,sg:'any',r:[1,12]},
 {n:'Mixed · harder numbers',a1:1,sg:'any',r:[1,15]},
 {n:'Number in front: 2x² + 7x + 6',mx:2,sg:'pp',r:[1,6]},
 {n:'Number in front · up to 3x²',mx:3,sg:'pp',r:[1,8]},
 {n:'Number in front · minus in the middle',mx:3,sg:'nn',r:[1,8]},
 {n:'Number in front · mixed signs',mx:3,sg:'mix',r:[1,8]},
 {n:'Up to 4x² · any signs',mx:4,sg:'any',r:[1,9]},
 {n:'Number in front: 4x² − 9',mx:4,sg:'dos',r:[1,6]},
 {n:'Boss: anything goes!',mx:5,sg:'any',r:[1,10]},
 {n:'Boss 2: the hardest',mx:6,sg:'any',r:[1,12]}
];
const R_=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const sg=()=>Math.random()<.5?-1:1;
function gen(sp){
  for(let at=0;at<2000;at++){
    const m=sp.a1?1:R_(1,sp.mx),n=sp.a1?1:R_(1,sp.mx);
    if(!sp.a1&&m*n<2)continue;
    let p=R_(sp.r[0],sp.r[1]),q=R_(sp.r[0],sp.r[1]);
    if(sp.sg==='nn'){p=-p;q=-q;}
    else if(sp.sg==='mix'){if(Math.random()<.5)p=-p;else q=-q;}
    else if(sp.sg==='any'){p*=sg();q*=sg();}
    else if(sp.sg==='dos'){if(!sp.a1){/* (mx+p)(mx-p) */}}
    let mm=m,nn=n;
    if(sp.sg==='dos'){if(sp.a1){q=-p;p=Math.abs(p);q=-p;}else{nn=mm;q=-p;p=Math.abs(p);q=-p;if(mm<2)continue;}}
    if(gcd(mm,p)!==1||gcd(nn,q)!==1)continue;
    const a=mm*nn,b=mm*q+nn*p,c=p*q;
    if(sp.sg!=='dos'&&b===0)continue;
    if(sp.sg!=='dos'&&sp.sg!=='any'&&b===0)continue;
    if(gcd(gcd(a,b),c)!==1)continue;
    return{a,b,c,m:mm,p,n:nn,q};
  }
  return{a:1,b:5,c:6,m:1,p:2,n:1,q:3};
}
const absS=n=>Math.abs(n),sgnS=n=>n<0?'−':'+';
const coef=(k,v)=>k===1?v:k+v;
function poly(a,b,c){let s=(a===1?'':a)+'x²';if(b)s+=` ${sgnS(b)} ${absS(b)===1?'':absS(b)}x`;if(c)s+=` ${sgnS(c)} ${absS(c)}`;return s;}
function split(a,u,v,c){return `${a===1?'':a}x² ${sgnS(u)} ${absS(u)===1?'':absS(u)}x ${sgnS(v)} ${absS(v)===1?'':absS(v)}x ${sgnS(c)} ${absS(c)}`;}
function br(m,p){return `(${m===1?'':m}x ${sgnS(p)} ${absS(p)})`;}
function expand(m1,p1,m2,p2){return{a:m1*m2,b:m1*p2+m2*p1,c:p1*p2};}
window.__qd={LV,gen,poly,expand};
REG.push({id:'quad',name:'Quadratic Factoriser',emoji:'🔷',color:'#d6336c',cat:'Algebra',
 desc:'Factorise quadratics like x² + 7x + 12 and 2x² + 7x + 6. Find the two numbers that multiply to the last number and add to the middle one, then write the brackets.',skills:['factorising quadratics','products and sums','negative numbers','brackets'],
 levels:LV.map(l=>l.n),
 how:'Step 1: find two numbers that MULTIPLY to the number shown and ADD to the middle number (for 2x² + 7x + 6 the multiply number is 2 × 6 = 12). Step 2: write the brackets. Watch the signs!',
 art:'<div class="minibal">(x+3)(x+4)</div>',
 mount(root,lv,ctx){
  const sp=LV[lv-1];let Q,stage,sl,sel,buf,pair,cfg;
  root.innerHTML=`<div class="qd"><div class="qd-top" id="qt"></div><div class="qd-title" id="qti"></div><div class="qd-row" id="qr"></div><div class="qd-split" id="qs"></div><div class="msg" id="qm">&nbsp;</div><div class="ex-pad" id="qpad"></div><div class="toolrow"><button class="btn alt" id="qh">💡 Hint</button><button class="btn alt" id="qn">New question ⏭</button></div></div>`;
  const msg=h=>{$('#qm').innerHTML=h||'&nbsp;';};
  function build(){Q=gen(sp);ctx.q=tagQuad(Q);ctx.q.eq=poly(Q.a,Q.b,Q.c);stage=1;pair=null;msg('');setStage();}
  function setStage(){
    if(stage===1){cfg={n:2};}else cfg={n:Q.m===1&&Q.n===1&&sp.a1?2:4};
    sl=Array(cfg.n).fill(null);sel=0;buf='';render();
  }
  const sh=()=>buf.replace(/-/g,'−');
  const val=i=>sl[i];
  function slot(i,kind){ // kind: 'plain' | 'const' | 'coef'
    const v=sl[i],cur=i===sel;let t='';
    if(cur&&buf!=='')t=sh();
    else if(v!==null)t=kind==='const'?(v<0?'−'+absS(v):'+'+v):(v<0?'−'+absS(v):String(v));
    return `<span class="qd-sl${cur?' cur':''}${v!==null&&!cur?' ok':''}" data-i="${i}">${t}</span>`;
  }
  function render(){
    $('#qt').innerHTML=poly(Q.a,Q.b,Q.c);
    const ac=Q.a*Q.c;
    if(stage===1){
      $('#qti').innerHTML=`Find two numbers that <b>multiply</b> to <b>${ac<0?'−'+absS(ac):ac}</b>${Q.a>1?` <small>(${Q.a} × ${Q.c<0?'('+Q.c+')':Q.c})</small>`:''} and <b>add</b> to <b>${Q.b<0?'−'+absS(Q.b):Q.b}</b>`;
      $('#qr').innerHTML=`${slot(0,'plain')}<span class="qd-op">and</span>${slot(1,'plain')}`;
      $('#qs').innerHTML='';
    }else{
      $('#qti').innerHTML='Now write the <b>brackets</b>';
      if(cfg.n===2)$('#qr').innerHTML=`<span class="qd-op">(x</span>${slot(0,'const')}<span class="qd-op">)(x</span>${slot(1,'const')}<span class="qd-op">)</span>`;
      else $('#qr').innerHTML=`<span class="qd-op">(</span>${slot(0,'coef')}<span class="qd-op">x</span>${slot(1,'const')}<span class="qd-op">)(</span>${slot(2,'coef')}<span class="qd-op">x</span>${slot(3,'const')}<span class="qd-op">)</span>`;
      $('#qs').innerHTML=Q.a>1&&pair?`Split the middle: <b>${split(Q.a,pair[0],pair[1],Q.c)}</b>`:'';
    }
    $('#qr').querySelectorAll('.qd-sl').forEach(e=>e.onclick=()=>{sel=+e.dataset.i;buf=sl[sel]!==null?String(sl[sel]):'';render();});
  }
  (function pad(){const p=$('#qpad');
    ['7','8','9','del','4','5','6','neg','1','2','3','ok','0'].forEach(k=>{const b=el('button','key'+(k==='del'?' del':'')+(k==='ok'?' ok':''),k==='del'?'⌫':k==='neg'?'−':k==='ok'?'Next ✓':k);b.onclick=()=>press(k);p.appendChild(b);});})();
  function press(k){
    if(document.querySelector('.overlay'))return;
    if(k==='del')buf=buf.slice(0,-1);
    else if(k==='neg')buf=buf.startsWith('-')?buf.slice(1):'-'+buf;
    else if(k==='ok')return commit();
    else if(/^\d$/.test(k)&&buf.replace('-','').length<2)buf+=k;
    render();
  }
  function commit(){
    if(buf===''||buf==='-'){msg('Type a number first.');return;}
    sl[sel]=parseInt(buf,10);buf='';
    const nx=sl.findIndex(v=>v===null);
    if(nx>=0){sel=nx;render();msg('');return;}
    evaluate();
  }
  function evaluate(){
    if(stage===1){
      const [u,v]=sl,ac=Q.a*Q.c,bad=[];
      if(u*v!==ac)bad.push(`${u} × ${v} = ${u*v}, but they must multiply to ${ac}.`);
      if(u+v!==Q.b)bad.push(`${u} + ${v} = ${u+v}, but they must add to ${Q.b}.`);
      if(!bad.length){pair=[u,v];stage=2;msg('✅ Yes! '+u+' × '+v+' = '+ac+' and '+u+' + '+v+' = '+Q.b);setStage();return;}
      ctx.log('wrong',{stage:'pair',typed:[u,v],ac,b:Q.b,poly:poly(Q.a,Q.b,Q.c),prod_ok:u*v===ac,sum_ok:u+v===Q.b});
      msg('❌ '+bad.join(' '));sl=sl.map(()=>null);sel=0;buf='';render();return;
    }
    const m1=cfg.n===2?1:sl[0],p1=cfg.n===2?sl[0]:sl[1],m2=cfg.n===2?1:sl[2],p2=cfg.n===2?sl[1]:sl[3];
    const e=expand(m1,p1,m2,p2);
    if(m1>0&&m2>0&&e.a===Q.a&&e.b===Q.b&&e.c===Q.c){
      msg('✅ Correct!');const res=`${br(m1,p1)}${br(m2,p2)}`;
      ctx.timeout(()=>ctx.win('Factorised!',`${poly(Q.a,Q.b,Q.c)} = ${res}`,build,'New question'),700);return;}
    ctx.log('wrong',{stage:'brackets',typed:[m1,p1,m2,p2],expands:e,poly:poly(Q.a,Q.b,Q.c)});
    msg(`❌ Your brackets multiply out to <b>${poly(e.a,e.b,e.c)}</b>, not ${poly(Q.a,Q.b,Q.c)}. ${e.c!==Q.c?'Check the last numbers (signs too).':e.a!==Q.a?'Check the numbers in front of x.':'Check the middle term — try swapping which bracket gets which number.'}`);
    sl=sl.map(()=>null);sel=0;buf='';render();
  }
  $('#qh').onclick=()=>{const ac=Q.a*Q.c;
    msg(stage===1?`💡 List the factor pairs of ${absS(ac)}. If the multiply number is positive, both numbers have the same sign (as the middle number); if it is negative, one is + and one is −. Then see which pair adds to ${Q.b}.`
      :(Q.a===1?'💡 Put your two numbers in the brackets: (x + first)(x + second). Keep their signs.':'💡 Split the middle term with your two numbers, then take a common factor out of each half — the same bracket appears twice.'));};
  $('#qn').onclick=build;
  ctx.keys=e=>{const k=e.key;if(/^[0-9]$/.test(k))press(k);else if(k==='-')press('neg');else if(k==='Backspace')press('del');else if(k==='Enter')press('ok');};
  window.__qq=()=>({get Q(){return Q},get stage(){return stage},press,commit,select:i=>{sel=i;buf='';render();}});
  build();
 }});
})();
