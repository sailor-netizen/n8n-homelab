import { defineConfig } from 'vite'
import { resolve } from 'path'
import { builtinModules } from 'module'

// Vite config for Electron main process
export default defineConfig({
    build: {
        outDir: 'dist/main',
        lib: {
            entry: resolve(__dirname, 'src/main/index.ts'),
            formats: ['cjs'],
            fileName: () => 'index.js'
        },
        rollupOptions: {
            external: [
                'electron',
                'better-sqlite3',
                'ccxt',
                'ethers',
                '@solana/web3.js',
                '@walletconnect/web3-provider',
                'axios',
                ...builtinModules,
                ...builtinModules.map(m => `node:${m}`)
            ]
        },
        minify: false,
        sourcemap: true,
        ssr: true // This tells Vite this is a Node.js environment
    },
    resolve: {
        alias: {
            '@main': resolve(__dirname, 'src/main'),
            '@shared': resolve(__dirname, 'src/shared')
        },
        // Prevent Vite from trying to resolve these for browser
        conditions: ['node']
    }
})
