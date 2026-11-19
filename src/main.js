// main.js — wiring: input -> game.move -> render -> storage。
import { newGame, move, DIRS } from './game.js';
import { Renderer } from './renderer.js';
import { getBest, setBest } from './storage.js';

const canvas = document.getElementById('board');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const overlayEl = document.getElementById('overlay');
const renderer = new Renderer(canvas);

let g = newGame();

function refresh() {
  renderer.draw(g.grid);
  scoreEl.textContent = g.score;
  setBest(g.score);
  bestEl.textContent = getBest();
  overlayEl.style.display = (g.over || g.won) ? 'block' : 'none';
  overlayEl.textContent = g.over
    ? '游戏结束 — 点"新游戏"重来'
    : '你凑出 2048 了！还能继续刷分';
}

const KEYS = {
  ArrowLeft: DIRS.left, a: DIRS.left,
  ArrowUp: DIRS.up, w: DIRS.up,
  ArrowRight: DIRS.right, d: DIRS.right,
  ArrowDown: DIRS.down, s: DIRS.down,
};
document.addEventListener('keydown', e => {
  const dir = KEYS[e.key];
  if (dir === undefined) return;
  e.preventDefault();
  if (move(g, dir)) refresh();
});

// 触屏滑动
let sx = 0, sy = 0;
canvas.addEventListener('touchstart', e => {
  sx = e.touches[0].clientX; sy = e.touches[0].clientY;
});
canvas.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx;
  const dy = e.changedTouches[0].clientY - sy;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
  const dir = Math.abs(dx) > Math.abs(dy)
    ? (dx > 0 ? DIRS.right : DIRS.left)
    : (dy > 0 ? DIRS.down : DIRS.up);
  if (move(g, dir)) refresh();
});

document.getElementById('restart').addEventListener('click', () => {
  g = newGame();
  refresh();
});

refresh();
