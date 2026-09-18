import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve('./src') },
      // msw marks `msw/native` as unavailable in browsers via its exports map.
      // It only uses fetch/XHR interceptors, which work fine in a browser,
      // and it is the only msw entry that works inside StackBlitz WebContainers.
      {
        find: /^msw\/native$/,
        replacement: path.resolve('./node_modules/msw/lib/native/index.mjs'),
      },
    ],
  },
  server: {
    open: false,
  },
})
