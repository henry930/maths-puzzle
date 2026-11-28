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
 A8(){const phi=R(4,7)*10,t=pick(['corr','alt','co']);const y1=45,y2=115,cx1=110,cx2=cx1-(y2-y1)/Math.tan(rad(phi));
  let s=line([10,y1],[230,y1],'par')+line([10,y2],[230,y2],'par')+`<path d="M20 ${y1-12}l18 0M20 ${y1-12}l-6 -4M20 ${y1-12}l-6 4" class="an-tick" transform="translate(120 0)" style="display:none"/>`;
  s+=line(P(cx2,y2,46,phi+180),P(cx1,y1,46,phi));
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
/* ===== Levels 13+ : more GCSE angle questions (facts, algebra, quadrilaterals, parallel lines, polygons, circle theorems, bearings) ===== */
const cen=pts=>[pts.reduce((a,p)=>a+p[0],0)/pts.length,pts.reduce((a,p)=>a+p[1],0)/pts.length];
const vtxt=(V,C,t,u,d=24)=>{const dx=C[0]-V[0],dy=C[1]-V[1],l=Math.hypot(dx,dy)||1;return`<text x="${f(V[0]+dx/l*d)}" y="${f(V[1]+dy/l*d+4)}" class="an-t${u?' unk':''}" text-anchor="middle">${t}</text>`;};
const poly=(pts,extra='')=>`<polygon points="${pts.map(p=>p.join(',')).join(' ')}" class="an-poly"/>${extra}`;
const vlabs=(pts,labs,d)=>{const C=cen(pts);return labs.map((t,i)=>t===''||t==null?'':vtxt(pts[i],C,String(t),t==='?',d)).join('');};
const tk=(a,b)=>{const m=[(a[0]+b[0])/2,(a[1]+b[1])/2],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*5,ny=dx/l*5;return`<path d="M${f(m[0]-nx)} ${f(m[1]-ny)}L${f(m[0]+nx)} ${f(m[1]+ny)}" class="an-tick"/>`;};
const rt=(V,d1,d2,s=9)=>{const u=[Math.cos(rad(d1)),-Math.sin(rad(d1))],w=[Math.cos(rad(d2)),-Math.sin(rad(d2))];return`<path d="M${f(V[0]+u[0]*s)} ${f(V[1]+u[1]*s)}l${f(w[0]*s)} ${f(w[1]*s)}l${f(-u[0]*s)} ${f(-u[1]*s)}" class="an-tick"/>`;};
const tx=(x,y,t,u)=>`<text x="${f(x)}" y="${f(y)}" class="an-t${u?' unk':''}" text-anchor="middle">${t}</text>`;
const big=e=>`<div class="ch-big">${e}</div>`;
const ex_=(a,b)=>{const s=(n)=>n<0?'− '+(-n):'+ '+n;return(a===1?'':a)+'x'+(b===0?'':' '+s(b));};
const E_=(a,b)=>`(${a===1?'':a}x${b===0?'':b<0?' − '+(-b):' + '+b})°`;
/* ray fan: rays from (cx,cy) at the given angles, arcs between consecutive rays labelled */
function fan(cx,cy,rays,labs,unkIdx,opt={}){let s='';const L=opt.len||90;rays.forEach(d=>{s+=line([cx,cy],P(cx,cy,L,d))});
  for(let i=0;i<rays.length-1;i++){const a0=rays[i],a1=rays[i+1],r=opt.r?opt.r[i]||24:24+(i%2)*6;s+=arc(cx,cy,r,a0,a1)+lab(cx,cy,r+20,a0,a1,labs[i],i===unkIdx);}return s;}
function circ(extra=''){return`<circle cx="120" cy="80" r="62" class="an-poly" style="fill:#fff"/>${extra}`;}
const CP=(d,r=62)=>P(120,80,r,d);
const dot=(p,t,dx=0,dy=0)=>`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="2.5" fill="#364fc7"/>`+(t?`<text x="${f(p[0]+dx)}" y="${f(p[1]+dy)}" class="an-t" text-anchor="middle" style="fill:#555;font-size:11px">${t}</text>`:'');
const dir=(deg,l)=>[Math.sin(rad(deg))*l,-Math.cos(rad(deg))*l];   // bearing → dx,dy
const pad3=n=>String(n).padStart(3,'0');
const gcdA=(a,b)=>b?gcdA(b,a%b):a;
function clockSvg(h,m){const cx=70,cy=70;let s=`<circle cx="${cx}" cy="${cy}" r="62" fill="#fff" stroke="#364fc7" stroke-width="3"/>`;
  for(let i=1;i<=12;i++){const p=P(cx,cy,50,90-i*30);s+=`<text x="${f(p[0])}" y="${f(p[1]+4)}" class="an-t" text-anchor="middle" style="font-size:11px">${i}</text>`;}
  const mh=P(cx,cy,52,90-m*6),hh=P(cx,cy,34,90-(h%12*30+m*.5));return`<svg viewBox="0 0 140 140" class="an-svg" style="max-width:190px">${s}${line([cx,cy],hh)}${line([cx,cy],mh,'par')}<circle cx="${cx}" cy="${cy}" r="3" fill="#1f1a3d"/></svg>`;}
const TRI=[[30,125],[200,125],[120,25]];

Object.assign(QT,{
 Q1(){const v=R(0,3);
  if(v<2){const T=v?180:90,a=v?R(19,34)*5:R(2,16)*5,cx=T===90?60:120,cy=125,r=T===90?[0,90]:[0,a,180];
   const s=fan(cx,cy,r,[a+'°','?'],1,{r:[26,26]})+(T===90?rt([cx,cy],0,90):'');
   return{v:'Q1.'+v,svg:svg(s),q:v?`Two angles are <b>supplementary</b> (they add up to 180°). One is ${a}°. Find the other.`:`Two angles are <b>complementary</b> (they add up to 90°). One is ${a}°. Find the other.`,ans:T-a,ex:`${T}° − ${a}° = ${T-a}°`};}
  if(v===2){const k=pick([2,5,8]);return{v:'Q1.2',svg:big('📐'),q:`Two angles are <b>complementary</b>. One is <b>${k} times</b> the other. Find the smaller angle.`,ans:90/(k+1),ex:`Parts: 1 + ${k} = ${k+1}. 90 ÷ ${k+1} = ${90/(k+1)}°`};}
  const k=pick([2,3,4,5,8]);return{v:'Q1.3',svg:big('📐'),q:`Two angles are <b>supplementary</b>. One is <b>${k} times</b> the other. Find the smaller angle.`,ans:180/(k+1),ex:`Parts: 1 + ${k} = ${k+1}. 180 ÷ ${k+1} = ${180/(k+1)}°`};},
 Q2(){const v=R(0,1),cx=60,cy=125;
  if(v===0){const a=R(2,16)*5;return{v:'Q2.0',svg:svg(fan(cx,cy,[0,a,90],[a+'°','?'],1,{r:[26,26]})+rt([cx,cy],0,90)),q:`The two angles make a right angle. Find the angle marked ?`,ans:90-a,ex:`A right angle is 90°: 90 − ${a} = ${90-a}°`};}
  const a=R(2,6)*5,b=R(2,6)*5;return{v:'Q2.1',svg:svg(fan(cx,cy,[0,a,a+b,90],[a+'°',b+'°','?'],2,{r:[26,32,26]})+rt([cx,cy],0,90)),q:`The three angles make a right angle. Find the angle marked ?`,ans:90-a-b,ex:`90 − ${a} − ${b} = ${90-a-b}°`};},
 Q3(){const v=R(0,2);
  if(v===0){const a=R(3,16)*10,cx=120,cy=80;return{v:'Q3.0',svg:svg(line([cx,cy],P(cx,cy,70,0))+line([cx,cy],P(cx,cy,70,a))+arc(cx,cy,26,0,a)+lab(cx,cy,44,0,a,a+'°')+arc(cx,cy,34,a,360)+lab(cx,cy,52,a,360,'?',true)),q:`The angles meet at a point. Find the <b>reflex</b> angle marked ?`,ans:360-a,ex:`Angles around a point add to 360°: 360 − ${a} = ${360-a}°`};}
  if(v===1){const t=pick([200,215,230,245,260,280,300,320]),cx=120,cy=80;return{v:'Q3.1',svg:svg(line([cx,cy],P(cx,cy,70,0))+line([cx,cy],P(cx,cy,70,t))+arc(cx,cy,30,0,t)+lab(cx,cy,48,0,t,'?',true)),q:`Estimate the size of this <b>reflex</b> angle (within 10°). The diagram is drawn accurately.`,ans:t,tol:10,ex:`It was ${t}°. A reflex angle is between 180° and 360°.`};}
  const r=R(37,70)*5;return{v:'Q3.2',svg:big('🔄'),q:`A reflex angle is <b>${r}°</b>. The rest of the full turn is the other angle. Find it.`,ans:360-r,ex:`360 − ${r} = ${360-r}°`};},
 Q4(){const v=R(0,3);
  if(v===0){const F=pick([[1,2],[1,4],[3,4],[1,8],[3,8],[5,8],[1,3],[2,3],[1,6],[5,6],[1,10],[7,10]]);return{v:'Q4.0',svg:big('🔄'),q:`A full turn is 360°. How many degrees is <b>${F[0]}/${F[1]}</b> of a full turn?`,ans:360*F[0]/F[1],ex:`360 × ${F[0]}/${F[1]} = ${360*F[0]/F[1]}°`};}
  if(v===1){const A=pick([[1,4,1,8],[1,4,1,2],[1,2,1,8],[1,3,1,6],[1,4,1,12]]);const t=360*A[0]/A[1]+360*A[2]/A[3];return{v:'Q4.1',svg:big('🔄'),q:`A turn of <b>${A[0]}/${A[1]}</b> is followed by a turn of <b>${A[2]}/${A[3]}</b> in the same direction. How many degrees is that altogether?`,ans:t,ex:`${360*A[0]/A[1]}° + ${360*A[2]/A[3]}° = ${t}°`};}
  if(v===2){const n=R(2,6);return{v:'Q4.2',svg:big('🎡'),q:`A wheel turns through <b>${n*360}°</b>. How many <b>full turns</b> is that?`,ans:n,ex:`${n*360} ÷ 360 = ${n}`};}
  const a=pick([10,15,20,30,40,45,60,72,90]);return{v:'Q4.3',svg:big('🔄'),q:`How many turns of <b>${a}°</b> make one full turn of 360°?`,ans:360/a,ex:`360 ÷ ${a} = ${360/a}`};},
 Q5(){const v=R(0,3);
  if(v===0){const h=R(1,11);return{v:'Q5.0',svg:clockSvg(h,0),q:`What is the smaller angle between the hands of a clock at <b>${h} o'clock</b>?`,ans:Math.min(30*h,360-30*h),ex:`Each hour is 30°. At ${h} o'clock the hands are ${Math.min(h,12-h)} hours apart: ${Math.min(h,12-h)} × 30 = ${Math.min(30*h,360-30*h)}°`};}
  if(v===1){const m=R(1,11)*5;return{v:'Q5.1',svg:clockSvg(3,m),q:`The minute hand moves from 12 to <b>${m} minutes past</b>. Through how many degrees does it turn?`,ans:6*m,ex:`Each minute is 6°: ${m} × 6 = ${6*m}°`};}
  if(v===2){const h=pick([1,2,3,4,5,7,8,9,10,11]),d=Math.abs(30*h+15-180);return{v:'Q5.2',svg:clockSvg(h,30),q:`What is the smaller angle between the hands at <b>half past ${h}</b>?`,ans:Math.min(d,360-d),ex:`The minute hand is at 180°. The hour hand is at ${30*h}° + 15° = ${30*h+15}°. Difference ${Math.min(d,360-d)}°`};}
  const n=R(2,8);return{v:'Q5.3',svg:clockSvg(n,0),q:`The hour hand of a clock moves for <b>${n} hours</b>. Through how many degrees does it turn?`,ans:30*n,ex:`One hour is 30°: ${n} × 30 = ${30*n}°`};},
 Q6(){const v=R(0,3);
  if(v===0){const D=pick([['north-east',45],['east',90],['south-east',135],['south',180],['south-west',225],['west',270],['north-west',315]]);return{v:'Q6.0',svg:big('🧭'),q:`What is the three-figure <b>bearing</b> of <b>${D[0]}</b>? (measured clockwise from north)`,ans:D[1],ex:`${D[0]} is ${D[1]}° clockwise from north → ${pad3(D[1])}°`};}
  const b=R(1,11)*30,t=pick([30,60,90]);
  if(v===1){return{v:'Q6.1',svg:big('🚢'),q:`A ship sails on a bearing of <b>${pad3(b)}°</b>. It turns <b>clockwise</b> through <b>${t}°</b>. What is its new bearing?`,ans:(b+t)%360,ex:`${b} + ${t} = ${b+t}${b+t>=360?' → subtract 360 → '+(b+t-360):''}°`};}
  if(v===2){return{v:'Q6.2',svg:big('🚢'),q:`A ship sails on a bearing of <b>${pad3(b)}°</b>. It turns <b>anticlockwise</b> through <b>${t}°</b>. What is its new bearing?`,ans:(b-t+360)%360,ex:`${b} − ${t} = ${b-t}${b-t<0?' → add 360 → '+(b-t+360):''}°`};}
  const n=R(1,3)*45;return{v:'Q6.3',svg:big('🧭'),q:`You face north and turn <b>clockwise</b> through <b>${n+90}°</b>. What bearing are you now facing?`,ans:n+90,ex:`Clockwise from north: ${n+90}° → ${pad3(n+90)}°`};},
 Q7(){const v=R(0,6);const F=[['the <b>sum of the angles in a triangle</b>',180,'🔺'],['the <b>sum of the angles in a quadrilateral</b>',360,'⬜'],['the <b>sum of angles on a straight line</b>',180,'➖'],['the <b>sum of angles around a point</b>',360,'⭕'],['the <b>sum of the exterior angles of any polygon</b>',360,'⬡'],['<b>each angle</b> of an equilateral triangle',60,'🔺'],['<b>each angle</b> of a square',90,'⬜']][v];
  return{v:'Q7.'+v,svg:big(F[2]),q:`How many degrees is ${F[0]}?`,ans:F[1],ex:`${F[1]}°`};},
 Q8(){const v=R(0,3);
  if(v===0)return{v:'Q8.0',svg:big('🔺'),q:`Each interior angle of an equilateral triangle is 60°. What is each <b>exterior</b> angle?`,ans:120,ex:`180 − 60 = 120°`};
  if(v===1)return{v:'Q8.1',svg:big('⬜'),q:`Each interior angle of a square is 90°. What is each <b>exterior</b> angle?`,ans:90,ex:`180 − 90 = 90°`};
  if(v===2){const i=pick([120,135,140,144,150,156,160,162,165,168]);return{v:'Q8.2',svg:big('⬡'),q:`The interior angle of a regular polygon is <b>${i}°</b>. What is its <b>exterior</b> angle?`,ans:180-i,ex:`Interior + exterior = 180°: 180 − ${i} = ${180-i}°`};}
  const e=pick([60,45,40,36,30,24,20,18,15,12]);return{v:'Q8.3',svg:big('⬡'),q:`The exterior angle of a regular polygon is <b>${e}°</b>. What is its <b>interior</b> angle?`,ans:180-e,ex:`180 − ${e} = ${180-e}°`};},
 Q9(){const v=R(0,2),cx=40,cy=125;
  if(v===0){const h=R(2,17)*5;return{v:'Q9.0',svg:svg(fan(cx,cy,[0,h,2*h],['?',h+'°'],0,{r:[30,30],len:130})),q:`The ray bisects the angle (it cuts it exactly in half). The whole angle is <b>${2*h}°</b>. Find the angle marked ?`,ans:h,ex:`${2*h} ÷ 2 = ${h}°`};}
  if(v===1){const h=R(2,17)*5;return{v:'Q9.1',svg:svg(fan(cx,cy,[0,h,2*h],[h+'°',h+'°'],-1,{r:[30,30],len:130})+tx(150,40,'whole = ?',true)),q:`The ray bisects the whole angle. One half is <b>${h}°</b>. Find the whole angle.`,ans:2*h,ex:`2 × ${h} = ${2*h}°`};}
  const q=R(2,10)*5,w=4*q;return{v:'Q9.2',svg:svg(fan(cx,cy,[0,q,2*q,3*q,4*q],['?',q+'°',q+'°',q+'°'].map((t,i)=>i?'':t),-1,{r:[30,30,30,30],len:130})),q:`An angle of <b>${w}°</b> is bisected, then each half is bisected again. Find the size of the smallest angle.`,ans:q,ex:`${w} ÷ 2 = ${w/2}, then ÷ 2 = ${q}°`};},
 Q10(){const v=R(0,2),A=[40,125],B=[190,125],C=[40,35],pts=[A,B,C];
  if(v===0){const a=R(2,8)*5+10;return{v:'Q10.0',svg:svg(poly(pts,rt(A,0,90))+vlabs(pts,['','?',a+'°'])),q:`This is a right-angled triangle. Find the angle marked ?`,ans:90-a,ex:`180 − 90 − ${a} = ${90-a}°`};}
  if(v===1){return{v:'Q10.1',svg:svg(poly(pts,rt(A,0,90))+vlabs(pts,['','x°','2x°'])),q:`A right-angled triangle has acute angles <b>x</b> and <b>2x</b>. Find the size of the <b>larger</b> acute angle.`,ans:60,ex:`x + 2x = 90 → x = 30°, so the larger angle is 2x = 60°`};}
  return{v:'Q10.2',svg:svg(poly(pts,rt(A,0,90)+tk(A,B)+tk(A,C))+vlabs(pts,['','?',''])),q:`This is a right-angled isosceles triangle (two equal sides). Find the angle marked ?`,ans:45,ex:`The two acute angles are equal: (180 − 90) ÷ 2 = 45°`};},
 Q11(){const v=R(0,2),A=[40,125],B=[200,125],C=[120,25];
  if(v===0){const b=R(4,17)*5;if(180-2*b<10)return QT.Q11();return{v:'Q11.0',svg:svg(poly([A,B,C],tk(A,C)+tk(B,C))+vlabs([A,B,C],[b+'°',b+'°','?'])),q:`This is an isosceles triangle. Find the apex angle marked ?`,ans:180-2*b,ex:`180 − ${b} − ${b} = ${180-2*b}°`};}
  if(v===1){return{v:'Q11.1',svg:svg(poly([A,B,C],tk(A,C)+tk(B,C)+tk(A,B))+line(B,[230,125])+tx(218,112,'?',true)),q:`ABC is an <b>equilateral</b> triangle. Side AB is extended as shown. Find the exterior angle marked ?`,ans:120,ex:`Each interior angle is 60°. Exterior = 180 − 60 = 120°`};}
  const e=pick([110,120,130,140,150,160]);return{v:'Q11.2',svg:svg(poly([A,B,C],tk(A,C)+tk(B,C))+line(A,[10,125])+tx(22,112,e+'°')+tx(120,58,'?',true)),q:`Triangle ABC is isosceles with CA = CB. The exterior angle at A is <b>${e}°</b>. Find the angle at C (marked ?).`,ans:2*e-180,ex:`Base angle = 180 − ${e} = ${180-e}°. Apex = 180 − 2 × ${180-e} = ${2*e-180}°`};},
 Q12(){const v=R(0,1),A=[40,100],B=[200,100],C=[130,25];
  if(v===0){const e1=R(11,15)*10,e2=R(11,15)*10;if(e1+e2<=190)return QT.Q12();return{v:'Q12.0',svg:svg(line([5,100],[235,100])+poly([A,B,C])+tx(22,88,e1+'°')+tx(220,88,e2+'°')+tx(130,52,'?',true)),q:`A triangle sits on a straight line. The two angles outside the triangle are ${e1}° and ${e2}°. Find the angle marked ?`,ans:e1+e2-180,ex:`Interior angles: 180 − ${e1} = ${180-e1} and 180 − ${e2} = ${180-e2}. Third angle: 180 − ${180-e1} − ${180-e2} = ${e1+e2-180}°`};}
  const a=R(3,9)*10,b=R(3,9)*10,e=a+b;return{v:'Q12.1',svg:svg(poly([[30,125],[170,125],[120,30]])+line([170,125],[225,125])+tx(46,118,a+'°')+tx(188,112,e+'°')+tx(112,58,'?',true)),q:`One side of the triangle is extended. The exterior angle is <b>${e}°</b> and one of the opposite interior angles is <b>${a}°</b>. Find the angle marked ?`,ans:b,ex:`Exterior angle = sum of the two opposite interior angles: ${e} − ${a} = ${b}°`};},
 Q13(){const v=R(0,3),pts=TRI;
  if(v<2){const d=pick([10,20,30]),x=60-d;return{v:'Q13.'+v,svg:svg(poly(pts)+vlabs(pts,[`x°`,`(x+${d})°`,`(x+${2*d})°`],30)),q:v?`The angles of a triangle are x°, (x + ${d})° and (x + ${2*d})°. Find the <b>largest</b> angle.`:`The angles of a triangle are x°, (x + ${d})° and (x + ${2*d})°. Find <b>x</b>.`,ans:v?x+2*d:x,ex:`3x + ${3*d} = 180 → x = ${x}${v?`, largest = ${x}+${2*d} = ${x+2*d}°`:''}`};}
  const k=R(0,8)*6,x=(180-k)/6;return{v:'Q13.'+v,svg:svg(poly(pts)+vlabs(pts,[`x°`,`2x°`,E_(3,k)],30)),q:v===2?`The angles of a triangle are x°, 2x° and ${E_(3,k)}. Find <b>x</b>.`:`The angles of a triangle are x°, 2x° and ${E_(3,k)}. Find the <b>smallest</b> angle.`,ans:x,ex:`6x + ${k} = 180 → x = ${x}°`};},
 Q14(){const x=R(5,20),a=R(2,4),b=R(5,25),d=b+x,val=a*x+b;if(val>=85||180-2*val<10)return QT.Q14();const v=R(0,1),A=[40,125],B=[200,125],C=[120,25];
  const sv=svg(poly([A,B,C],tk(A,C)+tk(B,C))+vlabs([A,B,C],[E_(a,b),E_(a-1,d),v?'?':''],30));
  return{v:'Q14.'+v,svg:sv,q:v?`The base angles of this isosceles triangle are ${E_(a,b)} and ${E_(a-1,d)}. Find the apex angle marked ?`:`The base angles of this isosceles triangle are ${E_(a,b)} and ${E_(a-1,d)}. Find <b>x</b>.`,ans:v?180-2*val:x,ex:`Base angles are equal: ${ex_(a,b)} = ${ex_(a-1,d)} → x = ${x}. Each base angle = ${val}°${v?`, apex = 180 − 2 × ${val} = ${180-2*val}°`:''}`};},
 Q15(){const x=R(8,25),c=R(1,3),e=R(1,3),d=R(5,30),f2=R(5,30),a=c+e+1,b=d+f2-x,v=R(0,1);if(a*x+b<=0||a*x+b>=170)return QT.Q15();
  const A=[30,125],B=[170,125],C=[120,30];
  const s=poly([A,B,C])+line(B,[225,125])+tx(46,118,E_(c,d))+tx(110,56,E_(e,f2))+tx(190,108,E_(a,b),v===1);
  return{v:'Q15.'+v,svg:svg(s),q:v?`The exterior angle is ${E_(a,b)} and the two opposite interior angles are ${E_(c,d)} and ${E_(e,f2)}. Find the <b>exterior angle</b> in degrees.`:`The exterior angle is ${E_(a,b)} and the two opposite interior angles are ${E_(c,d)} and ${E_(e,f2)}. Find <b>x</b>.`,ans:v?a*x+b:x,ex:`Exterior = sum of the opposite interior angles: ${ex_(a,b)} = ${ex_(c+e,d+f2)} → x = ${x}${v?`, so the angle is ${a*x+b}°`:''}`};}
});

const PAR=[[55,35],[215,35],[185,125],[25,125]];
Object.assign(QT,{
 Q16(){const v=R(0,2);
  if(v===0){const a=R(5,8)*10;return{v:'Q16.0',svg:svg(poly(PAR,tk(PAR[0],PAR[1])+tk(PAR[3],PAR[2]))+vlabs(PAR,['','',a+'°','?'].map((t,i)=>i===2?t:i===0?'?':''))),q:`ABCD is a parallelogram. Find the angle marked ? (opposite to the ${a}° angle).`,ans:a,ex:`Opposite angles of a parallelogram are equal: ${a}°`};}
  if(v===1){const a=R(5,8)*10;return{v:'Q16.1',svg:svg(poly(PAR,tk(PAR[0],PAR[1])+tk(PAR[3],PAR[2]))+vlabs(PAR,[a+'°','?','',''])),q:`ABCD is a parallelogram. The angle at A is ${a}°. Find the <b>adjacent</b> angle at B marked ?`,ans:180-a,ex:`Adjacent angles of a parallelogram add to 180°: 180 − ${a} = ${180-a}°`};}
  const x=R(10,30),a=R(2,4),c=a+1,b=R(x+5,x+40),d=b-x;return{v:'Q16.2',svg:svg(poly(PAR,tk(PAR[0],PAR[1]))+vlabs(PAR,[E_(c,d),'',E_(a,b),''])),q:`ABCD is a parallelogram. The opposite angles are ${E_(a,b)} and ${E_(c,d)}. Find <b>x</b>.`,ans:x,ex:`Opposite angles are equal: ${ex_(a,b)} = ${ex_(c,d)} → x = ${x}`};},
 Q17(){const v=R(0,1),K=[[120,15],[190,70],[120,135],[50,70]];
  if(v===0){const a=R(7,13)*10,t=R(4,8)*10,u=360-2*a-t;if(u<20||u>150)return QT.Q17();return{v:'Q17.0',svg:svg(poly(K,tk(K[0],K[1])+tk(K[0],K[3]))+vlabs(K,[t+'°',a+'°','?',a+'°'])),q:`ABCD is a kite. Find the angle marked ?`,ans:u,ex:`The two side angles are equal. 360 − ${a} − ${a} − ${t} = ${u}°`};}
  const x=R(10,30),b=R(5,20),a=2,d=b+x+0;const A=a*x+b,Bv=3*x+(b-x);return{v:'Q17.1',svg:svg(poly(K,tk(K[0],K[1])+tk(K[0],K[3]))+vlabs(K,['',E_(2,b),'',E_(3,b-x)])),q:`ABCD is a kite. The two equal angles are ${E_(2,b)} and ${E_(3,b-x)}. Find <b>x</b>.`,ans:x,ex:`Equal angles: ${ex_(2,b)} = ${ex_(3,b-x)} → x = ${x}`};},
 Q18(){const v=R(0,1),T=[[60,35],[180,35],[215,125],[25,125]];
  if(v===0){const a=R(6,13)*10;return{v:'Q18.0',svg:svg(poly(T)+tx(120,25,'∥∥')+vlabs(T,[a+'°','','','?'])),q:`ABCD is a trapezium with AB parallel to DC. Find the angle marked ?`,ans:180-a,ex:`Co-interior angles between parallel lines add to 180°: 180 − ${a} = ${180-a}°`};}
  const b=R(5,8)*10;return{v:'Q18.1',svg:svg(poly(T,tk(T[0],T[3])+tk(T[1],T[2]))+vlabs(T,['?','',b+'°',''])),q:`ABCD is an <b>isosceles</b> trapezium (AD = BC). The angle at C is ${b}°. Find the angle at A (marked ?).`,ans:180-b,ex:`Angles on the same leg add to 180°: 180 − ${b} = ${180-b}°`};},
 Q19(){const v=R(0,2),Rh=[[120,15],[200,80],[120,145],[40,80]];
  if(v===0){const a=R(3,8)*20;return{v:'Q19.0',svg:svg(poly(Rh,tk(Rh[0],Rh[1])+tk(Rh[1],Rh[2]))+line(Rh[0],Rh[2],'par')+tx(92,48,a+'°')+tx(146,50,'?',true)),q:`ABCD is a rhombus. The angle at A is ${a}° and the diagonal AC bisects it. Find the angle marked ?`,ans:a/2,ex:`The diagonal bisects the angle: ${a} ÷ 2 = ${a/2}°`};}
  if(v===1){return{v:'Q19.1',svg:svg(poly(Rh)+line(Rh[0],Rh[2],'par')+line(Rh[1],Rh[3],'par')+tx(135,72,'?',true)),q:`The diagonals of a rhombus cross. Find the angle marked ? where they meet.`,ans:90,ex:`The diagonals of a rhombus cross at right angles: 90°`};}
  const d=R(2,8)*5;return{v:'Q19.2',svg:svg(poly(Rh)+line(Rh[0],Rh[2],'par')+tx(142,46,d+'°')+tx(94,50,'?',true)),q:`ABCD is a rhombus. The diagonal AC makes an angle of ${d}° with AB. Find the whole angle DAB.`,ans:2*d,ex:`The diagonal bisects the angle: 2 × ${d} = ${2*d}°`};},
 Q20(){const v=R(0,1),S=pick([[1,2,3,4],[1,2,3,6],[2,3,3,4],[1,1,2,2],[1,2,4,5]]),sum=S.reduce((a,b)=>a+b,0);if(360%sum)return QT.Q20();const x=360/sum,Q=[[40,30],[200,40],[215,125],[30,120]];
  return{v:'Q20.'+v,svg:svg(poly(Q)+vlabs(Q,S.map(k=>(k===1?'':k)+'x°'))),q:v?`The angles of a quadrilateral are ${S.map(k=>(k===1?'':k)+'x°').join(', ')}. Find the <b>largest</b> angle.`:`The angles of a quadrilateral are ${S.map(k=>(k===1?'':k)+'x°').join(', ')}. Find <b>x</b>.`,ans:v?x*Math.max(...S):x,ex:`${sum}x = 360 → x = ${x}${v?`, largest = ${Math.max(...S)} × ${x} = ${x*Math.max(...S)}°`:''}`};},
 Q21(){const v=R(0,2),O=[120,80],pts=[CP(100),CP(20),CP(-60),CP(200)];
  const base=circ(`<polygon points="${pts.map(p=>p.map(f).join(',')).join(' ')}" fill="none" stroke="#364fc7" stroke-width="3"/>`);
  if(v===0||v===2){const a=R(6,12)*10;return{v:'Q21.'+v,svg:svg(base+vtxt(pts[0],O,v?'':a+'°',false,18)+vtxt(pts[2],O,v?'':'?',true,18)+(v?vtxt(pts[1],O,a+'°',false,18)+vtxt(pts[3],O,'?',true,18):'')),q:`ABCD is a <b>cyclic quadrilateral</b> (all four corners on the circle). Find the angle marked ? (it is opposite the ${a}° angle).`,ans:180-a,ex:`Opposite angles in a cyclic quadrilateral add to 180°: 180 − ${a} = ${180-a}°`};}
  const x=R(10,30),a=R(2,4),b=R(5,25),c=a+1,dd=180-b-(a+c)*x;if(dd<-60||dd>70)return QT.Q21();
  return{v:'Q21.1',svg:svg(base+vtxt(pts[0],O,E_(a,b),false,22)+vtxt(pts[2],O,E_(c,dd),false,22)),q:`ABCD is a cyclic quadrilateral. Opposite angles are ${E_(a,b)} and ${E_(c,dd)}. Find <b>x</b>.`,ans:x,ex:`Opposite angles add to 180°: ${ex_(a,b)} + ${ex_(c,dd)} = 180 → ${a+c}x = ${180-b-dd} → x = ${x}`};},
 Q22(){const v=R(0,1),x=R(10,30),a=R(2,4),c=a-1,b=R(5,20),d=b+x,cx=120,cy=80,ang=R(4,7)*10;
  const s=line(P(cx,cy,90,0),P(cx,cy,90,180))+line(P(cx,cy,90,ang),P(cx,cy,90,ang+180))+arc(cx,cy,22,0,ang)+lab(cx,cy,44,0,ang,E_(a,b))+arc(cx,cy,22,180,180+ang)+lab(cx,cy,44,180,180+ang,E_(c,d));
  return{v:'Q22.'+v,svg:svg(s),q:v?`Two straight lines cross. The vertically opposite angles are ${E_(a,b)} and ${E_(c,d)}. Find the <b>size of the angle</b> in degrees.`:`Two straight lines cross. The vertically opposite angles are ${E_(a,b)} and ${E_(c,d)}. Find <b>x</b>.`,ans:v?a*x+b:x,ex:`Vertically opposite angles are equal: ${ex_(a,b)} = ${ex_(c,d)} → x = ${x}${v?`; angle = ${a*x+b}°`:''}`};},
 Q23(){const v=R(0,2),cx=120,cy=125;
  if(v===0){return{v:'Q23.0',svg:svg(fan(cx,cy,[0,30,90,180],['x°','2x°','3x°'],-1,{r:[26,34,26]})),q:`Three angles lie on a straight line: x°, 2x° and 3x°. Find <b>x</b>.`,ans:30,ex:`6x = 180 → x = 30`};}
  const k=R(0,8)*6,x=(180-k)/6;const t=[x,2*x,3*x+k];return{v:'Q23.'+v,svg:svg(line([cx-100,cy],[cx+100,cy])+line([cx,cy],P(cx,cy,90,t[0]))+line([cx,cy],P(cx,cy,90,t[0]+t[1]))+arc(cx,cy,26,0,t[0])+lab(cx,cy,46,0,t[0],'x°')+arc(cx,cy,34,t[0],t[0]+t[1])+lab(cx,cy,56,t[0],t[0]+t[1],'2x°')+arc(cx,cy,26,t[0]+t[1],180)+lab(cx,cy,46,t[0]+t[1],180,E_(3,k))),q:v===1?`Three angles on a straight line are x°, 2x° and ${E_(3,k)}. Find <b>x</b>.`:`Three angles on a straight line are x°, 2x° and ${E_(3,k)}. Find the <b>largest</b> angle.`,ans:v===1?x:3*x+k,ex:`6x + ${k} = 180 → x = ${x}${v===2?`; largest = 3 × ${x} + ${k} = ${3*x+k}°`:''}`};},
 Q24(){const v=R(0,2),cx=120,cy=80;
  if(v===0){const C=[1,2,3,4],t=[36,72,108,144];return{v:'Q24.0',svg:svg(around(cx,cy,t,['x°','2x°','3x°','4x°'],-1,24,44)),q:`Four angles around a point are x°, 2x°, 3x° and 4x°. Find <b>x</b>.`,ans:36,ex:`10x = 360 → x = 36`};}
  const S=pick([[1,1,2,2,0],[1,2,3,0,0],[2,3,4,0,0]]),nums=S.filter(k=>k>0),sum=nums.reduce((a,b)=>a+b,0),c=pick([0,30,60,90,120].filter(c=>(360-c)%sum===0&&(360-c)/sum>=10));if(c===undefined)return QT.Q24();
  const x=(360-c)/sum,angs=nums.map(k=>k*x);angs[angs.length-1]+=c;const labs=nums.map((k,i)=>(k===1?'':k)+'x'+(i===nums.length-1&&c?'+'+c:'')+'°');
  return{v:'Q24.'+v,svg:svg(around(cx,cy,angs,labs,-1,24,46)),q:v===1?`The angles around a point are ${labs.join(', ')}. Find <b>x</b>.`:`The angles around a point are ${labs.join(', ')}. Find the <b>largest</b> angle.`,ans:v===1?x:Math.max(...angs),ex:`${sum}x${c?' + '+c:''} = 360 → x = ${x}${v===2?`; largest = ${Math.max(...angs)}°`:''}`};},
 Q25(){const t=pick(['corr','alt','co']),x=R(10,30),phi=60,y1=45,y2=115,cx1=110,cx2=cx1-(y2-y1)/Math.tan(rad(phi));
  let a,b,c,d,q,ex;
  if(t==='co'){a=R(2,4);c=a;b=R(5,20);d=180-b-(a+c)*x;if(d<-40||d>60)return QT.Q25();}
  else{a=R(2,4);c=a-1;b=R(5,20);d=b+x;}
  const wedge=w=>({UR:[0,phi],UL:[phi,180],LL:[180,180+phi],LR:[180+phi,360]}[w]);
  const pl=(cx,cy,w,txt)=>{const[a0,a1]=wedge(w);return arc(cx,cy,18,a0,a1)+lab(cx,cy,38,a0,a1,txt);};
  let top,bot;if(t==='corr'){top='UR';bot='UR';}else if(t==='alt'){top='LR';bot='UL';}else{top='LR';bot='UR';}
  const s=line([10,y1],[230,y1],'par')+line([10,y2],[230,y2],'par')+line(P(cx2,y2,46,phi+180),P(cx1,y1,46,phi))+pl(cx1,y1,top,E_(a,b))+pl(cx2,y2,bot,E_(t==='co'?c:c,d));
  const nm={corr:'corresponding',alt:'alternate',co:'co-interior'}[t];
  return{v:'Q25.'+t,svg:svg(s),q:`The two horizontal lines are parallel. The ${nm} angles are ${E_(a,b)} and ${E_(c,d)}. Find <b>x</b>.`,ans:x,ex:t==='co'?`Co-interior angles add to 180°: ${ex_(a,b)} + ${ex_(c,d)} = 180 → x = ${x}`:`${nm[0].toUpperCase()+nm.slice(1)} angles are equal: ${ex_(a,b)} = ${ex_(c,d)} → x = ${x}`};},
 Q26(){const v=R(0,2),A=[120,30],B=[40,120],C=[200,120],D=[20,30],E=[230,30];
  const base=line(D,E,'par')+line(B,C,'par')+poly([A,B,C]).replace('class="an-poly"','class="an-poly" style="fill:none"');
  const b=R(3,7)*10,c=R(3,7)*10;
  if(v===0)return{v:'Q26.0',svg:svg(base+tx(78,52,b+'°')+tx(168,52,c+'°')+tx(120,62,'?',true)),q:`DE is parallel to BC. Angle DAB = ${b}° and angle EAC = ${c}°. Find the angle BAC marked ?`,ans:180-b-c,ex:`Alternate angles: angle B = ${b}°, angle C = ${c}°. Angle A = 180 − ${b} − ${c} = ${180-b-c}°`};
  if(v===1)return{v:'Q26.1',svg:svg(base+tx(74,52,'?',true)+tx(56,112,b+'°')+tx(190,112,c+'°')),q:`DE is parallel to BC. Angle ABC = ${b}° and angle ACB = ${c}°. Find the angle DAB marked ?`,ans:b,ex:`Alternate angles are equal: angle DAB = angle ABC = ${b}°`};
  return{v:'Q26.2',svg:svg(base+tx(74,52,b+'°')+tx(190,112,'?',true)+tx(120,62,c+'°')),q:`DE is parallel to BC. Angle DAB = ${b}° and angle BAC = ${c}°. Find the angle ACB marked ?`,ans:180-b-c,ex:`Angle ABC = ${b}° (alternate). Angle ACB = 180 − ${b} − ${c} = ${180-b-c}°`};}
});

const rpoly=(n,r=58,cx=120,cy=82,rot=90)=>Array.from({length:n},(_,i)=>P(cx,cy,r,rot+i*360/n).map(f));
Object.assign(QT,{
 Q27(){const n=pick([5,6,7]),S=(n-2)*180;let g;do{g=Array.from({length:n-1},()=>R(8,16)*10);}while(S-g.reduce((a,b)=>a+b,0)<70||S-g.reduce((a,b)=>a+b,0)>175);const u=S-g.reduce((a,b)=>a+b,0),pts=rpoly(n);
  return{v:'Q27.'+n,svg:svg(poly(pts)+vlabs(pts,[...g.map(x=>x+'°'),'?'],20)),q:`This ${{5:'pentagon',6:'hexagon',7:'heptagon'}[n]} has the interior angles shown (not drawn accurately). Find the angle marked ?`,ans:u,ex:`Interior angles add to (${n} − 2) × 180 = ${S}°. ${S} − (${g.join(' + ')}) = ${u}°`};},
 Q28(){const v=R(0,3);
  if(v===0){const e=pick([40,36,30,24,20,18,15,12,10]);return{v:'Q28.0',svg:big('⬡'),q:`Each <b>exterior</b> angle of a regular polygon is <b>${e}°</b>. How many sides does it have?`,ans:360/e,ex:`360 ÷ ${e} = ${360/e}`};}
  if(v===1){const i=pick([120,135,140,144,150,156,160,162,165,168]);return{v:'Q28.1',svg:big('⬡'),q:`Each <b>interior</b> angle of a regular polygon is <b>${i}°</b>. How many sides does it have?`,ans:360/(180-i),ex:`Exterior = 180 − ${i} = ${180-i}°. Sides = 360 ÷ ${180-i} = ${360/(180-i)}`};}
  if(v===2){const n=pick([7,8,9,10,12,14,15]);return{v:'Q28.2',svg:big('⬡'),q:`The interior angles of a polygon add up to <b>${(n-2)*180}°</b>. How many sides does it have?`,ans:n,ex:`(n − 2) × 180 = ${(n-2)*180} → n − 2 = ${n-2} → n = ${n}`};}
  const k=pick([2,3,4,5,8]);return{v:'Q28.3',svg:big('⬡'),q:`In a regular polygon each interior angle is <b>${k} times</b> the exterior angle. How many sides does it have?`,ans:360/(180/(k+1)),ex:`Interior + exterior = 180°, so exterior = 180 ÷ ${k+1} = ${180/(k+1)}°. Sides = 360 ÷ ${180/(k+1)} = ${360/(180/(k+1))}`};},
 Q29(){let g;do{g=Array.from({length:4},()=>R(4,14)*10);}while(360-g.reduce((a,b)=>a+b,0)<30||360-g.reduce((a,b)=>a+b,0)>140);const u=360-g.reduce((a,b)=>a+b,0),pts=rpoly(5);
  return{v:'Q29.0',svg:svg(poly(pts)+vlabs(pts,[...g.map(x=>x+'°'),'?'],-18)),q:`The <b>exterior</b> angles of a pentagon are shown. Find the one marked ?`,ans:u,ex:`Exterior angles add to 360°: 360 − (${g.join(' + ')}) = ${u}°`};},
 Q30(){const n=pick([4,5,6,10,12]),v=R(0,1),pts=rpoly(n),I=(n-2)*180/n,nm={4:'square',5:'regular pentagon',6:'regular hexagon',10:'regular decagon',12:'regular 12-sided polygon'}[n];
  const a=(180-I)/2;if(!Number.isInteger(a))return QT.Q30();
  const s=poly(pts)+line(pts[0],pts[2],'par')+(v===0?vtxt(pts[0],cen(pts),'?',true,26):vtxt(pts[2],cen(pts),'?',true,26));
  return{v:'Q30.'+v,svg:svg(s),q:v===0?`ABC… is a ${nm}. The diagonal AC is drawn. Find angle <b>BAC</b> (marked ? at A, between side AB and the diagonal).`:`ABC… is a ${nm}. The diagonal AC is drawn. Find angle <b>ACD</b> (marked ? at C, between the diagonal and side CD).`,ans:v===0?a:I-a,ex:`Interior angle = ${I}°. Triangle ABC is isosceles: angle BAC = (180 − ${I}) ÷ 2 = ${a}°${v?`, so angle ACD = ${I} − ${a} = ${I-a}°`:''}`};},
 Q31(){const v=R(0,3);
  if(v===0){const r=pick([[1,2,3],[2,3,4],[1,1,2],[3,4,5],[2,2,5],[1,3,5]]),s=r.reduce((a,b)=>a+b,0);if(180%s)return QT.Q31();const u=180/s,big_=R(0,1);return{v:'Q31.0',svg:svg(poly(TRI)+tx(120,148,r.join(' : '))),q:`The angles of a triangle are in the ratio <b>${r.join(' : ')}</b>. Find the ${big_?'<b>largest</b>':'<b>smallest</b>'} angle.`,ans:u*(big_?Math.max(...r):Math.min(...r)),ex:`${s} parts = 180° → 1 part = ${u}°. ${big_?'Largest':'Smallest'} = ${big_?Math.max(...r):Math.min(...r)} × ${u} = ${u*(big_?Math.max(...r):Math.min(...r))}°`};}
  if(v===1){const r=pick([[1,2],[2,3],[1,5],[3,7],[1,3],[4,5],[2,7]]),s=r[0]+r[1];if(180%s)return QT.Q31();const u=180/s,b=R(0,1);return{v:'Q31.1',svg:svg(fan(120,125,[0,r[0]*u,180],[r[0]+(r[0]>1?' parts':' part'),r[1]+(r[1]>1?' parts':' part')],-1,{r:[28,28]})+line([20,125],[220,125])),q:`Two angles on a straight line are in the ratio <b>${r.join(' : ')}</b>. Find the ${b?'<b>larger</b>':'<b>smaller</b>'} angle.`,ans:u*(b?Math.max(...r):Math.min(...r)),ex:`${s} parts = 180° → 1 part = ${u}°. ${b?Math.max(...r):Math.min(...r)} × ${u} = ${u*(b?Math.max(...r):Math.min(...r))}°`};}
  if(v===2){const r=pick([[1,2,3,4],[1,2,3,6],[2,3,3,4],[1,1,2,2]]),s=r.reduce((a,b)=>a+b,0),u=360/s;if(360%s)return QT.Q31();return{v:'Q31.2',svg:big('⬜'),q:`The angles of a quadrilateral are in the ratio <b>${r.join(' : ')}</b>. Find the <b>largest</b> angle.`,ans:u*Math.max(...r),ex:`${s} parts = 360° → 1 part = ${u}°. ${Math.max(...r)} × ${u} = ${u*Math.max(...r)}°`};}
  const r=pick([[1,2,3],[2,3,4],[1,2,3,6],[1,1,2],[3,4,5]]),s=r.reduce((a,b)=>a+b,0);if(360%s)return QT.Q31();const u=360/s;return{v:'Q31.3',svg:big('⭕'),q:`The angles around a point are in the ratio <b>${r.join(' : ')}</b>. Find the <b>smallest</b> angle.`,ans:u*Math.min(...r),ex:`${s} parts = 360° → 1 part = ${u}°. ${Math.min(...r)} × ${u} = ${u*Math.min(...r)}°`};}
});

const O_=[120,80],ln_=(a,b,c)=>line(a,b,c),tt=(p,q,t,u,d=20)=>vtxt(p,q,t,u,d);
function circ2(cx,cy,r){return`<circle cx="${cx}" cy="${cy}" r="${r}" class="an-poly" style="fill:#fff"/>`;}
Object.assign(QT,{
 Q32(){const v=R(0,2);
  const mk=(c)=>{const A=CP(270-c/2),B=CP(270+c/2),C=CP(90);return{A,B,C,s:circ()+ln_(O_,A)+ln_(O_,B)+ln_(C,A)+ln_(C,B)+dot(O_,'O',8,-6)+dot(A,'A',-8,6)+dot(B,'B',8,6)+dot(C,'C',0,-6)};};
  if(v===0){const c=R(4,15)*10,m=mk(c);return{v:'Q32.0',svg:svg(m.s+tx(120,106,c+'°')+tx(120,38,'?',true)),q:`O is the centre of the circle. The angle at the centre AOB is ${c}°. Find the angle ACB at the circumference (marked ?).`,ans:c/2,ex:`The angle at the centre is twice the angle at the circumference: ${c} ÷ 2 = ${c/2}°`};}
  if(v===1){const a=R(2,8)*10,m=mk(2*a);return{v:'Q32.1',svg:svg(m.s+tx(120,106,'?',true)+tx(120,38,a+'°')),q:`O is the centre of the circle. The angle at the circumference ACB is ${a}°. Find the angle AOB at the centre (marked ?).`,ans:2*a,ex:`Angle at the centre = 2 × angle at the circumference = 2 × ${a} = ${2*a}°`};}
  const x=R(10,30),d=R(10,30),b=2*d-x,m=mk(2*(x+d)>170?100:2*(x+d));return{v:'Q32.2',svg:svg(m.s+tx(120,106,E_(3,b))+tx(120,38,E_(1,d))),q:`O is the centre. The angle at the centre is ${E_(3,b)} and the angle at the circumference is ${E_(1,d)} (standing on the same arc). Find <b>x</b>.`,ans:x,ex:`Centre = 2 × circumference: ${ex_(3,b)} = 2(x + ${d}) → x = ${x}`};},
 Q33(){const v=R(0,2),A=CP(180),B=CP(0),C=CP(R(50,130)),base=circ()+ln_(A,B)+ln_(A,C)+ln_(B,C)+dot(A,'A',-8,6)+dot(B,'B',8,6)+dot(C,'C',0,-8)+dot(O_,'O',0,16);
  if(v===0){const a=R(2,7)*10;return{v:'Q33.0',svg:svg(base+tx(A[0]+30,A[1]-3,a+'°')+tx(B[0]-30,B[1]-3,'?',true)),q:`AB is a <b>diameter</b>. Find the angle at B marked ?`,ans:90-a,ex:`The angle in a semicircle is 90°. Angles in triangle ABC: 180 − 90 − ${a} = ${90-a}°`};}
  if(v===1)return{v:'Q33.1',svg:svg(base+tx(C[0],C[1]+22,'?',true)),q:`AB is a <b>diameter</b> of the circle. Find the angle ACB marked ?`,ans:90,ex:`The angle in a semicircle is always 90°`};
  const x=R(5,22),p=R(5,15),q=90-3*x-p;if(q<0)return QT.Q33();return{v:'Q33.2',svg:svg(base+tx(A[0]+34,A[1]-3,E_(1,p))+tx(B[0]-34,B[1]-3,E_(2,q))),q:`AB is a diameter. The angles at A and B are ${E_(1,p)} and ${E_(2,q)}. Find <b>x</b>.`,ans:x,ex:`Angle ACB = 90°, so the other two angles add to 90°: ${ex_(1,p)} + ${ex_(2,q)} = 90 → x = ${x}`};},
 Q34(){const v=R(0,1),c=R(2,15)*10,A=CP(270-c/2),B=CP(270+c/2),base=circ()+ln_(O_,A)+ln_(O_,B)+ln_(A,B)+tk(O_,A)+tk(O_,B)+dot(O_,'O',0,-6)+dot(A,'A',-8,6)+dot(B,'B',8,6);
  if(v===0)return{v:'Q34.0',svg:svg(base+tx(120,102,c+'°')+tx(A[0]+16,A[1]-6,'?',true)),q:`O is the centre. OA and OB are radii. Angle AOB = ${c}°. Find the angle OAB marked ?`,ans:(180-c)/2,ex:`OA = OB (radii), so triangle OAB is isosceles: (180 − ${c}) ÷ 2 = ${(180-c)/2}°`};
  const b=(180-c)/2;return{v:'Q34.1',svg:svg(base+tx(120,102,'?',true)+tx(A[0]+16,A[1]-6,b+'°')),q:`O is the centre. OA and OB are radii. Angle OAB = ${b}°. Find the angle AOB marked ?`,ans:c,ex:`Triangle OAB is isosceles: 180 − ${b} − ${b} = ${c}°`};},
 Q35(){const v=R(0,1),A=CP(210),B=CP(330),C=CP(60),D=CP(125),a=R(2,8)*10,base=circ()+ln_(C,A)+ln_(C,B)+ln_(D,A)+ln_(D,B)+dot(A,'A',-8,8)+dot(B,'B',8,8)+dot(C,'C',8,-4)+dot(D,'D',-8,-4);
  if(v===0)return{v:'Q35.0',svg:svg(base+tx(C[0]-2,C[1]+24,a+'°')+tx(D[0]-8,D[1]+30,'?',true)),q:`A, B, C and D are on the circle. Angle ACB = ${a}°. Find the angle ADB marked ?`,ans:a,ex:`Angles in the same segment are equal: ${a}°`};
  return{v:'Q35.1',svg:svg(base+ln_(O_,A)+ln_(O_,B)+tx(120,104,2*a+'°')+tx(D[0]-8,D[1]+30,'?',true)),q:`O is the centre. Angle AOB = ${2*a}°. Find the angle ADB at the circumference marked ?`,ans:a,ex:`Angle at the circumference = ${2*a} ÷ 2 = ${a}°`};},
 Q36(){const v=R(0,2),A=[58,80],T=[58,18];
  const base=circ2(120,80,62)+`<line x1="58" y1="8" x2="58" y2="150" class="an-l par"/>`+dot(A,'A',-8,0)+dot([120,80],'O',0,16);
  if(v===0||v===2){const a=R(3,7)*10;return{v:'Q36.'+v,svg:svg(base+ln_([120,80],A)+ln_([120,80],T)+dot(T,'T',-8,0)+(v?tx(T[0]+30,T[1]+24,a+'°')+tx(112,70,'?',true):tx(112,70,a+'°')+tx(T[0]+30,T[1]+24,'?',true))),q:v?`TA is a <b>tangent</b> to the circle with centre O. Angle ATO = ${a}°. Find angle AOT marked ?`:`TA is a <b>tangent</b> to the circle with centre O. Angle AOT = ${a}°. Find angle ATO marked ?`,ans:90-a,ex:`A tangent meets the radius at 90°, so in triangle OAT: 180 − 90 − ${a} = ${90-a}°`};}
  const c=R(3,8)*10,B=CP(180+c);return{v:'Q36.1',svg:svg(base+ln_([120,80],A)+ln_([120,80],B)+ln_(A,B)+dot(B,'B',8,10)+tx(112,100,c+'°')+tx(A[0]+6,A[1]+28,'?',true)),q:`The line through A is a <b>tangent</b>. Angle AOB = ${c}°, where O is the centre. Find the angle between the tangent and the chord AB (marked ?).`,ans:c/2,ex:`Triangle OAB is isosceles, so angle OAB = (180 − ${c}) ÷ 2 = ${(180-c)/2}°. The tangent meets OA at 90°: 90 − ${(180-c)/2} = ${c/2}°`};},
 Q37(){const v=R(0,1),cx=150,cy=80,r=55,Pp=[10,80],d=cx-Pp[0],al=Math.acos(r/d),A=[cx+r*Math.cos(Math.PI-al),cy-r*Math.sin(Math.PI-al)].map(f),B=[cx+r*Math.cos(Math.PI+al),cy-r*Math.sin(Math.PI+al)].map(f),p=R(3,9)*10;
  const base=circ2(cx,cy,r)+ln_(Pp,A)+ln_(Pp,B)+dot(Pp,'P',0,-6)+dot(A,'A',-4,-8)+dot(B,'B',-4,14)+dot([cx,cy],'O',8,14)+tk(Pp,A)+tk(Pp,B);
  if(v===0)return{v:'Q37.0',svg:svg(base+ln_(A,B)+tx(36,84,p+'°')+tx(A[0]+4,A[1]+22,'?',true)),q:`PA and PB are <b>tangents</b> to the circle. Angle APB = ${p}°. Find angle PAB marked ?`,ans:(180-p)/2,ex:`Tangents from a point are equal, so triangle PAB is isosceles: (180 − ${p}) ÷ 2 = ${(180-p)/2}°`};
  return{v:'Q37.1',svg:svg(base+ln_([cx,cy],A)+ln_([cx,cy],B)+tx(36,84,p+'°')+tx(cx-14,cy+4,'?',true)),q:`PA and PB are <b>tangents</b> to the circle with centre O. Angle APB = ${p}°. Find angle AOB marked ?`,ans:180-p,ex:`Angles OAP and OBP are 90° (tangent ⟂ radius). Quadrilateral OAPB: 360 − 90 − 90 − ${p} = ${180-p}°`};},
 Q38(){const v=R(0,1),A=CP(270),B=CP(R(0,1)?330:210),C=CP(90),t=R(3,8)*10,base=circ()+`<line x1="10" y1="142" x2="230" y2="142" class="an-l par"/>`+ln_(A,B)+ln_(A,C)+ln_(B,C)+dot(A,'A',0,-6)+dot(B,'B',B[0]>120?8:-8,0)+dot(C,'C',0,-6);
  const sideX=B[0]>120?A[0]+28:A[0]-28;
  if(v===0)return{v:'Q38.0',svg:svg(base+tx(sideX,138,t+'°')+tx(C[0],C[1]+26,'?',true)),q:`The line at A is a <b>tangent</b>. The angle between the tangent and the chord AB is ${t}°. Find angle ACB marked ?`,ans:t,ex:`Alternate segment theorem: the angle between a tangent and a chord equals the angle in the alternate segment: ${t}°`};
  return{v:'Q38.1',svg:svg(base+tx(sideX,138,'?',true)+tx(C[0],C[1]+26,t+'°')),q:`The line at A is a <b>tangent</b>. Angle ACB = ${t}°. Find the angle between the tangent and the chord AB marked ?`,ans:t,ex:`Alternate segment theorem: they are equal: ${t}°`};},
 Q39(){const v=R(0,1),x=R(10,30),a=R(2,4),b=R(5,25),c=a+1,d=b-x,A=CP(270),B=CP(330),C=CP(90),base=circ()+`<line x1="10" y1="142" x2="230" y2="142" class="an-l par"/>`+ln_(A,B)+ln_(A,C)+ln_(B,C)+dot(A,'A',0,-6)+dot(B,'B',8,0)+dot(C,'C',0,-6);
  if(v===0)return{v:'Q39.0',svg:svg(base+tx(A[0]+34,138,E_(a,b))+tx(C[0],C[1]+26,E_(c,d))),q:`The line at A is a tangent. The angle between the tangent and chord AB is ${E_(a,b)} and the angle in the alternate segment is ${E_(c,d)}. Find <b>x</b>.`,ans:x,ex:`Alternate segment theorem: ${ex_(a,b)} = ${ex_(c,d)} → x = ${x}`};
  const dd=R(10,30),xx=R(10,30),b2=2*dd-xx;return{v:'Q39.1',svg:svg(circ()+ln_(O_,CP(220))+ln_(O_,CP(320))+ln_(CP(90),CP(220))+ln_(CP(90),CP(320))+tx(120,106,E_(3,b2))+tx(120,40,E_(1,dd))),q:`The angle at the centre is ${E_(3,b2)} and the angle at the circumference on the same arc is ${E_(1,dd)}. Find <b>x</b>.`,ans:xx,ex:`Centre = 2 × circumference: ${ex_(3,b2)} = 2(x + ${dd}) → x = ${xx}`};},
 Q40(){const v=R(0,1),b=v?R(19,35)*10:R(2,17)*10,A=[100,95],Bp=[A[0]+dir(b,62)[0],A[1]+dir(b,62)[1]],back=(b+180)%360;
  const north=p=>`<line x1="${p[0]}" y1="${p[1]}" x2="${p[0]}" y2="${p[1]-34}" class="an-l par"/>`+tx(p[0],p[1]-38,'N');
  return{v:'Q40.'+v,svg:svg(north(A)+north(Bp)+ln_(A,Bp)+dot(A,'A',-10,12)+dot(Bp,'B',10,12)+tx(A[0]+(b<180?22:-22),A[1]-30,b+'°')+tx(Bp[0]+(b<180?-24:24),Bp[1]-30,'?',true)),q:`The bearing of B from A is <b>${pad3(b)}°</b>. Find the bearing of <b>A from B</b>.`,ans:back,ex:`Back bearing: ${b<180?b+' + 180':b+' − 180'} = ${back}° → ${pad3(back)}°`};},
 Q41(){const v=R(0,1);
  if(v===0){const b1=R(1,16)*10,ang=R(4,15)*10,b2=(b1+180-ang+360)%360,A=[40,110],B=[A[0]+dir(b1,75)[0],A[1]+dir(b1,75)[1]];
   return{v:'Q41.0',svg:svg(`<line x1="${A[0]}" y1="${A[1]}" x2="${A[0]}" y2="${A[1]-34}" class="an-l par"/><line x1="${B[0]}" y1="${B[1]}" x2="${B[0]}" y2="${B[1]-34}" class="an-l par"/>`+ln_(A,B)+ln_(B,[B[0]+dir(b2,60)[0],B[1]+dir(b2,60)[1]])+dot(A,'A',-10,12)+dot(B,'B',10,12)+tx(B[0]+dir(b2,74)[0],B[1]+dir(b2,74)[1]+4,'C')),q:`A ship sails from A to B on a bearing of <b>${pad3(b1)}°</b>. At B it changes course and sails to C on a bearing of <b>${pad3(b2)}°</b>. Find the angle <b>ABC</b>.`,ans:ang,ex:`Back bearing of A from B = ${b1} + 180 = ${b1+180}°. Angle ABC = ${b1+180} − ${b2}${b2>b1+180?'':''} = ${ang}°`};}
  const b1=R(2,12)*10,d=R(3,12)*10,b3=b1+d;return{v:'Q41.1',svg:svg(`<line x1="120" y1="130" x2="120" y2="90" class="an-l par"/>`+tx(120,84,'N')+ln_([120,130],[120+dir(b1,70)[0],130+dir(b1,70)[1]])+ln_([120,130],[120+dir(b3,70)[0],130+dir(b3,70)[1]])+dot([120,130],'A',-10,12)),q:`From A, the bearing of B is <b>${pad3(b1)}°</b> and the bearing of C is <b>${pad3(b3)}°</b>. Find angle <b>BAC</b>.`,ans:d,ex:`${b3} − ${b1} = ${d}°`};}
});

const POOL=[['A1'],['A2'],['A2','A3'],['A4'],['A4','A5'],['A6'],['A7','A9'],['A8'],['A10'],['A8','A9','A10'],['A11','A12'],['A3','A5','A6','A7','A8','A9','A10','A11','A12'],
 ['Q1','Q2','Q3'],['Q4','Q5','Q6'],['Q7','Q8','Q9'],['Q10','Q11','Q12'],['Q13','Q14','Q15'],['Q16','Q17','Q18','Q19'],['Q20','Q22','Q23','Q24'],['Q25'],['Q26'],['Q27','Q29','Q30'],['Q28'],['Q31'],
 ['Q32','Q33','Q34','Q35'],['Q36','Q37','Q38','Q39'],['Q21','Q39'],['Q40','Q41'],
 ['Q1','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10','Q11','Q12','Q13','Q14','Q15','Q16','Q17','Q18','Q19','Q20','Q21','Q22','Q23','Q24','Q25','Q26','Q27','Q28','Q29','Q30','Q31','Q32','Q33','Q34','Q35','Q36','Q37','Q38','Q39','Q40','Q41']];
window.__an={QT,POOL};
REG.push({id:'angles',name:'Angle Hunter',emoji:'📐',color:'#0b7285',cat:'Geometry',
 desc:'GCSE angles: lines, triangles, quadrilaterals, parallel lines, polygons, ratios, circle theorems and bearings. Diagrams are drawn for you — find the missing angle!',skills:['angle rules','parallel lines','polygons','forming equations'],
 levels:['Estimate angles','Angles on a straight line','Straight line & around a point','Angles in a triangle','Isosceles triangles','Quadrilaterals','Crossing lines & exterior angles','Parallel lines','Polygons','Mixed angle rules','Angles with algebra','Boss mix',
  'Complementary, supplementary & reflex','Turns, clocks & compass','Angle facts & bisectors','Triangles II','Triangles with algebra','Quadrilaterals','Lines, points & quadrilaterals with algebra','Parallel lines with algebra','Parallel lines & triangles','Polygons II','How many sides?','Angles in ratios','Circle theorems 1 (H)','Circle theorems 2 (H)','Cyclic quadrilaterals (H)','Bearings','Boss 2 · GCSE mix'],
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
