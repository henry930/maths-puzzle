(function(){
// Number Match: clear pairs that are equal or add to T. Cells must "see" each other along a row/column (or reading order) with only cleared cells between.
const LV=[
 {T:10,max:9,rows:4,eq:true,sight:true},
 {T:10,max:9,rows:5,eq:true,sight:true},
 {T:10,max:9,rows:6,eq:true,sight:true},
 {T:10,max:9,rows:7,eq:true,sight:true},
 {T:10,max:9,rows:6,eq:false},
 {T:12,max:9,rows:5,eq:true},
 {T:12,max:11,rows:6,eq:true},
 {T:15,max:14,rows:6,eq:true},
 {T:20,max:19,rows:6,eq:true},
 {T:20,max:19,rows:7,eq:false},
 {T:25,max:24,rows:7,eq:true},
 {T:100,max:99,rows:7,eq:false,tens:true}];
const COLS=9;
function mkBoard(s){
  let n=s.rows*COLS;if(n%2)n--;const cells=[];
  const T=s.T;
  // build from pairs so that total count is solvable in principle
  while(cells.length<n){
    let a,b;
    if(s.tens){a=R(1,9)*10;b=T-a;}
    else{const lo=Math.max(1,T-s.max),hi=Math.min(s.max,T-1);a=R(lo,hi);b=(s.eq&&Math.random()<.45)?a:T-a;
      if(b!==a){/*complement stays valid*/}}
    cells.push(a,b);
  }
  cells.length=n;
  return shuffle(cells);
}
function canPair(g,i,j,s){
  if(i===j||g[i]==null||g[j]==null)return false;
  const a=g[i],b=g[j];
  if(!(a===b&&s.eq!==false||a+b===s.T))return false;
  if(!s.sight)return true;
  const [lo,hi]=i<j?[i,j]:[j,i];
  const dr=Math.floor(hi/COLS)-Math.floor(lo/COLS),dc=(hi%COLS)-(lo%COLS);
  if(Math.abs(dr)===Math.abs(dc)&&dr!==0){const st=COLS+(dc>0?1:-1);for(let k=lo+st;k!==hi;k+=st)if(g[k]!=null)return false;return true;}
  const sameCol=(lo%COLS)===(hi%COLS),sameRow=Math.floor(lo/COLS)===Math.floor(hi/COLS);
  if(sameCol){for(let k=lo+COLS;k<hi;k+=COLS)if(g[k]!=null)return false;return true;}
  if(sameRow||true){for(let k=lo+1;k<hi;k++)if(g[k]!=null)return false;return true;} // reading-order line
}
function findMove(g,s){for(let i=0;i<g.length;i++)if(g[i]!=null)for(let j=i+1;j<g.length;j++)if(canPair(g,i,j,s))return[i,j];return null;}
window.__nm={LV,mkBoard,canPair,findMove,COLS};
REG.push({id:'match',name:'Number Match',emoji:'🔢',color:'#e8590c',cat:'Arithmetic',
 desc:'The mobile classic! Tap two numbers that are equal or add up to the target to clear them. Clear the whole board!',skills:['number bonds','mental addition','complements','pattern spotting'],
 levels:LV.map((s,i)=>['Pairs of 10 · small board','Pairs of 10','Pairs of 10 · bigger','Pairs of 10 · big board','Sums only · target 10','Target 12','Target 12 · up to 11','Target 15','Target 20','Target 20 · sums only','Target 25','Boss: target 100'][i]),
 how:'Tap two numbers that are EQUAL or ADD UP TO the target. In the first four levels they must be able to “see” each other (only cleared gaps between them, along a row, column, diagonal or reading order); later levels let you match any two numbers. No moves left? Press ➕ Add numbers to copy the remaining numbers onto the end (the fewer times you need it, the better!).',
 art:'<div class="minibal">🔢</div>',
 mount(root,lv,ctx){
  const s=LV[lv-1];let g,sel,adds,over,cleared;
  function start(){g=mkBoard(s);sel=null;adds=99;over=false;cleared=0;draw();}
  function draw(msg){
    const left=g.filter(v=>v!=null).length;
    let h=`<div class="nm"><div class="nm-t">Target: <b>${s.T}</b> &nbsp; ${s.eq===false?'(sums only)':'(equal pairs also work)'}</div><div class="nm-g" style="grid-template-columns:repeat(${COLS},1fr)">`;
    g.forEach((v,i)=>{h+=`<button class="nm-c${v==null?' x':''}${sel===i?' sel':''}" data-i="${i}" ${v==null?'disabled':''}>${v==null?'':v}</button>`;});
    h+=`</div><div class="msg">${msg||`${left} numbers left`}</div><div class="toolrow"><button class="btn alt" id="nm-h">💡 Hint</button><button class="btn alt" id="nm-a">➕ Add numbers${99-adds?` (used ${99-adds})`:''}</button><button class="btn" id="nm-r">Restart</button></div></div>`;
    root.innerHTML=h;
    root.querySelectorAll('.nm-c').forEach(b=>b.onclick=()=>tap(+b.dataset.i));
    $('#nm-h').onclick=()=>{const m=findMove(g,s);if(!m){draw('No pair available — press ➕ Add numbers.');return;}sel=null;draw('💡 Look at '+g[m[0]]+' and '+g[m[1]]);root.querySelectorAll('.nm-c')[m[0]].classList.add('hint');root.querySelectorAll('.nm-c')[m[1]].classList.add('hint');};
    $('#nm-a').onclick=()=>{if(over)return;if(adds<=0){return;}adds--;g=g.concat(shuffle(g.filter(v=>v!=null)));sel=null;draw('Added a copy of the remaining numbers.');};
    $('#nm-r').onclick=start;
  }
  function tap(i){
    if(over||g[i]==null)return;
    if(sel==null||sel===i){sel=sel===i?null:i;draw();return;}
    if(canPair(g,sel,i,s)){const a=g[sel],b=g[i];g[sel]=null;g[i]=null;cleared++;sel=null;
      const left=g.filter(v=>v!=null).length;
      if(!left){over=true;draw();ctx.win('Board cleared!','Every number is gone — great number-bond skills!',start,'Play again');return;}
      draw(a===b?`${a} = ${b} ✓`:`${a} + ${b} = ${s.T} ✓`);}
    else{const a=g[sel],b=g[i];const bad=!(a===b&&s.eq!==false||a+b===s.T);sel=i;draw(bad?`${a} and ${b} don’t match (${a} + ${b} = ${a+b}).`:'They can’t “see” each other — a number is in between.');
      const c=root.querySelectorAll('.nm-c')[i];shake(c);}
  }
  start();
  root.__auto=()=>{for(let k=0;k<2000&&!over;k++){const m=findMove(g,s);if(m){sel=m[0];tap(m[1]);}else if(adds>0){$('#nm-a').click();}else return false;}return over;};
 }});
})();
