<template>
  <div class="sudoku-board" @keydown="handleKeyDown" tabindex="0">
    <div
      v-for="(row, r) in displayBoard"
      :key="r"
      class="flex"
    >
      <template v-for="(val, c) in row" :key="c">
        <div
          class="cell-wrapper"
          :class="[
            (c + 1) % 3 === 0 && c !== 8
              ? 'border-r-2 border-r-gray-800 dark:border-r-gray-200'
              : 'border-r border-r-gray-300 dark:border-r-gray-600',
            (r + 1) % 3 === 0 && r !== 8
              ? 'border-b-2 border-b-gray-800 dark:border-b-gray-200'
              : 'border-b border-b-gray-300 dark:border-b-gray-600',
          ]"
        >
          <SudokuCell
            :value="val"
            :given="givenCells[r]?.[c] ?? false"
            :is-selected="selectedCell?.row === r && selectedCell?.col === c"
            :is-error="errorCells.has(`${r}-${c}`)"
            :is-same-number="false"
            :is-related="isRelatedCell(r, c)"
            :notes="notes[r][c]"
            :is-solving="isSolving"
            :is-animating="animatingCell?.row === r && animatingCell?.col === c"
            @click="selectCell(r, c)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Board, CellValue } from '~/utils/sudoku/types'

const props = defineProps<{
  userBoard: Board
  givenCells: boolean[][]
  selectedCell: { row: number; col: number } | null
  errorCells: Set<string>
  notes: Set<number>[][]
  isSolving: boolean
}>()

const emit = defineEmits<{
  'select-cell': [row: number, col: number]
  'input-number': [num: CellValue]
}>()

const animatingCell = ref<{ row: number; col: number } | null>(null)

const displayBoard = computed(() => props.userBoard)

function selectCell(r: number, c: number) {
  emit('select-cell', r, c)
}

function isSameNumber(val: number): boolean {
  if (val === 0 || !props.selectedCell) return false
  const selVal = props.userBoard[props.selectedCell.row]?.[props.selectedCell.col]
  return selVal !== 0 && selVal === val
}

function isRelatedCell(r: number, c: number): boolean {
  if (!props.selectedCell) return false
  const { row, col } = props.selectedCell
  if (r === row || c === col) return true
  const sameBox =
    Math.floor(r / 3) === Math.floor(row / 3) &&
    Math.floor(c / 3) === Math.floor(col / 3)
  return sameBox
}

function handleKeyDown(e: KeyboardEvent) {
  if (!props.selectedCell) return
  const { row, col } = props.selectedCell

  if (e.key >= '1' && e.key <= '9') {
    emit('input-number', parseInt(e.key) as CellValue)
    e.preventDefault()
  } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
    emit('input-number', 0)
    e.preventDefault()
  } else if (e.key === 'ArrowUp' && row > 0) {
    emit('select-cell', row - 1, col)
    e.preventDefault()
  } else if (e.key === 'ArrowDown' && row < 8) {
    emit('select-cell', row + 1, col)
    e.preventDefault()
  } else if (e.key === 'ArrowLeft' && col > 0) {
    emit('select-cell', row, col - 1)
    e.preventDefault()
  } else if (e.key === 'ArrowRight' && col < 8) {
    emit('select-cell', row, col + 1)
    e.preventDefault()
  }
}
</script>

<style scoped>
.sudoku-board {
  @apply outline-none border-2 border-gray-700 dark:border-gray-300 inline-block;
}

.cell-wrapper {
  @apply w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14;
}
</style>
