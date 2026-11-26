(function(){
const A='+',S='−',M='×',D='÷';
const DEFS=[{n:3,ops:[A],g:3},{n:3,ops:[A,S],g:2},{n:3,ops:[A,S,M],g:1},{n:4,ops:[A],g:5},{n:4,ops:[A,S],g:4},{n:4,ops:[A,S,M],g:3},{n:4,ops:[A,S,M,D],g:2},{n:5,ops:[A],g:7},{n:5,ops:[A,S],g:5},{n:5,ops:[A,S,M],g:4},{n:5,ops:[A,S,M,D],g:2},{n:6,ops:[A,S,M,D],g:4}];
function latin(n){
  const rp=shuffle([...Array(n).keys()]),cp=shuffle([...Array(n).keys()]),sp=shuffle([...Array(n).keys()]);
  return rp.map(r=>cp.map(c=>sp[(r+c)%n]+1));
}
function cagesFor(n,sq,ops){
  const id=Array.from({length:n},()=>Array(n).fill(-1)),cages=[];
  const cells=shuffle([...Array(n*n).keys()]);
  for(const s of cells){
    const r0=Math.floor(s/n),c0=s%n;if(id[r0][c0]>=0)continue;
    const k=cages.length,size=[1,2,2,2,3,3][R(0,5)],cs=[[r0,c0]];id[r0][c0]=k;
    while(cs.length<size){
      const opts=[];cs.forEach(([r,c])=>[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>{const a=r+dr,b=c+dc;if(a>=0&&b>=0&&a<n&&b<n&&id[a][b]<0)opts.push([a,b])}));
      if(!opts.length)break;const [a,b]=opts[R(0,opts.length-1)];id[a][b]=k;cs.push([a,b]);
    }
    cages.push({cells:cs});
  }
  cages.forEach(cg=>{
    cg.cells.sort((x,y)=>x[0]-y[0]||x[1]-y[1]);
    const v=cg.cells.map(([r,c])=>sq[r][c]);
    if(v.length===1){cg.op='';cg.t=v[0];return;}
    let cand=[];
    if(v.length===2){const hi=Math.max(...v),lo=Math.min(...v);
      if(ops.includes('+'))cand.push('+');if(ops.includes('−'))cand.push('−');if(ops.includes('×'))cand.push('×');
      if(ops.includes('÷')&&hi%lo===0)cand.push('÷');
    }else{cand.push('+');if(ops.includes('×'))cand.push('×');}
    cg.op=cand[R(0,cand.length-1)];
    cg.t=cg.op==='+'?v.reduce((a,b)=>a+b):cg.op==='×'?v.reduce((a,b)=>a*b):cg.op==='−'?Math.abs(v[0]-v[1]):Math.max(...v)/Math.min(...v);
  });
  return{id,cages};
}
function cageOk(cg,vals){
  if(cg.op==='')return vals[0]===cg.t;
  if(cg.op==='+')return vals.reduce((a,b)=>a+b)===cg.t;
  if(cg.op==='×')return vals.reduce((a,b)=>a*b)===cg.t;
  const hi=Math.max(...vals),lo=Math.min(...vals);
  return cg.op==='−'?hi-lo===cg.t:hi/lo===cg.t;
}
function countSol(n,id,cages,cap=2){
  const g=Array.from({length:n},()=>Array(n).fill(0));let cnt=0;
  const rem=cages.map(c=>c.cells.length);
  (function rec(p){
    if(cnt>=cap)return;
    if(p===n*n){cnt++;return;}
    const r=Math.floor(p/n),c=p%n,k=id[r][c],cg=cages[k];
    for(let v=1;v<=n;v++){
      let bad=false;for(let i=0;i<n;i++){if(g[r][i]===v||g[i][c]===v){bad=true;break;}}
      if(bad)continue;
      g[r][c]=v;
      if(cg.cells.every(([a,b])=>g[a][b]>0)){
        if(!cageOk(cg,cg.cells.map(([a,b])=>g[a][b]))){g[r][c]=0;continue;}
      }else if(cg.op==='+'||cg.op==='×'){
        const vs=cg.cells.map(([a,b])=>g[a][b]).filter(x=>x>0);
        if(cg.op==='+'&&vs.reduce((a,b)=>a+b)>=cg.t){g[r][c]=0;continue;}
        if(cg.op==='×'&&(cg.t%vs.reduce((a,b)=>a*b)!==0)){g[r][c]=0;continue;}
      }
      rec(p+1);g[r][c]=0;
    }
  })(0);
  return cnt;
}
function gen(def){
  let best=null;const t0=Date.now();
  for(let t=0;t<400&&Date.now()-t0<600;t++){
    const sq=latin(def.n),{id,cages}=cagesFor(def.n,sq,def.ops);
    const u=countSol(def.n,id,cages,2);
    const P={sq,id,cages,n:def.n};
    if(u===1){best=P;break;}
    if(!best)best=P;
  }
  // colour cages so neighbours differ
  const col=[];best.cages.forEach((cg,k)=>{const used=new Set();cg.cells.forEach(([r,c])=>[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>{const a=r+dr,b=c+dc;if(a>=0&&b>=0&&a<def.n&&b<def.n){const j=best.id[a][b];if(j!==k&&col[j]!==undefined)used.add(col[j]);}}));let x=0;while(used.has(x))x++;col[k]=x;});
  best.col=col;
  best.givens=shuffle([...Array(def.n*def.n).keys()]).slice(0,def.g).map(i=>[Math.floor(i/def.n),i%def.n]);
  return best;
}
window.__kk={gen,countSol,DEFS};

REG.push({id:'kenken',name:'KenKen',emoji:'🔢',color:'#17a2b8',
 desc:'Sudoku with sums! Fill the grid so no number repeats in a row or column, and every outlined block hits its target.',skills:['sudoku logic','+ − × ÷ facts','factors'],
 cat:'Logic',levels:['3×3 · add only','3×3 · + and −','3×3 · + − ×','4×4 · add only','4×4 · + and −','4×4 · + − ×','4×4 · all four operations','5×5 · add only','5×5 · + and −','5×5 · + − ×','5×5 · all four operations','6×6 · boss level'],
 how:'Fill every square with 1 up to the grid size. Like Sudoku, no number repeats in a row or column. Each coloured block has a small label such as “6×” or “3+”: the digits inside must make that target using that operation (for − and ÷ the order doesn’t matter, and a number may repeat inside a block if the squares aren’t in the same row or column). Blue squares are given. Block labels turn green when correct, red when wrong.',
 art:'<div class="minikk"><b>6×</b><b>3</b><b>2</b><b>1</b></div>',
 mount(root,lv,ctx){
  const def=DEFS[lv-1],n=def.n;let P,val,notes,sel,pencil=false,over=false;
  function build(){P=gen(def);val=Array.from({length:n},()=>Array(n).fill(0));P.givens.forEach(([r,c])=>val[r][c]=P.sq[r][c]);notes=Array.from({length:n},()=>Array.from({length:n},()=>new Set()));sel=[0,0];over=false;pencil=false;draw();}
  function status(){
    const dup=Array.from({length:n},()=>Array(n).fill(false));
    for(let r=0;r<n;r++)for(let c=0;c<n;c++){const v=val[r][c];if(!v)continue;
      for(let i=0;i<n;i++){if(i!==c&&val[r][i]===v)dup[r][c]=true;if(i!==r&&val[i][c]===v)dup[r][c]=true;}}
    const cs=P.cages.map(cg=>{const vs=cg.cells.map(([r,c])=>val[r][c]);if(vs.some(x=>!x))return 0;return cageOk(cg,vs)?1:-1;});
    return{dup,cs};
  }
  const isG=(r,c)=>P.givens.some(g=>g[0]===r&&g[1]===c);
  function draw(){
    const st=status(),cs=Math.min(88,Math.floor((Math.min(innerWidth,520)-40)/n));
    let h=`<div class="kk-board" style="grid-template-columns:repeat(${n},${cs}px);--cs:${cs}px">`;
    for(let r=0;r<n;r++)for(let c=0;c<n;c++){
      const k=P.id[r][c],cg=P.cages[k];
      const b=(dr,dc)=>{const a=r+dr,d=c+dc;return a<0||d<0||a>=n||d>=n||P.id[a][d]!==k;};
      const first=cg.cells[0][0]===r&&cg.cells[0][1]===c;
      const state=st.cs[k]===1?' cok':st.cs[k]===-1?' cbad':'';
      h+=`<div class="kk-cell k${P.col[k]}${isG(r,c)?' giv':''}${b(-1,0)?' bt':''}${b(1,0)?' bb':''}${b(0,-1)?' bl':''}${b(0,1)?' br':''}${sel[0]===r&&sel[1]===c?' sel':''}${st.dup[r][c]?' dup':''}${state}" data-r="${r}" data-c="${c}">
        ${first?`<span class="kk-lab">${cg.t}${cg.op}</span>`:''}
        ${val[r][c]?`<span class="kk-v">${val[r][c]}</span>`:`<span class="kk-n">${[...notes[r][c]].sort().join(' ')}</span>`}</div>`;
    }
    h+=`</div><div class="tray kkpad">`;
    for(let v=1;v<=n;v++)h+=`<button class="tile" data-v="${v}">${v}</button>`;
    h+=`<button class="tile alt" data-v="0">⌫</button><button class="tile alt${pencil?' sel':''}" data-v="p">✏️</button></div>
    <div class="msg" id="mk">${pencil?'Notes mode: tap numbers to jot possibilities.':'&nbsp;'}</div>
    <div class="toolrow"><button class="btn alt" id="hn">💡 Hint (fill this square)</button><button class="btn alt" id="clr">⟲ Clear</button><button class="btn" id="nw">New puzzle ⏭</button></div>`;
    root.innerHTML=h;
    root.querySelectorAll('.kk-cell').forEach(e=>e.onclick=()=>{sel=[+e.dataset.r,+e.dataset.c];draw();});
    root.querySelectorAll('.kkpad .tile').forEach(e=>e.onclick=()=>enter(e.dataset.v));
    $('#hn').onclick=()=>{if(over||isG(sel[0],sel[1]))return;const[r,c]=sel;val[r][c]=P.sq[r][c];notes[r][c].clear();draw();check();};
    $('#clr').onclick=()=>{val.forEach((row,r)=>row.forEach((_,c)=>{if(!isG(r,c))row[c]=0}));notes.forEach(r=>r.forEach(s=>s.clear()));draw();};
    $('#nw').onclick=build;
  }
  function enter(v){
    if(over)return;if(v==='p'){pencil=!pencil;draw();return;}
    const[r,c]=sel;v=+v;if(isG(r,c))return;
    if(v===0){val[r][c]=0;notes[r][c].clear();}
    else if(pencil){if(val[r][c])return;notes[r][c].has(v)?notes[r][c].delete(v):notes[r][c].add(v);}
    else{val[r][c]=v;notes[r][c].clear();}
    draw();check();
  }
  function check(){
    const st=status();
    if(val.flat().every(x=>x)&&!st.dup.flat().some(x=>x)&&st.cs.every(x=>x===1)){over=true;
      ctx.win('KenKen solved!','Every block hits its target and no row or column repeats. 🧠',build);}
  }
  ctx.keys=e=>{
    if(e.key>='1'&&e.key<='9'&&+e.key<=n){enter(e.key);}
    else if(e.key==='Backspace'||e.key==='Delete'||e.key==='0'){e.preventDefault();enter('0');}
    else if(e.key==='ArrowUp'){sel=[Math.max(0,sel[0]-1),sel[1]];draw();}
    else if(e.key==='ArrowDown'){sel=[Math.min(n-1,sel[0]+1),sel[1]];draw();}
    else if(e.key==='ArrowLeft'){sel=[sel[0],Math.max(0,sel[1]-1)];draw();}
    else if(e.key==='ArrowRight'){sel=[sel[0],Math.min(n-1,sel[1]+1)];draw();}
    else if(e.key==='n'||e.key==='N'){pencil=!pencil;draw();}
  };
  build();
 }});
})();
