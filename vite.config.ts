/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { readFileSync, writeFileSync } from 'node:fs';

// Fix concurrent range request : https://github.com/ionic-team/capacitor/pull/8190
function capacitorBugFix() {
  return {
    name: 'range-request-bugfix',

    buildEnd(error) {
      if (error) return;
      // no build errors disable range requests
      const webViewLocalServerFile = path.resolve(__dirname, 'node_modules/@capacitor/android/capacitor/src/main/java/com/getcapacitor/WebViewLocalServer.java');
      const webViewLocalServerContent = readFileSync(webViewLocalServerFile, 'utf-8');
      const SEARCH = 'return responseHeaders;';
      const REPLACE = 'return new HashMap<>(responseHeaders); // Return a copy of response header to fix concurrent request issue see https://github.com/ionic-team/capacitor/pull/8190';
      // check and make sure it's replaced or fail the build
      if (webViewLocalServerContent.indexOf(REPLACE) < 0 && webViewLocalServerContent.indexOf(SEARCH) < 0) {
        throw new Error("Cannot find BUG FIX in file: " + webViewLocalServerFile)
      }
      const webViewLocalServerContentEdited = webViewLocalServerContent.replace(SEARCH, REPLACE);
      writeFileSync(webViewLocalServerFile, webViewLocalServerContentEdited, 'utf-8');
      console.log("\n[BUG FIX] fix concurrent range requests issue in " + webViewLocalServerFile + "\n");
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy(),
    capacitorBugFix()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['src/**'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
        additionalData: `
          @use "@/theme/global.scss";
        `
      }
    }
  }
})
