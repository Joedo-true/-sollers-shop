import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
//
// Two build flavours share this config, selected by mode:
//
// • default (`npm run build`)      → single self-contained dist/index.html.
//   `viteSingleFile` inlines all JS/CSS so the page opens straight from the
//   filesystem (file://) with no server. This is the committed artifact.
//
// • pages  (`npm run build:pages`) → a normal multi-file build (tiny HTML +
//   hashed, cacheable, compressible JS/CSS chunks). Used by the GitHub Pages
//   workflow: far faster first paint on a real host than shipping one 400 KB
//   inline document.
//
// `base: './'` keeps every asset path relative, so both flavours work from
// file:// and from a project subpath like /<repo>/.
export default defineConfig(({ mode }) => {
  const singleFile = mode !== 'pages'
  return {
    base: './',
    plugins: [react(), ...(singleFile ? [viteSingleFile()] : [])],
    build: {
      // Scene sprites (the cut-out merchant and shop objects) must survive both
      // builds. In single-file mode every asset is base64-inlined into the one
      // HTML document, so it still opens from file:// with no server — at the
      // cost of a bigger file. The Pages build keeps them as separate hashed
      // files so they stay cacheable and the HTML stays tiny.
      assetsInlineLimit: singleFile ? 1024 * 1024 * 64 : 4096,
    },
  }
})
