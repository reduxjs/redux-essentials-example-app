import fs from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as esbuild from 'esbuild'

// This plugin allows us to use JSX in .js files
const rollupPlugin = (matchers) => ({
  name: 'js-in-jsx',
  load(id) {
    if (matchers.some((matcher) => matcher.test(id))) {
      const file = fs.readFileSync(id, { encoding: 'utf-8' })
      return esbuild.transformSync(file, { loader: 'jsx' })
    }
  },
})

// The original example app code used `.js` for all component files,
// which worked with Create React App.
// Now that the template uses Vite, we mimic that behavior.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [rollupPlugin([/\/src\/.*\.js$/])],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /\/src\/.*\.js$/,
    exclude: [],
  },
})
