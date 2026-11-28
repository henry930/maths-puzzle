(function(){
const rad=d=>d*Math.PI/180;
const P=(cx,cy,r,d)=>[cx+r*Math.cos(rad(d)),cy-r*Math.sin(rad(d))];
const f=n=>+n.toFixed(1);
const line=(a,b,cls='')=>`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" class="an-l ${cls}"/>`;
const arc=(cx,cy,r,a0,a1)=>{const s=P(cx,cy,r,a0),e=P(cx,cy,r,a1);return`<path d="M${f(s[0])} ${f(s[1])}A${r} ${r} 0 ${a1-a0>180?1:0} 0 ${f(e[0])} ${f(e[1])}" class="an-a"/>`;};
const lab=(cx,cy,r,a0,a1,t,unk)=>{const m=(a0+a1)/2,p=P(cx,cy,r,m);return`<text x="${f(p[0])}" y="${f(p[1]+4)}" class="an-t${unk?' unk':''}" text-anchor="middle">${t}</text>`;};
const svg=(b,w=240,h=160)=>`<svg viewBox="0 0 ${w} ${h}" class="an-svg">${b}</svg>`;
function around(cx,cy,angs,labels,unk,r=26,rl=44){ // angs sum 360 consecutive starting at start angle
  let s='',a=R(0,40);const rays=[a];angs.forEach(x=>{a+=x;rays.push(a)});
  rays.slice(0,-1).forEach(d=>{s+=line([cx,cy],P(cx,cy,70,d))});
  let a0=rays[0];angs.forEach((x,i)=>{s+=arc(cx,cy,r,a0,a0+x)+lab(cx,cy,rl,a0,a0+x,labels[i],i===unk);a0+=x;});return s;
}
const QT={
 A1(){const t=pick([30,45,60,75,90,110,120,135,150]);const cx=40,cy=125;
  const s=line([cx,cy],P(cx,cy,150,0))+line([cx,cy],P(cx,cy,130,t))+arc(cx,cy,34,0,t)+lab(cx,cy,56,0,t,'?',true);
  return{svg:svg(s),q:'Estimate the size of this angle (within 10°). The diagram is drawn accurately.',ans:t,tol:10,ex:`It was ${t}°. Compare with 90° (a right angle) and 180° (a straight line).`};},
 A2(){const a=R(3,16)*10;const cx=120,cy=120;
  const s=line([cx-100,cy],[cx+100,cy])+line([cx,cy],P(cx,cy,90,a))+arc(cx,cy,28,0,a)+lab(cx,cy,48,0,a,a+'°')+arc(cx,cy,28,a,180)+lab(cx,cy,48,a,180,'?',true);
  return{svg:svg(s),q:'The angles lie on a straight line. Find the angle marked ?',ans:180-a,ex:`Angles on a straight line add up to 180°: 180 − ${a} = ${180-a}°`};},
 A3(){const k=pick([3,4]);let angs=[];let left=360;for(let i=0;i<k-1;i++){const x=R(4,Math.floor((left-(k-1-i)*40)/10))*10;angs.push(Math.min(x,left-40*(k-1-i)));left-=angs[i];}angs.push(left);
  const u=R(0,k-1);const labels=angs.map((x,i)=>i===u?'?':x+'°');
  return{svg:svg(around(120,80,angs,labels,u,24,42)),q:'The angles meet at a point. Find the angle marked ?',ans:angs[u],ex:`Angles around a point add up to 360°: 360 − (${angs.filter((_,i)=>i!==u).join(' + ')}) = ${angs[u]}°`};},
 A4(){const a=R(3,10)*10,b=R(3,10)*10;if(180-a-b<20)return QT.A4();const A=[30,125],B=[200,125],C=[135,25];
  const s=`<polygon points="${A} ${B} ${C}" class="an-poly"/><text x="48" y="118" class="an-t">${a}°</text><text x="170" y="118" class="an-t">${b}°</text><text x="135" y="52" class="an-t unk" text-anchor="middle">?</text>`;
  return{svg:svg(s),q:'Find the angle marked ? in this triangle (not drawn accurately).',ans:180-a-b,ex:`Angles in a triangle add up to 180°: 180 − ${a} − ${b} = ${180-a-b}°`};},
 A5(){const apex=pick([2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(x=>x*4));const A=[30,125],B=[200,125],C=[115,25];
  const s=`<polygon points="${A} ${B} ${C}" class="an-poly"/><text x="115" y="58" class="an-t" text-anchor="middle">${apex}°</text><text x="48" y="118" class="an-t unk">?</text>
   <path d="M64 70l8 6M158 70l8 6" class="an-tick"/>`;
  return{svg:svg(s),q:'This is an isosceles triangle (the two marked sides are equal). Find the base angle ?',ans:(180-apex)/2,ex:`Base angles are equal: (180 − ${apex}) ÷ 2 = ${(180-apex)/2}°`};},
 A6(){const a=R(6,12)*10,b=R(6,12)*10,c=R(5,12)*10;const d=360-a-b-c;if(d<30||d>170)return QT.A6();
  const s=`<polygon points="40,30 200,40 215,125 30,120" class="an-poly"/><text x="50" y="52" class="an-t">${a}°</text><text x="170" y="56" class="an-t">${b}°</text><text x="178" y="116" class="an-t">${c}°</text><text x="50" y="108" class="an-t unk">?</text>`;
  return{svg:svg(s),q:'Find the angle marked ? in this quadrilateral.',ans:d,ex:`Angles in a quadrilateral add up to 360°: 360 − ${a} − ${b} − ${c} = ${d}°`};},
 A7(){const a=R(3,15)*10;const cx=120,cy=80;
  const s=line(P(cx,cy,90,a),P(cx,cy,90,a+180))+line(P(cx,cy,90,a+90+R(30,60)),P(cx,cy,90,a+270+R(0,0)))+'';
  // simpler & accurate: two lines crossing at angle a
  const L1=[P(cx,cy,90,0),P(cx,cy,90,180)],L2=[P(cx,cy,90,a),P(cx,cy,90,a+180)];
  const opp=pick([0,1]);
  const sv=line(L1[0],L1[1])+line(L2[0],L2[1])+arc(cx,cy,24,0,a)+lab(cx,cy,42,0,a,a+'°')+(opp?arc(cx,cy,24,180,180+a)+lab(cx,cy,42,180,180+a,'?',true):arc(cx,cy,24,a,180)+lab(cx,cy,42,a,180,'?',true));
  return{svg:svg(sv),q:`Two straight lines cross. Find the angle marked ?`,ans:opp?a:180-a,ex:opp?`Vertically opposite angles are equal: ${a}°`:`Angles on a straight line add to 180°: 180 − ${a} = ${180-a}°`};},
 A8(){const phi=R(4,7)*10,t=pick(['corr','alt','co']);const y1=45,y2=115,cx1=110,cx2=cx1+(y2-y1)/Math.tan(rad(phi));
  let s=line([10,y1],[230,y1],'par')+line([10,y2],[230,y2],'par')+`<path d="M20 ${y1-12}l18 0M20 ${y1-12}l-6 -4M20 ${y1-12}l-6 4" class="an-tick" transform="translate(120 0)" style="display:none"/>`;
  s+=line(P(cx1,y1,40,phi+180),P(cx2,y2,40,phi));
  const wedge=(cx,cy,w)=>({UR:[0,phi],UL:[phi,180],LL:[180,180+phi],LR:[180+phi,360]}[w]);
  const pl=(cx,cy,w,txt,unk)=>{const[a0,a1]=wedge(cx,cy,w);return arc(cx,cy,18,a0,a1)+lab(cx,cy,34,a0,a1,txt,unk);};
  let top,bot,ans,ex,val;
  if(t==='corr'){top='UR';bot='UR';val=phi;ans=phi;ex=`Corresponding angles are equal: ${phi}°`;}
  else if(t==='alt'){top='LR';bot='UL';val=180-phi;ans=val;ex=`Alternate angles are equal: ${val}°`;}
  else{top='LR';bot='UR';val=180-phi;ans=phi;ex=`Co-interior angles add to 180°: 180 − ${val} = ${phi}°`;}
  s+=pl(cx1,y1,top,val+'°')+pl(cx2,y2,bot,'?',true);
  return{svg:svg(s+'<text x="226" y="40" class="an-t" font-size="9">∥</text>'),q:'The two horizontal lines are parallel. Find the angle marked ?',ans,ex};},
 A9(){const a=R(3,9)*10,b=R(3,9)*10;const A=[30,125],B=[170,125],C=[120,30];
  const s=`<polygon points="${A} ${B} ${C}" class="an-poly"/>${line(B,[225,125])}<text x="46" y="118" class="an-t">${a}°</text><text x="112" y="58" class="an-t">${b}°</text><text x="188" y="112" class="an-t unk">?</text>`;
  return{svg:svg(s),q:'One side of the triangle is extended. Find the exterior angle marked ?',ans:a+b,ex:`An exterior angle equals the sum of the two opposite interior angles: ${a} + ${b} = ${a+b}°`};},
 A10(){const t=R(0,2),n=pick([5,6,8,9,10,12]);const nm={5:'pentagon',6:'hexagon',8:'octagon',9:'nonagon',10:'decagon',12:'dodecagon'}[n];
  if(t===0)return{svg:`<div class="ch-big">⬡</div>`,q:`What is the <b>sum of the interior angles</b> of a ${nm} (${n} sides)?`,ans:(n-2)*180,ex:`(n − 2) × 180 = (${n} − 2) × 180 = ${(n-2)*180}°`};
  if(t===1)return{svg:`<div class="ch-big">⬡</div>`,q:`What is each <b>exterior angle</b> of a regular ${nm}?`,ans:360/n,ex:`Exterior angles sum to 360°: 360 ÷ ${n} = ${360/n}°`};
  return{svg:`<div class="ch-big">⬡</div>`,q:`What is each <b>interior angle</b> of a regular ${nm}?`,ans:(n-2)*180/n,ex:`180 − exterior angle = 180 − ${360/n} = ${(n-2)*180/n}°`};},
 A11(){const x=R(10,40),b=pick([2,3]),a=R(1,4)*10,c=180-(1+b)*x-a;if(c<5||c>80)return QT.A11();
  const cx=120,cy=120,t1=(x+a),t2=(b*x+c);
  const s=line([cx-100,cy],[cx+100,cy])+line([cx,cy],P(cx,cy,90,t1))+arc(cx,cy,26,0,t1)+lab(cx,cy,48,0,t1,`x+${a}`)+arc(cx,cy,26,t1,180)+lab(cx,cy,50,t1,180,`${b}x+${c}`);
  return{svg:svg(s),q:`The two angles on the straight line are (x + ${a})° and (${b}x + ${c})°. Find the value of <b>x</b>.`,ans:x,ex:`x + ${a} + ${b}x + ${c} = 180 → ${1+b}x = ${180-a-c} → x = ${x}`};},
 A12(){const x=R(10,25),k=pick([[1,2,3],[1,2,6],[2,3,4],[1,3,5]]),s=k[0]+k[1]+k[2];if(180%s)return QT.A12();const xx=180/s;
  const A=[30,125],B=[200,125],C=[135,25];const sv=`<polygon points="${A} ${B} ${C}" class="an-poly"/><text x="48" y="118" class="an-t">${k[0]}x</text><text x="160" y="118" class="an-t">${k[1]}x</text><text x="135" y="55" class="an-t" text-anchor="middle">${k[2]}x</text>`;
  return{svg:svg(sv),q:`The angles of this triangle are ${k[0]}x°, ${k[1]}x° and ${k[2]}x°. Find <b>x</b>.`,ans:xx,ex:`${s}x = 180 → x = ${xx}`};}
};
const POOL=[['A1'],['A2'],['A2','A3'],['A4'],['A4','A5'],['A6'],['A7','A9'],['A8'],['A10'],['A8','A9','A10'],['A11','A12'],['A3','A5','A6','A7','A8','A9','A10','A11','A12']];
window.__an={QT,POOL};
REG.push({id:'angles',name:'Angle Hunter',emoji:'📐',color:'#0b7285',cat:'Geometry',
 desc:'Estimate and calculate angles in lines, triangles, polygons and parallel lines. Diagrams are drawn for you — find the missing angle!',skills:['angle rules','parallel lines','polygons','forming equations'],
 levels:['Estimate angles','Angles on a straight line','Straight line & around a point','Angles in a triangle','Isosceles triangles','Quadrilaterals','Crossing lines & exterior angles','Parallel lines','Polygons','Mixed angle rules','Angles with algebra','Boss mix'],
 how:'Look at the diagram, work out the angle marked ?, and type the answer in degrees. Get 4 out of 5 right to pass the level. Diagrams are not always drawn to scale!',
 art:'<svg viewBox="0 0 120 80" width="130" height="90" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M10 70H110M10 70L80 15"/><path d="M45 70A35 35 0 0 0 33 46" /></svg>',
 mount(root,lv,ctx){
  const pool=POOL[lv-1];let qs,qi,right,cur,buf,answered,res;
  function start(){qs=Array.from({length:5},()=>pick(pool));qi=0;right=0;res=[];next();}
  function next(){cur=QT[qs[qi]]();buf='';answered=false;ctx.q=quizQ('angles',qs[qi],cur);draw();}
  function draw(msg,ok){
    root.innerHTML=`<div class="ch"><div class="statrow"><span>Question ${qi+1}/5</span><span>✅ ${right} correct (need 4)</span></div>
     <div class="ch-vis">${cur.svg}</div><div class="ch-q">${cur.q}</div>
     <div class="ch-in ${ok===true?'good':ok===false?'bad':''}">${buf?buf+'°':'&nbsp;'}</div><div class="msg">${msg||'&nbsp;'}</div><div id="anp"></div>
     <div class="toolrow">${answered?`<button class="btn" id="nx">${qi<4?'Next question ▶':'See result ▶'}</button>`:''}</div></div>`;
    if(!answered)$('#anp').appendChild(numpad(press));if($('#nx'))$('#nx').onclick=advance;
  }
  function press(k){
    if(answered)return;
    if(k==='del')buf=buf.slice(0,-1);else if(k==='ok')return submit();else if(buf.length<4)buf+=k;draw();
  }
  function submit(){
    if(!buf){draw('Type your answer first.');return;}
    const v=+buf;answered=true;const ok=Math.abs(v-cur.ans)<=(cur.tol||0);if(ok)right++;res.push({qt:qs[qi],ok});ctx.log(ok?'right':'wrong',ok?{}:{typed:buf,expect:cur.ans,err:'wrong_value'});
    draw((ok?'✅ Correct! ':'❌ Not quite. ')+cur.ex,ok);
  }
  function advance(){
    if(qi<4){qi++;next();return;}
    {ctx.q=levelQ(ctx.id,ctx.lv);ctx.perf={right,of:5,wrong:res.filter(r=>!r.ok).map(r=>r.qt)};}
    if(right>=4)ctx.win('Angle ace!',`You got ${right}/5 right.`,start,'Play again');
    else{ctx.log('fail',ctx.perf);root.innerHTML=`<div class="ch"><div class="big-emo" style="text-align:center">💪</div><div class="ch-q" style="text-align:center">You got ${right}/5. You need 4 to pass — try again!</div><div class="toolrow"><button class="btn" id="rt">Try again ⟲</button></div></div>`;$('#rt').onclick=start;}
  }
  ctx.keys=e=>{if(/^[0-9]$/.test(e.key))press(e.key);else if(e.key==='Backspace'){e.preventDefault();press('del');}else if(e.key==='Enter')press('ok');};
  start();
 }});
})();
