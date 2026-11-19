import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// 直接读取 index.html，把 `// <logic>` 标记块抠出来在 Node 里跑。
// 这样既保住「单文件、双击即玩」，又不用为了测试引入构建步骤。
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const block = html.match(/\/\/ <logic>([\s\S]*?)\/\/ <\/logic>/);
assert.ok(block, 'index.html 里找不到 // <logic> ... // </logic> 标记块');

const { N, slide, applyMove, canMove, spawnIndex, spawnValue } =
  new Function(`${block[1]}; return { N, slide, applyMove, canMove, spawnIndex, spawnValue };`)();

const empty = () => new Array(N * N).fill(0);

test('棋盘边长为 4', () => {
  assert.equal(N, 4);
});

test('slide 按「先靠拢、再合并、合并后不再二次合并」处理', () => {
  assert.deepEqual(slide([2, 2, 0, 0]), [[4, 0, 0, 0], 4, true]);
  assert.deepEqual(slide([2, 2, 2, 0]), [[4, 2, 0, 0], 4, true]);
  assert.deepEqual(slide([2, 2, 2, 2]), [[4, 4, 0, 0], 8, true]);
  assert.deepEqual(slide([4, 2, 2, 0]), [[4, 4, 0, 0], 4, true]);
  assert.deepEqual(slide([2, 2, 4, 0]), [[4, 4, 0, 0], 4, true]);
});

test('slide 识别无效行', () => {
  assert.deepEqual(slide([2, 0, 0, 0]), [[2, 0, 0, 0], 0, false]);
  assert.deepEqual(slide([0, 0, 0, 0]), [[0, 0, 0, 0], 0, false]);
});

test('applyMove 左右方向：同一行的两个 2 合并', () => {
  const g = empty();
  g[0] = 2; g[1] = 2; // 首行前两格

  const left = applyMove(g, 0);
  assert.deepEqual(left.grid.slice(0, 4), [4, 0, 0, 0]);
  assert.equal(left.gained, 4);
  assert.equal(left.moved, true);

  const right = applyMove(g, 2);
  assert.deepEqual(right.grid.slice(0, 4), [0, 0, 0, 4]);
  assert.equal(right.gained, 4);
});

test('applyMove 上下方向：同一列的两个 2 合并', () => {
  const g = empty();
  g[0] = 2; g[4] = 2; // 首列前两格

  const up = applyMove(g, 1);
  assert.deepEqual([up.grid[0], up.grid[4], up.grid[8], up.grid[12]], [4, 0, 0, 0]);

  const down = applyMove(g, 3);
  assert.deepEqual([down.grid[0], down.grid[4], down.grid[8], down.grid[12]], [0, 0, 0, 4]);
});

test('applyMove 是纯函数，不改动入参', () => {
  const g = empty();
  g[0] = 2; g[1] = 2;
  const snapshot = g.slice();
  applyMove(g, 0);
  assert.deepEqual(g, snapshot);
});

test('applyMove 对贴边的盘面报告未移动', () => {
  const g = empty();
  g[0] = 2; g[4] = 4; g[8] = 8; g[12] = 16;
  const res = applyMove(g, 0);
  assert.equal(res.moved, false);
  assert.deepEqual(res.grid, g);
});

test('canMove：有空格、或有相邻同值时可动', () => {
  const full = [2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2];
  assert.equal(canMove(full), false);

  const withHole = full.slice();
  withHole[7] = 0;
  assert.equal(canMove(withHole), true);

  const withPair = [2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 2, 4];
  assert.equal(canMove(withPair), true);

  assert.equal(canMove(empty()), true);
});

test('spawnIndex 只在空格里取，满盘返回 -1', () => {
  const g = empty();
  g[0] = 2; g[5] = 4; g[15] = 8;

  assert.equal(spawnIndex(g, () => 0), 1);        // 第一个空格
  assert.equal(spawnIndex(g, () => 0.999), 14);   // 最后一个空格

  const idx = spawnIndex(g, () => 0.5);
  assert.equal(g[idx], 0);
  assert.ok(idx >= 0 && idx < N * N);

  const full = new Array(16).fill(2);
  assert.equal(spawnIndex(full, () => 0), -1);
});

test('spawnValue 保持 90% / 10% 的 2 与 4 分布', () => {
  assert.equal(spawnValue(() => 0), 2);
  assert.equal(spawnValue(() => 0.899), 2);
  assert.equal(spawnValue(() => 0.9), 4);
  assert.equal(spawnValue(() => 0.999), 4);
});
