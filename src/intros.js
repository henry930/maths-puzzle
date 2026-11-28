// Live-demo scripts: the REAL game (seeded first question) is driven step by step. Voice clips: audio/<id>/<n>.mp3
(function(){
const D={};
D.balance={seed:13,steps:[
 {say:"Hi there! This is a real balance scale. Our goal is to get x all by itself!",cap:'Get x on its own',async do(h){h.hl('#eq');await h.wait(2500);},min:2500},
 {say:"The equation is up here, and the scale shows the very same thing. Whatever you do to one side, the game does to the other side too!",cap:'Both sides always change together',async do(h){h.unhl();h.hl('#scene');await h.wait(2000);},min:3000},
 {say:"Here, x plus four equals ten. To get x alone, we need to take away the four. Just drag its tile off the pan!",cap:'Drag the number tile off the pan',async do(h){h.unhl();const t=[...document.querySelectorAll('.sc-pan[data-p=L] .t.tn')][0];if(t)await h.drag(t,{x:30,y:t.getBoundingClientRect().top-40});},min:3000},
 {say:"Look! Four disappears from both sides, and the scale stays balanced. Now x equals six!",cap:'Both sides change · x is alone ✓',async do(h){h.hide();h.hl('#eq');await h.wait(2000);},min:3000},
 {say:"You can also drag a weight from this box onto a pan, to add it to both sides.",cap:'Add weights from this box',async do(h){h.unhl();h.hl('.sc-wts');await h.point('.sc-wts',900);},min:3000},
 {say:"If a number is stuck to x, use the dial. Swing the pointer left to divide, or right to multiply, then press Apply. Have fun!",cap:'Dial: left = ÷ · right = ×',async do(h){h.unhl();h.hl('.sc-base');await h.point('#gauge',900);},last:1,min:3000}
]};

const hl=(h,sel)=>{h.unhl();h.hl(sel);};
// ---------- Arrow Expander  (seed 14 → 3(x + 4))
D.expand={seed:14,steps:[
 {say:"Hi there! Let's learn how to expand brackets. The number outside the bracket must multiply everything inside!",cap:'Outside number × EVERY term inside',async do(h){hl(h,'#exe');await h.wait(2500);},min:3000},
 {say:"Follow the arrows! Arrow one: three times x. Tap the box on the arrow, and type the answer with the keypad.",cap:'Tap the arrow box · type the answer',async do(h){h.unhl();await h.tap('.ex-chip');await h.key('3');await h.key('x');await h.key('✓');},min:3000},
 {say:"Arrow two: three times four. That's twelve!",cap:'3 × 4 = 12',async do(h){await h.key('1');await h.key('2');await h.key('✓');},min:3000},
 {say:"All done! Three x plus twelve. Watch the signs: a minus times a minus makes a plus. Good luck!",cap:'3(x + 4) = 3x + 12 ✓',async do(h){h.hide();hl(h,'#exres');await h.wait(1500);},last:1,min:3000}
]};
// ---------- Line Hunter  (seed 1 → star on y = 2x)
D.lines={seed:1,steps:[
 {say:"Hi there! Here's a graph with a star on it. Your job is to make the line pass through the star!",cap:'Make the line pass through the ⭐',async do(h){hl(h,'.ln-svg');await h.wait(2500);},min:3000},
 {say:"The line is y equals m x plus c, and you can see its equation up here.",cap:'y = mx + c',async do(h){hl(h,'.ln-eq');await h.wait(2000);},min:2500},
 {say:"M is the gradient. It tells you how steep the line is. Tap plus, and watch the line tilt towards the star!",cap:'m = gradient (steepness) · tap +',async do(h){h.unhl();for(let i=0;i<8&&!document.querySelector('.ln-l.ok');i++)await h.tap('[data-a="m+"]');},min:4000},
 {say:"The line goes right through the star, so you win! In later levels, c moves the line up and down. Good luck!",cap:'Line through every ⭐ = win!',async do(h){h.hide();hl(h,'.ln-svg');await h.wait(1500);},last:1,min:3000}
]};
// ---------- Angle Hunter  (seed 1 → 60°)
D.angles={seed:1,steps:[
 {say:"Hi there! In this game, you hunt for the missing angle. It's marked with a question mark.",cap:'Find the angle marked ?',async do(h){hl(h,'.ch-vis');await h.wait(2500);},min:3000},
 {say:"At this level, you estimate it. A square corner is ninety degrees, and this angle is a bit smaller. About sixty!",cap:'Estimate: smaller than 90° → about 60°',async do(h){await h.point('.ch-vis svg',900);},min:3500},
 {say:"Type sixty on the keypad, then press the tick.",cap:'Type 60 · press ✓',async do(h){h.unhl();await h.type('60');await h.key('✓');},min:3000},
 {say:"Later levels use rules. Angles on a straight line make one eighty. Angles in a triangle make one eighty. Angles around a point make three sixty. Diagrams are not always to scale! Good luck!",cap:'Straight line 180° · Triangle 180° · Point 360°',async do(h){h.hide();await h.wait(1000);},last:1,min:7000}
]};
// ---------- Transform Quest  (seed 1 → translate by (2, 4))
const gx=(x)=>(x+7)/14,gy=(y)=>(7-y)/14;
D.transform={seed:1,steps:[
 {say:"Hi there! In this game, you move shapes on a grid. First, read the instruction at the top.",cap:'Read the instruction',async do(h){hl(h,'.ch-q');await h.wait(2500);},min:3000},
 {say:"This one says translate by two, four. That means two squares right, and four squares up.",cap:'(2, 4) = 2 right, 4 up',async do(h){await h.wait(2000);},min:3500},
 {say:"Move each corner of the blue shape two right, and four up, then tap that point on the grid.",cap:'Tap where each corner lands',async do(h){h.unhl();await h.tapAt('#tfs',gx(2),gy(4));await h.tapAt('#tfs',gx(-1),gy(3));await h.tapAt('#tfs',gx(0),gy(1));},min:5000},
 {say:"When every corner is placed, the game checks your answer. Stuck? The light bulb gives you a visual clue. Good luck!",cap:'💡 Hint = visual clue',async do(h){h.hide();hl(h,'#hn');await h.wait(1500);},last:1,min:3500}
]};
// ---------- Fraction Factory  (seed 3 → 2/5)
D.fraction={seed:3,steps:[
 {say:"Hi there! Pizzas make fractions easy to see. What fraction of this pizza is coloured?",cap:'What fraction is coloured?',async do(h){hl(h,'.ch-vis');await h.wait(2500);},min:3000},
 {say:"Count the coloured slices. There are two! Then count all of the slices. Five altogether.",cap:'2 coloured · 5 slices in total',async do(h){await h.wait(2500);},min:3500},
 {say:"So the answer is two fifths. Tap two, then the slash key, then five, and press enter.",cap:'Type 2 / 5 · press Enter',async do(h){h.unhl();await h.type('2');await h.key('/');await h.type('5');await h.key('✓');},min:3500},
 {say:"If a question asks for simplest form, divide the top and the bottom by the same number, until you can't any more. Good luck!",cap:'Simplest form: ÷ top and bottom',async do(h){h.hide();await h.wait(1000);},last:1,min:5000}
]};
// ---------- Percent Shop  (seed 1 → 60%)
D.percent={seed:1,steps:[
 {say:"Hi there! Welcome to the percent shop! Here, a hundred squares make a grid.",cap:'100 squares = 100%',async do(h){hl(h,'.ch-vis');await h.wait(2500);},min:3000},
 {say:"Each full row has ten squares, which is ten percent. Six rows are shaded, so that's sixty percent!",cap:'1 row = 10% · 6 rows = 60%',async do(h){await h.wait(2500);},min:4000},
 {say:"Type sixty. You don't need the percent sign. Then press the tick.",cap:'Type 60 · press ✓',async do(h){h.unhl();await h.type('60');await h.key('✓');},min:3500},
 {say:"Here's a top tip for later: find ten percent first, by dividing by ten, then build any other percentage from it. Good luck!",cap:'Tip: 10% = ÷ 10',async do(h){h.hide();await h.wait(1000);},last:1,min:5000}
]};
// ---------- Ball Factory  (level 7 → 12 balls)
const setIn=async(h,sel,v)=>{const i=document.querySelector(sel);if(!i)return;await h.point(i,800);i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}));};
D.factors={seed:1,lv:7,steps:[
 {say:"Hi there! Let's find factors using balls. Here are twelve balls in a pile.",cap:'12 balls',async do(h){hl(h,'#fcb');await h.wait(2500);},min:3000},
 {say:"Type how many rows to use. Let's try three rows, and press Arrange.",cap:'3 rows → Arrange',async do(h){h.unhl();await setIn(h,'#fcr','3');await h.tap('#fcgo');},min:3500},
 {say:"Every row is full! So three and four are both factors of twelve.",cap:'3 × 4 = 12 ✓ · both are factors',async do(h){hl(h,'.fc-top');await h.wait(2500);},min:3500},
 {say:"Now try five rows. Look, orange balls are left over, so five is not a factor.",cap:'5 rows: orange balls left over ✗',async do(h){h.unhl();await setIn(h,'#fcr','5');await h.tap('#fcgo');},min:3500},
 {say:"Find all the factors, then press, That's all. Good luck!",cap:'Find ALL the factors → That’s all ✓',async do(h){await h.point('#fcdone',900);},last:1,min:3500}
]};
// ---------- Chance Lab  (seed 12 → blue = 4/10)
D.chance={seed:12,steps:[
 {say:"Hi there! Let's work out probability. A bag holds these balls, and one is picked at random.",cap:'One ball is picked at random',async do(h){hl(h,'.ch-vis');await h.wait(2500);},min:3000},
 {say:"We want blue. Count the blue balls: four. Then count all the balls: ten.",cap:'Blue: 4 · Total: 10',async do(h){await h.wait(2500);},min:3500},
 {say:"Probability is the wanted number over the total, so four tenths. Type four on top, tap the bottom box, then type ten.",cap:'4 over 10',async do(h){h.unhl();await h.tap('#fn');await h.type('4');await h.tap('#fd');await h.type('10');},min:4500},
 {say:"Press the tick! Any equivalent fraction works too, and so does a decimal. Good luck!",cap:'4/10 = 2/5 = 0.4 — all accepted',async do(h){await h.key('✓');},last:1,min:4000}
]};
// ---------- Dice Derby  (level 3: two dice)
D.derby={seed:5,lv:3,steps:[
 {say:"Hi there! Welcome to the Dice Derby! Every horse has a number, and they're about to race.",cap:'Horses numbered by dice totals',async do(h){hl(h,'.dy-lanes');await h.wait(2500);},min:3000},
 {say:"Tap a horse number to bet ten coins on it. You can back up to three horses.",cap:'Tap numbers to bet (max 3)',async do(h){h.unhl();await h.tap('.dy-lane[data-k="7"]');await h.tap('.dy-lane[data-k="6"]');},min:4000},
 {say:"Now press Start! Every time the dice are rolled, the horse matching the total moves forward.",cap:'Press Start race!',async do(h){await h.tap('#st');await h.wait(5000);},min:6000},
 {say:"The first horse to reach the finish line wins, and pays forty coins for each winning bet!",cap:'First to the finish wins 40 🪙',async do(h){h.hide();await h.wait(2500);},min:4000},
 {say:"But which numbers win most often? Tap, Show chances, to find out. Think carefully before you bet. Good luck!",cap:'Show chances: why do some win more?',async do(h){await h.tap('#pp');},last:1,min:4500}
]};
// ---------- Quadratic Factoriser  (seed 13 → x² + 5x + 6)
D.quad={seed:13,steps:[
 {say:"Hi there! Let's factorise a quadratic: x squared plus five x plus six.",cap:'Factorise x² + 5x + 6',async do(h){hl(h,'#qt');await h.wait(2500);},min:3000},
 {say:"Step one: find two numbers that multiply to six, and add up to five.",cap:'Multiply to 6 · Add to 5',async do(h){hl(h,'#qti');await h.wait(2500);},min:3500},
 {say:"Two times three is six, and two plus three is five. Perfect! Type two, press Next, then three, and Next.",cap:'2 × 3 = 6 ✓   2 + 3 = 5 ✓',async do(h){h.unhl();await h.type('2');await h.key('Next');await h.type('3');await h.key('Next');},min:4500},
 {say:"Step two: write the brackets. x plus two, times, x plus three.",cap:'(x + 2)(x + 3)',async do(h){await h.type('2');await h.key('Next');await h.type('3');await h.key('Next');},min:4000},
 {say:"That's the answer! Watch the signs, and good luck!",cap:'Watch the signs!',async do(h){h.hide();await h.wait(1000);},last:1,min:2500}
]};
window.__DEMOS=D;
REG.forEach(g=>{if(D[g.id]){g.demo={seed:D[g.id].seed,lv:D[g.id].lv||1};g.anim=mkDemo(g.id,D[g.id].steps);}});
})();
