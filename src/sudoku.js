(function(){
const LV=[[4,2,2,9],[4,2,2,7],[4,2,2,5],[6,2,3,20],[6,2,3,16],[6,2,3,13],[9,3,3,42],[9,3,3,36],[9,3,3,32],[9,3,3,29],[9,3,3,27],[9,3,3,25]];
const pc=m=>{let c=0;while(m){m&=m-1;c++}return c};
function solver(n,br,bc){
  const full=(1<<n)-1;
  return function run(g,cap,randomize){
    const rows=Array(n).fill(0),cols=Array(n).fill(0),box=Array(n).fill(0);
    const bi=i=>Math.floor(Math.floor(i/n)/br)*(n/bc)+Math.floor((i%n)/bc);
    for(let i=0;i<n*n;i++)if(g[i]){const b=1<<(g[i]-1);rows[Math.floor(i/n)]|=b;cols[i%n]|=b;box[bi(i)]|=b;}
    let cnt=0,first=null;
    (function rec(){
      if(cnt>=cap)return;
      let best=-1,bm=0,bcnt=99;
      for(let i=0;i<n*n;i++)if(!g[i]){const m=full&~(rows[Math.floor(i/n)]|cols[i%n]|box[bi(i)]),c=pc(m);if(c===0)return;if(c<bcnt){bcnt=c;best=i;bm=m;if(c===1)break;}}
      if(best<0){cnt++;if(!first)first=g.slice();return;}
      const vs=[];for(let v=0;v<n;v++)if(bm>>v&1)vs.push(v);if(randomize)shuffle(vs);
      const r=Math.floor(best/n),c=best%n,b=bi(best);
      for(const v of vs){const bit=1<<v;g[best]=v+1;rows[r]|=bit;cols[c]|=bit;box[b]|=bit;rec();g[best]=0;rows[r]&=~bit;cols[c]&=~bit;box[b]&=~bit;if(cnt>=cap)return;}
    })();
    return{cnt,first};
  };
}
function make(n,br,bc,givens){
  const run=solver(n,br,bc);
  const sol=run(Array(n*n).fill(0),1,true).first,g=sol.slice();
  const order=shuffle([...Array(n*n).keys()]);let left=n*n;
  for(const i of order){if(left<=givens)break;const keep=g[i];g[i]=0;if(run(g.slice(),2,false).cnt!==1)g[i]=keep;else left--;}
  return{sol,puz:g};
}
window.__sd={make,solver,LV};
REG.push({id:'sudoku',name:'Sudoku',emoji:'🔲',color:'#2a6cc0',cat:'Logic',
 desc:'The classic number-placement puzzle. From tiny 4×4 grids to full 9×9 — every puzzle has exactly one answer.',skills:['logical deduction','number patterns','concentration'],
 levels:['4×4 · easy','4×4 · medium','4×4 · hard','6×6 · easy','6×6 · medium','6×6 · hard','9×9 · easy','9×9 · medium','9×9 · tricky','9×9 · hard','9×9 · expert','9×9 · master'],
 how:'Fill the grid so every row, every column and every box contains each number exactly once. Tap a square, then a number. Use ✏️ to jot small notes of possibilities. Blue numbers are given.',
 art:'<div class="minisd"><b>1</b><b></b><b></b><b>3</b><b></b><b>4</b><b>2</b><b></b></div>',
 mount(root,lv,ctx){
  const [n,br,bc,gv]=LV[lv-1];let P,val,notes,sel,pencil=false,over=false;
  const cs=Math.floor(Math.min(n===9?52:72,(Math.min(innerWidth,540)-34)/n));
  function build(){const t=make(n,br,bc,gv);P=t;val=P.puz.slice();notes=Array.from({length:n*n},()=>new Set());sel=0;over=false;pencil=false;draw();}
  function conflicts(){
    const bad=new Set();
    for(let i=0;i<n*n;i++){const v=val[i];if(!v)continue;const r=Math.floor(i/n),c=i%n;
      for(let j=0;j<n*n;j++){if(j===i||val[j]!==v)continue;const r2=Math.floor(j/n),c2=j%n;
        if(r2===r||c2===c||(Math.floor(r2/br)===Math.floor(r/br)&&Math.floor(c2/bc)===Math.floor(c/bc))){bad.add(i);break;}}}
    return bad;
  }
  function draw(){
    const bad=conflicts(),sv=val[sel],sr=Math.floor(sel/n),sc=sel%n;
    let h=`<div class="kk-board sd" style="grid-template-columns:repeat(${n},${cs}px);--cs:${cs}px">`;
    for(let i=0;i<n*n;i++){
      const r=Math.floor(i/n),c=i%n,given=P.puz[i]>0;
      const rel=r===sr||c===sc||(Math.floor(r/br)===Math.floor(sr/br)&&Math.floor(c/bc)===Math.floor(sc/bc));
      h+=`<div class="kk-cell${r%br===0&&r>0?' bt':''}${c%bc===0&&c>0?' bl':''}${i===sel?' sel':''}${rel?' rel':''}${sv&&val[i]===sv?' same':''}${bad.has(i)?' dup':''}${given?' giv':''}" data-i="${i}">
       ${val[i]?`<span class="kk-v">${val[i]}</span>`:`<span class="kk-n">${[...notes[i]].sort((a,b)=>a-b).join(' ')}</span>`}</div>`;
    }
    h+='</div><div class="tray kkpad">';
    for(let v=1;v<=n;v++)h+=`<button class="tile" data-v="${v}">${v}</button>`;
    h+=`<button class="tile alt" data-v="0">⌫</button><button class="tile alt${pencil?' sel':''}" data-v="p">✏️</button></div>
    <div class="msg">${pencil?'Notes mode on: tap numbers to jot possibilities.':'&nbsp;'}</div>
    <div class="toolrow"><button class="btn alt" id="hn">💡 Hint</button><button class="btn alt" id="clr">⟲ Clear</button><button class="btn" id="nw">New puzzle ⏭</button></div>`;
    root.innerHTML=h;
    root.querySelectorAll('.kk-cell').forEach(e=>e.onclick=()=>{sel=+e.dataset.i;draw();});
    root.querySelectorAll('.kkpad .tile').forEach(e=>e.onclick=()=>enter(e.dataset.v));
    $('#hn').onclick=()=>{if(over||P.puz[sel])return;val[sel]=P.sol[sel];notes[sel].clear();draw();check();};
    $('#clr').onclick=()=>{val=P.puz.slice();notes.forEach(s=>s.clear());draw();};
    $('#nw').onclick=build;
  }
  function enter(v){
    if(over)return;if(v==='p'){pencil=!pencil;draw();return;}
    if(P.puz[sel])return;v=+v;
    if(v===0){val[sel]=0;notes[sel].clear();}
    else if(pencil){if(val[sel])return;notes[sel].has(v)?notes[sel].delete(v):notes[sel].add(v);}
    else{val[sel]=v;notes[sel].clear();}
    draw();check();
  }
  function check(){
    if(val.every(x=>x)&&conflicts().size===0){over=true;ctx.win('Sudoku solved!','Every row, column and box is complete. Superb logic! 🧠',build);}
  }
  ctx.keys=e=>{
    const k=e.key;
    if(k>='1'&&k<='9'&&+k<=n)enter(k);
    else if(k==='Backspace'||k==='Delete'||k==='0'){e.preventDefault();enter('0');}
    else if(k==='ArrowUp'){sel=Math.max(0,sel-n);draw();}else if(k==='ArrowDown'){sel=Math.min(n*n-1,sel+n);draw();}
    else if(k==='ArrowLeft'){sel=Math.max(0,sel-1);draw();}else if(k==='ArrowRight'){sel=Math.min(n*n-1,sel+1);draw();}
    else if(k==='n'||k==='N'){pencil=!pencil;draw();}
  };
  build();
 }});
})();
