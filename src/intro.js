// Live demo engine: the REAL game (seeded question) is driven by a pointer hand while a voice explains.
function mkDemo(id,STEPS){
 return function(box,api){
  box.innerHTML=`<div class="dm-cap" id="dmc"></div><div class="fi-dots" id="dmd"></div>`;
  const ov=document.querySelector('.intro');
  ov.insertAdjacentHTML('beforeend',`<span class="fi-hand dm-hand" id="dmh" style="opacity:0">👆</span><div class="fi-start" id="dms" hidden><button id="dmsb">🔊 Tap to start</button></div><div class="fi-end dm-end" id="dme" hidden><button class="fi-go" id="dmgo">▶ Let's play!</button><button class="fi-rp" id="dmrp">↻ Watch again</button></div>`);
  const q=i=>ov.querySelector('#'+i),cap=q('dmc'),dots=q('dmd'),hand=q('dmh'),st=q('dms'),end=q('dme'),vb=api.voiceBtn;
  let tm=[],stopped=false,gen=0,blocked=false,curA=null,hl=[];
  const SS=window.speechSynthesis,CAN=!!(SS&&window.SpeechSynthesisUtterance);
  let voiceOn=CAN;try{if(localStorage.getItem('pz-voice')==='0')voiceOn=false;}catch(e){}
  const AU=api.audio;
  const SILENT='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';
  const unlock=()=>{try{AU.src=SILENT;const p=AU.play();if(p&&p.catch)p.catch(()=>{});}catch(e){}};
  dots.innerHTML=STEPS.map(()=>'<i></i>').join('');
  const dot=n=>[...dots.children].forEach((d,i)=>d.classList.toggle('on',i<=n));
  const at=(ms,fn)=>tm.push(setTimeout(()=>{if(!stopped)fn();},ms));
  const vbLabel=()=>{if(!CAN){vb.style.display='none';return;}vb.textContent=voiceOn?'🔊 Voice on':'🔇 Voice off';};
  function pickVoice(){const vs=SS.getVoices().filter(v=>/^en/i.test(v.lang));if(!vs.length)return null;
    const score=v=>(/en-GB/i.test(v.lang)?4:/en-US|en-AU|en-IE|en-IN/i.test(v.lang)?2:0)+(/natural|neural|online|premium|enhanced|siri/i.test(v.name)?6:0)-(/espeak|compact|novelty|zarvox|albert|fred|junior|kathy|ralph/i.test(v.name)?8:0);
    return vs.slice().sort((a,b)=>score(b)-score(a))[0];}
  const stopAudio=()=>{if(curA){try{curA.onended=null;curA.onerror=null;curA.pause();}catch(e){}curA=null;}};
  function speak(text,onDone,idx){
    let done=false;const fin=()=>{if(!done){done=true;onDone();}};
    if(idx!=null&&AU){try{const a=AU;curA=a;
      const fb=()=>{if(done)return;stopAudio();speak(text,onDone,null);};
      a.onended=()=>fin();a.onerror=fb;
      a.src=ROOT+'audio/'+id+'/'+idx+'.mp3';a.currentTime=0;a.volume=1;a.muted=false;
      const pr=a.play();
      if(pr&&pr.catch)pr.catch(err=>{if(err&&err.name==='NotAllowedError'){blocked=true;fin();}else fb();});
      at(Math.max(9000,text.length*200),fin);return;}catch(e){}}
    try{SS.cancel();const u=new SpeechSynthesisUtterance(text);const v=pickVoice();if(v){u.voice=v;u.lang=v.lang;}else u.lang='en-GB';u.rate=.95;u.volume=1;
      let started=false;u.onstart=()=>{started=true;};u.onend=fin;u.onerror=()=>{if(!started)blocked=true;fin();};
      SS.speak(u);at(1800,()=>{if(!started&&!done){blocked=true;try{SS.cancel();}catch(e){}fin();}});at(Math.max(7000,text.length*170),fin);
    }catch(e){blocked=true;fin();}
  }
  // ---- puppet helpers (all cancel when the run generation changes)
  const wait=(ms,g)=>new Promise((res,rej)=>at(ms,()=>g!==gen?rej('x'):res()));
  const elOf=t=>typeof t==='string'?document.querySelector(t):t;
  function P(g){
    const place=(el)=>{const r=el.getBoundingClientRect();hand.style.opacity=1;hand.style.left=(r.left+r.width/2-14)+'px';hand.style.top=(r.top+r.height*.55)+'px';};
    const api2={
      wait:ms=>wait(ms,g),
      el:elOf,
      async point(t,ms){const e=elOf(t);if(!e)return;place(e);await wait(ms||900,g);},
      async tap(t,fire){const e=elOf(t);if(!e)return;place(e);await wait(950,g);hand.classList.remove('tap');void hand.offsetWidth;hand.classList.add('tap');await wait(220,g);
        if(fire)fire(e);else e.click();await wait(350,g);},
      async key(lbl){const all=[...document.querySelectorAll('.npad .key,.ex-pad .key')];
        const k=all.find(x=>x.dataset.k===lbl)||all.find(x=>x.textContent.trim()===lbl)||all.find(x=>x.textContent.includes(lbl));if(k)await api2.tap(k);},
      async type(str){for(const ch of String(str))await api2.key(ch);},
      async tapAt(t,fx,fy){const e=elOf(t);if(!e)return;const r=e.getBoundingClientRect(),x=r.left+r.width*fx,y=r.top+r.height*fy;
        hand.style.opacity=1;hand.style.left=(x-14)+'px';hand.style.top=(y+3)+'px';await wait(950,g);hand.classList.remove('tap');void hand.offsetWidth;hand.classList.add('tap');await wait(220,g);
        e.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:x,clientY:y}));await wait(450,g);},
      async drag(t,to,ms){const e=elOf(t);if(!e)return;const r=e.getBoundingClientRect(),sx=r.left+r.width/2,sy=r.top+r.height/2;
        let tx,ty;if(to&&to.x!=null){tx=to.x;ty=to.y;}else{const te=elOf(to),tr=te.getBoundingClientRect();tx=tr.left+tr.width/2;ty=tr.top+tr.height/2;}
        place(e);await wait(800,g);const ev=(type,x,y,tg)=>(tg||window).dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,pointerId:1,isPrimary:true,pointerType:'touch'}));
        e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,clientX:sx,clientY:sy,pointerId:1,isPrimary:true,pointerType:'touch'}));
        const old=hand.style.transition;hand.style.transition='left .06s linear,top .06s linear';const N=22;
        for(let i=1;i<=N;i++){const x=sx+(tx-sx)*i/N,y=sy+(ty-sy)*i/N;hand.style.left=(x-14)+'px';hand.style.top=(y+r.height*.05)+'px';ev('pointermove',x,y);await wait((ms||1000)/N,g);}
        ev('pointerup',tx,ty);hand.style.transition=old;await wait(500,g);},
      hl(t){const e=elOf(t);if(e){e.classList.add('dm-hl');hl.push(e);}return e;},
      unhl(){hl.forEach(e=>e.classList.remove('dm-hl'));hl=[];},
      hide(){hand.style.opacity=0;}
    };return api2;}
  function runFrom(i,g){
    if(stopped||g!==gen)return;
    if(i>=STEPS.length)return;
    const s=STEPS[i];cap.textContent=s.cap;dot(i);end.hidden=!s.last;
    const h=P(g);h.unhl();if(s.hand===0)h.hide();
    const useV=voiceOn&&CAN&&!blocked;let aDone=!useV,dDone=false,proceed=false;
    const go=()=>{if(proceed||g!==gen||!aDone||!dDone)return;proceed=true;at(useV?(s.pause||700):300,()=>runFrom(i+1,g));};
    Promise.resolve().then(()=>s.do?s.do(h):0).catch(()=>{}).then(()=>{dDone=true;go();});
    if(useV)speak(s.say,()=>{if(blocked){st.hidden=false;gen++;tm.forEach(clearTimeout);tm=[];return;}aDone=true;go();},i);
    else at(s.min||1500,()=>{aDone=true;go();});
  }
  function run(){gen++;tm.forEach(clearTimeout);tm=[];stopAudio();if(CAN){try{SS.cancel();}catch(e){}}vbLabel();
    // reset the real game to the seeded start question
    try{demoRestart();}catch(e){}
    setTimeout(()=>runFrom(0,gen),350);}
  vb.onclick=()=>{unlock();voiceOn=!voiceOn;blocked=false;try{localStorage.setItem('pz-voice',voiceOn?'1':'0');}catch(e){}vbLabel();run();};
  q('dmsb').onclick=()=>{unlock();blocked=false;st.hidden=true;voiceOn=true;vbLabel();run();};
  q('dmgo').onclick=()=>api.close();
  q('dmrp').onclick=()=>{unlock();blocked=false;run();};
  vbLabel();unlock();setTimeout(()=>{if(!stopped)runFrom(0,++gen);},500);
  return()=>{stopped=true;gen++;tm.forEach(clearTimeout);stopAudio();if(CAN){try{SS.cancel();}catch(e){}}hl.forEach(e=>e.classList.remove('dm-hl'));};
 };
}
