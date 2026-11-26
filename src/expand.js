(function(){
const SETS=[['x','y','z'],['a','b','c'],['m','n','k'],['p','q','r'],['u','v','w']];
const sg=()=>Math.random()<.5?1:-1;
const r=(a,b)=>R(a,b);
// term = {c: coefficient, p:{letter:exponent}}; specs use role letters p,q,r (mapped to real letters later)
const T=(c,v='')=>{const p={};for(const ch of v)p[ch]=(p[ch]||0)+1;return{c,p};};
const S1=[ // single-letter levels
 {n:'a(x + b)',g:()=>({m:T(r(2,5)),t:[T(1,'p'),T(r(1,9))]})},
 {n:'a(x − b)',g:()=>({m:T(r(2,5)),t:[T(1,'p'),T(-r(1,9))]})},
 {n:'a(bx + c)',g:()=>({m:T(r(2,5)),t:[T(r(2,4),'p'),T(r(1,9))]})},
 {n:'a(bx − c)',g:()=>({m:T(r(2,5)),t:[T(r(2,4),'p'),T(-r(1,9))]})},
 {n:'Bigger numbers',g:()=>({m:T(r(3,9)),t:[T(r(2,9),'p'),T(sg()*r(2,12))]})},
 {n:'Negative outside: −a(x + b)',g:()=>({m:T(-r(2,5)),t:[T(1,'p'),T(r(1,9))]})},
 {n:'Negative outside: −a(x − b)',g:()=>({m:T(-r(2,5)),t:[T(1,'p'),T(-r(1,9))]})},
 {n:'Negative outside · mixed',g:()=>({m:T(-r(2,7)),t:[T(r(2,5),'p'),T(sg()*r(1,9))]})},
 {n:'Variable outside: x(x + b)',g:()=>({m:T(1,'p'),t:[T(1,'p'),T(r(1,9))]})},
 {n:'Variable outside: x(x − b)',g:()=>({m:T(1,'p'),t:[T(1,'p'),T(-r(1,9))]})},
 {n:'ax(x + b)',g:()=>({m:T(r(2,5),'p'),t:[T(1,'p'),T(sg()*r(1,9))]})},
 {n:'−x(bx + c)',g:()=>({m:T(-1,'p'),t:[T(r(2,5),'p'),T(sg()*r(1,9))]})},
 {n:'Three terms: a(x² + bx + c)',g:()=>({m:T(r(2,5)),t:[T(1,'pp'),T(r(1,6),'p'),T(r(1,9))]})},
 {n:'Three terms · mixed signs',g:()=>({m:T(r(2,6)),t:[T(1,'pp'),T(sg()*r(1,6),'p'),T(sg()*r(1,9))]})},
 {n:'Three terms · negative outside',g:()=>({m:T(-r(2,6)),t:[T(1,'pp'),T(sg()*r(1,6),'p'),T(sg()*r(1,9))]})},
 {n:'a(bx² + cx + d)',g:()=>({m:T(r(2,5)),t:[T(r(2,4),'pp'),T(sg()*r(1,6),'p'),T(sg()*r(1,9))]})},
 {n:'−a(bx² ± cx ± d)',g:()=>({m:T(-r(2,5)),t:[T(r(2,4),'pp'),T(sg()*r(1,6),'p'),T(sg()*r(1,9))]})},
 {n:'ax(bx + c)',g:()=>({m:T(r(2,4),'p'),t:[T(r(2,4),'p'),T(sg()*r(1,9))]})},
 {n:'−ax(bx − c)',g:()=>({m:T(-r(2,4),'p'),t:[T(r(2,4),'p'),T(sg()*r(1,9))]})},
 {n:'Boss: anything goes!',g:()=>{const k=r(0,2);return k===0?{m:T(sg()*r(2,7)),t:[T(r(1,4),'pp'),T(sg()*r(1,7),'p'),T(sg()*r(1,9))]}:k===1?{m:T(sg()*r(1,4),'p'),t:[T(r(2,5),'p'),T(sg()*r(1,9))]}:{m:T(sg()*r(2,9)),t:[T(sg()*r(1,5),'p'),T(sg()*r(1,12))]};}}
];
const S2=[ // multi-letter levels: roles p,q,r
 {n:'Two letters: a(x + y)',g:()=>({m:T(r(2,5)),t:[T(1,'p'),T(1,'q')]})},
 {n:'Two letters: a(x − y)',g:()=>({m:T(r(2,6)),t:[T(1,'p'),T(-1,'q')]})},
 {n:'Two letters: a(bx + cy)',g:()=>({m:T(r(2,5)),t:[T(r(2,5),'p'),T(r(2,5),'q')]})},
 {n:'Two letters · mixed signs',g:()=>({m:T(sg()*r(2,6)),t:[T(r(2,6),'p'),T(sg()*r(2,6),'q')]})},
 {n:'Letter outside: x(x + y)',g:()=>({m:T(1,'p'),t:[T(1,'p'),T(1,'q')]})},
 {n:'Letter outside: x(y ± b)',g:()=>({m:T(1,'p'),t:[T(1,'q'),T(sg()*r(1,9))]})},
 {n:'Letter outside: y(x − y)',g:()=>({m:T(1,'q'),t:[T(1,'p'),T(-1,'q')]})},
 {n:'Negative letter outside',g:()=>({m:T(-1,pick(['p','q'])),t:[T(r(1,4),pick(['p','q'])),T(sg()*r(1,9))]})},
 {n:'ax(y + b)',g:()=>({m:T(r(2,5),'p'),t:[T(r(1,4),'q'),T(sg()*r(1,9))]})},
 {n:'xy outside: xy(x + y)',g:()=>({m:T(r(1,3),'pq'),t:[T(1,'p'),T(sg(),'q')]})},
 {n:'Three terms: a(x + y + b)',g:()=>({m:T(r(2,5)),t:[T(1,'p'),T(1,'q'),T(r(1,9))]})},
 {n:'Three terms: a(bx ± cy ± d)',g:()=>({m:T(r(2,6)),t:[T(r(1,5),'p'),T(sg()*r(1,5),'q'),T(sg()*r(1,9))]})},
 {n:'Three terms · negative outside',g:()=>({m:T(-r(2,6)),t:[T(r(1,5),'p'),T(sg()*r(1,5),'q'),T(sg()*r(1,9))]})},
 {n:'x(x + y + b)',g:()=>({m:T(1,'p'),t:[T(1,'p'),T(sg(),'q'),T(sg()*r(1,9))]})},
 {n:'y(bx + cy + d)',g:()=>({m:T(sg(),'q'),t:[T(r(1,4),'p'),T(sg()*r(1,4),'q'),T(sg()*r(1,9))]})},
 {n:'−x(bx − cy + d)',g:()=>({m:T(-1,'p'),t:[T(r(1,4),'p'),T(sg()*r(1,4),'q'),T(sg()*r(1,9))]})},
 {n:'ax(bx + cy + d)',g:()=>({m:T(r(2,4),'p'),t:[T(r(1,4),'p'),T(sg()*r(1,4),'q'),T(sg()*r(1,9))]})},
 {n:'Three letters: a(x + y + z)',g:()=>({m:T(r(2,5)),t:[T(1,'p'),T(1,'q'),T(1,'r')]}),L:3},
 {n:'Four terms: a(bx ± cy ± dz ± e)',g:()=>({m:T(sg()*r(2,6)),t:[T(r(1,4),'p'),T(sg()*r(1,4),'q'),T(sg()*r(1,4),'r'),T(sg()*r(1,9))]}),L:3},
 {n:'Boss: four terms, anything goes!',g:()=>{const k=r(0,2);const L=[T(r(1,4),'p'),T(sg()*r(1,4),'q'),T(sg()*r(1,4),'r'),T(sg()*r(1,9))];
   return k===0?{m:T(sg()*r(2,5)),t:L}:k===1?{m:T(sg()*r(1,3),pick(['p','q','r'])),t:L}:{m:T(sg()*r(1,3),'pq'),t:[T(r(1,3),'p'),T(sg()*r(1,3),'q'),T(sg()*r(1,3),'r'),T(sg()*r(1,9))]};},L:3}
];
const SPECS=S1.concat(S2);
const mul=(a,b)=>{const p={};for(const k in a.p)p[k]=(p[k]||0)+a.p[k];for(const k in b.p)p[k]=(p[k]||0)+b.p[k];return{c:a.c*b.c,p};};
const rename=(t,mp)=>{const p={};for(const k in t.p)p[mp[k]]=(p[mp[k]]||0)+t.p[k];return{c:t.c,p};};
const SUP={1:'',2:'²',3:'³'};
function varStr(p){return Object.keys(p).sort().map(k=>k+(p[k]===1?'':(SUP[p[k]]||'^'+p[k]))).join('');}
function fmt(t,first,spaced){
  const neg=t.c<0,ac=Math.abs(t.c),vs=varStr(t.p);
  const body=vs?(ac===1?'':String(ac))+vs:String(ac);
  if(first||!spaced)return(neg?'−':(first?'':'+'))+body;
  return(neg?' − ':' + ')+body;
}
function parse(s,L){
  s=s.replace(/[−–]/g,'-').replace(/\s/g,'').replace(/^\+/,'').replace(/²/g,'^2');
  const m=s.match(new RegExp('^(-?)(\\d*)((?:['+L.join('')+'](?:\\^2)?)*)$'));
  if(!m||(m[2]===''&&!m[3]))return null;
  const p={};let rest=m[3];const re=new RegExp('(['+L.join('')+'])(\\^2)?','g');let x;
  while((x=re.exec(rest)))p[x[1]]=(p[x[1]]||0)+(x[2]?2:1);
  return{c:(m[2]===''?1:+m[2])*(m[1]?-1:1),p};
}
const same=(a,b)=>{if(!a||a.c!==b.c)return false;const ka=Object.keys(a.p),kb=Object.keys(b.p);return ka.length===kb.length&&ka.every(k=>a.p[k]===b.p[k]);};
window.__ex={SPECS,fmt,parse,mul};
REG.push({id:'expand',name:'Arrow Expander',emoji:'🏹',color:'#e8590c',cat:'Algebra',
 desc:'Expand brackets like 2(x + 5) step by step. Follow each arrow: multiply the outside term by every term inside, and type each answer.',skills:['expanding brackets','multiplying negatives','algebra terms','powers of x'],
 levels:SPECS.map(s=>s.n),
 how:'The number (or term) outside the bracket must multiply EVERY term inside. Tap an arrow’s box, type the answer using the keypad, then press ✓. Watch the signs: − × − = +, and x × x = x²!',
 art:'<div class="minibal">🏹</div>',
 mount(root,lv,ctx){
  const spec=SPECS[lv-1],COL=['#e8590c','#1c7ed6','#2f9e44','#ae3ec9'];
  let Q,L,buf,act,done;
  root.innerHTML=`<div class="ex"><div class="ex-stage" id="exs"><svg id="exsv"></svg><div class="ex-expr" id="exe"></div></div>
   <div class="ex-cap" id="excap"></div><div class="ex-res" id="exres"></div>
   <div class="ex-pad" id="expad"></div><div class="toolrow"><button class="btn alt" id="exh">💡 Hint</button><button class="btn alt" id="exn">New question ⏭</button></div><div class="msg" id="exmsg">&nbsp;</div></div>`;
  const stage=$('#exs'),svg=$('#exsv'),chips=[],pad=$('#expad');
  function buildPad(){
    pad.innerHTML='';
    const ks=['7','8','9','del','4','5','6','neg','1','2','3','sq','0',...L];
    ks.forEach(k=>{const b=el('button','key'+(k==='del'?' del':'')+(L.includes(k)?' var':''),k==='del'?'⌫':k==='neg'?'−':k==='sq'?'²':k);b.dataset.k=k;b.onclick=()=>press(k);pad.appendChild(b);});
    const ok=el('button','key ok','Check ✓');ok.dataset.k='ok';ok.style.gridColumn='1 / -1';ok.onclick=()=>press('ok');pad.appendChild(ok);
  }
  function build(){
    const q=spec.g();
    const nl=spec.L||(lv<=20?1:2);
    const set=lv<=4?['x','y','z']:pick(SETS);
    L=set.slice(0,Math.max(nl,lv>20?nl:1));if(lv>20&&nl===2)L=set.slice(0,2);
    const mp={p:L[0],q:L[1]||L[0],r:L[2]||L[0]};
    Q={m:rename(q.m,mp),t:q.t.map(t=>rename(t,mp))};
    Q.prod=Q.t.map(t=>mul(Q.m,t));buf='';act=0;done=Q.t.map(()=>false);
    $('#exe').innerHTML=`<span class="ex-m" id="exm">${fmt(Q.m,true)}</span><span class="ex-p">(</span>`+Q.t.map((t,i)=>`<span class="ex-t">${i?`<i class="sg">${t.c<0?' − ':' + '}</i>`:(t.c<0?'<i class="sg">−</i>':'')}<b id="ext${i}">${fmt({c:Math.abs(t.c),p:t.p},true)}</b></span>`).join('')+`<span class="ex-p">)</span>`;
    $('#exres').innerHTML='';$('#exmsg').innerHTML='&nbsp;';buildPad();
    stage.querySelectorAll('.ex-chip').forEach(c=>c.remove());chips.length=0;
    Q.t.forEach((t,i)=>{const c=el('button','ex-chip');c.style.setProperty('--ac',COL[i]);c.textContent='?';c.onclick=()=>{if(!done[i]){act=i;buf='';draw();}};stage.appendChild(c);chips.push(c);});
    ctx.timeout(()=>{place();draw();},30);
  }
  function place(){
    const ee=$('#exe');let fs=40;ee.style.fontSize=fs+'px';while(ee.scrollWidth>stage.clientWidth-20&&fs>18){fs-=2;ee.style.fontSize=fs+'px';}
    const n=Q.t.length;stage.style.paddingTop=(52+(n-1)*52+64)+'px';
    const sr=stage.getBoundingClientRect(),er=$('#exe').getBoundingClientRect();
    svg.setAttribute('width',sr.width);svg.setAttribute('height',sr.height);
    const y0=er.top-sr.top-2,m=$('#exm').getBoundingClientRect(),x0=m.left+m.width/2-sr.left;
    let h='<defs>'+COL.map((c,i)=>`<marker id="ah${i}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`).join('')+'</defs>';
    Q.t.forEach((t,i)=>{const tr=$('#ext'+i).getBoundingClientRect(),x1=tr.left+tr.width/2-sr.left,hh=52+i*52;
      h+=`<path d="M${x0} ${y0} C${x0} ${y0-hh} ${x1} ${y0-hh} ${x1} ${y0-5}" fill="none" stroke="${COL[i]}" stroke-width="3.5" stroke-linecap="round" marker-end="url(#ah${i})" opacity="${done[i]?.45:1}"/>`;
      const c=chips[i];c.style.left=(x0+x1)/2+'px';c.style.top=(y0-hh*.75)+'px';});
    svg.innerHTML=h;
  }
  const shown=()=>buf.replace(/\^2/g,'²').replace(/-/g,'−');
  const tm=(t)=>t.c<0?'('+fmt(t,true)+')':fmt(t,true);
  function draw(){
    chips.forEach((c,i)=>{c.className='ex-chip'+(done[i]?' ok':'')+(i===act&&!done[i]?' on':'');
      c.textContent=done[i]?fmt(Q.prod[i],true):(i===act?(shown()||'…'):'?');});
    if(done.every(Boolean)){$('#excap').innerHTML='';return;}
    $('#excap').innerHTML=`Arrow ${act+1}: <b style="color:${COL[act]}">${tm(Q.m)}</b> × <b>${tm(Q.t[act])}</b> = ?`;
  }
  function press(k){
    if(done.every(Boolean)||document.querySelector('.overlay')||Date.now()-lastClose<200)return;
    const hasL=/[a-z]/.test(buf);
    if(k==='del')buf=buf.endsWith('^2')?buf.slice(0,-2):buf.slice(0,-1);
    else if(k==='neg')buf=buf.startsWith('-')?buf.slice(1):'-'+buf;
    else if(L.includes(k)){if(!buf.includes(k))buf+=k;}
    else if(k==='sq'){if(/[a-z]$/.test(buf))buf+='^2';}
    else if(k==='ok')return check();
    else if(!hasL&&buf.replace('-','').length<4)buf+=k;
    draw();
  }
  const lettersOf=t=>varStr(t.p)||'no letters (just a number)';
  let lastClose=0;
  function explain(a,p,t){
    const m=Q.m,numOk=Math.abs(a.c)===Math.abs(p.c),sgnOk=(a.c<0)===(p.c<0),letOk=same({c:1,p:a.p},{c:1,p:p.p});
    const mA=Math.abs(m.c),tA=Math.abs(t.c);
    const row=(ok,title,good,bad)=>ok?'':`<div class="ex-ck ${ok?'g':'b'}"><span>❌</span><div><b>${title}</b><br>${bad}</div></div>`;
    const sameSign=(m.c<0)===(t.c<0);
    let h=`<h2>❌ Not quite</h2><div class="ex-q">${tm(m)} × ${tm(t)}</div><div class="ex-you">You typed: <b>${shown()?buf.replace(/\^2/g,'²').replace(/-/g,'−'):'?'}</b></div>`;
    h+=row(numOk,'The number part','The numbers are right.',`Multiply the numbers in front: <b>${mA} × ${tA}</b>. (A letter on its own, like x, has an invisible 1 in front.) Check your times table.`);
    h+=row(sgnOk,'The sign',`The sign is right.`,`The two signs are <b>${m.c<0?'−':'+'}</b> and <b>${t.c<0?'−':'+'}</b>. ${sameSign?'Same signs give a <b>positive</b> answer.':'Different signs give a <b>negative</b> answer.'}`);
    h+=row(letOk,'The letters','The letters are right.',`Outside the bracket: <b>${lettersOf(m)}</b>. Inside: <b>${lettersOf(t)}</b>. Keep every letter from both, and add the powers when a letter is repeated (x × x = x², x × y = xy).`);
    h+=`<button class="btn go" id="exok">Try again</button>`;
    return h;
  }
  function why(a,p,t){
    const o=ov(explain(a,p,t),'big ex-dlg');
    const close=()=>{o.remove();lastClose=Date.now();};
    o.querySelector('#exok').onclick=close;o.onclick=e=>{if(e.target===o)close();};o.querySelector('#exok').focus();
  }
  function check(){
    const a=parse(buf,L);
    if(!a){$('#exmsg').innerHTML='Type your answer first.';shake(chips[act]);return;}
    if(same(a,Q.prod[act])){
      done[act]=true;buf='';$('#exmsg').innerHTML='✅ Correct!';
      const nx=done.findIndex(d=>!d);if(nx>=0)act=nx;
      place();draw();if(nx<0)finish();
    }else{shake(chips[act]);$('#exmsg').innerHTML='Not quite — read the box and try again.';why(a,Q.prod[act],Q.t[act]);buf='';draw();}
  }
  const exprStr=()=>`${fmt(Q.m,true)}(${Q.t.map((t,i)=>fmt(t,i===0,true)).join('')})`;
  function finish(){
    const res=Q.prod.map((t,i)=>fmt(t,i===0,true)).join('');
    $('#exres').innerHTML=`<span class="ex-eq">${exprStr()} = <b>${res}</b></span>`;
    ctx.timeout(()=>ctx.win('Expanded!',`${exprStr()} = ${res}`,build,'New question'),700);
  }
  $('#exh').onclick=()=>{if(done.every(Boolean))return;const p=Q.prod[act],vs=varStr(p.p);
    $('#exmsg').innerHTML='💡 Multiply the numbers, then combine the letters. '+(p.c<0?'The answer is negative. ':'The answer is positive. ')+(vs?`It contains: ${vs}.`:'It is just a number.');};
  $('#exn').onclick=build;
  ctx.keys=e=>{const k=e.key.toLowerCase();if(/^[0-9]$/.test(k))press(k);else if(k==='-')press('neg');else if(L.includes(k))press(k);else if(k==='^')press('sq');else if(k==='backspace')press('del');else if(k==='enter')press('ok');};
  const rs=()=>{if(Q){place();draw();}};window.addEventListener('resize',rs);ctx.cleanups.push(()=>window.removeEventListener('resize',rs));
  window.__exq=()=>({Q,L,press,get done(){return done}});
  build();
 }});
})();
