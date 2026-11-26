(function(){
REG.push({id:'grid',name:'Number Grid',emoji:'🧩',color:'#7c5cff',
 desc:'Place the digits so every row and column adds up to the answer. Work left→right and top→bottom.',skills:['fill-in-the-blanks','order of working','inverse thinking'],
 cat:'Arithmetic',levels:['2×2 · add only','2×2 · + and −','2×2 · + − ×','2×2 · digits up to 15','3×3 · add only','3×3 · + and −','3×3 · × and +','3×3 · + − ×','3×3 · digits up to 12','3×3 · digits up to 15','3×3 · digits up to 20','3×3 · boss: up to 25'],
 how:'Tap a digit from the tray, then tap a square. Each line is worked out in order, left to right (or top to bottom). Make every answer match!',
 art:'<div class="minigrid"><b>4</b><i>+</i><b>2</b><i>=</i><b>6</b></div>',
 mount(root,lv,ctx){
  const LV=[[2,['+'],9],[2,['+','−'],9],[2,['+','−','×'],9],[2,['+','−','×'],15],[3,['+'],9],[3,['+','−'],9],[3,['+','×'],9],[3,['+','−','×'],9],[3,['+','−','×'],12],[3,['+','−','×'],15],[3,['+','−','×'],20],[3,['+','−','×'],25]][lv-1];const n=LV[0],opsA=LV[1],top=LV[2];
  const ap=(a,o,b)=>o==='+'?a+b:o==='−'?a-b:a*b;
  let P,placed,lock,selDigit=null,over=false;
  function gen(){
    for(;;){
      const dig=shuffle(Array.from({length:top},(_,i)=>i+1)).slice(0,n*n);
      const hop=Array.from({length:n},()=>Array.from({length:n-1},()=>opsA[R(0,opsA.length-1)]));
      const vop=Array.from({length:n-1},()=>Array.from({length:n},()=>opsA[R(0,opsA.length-1)]));
      const g=[];for(let r=0;r<n;r++)g.push(dig.slice(r*n,r*n+n));
      const rowR=g.map((row,r)=>row.reduce((a,v,c)=>c?ap(a,hop[r][c-1],v):v,0));
      const colR=Array.from({length:n},(_,c)=>{let a=g[0][c];for(let r=1;r<n;r++)a=ap(a,vop[r-1][c],g[r][c]);return a});
      if([...rowR,...colR].every(x=>x>=0&&x<=400)&&new Set([...rowR,...colR]).size>=n+1)return{dig,hop,vop,g,rowR,colR};
    }
  }
  function build(){
    P=gen();placed=Array.from({length:n},()=>Array(n).fill(null));lock=Array.from({length:n},()=>Array(n).fill(false));selDigit=null;over=false;draw();
  }
  function line(kind,k){ // returns {full,ok}
    const vals=kind==='r'?placed[k]:placed.map(r=>r[k]);
    if(vals.some(v=>v===null))return{full:false,ok:false};
    let a=vals[0];for(let i=1;i<n;i++)a=ap(a,kind==='r'?P.hop[k][i-1]:P.vop[i-1][k],vals[i]);
    return{full:true,ok:a===(kind==='r'?P.rowR[k]:P.colR[k])};
  }
  function draw(){
    const W=2*n+1;let h=`<div class="ng-board" style="grid-template-columns:repeat(${W},auto)">`;
    for(let r=0;r<W;r++)for(let c=0;c<W;c++){
      const er=r%2===0,ec=c%2===0;
      if(er&&ec&&r<2*n-1+1&&c<2*n-1+1&&r/2<n&&c/2<n){const i=r/2,j=c/2,v=placed[i][j];h+=`<button class="ng-cell${v!==null?' f':''}${lock[i][j]?' lk':''}" data-i="${i}" data-j="${j}">${v??''}</button>`;}
      else if(er&&!ec&&(c-1)/2<n-1&&r/2<n)h+=`<div class="ng-op">${P.hop[r/2][(c-1)/2]}</div>`;
      else if(er&&c===2*n-1&&r/2<n)h+=`<div class="ng-op">=</div>`;
      else if(er&&c===2*n&&r/2<n){const L=line('r',r/2);h+=`<div class="ng-res${L.full?(L.ok?' ok':' bad'):''}">${P.rowR[r/2]}</div>`;}
      else if(!er&&ec&&c/2<n&&(r-1)/2<n-1)h+=`<div class="ng-op">${P.vop[(r-1)/2][c/2]}</div>`;
      else if(r===2*n-1&&ec&&c/2<n)h+=`<div class="ng-op">=</div>`;
      else if(r===2*n&&ec&&c/2<n){const L=line('c',c/2);h+=`<div class="ng-res${L.full?(L.ok?' ok':' bad'):''}">${P.colR[c/2]}</div>`;}
      else h+='<div></div>';
    }
    h+='</div><div class="tray">';
    const used=new Set(placed.flat().filter(v=>v!==null));
    [...P.dig].sort((a,b)=>a-b).forEach(d=>{h+=`<button class="tile${used.has(d)?' used':''}${selDigit===d?' sel':''}" data-d="${d}">${d}</button>`});
    h+='</div><div class="msg" id="mg">&nbsp;</div><div class="toolrow"><button class="btn alt" id="clr">⟲ Clear</button><button class="btn alt" id="hn">💡 Hint</button><button class="btn" id="nw">New puzzle ⏭</button></div>';
    root.innerHTML=h;
    root.querySelectorAll('.ng-cell').forEach(b=>b.onclick=()=>tapCell(+b.dataset.i,+b.dataset.j,b));
    root.querySelectorAll('.tile').forEach(b=>b.onclick=()=>{if(b.classList.contains('used'))return;selDigit=selDigit===+b.dataset.d?null:+b.dataset.d;draw();});
    $('#clr').onclick=()=>{placed.forEach((r,i)=>r.forEach((_,j)=>{if(!lock[i][j])placed[i][j]=null}));selDigit=null;draw();};
    $('#nw').onclick=build;
    $('#hn').onclick=()=>{
      const cand=[];for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(placed[i][j]!==P.g[i][j])cand.push([i,j]);
      if(!cand.length)return;const [i,j]=cand[R(0,cand.length-1)];
      // free the digit if it sits elsewhere
      for(let a=0;a<n;a++)for(let b=0;b<n;b++)if(placed[a][b]===P.g[i][j]&&!lock[a][b])placed[a][b]=null;
      placed[i][j]=P.g[i][j];lock[i][j]=true;selDigit=null;draw();check();
    };
  }
  function tapCell(i,j,b){
    if(over||lock[i][j])return;
    if(placed[i][j]!==null){placed[i][j]=null;draw();return;}
    if(selDigit===null){shake(b);toast('Choose a digit from the tray first');return;}
    placed[i][j]=selDigit;selDigit=null;draw();check();
  }
  function check(){
    let ok=true;for(let k=0;k<n;k++){if(!line('r',k).ok||!line('c',k).ok)ok=false;}
    if(ok&&!over){over=true;ctx.win('Grid solved!','Every row and column works. Brilliant arithmetic!',build);}
    else if(placed.flat().every(v=>v!==null)){$('#mg').innerHTML='Red answers don’t match yet — swap some digits.';}
  }
  build();
 }});
})();
