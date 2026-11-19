// renderer.js — Canvas 渲染层。逻辑层只管数据，这里只管画。
// 换皮、加词条特效都只改这个文件。

import { N } from './game.js';

const COLORS = {
  2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
  32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
  512: '#edc850', 1024: '#edc53f', 2048: '#edc22e',
};
const EMPTY = '#cdc1b4';
const BOARD_BG = '#bbada0';

export class Renderer {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.size = canvas.width;
    this.gap = 10;
    this.cell = (this.size - this.gap * (N + 1)) / N;
  }

  draw(grid) {
    const { ctx, cell, gap } = this;
    ctx.fillStyle = BOARD_BG;
    ctx.fillRect(0, 0, this.size, this.size);

    for (let i = 0; i < N * N; i++) {
      const x = i % N, y = (i / N) | 0;
      const px = gap + x * (cell + gap);
      const py = gap + y * (cell + gap);
      const v = grid[i];

      ctx.fillStyle = v ? (COLORS[v] || '#3c3a32') : EMPTY;
      ctx.beginPath();
      ctx.roundRect(px, py, cell, cell, 6);
      ctx.fill();

      if (v) {
        ctx.fillStyle = v > 4 ? '#f9f6f2' : '#776e65';
        ctx.font = `bold ${cell * 0.42}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(v), px + cell / 2, py + cell / 2);
      }
    }
  }
}
