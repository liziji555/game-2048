// game.js — 2048 core: matrix state, slide/merge, spawn, move, win/lose check.
// Pure logic, no DOM — 后面接 roguelike 词条也只动这层的数据结构。

export const N = 4;
export const DIRS = { left: 0, up: 1, right: 2, down: 3 };

export function newGame() {
  const g = { grid: new Array(N * N).fill(0), score: 0, over: false, won: false };
  spawn(g); spawn(g);
  return g;
}

export function spawn(g) {
  const empty = [];
  g.grid.forEach((v, i) => { if (!v) empty.push(i); });
  if (!empty.length) return false;
  g.grid[empty[Math.floor(Math.random() * empty.length)]] =
    Math.random() < 0.9 ? 2 : 4;
  return true;
}

// 单行向左滑动合并，返回 [新行, 得分增益, 是否位移]
function slide(row) {
  const nums = row.filter(v => v);
  const out = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      out.push(nums[i] * 2);
      gained += nums[i] * 2;
      i++;
    } else out.push(nums[i]);
  }
  while (out.length < N) out.push(0);
  const moved = out.some((v, i) => v !== row[i]);
  return [out, gained, moved];
}

// dir: 0 left, 1 up, 2 right, 3 down
export function move(g, dir) {
  if (g.over) return false;
  let moved = false, gained = 0;
  for (let line = 0; line < N; line++) {
    let row = [];
    for (let k = 0; k < N; k++) {
      row.push(dir % 2 === 0 ? g.grid[line * N + k] : g.grid[k * N + line]);
    }
    if (dir >= 2) row.reverse();
    const [out, gd, m] = slide(row);
    if (dir >= 2) out.reverse();
    gained += gd;
    moved = moved || m;
    for (let k = 0; k < N; k++) {
      if (dir % 2 === 0) g.grid[line * N + k] = out[k];
      else g.grid[k * N + line] = out[k];
    }
  }
  if (!moved) return false;
  g.score += gained;
  spawn(g);
  if (g.grid.includes(2048)) g.won = true;
  g.over = !canMove(g.grid);
  return true;
}

export function canMove(grid) {
  if (grid.includes(0)) return true;
  for (let i = 0; i < N * N; i++) {
    const v = grid[i], x = i % N, y = (i / N) | 0;
    if (x + 1 < N && grid[i + 1] === v) return true;
    if (y + 1 < N && grid[i + N] === v) return true;
  }
  return false;
}
