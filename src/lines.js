(function(){
const LV=[
 {m:[1,2,-1],c:0,fixC:true,n:1},{m:[2,3],c:0,fixC:true,n:2},{m:[-1,-2,3],c:0,fixC:true,n:2},
 {fixM:true,m:[1,-1,2],c:[-4,-3,-2,2,3,4],n:2},{fixM:true,m:[2,-2,3,-1],c:[-5,-3,3,5,1,-1],n:2},
 {m:[1,2,-1,-2],c:[-3,-2,-1,1,2,3],n:2},{m:[3,-3,2,-2,4],c:[-4,-2,1,3,4],n:2},
 {m:[.5,-.5,1.5,-1.5],c:[-3,-2,0,1,2,3],n:2,half:true},{m:[.5,-.5,1,-1,2],c:[-4,-2,0,2,4],n:3,half:true},
 {m:[1.5,-1.5,.5,-.5,2.5],c:[-4,-3,-1,1,3,4],n:3,half:true},{m:[0,0,0],c:[-4,-3,-2,2,3,4],n:2,flat:true},
 {m:[.5,-.5,1.5,-1.5,2,-2,3],c:[-5,-3,-1,1,3,5],n:3,half:true,boss:true}];
const W=6;
const CR=[-5,-4,-3,-2,-1,1,2,3,4,5],CS=[-4,-3,-2,-1,0,1,2,3,4],CE=[-4,-3,-2,-1,1,2,3,4],CH=[-4,-2,0,2,4];
const HM=[.5,-.5,1.5,-1.5,2.5,-2.5];
// ---- GCSE extension (levels 13+): read the graph, parallel, perpendicular, rearranging equations ----
LV.push(
 {n:0,mode:'read',m:[1,-1],c:[0],dots:'pts',nm:'Read the graph · y = x and y = −x'},
 {n:0,mode:'read',m:[2,3,-2,-3,4],c:[0],dots:'pts',nm:'Read the graph · y = mx through the origin'},
 {n:0,mode:'read',m:[1],c:CR,dots:'int',nm:'Read the graph · y = x + c'},
 {n:0,mode:'read',m:[-1],c:CR,dots:'int',nm:'Read the graph · y = −x + c'},
 {n:0,mode:'read',m:[2,3,1,4],c:CE,dots:'int',nm:'Read the graph · positive gradients'},
 {n:0,mode:'read',m:[-2,-3,-1,-4],c:CE,dots:'int',nm:'Read the graph · negative gradients'},
 {n:0,mode:'read',m:HM,c:CH,dots:'pts',half:true,nm:'Read the graph · fractional gradients'},
 {n:0,mode:'read',m:[1,2,3,-1,-2,-3,.5,-.5,1.5,-1.5],c:CE,dots:0,half:true,nm:'Read the graph · no hints'},
 {n:0,mode:'read',m:[0],c:CE,dots:0,nm:'Read the graph · horizontal lines'},
 {n:0,mode:'read',m:[1,2,3,4,-1,-2,-3,-4,.5,-.5,1.5,-1.5,2.5,-2.5],c:CE.concat([-5,5]),dots:0,half:true,boss:true,nm:'Boss · read any line'},
 {n:1,mode:'par',fixM:true,m:[1,2,-1,-2],c:[-3,-2,-1,0,1,2,3],dc:[-4,-3,-2,2,3,4],nm:'Parallel lines · same gradient'},
 {n:1,mode:'par',fixM:true,m:[1,2,3,-1,-2,-3],c:CE,tc:0,nm:'Parallel · through the origin'},
 {n:1,mode:'par',fixM:true,m:HM.concat([.5,-.5]),c:CH,dc:[-4,-2,2,4],half:true,nm:'Parallel · fractional gradients'},
 {n:1,mode:'par',fixM:true,m:[3,-3,4,-4],c:CS,dc:[-4,-3,-2,2,3,4],nm:'Parallel · steep lines'},
 {n:1,mode:'par',fixM:true,m:[1,2,3,-1,-2,-3,.5,-.5,1.5,-1.5],c:CS,dc:[-5,-4,-3,-2,2,3,4,5],half:true,boss:true,nm:'Boss · parallel lines'},
 {n:1,mode:'perp',m:[1,-1],c:CS,tc:CS,nm:'Perpendicular · gradient 1 and −1'},
 {n:1,mode:'perp',m:[2,-2,.5,-.5],c:CS,tc:CH,half:true,nm:'Perpendicular · gradient 2 and ½'},
 {n:1,mode:'perp',m:[1,-1,2,-2,.5,-.5],c:CS,tc:CS,half:true,nm:'Perpendicular · all the pairs'},
 {n:1,mode:'perp',m:[1,-1,2,-2,.5,-.5],c:CE,tc:CE,half:true,boss:true,nm:'Boss · perpendicular lines'},
 {n:0,mode:'eq',forms:['swap'],m:[1,2,3,-1,-2,-3],c:CE,nm:'Rearrange · y = c + mx'},
 {n:0,mode:'eq',forms:['ymc'],m:[1,2,3,-1,-2,-3],c:CE,nm:'Rearrange · y − c = mx'},
 {n:0,mode:'eq',forms:['move'],m:[1,2,3,-1,-2,-3],c:CE,nm:'Rearrange · y − mx = c'},
 {n:0,mode:'eq',forms:['xy'],m:[-1],c:[1,2,3,4,5,6,7,8],nm:'Rearrange · x + y = k'},
 {n:0,mode:'eq',forms:['xy'],m:[-2,-3,-4,-5],c:[1,2,3,4,5,6,7,8],nm:'Rearrange · ax + y = k'},
 {n:0,mode:'eq',forms:['swap','ymc','move','xy'],m:[1,2,3,-1,-2,-3,-4],c:CE,nm:'Rearrange · mixed simple forms'},
 {n:0,mode:'eq',forms:['2y'],m:[.5,-.5,1.5,-1.5,1,2,-1,-2],c:CE,half:true,nm:'Rearrange · 2y = …'},
 {n:0,mode:'eq',forms:['3y'],m:[1,2,3,-1,-2,-3],c:CE,nm:'Rearrange · 3y = …'},
 {n:0,mode:'eq',forms:['std2'],m:[-.5,-1,-1.5,-2,-2.5,-3,-3.5,-4],c:CE,half:true,nm:'Rearrange · ax + 2y = k'},
 {n:0,mode:'eq',forms:['half'],m:[.5,-.5,1.5,-1.5,2.5,-2.5],c:CE,half:true,nm:'Rearrange · y = x/2 + c'},
 {n:0,mode:'eq',forms:['swap','ymc','move','xy','2y','3y','std2','half'],m:[1,2,3,-1,-2,-3,-4,.5,-.5,1.5,-1.5],c:CE,half:true,boss:true,nm:'Boss · rearrange anything'},
 {m:[3,-3,4,-4,5,-5],c:[-4,-2,0,2,4],n:2,nm:'Two stars · steep lines'},
 {m:[.5,-.5,1.5,-1.5,2.5,-2.5],c:0,fixC:true,n:2,half:true,nm:'Fractional gradient · through the origin'},
 {m:[2,-2,3,-3],c:[-8,-7,-6,-5,5,6,7,8],fixM:true,n:1,nm:'Fixed gradient · big intercepts'},
 {m:[1,-1,2,-2,3,-3,.5,-.5,1.5,-1.5],c:CS,n:3,half:true,nm:'Three stars · all gradients'},
 {mix:true,boss:true,n:0,nm:'Final boss · any kind of line puzzle'}
);
const mxs=m=>m===1?'x':m===-1?'−x':String(m).replace('-','−')+'x';
const ab=Math.abs;
const EQ={
 swap:(m,c)=>Number.isInteger(m)&&m&&c?`y = ${String(c).replace('-','−')} ${m<0?'−':'+'} ${ab(m)===1?'':ab(m)}x`:null,
 ymc:(m,c)=>Number.isInteger(m)&&m&&c?`y ${c>0?'−':'+'} ${ab(c)} = ${mxs(m)}`:null,
 move:(m,c)=>Number.isInteger(m)&&m&&c?`y ${m<0?'+':'−'} ${ab(m)===1?'':ab(m)}x = ${String(c).replace('-','−')}`:null,
 xy:(m,c)=>Number.isInteger(m)&&m<0?`${m===-1?'':-m}x + y = ${c}`:null,
 '2y':(m,c)=>(2*m)%1===0&&c&&m?`2y = ${mxs(2*m)} ${c<0?'−':'+'} ${2*ab(c)}`:null,
 '3y':(m,c)=>Number.isInteger(m)&&m&&c?`3y = ${mxs(3*m)} ${c<0?'−':'+'} ${3*ab(c)}`:null,
 std2:(m,c)=>m<0&&(2*m)%1===0&&c?`${-2*m===1?'':-2*m}x + 2y = ${String(2*c).replace('-','−')}`:null,
 half:(m,c)=>{const k=2*m;return Number.isInteger(k)&&k%2!==0&&c?`y = ${k===1?'':k===-1?'−':String(k).replace('-','−')}x/2 ${c<0?'−':'+'} ${ab(c)}`:null;}
};
const lattice=(m,c)=>{const pts=[];for(let x=-W;x<=W;x++){const y=m*x+c;if(Math.abs(y)<=W&&Number.isInteger(y))pts.push([x,y]);}return pts;};
function genStar(s){
  for(let t=0;t<300;t++){
    const m=pick(s.m),c=Array.isArray(s.c)?pick(s.c):s.c;
    const pts=lattice(m,c);
    if(pts.length<s.n)continue;
    shuffle(pts);
    const st=[];
    for(const p of pts){if(st.every(q=>Math.abs(q[0]-p[0])>=2||s.n===1))st.push(p);if(st.length===s.n)break;}
    if(st.length<s.n)continue;
    // uniqueness when n>=2: line through the stars is the only straight line (always for distinct x); n=1 needs fixed c
    return{m,c,st,s};
  }
  return{m:1,c:0,st:[[1,1],[3,3]],s};
}
function gen(l){
  let s=LV[l-1];
  if(s.mix)s=pick(LV.slice(12).filter(x=>!x.mix));
  const md=s.mode||'star';
  if(md==='star')return genStar(s);
  for(let t=0;t<500;t++){
    if(md==='read'){
      const m=pick(s.m),c=pick(s.c),pts=lattice(m,c);if(pts.length<2)continue;
      let dots=[];if(s.dots==='int'&&Math.abs(c)<=W)dots=[[0,c]];else if(s.dots==='pts'){const q=pts.filter(p=>p[0]!==0);shuffle(q);if(q.length<2)continue;dots=q.slice(0,2);}
      return{m,c,st:[],s,mode:md,ghost:{m,c},dots};
    }
    if(md==='par'){
      const gm=pick(s.m),gc=pick(s.c),tc=s.tc!==undefined?s.tc:gc+pick(s.dc);
      if(Math.abs(tc)>W||tc===gc)continue;
      const pts=lattice(gm,tc).filter(p=>p[0]!==0);if(!pts.length)continue;
      return{m:gm,c:tc,st:[pick(pts)],s,mode:md,ghost:{m:gm,c:gc}};
    }
    if(md==='perp'){
      const rm=pick(s.m),gc=pick(s.c),tm=-1/rm,tc=pick(s.tc);
      if(!Number.isInteger(tm*2))continue;
      const pts=lattice(tm,tc).filter(p=>p[0]!==0);if(!pts.length)continue;
      return{m:tm,c:tc,st:[pick(pts)],s,mode:md,ghost:{m:rm,c:gc}};
    }
    if(md==='eq'){
      const f=pick(s.forms),m=pick(s.m),c=pick(s.c),e=EQ[f](m,c);if(!e)continue;
      return{m,c,st:[],s,mode:md,eq:e,form:f};
    }
  }
  return genStar(LV[0]);
}
const fmt=(m,c)=>{let t='y = ';if(m===0)return t+c;const ms=m===1?'':m===-1?'−':String(m).replace('-','−');t+=ms+'x';
  if(c>0)t+=' + '+c;else if(c<0)t+=' − '+(-c);return t;};
window.__ln={gen,fmt,LV,EQ};
REG.push({id:'lines',name:'Line Hunter',emoji:'📈',color:'#0c8599',cat:'Algebra',
 desc:'Tune the gradient m and the intercept c of y = mx + c so that the line passes through every ⭐.',skills:['y = mx + c','gradient','y-intercept','coordinates'],
 levels:['Gradient only (1 star)','Gradient only (2 stars)','Negative gradients','Intercept only','Intercept only · steeper','Both m and c','Both · steeper & negative','Fractional gradients','Three stars','Three stars · tricky','Horizontal lines','Boss line'].concat(LV.slice(12).map(x=>x.nm)),
 how:'Use the − and + buttons to change m (gradient = how steep) and c (where the line crosses the y-axis). Make the line pass through all the stars!',
 art:'<div class="minibal">📈</div>',
 mount(root,lv,ctx){
  let P,m,c,done;
  const S=34,O=7*S+10;
  const md=()=>P.s.mode||'star';
  const needsCheck=()=>md()==='read'||md()==='eq';
  function newQ(){P=gen(lv);ctx.q=tagLine(P);const s=P.s;m=s.fixM?P.m:0;c=s.fixC?P.c:0;done=false;draw();}
  function ys(x){return m*x+c}
  const starsHit=()=>P.st.every(p=>Math.abs(ys(p[0])-p[1])<1e-9);
  const exact=()=>Math.abs(m-P.m)<1e-9&&Math.abs(c-P.c)<1e-9;
  function ok(){
    if(needsCheck())return exact();
    return starsHit()&&(md()==='star'||Math.abs(m-P.m)<1e-9);
  }
  const mm=v=>String(v).replace('-','−');
  function caption(){
    if(md()==='read')return'Match the <b>dotted line</b>: type its equation by tuning m and c, then press Check.';
    if(md()==='par')return`Make a line <b>parallel</b> to <span class="ln-ref">${fmt(P.ghost.m,P.ghost.c)}</span> (dotted) that goes through the ⭐.`;
    if(md()==='perp')return`Make a line <b>perpendicular</b> to <span class="ln-ref">${fmt(P.ghost.m,P.ghost.c)}</span> (dotted) that goes through the ⭐.`;
    if(md()==='eq')return'Rearrange this into <b>y = mx + c</b>, then set m and c and press Check.';
    return'';
  }
  function draw(msg){
    const s=P.s;let g='';
    for(let i=-W;i<=W;i++){const p=O+i*S;g+=`<line x1="${p}" y1="${O-W*S}" x2="${p}" y2="${O+W*S}" class="ln-g${i===0?' ax':''}"/><line x1="${O-W*S}" y1="${O-i*S}" x2="${O+W*S}" y2="${O-i*S}" class="ln-g${i===0?' ax':''}"/>`;
      if(i&&i%2===0)g+=`<text x="${p}" y="${O+13}" class="ln-t">${i}</text><text x="${O-4}" y="${O-i*S+4}" class="ln-t r">${i}</text>`;}
    if(P.ghost){const gm=P.ghost.m,gc=P.ghost.c;g+=`<line x1="${O-W*S}" y1="${O-(gm*-W+gc)*S}" x2="${O+W*S}" y2="${O-(gm*W+gc)*S}" class="ln-gh"/>`;}
    (P.dots||[]).forEach(d=>{g+=`<circle cx="${O+d[0]*S}" cy="${O-d[1]*S}" r="5" class="ln-dot"/><text x="${O+d[0]*S+8}" y="${O-d[1]*S-8}" class="ln-dl">(${mm(d[0])}, ${mm(d[1])})</text>`;});
    const x1=-W,x2=W,y1=ys(x1),y2=ys(x2);
    g+=`<line x1="${O+x1*S}" y1="${O-y1*S}" x2="${O+x2*S}" y2="${O-y2*S}" class="ln-l${!needsCheck()&&ok()?' ok':''}"/>`;
    P.st.forEach(p=>{const hit=Math.abs(ys(p[0])-p[1])<1e-9;g+=`<text x="${O+p[0]*S}" y="${O-p[1]*S+8}" class="ln-s${hit?' hit':''}" text-anchor="middle">⭐</text>`;});
    const sv=O*2,cap=caption();
    root.innerHTML=`<div class="ln">${cap?`<div class="ln-cap">${cap}</div>`:''}${md()==='eq'?`<div class="ln-eq ln-given">${P.eq}</div>`:''}<div class="ln-eq">${fmt(m,c)}</div>
     <svg viewBox="0 0 ${sv} ${sv}" class="ln-svg">${g}</svg>
     <div class="ln-ctl"><div class="ln-c">m = <button class="key" data-a="m-" ${s.fixM?'disabled':''}>−</button><b>${mm(m)}</b><button class="key" data-a="m+" ${s.fixM?'disabled':''}>+</button></div>
      <div class="ln-c">c = <button class="key" data-a="c-" ${s.fixC?'disabled':''}>−</button><b>${mm(c)}</b><button class="key" data-a="c+" ${s.fixC?'disabled':''}>+</button></div></div>
     <div class="msg">${msg||'&nbsp;'}</div>
     <div class="toolrow">${needsCheck()?'<button class="btn go" id="ln-ck">Check ✓</button>':''}<button class="btn alt" id="lh">💡 Hint</button><button class="btn" id="ln-nw">New puzzle ⏭</button></div></div>`;
    root.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{
      const a=b.dataset.a,st=P.s.half?.5:1;
      if(a==='m-')m=Math.max(-6,m-st);if(a==='m+')m=Math.min(6,m+st);
      if(a==='c-')c=Math.max(-8,c-1);if(a==='c+')c=Math.min(8,c+1);
      if(!needsCheck()&&ok())win();else draw();});
    $('#ln-nw').onclick=newQ;
    if($('#ln-ck'))$('#ln-ck').onclick=check;
    $('#lh').onclick=()=>draw('💡 '+hint());
  }
  function win(){
    done=true;draw();
    const t=md()==='eq'?`${P.eq} rearranges to ${fmt(m,c)}. m = ${mm(m)} is the gradient and c = ${mm(c)} is the y-intercept.`
      :md()==='read'?`The dotted line is ${fmt(m,c)}: gradient m = ${mm(m)}, y-intercept c = ${mm(c)}.`
      :md()==='par'?`Parallel lines have the same gradient. ${fmt(m,c)} is parallel to ${fmt(P.ghost.m,P.ghost.c)} and goes through the star.`
      :md()==='perp'?`The gradients ${mm(P.ghost.m)} and ${mm(m)} multiply to −1, so the lines are perpendicular. ${fmt(m,c)} goes through the star.`
      :`${fmt(m,c)} goes through every star. m is the gradient, c is where it crosses the y-axis.`;
    ctx.win('Line found!',t,newQ,'New puzzle');
  }
  function check(){
    if(exact()){win();return;}
    const bad=[];if(Math.abs(m-P.m)>1e-9)bad.push('gradient');if(Math.abs(c-P.c)>1e-9)bad.push('intercept');
    ctx.log('wrong',{mode:md(),m,c,expectM:P.m,expectC:P.c,err:bad});
    draw(`❌ Not yet — the ${bad.join(' and ')} ${bad.length>1?'are':'is'} not right.`);
  }
  function hint(){
    const p=P.st[0];
    if(md()==='read')return P.dots&&P.dots.length===2?`Use the two marked points: gradient = up ÷ across = (${mm(P.dots[1][1])} − ${mm(P.dots[0][1])}) ÷ (${mm(P.dots[1][0])} − ${mm(P.dots[0][0])}). c is where the line crosses the y-axis.`:'Pick two points where the dotted line crosses grid corners. Gradient = up ÷ across. c is where it crosses the y-axis (x = 0).';
    if(md()==='par')return`Parallel lines have the same gradient, so m is ${mm(m)} already. Which c makes the line go through (${mm(p[0])}, ${mm(p[1])})? Solve ${mm(m)}×${mm(p[0])} + c = ${mm(p[1])}.`;
    if(md()==='perp')return`Perpendicular gradients multiply to −1: ${mm(P.ghost.m)} × m = −1, so m = −1 ÷ ${mm(P.ghost.m)}. Then choose c so the line goes through (${mm(p[0])}, ${mm(p[1])}).`;
    if(md()==='eq')return'Get y on its own on the left: do the same thing to both sides, then divide everything by the number in front of y. Read off the number in front of x (m) and the number on its own (c).';
    if(P.s.fixM)return`Gradient is fixed at ${mm(m)}. Star (${mm(p[0])}, ${mm(p[1])}) means y = ${mm(p[1])} when x = ${mm(p[0])}. Which c makes ${mm(m)}×${mm(p[0])} + c = ${mm(p[1])}?`;
    if(P.s.fixC)return`The line passes through the origin (c = 0). From (0,0) to the star (${mm(p[0])}, ${mm(p[1])}): gradient = up ÷ across = ${mm(p[1])} ÷ ${mm(p[0])}.`;
    if(P.st.length>1){const q=P.st[1];return`Gradient = change in y ÷ change in x between two stars: (${mm(q[1])} − ${mm(p[1])}) ÷ (${mm(q[0])} − ${mm(p[0])}). Then c is where the line hits x = 0.`;}
    return'Gradient = up ÷ across.';
  }
  newQ();
  // test hook
  root.__solve=()=>{m=P.m;c=P.c;if(needsCheck())check();else if(ok())win();};
 }});
})();
