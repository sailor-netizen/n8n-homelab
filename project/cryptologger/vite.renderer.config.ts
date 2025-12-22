import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// Vite config for Electron renderer process (React app)
export default defineConfig({
    root: 'src/renderer',
    base: './',
    build: {
        outDir: '../../dist/renderer',
        emptyOutDir: true
    },
    resolve: {
        alias: {
            '@renderer': resolve(__dirname, 'src/renderer'),
            '@shared': resolve(__dirname, 'src/shared')
        }
    },
    plugins: [
        react(),
        nodePolyfills({
            include: ['buffer', 'process', 'util', 'stream'],
            globals: {
                Buffer: true,
                global: true,
                process: true
            }
        })
    ],
    server: {
        port: 9099,
        strictPort: true
    }
})
