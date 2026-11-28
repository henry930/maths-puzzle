// shared 5-question quiz engine (pass 4/5)
function mountQuiz(root,ctx,o){
  let qs,qi,right,cur,buf,answered,res,padOpen=false,slips=0;
  const start=()=>{qs=Array.from({length:o.single?1:5},()=>pick(o.pool));qi=0;right=0;res=[];next();};
  const next=()=>{cur=o.QT[qs[qi]]();buf='';answered=false;padOpen=false;ctx.q=o.qq?o.qq(qs[qi],cur):(o.game?quizQ(o.game,qs[qi],cur):null);draw();};
  function draw(msg,ok){
    const pop=!!o.popup&&!answered&&!cur.nopad;   /* popup: the number pad only appears when the player taps to answer */
    root.innerHTML=`<div class="ch ${pop&&padOpen?'padopen':''}">${o.single?'':`<div class="statrow"><span>Question ${qi+1}/5</span><span>✅ ${right} correct (need 4)</span></div>`}
     <div class="ch-vis">${cur.visf?cur.visf(buf,answered,ok):(cur.vis||'')}</div><div class="ch-q">${cur.q}</div>
     <div class="ch-in ${ok===true?'good':ok===false?'bad':''} ${pop?'tap':''}" id="chin" ${cur.nopad?'hidden':''}>${buf||(pop?'<span class="ph">Tap here to type your answer ⌨</span>':'&nbsp;')}</div>
     <div class="msg">${msg||'&nbsp;'}</div><div id="chp"></div>
     <div class="toolrow">${answered?`<button class="btn" id="nx">${o.single?(ok?'Next ▶':'Try another ▶'):qi<4?'Next question ▶':'See result ▶'}</button>`:''}</div></div>`;
    if(!answered&&!cur.nopad&&(!pop||padOpen)){const pd=$('#chp');if(pop){pd.className='padsheet';pd.innerHTML='<div class="padbar"><span>Type your answer</span><button class="padx" id="padx">✕ Close</button></div>';}pd.appendChild(numpad(press,{slash:!!o.slash,minus:!!o.minus,compact:!!o.compact}));if(pop)$('#padx').onclick=()=>{padOpen=false;draw(msg,ok);};}
    if(pop&&$('#chin'))$('#chin').onclick=()=>{padOpen=!padOpen;draw(msg,ok);};
    {const fb=$('#ftg',root);if(fb)fb.onclick=()=>{cur.form=1-(cur.form||0);draw(msg,ok);};}   /* games can offer a second form of the same equation */
    if(cur.after)cur.after(root,{open:()=>{if(!answered&&!padOpen){padOpen=true;draw(msg,ok);}},set:s=>{if(!answered){buf=String(s);draw();}},submit,buf:()=>buf});   /* games with their own input (drag-and-drop) set the answer and submit through this */
    if($('#nx'))$('#nx').onclick=advance;
  }
  function press(k){
    if(answered||(cur.nopad&&k!=='ok'))return;
    if(k==='del')buf=buf.slice(0,-1);else if(k==='ok')return submit();else if(buf.length<12)buf+=k;
    draw();
  }
  function submit(){
    if(cur.nopad&&buf==='')buf=String(cur.start);
    const p=o.parse(buf);if(!p){draw(o.slash?'Type an answer first, e.g. 3/10':'Type an answer first');return;}
    answered=true;
    const val=Math.abs(p.v-cur.ans)<1e-6;let ok=val;
    if(ok&&cur.simplest&&p.n!=null&&gcd(p.n,p.d)!==1)ok=false,cur.ex='Right value, but the answer must be in its simplest form. '+cur.ex;
    if(ok)right++;else slips++;
    res.push({qt:cur.k||qs[qi],ok});ctx.log(ok?'right':'wrong',ok?{}:{typed:buf,expect:cur.ans,err:val?'not_simplified':'wrong_value'});
    draw((ok?'✅ Correct! ':'❌ Not quite. ')+cur.ex,ok);
  }
  function advance(){
    if(o.single){                                   /* one question = one level: solve it to clear the level, otherwise try another */
      if(res[res.length-1].ok){ctx.perf={hints:slips,undos:0,restarts:0};ctx.win(o.winTitle||'Well done!','Level cleared!',()=>{slips=0;start();},'Play again');}
      else start();
      return;}
    if(qi<4){qi++;next();return;}
    {ctx.q=levelQ(ctx.id,ctx.lv);ctx.perf={right,of:5,wrong:res.filter(r=>!r.ok).map(r=>r.qt)};}
    if(right>=4)ctx.win(o.winTitle||'Well done!',`You got ${right}/5 right.`,start,'Play again');
    else{ctx.log('fail',ctx.perf);root.innerHTML=`<div class="ch"><div class="big-emo" style="text-align:center">💪</div><div class="ch-q" style="text-align:center">You got ${right}/5. You need 4 to pass — have another go!</div><div class="toolrow"><button class="btn" id="rt">Try again</button></div></div>`;$('#rt').onclick=start;}
  }
  ctx.keys=e=>{if(/^[0-9.]$/.test(e.key)||(o.slash&&e.key==='/')||(o.minus&&e.key==='-'))press(e.key);else if(e.key==='Backspace'){e.preventDefault();press('del');}else if(e.key==='Enter')press('ok');};
  start();
  return{QT:o.QT};
}
