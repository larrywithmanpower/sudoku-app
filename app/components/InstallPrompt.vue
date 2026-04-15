<template>
  <!-- iOS 引導提示 -->
  <Transition name="slide-up">
    <div
      v-if="showIOSPrompt"
      class="install-prompt"
    >
      <div class="flex items-start gap-3">
        <div class="flex-1">
          <p class="font-semibold text-sm">安裝到主畫面</p>
          <p class="text-xs text-gray-600 dark:text-gray-300 mt-1">
            點擊下方工具列的
            <span class="inline-flex items-center mx-1">
              <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </span>
            ，再選「加入主畫面」
          </p>
        </div>
        <button @click="dismissIOSPrompt" class="text-gray-400 hover:text-gray-600 p-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>

  <!-- Android Chrome 安裝 Banner（原生 beforeinstallprompt 處理） -->
  <Transition name="slide-up">
    <div v-if="showAndroidPrompt" class="install-prompt">
      <div class="flex items-center gap-3">
        <div class="flex-1">
          <p class="font-semibold text-sm">安裝數獨 App</p>
          <p class="text-xs text-gray-600 dark:text-gray-300">安裝後可離線使用，更快速啟動</p>
        </div>
        <button
          class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          @click="triggerInstall"
        >
          安裝
        </button>
        <button @click="showAndroidPrompt = false" class="text-gray-400 hover:text-gray-600 p-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showIOSPrompt = ref(false)
const showAndroidPrompt = ref(false)
let deferredPrompt: any = null

function dismissIOSPrompt() {
  showIOSPrompt.value = false
  if (import.meta.client) {
    sessionStorage.setItem('ios-prompt-dismissed', '1')
  }
}

async function triggerInstall() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  await deferredPrompt.userChoice
  deferredPrompt = null
  showAndroidPrompt.value = false
}

onMounted(() => {
  if (!import.meta.client) return

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
  const dismissed = sessionStorage.getItem('ios-prompt-dismissed')

  if (isIOS && !isInStandaloneMode && !dismissed) {
    setTimeout(() => { showIOSPrompt.value = true }, 3000)
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showAndroidPrompt.value = true
  })
})
</script>

<style scoped>
.install-prompt {
  @apply fixed bottom-4 left-4 right-4 max-w-sm mx-auto
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-600
    rounded-xl shadow-lg p-4 z-50;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
