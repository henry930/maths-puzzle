(function(){
const COL={red:'#e5484d',blue:'#2a6cc0',green:'#2eaa5e',yellow:'#f5b301'};
const fr=(n,d)=>{const g=gcd(n,d);return n/g+'/'+d/g;};
function bag(counts){
  const balls=[];Object.keys(counts).forEach(c=>{for(let i=0;i<counts[c];i++)balls.push(c)});shuffle(balls);
  const per=Math.min(6,Math.ceil(balls.length/2)),rows=Math.ceil(balls.length/per);
  let s=`<svg viewBox="0 0 ${per*36+16} ${rows*36+20}" class="ch-svg"><rect x="2" y="8" rx="16" width="${per*36+12}" height="${rows*36+10}" fill="#fff3d6" stroke="#b9904a" stroke-width="3"/>`;
  balls.forEach((c,i)=>{s+=`<circle cx="${22+(i%per)*36}" cy="${30+Math.floor(i/per)*36}" r="14" fill="${COL[c]}" stroke="#0003" stroke-width="1.5"/>`;});
  return s+'</svg>';
}
function spinner(vals,cols){
  const n=vals.length,R0=70;let s=`<svg viewBox="0 0 160 160" class="ch-svg sp">`;
  for(let i=0;i<n;i++){
    const a0=i/n*2*Math.PI-Math.PI/2,a1=(i+1)/n*2*Math.PI-Math.PI/2,am=(a0+a1)/2;
    s+=`<path d="M80 80L${80+R0*Math.cos(a0)} ${80+R0*Math.sin(a0)}A${R0} ${R0} 0 0 1 ${80+R0*Math.cos(a1)} ${80+R0*Math.sin(a1)}Z" fill="${cols?COL[cols[i]]:['#ffe3d3','#e1ecff'][i%2]}" stroke="#1f1a3d" stroke-width="2"/>`;
    if(vals[i]!=='')s+=`<text x="${80+48*Math.cos(am)}" y="${80+48*Math.sin(am)+6}" text-anchor="middle" font-size="18" font-weight="900" fill="${cols?'#fff':'#1f1a3d'}">${vals[i]}</text>`;
  }
  return s+'<circle cx="80" cy="80" r="5" fill="#1f1a3d"/></svg>';
}
function grid(hl){
  let h='<table class="ch-grid"><tr><th></th>'+[1,2,3,4,5,6].map(x=>`<th>${x}</th>`).join('')+'</tr>';
  for(let a=1;a<=6;a++){h+=`<tr><th>${a}</th>`;for(let b=1;b<=6;b++)h+=`<td class="${hl&&hl(a,b)?'hl':''}">${a+b}</td>`;h+='</tr>';}
  return h+'</table><div class="ch-cap">Two dice: sum of the two scores (rows = die 1, columns = die 2)</div>';
}
const isPrime=n=>[2,3,5,7,11].includes(n);
function bagCounts(minT,maxT,cols){const t=R(minT,maxT);const c={};let left=t;cols.forEach((k,i)=>{const x=i===cols.length-1?left:R(1,Math.max(1,left-(cols.length-1-i)));c[k]=x;left-=x;});return[c,t];}
const QT={
 T1(){const[c,t]=bagCounts(6,12,pick([['red','blue'],['red','blue','green']]));const col=pick(Object.keys(c));
  return{vis:bag(c),q:`A bag holds these balls. One ball is picked at random. What is the probability it is <b>${col}</b>?`,ans:c[col]/t,ex:`${c[col]} ${col} balls out of ${t} balls → ${c[col]}/${t} = ${fr(c[col],t)}`};},
 T2(){const[c,t]=bagCounts(7,12,['red','blue','green']);const col=pick(Object.keys(c));
  return{vis:bag(c),q:`What is the probability that the ball picked is <b>NOT ${col}</b>?`,ans:(t-c[col])/t,ex:`P(not ${col}) = 1 − ${c[col]}/${t} = ${t-c[col]}/${t} = ${fr(t-c[col],t)}`};},
 T3(){const[c,t]=bagCounts(8,14,['red','blue','green','yellow']);const k=Object.keys(c),a=pick(k),b=pick(k.filter(x=>x!==a));
  return{vis:bag(c),q:`What is the probability the ball is <b>${a}</b> or <b>${b}</b>?`,ans:(c[a]+c[b])/t,ex:`(${c[a]} + ${c[b]}) out of ${t} → ${c[a]+c[b]}/${t} = ${fr(c[a]+c[b],t)}`};},
 T4(){const n=pick([8,10,12]),vals=Array.from({length:n},(_,i)=>i+1);const o=pick([['even',x=>x%2===0],['odd',x=>x%2===1],['a prime number',isPrime],['a multiple of 3',x=>x%3===0],[`greater than ${n/2}`,x=>x>n/2],['less than 4',x=>x<4]]);
  const f=vals.filter(o[1]).length;return{vis:spinner(vals),q:`A fair spinner has ${n} equal sections. What is the probability it lands on <b>${o[0]}</b>?`,ans:f/n,ex:`${f} favourable sections out of ${n} → ${f}/${n} = ${fr(f,n)}`};},
 T5(){const k=R(3,11);let f=0;for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)if(a+b===k)f++;
  return{vis:grid(),q:`Two fair dice are thrown. What is the probability the total is <b>${k}</b>?`,ans:f/36,hl:(a,b)=>a+b===k,ex:`${f} cells show ${k} out of 36 → ${f}/36 = ${fr(f,36)}`};},
 T6(){const k=R(4,10),m=pick([0,1]);let f=0;const t=(a,b)=>m?a+b>=k:a+b<k;for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)if(t(a,b))f++;
  return{vis:grid(),q:`Two fair dice are thrown. What is the probability the total is <b>${m?'at least '+k:'less than '+k}</b>?`,ans:f/36,hl:(a,b)=>t(a,b),ex:`${f} cells out of 36 → ${f}/36 = ${fr(f,36)}`};},
 T7(){const o=pick([['both dice show the same number (a double)',(a,b)=>a===b],['the difference between the scores is 2',(a,b)=>Math.abs(a-b)===2],['the product of the scores is 12',(a,b)=>a*b===12],['both dice show a prime number',(a,b)=>isPrime(a)&&isPrime(b)],['the total is even',(a,b)=>(a+b)%2===0]]);
  let f=0;for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)if(o[1](a,b))f++;
  return{vis:grid(),q:`Two fair dice are thrown. What is the probability that <b>${o[0]}</b>? (Think of all 36 outcomes.)`,ans:f/36,hl:o[1],ex:`${f} favourable outcomes out of 36 → ${f}/36 = ${fr(f,36)}`};},
 T8(){const[c,t]=bagCounts(6,10,['red','blue']);return{vis:bag(c),q:`A ball is picked, its colour noted, and it is <b>put back</b>. Then a second ball is picked. What is the probability of <b>red then blue</b>?`,ans:c.red/t*c.blue/t,ex:`${c.red}/${t} × ${c.blue}/${t} = ${c.red*c.blue}/${t*t} = ${fr(c.red*c.blue,t*t)}`};},
 T9(){const[c,t]=bagCounts(6,10,['red','blue']);if(c.red<2)c.red=2,c.blue=t-2;const col=c.red>=2?'red':'blue';
  return{vis:bag(c),q:`Two balls are picked <b>without replacement</b> (the first is not put back). What is the probability both are <b>${col}</b>?`,ans:c[col]/t*(c[col]-1)/(t-1),ex:`${c[col]}/${t} × ${c[col]-1}/${t-1} = ${c[col]*(c[col]-1)}/${t*(t-1)} = ${fr(c[col]*(c[col]-1),t*(t-1))}`};},
 T10(){const n=pick([4,5,8,10]),k=R(1,n-1),N=pick([100,200,400,1000]);const cols=Array.from({length:n},(_,i)=>i<k?'red':'blue');
  return{vis:spinner(Array(n).fill(''),cols),q:`This fair spinner is spun <b>${N}</b> times. How many times would you <b>expect</b> it to land on red?`,ans:k/n*N,ex:`P(red) = ${k}/${n}, so expected = ${k}/${n} × ${N} = ${k/n*N}`};},
 T11(){const N=pick([20,25,40,50]),k=R(Math.round(N*.25),Math.round(N*.75));return{vis:'<div class="ch-big">🪙</div>',q:`A coin is flipped ${N} times and lands on heads ${k} times. What is the <b>relative frequency</b> of heads? (fraction or decimal)`,ans:k/N,ex:`${k}/${N} = ${fr(k,N)} = ${+(k/N).toFixed(3)}`};},
 T12(){const t=R(0,3);
  if(t===0){const p=pick([.2,.35,.4,.65,.7]);return{vis:'<div class="ch-big">🌦️</div>',q:`The probability that it rains is <b>${p}</b>. What is the probability that it does <b>not</b> rain? (decimal)`,ans:+(1-p).toFixed(2),ex:`1 − ${p} = ${+(1-p).toFixed(2)}`};}
  if(t===1){const a=pick([.1,.2,.25,.3]),b=pick([.15,.35,.4,.45]);return{vis:'<div class="ch-big">🎯</div>',q:`A and B are <b>mutually exclusive</b> events. P(A) = ${a} and P(B) = ${b}. Find P(A or B). (decimal)`,ans:+(a+b).toFixed(2),ex:`Add: ${a} + ${b} = ${+(a+b).toFixed(2)}`};}
  if(t===2){const a=pick([.2,.3,.4,.5,.6]),b=pick([.1,.5,.2,.3,.8]);return{vis:'<div class="ch-big">⚖️</div>',q:`A and B are <b>independent</b> events. P(A) = ${a} and P(B) = ${b}. Find P(A and B). (decimal)`,ans:+(a*b).toFixed(3),ex:`Multiply: ${a} × ${b} = ${+(a*b).toFixed(3)}`};}
  const w=pick([[3,5,2],[2,3,5],[4,3,3]]);const t2=w[0]+w[1]+w[2];return{vis:'<div class="ch-big">🍬</div>',q:`In a sweet jar the ratio of red : green : yellow is <b>${w.join(' : ')}</b>. What is the probability a random sweet is green?`,ans:w[1]/t2,ex:`${w[1]} parts out of ${w[0]}+${w[1]}+${w[2]} = ${t2} parts → ${fr(w[1],t2)}`};}
};
/* ===== Levels 13+ : GCSE listing / two-way / Venn / product rule (H) / tree diagrams ===== */
const dec=x=>+x.toFixed(4);
function chips(items,hl){return '<div class="ch-list">'+items.map(s=>`<span class="${hl&&hl(s)?'hl':''}">${s}</span>`).join('')+'</div>';}
function twt(rows,cols,m){
  const rt=m.map(r=>r[0]+r[1]),ct=[m[0][0]+m[1][0],m[0][1]+m[1][1]],T=rt[0]+rt[1];
  return `<table class="ch-grid ch-tw"><tr><th></th><th>${cols[0]}</th><th>${cols[1]}</th><th>Total</th></tr>`+
   [0,1].map(i=>`<tr><th>${rows[i]}</th><td>${m[i][0]}</td><td>${m[i][1]}</td><td><b>${rt[i]}</b></td></tr>`).join('')+
   `<tr><th>Total</th><td><b>${ct[0]}</b></td><td><b>${ct[1]}</b></td><td><b>${T}</b></td></tr></table>`;
}
function venn(nA,nB,a,b,c,d){
  return `<svg viewBox="0 0 280 170" class="ch-svg"><rect x="4" y="4" width="272" height="162" rx="10" fill="#fff" stroke="#1f1a3d" stroke-width="2"/>
  <circle cx="105" cy="88" r="58" fill="#ffd23f55" stroke="#1f1a3d" stroke-width="2"/><circle cx="175" cy="88" r="58" fill="#5aa9ff55" stroke="#1f1a3d" stroke-width="2"/>
  <text x="80" y="24" text-anchor="middle" font-size="13" font-weight="800" fill="#1f1a3d">${nA}</text><text x="200" y="24" text-anchor="middle" font-size="13" font-weight="800" fill="#1f1a3d">${nB}</text>
  <g font-size="20" font-weight="900" fill="#1f1a3d" text-anchor="middle"><text x="75" y="95">${a}</text><text x="140" y="95">${b}</text><text x="205" y="95">${c}</text><text x="252" y="152">${d}</text></g></svg>`;
}
function tree(p,qn,nm){
  const q=dec(1-p),L=(x,y,t,an)=>`<text x="${x}" y="${y}" font-size="12" font-weight="800" fill="#c2255c" text-anchor="${an||'middle'}">${t}</text>`;
  const ln=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1f1a3d" stroke-width="2"/>`;
  return `<svg viewBox="0 0 340 176" class="ch-svg">${ln(20,88,130,44)}${ln(20,88,130,132)}${ln(130,44,250,18)}${ln(130,44,250,66)}${ln(130,132,250,110)}${ln(130,132,250,158)}`+
   L(62,56,p)+L(62,128,q)+L(184,22,p)+L(184,70,q)+L(184,114,p)+L(184,162,q)+
   [['A A',18],['A B',66],['B A',110],['B B',158]].map(([t,y])=>L(256,y+4,t.replace(/A/g,nm[0]).replace(/B/g,nm[1]),'start')).join('')+
   `<text x="130" y="36" font-size="12" font-weight="900" text-anchor="middle" fill="#1f1a3d">Day 1</text></svg>`;
}
Object.assign(QT,{
 N1(){const S=[['a fair coin is flipped',2,'🪙'],['a fair dice is rolled',6,'🎲'],['a fair spinner with 3 equal sections is spun',3,'🎡'],['a fair spinner with 4 equal sections is spun',4,'🎡']];
  const a=pick(S),b=pick(S.filter(x=>x!==a&&x[2]!==a[2]));
  return{vis:`<div class="ch-big">${a[2]}${b[2]}</div>`,q:`${a[0][0].toUpperCase()+a[0].slice(1)} <b>and</b> ${b[0]}. Using a systematic list, how many different outcomes are there altogether? (whole number)`,ans:a[1]*b[1],extra:['pr-listing','pr-product-rule'],
   ex:`List them in order: each of the ${a[1]} outcomes of the first goes with ${b[1]} outcomes of the second → ${a[1]} × ${b[1]} = ${a[1]*b[1]}`};},
 N2(){const O=['HHH','HHT','HTH','HTT','THH','THT','TTH','TTT'];
  const V=pick([['exactly 2 heads',s=>(s.match(/H/g)||[]).length===2],['exactly 1 head',s=>(s.match(/H/g)||[]).length===1],['at least 2 heads',s=>(s.match(/H/g)||[]).length>=2],['at least one tail',s=>s.includes('T')],['all three the same',s=>/^(HHH|TTT)$/.test(s)]]);
  const f=O.filter(V[1]).length;
  return{vis:chips(O),rev:()=>chips(O,V[1]),q:`A fair coin is flipped <b>3 times</b>. The 8 possible outcomes are listed. What is the probability of getting <b>${V[0]}</b>?`,ans:f/8,extra:['pr-listing'],
   ex:`${f} of the 8 outcomes (${O.filter(V[1]).join(', ')}) → ${f}/8 = ${fr(f,8)}`};},
 N3(){const R_=pick([['Boys','Girls']]),C=pick([['Walk','Bus'],['French','Spanish'],['Tea','Coffee']]);
  let m;do{m=[[R(3,12),R(3,12)],[R(3,12),R(3,12)]];}while(0);const T=m[0][0]+m[0][1]+m[1][0]+m[1][1];
  const row=m.map(r=>r[0]+r[1]),col=[m[0][0]+m[1][0],m[0][1]+m[1][1]];
  const v=R(0,3),nm=['boy','girl'];let q,ans,ex,extra=['pr-two-way'];
  if(v===0){q=`One student is chosen at random. What is the probability the student is a <b>boy</b>?`;ans=row[0]/T;ex=`${row[0]} boys out of ${T} students → ${fr(row[0],T)}`;}
  else if(v===1){q=`One student is chosen at random. What is the probability the student is a <b>girl who chose ${C[1].toLowerCase()}</b>?`;ans=m[1][1]/T;ex=`${m[1][1]} girls chose ${C[1].toLowerCase()} out of ${T} students → ${fr(m[1][1],T)}`;}
  else if(v===2){q=`A <b>girl</b> is chosen at random. What is the probability she chose <b>${C[0].toLowerCase()}</b>?`;ans=m[1][0]/row[1];extra.push('pr-conditional');ex=`Only look at the girls: ${m[1][0]} of the ${row[1]} girls → ${fr(m[1][0],row[1])}`;}
  else{q=`A student who chose <b>${C[1].toLowerCase()}</b> is picked at random. What is the probability the student is a <b>boy</b>?`;ans=m[0][1]/col[1];extra.push('pr-conditional');ex=`Only look at the ${C[1].toLowerCase()} column: ${m[0][1]} of the ${col[1]} are boys → ${fr(m[0][1],col[1])}`;}
  return{vis:twt(R_,C,m),q,ans,ex,extra,k:'N3'};},
 N4(){const N=pick([['Cats','Dogs'],['Tea','Coffee'],['Maths','Physics']]),a=R(2,9),b=R(2,7),c=R(2,9),d=R(1,6),n=a+b+c+d;
  const v=R(0,4);let q,ans,ex,extra=['pr-venn'];
  if(v===0){q=`A student is chosen at random. What is P(<b>${N[0]}</b>)?`;ans=(a+b)/n;ex=`${a} + ${b} = ${a+b} in the ${N[0]} circle, out of ${n} → ${fr(a+b,n)}`;}
  else if(v===1){q=`What is the probability the student likes <b>both</b> ${N[0]} and ${N[1]}?`;ans=b/n;ex=`${b} in the overlap out of ${n} → ${fr(b,n)}`;}
  else if(v===2){q=`What is the probability the student likes <b>${N[0]} or ${N[1]}</b> (or both)?`;ans=(a+b+c)/n;ex=`${a} + ${b} + ${c} = ${a+b+c} inside the circles, out of ${n} → ${fr(a+b+c,n)}`;}
  else if(v===3){q=`What is the probability the student likes <b>neither</b>?`;ans=d/n;ex=`${d} outside both circles out of ${n} → ${fr(d,n)}`;}
  else{q=`A student who likes <b>${N[1]}</b> is chosen at random. What is the probability they also like <b>${N[0]}</b>?`;ans=b/(b+c);extra.push('pr-conditional');ex=`Only look inside the ${N[1]} circle: ${b} of the ${b+c} also like ${N[0]} → ${fr(b,b+c)}`;}
  return{vis:venn(N[0],N[1],a,b,c,d),q:`${n} students were asked which they like. ${q}`,ans,ex,extra,k:'N4'};},
 N5(){const t=pick([0,1,2]);let s,x,y,z,w;
  if(t===0){x=R(2,4);y=R(2,5);z=R(2,3);return{vis:'<div class="ch-big">🍽️</div>',q:`A café menu has <b>${x}</b> starters, <b>${y}</b> main courses and <b>${z}</b> desserts. A meal is one starter, one main and one dessert. How many different meals are possible? (whole number)`,ans:x*y*z,extra:['pr-product-rule'],ex:`${x} × ${y} × ${z} = ${x*y*z}`};}
  if(t===1){x=R(3,6);y=R(2,4);z=R(2,4);return{vis:'<div class="ch-big">👕</div>',q:`Sam has <b>${x}</b> T-shirts, <b>${y}</b> pairs of jeans and <b>${z}</b> hats. An outfit is one of each. How many different outfits can Sam make? (whole number)`,ans:x*y*z,extra:['pr-product-rule'],ex:`${x} × ${y} × ${z} = ${x*y*z}`};}
  x=R(2,5);y=R(2,5);return{vis:'<div class="ch-big">🛣️</div>',q:`There are <b>${x}</b> routes from town A to town B, and <b>${y}</b> routes from town B to town C. How many different routes are there from A to C via B? (whole number)`,ans:x*y,extra:['pr-product-rule'],ex:`${x} × ${y} = ${x*y}`};},
 N6(){const t=R(0,4);
  if(t===0){const k=pick([3,4]);return{vis:'<div class="ch-big">🔢</div>',q:`A PIN has <b>${k}</b> digits, each from 0 to 9. Digits <b>can be repeated</b>. How many different PINs are there? (whole number)`,ans:Math.pow(10,k),extra:['pr-codes','pr-product-rule','pr-repeats'],ex:`${Array(k).fill(10).join(' × ')} = ${Math.pow(10,k)}`};}
  if(t===1){const k=pick([3,4]),p=[10,9,8,7].slice(0,k);return{vis:'<div class="ch-big">🔢</div>',q:`A PIN has <b>${k}</b> digits, each from 0 to 9. All the digits must be <b>different</b>. How many different PINs are there? (whole number)`,ans:p.reduce((a,b)=>a*b,1),extra:['pr-codes','pr-product-rule','pr-no-repeats'],ex:`${p.join(' × ')} = ${p.reduce((a,b)=>a*b,1)} (one fewer choice each time)`};}
  if(t===2){const k=pick([2,3]);return{vis:'<div class="ch-big">🔐</div>',q:`A password is <b>one capital letter</b> (26 choices) followed by <b>${k} digits</b> (0–9). How many different passwords are there? (whole number)`,ans:26*Math.pow(10,k),extra:['pr-codes','pr-product-rule','pr-repeats'],ex:`26 × ${Array(k).fill(10).join(' × ')} = ${26*Math.pow(10,k)}`};}
  const n=pick([4,5]),k=pick([2,3]),rep=pick([0,1]),L='ABCDE'.slice(0,n),p=Array.from({length:k},(_,i)=>rep?n:n-i);
  return{vis:'<div class="ch-big">🔒</div>',q:`A lock code uses <b>${k}</b> letters chosen from <b>${L.split('').join(', ')}</b>. Letters ${rep?'<b>can</b> be used more than once':'<b>cannot</b> be repeated'}. How many different codes are there? (whole number)`,ans:p.reduce((a,b)=>a*b,1),extra:['pr-codes','pr-product-rule',rep?'pr-repeats':'pr-no-repeats'],ex:`${p.join(' × ')} = ${p.reduce((a,b)=>a*b,1)}`};},
 N7(){const t=R(0,2);const f=n=>{let r=1;for(let i=2;i<=n;i++)r*=i;return r;},ch=n=>Array.from({length:n},(_,i)=>n-i).join(' × ');
  if(t===0){const n=pick([3,4,5]);return{vis:'<div class="ch-big">🧍🧍🧍</div>',q:`<b>${n}</b> friends stand in a queue. In how many different orders can they stand? (whole number)`,ans:f(n),extra:['pr-arrangements'],ex:`${n} choices for first place, then ${n-1}, … → ${ch(n)} = ${f(n)}`};}
  if(t===1){const n=pick([4,5]);return{vis:'<div class="ch-big">📚</div>',q:`<b>${n}</b> different books are put on a shelf. The <b>maths book must be first</b> (on the left). In how many different ways can the books be arranged? (whole number)`,ans:f(n-1),extra:['pr-arrangements','pr-restricted'],ex:`The first place is fixed, so arrange the other ${n-1}: ${ch(n-1)} = ${f(n-1)}`};}
  const w=pick(['CAT','MATH','SHAPE']);return{vis:`<div class="ch-big" style="letter-spacing:6px">${w}</div>`,q:`How many different arrangements are there of all the letters in the word <b>${w}</b>? (All its letters are different.) (whole number)`,ans:f(w.length),extra:['pr-arrangements'],ex:`${w.length} letters: ${ch(w.length)} = ${f(w.length)}`};},
 N8(){const n=pick([4,5,6,7]),ans=n*(n-1)/2,t=R(0,2);
  const q=t===0?`<b>${n}</b> people meet at a party and every person shakes hands with every other person once. How many handshakes are there? (whole number)`:t===1?`In a league, each of <b>${n}</b> teams plays every other team <b>once</b>. How many matches are played? (whole number)`:`How many different pairs can be chosen from a group of <b>${n}</b> students? (whole number)`;
  return{vis:`<div class="ch-big">${t===0?'🤝':t===1?'⚽':'👫'}</div>`,q,ans,extra:['pr-pairs','pr-listing'],ex:`Each of the ${n} people pairs with ${n-1} others: ${n} × ${n-1} = ${n*(n-1)}, but each pair is counted twice → ${n*(n-1)} ÷ 2 = ${ans}`};},
 N9(){const t=R(0,2),P=[[1,2],[1,3],[2,3],[1,4],[3,4],[1,5],[2,5],[3,5],[1,6],[5,6]];
  if(t===0){const a=pick(P),b=pick(P);return{vis:'<div class="ch-big">⚖️</div>',q:`A and B are <b>independent</b> events. P(A) = ${a[0]}/${a[1]} and P(B) = ${b[0]}/${b[1]}. Find P(A and B). (fraction)`,ans:a[0]*b[0]/(a[1]*b[1]),extra:['pr-and','pr-independent','pr-fractions'],ex:`Multiply: ${a[0]}/${a[1]} × ${b[0]}/${b[1]} = ${a[0]*b[0]}/${a[1]*b[1]} = ${fr(a[0]*b[0],a[1]*b[1])}`};}
  if(t===1){const pr=[[1,4,1,6],[1,3,1,6],[1,2,1,5],[1,6,1,4],[2,5,1,3],[1,3,1,4],[1,5,1,4]],a=pick(pr);const n=a[0]*a[3]+a[2]*a[1],d=a[1]*a[3];
   return{vis:'<div class="ch-big">🎯</div>',q:`A and B are <b>mutually exclusive</b> events. P(A) = ${a[0]}/${a[1]} and P(B) = ${a[2]}/${a[3]}. Find P(A or B). (fraction)`,ans:n/d,extra:['pr-or','pr-mutually-exclusive','pr-fractions'],ex:`Add: ${a[0]}/${a[1]} + ${a[2]}/${a[3]} = ${n}/${d} = ${fr(n,d)}`};}
  const a=pick(P);return{vis:'<div class="ch-big">🌦️</div>',q:`The probability that a bus is late is ${a[0]}/${a[1]}. What is the probability that it is <b>not</b> late? (fraction)`,ans:(a[1]-a[0])/a[1],extra:['pr-not','pr-fractions'],ex:`1 − ${a[0]}/${a[1]} = ${a[1]-a[0]}/${a[1]} = ${fr(a[1]-a[0],a[1])}`};},
 N10(){const t=R(0,2),X=['red','blue','green','yellow'];
  if(t===0){const p=pick([.1,.15,.2,.25,.3]),q=pick([.1,.2,.25,.3,.35]);return{vis:spinner(['','',''],['red','blue','green']),q:`A biased spinner lands on red, blue or green. P(red) = ${p} and P(blue) = ${q}. Find P(green). (decimal)`,ans:dec(1-p-q),extra:['pr-missing','pr-sum-to-1'],ex:`Probabilities add to 1: 1 − ${p} − ${q} = ${dec(1-p-q)}`};}
  if(t===1){const p=pick([.1,.2,.3,.4]),q=pick([.1,.2,.3]);return{vis:spinner(['','','',''],['red','blue','green','yellow']),q:`A spinner has 4 colours. P(red) = ${p} and P(blue) = ${q}. Green and yellow are <b>equally likely</b>. Find P(green). (decimal)`,ans:dec((1-p-q)/2),extra:['pr-missing','pr-sum-to-1'],ex:`1 − ${p} − ${q} = ${dec(1-p-q)} is shared equally between green and yellow → ${dec((1-p-q)/2)}`};}
  const r=pick([.1,.25,.4,.7]);return{vis:'<div class="ch-big">🎲</div>',q:`A biased dice-game has three outcomes with probabilities <b>x</b>, <b>2x</b> and <b>${r}</b>. Find the value of x. (decimal)`,ans:dec((1-r)/3),extra:['pr-missing','pr-sum-to-1','pr-algebra'],ex:`x + 2x + ${r} = 1 → 3x = ${dec(1-r)} → x = ${dec((1-r)/3)}`};},
 N11(){const p=pick([.1,.2,.3,.4,.6,.7,.8]),q=dec(1-p),v=R(0,3),nm=['L','N'];
  const V=[['is late <b>both</b> days',dec(p*p),`${p} × ${p} = ${dec(p*p)}`,['pr-and']],['is late on <b>exactly one</b> day',dec(2*p*q),`L then N (${p} × ${q}) plus N then L (${q} × ${p}) = ${dec(2*p*q)}`,['pr-exactly-one']],['is late on <b>at least one</b> day',dec(1-q*q),`1 − P(never late) = 1 − ${q} × ${q} = ${dec(1-q*q)}`,['pr-at-least-one']],['is <b>not late on either</b> day',dec(q*q),`${q} × ${q} = ${dec(q*q)}`,['pr-and']]][v];
  return{vis:tree(p,q,nm),q:`The probability that Mia is late (L) for school is <b>${p}</b> each day, independently. N means not late. What is the probability she ${V[0]}? (decimal)`,ans:V[1],extra:['pr-tree','pr-independent','pr-decimals',...V[3]],ex:V[2]};},
 N12(){const t=R(6,10),r=R(2,t-2),b=t-r,v=R(0,2),den=t*(t-1);
  const V=[['the two balls are <b>different colours</b>',2*r*b,`red then blue (${r}/${t} × ${b}/${t-1}) + blue then red (${b}/${t} × ${r}/${t-1}) = ${2*r*b}/${den} = ${fr(2*r*b,den)}`,['pr-different']],
   ['the two balls are <b>the same colour</b>',r*(r-1)+b*(b-1),`both red (${r}/${t} × ${r-1}/${t-1}) + both blue (${b}/${t} × ${b-1}/${t-1}) = ${r*(r-1)+b*(b-1)}/${den} = ${fr(r*(r-1)+b*(b-1),den)}`,['pr-and']],
   ['<b>at least one</b> ball is red',den-b*(b-1),`1 − P(both blue) = 1 − ${b}/${t} × ${b-1}/${t-1} = ${den-b*(b-1)}/${den} = ${fr(den-b*(b-1),den)}`,['pr-at-least-one']]][v];
  return{vis:bag({red:r,blue:b}),q:`A bag has the balls shown. Two are picked <b>without replacement</b>. What is the probability that ${V[0]}? (fraction)`,ans:V[1]/den,extra:['pr-tree','pr-without-replacement',...V[3]],ex:V[2]};}
});
const POOL=[['T1'],['T1','T2'],['T1','T2','T3'],['T4'],['T5'],['T5','T6'],['T6','T7'],['T8'],['T8','T9'],['T10','T11'],['T12'],['T3','T4','T6','T7','T9','T10','T11','T12'],
 ['N1','N2'],['N3'],['N4'],['N5','N6'],['N7'],['N8','N2'],['N9','N10'],['N11'],['N12'],['N3','N4','N6','N7','N9','N10','N11','N12']];
