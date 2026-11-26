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
Each game has its own address, e.g. `/balance/`, `/sudoku/`, `/g24/`, `/kenken/`, `/p2048/`. `build.py` generates these folders.
