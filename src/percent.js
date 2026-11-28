(function(){
const hund=k=>{let s='<svg viewBox="0 0 110 110" class="pc-grid">';for(let i=0;i<100;i++){const r=Math.floor(i/10),c=i%10;s+=`<rect x="${5+c*10}" y="${5+r*10}" width="9" height="9" rx="1.5" fill="${i<k?'#ff6b6b':'#fff'}" stroke="#d0c9e8" stroke-width=".6"/>`;}return s+'</svg>';};
const tag=(t,sub)=>`<div class="pc-tag">🏷️<b>${t}</b><small>${sub||''}</small></div>`;
const P=a=>`£${a}`;
const fx=(n,d)=>`<span class="fr"><i>${n}</i><i>${d}</i></span>`;
const QT={
 P1(){const k=pick([R(3,97),R(1,19)*5]);return{vis:hund(k),q:'What percentage of the 100 squares is shaded?',ans:k,ex:`${k} out of 100 squares = ${k}%`};},
 P2(){const p=pick([10,20,25,50,75]),A=pick([40,60,80,120,200,240,400]);return{vis:tag(P(A)),q:`Find <b>${p}%</b> of ${P(A)}.`,ans:A*p/100,ex:p===50?`50% is half: ${A} ÷ 2 = ${A/2}`:p===25?`25% is a quarter: ${A} ÷ 4 = ${A/4}`:p===75?`75% = 3 quarters: ${A}÷4×3 = ${A*3/4}`:`${p}% → ${A} ÷ ${100/p} = ${A*p/100}`};},
 P3(){const F=[[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,10],[7,10],[3,20],[7,20],[9,25],[13,20],[17,50]];if(Math.random()<.5){const[n,d]=pick(F);return{vis:fx(n,d),q:`Write ${fx(n,d)} as a percentage.`,ans:n*100/d,ex:`${n}/${d} = ${n*100/d}/100 = ${n*100/d}%`};}
  const k=pick([7,12,35,45,60,85,5,18,65]);return{vis:'<div class="ch-big">0.'+(k<10?'0'+k:k)+'</div>',q:`Write <b>0.${k<10?'0'+k:k}</b> as a percentage.`,ans:k,ex:`Multiply by 100: 0.${k<10?'0'+k:k} × 100 = ${k}%`};},
 P4(){const p=pick([5,15,30,35,45,60,65,90,12.5].filter(x=>x!==12.5)),A=pick([20,40,60,80,120,140,200,260]);return{vis:tag(P(A)),q:`Find <b>${p}%</b> of ${P(A)}.`,ans:A*p/100,ex:`10% = ${A/10}, 5% = ${A/20}. Build ${p}% from those → ${A*p/100}`};},
 P5(){const p=pick([10,20,25,30,40,50,15,35]),A=pick([40,60,80,120,200,240]);return{vis:tag('SALE '+p+'% OFF','was '+P(A)),q:`A jacket costs ${P(A)}. It is in a sale with <b>${p}% off</b>. What is the sale price (in £)?`,ans:A*(100-p)/100,ex:`${p}% of ${A} = ${A*p/100}. ${A} − ${A*p/100} = ${A*(100-p)/100}`};},
 P6(){const p=pick([20,10,5,15,25,30]),A=pick([40,60,80,120,200,240]);const vat=p===20&&Math.random()<.5;return{vis:tag(P(A),vat?'+ VAT':'+ '+p+'%'),q:vat?`A phone costs ${P(A)} <b>before VAT</b>. VAT is 20%. What is the price including VAT (£)?`:`A worker earns ${P(A)}. She gets a <b>${p}% pay rise</b>. What is the new amount (£)?`,ans:A*(100+p)/100,ex:`${p}% of ${A} = ${A*p/100}. ${A} + ${A*p/100} = ${A*(100+p)/100}. (Or ${A} × ${(100+p)/100})`};},
 P7(){let a,b;do{b=pick([20,25,40,50,200,80,250]);a=R(1,b-1);}while((a*100/b)%1!==0);return{vis:'<div class="ch-big">📝</div>',q:`Sam scored <b>${a} out of ${b}</b> in a test. What percentage is that?`,ans:a*100/b,ex:`${a}/${b} × 100 = ${a*100/b}%`};},
 P8(){let o,n,pc;do{o=pick([20,25,40,50,80,100,120,200,250]);n=o+pick([-1,1])*R(1,Math.floor(o*.8/ 5))*5;pc=Math.abs(n-o)*100/o;}while(n<=0||pc%1!==0||pc===0||n===o);const up=n>o;return{vis:'<div class="ch-big">'+(up?'📈':'📉')+'</div>',q:`A price goes from ${P(o)} to ${P(n)}. What is the percentage <b>${up?'increase':'decrease'}</b>?`,ans:pc,ex:`Change = ${Math.abs(n-o)}. ${Math.abs(n-o)}/${o} × 100 = ${pc}% (divide by the ORIGINAL)`};},
 P9(){const p=pick([10,20,25,50,5]),O=pick([40,60,80,100,120,200,240,400]);const F=O*(100+p)/100;return{vis:tag(P(F),'after +'+p+'%'),q:`After a <b>${p}% increase</b> a price is ${P(F)}. What was the <b>original</b> price (£)?`,ans:O,ex:`${100+p}% = ${F}, so 1% = ${F/(100+p)}. 100% = ${F/(100+p)} × 100 = ${O}`};},
 P10(){const p=pick([10,20,25,30,40,50]),O=pick([40,60,80,100,120,200,250,400]);const F=O*(100-p)/100;if(F%1)return QT.P10();return{vis:tag(P(F),'sale: −'+p+'%'),q:`In a sale with <b>${p}% off</b>, a coat costs ${P(F)}. What was the <b>original</b> price (£)?`,ans:O,ex:`${100-p}% = ${F}, so 1% = ${F/(100-p)}. 100% = ${O}`};},
 P11(){const t=R(0,2);if(t===0){const r=pick([10,20]),Pp=pick([100,200,300,500]),y=pick([2,3,5]);return{vis:'<div class="ch-big">🏦</div>',q:`${P(Pp)} is invested at <b>${r}% simple interest</b> per year for ${y} years. How much interest is earned (£)?`,ans:Pp*r*y/100,ex:`Each year: ${r}% of ${Pp} = ${Pp*r/100}. × ${y} years = ${Pp*r*y/100}`};}
  if(t===1){const r=pick([10,20]),Pp=r===10?pick([100,200,300,500,1000]):pick([25,50,100,200,250]);return{vis:'<div class="ch-big">🏦</div>',q:`${P(Pp)} is invested at <b>${r}% compound interest</b> per year. How much is in the account after <b>2 years</b> (£)?`,ans:Pp*(1+r/100)**2,ex:`Multiplier ${1+r/100}. ${Pp} × ${1+r/100} × ${1+r/100} = ${Pp*(1+r/100)**2}`};}
  const Pp=pick([400,800,1200]);return{vis:'<div class="ch-big">🏦</div>',q:`${P(Pp)} is invested at <b>5% compound interest</b> per year. How much is in the account after <b>2 years</b> (£)?`,ans:Pp*1.1025,ex:`${Pp} × 1.05 × 1.05 = ${Pp*1.1025}`};},
};
QT.P12=()=>{const k=pick(['P6','P8','P9','P10','P11','P7']),r=QT[k]();r.k=k;return r;};
/* ---- GCSE extension: levels 13-32 (each type has several distinct variants, tagged v = type.index) ---- */
const r6=x=>Math.round(x*1e6)/1e6;
const big=e=>`<div class="ch-big">${e}</div>`;
const O=(vis,q,ans,ex,extra)=>({vis,q,ans:r6(ans),ex,extra});
const V=(id,arr)=>{QT[id]=()=>{const i=R(0,arr.length-1),r=arr[i]();r.v=id+'.'+i;return r;};};
const fmt=x=>String(r6(x));
const m=p=>r6(1+p/100),d=p=>r6(1-p/100);
const int=(f)=>{let r;for(let i=0;i<200;i++){r=f();if(r)return r;}return f()||{};};
// P13 mental percentages
V('P13',[
 ()=>{const A=pick([300,500,800,1200,2500,4000,6500]);return O(tag(P(A)),`Find <b>1%</b> of ${P(A)}.`,A/100,`1% means ÷ 100: ${A} ÷ 100 = ${A/100}`);},
 ()=>{const A=pick([40,60,80,120,200,300,500]);return O(tag(P(A)),`Find <b>5%</b> of ${P(A)}.`,A/20,`10% = ${A/10}. Half of that is 5%: ${A/20}`);},
 ()=>{const A=pick([40,60,80,120,200,300]);return O(tag(P(A)),`Find <b>15%</b> of ${P(A)}.`,A*.15,`10% = ${A/10}, 5% = ${A/20}. 15% = ${A/10} + ${A/20} = ${A*.15}`);},
 ()=>{const A=pick([40,80,120,200,400,800]);return O(tag(P(A)),`Find <b>2.5%</b> of ${P(A)}.`,A*.025,`10% = ${A/10}. 2.5% is a quarter of 10%: ${A/10} ÷ 4 = ${A*.025}`);},
 ()=>{const A=pick([16,24,40,64,80,160,240]);return O(tag(P(A)),`Find <b>12.5%</b> of ${P(A)}.`,A/8,`12.5% = 1/8. ${A} ÷ 8 = ${A/8}`);},
 ()=>{const A=pick([40,80,120,200,400]);return O(tag(P(A)),`Find <b>17.5%</b> of ${P(A)}.`,A*.175,`10% = ${A/10}, 5% = ${A/20}, 2.5% = ${A/40}. Add: ${A*.175}`);},
 ()=>{const A=pick([20,30,50,80,120,240]);return O(tag(P(A)),`Find <b>150%</b> of ${P(A)}.`,A*1.5,`100% = ${A}, 50% = ${A/2}. 150% = ${A*1.5}`);},
 ()=>{const A=pick([30,50,70,90,110,250]);return O(tag(P(A)),`Find <b>30%</b> of ${P(A)}.`,A*.3,`10% = ${A/10}. × 3 = ${A*.3}`);}
]);
// P14 multipliers
V('P14',[
 ()=>{const p=pick([3,8,12,15,35,7,20,45]);return O(big('✖️'),`What <b>single multiplier</b> increases a number by <b>${p}%</b>?`,m(p),`100% + ${p}% = ${100+p}% → ${100+p}/100 = ${m(p)}`);},
 ()=>{const p=pick([4,9,15,30,35,12,25,40]);return O(big('✖️'),`What <b>single multiplier</b> decreases a number by <b>${p}%</b>?`,d(p),`100% − ${p}% = ${100-p}% → ${100-p}/100 = ${d(p)}`);},
 ()=>{const x=pick([1.04,1.15,1.35,1.08,1.6,1.12,1.07]);return O(big('✖️'),`A multiplier of <b>${x}</b> gives what percentage <b>increase</b>?`,(x-1)*100,`${x} = ${r6(x*100)}% so the increase is ${r6(x*100)}% − 100% = ${r6((x-1)*100)}%`);},
 ()=>{const x=pick([0.92,0.85,0.7,0.95,0.88,0.6]);return O(big('✖️'),`A multiplier of <b>${x}</b> gives what percentage <b>decrease</b>?`,(1-x)*100,`${x} = ${r6(x*100)}% so the decrease is 100% − ${r6(x*100)}% = ${r6((1-x)*100)}%`);},
 ()=>{const p=pick([150,120,200,125,175]);return O(big('✖️'),`What single multiplier increases a number by <b>${p}%</b>?`,m(p),`100% + ${p}% = ${100+p}% → ${m(p)}`);},
 ()=>{const p=pick([12.5,2.5,17.5,7.5,22.5]);return O(big('✖️'),`What single multiplier <b>decreases</b> a number by <b>${p}%</b>?`,d(p),`100% − ${p}% = ${r6(100-p)}% → ${d(p)}`);},
 ()=>{const p=pick([12.5,2.5,17.5,7.5,4.5]);return O(big('✖️'),`What single multiplier <b>increases</b> a number by <b>${p}%</b>?`,m(p),`100% + ${p}% = ${r6(100+p)}% → ${m(p)}`);}
]);
// P15 increase with a multiplier / P16 decrease with a multiplier (each context has its own realistic amounts)
const CTX15=[
 [(A,p)=>`A salary of £${A} is increased by <b>${p}%</b>.`,[20000,24000,30000,36000,40000],[3,4,5,8,10,12],'£'],
 [(A,p)=>`A house worth £${A} rises in value by <b>${p}%</b>.`,[100000,150000,200000,250000,300000],[5,8,10,12,15,20],'£'],
 [(A,p)=>`A town of ${A} people grows by <b>${p}%</b>.`,[2000,5000,8000,10000,20000],[3,4,5,8,12,15],''],
 [(A,p)=>`A monthly rent of £${A} goes up by <b>${p}%</b>.`,[400,500,600,800,1000,1200],[4,5,8,10,15,20],'£'],
 [(A,p)=>`A club with ${A} members gains <b>${p}%</b> more members.`,[200,400,500,800,1000],[10,15,20,25,35,45],''],
 [(A,p)=>`A savings pot of £${A} grows by <b>${p}%</b>.`,[200,400,500,800,1000,2000],[3,4,5,6,8,12],'£']];
const CTX16=[
 [(A,p)=>`A car worth £${A} loses <b>${p}%</b> of its value.`,[8000,10000,12000,15000,20000],[10,12,15,20,25,30],'£'],
 [(A,p)=>`A TV costing £${A} is cut in price by <b>${p}%</b>.`,[200,300,400,500,800],[10,15,20,25,30,35],'£'],
 [(A,p)=>`A school roll of ${A} pupils falls by <b>${p}%</b>.`,[600,800,1000,1200,1500],[5,10,12,15,20],''],
 [(A,p)=>`A club with ${A} members loses <b>${p}%</b> of them.`,[200,300,400,500,800],[10,15,20,25,35],''],
 [(A,p)=>`A train fare of £${A} is reduced by <b>${p}%</b>.`,[20,40,60,80,100,200],[10,15,20,25,30,50],'£'],
 [(A,p)=>`A phone costing £${A} is discounted by <b>${p}%</b>.`,[400,600,800,1000,1200],[10,15,20,25,30],'£']];
V('P15',CTX15.map(([f,As,ps,u])=>()=>{const A=pick(As),p=pick(ps);return O(tag(u+A,'+'+p+'%'),`${f(A,p)} What is the new value${u?' (£)':''}?`,A*m(p),`Multiplier = ${m(p)}. ${A} × ${m(p)} = ${r6(A*m(p))}`,['pc-increase']);}));
V('P16',CTX16.map(([f,As,ps,u])=>()=>{const A=pick(As),p=pick(ps);return O(tag(u+A,'−'+p+'%'),`${f(A,p)} What is the new value${u?' (£)':''}?`,A*d(p),`Multiplier = ${d(p)}. ${A} × ${d(p)} = ${r6(A*d(p))}`,['pc-decrease']);}));
// P17 express one quantity as a percentage of another
V('P17',[
 ()=>{const a=R(1,19)*5;return O(big('📏'),`What percentage of <b>1 metre</b> is <b>${a} cm</b>?`,a,`1 m = 100 cm so ${a} cm is ${a}%`,['pc-unit']);},
 ()=>{const a=pick([3,6,9,12,15,18,24,30,36,45,48]);return O(big('⏱️'),`Write <b>${a} minutes</b> as a percentage of <b>1 hour</b>.`,a*100/60,`1 hour = 60 min. ${a}/60 × 100 = ${r6(a*100/60)}%`,['pc-unit']);},
 ()=>{const a=pick([50,120,250,375,600,850]);return O(big('⚖️'),`What percentage of <b>1 kg</b> is <b>${a} g</b>?`,a/10,`1 kg = 1000 g. ${a}/1000 × 100 = ${a/10}%`,['pc-unit']);},
 ()=>int(()=>{const b=pick([8,16,40,80,200,400]),a=R(1,b-1);if((a*200/b)%1)return 0;return O(big('📝'),`Write <b>${a} out of ${b}</b> as a percentage.`,a*100/b,`${a}/${b} × 100 = ${r6(a*100/b)}%`);}),
 ()=>{const n=pick([4,5,8,10,20,25,50]),k=R(1,n-1);return O(big('🟥'),`A shape is split into <b>${n}</b> equal parts and <b>${k}</b> are shaded. What percentage is shaded?`,k*100/n,`${k}/${n} × 100 = ${r6(k*100/n)}%`);},
 ()=>int(()=>{const b=pick([20,25,40,50,100,200]),a=R(1,b-1);if((a*200/b)%1)return 0;return O(big('🏫'),`In a class survey, <b>${a}</b> of the <b>${b}</b> students walk to school. What percentage walk?`,a*100/b,`${a}/${b} × 100 = ${r6(a*100/b)}%`);}),
 ()=>{const b=pick([2,4,5,10]),k=pick([20,40,50,80,100]);return O(big('💷'),`What percentage of <b>£${b}</b> is <b>${k}p</b>?`,k/b,`£${b} = ${b*100}p. ${k}/${b*100} × 100 = ${r6(k/b)}%`,['pc-unit']);}
]);
// P18 parts of a total
V('P18',[
 ()=>int(()=>{const N=pick([40,60,80,120,200,250]),x=pick([10,20,25,30,40,60,75]);if(N*x%100)return 0;return O(big('🧑‍🤝‍🧑'),`In a club of <b>${N}</b> people, <b>${x}%</b> are boys. How many are <b>girls</b>?`,N*(100-x)/100,`Boys = ${N*x/100}. Girls = ${N} − ${N*x/100} = ${N*(100-x)/100}`);}),
 ()=>int(()=>{const N=pick([200,400,500,1000]),x=pick([10,20,25,30,40]),y=pick([10,20,30,35]);if(x+y>=90||N*x%100||N*y%100)return 0;return O(big('📊'),`${N} people voted. <b>${x}%</b> chose A and <b>${y}%</b> chose B. The rest chose C. How many chose <b>C</b>?`,N*(100-x-y)/100,`C = ${100-x-y}% of ${N} = ${N*(100-x-y)/100}`);}),
 ()=>int(()=>{const N=pick([100,200,300,400,500]),x=pick([40,50,60,70]),y=pick([10,20,25,30]);if(x<=y||N*(x-y)%100||N*x%100||N*y%100)return 0;return O(big('🔴'),`A bag of <b>${N}</b> marbles is <b>${x}%</b> red and <b>${y}%</b> blue. How many <b>more</b> red than blue marbles are there?`,N*(x-y)/100,`Red = ${N*x/100}, blue = ${N*y/100}. Difference = ${N*(x-y)/100}`);}),
 ()=>int(()=>{const A=pick([40,60,80,100,200,300]),x=pick([10,20,25,30,40]),y=pick([10,15,20,25]);if(A*x%100||A*y%100)return 0;return O(tag(P(A)),`Sam has ${P(A)}. He spends <b>${x}%</b> on a book and <b>${y}%</b> on lunch. How much does he have left (£)?`,A*(100-x-y)/100,`Spent ${x+y}% so ${100-x-y}% is left: ${A} × ${(100-x-y)/100} = ${A*(100-x-y)/100}`);}),
 ()=>{const a=pick([[25,30],[50,20],[10,40],[20,35],[25,25],[40,15]]);const[x,y]=a;return O(big('🚌'),`In a class, <b>${x}%</b> walk to school, <b>${y}%</b> cycle and the rest take the bus. What percentage take the bus?`,100-x-y,`100% − ${x}% − ${y}% = ${100-x-y}%`);},
 ()=>int(()=>{const N=pick([200,300,400,500,800]),x=pick([20,25,40,45,60]);if(N*x%100)return 0;return O(big('📖'),`A book has <b>${N}</b> pages. Mia has read <b>${x}%</b> of it. How many pages are <b>left</b> to read?`,N*(100-x)/100,`Read = ${N*x/100}. Left = ${N} − ${N*x/100} = ${N*(100-x)/100}`);})
]);
// P19 find the whole
V('P19',[
 ()=>{const W=pick([40,60,80,120,200,300,500]),p=pick([10,20,25,50,5,40]);const N=W*p/100;return O(big('🔍'),`<b>${fmt(N)}</b> is <b>${p}%</b> of a number. What is the number?`,W,`${p}% = ${fmt(N)} → 1% = ${fmt(N/p)} → 100% = ${W}`);},
 ()=>{const W=pick([200,300,400,500,600]),p=pick([15,12,35,45,8,24]);const N=W*p/100;return O(big('🏫'),`<b>${N}</b> children is <b>${p}%</b> of a school year group. How many children are in the year group?`,W,`${p}% = ${N} → 1% = ${r6(N/p)} → 100% = ${W}`);},
 ()=>{const W=pick([1000,2000,5000,8000]),p=pick([10,25,40,5,2,20]);const N=W*p/100;return O(big('🏙️'),`<b>${p}%</b> of the people in a town is <b>${N}</b> people. What is the town's population?`,W,`${p}% = ${N} → 1% = ${r6(N/p)} → 100% = ${W}`);},
 ()=>{const W=pick([40,50,60,80,100,200]),p=pick([25,40,50,75,20,60]);const N=W*p/100;return O(big('🛢️'),`A tank is <b>${p}%</b> full and holds <b>${N}</b> litres. What is the tank's <b>capacity</b> (litres)?`,W,`${p}% = ${N} → 1% = ${r6(N/p)} → 100% = ${W}`);},
 ()=>{const W=pick([25,50,75,125,250,375]),p=pick([4,8,12,16,20]);const N=W*p/100;return O(big('🔍'),`<b>${p}%</b> of a number is <b>${fmt(N)}</b>. Find <b>100%</b>.`,W,`1% = ${fmt(N)} ÷ ${p} = ${r6(N/p)}. 100% = ${W}`);},
 ()=>{const W=pick([60,80,120,160,240]),p=pick([150,125,175,200]);const N=W*p/100;return O(big('🔍'),`<b>${fmt(N)}</b> is <b>${p}%</b> of a number. What is the number?`,W,`${p}% = ${fmt(N)} → 1% = ${r6(N/p)} → 100% = ${W}`);}
]);
// P20 awkward conversions
V('P20',[
 ()=>{const n=pick([1,3,5,7]);return O(fx(n,8),`Write ${fx(n,8)} as a percentage.`,n*12.5,`1/8 = 12.5%. ${n} × 12.5 = ${n*12.5}%`,['pc-from-fraction']);},
 ()=>{const n=pick([1,3,7,9,11,13,17,19,21,23,27]);return O(fx(n,40),`Write ${fx(n,40)} as a percentage.`,n*2.5,`${n}/40 × 100 = ${n*2.5}%`,['pc-from-fraction']);},
 ()=>{const x=pick([0.125,0.375,0.075,0.455,0.605,0.015,0.825]);return O(big(x),`Write <b>${x}</b> as a percentage.`,x*100,`${x} × 100 = ${r6(x*100)}%`,['pc-from-decimal']);},
 ()=>{const p=pick([35,7,62,4,125,18,90,2]);return O(big(p+'%'),`Write <b>${p}%</b> as a <b>decimal</b>.`,p/100,`${p} ÷ 100 = ${p/100}`,['pc-from-percent']);},
 ()=>{const p=pick([[12,25],[35,20],[45,20],[64,25],[84,25],[28,25],[65,20],[15,20]]),i=R(0,1);const[a,b]=[p[0],100];const g=gcd(a,b),n=a/g,dd=b/g;return O(big(a+'%'),`Write <b>${a}%</b> as a fraction in its simplest form. What is the <b>${i?'denominator':'numerator'}</b>?`,i?dd:n,`${a}% = ${a}/100 = ${n}/${dd}`,['pc-from-percent']);},
 ()=>{const f=pick([[5,4],[7,4],[3,2],[9,5],[11,10],[13,10],[9,4],[8,5]]);return O(fx(f[0],f[1]),`Write ${fx(f[0],f[1])} as a percentage.`,f[0]*100/f[1],`${f[0]}/${f[1]} = ${f[0]*100/f[1]/100} = ${f[0]*100/f[1]}%`,['pc-from-fraction']);},
 ()=>{const f=pick([[1,3],[2,3],[1,6],[5,6],[1,9],[4,9]]);const v=Math.round(f[0]*1000/f[1])/10;return O(fx(f[0],f[1]),`Write ${fx(f[0],f[1])} as a percentage, correct to <b>1 decimal place</b>.`,v,`${f[0]}/${f[1]} × 100 = ${(f[0]*100/f[1]).toFixed(3)}… ≈ ${v}%`,['pc-from-fraction']);}
]);
// P21 percentage points and marks
V('P21',[
 ()=>{const a=pick([2,2.5,3,4,5,6.5]),b=a+pick([1,1.5,2,0.5,3]);return O(big('🏦'),`An interest rate rises from <b>${a}%</b> to <b>${b}%</b>. By how many <b>percentage points</b> did it rise?`,b-a,`${b} − ${a} = ${r6(b-a)} percentage points`,['pc-points']);},
 ()=>int(()=>{const N=pick([200,500,1000,2000]),a=pick([55,60,45,65,70,40]),b=pick([20,25,30,35]);if(a+b>100||N*(a-b)%100)return 0;return O(big('🗳️'),`In an election with <b>${N}</b> voters, Ann gets <b>${a}%</b> and Ben gets <b>${b}%</b>. How many <b>more votes</b> does Ann get than Ben?`,N*(a-b)/100,`Difference = ${a-b}% of ${N} = ${N*(a-b)/100}`);}),
 ()=>int(()=>{const T=pick([40,50,60,80,120,200]),x=pick([50,60,65,75,45,35]);if(T*x%100)return 0;return O(big('🎯'),`A test is out of <b>${T}</b> marks. The pass mark is <b>${x}%</b>. How many marks are needed to pass?`,T*x/100,`${x}% of ${T} = ${T*x/100}`);}),
 ()=>int(()=>{const N=pick([40,50,60,80,120,200]),a=pick([85,90,70,75,60,95]);if(N*(100-a)%100)return 0;return O(big('📝'),`Jo scored <b>${a}%</b> in a test out of <b>${N}</b> marks. How many marks did she <b>lose</b>?`,N*(100-a)/100,`Lost ${100-a}% of ${N} = ${N*(100-a)/100}`);}),
 ()=>{const a=pick([45,52,60,38,70]),b=a+pick([6,9,12,15,18]);return O(big('📈'),`A school's pass rate goes up from <b>${a}%</b> to <b>${b}%</b>. How many percentage points is that?`,b-a,`${b}% − ${a}% = ${b-a} percentage points`,['pc-points']);}
]);
// P22 profit and loss
const PL=()=>{const A=pick([20,40,50,80,100,200]),p=pick([10,20,25,30,50,40]);return[A,p];};
V('P22',[
 ()=>{const[A,p]=PL();const B=A*(1+p/100);return O(big('🛍️'),`A shop buys a bag for ${P(A)} and sells it for ${P(r6(B))}. What is the percentage <b>profit</b>?`,p,`Profit = ${r6(B-A)}. ${r6(B-A)}/${A} × 100 = ${p}%`);},
 ()=>{const[A,p]=PL();return O(big('🛍️'),`A trader buys a table for ${P(A)} and sells it at a <b>${p}% profit</b>. What is the selling price (£)?`,A*(1+p/100),`${A} × ${m(p)} = ${r6(A*(1+p/100))}`);},
 ()=>{const[A,p]=PL();const B=A*(1-p/100);return O(big('📉'),`A bike bought for ${P(A)} is sold for ${P(r6(B))}. What is the percentage <b>loss</b>?`,p,`Loss = ${r6(A-B)}. ${r6(A-B)}/${A} × 100 = ${p}%`);},
 ()=>{const[A,p]=PL();return O(big('📉'),`A phone bought for ${P(A)} is sold at a <b>${p}% loss</b>. What is the selling price (£)?`,A*(1-p/100),`${A} × ${d(p)} = ${r6(A*(1-p/100))}`);},
 ()=>{const[A,p]=PL();return O(big('💰'),`A shop pays ${P(A)} for a coat and sells it at <b>${p}% profit</b>. How much <b>profit</b> is made (£)?`,A*p/100,`${p}% of ${A} = ${r6(A*p/100)}`);},
 ()=>int(()=>{const A=pick([40,80,100,200,400,160]),p=pick([10,20,25,50]);const B=A*(1+p/100);if(B%1)return 0;return O(big('🔍'),`An item is sold for ${P(B)} making a <b>${p}% profit</b>. What did it cost to buy (£)?`,A,`${100+p}% = ${B} → 1% = ${r6(B/(100+p))} → 100% = ${A}`,['pc-reverse']);})
]);
// P23 successive changes
V('P23',[
 ()=>{const A=pick([100,200,400,500,1000]),p=pick([10,20,25,50]);return O(big('↕️'),`${P(A)} is <b>increased by ${p}%</b> and the new amount is then <b>decreased by ${p}%</b>. What is the final amount (£)?`,A*m(p)*d(p),`${A} × ${m(p)} × ${d(p)} = ${r6(A*m(p)*d(p))}`);},
 ()=>{const A=pick([100,200,400,500,1000]),[x,y]=pick([[20,25],[10,20],[50,20],[25,20],[10,10],[30,10]]);return O(big('↕️'),`A bike costs ${P(A)}. The price is <b>reduced by ${x}%</b> and then <b>increased by ${y}%</b>. What is the final price (£)?`,A*d(x)*m(y),`${A} × ${d(x)} × ${m(y)} = ${r6(A*d(x)*m(y))}`);},
 ()=>{const A=pick([100,200,400,500,1000]),[x,y]=pick([[10,20],[10,10],[20,20],[50,10],[25,20]]);return O(big('📈'),`A value of ${P(A)} goes up by <b>${x}%</b>, then up by <b>${y}%</b>. What is the final value (£)?`,A*m(x)*m(y),`${A} × ${m(x)} × ${m(y)} = ${r6(A*m(x)*m(y))}`);},
 ()=>{const[x,y]=pick([[10,20],[10,10],[20,20],[50,10],[25,20],[5,10]]);return O(big('✖️'),`A price rises by <b>${x}%</b> and then by <b>${y}%</b>. What <b>single multiplier</b> gives the overall change?`,m(x)*m(y),`${m(x)} × ${m(y)} = ${r6(m(x)*m(y))}`);},
 ()=>{const p=pick([10,20,30,40,50]);return O(big('↕️'),`A price rises by <b>${p}%</b> and then falls by <b>${p}%</b>. The overall change is a <b>decrease</b> of what percentage?`,p*p/100,`${m(p)} × ${d(p)} = ${r6(m(p)*d(p))}. That is a decrease of ${r6(100-m(p)*d(p)*100)}%`);},
 ()=>{const A=pick([100,200,50,400]),[x,y]=pick([[20,10],[10,10],[25,20],[50,10],[30,20]]);return O(big('🏷️'),`A coat costs ${P(A)}. It is reduced by <b>${x}%</b> and then a further <b>${y}%</b> is taken off the sale price. What is the final price (£)?`,A*d(x)*d(y),`${A} × ${d(x)} × ${d(y)} = ${r6(A*d(x)*d(y))}`);}
]);
// P24 compound growth
V('P24',[
 ()=>{const P0=pick([1000,2000,500]);return O(big('🏦'),`${P(P0)} is invested at <b>10% compound interest</b>. How much is there after <b>3 years</b> (£)?`,P0*1.331,`${P0} × 1.1³ = ${r6(P0*1.331)}`,['pc-compound-interest']);},
 ()=>{const P0=pick([500,1000,250]),n=pick([2,3]);return O(big('🏦'),`${P(P0)} is invested at <b>20% compound interest</b> per year. How much is there after <b>${n} years</b> (£)?`,P0*1.2**n,`${P0} × 1.2${n===3?'³':'²'} = ${r6(P0*1.2**n)}`,['pc-compound-interest']);},
 ()=>{const P0=pick([400,800,2000,1600]);return O(big('🏦'),`${P(P0)} is invested at <b>5% compound interest</b> per year. How much is there after <b>2 years</b> (£)?`,P0*1.1025,`${P0} × 1.05² = ${r6(P0*1.1025)}`,['pc-compound-interest']);},
 ()=>{const P0=pick([10000,20000,5000,2000]);return O(big('🏙️'),`A town of ${P0} people grows by <b>10% each year</b>. What is the population after <b>2 years</b>?`,P0*1.21,`${P0} × 1.1² = ${r6(P0*1.21)}`);},
 ()=>{const P0=pick([100,200,500,1000]),r=pick([10,20]);return O(big('🏦'),`${P(P0)} is invested at <b>${r}% compound interest</b>. How much <b>interest</b> is earned in <b>2 years</b> (£)?`,P0*(m(r)**2-1),`Total = ${P0} × ${m(r)}² = ${r6(P0*m(r)**2)}. Interest = ${r6(P0*m(r)**2)} − ${P0} = ${r6(P0*(m(r)**2-1))}`,['pc-compound-interest']);},
 ()=>{const A=pick([3,5,10,50]),n=pick([2,3,4]);return O(big('🦠'),`A colony of <b>${A}</b> bacteria grows by <b>100%</b> every hour. How many are there after <b>${n} hours</b>?`,A*2**n,`100% growth = doubling. ${A} × 2${n===2?'²':n===3?'³':'⁴'} = ${A*2**n}`);},
 ()=>{const P0=pick([10000,20000]);return O(big('🏦'),`${P(P0)} is invested at <b>10% compound interest</b> per year. How much is there after <b>4 years</b> (£)?`,P0*1.4641,`${P0} × 1.1⁴ = ${r6(P0*1.4641)}`,['pc-compound-interest']);}
]);
// P25 depreciation
V('P25',[
 ()=>{const P0=pick([10000,5000,20000,15000]);return O(big('🚗'),`A car worth ${P(P0)} loses <b>20%</b> of its value each year. What is it worth after <b>2 years</b> (£)?`,P0*.64,`${P0} × 0.8² = ${r6(P0*.64)}`);},
 ()=>{const P0=pick([1000,2000,5000,10000,500]);return O(big('💻'),`A laptop worth ${P(P0)} depreciates by <b>10%</b> each year. What is it worth after <b>2 years</b> (£)?`,P0*.81,`${P0} × 0.9² = ${r6(P0*.81)}`);},
 ()=>{const P0=pick([1000,2000,5000,10000]);return O(big('🚐'),`A van worth ${P(P0)} loses <b>10%</b> of its value each year. What is it worth after <b>3 years</b> (£)?`,P0*.729,`${P0} × 0.9³ = ${r6(P0*.729)}`);},
 ()=>{const P0=pick([800,1600,4000,2400]);return O(big('📱'),`A phone worth ${P(P0)} halves in value every year (<b>50%</b> depreciation). What is it worth after <b>3 years</b> (£)?`,P0*.125,`${P0} × 0.5³ = ${r6(P0*.125)}`);},
 ()=>{const P0=pick([10000,5000,2000,20000]);return O(big('🏘️'),`A village of ${P0} people has a population that falls by <b>20%</b> each year. What is the population after <b>2 years</b>?`,P0*.64,`${P0} × 0.8² = ${r6(P0*.64)}`);},
 ()=>{const P0=pick([1600,3200,800]);return O(big('🚲'),`A bike worth ${P(P0)} loses <b>25%</b> each year. What is it worth after <b>2 years</b> (£)?`,P0*.5625,`${P0} × 0.75² = ${r6(P0*.5625)}`);}
]);
// P26 simple interest, all the unknowns
const SI=()=>{const r=pick([2,3,4,5,6,2.5,7]),Pp=pick([200,500,800,1000,1500,2000]),y=pick([2,3,4,5,6]);return[r,Pp,y,r6(Pp*r*y/100)];};
V('P26',[
 ()=>{const[r,Pp,y,I]=SI();return O(big('🏦'),`${P(Pp)} is invested at <b>${r}% simple interest</b> per year. How much interest is earned in <b>${y} years</b> (£)?`,I,`Per year: ${r}% of ${Pp} = ${r6(Pp*r/100)}. × ${y} = ${I}`,['pc-simple-interest']);},
 ()=>{const[r,Pp,y,I]=SI();return O(big('🏦'),`${P(Pp)} is invested at <b>${r}% simple interest</b> per year. How much is in the account after <b>${y} years</b> (£)?`,Pp+I,`Interest = ${I}. Total = ${Pp} + ${I} = ${r6(Pp+I)}`,['pc-simple-interest']);},
 ()=>{const[r,Pp,y,I]=SI();return O(big('🏦'),`${P(Pp)} earns <b>${P(I)}</b> simple interest in <b>${y} years</b>. What is the yearly interest <b>rate</b> (%)?`,r,`Per year: ${I} ÷ ${y} = ${r6(I/y)}. ${r6(I/y)}/${Pp} × 100 = ${r}%`,['pc-simple-interest']);},
 ()=>{const[r,Pp,y,I]=SI();return O(big('🏦'),`${P(Pp)} earns <b>${P(I)}</b> simple interest at <b>${r}% per year</b>. For how many <b>years</b> was it invested?`,y,`Per year: ${r}% of ${Pp} = ${r6(Pp*r/100)}. ${I} ÷ ${r6(Pp*r/100)} = ${y}`,['pc-simple-interest']);},
 ()=>{const[r,Pp,y,I]=SI();return O(big('🏦'),`Simple interest of <b>${P(I)}</b> was earned in <b>${y} years</b> at <b>${r}% per year</b>. How much was <b>invested</b> (£)?`,Pp,`Over ${y} years: ${r6(r*y)}% of the amount = ${I}. 1% = ${r6(I/(r*y))}, so 100% = ${Pp}`,['pc-simple-interest','pc-find-whole']);},
 ()=>{const Pp=pick([1000,2000,400,800]),r=pick([3,4,5,6]);return O(big('🏦'),`${P(Pp)} is invested at <b>${r}% simple interest</b> per year. How much interest is earned in <b>6 months</b> (£)?`,Pp*r/200,`One year = ${r6(Pp*r/100)}. Half a year = ${r6(Pp*r/200)}`,['pc-simple-interest']);}
]);
// P27 reverse percentages with multipliers
V('P27',[
 ()=>{const Oo=pick([50,100,150,200,250,300,400,500]);return O(big('🧾'),`A price <b>including 20% VAT</b> is ${P(Oo*1.2)}. What was the price <b>before VAT</b> (£)?`,Oo,`120% = ${r6(Oo*1.2)} → 1% = ${r6(Oo*.01)} → 100% = ${Oo}. (Or ${r6(Oo*1.2)} ÷ 1.2)`,['pc-vat']);},
 ()=>{const p=pick([4,5,8,10,12,20,25]),Oo=pick([20000,25000,30000,40000]);return O(big('💼'),`After a <b>${p}% pay rise</b> a salary is ${P(r6(Oo*m(p)))}. What was the salary <b>before</b> the rise (£)?`,Oo,`${100+p}% = ${r6(Oo*m(p))}. Divide by ${m(p)}: ${Oo}`);},
 ()=>int(()=>{const p=pick([10,15,20,30,40,25,35]),Oo=pick([20,40,60,80,100,200,300,400]);const F=Oo*(100-p)/100;if(F%1)return 0;return O(big('🏷️'),`A sale price of ${P(F)} is after a <b>${p}% reduction</b>. What was the <b>original</b> price (£)?`,Oo,`${100-p}% = ${F}. Divide by ${d(p)}: ${Oo}`);}),
 ()=>{const p=pick([20,25,30,40,10]),Oo=pick([5000,8000,10000,12000,15000,20000]);return O(big('🚗'),`A car has lost <b>${p}%</b> of its value and is now worth ${P(Oo*d(p))}. What was it worth <b>new</b> (£)?`,Oo,`${100-p}% = ${r6(Oo*d(p))}. Divide by ${d(p)}: ${Oo}`);},
 ()=>{const p=pick([5,10,20,25,50,4]),Oo=pick([2000,4000,5000,8000,10000]);return O(big('🏙️'),`A town's population has <b>risen by ${p}%</b> to <b>${r6(Oo*m(p))}</b>. What was the population <b>before</b>?`,Oo,`${100+p}% = ${r6(Oo*m(p))}. Divide by ${m(p)}: ${Oo}`);},
 ()=>{const p=pick([4,5,10,20,25]),Oo=pick([200,300,400,500,800,1000,2000]);return O(big('💼'),`After a <b>${p}% rise</b> a wage is ${P(r6(Oo*m(p)))}. How much was the <b>rise</b> in pounds (£)?`,Oo*p/100,`Original = ${r6(Oo*m(p))} ÷ ${m(p)} = ${Oo}. Rise = ${r6(Oo*m(p))} − ${Oo} = ${r6(Oo*p/100)}`);}
]);
// P28 ratio and percentage
V('P28',[
 ()=>{const[a,b]=pick([[1,1],[1,3],[1,4],[3,7],[3,2],[1,9],[2,3],[3,1],[4,1],[7,3],[9,1]]);return O(big('⚖️'),`The ratio of boys to girls in a club is <b>${a} : ${b}</b>. What percentage are <b>boys</b>?`,a*100/(a+b),`Total parts = ${a+b}. ${a}/${a+b} × 100 = ${r6(a*100/(a+b))}%`,['pc-ratio']);},
 ()=>{const p=pick([50,25,20,10,5,12.5,40,4]);return O(big('⚖️'),`A mixture is <b>${p}%</b> red paint and the rest is blue. The ratio red : blue is <b>1 : n</b>. What is <b>n</b>?`,(100-p)/p,`red : blue = ${p} : ${r6(100-p)} = 1 : ${r6((100-p)/p)}`,['pc-ratio']);},
 ()=>{const[a,b]=pick([[1,1],[1,3],[1,4],[3,7],[3,2],[1,9],[2,3],[3,1],[4,1],[7,3],[9,1]]);const big2=Math.max(a,b);return O(big('🍰'),`A cake is shared in the ratio <b>${a} : ${b}</b>. What percentage does the <b>larger share</b> get?`,big2*100/(a+b),`${big2}/${a+b} × 100 = ${r6(big2*100/(a+b))}%`,['pc-ratio']);},
 ()=>{const n=pick([1,3,4,9,19,7]);return O(big('🧃'),`A drink is made with <b>1 part</b> juice to <b>${n} parts</b> water. What percentage of the drink is juice?`,100/(1+n),`Total parts = ${1+n}. 1/${1+n} × 100 = ${r6(100/(1+n))}%`,['pc-ratio']);},
 ()=>{const[a,b]=pick([[50,60],[40,50],[20,25],[80,100],[100,125],[60,75],[25,30],[200,250],[40,48]]);return O(big('📈'),`<b>${b}</b> is what percentage <b>more</b> than <b>${a}</b>?`,(b-a)*100/a,`Increase = ${b-a}. ${b-a}/${a} × 100 = ${r6((b-a)*100/a)}%`,['pc-change']);}
]);
// P29 comparing offers
V('P29',[
 ()=>{const A=pick([40,60,80,100,200]),p=pick([10,20,25,50]),dd=pick([5,10,15,20]);const s=A*p/100;return O(big('⚔️'),`Offer 1: <b>${p}% off</b> ${P(A)}. Offer 2: <b>${P(dd)} off</b>. What is the <b>bigger saving</b> (£)?`,Math.max(s,dd),`${p}% of ${A} = ${r6(s)}. Compare ${r6(s)} and ${dd}: ${r6(Math.max(s,dd))}`,['pc-decrease']);},
 ()=>{const[A,p,B,q]=pick([[100,20,90,10],[80,25,70,10],[200,30,180,20],[50,10,48,5],[120,50,100,25],[60,20,55,10]]);return O(big('⚔️'),`Shop A sells a jacket for ${P(A)} with <b>${p}% off</b>. Shop B sells it for ${P(B)} with <b>${q}% off</b>. What is the <b>cheaper</b> final price (£)?`,Math.min(A*d(p),B*d(q)),`A: ${A} × ${d(p)} = ${r6(A*d(p))}. B: ${B} × ${d(q)} = ${r6(B*d(q))}`,['pc-decrease']);},
 ()=>{const A=pick([10,20,30,40]);return O(big('🛒'),`Buy one shirt at ${P(A)} and get the <b>second half price</b>. What is the total cost of two shirts (£)?`,A*1.5,`${A} + ${A/2} = ${A*1.5}`);},
 ()=>{const A=pick([2,4,5,8,10]);return O(big('🛒'),`A shop has a <b>3 for 2</b> offer on cakes at ${P(A)} each. How much do <b>6 cakes</b> cost (£)?`,A*4,`6 cakes = 2 lots of 3. You pay for 2 in each lot: 4 × ${A} = ${A*4}`);},
 ()=>int(()=>{const A=pick([40,60,80,100,120,200]),p=pick([10,20,25,50]),v=pick([3,5,10]);if(A*p%100)return 0;return O(big('🎟️'),`A game costs ${P(A)}. It is <b>${p}% off</b> and then you use a <b>${P(v)} voucher</b>. What do you pay (£)?`,A*d(p)-v,`${A} × ${d(p)} = ${r6(A*d(p))}. Then − ${v} = ${r6(A*d(p)-v)}`,['pc-decrease']);}),
 ()=>int(()=>{const S=pick([200,300,400,500,800]),p=pick([2,3,5,10]);const c=S*p/100;return O(big('💳'),`A card gives <b>${p}% cashback</b>. You spend ${P(S)}. How much cashback do you get (£)?`,c,`${p}% of ${S} = ${r6(c)}`);})
]);
// P30 tax, tips, commission
V('P30',[
 ()=>{const E=pick([20000,25000,30000,35000]),A=pick([10000,12000,15000]);return O(big('🧾'),`Tax is <b>20%</b> on income above ${P(A)}. Zoe earns ${P(E)}. How much tax does she pay (£)?`,(E-A)*.2,`Taxable = ${E} − ${A} = ${E-A}. 20% of ${E-A} = ${r6((E-A)*.2)}`);},
 ()=>{const B=pick([1000,1200,1500]),S=pick([2000,5000,8000,10000]),c=pick([2,5,10,4,8]);return O(big('🧑‍💼'),`A salesperson is paid ${P(B)} plus <b>${c}% commission</b> on sales of ${P(S)}. What is the total pay (£)?`,B+S*c/100,`Commission = ${c}% of ${S} = ${r6(S*c/100)}. Total = ${B} + ${r6(S*c/100)} = ${r6(B+S*c/100)}`);},
 ()=>{const A=pick([20,40,60,80,50]),p=pick([10,15,12.5,20]);return O(big('🍽️'),`A meal costs ${P(A)}. A <b>${p}% tip</b> is added. What is the total (£)?`,A*(1+p/100),`Tip = ${p}% of ${A} = ${r6(A*p/100)}. Total = ${r6(A*(1+p/100))}`);},
 ()=>{const h=pick([8,10,12,15,20]),p=pick([5,10,20,25,50]);return O(big('⏰'),`A wage of ${P(h)} per hour goes up by <b>${p}%</b>. What is the new hourly wage (£)?`,h*m(p),`${h} × ${m(p)} = ${r6(h*m(p))}`);},
 ()=>{const A=pick([35,45,65,85,120,250]);return O(big('🧾'),`A laptop costs ${P(A)} <b>before VAT</b>. VAT is <b>20%</b>. How much is the <b>VAT</b> (£)?`,A*.2,`20% of ${A} = ${r6(A*.2)}`,['pc-vat']);},
 ()=>{const S=pick([20000,30000,40000]),p=pick([20,15,10]),q=pick([8,5,2]);return O(big('💼'),`A worker earning ${P(S)} pays <b>${p}%</b> income tax and <b>${q}%</b> National Insurance (both of ${P(S)}). How much does she keep (£)?`,S*(100-p-q)/100,`Taken = ${p+q}% of ${S} = ${r6(S*(p+q)/100)}. Left = ${r6(S*(100-p-q)/100)}`);}
]);
// P31 pie charts, units, percentages of percentages
const pie=(deg)=>{let s='<svg viewBox="0 0 110 110" class="pc-grid"><circle cx="55" cy="55" r="48" fill="#fff" stroke="#6c5ce7" stroke-width="2"/>';const a=(deg-90)*Math.PI/180,x=55+48*Math.cos(a),y=55+48*Math.sin(a);s+=`<path d="M55 55 L55 7 A48 48 0 ${deg>180?1:0} 1 ${x.toFixed(1)} ${y.toFixed(1)} Z" fill="#ff6b6b" stroke="#6c5ce7" stroke-width="1.5"/>`;return s+'</svg>';};
V('P31',[
 ()=>{const t=pick([36,72,90,108,180,18,45,54,144]);return O(pie(t),`A pie-chart sector has an angle of <b>${t}°</b>. What percentage of the whole is it?`,t*100/360,`${t}/360 × 100 = ${r6(t*100/360)}%`,['pc-pie']);},
 ()=>{const p=pick([10,20,25,30,5,15,40,60,75,12.5]);return O(pie(p*3.6),`A pie-chart sector represents <b>${p}%</b>. What is its angle in degrees?`,p*3.6,`${p}% of 360° = ${r6(p*3.6)}°`,['pc-pie']);},
 ()=>int(()=>{const N=pick([200,250,400,500,800]),p=pick([10,15,30,35,40,60]);if(N*p%100)return 0;return O(big('🍕'),`In a survey of <b>${N}</b> people, <b>${p}%</b> chose pizza. How many people chose pizza?`,N*p/100,`${p}% of ${N} = ${r6(N*p/100)}`);}),
 ()=>{const[a,b,c]=pick([[50,40,200],[50,20,400],[25,40,200],[10,50,300],[50,50,200],[20,25,400]]);return O(big('%'),`Find <b>${a}% of ${b}%</b> of ${c}.`,c*a*b/10000,`${b}% of ${c} = ${c*b/100}. ${a}% of that = ${r6(c*a*b/10000)}`);},
 ()=>{const p=pick([10,20,25,50,5,75]),k=pick([2,3,4]);return O(big('⚖️'),`Find <b>${p}%</b> of <b>${k} kg</b>, in <b>grams</b>.`,k*1000*p/100,`${k} kg = ${k*1000} g. ${p}% of ${k*1000} = ${r6(k*1000*p/100)} g`,['pc-unit']);},
 ()=>{const p=pick([10,15,25,50,5,75]),h=pick([1,2,3,4]);return O(big('⏱️'),`Find <b>${p}%</b> of <b>${h} hour${h>1?'s':''}</b>, in <b>minutes</b>.`,h*60*p/100,`${h} h = ${h*60} min. ${p}% of ${h*60} = ${r6(h*60*p/100)} min`,['pc-unit']);},
 ()=>{const p=pick([0.5,0.2,2.5,0.1,1.5]),A=pick([2000,1000,4000,500]);return O(tag(P(A)),`Find <b>${p}%</b> of ${P(A)}.`,A*p/100,`${p}% of ${A} = ${A} × ${p/100} = ${r6(A*p/100)}`);}
]);
const MIX=['P13','P14','P15','P16','P17','P18','P19','P20','P21','P22','P23','P24','P25','P26','P27','P28','P29','P30','P31'];
QT.P32=()=>{const k=pick(MIX),r=QT[k]();r.k=k;return r;};
const POOL=[['P1'],['P1','P2'],['P2','P3'],['P3','P4'],['P4','P5'],['P5','P6'],['P6','P7'],['P7','P8'],['P9'],['P9','P10'],['P11'],['P12'],['P13'],['P14'],['P15'],['P16'],['P17'],['P18'],['P19'],['P20'],['P21'],['P22'],['P23'],['P24'],['P25'],['P26'],['P27'],['P28'],['P29'],['P30'],['P31'],['P32']];
const num=s=>{const v=parseFloat(s);return isNaN(v)?null:{v,n:null,d:1};};
window.__pc={QT,POOL};
REG.push({id:'percent',name:'Percent Shop',emoji:'🏷️',color:'#2b8a3e',cat:'Arithmetic',
 desc:'Sales, VAT, pay rises, test scores and bank interest — real-life percentages! 5 questions per level, 4 to pass.',skills:['percentages of amounts','fraction ↔ percentage','percentage change','reverse percentages','compound interest'],
 levels:['Percent of a grid','10%, 25%, 50%…','Convert fractions & decimals','Any percentage of an amount','Sale prices','Increase (VAT, pay rises)','Test scores as %','Percentage change','Reverse percentages','Reverse · sales','Interest','Boss mix','Mental percentages','Multipliers','Increase with a multiplier','Decrease with a multiplier','Express as a percentage','Parts of a total','Find the whole','Awkward conversions','Percentage points & marks','Profit & loss','Successive changes','Compound growth','Depreciation','Simple interest (any unknown)','Reverse with multipliers','Ratio & percentage','Comparing offers','Tax, tips & commission','Pie charts & units','Grand boss'],
 how:'Type your answer as a number (no % or £ needed). Tip: find 10% first (÷10), then build any other percentage from it. For reverse percentages, work out 1% first.',
 art:'<div class="minibal">🏷️</div>',
 mount(root,lv,ctx){mountQuiz(root,ctx,{game:'percent',QT,pool:POOL[lv-1],parse:num,slash:false,winTitle:'Percentage pro!'});}});
})();
