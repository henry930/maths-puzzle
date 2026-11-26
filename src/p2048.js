(function(){
const LV=[{n:3,b:2,t:32},{n:3,b:2,t:64},{n:4,b:2,t:128},{n:4,b:2,t:256},{n:4,b:2,t:512},{n:4,b:2,t:1024},
 {n:4,b:3,t:81},{n:5,b:3,t:243},{n:5,b:2,t:512,pw:true},{n:4,b:2,t:2048},{n:5,b:3,t:729,pw:true},{n:5,b:2,t:2048,pw:true}];
function slideLine(a,b){ // merge toward index 0; b = merge base (needs b equal tiles? we use pairs for b=2 and b=3 triples for b>2?)
  const v=a.filter(x=>x);const out=[];let sc=0;
  const need=2; // always merge two equal tiles; value multiplies by... see below
  for(let i=0;i<v.length;i++){
    if(i+1<v.length&&v[i]===v[i+1]){out.push(v[i]*(b===2?2:b));i++;}  // b>2: two equal tiles make the next power? handled by 'b' rule below
    else out.push(v[i]);
  }
  while(out.length<a.length)out.push(0);
  return out;
}
window.__p48={LV,slideLine};
REG.push({id:'p2048',name:'Power Merge',emoji:'🔮',color:'#d9480f',cat:'Arithmetic',
 desc:'A 2048-style game. Slide tiles to merge equal numbers and build up to the target. Powers, doubling and tripling in disguise!',skills:['powers of 2 and 3','doubling','multiplication facts','planning ahead'],
 levels:['3×3 → 32','3×3 → 64','4×4 → 128','4×4 → 256','4×4 → 512','4×4 → 1024','Tripling → 81','5×5 tripling → 243','Powers view → 512','4×4 → 2048','5×5 tripling · powers → 729','Boss: 5×5 powers → 2048'],
 how:'Swipe (or use the arrow keys / buttons) to slide all tiles. Two equal tiles that bump together merge into one bigger tile. Reach the target tile to win!',
 art:'<div class="minibal">🔮</div>',
 mount(root,lv,ctx){
  const s=LV[lv-1],n=s.n,base=s.b;
  let g,score,over,won;
  const fmtv=v=>{if(!v)return'';if(s.pw){let e=0,x=v;while(x>1){x/=base;e++}return `${base}<sup>${e}</sup>`;}return v;};
  function addTile(){const e=[];g.forEach((r,i)=>r.forEach((v,j)=>{if(!v)e.push([i,j])}));if(!e.length)return;const[p,q]=pick(e);g[p][q]=Math.random()<.85?base:base*base;}
  function init(){g=Array.from({length:n},()=>Array(n).fill(0));score=0;over=false;won=false;addTile();addTile();draw();}
  function slideRow(row){
    const v=row.filter(x=>x),out=[];
    for(let i=0;i<v.length;i++){
      if(base===2||true){
        // merge `base` equal adjacent tiles into one tile worth base× (for base 2 that's the classic rule)
        let k=1;while(k<base&&i+k<v.length&&v[i+k]===v[i])k++;
        if(k===base){out.push(v[i]*base);score+=v[i]*base;i+=base-1;continue;}
      }
      out.push(v[i]);
    }
    while(out.length<n)out.push(0);return out;
  }
  function move(d){
    if(over)return false;
    const old=JSON.stringify(g);
    const rows=[];
    for(let i=0;i<n;i++){
      let line=[];
      for(let j=0;j<n;j++){line.push(d==='L'?g[i][j]:d==='R'?g[i][n-1-j]:d==='U'?g[j][i]:g[n-1-j][i]);}
      line=slideRow(line);
      for(let j=0;j<n;j++){if(d==='L')g[i][j]=line[j];else if(d==='R')g[i][n-1-j]=line[j];else if(d==='U')g[j][i]=line[j];else g[n-1-j][i]=line[j];}
    }
    if(JSON.stringify(g)===old)return false;
    addTile();draw();check();return true;
  }
  function can(){for(let i=0;i<n;i++)for(let j=0;j<n;j++){if(!g[i][j])return true;
      if(base===2){if(j+1<n&&g[i][j]===g[i][j+1])return true;if(i+1<n&&g[i][j]===g[i+1][j])return true;}
      else{for(let k=1;k<base;k++){if(j+k>=n||g[i][j+k]!==g[i][j])break;if(k===base-1)return true;}
        for(let k=1;k<base;k++){if(i+k>=n||g[i+k][j]!==g[i][j])break;if(k===base-1)return true;}}}return false;}
  function check(){
    const mx=Math.max(...g.flat());
    if(!won&&mx>=s.t){won=true;over=true;ctx.win('You made '+s.t+'!',`Target tile reached with a score of ${score}.`,init,'Play again');return;}
    if(!can()){over=true;draw();toast('No moves left — try again!');}
  }
  const col=v=>{const e=Math.round(Math.log(v)/Math.log(base));return`pw${Math.min(e,11)}`;};
  function draw(){
    root.innerHTML=`<div class="pm"><div class="pm-top"><div>Target <b>${s.t}</b></div><div>Score <b>${score}</b></div><button class="btn alt" id="pm-r">↺ Restart</button></div>
     <div class="pm-g" id="pm-g" style="grid-template-columns:repeat(${n},1fr)">${g.flat().map(v=>`<div class="pm-t ${v?col(v):'e'}">${fmtv(v)}</div>`).join('')}</div>
     ${base>2?`<div class="msg">Merge <b>${base}</b> equal tiles in a row to make one tile worth ${base}× more.</div>`:'<div class="msg">&nbsp;</div>'}
     <div class="pm-pad"><span></span><button class="key" data-d="U">▲</button><span></span><button class="key" data-d="L">◀</button><button class="key" data-d="D">▼</button><button class="key" data-d="R">▶</button></div></div>`;
    $('#pm-r').onclick=init;
    root.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>move(b.dataset.d));
    const gr=$('#pm-g');let sx,sy;
    gr.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
    gr.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;
      if(Math.abs(dx)>Math.abs(dy))move(dx>0?'R':'L');else move(dy>0?'D':'U');});
  }
  ctx.keys=e=>{const m={ArrowLeft:'L',ArrowRight:'R',ArrowUp:'U',ArrowDown:'D'}[e.key];if(m){e.preventDefault();move(m);}};
  init();
  root.__auto=()=>{ // test helper: random-ish play
    let t=0;while(!over&&t++<20000){const ds=shuffle(['L','D','R','U']);let m=false;for(const d of ds){if(move(d)){m=true;break;}}if(!m)break;}return won;};
 }});
})();
