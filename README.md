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

## Teacher accounts & dashboard
1. Run `supabase-teacher.sql` once in the Supabase SQL Editor (after `supabase.sql`).
2. Teacher accounts cannot be registered in the game. Create each one yourself in the SQL Editor: `select pz_create_teacher('MISS SMITH','1234');` (name, 4-digit PIN). Teachers then log in normally.
3. Teacher login opens the dashboard (`/teacher/`, also the 🏫 Teacher button on the menu):
   - per game: levels passed, students who played, total play time; expand a game for each student's levels/time and how many students passed each level;
   - on every level page: “N / total students passed” and a ❓ Mistakes button (mistake types grouped from the logged `wrong` events — framework, to be refined per game).
Play time is counted only while a game is open, the tab is visible and the student has touched the screen in the last minute. Teacher accounts are excluded from all statistics.
