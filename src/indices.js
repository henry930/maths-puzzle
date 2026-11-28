/* ---------- Power Balance: powers, indices and logs, shown on a balance ----------
   Every question is an equation with a "?" on one pan. The pans show the two sides and the beam tilts as you type, so
   you SEE when both sides are equal. A button swaps the equation between its index form and its log form (or, for the
   log laws, between the log version and the index version). 5 questions per level, 4 to pass. */
(function(){
const TAG={
 'ix-repeat':['repeated multiplication','repeated multiplication'],'ix-eval':['evaluate a power','evaluate a power'],'ix-find-index':['find the index','find the index'],
 'ix-find-base':['find the base','find the base'],'ix-zero':['zero index','zero index'],'ix-neg':['negative index','negative index'],'ix-neg-frac-base':['negative index, fraction base','negative index, fraction base'],
 'ix-frac':['fractional index','fractional index'],'ix-frac-pq':['index p/q','index p/q'],'ix-frac-neg':['negative fractional index','negative fractional index'],
 'ix-law-mul':['index law: multiply','index law: multiply'],'ix-law-div':['index law: divide','index law: divide'],'ix-law-pow':['index law: power of a power','index law: power of a power'],
 'ix-law-neg':['laws with negative indices','laws with negative indices'],'ix-letters':['laws with letters','laws with letters'],'ix-missing':['missing index','missing index'],'ix-combine':['combine index laws','combine index laws'],
 'lg-convert':['index ↔ log form','index ↔ log form'],'lg-value':['find a log','find a log'],'lg-special':['log 1 and log a','log 1 and log a'],'lg-neg':['negative log','negative log'],
 'lg-frac':['fractional log','fractional log'],'lg-base':['find the base','find the base'],'lg-add':['log law: add','log law: add'],'lg-sub':['log law: subtract','log law: subtract'],
 'lg-pow':['log law: power','log law: power'],'lg-mix':['combine log laws','combine log laws'],'lg-simplify':['log laws to a number','log laws to a number']
};
Object.keys(TAG).forEach(k=>{TAXO[k]={g:'num',en:TAG[k][0],zh:TAG[k][1]};});

/* ---- number formatting ---- */
const fmtV=v=>{const neg=v<0,a=Math.abs(v);if(Math.abs(a-Math.round(a))<1e-9)return(neg?'−':'')+Math.round(a);
  for(let d=2;d<=1000;d++){const n=a*d;if(Math.abs(n-Math.round(n))<1e-7)return(neg?'−':'')+Math.round(n)+'/'+d;}return(neg?'−':'')+a.toFixed(3);};
const frH=s=>{const m=/^(−?)(\d+)\/(\d+)$/.exec(s);return m?`${m[1]}<span class="fr"><i>${m[2]}</i><i>${m[3]}</i></span>`:s;};
const H=v=>frH(fmtV(v));
const pw=(b,e)=>`${b}<sup>${e}</sup>`;
const lg=(b,x)=>`log<sub>${b}</sub> ${x}`;
const log2=x=>Math.log(x)/Math.LN2;
const tiles=(b,n)=>Array.from({length:n},()=>`<b class="tile">${b}</b>`).join('<span class="tx">×</span>');
const par=s=>`(${s})`;
function parseT(buf){const s=String(buf).trim().replace('−','-');if(!s||s==='-')return null;const m=/^(-?)(\d*\.?\d+)(?:\/(\d*\.?\d+))?$/.exec(s);if(!m)return null;
  const a=parseFloat(m[2]),d=m[3]!=null?parseFloat(m[3]):1;if(!d)return null;return(m[1]?-1:1)*a/d;}
const typedH=buf=>{const s=String(buf).trim();return s?frH(s.replace('-','−')):'?';};
const num=s=>{const v=parseT(s);return v==null?null:{v,n:null,d:1};};

/* ---- the balance picture ----
   forms[i] = {L(T),R(T),tl(v),btn}:  L/R give the HTML of each pan (T = what has been typed so far),
   tl(v) = left − right in "steps" for a typed value v, and is 0 exactly when the balance is level. */
function Q(o){
  const q={k:o.k,q:o.q,ans:o.ans,ex:o.ex,forms:o.forms,form:0};
  q.visf=function(buf,answered,ok){
    const f=q.forms[q.form||0];
    const v=answered?q.ans:parseT(buf),T=answered?H(q.ans):typedH(buf);
    const tl=v==null?0:f.tl(v),level=v!=null&&Math.abs(tl)<1e-7;
    const ang=v==null?0:-Math.max(-16,Math.min(16,tl*7));
    q._a2=ang;
    const prev=q._a==null?0:q._a;q._a=ang;
    const gl=v==null&&String(f.L(T)).includes('?'),gr=v==null&&String(f.R(T)).includes('?');   /* dashed outline on the pan that still holds the “?” */
    const tile=(x,g)=>`<div class="bw-t ${g?'q':''}">${x}</div>`;
    return `${o.ladder?`<div class="pw-ladder">${o.ladder}</div>`:''}
     <div class="bw ${level?'lv':''}" data-a="${ang}" data-p="${prev}"><svg class="bw-svg"></svg><div class="bw-post"></div><div class="bw-beam"></div>
       <div class="bw-pan" data-s="L">${tile(f.L(T),gl)}<div class="bw-dish"></div></div>
       <div class="bw-pan" data-s="R">${tile(f.R(T),gr)}<div class="bw-dish"></div></div><div class="bw-base"></div></div>
     <div class="pw-eq">${f.L(T)} <b>=</b> ${f.R(T)}${level?' <span class="pw-ok">level ✓</span>':''}</div>
     ${q.forms.length>1?`<button class="btn alt pw-tg" id="ftg">↔ ${f.btn}</button>`:''}`;
  };
  /* same geometry as the Balance Scale game: the beam turns about the pin, each pan hangs from its end by two strings and stays upright */
  q.after=root=>{const sc=root.querySelector(".bw");if(!sc)return;cancelAnimationFrame(q._raf);
    const beam=sc.querySelector('.bw-beam'),svg=sc.querySelector('.bw-svg'),pans=[...sc.querySelectorAll('.bw-pan')];
    const tgt=+sc.dataset.a;let ang=+sc.dataset.p,vel=0;
    const place=()=>{const w=sc.clientWidth||320,pw=Math.max(112,Math.round(w*.42)),h=(w-pw)/2,cx=w/2,fy=34,r=ang*Math.PI/180,c=Math.cos(r),sn=Math.sin(r);
      const ex=[[cx-h*c,fy-h*sn],[cx+h*c,fy+h*sn]];
      beam.style.width=(2*h+22)+'px';beam.style.left=(cx-h-11)+'px';beam.style.top=(fy-6)+'px';beam.style.transform=`rotate(${ang}deg)`;
      let sv='';pans.forEach((p,i)=>{const px=ex[i][0]-pw/2,py=ex[i][1]+34,ph=p.offsetHeight||52;p.style.width=pw+'px';p.style.left=px+'px';p.style.top=py+'px';
        sv+=`<line x1="${ex[i][0]}" y1="${ex[i][1]}" x2="${px+6}" y2="${py+ph-4}" class="sc-str"/><line x1="${ex[i][0]}" y1="${ex[i][1]}" x2="${px+pw-6}" y2="${py+ph-4}" class="sc-str"/><circle cx="${ex[i][0]}" cy="${ex[i][1]}" r="4" class="sc-pin"/>`;});
      svg.setAttribute('viewBox',`0 0 ${w} ${sc.clientHeight||200}`);svg.innerHTML=sv+`<circle cx="${cx}" cy="${fy}" r="9" class="sc-pin big"/>`;};
    const step=()=>{vel+=(tgt-ang)*.11;vel*=.84;ang+=vel;place();if(Math.abs(vel)>.01||Math.abs(tgt-ang)>.04)q._raf=requestAnimationFrame(step);else{ang=tgt;place();}};
    place();q._raf=requestAnimationFrame(step);};
  return q;
}
/* an index equation  b^x = N  and its log form  x = log_b N  (answer x = e) */
function idx(b,e,Nh,first,o){
  const iF={L:T=>pw(b,T),R:()=>Nh,tl:v=>v-e,btn:'Show as a log equation'};
  const lF={L:T=>T,R:()=>lg(b,Nh),tl:v=>v-e,btn:'Show as an index equation'};
  return Q(Object.assign({forms:first==='log'?[lF,iF]:[iF,lF]},o));
}
const valQ=(X,Lh,o)=>Q(Object.assign({forms:[{L:()=>Lh,R:T=>T,tl:v=>v>0?log2(X/v):8}]},o));
const BASES=[2,3,4,5,10];
const exp=(b,n)=>Math.pow(b,n);
const ladder=(b,from,to,last)=>{const a=[];for(let e=from;e>=to;e--){const v=Math.pow(b,e);a.push(`<span class="lp">${pw(b,e<0?'−'+(-e):e)} = ${e===to&&last?'<b>?</b>':H(v)}</span>`);if(e>to)a.push(`<span class="lp d">÷${b}</span>`);}return a.join('');};

const QT={
/* ---- repeated multiplication ---- */
 R1(){const b=pick([2,3,4,5,10]),n=R(2,6);return Q({k:'R1',q:`The right pan holds ${n} copies of ${b} multiplied together. Write that as a power: ${pw(b,'?')}.`,ans:n,
   forms:[{L:T=>pw(b,T),R:()=>tiles(b,n),tl:v=>v-n,btn:''}],ex:`${b} is multiplied ${n} times, so ${tiles(b,n).replace(/<[^>]+>/g,'')} = ${pw(b,n)}. The index counts how many times the base is multiplied.`});},
 R2(){const b=pick([2,3,4,5,6,10]),n=R(2,{2:8,3:5,4:4,5:4,6:3,10:5}[b]),X=exp(b,n);return valQ(X,`${pw(b,n)}<div class="pw-sub">${tiles(b,n)}</div>`,{k:'R2',q:`Work out ${pw(b,n)}.`,ans:X,ex:`${tiles(b,n).replace(/<[^>]+>/g,'')} = ${X}`});},
 R3(){const b=pick(BASES),n=R(2,b===10?5:b===2?7:4);return idx(b,n,exp(b,n),'idx',{k:'R3',q:`${pw(b,'x')} = ${exp(b,n)}. What is x?`,ans:n,ex:`${b} multiplied by itself ${n} times gives ${exp(b,n)}, so x = ${n}. In log form: x = log<sub>${b}</sub> ${exp(b,n)} = ${n}.`});},
 R4(){const n=pick([2,3,4]),b=R(2,n===2?12:n===3?6:4),N=exp(b,n);
  return Q({k:'R4',q:`?<sup>${n}</sup> = ${N}. What is the base?`,ans:b,forms:[
   {L:T=>pw(par(T),n),R:()=>N,tl:v=>v>0?n*log2(v/b):-8,btn:'Show as a log equation'},
   {L:T=>lg(T,N),R:()=>n,tl:v=>(v>0&&v!==1)?Math.log(N)/Math.log(v)-n:8,btn:'Show as an index equation'}],ex:`${b}<sup>${n}</sup> = ${N}, so the base is ${b}.`});},
/* ---- zero index ---- */
 Z1(){const b=pick([2,3,5,10]);return valQ(1,pw(b,0),{k:'Z1',ladder:ladder(b,3,0,true),q:`Keep dividing by ${b}. What is ${pw(b,0)}?`,ans:1,ex:`Each step down divides by ${b}: ${exp(b,3)}, ${exp(b,2)}, ${b}, then ${b} ÷ ${b} = 1. So ${pw(b,0)} = 1.`});},
 Z2(){const b=pick([3,4,5,6,7,8,9,10,12,15,20,25,50,100]);return valQ(1,pw(b,0),{k:'Z2',q:`What is ${pw(b,0)}?`,ans:1,ex:`Any number (except 0) to the power 0 is 1, because ${pw(b,1)} ÷ ${b} = 1.`});},
 Z3(){const b=pick([3,5,7,9,12]),c=pick([2,4,6,8,10]),k=R(3,9),t=R(0,3);let L,X,w;
  if(t===0){L=`${pw(b,0)} + ${pw(c,0)}`;X=2;w='1 + 1';}else if(t===1){L=`${k} × ${pw(b,0)}`;X=k;w=`${k} × 1`;}else if(t===2){L=`${k} + ${pw(b,0)}`;X=k+1;w=`${k} + 1`;}else{L=`${k} − ${pw(b,0)}`;X=k-1;w=`${k} − 1`;}
  return valQ(X,L,{k:'Z3',q:`Work out ${L}.`,ans:X,ex:`Every power 0 equals 1: ${w} = ${X}.`});},
/* ---- negative index ---- */
 N1(){const b=pick([2,3,4,5,10]);return valQ(1/b,pw(b,'−1'),{k:'N1',ladder:ladder(b,1,-1,true),q:`Keep dividing by ${b}. What is ${pw(b,'−1')}?`,ans:1/b,ex:`${b}, then 1, then 1 ÷ ${b} = 1/${b}. So ${pw(b,'−1')} = 1/${b}.`});},
 N2(){const n=pick([2,3]),b=n===2?R(2,10):pick([2,3,4,5]),X=1/exp(b,n);return valQ(X,pw(b,'−'+n),{k:'N2',q:`Write ${pw(b,'−'+n)} as a fraction.`,ans:X,ex:`${pw(b,'−'+n)} = 1 ÷ ${pw(b,n)} = 1/${exp(b,n)}. A negative index means “one over”.`});},
 N3(){const c=pick([[10,1],[10,2],[10,3],[2,1],[2,2],[5,1],[5,2],[4,1]]),[b,n]=c,X=1/exp(b,n);return valQ(X,pw(b,'−'+n),{k:'N3',q:`Write ${pw(b,'−'+n)} as a decimal.`,ans:X,ex:`${pw(b,'−'+n)} = 1/${exp(b,n)} = ${X}.`});},
 N4(){const b=pick([2,3,4,5,10]),n=R(1,b===10?4:b===2?6:3),N=exp(b,n);
  return Q({k:'N4',q:`1/${N} = ${pw(b,'?')}. Find the index.`,ans:-n,forms:[
   {L:()=>frH('1/'+N),R:T=>pw(b,T),tl:v=>-n-v,btn:'Show as a log equation'},
   {L:T=>T,R:()=>lg(b,frH('1/'+N)),tl:v=>v+n,btn:'Show as an index equation'}],ex:`1/${N} = 1/${pw(b,n)} = ${pw(b,'−'+n)}, so the index is −${n}.`});},
 N5(){const f=pick([[1,2],[2,3],[1,3],[3,4],[2,5]]),n=R(1,2),[a,c]=f,X=Math.pow(c/a,n);
  return valQ(X,`${par(frH(a+'/'+c))}<sup>−${n}</sup>`,{k:'N5',q:`Write ${par(frH(a+'/'+c))}<sup>−${n}</sup> as a fraction.`,ans:X,ex:`A negative index flips the fraction: ${par(a+'/'+c)}<sup>−${n}</sup> = ${a===1?c:par(c+'/'+a)}<sup>${n}</sup> = ${fmtV(X)}.`});},
/* ---- fractional index ---- */
 F1(){const r=R(2,13),N=r*r;return Q({k:'F1',q:`What is ${pw(N,frH('1/2'))}? (It is the number that multiplies by itself to make ${N}.)`,ans:r,forms:[
   {L:()=>pw(N,frH('1/2')),R:T=>T,tl:v=>v>0?log2(r/v):8,btn:'Show what it means: ? × ?'},
   {L:T=>`${T}<span class="tx">×</span>${T}`,R:()=>N,tl:v=>v>0?2*log2(v/r):-8,btn:'Show as a power'}],ex:`${r} × ${r} = ${N}, so ${pw(N,frH('1/2'))} = √${N} = ${r}.`});},
 F2(){const r=R(2,10),N=r*r*r;return Q({k:'F2',q:`What is ${pw(N,frH('1/3'))}? (The number that multiplies three times to make ${N}.)`,ans:r,forms:[
   {L:()=>pw(N,frH('1/3')),R:T=>T,tl:v=>v>0?log2(r/v):8,btn:'Show what it means: ? × ? × ?'},
   {L:T=>`${T}<span class="tx">×</span>${T}<span class="tx">×</span>${T}`,R:()=>N,tl:v=>v>0?3*log2(v/r):-8,btn:'Show as a power'}],ex:`${r} × ${r} × ${r} = ${N}, so ${pw(N,frH('1/3'))} = ∛${N} = ${r}.`});},
 F3(){const c=pick([[16,4,2],[81,4,3],[625,4,5],[32,5,2],[243,5,3],[10000,4,10]]),[N,k,r]=c;return Q({k:'F3',q:`What is ${pw(N,frH('1/'+k))}?`,ans:r,forms:[
   {L:()=>pw(N,frH('1/'+k)),R:T=>T,tl:v=>v>0?log2(r/v):8,btn:`Show what it means`},
   {L:T=>Array(k).fill(T).join('<span class="tx">×</span>'),R:()=>N,tl:v=>v>0?k*log2(v/r):-8,btn:'Show as a power'}],ex:`${Array(k).fill(r).join(' × ')} = ${N}, so ${pw(N,frH('1/'+k))} = ${r}.`});},
 F4(){const c=pick([[4,3,2,2],[9,3,2,3],[25,3,2,5],[16,3,4,2],[8,2,3,2],[27,2,3,3],[16,3,4,2],[4,5,2,2],[64,2,3,4],[125,2,3,5],[32,3,5,2],[81,3,4,3]]),[N,p,q,r]=c,X=Math.pow(r,p);
  return valQ(X,pw(N,frH(p+'/'+q)),{k:'F4',q:`What is ${pw(N,frH(p+'/'+q))}?`,ans:X,ex:`Root first, then power: the ${q===2?'square':q===3?'cube':q+'th'} root of ${N} is ${r}, and ${r}<sup>${p}</sup> = ${X}.`});},
 F5(){const c=pick([[4,1,2,2],[9,1,2,3],[25,1,2,5],[8,1,3,2],[27,1,3,3],[27,2,3,3],[16,3,4,2],[4,3,2,2],[8,2,3,2],[9,3,2,3]]),[N,p,q,r]=c,X=1/Math.pow(r,p);
  return valQ(X,pw(N,'−'+frH(p+'/'+q)),{k:'F5',q:`Write ${pw(N,'−'+frH(p+'/'+q))} as a fraction.`,ans:X,ex:`Negative → flip: 1 ÷ ${pw(N,frH(p+'/'+q))}. The ${q===2?'square':q===3?'cube':q+'th'} root of ${N} is ${r}, and ${r}<sup>${p}</sup> = ${Math.pow(r,p)}. So the answer is 1/${Math.pow(r,p)}.`});},
 F6(){const c=pick([[9,3,1/2],[8,2,1/3],[16,2,1/4],[125,5,1/3],[4,8,3/2],[9,27,3/2],[8,4,2/3],[4,0.5,-1/2],[25,5,1/2],[27,9,2/3],[16,8,3/4]]),[b,N,e]=c;
  return idx(b,e,N===0.5?frH('1/2'):String(N),'idx',{k:'F6',q:`${pw(b,'x')} = ${fmtV(N)}. Find x (a fraction).`,ans:e,ex:`${b}<sup>${fmtV(e)}</sup> = ${fmtV(N)}, so x = ${fmtV(e)}.`});},
/* ---- index laws (numbers) ---- */
 L1(){const b=pick([2,3,5,7,10]),m=R(2,6),n=R(2,6),s=m+n;return lawQ('L1',b,`${pw(b,m)} × ${pw(b,n)}`,s,`log<sub>${b}</sub> ${pw(b,m)} + log<sub>${b}</sub> ${pw(b,n)}`,`${m} + ${n}`,`When you multiply powers of the same base you add the indices: ${m} + ${n} = ${s}.`);},
 L2(){const b=pick([2,3,5,7,10]),n=R(2,5),m=n+R(1,5),s=m-n;return lawQ('L2',b,`${pw(b,m)} ÷ ${pw(b,n)}`,s,`log<sub>${b}</sub> ${pw(b,m)} − log<sub>${b}</sub> ${pw(b,n)}`,`${m} − ${n}`,`When you divide powers of the same base you subtract the indices: ${m} − ${n} = ${s}.`);},
 L3(){const b=pick([2,3,5,10]),m=R(2,5),n=R(2,4),s=m*n;return lawQ('L3',b,`${par(pw(b,m))}<sup>${n}</sup>`,s,`${n} × log<sub>${b}</sub> ${pw(b,m)}`,`${n} × ${m}`,`A power of a power: multiply the indices: ${m} × ${n} = ${s}.`);},
 L4(){const b=pick([2,3,5]),t=R(0,2);let L,s,w;
  if(t===0){const m=R(3,7),n=R(1,m-1)+0,k=n;L=`${pw(b,m)} × ${pw(b,'−'+k)}`;s=m-k;w=`${m} + (−${k}) = ${s}`;}
  else if(t===1){const m=R(1,4),n=R(2,6);L=`${pw(b,'−'+m)} ÷ ${pw(b,n)}`;s=-m-n;w=`−${m} − ${n} = ${s}`;}
  else{const m=R(1,4),n=R(2,3);L=`${par(pw(b,'−'+m))}<sup>${n}</sup>`;s=-m*n;w=`−${m} × ${n} = ${s}`;}
  return lawQ('L4',b,L,s,null,null,`Use the index laws with the negative sign: ${w}.`);},
 L5(){const v=pick(['x','y','a','p','t']),t=R(0,2);let L,s,w;
  if(t===0){const m=R(2,9),n=R(2,9);L=`${pw(v,m)} × ${pw(v,n)}`;s=m+n;w=`${m} + ${n}`;}
  else if(t===1){const n=R(2,6),m=n+R(1,6);L=`${pw(v,m)} ÷ ${pw(v,n)}`;s=m-n;w=`${m} − ${n}`;}
  else{const m=R(2,6),n=R(2,5);L=`${par(pw(v,m))}<sup>${n}</sup>`;s=m*n;w=`${m} × ${n}`;}
  return Q({k:'L5',q:`${L} = ${pw(v,'?')}. Find the missing index.`,ans:s,forms:[{L:()=>L,R:T=>pw(v,T),tl:x=>s-x,btn:''}],ex:`Same letter, so use the index law: ${w} = ${s}.`});},
 L6(){const b=pick([2,3,5,10]),t=R(0,2);let L,e,N,s;
  if(t===0){const n=R(2,5),N0=n+R(2,5);L=T=>`${pw(b,T)} × ${pw(b,n)}`;N=N0;s=N0-n;e=x=>x+n;}
  else if(t===1){const m=R(6,10),N0=R(2,m-2);L=T=>`${pw(b,m)} ÷ ${pw(b,T)}`;N=N0;s=m-N0;e=x=>m-x;}
  else{const n=R(2,4),k=R(2,5);L=T=>`${par(pw(b,T))}<sup>${n}</sup>`;N=n*k;s=k;e=x=>x*n;}
  return Q({k:'L6',q:`${L('?')} = ${pw(b,N)}. Find the missing index.`,ans:s,forms:[{L:T=>L(T),R:()=>pw(b,N),tl:x=>e(x)-N,btn:''}],ex:`Use the index law backwards: the missing index is ${s}.`});},
 L7(){const b=pick([2,3,5]),t=R(0,2);let L,s,w;
  if(t===0){const m=R(2,3),n=R(2,3),k=R(1,4);L=`${par(pw(b,m))}<sup>${n}</sup> × ${pw(b,k)}`;s=m*n+k;w=`${m}×${n} + ${k}`;}
  else if(t===1){const m=R(3,6),n=R(2,5),k=R(1,m+n-1);L=`${pw(b,m)} × ${pw(b,n)} ÷ ${pw(b,k)}`;s=m+n-k;w=`${m} + ${n} − ${k}`;}
  else{const m=R(4,9),n=R(1,3),k=R(2,3);L=`${par(pw(b,m)+' ÷ '+pw(b,n))}<sup>${k}</sup>`;s=(m-n)*k;w=`(${m} − ${n}) × ${k}`;}
  return lawQ('L7',b,L,s,null,null,`Use the laws one at a time: ${w} = ${s}.`);},
 L8(){const b=pick([2,3,5]),n=R(2,4),m=n+R(1,3),X=exp(b,m-n);return valQ(X,`${pw(b,m)} ÷ ${pw(b,n)}`,{k:'L8',q:`Work out ${pw(b,m)} ÷ ${pw(b,n)}.`,ans:X,ex:`Subtract the indices: ${pw(b,m-n)} = ${X}.`});},
/* ---- index ↔ log ---- */
 C1(){const b=pick(BASES),n=R(2,b===10?5:b===2?6:4),N=exp(b,n);return idx(b,n,N,'idx',{k:'C1',q:`${pw(b,'x')} = ${N}. Find x. (Tap the button to see it as a log equation.)`,ans:n,ex:`${pw(b,n)} = ${N}, so x = ${n}. In log form: x = log<sub>${b}</sub> ${N}.`});},
 C2(){const b=pick(BASES),n=R(1,b===10?5:b===2?7:4),N=exp(b,n);return idx(b,n,N,'log',{k:'C2',q:`Work out log<sub>${b}</sub> ${N}.`,ans:n,ex:`log<sub>${b}</sub> ${N} asks “${b} to the power what gives ${N}?”. ${pw(b,n)} = ${N}, so the answer is ${n}.`});},
 C3(){const n=R(-3,5),N=Math.pow(10,n),Nd=String(N);return idx(10,n,Nd,'log',{k:'C3',q:`Work out log<sub>10</sub> ${Nd}.`,ans:n,ex:`10<sup>${n}</sup> = ${Nd}, so log<sub>10</sub> ${Nd} = ${n}.`});},
 C4(){const b=pick([2,3,5,7,10]),t=R(0,2);let X,n;if(t===0){X='1';n=0;}else if(t===1){X=b;n=1;}else{n=R(2,4);X=pw(b,n);}
  return idx(b,n,X,'log',{k:'C4',q:`Work out log<sub>${b}</sub> ${X}.`,ans:n,ex:n===0?`${pw(b,0)} = 1, so log<sub>${b}</sub> 1 = 0 (for every base).`:n===1?`${pw(b,1)} = ${b}, so log<sub>${b}</sub> ${b} = 1.`:`log<sub>${b}</sub> ${pw(b,n)} = ${n}: the log undoes the power.`});},
 C5(){const c=pick([[2,-3,'1/8'],[3,-2,'1/9'],[5,-2,'1/25'],[2,-4,'1/16'],[10,-2,'1/100'],[9,0.5,3],[8,1/3,2],[4,1.5,8],[25,0.5,5],[27,1/3,3],[16,0.75,8],[16,0.25,2],[4,0.5,2]]),[b,e,N]=c;
  return idx(b,e,frH(String(N)),'log',{k:'C5',q:`Work out log<sub>${b}</sub> ${typeof N==='string'?frH(N):N}. (Negative or fraction answers are allowed.)`,ans:e,ex:`${b}<sup>${fmtV(e)}</sup> = ${N}, so log<sub>${b}</sub> ${N} = ${fmtV(e)}.`});},
 C6(){const n=pick([2,3,4]),b=R(2,n===2?10:n===3?5:3),N=exp(b,n);
  return Q({k:'C6',q:`log<sub>?</sub> ${N} = ${n}. What is the base?`,ans:b,forms:[
   {L:T=>lg(T,N),R:()=>n,tl:v=>(v>0&&v!==1)?Math.log(N)/Math.log(v)-n:8,btn:'Show as an index equation'},
   {L:T=>pw(par(T),n),R:()=>N,tl:v=>v>0?n*log2(v/b):-8,btn:'Show as a log equation'}],ex:`log in base ${b}: ${pw(b,n)} = ${N}, so the base is ${b}.`});},
 C8(){const c=pick([[5,3,125],[2,-4,'1/16'],[4,0.5,2],[9,-0.5,'1/3'],[8,2/3,4],[3,-3,'1/27'],[2,10,1024],[10,-1,'1/10'],[4,-1.5,'1/8'],[25,1.5,125]]),[b,e,N]=c;
  return idx(b,e,frH(String(N)),'idx',{k:'C8',q:`${pw(b,'x')} = ${typeof N==='string'?frH(N):N}. Find x.`,ans:e,ex:`Use logs: x = log<sub>${b}</sub> ${N} = ${fmtV(e)}.`});},
/* ---- log laws ---- */
 G1(){const b=pick([2,3,5,10]),a=R(2,9),c=R(2,9);return logLaw('G1',b,`${lg(b,a)} + ${lg(b,c)}`,a*c,`${a} × ${c}`,`log<sub>${b}</sub> ? : add the logs → multiply inside. ${a} × ${c} = ${a*c}.`,x=>Math.log(a*c)/Math.log(b));},
 G2(){const b=pick([2,3,5,10]),c=R(2,8),k=R(2,8),a=c*k;return logLaw('G2',b,`${lg(b,a)} − ${lg(b,c)}`,k,`${a} ÷ ${c}`,`Subtract the logs → divide inside: ${a} ÷ ${c} = ${k}.`);},
 G3(){const b=pick([2,3,5,10]),n=pick([2,3]),a=R(2,6);return logLaw('G3',b,`${n} × ${lg(b,a)}`,Math.pow(a,n),`${a}<sup>${n}</sup>`,`A number in front becomes a power: ${n} × log<sub>${b}</sub> ${a} = log<sub>${b}</sub> ${a}<sup>${n}</sup> = log<sub>${b}</sub> ${Math.pow(a,n)}.`);},
 G4(){const b=pick([2,3,5,10]),d=pick([2,3,4,6]);let A,C,g=0;do{A=R(2,9);C=R(2,9);g++;}while(((A*C)%d||A===d||C===d)&&g<500);const X=A*C/d;return logLaw('G4',b,`${lg(b,A)} + ${lg(b,C)} − ${lg(b,d)}`,X,`${A} × ${C} ÷ ${d}`,`Add → multiply, subtract → divide: ${A} × ${C} ÷ ${d} = ${X}.`);},
 G5(){const b=pick([2,3,5]),k=R(1,3),c=R(2,6),a=c*exp(b,k);return Q({k:'G5',q:`Work out ${lg(b,a)} − ${lg(b,c)}.`,ans:k,forms:[
   {L:()=>`${lg(b,a)} − ${lg(b,c)}`,R:T=>T,tl:v=>k-v,btn:'Show in index form'},
   {L:()=>`${a} ÷ ${c}`,R:T=>pw(b,T),tl:v=>(k-v)*log2(b),btn:'Show in log form'}],ex:`Subtract logs → divide: ${a} ÷ ${c} = ${exp(b,k)} = ${pw(b,k)}, so the answer is ${k}.`});},
 G6(){const c=pick([[2,5,1],[4,25,2],[5,20,2],[2,50,2],[25,40,3],[8,125,3],[5,200,3],[20,50,3],[4,250,3]]),[a,d,k]=c;return Q({k:'G6',q:`Work out log ${a} + log ${d}. (log means log<sub>10</sub>)`,ans:k,forms:[
   {L:()=>`log ${a} + log ${d}`,R:T=>T,tl:v=>k-v,btn:'Show in index form'},
   {L:()=>`${a} × ${d}`,R:T=>pw(10,T),tl:v=>(k-v)*log2(10),btn:'Show in log form'}],ex:`Add logs → multiply: ${a} × ${d} = ${a*d} = ${pw(10,k)}, so the answer is ${k}.`});},
 G7(){const b=pick([2,3,5,10]),c=R(2,4),m=R(2,5),a=c*c*m,X=m;return logLaw('G7',b,`${lg(b,a)} − 2 × ${lg(b,c)}`,X,`${a} ÷ ${c}<sup>2</sup>`,`2 × log<sub>${b}</sub> ${c} = log<sub>${b}</sub> ${c*c}. Then subtract → divide: ${a} ÷ ${c*c} = ${X}.`);},
 G8(){const b=pick([2,3,5]),k=R(1,3),n=R(2,4),a=exp(b,k);return Q({k:'G8',q:`Work out ${lg(b,a+'<sup>'+n+'</sup>')}.`,ans:k*n,forms:[
   {L:()=>lg(b,a+'<sup>'+n+'</sup>'),R:T=>T,tl:v=>k*n-v,btn:'Show in index form'},
   {L:T=>pw(b,T),R:()=>`${a}<sup>${n}</sup>`,tl:v=>(v-k*n)*log2(b),btn:'Show in log form'}],ex:`${n} × log<sub>${b}</sub> ${a} = ${n} × ${k} = ${k*n}.`});}
};
/* an index-law question: balance of the numbers form, log version one tap away */
function lawQ(k,b,L,s,logL,logW,ex){
  const forms=[{L:()=>L,R:T=>pw(b,T),tl:v=>s-v,btn:logL?'Show the log version of this law':''}];
  if(logL)forms.push({L:()=>`${logL}`,R:T=>T,tl:v=>s-v,btn:'Show the index version'});
  return Q({k,q:`${L} = ${pw(b,'?')}. Find the missing index.`,ans:s,forms,ex});
}
/* a log-law question: log version, with an index version (raise the base to both sides) one tap away */
function logLaw(k,b,Lh,X,indexH,ex){
  return Q({k,q:`${Lh} = ${lg(b,'?')}. What goes in the box?`,ans:X,forms:[
   {L:()=>Lh,R:T=>lg(b,T),tl:v=>v>0?log2(X/v):8,btn:'Show in index form'},
   {L:()=>indexH,R:T=>T,tl:v=>v>0?log2(X/v):8,btn:'Show in log form'}],ex});
}

/* ---- levels: name, question types, and difficulty / tags per question type ---- */
const D={R1:[1,['ix-repeat']],R2:[1,['ix-eval']],R3:[2,['ix-find-index','lg-convert']],R4:[3,['ix-find-base']],
 Z1:[2,['ix-zero']],Z2:[2,['ix-zero']],Z3:[3,['ix-zero','ix-eval']],
 N1:[3,['ix-neg']],N2:[3,['ix-neg']],N3:[3,['ix-neg']],N4:[4,['ix-neg','ix-find-index']],N5:[5,['ix-neg','ix-neg-frac-base']],
 F1:[4,['ix-frac']],F2:[4,['ix-frac']],F3:[5,['ix-frac']],F4:[6,['ix-frac','ix-frac-pq']],F5:[7,['ix-frac','ix-frac-pq','ix-frac-neg']],F6:[7,['ix-frac','ix-find-index']],
 L1:[3,['ix-law-mul']],L2:[3,['ix-law-div']],L3:[4,['ix-law-pow']],L4:[5,['ix-law-neg']],L5:[4,['ix-letters']],L6:[5,['ix-missing']],L7:[6,['ix-combine']],L8:[3,['ix-law-div','ix-eval']],
 C1:[4,['lg-convert','ix-find-index']],C2:[5,['lg-convert','lg-value']],C3:[5,['lg-value','lg-neg']],C4:[5,['lg-special']],C5:[7,['lg-value','lg-neg','lg-frac']],C6:[7,['lg-base']],C8:[8,['lg-convert','lg-neg','lg-frac']],
 G1:[6,['lg-add']],G2:[6,['lg-sub']],G3:[7,['lg-pow']],G4:[8,['lg-mix']],G5:[7,['lg-simplify','lg-sub']],G6:[7,['lg-simplify','lg-add']],G7:[8,['lg-mix','lg-pow']],G8:[7,['lg-pow','lg-simplify']]};
const LV=[
 ['Repeated multiplication → power',['R1']],['Repeated multiplication · find the index',['R1','R3']],['Evaluate powers',['R2']],['Find the missing base',['R4','R3']],
 ['Zero index · the halving ladder',['Z1']],['Zero index',['Z1','Z2']],['Zero index · mixed',['Z2','Z3']],
 ['Negative index · keep dividing',['N1']],['Negative index · fractions',['N1','N2']],['Negative index · decimals',['N2','N3']],['Powers as negative indices',['N4','N2']],['Negative index · fraction base',['N5','N2']],
 ['Fractional index · square roots',['F1']],['Fractional index · cube roots and more',['F1','F2','F3']],['Fractional index · p/q',['F4','F2']],['Negative fractional index',['F5','F4']],['Find the fractional index',['F6']],
 ['Index law · multiply',['L1']],['Index law · divide',['L2','L8']],['Index law · power of a power',['L3']],['Index laws · all three',['L1','L2','L3']],['Index laws · negative indices',['L4']],['Index laws · with letters',['L5']],['Index laws · missing index',['L6','L7']],
 ['Index → log · 2ˣ = 8',['C1']],['Log values',['C2','C3']],['Special logs · log 1 and log a',['C4']],['Negative and fractional logs',['C5']],['Find the base',['C6','C2']],['Solve index equations with logs',['C8','C1']],
 ['Log law · add',['G1']],['Log law · subtract',['G2','G5']],['Log law · powers',['G3','G8']],['Log laws · combine',['G4','G6','G7']],
 ['Boss · indices',['R2','Z3','N2','F4','L1','L4','L7']],['Boss · logs and laws',['C2','C5','G1','G2','G3','G4','G7']]];
const POOL=LV.map(l=>l[1]);
const clamp=d=>Math.max(1,Math.min(10,d));
const plain=h=>String(h).replace(/<\/i><i>/g,'/').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const qq=(key,cur)=>{const m=D[cur.k||key];if(!m)return null;return{v:1,tags:[...m[1]].sort(),diff:m[0],score:m[0],qt:cur.k||key,eq:plain(cur.q)};};
const qmeta=lv=>{const pool=[...new Set(POOL[lv-1])],ms=pool.map(k=>D[k]),all=new Set(ms.flatMap(m=>m[1])),tags=[...all].filter(t=>ms.every(m=>m[1].includes(t))).sort(),
  sometimes=[...all].filter(t=>!tags.includes(t)).sort(),d=ms.reduce((a,m)=>a+m[0],0)/ms.length;
  return{tags,sometimes,types:pool,diff:Math.round(clamp(d)),score:Math.round(clamp(d)*10)/10};};
window.__ix={QT,POOL,D,LV};
REG.push({id:'indices',name:'Power Balance',emoji:'🔋',color:'#0b7285',cat:'Algebra',qmeta,
 desc:'Powers, indices and logs on a balance. See why n⁰ = 1, why negative indices flip, what a fractional index means, and how every index law turns into a log law. Tap the button to swap an equation between index form and log form.',
 skills:['powers and indices','zero, negative and fractional indices','index laws','logarithms','log laws'],levels:LV.map(l=>l[0]),
 how:'The balance shows both sides of an equation. Type the missing number (use − for negative and / for fractions) and watch the beam: when both sides are equal it levels out. Tap the ↔ button to see the same equation in log form — or, for the log laws, in index form. 5 questions per level, 4 to pass!',
 art:'<div class="minibal">🔋</div>',
 mount(root,lv,ctx){mountQuiz(root,ctx,{game:null,qq,QT,pool:POOL[lv-1],parse:num,slash:true,minus:true,winTitle:'Power player!'});}});
})();
