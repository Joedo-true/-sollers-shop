import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
//
// `viteSingleFile` inlines all JS and CSS into a single dist/index.html, and
// `base: './'` makes every asset path relative. Together this lets the built
// page be opened straight from the filesystem (double-click index.html) with
// no dev server and no static host — exactly what a "no server" run needs.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
})
