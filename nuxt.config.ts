// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt'
  ],

  // PWA 設定
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '數獨 Sudoku',
      short_name: '數獨',
      description: '離線數獨謎題 PWA，支援三種難度、提示與自動解題',
      theme_color: '#1e40af',
      background_color: '#f9fafb',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'zh-TW',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      type: 'module'
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600
    }
  },

  // 靜態生成設定
  nitro: {
    preset: 'static'
  },

  app: {
    head: {
      title: '數獨 Sudoku',
      meta: [
        { name: 'description', content: '離線數獨謎題 PWA，支援三種難度' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'theme-color', content: '#1e40af' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: '數獨' }
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  }
})
