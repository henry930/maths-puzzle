(function(){
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const pick=window.pick||(a=>a[Math.floor(Math.random()*a.length)]);
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
// ---- GCSE extension (levels 25+): common factors, perfect squares, factor first, solving ----
const M1={a1:1,r:[1,9]};
LV.push(
 {n:'Common factor · x² + 5x',type:'cf',kr:[1,1],mr:[1,1],nr:[1,9],sgn:'pos'},
 {n:'Common factor · x² − 7x',type:'cf',kr:[1,1],mr:[1,1],nr:[1,9],sgn:'neg'},
 {n:'Common factor · 3x² + 6x',type:'cf',kr:[2,5],mr:[1,1],nr:[1,6],sgn:'pos'},
 {n:'Common factor · 6x² − 9x',type:'cf',kr:[2,4],mr:[2,4],nr:[1,6],sgn:'any'},
 {n:'Common factor · any signs and sizes',type:'cf',kr:[1,6],mr:[1,5],nr:[1,9],sgn:'any'},
 {n:'Perfect squares · (x + p)²',a1:1,sg:'sq',r:[1,9]},
 {n:'Perfect squares · (x − p)²',a1:1,sg:'sqn',r:[1,9]},
 {n:'Perfect squares · (mx ± p)²',mx:4,sg:'sqa',r:[1,7]},
 {n:'Difference of two squares · 9x² − 16',mx:4,sg:'dos',r:[1,5]},
 {n:'Difference of two squares · bigger numbers',mx:6,sg:'dos',r:[1,9]},
 {n:'Difference of two squares · all kinds',pool:[{a1:1,sg:'dos',r:[2,12]},{mx:5,sg:'dos',r:[1,7]}]},
 {n:'Take out a factor first · 2x² + 10x + 12',type:'cf2',k:[2,3],inner:{a1:1,sg:'pp',r:[1,6]}},
 {n:'Take out a factor first · minus in the middle',type:'cf2',k:[2,4],inner:{a1:1,sg:'nn',r:[1,6]}},
 {n:'Take out a factor first · minus at the end',type:'cf2',k:[2,4],inner:{a1:1,sg:'mix',r:[1,7]}},
 {n:'Take out a factor first · any signs',type:'cf2',k:[2,5],inner:{a1:1,sg:'any',r:[1,8]}},
 {n:'Take out a factor first · difference of two squares',type:'cf2',k:[2,5],inner:{a1:1,sg:'dos',r:[1,7]}},
 {n:'Take out a factor first · number in front',type:'cf2',k:[2,3],inner:{mx:3,sg:'any',r:[1,5]}},
 {n:'Solve · x² + 5x + 6 = 0',a1:1,sg:'pp',r:[1,6],solve:1},
 {n:'Solve · minus in the middle',a1:1,sg:'nn',r:[1,8],solve:1},
 {n:'Solve · minus at the end',a1:1,sg:'mix',r:[1,8],solve:1},
 {n:'Solve · difference of two squares',a1:1,sg:'dos',r:[2,12],solve:1},
 {n:'Solve · common factor x² + 5x = 0',type:'cf',kr:[1,3],mr:[1,1],nr:[1,9],sgn:'any',solve:1},
 {n:'Solve · perfect squares',a1:1,sg:'sq',r:[1,9],solve:1,neg:'any'},
 {n:'Solve · any monic quadratic',a1:1,sg:'any',r:[1,12],solve:1},
 {n:'Solve · take out a factor first',type:'cf2',k:[2,4],inner:{a1:1,sg:'any',r:[1,8]},solve:1},
 {n:'Larger numbers · up to 20',a1:1,sg:'any',r:[1,20]},
 {n:'Number in front · larger numbers',mx:6,sg:'any',r:[1,12]},
 {n:'Boss: factorise anything',pool:null},
 {n:'Boss: solve anything',pool:null}
);
LV[LV.length-2].pool=LV.filter(x=>x.pool===undefined&&!x.solve);
LV[LV.length-1].pool=LV.filter(x=>x.solve);

const R_=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const sg=()=>Math.random()<.5?-1:1;
function genStd(sp){
  for(let at=0;at<3000;at++){
    const sqk=sp.sg==='sq'||sp.sg==='sqn'||sp.sg==='sqa';
    const m=sp.a1?1:R_(1,sp.mx),n=sp.a1?1:R_(1,sp.mx);
    if(!sp.a1&&m*n<2&&!sqk)continue;
    let p=R_(sp.r[0],sp.r[1]),q=R_(sp.r[0],sp.r[1]);
    if(sp.sg==='nn'){p=-p;q=-q;}
    else if(sp.sg==='mix'){if(Math.random()<.5)p=-p;else q=-q;}
    else if(sp.sg==='any'){p*=sg();q*=sg();}
    let mm=m,nn=n;
    if(sp.sg==='dos'){if(sp.a1){q=-p;p=Math.abs(p);q=-p;}else{nn=mm;q=-p;p=Math.abs(p);q=-p;if(mm<2)continue;}}
    if(sqk){nn=mm;if(sp.sg==='sqn')p=-p;else if(sp.sg==='sqa'||sp.neg==='any')p*=sg();q=p;if(sp.sg==='sqa'&&mm<2)continue;}
    if(gcd(mm,p)!==1||gcd(nn,q)!==1)continue;
    const a=mm*nn,b=mm*q+nn*p,c=p*q;
    if(sp.sg!=='dos'&&b===0)continue;
    if(gcd(gcd(a,b),c)!==1)continue;
    return{a,b,c,m:mm,p,n:nn,q,kind:'std',solve:!!sp.solve};
  }
  return{a:1,b:5,c:6,m:1,p:2,n:1,q:3,kind:'std',solve:!!sp.solve};
}
function gen(sp){
  if(sp.pool){const s2=pick(sp.pool);return gen(s2);}
  if(sp.type==='cf'){
    for(let at=0;at<2000;at++){
      const k=R_(sp.kr[0],sp.kr[1]),m=R_(sp.mr[0],sp.mr[1]);let nv=R_(sp.nr[0],sp.nr[1]);
      if(sp.sgn==='neg')nv=-nv;else if(sp.sgn==='any')nv*=sg();
      if(gcd(m,nv)!==1)continue;
      return{a:k*m,b:k*nv,c:0,k,m,n:nv,kind:'cf',solve:!!sp.solve};
    }
    return{a:3,b:6,c:0,k:3,m:1,n:2,kind:'cf',solve:!!sp.solve};
  }
  if(sp.type==='cf2'){
    const inner=genStd(sp.inner),k=R_(sp.k[0],sp.k[1]);
    return Object.assign({},inner,{kind:'cf2',k,F:{a:k*inner.a,b:k*inner.b,c:k*inner.c},solve:!!sp.solve});
  }
  return genStd(sp);
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
 art:'<div class="minibal tx">(x+3)(x+4)</div>',
 mount(root,lv,ctx){
  const sp=LV[lv-1];let Q,stage,sl,sel,buf,pair,cfg;
  root.innerHTML=`<div class="qd"><div class="qd-top" id="qt"></div><div class="qd-title" id="qti"></div><div class="qd-row" id="qr"></div><div class="qd-split" id="qs"></div><div class="msg" id="qm">&nbsp;</div><div class="ex-pad" id="qpad"></div><div class="toolrow"><button class="btn alt" id="qh">💡 Hint</button><button class="btn alt" id="qn">New question ⏭</button></div></div>`;
  const msg=h=>{$('#qm').innerHTML=h||'&nbsp;';};
  const mono=()=>Q.m===1&&Q.n===1;
  // stages: 0 = take out the common factor first, 1 = find the pair, 2 = brackets, 3 = solve, 4 = common-factor brackets
  function build(){Q=gen(sp);ctx.q=tagQuad(Q);ctx.q.eq=eqText();stage=Q.kind==='cf'?4:Q.kind==='cf2'?0:1;pair=null;msg('');setStage();}
  const eqText=()=>(Q.kind==='cf2'?poly(Q.F.a,Q.F.b,Q.F.c):poly(Q.a,Q.b,Q.c))+(Q.solve?' = 0':'');
  function setStage(){
    cfg={n:stage===0?1:stage===1?2:stage===3?2:stage===4?3:(mono()?2:4)};
    sl=Array(cfg.n).fill(null);sel=0;buf='';render();
  }
  const sh=()=>buf.replace(/-/g,'−');
  function slot(i,kind){ // kind: 'plain' | 'const' | 'coef'
    const v=sl[i],cur=i===sel;let t='';
    if(cur&&buf!=='')t=sh();
    else if(v!==null)t=kind==='const'?(v<0?'−'+absS(v):'+'+v):(v<0?'−'+absS(v):String(v));
    return `<span class="qd-sl${cur?' cur':''}${v!==null&&!cur?' ok':''}" data-i="${i}">${t}</span>`;
  }
  function render(){
    const base=Q.kind==='cf2'?(stage===0?poly(Q.F.a,Q.F.b,Q.F.c):`${Q.k}( ${poly(Q.a,Q.b,Q.c)} )`):poly(Q.a,Q.b,Q.c);
    $('#qt').innerHTML=base+(Q.solve?' = 0':'');
    const ac=Q.a*Q.c;
    $('#qs').innerHTML='';
    if(stage===0){
      $('#qti').innerHTML='Take out the <b>highest common factor</b> of all the terms first';
      $('#qr').innerHTML=`${slot(0,'plain')}<span class="qd-op">( … )</span>`;
    }else if(stage===4){
      $('#qti').innerHTML='Take out the <b>highest common factor</b>: write it as  <b>number × x × (bracket)</b>';
      $('#qr').innerHTML=`${slot(0,'plain')}<span class="qd-op">x (</span>${slot(1,'coef')}<span class="qd-op">x</span>${slot(2,'const')}<span class="qd-op">)</span>`;
    }else if(stage===3){
      $('#qti').innerHTML='Now <b>solve</b> it: set each bracket equal to 0';
      $('#qr').innerHTML=`<span class="qd-op">x =</span>${slot(0,'plain')}<span class="qd-op">or x =</span>${slot(1,'plain')}`;
    }else if(stage===1){
      $('#qti').innerHTML=`Find two numbers that <b>multiply</b> to <b>${ac<0?'−'+absS(ac):ac}</b>${Q.a>1?` <small>(${Q.a} × ${Q.c<0?'('+Q.c+')':Q.c})</small>`:''} and <b>add</b> to <b>${Q.b<0?'−'+absS(Q.b):Q.b}</b>`;
      $('#qr').innerHTML=`${slot(0,'plain')}<span class="qd-op">and</span>${slot(1,'plain')}`;
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
  const reset=()=>{sl=sl.map(()=>null);sel=0;buf='';render();};
  const finalText=()=>{
    const m1=Q.m,p1=Q.p,m2=Q.n,p2=Q.q,sqr=m1===m2&&p1===p2;
    const body=sqr?`${br(m1,p1)}²`:`${br(m1,p1)}${br(m2,p2)}`;
    return `${eqText().replace(' = 0','')} = ${Q.kind==='cf2'?Q.k:''}${body}`;
  };
  function win(t){ctx.timeout(()=>ctx.win('Factorised!',t,build,'New question'),700);}
  function evaluate(){
    if(stage===0){
      const k=sl[0],fs=[Q.F.a,Q.F.b,Q.F.c];
      if(k===Q.k){stage=1;msg(`✅ Yes! ${Q.F.a}, ${Q.F.b} and ${Q.F.c} all divide by ${k}. Now factorise the quadratic inside.`);setStage();return;}
      ctx.log('wrong',{stage:'factor',typed:k,expect:Q.k,poly:eqText()});
      msg(fs.every(v=>v%k===0&&k>0)?`❌ ${k} divides every term, but it is not the <b>highest</b> common factor — look for a bigger one.`:`❌ ${k} does not divide every term (${fs.join(', ')}). Try again.`);reset();return;
    }
    if(stage===4){
      const [k,m,nn]=sl,e1=k*m,e2=k*nn;
      if(e1===Q.a&&e2===Q.b&&k===Q.k&&m===Q.m&&nn===Q.n){
        if(Q.solve){stage=3;msg(`✅ ${poly(Q.a,Q.b,0)} = ${Q.k===1?'':Q.k}x(${Q.m===1?'':Q.m}x ${sgnS(Q.n)} ${absS(Q.n)}).`);setStage();return;}
        msg('✅ Correct!');win(`${poly(Q.a,Q.b,0)} = ${Q.k===1?'':Q.k}x(${Q.m===1?'':Q.m}x ${sgnS(Q.n)} ${absS(Q.n)})`);return;}
      ctx.log('wrong',{stage:'cf',typed:[k,m,nn],poly:poly(Q.a,Q.b,0)});
      if(e1!==Q.a||e2!==Q.b)msg(`❌ ${k}x(${m===1?'':m}x ${sgnS(nn)} ${absS(nn)}) multiplies out to <b>${poly(e1,e2,0)}</b>, not ${poly(Q.a,Q.b,0)}.`);
      else msg(`❌ That multiplies out correctly, but you can take out <b>more</b>: the bracket must not have a common factor left. Use the <b>highest</b> common factor.`);
      reset();return;
    }
    if(stage===3){
      const r=[sl[0],sl[1]].sort((a,b)=>a-b),want=(Q.kind==='cf'?[0,-Q.n/Q.m]:[-Q.p,-Q.q]).sort((a,b)=>a-b);
      if(r[0]===want[0]&&r[1]===want[1]){msg('✅ Correct!');win(`${eqText()} → ${finalRoots()}`);return;}
      ctx.log('wrong',{stage:'solve',typed:sl.slice(),expect:want,poly:eqText()});
      msg('❌ Not quite. Set each bracket equal to 0 and solve: (x + 3) = 0 gives x = −3. Flip the sign of the number in the bracket!');reset();return;
    }
    if(stage===1){
      const [u,v]=sl,acv=Q.a*Q.c,bad=[];
      if(u*v!==acv)bad.push(`${u} × ${v} = ${u*v}, but they must multiply to ${acv}.`);
      if(u+v!==Q.b)bad.push(`${u} + ${v} = ${u+v}, but they must add to ${Q.b}.`);
      if(!bad.length){pair=[u,v];stage=2;msg('✅ Yes! '+u+' × '+v+' = '+acv+' and '+u+' + '+v+' = '+Q.b);setStage();return;}
      ctx.log('wrong',{stage:'pair',typed:[u,v],ac:acv,b:Q.b,poly:poly(Q.a,Q.b,Q.c),prod_ok:u*v===acv,sum_ok:u+v===Q.b});
      msg('❌ '+bad.join(' '));reset();return;
    }
    const m1=cfg.n===2?1:sl[0],p1=cfg.n===2?sl[0]:sl[1],m2=cfg.n===2?1:sl[2],p2=cfg.n===2?sl[1]:sl[3];
    const e=expand(m1,p1,m2,p2);
    if(m1>0&&m2>0&&e.a===Q.a&&e.b===Q.b&&e.c===Q.c){
      if(Q.solve){stage=3;msg(`✅ Factorised! ${poly(Q.a,Q.b,Q.c)} = ${br(m1,p1)}${br(m2,p2)}`);setStage();return;}
      msg('✅ Correct!');win(finalText());return;}
    ctx.log('wrong',{stage:'brackets',typed:[m1,p1,m2,p2],expands:e,poly:poly(Q.a,Q.b,Q.c)});
    msg(`❌ Your brackets multiply out to <b>${poly(e.a,e.b,e.c)}</b>, not ${poly(Q.a,Q.b,Q.c)}. ${e.c!==Q.c?'Check the last numbers (signs too).':e.a!==Q.a?'Check the numbers in front of x.':'Check the middle term — try swapping which bracket gets which number.'}`);
    reset();
  }
  const finalRoots=()=>{const w=(Q.kind==='cf'?[0,-Q.n/Q.m]:[-Q.p,-Q.q]).map(v=>String(v).replace('-','−'));return w[0]===w[1]?`x = ${w[0]}`:`x = ${w[0]} or x = ${w[1]}`;};
  $('#qh').onclick=()=>{const ac=Q.a*Q.c;
    msg(stage===0?'💡 Find the biggest number that divides every term (the number in front of x², the number in front of x and the last number).'
      :stage===4?'💡 Take out the biggest number AND a letter x from both terms. If there is no number to take out, the number is 1.'
      :stage===3?'💡 If (x + 3)(x − 5) = 0 then one bracket must be 0: x + 3 = 0 gives x = −3 and x − 5 = 0 gives x = 5. The sign flips!'
      :stage===1?`💡 List the factor pairs of ${absS(ac)}. If the multiply number is positive, both numbers have the same sign (as the middle number); if it is negative, one is + and one is −. Then see which pair adds to ${Q.b}.`
      :(mono()?'💡 Put your two numbers in the brackets: (x + first)(x + second). Keep their signs.':'💡 Split the middle term with your two numbers, then take a common factor out of each half — the same bracket appears twice.'));};
  $('#qn').onclick=build;
  ctx.keys=e=>{const k=e.key;if(/^[0-9]$/.test(k))press(k);else if(k==='-')press('neg');else if(k==='Backspace')press('del');else if(k==='Enter')press('ok');};
  window.__qq=()=>({get Q(){return Q},get stage(){return stage},press,commit,select:i=>{sel=i;buf='';render();}});
  build();
 }});
})();
