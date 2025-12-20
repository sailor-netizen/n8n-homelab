import { defineConfig } from 'vite'
import { resolve } from 'path'
import { builtinModules } from 'module'

// Vite config for Electron preload script
export default defineConfig({
    build: {
        outDir: 'dist/preload',
        lib: {
            entry: resolve(__dirname, 'src/preload/index.ts'),
            formats: ['cjs'],
            fileName: () => 'index.js'
        },
        rollupOptions: {
            external: [
                'electron',
                ...builtinModules,
                ...builtinModules.map(m => `node:${m}`)
            ]
        },
        minify: false,
        sourcemap: true,
        ssr: true
    },
    resolve: {
        conditions: ['node']
    }
})
