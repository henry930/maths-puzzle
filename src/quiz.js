// shared 5-question quiz engine (pass 4/5)
function mountQuiz(root,ctx,o){
  let qs,qi,right,cur,buf,answered;
  const start=()=>{qs=Array.from({length:5},()=>pick(o.pool));qi=0;right=0;next();};
  const next=()=>{cur=o.QT[qs[qi]]();buf='';answered=false;draw();};
  function draw(msg,ok){
    root.innerHTML=`<div class="ch"><div class="statrow"><span>Question ${qi+1}/5</span><span>✅ ${right} correct (need 4)</span></div>
     <div class="ch-vis">${cur.vis||''}</div><div class="ch-q">${cur.q}</div>
     <div class="ch-in ${ok===true?'good':ok===false?'bad':''}">${buf||'&nbsp;'}</div>
     <div class="msg">${msg||'&nbsp;'}</div><div id="chp"></div>
     <div class="toolrow">${answered?`<button class="btn" id="nx">${qi<4?'Next question ▶':'See result ▶'}</button>`:''}</div></div>`;
    if(!answered)$('#chp').appendChild(numpad(press,{slash:!!o.slash}));
    if($('#nx'))$('#nx').onclick=advance;
  }
  function press(k){
    if(answered)return;
    if(k==='del')buf=buf.slice(0,-1);else if(k==='ok')return submit();else if(buf.length<12)buf+=k;
    draw();
  }
  function submit(){
    const p=o.parse(buf);if(!p){draw(o.slash?'Type an answer first, e.g. 3/10':'Type an answer first');return;}
    answered=true;
    let ok=Math.abs(p.v-cur.ans)<1e-6;
    if(ok&&cur.simplest&&p.n!=null&&gcd(p.n,p.d)!==1)ok=false,cur.ex='Right value, but the answer must be in its simplest form. '+cur.ex;
    if(ok)right++;
    draw((ok?'✅ Correct! ':'❌ Not quite. ')+cur.ex,ok);
  }
  function advance(){
    if(qi<4){qi++;next();return;}
    if(right>=4)ctx.win(o.winTitle||'Well done!',`You got ${right}/5 right.`,start,'Play again');
    else{root.innerHTML=`<div class="ch"><div class="big-emo" style="text-align:center">💪</div><div class="ch-q" style="text-align:center">You got ${right}/5. You need 4 to pass — have another go!</div><div class="toolrow"><button class="btn" id="rt">Try again</button></div></div>`;$('#rt').onclick=start;}
  }
  ctx.keys=e=>{if(/^[0-9.]$/.test(e.key)||(o.slash&&e.key==='/'))press(e.key);else if(e.key==='Backspace'){e.preventDefault();press('del');}else if(e.key==='Enter')press('ok');};
  start();
  return{QT:o.QT};
}
