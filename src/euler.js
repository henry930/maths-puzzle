(function(){
const circ=(n,r=38,off=-Math.PI/2)=>Array.from({length:n},(_,i)=>[50+r*Math.cos(off+i/n*2*Math.PI),50+r*Math.sin(off+i/n*2*Math.PI)]);
const FIXED={
 1:{V:[[20,85],[80,85],[80,50],[20,50],[50,15]],E:[[0,1],[1,2],[2,3],[3,0],[0,2],[1,3],[3,4],[4,2]]},
 2:{V:circ(5),E:[[0,2],[2,4],[4,1],[1,3],[3,0]]},
 3:{V:circ(5),E:[[0,1],[1,2],[2,3],[3,4],[4,0],[0,2],[2,4],[4,1],[1,3],[3,0]]},
 9:{V:[[50,50],[50,12],[50,88],[88,50]],E:[[1,0],[1,0],[2,0],[2,0],[0,3],[1,3],[2,3]],king:true}
};
const PAR={4:[5,8],5:[6,9],6:[6,11],7:[7,11],8:[8,13],10:[7,11],11:[8,13],12:[9,15]};
function degs(G){const d=Array(G.V.length).fill(0);G.E.forEach(([a,b])=>{d[a]++;d[b]++});return d;}
function genG(n,e,feasible){
  for(;;){
    const V=circ(n,38,-Math.PI/2+R(-20,20)/100).map(([x,y])=>[x+R(-3,3),y+R(-3,3)]);
    const set=new Set(),E=[];
    const add=(a,b)=>{const k=a<b?a+'-'+b:b+'-'+a;if(a===b||set.has(k))return;set.add(k);E.push([a,b]);};
    for(let i=0;i<n;i++)add(i,(i+1)%n);
    let guard=0;while(E.length<e&&guard++<200)add(R(0,n-1),R(0,n-1));
    const odd=degs({V,E}).filter(d=>d%2).length;
    if(feasible?(odd===0||odd===2):odd>=4)return{V,E};
  }
}
window.__eu={genG,degs,FIXED};
REG.push({id:'euler',name:'One-Stroke Drawing',emoji:'✏️',color:'#d9480f',cat:'Logic',
 desc:'Draw the whole picture without lifting your pen or going over a line twice. Discover the secret rule of odd and even points!',skills:['graph theory','odd & even','proof by counting'],
 levels:['The envelope','The star','The pentagon star','Easy network','Network','Bigger network','Large network','Giant network','Königsberg bridges: possible?','Possible or not? (7 points)','Possible or not? (8 points)','Possible or not? (9 points)'],
 how:'Tap a dot to start, then tap the next dot to trace a line. Every line must be drawn exactly once. Tip: look at how many lines meet at each dot! In the last levels, first decide: is it possible?',
 art:'<svg viewBox="0 0 100 100" width="110" height="110" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"><path d="M20 85H80V50H20ZM20 85L80 50M80 85L20 50M20 50L50 15L80 50"/></svg>',
 mount(root,lv,ctx){
  let G,feasible,phase,cur,used,path,showDeg=false,over=false;
  const question=lv>=9;
  function build(){
    if(FIXED[lv])G=FIXED[lv];else{const[n,e]=PAR[lv];G=genG(n,e,question?Math.random()<.5:true);}
    const odd=degs(G).filter(d=>d%2).length;feasible=odd===0||odd===2;
    used=Array(G.E.length).fill(false);path=[];cur=null;over=false;showDeg=false;
    phase=question?'ask':'draw';draw();
  }
  const degs=G=>window.__eu.degs(G);
  function edgePath(i){
    const[a,b]=G.E[i],[x1,y1]=G.V[a],[x2,y2]=G.V[b];
    const sibs=G.E.map((e,k)=>[e,k]).filter(([e])=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a)).map(x=>x[1]);
    if(sibs.length===1)return`M${x1} ${y1}L${x2} ${y2}`;
    const idx=sibs.indexOf(i),off=(idx-(sibs.length-1)/2)*18;
    const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1;
    return`M${x1} ${y1}Q${mx-dy/L*off} ${my+dx/L*off} ${x2} ${y2}`;
  }
  function draw(msg){
    const d=degs(G);
    let svg='<svg viewBox="0 0 100 100" class="eu-svg">';
    G.E.forEach((e,i)=>{svg+=`<path d="${edgePath(i)}" class="eu-e${used[i]?' used':''}"/>`;});
    G.E.forEach((e,i)=>{svg+=`<path d="${edgePath(i)}" class="eu-hit" data-e="${i}"/>`;});
    G.V.forEach(([x,y],i)=>{svg+=`<circle cx="${x}" cy="${y}" r="${cur===i?5.6:4.2}" class="eu-v${cur===i?' cur':''}${path.length===0&&cur===null?'':''}" data-v="${i}"/>`;
      if(showDeg)svg+=`<text x="${x}" y="${y+1.6}" class="eu-d ${d[i]%2?'odd':'even'}" text-anchor="middle">${d[i]}</text>`;});
    svg+='</svg>';
    const total=G.E.length,usedN=used.filter(Boolean).length;
    let ctl;
    if(phase==='ask')ctl='<div class="msg"><b>Can this picture be drawn in one stroke?</b></div><div class="toolrow"><button class="btn go" id="yes">Yes, it’s possible</button><button class="btn" id="no" style="background:#e5484d">No, impossible</button></div>';
    else ctl=`<div class="statrow"><span>Lines drawn: <b>${usedN}/${total}</b></span><span>${question?'Now draw it!':''}</span></div>`;
    root.innerHTML=`<div class="eu">${svg}${ctl}<div class="msg" id="me">${msg||'&nbsp;'}</div><div class="toolrow"><button class="btn alt" id="dg">${showDeg?'Hide':'Show'} line counts</button>${phase==='draw'?'<button class="btn alt" id="un">↶ Undo</button><button class="btn alt" id="rs">⟲ Restart</button>':''}<button class="btn alt" id="hn">💡 Hint</button><button class="btn" id="nw">New picture ⏭</button></div></div>`;
    root.querySelectorAll('.eu-v').forEach(c=>c.onclick=()=>tapV(+c.dataset.v));
    root.querySelectorAll('.eu-hit').forEach(c=>c.onclick=()=>tapE(+c.dataset.e));
    $('#dg').onclick=()=>{showDeg=!showDeg;draw(msg)};$('#nw').onclick=()=>{if(FIXED[lv]){used=used.map(()=>false);path=[];cur=null;over=false;phase=question?'ask':'draw';draw();}else build();};
    $('#hn').onclick=hint;
    if($('#un')){$('#un').onclick=undo;$('#rs').onclick=()=>{used=used.map(()=>false);path=[];cur=null;draw();};}
    if($('#yes')){$('#yes').onclick=()=>answer(true);$('#no').onclick=()=>answer(false);}
  }
  function hint(){
    const d=degs(G),odd=d.map((x,i)=>x%2?i:-1).filter(i=>i>=0);
    showDeg=true;
    draw(odd.length===0?'No odd points: you can start anywhere and you will finish where you started.':odd.length===2?`Exactly 2 odd points (shown in red). Start at one of them — you will finish at the other.`:`${odd.length} odd points (red). A one-stroke path can have only 0 or 2 odd points.`);
  }
  function answer(yes){
    if(yes===feasible){
      const d=degs(G),odd=d.filter(x=>x%2).length;showDeg=true;
      if(feasible){phase='draw';draw(`Correct! It has ${odd} odd point${odd===1?'':'s'}, so it can be done. Now prove it by drawing it!`);}
      else{over=true;draw(`Correct! It has ${odd} odd points. A one-stroke drawing needs 0 or 2 odd points, so this is impossible.`);ctx.win('Well reasoned!',`You spotted ${odd} odd points, so no one-stroke drawing exists. That’s a proof!`,FIXED[lv]?null:build);}
    }else{showDeg=true;draw(yes?'Hmm, check the line counts shown on each dot. How many odd ones are there?':'Look again at the line counts: how many dots have an odd number? Is it 0 or 2?');}
  }
  function tapV(v){
    if(phase!=='draw'||over)return;
    if(cur===null){cur=v;draw();return;}
    if(v===cur)return;
    const i=G.E.findIndex((e,k)=>!used[k]&&((e[0]===cur&&e[1]===v)||(e[1]===cur&&e[0]===v)));
    if(i<0){shake($('.eu-svg'));$('#me').textContent='There’s no unused line between those two dots.';return;}
    go(i,v);
  }
  function tapE(i){
    if(phase!=='draw'||over||cur===null||used[i])return;
    const[a,b]=G.E[i];if(a!==cur&&b!==cur)return;go(i,a===cur?b:a);
  }
  function go(i,v){
    used[i]=true;path.push({i,from:cur});cur=v;
    if(used.every(Boolean)){over=true;draw();ctx.win('One stroke!','You drew every line exactly once.',FIXED[lv]?null:build);return;}
    const stuck=!G.E.some((e,k)=>!used[k]&&(e[0]===cur||e[1]===cur));
    draw(stuck?'Stuck! No unused lines from here. Press Undo and try a different route.':'');
  }
  function undo(){if(over)return;if(path.length){const p=path.pop();used[p.i]=false;cur=p.from;}else cur=null;draw();}
  build();
 }});
})();
