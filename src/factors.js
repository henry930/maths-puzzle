(function(){
const NS=[6,10,12,16,17,24,30,36,45,48,60,72,84];
const TIPS={17:'This one is special… how many ways can you arrange 17 balls?',36:'36 is a square number — one arrangement gives you the same number twice!',
 12:'When 3 rows of 4 works, 4 rows of 3 works too. Both 3 and 4 are factors!'};
const facs=n=>{const o=[];for(let i=1;i<=n;i++)if(n%i===0)o.push(i);return o;};
window.__fac={NS,facs};
REG.push({id:'factors',name:'Ball Factory',emoji:'🔵',color:'#0b7285',cat:'Arithmetic',
 desc:'Arrange a pile of balls into neat rows. If every row is full, the number of rows and columns are factors. Find them all!',skills:['factors','multiplication tables','division','prime numbers'],
 levels:NS.map(n=>'Factors of '+n),
 how:'Choose how many rows to use. If the balls fill every row perfectly, you have found two factors (rows and columns)! Orange balls are left over — then that row count is NOT a factor. Find ALL the factors to pass.',
 art:'<div class="minibal">🔵🔵🔵<br>🔵🔵🔵</div>',
 mount(root,lv,ctx){
  const N=NS[lv-1],F=facs(N),found=new Set(),pairs=[];let r=1;
  root.innerHTML=`<div class="fc"><div class="fc-tip">${TIPS[N]||'Find every number that divides '+N+' exactly.'}</div>
   <div class="fc-n">🔵 <b>${N}</b> balls</div>
   <div class="fc-board" id="fcb"></div>
   <div class="fc-eq" id="fceq"></div>
   <div class="fc-ctl"><button class="btn alt" id="fcm">−</button><input type="range" id="fcr" min="1" max="${N}" value="1"><button class="btn alt" id="fcp">+</button></div>
   <div class="fc-rowsl">Rows: <b id="fcrv">1</b></div>
   <div class="fc-found" id="fcf"></div><div class="fc-pairs" id="fcpr"></div>
   <div class="toolrow"><button class="btn alt" id="fch">💡 Hint</button></div><div class="msg" id="fcmsg">&nbsp;</div></div>`;
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
  function eq(){
    const c=Math.floor(N/r),rem=N%r;
    $('#fceq').innerHTML=rem?`${r} rows × ${c} columns = ${r*c}, <span class="bad">${rem} left over ✗</span>`:`<span class="good">${r} rows × ${c} columns = ${N} ✓</span>`;
    $('#fcrv').textContent=r;
  }
  function list(){
    const fs=[...found].sort((a,b)=>a-b);
    $('#fcf').innerHTML='<span class="fl">Factors found '+fs.length+'/'+F.length+':</span> '+fs.map(x=>`<b>${x}</b>`).join('')+Array(F.length-fs.length).fill('<u>?</u>').join('');
    $('#fcpr').innerHTML=pairs.map(p=>`${p[0]} × ${p[1]} = ${N}`).join(' &nbsp;·&nbsp; ');
  }
  function set(v,silent){
    r=Math.max(1,Math.min(N,v));$('#fcr').value=r;layout();eq();
    if(N%r===0){
      const c=N/r,new1=!found.has(r)||!found.has(c);
      if(new1){found.add(r);found.add(c);
        const key=Math.min(r,c);if(!pairs.some(p=>p[0]===key))pairs.push([key,N/key]);pairs.sort((a,b)=>a[0]-b[0]);
        list();$('#fcmsg').innerHTML=r===c?`🎉 ${r} is a factor!`:`🎉 ${r} and ${c} are both factors!`;
        if(found.size===F.length)ctx.timeout(()=>ctx.win(F.length===2?'Prime number!':'All factors found!',
          F.length===2?`${N} only has 2 factors: 1 and ${N}.`:`Factors of ${N}: ${F.join(', ')}`),500);
      }else $('#fcmsg').innerHTML='Already found — try a different number of rows.';
    }else $('#fcmsg').innerHTML=silent?'&nbsp;':`${r} doesn’t divide ${N} exactly — try again.`;
  }
  $('#fcr').oninput=e=>set(+e.target.value);
  $('#fcm').onclick=()=>set(r-1);$('#fcp').onclick=()=>set(r+1);
  $('#fch').onclick=()=>{const m=F.find(f=>!found.has(f));$('#fcmsg').innerHTML=m?`💡 Try ${m} rows.`:'You have them all!';};
  ctx.keys=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowDown')set(r-1);else if(e.key==='ArrowRight'||e.key==='ArrowUp')set(r+1);};
  window.__fcset=set;list();set(1,true);
 }});
})();
