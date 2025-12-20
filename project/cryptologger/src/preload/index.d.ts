import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
    interface Window {
        electron: ElectronAPI
        api: {
            // Settings
            getSettings: () => Promise<Record<string, string>>
            updateSetting: (key: string, value: string) => Promise<void>

            // Trades
            getTrades: (filters?: any) => Promise<any[]>
            addTrade: (trade: any) => Promise<number>
            deleteTrade: (id: number) => Promise<void>

            // Wallets
            getWallets: () => Promise<any[]>
            addWallet: (wallet: any) => Promise<number>
            deleteWallet: (id: number) => Promise<void>
            syncWallet: (walletId: number) => Promise<number>

            // Bybit
            saveBybitApiKey: (apiKey: string, apiSecret: string) => Promise<void>
            fetchBybitTrades: () => Promise<number>

            // Tax
            calculateTax: (financialYear: string, method: string) => Promise<any>
            exportTaxReport: (financialYear: string, format: string) => Promise<string>

            // Import/Export
            importCsv: (filePath: string) => Promise<{ success: boolean; count: number }>
            exportDatabase: () => Promise<string>
        }
    }
}
