(function(){
const SETS1=['x','y','a','n','m','t'],SETS2=[['x','y'],['a','b'],['m','n'],['p','q']];
const r=(a,b)=>R(a,b),gcd=(a,b)=>b?gcd(b,a%b):a,gcdAll=a=>a.reduce(gcd);
const facs=n=>{const o=[];for(let i=1;i<=n;i++)if(n%i===0)o.push(i);return o;};
const SUP={2:'²',3:'³'},sup=e=>e===1?'':(SUP[e]||'^'+e);
const vs=p=>Object.keys(p).sort().map(k=>k+sup(p[k])).join('');
function fmtT(t,first,spaced){const neg=t.c<0,ac=Math.abs(t.c),v=vs(t.p),body=v?(ac===1?'':ac)+v:String(ac);
  if(first||!spaced)return(neg?'−':(first?'':'+'))+body;return(neg?' − ':' + ')+body;}
const fmtExpr=ts=>ts.map((t,i)=>fmtT(t,i===0,true)).join('');
const divT=(a,b)=>{const p={};for(const k in a.p){const e=a.p[k]-(b.p[k]||0);if(e>0)p[k]=e;}return{c:a.c/b.c,p};};
function parseMono(s,L){
  s=s.replace(/[−–]/g,'-').replace(/\s/g,'').replace(/²/g,'^2').replace(/³/g,'^3').replace(/^\+/,'');
  const lc=L.join('');const m=s.match(new RegExp('^(-?)(\\d*)((?:['+lc+'](?:\\^[2-9])?)*)$'));
  if(!m||(m[2]===''&&!m[3]))return null;
  const p={};const re=new RegExp('(['+lc+'])(\\^([2-9]))?','g');let x;
  while((x=re.exec(m[3])))p[x[1]]=(p[x[1]]||0)+(x[3]?+x[3]:1);
  return{c:(m[2]===''?1:+m[2])*(m[1]?-1:1),p};
}
const sameT=(a,b)=>{if(!a||a.c!==b.c)return false;const ka=Object.keys(a.p),kb=Object.keys(b.p);return ka.length===kb.length&&ka.every(k=>a.p[k]===b.p[k]);};
/* ---------- levels ---------- */
const LV=[
 {n:'Numbers only: 6x + 9',nT:2,H:[2,5],cv:[''],pool:['x',''],neg:0,L:1},
 {n:'Numbers only · with minus',nT:2,H:[2,6],cv:[''],pool:['x',''],neg:1,L:1},
 {n:'Numbers only · bigger numbers',nT:2,H:[6,12],cv:[''],pool:['x',''],neg:1,L:1},
 {n:'Numbers only · two letters',nT:2,H:[2,8],cv:[''],pool:['x','y'],neg:1,L:2},
 {n:'Take out the letter: x² + 3x',nT:2,H:[1,1],cv:['x'],pool:['x',''],neg:0,L:1},
 {n:'Number AND letter: 4x² + 6x',nT:2,H:[2,6],cv:['x'],pool:['x',''],neg:1,L:1},
 {n:'Two letters: 6xy + 9x',nT:2,H:[2,6],cv:['x'],pool:['y',''],neg:1,L:2},
 {n:'Three terms · numbers only',nT:3,H:[2,6],cv:[''],pool:['xx','x',''],neg:1,L:1},
 {n:'Three terms · with a letter',nT:3,H:[2,6],cv:['x'],pool:['xx','x',''],neg:1,L:1},
 {n:'A squared letter: x²',nT:2,H:[1,6],cv:['xx'],pool:['x','','y'],neg:1,L:2},
 {n:'Either letter can be taken out',nT:2,H:[2,8],cv:['x','y'],pool:['x','y','xy',''],neg:1,L:2},
 {n:'Take out xy',nT:2,H:[1,8],cv:['xy'],pool:['x','y','xy',''],neg:1,L:2},
 {n:'Three terms · two letters',nT:3,H:[2,6],cv:['x','y','xy'],pool:['x','y','xy',''],neg:1,L:2},
 {n:'Bigger numbers · up to 12',nT:3,H:[6,12],cv:['x','y','xy'],pool:['x','y','xy','xx',''],neg:1,L:2},
 {n:'Four terms',nT:4,H:[2,6],cv:['x'],pool:['xx','x','y',''],neg:1,L:2},
 {n:'Four terms · two letters',nT:4,H:[2,8],cv:['x','y','xy'],pool:['x','y','xy','xx','yy',''],neg:1,L:2},
 {n:'Squares and products',nT:3,H:[2,8],cv:['xx','xy','yy'],pool:['x','y','',],neg:1,L:2},
 {n:'Boss: anything goes!',nT:4,H:[2,12],cv:['x','y','xy','xx'],pool:['x','y','xy','xx','yy',''],neg:1,L:2}
];
const cnt=s=>{const p={};for(const ch of s)p[ch]=(p[ch]||0)+1;return p;};
function gen(spec){
  for(let at=0;at<500;at++){
    const H=r(spec.H[0],spec.H[1]),cvS=spec.cv[r(0,spec.cv.length-1)],cv=cnt(cvS);
    const pool=spec.pool.slice(),shapes=[];
    while(shapes.length<spec.nT&&pool.length){shapes.push(pool.splice(r(0,pool.length-1),1)[0]);}
    if(shapes.length<spec.nT)continue;
    const sh=shapes.map(cnt);
    let ok=true;for(const k in cv){if(!sh.some(s=>!s[k]))ok=false;} // keep the common power exactly what we chose
    // letters shared by every shape beyond cv would increase the common factor
    const all=new Set(shapes.join('').split(''));for(const k of all){if(sh.every(s=>s[k])&&!cv[k])ok=false;}
    if(!ok)continue;
    const ks=shapes.map(()=>r(1,7));if(gcdAll(ks)!==1)continue;
    const terms=shapes.map((s,i)=>{const p={};for(const k in cv)p[k]=(p[k]||0)+cv[k];for(const k in sh[i])p[k]=(p[k]||0)+sh[i][k];return{c:H*ks[i],p};});
    if(terms.some(t=>Object.values(t.p).some(e=>e>3)))continue;
    terms.sort((a,b)=>Object.values(b.p).reduce((x,y)=>x+y,0)-Object.values(a.p).reduce((x,y)=>x+y,0)||vs(a.p).localeCompare(vs(b.p)));
    terms.forEach((t,i)=>{if(i>0&&spec.neg&&Math.random()<.5)t.c=-t.c;});
    return{terms,H,cv};
  }
  return null;
}
window.__fx={LV,gen,fmtExpr,parseMono};
REG.push({id:'factorise',name:'Factorise It!',emoji:'🧩',color:'#7048e8',cat:'Algebra',
 desc:'Factorise expressions like 12x² + 18x. List every factor of each number, pick the highest common factor, do the same for each letter — then divide to write the answer with brackets.',skills:['factorising','highest common factor','algebra','dividing terms'],
 levels:LV.map(l=>l.n),
 how:'Step by step: (1) type ALL the factors of each number, (2) pick the highest common factor of the numbers, (3) do the same for each letter (x² has factors 1, x and x²), then (4) divide every term by the common factor to fill the brackets.',
 art:'<div class="minibal">6(2x+3)</div>',
 mount(root,lv,ctx){
  const spec=LV[lv-1];let Q,L,CF,stages,si,buf,sel,locked;
  root.innerHTML=`<div class="fx"><div class="fx-top" id="fxt"></div><div class="fx-stage" id="fxs"></div><div class="msg" id="fxm">&nbsp;</div><div class="ex-pad" id="fxpad"></div>
   <div class="toolrow"><button class="btn alt" id="fxh">💡 Hint</button><button class="btn go" id="fxd">That’s all ✓</button><button class="btn alt" id="fxn">New question ⏭</button></div></div>`;
  const msg=h=>{$('#fxm').innerHTML=h;};
  function build(){
    let q;do{q=gen(spec);}while(!q);
    const set=spec.L===1?[pick(SETS1)]:pick(SETS2),mp={x:set[0],y:set[1]||set[0]};
    const mt=t=>{const p={};for(const k in t.p){const nk=mp[k]||k;p[nk]=(p[nk]||0)+t.p[k];}return p;};
    const terms=q.terms.map(t=>({c:t.c,p:mt(t)}));
    L=[...new Set(terms.flatMap(t=>Object.keys(t.p)))].sort();
    const cvp={};for(const k in q.cv)cvp[mp[k]]=(cvp[mp[k]]||0)+q.cv[k];
    Q={terms,H:q.H,cv:cvp};CF={c:q.H,p:Object.assign({},cvp)};
    Q.quot=terms.map(t=>divT(t,CF));
    stages=[{k:'list',kind:'num',title:'Write ALL the factors of each number',rows:terms.map(t=>({lab:String(Math.abs(t.c)),req:facs(Math.abs(t.c)).map(String),found:[]}))},
      {k:'pick',kind:'num',title:'Pick the HIGHEST common factor of the numbers'}];
    L.forEach(v=>{
      stages.push({k:'list',kind:'var',v,title:`Write ALL the factors of the ${v} part of each term`,rows:terms.map(t=>t.p[v]?{lab:v+sup(t.p[v]),req:['1'].concat(Array.from({length:t.p[v]},(_,i)=>v+sup(i+1))),found:[]}:{lab:`no ${v}`,req:[],found:[],none:true})});
      stages.push({k:'pick',kind:'var',v,title:`Pick the HIGHEST common factor of the ${v} part`});});
    stages.push({k:'div',title:`Divide every term by the common factor ${fmtT(CF,true)}`,rows:Q.quot.map(()=>({ok:false}))});
    si=0;buf='';sel=0;render();
  }
  const stg=()=>stages[si];
  const numHcf=()=>si>1?String(Q.H):null;
  function topHtml(){
    const parts=[];
    if(si>1)parts.push(`<b>${Q.H}</b>`);
    L.forEach((v,i)=>{const idx=2+i*2+2;if(si>=idx)parts.push(`<b>${Q.cv[v]?v+sup(Q.cv[v]):'—'}</b>`);});
    return `<div class="fx-expr">${fmtExpr(Q.terms)}</div><div class="fx-prog">Step ${Math.min(si+1,stages.length)} of ${stages.length}${parts.length?` · common factor so far: ${parts.join(' · ')}`:''}</div>`;
  }
  function render(){
    $('#fxt').innerHTML=topHtml();const s=stg(),st=$('#fxs');let h=`<div class="fx-title">${s.title}</div>`;
    if(s.k==='list'){
      sel=Math.max(0,s.rows.findIndex((x,i)=>!x.none&&x.found.length<x.req.length&&i>=sel))>=0?sel:0;
      h+=s.rows.map((row,i)=>`<div class="fx-row${i===sel&&!row.none?' sel':''}${row.none?' dis':''}" data-i="${i}"><span class="fx-lab">${row.lab}</span><span class="fx-ch">${row.found.map(f=>`<b>${f}</b>`).join('')}${i===sel&&!row.none?`<u>${esc(shownBuf())||'…'}</u>`:''}</span></div>`).join('');
    }else if(s.k==='pick'){
      const ch=pickChips(s);
      h+=stagesRowsRead()+`<div class="fx-chips">${ch.map(c=>`<button class="fx-pick" data-v="${c.v}">${c.l}</button>`).join('')}</div>`;
    }else{
      h+=Q.terms.map((t,i)=>`<div class="fx-row${i===sel?' sel':''}${s.rows[i].ok?' okr':''}" data-i="${i}"><span class="fx-lab">${fmtT(t,true)} ÷ ${fmtT(CF,true)} =</span><span class="fx-ch">${s.rows[i].ok?`<b>${fmtT(Q.quot[i],true)}</b>`:`<u>${i===sel?(esc(shownBuf())||'…'):'?'}</u>`}</span></div>`).join('');
    }
    st.innerHTML=h;
    st.querySelectorAll('.fx-row').forEach(el2=>el2.onclick=()=>{const i=+el2.dataset.i;if(s.k==='list'&&s.rows[i].none)return;if(s.k==='div'&&s.rows[i].ok)return;sel=i;buf='';render();});
    st.querySelectorAll('.fx-pick').forEach(b=>b.onclick=()=>choose(b.dataset.v));
    $('#fxpad').style.display=s.k==='pick'?'none':'';$('#fxd').style.display=s.k==='list'?'':'none';
    buildPad();
  }
  const shownBuf=()=>buf.replace(/\^2/g,'²').replace(/\^3/g,'³').replace(/-/g,'−');
  function stagesRowsRead(){ // read-only recap of the lists above the choices
    const s=stg(),prev=stages[si-1];if(!prev||prev.k!=='list')return '';
    return prev.rows.map(row=>`<div class="fx-row ro"><span class="fx-lab">${row.lab}</span><span class="fx-ch">${row.found.map(f=>`<b>${f}</b>`).join('')||'<i>—</i>'}</span></div>`).join('');
  }
  function pickChips(s){
    if(s.kind==='num'){const set=new Set();stages[0].rows.forEach(rw=>rw.req.forEach(f=>set.add(+f)));return [...set].sort((a,b)=>a-b).map(n=>({v:n,l:String(n)}));}
    const v=s.v,mx=Math.max(...Q.terms.map(t=>t.p[v]||0));
    return [{v:0,l:'none'}].concat(Array.from({length:mx},(_,i)=>({v:i+1,l:v+sup(i+1)})));
  }
  function buildPad(){
    const s=stg();if(s.k==='pick')return;const pad=$('#fxpad');pad.innerHTML='';
    const ks=['7','8','9','del','4','5','6','neg','1','2','3','sq2','0','sq3',...L];
    ks.forEach(k=>{const b=el('button','key'+(k==='del'?' del':'')+(L.includes(k)?' var':''),k==='del'?'⌫':k==='neg'?'−':k==='sq2'?'²':k==='sq3'?'³':k);b.dataset.k=k;b.onclick=()=>press(k);pad.appendChild(b);});
    const ok=el('button','key ok',s.k==='div'?'Check ✓':'Add ✓');ok.dataset.k='ok';ok.style.gridColumn='1 / -1';ok.onclick=()=>press('ok');pad.appendChild(ok);
  }
  function press(k){
    const s=stg();if(!s||s.k==='pick'||document.querySelector('.overlay'))return;
    if(k==='del')buf=buf.endsWith('^2')||buf.endsWith('^3')?buf.slice(0,-2):buf.slice(0,-1);
    else if(k==='neg')buf=buf.startsWith('-')?buf.slice(1):'-'+buf;
    else if(k==='sq2'||k==='sq3'){if(/[a-z]$/.test(buf))buf+='^'+k[2];}
    else if(L.includes(k)){if(!buf.includes(k))buf+=k;}
    else if(k==='ok')return submit();
    else if(!/[a-z]/.test(buf)&&buf.replace('-','').length<4)buf+=k;
    render();
  }
  function submit(){
    const s=stg();
    if(s.k==='list'){const row=s.rows[sel];if(!row||row.none)return;
      let canon=null;
      if(s.kind==='num'){if(/^\d{1,3}$/.test(buf))canon=String(+buf);}
      else{const m=parseMono(buf,[s.v]);if(m&&m.c===1)canon=Object.keys(m.p).length?s.v+sup(m.p[s.v]):'1';}
      if(canon==null){msg('Type a factor (a number'+(s.kind==='var'?' or the letter with its power':'')+').');return shakeRow();}
      if(row.found.includes(canon)){msg('You already have '+canon+'.');buf='';return render();}
      if(!row.req.includes(canon)){
        msg(s.kind==='num'?`❌ ${canon} does not divide ${row.lab} exactly.`:`❌ ${canon} is not a factor of ${row.lab}. (${row.lab} = ${s.v} × ${s.v}${+row.lab.length>1?' …':''})`);
        ctx.log('wrong',{stage:s.kind,term:row.lab,typed:canon,type:'not_a_factor'});buf='';return render();}
      row.found.push(canon);row.found.sort((a,b)=>(parseFloat(a)||0)-(parseFloat(b)||0)||a.length-b.length);buf='';msg('✅ '+canon+' is a factor');
      const nx=s.rows.findIndex(x=>!x.none&&x.found.length<x.req.length);if(row.found.length===row.req.length&&nx>=0)sel=nx;
      render();
    }else if(s.k==='div'){
      const row=s.rows[sel];if(!row)return;const a=parseMono(buf,L);
      if(!a){msg('Type your answer first.');return shakeRow();}
      const ex=Q.quot[sel];
      if(sameT(a,ex)){row.ok=true;buf='';msg('✅ Correct!');const nx=s.rows.findIndex(x=>!x.ok);if(nx>=0)sel=nx;render();if(nx<0)finish();}
      else{const err=[];if(Math.abs(a.c)!==Math.abs(ex.c))err.push('number');if((a.c<0)!==(ex.c<0))err.push('sign');if(!sameT({c:1,p:a.p},{c:1,p:ex.p}))err.push('letters');
        ctx.log('wrong',{stage:'divide',term:fmtT(Q.terms[sel],true),cf:fmtT(CF,true),typed:buf,expect:fmtT(ex,true),err});
        const t=Q.terms[sel];
        msg('❌ '+[err.includes('number')?`Divide the numbers: ${Math.abs(t.c)} ÷ ${Math.abs(CF.c)}.`:'',err.includes('sign')?(t.c<0?'The term is negative, so the answer keeps the minus sign.':'The term is positive, so the answer is positive.'):'',err.includes('letters')?'Letters: subtract the powers (x² ÷ x = x; a letter divided by itself disappears).':''].filter(Boolean).join(' '));
        buf='';render();shakeRow();}
    }
  }
  function shakeRow(){const e=document.querySelector('.fx-row.sel');if(e)shake(e);}
  function choose(val){
    const s=stg(),v=+val;let correct,txt;
    if(s.kind==='num'){correct=Q.H;
      if(v===correct){msg(`✅ ${v} is the highest common factor.`);si++;buf='';sel=0;return render();}
      const bad=Q.terms.find(t=>Math.abs(t.c)%v!==0);
      txt=bad?`${v} is not in every list — it does not divide ${Math.abs(bad.c)}.`:`${v} is common to all of them, but there is a higher common factor. Look again!`;
      ctx.log('wrong',{stage:'hcf_num',chosen:v,expect:correct,type:bad?'not_common':'not_highest'});
    }else{const vv=s.v,mn=Math.min(...Q.terms.map(t=>t.p[vv]||0));correct=mn;
      if(v===correct){msg(correct?`✅ ${vv+sup(correct)} is the highest common ${vv} factor.`:`✅ ${vv} is missing from at least one term, so nothing with ${vv} can be taken out.`);si++;buf='';sel=0;return render();}
      const miss=Q.terms.find(t=>(t.p[vv]||0)<v);
      txt=miss?`${vv+sup(v)} is not in every term — ${(miss.p[vv]||0)?'one term only has '+vv+sup(miss.p[vv]):'one term has no '+vv+' at all'}.`:`That is common to every term, but there is a higher one.`;
      ctx.log('wrong',{stage:'hcf_var',letter:vv,chosen:v,expect:correct,type:miss?'not_common':'not_highest'});
    }
    msg('❌ '+txt);const b=[...document.querySelectorAll('.fx-pick')].find(x=>+x.dataset.v===v);if(b)shake(b);
  }
  $('#fxd').onclick=()=>{const s=stg();if(s.k!=='list')return;
    const bad=s.rows.map((x,i)=>(!x.none&&x.found.length<x.req.length)?i:-1).filter(i=>i>=0);
    if(bad.length){msg('Not yet — '+(bad.length===1?'one term still has':'some terms still have')+' factors missing. Keep looking!');ctx.log('wrong',{stage:s.kind,type:'said_done_early'});
      document.querySelectorAll('.fx-row').forEach((e,i)=>{if(bad.includes(i))shake(e);});return;}
    msg('✅ Great!');si++;buf='';sel=0;render();};
  $('#fxh').onclick=()=>{const s=stg();
    msg('💡 '+(s.k==='list'?(s.kind==='num'?'Factors come in pairs: 1 × the number, then try 2, 3, 4… (does it divide exactly?). Tap a row to choose a term.':'A power like x² means x × x, so its factors are 1, x and x². Type the letter, then the ² key.'):
      s.k==='pick'?(s.kind==='num'?'Find the numbers that appear in EVERY list, then take the biggest one.':'Take the smallest power that EVERY term has. If one term has none, choose “none”.'):'Divide the number, then subtract the powers of each letter. Keep the signs.'));};
  $('#fxn').onclick=build;
  function finish(){const res=`${fmtT(CF,true)}(${fmtExpr(Q.quot)})`;
    $('#fxs').innerHTML+=`<div class="ex-res"><span class="ex-eq">${fmtExpr(Q.terms)} = <b>${res}</b></span></div>`;
    ctx.timeout(()=>ctx.win('Factorised!',`${fmtExpr(Q.terms)} = ${res}`,build,'New question'),800);}
  ctx.keys=e=>{const k=e.key.toLowerCase();if(/^[0-9]$/.test(k))press(k);else if(k==='-')press('neg');else if(L&&L.includes(k))press(k);else if(k==='^')press('sq2');else if(k==='backspace')press('del');else if(k==='enter')press('ok');};
  window.__fxq=()=>({Q,stages,get si(){return si},L,CF,press,choose});
  build();
 }});
})();
