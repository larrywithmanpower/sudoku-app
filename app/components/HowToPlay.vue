<template>
  <!-- 觸發按鈕 -->
  <button
    class="help-btn"
    aria-label="玩法說明"
    @click="open = true"
  >
    ?
  </button>

  <!-- Modal 遮罩 -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
        @click.self="open = false"
      >
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-black/50" @click="open = false" />

        <!-- 內容卡片 -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 overflow-y-auto max-h-[85vh]">
          <!-- 標題列 -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-800 dark:text-white">玩法說明</h2>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
              @click="open = false"
            >
              ×
            </button>
          </div>

          <!-- 遊戲目標 -->
          <section class="mb-4">
            <h3 class="section-title">遊戲目標</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              在 9×9 的棋盤中填入數字 1–9，使每一<strong>行</strong>、每一<strong>列</strong>，以及每個 <strong>3×3 宮格</strong>內的數字都不重複。
            </p>
          </section>

          <!-- 操作方式 -->
          <section class="mb-4">
            <h3 class="section-title">操作方式</h3>
            <ol class="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
              <li class="flex gap-2">
                <span class="step-num">1</span>
                點選空白格子（選中後會高亮顯示）
              </li>
              <li class="flex gap-2">
                <span class="step-num">2</span>
                點下方數字鍵盤輸入數字
              </li>
              <li class="flex gap-2">
                <span class="step-num">3</span>
                填錯的格子會以<span class="text-red-500 font-semibold mx-0.5">紅色</span>標示
              </li>
              <li class="flex gap-2">
                <span class="step-num">4</span>
                按「清除」可刪除已填的數字
              </li>
            </ol>
          </section>

          <!-- 功能說明 -->
          <section class="mb-4">
            <h3 class="section-title">按鈕功能</h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li class="flex gap-2 items-start">
                <span class="tag tag-blue">新遊戲</span>
                重新產生一局新的謎題
              </li>
              <li class="flex gap-2 items-start">
                <span class="tag tag-gray">提示</span>
                自動填入目前選中格子（或第一個空格）的正確答案
              </li>
              <li class="flex gap-2 items-start">
                <span class="tag tag-gray">筆記</span>
                開啟後可在格子中記下候選數字（小字顯示），不影響正式答案
              </li>
              <li class="flex gap-2 items-start">
                <span class="tag tag-gray">自動解題</span>
                以動畫逐步展示解題過程
              </li>
            </ul>
          </section>

          <!-- 難度說明 -->
          <section>
            <h3 class="section-title">難度差異</h3>
            <div class="grid grid-cols-3 gap-2 text-center text-sm">
              <div class="difficulty-card">
                <p class="font-semibold text-green-600 dark:text-green-400">簡單</p>
                <p class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">35 個空格</p>
              </div>
              <div class="difficulty-card">
                <p class="font-semibold text-yellow-600 dark:text-yellow-400">中等</p>
                <p class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">45 個空格</p>
              </div>
              <div class="difficulty-card">
                <p class="font-semibold text-red-600 dark:text-red-400">困難</p>
                <p class="text-gray-500 dark:text-gray-400 text-xs mt-0.5">52 個空格</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<style scoped>
.help-btn {
  @apply w-7 h-7 rounded-full border-2 border-gray-400 dark:border-gray-500
    text-gray-500 dark:text-gray-400 text-sm font-bold
    hover:border-blue-500 hover:text-blue-500
    transition-colors duration-150 flex items-center justify-center;
}

.section-title {
  @apply text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2;
}

.step-num {
  @apply flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900
    text-blue-600 dark:text-blue-400 text-xs font-bold
    flex items-center justify-center;
}

.tag {
  @apply flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium;
}
.tag-blue {
  @apply bg-blue-600 text-white;
}
.tag-gray {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500;
}

.difficulty-card {
  @apply bg-gray-50 dark:bg-gray-700/50 rounded-lg py-2 px-1;
}

/* Modal 動畫 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
