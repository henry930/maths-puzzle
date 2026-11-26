(function(){
const fh=(n,d)=>`<span class="fr"><i>${n}</i><i>${d}</i></span>`;
const mix=(w,n,d)=>`<span class="mx">${w}</span>${fh(n,d)}`;
const simp=(n,d)=>{const g=gcd(n,d);return[n/g,d/g];};
const ft=(n,d)=>{const[a,b]=simp(n,d);return b===1?''+a:a+'/'+b;};
const COLS=['#ff922b','#4dabf7','#69db7c','#da77f2'];
function pie(n,k,col){
  let s='<svg viewBox="0 0 120 120" class="fr-pie">';
  for(let i=0;i<n;i++){
    const a0=i/n*2*Math.PI-Math.PI/2,a1=(i+1)/n*2*Math.PI-Math.PI/2;
    s+=n===1?'':`<path d="M60 60L${60+54*Math.cos(a0)} ${60+54*Math.sin(a0)}A54 54 0 0 1 ${60+54*Math.cos(a1)} ${60+54*Math.sin(a1)}Z" fill="${i<k?col:'#fff7e6'}" stroke="#7a5230" stroke-width="2.5"/>`;
  }
  return s+'</svg>';
}
function bar(n,k,col,lab){
  let s=`<div class="fr-bw"><div class="fr-bar" style="grid-template-columns:repeat(${n},1fr)">`;
  for(let i=0;i<n;i++)s+=`<i style="background:${i<k?col:'#fff'}"></i>`;
  return s+`</div>${lab?`<div class="fr-bl">${lab}</div>`:''}</div>`;
}
const cop=()=>pick([[2,3],[2,4],[3,6],[2,5],[3,4],[4,6],[2,6],[3,5],[4,8],[5,10],[4,5],[6,8],[3,9]]);
const QT={
 A1(){const n=pick([2,3,4,5,6,8,10,12]),k=R(1,n-1);return{vis:pie(n,k,pick(COLS)),q:'What fraction of the pizza is coloured? (type it as a/b)',ans:k/n,ex:`${k} of the ${n} equal slices are coloured → ${k}/${n}`+(gcd(k,n)>1?` = ${ft(k,n)}`:'')};},
 A2(){const b=pick([2,3,4,5,6]),a=R(1,b-1),m=R(2,5),c=b*m;return{vis:bar(b,a,COLS[0])+bar(c,a*m,COLS[0]),q:`${fh(a,b)} = ${fh('?',c)} &nbsp; Find the missing numerator.`,ans:a*m,ex:`${b} × ${m} = ${c}, so multiply the top by ${m} too: ${a} × ${m} = ${a*m}`};},
 A3(){let q,p;do{q=R(2,9);p=R(1,q-1);}while(gcd(p,q)!==1);const f=R(2,6);return{vis:'<div class="ch-big">✂️</div>',q:`Simplify ${fh(p*f,q*f)} to its simplest form.`,ans:p/q,simplest:true,ex:`Divide top and bottom by ${f}: ${p*f}/${q*f} = ${p}/${q}`};},
 A4(){const d=R(2,10),n=R(1,d-1),m=R(2,9),N=d*m;return{vis:pie(d,n,COLS[1]),q:`Find ${fh(n,d)} of ${N}.`,ans:N/d*n,ex:`${N} ÷ ${d} = ${m}, then × ${n} = ${m*n}`};},
 A5(){const d=R(3,12),a=R(1,d-2),b=R(1,d-1-a);return{vis:bar(d,a,COLS[0],ft(a,d))+bar(d,b,COLS[1],ft(b,d)),q:`${fh(a,d)} + ${fh(b,d)} = ?`,ans:(a+b)/d,ex:`Same denominator: add the tops → ${a+b}/${d}`+(gcd(a+b,d)>1?` = ${ft(a+b,d)}`:'')};},
 A6(){const[x,y]=cop(),a=R(1,x-1),b=R(1,y-1),L=x*y/gcd(x,y);const t=a*L/x+b*L/y;return{vis:bar(x,a,COLS[0])+bar(y,b,COLS[1]),q:`${fh(a,x)} + ${fh(b,y)} = ? (simplest form)`,ans:a/x+b/y,simplest:true,ex:`Common denominator ${L}: ${a*L/x}/${L} + ${b*L/y}/${L} = ${t}/${L} = ${ft(t,L)}`};},
 A7(){let x,y,a,b,t=0;do{[x,y]=cop();a=R(1,x-1);b=R(1,y-1);}while(a/x<=b/y);const L=x*y/gcd(x,y);t=a*L/x-b*L/y;return{vis:bar(x,a,COLS[0])+bar(y,b,COLS[1]),q:`${fh(a,x)} − ${fh(b,y)} = ? (simplest form)`,ans:a/x-b/y,simplest:true,ex:`Common denominator ${L}: ${a*L/x}/${L} − ${b*L/y}/${L} = ${t}/${L} = ${ft(t,L)}`};},
 A8(){const c=R(2,9),w=R(1,5);let b;do{b=R(1,c-1);}while(gcd(b,c)!==1);return{vis:'<div class="ch-big">🔁</div>',q:`Write ${mix(w,b,c)} as an improper fraction (a/b).`,ans:(w*c+b)/c,ex:`${w} × ${c} + ${b} = ${w*c+b}, so ${w*c+b}/${c}`};},
 A9(){const[x,y]=cop(),[u,v]=cop(),a=R(1,x-1),c=R(1,u-1);return{vis:'<div class="ch-big">✖️</div>',q:`${fh(a,x)} × ${fh(c,u)} = ? (simplest form)`,ans:a*c/(x*u),simplest:true,ex:`Tops: ${a}×${c} = ${a*c}; bottoms: ${x}×${u} = ${x*u} → ${ft(a*c,x*u)}`};},
 A10(){const x=pick([2,3,4,5,6]),u=pick([2,3,4,5,8]),a=R(1,x-1),c=R(1,u-1);return{vis:'<div class="ch-big">➗</div>',q:`${fh(a,x)} ÷ ${fh(c,u)} = ? (simplest form)`,ans:a*u/(x*c),simplest:true,ex:`Keep, flip, multiply: ${a}/${x} × ${u}/${c} = ${a*u}/${x*c} = ${ft(a*u,x*c)}`};},
 A11(){const d=R(2,8),n=R(1,d-1),m=R(2,9),N=d*m;return{vis:'<div class="ch-big">🕵️</div>',q:`${fh(n,d)} of a number is <b>${n*m}</b>. What is the number?`,ans:N,ex:`${n} parts = ${n*m}, so 1 part = ${m}. ${d} parts = ${d} × ${m} = ${N}`};},
 A12(){const c=pick([2,3,4,5]),f=pick([2,3,4,5]),w1=R(1,4),w2=R(1,3),b=R(1,c-1),e=R(1,f-1);const v=w1+b/c+w2+e/f;const L=c*f/gcd(c,f);const num=Math.round(v*L);return{vis:'<div class="ch-big">🧮</div>',q:`${mix(w1,b,c)} + ${mix(w2,e,f)} = ? Give an improper fraction (a/b) in simplest form.`,ans:v,simplest:true,ex:`Whole parts: ${w1+w2}. Fractions: ${b}/${c} + ${e}/${f} = ${ft(Math.round((b/c+e/f)*L),L)}. Total = ${ft(num,L)}`};}
};
const POOL=[['A1'],['A1','A2'],['A2','A3'],['A3','A4'],['A5'],['A6'],['A6','A7'],['A8','A4'],['A9'],['A9','A10'],['A11','A4'],['A7','A10','A11','A12','A9']];
const num=s=>{s=s.trim();if(!s)return null;if(s.includes('/')){const[a,b]=s.split('/').map(Number);if(!b||isNaN(a))return null;return{v:a/b,n:a,d:b};}const v=parseFloat(s);return isNaN(v)?null:{v,n:null,d:1};};
window.__fr={QT,POOL};
REG.push({id:'fraction',name:'Fraction Factory',emoji:'🍕',color:'#e8590c',cat:'Arithmetic',
 desc:'Pizzas and chocolate bars make fractions visible. Name, simplify, add, subtract, multiply and divide fractions — 5 questions per level, 4 to pass!',skills:['equivalent fractions','simplifying','fraction of an amount','adding & subtracting fractions','multiplying & dividing fractions'],
 levels:['Name the fraction','Equivalent fractions','Simplify','Fraction of an amount','Add · same denominator','Add · different denominators','Add & subtract','Mixed → improper','Multiply fractions','Multiply & divide','Reverse fractions','Boss mix'],
 how:'Look at the picture, then type your answer as a fraction like 3/4 (use the / key) or a whole number. When it says “simplest form”, divide the top and bottom by the same number until you can’t any more.',
 art:'<div class="minibal">🍕</div>',
 mount(root,lv,ctx){mountQuiz(root,ctx,{QT,pool:POOL[lv-1],parse:num,slash:true,winTitle:'Fraction master!'});}});
})();
