(function(){
const TIPS={
 1:'Anything × 1 is just itself. Easy!',
 2:'The units digit goes <b>2 → 4 → 6 → 8 → 0</b> and repeats. Each time the units hit 0, the <b>tens digit goes up by 1</b>.',
 3:'Squeeze the 3s between the 6s: the <b>6× table</b> (6, 12, 18, 24) goes in every 2nd box. Each empty box is <b>the number before it + 3</b>.',
 4:'4 = 2 × 2, so the 4× table is <b>every 2nd number</b> of the 2× table.',
 5:'The units digit flips <b>5, 0, 5, 0…</b> Whenever the units hit 0, the <b>tens digit goes up by 1</b>.',
 6:'6 = 3 × 2, so the 6× table is <b>every 2nd number</b> of the 3× table.',
 7:'Flip it! <b>7 × 2 = 2 × 7</b>. Almost all of row 7 is already in your table from the other rows.',
 8:'8 = 4 × 2, so the 8× table is <b>every 2nd number</b> of the 4× table.',
 9:'The tens digit goes <b>UP 0, 1, 2, 3…</b> while the units digit goes <b>DOWN 9, 8, 7, 6…</b> (tens + units is always 9).'};
const HINT={1:'1 × a number is just that number.',2:'Units go 2, 4, 6, 8, 0 and the tens +1 after each 0.',3:'Last number + 3 (the 6s are every 2nd box).',4:'Every 2nd number of the 2× table: 4, 8, 12, 16…',
 5:'Units go 5, 0, 5, 0 and the tens +1 after each 0.',6:'Every 2nd number of the 3× table: 6, 12, 18, 24…',7:'7 × c = c × 7. Look at the c-row of the table!',8:'Every 2nd number of the 4× table: 8, 16, 24, 32…',9:'Tens go up 0,1,2,3… units go down 9,8,7,6…'};
const ORDER=[1,2,4,6,8,5,3,9,7];
const NM={1:'1× · itself',2:'2× · units 0,2,4,6,8',3:'3× · add 3 between the 6s',4:'4× · every 2nd of the 2s',5:'5× · units 5,0 and tens +1',6:'6× · every 2nd of the 3s',7:'7× · flip the table',8:'8× · every 2nd of the 4s',9:'9× · tens up, units down'};
const NAMES=ORDER.map(k=>NM[k]);
window.__tt={NAMES};
REG.push({id:'times',name:'Times Table Tricks',emoji:'✖️',color:'#d6336c',cat:'Arithmetic',
 desc:'Learn the clever patterns behind every times table with a short animation, then fill in the whole row yourself. Build the full 9 × 9 table one row at a time!',skills:['times tables','patterns','multiplication facts','mental maths'],
 levels:NAMES,
 how:'Watch the trick animation first, then type the 9 answers of the row. Tap a box to choose it, use the keypad, and the answer is checked automatically. Tap 🎬 any time to watch the trick again.',
 art:'<div class="minibal">✖️<br>9×9</div>',
 mount(root,lv,ctx){
  const K=ORDER[lv-1],val=c=>K*c;let token=0;
  root.innerHTML=`<div class="tt">
   <div class="tt-learn" id="ttl"><div class="tt-title">🎬 Trick for the ${K}× table</div><div class="tt-tip">${TIPS[K]}</div>
    <div class="tt-help" id="tth"></div><div class="tt-row" id="ttr"></div><div class="tt-cap" id="ttc">&nbsp;</div>
    <div class="toolrow"><button class="btn alt" id="ttrep">↻ Replay</button><button class="btn go" id="ttgo">Start practising ▶</button></div></div>
   <div class="tt-prac" id="ttp" hidden><div class="tt-tbl" id="tttbl"></div><div class="tt-q" id="ttq"></div><div class="msg" id="ttm">&nbsp;</div><div id="ttpad"></div>
    <div class="toolrow"><button class="btn alt" id="ttw">🎬 Watch the trick</button></div></div></div>`;
  /* ---------- animation ---------- */
  const dig=v=>v<10?`<i class="ttu">${v}</i>`:`<i class="ttn">${Math.floor(v/10)}</i><i class="ttu">${v%10}</i>`;
  const row=$('#ttr'),help=$('#tth'),cap=h=>{$('#ttc').innerHTML=h;};
  const slot=i=>$('#tts'+i);
  function setSlot(i,h,cls){const s=slot(i);s.innerHTML=`<small>×${i}</small><b>${h}</b>`;s.className='tt-slot full '+(cls||'')+' pop';}
  function hlChips(arr){help.querySelectorAll('.tt-chip').forEach(c=>c.classList.remove('hl'));arr.forEach(id=>{const e=$('#'+id);if(e)e.classList.add('hl');});}
  const chips=(arr,pre)=>arr.map((t,i)=>`<span class="tt-chip" id="${pre}${i}">${t}</span>`).join('');
  function reset(){
    row.innerHTML=Array.from({length:9},(_,i)=>`<div class="tt-slot" id="tts${i+1}"><small>×${i+1}</small><b>&nbsp;</b></div>`).join('');
    help.innerHTML='';cap('&nbsp;');
    if(K===2)help.innerHTML='<div class="tt-lab">Units digit pattern</div><div class="tt-chips">'+chips([2,4,6,8,0],'ch')+'</div>';
    if(K===5)help.innerHTML='<div class="tt-lab">Units digit pattern</div><div class="tt-chips">'+chips([5,0],'ch')+'</div>';
    if(K===9)help.innerHTML='<div class="tt-lab">Tens digit ↑ &nbsp; Units digit ↓</div><div class="tt-chips">'+chips([0,1,2,3,4,5,6,7,8],'tc')+'</div><div class="tt-chips">'+chips([9,8,7,6,5,4,3,2,1],'uc')+'</div>';
    if(K===4||K===6||K===8){const b=K/2;help.innerHTML=`<div class="tt-lab">The ${b}× table, going on past 9</div><div class="tt-chips g9" id="chg">`+chips(Array.from({length:18},(_,j)=>b*(j+1)),'ch')+'</div>';help.querySelector('#chg').style.visibility='hidden';}
    if(K===7){let h='<div class="tt-mini">';for(let r=1;r<=9;r++){for(let c=1;c<=9;c++)h+=`<i id="m${r}_${c}" class="${c===7?'col':''}">${r===7?'':r*c}</i>`;}h+='</div>';help.innerHTML='<div class="tt-lab">The table so far</div>'+h;}
  }
  function mini(a,b){help.querySelectorAll('.tt-mini i').forEach(e=>e.classList.remove('a','b','pulse'));a.forEach(([r,c])=>{const e=$('#m'+r+'_'+c);if(e)e.classList.add('a');});b.forEach(([r,c])=>{const e=$('#m'+r+'_'+c);if(e){e.classList.add('b');if(r===7)e.textContent=r*c;}});}
  function steps(){
    const S=[];const P=(f,d)=>S.push({f,d:d||1100});
    if(K===1){P(()=>cap('1 × any number is just that number!'),1300);for(let i=1;i<=9;i++)P(()=>{setSlot(i,String(i));cap(`1 × ${i} = <b>${i}</b>`);},520);}
    if(K===2||K===5){
      const per=K===2?5:2;
      P(()=>cap(K===2?'Look at the units digits of the 2s: <b>2, 4, 6, 8, 0</b> — then they repeat.':'Look at the units digits of the 5s: <b>5, 0, 5, 0</b> — they flip back and forth.'),1700);
      for(let i=1;i<=9;i++)P(()=>{const v=K*i;hlChips(['ch'+((i-1)%per)]);setSlot(i,dig(v));
        cap(v%10===0?`${K} × ${i} = ${v}: units back to 0 → <b>tens digit +1</b>`:`${K} × ${i} = ${v}: units <b>${v%10}</b>${v>10?', tens stays':''}`);},1000);
    }
    if(K===9){
      P(()=>cap('9s: write <b>tens</b> going up and <b>units</b> going down.'),1500);
      for(let i=1;i<=9;i++)P(()=>{hlChips(['tc'+(i-1),'uc'+(i-1)]);setSlot(i,`<i class="ttn">${i-1}</i><i class="ttu">${10-i}</i>`);
        cap(`9 × ${i}: tens <b>${i-1}</b>${i>1?' (+1)':''}, units <b>${10-i}</b>${i>1?' (−1)':''} → ${9*i}`);},1000);
      P(()=>cap('Check: tens + units is always <b>9</b> (0+9, 1+8, 2+7…).'),1600);
    }
    if(K===4||K===6||K===8){
      const b=K/2;
      P(()=>{help.querySelector('#chg').style.visibility='visible';cap(`${K} = ${b} × 2. Write the ${b}× table further: ${b}, ${2*b}, ${3*b}…`);},2200);
      P(()=>cap('Now pick <b>every 2nd number</b>!'),1200);
      for(let i=1;i<=9;i++)P(()=>{const j=2*i;hlChips(['ch'+(j-1)]);setSlot(i,String(b*j));cap(`The ${j}th number is ${b*j} → ${K} × ${i} = <b>${K*i}</b>`);},950);
    }
    if(K===3){
      P(()=>cap('Make room: put the <b>6× table</b> (6, 12, 18, 24) in every 2nd box.'),1500);
      for(let i=2;i<=8;i+=2)P(()=>{setSlot(i,String(3*i),'ref');cap(`Box ${i}: 6 × ${i/2} = ${3*i}`);},650);
      P(()=>cap('Every empty box = <b>the number before it + 3</b>.'),1500);
      for(let i=1;i<=9;i+=2)P(()=>{setSlot(i,String(3*i));cap(i===1?'Start from 0: 0 + 3 = <b>3</b>':`${3*(i-1)} + 3 = <b>${3*i}</b>`);},1000);
    }
    if(K===7){
      P(()=>{help.querySelectorAll('.tt-mini i.col').forEach(e=>e.classList.add('pulse'));cap('Look at <b>column 7</b> (highlighted): it is already almost full! 1×7, 2×7, 3×7…');},2600);
      P(()=>cap('<b>7 × 2 = 2 × 7</b>: read down column 7, then copy it into row 7!'),1800);
      for(let c=1;c<=9;c++){if(c===7)P(()=>{mini([],[[7,7]]);setSlot(7,'49');cap('7 × 7 = <b>49</b> — the middle of the table. Just remember it! (5, 6, 7, 8 helps: 56 = 7 × 8)');},1800);
        else P(()=>{mini([[c,7]],[[7,c]]);setSlot(c,String(7*c));cap(`7 × ${c} = ${c} × 7 = <b>${7*c}</b> (row ${c}, column 7)`);},1000);}
    }
    P(()=>cap(`🎉 That’s the ${K}× table! Now try it yourself.`),600);
    return S;
  }
  function play(){const tk=++token;reset();const S=steps();let i=0;
    const next=()=>{if(tk!==token||i>=S.length)return;const s=S[i++];s.f();ctx.timeout(next,s.d);};ctx.timeout(next,400);}
  /* ---------- practice ---------- */
  let sel=1,buf='',done=Array(10).fill(false);
  const exp=c=>String(val(c));
  function tbl(){
    let h='<table><tr><th>×</th>'+Array.from({length:9},(_,c)=>`<th>${c+1}</th>`).join('')+'</tr>';
    for(let r=1;r<=9;r++){h+=`<tr class="${r===K?'cur':''}"><th>${r}</th>`;
      for(let c=1;c<=9;c++){let t='',cls='';
        if(r===K){if(done[c]){t=exp(c);cls='ok';}else if(c===sel){t=buf||'';cls='sel';}else cls='emp';}
        else if(typeof isDone==='function'&&isDone('times',ORDER.indexOf(r)+1)){t=String(r*c);cls='old';}
        h+=`<td class="${cls}" data-c="${r===K?c:''}">${t}</td>`;}
      h+='</tr>';}
    $('#tttbl').innerHTML=h+'</table>';
    $('#tttbl').querySelectorAll('td[data-c]').forEach(td=>{if(td.dataset.c)td.onclick=()=>{const c=+td.dataset.c;if(!done[c]){sel=c;buf='';draw();}};});
    $('#ttq').innerHTML=`<b>${K} × ${sel}</b> = <span class="tt-in">${buf||'?'}</span>`;
  }
  function draw(){tbl();}
  function key(k){
    if(done.slice(1).every(Boolean))return;
    if(k==='del'){buf=buf.slice(0,-1);draw();return;}
    if(k==='ok'){if(buf)check();return;}
    if(buf.length<exp(sel).length)buf+=k;
    draw();if(buf.length===exp(sel).length)check();
  }
  function check(){
    if(buf===exp(sel)){
      done[sel]=true;buf='';$('#ttm').innerHTML='✅ Correct!';
      const nx=[...Array(9).keys()].map(i=>i+1).find(c=>c>sel&&!done[c])||[...Array(9).keys()].map(i=>i+1).find(c=>!done[c]);
      if(!nx){draw();ctx.timeout(()=>ctx.win('Row complete!',`${K}× table: ${Array.from({length:9},(_,i)=>K*(i+1)).join(', ')}`),500);return;}
      sel=nx;draw();
    }else{
      const td=$('#tttbl td.sel');shake(td);$('#ttm').innerHTML=`❌ ${K} × ${sel} isn’t ${buf}. 💡 ${HINT[K]}`;buf='';
      ctx.timeout(draw,350);
    }
  }
  $('#ttpad').appendChild(numpad(key));
  ctx.keys=e=>{if(/^[0-9]$/.test(e.key))key(e.key);else if(e.key==='Backspace')key('del');else if(e.key==='Enter')key('ok');};
  function showPrac(){$('#ttl').hidden=true;$('#ttp').hidden=false;token++;draw();}
  function showLearn(){$('#ttp').hidden=true;$('#ttl').hidden=false;play();}
  $('#ttrep').onclick=play;$('#ttgo').onclick=showPrac;$('#ttw').onclick=showLearn;
  window.__ttq=()=>({K,key,done,get sel(){return sel}});
  showLearn();
 }});
})();
