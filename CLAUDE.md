# 數獨 App

## 注意事項

- **Web Worker 與 TypeScript 版生成器需保持邏輯同步**：`generator.ts` 用於測試，`sudoku.worker.js` 用於瀏覽器實際執行
- `useGameState` 為 function-scoped（非 singleton），每次呼叫回傳獨立狀態
- SSR 相關程式碼須用 `import.meta.client` 判斷（避免 `localStorage` 在 SSR 執行）
- 測試只覆蓋 `app/utils/sudoku/` 純邏輯，不測 Vue 元件
