(function(){
const LV=[
 {n:'One die · all horses equal',dice:[6],goal:150,races:10,track:5},
 {n:'Two 4-sided dice',dice:[4,4],goal:150,races:10,track:5},
 {n:'Two dice (the classic)',dice:[6,6],goal:150,races:10,track:5},
 {n:'Two dice · bigger target',dice:[6,6],goal:200,races:10,track:5},
 {n:'6-sided + 4-sided die',dice:[6,4],goal:150,races:10,track:5},
 {n:'Three 4-sided dice',dice:[4,4,4],goal:150,races:10,track:5},
 {n:'Two 8-sided dice',dice:[8,8],goal:150,races:10,track:5},
 {n:'Three 6-sided dice',dice:[6,6,6],goal:200,races:10,track:4},
 {n:'Two dice · fewer races',dice:[6,6],goal:200,races:7,track:5},
 {n:'Boss: three dice, tough goal',dice:[6,6,6],goal:250,races:8,track:4}
];
function dist(dice){let d={0:1};dice.forEach(s=>{const n={};Object.keys(d).forEach(k=>{for(let f=1;f<=s;f++){n[+k+f]=(n[+k+f]||0)+d[k];}});d=n;});return d;}
window.__dd2={dist,LV};
const FACE=['','⚀','⚁','⚂','⚃','⚄','⚅'];
REG.push({id:'derby',name:'Dice Derby',emoji:'🏇',color:'#e67700',cat:'Probability',
 desc:'Bet on horses numbered by dice totals. Each roll moves the horse with that number. Which horse should you back? Discover why some totals win more often!',skills:['probability','sample space','expected outcomes'],
 levels:LV.map(l=>l.n),
 how:'Tap horse numbers to bet 10 coins on each (up to 3 horses). Press Start: every dice roll moves the horse whose number matches the total. First to the finish wins and pays 40 coins per winning bet. Reach the goal before the races run out!',
 art:'<div class="minich">🎲🏇</div>',
 mount(root,lv,ctx){
  const L=LV[lv-1];ctx.q=tagDerby(L);const D=dist(L.dice),tot=Math.pow(L.dice.reduce((a,b)=>a*b,1),1),keys=Object.keys(D).map(Number).sort((a,b)=>a-b);
  let coins,races,bets,wins,pos,running,showP,over,last;
  const total=L.dice.reduce((a,b)=>a*b,1);
  function reset(){coins=100;races=0;bets=new Set();wins={};pos={};keys.forEach(k=>pos[k]=0);running=false;showP=false;over=false;last='';draw();}
  function draw(msg){
    const lanes=keys.map(k=>{
      const p=D[k]/total;
      return `<div class="dy-lane${bets.has(k)?' bet':''}" data-k="${k}"><span class="dy-n">${k}</span><div class="dy-track">${Array.from({length:L.track},(_,i)=>`<i class="${pos[k]>i?'on':''}"></i>`).join('')}<span class="dy-h" style="left:${pos[k]/L.track*100}%">🏇</span><span class="dy-fin">🏁</span></div>
       <span class="dy-p">${showP?`<b>${D[k]}/${total}</b>`:(wins[k]?`🏆${wins[k]}`:'')}</span></div>`;}).join('');
    root.innerHTML=`<div class="dy"><div class="statrow"><span>🪙 <b>${coins}</b> / goal ${L.goal}</span><span>Race ${Math.min(races+1,L.races)}/${L.races}</span></div>
     <div class="dy-dice" id="dice">${L.dice.map(()=>'🎲').join(' ')}</div>
     <div class="dy-lanes">${lanes}</div><div class="msg">${msg||last||'Tap numbers to place bets (10 🪙 each, max 3).'}</div>
     <div class="toolrow"><button class="btn go" id="st" ${running||over||!bets.size?'disabled':''}>Start race! 🏁</button><button class="btn alt" id="pp">${showP?'Hide':'Show'} chances</button><button class="btn alt" id="rs">⟲ Restart</button></div></div>`;
    root.querySelectorAll('.dy-lane').forEach(e=>e.onclick=()=>{if(running||over)return;const k=+e.dataset.k;if(bets.has(k))bets.delete(k);else if(bets.size<3&&coins>=10*(bets.size+1))bets.add(k);else toast('Max 3 bets (10 coins each)');draw();});
    $('#st').onclick=race;$('#pp').onclick=()=>{showP=!showP;draw(msg)};$('#rs').onclick=reset;
  }
  function roll(){return L.dice.map(s=>R(1,s));}
  function race(){
    if(running||over||!bets.size)return;running=true;coins-=10*bets.size;keys.forEach(k=>pos[k]=0);last='';
    let rolls=0;
    const step=()=>{
      const r=roll(),s=r.reduce((a,b)=>a+b,0);pos[s]++;rolls++;
      const d=$('#dice');if(d)d.innerHTML=r.map(x=>L.dice.every(v=>v===6)?FACE[x]:x).join(' + ')+' = <b>'+s+'</b>';
      const lane=root.querySelector(`.dy-lane[data-k="${s}"]`);
      if(lane){lane.querySelectorAll('.dy-track i').forEach((e,i)=>e.className=pos[s]>i?'on':'');lane.querySelector('.dy-h').style.left=pos[s]/L.track*100+'%';}
      if(pos[s]>=L.track){running=false;h&&clearInterval(h);finish(s,rolls);}
    };
    let h=setInterval(step,170);ctx.cleanups.push(()=>clearInterval(h));
  }
  function finish(w,rolls){
    races++;wins[w]=(wins[w]||0)+1;
    const won=bets.has(w);if(won)coins+=40*1;
    last=`🏁 Horse <b>${w}</b> won in ${rolls} rolls! ${won?'You backed it: +40 🪙':'You didn’t back it.'}`;
    bets=new Set();keys.forEach(k=>pos[k]=pos[k]);
    if(coins>=L.goal){over=true;draw();ctx.win('Derby champion!',`You reached ${coins} coins in ${races} races. Notice which horses keep winning — why?`,reset,'Play again');return;}
    if(races>=L.races||coins<10){over=true;showP=true;draw(last+`<br>${coins<10?'You ran out of coins.':'Out of races.'} Check the chances and try again!`);return;}
    draw();
  }
  ctx.keys=null;reset();
 }});
})();
