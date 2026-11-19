# game-2048

经典 2048 小游戏。原生 JS 模块化实现，Vite 构建。

## 玩法

合并相同数字的方块，凑出 2048。支持方向键、WASD 和触屏滑动。

## 运行

```bash
npm install
npm run dev       # http://localhost:5173

# 或不用 Vite，任意静态服务器都行（ES module 需要 http 协议）
python3 -m http.server 8000   # http://localhost:8000
```

## 结构

```
index.html        页面壳 + 样式
src/main.js       装配：输入 -> 移动 -> 渲染 -> 持久化
src/game.js       核心逻辑：矩阵状态、滑动合并、生成、胜负判定（纯逻辑无 DOM）
src/renderer.js   Canvas 渲染层
src/storage.js    localStorage 数据层：最高分、背包、技能冷却
```

拆开是为了后面加 roguelike 词条：背包和冷却的数据层已经封装好，
逻辑层不碰 DOM，渲染层不碰状态。

## Roadmap

- 肉鸽词条系统：技能触发 buff、回合冷却
- 背包 UI 面板
- 词条效果挂在 move 前后的钩子

## License

MIT
