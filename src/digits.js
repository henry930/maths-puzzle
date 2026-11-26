(function(){
const LVS=[
 {op:'+',a:[10,99],b:[10,99],k:2,tip:'Start with the units column: what digit makes the last digit right?'},
 {op:'+',a:[100,999],b:[100,999],k:3,tip:'Work column by column, and remember to carry.'},
 {op:'−',a:[100,999],b:[10,999],k:3,tip:'Check subtraction by adding the answer back: answer + second number = first number.'},
 {op:'×',a:[10,99],b:[2,9],k:3,tip:'Use the times tables: which digit × the single digit ends in the right units digit?'},
 {op:'×',a:[100,999],b:[2,9],k:4,tip:'Estimate first: round the big number and multiply.'},
 {op:'×',a:[10,99],b:[10,99],k:4,tip:'Estimate by rounding both numbers to tens.'},
 {op:'÷',q:[10,99],d:[2,9],k:3,tip:'Division is the inverse of multiplication: quotient × divisor = dividend.'},
 {op:'÷',q:[100,999],d:[2,9],k:4,tip:'Check by multiplying your answer by the divisor.'},
 {op:'÷',q:[10,99],d:[11,25],k:4,tip:'Think: how many times does the divisor go in? Estimate with round numbers.'},
 {op:'÷',q:[100,999],d:[11,25],k:5,tip:'Use inverse thinking: answer × divisor must give the big number.'},
 {op:'÷r',q:[10,99],d:[3,9],k:4,tip:'With a remainder: dividend = answer × divisor + remainder, and the remainder is smaller than the divisor.'},
 {op:'÷r',q:[10,99],d:[11,25],k:5,tip:'Boss level! dividend = answer × divisor + remainder (remainder < divisor).'}
];
function build(L){
  for(;;){
    let A,B,C,Rm=null;const r=(x)=>R(x[0],x[1]);
    if(L.op==='+'){A=r(L.a);B=r(L.b);C=A+B;}
    else if(L.op==='−'){A=r(L.a);B=Math.min(r(L.b),A-1);if(B<10)continue;C=A-B;}
    else if(L.op==='×'){A=r(L.a);B=r(L.b);C=A*B;}
    else if(L.op==='÷'){const q=r(L.q),d=r(L.d);B=d;C=q;A=q*d;}
    else{const q=r(L.q),d=r(L.d);B=d;C=q;Rm=R(1,d-1);A=q*d+Rm;}
    const nums=[A,B,C];if(Rm!==null)nums.push(Rm);
    const sym=L.op==='÷r'?'÷':L.op;
    return{nums:nums.map(String),sym,rem:Rm!==null};
  }
}
function valid(ns,sym,rem){ // ns: array of strings (all digits)
  if(ns.some(s=>s.length>1&&s[0]==='0'))return false;
  const v=ns.map(Number),[A,B,C]=v;
  if(sym==='+')return A+B===C;if(sym==='−')return A-B===C;if(sym==='×')return A*B===C;
  if(!rem)return B>0&&A===B*C;return B>0&&v[3]<B&&v[3]>0&&A===B*C+v[3];
}
function countSols(P,blanks,cap){
  const flat=P.nums.map(s=>s.split('')),cnt={n:0};
  (function rec(k){
    if(cnt.n>=cap)return;
    if(k===blanks.length){if(valid(flat.map(a=>a.join('')),P.sym,P.rem))cnt.n++;return;}
    const [i,j]=blanks[k];const keep=flat[i][j];
    for(let d=0;d<10;d++){flat[i][j]=String(d);rec(k+1);if(cnt.n>=cap)break;}
    flat[i][j]=keep;
  })(0);
  return cnt.n;
}
function gen(L){
  let best=null;
  for(let t=0;t<60;t++){
    const P=build(L);const pos=[];P.nums.forEach((s,i)=>[...s].forEach((_,j)=>pos.push([i,j])));
    const blanks=shuffle(pos).slice(0,L.k);
    const c=countSols(P,blanks,6);
    if(c>=1&&c<=3){P.blanks=blanks;return P;}
    if(!best){P.blanks=blanks;best=P;}
  }
  return best;
}
window.__dd={gen,valid,LVS,countSols};
REG.push({id:'digits',name:'Digit Detective',emoji:'🕵️',color:'#e8478b',cat:'Arithmetic',
 desc:'Calculations with missing digits: add, subtract, multiply and long-divide — then crack the case!',skills:['written methods','inverse operations','estimation'],
 levels:['Add · 2-digit','Add · 3-digit','Subtract · 3-digit','Multiply · 2-digit × 1-digit','Multiply · 3-digit × 1-digit','Multiply · 2-digit × 2-digit','Divide · 2-digit ÷ 1-digit','Divide · 3-digit ÷ 1-digit','Divide · 2-digit ÷ 2-digit','Divide · 3-digit ÷ 2-digit','Divide with remainder · easy','Divide with remainder · boss'],
 how:'Some digits are hidden. Tap a ? box, then type a digit so that the whole calculation is correct. More than one answer can work — any correct one wins!',
 art:'<div class="minidd">4<u>?</u> ÷ 7 = <u>?</u></div>',
 mount(root,lv,ctx){
  const L=LVS[lv-1];let P,vals,sel,locked,over=false;
  function build2(){P=gen(L);vals=P.nums.map(s=>[...s]);locked=new Set();P.blanks.forEach(([i,j])=>vals[i][j]='');sel=0;over=false;draw();}
  const key=(i,j)=>i+','+j;
  function nextBlank(from){for(let k=1;k<=P.blanks.length;k++){const b=(from+k)%P.blanks.length,[i,j]=P.blanks[b];if(vals[i][j]==='')return b;}return from;}
  function draw(msg){
    const isB=(i,j)=>P.blanks.findIndex(b=>b[0]===i&&b[1]===j);
    let h='<div class="dd-eq">';
    const parts=[];
    P.nums.forEach((s,i)=>{
      if(i===1)parts.push(`<span class="dd-sym">${P.sym}</span>`);
      if(i===2)parts.push(`<span class="dd-sym">=</span>`);
      if(i===3)parts.push(`<span class="dd-sym r">r</span>`);
      parts.push('<span class="dd-num">'+[...s].map((ch,j)=>{const b=isB(i,j);
        return b<0?`<span class="dd-d">${ch}</span>`:`<button class="dd-d bl${b===sel?' sel':''}${locked.has(key(i,j))?' lk':''}" data-b="${b}">${vals[i][j]===''?'?':vals[i][j]}</button>`}).join('')+'</span>');
    });
    h+=parts.join('')+'</div><div class="msg dd-msg">'+(msg||'&nbsp;')+'</div><div id="dpad"></div><div class="dd-tip">💡 '+L.tip+'</div><div class="toolrow"><button class="btn alt" id="hn">🔍 Reveal a digit</button><button class="btn alt" id="clr">⟲ Clear</button><button class="btn" id="nw">New case ⏭</button></div>';
    root.innerHTML=h;
    root.querySelectorAll('.bl').forEach(b=>b.onclick=()=>{sel=+b.dataset.b;draw();});
    $('#dpad').appendChild(numpad(k=>press(k)));
    $('#hn').onclick=()=>{if(over)return;const b=P.blanks.findIndex(([i,j],idx)=>!locked.has(key(i,j)));if(b<0)return;
      let t=vals[P.blanks[sel][0]][P.blanks[sel][1]]===''||!locked.has(key(...P.blanks[sel]))?sel:b;const[i,j]=P.blanks[t];vals[i][j]=P.nums[i][j];locked.add(key(i,j));sel=nextBlank(t);draw();finish();};
    $('#clr').onclick=()=>{P.blanks.forEach(([i,j])=>{if(!locked.has(key(i,j)))vals[i][j]=''});sel=0;draw();};
    $('#nw').onclick=build2;
  }
  function press(k){
    if(over)return;const[i,j]=P.blanks[sel];
    if(k==='ok'){finish(true);return;}
    if(locked.has(key(i,j))&&k!=='del'){sel=nextBlank(sel);draw();return;}
    if(k==='del'){if(!locked.has(key(i,j)))vals[i][j]='';draw();return;}
    vals[i][j]=k;sel=nextBlank(sel);draw();finish();
  }
  function finish(manual){
    if(vals.some(a=>a.some(x=>x==='')))return;
    const ns=vals.map(a=>a.join(''));
    if(valid(ns,P.sym,P.rem)){over=true;draw('✅ Case solved!');ctx.win('Case solved!','Every digit is in the right place. Great detective work!',build2,'Another case');}
    else{const [A,B,C,Rm]=ns.map(Number);let txt;
      if(P.sym==='×')txt=`${A} × ${B} = ${A*B}, but your answer says ${C}.`;
      else if(P.sym==='+')txt=`${A} + ${B} = ${A+B}, but your answer says ${C}.`;
      else if(P.sym==='−')txt=`${A} − ${B} = ${A-B}, but your answer says ${C}.`;
      else if(P.rem)txt=`${C} × ${B} + ${Rm} = ${C*B+Rm}, but the number being divided is ${A}.`;
      else txt=`${C} × ${B} = ${C*B}, but the number being divided is ${A}.`;
      draw('❌ Not quite — '+txt);}
  }
  ctx.keys=e=>{if(e.key>='0'&&e.key<='9')press(e.key);else if(e.key==='Backspace'){e.preventDefault();press('del');}else if(e.key==='Enter')press('ok');};
  build2();
 }});
})();
