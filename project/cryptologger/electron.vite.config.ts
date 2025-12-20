import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin(), bytecodePlugin()],
        build: {
            rollupOptions: {
                external: ['electron', 'better-sqlite3']
            }
        },
        resolve: {
            alias: {
                '@main': resolve('src/main'),
                '@shared': resolve('src/shared')
            }
        }
    },
    preload: {
        plugins: [externalizeDepsPlugin(), bytecodePlugin()],
        build: {
            rollupOptions: {
                external: ['electron']
            }
        }
    },
    renderer: {
        root: 'src/renderer',
        build: {
            rollupOptions: {
                input: resolve('src/renderer/index.html')
            }
        },
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer'),
                '@shared': resolve('src/shared')
            }
        },
        plugins: [react()]
    }
})
