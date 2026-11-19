# game-2048

经典 2048 小游戏，单文件实现——零依赖、零构建，`index.html` 双击就能玩。

## 玩法

合并相同数字的方块，凑出 2048。支持方向键、WASD 和触屏滑动。

## 运行

```bash
# 直接打开
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows

# 或起个本地服务
python3 -m http.server 8000   # 然后访问 http://localhost:8000
```

## 实现

- 单个 `index.html`：HTML + CSS + 原生 JS，无任何依赖
- 4×4 网格，每次有效移动后按 90%/10% 概率生成 2/4
- 得分 + 最高分（localStorage 持久化）
- 凑出 2048 后可继续刷分，无路可走时判负

## 目录

```
index.html    # 全部实现：样式 + 游戏逻辑 + 输入处理
LICENSE       # MIT
```

## License

MIT
