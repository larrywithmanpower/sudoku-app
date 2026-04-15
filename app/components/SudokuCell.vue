<template>
  <div
    class="sudoku-cell"
    :class="cellClasses"
    @click="$emit('click')"
  >
    <template v-if="value !== 0 && !hasNotes">
      <span class="cell-value" :class="{ 'text-blue-700 dark:text-blue-300': !given, 'font-bold': given }">
        {{ value }}
      </span>
    </template>
    <template v-else-if="hasNotes">
      <div class="notes-grid">
        <span
          v-for="n in 9"
          :key="n"
          class="note-num"
          :class="{ 'text-gray-500 dark:text-gray-400': notes.has(n), 'invisible': !notes.has(n) }"
        >{{ n }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  given: boolean
  isSelected: boolean
  isError: boolean
  isSameNumber: boolean
  isRelated: boolean
  notes: Set<number>
  isSolving: boolean
  isAnimating?: boolean
}>()

defineEmits<{ click: [] }>()

const hasNotes = computed(() => props.value === 0 && props.notes.size > 0)

const cellClasses = computed(() => ({
  'cell-given': props.given,
  'cell-selected': props.isSelected,
  'cell-error': props.isError && !props.given,
  'cell-same-number': props.isSameNumber && !props.isSelected && !props.isError,
  'cell-related': props.isRelated && !props.isSelected && !props.isSameNumber,
  'cell-animating': props.isAnimating,
  'cursor-pointer': !props.isSolving
}))
</script>

<style scoped>
.sudoku-cell {
  @apply relative flex items-center justify-center
    w-full aspect-square
    text-lg sm:text-xl md:text-2xl
    select-none transition-colors duration-100
    bg-white dark:bg-gray-800;
}

.cell-value {
  @apply leading-none;
}

.cell-given {
  @apply text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-700;
}

.cell-selected {
  @apply bg-blue-200 dark:bg-blue-800;
}

.cell-error {
  @apply text-red-500 bg-red-50 dark:bg-red-900/40;
}

.cell-same-number {
  @apply bg-blue-100 dark:bg-blue-900/50;
}

.cell-related {
  @apply bg-gray-100 dark:bg-gray-700/70;
}

.cell-animating {
  @apply bg-yellow-100 dark:bg-yellow-900/40;
}

/* 筆記 3x3 格 */
.notes-grid {
  @apply grid grid-cols-3 grid-rows-3 w-full h-full p-0.5;
}

.note-num {
  @apply flex items-center justify-center text-[0.45rem] sm:text-[0.55rem] text-gray-500 dark:text-gray-400 leading-none;
}
</style>
