// node tools/build-gcse-map.js
// Reads tools/gcse-map-src.txt and the games' real level names, checks the coverage rules, then writes
//   data/gcse-spec.json  (areas > topics > knowledge points, with the games/skills that cover each point)
//   data/gcse-map.md     (readable coverage report, gaps first)
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const STAGE=/ · (warm-up|easy|medium|hard|tough)$/;

/* ---- 1. real skills per game (levels grouped by name, same rule as the in-game profile) ---- */
const gameFiles=['balance','expand','factorise','quad','lines','factors','fraction','percent','chance','angles','transform','times','match'];
const src=['tags.js',...gameFiles.map(g=>g+'.js'),'qtags.js'].map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
const pre=`const window={};const REG=[];const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));const pick=a=>a[R(0,a.length-1)];const shuffle=a=>a;const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);const esc=String;`;
const {REG}=vm.runInNewContext(pre+src+';({REG})',{Math,String,Array,Object,Set,Map});
const skills={},gname={};
for(const G of REG){if(!gameFiles.includes(G.id))continue;gname[G.id]=G.name;skills[G.id]=[...new Set(G.levels.map(n=>String(n).replace(STAGE,'')))];}

/* ---- 2. parse the source ---- */
const areas=[];let A=null,T=null;const ids=new Set(),errors=[];
fs.readFileSync(path.join(root,'tools','gcse-map-src.txt'),'utf8').split('\n').forEach((raw,i)=>{
  const line=raw.trim();if(!line)return;
  if(line.startsWith('#')&&!/^#\s+[A-Za-z]+(-[A-Za-z0-9]+)+\s~/.test(line))return;   /* other # lines are comments */
  if(line.startsWith('@')){const[id,name]=line.slice(1).split('~').map(x=>x.trim());A={id,name,topics:[]};areas.push(A);return;}
  if(line.startsWith('#')){const[id,name]=line.slice(1).split('~').map(x=>x.trim());T={id,name,points:[]};A.topics.push(T);return;}
  const f=line.split(' ~ ').map(x=>x.trim());
  if(f.length<3){errors.push(`line ${i+1}: cannot read "${line}"`);return;}
  const[id,name,tier,cov]=f;
  if(ids.has(id))errors.push(`duplicate id ${id}`);ids.add(id);
  if(!/^[FH]$/.test(tier))errors.push(`${id}: tier must be F or H`);
  const games=[];
  (cov?cov.split(';'):[]).forEach(c=>{
    const k=c.indexOf(':'),g=c.slice(0,k).trim(),re=c.slice(k+1).trim();
    if(!skills[g]){errors.push(`${id}: unknown game ${g}`);return;}
    let rx;try{rx=new RegExp(re);}catch(e){errors.push(`${id}: bad regex ${re}`);return;}
    const hit=skills[g].filter(s=>rx.test(s));
    if(!hit.length){errors.push(`${id}: ${g}:${re} matches no skill`);return;}
    let e=games.find(x=>x.game===g);if(!e)games.push(e={game:g,skills:[]});
    hit.forEach(s=>{if(!e.skills.includes(s))e.skills.push(s);});
  });
  T.points.push({id,name,tier,games});
});
if(errors.length){console.error('PROBLEMS:\n'+errors.join('\n'));process.exit(1);}

/* topic-level status: which games touch the topic and how much of it they cover */
const topicInfo=t=>{const c=t.points.filter(p=>p.games.length).length,gs=[...new Set(t.points.flatMap(p=>p.games.map(g=>g.game)))];
  return{covered:c,total:t.points.length,games:gs,status:c===0?'none':c===t.points.length?'full':'partial'};};
areas.forEach(a=>a.topics.forEach(t=>Object.assign(t,topicInfo(t))));
/* ---- 3. write JSON ---- */
const out={version:1,generated:new Date().toISOString().slice(0,10),
  note:'Teaching-level knowledge points grouped under the six content areas of the DfE national GCSE Maths content. Tier: F = Foundation and Higher, H = Higher only (approximate). Point ids are permanent.',
  areas};
fs.writeFileSync(path.join(root,'data','gcse-spec.json'),JSON.stringify(out,null,1)+'\n');

/* ---- 4. readable report ---- */
const all=areas.flatMap(a=>a.topics.flatMap(t=>t.points.map(p=>({...p,area:a.name,topic:t.name}))));
const cov=all.filter(p=>p.games.length),gap=all.filter(p=>!p.games.length);
const used=new Set();all.forEach(p=>p.games.forEach(g=>g.skills.forEach(s=>used.add(g.game+'|'+s))));
let md=`# GCSE Maths map — topics, knowledge points and game coverage\n\n`;
md+=`${all.length} knowledge points in ${areas.reduce((a,x)=>a+x.topics.length,0)} topics. **${cov.length} covered** by a game, **${gap.length} gaps**.\n\n`;
md+=`Tier: F = Foundation and Higher, H = Higher only (approximate). Source of truth: \`tools/gcse-map-src.txt\` → \`data/gcse-spec.json\`.\n\n`;
const nTop=areas.reduce((a,x)=>a+x.topics.length,0),cnt=st=>areas.reduce((a,x)=>a+x.topics.filter(t=>t.status===st).length,0);
md+=`## Where we are\n\n${nTop} game-sized topics: **${cnt('full')} fully covered**, **${cnt('partial')} partly covered** (a game exists but more can be added), **${cnt('none')} with no game yet**.\n\n`;
md+=`## Topics and games\n\nEach topic is a block one game could cover. Status: ✅ fully covered · 🟡 partly · ⬜ no game yet.\n`;
areas.forEach(a=>{
  md+=`\n### ${a.name}\n\n| | Topic | Points covered | Game(s) |\n|---|---|---|---|\n`;
  a.topics.forEach(t=>{md+=`| ${t.status==='full'?'✅':t.status==='partial'?'🟡':'⬜'} | ${t.name} | ${t.covered}/${t.total} | ${t.games.map(g=>gname[g]).join(', ')||'—'} |\n`;});
});
md+='\n';
md+=`\n## Games\n\n`+Object.keys(gname).map(g=>`- ${gname[g]}: ${[...used].filter(u=>u.startsWith(g+'|')).length}/${skills[g].length} skills mapped to a knowledge point`).join('\n')+'\n';
areas.forEach(a=>{
  md+=`\n## ${a.name}\n`;
  a.topics.forEach(t=>{
    const c=t.points.filter(p=>p.games.length).length;
    md+=`\n### ${t.name} (${c}/${t.points.length} covered)\n\n`;
    t.points.forEach(p=>{md+=`- ${p.games.length?'✅':'⬜'} ${p.name}${p.tier==='H'?' (H)':''}${p.games.length?' — '+p.games.map(g=>gname[g.game]).join(', '):''}\n`;});
  });
});
md+=`\n## Game skills not linked to any knowledge point\n\nThese are mostly "Boss" and mixed levels that practise several knowledge points at once.\n\n`;
const orphan=Object.keys(skills).flatMap(g=>skills[g].filter(s=>!used.has(g+'|'+s)).map(s=>`${gname[g]}: ${s}`));
md+=orphan.length?orphan.slice(0,400).map(x=>'- '+x).join('\n')+(orphan.length>400?`\n- … and ${orphan.length-400} more`:''):'None.';
fs.writeFileSync(path.join(root,'data','gcse-map.md'),md+'\n');
console.log(`${nTop} topics (${cnt('full')} full, ${cnt('partial')} partial, ${cnt('none')} none)\n${all.length} points · ${cov.length} covered · ${gap.length} gaps · ${orphan.length} game skills unlinked`);
areas.forEach(a=>{const ps=a.topics.flatMap(t=>t.points);console.log(a.name.padEnd(42),ps.length,'points,',ps.filter(p=>p.games.length).length,'covered');});
