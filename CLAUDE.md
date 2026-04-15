# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用指令

```bash
pnpm dev          # 開發伺服器，http://localhost:3000
pnpm build        # 生產建置（靜態輸出）
pnpm generate     # 靜態生成
pnpm preview      # 預覽生產建置

pnpm test         # 執行全部測試（單次）
pnpm test:watch   # 監聽模式測試

# 執行單一測試（用 vitest -t 過濾）
pnpm vitest run -t "測試名稱關鍵字"
```

## 技術棧

- **Nuxt 4** + **Vue 3** + **TypeScript**
- **Tailwind CSS v3** 樣式
- **@vite-pwa/nuxt** PWA 支援（Service Worker + 離線快取）
- **Vitest** 單元測試
- 部署為靜態站台（`nitro: { preset: 'static' }`）

## 架構總覽

### 核心資料流

```
Web Worker (puzzle generation)
  └─ sudoku.worker.js (public/workers/)
       └─ postMessage → useGameState.ts
            ├─ puzzle / solution / userBoard (Board = CellValue[][])
            ├─ givenCells (固定格子，不可編輯)
            ├─ notes (筆記模式，Set<number>[][])
            └─ errorCells (computed，與 solution 比對)
```

### 重要分層

- `app/utils/sudoku/` — 純邏輯，無 Vue 依賴
  - `types.ts` — `Board`, `CellValue`, `Difficulty`, `GamePuzzle`, `BestRecord`
  - `generator.ts` — 謎題生成（TS 版，供測試用）
  - `solver.ts` — 解題器，`solvePuzzleAnimated` 為 async generator（逐步動畫）
  - `validator.ts` — 驗證、`findErrors`、`cloneBoard`

- `app/composables/useGameState.ts` — 唯一的全域遊戲狀態，含 Web Worker 呼叫、localStorage 最佳紀錄
- `app/composables/useTimer.ts` — 計時器邏輯

- `public/workers/sudoku.worker.js` — 純 JS（不走 TypeScript build），供瀏覽器 `new Worker()` 直接載入，邏輯與 `generator.ts` 平行維護（兩份需同步）

### 頁面 / 元件

只有一個頁面 `app/pages/index.vue`，組合：
- `DifficultySelector` — 難度切換
- `SudokuBoard` → `SudokuCell` — 棋盤渲染
- `GameControls` — 新遊戲 / 提示 / 自動解題 / 筆記模式
- `NumberKeypad` — 行動裝置輸入鍵盤
- `InstallPrompt` — PWA 安裝提示

### 注意事項

- **Web Worker 與 TypeScript 版生成器需保持邏輯同步**：`generator.ts` 用於測試，`sudoku.worker.js` 用於瀏覽器實際執行
- `useGameState` 為 function-scoped（非 singleton），每次呼叫回傳獨立狀態
- SSR 相關程式碼須用 `import.meta.client` 判斷（避免 `localStorage` 在 SSR 執行）
- 測試只覆蓋 `app/utils/sudoku/` 純邏輯，不測 Vue 元件
