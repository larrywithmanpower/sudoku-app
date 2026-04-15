<template>
  <div class="number-keypad">
    <button
      v-for="n in 9"
      :key="n"
      class="keypad-btn"
      :class="{ 'keypad-btn-active': isActive(n) }"
      @click="$emit('input', n)"
    >
      {{ n }}
    </button>
    <button
      class="keypad-btn col-span-3 text-sm"
      @click="$emit('input', 0)"
    >
      清除
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedValue?: number
}>()

defineEmits<{
  input: [num: number]
}>()

function isActive(n: number): boolean {
  return false // 可以加上「同數字高亮」邏輯
}
</script>

<style scoped>
.number-keypad {
  @apply grid grid-cols-3 gap-2 w-full max-w-xs mx-auto;
}

.keypad-btn {
  @apply flex items-center justify-center
    h-12 sm:h-14
    rounded-lg text-xl font-semibold
    bg-white dark:bg-gray-700
    border border-gray-300 dark:border-gray-500
    text-gray-800 dark:text-gray-100
    shadow-sm
    active:scale-95 active:bg-blue-100 dark:active:bg-blue-900
    transition-all duration-100
    select-none cursor-pointer;
}

.keypad-btn-active {
  @apply bg-blue-100 dark:bg-blue-900 border-blue-400;
}
</style>
