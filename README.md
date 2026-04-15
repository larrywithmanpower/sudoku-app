# 數獨 Sudoku PWA

離線數獨謎題 PWA，支援三種難度、提示、筆記模式與自動解題動畫。

**線上體驗：** https://larrywithmanpower.github.io/sudoku-app/

## 功能

- 三種難度：簡單 / 中等 / 困難
- 提示功能：自動填入正確答案
- 筆記模式：在格子中記下候選數字
- 自動解題：動畫逐步展示解題過程
- 最佳紀錄：各難度最快完成時間（儲存於 localStorage）
- PWA 支援：可安裝至桌面，離線使用

## 開發

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm generate   # 靜態建置
pnpm test       # 執行測試
```

## 技術棧

- Nuxt 4 + Vue 3 + TypeScript
- Tailwind CSS
- Vite PWA（Service Worker + 離線快取）
- Vitest
