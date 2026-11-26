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
const POOL=[['T1'],['T1','T2'],['T1','T2','T3'],['T4'],['T5'],['T5','T6'],['T6','T7'],['T8'],['T8','T9'],['T10','T11'],['T12'],['T3','T4','T6','T7','T9','T10','T11','T12']];
function parseAns(s){s=s.trim();if(!s)return NaN;if(s.endsWith('%'))return parseFloat(s)/100;if(s.includes('/')){const[a,b]=s.split('/');return parseFloat(a)/parseFloat(b);}return parseFloat(s);}
window.__ch={QT,parseAns};
REG.push({id:'chance',name:'Chance Lab',emoji:'🎰',color:'#c2255c',cat:'Probability',
 desc:'Probability puzzles with bags of balls, spinners and two-dice grids. Answer 5 questions per level — get 4 right to pass!',skills:['probability','fractions','sample space'],
 levels:['Bags · one colour','Bags · “not” events','Bags · “or” events','Spinners','Two dice · sums','Two dice · at least / less than','Two dice · tricky events','Two picks · with replacement','Two picks · without replacement','Expected & relative frequency','Probability rules','Boss mix'],
 how:'Read the picture, then type your answer as a fraction like 3/10 (any equivalent fraction is accepted) or a decimal. You can use the keypad or your keyboard.',
 art:'<div class="minich">🎲🎲</div>',
 mount(root,lv,ctx){
  const pool=POOL[lv-1];let qs,qi,right,cur,buf,answered;
  function start(){qs=Array.from({length:5},()=>pick(pool));qi=0;right=0;next();}
  function next(){cur=QT[qs[qi]]();buf='';answered=false;draw();}
  function draw(msg,ok){
    root.innerHTML=`<div class="ch"><div class="statrow"><span>Question ${qi+1}/5</span><span>✅ ${right} correct (need 4)</span></div>
     <div class="ch-vis">${cur.vis}</div><div class="ch-q">${cur.q}</div>
     <div class="ch-in ${ok===true?'good':ok===false?'bad':''}">${buf||'&nbsp;'}</div>
     <div class="msg">${msg||'&nbsp;'}</div><div id="chp"></div>
     <div class="toolrow">${answered?`<button class="btn" id="nx">${qi<4?'Next question ▶':'See result ▶'}</button>`:''}</div></div>`;
    if(!answered)$('#chp').appendChild(numpad(press,{slash:true}));
    if($('#nx'))$('#nx').onclick=advance;
  }
  function press(k){
    if(answered)return;
    if(k==='del')buf=buf.slice(0,-1);
    else if(k==='ok')return submit();
    else if(buf.length<12)buf+=k;
    draw();
  }
  function submit(){
    const v=parseAns(buf);if(isNaN(v)){draw('Type an answer first, e.g. 3/10');return;}
    answered=true;const ok=Math.abs(v-cur.ans)<1e-6;if(ok)right++;
    if(cur.vis.includes('ch-grid')||cur.hl){const hl=cur.hl;if(hl)cur.vis=grid(hl);}
    draw((ok?'✅ Correct! ':'❌ Not quite. ')+cur.ex,ok);
  }
  function advance(){
    if(qi<4){qi++;next();return;}
    if(right>=4){ctx.win('Probability pro!',`You got ${right}/5 right.`,start,'Play again');}
    else{root.innerHTML=`<div class="ch"><div class="big-emo" style="text-align:center">💪</div><div class="ch-q" style="text-align:center">You got ${right}/5. You need 4 to pass — have another go!</div><div class="toolrow"><button class="btn" id="rt">Try again ⟲</button></div></div>`;$('#rt').onclick=start;}
  }
  ctx.keys=e=>{if(/^[0-9./%]$/.test(e.key))press(e.key==='%'?'%':e.key);else if(e.key==='Backspace'){e.preventDefault();press('del');}else if(e.key==='Enter')press('ok');};
  start();
 }});
})();
