/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['src-angular/**'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/theme/_colors.scss";
          @use "@/theme/_fonts.scss";
          @use "@/theme/_utils.scss";
          @use "@/theme/global.scss";
        `
      }
    }
  }
})
