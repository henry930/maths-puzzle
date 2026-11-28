// Generic animated "how to play" intro engine. steps: [{say,cap,html,hand:[[ms,xPct,yPct,tap],...]}]
function mkAnim(id,STEPS){
 return function(box,api){
  box.innerHTML=`<div class="fi"><div class="fi-scene gi-scene" id="gis"><div class="gi-stage" id="gist"></div><span class="fi-hand" id="gih" style="opacity:0">👆</span>
   <div class="fi-start" id="gist0" hidden><button id="gisb">🔊 Tap to start</button></div></div>
   <div class="fi-cap" id="gic"></div><div class="fi-dots" id="gid"></div>
   <div class="fi-end" id="gie" hidden><button class="fi-go" id="gigo">▶ Let's play!</button><button class="fi-rp" id="girp">↻ Watch again</button></div></div>`;
  const q=i=>box.querySelector('#'+i),scene=q('gis'),stage=q('gist'),hand=q('gih'),cap=q('gic'),dots=q('gid'),end=q('gie'),st=q('gist0'),vb=api.voiceBtn;
  let tm=[],stopped=false,gen=0,blocked=false,curA=null;
  const SS=window.speechSynthesis,CAN=!!(SS&&window.SpeechSynthesisUtterance);
  let voiceOn=CAN;try{if(localStorage.getItem('pz-voice')==='0')voiceOn=false;}catch(e){}
  const AU=api.audio,dbg=m=>{try{api.onDebug&&api.onDebug(m);}catch(e){}};
  const SILENT='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';
  const unlock=()=>{try{AU.src=SILENT;const p=AU.play();if(p&&p.catch)p.catch(()=>{});}catch(e){}};
  dots.innerHTML=STEPS.map(()=>'<i></i>').join('');
  const dot=n=>[...dots.children].forEach((d,i)=>d.classList.toggle('on',i<=n));
  const at=(ms,fn)=>tm.push(setTimeout(()=>{if(!stopped)fn();},ms));
  const vbLabel=()=>{if(!CAN){vb.style.display='none';return;}vb.textContent=voiceOn?'🔊 Voice on':'🔇 Voice off';};
  function pickVoice(){const vs=SS.getVoices().filter(v=>/^en/i.test(v.lang));if(!vs.length)return null;
    const score=v=>(/en-GB/i.test(v.lang)?4:/en-US|en-AU|en-IE|en-IN/i.test(v.lang)?2:0)+(/natural|neural|online|premium|enhanced|siri/i.test(v.name)?6:0)+(/google|samantha|serena|daniel|karen|libby|sonia|aria|jenny|ava|allison|moira|tessa|kate|stephanie/i.test(v.name)?3:0)-(/espeak|compact|novelty|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|pipe organ|trinoids|whisper|zarvox|albert|fred|junior|kathy|ralph/i.test(v.name)?8:0)+(v.localService===false?1:0);
    return vs.slice().sort((a,b)=>score(b)-score(a))[0];}
  const stopAudio=()=>{if(curA){try{curA.onended=null;curA.onerror=null;curA.pause();}catch(e){}curA=null;}};
  function speak(text,onDone,idx){
    let done=false;const fin=()=>{if(!done){done=true;onDone();}};
    if(idx!=null&&AU){try{const a=AU;curA=a;
      const fb=why=>{if(done)return;dbg('clip '+idx+' failed ('+why+')');stopAudio();speak(text,onDone,null);};
      a.onended=()=>fin();a.onerror=()=>fb('load error');
      a.src=ROOT+'audio/'+id+'/'+idx+'.mp3';a.currentTime=0;a.volume=1;a.muted=false;
      const pr=a.play();
      if(pr&&pr.catch)pr.catch(err=>{if(err&&err.name==='NotAllowedError'){blocked=true;fin();}else fb(err&&err.name);});
      at(Math.max(9000,text.length*200),fin);return;}catch(e){}}
    try{SS.cancel();const u=new SpeechSynthesisUtterance(text);const v=pickVoice();if(v){u.voice=v;u.lang=v.lang;}else u.lang='en-GB';u.rate=.95;u.pitch=1.02;u.volume=1;
      let started=false;u.onstart=()=>{started=true;};u.onend=fin;u.onerror=()=>{if(!started)blocked=true;fin();};
      SS.speak(u);at(1800,()=>{if(!started&&!done){blocked=true;try{SS.cancel();}catch(e){}fin();}});at(Math.max(7000,text.length*170),fin);
    }catch(e){blocked=true;fin();}
  }
  const moveHand=(x,y,tap)=>{hand.style.opacity=1;hand.style.left=`calc(${x}% - 16px)`;hand.style.top=y+'%';if(tap)at(850,()=>{hand.classList.remove('tap');void hand.offsetWidth;hand.classList.add('tap');});};
  function show(i){
    const s=STEPS[i];stage.innerHTML=s.html;cap.textContent=s.cap;dot(s.d!=null?s.d:i);end.hidden=!s.last;
    hand.style.opacity=0;
    stage.querySelectorAll('[data-d]').forEach(e=>at(+e.dataset.d,()=>e.classList.add('on')));
    stage.querySelectorAll('[data-t]').forEach(e=>{const[m,c]=e.dataset.t.split(':');at(+m,()=>e.classList.toggle(c));});
    (s.hand||[]).forEach(h=>at(h[0],()=>{moveHand(h[1],h[2],h[3]);if(h[3])at(h[0]+900-h[0],()=>{});}));
    (s.tap||[]).forEach(ms=>at(ms,()=>{hand.classList.remove('tap');void hand.offsetWidth;hand.classList.add('tap');}));
  }
  function runFrom(i,g){
    if(stopped||g!==gen||i>=STEPS.length)return;
    const s=STEPS[i];show(i);
    let proceed=false;const useV=voiceOn&&CAN&&!blocked;
    const next=()=>{if(proceed||g!==gen)return;proceed=true;at(useV?(s.pause||900):0,()=>runFrom(i+1,g));};
    if(useV)speak(s.say,()=>{if(blocked){st.hidden=false;gen++;tm.forEach(clearTimeout);tm=[];return;}next();},i);else at(s.min||5000,next);
  }
  function run(){gen++;tm.forEach(clearTimeout);tm=[];stopAudio();if(CAN){try{SS.cancel();}catch(e){}}vbLabel();runFrom(0,gen);}
  vb.onclick=()=>{unlock();voiceOn=!voiceOn;blocked=false;try{localStorage.setItem('pz-voice',voiceOn?'1':'0');}catch(e){}vbLabel();run();};
  q('gisb').onclick=()=>{unlock();blocked=false;st.hidden=true;voiceOn=true;vbLabel();run();};
  q('gigo').onclick=()=>api.close();
  q('girp').onclick=()=>{unlock();blocked=false;run();};
  vbLabel();unlock();setTimeout(()=>{if(!stopped)run();},300);
  return()=>{stopped=true;gen++;tm.forEach(clearTimeout);stopAudio();if(CAN){try{SS.cancel();}catch(e){}}};
 };
}
