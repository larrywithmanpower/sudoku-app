<template>
  <div class="flex flex-wrap gap-2 justify-center">
    <button
      class="ctrl-btn ctrl-btn-primary"
      :disabled="isLoading"
      @click="$emit('new-game')"
    >
      <span v-if="isLoading">產生中...</span>
      <span v-else>新遊戲</span>
    </button>

    <button
      class="ctrl-btn"
      :disabled="isLoading || isComplete || isSolving"
      @click="$emit('hint')"
    >
      提示
    </button>

    <button
      class="ctrl-btn"
      :disabled="isLoading || isComplete"
      @click="handleSolve"
    >
      <span v-if="isSolving">停止</span>
      <span v-else>自動解題</span>
    </button>

    <button
      class="ctrl-btn"
      :class="{ 'ctrl-btn-active': noteMode }"
      :disabled="isLoading || isComplete || isSolving"
      @click="$emit('toggle-note')"
    >
      <span>筆記 {{ noteMode ? '開' : '關' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isLoading: boolean
  isComplete: boolean
  isSolving: boolean
  noteMode: boolean
}>()

const emit = defineEmits<{
  'new-game': []
  hint: []
  'auto-solve': []
  'stop-solve': []
  'toggle-note': []
}>()

function handleSolve() {
  if (props.isSolving) {
    emit('stop-solve')
  } else {
    emit('auto-solve')
  }
}
</script>

<style scoped>
.ctrl-btn {
  @apply px-4 py-2 rounded-lg text-sm font-medium
    border border-gray-300 dark:border-gray-500
    bg-white dark:bg-gray-700
    text-gray-700 dark:text-gray-200
    transition-colors duration-150
    hover:bg-gray-100 dark:hover:bg-gray-600
    disabled:opacity-50 disabled:cursor-not-allowed;
}

.ctrl-btn-primary {
  @apply bg-blue-600 border-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500;
}

.ctrl-btn-active {
  @apply bg-amber-100 dark:bg-amber-900/50 border-amber-400 text-amber-700 dark:text-amber-300;
}
</style>
