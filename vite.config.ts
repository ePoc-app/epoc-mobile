import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-') && !tag.startsWith('ion-')
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8100,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    minify: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'ionic': ['@ionic/vue', '@ionic/vue-router'],
          'vue': ['vue', 'vue-router', 'vue-i18n'],
          'pinia': ['pinia'],
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      '@ionic/vue',
      '@ionic/vue-router',
      'vue',
      'vue-router',
      'vue-i18n',
      'pinia',
      'axios',
      'swiper/element/bundle'
    ]
  }
});
