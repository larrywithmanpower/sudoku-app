<template>
  <div class="flex gap-2 justify-center flex-wrap">
    <button
      v-for="d in difficulties"
      :key="d.value"
      class="diff-btn"
      :class="{ 'diff-btn-active': current === d.value }"
      @click="$emit('change', d.value)"
    >
      {{ d.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Difficulty } from '~/utils/sudoku/types'

defineProps<{
  current: Difficulty
}>()

defineEmits<{
  change: [d: Difficulty]
}>()

const difficulties = [
  { value: 'easy' as Difficulty, label: '簡單' },
  { value: 'medium' as Difficulty, label: '中等' },
  { value: 'hard' as Difficulty, label: '困難' }
]
</script>

<style scoped>
.diff-btn {
  @apply px-5 py-2 rounded-full text-sm font-medium
    border border-gray-300 dark:border-gray-500
    bg-white dark:bg-gray-700
    text-gray-700 dark:text-gray-200
    transition-colors duration-150
    hover:bg-gray-100 dark:hover:bg-gray-600;
}

.diff-btn-active {
  @apply bg-blue-600 border-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500;
}
</style>
