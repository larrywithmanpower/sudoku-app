<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-4">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">數獨</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Sudoku PWA</p>
      </header>

      <!-- 難度選擇 -->
      <div class="mb-4">
        <DifficultySelector :current="difficulty" @change="onDifficultyChange" />
      </div>

      <!-- 計時器 + 最佳紀錄 -->
      <div class="flex justify-between items-center mb-3 px-1">
        <div class="text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400">時間</p>
          <p class="text-2xl font-mono font-semibold text-gray-800 dark:text-white">
            {{ timerDisplay }}
          </p>
        </div>
        <div class="text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400">進度</p>
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {{ filledCount }}/81
          </p>
        </div>
        <div class="text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400">最佳 ({{ diffLabel }})</p>
          <p class="text-lg font-mono font-semibold text-blue-600 dark:text-blue-400">
            {{ formatTime(bestRecords[difficulty]) }}
          </p>
        </div>
      </div>

      <!-- 棋盤區域 -->
      <div class="flex justify-center mb-4">
        <div class="relative">
          <!-- Loading overlay -->
          <div
            v-if="isLoading"
            class="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-10 rounded-lg"
          >
            <div class="flex flex-col items-center gap-2">
              <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-sm text-gray-600 dark:text-gray-300">產生謎題中...</p>
            </div>
          </div>

          <SudokuBoard
            v-if="userBoard"
            :user-board="userBoard"
            :given-cells="givenCells"
            :selected-cell="selectedCell"
            :error-cells="errorCells"
            :notes="notes"
            :is-solving="isSolving"
            @select-cell="selectCell"
            @input-number="inputNumber"
          />
          <div
            v-else
            class="w-full aspect-square max-w-[378px] bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"
          >
            <p class="text-gray-500">載入中...</p>
          </div>
        </div>
      </div>

      <!-- 完成提示 -->
      <Transition name="fade">
        <div v-if="isComplete" class="mb-4 text-center">
          <div class="inline-block bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 rounded-xl px-6 py-3">
            <p class="text-green-700 dark:text-green-300 font-bold text-lg">🎉 恭喜完成！</p>
            <p class="text-green-600 dark:text-green-400 text-sm mt-1">用時 {{ timerDisplay }}</p>
          </div>
        </div>
      </Transition>

      <!-- 遊戲控制按鈕 -->
      <div class="mb-4">
        <GameControls
          :is-loading="isLoading"
          :is-complete="isComplete"
          :is-solving="isSolving"
          :note-mode="noteMode"
          @new-game="startNewGame"
          @hint="getHint"
          @auto-solve="handleAutoSolve"
          @stop-solve="stopSolving"
          @toggle-note="noteMode = !noteMode"
        />
      </div>

      <!-- 手機數字鍵盤 -->
      <div class="block">
        <NumberKeypad
          :selected-value="selectedCellValue"
          @input="inputNumber"
        />
      </div>

      <!-- 最佳紀錄表 -->
      <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">最佳紀錄</h2>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div v-for="d in ['easy', 'medium', 'hard']" :key="d">
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ diffLabels[d as Difficulty] }}</p>
            <p class="font-mono font-semibold text-blue-600 dark:text-blue-400">
              {{ formatTime(bestRecords[d as Difficulty]) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- PWA 安裝提示 -->
    <InstallPrompt />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import type { Difficulty, CellValue } from '~/utils/sudoku/types'
import { useGameState } from '~/composables/useGameState'
import { useTimer } from '~/composables/useTimer'

const {
  userBoard,
  givenCells,
  selectedCell,
  errorCells,
  notes,
  isLoading,
  isComplete,
  isSolving,
  noteMode,
  filledCount,
  difficulty,
  bestRecords,
  selectCell,
  inputNumber,
  getHint,
  autoSolve,
  stopSolving,
  newGame,
  recordBestTime,
  formatTime
} = useGameState()

const { display: timerDisplay, start: startTimer, pause: pauseTimer, reset: resetTimer, seconds: timerSeconds } = useTimer()

const selectedCellValue = computed(() => {
  if (!selectedCell.value || !userBoard.value) return 0
  return userBoard.value[selectedCell.value.row]?.[selectedCell.value.col] ?? 0
})

const diffLabels: Record<Difficulty, string> = {
  easy: '簡單',
  medium: '中等',
  hard: '困難'
}

const diffLabel = computed(() => diffLabels[difficulty.value])

async function startNewGame() {
  resetTimer()
  await newGame(difficulty.value)
  startTimer()
}

function onDifficultyChange(d: Difficulty) {
  newGame(d).then(() => {
    resetTimer()
    startTimer()
  })
}

async function handleAutoSolve() {
  pauseTimer()
  await autoSolve()
}

// 完成時記錄最佳時間並暫停計時
watch(isComplete, (val) => {
  if (val) {
    pauseTimer()
    recordBestTime(timerSeconds.value)
  }
})

// 初始啟動
onMounted(async () => {
  await newGame('easy')
  startTimer()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
