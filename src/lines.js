(function(){
const LV=[
 {m:[1,2,-1],c:0,fixC:true,n:1},{m:[2,3],c:0,fixC:true,n:2},{m:[-1,-2,3],c:0,fixC:true,n:2},
 {fixM:true,m:[1,-1,2],c:[-4,-3,-2,2,3,4],n:2},{fixM:true,m:[2,-2,3,-1],c:[-5,-3,3,5,1,-1],n:2},
 {m:[1,2,-1,-2],c:[-3,-2,-1,1,2,3],n:2},{m:[3,-3,2,-2,4],c:[-4,-2,1,3,4],n:2},
 {m:[.5,-.5,1.5,-1.5],c:[-3,-2,0,1,2,3],n:2,half:true},{m:[.5,-.5,1,-1,2],c:[-4,-2,0,2,4],n:3,half:true},
 {m:[1.5,-1.5,.5,-.5,2.5],c:[-4,-3,-1,1,3,4],n:3,half:true},{m:[0,0,0],c:[-4,-3,-2,2,3,4],n:2,flat:true},
 {m:[.5,-.5,1.5,-1.5,2,-2,3],c:[-5,-3,-1,1,3,5],n:3,half:true,boss:true}];
const W=6;
function gen(l){
  const s=LV[l-1];
  for(let t=0;t<300;t++){
    const m=pick(s.m),c=Array.isArray(s.c)?pick(s.c):s.c;
    const pts=[];
    for(let x=-W;x<=W;x++){const y=m*x+c;if(Math.abs(y)<=W&&Number.isInteger(y))pts.push([x,y]);}
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
const fmt=(m,c)=>{let t='y = ';if(m===0)return t+c;const ms=m===1?'':m===-1?'−':String(m).replace('-','−');t+=ms+'x';
  if(c>0)t+=' + '+c;else if(c<0)t+=' − '+(-c);return t;};
window.__ln={gen,fmt,LV};
REG.push({id:'lines',name:'Line Hunter',emoji:'📈',color:'#0c8599',cat:'Algebra',
 desc:'Tune the gradient m and the intercept c of y = mx + c so that the line passes through every ⭐.',skills:['y = mx + c','gradient','y-intercept','coordinates'],
 levels:['Gradient only (1 star)','Gradient only (2 stars)','Negative gradients','Intercept only','Intercept only · steeper','Both m and c','Both · steeper & negative','Fractional gradients','Three stars','Three stars · tricky','Horizontal lines','Boss line'],
 how:'Use the − and + buttons to change m (gradient = how steep) and c (where the line crosses the y-axis). Make the line pass through all the stars!',
 art:'<div class="minibal">📈</div>',
 mount(root,lv,ctx){
  let P,m,c,done;
  const S=34,O=7*S+10;
  function newQ(){P=gen(lv);const s=P.s;m=s.fixM?P.m:0;c=s.fixC?P.c:0;if(s.fixM)m=P.m;done=false;draw();}
  function ys(x){return m*x+c}
  function ok(){return P.st.every(p=>Math.abs(ys(p[0])-p[1])<1e-9);}
  function draw(msg){
    const s=P.s;let g='';
    for(let i=-W;i<=W;i++){const p=O+i*S;g+=`<line x1="${p}" y1="${O-W*S}" x2="${p}" y2="${O+W*S}" class="ln-g${i===0?' ax':''}"/><line x1="${O-W*S}" y1="${O-i*S}" x2="${O+W*S}" y2="${O-i*S}" class="ln-g${i===0?' ax':''}"/>`;
      if(i&&i%2===0)g+=`<text x="${p}" y="${O+13}" class="ln-t">${i}</text><text x="${O-4}" y="${O-i*S+4}" class="ln-t r">${i}</text>`;}
    const x1=-W,x2=W,y1=ys(x1),y2=ys(x2);
    g+=`<line x1="${O+x1*S}" y1="${O-y1*S}" x2="${O+x2*S}" y2="${O-y2*S}" class="ln-l${ok()?' ok':''}"/>`;
    P.st.forEach(p=>{const hit=Math.abs(ys(p[0])-p[1])<1e-9;g+=`<text x="${O+p[0]*S}" y="${O-p[1]*S+8}" class="ln-s${hit?' hit':''}" text-anchor="middle">⭐</text>`;});
    const sv=O*2;
    root.innerHTML=`<div class="ln"><div class="ln-eq">${fmt(m,c)}</div>
     <svg viewBox="0 0 ${sv} ${sv}" class="ln-svg">${g}</svg>
     <div class="ln-ctl"><div class="ln-c">m = <button class="key" data-a="m-" ${s.fixM?'disabled':''}>−</button><b>${String(m).replace('-','−')}</b><button class="key" data-a="m+" ${s.fixM?'disabled':''}>+</button></div>
      <div class="ln-c">c = <button class="key" data-a="c-" ${s.fixC?'disabled':''}>−</button><b>${String(c).replace('-','−')}</b><button class="key" data-a="c+" ${s.fixC?'disabled':''}>+</button></div></div>
     <div class="msg">${msg||'&nbsp;'}</div>
     <div class="toolrow"><button class="btn alt" id="lh">💡 Hint</button><button class="btn" id="ln-nw">New puzzle ⏭</button></div></div>`;
    root.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{
      const a=b.dataset.a,st=P.s.half?.5:1;
      if(a==='m-')m=Math.max(-6,m-st);if(a==='m+')m=Math.min(6,m+st);
      if(a==='c-')c=Math.max(-8,c-1);if(a==='c+')c=Math.min(8,c+1);
      if(ok()){done=true;draw();ctx.win('Line found!',`${fmt(m,c)} goes through every star. m is the gradient, c is where it crosses the y-axis.`,newQ,'New puzzle');}else draw();});
    $('#ln-nw').onclick=newQ;
    $('#lh').onclick=()=>{
      const p=P.st[0];let t;
      if(P.s.fixM)t=`Gradient is fixed at ${m}. Star (${p[0]}, ${p[1]}) means y = ${p[1]} when x = ${p[0]}. Which c makes ${m}×${p[0]} + c = ${p[1]}?`;
      else if(P.s.fixC)t=`The line passes through the origin (c = 0). From (0,0) to the star (${p[0]}, ${p[1]}): gradient = up ÷ across = ${p[1]} ÷ ${p[0]}.`;
      else if(P.st.length>1){const q=P.st[1];t=`Gradient = change in y ÷ change in x between two stars: (${q[1]} − ${p[1]}) ÷ (${q[0]} − ${p[0]}). Then c is where the line hits x = 0.`;}
      else t='Gradient = up ÷ across.';
      draw('💡 '+t);};
  }
  newQ();
  // test hook
  root.__solve=()=>{m=P.m;c=P.c;if(ok()){draw();ctx.win('Line found!','done',newQ,'New puzzle');}};
 }});
})();
