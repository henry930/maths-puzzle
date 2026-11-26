(function(){
const F=(n,d=1)=>{if(d<0){n=-n;d=-d}const g=gcd(n,d)||1;return{n:n/g,d:d/g}};
const OPS={'+':(a,b)=>F(a.n*b.d+b.n*a.d,a.d*b.d),'−':(a,b)=>F(a.n*b.d-b.n*a.d,a.d*b.d),'×':(a,b)=>F(a.n*b.n,a.d*b.d),'÷':(a,b)=>b.n===0?null:F(a.n*b.d,a.d*b.n)};
const show=f=>f.d===1?String(f.n):`${f.n}/${f.d}`;
const html=f=>f.d===1?String(f.n):`<span class="frac"><span>${f.n}</span><span>${f.d}</span></span>`;
function solve(vals,allowFrac,target=24,limit=1){
  const out=[];
  (function rec(list,steps){
    if(out.length>=limit)return;
    if(list.length===1){if(list[0].n===target*list[0].d&&list[0].d===1)out.push(steps);return;}
    for(let i=0;i<list.length;i++)for(let j=0;j<list.length;j++){
      if(i===j)continue;
      for(const o in OPS){
        if((o==='+'||o==='×')&&i>j)continue;
        const r=OPS[o](list[i],list[j]);if(!r)continue;
        if(!allowFrac&&(r.d!==1||r.n<0))continue;
        const rest=list.filter((_,k)=>k!==i&&k!==j);
        rec([...rest,r],[...steps,{a:list[i],b:list[j],o,r}]);
        if(out.length>=limit)return;
      }
    }
  })(vals,[]);
  return out;
}
const stepTxt=s=>`${show(s.a)} ${s.o} ${show(s.b)} = ${show(s.r)}`;

REG.push({id:'g24',name:'Make 24',emoji:'🃏',color:'#ff7a45',
 desc:'Use all four cards with + − × ÷ to make exactly 24.',skills:['mental arithmetic','number sense','brackets'],
 cat:'Arithmetic',levels:['Warm-up: cards 1–4, many solutions','Cards 1–5','Cards 1–6','Cards 1–7','Cards 1–8','Cards 1–9','Cards 1–10','Cards 1–11','Cards 1–12','Cards 1–13','Rare puzzles: only 1–2 ways','Boss: you MUST use fractions!'],
 how:'Tap a card, tap an operation, tap a second card. They merge into one new card. Keep going until one card is left — make it 24!',
 art:'<div class="mini24"><b>3</b><b>8</b><i>= 24</i></div>',
 mount(root,lv,ctx){
  const LV=[[4,20,999],[5,15,999],[6,10,40],[7,8,25],[8,5,15],[9,4,10],[10,3,8],[11,2,6],[12,1,4],[13,1,3],[13,1,2],[13,0,0]][lv-1];const needFrac=lv===12;
  let cards,hist,sel,op,start,solved=0,orig,over=false;
  root.innerHTML=`<div class="g24"><div class="statrow"><span id="t24">⏱ 0s</span><span id="s24">Solved: 0</span></div>
   <div class="cards24" id="c24"></div><div class="ops24" id="o24"></div>
   <div class="msg" id="m24">&nbsp;</div>
   <div class="toolrow"><button class="btn alt" id="undo">↶ Undo</button><button class="btn alt" id="reset">⟲ Reset</button><button class="btn alt" id="hint">💡 Hint</button><button class="btn alt" id="show">👀 Show answer</button><button class="btn" id="skip">New puzzle ⏭</button></div></div>`;
  const C=$('#c24'),O=$('#o24'),M=$('#m24');
  Object.keys(OPS).forEach(o=>{const b=el('button','op24',o);b.dataset.o=o;O.appendChild(b);});
  function gen(){let v,ok=false;
    for(let t=0;t<3000&&!ok;t++){v=Array.from({length:4},()=>R(1,LV[0]));const f=v.map(x=>F(x));
      if(needFrac)ok=!solve(f,false).length&&solve(f,true).length>0;
      else{const c=solve(f,false,24,80).length;ok=c>=LV[1]&&c<=LV[2];}}
    return v;}
  function newPuzzle(){orig=gen();reset();start=Date.now();}
  function reset(){cards=orig.map((v,i)=>({id:i,f:F(v)}));hist=[];sel=null;op=null;over=false;M.innerHTML='&nbsp;';draw();}
  function draw(){
    C.innerHTML='';
    cards.forEach((c,i)=>{const d=el('button','card24'+(sel===i?' sel':'')+(c.fresh?' pop':''),html(c.f));c.fresh=false;
      d.style.background=['#ff7a45','#7c5cff','#17a2b8','#e8478b'][c.id%4];d.onclick=()=>tapCard(i,d);C.appendChild(d);});
    O.querySelectorAll('.op24').forEach(b=>b.classList.toggle('sel',b.dataset.o===op));
  }
  function tapCard(i,d){
    if(over)return;
    if(sel===null||sel===i&&!op){sel=sel===i?null:i;draw();return;}
    if(!op){sel=i;draw();return;}
    if(i===sel){sel=null;op=null;draw();return;}
    const a=cards[sel],b=cards[i],r=OPS[op](a.f,b.f);
    if(!r){shake(d);M.textContent='You can’t divide by zero!';return;}
    hist.push(JSON.stringify(cards));
    const nc={id:b.id,f:r,fresh:true};
    cards=cards.filter((_,k)=>k!==sel&&k!==i);cards.splice(Math.min(i,cards.length),0,nc);
    sel=null;op=null;draw();
    if(cards.length===1){
      if(r.n===24&&r.d===1){over=true;solved++;$('#s24').textContent='Solved: '+solved;
        const sec=Math.round((Date.now()-start)/1000);
        ctx.win('You made 24!',`Solved in ${sec} seconds. Can you find a different way?`,newPuzzle);}
      else M.innerHTML=`That makes <b>${show(r)}</b>, not 24. Press Undo and try another route.`;
    }else M.innerHTML='&nbsp;';
  }
  O.onclick=e=>{const b=e.target.closest('.op24');if(!b||over)return;if(sel===null){shake(b);M.textContent='Pick a card first.';return;}op=op===b.dataset.o?null:b.dataset.o;draw();};
  $('#undo').onclick=()=>{if(hist.length){cards=JSON.parse(hist.pop());sel=null;op=null;over=false;M.innerHTML='&nbsp;';draw();}};
  $('#reset').onclick=reset;$('#skip').onclick=newPuzzle;
  $('#hint').onclick=()=>{
    const s=solve(cards.map(c=>c.f),true);
    if(!s.length){M.innerHTML='This path is a dead end — press Undo.';return;}
    const st=s[0][0];M.innerHTML=`💡 Try <b>${show(st.a)} ${st.o} ${show(st.b)}</b>`;
  };
  $('#show').onclick=()=>{
    const s=solve(orig.map(x=>F(x)),needFrac);
    M.innerHTML='👀 One way: '+s[0].map(stepTxt).join(' → ');
  };
  ctx.interval(()=>{if(!over&&start)$('#t24').textContent='⏱ '+Math.round((Date.now()-start)/1000)+'s'},500);
  newPuzzle();
 }});
})();
