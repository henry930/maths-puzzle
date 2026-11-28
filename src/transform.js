(function(){
const fr=k=>k===.5?'½':k===-.5?'−½':String(k).replace('-','−');
const orig=c=>c[0]===0&&c[1]===0;
const cs=c=>`(${c[0]}, ${c[1]})`;
const ROT=(p,c,dir,ang)=>{const v=[p[0]-c[0],p[1]-c[1]];let r;
  if(ang===180)r=[-v[0],-v[1]];else if(ang===90)r=dir==='c'?[v[1],-v[0]]:[-v[1],v[0]];else r=dir==='c'?[-v[1],v[0]]:[v[1],-v[0]];
  return[r[0]+c[0],r[1]+c[1]];};
const nz=(a,b)=>{let x;do{x=R(a,b);}while(!x);return x;};
const cen=()=>{let c;do{c=[R(-3,3),R(-3,3)];}while(orig(c));return c;};
const T={
 trans:(a,b)=>({kind:'trans',par:[a,b],t:`Translate the shape by the vector (${a}, ${b})`,sub:`${Math.abs(a)} ${a>=0?'right':'left'}, ${Math.abs(b)} ${b>=0?'up':'down'}`,p:`translate by the vector (${a}, ${b})`,d:`Translation by the vector (${a}, ${b})`,f:p=>[p[0]+a,p[1]+b],finv:p=>[p[0]-a,p[1]-b],hint:{arrow:[a,b]},tags:['tf-translation'].concat(a<0||b<0?['tf-neg-vector']:[])}),
 rx:()=>({kind:'ref',par:['rx'],t:'Reflect the shape in the x-axis',p:'reflect in the x-axis',d:'Reflection in the x-axis',f:p=>[p[0],-p[1]],finv:p=>[p[0],-p[1]],hint:{mirror:['y',0]},tags:['tf-reflection','tf-reflect-axis']}),
 ry:()=>({kind:'ref',par:['ry'],t:'Reflect the shape in the y-axis',p:'reflect in the y-axis',d:'Reflection in the y-axis',f:p=>[-p[0],p[1]],finv:p=>[-p[0],p[1]],hint:{mirror:['x',0]},tags:['tf-reflection','tf-reflect-axis']}),
 rxk:k=>({kind:'ref',par:['rxk',k],t:`Reflect the shape in the line x = ${k}`,p:`reflect in the line x = ${k}`,d:`Reflection in the line x = ${k}`,f:p=>[2*k-p[0],p[1]],finv:p=>[2*k-p[0],p[1]],hint:{mirror:['x',k]},tags:['tf-reflection','tf-reflect-line']}),
 ryk:k=>({kind:'ref',par:['ryk',k],t:`Reflect the shape in the line y = ${k}`,p:`reflect in the line y = ${k}`,d:`Reflection in the line y = ${k}`,f:p=>[p[0],2*k-p[1]],finv:p=>[p[0],2*k-p[1]],hint:{mirror:['y',k]},tags:['tf-reflection','tf-reflect-line']}),
 ryx:()=>({kind:'ref',par:['ryx'],t:'Reflect the shape in the line y = x',p:'reflect in the line y = x',d:'Reflection in the line y = x',f:p=>[p[1],p[0]],finv:p=>[p[1],p[0]],hint:{diag:1},tags:['tf-reflection','tf-reflect-diagonal']}),
 rymx:()=>({kind:'ref',par:['rymx'],t:'Reflect the shape in the line y = −x',p:'reflect in the line y = −x',d:'Reflection in the line y = −x',f:p=>[-p[1],-p[0]],finv:p=>[-p[1],-p[0]],hint:{diag:-1},tags:['tf-reflection','tf-reflect-diagonal']}),
 rot:(ang,dir,c)=>{c=c||[0,0];const o=orig(c),dn=dir==='c'?'clockwise':'anticlockwise',at=o?'the origin (0, 0)':`the point ${cs(c)}`;const od=dir==='c'?'a':'c';
   return{kind:'rot',par:[ang,dir,c],t:`Rotate the shape ${ang}° ${dn} about ${at}`,p:`rotate ${ang}° ${dn} about ${at}`,d:`Rotation ${ang}° ${dn} about ${at}`,f:p=>ROT(p,c,dir,ang),finv:p=>ROT(p,c,ang===180?dir:od,ang),hint:{ctr:c},
     tags:['tf-rotation','tf-rot-'+ang,dir==='c'?'tf-clockwise':'tf-anticlockwise'].concat(o?[]:['tf-rot-centre'])};},
 enl:(k,c)=>{c=c||[0,0];const o=orig(c);
   return{kind:'enl',par:[k,c],t:`Enlarge the shape by scale factor ${fr(k)}, centre ${o?'the origin (0, 0)':cs(c)}`,p:`enlarge by scale factor ${fr(k)}, centre ${o?'the origin (0, 0)':cs(c)}`,d:`Enlargement, scale factor ${fr(k)}, centre ${o?'the origin (0, 0)':cs(c)}`,f:p=>[c[0]+k*(p[0]-c[0]),c[1]+k*(p[1]-c[1])],finv:p=>[c[0]+(p[0]-c[0])/k,c[1]+(p[1]-c[1])/k],hint:{rays:1,c},
     tags:['tf-enlargement',k===2?'tf-sf-2':k===3?'tf-sf-3':Math.abs(k)===.5?'tf-sf-half':'tf-sf-'+Math.abs(k)].concat(k<0?['tf-sf-neg']:[]).concat(o?[]:['tf-enl-centre'])};},
 then:(a,b)=>({kind:'combo',par:[a,b],t:`${a.p[0].toUpperCase()+a.p.slice(1)}, then ${b.p}`,p:`${a.p}, then ${b.p}`,d:`${a.d}, then ${b.p}`,f:p=>b.f(a.f(p)),finv:p=>a.finv(b.finv(p)),hint:{mid:a},tags:[...new Set([...a.tags,...b.tags,'tf-combined'])]})
};
const cap=s=>s[0].toUpperCase()+s.slice(1);
const ANY=()=>pick([()=>T.trans(nz(-4,4),nz(-4,4)),T.rx,T.ry,T.ryx,T.rymx,()=>T.rot(90,'c'),()=>T.rot(90,'a'),()=>T.rot(180,'c'),()=>T.rxk(nz(-2,2)),()=>T.enl(2)])();
const REFL=()=>pick([T.rx,T.ry,T.ryx,T.rymx,()=>T.rxk(nz(-3,3)),()=>T.ryk(nz(-3,3))])();
const ROTC=(angs,dirs,c)=>()=>T.rot(pick(angs),pick(dirs),c());
const ENLC=(ks,c)=>()=>T.enl(pick(ks),c());
const LV=[
 {n:'Translations · positive vectors',g:()=>T.trans(R(1,4),R(1,4)),shape:3},
 {n:'Translations · negative vectors',g:()=>T.trans(R(-4,4)||2,R(-4,4)||-3),shape:3},
 {n:'Reflect in the x-axis',g:()=>T.rx(),shape:3},
 {n:'Reflect in the y-axis',g:()=>T.ry(),shape:3},
 {n:'Reflect in either axis',g:()=>pick([T.rx,T.ry])(),shape:3},
 {n:'Reflect in x = k or y = k',g:()=>pick([()=>T.rxk(R(-2,2)||1),()=>T.ryk(R(-2,2)||1)])(),shape:3},
 {n:'Reflect in y = x or y = −x',g:()=>pick([T.ryx,T.rymx])(),shape:3},
 {n:'Rotate 90° about the origin',g:()=>pick([()=>T.rot(90,'c'),()=>T.rot(90,'a')])(),shape:3},
 {n:'Rotate 90° or 180°',g:()=>pick([()=>T.rot(90,'c'),()=>T.rot(90,'a'),()=>T.rot(180,'c')])(),shape:4},
 {n:'Enlarge · scale factor 2',g:()=>T.enl(2),shape:3,small:true},
 {n:'Enlarge · scale factor 2 or 3',g:()=>T.enl(pick([2,3])),shape:4,small:true},
 {n:'Boss: any transformation',g:()=>pick([()=>T.trans(R(-4,4)||1,R(-4,4)||2),T.rx,T.ry,T.ryx,T.rymx,()=>T.rot(90,'c'),()=>T.rot(90,'a'),()=>T.rot(180,'c'),()=>T.rxk(R(-2,2)||1),()=>T.enl(2)])(),shape:4},
 // ---- GCSE extension (levels 13+) ----
 {n:'Translations · bigger vectors',g:()=>T.trans(nz(-6,6),nz(-6,6)),shape:4},
 {n:'Reflect in x = k',g:()=>T.rxk(nz(-4,4)),shape:3},
 {n:'Reflect in y = k',g:()=>T.ryk(nz(-4,4)),shape:3},
 {n:'Reflect in any horizontal or vertical line',g:()=>pick([()=>T.rxk(nz(-4,4)),()=>T.ryk(nz(-4,4)),T.rx,T.ry])(),shape:4},
 {n:'Reflect · all mirror lines',g:REFL,shape:4},
 {n:'Rotate 90° clockwise about a point',g:ROTC([90],['c'],cen),shape:3},
 {n:'Rotate 90° anticlockwise about a point',g:ROTC([90],['a'],cen),shape:3},
 {n:'Rotate 180° about a point',g:ROTC([180],['c'],cen),shape:3},
 {n:'Rotate about any point',g:ROTC([90,180],['c','a'],cen),shape:4},
 {n:'Rotate 270° about the origin',g:ROTC([270],['c','a'],()=>[0,0]),shape:3},
 {n:'Rotate 90°, 180° or 270° about any point',g:ROTC([90,180,270],['c','a'],()=>pick([[0,0],cen()])),shape:4},
 {n:'Enlarge · scale factor 2, any centre',g:ENLC([2],cen),shape:3,small:true},
 {n:'Enlarge · scale factor 3, any centre',g:ENLC([3],cen),shape:3,small:true},
 {n:'Enlarge · scale factor ½ (origin)',g:ENLC([.5],()=>[0,0]),shape:3},
 {n:'Enlarge · scale factor ½, any centre',g:ENLC([.5],cen),shape:3},
 {n:'Enlarge · scale factor −1',g:ENLC([-1],()=>[0,0]),shape:3,small:true},
 {n:'Enlarge · scale factor −2',g:ENLC([-2],()=>[0,0]),shape:3,small:true},
 {n:'Enlarge · negative scale factor, any centre',g:ENLC([-1,-2],cen),shape:3,small:true},
 {n:'Enlarge · any scale factor, any centre',g:ENLC([2,3,.5,-1,-2],()=>pick([[0,0],cen()])),shape:3,small:true},
 {n:'Two steps: reflect then translate',g:()=>T.then(pick([T.rx,T.ry,T.ryx])(),T.trans(nz(-3,3),nz(-3,3))),shape:3},
 {n:'Two steps: rotate then translate',g:()=>T.then(T.rot(pick([90,180]),pick(['c','a']),[0,0]),T.trans(nz(-3,3),nz(-3,3))),shape:3},
 {n:'Two steps: reflect in both axes',g:()=>pick([()=>T.then(T.rx(),T.ry()),()=>T.then(T.ry(),T.rx())])(),shape:3},
 {n:'Two steps: translate then enlarge',g:()=>T.then(T.trans(nz(-2,2),nz(-2,2)),T.enl(pick([2,.5,-1]))),shape:3,small:true},
 {n:'Boss: two-step transformations',g:()=>{const a=pick([()=>T.rx(),()=>T.ry(),()=>T.ryx(),()=>T.rot(90,'c',[0,0]),()=>T.rot(90,'a',[0,0]),()=>T.rot(180,'c',[0,0]),()=>T.trans(nz(-2,2),nz(-2,2))])(),b=pick([()=>T.rx(),()=>T.ry(),()=>T.rot(90,'c',[0,0]),()=>T.rot(180,'c',[0,0]),()=>T.trans(nz(-3,3),nz(-3,3))])();return T.then(a,b);},shape:3},
 // describe the transformation (multiple choice)
 {n:'Describe it · translations',g:()=>T.trans(nz(-5,5),nz(-5,5)),shape:3,mode:'describe'},
 {n:'Describe it · reflections in the axes',g:()=>pick([T.rx,T.ry])(),shape:3,mode:'describe'},
 {n:'Describe it · reflections in any line',g:REFL,shape:3,mode:'describe'},
 {n:'Describe it · rotations about the origin',g:ROTC([90,180,270],['c','a'],()=>[0,0]),shape:3,mode:'describe'},
 {n:'Describe it · rotations about any point',g:ROTC([90,180],['c','a'],cen),shape:3,mode:'describe'},
 {n:'Describe it · enlargements',g:ENLC([2,3],()=>[0,0]),shape:3,small:true,mode:'describe'},
 {n:'Describe it · enlargements, any centre or ½',g:ENLC([2,.5],()=>pick([[0,0],cen()])),shape:3,small:true,mode:'describe'},
 {n:'Describe it · negative scale factors',g:ENLC([-1,-2],()=>pick([[0,0],cen()])),shape:3,small:true,mode:'describe'},
 {n:'Describe it · any single transformation',g:()=>pick([ANY,REFL,ROTC([90,180,270],['c','a'],()=>pick([[0,0],cen()])),ENLC([2,.5,-1],()=>pick([[0,0],cen()]))])(),shape:3,small:true,mode:'describe'},
 {n:'Boss: describe it · two steps',g:()=>T.then(pick([()=>T.rx(),()=>T.ry(),()=>T.rot(90,'c',[0,0]),()=>T.rot(180,'c',[0,0])])(),T.trans(nz(-3,3),nz(-3,3))),shape:3,mode:'describe'},
 // inverse: given the image, find the original
 {n:'Undo it · translations',g:()=>T.trans(nz(-4,4),nz(-4,4)),shape:3,mode:'inverse'},
 {n:'Undo it · reflections',g:REFL,shape:3,mode:'inverse'},
 {n:'Undo it · rotations',g:ROTC([90,180],['c','a'],()=>pick([[0,0],cen()])),shape:3,mode:'inverse'},
 {n:'Undo it · enlargements',g:ENLC([2,.5,-1],()=>pick([[0,0],cen()])),shape:3,small:true,mode:'inverse'}
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
  const L=LV[lv-1],mode=L.mode||'make';let task,shape,img,placed,over,hintOn,wrong,opts,tried;
  const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const isInt=pts=>pts.every(p=>Number.isInteger(p[0])&&Number.isInteger(p[1]));
  function ok(pts){return pts.every(p=>Math.abs(p[0])<=6&&Math.abs(p[1])<=6);}
  function alternatives(t){
    const k=t.kind,a=t.par,out=[];
    if(k==='trans'){const[x,y]=a;[[y,x],[-x,y],[x,-y],[-x,-y],[x+1,y],[x,y+1],[x-1,y],[x,y-1]].forEach(v=>{if(v[0]||v[1])out.push(T.trans(v[0],v[1]));});}
    else if(k==='ref'){[T.rx(),T.ry(),T.ryx(),T.rymx()].forEach(x=>out.push(x));[-4,-3,-2,-1,1,2,3,4].forEach(m=>{out.push(T.rxk(m));out.push(T.ryk(m));});}
    else if(k==='rot'){const[ang,dir,c]=a,od=dir==='c'?'a':'c';
      out.push(T.rot(ang,od,c),T.rot(ang===180?90:180,dir,c),T.rot(90,dir,c),T.rot(270,dir,c),T.rot(ang,dir,[0,0]),T.rot(ang,dir,[c[0]+1,c[1]]),T.rot(ang,dir,[c[0],c[1]+1]),T.rot(ang,dir,[-c[0],-c[1]]),T.rot(ang,dir,[c[1],c[0]]));}
    else if(k==='enl'){const[kk,c]=a;[2,3,.5,-1,-2,-.5].forEach(x=>out.push(T.enl(x,c)));out.push(T.enl(kk,[0,0]),T.enl(kk,[c[0]+1,c[1]]),T.enl(kk,[c[0],c[1]+1]),T.enl(kk,[-c[0],-c[1]]),T.enl(kk,[c[1],c[0]]));}
    else if(k==='combo'){const[x,y]=a;out.push(T.then(y,x));if(y.kind==='trans'){const[u,v]=y.par;[[v,u],[-u,v],[u,-v],[-u,-v]].forEach(w=>{if(w[0]||w[1])out.push(T.then(x,T.trans(w[0],w[1])));});}}
    return out;
  }
  function makeOpts(){
    const sig=t=>shape.map(t.f).map(String).sort().join('|'),right=sig(task),seen=new Set([task.d]),pool=[];
    shuf(alternatives(task)).forEach(t=>{if(!seen.has(t.d)&&sig(t)!==right){seen.add(t.d);pool.push(t);}});
    const ds=pool.slice(0,3),fill=[()=>T.rx(),()=>T.ry(),()=>T.ryx(),()=>T.rymx(),()=>T.rot(90,'c'),()=>T.rot(90,'a'),()=>T.rot(180,'c'),()=>T.enl(2),()=>T.trans(nz(-4,4),nz(-4,4))];
    let g=0;while(ds.length<3&&g++<300){const t=pick(fill)();if(!seen.has(t.d)&&sig(t)!==right){seen.add(t.d);ds.push(t);}}
    return shuf([task.d,...ds.map(t=>t.d)]);
  }
  function newTask(){
    let tries=0;
    for(;;){tries++;task=L.g();const S=shapeFor(L.shape,L.small),I=S.map(task.f);
      if(!(ok(I)&&isInt(I)&&!S.every((p,i)=>same(p,I[i])))&&tries<20000)continue;
      if(mode==='inverse'){shape=I;img=S;}else{shape=S;img=I;}break;}
    task.tags=[...task.tags].concat(mode==='describe'?['tf-describe']:mode==='inverse'?['tf-inverse']:[]);
    ctx.q=tagTransform(task,L.shape);placed=[];over=false;hintOn=false;wrong=false;tried=[];opts=mode==='describe'?makeOpts():null;draw();
  }
  function poly(pts,cls){return`<polygon points="${pts.map(p=>p[0]+','+(-p[1])).join(' ')}" class="${cls}"/>`;}
  const prompt=()=>mode==='describe'?'<b>Which transformation maps the blue shape onto the green shape?</b>'
    :mode==='inverse'?`<b>This blue shape is the IMAGE after you ${task.p}. Tap the corners of the ORIGINAL shape.</b>`
    :`<b>${task.t}</b>${task.sub?`<br><small>(${task.sub})</small>`:''}`;
  function draw(msg){
    let s='<svg viewBox="-7 -7 14 14" class="tf-svg" id="tfs">';
    for(let i=-6;i<=6;i++){s+=`<line x1="${i}" y1="-6.5" x2="${i}" y2="6.5" class="tf-g${i===0?' ax':''}"/><line x1="-6.5" y1="${i}" x2="6.5" y2="${i}" class="tf-g${i===0?' ax':''}"/>`;
      if(i!==0)s+=`<text x="${i}" y="0.75" class="tf-n" text-anchor="middle">${i}</text><text x="-0.2" y="${-i+0.2}" class="tf-n" text-anchor="end">${i}</text>`;}
    s+=poly(shape,'tf-orig');
    if(mode==='describe'){s+=poly(img,'tf-ans');
      shape.forEach((p,i)=>{s+=`<text x="${p[0]-.15}" y="${-p[1]-.3}" class="tf-lb" text-anchor="end">${'ABCD'[i]}</text>`;});
      img.forEach((p,i)=>{s+=`<text x="${p[0]+.15}" y="${-p[1]-.3}" class="tf-lb im">${'ABCD'[i]}′</text>`;});}
    if(hintOn&&mode!=='describe'){const h=task.hint,inv=mode==='inverse'?-1:1;
      if(h.mirror)s+=h.mirror[0]==='x'?`<line x1="${h.mirror[1]}" y1="-6.5" x2="${h.mirror[1]}" y2="6.5" class="tf-mir"/>`:`<line x1="-6.5" y1="${-h.mirror[1]}" x2="6.5" y2="${-h.mirror[1]}" class="tf-mir"/>`;
      if(h.diag)s+=`<line x1="-6.5" y1="${6.5*h.diag}" x2="6.5" y2="${-6.5*h.diag}" class="tf-mir"/>`;
      if(h.arrow)s+=shape.slice(0,1).map(p=>`<line x1="${p[0]}" y1="${-p[1]}" x2="${p[0]+inv*h.arrow[0]}" y2="${-(p[1]+inv*h.arrow[1])}" class="tf-arr"/>`).join('');
      if(h.rays){const c=h.c||[0,0];s+=img.map(p=>`<line x1="${c[0]}" y1="${-c[1]}" x2="${p[0]}" y2="${-p[1]}" class="tf-mir"/>`).join('')+`<circle cx="${c[0]}" cy="${-c[1]}" r="0.22" class="tf-ctr"/>`;}
      if(h.ctr)s+=shape.map((p,i)=>`<line x1="${p[0]}" y1="${-p[1]}" x2="${img[i][0]}" y2="${-img[i][1]}" class="tf-mir" style="opacity:.35"/>`).join('')+`<circle cx="${h.ctr[0]}" cy="${-h.ctr[1]}" r="0.22" class="tf-ctr"/>`;
      if(h.mid&&mode==='make'){const mid=shape.map(h.mid.f);s+=poly(mid,'tf-mid')+shape.map((p,i)=>`<line x1="${p[0]}" y1="${-p[1]}" x2="${mid[i][0]}" y2="${-mid[i][1]}" class="tf-mir" style="opacity:.35"/>`).join('');}}
    if(over||wrong)s+=poly(img,'tf-ans');
    if(placed.length>=3&&!over&&!wrong)s+=poly(placed,'tf-mine');
    placed.forEach(p=>{s+=`<circle cx="${p[0]}" cy="${-p[1]}" r="0.3" class="tf-pt"/>`;});
    s+='</svg>';
    const info=mode==='describe'?`<div class="statrow"><span>${shape.map((p,i)=>`${'ABCD'[i]} (${p[0]}, ${p[1]}) → ${'ABCD'[i]}′ (${img[i][0]}, ${img[i][1]})`).join(' · ')}</span></div>`
      :`<div class="statrow"><span>Corners placed: <b>${placed.length}/${shape.length}</b></span><span>${mode==='inverse'?'Image':'Original'}: ${shape.map(p=>`(${p[0]}, ${p[1]})`).join(' ')}</span></div>`;
    const body=mode==='describe'?`<div class="tf-opts">${opts.map((o,i)=>`<button class="btn alt tf-opt${tried.includes(o)?' bad':''}" data-o="${i}" ${tried.includes(o)||over?'disabled':''}>${o}</button>`).join('')}</div>`:'';
    root.innerHTML=`<div class="tf"><div class="ch-q">${prompt()}</div>${s}${info}${body}
      <div class="msg">${msg||'&nbsp;'}</div>
      <div class="toolrow">${mode==='describe'?'':'<button class="btn alt" id="un">↶ Undo</button>'}<button class="btn alt" id="hn">💡 Hint</button><button class="btn" id="nw">New task ⏭</button></div></div>`;
    if(mode!=='describe'){$('#tfs').onclick=tap;$('#un').onclick=()=>{if(over)return;wrong=false;placed.pop();draw();};}
    $('#hn').onclick=()=>{hintOn=!hintOn;if(mode==='describe'){draw(hintOn?`💡 Follow one corner: A (${shape[0][0]}, ${shape[0][1]}) goes to A′ (${img[0][0]}, ${img[0][1]}). Is the shape the same size? Did it flip or turn?`:'');}else draw(hintOn?'Clue shown: use it to find where each corner goes.':'');};
    $('#nw').onclick=newTask;
    root.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>choose(opts[+b.dataset.o]));
  }
  function choose(o){
    if(over)return;
    if(o===task.d){over=true;draw('✅ Yes!');ctx.win('Described!',`${task.d}. Always name the type of transformation AND the details (vector, mirror line, angle & centre, scale factor & centre).`,newTask,'Another task');return;}
    tried.push(o);ctx.log('wrong',{mode:'describe',chose:o,expect:task.d});draw('❌ Not that one — check where the corners land and try again.');
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
      wrong=true;ctx.log('wrong',{placed:placed.map(p=>p.slice()),expect:img});draw(`❌ Not quite. The orange outline shows the correct ${mode==='inverse'?'original':'image'}: ${img.map(p=>`(${p[0]}, ${p[1]})`).join(' ')}. Press Undo to try again.`);return;
    }
    draw();
  }
  ctx.keys=null;newTask();
  window.__tfq=()=>({task,shape,img,opts,mode,choose,tapAt:(x,y)=>{const svg=$('#tfs'),r=svg.getBoundingClientRect();tap({currentTarget:svg,clientX:r.left+(x+7)/14*r.width,clientY:r.top+(7-y)/14*r.height});}});
 }});
})();
