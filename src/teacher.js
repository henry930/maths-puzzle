/* ---------- teacher area: dashboard (all games) + per-level bar ---------- */
let TS=null;
async function teacherStats(force){
  if(!force&&TS&&Date.now()-TS.at<60000)return TS.data;
  const s=getSess();if(!s)return{ok:false,error:'auth'};
  const r=await rpc('pz_teacher_stats',{p_name:s.name,p_hash:s.h});
  if(r&&r.ok)TS={at:Date.now(),data:r};
  return r;
}
const tErr=r=>r&&r.error==='not_teacher'?'This account is not a teacher account.':r&&r.error==='network'?'Cannot reach the server. Check your internet.':'Could not load. Has supabase-teacher.sql been run in Supabase?';
function fmtDur(s){s=Math.round(s||0);if(s<60)return s+'s';const m=Math.round(s/60);if(m<60)return m+' min';return Math.floor(m/60)+' h '+String(m%60).padStart(2,'0')+' m';}
const niceType=t=>String(t).replace(/_/g,' ');

/* index the raw rows from pz_teacher_stats */
function indexStats(r){
  const lv={},pg={},tg={},tp={};
  (r.levels||[]).forEach(x=>{(lv[x.g]=lv[x.g]||{})[x.l]=x.n;});
  (r.pg||[]).forEach(x=>{(pg[x.g]=pg[x.g]||{})[x.p]=x.n;});
  (r.time||[]).forEach(x=>{tg[x.g]=(tg[x.g]||0)+x.secs;(tp[x.g]=tp[x.g]||{})[x.p]=x.secs;});
  return{lv,pg,tg,tp};
}

/* ---------- dashboard page ---------- */
function showTeacher(fromRoute){
  if(!isTeacher())return;
  cleanup();
  $('#menu').hidden=true;$('#game').hidden=true;$('#teacher').hidden=false;
  document.documentElement.style.setProperty('--gc','#6741d9');
  document.title='Teacher dashboard · Maths Puzzle Arcade';
  if(!fromRoute)pushUrl(ROOT+'teacher/');
  window.scrollTo(0,0);
  drawTeacher(false);
}
async function drawTeacher(force){
  const T=$('#teacher');
  T.innerHTML=`<div class="tdh"><button class="back" id="tback">← Menu</button><h2>🏫 Teacher</h2><button class="back" id="trf">⟳ Refresh</button></div><div id="tbody" class="tload">Loading…</div>`;
  $('#tback').onclick=()=>{goMenu();document.title='Maths Puzzle Arcade';};
  $('#trf').onclick=()=>drawTeacher(true);
  const r=await teacherStats(force);
  const body=$('#tbody');if(!body||T.hidden)return;
  if(!r||!r.ok){body.className='tload';body.textContent=tErr(r);return;}
  const X=indexStats(r);
  const rows=REG.map(G=>{
    const lvs=X.lv[G.id]||{},ps=X.pg[G.id]||{};
    const passed=Object.values(lvs).reduce((a,b)=>a+b,0);
    return{G,lvs,ps,passed,players:Object.keys(ps).length,secs:X.tg[G.id]||0};
  }).sort((a,b)=>b.secs-a.secs||b.passed-a.passed);
  const totSecs=rows.reduce((a,x)=>a+x.secs,0),totPass=rows.reduce((a,x)=>a+x.passed,0);
  body.className='';
  body.innerHTML=`<div class="tsum"><div><b>${r.students}</b><span>students</span></div><div><b>${totPass}</b><span>levels passed</span></div><div><b>${fmtDur(totSecs)}</b><span>play time</span></div></div>
   <div class="tcards">${rows.map(x=>`<div class="tcard${x.passed||x.secs?'':' idle'}" data-g="${x.G.id}" style="--c:${x.G.color}">
     <button class="tch" aria-expanded="false"><span class="te">${x.G.emoji}</span><span class="tgn">${esc(x.G.name)}</span><span class="tm"><i>✅ ${x.passed}</i><i>👥 ${x.players}</i><i>⏱ ${fmtDur(x.secs)}</i></span><span class="tcv">▾</span></button>
     <div class="tcb" hidden></div></div>`).join('')}</div>
   <div class="row"><button class="btn alt" id="tcsv">📋 Copy as table (CSV)</button></div>`;
  body.querySelectorAll('.tcard').forEach(c=>{
    const x=rows.find(z=>z.G.id===c.dataset.g),hd=c.querySelector('.tch'),bd=c.querySelector('.tcb');
    hd.onclick=()=>{const open=bd.hidden;bd.hidden=!open;hd.setAttribute('aria-expanded',open);c.classList.toggle('open',open);if(open&&!bd.innerHTML)bd.innerHTML=teacherGameBody(x,X);
      bd.querySelectorAll('.tlp').forEach(b=>b.onclick=()=>openGame(x.G.id,+b.dataset.l));};
  });
  $('#tcsv').onclick=()=>{const out=[['Game','Student','Levels passed','Total levels','Play time (s)'].join(',')];
    REG.forEach(G=>{const ps=X.pg[G.id]||{},tp=X.tp[G.id]||{};new Set([...Object.keys(ps),...Object.keys(tp)]).forEach(n=>out.push([G.name,n.replace(/,/g,' '),ps[n]||0,G.levels.length,tp[n]||0].join(',')));});
    copyText(out.join('\n'),'Table copied — paste into Excel / Sheets');};
}
function teacherGameBody(x,X){
  const G=x.G,N=G.levels.length,tp=X.tp[G.id]||{};
  const names=[...new Set([...Object.keys(x.ps),...Object.keys(tp)])].sort((a,b)=>(x.ps[b]||0)-(x.ps[a]||0)||a.localeCompare(b));
  const stu=names.map(n=>`<div class="ts"><span class="tsn">${esc(n)}</span><span class="tsb"><i style="width:${(x.ps[n]||0)/N*100}%"></i></span><span class="tsv">${x.ps[n]||0}/${N}</span><span class="tst">${fmtDur(tp[n]||0)}</span></div>`).join('')||'<p class="small">Nobody has played this game yet.</p>';
  const pills=G.levels.map((_,i)=>`<button class="tlp" data-l="${i+1}"><b>${i+1}</b><small>${x.lvs[i+1]||0}</small></button>`).join('');
  return `<h4>Students — levels passed</h4>${stu}<h4>Students who passed each level <small>(tap to open)</small></h4><div class="tlv">${pills}</div>`;
}

