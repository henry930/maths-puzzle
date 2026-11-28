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
/* ---- GCSE extension: levels 13-32 (each type has several distinct variants, tagged v = type.index) ---- */
const r6=x=>Math.round(x*1e6)/1e6;
const big=e=>`<div class="ch-big">${e}</div>`;
const O=(vis,q,ans,ex,extra,simplest)=>({vis,q,ans:r6(ans),ex:String(ex).replace(/(\d+\/\d+) = \1(?![\d\/])/g,'$1'),extra,simplest:!!simplest});
const V=(id,arr)=>{QT[id]=()=>{const i=R(0,arr.length-1),r=arr[i]();r.v=id+'.'+i;return r;};};
const int=f=>{let r;for(let i=0;i<300;i++){r=f();if(r)return r;}return f()||{};};
const DEN=[2,3,4,5,6,7,8,9,10,12];
const prop=(ds)=>{const d=pick(ds||DEN),n=R(1,d-1);return[n,d];};
const two=()=>int(()=>{const a=prop(),b=prop();if(a[1]===b[1]||a[0]*b[1]===b[0]*a[1])return 0;return[a,b];});
const F=a=>fh(a[0],a[1]);
const lcm=(a,b)=>a*b/gcd(a,b);
const frac=(a,b)=>ft(a,b);
const mixed=(n,d)=>{const w=Math.floor(n/d),r=n%d;return r?`${w} ${r}/${d}`:`${w}`;};
const fadd=(a,b)=>[a[0]*b[1]+b[0]*a[1],a[1]*b[1]],fsub=(a,b)=>[a[0]*b[1]-b[0]*a[1],a[1]*b[1]],fmul=(a,b)=>[a[0]*b[0],a[1]*b[1]],fdiv=(a,b)=>[a[0]*b[1],a[1]*b[0]];
const val=a=>a[0]/a[1];
const cm=(a,b)=>{const L=lcm(a[1],b[1]);return[a[0]*L/a[1],b[0]*L/b[1],L];};
// B1 compare and order
V('B1',[
 ()=>{const[a,b]=two(),[x,y,L]=cm(a,b);const w=x>y?a:b;return O(bar(a[1],a[0],COLS[0])+bar(b[1],b[0],COLS[1]),`Which is <b>larger</b>: ${F(a)} or ${F(b)}? Type that fraction.`,val(w),`Common denominator ${L}: ${x}/${L} and ${y}/${L}. The larger is ${frac(w[0],w[1])}`,['fr-compare']);},
 ()=>{const[a,b]=two(),[x,y,L]=cm(a,b);const w=x<y?a:b;return O(bar(a[1],a[0],COLS[0])+bar(b[1],b[0],COLS[1]),`Which is <b>smaller</b>: ${F(a)} or ${F(b)}? Type that fraction.`,val(w),`Common denominator ${L}: ${x}/${L} and ${y}/${L}. The smaller is ${frac(w[0],w[1])}`,['fr-compare']);},
 ()=>{const[a,b]=two(),s=fadd(a,b),m=[s[0],s[1]*2];return O(big('⚖️'),`What fraction is <b>exactly halfway</b> between ${F(a)} and ${F(b)}? (simplest form)`,val(m),`Add them: ${frac(s[0],s[1])}. Then halve it: ${frac(m[0],m[1])}`,['fr-compare','fr-add'],true);},
 ()=>{const[a,b]=two(),[x,y,L]=cm(a,b),hi=x>y?a:b,lo=x>y?b:a,d=fsub(hi,lo);return O(big('📏'),`How much <b>bigger</b> is ${F(hi)} than ${F(lo)}? (simplest form)`,val(d),`${Math.max(x,y)}/${L} − ${Math.min(x,y)}/${L} = ${Math.abs(x-y)}/${L} = ${frac(d[0],d[1])}`,['fr-compare','fr-sub'],true);},
 ()=>int(()=>{const a=prop(),b=prop(),c=prop(),vs=[val(a),val(b),val(c)];if(new Set(vs.map(v=>r6(v))).size<3)return 0;const w=[a,b,c].sort((p,q)=>val(q)-val(p))[0];return O(big('🏆'),`Which is the <b>largest</b>: ${F(a)}, ${F(b)} or ${F(c)}? Type that fraction.`,val(w),`Change to decimals: ${vs.map(v=>(Math.round(v*1000)/1000)).join(', ')}. Largest = ${frac(w[0],w[1])}`,['fr-compare']);}),
 ()=>int(()=>{const a=prop(),b=prop(),c=prop(),vs=[val(a),val(b),val(c)];if(new Set(vs.map(v=>r6(v))).size<3)return 0;const m=[a,b,c].sort((p,q)=>val(p)-val(q))[1];return O(big('🎯'),`Put ${F(a)}, ${F(b)} and ${F(c)} in order. Which is the <b>middle</b> one? Type that fraction.`,val(m),`Decimals: ${vs.map(v=>(Math.round(v*1000)/1000)).join(', ')}. The middle one is ${frac(m[0],m[1])}`,['fr-compare']);})
]);
// B2 equivalent fractions, all directions
V('B2',[
 ()=>{const b=pick([3,4,5,6,7,8,9,11,12]),a=R(1,b-1),m=R(2,9),c=b*m;return O(bar(b,a,COLS[0]),`${fh(a,b)} = ${fh('?',c)} &nbsp; Find the missing numerator.`,a*m,`${b} × ${m} = ${c}, so ${a} × ${m} = ${a*m}`,['fr-equivalent']);},
 ()=>{const b=pick([3,4,5,6,7,8,9,11,12]),a=R(1,b-1),m=R(2,9);return O(big('🔎'),`${fh(a,b)} = ${fh(a*m,'?')} &nbsp; Find the missing denominator.`,b*m,`${a} × ${m} = ${a*m}, so ${b} × ${m} = ${b*m}`,['fr-equivalent']);},
 ()=>{let p,q;do{q=R(2,9);p=R(1,q-1);}while(gcd(p,q)!==1);const f=R(2,9);return O(big('🔎'),`${fh(p*f,q*f)} = ${fh('?',q)} &nbsp; Find the missing numerator.`,p,`${q*f} ÷ ${f} = ${q}, so ${p*f} ÷ ${f} = ${p}`,['fr-equivalent']);},
 ()=>{let p,q;do{q=R(3,11);p=R(1,q-1);}while(gcd(p,q)!==1);const f=R(2,9);return O(big('🔎'),`${fh(p*f,q*f)} = ${fh(p,'?')} &nbsp; Find the missing denominator.`,q,`${p*f} ÷ ${f} = ${p}, so ${q*f} ÷ ${f} = ${q}`,['fr-equivalent']);},
 ()=>{const d=pick([8,12,16,20,24,40]),k=pick([2,3,4,5].filter(x=>d%x===0)),n=pick([3,5,7,9,11]);const b=d/k;if(n>=b)return QT.B2();return O(big('🧩'),`How many <b>${ordinal(d)}s</b> is ${fh(n,b)}?`,n*k,`${b} × ${k} = ${d}, so ${n} × ${k} = ${n*k} → ${n*k}/${d}`,['fr-equivalent']);},
 ()=>{const b=pick([6,8,9,12,15]),m=pick([2,3,4,5]),a=R(1,b-1);return O(big('✖️'),`${fh('x',b)} = ${fh(a*m,b*m)}. Find <b>x</b>.`,a,`${b*m} ÷ ${m} = ${b}, so x = ${a*m} ÷ ${m} = ${a}`,['fr-equivalent','fr-algebra']);}
]);
function ordinal(d){return({8:'eighth',12:'twelfth',16:'sixteenth',20:'twentieth',24:'twenty-fourth',40:'fortieth'})[d]||'part';}
// B3 simplifying (bigger numbers, HCF)
const cp=()=>{let p,q;do{q=R(2,11);p=R(1,q-1);}while(gcd(p,q)!==1);return[p,q];};
V('B3',[
 ()=>{const[p,q]=cp(),f=R(3,12);return O(big('✂️'),`Simplify ${fh(p*f,q*f)} to its simplest form.`,p/q,`Divide by ${f}: ${p*f}/${q*f} = ${p}/${q}`,['fr-simplify'],true);},
 ()=>{const[p,q]=cp(),f=pick([10,20,25,30,40,50]);return O(big('✂️'),`Simplify ${fh(p*f,q*f)} to its simplest form.`,p/q,`Divide top and bottom by ${f}: ${p}/${q}`,['fr-simplify'],true);},
 ()=>{const[p,q]=cp(),f=R(3,15);return O(big('🔢'),`What is the <b>highest common factor</b> of ${p*f} and ${q*f}?`,f,`${p*f} = ${f} × ${p} and ${q*f} = ${f} × ${q}, and ${p} and ${q} share no factor. HCF = ${f}`,['fr-hcf']);},
 ()=>{const[p,q]=cp(),f=R(3,12);return O(big('✂️'),`${fh(p*f,q*f)} simplifies to a fraction in its simplest form. What is its <b>denominator</b>?`,q,`Divide by ${f}: ${p}/${q}. The denominator is ${q}`,['fr-simplify']);},
 ()=>{const[p,q]=cp(),f=R(3,12);return O(big('✂️'),`${fh(p*f,q*f)} simplifies to a fraction in its simplest form. What is its <b>numerator</b>?`,p,`Divide by ${f}: ${p}/${q}. The numerator is ${p}`,['fr-simplify']);},
 ()=>{let p,q;do{q=R(2,8);p=q+R(1,9);}while(gcd(p,q)!==1);const f=R(2,8);return O(big('✂️'),`Simplify the improper fraction ${fh(p*f,q*f)} to its simplest form.`,p/q,`Divide by ${f}: ${p}/${q}`,['fr-simplify','fr-improper'],true);}
]);
// B4 fraction of an amount
V('B4',[
 ()=>{const d=pick([6,7,8,9,11,12]),n=R(2,d-1),m=R(2,9),N=d*m;return O(pie(d,n,COLS[1]),`Find ${fh(n,d)} of ${N}.`,N/d*n,`${N} ÷ ${d} = ${m}, then × ${n} = ${m*n}`,['fr-of-amount']);},
 ()=>{const d=pick([4,5,6,8,10]),n=R(1,d-1),N=d*pick([5,8,10,12,15]);return O(big('🏷️'),`A coat costs £${N}. The sale takes ${fh(n,d)} off. How much is taken off (£)?`,N/d*n,`£${N} ÷ ${d} = £${N/d}, × ${n} = £${N/d*n}`,['fr-of-amount']);},
 ()=>{const N=pick([6,12,18,24,30,42,60]);return O(big('💷'),`Find ${fh(5,6)} of £${N}.`,N/6*5,`${N} ÷ 6 = ${N/6}, × 5 = ${N/6*5}`,['fr-of-amount']);},
 ()=>{const n=pick([1,3]),k=pick([2,3,5]);return O(big('⚖️'),`Find ${fh(n,4)} of <b>${k} kg</b>, in <b>grams</b>.`,k*1000/4*n,`${k} kg = ${k*1000} g. ${k*1000} ÷ 4 = ${k*250}, × ${n} = ${k*250*n} g`,['fr-of-amount','fr-unit']);},
 ()=>{const[n,d]=pick([[5,12],[1,12],[7,12],[2,3],[3,4],[1,6],[5,6],[3,5]]);return O(big('⏱️'),`Find ${fh(n,d)} of <b>1 hour</b>, in <b>minutes</b>.`,60/d*n,`60 ÷ ${d} = ${60/d}, × ${n} = ${60/d*n} minutes`,['fr-of-amount','fr-unit']);},
 ()=>{const N=pick([15,30,45,60,75,90]);return O(big('➕'),`Find ${fh(2,3)} of ${N} plus ${fh(1,5)} of ${N}.`,N*2/3+N/5,`${fh(2,3)} of ${N} = ${N*2/3}; ${fh(1,5)} of ${N} = ${N/5}. Total = ${N*2/3+N/5}`,['fr-of-amount','fr-add']);},
 ()=>{const[n,d]=pick([[5,4],[7,4],[3,2],[4,3],[5,3],[7,5],[9,8]]),N=d*pick([4,5,6,8,10]);return O(big('📈'),`Find ${fh(n,d)} of ${N}.`,N/d*n,`${N} ÷ ${d} = ${N/d}, × ${n} = ${N/d*n}`,['fr-of-amount','fr-improper']);}
]);
// B5 express as a fraction of another quantity
V('B5',[
 ()=>{const a=pick([5,10,12,15,20,25,30,40,45,50]);return O(big('⏱️'),`Write <b>${a} minutes</b> as a fraction of <b>1 hour</b>, in simplest form.`,a/60,`${a}/60 = ${frac(a,60)}`,['fr-express','fr-unit'],true);},
 ()=>{const b=pick([20,40,60,80,100]),a=R(1,b/5-1)*5;return O(big('💷'),`Write <b>£${a}</b> as a fraction of <b>£${b}</b>, in simplest form.`,a/b,`${a}/${b} = ${frac(a,b)}`,['fr-express'],true);},
 ()=>{const a=R(1,19)*5;return O(big('📏'),`Write <b>${a} cm</b> as a fraction of <b>1 metre</b>, in simplest form.`,a/100,`1 m = 100 cm. ${a}/100 = ${frac(a,100)}`,['fr-express','fr-unit'],true);},
 ()=>{const y=pick([30,36,40,45,48,60]),x=R(1,y-1);return O(big('🏫'),`<b>${x}</b> of the <b>${y}</b> children in a class walk to school. What fraction walk? (simplest form)`,x/y,`${x}/${y} = ${frac(x,y)}`,['fr-express'],true);},
 ()=>{const a=pick([100,125,200,250,300,400,500,750]);return O(big('⚖️'),`Write <b>${a} g</b> as a fraction of <b>1 kg</b>, in simplest form.`,a/1000,`1 kg = 1000 g. ${a}/1000 = ${frac(a,1000)}`,['fr-express','fr-unit'],true);},
 ()=>{const[u,t,w]=pick([[7,'days','a week'],[12,'months','a year'],[24,'hours','a day']]);const a=R(1,u-1);return O(big('📅'),`Write <b>${a} ${a===1?t.slice(0,-1):t}</b> as a fraction of <b>${w}</b> (${u} ${t}), in simplest form.`,a/u,`${a}/${u} = ${frac(a,u)}`,['fr-express','fr-unit'],true);}
]);
// B6 fractions of fractions and what's left
V('B6',[
 ()=>int(()=>{const[a,b]=two();const s=fadd(a,b);if(s[0]>=s[1])return 0;const r=fsub([1,1],s);return O(big('🍰'),`Sam spends ${F(a)} of his money on a book and ${F(b)} on lunch. What fraction is <b>left</b>? (simplest form)`,val(r),`Spent: ${frac(s[0],s[1])}. Left: 1 − ${frac(s[0],s[1])} = ${frac(r[0],r[1])}`,['fr-remaining','fr-add'],true);}),
 ()=>{const a=prop([3,4,5,6,8,10]),r=fsub([1,1],a);return O(big('🛢️'),`A tank is ${F(a)} full. What fraction of the tank is <b>empty</b>? (simplest form)`,val(r),`1 − ${frac(a[0],a[1])} = ${frac(r[0],r[1])}`,['fr-remaining'],true);},
 ()=>{const N=pick([30,60,90,120]);return O(big('✖️'),`Find ${fh(1,3)} of ${fh(2,5)} of ${N}.`,N*2/15,`${fh(2,5)} of ${N} = ${N*2/5}. ${fh(1,3)} of that = ${N*2/15}`,['fr-of-amount','fr-mul']);},
 ()=>int(()=>{const a=pick([[1,2],[1,3],[1,4],[2,3],[1,5]]),b=pick([[1,2],[1,3],[1,4],[1,5],[2,5]]);const rem=fsub([1,1],a),e=fmul(b,rem),l=fsub(rem,e);return O(big('🍰'),`Ann eats ${F(a)} of a cake. Ben then eats ${F(b)} of what is <b>left</b>. What fraction of the <b>whole cake</b> is still left? (simplest form)`,val(l),`After Ann: ${frac(rem[0],rem[1])}. Ben eats ${frac(b[0],b[1])} of that = ${frac(e[0],e[1])}. Left = ${frac(rem[0],rem[1])} − ${frac(e[0],e[1])} = ${frac(l[0],l[1])}`,['fr-remaining','fr-mul'],true);}),
 ()=>{const a=pick([[3,5],[2,3],[3,4],[5,8],[4,7]]),b=pick([[1,4],[1,3],[2,5],[1,2],[3,4]]),p=fmul(a,b);return O(big('⚽'),`${F(a)} of a class are girls. ${F(b)} of the girls play football. What fraction of the <b>whole class</b> are girls who play football? (simplest form)`,val(p),`${frac(a[0],a[1])} × ${frac(b[0],b[1])} = ${frac(p[0],p[1])}`,['fr-mul'],true);},
 ()=>{const[a,b]=pick([[[1,2],[1,3]],[[1,2],[1,4]],[[1,3],[1,4]],[[1,5],[2,5]],[[1,6],[1,3]],[[2,5],[1,10]]]);const r=fsub(fsub([1,1],a),b);return O(big('🍰'),`A prize is shared between three people. The first gets ${F(a)}, the second gets ${F(b)}. What fraction does the <b>third</b> get? (simplest form)`,val(r),`Others: ${frac(...fadd(a,b))}. Third: 1 − ${frac(...fadd(a,b))} = ${frac(r[0],r[1])}`,['fr-remaining'],true);}
]);
// B7 mixed numbers add and subtract
V('B7',[
 ()=>{const c=pick([3,4,5,6,8]),w1=R(1,4),w2=R(1,4),b=R(1,c-1),e=R(1,c-1),s=[(w1*c+b)+(w2*c+e),c];return O(big('➕'),`${mix(w1,b,c)} + ${mix(w2,e,c)} = ? (improper fraction, simplest form)`,val(s),`Whole: ${w1}+${w2}. Fractions: ${b}/${c}+${e}/${c}. Total ${frac(s[0],s[1])}`,['fr-mixed','fr-add','fr-same-denom'],true);},
 ()=>int(()=>{const c=pick([4,5,6,7,8]),w1=R(3,6),w2=R(1,w1-2),b=R(1,c-2),e=R(b+1,c-1);if(e<=b)return 0;const s=[(w1*c+b)-(w2*c+e),c];return O(big('➖'),`${mix(w1,b,c)} − ${mix(w2,e,c)} = ? (improper fraction, simplest form)`,val(s),`Change to improper fractions: ${w1*c+b}/${c} − ${w2*c+e}/${c} = ${s[0]}/${c} = ${frac(s[0],s[1])}`,['fr-mixed','fr-sub','fr-same-denom'],true);}),
 ()=>{const[b,c]=pick([[1,2],[1,3],[1,4],[3,4],[2,5]]),[e,f]=pick([[1,3],[2,3],[1,6],[1,2],[3,5]]);if(c===f)return QT.B7();const w=R(1,3),s=fadd([w*c+b,c],[e,f]);return O(big('➕'),`${mix(w,b,c)} + ${fh(e,f)} = ? (improper fraction, simplest form)`,val(s),`${w*c+b}/${c} + ${e}/${f} = ${frac(s[0],s[1])}`,['fr-mixed','fr-add','fr-diff-denom'],true);},
 ()=>int(()=>{const[b,c]=pick([[1,4],[1,3],[1,2],[3,4],[2,3]]),[e,f]=pick([[1,2],[1,4],[1,3],[1,6],[1,5]]);if(c===f&&b===e)return 0;const w=R(2,5);const s=fsub([w*c+b,c],[e,f]);return O(big('➖'),`${mix(w,b,c)} − ${fh(e,f)} = ? (improper fraction, simplest form)`,val(s),`${w*c+b}/${c} − ${e}/${f} = ${frac(s[0],s[1])}`,['fr-mixed','fr-sub','fr-diff-denom'],true);}),
 ()=>{const[b,c]=pick([[3,4],[1,2],[2,3],[1,3],[2,5],[3,8]]),w=R(1,4),W=w+R(1,4);const s=fsub([W,1],[w*c+b,c]);return O(big('➖'),`${W} − ${mix(w,b,c)} = ? (improper fraction, simplest form)`,val(s),`${W} = ${W*c}/${c}. ${W*c}/${c} − ${w*c+b}/${c} = ${frac(s[0],s[1])}`,['fr-mixed','fr-sub'],true);},
 ()=>int(()=>{const[b,c]=pick([[1,2],[1,3],[3,4],[2,3],[1,4]]),[e,f]=pick([[1,3],[1,2],[1,4],[2,5],[1,6]]);if(c===f)return 0;const w1=R(3,6),w2=R(1,2);const s=fsub([w1*c+b,c],[w2*f+e,f]);if(val(s)<=0)return 0;return O(big('➖'),`${mix(w1,b,c)} − ${mix(w2,e,f)} = ? (improper fraction, simplest form)`,val(s),`${w1*c+b}/${c} − ${w2*f+e}/${f} = ${frac(s[0],s[1])}`,['fr-mixed','fr-sub','fr-diff-denom'],true);})
]);
// B8 mixed and improper, decimals
V('B8',[
 ()=>{const d=R(2,9),w=R(1,6),b=R(1,d-1);return O(big('🔁'),`Write ${fh(w*d+b,d)} as a mixed number. What is the <b>whole number part</b>?`,w,`${w*d+b} ÷ ${d} = ${w} remainder ${b}, so ${mixed(w*d+b,d)}`,['fr-mixed','fr-mixed-improper']);},
 ()=>{const d=R(3,9),w=R(1,6),b=R(1,d-1);return O(big('🔁'),`Write ${fh(w*d+b,d)} as a mixed number. What is the <b>numerator</b> of the fraction part?`,b,`${w*d+b} ÷ ${d} = ${w} remainder ${b}, so ${mixed(w*d+b,d)}`,['fr-mixed','fr-mixed-improper']);},
 ()=>{const c=R(3,9),w=R(1,6),b=R(1,c-1);return O(big('🔁'),`Write ${mix(w,b,c)} as an improper fraction. What is the <b>numerator</b>?`,w*c+b,`${w} × ${c} + ${b} = ${w*c+b}`,['fr-mixed','fr-mixed-improper']);},
 ()=>{const[b,c]=pick([[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[1,8],[3,8],[1,10]]),w=R(1,6);return O(big('🔢'),`Write ${mix(w,b,c)} as a <b>decimal</b>.`,w+b/c,`${b}/${c} = ${b/c}, so ${r6(w+b/c)}`,['fr-mixed','fr-decimal']);},
 ()=>{const d=pick([2,4,5,8]),n=d*R(1,3)+R(1,d-1);return O(big('🔢'),`Write ${fh(n,d)} as a <b>decimal</b>.`,n/d,`${n} ÷ ${d} = ${r6(n/d)}`,['fr-decimal','fr-improper']);},
 ()=>{const d=R(3,9),w=R(1,6),b=R(1,d-1);return O(big('🔁'),`${fh(w*d+b,d)} lies between two whole numbers. What is the <b>larger</b> one?`,w+1,`${w}×${d} = ${w*d} and ${(w+1)*d} is bigger than ${w*d+b}, so it is between ${w} and ${w+1}`,['fr-mixed','fr-improper']);}
]);
// B9 multiply
V('B9',[
 ()=>{const[b,c]=pick([[1,2],[1,3],[1,4],[3,4],[2,3],[1,5]]),w=R(1,3),k=R(2,9);const r=fmul([w*c+b,c],[k,1]);return O(big('✖️'),`${mix(w,b,c)} × ${k} = ? (simplest form)`,val(r),`${w*c+b}/${c} × ${k} = ${r[0]}/${r[1]} = ${frac(r[0],r[1])}`,['fr-mul','fr-mixed'],true);},
 ()=>int(()=>{const[b,c]=pick([[1,2],[1,3],[1,4],[3,4],[2,3]]),w=R(1,3),f=prop([2,3,4,5,6,8]);const r=fmul([w*c+b,c],f);return O(big('✖️'),`${mix(w,b,c)} × ${F(f)} = ? (simplest form)`,val(r),`${w*c+b}/${c} × ${f[0]}/${f[1]} = ${frac(r[0],r[1])}`,['fr-mul','fr-mixed'],true);}),
 ()=>{const f=prop([3,4,5,6,7,8,9]),k=R(2,9);const r=fmul(f,[k,1]);return O(big('✖️'),`${F(f)} × ${k} = ? (simplest form)`,val(r),`${f[0]} × ${k} = ${f[0]*k}, so ${f[0]*k}/${f[1]} = ${frac(r[0],r[1])}`,['fr-mul'],true);},
 ()=>{const f=prop([3,4,5,6,7,8,9]);const r=fmul(f,f);return O(big('²'),`Work out (${F(f)})² = ${F(f)} × ${F(f)}. (simplest form)`,val(r),`${f[0]}×${f[0]} = ${r[0]} and ${f[1]}×${f[1]} = ${r[1]} → ${frac(r[0],r[1])}`,['fr-mul','fr-power'],true);},
 ()=>int(()=>{const[p,q]=cp(),[r,s]=cp(),f=R(2,5),g=R(2,5);const a=[p*f,q*g],b=[r*g,s*f];if(gcd(a[0],a[1])!==1&&false)return 0;const res=fmul(a,b);return O(big('✖️'),`${F(a)} × ${F(b)} = ? (simplest form)`,val(res),`Cancel common factors first, or multiply: ${res[0]}/${res[1]} = ${frac(res[0],res[1])}`,['fr-mul'],true);}),
 ()=>int(()=>{const[b,c]=pick([[1,2],[1,3],[1,4],[2,3],[3,4]]),[e,f]=pick([[1,2],[1,3],[1,4],[2,3],[3,5]]),w1=R(1,3),w2=R(1,3);const r=fmul([w1*c+b,c],[w2*f+e,f]);return O(big('✖️'),`${mix(w1,b,c)} × ${mix(w2,e,f)} = ? (improper fraction, simplest form)`,val(r),`${w1*c+b}/${c} × ${w2*f+e}/${f} = ${frac(r[0],r[1])}`,['fr-mul','fr-mixed'],true);})
]);
// B10 divide
V('B10',[
 ()=>{const f=prop([3,4,5,6,7,8,9]),k=R(2,6);const r=fdiv(f,[k,1]);return O(big('➗'),`${F(f)} ÷ ${k} = ? (simplest form)`,val(r),`Dividing by ${k} is multiplying by 1/${k}: ${f[0]}/${f[1]*k} = ${frac(r[0],r[1])}`,['fr-div'],true);},
 ()=>{const d=pick([2,3,4,5,6,8]),k=R(2,9),n=1;return O(big('🔪'),`How many ${fh(n,d)}s are there in <b>${k}</b>? (${k} ÷ ${fh(n,d)})`,k*d,`${k} ÷ ${n}/${d} = ${k} × ${d} = ${k*d}`,['fr-div']);},
 ()=>int(()=>{const[b,c]=pick([[1,2],[1,3],[1,4],[3,4]]),w=R(1,3),f=prop([2,3,4,5,6,8]);const r=fdiv([w*c+b,c],f);return O(big('➗'),`${mix(w,b,c)} ÷ ${F(f)} = ? (simplest form)`,val(r),`${w*c+b}/${c} × ${f[1]}/${f[0]} = ${frac(r[0],r[1])}`,['fr-div','fr-mixed'],true);}),
 ()=>int(()=>{const a=prop([3,4,5,6,7,8,9,10]),b=prop([3,4,5,6,7,8,9,10]);const r=fdiv(a,b);return O(big('➗'),`${F(a)} ÷ ${F(b)} = ? (simplest form)`,val(r),`Keep, flip, multiply: ${a[0]}/${a[1]} × ${b[1]}/${b[0]} = ${frac(r[0],r[1])}`,['fr-div'],true);}),
 ()=>{const[n,d]=pick([[3,4],[2,3],[1,2],[1,4],[3,8],[5,8],[2,5]]),k=pick([2,3,4,5,6,8]),L=d*k*(n===1?1:n)/(n===1?1:1);const T=n*k;return O(big('🎀'),`A ribbon is <b>${T}/${d}</b> m long. It is cut into pieces each ${fh(n,d)} m long. How many pieces?`,k,`${T}/${d} ÷ ${n}/${d} = ${T}/${n} = ${k}`,['fr-div']);},
 ()=>int(()=>{const[b,c]=pick([[1,2],[1,4],[1,3]]),[e,f]=pick([[1,2],[1,4],[1,3]]),w1=R(2,5),w2=R(1,2);const r=fdiv([w1*c+b,c],[w2*f+e,f]);return O(big('➗'),`${mix(w1,b,c)} ÷ ${mix(w2,e,f)} = ? (simplest form)`,val(r),`${w1*c+b}/${c} × ${f}/${w2*f+e} = ${frac(r[0],r[1])}`,['fr-div','fr-mixed'],true);})
]);
// B11 brackets and order of operations
V('B11',[
 ()=>{const[a,b]=pick([[[1,2],[1,3]],[[1,3],[1,6]],[[1,4],[1,2]],[[2,3],[1,6]],[[3,4],[1,2]]]),k=lcm(a[1],b[1]);const s=fadd(a,b),r=fmul(s,[k,1]);return O(big('🧮'),`Work out (${F(a)} + ${F(b)}) × ${k}. (simplest form)`,val(r),`Brackets first: ${frac(s[0],s[1])}. × ${k} = ${frac(r[0],r[1])}`,['fr-brackets','fr-add','fr-mul'],true);},
 ()=>{const a=pick([[1,2],[1,3],[1,4]]),b=pick([[1,3],[1,2],[2,3]]),c=pick([[3,4],[1,2],[1,5],[2,5]]);const p=fmul(b,c),s=fadd(a,p);return O(big('🧮'),`Work out ${F(a)} + ${F(b)} × ${F(c)}. (simplest form)`,val(s),`Multiply first: ${frac(p[0],p[1])}. Then add: ${frac(s[0],s[1])}`,['fr-brackets','fr-mul','fr-add'],true);},
 ()=>int(()=>{const a=pick([[3,4],[2,3],[5,6],[7,8],[3,5]]),b=pick([[1,2],[1,3],[1,4],[1,6]]),c=pick([[1,2],[1,4],[1,8],[1,6]]);const d=fsub(a,b);if(val(d)<=0)return 0;const r=fdiv(d,c);return O(big('🧮'),`Work out (${F(a)} − ${F(b)}) ÷ ${F(c)}. (simplest form)`,val(r),`Brackets: ${frac(d[0],d[1])}. Divide: ${frac(d[0],d[1])} × ${c[1]} = ${frac(r[0],r[1])}`,['fr-brackets','fr-sub','fr-div'],true);}),
 ()=>{const a=pick([[1,2],[1,3],[3,4],[2,3]]),[b,c]=pick([[[1,3],[1,6]],[[1,4],[1,2]],[[1,6],[1,3]],[[1,5],[1,10]]]);const s=fadd(b,c),r=fmul(a,s);return O(big('🧮'),`Work out ${F(a)} × (${F(b)} + ${F(c)}). (simplest form)`,val(r),`Brackets: ${frac(s[0],s[1])}. × ${frac(a[0],a[1])} = ${frac(r[0],r[1])}`,['fr-brackets','fr-mul','fr-add'],true);},
 ()=>int(()=>{const n=pick([2,3,4]),a=pick([[1,2],[1,4],[1,3]]),b=pick([[1,4],[1,8],[1,6],[1,5]]);const q=fdiv(a,b),r=fsub([n,1],q);if(val(r)<=0)return 0;return O(big('🧮'),`Work out ${n} − ${F(a)} ÷ ${F(b)}. (simplest form)`,val(r),`Divide first: ${frac(q[0],q[1])}. Then ${n} − ${frac(q[0],q[1])} = ${frac(r[0],r[1])}`,['fr-brackets','fr-div','fr-sub'],true);})
]);
// B12 reciprocals
V('B12',[
 ()=>{const f=prop([3,4,5,7,8,9,11]);return O(big('🔄'),`Write the <b>reciprocal</b> of ${F(f)}.`,f[1]/f[0],`Flip it: ${f[1]}/${f[0]}${f[0]===1?' = '+f[1]:''}`,['fr-reciprocal']);},
 ()=>{const n=R(2,12);return O(big('🔄'),`Write the <b>reciprocal</b> of ${n}. (type it as a fraction)`,1/n,`${n} = ${n}/1. Flip it: 1/${n}`,['fr-reciprocal']);},
 ()=>{const[b,c]=pick([[1,2],[1,3],[1,4],[2,3],[3,4]]),w=R(1,3);const t=[w*c+b,c];return O(big('🔄'),`Write the <b>reciprocal</b> of ${mix(w,b,c)}. (type it as a fraction)`,t[1]/t[0],`${mix(w,b,c)} = ${t[0]}/${t[1]}. Flip it: ${t[1]}/${t[0]}`,['fr-reciprocal','fr-mixed']);},
 ()=>{const f=prop([3,4,5,7,8,9,11]);return O(big('🔄'),`What is ${F(f)} × its reciprocal?`,1,`A number times its reciprocal always equals 1: ${f[0]}/${f[1]} × ${f[1]}/${f[0]} = 1`,['fr-reciprocal']);},
 ()=>{const x=pick([0.5,0.25,0.2,0.125,0.1,0.05]);return O(big('🔄'),`Write the <b>reciprocal</b> of <b>${x}</b>.`,1/x,`${x} = ${r6(x*100)}/100 = ${frac(Math.round(x*1000),1000)}. Flip it: ${r6(1/x)}`,['fr-reciprocal','fr-decimal']);}
]);
// B13 fractions and decimals
V('B13',[
 ()=>{const d=pick([8,16,20,25,40,50]),n=pick([1,3,5,7,9,11,13].filter(x=>x<d));return O(big('🔢'),`Write ${fh(n,d)} as a <b>decimal</b>.`,n/d,`${n} ÷ ${d} = ${r6(n/d)}`,['fr-decimal']);},
 ()=>{const x=pick([0.35,0.45,0.15,0.65,0.85,0.12,0.24,0.36,0.8,0.6]);const[n,d]=simp(Math.round(x*100),100);return O(big(x),`Write <b>${x}</b> as a fraction in its simplest form.`,x,`${x} = ${Math.round(x*100)}/100 = ${n}/${d}`,['fr-decimal','fr-simplify'],true);},
 ()=>{const[n,d]=pick([[5,16],[3,16],[7,16],[9,16],[1,32],[3,32],[7,40],[11,50]]);return O(big('🔢'),`Write ${fh(n,d)} as a <b>decimal</b>.`,n/d,`${n} ÷ ${d} = ${r6(n/d)}`,['fr-decimal']);},
 ()=>{const x=pick([0.625,0.375,0.875,0.125,0.025,0.075,0.225]);const[n,d]=simp(Math.round(x*1000),1000);return O(big(x),`Write <b>${x}</b> as a fraction in its simplest form.`,x,`${x} = ${Math.round(x*1000)}/1000 = ${n}/${d}`,['fr-decimal','fr-simplify'],true);},
 ()=>{const[n,d]=pick([[1,3],[2,3],[1,6],[5,6],[1,9],[4,9],[1,7],[2,7]]);const v=Math.round(n/d*100)/100;return O(big('🔢'),`Write ${fh(n,d)} as a decimal, correct to <b>2 decimal places</b>.`,v,`${n} ÷ ${d} = ${(n/d).toFixed(4)}… ≈ ${v}`,['fr-decimal']);},
 ()=>{const[a,x]=pick([[[3,8],0.4],[[2,5],0.35],[[7,20],0.34],[[5,8],0.6],[[3,4],0.7],[[1,3],0.3],[[4,5],0.85]]);const v=a[0]/a[1];const w=v>x?a:null;return O(big('⚖️'),`Which is <b>larger</b>: ${F(a)} or <b>${x}</b>? Type the larger value (as a decimal).`,Math.max(v,x),`${F(a)} = ${r6(v)}. Compare ${r6(v)} with ${x}: the larger is ${r6(Math.max(v,x))}`,['fr-decimal','fr-compare']);}
]);
// B14 fractions and percentages
V('B14',[
 ()=>{const[n,d]=pick([[3,20],[7,20],[9,25],[13,20],[17,50],[3,5],[7,10]]);return O(big('%'),`Write ${fh(n,d)} as a <b>percentage</b>.`,n*100/d,`${n}/${d} = ${n*100/d}/100 = ${n*100/d}%`,['fr-percent']);},
 ()=>{const p=pick([45,35,65,85,12,24,36,60,15,5]);const[n,d]=simp(p,100);return O(big(p+'%'),`Write <b>${p}%</b> as a fraction in its simplest form.`,p/100,`${p}% = ${p}/100 = ${n}/${d}`,['fr-percent','fr-simplify'],true);},
 ()=>{const[n,d]=pick([[7,8],[3,8],[5,8],[1,8],[3,16],[5,16]]);return O(big('%'),`Write ${fh(n,d)} as a <b>percentage</b>.`,n*100/d,`${n}/${d} = ${r6(n/d)} = ${r6(n*100/d)}%`,['fr-percent','fr-decimal']);},
 ()=>{const p=pick([12.5,37.5,62.5,87.5,2.5,7.5]);const[n,d]=simp(Math.round(p*10),1000);return O(big(p+'%'),`Write <b>${p}%</b> as a fraction in its simplest form.`,p/100,`${p}% = ${p*10}/1000 = ${n}/${d}`,['fr-percent','fr-simplify'],true);},
 ()=>{const[n,d]=pick([[3,4],[1,4],[2,5],[4,5],[1,5],[1,2],[1,10],[9,10],[19,20]]);return O(big('%'),`Write ${fh(n,d)} as a <b>percentage</b>.`,n*100/d,`${n}/${d} × 100 = ${n*100/d}%`,['fr-percent']);},
 ()=>{const p=pick([125,150,175,200,250,120]);const[n,d]=simp(p,100);return O(big(p+'%'),`Write <b>${p}%</b> as an improper fraction in its simplest form.`,p/100,`${p}% = ${p}/100 = ${n}/${d}`,['fr-percent','fr-improper'],true);}
]);
// B15 word problems
V('B15',[
 ()=>{const a=pick([[3,4],[2,3],[3,5],[5,6],[7,8]]),b=pick([[1,3],[1,2],[1,4],[2,5],[1,5]]),p=fmul(a,b);return O(big('🍕'),`Anna has ${F(a)} of a pizza left and eats ${F(b)} of it. What fraction of the <b>whole pizza</b> did she eat? (simplest form)`,val(p),`${frac(a[0],a[1])} × ${frac(b[0],b[1])} = ${frac(p[0],p[1])}`,['fr-word','fr-mul'],true);},
 ()=>{const f=pick([[2,3],[3,4],[1,2],[3,5],[5,6]]),k=pick([2,3,4,5,6]);const r=fmul(f,[k,1]);return O(big('🥣'),`A recipe uses ${F(f)} of a cup of flour. How many cups are needed for <b>${k} times</b> the recipe? (simplest form)`,val(r),`${f[0]}/${f[1]} × ${k} = ${frac(r[0],r[1])}`,['fr-word','fr-mul'],true);},
 ()=>{const d=pick([4,8]),k=pick([2,3,4,6,8]),n=1;const T=[3*k/ (k%3===0?1:1),d];return O(big('🥛'),`A jug holds <b>${3}/${d}</b> litre. Glasses hold ${fh(1,d*2)} litre each. How many glasses can be filled?`,3*2,`${3}/${d} ÷ 1/${d*2} = ${3}/${d} × ${d*2} = 6`,['fr-word','fr-div']);},
 ()=>{const K=pick([15,30,45,60]);return O(big('🏃'),`Tom runs ${fh(2,5)} of ${K} km in the morning and ${fh(1,3)} of ${K} km in the afternoon. How many km did he run in <b>total</b>?`,K*2/5+K/3,`Morning: ${K*2/5} km. Afternoon: ${K/3} km. Total = ${K*2/5+K/3} km`,['fr-word','fr-of-amount']);},
 ()=>{const d=pick([4,5,8,10]),N=d*pick([20,30,50,60]);return O(big('🏠'),`A deposit of ${fh(1,d)} of £${N} is paid. How much is <b>still to pay</b> (£)?`,N-N/d,`Deposit = ${N/d}. Left = ${N} − ${N/d} = ${N-N/d}`,['fr-word','fr-remaining']);},
 ()=>{const[a,b]=pick([[[5,2],[3,5]],[[3,2],[2,3]],[[7,2],[4,7]],[[5,2],[2,5]],[[9,2],[2,3]]]);const r=fmul(a,b);return O(big('🎬'),`A film lasts ${mix(Math.floor(a[0]/a[1]),a[0]%a[1],a[1])} hours. Jo has watched ${F(b)} of it. For how many <b>hours</b> has she watched? (simplest form)`,val(r),`${a[0]}/${a[1]} × ${b[0]}/${b[1]} = ${frac(r[0],r[1])}`,['fr-word','fr-mul','fr-mixed'],true);}
]);
// B16 reverse fractions
V('B16',[
 ()=>{const[n,d]=pick([[3,5],[2,5],[3,4],[2,3],[5,8]]),L=pick([6,8,12,15,20]);const rem=d-n,T=L*d/rem;if(T%1)return QT.B16();return O(big('💷'),`Dev spends ${fh(n,d)} of his money and has £${L} left. How much did he have at the <b>start</b> (£)?`,T,`Left = ${rem}/${d} = £${L}. 1/${d} = £${L/rem}. Start = ${d} × ${L/rem} = £${T}`,['fr-reverse','fr-remaining']);},
 ()=>{const[n,d]=pick([[2,3],[3,5],[3,4],[5,8]]),B=pick([8,6,10,12,5]),k=d-n,T=B*d/k;if(T%1)return QT.B16();return O(big('🏫'),`${fh(n,d)} of a group are girls. There are <b>${B}</b> boys. How many people are in the group?`,T,k===1?`Boys = 1/${d} = ${B}. Total = ${B} × ${d} = ${T}`:`Boys = ${k}/${d} = ${B}. 1/${d} = ${B/k}. Total = ${T}`,['fr-reverse']);},
 ()=>{const d=R(3,9),n=R(2,d-1),m=R(2,9);return O(big('🕵️'),`${fh(n,d)} of a number is <b>${n*m}</b>. What is the number?`,d*m,`${n} parts = ${n*m}, so 1 part = ${m}. ${d} parts = ${d*m}`,['fr-reverse','fr-of-amount']);},
 ()=>{const[n,d]=pick([[2,7],[3,8],[2,9],[3,10],[4,9]]),m=pick([20,28,35,14,24]),T=d*m,L=(d-n)*m;return O(big('📖'),`Mia has read ${fh(n,d)} of a book. She still has <b>${L}</b> pages to read. How many pages are in the book?`,T,`Left = ${d-n}/${d} = ${L} pages. 1/${d} = ${m}. Total = ${T}`,['fr-reverse','fr-remaining']);},
 ()=>{const[n,d]=pick([[3,4],[2,5],[3,5],[5,8],[1,3]]),m=pick([2,3,4,5]),T=d*m,L=(d-n)*m;return O(big('🚗'),`A journey is ${fh(n,d)} complete. There are <b>${L}</b> km to go. How long is the whole journey (km)?`,T,`Remaining = ${d-n}/${d} = ${L}. 1/${d} = ${m}. Total = ${T} km`,['fr-reverse','fr-remaining']);},
 ()=>{const x=pick([12,24,36,48,60]);return O(big('🧩'),`${fh(1,3)} of a number plus ${fh(1,4)} of the same number is <b>${x*7/12}</b>. What is the number?`,x,`${fh(1,3)} + ${fh(1,4)} = ${fh(7,12)}. ${fh(7,12)} of the number = ${x*7/12}, so 1/12 = ${x/12} and the number = ${x}`,['fr-reverse','fr-add']);}
]);
// B17 ratio and fractions
V('B17',[
 ()=>{const[a,b]=pick([[1,2],[2,3],[3,4],[3,5],[2,5],[1,4],[4,5]]);return O(big('⚖️'),`Red and blue counters are in the ratio <b>${a} : ${b}</b>. What fraction are <b>red</b>? (simplest form)`,a/(a+b),`Total parts = ${a+b}. Red = ${a}/${a+b} = ${frac(a,a+b)}`,['fr-ratio'],true);},
 ()=>{const[a,b]=pick([[1,2],[2,3],[3,4],[3,5],[2,5],[1,4],[4,5]]);return O(big('⚖️'),`Boys and girls are in the ratio <b>${a} : ${b}</b>. What fraction are <b>girls</b>? (simplest form)`,b/(a+b),`Total parts = ${a+b}. Girls = ${b}/${a+b} = ${frac(b,a+b)}`,['fr-ratio'],true);},
 ()=>{const[a,t]=pick([[3,7],[2,5],[3,8],[4,9],[5,12],[2,9],[1,6]]);return O(big('⚖️'),`${fh(a,t)} of a club are boys. The ratio boys : girls is <b>${a} : ?</b>. What is the missing number?`,t-a,`Girls = ${t-a}/${t} so the ratio is ${a} : ${t-a}`,['fr-ratio','fr-remaining']);},
 ()=>{const[a,b]=pick([[1,2],[2,3],[3,5],[2,5],[3,7],[1,4]]),k=pick([4,6,8,10,12]),N=k*(a+b);return O(big('🍰'),`£${N} is shared in the ratio <b>${a} : ${b}</b>. How many pounds is the <b>${a} share</b>?`,N/(a+b)*a,`Parts = ${a+b}. £${N} ÷ ${a+b} = £${k}. ${a} × ${k} = £${k*a}`,['fr-ratio','fr-of-amount']);},
 ()=>{const[a,t]=pick([[2,5],[3,8],[3,7],[1,4],[5,9]]);return O(big('🔴'),`${fh(a,t)} of the marbles are red. The ratio red : <b>not red</b> is ${a} : ?. What is the missing number?`,t-a,`Not red = ${t-a}/${t}, so red : not red = ${a} : ${t-a}`,['fr-ratio','fr-remaining']);}
]);
// B18 unit fractions
V('B18',[
 ()=>{const[a,b,c]=pick([[2,3,6],[2,4,4],[3,3,3],[2,6,3]]);const s=fadd(fadd([1,a],[1,b]),[1,c]);return O(big('➕'),`${fh(1,a)} + ${fh(1,b)} + ${fh(1,c)} = ?`,val(s),`Common denominator ${lcm(lcm(a,b),c)}. Total = ${frac(s[0],s[1])}`,['fr-unit-frac','fr-add'],true);},
 ()=>{const k=pick([[2,4,8],[2,3,6],[3,6,12],[2,5,10]]);const s=fadd(fadd([1,k[0]],[1,k[1]]),[1,k[2]]);return O(big('➕'),`${fh(1,k[0])} + ${fh(1,k[1])} + ${fh(1,k[2])} = ? (simplest form)`,val(s),`Common denominator ${k[2]}. Total = ${frac(s[0],s[1])}`,['fr-unit-frac','fr-add'],true);},
 ()=>{const[a,b]=pick([[2,6],[2,8],[3,9],[2,10],[4,12],[3,12]]);return O(big('🔪'),`How many ${fh(1,b)}s are there in ${fh(1,a)}?`,b/a,`${fh(1,a)} ÷ ${fh(1,b)} = ${b}/${a} = ${r6(b/a)}`,['fr-unit-frac','fr-div']);},
 ()=>int(()=>{const a=R(2,9),b=R(2,9);if(a===b)return 0;const s=fadd([1,a],[1,b]);return O(big('➕'),`${fh(1,a)} + ${fh(1,b)} = ? (simplest form)`,val(s),`Common denominator ${a*b}: ${b}/${a*b} + ${a}/${a*b} = ${frac(s[0],s[1])}`,['fr-unit-frac','fr-add'],true);})
]);
// B19 fractions in algebra and puzzles
V('B19',[
 ()=>{const a=pick([2,3,4,5]),m=pick([2,3,4,5]),b=pick([3,5,7]);return O(big('🔤'),`${fh('x',a*m)} = ${fh(b,m)}. Find <b>x</b>.`,a*b,`Multiply both sides by ${a*m}: x = ${b}/${m} × ${a*m} = ${a*b}`,['fr-algebra']);},
 ()=>{const d=R(2,9),k=R(2,9);return O(big('🔤'),`${fh('x',d)} = ${k}. Find <b>x</b>.`,d*k,`Multiply both sides by ${d}: x = ${k} × ${d} = ${d*k}`,['fr-algebra']);},
 ()=>{const d=pick([3,4,5,6,7]),n=R(2,4),k=R(2,6);return O(big('🔤'),`${fh(n+'x',d)} = ${n*k}. Find <b>x</b>.`,d*k,`Multiply by ${d}: ${n}x = ${n*k*d}. Divide by ${n}: x = ${d*k}`,['fr-algebra']);},
 ()=>{const[a,b]=pick([[3,5],[2,7],[4,9],[5,8],[3,7]]),k=R(2,6);return O(big('🧩'),`A fraction is equal to ${fh(a,b)}. Its numerator and denominator add to <b>${(a+b)*k}</b>. What is the <b>numerator</b>?`,a*k,`${a}k + ${b}k = ${a+b}k = ${(a+b)*k}, so k = ${k}. Numerator = ${a*k}`,['fr-algebra','fr-equivalent']);},
 ()=>{const[a,b]=pick([[2,7],[3,8],[4,9],[5,6],[3,10]]),k=R(2,6);return O(big('🧩'),`A fraction is equal to ${fh(a,b)} and its numerator is <b>${a*k}</b>. What is its <b>denominator</b>?`,b*k,`${a} × ${k} = ${a*k}, so denominator = ${b} × ${k} = ${b*k}`,['fr-algebra','fr-equivalent']);}
]);
const MIXB=['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10','B11','B12','B13','B14','B15','B16','B17','B18','B19'];
QT.B20=()=>{const k=pick(MIXB),r=QT[k]();r.k=k;return r;};
const POOL=[['A1'],['A1','A2'],['A2','A3'],['A3','A4'],['A5'],['A6'],['A6','A7'],['A8','A4'],['A9'],['A9','A10'],['A11','A4'],['A7','A10','A11','A12','A9'],['B1'],['B2'],['B3'],['B4'],['B5'],['B6'],['B7'],['B8'],['B9'],['B10'],['B11'],['B12'],['B13'],['B14'],['B15'],['B16'],['B17'],['B18'],['B19'],['B20']];
const num=s=>{s=s.trim();if(!s)return null;if(s.includes('/')){const[a,b]=s.split('/').map(Number);if(!b||isNaN(a))return null;return{v:a/b,n:a,d:b};}const v=parseFloat(s);return isNaN(v)?null:{v,n:null,d:1};};
window.__fr={QT,POOL};
REG.push({id:'fraction',name:'Fraction Factory',emoji:'🍕',color:'#e8590c',cat:'Arithmetic',
 desc:'Pizzas and chocolate bars make fractions visible. Name, simplify, add, subtract, multiply and divide fractions — 5 questions per level, 4 to pass!',skills:['equivalent fractions','simplifying','fraction of an amount','adding & subtracting fractions','multiplying & dividing fractions'],
 levels:['Name the fraction','Equivalent fractions','Simplify','Fraction of an amount','Add · same denominator','Add · different denominators','Add & subtract','Mixed → improper','Multiply fractions','Multiply & divide','Reverse fractions','Boss mix','Compare & order','Equivalent fractions','Simplify & HCF','Fraction of an amount','Express as a fraction','Fractions of fractions','Mixed numbers + / −','Mixed & improper','Multiply fractions','Divide fractions','Brackets & BIDMAS','Reciprocals','Fractions & decimals','Fractions & percentages','Word problems','Reverse problems','Ratio & fractions','Unit fractions','Fractions in algebra','Grand boss'],
 how:'Look at the picture, then type your answer as a fraction like 3/4 (use the / key) or a whole number. When it says “simplest form”, divide the top and bottom by the same number until you can’t any more.',
 art:'<div class="minibal">🍕</div>',
 mount(root,lv,ctx){mountQuiz(root,ctx,{game:'fraction',QT,pool:POOL[lv-1],parse:num,slash:true,winTitle:'Fraction master!'});}});
})();
