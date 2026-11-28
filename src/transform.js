(function(){
const T={
 trans:(a,b)=>({t:`Translate the shape by the vector (${a}, ${b})`,sub:`${Math.abs(a)} ${a>=0?'right':'left'}, ${Math.abs(b)} ${b>=0?'up':'down'}`,f:p=>[p[0]+a,p[1]+b],hint:{arrow:[a,b]}}),
 rx:()=>({t:'Reflect the shape in the x-axis',f:p=>[p[0],-p[1]],hint:{mirror:['y',0]}}),
 ry:()=>({t:'Reflect the shape in the y-axis',f:p=>[-p[0],p[1]],hint:{mirror:['x',0]}}),
 rxk:k=>({t:`Reflect the shape in the line x = ${k}`,f:p=>[2*k-p[0],p[1]],hint:{mirror:['x',k]}}),
 ryk:k=>({t:`Reflect the shape in the line y = ${k}`,f:p=>[p[0],2*k-p[1]],hint:{mirror:['y',k]}}),
 ryx:()=>({t:'Reflect the shape in the line y = x',f:p=>[p[1],p[0]],hint:{diag:1}}),
 rymx:()=>({t:'Reflect the shape in the line y = −x',f:p=>[-p[1],-p[0]],hint:{diag:-1}}),
 rot90c:()=>({t:'Rotate the shape 90° clockwise about the origin (0, 0)',f:p=>[p[1],-p[0]],hint:{}}),
 rot90a:()=>({t:'Rotate the shape 90° anticlockwise about the origin (0, 0)',f:p=>[-p[1],p[0]],hint:{}}),
 rot180:()=>({t:'Rotate the shape 180° about the origin (0, 0)',f:p=>[-p[0],-p[1]],hint:{}}),
 enl:k=>({t:`Enlarge the shape by scale factor ${k}, centre the origin (0, 0)`,f:p=>[k*p[0],k*p[1]],hint:{rays:1}})
};
const LV=[
 {n:'Translations · positive vectors',g:()=>T.trans(R(1,4),R(1,4)),shape:3},
 {n:'Translations · negative vectors',g:()=>T.trans(R(-4,4)||2,R(-4,4)||-3),shape:3},
 {n:'Reflect in the x-axis',g:()=>T.rx(),shape:3},
 {n:'Reflect in the y-axis',g:()=>T.ry(),shape:3},
 {n:'Reflect in either axis',g:()=>pick([T.rx,T.ry])(),shape:3},
 {n:'Reflect in x = k or y = k',g:()=>pick([()=>T.rxk(R(-2,2)||1),()=>T.ryk(R(-2,2)||1)])(),shape:3},
 {n:'Reflect in y = x or y = −x',g:()=>pick([T.ryx,T.rymx])(),shape:3},
 {n:'Rotate 90° about the origin',g:()=>pick([T.rot90c,T.rot90a])(),shape:3},
 {n:'Rotate 90° or 180°',g:()=>pick([T.rot90c,T.rot90a,T.rot180])(),shape:4},
 {n:'Enlarge · scale factor 2',g:()=>T.enl(2),shape:3,small:true},
 {n:'Enlarge · scale factor 2 or 3',g:()=>T.enl(pick([2,3])),shape:4,small:true},
 {n:'Boss: any transformation',g:()=>pick([()=>T.trans(R(-4,4)||1,R(-4,4)||2),T.rx,T.ry,T.ryx,T.rymx,T.rot90c,T.rot90a,T.rot180,()=>T.rxk(R(-2,2)||1),()=>T.enl(2)])(),shape:4}
];
const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
function shapeFor(n,small){
  for(;;){
    const lim=small?2:4;let pts;
    if(n===3)pts=Array.from({length:3},()=>[R(-lim,lim),R(-lim,lim)]);
    else{const A=[R(-lim,lim-1),R(-lim,lim-1)],u=[R(1,2),0],v=[R(0,1),R(1,2)];pts=[A,[A[0]+u[0],A[1]],[A[0]+u[0]+v[0],A[1]+v[1]],[A[0]+v[0],A[1]+v[1]]];if(pts.some(p=>Math.abs(p[0])>6||Math.abs(p[1])>6))continue;}
    const area=n===3?Math.abs((pts[1][0]-pts[0][0])*(pts[2][1]-pts[0][1])-(pts[2][0]-pts[0][0])*(pts[1][1]-pts[0][1])):1;
    if(area<2&&n===3)continue;
    if(new Set(pts.map(String)).size<n)continue;
    return pts;
  }
}
window.__tf={LV,shapeFor,T};
REG.push({id:'transform',name:'Transform Quest',emoji:'🪞',color:'#087f5b',cat:'Geometry',
 desc:'Translate, reflect, rotate and enlarge shapes on a coordinate grid. Tap where each corner of the image lands!',skills:['transformations','coordinates','vectors','symmetry'],
 levels:LV.map(l=>l.n),
 how:'Read the instruction, then tap the grid points where the corners of the transformed shape (the image) should be. Tap a placed point again to remove it. Use 💡 for a visual clue.',
 art:'<svg viewBox="0 0 120 80" width="130" height="90"><path d="M15 60L45 60L30 20Z" fill="#fff" opacity=".9"/><path d="M105 60L75 60L90 20Z" fill="#fff" opacity=".5" stroke="#fff"/><path d="M60 8V76" stroke="#fff" stroke-width="3" stroke-dasharray="4 4"/></svg>',
 mount(root,lv,ctx){
  const L=LV[lv-1];let task,shape,img,placed,over,hintOn,wrong;
  function ok(pts){return pts.every(p=>Math.abs(p[0])<=6&&Math.abs(p[1])<=6);}
  function newTask(){
    for(;;){task=L.g();shape=shapeFor(L.shape,L.small);img=shape.map(task.f);if(ok(img)&&!shape.every((p,i)=>same(p,img[i])))break;}
    ctx.q=tagTransform(task,L.shape);placed=[];over=false;hintOn=false;wrong=false;draw();
  }
  const X=x=>x,Y=y=>-y;
  function poly(pts,cls){return`<polygon points="${pts.map(p=>p[0]+','+(-p[1])).join(' ')}" class="${cls}"/>`;}
  function draw(msg){
    let s='<svg viewBox="-7 -7 14 14" class="tf-svg" id="tfs">';
    for(let i=-6;i<=6;i++){s+=`<line x1="${i}" y1="-6.5" x2="${i}" y2="6.5" class="tf-g${i===0?' ax':''}"/><line x1="-6.5" y1="${i}" x2="6.5" y2="${i}" class="tf-g${i===0?' ax':''}"/>`;
      if(i!==0)s+=`<text x="${i}" y="0.75" class="tf-n" text-anchor="middle">${i}</text><text x="-0.2" y="${-i+0.2}" class="tf-n" text-anchor="end">${i}</text>`;}
    s+=poly(shape,'tf-orig');
    if(hintOn){const h=task.hint;
      if(h.mirror)s+=h.mirror[0]==='x'?`<line x1="${h.mirror[1]}" y1="-6.5" x2="${h.mirror[1]}" y2="6.5" class="tf-mir"/>`:`<line x1="-6.5" y1="${-h.mirror[1]}" x2="6.5" y2="${-h.mirror[1]}" class="tf-mir"/>`;
      if(h.diag)s+=`<line x1="-6.5" y1="${6.5*h.diag}" x2="6.5" y2="${-6.5*h.diag}" class="tf-mir"/>`;
      if(h.arrow)s+=shape.slice(0,1).map(p=>`<line x1="${p[0]}" y1="${-p[1]}" x2="${p[0]+h.arrow[0]}" y2="${-(p[1]+h.arrow[1])}" class="tf-arr"/>`).join('');
      if(h.rays)s+=shape.map(p=>`<line x1="0" y1="0" x2="${task.f(p)[0]}" y2="${-task.f(p)[1]}" class="tf-mir"/>`).join('');
      if(!h.mirror&&!h.diag&&!h.arrow&&!h.rays)s+=shape.map((p,i)=>`<line x1="${p[0]}" y1="${-p[1]}" x2="${img[i][0]}" y2="${-img[i][1]}" class="tf-mir" style="opacity:.35"/>`).join('')+`<circle cx="0" cy="0" r="0.22" class="tf-ctr"/>`;}
    if(over||wrong)s+=poly(img,'tf-ans');
    if(placed.length>=3&&!over&&!wrong)s+=poly(placed,'tf-mine');
    placed.forEach(p=>{s+=`<circle cx="${p[0]}" cy="${-p[1]}" r="0.3" class="tf-pt"/>`;});
    s+='</svg>';
    root.innerHTML=`<div class="tf"><div class="ch-q"><b>${task.t}</b>${task.sub?`<br><small>(${task.sub})</small>`:''}</div>${s}
      <div class="statrow"><span>Corners placed: <b>${placed.length}/${shape.length}</b></span><span>Original: ${shape.map(p=>`(${p[0]}, ${p[1]})`).join(' ')}</span></div>
      <div class="msg">${msg||'&nbsp;'}</div>
      <div class="toolrow"><button class="btn alt" id="un">↶ Undo</button><button class="btn alt" id="hn">💡 Hint</button><button class="btn" id="nw">New task ⏭</button></div></div>`;
    $('#tfs').onclick=tap;$('#un').onclick=()=>{if(over)return;wrong=false;placed.pop();draw();};
    $('#hn').onclick=()=>{hintOn=!hintOn;draw(hintOn?'Clue shown: use it to find where each corner goes.':'');};$('#nw').onclick=newTask;
  }
  function tap(e){
    if(over||wrong)return;const r=e.currentTarget.getBoundingClientRect();
    const x=Math.round((e.clientX-r.left)/r.width*14-7),y=Math.round(7-(e.clientY-r.top)/r.height*14);
    if(Math.abs(x)>6||Math.abs(y)>6)return;
    const i=placed.findIndex(p=>same(p,[x,y]));
    if(i>=0)placed.splice(i,1);else if(placed.length<shape.length)placed.push([x,y]);
    if(placed.length===shape.length){
      const a=placed.map(String).sort().join('|'),b=img.map(String).sort().join('|');
      if(a===b){over=true;draw('✅ Perfect!');ctx.win('Transformation complete!','Every corner is in exactly the right place.',newTask,'Another task');return;}
      wrong=true;ctx.log('wrong',{placed:placed.map(p=>p.slice()),expect:img});draw(`❌ Not quite. The orange outline shows the correct image: ${img.map(p=>`(${p[0]}, ${p[1]})`).join(' ')}. Press Undo to try again.`);return;
    }
    draw();
  }
  ctx.keys=null;newTask();
 }});
})();
