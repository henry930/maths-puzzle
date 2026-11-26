(function(){
const ownerChain=(owner,pairs)=>b=>{if(b.includes(owner))return null;for(const[a,c,msg]of pairs)if(b.includes(a)&&b.includes(c))return msg;return null;};
const kmConf=b=>{const k=b.filter(x=>x[0]==='k').length,m=b.filter(x=>x[0]==='m').length;return k>0&&m>k?'The monsters outnumber the kids on one bank — they get scared! 😱':null;};
const kmItems=n=>[...Array.from({length:n},(_,i)=>({id:'k'+i,e:'😇',n:'Kid',row:true})),...Array.from({length:n},(_,i)=>({id:'m'+i,e:'👹',n:'Monster',row:true}))];
const wSum=(ids,it)=>ids.reduce((a,i)=>a+it[i].w,0);
const CFG=[
 {name:'Wolf, Goat & Cabbage',mode:'count',max:2,
  items:[{id:'f',e:'🧑‍🌾',n:'Farmer',row:true},{id:'w',e:'🐺',n:'Wolf'},{id:'g',e:'🐐',n:'Goat'},{id:'c',e:'🥬',n:'Cabbage'}],
  conflict:ownerChain('f',[['w','g','The wolf ate the goat! 🐺'],['g','c','The goat ate the cabbage! 🐐']]),
  fits:ids=>ids.length<=2&&ids.includes('f'),rule:'The boat holds the farmer plus ONE passenger. Only the farmer can row. Never leave the wolf with the goat, or the goat with the cabbage, when the farmer isn’t there.'},
 {name:'Dog, Cat, Mouse & Cheese',mode:'count',max:2,
  items:[{id:'f',e:'🧑‍🌾',n:'Farmer',row:true},{id:'d',e:'🐕',n:'Dog'},{id:'t',e:'🐈',n:'Cat'},{id:'m',e:'🐁',n:'Mouse'},{id:'ch',e:'🧀',n:'Cheese'}],
  conflict:ownerChain('f',[['d','t','The dog chased the cat away! 🐕'],['t','m','The cat caught the mouse! 🐈']]),
  fits:ids=>ids.length<=2&&ids.includes('f'),rule:'Farmer + ONE passenger. Dog and cat can’t be alone together, nor cat and mouse. The cheese is safe with anyone.'},
 {name:'Kids & Monsters (2 + 2)',mode:'count',max:2,items:kmItems(2),conflict:kmConf,fits:ids=>ids.length<=2,rule:'The boat holds 1 or 2 (anyone can row). If monsters outnumber kids on a bank (and there’s at least one kid), the kids are scared away.'},
 {name:'Kids & Monsters (3 + 3)',mode:'count',max:2,items:kmItems(3),conflict:kmConf,fits:ids=>ids.length<=2,rule:'The boat holds 1 or 2 (anyone can row). If monsters outnumber kids on a bank (and there’s at least one kid), the kids are scared away.'},
 {name:'Soldier & Two Boys (100 kg)',mode:'weight',limit:100,
  items:[{id:'s',e:'💂',n:'Soldier',w:100,row:true},{id:'b1',e:'🧒',n:'Boy',w:50,row:true},{id:'b2',e:'👦',n:'Boy',w:50,row:true}],
  conflict:()=>null,fits:(ids,it)=>wSum(ids,it)<=100,rule:'The boat can carry at most 100 kg. Anyone can row. Add up the weights before you sail!'},
 {name:'Two Soldiers & Two Boys (100 kg)',mode:'weight',limit:100,
  items:[{id:'s1',e:'💂',n:'Soldier',w:100,row:true},{id:'s2',e:'💂‍♀️',n:'Soldier',w:100,row:true},{id:'b1',e:'🧒',n:'Boy',w:50,row:true},{id:'b2',e:'👦',n:'Boy',w:50,row:true}],
  conflict:()=>null,fits:(ids,it)=>wSum(ids,it)<=100,rule:'Boat limit 100 kg. Anyone can row. Two soldiers (100 kg each) and two boys (50 kg each) must all cross.'},
 {name:'Heavy Family (100 kg)',mode:'weight',limit:100,
  items:[{id:'d',e:'👨',n:'Dad',w:80,row:true},{id:'m',e:'👩',n:'Mum',w:60,row:true},{id:'a',e:'👵',n:'Gran',w:50,row:true},{id:'t',e:'🧒',n:'Tom',w:40,row:true},{id:'p',e:'🐕',n:'Dog',w:30,row:false}],
  conflict:()=>null,fits:(ids,it)=>wSum(ids,it)<=100,rule:'Boat limit: 100 kg. The dog can’t row, but everyone else can. Add the weights in your head!'},
 {name:'Zoo Ferry (220 kg)',mode:'weight',limit:220,
  items:[{id:'k',e:'🧑‍🔧',n:'Keeper',w:70,row:true},{id:'e',e:'🐘',n:'Elephant',w:150,row:false},{id:'l',e:'🦁',n:'Lion',w:100,row:false},{id:'z',e:'🦓',n:'Zebra',w:60,row:false},{id:'mk',e:'🐒',n:'Monkey',w:30,row:false}],
  conflict:ownerChain('k',[['l','z','The lion ate the zebra! 🦁'],['l','mk','The lion ate the monkey! 🦁'],['e','mk','The elephant squashed the monkey! 🐘']]),fits:(ids,it)=>wSum(ids,it)<=220&&ids.includes('k'),rule:'Boat limit 220 kg and only the keeper can row. Never leave lion + zebra, lion + monkey or elephant + monkey without the keeper. Add the weights carefully!'},
 {name:'Kids & Monsters (4 + 4, boat 3)',mode:'count',max:3,items:kmItems(4),conflict:kmConf,fits:ids=>ids.length<=3,rule:'The boat now holds up to 3 (anyone can row). Same rule: monsters must never outnumber kids on a bank that has kids.'},
 {name:'Five Friends (120 kg)',mode:'weight',limit:120,
  items:[{id:'a',e:'🧑',n:'Ann',w:70,row:true},{id:'b',e:'🧔',n:'Ben',w:85,row:true},{id:'c',e:'👧',n:'Cat',w:45,row:true},{id:'d',e:'🧒',n:'Dan',w:55,row:true},{id:'e',e:'👶',n:'Eve',w:20,row:false}],
  conflict:()=>null,fits:(ids,it)=>wSum(ids,it)<=120&&true,rule:'Boat limit 120 kg. Baby Eve can’t row. Everyone else can.'},
 {name:'Big Zoo (280 kg)',mode:'weight',limit:280,
  items:[{id:'k',e:'🧑‍🔧',n:'Keeper',w:80,row:true},{id:'e',e:'🐘',n:'Elephant',w:200,row:false},{id:'l',e:'🦁',n:'Lion',w:120,row:false},{id:'z',e:'🦓',n:'Zebra',w:90,row:false},{id:'g',e:'🐊',n:'Croc',w:70,row:false},{id:'mk',e:'🐒',n:'Monkey',w:30,row:false}],
  conflict:ownerChain('k',[['l','z','The lion ate the zebra! 🦁'],['g','mk','The croc ate the monkey! 🐊'],['e','z','The elephant stepped on the zebra! 🐘'],['l','g','The lion and croc are fighting! 🦁🐊']]),fits:(ids,it)=>wSum(ids,it)<=280&&ids.includes('k'),rule:'Boat limit 280 kg, only the keeper rows. Never leave lion + zebra, croc + monkey, elephant + zebra, or lion + croc without the keeper.'}
];
CFG.push({name:'Kids & Monsters (5 + 5, boat 3)',mode:'count',max:3,items:kmItems(5),conflict:kmConf,fits:ids=>ids.length<=3,rule:'The boat holds up to 3 (anyone can row). Monsters must never outnumber kids on a bank that has kids. Big challenge!'});
CFG.splice(0,CFG.length,...[0,2,4,9,1,7,6,5,8,10,3,11].map(i=>CFG[i]));
function solveBFS(cfg,sides,boat){
  const it={};cfg.items.forEach(x=>it[x.id]=x);const ids=cfg.items.map(x=>x.id);
  const key=(s,b)=>ids.map(i=>s[i]).join('')+b;
  const goal=s=>ids.every(i=>s[i]===1);
  const q=[[sides,boat,[]]],seen=new Set([key(sides,boat)]);
  let qi=0;
  while(qi<q.length){
    const[s,b,path]=q[qi++];if(goal(s))return path;
    const here=ids.filter(i=>s[i]===b),subs=[];
    const n=here.length;
    for(let m=1;m<(1<<n);m++){const sub=here.filter((_,k)=>m>>k&1);if(sub.length>4)continue;if(!sub.some(i=>it[i].row))continue;if(!cfg.fits(sub,it))continue;subs.push(sub);}
    for(const sub of subs){
      const ns={...s};sub.forEach(i=>ns[i]=1-b);const nb=1-b;
      const left=ids.filter(i=>ns[i]===b),arr=ids.filter(i=>ns[i]===nb);
      if(cfg.conflict(left)||cfg.conflict(arr))continue;
      const k=key(ns,nb);if(seen.has(k))continue;seen.add(k);q.push([ns,nb,[...path,sub]]);
    }
  }
  return null;
}
window.__river={CFG,solveBFS};
REG.push({id:'river',name:'River Crossing',emoji:'⛵',color:'#2eaa5e',
 desc:'Get everyone across the river safely — without anyone getting eaten, scared, or sinking the boat.',skills:['logical planning','adding weights','trial & error'],
 cat:'Logic',levels:CFG.map(c=>c.name),
 how:'Tap a character on the bank to put them in the boat (tap again to unload). Press GO to sail. Try to finish in as few crossings as possible!',
 art:'<div class="miniriver">🐺⛵🐐</div>',
 mount(root,lv,ctx){
  const cfg=CFG[lv-1],it={};cfg.items.forEach(x=>it[x.id]=x);const ids=cfg.items.map(x=>x.id);
  let side,boat,onboat,crossings,hist,busy;
  const par=solveBFS(cfg,Object.fromEntries(ids.map(i=>[i,0])),0).length;
  function reset(){side=Object.fromEntries(ids.map(i=>[i,0]));boat=0;onboat=[];crossings=0;hist=[];busy=false;draw();}
  const tile=(i,cls)=>{const x=it[i];return `<button class="rv-it ${cls}" data-id="${i}"><span class="e">${x.e}</span><span class="nm">${x.n}${x.w?` · ${x.w}kg`:''}</span></button>`;};
  function loadTxt(){
    if(cfg.mode==='weight'){const ws=onboat.map(i=>it[i].w);const sum=ws.reduce((a,b)=>a+b,0);
      return `Load: ${ws.length?ws.join(' + ')+' = ':''}<b>${sum}</b> / ${cfg.limit} kg`;}
    return `Seats used: <b>${onboat.length}</b> / ${cfg.max}`;
  }
  function draw(){
    const L=ids.filter(i=>side[i]===0&&!onboat.includes(i)),Rr=ids.filter(i=>side[i]===1&&!onboat.includes(i));
    root.innerHTML=`<div class="rv"><div class="rv-rule">${cfg.rule}</div>
     <div class="rv-scene"><div class="bank l">${L.map(i=>tile(i,boat===0?'can':'')).join('')}</div>
      <div class="river"><div class="waves"></div><div class="boatw ${boat?'r':'l'}"><div class="boatcargo">${onboat.map(i=>tile(i,'inb')).join('')}</div><div class="hull">🛶</div></div></div>
      <div class="bank r">${Rr.map(i=>tile(i,boat===1?'can':'')).join('')}</div></div>
     <div class="rv-hud"><span>${loadTxt()}</span><span>Crossings: <b>${crossings}</b> <small>(best possible: ${par})</small></span></div>
     <div class="msg" id="mr">&nbsp;</div>
     <div class="toolrow"><button class="btn go" id="go">GO! ⛵</button><button class="btn alt" id="un">↶ Undo</button><button class="btn alt" id="hn">💡 Hint</button><button class="btn alt" id="rs">⟲ Restart</button></div></div>`;
    root.querySelectorAll('.rv-it').forEach(b=>b.onclick=()=>tap(b.dataset.id,b));
    $('#go').onclick=go;$('#un').onclick=undo;$('#rs').onclick=reset;
    $('#hn').onclick=()=>{if(onboat.length){$('#mr').textContent='Unload the boat first, then ask for a hint.';return;}
      const p=solveBFS(cfg,side,boat);if(!p){$('#mr').textContent='This position is stuck — press Undo or Restart.';return;}
      $('#mr').innerHTML='💡 Next: take '+p[0].map(i=>it[i].e+' '+it[i].n).join(' and ')+' across.';};
  }
  function tap(id,b){
    if(busy)return;
    if(onboat.includes(id)){onboat=onboat.filter(x=>x!==id);draw();return;}
    if(side[id]!==boat){toast('The boat is on the other side!');shake(b);return;}
    const next=[...onboat,id];
    if(cfg.mode==='weight'){const sum=next.reduce((a,i)=>a+it[i].w,0);if(sum>cfg.limit){shake(b);$('#mr').innerHTML=`Too heavy! ${next.map(i=>it[i].w).join(' + ')} = ${sum} kg, but the limit is ${cfg.limit} kg.`;return;}}
    else if(next.length>cfg.max){shake(b);$('#mr').textContent='The boat is full!';return;}
    onboat=next;draw();
  }
  function go(){
    if(busy)return;
    if(!onboat.length||!onboat.some(i=>it[i].row)){$('#mr').textContent=onboat.length?'Someone who can row must be on the boat!':'Put someone in the boat first.';shake($('#go'));return;}
    if(!cfg.fits(onboat,it)){$('#mr').textContent='That load isn’t allowed in this boat.';return;}
    busy=true;hist.push(JSON.stringify({side,boat,crossings}));
    const sailors=[...onboat],nb=1-boat;
    const left=ids.filter(i=>side[i]===boat&&!sailors.includes(i));
    const lconf=cfg.conflict(left);
    $('.boatw').className='boatw '+(nb?'r':'l');
    setTimeout(()=>{
      sailors.forEach(i=>side[i]=nb);onboat=[];boat=nb;crossings++;
      const arr=ids.filter(i=>side[i]===nb),conf=lconf||cfg.conflict(arr);
      draw();
      if(conf){busy=true;$('#mr').innerHTML=`<b>Oh no!</b> ${conf}`;$('.rv-scene').classList.add('fail');
        const b=el('button','btn','Try that again ↶');b.onclick=()=>{busy=false;undo(true)};$('#mr').appendChild(el('div')).appendChild(b);return;}
      busy=false;
      if(ids.every(i=>side[i]===1)){busy=true;const nice=crossings===par;
        ctx.win('Everyone made it across!',`${crossings} crossings`+(nice?' — that’s the best possible! 🏆':` (best possible is ${par}). Can you do it in fewer?`),()=>openGame('river',lv),'Play again');}
    },900);
  }
  function undo(force){
    if(busy&&!force)return;if(!hist.length)return;
    const s=JSON.parse(hist.pop());side=s.side;boat=s.boat;crossings=s.crossings;onboat=[];busy=false;draw();
  }
  reset();
 }});
})();
