/* ---------- question tags for the GCSE games (everything except Balance Scale, which tags itself) ----------
   Loaded AFTER every game file. Each analyser turns a generated question into
   {v,tags,diff,score[,eq,qt]} (see tags.js) and each game gets a qmeta(lv) for its level header + export.
   Tag ids are stored online: never rename an id, only its label. */
(function(){
/* 'id|English|中文' — group (chip colour) comes from the id prefix */
const L=`simplest-form|must simplify|要化到最簡
bk-terms-2|2 terms inside|括號內 2 項
bk-terms-3|3 terms inside|括號內 3 項
bk-terms-4|4 terms inside|括號內 4 項
bk-num-outside|number outside|括號外係數字
bk-var-outside|letter outside|括號外有字母
bk-neg-outside|negative outside|括號外係負數
bk-neg-inside|negative inside|括號內有負數
bk-neg-times-neg|− × −|負負得正
bk-letters-1|1 letter|1 個字母
bk-letters-2|2 letters|2 個字母
bk-letters-3|3 letters|3 個字母
bk-gives-square|x² in answer|答案有平方
bk-sq-inside|x² inside|括號內有平方項
bk-coef-inside|coefficients inside|括號內有係數
bk-multi-outside|xy outside|括號外有多個字母
fc-terms-2|2 terms|2 項
fc-terms-3|3 terms|3 項
fc-terms-4|4 terms|4 項
fc-terms-5|5 terms|5 項
fc-three-letters|three letters|三個字母
fc-cubed|cubed letter|有立方
fc-number-only|number only|只提數字
fc-letter-only|letter only|只提字母
fc-number-and-letter|number and letter|數字同字母
fc-squared-letter|squared letter|提平方字母
fc-two-letters|two letters|兩個字母
fc-neg-terms|negative terms|有負項
qd-monic|x² (no number in front)|x² 前面冇數字
qd-lead-coef|number in front of x²|x² 前面有數字
qd-all-positive|all positive|全部正數
qd-neg-middle|minus in the middle|中間係負數
qd-neg-last|minus at the end|最後一項係負數
qd-dos|difference of two squares|平方差
ln-gradient-only|gradient only|只調 m
ln-intercept-only|intercept only|只調 c
ln-both|gradient and intercept|m 同 c
ln-neg-gradient|negative gradient|負斜率
ln-frac-gradient|fractional gradient|分數斜率
ln-flat|horizontal line|水平線
ln-steep|steep line|斜率大
ln-neg-intercept|negative intercept|負截距
fa-prime|prime|質數
fa-composite|composite|合成數
fa-square|square number|平方數
fa-few-factors|few factors|因數少
fa-many-factors|many factors|因數多
fa-small-n|small number|數字細
fa-mid-n|medium number|數字中等
fa-big-n|big number|數字大
fr-name-picture|name from picture|睇圖寫分數
fr-equivalent|equivalent fractions|等值分數
fr-simplify|simplify|約簡
fr-of-amount|fraction of an amount|分數乘數量
fr-add|add|加
fr-sub|subtract|減
fr-same-denom|same denominator|分母相同
fr-diff-denom|different denominators|分母唔同
fr-mixed|mixed numbers|帶分數
fr-mixed-improper|mixed ↔ improper|帶分數轉假分數
fr-mul|multiply|乘
fr-div|divide|除
fr-reverse|find the whole|倒推原數
pc-read-grid|percent of a grid|睇格仔寫百分比
pc-of-amount|percent of an amount|求某數嘅百分之幾
pc-easy|10% / 25% / 50%|簡單百分比
pc-any|any percentage|任何百分比
pc-convert|convert|互換
pc-from-fraction|from a fraction|分數轉百分比
pc-from-decimal|from a decimal|小數轉百分比
pc-sale|sale price|減價
pc-increase|percentage increase|加幅
pc-decrease|percentage decrease|減幅
pc-vat|VAT|VAT
pc-as-percent|score as a percentage|分數轉百分比
pc-change|percentage change|百分比變化
pc-reverse|reverse percentage|逆向百分比
pc-interest|interest|利息
pc-simple-interest|simple interest|單利息
pc-compound-interest|compound interest|複利息
pr-bag|bag of balls|袋入面揀波
pr-not|not event|「唔係」事件
pr-or|or event|「或者」事件
pr-and|and event|「而且」事件
pr-spinner|spinner|轉盤
pr-two-dice|two dice|兩粒骰
pr-sample-space|sample space|樣本空間
pr-at-least|at least / less than|至少／少於
pr-with-replacement|with replacement|放回
pr-without-replacement|without replacement|唔放回
pr-independent|independent events|獨立事件
pr-mutually-exclusive|mutually exclusive|互斥事件
pr-expected|expected number|期望次數
pr-relative-freq|relative frequency|相對頻率
pr-ratio|from a ratio|由比例
pr-listing|systematic listing|有系統列出
pr-two-way|two-way table|雙向表
pr-venn|Venn diagram|文氏圖
pr-conditional|given that (conditional)|已知條件概率
pr-product-rule|product rule|乘法原理
pr-codes|codes and PINs|密碼
pr-repeats|repeats allowed|可重複
pr-no-repeats|no repeats|不可重複
pr-arrangements|arrangements (orders)|排列次序
pr-restricted|with a restriction|有限制
pr-pairs|pairs and handshakes|配對／握手
pr-fractions|fraction arithmetic|分數運算
pr-decimals|decimal arithmetic|小數運算
pr-missing|find a missing probability|求缺失概率
pr-sum-to-1|probabilities sum to 1|概率總和為 1
pr-algebra|with algebra|加代數
pr-tree|tree diagram|樹形圖
pr-different|different colours|唔同顏色
pr-at-least-one|at least one|至少一個
pr-exactly-one|exactly one|剛好一個
pr-certain-impossible|certain and impossible|必然同不可能
pr-single-dice|one dice|1 粒骰
pr-cards|playing cards|撲克牌
pr-overlap|overlapping events|重疊事件
pr-addition-rule|addition rule (overlap)|加法定律（重疊）
pr-letters|letters of a word|字母
pr-number-cards|number cards|數字卡
pr-estimate|estimate from data|由數據估計
pr-frequency-table|frequency table|頻數表
pr-two-spinners|two spinners|兩個轉盤
pr-frequency-tree|frequency tree|頻數樹
pr-dependent|dependent events|相依事件
pr-forms|fractions, decimals, percentages|分數、小數、百分比
an-estimate|estimate an angle|估計角度
an-straight-line|angles on a line|直線上嘅角
an-around-point|angles around a point|一點周圍嘅角
an-triangle|triangle|三角形
an-isosceles|isosceles triangle|等腰三角形
an-quadrilateral|quadrilateral|四邊形
an-crossing-lines|crossing lines|相交直線
an-vertically-opposite|vertically opposite|對頂角
an-parallel|parallel lines|平行線
an-corresponding|corresponding angles|同位角
an-alternate|alternate angles|內錯角
an-co-interior|co-interior angles|同旁內角
an-exterior|exterior angle|外角
an-polygon-sum|polygon: angle sum|多邊形內角和
an-polygon-exterior|polygon: exterior angle|多邊形外角
an-polygon-interior|polygon: interior angle|多邊形內角
an-algebra|angles with algebra|角度加代數
an-complement-supplement|complementary / supplementary|餘角／補角
an-right-angle|angles in a right angle|直角內嘅角
an-reflex|reflex angle|優角
an-turns|fractions of a turn|旋轉角度
an-clock|clock angles|時鐘角度
an-compass|compass directions|方向
an-bearing|bearings|方位角
an-bearing-back|back bearing|回程方位角
an-facts|angle facts|角度常識
an-bisector|angle bisector|角平分線
an-right-triangle|right-angled triangle|直角三角形
an-parallelogram|parallelogram|平行四邊形
an-kite|kite|箏形
an-trapezium|trapezium|梯形
an-rhombus|rhombus|菱形
an-cyclic-quad|cyclic quadrilateral|圓內接四邊形
an-polygon-sides|how many sides|邊數
an-regular-diagonal|diagonal in a regular polygon|正多邊形對角線
an-ratio|angles in a ratio|角度比例
an-circle-centre|angle at the centre|圓心角
an-semicircle|angle in a semicircle|半圓上嘅角
an-radius-isosceles|radii make an isosceles triangle|半徑等腰三角形
an-same-segment|angles in the same segment|同弓形角
an-tangent|tangent and radius|切線同半徑
an-tangents-point|tangents from a point|外點切線
an-alternate-segment|alternate segment theorem|交錯弓形定理
tf-translation|translation|平移
tf-neg-vector|negative vector|負向量
tf-reflection|reflection|反射
tf-reflect-axis|in an axis|喺 x 或 y 軸
tf-reflect-line|in x = k / y = k|喺 x=k 或 y=k
tf-reflect-diagonal|in y = ±x|喺 y=±x
tf-rotation|rotation|旋轉
tf-rot-90|90°|90°
tf-rot-180|180°|180°
tf-clockwise|clockwise|順時針
tf-anticlockwise|anticlockwise|逆時針
tf-enlargement|enlargement|放大
tf-sf-2|scale factor 2|比例 2
tf-sf-3|scale factor 3|比例 3
tf-shape-3|triangle|三角形
tf-shape-4|quadrilateral|四邊形
dd-1-die|one die|1 粒骰
dd-2-dice|two dice|2 粒骰
dd-3-dice|three dice|3 粒骰
dd-d4|4-sided dice|四面骰
dd-d6|6-sided dice|六面骰
dd-d8|8-sided dice|八面骰
dd-mixed-dice|mixed dice|唔同面數嘅骰
dd-few-races|fewer races|場數少
dd-high-goal|high goal|目標高`;
const GRP={bk:'skill',fc:'skill',qd:'skill',ln:'skill',fa:'skill',fr:'skill',pc:'skill',pr:'skill',an:'skill',tf:'skill',dd:'skill'};
L.split('\n').forEach(l=>{const[id,en,zh]=l.split('|');TAXO[id]={g:GRP[id.split('-')[0]]||'num',en,zh};});
TAXO_GROUPS.skill='Skill';

const clamp=(d,lo=1,hi=10)=>Math.max(lo,Math.min(hi,d));
const fin=(tags,d,extra)=>Object.assign({v:1,tags:[...new Set(tags)].sort(),diff:Math.round(clamp(d)),score:Math.round(clamp(d)*10)/10},extra);
const maxExp=t=>Math.max(0,...Object.values(t.p));
const letters=ts=>new Set(ts.flatMap(t=>Object.keys(t.p)));

/* ---------- Break Bracket: q = {m:outside term, t:[inside terms]} ---------- */
function tagExpand(q){
  const prod=q.t.map(t=>window.__ex.mul(q.m,t)),tags=[],nt=q.t.length,vo=Object.keys(q.m.p).length>0;
  tags.push('bk-terms-'+Math.min(4,nt),vo?'bk-var-outside':'bk-num-outside');
  const no=q.m.c<0,ni=q.t.some(t=>t.c<0),L=Math.min(3,letters([q.m,...q.t]).size),sq=q.t.some(t=>maxExp(t)>=2),
        coef=q.t.some(t=>Math.abs(t.c)>1),mo=Object.keys(q.m.p).length>=2||maxExp(q.m)>=2,big=prod.some(t=>Math.abs(t.c)>=20);
  if(no)tags.push('bk-neg-outside');if(ni)tags.push('bk-neg-inside');if(no&&ni)tags.push('bk-neg-times-neg');
  tags.push('bk-letters-'+L);if(prod.some(t=>maxExp(t)>=2))tags.push('bk-gives-square');
  if(sq)tags.push('bk-sq-inside');if(coef)tags.push('bk-coef-inside');if(mo)tags.push('bk-multi-outside');if(big)tags.push('big-numbers');
  const d=1+.9*(nt-1)+(vo?1.4:0)+(no?1:0)+(ni?.5:0)+(no&&ni?.8:0)+(L-1)*.8+(sq?.8:0)+(coef?.5:0)+(mo?1:0)+(big?.5:0);
  return fin(tags,d);
}
/* ---------- Factorise It!: q = {terms,H,cv} ---------- */
function tagFactorise(q){
  const nt=q.terms.length,cvL=Object.keys(q.cv).length,tags=['fc-terms-'+Math.min(5,nt)];
  const num=q.H>1;
  tags.push(!cvL?'fc-number-only':num?'fc-number-and-letter':'fc-letter-only');
  const sqL=Object.values(q.cv).some(e=>e>=2),two=letters(q.terms).size>=2,neg=q.terms.some(t=>t.c<0),big=q.H>=7||q.terms.some(t=>Math.abs(t.c)>=40);
  if(sqL)tags.push('fc-squared-letter');if(two)tags.push('fc-two-letters');if(letters(q.terms).size>=3)tags.push('fc-three-letters');if(q.terms.some(t=>Object.values(t.p).some(e=>e>=3)))tags.push('fc-cubed');if(neg)tags.push('fc-neg-terms');if(big)tags.push('big-numbers');
  const d=1+(nt-2)*1.2+(!cvL?0:num?2:1)+(sqL?1:0)+(two?1.2:0)+(letters(q.terms).size>=3?1.2:0)+(neg?.6:0)+(big?.5:0);
  return fin(tags,d);
}
/* ---------- Quadratic Factoriser: q = {a,b,c,m,p,n,q} ---------- */
function tagQuad(q){
  const tags=[q.a===1?'qd-monic':'qd-lead-coef'],dos=q.b===0&&q.c<0;
  if(dos)tags.push('qd-dos');else{if(q.b>0&&q.c>0)tags.push('qd-all-positive');if(q.b<0&&q.c>0)tags.push('qd-neg-middle');if(q.c<0)tags.push('qd-neg-last');}
  const big=Math.max(Math.abs(q.p),Math.abs(q.q))>=10||Math.abs(q.c)>=50;if(big)tags.push('big-numbers');
  const d=(q.a>1?4.5:2)+(!dos&&q.b<0&&q.c>0?1:0)+(!dos&&q.c<0?1.5:0)+(dos?.5:0)+(big?1:0)+(q.a>1&&Math.max(q.m,q.n)>=3?1:0);
  return fin(tags,d);
}
/* ---------- Line Hunter: P = {m,c,st,s} ---------- */
function tagLine(P){
  const s=P.s,tags=[s.fixC?'ln-gradient-only':s.fixM?'ln-intercept-only':'ln-both'];
  if(P.m<0)tags.push('ln-neg-gradient');if(P.m%1!==0)tags.push('ln-frac-gradient');if(P.m===0)tags.push('ln-flat');if(Math.abs(P.m)>=3)tags.push('ln-steep');
  if(P.c<0)tags.push('ln-neg-intercept');
  const d=(s.fixC||s.fixM?2:3.5)+(P.m<0?.8:0)+(P.m%1!==0?1.5:0)+(Math.abs(P.m)>=3?.7:0)+(P.c<0?.5:0)+(s.boss?2:0);
  return fin(tags,d,{eq:'y = '+(P.m===0?'':P.m+'x + ')+P.c});
}
/* ---------- Ball Factory: N ---------- */
function tagFactors(N){
  const nf=window.__fac.facs(N).length,tags=[nf===2?'fa-prime':'fa-composite'];
  if(Number.isInteger(Math.sqrt(N)))tags.push('fa-square');
  if(nf<=4)tags.push('fa-few-factors');else if(nf>=8)tags.push('fa-many-factors');
  tags.push(N<30?'fa-small-n':N<80?'fa-mid-n':'fa-big-n');
  return fin(tags,1+Math.min(4,nf/2)+(N>=80?2:N>=30?1:0),{eq:'factors of '+N});
}
/* ---------- Transform Quest: task = {t:instruction}, shape n ---------- */
function tagTransform(task,n){
  const t=task.t,tags=[];
  if(/^Translate/.test(t)){tags.push('tf-translation');const v=/\((-?\d+), (-?\d+)\)/.exec(t);if(v&&(+v[1]<0||+v[2]<0))tags.push('tf-neg-vector');}
  else if(/^Reflect/.test(t)){tags.push('tf-reflection');tags.push(/line y = (−)?x/.test(t)?'tf-reflect-diagonal':/line [xy] = /.test(t)?'tf-reflect-line':'tf-reflect-axis');}
  else if(/^Rotate/.test(t)){tags.push('tf-rotation',/180/.test(t)?'tf-rot-180':'tf-rot-90');if(/anticlockwise/.test(t))tags.push('tf-anticlockwise');else if(/clockwise/.test(t))tags.push('tf-clockwise');}
  else if(/^Enlarge/.test(t)){tags.push('tf-enlargement');const k=/factor (\d+)/.exec(t);if(k)tags.push('tf-sf-'+k[1]);}
  tags.push(n===3?'tf-shape-3':'tf-shape-4');
  const has=x=>tags.includes(x);
  const d=(has('tf-translation')?(has('tf-neg-vector')?2.5:1.5):has('tf-reflect-axis')?3:has('tf-reflect-line')?4.5:has('tf-reflect-diagonal')?5.5:has('tf-rotation')?(has('tf-rot-180')?4:5):has('tf-sf-3')?5:4)+(n===4?.5:0);
  return fin(tags,d,{eq:t});
}
/* ---------- quiz-style games: one table row per question type ---------- */
const Q=(t,d,v)=>({t,d,v:v||[]});   // t = always, v = variants that show up only sometimes inside this type
const QTAGS={
 fraction:{A1:Q(['fr-name-picture'],1),A2:Q(['fr-equivalent'],2),A3:Q(['fr-simplify'],2),A4:Q(['fr-of-amount'],3),A5:Q(['fr-add','fr-same-denom'],2),
  A6:Q(['fr-add','fr-diff-denom'],4),A7:Q(['fr-sub','fr-diff-denom'],4),A8:Q(['fr-mixed','fr-mixed-improper'],3),A9:Q(['fr-mul'],4),A10:Q(['fr-div'],5),
  A11:Q(['fr-reverse','fr-of-amount'],5),A12:Q(['fr-add','fr-mixed','fr-diff-denom'],6)},
 percent:{P1:Q(['pc-read-grid'],1),P2:Q(['pc-of-amount','pc-easy'],2),P3:Q(['pc-convert'],3,['pc-from-fraction','pc-from-decimal']),P4:Q(['pc-of-amount','pc-any'],3),P5:Q(['pc-sale','pc-decrease'],3),
  P6:Q(['pc-increase'],4,['pc-vat']),P7:Q(['pc-as-percent'],3),P8:Q(['pc-change'],5),P9:Q(['pc-reverse','pc-increase'],6),P10:Q(['pc-reverse','pc-decrease'],6),P11:Q(['pc-interest'],6,['pc-simple-interest','pc-compound-interest'])},
 chance:{T1:Q(['pr-bag'],1),T2:Q(['pr-bag','pr-not'],2),T3:Q(['pr-bag','pr-or'],3),T4:Q(['pr-spinner'],2),T5:Q(['pr-two-dice','pr-sample-space'],4),
  T6:Q(['pr-two-dice','pr-sample-space','pr-at-least'],4),T7:Q(['pr-two-dice','pr-sample-space'],5),T8:Q(['pr-bag','pr-and','pr-independent','pr-with-replacement'],5),
  T9:Q(['pr-bag','pr-and','pr-without-replacement'],6),T10:Q(['pr-expected'],4),T11:Q(['pr-relative-freq'],3),T12:Q([],5,['pr-not','pr-or','pr-mutually-exclusive','pr-and','pr-independent','pr-ratio']),
  N1:Q(['pr-listing','pr-product-rule'],2),N2:Q(['pr-listing'],3),N3:Q(['pr-two-way'],3,['pr-conditional']),N4:Q(['pr-venn'],4,['pr-conditional']),
  N5:Q(['pr-product-rule'],4),N6:Q(['pr-product-rule','pr-codes'],5,['pr-repeats','pr-no-repeats']),N7:Q(['pr-arrangements'],5,['pr-restricted']),N8:Q(['pr-pairs','pr-listing'],5),
  N9:Q(['pr-fractions'],3,['pr-and','pr-independent','pr-or','pr-mutually-exclusive','pr-not']),N10:Q(['pr-missing','pr-sum-to-1'],3,['pr-algebra']),
  N11:Q(['pr-tree','pr-independent','pr-decimals'],5,['pr-and','pr-exactly-one','pr-at-least-one']),N12:Q(['pr-tree','pr-without-replacement'],7,['pr-different','pr-and','pr-at-least-one']),
  M1:Q(['pr-certain-impossible'],1),M2:Q(['pr-single-dice'],2),M3:Q(['pr-cards'],3,['pr-or','pr-overlap']),M4:Q(['pr-letters'],3),M5:Q(['pr-number-cards'],3),
  M6:Q([],4,['pr-relative-freq','pr-estimate','pr-expected']),M7:Q(['pr-relative-freq','pr-frequency-table'],3),M8:Q(['pr-sample-space','pr-two-spinners'],4),
  M9:Q(['pr-overlap','pr-addition-rule'],6,['pr-or','pr-and']),M10:Q(['pr-frequency-tree'],5),M11:Q(['pr-tree','pr-dependent','pr-decimals'],7),
  M12:Q([],5,['pr-and','pr-independent','pr-at-least-one','pr-with-replacement']),M13:Q(['pr-forms'],2,['pr-not']),M14:Q(['pr-product-rule'],4,['pr-codes','pr-repeats','pr-no-repeats','pr-listing'])},
 angles:{A1:Q(['an-estimate'],2),A2:Q(['an-straight-line'],1),A3:Q(['an-around-point'],2),A4:Q(['an-triangle'],2),A5:Q(['an-triangle','an-isosceles'],3),
  A6:Q(['an-quadrilateral'],3),A7:Q(['an-crossing-lines'],3,['an-vertically-opposite','an-straight-line']),A8:Q(['an-parallel'],5,['an-corresponding','an-alternate','an-co-interior']),A9:Q(['an-triangle','an-exterior'],4),A10:Q([],5,['an-polygon-sum','an-polygon-exterior','an-polygon-interior']),
  A11:Q(['an-straight-line','an-algebra'],7),A12:Q(['an-triangle','an-algebra'],6),
  Q1:Q(['an-complement-supplement'],1),Q2:Q(['an-right-angle'],1),Q3:Q(['an-reflex','an-around-point'],2),Q4:Q(['an-turns'],1),Q5:Q(['an-clock'],2),Q6:Q(['an-bearing','an-compass'],3),
  Q7:Q(['an-facts'],1),Q8:Q(['an-polygon-exterior'],2),Q9:Q(['an-bisector'],2),Q10:Q(['an-triangle','an-right-triangle'],2),Q11:Q(['an-triangle','an-isosceles'],3),Q12:Q(['an-triangle','an-exterior'],4),
  Q13:Q(['an-triangle','an-algebra'],5),Q14:Q(['an-triangle','an-isosceles','an-algebra'],6),Q15:Q(['an-triangle','an-exterior','an-algebra'],7),
  Q16:Q(['an-quadrilateral','an-parallelogram'],3,['an-algebra']),Q17:Q(['an-quadrilateral','an-kite'],4,['an-algebra']),Q18:Q(['an-quadrilateral','an-trapezium'],4),Q19:Q(['an-quadrilateral','an-rhombus'],5),
  Q20:Q(['an-quadrilateral','an-algebra'],5),Q21:Q(['an-quadrilateral','an-cyclic-quad'],6,['an-algebra']),Q22:Q(['an-crossing-lines','an-vertically-opposite','an-algebra'],5),
  Q23:Q(['an-straight-line','an-algebra'],5),Q24:Q(['an-around-point','an-algebra'],5),Q25:Q(['an-parallel','an-algebra'],7,['an-corresponding','an-alternate','an-co-interior']),
  Q26:Q(['an-parallel','an-triangle'],6),Q27:Q(['an-polygon-sum'],4),Q28:Q(['an-polygon-sides'],5,['an-polygon-exterior','an-polygon-interior','an-polygon-sum']),Q29:Q(['an-polygon-exterior'],4),
  Q30:Q(['an-regular-diagonal','an-isosceles'],6),Q31:Q(['an-ratio'],5,['an-triangle','an-straight-line','an-quadrilateral','an-around-point']),
  Q32:Q(['an-circle-centre'],6,['an-algebra']),Q33:Q(['an-semicircle'],5,['an-algebra']),Q34:Q(['an-radius-isosceles'],5),Q35:Q(['an-same-segment'],6,['an-circle-centre']),
  Q36:Q(['an-tangent'],7),Q37:Q(['an-tangent','an-tangents-point'],8),Q38:Q(['an-alternate-segment'],8),Q39:Q(['an-alternate-segment','an-algebra'],9,['an-circle-centre']),
  Q40:Q(['an-bearing','an-bearing-back'],5),Q41:Q(['an-bearing'],7)}
};
const plain=h=>String(h).replace(/<\/i><i>/g,'/').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
/* things only the generated text knows (which variant of a question type came up) */
const RULE={
 percent:(k,c)=>{const q=c.q,o=[];
  if(k==='P3')o.push(/Write 0\./.test(plain(q))?'pc-from-decimal':'pc-from-fraction');
  if(k==='P6'&&/VAT/.test(q))o.push('pc-vat');
  if(k==='P11')o.push(/compound/.test(q)?'pc-compound-interest':'pc-simple-interest');return o;},
 chance:(k,c)=>{const q=c.q,o=[];
  if(k==='T12'){if(/does <b>not<\/b>/.test(q))o.push('pr-not');else if(/mutually exclusive/.test(q))o.push('pr-or','pr-mutually-exclusive');
    else if(/independent/.test(q))o.push('pr-and','pr-independent');else if(/ratio/.test(q))o.push('pr-ratio','pr-bag');}return o;},
 angles:(k,c)=>{const o=[];
  if(k==='A7')o.push(/Vertically/.test(c.ex)?'an-vertically-opposite':'an-straight-line');
  if(k==='A8')o.push(/Corresponding/.test(c.ex)?'an-corresponding':/Alternate/.test(c.ex)?'an-alternate':'an-co-interior');
  if(k==='A10')o.push(/sum of the interior/.test(c.q)?'an-polygon-sum':/exterior angle/.test(c.q)?'an-polygon-exterior':'an-polygon-interior');return o;}
};
/* per-question meta for quiz games (called when each question is shown) */
window.quizQ=function(game,key,cur){
  const k=cur.k||key,m=(QTAGS[game]||{})[k];if(!m)return null;
  const tags=[...m.t],r=RULE[game]&&RULE[game](k,cur);if(r)tags.push(...r);if(cur.extra)tags.push(...cur.extra);if(cur.simplest)tags.push('simplest-form');
  return fin(tags,m.d,{qt:k,eq:plain(cur.q)});
};
/* level meta for a pool of question types: tags in every type = tags; in some types = sometimes */
function fromPool(game,pool){
  const ALIAS={percent:{P12:['P6','P8','P9','P10','P11','P7']}};
  pool=pool.flatMap(k=>(ALIAS[game]&&ALIAS[game][k])||[k]);
  const ms=[...new Set(pool)].map(k=>QTAGS[game][k]),all=new Set(ms.flatMap(m=>m.t)),tags=[...all].filter(t=>ms.every(m=>m.t.includes(t))).sort();
  const sometimes=[...new Set([...all,...ms.flatMap(m=>m.v)])].filter(t=>!tags.includes(t)).sort(),d=ms.reduce((a,m)=>a+m.d,0)/ms.length;
  return{tags,sometimes,types:[...new Set(pool)],diff:Math.round(clamp(d)),score:Math.round(clamp(d)*10)/10};
}

/* ---------- hook everything onto the registered games ---------- */
const GM=id=>REG.find(g=>g.id===id);
const samp=(f,n=60)=>levelFromSamples(f,n);
window.tagExpand=tagExpand;window.tagFactorise=tagFactorise;window.tagQuad=tagQuad;window.tagLine=tagLine;window.tagFactors=tagFactors;window.tagTransform=tagTransform;
GM('expand').qmeta=lv=>samp(()=>tagExpand(window.__ex.SPECS[lv-1].g()));
GM('factorise').qmeta=lv=>samp(()=>{let q;do{q=window.__fx.gen(window.__fx.LV[lv-1]);}while(!q);return tagFactorise(q);});
GM('quad').qmeta=lv=>samp(()=>tagQuad(window.__qd.gen(window.__qd.LV[lv-1])));
GM('lines').qmeta=lv=>samp(()=>tagLine(window.__ln.gen(lv)));
GM('factors').qmeta=lv=>samp(()=>tagFactors(window.__fac.NS[lv-1]),1);
GM('transform').qmeta=lv=>{const L=window.__tf.LV[lv-1];return samp(()=>tagTransform(L.g(),L.shape));};
['fraction','percent','chance','angles'].forEach(g=>{GM(g).qmeta=lv=>fromPool(g,window['__'+({fraction:'fr',percent:'pc',chance:'ch',angles:'an'})[g]].POOL[lv-1]);});
})();
