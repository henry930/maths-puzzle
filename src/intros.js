// Animated how-to-play scripts for the GCSE games (voice clips: audio/<id>/<n>.mp3)
(function(){
const C=h=>`<div class="gi-card">${h}</div>`,H=(d,h,c)=>`<div class="gi-hid ${c||''}" data-d="${d}">${h}</div>`;
const T=(l,c)=>`<span class="gi-tile ${c||''}">${l}</span>`;
const I={};
const GO=" Good luck!";
// ---------- Balance Scale
const pans=(L,R)=>`<div class="gi-bal"><div class="gi-pan">${L}</div><span class="gi-fu">▲</span><div class="gi-pan">${R}</div></div>`;
I.balance=[
 {say:"Hi there! This is a real balance scale. Our goal is to get x all by itself!",cap:'Get x on its own',html:C(`<div class="gi-big">⚖️</div><div class="gi-mid">x + 3 = 7</div>`)},
 {say:"Whatever you do to one side, the game does to the other side too. So it always stays balanced!",cap:'Both sides change together',html:C(pans(T('x')+T('3','n'),T('7','n')+'')+`<div class="gi-sm">Always balanced</div>`)},
 {say:"Here we have x plus three on the left, and seven on the right. Let's drag the three off the pan.",cap:'Drag the 3 off the pan',html:C(pans(T('x')+`<span class="gi-sl" data-t="1500:go" style="--dy:-120px;display:inline-block">${T('3','n')}</span>`,T('7','n')))+'',hand:[[300,38,34],[1500,38,16,1]],min:5200},
 {say:"Look! The three disappears from both sides, and now seven minus three leaves four. So x equals four!",cap:'x = 4 ✓',html:C(pans(T('x'),T('4','n'))+`<div class="gi-mid gi-g">x = 4</div>`)},
 {say:"If a number is multiplying x, swing the pointer on the base to divide. Two x equals eight becomes x equals four!",cap:'2x = 8 → ÷2 → x = 4',html:C(`<div class="gi-mid">2x = 8</div><div class="gi-big">🧭</div><div class="gi-mid gi-g" data-d="2200" style="opacity:0;transition:.5s" ></div>`+H(2500,`<div class="gi-mid">÷ 2 → <b class="gi-g">x = 4</b></div>`))},
 {say:"When x is all alone, you've solved it. Have fun!"+"",cap:'Press Apply, then keep x alone',html:C(`<div class="gi-big">😄</div><div class="gi-mid">x is alone!</div>`),last:1}
];
// ---------- Arrow Expander
const br=(a)=>`<div class="gi-big">2(<span>x</span> + <span>5</span>)</div>`;
I.expand=[
 {say:"Hi there! Let's learn how to expand brackets. Look at two, times, bracket x plus five.",cap:'Expand 2(x + 5)',html:C(br())},
 {say:"The number outside the bracket must multiply everything inside. So we follow an arrow to each term!",cap:'Multiply EVERY term inside',html:C(`<svg viewBox="0 0 300 120"><text x="20" y="80" font-size="46" font-weight="900" fill="#2b2160">2(x + 5)</text><path d="M45 52 Q95 0 140 50" fill="none" stroke="#e8590c" stroke-width="5" stroke-dasharray="200" stroke-dashoffset="200"><animate attributeName="stroke-dashoffset" to="0" dur="1.2s" begin="0.4s" fill="freeze"/></path><path d="M45 52 Q130 -30 235 50" fill="none" stroke="#1c7ed6" stroke-width="5" stroke-dasharray="300" stroke-dashoffset="300"><animate attributeName="stroke-dashoffset" to="0" dur="1.4s" begin="2s" fill="freeze"/></path></svg>`),min:6000},
 {say:"First arrow: two times x makes two x! Tap the box, and type it in.",cap:'2 × x = 2x',html:C(`<div class="gi-big">2 × x = <span class="gi-box" data-t="2200:on">?</span></div>`+H(2200,`<div class="gi-big gi-g">2x</div>`)),hand:[[400,60,38],[1700,60,38,1]],min:5000},
 {say:"Second arrow: two times five makes ten!",cap:'2 × 5 = 10',html:C(`<div class="gi-big">2 × 5 = <span class="gi-box on">10</span></div>`)},
 {say:"Put it together: two x plus ten. And watch the signs! A minus times a minus makes a plus."+GO,cap:'2(x + 5) = 2x + 10',html:C(`<div class="gi-big">2x + 10 ✓</div><div class="gi-sm">− × − = +   ·   x × x = x²</div>`),last:1}
];
// ---------- Line Hunter
const AX=(extra,stars)=>`<svg viewBox="0 0 240 200"><rect width="240" height="200" fill="#f8f9ff"/><g stroke="#ced4da"><path d="M20 100H230M120 10V190"/></g><path d="M120 100H230M120 100V10" stroke="#495057" stroke-width="2" fill="none"/>${stars||''}${extra||''}</svg>`;
const STR=`<text x="150" y="68" font-size="22">⭐</text><text x="180" y="38" font-size="22">⭐</text><text x="112" y="82" font-size="22">⭐</text>`;
I.lines=[
 {say:"Hi there! Here's a graph with some stars. Your job is to make the line pass through every single star!",cap:'Make the line hit every ⭐',html:C(AX('',STR))},
 {say:"The line is y equals m x plus c. You get to change m and c.",cap:'y = mx + c',html:C(`<div class="gi-big">y = <b class="gi-y">m</b>x + <b class="gi-g">c</b></div>`)},
 {say:"M is the gradient. It tells you how steep the line is. Tap plus, and the line gets steeper!",cap:'m = gradient (steepness)',html:C(AX('<line x1="20" y1="100" x2="220" y2="70" stroke="#e8590c" stroke-width="5"><animate attributeName="y2" to="-60" dur="2.5s" begin="0.8s" fill="freeze"/></line>',STR)+`<div class="gi-mid gi-y">m  <b>+</b></div>`),hand:[[500,40,92],[1200,40,92,1]],min:5000},
 {say:"C is where the line crosses the y axis. Change c, and the whole line slides up or down.",cap:'c = where it crosses the y-axis',html:C(AX('<line x1="20" y1="170" x2="220" y2="30" stroke="#2f9e44" stroke-width="5"><animateTransform attributeName="transform" type="translate" to="0 -50" dur="2.5s" begin="0.8s" fill="freeze"/></line>',STR)+`<div class="gi-mid gi-g">c  <b>+</b></div>`),min:5000},
 {say:"When the line goes through all the stars, you win!"+GO,cap:'Line through every ⭐ = level complete!',html:C(AX('<line x1="60" y1="150" x2="200" y2="10" stroke="#7048e8" stroke-width="5"/>',STR)+`<div class="gi-mid gi-g">🎉</div>`),last:1}
];
// ---------- Angle Hunter
const TRI=(q)=>`<svg viewBox="0 0 260 170"><polygon points="30,150 230,150 90,20" fill="#e7f5ff" stroke="#1971c2" stroke-width="4"/><text x="55" y="140" font-size="20" font-weight="800" fill="#1971c2">50°</text><text x="170" y="140" font-size="20" font-weight="800" fill="#1971c2">60°</text><text x="75" y="62" font-size="22" font-weight="900" fill="#e8590c">${q}</text></svg>`;
I.angles=[
 {say:"Hi there! In this game, you hunt for the missing angle. Here, two angles are fifty and sixty, and one is a mystery!",cap:'Find the missing angle',html:C(TRI('?'))},
 {say:"A key rule: the angles in a triangle always add up to one hundred and eighty degrees!",cap:'Triangle angles add to 180°',html:C(`<div class="gi-big">△ = 180°</div>`)},
 {say:"Fifty plus sixty is one hundred and ten. So we do one eighty, minus one ten.",cap:'50 + 60 = 110   →   180 − 110',html:C(`<div class="gi-mid">50 + 60 = <b>110</b></div>`+H(1800,`<div class="gi-mid">180 − 110 = ?</div>`)),min:5000},
 {say:"That makes seventy! Just type it in with the keypad.",cap:'The answer is 70°',html:C(TRI('70°')+`<div class="gi-big gi-g">70</div>`)},
 {say:"There are other rules too: angles on a straight line make one eighty, and angles around a point make three sixty. Diagrams are not always to scale, so calculate!"+GO,cap:'Straight line 180° · Around a point 360°',html:C(`<div class="gi-mid">Straight line = <b>180°</b></div><div class="gi-mid">Around a point = <b>360°</b></div><div class="gi-sm">Not drawn to scale!</div>`),last:1,min:7000}
];
// ---------- Transform Quest
const GR=(poly,extra)=>`<svg viewBox="0 0 240 200"><g stroke="#dee2e6">${[0,1,2,3,4,5,6,7,8].map(i=>`<path d="M${i*30} 0V200M0 ${i*25}H240"/>`).join('')}</g><polygon points="${poly}" fill="#74c0fc" stroke="#1971c2" stroke-width="3"/>${extra||''}</svg>`;
I.transform=[
 {say:"Hi there! In this game you move shapes on a grid. You can slide them, flip them, turn them, or make them bigger!",cap:'Slide · Flip · Turn · Enlarge',html:C(GR('30,150 90,150 30,100'))},
 {say:"First, read the instruction. For example: translate the shape three squares right, and one square up.",cap:'Translate: 3 right, 1 up',html:C(`<div class="gi-mid">Translate by <b class="gi-y">(3, 1)</b></div><div class="gi-sm">3 right · 1 up</div>`)},
 {say:"Every corner of the shape moves three squares right, and one up.",cap:'Move every corner',html:C(GR('30,150 90,150 30,100','<polygon points="120,125 180,125 120,75" fill="#ffd43b" fill-opacity=".7" stroke="#f08c00" stroke-width="3" class="gi-hid" data-d="800"/>')),min:5200},
 {say:"Now tap the grid points where the corners of the new shape land. Tap a point again to take it away.",cap:'Tap where each corner lands',html:C(GR('30,150 90,150 30,100','<g fill="#f03e3e"><circle cx="120" cy="125" r="7" class="gi-hid" data-d="900"/><circle cx="180" cy="125" r="7" class="gi-hid" data-d="2200"/><circle cx="120" cy="75" r="7" class="gi-hid" data-d="3500"/></g>')),hand:[[300,50,63,1],[1700,75,63,1],[3000,50,45,1]],min:6000},
 {say:"Feeling stuck? Tap the light bulb for a visual clue."+GO,cap:'💡 Hint = visual clue',html:C(`<div class="gi-big gi-bounce">💡</div>`),last:1}
];
// ---------- Fraction Factory
const PIZ=(n)=>{let s='';for(let i=0;i<8;i++){const a0=i*Math.PI/4-Math.PI/2,a1=(i+1)*Math.PI/4-Math.PI/2;s+=`<path d="M100 100 L${100+80*Math.cos(a0)} ${100+80*Math.sin(a0)} A80 80 0 0 1 ${100+80*Math.cos(a1)} ${100+80*Math.sin(a1)} Z" fill="${i<n?'#ff922b':'#fff3bf'}" stroke="#e67700" stroke-width="3"/>`;}return `<svg viewBox="0 0 200 200" style="max-height:32vh">${s}</svg>`;};
I.fraction=[
 {say:"Hi there! Pizzas and chocolate bars make fractions easy to see!",cap:'Fractions you can see',html:C(PIZ(6))},
 {say:"Count the slices that are shaded. That's six. Then count all the slices. That's eight.",cap:'6 shaded · 8 slices in total',html:C(PIZ(6)+`<div class="gi-mid">6 shaded of 8</div>`)},
 {say:"So the fraction is six eighths. Type it using the slash key: six, slash, eight.",cap:'Type  6 / 8',html:C(`<div class="gi-big"><span class="fr"><i>6</i><i>8</i></span></div><div class="gi-sm">Use the / key</div>`),hand:[[500,70,60,1]],min:5000},
 {say:"Sometimes it asks for simplest form. Divide the top and the bottom by the same number. Two goes into both!",cap:'Simplest form: ÷ 2 top and bottom',html:C(`<div class="gi-big"><span class="fr"><i>6</i><i>8</i></span> = <span class="fr"><i>3</i><i>4</i></span></div>`+`<div class="gi-sm">÷ 2 on the top and the bottom</div>`),min:5500},
 {say:"Three quarters! That's it."+GO,cap:'Answer: 3/4',html:C(PIZ(6)+`<div class="gi-big gi-g">¾</div>`),last:1}
];
// ---------- Percent Shop
I.percent=[
 {say:"Hi there! Welcome to the percent shop. Let's work out twenty percent off a fifty pound jacket!",cap:'20% off a £50 jacket',html:C(`<div class="gi-big">🧥</div><div class="gi-mid">£50</div><div class="gi-mid gi-r">20% OFF</div>`)},
 {say:"Here's a top tip. Find ten percent first, by dividing by ten.",cap:'Tip: 10% = ÷ 10',html:C(`<div class="gi-mid">10% of £50</div><div class="gi-big">50 ÷ 10 = <b class="gi-g">5</b></div>`),min:4500},
 {say:"Twenty percent is two lots of ten percent. So that's ten pounds off!",cap:'20% = 2 × 5 = £10',html:C(`<div class="gi-mid">20% = 2 × 10%</div><div class="gi-big">2 × 5 = <b class="gi-g">10</b></div>`)},
 {say:"The sale takes ten pounds off, so you pay forty pounds! Just type the number, no pound sign needed.",cap:'£50 − £10 = £40',html:C(`<div class="gi-big">50 − 10 = <b class="gi-g">40</b></div>`),hand:[[600,55,70,1]],min:5000},
 {say:"For reverse percentages, work out one percent first."+GO,cap:'Reverse %: find 1% first',html:C(`<div class="gi-mid">Reverse percentages</div><div class="gi-big">1% first!</div>`),last:1}
];
// ---------- Ball Factory
const BALLS=(n,rows,cols,odd)=>{let s='';for(let i=0;i<n;i++)s+=`<span class="gi-ball ${i>=odd?'o':''}"></span>`;return `<div class="gi-grid" style="grid-template-columns:repeat(${cols},26px)">${s}</div>`;};
const B12=(c)=>{let s='';for(let i=0;i<12;i++)s+='<span class="gi-ball"></span>';return `<div class="gi-grid" style="grid-template-columns:repeat(${c},26px)">${s}</div>`;};
I.factors=[
 {say:"Hi there! Let's find factors using balls. Here are twelve balls in a pile.",cap:'12 balls',html:C(`<div class="gi-row">${'<span class="gi-ball"></span>'.repeat(12)}</div><div class="gi-mid">12</div>`)},
 {say:"Type how many rows to use. Let's try three rows, and press Arrange.",cap:'3 rows → Arrange',html:C(B12(4)+`<div class="gi-mid">3 rows × 4 columns</div>`),hand:[[500,50,80,1]],min:5000},
 {say:"Every row is full! So three and four are both factors of twelve.",cap:'3 and 4 are factors of 12 ✓',html:C(B12(4)+`<div class="gi-mid gi-g">3 × 4 = 12 ✓</div>`)},
 {say:"Now try five rows. Look, some orange balls are left over. So five is not a factor.",cap:'5 rows: orange balls left over ✗',html:C(`<div class="gi-grid" style="grid-template-columns:repeat(3,26px)">${'<span class="gi-ball"></span>'.repeat(10)}<span class="gi-ball o"></span><span class="gi-ball o"></span></div><div class="gi-mid gi-r">5 is not a factor ✗</div>`),min:5000},
 {say:"Find all the factors, then press, That's all."+GO,cap:'Find ALL the factors',html:C(`<div class="gi-mid">Factors of 12</div><div class="gi-row">${[1,2,3,4,6,12].map(n=>T(n)).join('')}</div>`),last:1}
];
// ---------- Chance Lab
const BAG=`<div class="gi-row"><span class="gi-ball r"></span><span class="gi-ball r"></span><span class="gi-ball r"></span><span class="gi-ball b"></span><span class="gi-ball b"></span></div>`;
I.chance=[
 {say:"Hi there! Let's work out probability. Here's a bag with three red balls and two blue balls.",cap:'3 red 🔴 · 2 blue 🔵',html:C(`<div class="gi-big">🎒</div>`+BAG)},
 {say:"Probability is the number of ways you want, over the total number of outcomes.",cap:'Probability = wanted ÷ total',html:C(`<div class="gi-mid">Probability =</div><div class="gi-big"><span class="fr"><i>wanted</i><i>total</i></span></div>`)},
 {say:"We want a red ball. There are three reds, and five balls altogether. So the probability is three fifths!",cap:'P(red) = 3/5',html:C(BAG+`<div class="gi-big"><span class="fr"><i>3</i><i>5</i></span></div>`),min:5500},
 {say:"Type three, slash, five. A decimal works too: zero point six!",cap:'3/5 or 0.6 — both work',html:C(`<div class="gi-big">3/5 = 0.6 ✓</div>`),hand:[[500,60,70,1]],min:5000},
 {say:"You'll also see spinners and dice grids. Get four out of five right to pass!"+GO,cap:'4 out of 5 to pass',html:C(`<div class="gi-big">🎲 🎡</div>`),last:1}
];
// ---------- Dice Derby
const HORSES=`<div style="display:flex;flex-direction:column;gap:6px;font-size:22px;align-items:flex-start;width:100%"><div>🏇 <b>6</b> ·········</div><div>🏇 <b>7</b> ·········</div><div>🏇 <b>8</b> ·········</div></div>`;
I.derby=[
 {say:"Hi there! Welcome to the Dice Derby! Horses are numbered two to twelve, and they're about to race!",cap:'Horses numbered 2–12',html:C(HORSES)},
 {say:"Tap a horse number to bet ten coins on it. You can back up to three horses.",cap:'Tap a number: bet 10 coins (up to 3)',html:C(`<div class="gi-row">${T(6)}${T(7,'o')}${T(8)}</div><div class="gi-sm">🪙 10 each</div>`),hand:[[600,50,40,1]],min:5000},
 {say:"Press Start! Every time two dice are rolled, the horse matching the total moves forward!",cap:'🎲 3 + 4 = 7 → horse 7 moves!',html:C(`<div class="gi-big">🎲🎲</div><div class="gi-mid">3 + 4 = <b class="gi-y">7</b></div>`+H(1500,`<div class="gi-mid">🏇 7 →</div>`)),min:5200},
 {say:"The first horse to the finish line wins, and pays forty coins for each winning bet!",cap:'First to the finish pays 40 coins',html:C(`<div class="gi-big">🏁🏆</div><div class="gi-mid">🪙 40</div>`)},
 {say:"But which totals come up the most? Think carefully before you bet!"+GO,cap:'Which totals come up most?',html:C(`<div class="gi-big gi-bounce">🤔</div>`),last:1}
];
// ---------- Quadratic Factoriser
I.quad=[
 {say:"Hi there! Let's factorise a quadratic: x squared plus seven x plus twelve.",cap:'Factorise x² + 7x + 12',html:C(`<div class="gi-big">x² + 7x + 12</div>`)},
 {say:"Step one: find two numbers that multiply to twelve, and add up to seven.",cap:'Multiply to 12 · Add to 7',html:C(`<div class="gi-mid">× → <b class="gi-y">12</b></div><div class="gi-mid">+ → <b class="gi-g">7</b></div>`)},
 {say:"Three times four is twelve, and three plus four is seven. Perfect!",cap:'3 × 4 = 12 ✓   3 + 4 = 7 ✓',html:C(`<div class="gi-big">${T(3)} ${T(4)}</div><div class="gi-mid">3 × 4 = 12 ✓</div><div class="gi-mid">3 + 4 = 7 ✓</div>`),min:5000},
 {say:"Step two: write the brackets. x plus three, times, x plus four!",cap:'(x + 3)(x + 4)',html:C(`<div class="gi-big">(x + <b class="gi-g">3</b>)(x + <b class="gi-g">4</b>)</div>`),hand:[[500,60,50,1],[1500,80,50,1]],min:5000},
 {say:"Watch the signs, and good luck! If the first number in front of x squared isn't one, there's a bit more to do."+"",cap:'Watch the signs!',html:C(`<div class="gi-big">+ − ✓</div>`),last:1,min:6000}
];
window.__INTROS=I;
REG.forEach(g=>{if(I[g.id])g.anim=mkAnim(g.id,I[g.id]);});
})();
