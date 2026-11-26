import re
d='src/'
css=open(d+'style.css').read()
js=''.join(open(d+f).read()+'\n' for f in ['config.js','core.js','account.js','quiz.js','g24.js','grid.js','digits.js','kenken.js','sudoku.js','river.js','klotski.js','euler.js','nim.js','chance.js','derby.js','angles.js','transform.js','balance.js','lines.js','match.js','p2048.js','fraction.js','percent.js','factors.js','expand.js','times.js'])
html=f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#6741d9"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<title>Maths Puzzle Arcade</title><style>{css}</style></head><body><div class="wrap">
<section id="menu"><div class="hero"><h1>🧠 Maths Puzzle Arcade</h1><p>Real puzzles that secretly train your maths. Pick a game!</p></div><div class="overall" id="overall"></div><div class="cats" id="cats"></div><div class="grid" id="cards"></div></section>
<section id="game" hidden><div class="gbar" id="gbar"><button class="back" id="back">← Menu</button><h2 id="gtitle"></h2><div class="pills" id="glevels"></div></div>
<div class="glv" id="glvname"></div><div class="howto" id="howto"></div><div id="groot"></div></section>
</div><script>{js}
renderMenu();bootAccount();if(window.__GAME_PAGE)routeNow();</script></body></html>'''
open('index.html','w').write(html)
import os
ids=re.findall(r"id:'([a-z0-9_]+)',name:",js)
for i in ids:
    os.makedirs(i,exist_ok=True)
    open(i+'/index.html','w').write(html.replace('<script>'+js[:0],'<script>window.__GAME_PAGE=1;',1).replace('<title>Maths Puzzle Arcade</title>','<title>Maths Puzzle Arcade</title><base href="../">') if False else html.replace('<script>','<script>window.__GAME_PAGE=1;',1))
open('404.html','w').write(html.replace('<script>','<script>window.__GAME_PAGE=1;',1))
print(ids)
print(len(html))
