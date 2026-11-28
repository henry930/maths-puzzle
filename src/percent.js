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
const POOL=[['P1'],['P1','P2'],['P2','P3'],['P3','P4'],['P4','P5'],['P5','P6'],['P6','P7'],['P7','P8'],['P9'],['P9','P10'],['P11'],['P12']];
const num=s=>{const v=parseFloat(s);return isNaN(v)?null:{v,n:null,d:1};};
window.__pc={QT,POOL};
REG.push({id:'percent',name:'Percent Shop',emoji:'🏷️',color:'#2b8a3e',cat:'Arithmetic',
 desc:'Sales, VAT, pay rises, test scores and bank interest — real-life percentages! 5 questions per level, 4 to pass.',skills:['percentages of amounts','fraction ↔ percentage','percentage change','reverse percentages','compound interest'],
 levels:['Percent of a grid','10%, 25%, 50%…','Convert fractions & decimals','Any percentage of an amount','Sale prices','Increase (VAT, pay rises)','Test scores as %','Percentage change','Reverse percentages','Reverse · sales','Interest','Boss mix'],
 how:'Type your answer as a number (no % or £ needed). Tip: find 10% first (÷10), then build any other percentage from it. For reverse percentages, work out 1% first.',
 art:'<div class="minibal">🏷️</div>',
 mount(root,lv,ctx){mountQuiz(root,ctx,{game:'percent',QT,pool:POOL[lv-1],parse:num,slash:false,winTitle:'Percentage pro!'});}});
})();
