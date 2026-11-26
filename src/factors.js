(function(){
const NS=(()=>{const pr=n=>{for(let i=2;i*i<=n;i++)if(n%i===0)return false;return n>1;};
 const a=[];for(let n=6;n<=130&&a.length<100;n++){if(pr(n)&&n>50&&![53,71,97,113].includes(n))continue;a.push(n);}
 let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
 for(let i=0;i<a.length;i+=4){const w=a.slice(i,i+4);for(let j=w.length-1;j>0;j--){const k=Math.floor(rnd()*(j+1));[w[j],w[k]]=[w[k],w[j]];}a.splice(i,w.length,...w);}
 return a.slice(0,100);})();
const TIPS={17:'This one is special… how many ways can you arrange 17 balls?',36:'36 is a square number — one arrangement gives you the same number twice!',
 12:'When 3 rows of 4 works, 4 rows of 3 works too. Both 3 and 4 are factors!'};
const facs=n=>{const o=[];for(let i=1;i<=n;i++)if(n%i===0)o.push(i);return o;};
window.__fac={NS,facs};
REG.push({id:'factors',name:'Ball Factory',emoji:'🔵',color:'#0b7285',cat:'Arithmetic',
 desc:'Arrange a pile of balls into neat rows. If every row is full, the number of rows and columns are factors. Find them all!',skills:['factors','multiplication tables','division','prime numbers'],
 levels:NS.map(n=>'Factors of '+n),
 how:'Type how many rows to use, then press Arrange. If the balls fill every row perfectly, you have found two factors (rows and columns)! Orange balls are left over — then that row count is NOT a factor. 1 and the number itself are given. Find ALL the other factors, then press “That’s all”.',
 art:'<div class="minibal">🔵🔵🔵<br>🔵🔵🔵</div>',
 mount(root,lv,ctx){
  const N=NS[lv-1],F=facs(N),found=new Set([1,N]),pairs=[[1,N]];let r=1;
  root.innerHTML=`<div class="fc"><div class="fc-top"><div class="fc-ttl">✅ Factor pairs you found</div><div class="fc-pairs" id="fcpr"></div></div><div class="fc-tip">${TIPS[N]||'Find every number that divides '+N+' exactly. (1 and '+N+' are free!)'}</div>
   <div class="fc-n">🔵 <b>${N}</b> balls</div>
   <div class="fc-board" id="fcb"></div>
   <div class="fc-eq" id="fceq"></div>
   <div class="fc-ctl">Rows: <input type="number" id="fcr" inputmode="numeric" min="1" max="${N}" placeholder="?" autocomplete="off"><button class="btn go" id="fcgo">Arrange ▶</button></div>
   <div class="fc-found" id="fcf"></div>
   <div class="toolrow"><button class="btn alt" id="fch">💡 Hint</button><button class="btn go" id="fcdone">That’s all ✓</button></div><div class="msg" id="fcmsg">&nbsp;</div></div>`;
  const board=$('#fcb'),balls=[];
  for(let i=0;i<N;i++){const b=el('i','fc-ball');board.appendChild(b);balls.push(b);}
  const W=340,H=260;
  function layout(){
    const c=Math.floor(N/r),rem=N%r,cols=c+(rem?1.5:0);
    const u=Math.min((W-16)/cols,(H-16)/r),d=u*.82;
    const oy=(H-r*u)/2,x0=(W-cols*u)/2;
    balls.forEach((b,i)=>{
      let x,y,left=false;
      if(i<r*c){x=x0+(i%c)*u;y=oy+Math.floor(i/c)*u;}
      else{const k=i-r*c;x=x0+(c+.5)*u;y=oy+k*u;left=true;}
      b.style.left=(x+(u-d)/2)/W*100+'%';b.style.top=(y+(u-d)/2)/H*100+'%';b.style.width=d/W*100+'%';
      b.classList.toggle('lo',left);
    });
    board.classList.toggle('ok',rem===0);
  }
  function scatter(){
    const d=Math.min(48,Math.max(14,Math.sqrt(W*H*.45/N)*.95)),pts=[];
    balls.forEach(b=>{let x,y,t=0;do{x=8+Math.random()*(W-16-d);y=8+Math.random()*(H-16-d);t++;}while(t<200&&pts.some(p=>Math.hypot(p[0]-x,p[1]-y)<d*.95));
      pts.push([x,y]);b.style.left=x/W*100+'%';b.style.top=y/H*100+'%';b.style.width=d/W*100+'%';b.classList.remove('lo');});
    board.classList.remove('ok');
  }
  function eq(){
    const c=Math.floor(N/r),rem=N%r;
    $('#fceq').innerHTML=rem?`${r} rows × ${c} columns = ${r*c}, <span class="bad">${rem} left over ✗</span>`:`<span class="good">${r} rows × ${c} columns = ${N} ✓</span>`;
  }
  function list(){
    const fs=[...found].sort((a,b)=>a-b);
    $('#fcf').innerHTML='<span class="fl">Factors found:</span> '+fs.map(x=>`<b>${x}</b>`).join('');
    $('#fcpr').innerHTML=pairs.map(p=>`<span>${p[0]} × ${p[1]} = ${N}</span>`).join('');
  }
  function set(v,silent){
    if(!(v>=1&&v<=N&&Number.isInteger(v))){$('#fcmsg').innerHTML=`Type a whole number from 1 to ${N}.`;return;}
    r=v;layout();eq();
    if(N%r===0){
      const c=N/r,new1=!found.has(r)||!found.has(c);
      if(new1){found.add(r);found.add(c);
        const key=Math.min(r,c);if(!pairs.some(p=>p[0]===key))pairs.push([key,N/key]);pairs.sort((a,b)=>a[0]-b[0]);
        list();$('#fcmsg').innerHTML=r===c?`🎉 ${r} is a factor!`:`🎉 ${r} and ${c} are both factors!`;
      }else $('#fcmsg').innerHTML=(r===1||r===N?'1 and '+N+' are already given — look for others!':'Already found — try a different number of rows.');
    }else $('#fcmsg').innerHTML=silent?'&nbsp;':`${r} doesn’t divide ${N} exactly — try again.`;
  }
  $('#fcdone').onclick=()=>{if(found.size===F.length)ctx.win(F.length===2?'Prime number!':'All factors found!',F.length===2?`${N} only has 2 factors: 1 and ${N}.`:`Factors of ${N}: ${F.join(', ')}`);
    else{$('#fcmsg').innerHTML='Not yet — there are still factors hiding. Keep trying!';shake($('#fcf'));}};
  const inp=$('#fcr'),go=()=>{const t=inp.value.trim();set(t===''?NaN:+t);inp.select();};
  $('#fcgo').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go();};
  $('#fch').onclick=()=>{const m=F.find(f=>!found.has(f));$('#fcmsg').innerHTML=m?`💡 Try ${m} rows.`:'Nothing more to suggest — press “That’s all”!';};
  window.__fcset=set;list();scatter();$('#fceq').innerHTML='Type a number of rows 👇';
 }});
})();