/* ---------- bar shown on every level page for teachers ---------- */
async function teacherBar(id,lv){
  const b=$('#tbar');if(!b)return;
  if(!isTeacher()){b.hidden=true;b.innerHTML='';return;}
  b.hidden=false;b.innerHTML='<span class="tb-n">👩‍🏫 …</span>';
  const r=await teacherStats();
  if(!ctx||ctx.id!==id||ctx.lv!==lv)return;
  if(!r||!r.ok){b.innerHTML=`<span class="tb-n">${esc(tErr(r))}</span>`;return;}
  const n=((indexStats(r).lv[id]||{})[lv])||0;
  b.innerHTML=`<span class="tb-n">👩‍🏫 <b>${n}</b> / ${r.students} students passed</span><button class="tb-b" id="tmis">❓ Mistakes</button><div class="tb-m" id="tmbox" hidden></div>`;
  const btn=$('#tmis',b),box=$('#tmbox',b);
  btn.onclick=async()=>{
    if(!box.hidden){box.hidden=true;return;}
    box.hidden=false;box.textContent='Loading…';
    const s=getSess(),m=await rpc('pz_teacher_mistakes',{p_name:s.name,p_hash:s.h,p_game:id,p_level:lv});
    if(!m||!m.ok){box.textContent=tErr(m);return;}
    box.innerHTML=(m.rows&&m.rows.length)?m.rows.map(x=>`<div class="tmr"><span class="tmt">${esc(niceType(x.t))}</span><span class="tmc">${x.n}×</span><span class="tms">${x.students} 👥</span></div>`).join(''):'<span class="small">No mistakes recorded for this level yet.</span>';
  };
}