function parseAns(s){s=s.trim();if(!s)return NaN;if(s.endsWith('%'))return parseFloat(s)/100;if(s.includes('/')){const[a,b]=s.split('/');return parseFloat(a)/parseFloat(b);}return parseFloat(s);}
window.__ch={QT,parseAns,POOL};
REG.push({id:'chance',name:'Chance Lab',emoji:'🎰',color:'#c2255c',cat:'Probability',
 desc:'GCSE probability and counting: bags, spinners, dice grids, listing outcomes, two-way tables, Venn diagrams, product rule, tree diagrams. Answer 5 questions per level — get 4 right to pass!',skills:['probability','fractions','sample space','counting','tree diagrams','Venn diagrams'],
 levels:['Bags · one colour','Bags · “not” events','Bags · “or” events','Spinners','Two dice · sums','Two dice · at least / less than','Two dice · tricky events','Two picks · with replacement','Two picks · without replacement','Expected & relative frequency','Probability rules','Boss mix',
  'Listing outcomes','Two-way tables','Venn diagrams','Counting · product rule (H)','Counting · arrangements (H)','Pairs & handshakes','Probability arithmetic','Tree diagrams · with replacement','Tree diagrams · without replacement (H)','Boss 2 · GCSE mix'],
 how:'Read the picture, then tap a box and type your answer: the top box is the numerator and the bottom box is the denominator, like 3 over 10 (any equivalent fraction is accepted). If the question asks for a decimal or a whole number, just fill in the top box. You can use the keypad or your keyboard (Tab switches boxes).',
 art:'<div class="minich">🎲🎲</div>',
 mount(root,lv,ctx){
  const pool=POOL[lv-1];let qs,qi,right,cur,num,den,fld,answered,res,tries;
  function start(){qs=Array.from({length:5},()=>pick(pool));qi=0;right=0;res=[];next();}
  function next(){cur=QT[qs[qi]]();num='';den='';fld='n';answered=false;tries=0;ctx.q=quizQ('chance',qs[qi],cur);draw();}
  function draw(msg,ok){
    root.innerHTML=`<div class="ch"><div class="statrow"><span>Question ${qi+1}/5</span><span>✅ ${right} correct (need 4)</span></div>
     <div class="ch-vis">${cur.vis}</div><div class="ch-q">${cur.q}</div>
     <div class="ch-frac ${ok===true?'good':ok===false?'bad':''}"><button class="fbox${fld==='n'&&!answered?' act':''}" id="fn" aria-label="numerator">${num||'&nbsp;'}</button><div class="fbar"></div><button class="fbox${fld==='d'&&!answered?' act':''}" id="fd" aria-label="denominator">${den||'&nbsp;'}</button></div>
     <div class="msg">${msg||'&nbsp;'}</div><div id="chp"></div>
     <div class="toolrow">${answered?`<button class="btn" id="nx">${qi<4?'Next question ▶':'See result ▶'}</button>`:tries?`<button class="btn alt" id="sa">Show answer</button>`:''}</div></div>`;
    if(!answered){$('#fn').onclick=()=>{fld='n';draw();};$('#fd').onclick=()=>{fld='d';draw();};
      const p=el('div','npad');['7','8','9','4','5','6','1','2','3','.','0','del'].forEach(k=>{const b=el('button','key'+(k==='del'?' del':''),k==='del'?'⌫':k);b.onclick=()=>press(k);p.appendChild(b);});
      const b=el('button','key ok','Enter ✓');b.style.gridColumn='span 3';b.onclick=()=>press('ok');p.appendChild(b);$('#chp').appendChild(p);}
    if($('#nx'))$('#nx').onclick=advance;
    if($('#sa'))$('#sa').onclick=()=>{answered=true;reveal();draw('💡 '+cur.ex,false);};
  }
  function press(k){
    if(answered)return;
    if(k==='del'){if(fld==='n')num=num.slice(0,-1);else den=den.slice(0,-1);}
    else if(k==='ok')return submit();
    else if(k==='tab'){fld=fld==='n'?'d':'n';}
    else if(k!=='.'||!(fld==='n'?num:den).includes('.')){if((fld==='n'?num:den).length<8){if(fld==='n')num+=k;else den+=k;}}
    draw();
  }
  function submit(){
    const buf=den?num+'/'+den:num;if(!num){draw('Fill in the top box (numerator) first');return;}
    const v=den?parseFloat(num)/parseFloat(den):parseFloat(num);if(isNaN(v)||!isFinite(v)){draw('Check your numbers');return;}
    const ok=Math.abs(v-cur.ans)<1e-6;
    if(!ok){if(!tries){res.push({qt:qs[qi],ok:false});}tries++;ctx.log('wrong',{typed:buf,expect:cur.ans,err:'wrong_value'});draw('❌ Not quite — change your answer and try again!',false);return;}
    answered=true;if(!tries){right++;res.push({qt:qs[qi],ok:true});}ctx.log('right',{retry:tries});
    reveal();
    draw((tries?'✅ Correct this time! (only first-try answers count towards passing) ':'✅ Correct! ')+cur.ex,true);
  }
  function reveal(){if(cur.rev){cur.vis=cur.rev();return;}if(cur.vis.includes('ch-grid')||cur.hl){const hl=cur.hl;if(hl)cur.vis=grid(hl);}}
  function advance(){
    if(qi<4){qi++;next();return;}
    {ctx.q=levelQ(ctx.id,ctx.lv);ctx.perf={right,of:5,wrong:res.filter(r=>!r.ok).map(r=>r.qt)};}
    if(right>=4){ctx.win('Probability pro!',`You got ${right}/5 right.`,start,'Play again');}
    else{ctx.log('fail',ctx.perf);root.innerHTML=`<div class="ch"><div class="big-emo" style="text-align:center">💪</div><div class="ch-q" style="text-align:center">You got ${right}/5. You need 4 to pass — have another go!</div><div class="toolrow"><button class="btn" id="rt">Try again ⟲</button></div></div>`;$('#rt').onclick=start;}
  }
  ctx.keys=e=>{if(/^[0-9.]$/.test(e.key))press(e.key);else if(e.key==='Tab'||e.key==='ArrowDown'||e.key==='ArrowUp'||e.key==='/'){e.preventDefault();press('tab');}else if(e.key==='Backspace'){e.preventDefault();press('del');}else if(e.key==='Enter')press('ok');};
  start();
 }});
})();
