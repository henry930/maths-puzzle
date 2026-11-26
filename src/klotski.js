(function(){
const LAYOUTS=[["CCJA", "FE.A", "BH##", "BG##", "IK.D"], ["B.GE", "BKFI", "##HA", "##.A", "JDCC"], ["HDJ.", "BIGF", "B##.", "K##A", "ECCA"], ["G##I", "A##L", "AKD.", "JCDB", "HC.B"], ["..##", "FI##", "DDAJ", "BEAG", "BHCC"], [".I##", "EJ##", "GHDF", "CCAB", ".KAB"], ["##BE", "##B.", "IDDH", "AC.F", "ACGJ"], ["##.G", "##DB", "FADB", "HAC.", "EECI"], ["##G.", "##BH", "I.BF", "ACDD", "ACEE"], [".##A", "B##A", "BCEE", "HCGF", "DDI."], ["A##B", "A##B", "DEEF", "DGHF", "I..J"], ["BFH.", "BA##", "GA##", "ICDD", ".CEE"]];
const PARS=[12, 20, 28, 36, 46, 58, 70, 84, 98, 110, 116, 130];
const NAMES=['張飛','趙雲','馬超','黃忠','關羽'];
function parse(rows){
  const m={};rows.forEach((row,r)=>[...row].forEach((ch,c)=>{if(ch!=='.'){(m[ch]=m[ch]||[]).push([r,c])}}));
  const ps=[];let vi=0,hi=0;
  Object.keys(m).forEach(ch=>{
    const cs=m[ch],r0=Math.min(...cs.map(x=>x[0])),c0=Math.min(...cs.map(x=>x[1])),h=Math.max(...cs.map(x=>x[0]))-r0+1,w=Math.max(...cs.map(x=>x[1]))-c0+1;
    let label,cls;
    if(h===2&&w===2){label='曹操';cls='cao';}
    else if(h*w===2){label=w===2?(hi++===0?'關羽':NAMES[(vi++)%4]):NAMES[(vi++)%4];cls='gen';}
    else{label='兵';cls='sol';}
    ps.push({id:ch,r:r0,c:c0,h,w,label,cls});
  });
  return ps;
}
function minSteps(ps){
  const norm=a=>a.map(p=>Array.isArray(p)?p:[p.h,p.w,p.r,p.c]).sort((x,y)=>x[0]-y[0]||x[1]-y[1]||x[2]-y[2]||x[3]-y[3]);
  const key=a=>a.map(p=>p.join(',')).join(';');
  const s0=norm(ps),seen=new Map([[key(s0),0]]);let fr=[s0];
  while(fr.length){const nx=[];
    for(const st of fr){const d=seen.get(key(st));
      if(st.some(p=>p[0]===2&&p[1]===2&&p[2]===3&&p[3]===1))return d;
      const occ=new Set();st.forEach(([h,w,r,c])=>{for(let i=0;i<h;i++)for(let j=0;j<w;j++)occ.add((r+i)*4+c+j)});
      st.forEach((p,idx)=>{const[h,w,r,c]=p;
        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>{
          const nr=r+dr,nc=c+dc;if(nr<0||nc<0||nr+h>5||nc+w>4)return;
          let ok=true;for(let i=0;i<h&&ok;i++)for(let j=0;j<w;j++){const cell=(nr+i)*4+nc+j;const inOld=(nr+i>=r&&nr+i<r+h&&nc+j>=c&&nc+j<c+w);if(occ.has(cell)&&!inOld){ok=false;break}}
          if(!ok)return;const ns=st.map(q=>q.slice());ns[idx]=[h,w,nr,nc];const n2=norm(ns),k=key(n2);
          if(!seen.has(k)){seen.set(k,d+1);nx.push(n2);}
        });});
    }fr=nx;}
  return null;
}
window.__kl={LAYOUTS,parse,minSteps};
REG.push({id:'klotski',name:'Cao Cao Escape (華容道)',emoji:'🏯',color:'#e5484d',
 desc:'The ancient Chinese sliding-block puzzle. Slide the blocks to let the big red Cao Cao block reach the exit!',skills:['planning ahead','spatial reasoning','efficiency'],
 cat:'Logic',levels:PARS.map((p,i)=>(i===10?'Classic 橫刀立馬 · ':'')+'best possible '+p+' steps'),
 how:'Drag a block (or tap it, then use the arrow keys) to slide it into an empty space. Get the big 曹操 block to the EXIT at the bottom. Fewer steps = better!',
 art:'<div class="minikl"><i></i><b>曹操</b><i></i></div>',
 mount(root,lv,ctx){
  const ps0=parse(LAYOUTS[lv-1]);let ps,sel=null,steps,hist,over,cs;
  const par=minSteps(ps0);
  cs=Math.floor(Math.min(92,(Math.min(innerWidth,460)-32)/4));
  root.innerHTML=`<div class="kl"><div class="statrow"><span>Steps: <b id="ks">0</b></span><span>Best possible: <b>${par}</b></span></div>
   <div class="kl-wrap"><div class="kl-board" id="kb" style="width:${cs*4}px;height:${cs*5}px"></div><div class="kl-exit" style="width:${cs*2}px;margin-left:${cs}px">EXIT ⬇</div></div>
   <div class="msg" id="mk">Drag blocks. Tip: free up space next to Cao Cao first.</div>
   <div class="toolrow"><button class="btn alt" id="ku">↶ Undo</button><button class="btn alt" id="kr">⟲ Restart</button></div></div>`;
  const B=$('#kb');
  function reset(){ps=ps0.map(p=>({...p}));steps=0;hist=[];over=false;sel=null;build();}
  function build(){
    B.innerHTML='';
    ps.forEach(p=>{const d=el('div','kl-piece');d.dataset.id=p.id;const i=el('div','kl-p '+p.cls,`<span>${p.label}</span>`);d.appendChild(i);p.el=d;place(p);B.appendChild(d);
      let sx,sy,drag=false;
      d.addEventListener('pointerdown',e=>{if(over)return;d.setPointerCapture(e.pointerId);sx=e.clientX;sy=e.clientY;drag=true;select(p);});
      d.addEventListener('pointermove',e=>{if(!drag||over)return;const dx=e.clientX-sx,dy=e.clientY-sy,t=cs*.5;
        if(Math.abs(dx)<t&&Math.abs(dy)<t)return;
        const dir=Math.abs(dx)>Math.abs(dy)?[0,Math.sign(dx)]:[Math.sign(dy),0];
        if(move(p,dir[0],dir[1])){sx+=dir[1]*cs;sy+=dir[0]*cs;}else{sx=e.clientX;sy=e.clientY;}});
      const end=()=>{drag=false};d.addEventListener('pointerup',end);d.addEventListener('pointercancel',end);
    });
    select(sel);$('#ks').textContent=steps;
  }
  function place(p){p.el.style.cssText=`left:${p.c*cs}px;top:${p.r*cs}px;width:${p.w*cs}px;height:${p.h*cs}px`;}
  function select(p){sel=p;ps.forEach(q=>q.el&&q.el.classList.toggle('sel',q===p));}
  function move(p,dr,dc){
    const nr=p.r+dr,nc=p.c+dc;if(nr<0||nc<0||nr+p.h>5||nc+p.w>4)return false;
    for(const q of ps){if(q===p)continue;
      if(nr<q.r+q.h&&nr+p.h>q.r&&nc<q.c+q.w&&nc+p.w>q.c)return false;}
    hist.push(ps.map(q=>[q.r,q.c]));p.r=nr;p.c=nc;steps++;place(p);$('#ks').textContent=steps;
    const cao=ps.find(q=>q.cls==='cao');
    if(cao.r===3&&cao.c===1){over=true;cao.el.style.top=(cao.r+1.6)*cs+'px';cao.el.style.opacity='.0';
      setTimeout(()=>ctx.win('Cao Cao escaped! 🏯',`${steps} steps`+(steps<=par?' — perfect!':` (best possible: ${par}). Try to beat it!`),reset,'Play again'),500);}
    return true;
  }
  $('#ku').onclick=()=>{if(over||!hist.length)return;const h=hist.pop();ps.forEach((q,i)=>{q.r=h[i][0];q.c=h[i][1];place(q)});steps=Math.max(0,steps-1);$('#ks').textContent=steps;};
  $('#kr').onclick=reset;
  ctx.keys=e=>{const m={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]}[e.key];if(m&&sel&&!over){e.preventDefault();move(sel,m[0],m[1]);}};
  reset();
 }});
})();
