<template>
  <!-- 觸發按鈕 -->
  <button class="help-btn" aria-label="玩法說明" @click="open = true">?</button>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center px-4" @click.self="open = false">
        <div class="absolute inset-0 bg-black/50" @click="open = false" />

        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-y-auto max-h-[88vh]">
          <!-- 標題列 -->
          <div class="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-700">
            <h2 class="text-base font-bold text-gray-800 dark:text-white">怎麼玩數獨？</h2>
            <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none" @click="open = false">×</button>
          </div>

          <div class="px-5 py-4 space-y-5">

            <!-- 目標 -->
            <section>
              <h3 class="section-title">目標</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                把空白格子全部填滿，讓每一<strong>行</strong>、每一<strong>列</strong>、每個 <strong>3×3 宮格</strong>裡都有 1 到 9，且每個數字只出現一次。
              </p>
            </section>

            <!-- 規則圖解 -->
            <section>
              <h3 class="section-title">規則圖解</h3>
              <div class="space-y-3">

                <!-- 行規則 -->
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">每一<strong>橫行</strong>必須有 1–9，不能重複</p>
                  <div class="flex gap-0.5">
                    <div v-for="n in [5,3,4,6,7,8,9,1,2]" :key="n"
                      class="w-7 h-7 flex items-center justify-center text-xs font-bold rounded
                        bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                      {{ n }}
                    </div>
                  </div>
                </div>

                <!-- 列規則 -->
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">每一<strong>直行</strong>也必須有 1–9，不能重複</p>
                  <div class="flex gap-0.5 items-end">
                    <div v-for="n in [5,6,1,8,4,7,9,2,3]" :key="n"
                      class="w-7 h-7 flex items-center justify-center text-xs font-bold rounded
                        bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700">
                      {{ n }}
                    </div>
                  </div>
                </div>

                <!-- 宮格規則 -->
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">每個 <strong>3×3 宮格</strong>也必須有 1–9，不能重複</p>
                  <div class="grid grid-cols-3 gap-0.5 w-fit">
                    <div v-for="n in [5,3,4,6,7,2,1,9,8]" :key="n"
                      class="w-7 h-7 flex items-center justify-center text-xs font-bold rounded
                        bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                      {{ n }}
                    </div>
                  </div>
                </div>

              </div>
            </section>

            <!-- 如何推理 -->
            <section>
              <h3 class="section-title">如何推理出答案？</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                觀察一個空格，找出它所在的<strong>橫行、直行、宮格</strong>裡已經有哪些數字，剩下沒出現的就是候選答案。
              </p>
              <!-- 範例 -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">範例：推理 <strong class="text-gray-700 dark:text-gray-200">？</strong> 的答案</p>
                <div class="grid grid-cols-3 gap-0.5 w-fit mb-2">
                  <div v-for="(item, i) in exampleBox" :key="i"
                    :class="[
                      'w-8 h-8 flex items-center justify-center text-xs font-bold rounded border',
                      item === '？'
                        ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-400'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                    ]">
                    {{ item }}
                  </div>
                </div>
                <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                  <li>• 宮格裡已有：1、2、4、5、6、7、8、9</li>
                  <li>• 唯一缺少的是 <strong class="text-yellow-600 dark:text-yellow-400">3</strong>，所以答案是 3</li>
                </ul>
              </div>
            </section>

            <!-- 操作 -->
            <section>
              <h3 class="section-title">操作方式</h3>
              <ol class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li class="flex gap-2 items-start">
                  <span class="step-num">1</span>
                  點選想填的<strong>空白格子</strong>
                </li>
                <li class="flex gap-2 items-start">
                  <span class="step-num">2</span>
                  點下方<strong>數字鍵盤</strong>輸入數字
                </li>
                <li class="flex gap-2 items-start">
                  <span class="step-num">3</span>
                  填錯會出現<span class="text-red-500 font-semibold mx-0.5">紅色</span>提醒
                </li>
                <li class="flex gap-2 items-start">
                  <span class="step-num">4</span>
                  填完所有空格即完成！
                </li>
              </ol>
            </section>

            <!-- 輔助功能 -->
            <section>
              <h3 class="section-title">卡關了？</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li class="flex gap-2 items-start">
                  <span class="tag tag-gray">提示</span>
                  自動填入一個正確答案
                </li>
                <li class="flex gap-2 items-start">
                  <span class="tag tag-gray">筆記</span>
                  開啟後可在格子裡記下「可能的數字」，小字顯示，不算正式答案
                </li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)

const exampleBox = ['1', '2', '4', '5', '？', '6', '7', '8', '9']
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
.tag-gray {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
