(function(){
function mk(sp){
  const g={t:sp.t,misere:!!sp.misere,memo:new Map()};
  if(sp.t==='sub'){
    g.key=s=>''+s;g.moves=s=>sp.S.filter(k=>k<=s).map(k=>k);g.apply=(s,m)=>s-m;g.start=()=>sp.n;g.empty=s=>g.moves(s).length===0;
  }else if(sp.t==='nim'){
    g.key=s=>[...s].sort((a,b)=>a-b).join();g.start=()=>sp.piles.slice();g.empty=s=>s.every(x=>x===0);
    g.moves=s=>{const o=[];s.forEach((p,i)=>{for(let k=1;k<=p;k++)o.push([i,k]);});return o;};
    g.apply=(s,m)=>{const t=s.slice();t[m[0]]-=m[1];return t;};
  }else{
    g.key=s=>s.join();g.start=()=>Array(sp.r).fill(sp.c);g.empty=s=>s[0]===1&&s.slice(1).every(x=>x===0);
    g.moves=s=>{const o=[];s.forEach((len,r)=>{for(let c=0;c<len;c++)if(r||c)o.push([r,c]);});return o;};
    g.apply=(s,m)=>s.map((len,r)=>r>=m[0]?Math.min(len,m[1]):len);
  }
  g.win=s=>{const k=g.key(s);if(g.memo.has(k))return g.memo.get(k);
    const ms=g.moves(s);let w;
    if(!ms.length)w=g.misere&&sp.t!=='chomp';
    else w=ms.some(m=>!g.win(g.apply(s,m)));
    g.memo.set(k,w);return w;};
  g.best=s=>{const ms=g.moves(s);const good=ms.filter(m=>!g.win(g.apply(s,m)));return good;};
  return g;
}
const SPECS=[
 {t:'sub',n:7,S:[1,2],name:'Race to zero · take 1 or 2 from 7',tip:'Try to leave a multiple of 3 for your opponent.'},
 {t:'sub',n:10,S:[1,2,3],name:'Take 1, 2 or 3 from 10',tip:'Aim to leave a multiple of 4 (4, 8, 12…).'},
 {t:'sub',n:13,S:[1,2,3],name:'Take 1, 2 or 3 from 13',tip:'Multiples of 4 are the safe numbers to leave.'},
 {t:'sub',n:17,S:[1,2,3,4],name:'Take 1 to 4 from 17',tip:'Now the safe numbers are multiples of 5.'},
 {t:'sub',n:23,S:[1,2,3,4,5],name:'Take 1 to 5 from 23',tip:'Safe numbers: multiples of 6. Can you see the pattern: max take + 1?'},
 {t:'sub',S:[1,3,4],auto:12,name:'Odd rules: take 1, 3 or 4',tip:'The pattern is different now! Work backwards from 0: which piles are safe to leave?'},
 {t:'sub',S:[2,3,5],auto:15,name:'Odd rules: take 2, 3 or 5',tip:'Work backwards from 0 and 1 (you can’t move from 0 or 1!).'},
 {t:'nim',piles:[3,5],name:'Nim · two piles (3, 5)',tip:'Take from one pile only. Try to make the piles equal.'},
 {t:'nim',piles:[3,4,5],name:'Nim · three piles (3, 4, 5)',tip:'Write the pile sizes in binary and add each column without carrying (XOR). Make it zero!'},
 {t:'nim',piles:[2,4,5,7],name:'Nim · four piles (2, 4, 5, 7)',tip:'Nim-sum strategy: leave a position where the binary columns all have an even count of 1s.'},
 {t:'chomp',r:3,c:4,name:'Chomp · 3 × 4 chocolate bar',tip:'Eating a square also eats everything below and to its right. Never eat the poisoned 💀 square!'},
 {t:'nim',piles:[3,4,6],misere:true,name:'Misère Nim · last stone LOSES',tip:'Play like normal Nim until every pile has just 1 stone, then flip the plan!'}
];
function startPile(sp){const g=mk(sp);for(let n=sp.auto;n<40;n++){g.memo.clear();if(g.win(n))return n;}return sp.auto;}
window.__nim={mk,SPECS};
REG.push({id:'nim',name:'Strategy Duel',emoji:'🎲',color:'#5f3dc4',cat:'Strategy',
 desc:'Beat the computer at classic maths games: Nim, Chomp and subtraction races. It plays perfectly — can you find the winning strategy?',skills:['game theory','patterns','working backwards'],
 levels:SPECS.map(s=>s.name),
 how:'You always move first, and a winning strategy exists for you. The computer never makes a mistake when it can win — so if you slip, it will punish you! Use 💡 if you get stuck.',
 art:'<div class="mininim"><i></i><i></i><i></i><br><i></i><i></i><br><i></i></div>',
 mount(root,lv,ctx){
  const sp={...SPECS[lv-1]};if(sp.t==='sub'&&sp.auto)sp.n=startPile(sp);
  const G=mk(sp);let st,turn,sel=null,hist,over,msg='',lastAI=null;
  function reset(){st=G.start();turn='h';sel=null;hist=[];over=false;msg='Your move!';lastAI=null;draw();}
  function draw(){
    let body='';
    if(sp.t==='sub'){
      body=`<div class="nm-pile">${Array.from({length:sp.n},(_,i)=>`<span class="stone${i<st?'':' gone'}"></span>`).join('')}</div><div class="nm-count">${st} left</div>
       <div class="toolrow">${sp.S.map(k=>`<button class="btn takebtn" data-k="${k}" ${turn!=='h'||over||k>st?'disabled':''}>Take ${k}</button>`).join('')}</div>`;
    }else if(sp.t==='nim'){
      body='<div class="nm-piles">'+st.map((p,r)=>`<div class="nm-row"><span class="nm-lab">${p}</span>${Array.from({length:sp.piles[r]},(_,j)=>`<span class="stone${j<p?'':' gone'}${sel&&sel.r===r&&j>=sel.j&&j<p?' sel':''}" data-r="${r}" data-j="${j}"></span>`).join('')}</div>`).join('')+'</div>'+
        `<div class="toolrow"><button class="btn" id="take" ${sel&&!over&&turn==='h'?'':'disabled'}>${sel?`Take ${st[sel.r]-sel.j} from pile ${sel.r+1}`:'Tap a stone to choose'}</button></div>`;
    }else{
      body='<div class="ch-board">'+st.map((len,r)=>`<div class="ch-row">${Array.from({length:sp.c},(_,c)=>`<span class="ch-c${c<len?'':' gone'}${!r&&!c?' poison':''}" data-r="${r}" data-c="${c}">${!r&&!c?'💀':''}</span>`).join('')}</div>`).join('')+'</div>';
    }
    root.innerHTML=`<div class="nm"><div class="nm-tip">${sp.tip}</div><div class="nm-turn ${turn==='h'?'me':'ai'}">${over?'':turn==='h'?'🙂 Your turn':'🤖 Computer thinking…'}</div>${body}<div class="msg">${msg||'&nbsp;'}</div>
      <div class="toolrow"><button class="btn alt" id="un">↶ Undo</button><button class="btn alt" id="hn">💡 Hint</button><button class="btn alt" id="rs">⟲ Restart</button></div></div>`;
    root.querySelectorAll('.takebtn').forEach(b=>b.onclick=()=>human(+b.dataset.k));
    root.querySelectorAll('.nm-row .stone').forEach(s=>s.onclick=()=>{if(turn!=='h'||over||s.classList.contains('gone'))return;sel={r:+s.dataset.r,j:+s.dataset.j};draw();});
    if($('#take'))$('#take').onclick=()=>{human([sel.r,st[sel.r]-sel.j]);};
    root.querySelectorAll('.ch-c').forEach(c=>c.onclick=()=>{if(turn!=='h'||over||c.classList.contains('gone'))return;
      const m=[+c.dataset.r,+c.dataset.c];if(m[0]===0&&m[1]===0){msg='That’s the poisoned square — you’d lose! Pick another.';draw();return;}human(m);});
    $('#un').onclick=()=>{if(turn!=='h'||over||!hist.length)return;st=hist.pop();sel=null;msg='Undone — your move!';draw();};
    $('#rs').onclick=reset;
    $('#hn').onclick=()=>{if(turn!=='h'||over)return;const b=G.best(st);
      if(!b.length){msg='Uh-oh: every move loses against perfect play. Undo, and look for the mistake earlier!';}
      else{const m=b[0];msg='💡 '+(sp.t==='sub'?`Take ${m}.`:sp.t==='nim'?`Take ${m[1]} from pile ${m[0]+1}.`:`Eat the square in row ${m[0]+1}, column ${m[1]+1}.`);}
      draw();};
  }
  function human(m){
    if(turn!=='h'||over)return;
    hist.push(Array.isArray(st)?st.slice():st);st=G.apply(st,m);sel=null;
    if(G.empty(st)){return finish('h');}
    if(G.win(st))msg='Hmm — that move gave the computer the upper hand. You can Undo!';else msg='Good move! The computer is stuck in a losing position…';
    turn='a';draw();
    ctx.timeout(()=>{
      const good=G.best(st),ms=G.moves(st),mv=good.length?good[R(0,good.length-1)]:ms[R(0,ms.length-1)];
      st=G.apply(st,mv);
      msg='The computer moved: '+(sp.t==='sub'?`took ${mv}`:sp.t==='nim'?`took ${mv[1]} from pile ${mv[0]+1}`:`ate row ${mv[0]+1}, column ${mv[1]+1}`);
      if(G.empty(st))return finish('a');turn='h';draw();
    },900);
  }
  function finish(last){
    over=true;turn='h';
    const humanWins=sp.misere?last==='a':last==='h';
    if(humanWins){msg='🏆 You win!';draw();ctx.win('You beat the computer!','You found the winning strategy. Can you explain it to a friend?',reset,'Play again');}
    else{msg='The computer wins this time. Press Restart and look for the safe positions!';draw();}
  }
  ctx.keys=null;reset();
 }});
})();
