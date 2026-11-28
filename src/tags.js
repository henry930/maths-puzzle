/* ---------- question tags ----------
   One shared vocabulary so every game can label its levels AND each generated question.
   A game opts in by providing:
     qmeta(lv)  -> level-level meta  {tags,sometimes,ops,steps,diff}   (shown in the level header, exported to data/)
     ctx.q = {...}  set for every question it generates (logged with every 'wrong' / 'complete' event)
   meta fields:  tags[]  ids from TAXO (always true for that question / level)
                 ops[]   inverse operations needed (add, sub, mul, div), steps = how many moves the shortest solution has
                 diff    1 (easiest) … 10 (hardest), score = the same on a finer decimal scale, so levels/questions can be ranked per student
   Tag ids never change once used (they are stored in the online event log); rename only the labels. */
const TAXO={
 /* operation needed to undo what is in the equation */
 'op-add':{g:'op',en:'+ add',zh:'要用加法（消去減數）'},
 'op-sub':{g:'op',en:'− subtract',zh:'要用減法'},
 'op-mul':{g:'op',en:'× multiply',zh:'要用乘法'},
 'op-div':{g:'op',en:'÷ divide',zh:'要用除法'},
 'only-add':{g:'op',en:'only +',zh:'只用加法'},
 'only-sub':{g:'op',en:'only −',zh:'只用減法'},
 'only-mul':{g:'op',en:'only ×',zh:'只用乘法'},
 'only-div':{g:'op',en:'only ÷',zh:'只用除法'},
 /* length of the shortest solution */
 'steps-1':{g:'steps',en:'1 step',zh:'一步'},
 'steps-2':{g:'steps',en:'2 steps',zh:'兩步'},
 'steps-3':{g:'steps',en:'3+ steps',zh:'三步或以上'},
 /* where the x is */
 'x-one-side':{g:'shape',en:'x on one side',zh:'x 只在一邊'},
 'x-both-sides':{g:'shape',en:'x on both sides',zh:'兩邊都有 x'},
 'x-on-right':{g:'shape',en:'x on the right',zh:'x 喺右邊'},
 /* kinds of numbers */
 'neg-const':{g:'num',en:'negative numbers',zh:'有負數'},
 'neg-answer':{g:'num',en:'negative answer',zh:'答案係負數'},
 'frac-answer':{g:'num',en:'fraction answer',zh:'答案係分數'},
 'fractions':{g:'num',en:'fractions',zh:'有分數'},
 /* finer fraction tags: kept in the data, hidden in the level header (hide:1) */
 'frac-unit':{g:'num',en:'fraction x/a',zh:'分數 x/a（分子係 1）',hide:1},
 'frac-nonunit':{g:'num',en:'fraction (p/q)x',zh:'分數 (p/q)x（分子唔係 1）',hide:1},
 'frac-const':{g:'num',en:'fraction constant',zh:'常數項係分數',hide:1},
 'frac-both':{g:'num',en:'fractions on both sides',zh:'兩邊都有分數',hide:1},
 'big-numbers':{g:'num',en:'bigger numbers',zh:'數字較大'}
};
const TAXO_GROUPS={op:'Operation',steps:'Length',shape:'Shape',num:'Numbers'};
const tagLabel=t=>(TAXO[t]||{en:t}).en;
const tagChips=tags=>(tags||[]).filter(t=>TAXO[t]&&!TAXO[t].hide).map(t=>`<span class="qt qt-${TAXO[t].g}">${esc(TAXO[t].en)}</span>`).join('');
const tagChipsSome=tags=>(tags||[]).filter(t=>TAXO[t]&&!TAXO[t].hide).slice(0,8).map(t=>`<span class="qt qt-some">${esc(TAXO[t].en)}</span>`).join('');
const diffBar=d=>`<span class="qdiff" title="Difficulty ${d}/10"><b>${'●'.repeat(Math.round(d/2))}</b>${'○'.repeat(5-Math.round(d/2))}</span>`;
const _lmCache={};
/* level-level meta, cached; null when a game has not been tagged yet */
function levelMeta(G,lv){const k=G.id+'#'+lv;if(!(k in _lmCache)){try{_lmCache[k]=G.qmeta?G.qmeta(lv):null;}catch(e){_lmCache[k]=null;}}return _lmCache[k];}
/* sample a question generator many times: tags present in (nearly) every sample are the level's tags;
   tags present only sometimes go to `sometimes`. gen() must return a question meta (see above). */
function levelFromSamples(gen,n=80){
  const cnt={};let steps=[],diff=0;
  for(let i=0;i<n;i++){const m=gen();m.tags.forEach(t=>cnt[t]=(cnt[t]||0)+1);if(m.steps!=null)steps.push(m.steps);diff+=m.score||m.diff;}
  const all=Object.keys(cnt),tags=all.filter(t=>cnt[t]===n).sort(),sometimes=all.filter(t=>cnt[t]<n&&cnt[t]>=n*.2).sort();
  steps.sort((a,b)=>a-b);
  return{tags,sometimes,ops:tags.filter(t=>/^op-/.test(t)).map(t=>t.slice(3)),steps:steps.length?steps[steps.length>>1]:undefined,diff:Math.max(1,Math.min(10,Math.round(diff/n))),score:Math.round(diff/n*10)/10};
}
/* what a finished quiz-style level logs: every skill the level can ask about */
function levelQ(id,lv){const m=levelMeta(REG.find(x=>x.id===id),lv);return m?{v:1,level:true,tags:[...new Set([...m.tags,...(m.sometimes||[])])].sort(),diff:m.diff,score:m.score,types:m.types}:null;}
