import { ref, computed, onUnmounted } from 'vue'

export function useTimer() {
  const seconds = ref(0)
  const running = ref(false)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const display = computed(() => {
    const m = Math.floor(seconds.value / 60).toString().padStart(2, '0')
    const s = (seconds.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  })

  function start() {
    if (running.value) return
    running.value = true
    intervalId = setInterval(() => { seconds.value++ }, 1000)
  }

  function pause() {
    if (!running.value) return
    running.value = false
    if (intervalId) clearInterval(intervalId)
    intervalId = null
  }

  function reset() {
    pause()
    seconds.value = 0
  }

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return { seconds, display, running, start, pause, reset }
}
