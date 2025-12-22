import { contextBridge, ipcRenderer } from 'electron'

// Custom API for renderer
const api = {
    // Settings
    getSettings: () => ipcRenderer.invoke('db:get-settings'),
    updateSetting: (key: string, value: string) => ipcRenderer.invoke('db:update-setting', key, value),

    // Trades
    getTrades: (filters?: any) => ipcRenderer.invoke('db:get-trades', filters),
    addTrade: (trade: any) => ipcRenderer.invoke('db:add-trade', trade),
    deleteTrade: (id: number) => ipcRenderer.invoke('db:delete-trade', id),

    // Wallets
    getWallets: () => ipcRenderer.invoke('db:get-wallets'),
    addWallet: (wallet: any) => ipcRenderer.invoke('db:add-wallet', wallet),
    deleteWallet: (id: number) => ipcRenderer.invoke('db:delete-wallet', id),
    syncWallet: (walletId: number) => ipcRenderer.invoke('wallet:sync', walletId),

    // Bybit
    saveBybitApiKey: (apiKey: string, apiSecret: string) =>
        ipcRenderer.invoke('bybit:save-api-key', apiKey, apiSecret),
    fetchBybitTrades: () => ipcRenderer.invoke('bybit:fetch-trades'),

    // Tax
    calculateTax: (financialYear: string, method: string) =>
        ipcRenderer.invoke('tax:calculate', financialYear, method),
    exportTaxReport: (financialYear: string, format: string) =>
        ipcRenderer.invoke('tax:export', financialYear, format),

    // Window Controls
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),

    // Import/Export
    importCsv: (filePath: string) => ipcRenderer.invoke('import:csv', filePath),
    exportDatabase: () => ipcRenderer.invoke('export:database'),

    // AI Oracle
    getAiInsights: () => ipcRenderer.invoke('ai:get-insights'),
    getAiPredictions: () => ipcRenderer.invoke('ai:get-predictions')
}

// Expose API to renderer
contextBridge.exposeInMainWorld('api', api)
