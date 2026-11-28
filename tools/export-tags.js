// node tools/export-tags.js  — checks every tagged game's question tags, then writes data/question-tags.json + data/question-tags-<game>.csv
// (runs the same src/*.js the site uses, with a few browser globals stubbed)
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const games=['balance','expand','factorise','quad','lines','factors','fraction','percent','chance','angles','transform'];   // add a game id here once it has qmeta()
const src=['tags.js',...games.map(g=>g+'.js'),'qtags.js'].map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
const pre=`const window={};const REG=[];const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));const pick=a=>a[R(0,a.length-1)];const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);const esc=String;`;
const out=vm.runInNewContext(pre+src+';({REG,TAXO,TAXO_GROUPS})',{Math,String,Array,Object,Set});
const {REG,TAXO}=out;

/* ---- 1. self-check: apply the "shortest solution" to thousands of generated questions ---- */
let bad=0,checked=0;
for(const G of REG.filter(g=>g.qtest)){
  const {genL,plan,analyse,F,add,sub,mul,dv}=G.qtest;
  for(let lv=1;lv<=G.levels.length;lv++)for(let i=0;i<150;i++){
    const E=genL(lv),P=plan(E),m=analyse(E);
    let S={L:{x:E.L.x,n:E.L.n},Rr:{x:E.Rr.x,n:E.Rr.n}};
    for(const mv of P.moves){
      for(const k of['L','Rr']){
        if(mv.on==='x')S[k].x=sub(S[k].x,mv.by);
        else if(mv.on==='n')S[k].n=mv.op==='sub'?sub(S[k].n,mv.by):add(S[k].n,mv.by);
        else{const f=mv.op==='mul'?mv.by:F(1,mv.by[0]);S[k].x=mul(S[k].x,f);S[k].n=mul(S[k].n,f);}
      }
    }
    const one=a=>a[0]===1&&a[1]===1,zero=a=>a[0]===0,same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
    const ok=(one(S.L.x)&&zero(S.L.n)&&zero(S.Rr.x)&&same(S.Rr.n,E.sol))||(one(S.Rr.x)&&zero(S.Rr.n)&&zero(S.L.x)&&same(S.L.n,E.sol));
    checked++;
    if(!ok||m.steps!==P.moves.length||m.tags.some(t=>!TAXO[t])){bad++;if(bad<6)console.log('BAD',G.id,lv,m.eq,JSON.stringify(P.moves),JSON.stringify(m));}
  }
}
console.log(`self-check: ${checked} questions, ${bad} problems`);
if(bad)process.exit(1);

/* ---- 2. export ---- */
const data={version:1,taxonomy:TAXO,games:{}};
for(const G of REG.filter(g=>g.qmeta)){
  const rows=G.levels.map((name,i)=>Object.assign({level:i+1,name},G.qmeta(i+1)));
  data.games[G.id]={name:G.name,levels:rows};
  const csv=['level,name,difficulty,score,steps,ops,tags,sometimes'].concat(rows.map(r=>[r.level,'"'+r.name+'"',r.diff,r.score,(r.steps??''),(r.ops||[]).join('+'),r.tags.join(' '),r.sometimes.join(' ')].join(','))).join('\n');
  fs.mkdirSync(path.join(root,'data'),{recursive:true});
  fs.writeFileSync(path.join(root,'data','question-tags-'+G.id+'.csv'),csv+'\n');
}
fs.writeFileSync(path.join(root,'data','question-tags.json'),JSON.stringify(data,null,1)+'\n');
console.log('wrote data/question-tags.json');
