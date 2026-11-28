# 🧠 Maths Puzzle Arcade

Fun, visual maths games for GCSE students — 19 games, ~12–20 levels each, player profiles with points, and a class board for teachers. Works on phones and desktops; no installation, no server.

**Play:** open `index.html` (or the GitHub Pages link once enabled).

Games: Make 24 · Number Grid · Digit Detective · KenKen · Sudoku · River Crossing · Klotski · One-Stroke · Nim & Chomp · Chance Lab · Dice Derby · Angle Hunter · Transform Quest · Balance Scale · Line Hunter · Number Match · Power Merge · Fraction Factory · Percent Shop.

Progress is stored in each browser (localStorage). Students can tap *Share my progress* to copy a code; teachers paste codes into the *Class board*.

## Rebuild
`index.html` is generated from `src/` (JS modules + `style.css`):

```
python3 build.py
```

## Game URLs
Each game has its own address, e.g. `/balance/`, `/sudoku/`, `/g24/`, `/p2048/`. `build.py` generates these folders.

## Accounts & online database (Supabase, free)
1. Create a free project at https://supabase.com (Project → New).
2. Open `supabase.sql`, change `CHANGE_ME_teacher_key` to your own teacher key, then run the whole file in **SQL Editor**.
3. In **Project Settings → API** copy the **Project URL** and the **anon public** key.
4. Paste them into `src/config.js` (`window.PZ_CFG={url:'…',key:'…'}`), run `python3 build.py`, commit and push.

Without these settings the arcade still works, but accounts are stored only in each device's browser.
Stored online: players (name + hashed PIN), progress, and an event log (`pz_events`) of every wrong answer with the question, typed answer, expected answer and error type, for later strength/weakness analysis.

## Question tags (for recommending levels by student level)
Every generated question can carry tags, so later we can match questions to what each student has mastered.
- `src/tags.js` holds the shared vocabulary (`TAXO`, English + Chinese labels). Tag ids are stored in the online event log, so **never rename an id** – only its label.
- A game opts in with `qmeta(lv)` (level-level tags, shown as chips under the level name) and sets `ctx.q = {tags, ops, steps, diff, score, eq}` for each question it generates. `ctx.q` is attached to every `wrong` and `complete` event; `ctx.perf` (moves vs best, undos, hints, restarts) is attached to `complete`.
- Balance Scale is tagged so far: operations needed (`op-add/sub/mul/div`, `only-*`), length (`steps-1/2/3`), `x-one-side` / `x-both-sides`, `neg-const`, `neg-answer`, `fractions` (+ `frac-unit`, `frac-nonunit`, `frac-both`), `big-numbers`; difficulty 1–10 (`score` = same on a finer scale).
- `node tools/export-tags.js` first checks that the "shortest solution" of thousands of generated questions really solves them, then writes `data/question-tags.json` and `data/question-tags-<game>.csv` (one row per level). Add a game id to `games` in that script once it has `qmeta`.
