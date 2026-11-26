(function(){
const LETTERS=['x','y','a','n','m','t'];
const sg=()=>Math.random()<.5?1:-1;
const r=(a,b)=>R(a,b);
// term = {c: coefficient, e: exponent of the variable}
const T=(c,e=0)=>({c,e});
const SPECS=[
 {n:'a(x + b)',g:()=>({m:T(r(2,5)),t:[T(1,1),T(r(1,9))]})},
 {n:'a(x − b)',g:()=>({m:T(r(2,5)),t:[T(1,1),T(-r(1,9))]})},
 {n:'a(bx + c)',g:()=>({m:T(r(2,5)),t:[T(r(2,4),1),T(r(1,9))]})},
 {n:'a(bx − c)',g:()=>({m:T(r(2,5)),t:[T(r(2,4),1),T(-r(1,9))]})},
 {n:'Bigger numbers',g:()=>({m:T(r(3,9)),t:[T(r(2,9),1),T(sg()*r(2,12))]})},
 {n:'Negative outside: −a(x + b)',g:()=>({m:T(-r(2,5)),t:[T(1,1),T(r(1,9))]})},
 {n:'Negative outside: −a(x − b)',g:()=>({m:T(-r(2,5)),t:[T(1,1),T(-r(1,9))]})},
 {n:'Negative outside · mixed',g:()=>({m:T(-r(2,7)),t:[T(r(2,5),1),T(sg()*r(1,9))]})},
 {n:'Variable outside: x(x + b)',g:()=>({m:T(1,1),t:[T(1,1),T(r(1,9))]})},
 {n:'Variable outside: x(x − b)',g:()=>({m:T(1,1),t:[T(1,1),T(-r(1,9))]})},
 {n:'ax(x + b)',g:()=>({m:T(r(2,5),1),t:[T(1,1),T(sg()*r(1,9))]})},
 {n:'−x(bx + c)',g:()=>({m:T(-1,1),t:[T(r(2,5),1),T(sg()*r(1,9))]})},
 {n:'Three terms: a(x² + bx + c)',g:()=>({m:T(r(2,5)),t:[T(1,2),T(r(1,6),1),T(r(1,9))]})},
 {n:'Three terms · mixed signs',g:()=>({m:T(r(2,6)),t:[T(1,2),T(sg()*r(1,6),1),T(sg()*r(1,9))]})},
 {n:'Three terms · negative outside',g:()=>({m:T(-r(2,6)),t:[T(1,2),T(sg()*r(1,6),1),T(sg()*r(1,9))]})},
 {n:'a(bx² + cx + d)',g:()=>({m:T(r(2,5)),t:[T(r(2,4),2),T(sg()*r(1,6),1),T(sg()*r(1,9))]})},
 {n:'−a(bx² ± cx ± d)',g:()=>({m:T(-r(2,5)),t:[T(r(2,4),2),T(sg()*r(1,6),1),T(sg()*r(1,9))]})},
 {n:'ax(bx + c)',g:()=>({m:T(r(2,4),1),t:[T(r(2,4),1),T(sg()*r(1,9))]})},
 {n:'−ax(bx − c)',g:()=>({m:T(-r(2,4),1),t:[T(r(2,4),1),T(sg()*r(1,9))]})},
 {n:'Boss: anything goes!',g:()=>{const k=r(0,2);return k===0?{m:T(sg()*r(2,7)),t:[T(r(1,4),2),T(sg()*r(1,7),1),T(sg()*r(1,9))]}:k===1?{m:T(sg()*r(1,4),1),t:[T(r(2,5),1),T(sg()*r(1,9))]}:{m:T(sg()*r(2,9)),t:[T(sg()*r(1,5),1),T(sg()*r(1,12))]};}}
];
const mul=(a,b)=>T(a.c*b.c,a.e+b.e);
function fmt(t,V,first,spaced){ // display a term
  const neg=t.c<0,ac=Math.abs(t.c);
  let body;
  if(t.e===0)body=String(ac);else body=(ac===1?'':String(ac))+V+(t.e===2?'²':'');
  if(first)return (neg?'−':'')+body;
  return spaced?(neg?' − ':' + ')+body:(neg?'−':'')+body;
}
function parse(s,V){
  s=s.replace(/[−–]/g,'-').replace(/\s/g,'').replace(/^\+/,'');
  const m=s.match(new RegExp('^(-?)(\\d*)(?:('+V+')(\\^2|²)?)?$'));
  if(!m||(m[2]===''&&!m[3]))return null;
  const c=(m[2]===''?1:+m[2])*(m[1]?-1:1);return T(c,m[3]?(m[4]?2:1):0);
}
const same=(a,b)=>a&&a.c===b.c&&a.e===b.e;
window.__ex={SPECS,fmt,parse,mul};
REG.push({id:'expand',name:'Arrow Expander',emoji:'🏹',color:'#e8590c',cat:'Algebra',
 desc:'Expand brackets like 2(x + 5) step by step. Follow each arrow: multiply the outside term by every term inside, and type each answer.',skills:['expanding brackets','multiplying negatives','algebra terms','powers of x'],
 levels:SPECS.map(s=>s.n),
 how:'The number (or term) outside the bracket must multiply EVERY term inside. Tap an arrow’s box, type the answer using the keypad, then press ✓. Watch the signs: − × − = +, and x × x = x²!',
 art:'<div class="minibal">🏹</div>',
 mount(root,lv,ctx){
  const spec=SPECS[lv-1],COL=['#e8590c','#1c7ed6','#2f9e44','#ae3ec9'];
  let Q,V,buf,act,done,locked;
  root.innerHTML=`<div class="ex"><div class="ex-stage" id="exs"><svg id="exsv"><defs></defs></svg><div class="ex-expr" id="exe"></div></div>
   <div class="ex-cap" id="excap"></div><div class="ex-res" id="exres"></div>
   <div class="ex-pad" id="expad"></div><div class="toolrow"><button class="btn alt" id="exh">💡 Hint</button><button class="btn alt" id="exn">New question ⏭</button></div><div class="msg" id="exmsg">&nbsp;</div></div>`;
  const stage=$('#exs'),svg=$('#exsv'),chips=[];
  const keys=[['7','8','9','del'],['4','5','6','neg'],['1','2','3','V'],['0','V2','ok','ok']];
  const pad=$('#expad');
  keys.forEach((row,ri)=>row.forEach((k,ci)=>{if(ri===3&&ci===3)return;
    const b=el('button','key'+(k==='ok'?' ok':'')+(k==='del'?' del':''),k==='del'?'⌫':k==='neg'?'−':k==='ok'?'Check ✓':k==='V2'?'V²':k);
    b.dataset.k=k;if(k==='ok')b.style.gridColumn='span 2';b.onclick=()=>press(k);pad.appendChild(b);}));
  function labelKeys(){pad.querySelectorAll('.key').forEach(b=>{if(b.dataset.k==='V')b.textContent=V;if(b.dataset.k==='V2')b.textContent=V+'²';});}
  function build(){
    const q=spec.g();Q=q;V=lv<=4?'x':pick(LETTERS);
    Q.prod=q.t.map(t=>mul(q.m,t));buf='';act=0;done=Q.t.map(()=>false);
    const mh=fmt(q.m,V,true);
    $('#exe').innerHTML=`<span class="ex-m" id="exm">${mh}</span><span class="ex-p">(</span>`+q.t.map((t,i)=>`<span class="ex-t">${i?`<i class="sg">${t.c<0?' − ':' + '}</i>`:(t.c<0?'<i class="sg">−</i>':'')}<b id="ext${i}">${fmt({c:Math.abs(t.c),e:t.e},V,true)}</b></span>`).join('')+`<span class="ex-p">)</span>`;
    $('#exres').innerHTML='';$('#exmsg').innerHTML='&nbsp;';labelKeys();
    stage.querySelectorAll('.ex-chip').forEach(c=>c.remove());chips.length=0;
    q.t.forEach((t,i)=>{const c=el('button','ex-chip');c.style.setProperty('--ac',COL[i]);c.textContent='?';c.onclick=()=>{if(!done[i]){act=i;buf='';draw();}};stage.appendChild(c);chips.push(c);});
    ctx.timeout(()=>{place();draw();},30);
  }
  function place(){
    const n=Q.t.length,sr=stage.getBoundingClientRect(),er=$('#exe').getBoundingClientRect();
    const top=52+(n-1)*52+64;stage.style.paddingTop=top+'px';
    const sr2=stage.getBoundingClientRect(),er2=$('#exe').getBoundingClientRect();
    svg.setAttribute('width',sr2.width);svg.setAttribute('height',sr2.height);
    const y0=er2.top-sr2.top-2,m=$('#exm').getBoundingClientRect(),x0=m.left+m.width/2-sr2.left;
    let h='<defs>'+COL.map((c,i)=>`<marker id="ah${i}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`).join('')+'</defs>';
    Q.t.forEach((t,i)=>{const tr=$('#ext'+i).getBoundingClientRect(),x1=tr.left+tr.width/2-sr2.left,hh=52+i*52;
      h+=`<path d="M${x0} ${y0} C${x0} ${y0-hh} ${x1} ${y0-hh} ${x1} ${y0-5}" fill="none" stroke="${COL[i]}" stroke-width="3.5" stroke-linecap="round" marker-end="url(#ah${i})" opacity="${done[i]?.45:1}"/>`;
      const c=chips[i];c.style.left=(x0+x1)/2+'px';c.style.top=(y0-hh*.75)+'px';});
    svg.innerHTML=h;
  }
  function shown(){return buf.replace('^2','²').replace(/-/g,'−');}
  function draw(){
    chips.forEach((c,i)=>{c.className='ex-chip'+(done[i]?' ok':'')+(i===act&&!done[i]?' on':'');
      c.textContent=done[i]?fmt(Q.prod[i],V,true):(i===act?(shown()||'…'):'?');});
    if(done.every(Boolean)){$('#excap').innerHTML='';return;}
    const t=Q.t[act];$('#excap').innerHTML=`Arrow ${act+1}: <b class="ex-c${act}">${fmt(Q.m,V,true)}</b> × <b>${t.c<0?'('+fmt(t,V,true)+')':fmt(t,V,true)}</b> = ?`;
    $('#excap').querySelector('b').style.color=COL[act];
  }
  function press(k){
    if(done.every(Boolean))return;
    if(k==='del')buf=buf.endsWith('^2')?buf.slice(0,-2):buf.slice(0,-1);
    else if(k==='neg')buf=buf.startsWith('-')?buf.slice(1):'-'+buf;
    else if(k==='V'){if(!buf.includes(V))buf+=V;}
    else if(k==='V2'){if(!buf.includes(V))buf+=V+'^2';else if(!buf.includes('^'))buf+='^2';}
    else if(k==='ok')return check();
    else if(!buf.includes(V)&&buf.replace('-','').length<4)buf+=k;
    draw();
  }
  function check(){
    const a=parse(buf,V);
    if(!a){$('#exmsg').innerHTML='Type your answer first.';shake(chips[act]);return;}
    if(same(a,Q.prod[act])){
      done[act]=true;buf='';$('#exmsg').innerHTML='✅ Correct!';
      const nx=done.findIndex(d=>!d);
      if(nx>=0)act=nx;
      place();draw();
      if(nx<0)finish();
    }else{
      shake(chips[act]);const t=Q.t[act];
      let w='Not quite. ';
      if(a.c===-Q.prod[act].c&&a.e===Q.prod[act].e)w+='Check the sign: '+(Q.m.c<0!==t.c<0?'different signs give a negative.':'same signs give a positive.');
      else if(a.e!==Q.prod[act].e)w+='Look at the powers of '+V+': '+V+' × '+V+' = '+V+'².';
      else w+='Multiply the number parts carefully.';
      $('#exmsg').innerHTML=w;buf='';draw();
    }
  }
  function finish(){
    const res=Q.prod.map((t,i)=>fmt(t,V,i===0,true)).join('');
    $('#exres').innerHTML=`<span class="ex-eq">${fmt(Q.m,V,true)}(${Q.t.map((t,i)=>fmt(t,V,i===0,true)).join('')}) = <b>${res}</b></span>`;
    ctx.timeout(()=>ctx.win('Expanded!',`${fmt(Q.m,V,true)}(${Q.t.map((t,i)=>fmt(t,V,i===0,true)).join('')}) = ${res}`,build,'New question'),700);
  }
  $('#exh').onclick=()=>{if(done.every(Boolean))return;const t=Q.t[act],p=Q.prod[act];
    $('#exmsg').innerHTML='💡 Multiply the number parts first, then deal with the sign and the letter. '+(p.c<0?'The answer is negative.':'The answer is positive.')+(p.e===2?` It has ${V}².`:p.e===1?` It has a ${V}.`:' It is just a number.');};
  $('#exn').onclick=build;
  ctx.keys=e=>{const k=e.key;if(/^[0-9]$/.test(k))press(k);else if(k==='-')press('neg');else if(k===V)press('V');else if(k==='^'||k==='2'&&false)press('V2');else if(k==='Backspace')press('del');else if(k==='Enter')press('ok');};
  const rs=()=>{if(Q){place();draw();}};window.addEventListener('resize',rs);ctx.cleanups.push(()=>window.removeEventListener('resize',rs));
  window.__exq=()=>({Q,V,press,get done(){return done}});
  build();
 }});
})();
