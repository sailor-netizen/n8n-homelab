export interface MarketData {
    symbol: string
    price: number
    change24h: number
    marketCap: number
    volume24h: number
    history: { time: number; value: number }[]
    ohlcHistory?: { time: number; open: number; high: number; low: number; close: number }[]
    volumeHistory?: { time: number; value: number }[]
    sentimentHistory?: { time: number; value: number }[]
}

export interface IApi {
    getSettings: () => Promise<Record<string, string>>
    updateSetting: (key: string, value: string) => Promise<void>
    getTrades: (filters?: any) => Promise<any[]>
    addTrade: (trade: any) => Promise<number>
    deleteTrade: (id: number) => Promise<void>
    getWallets: () => Promise<any[]>
    addWallet: (wallet: any) => Promise<number>
    deleteWallet: (id: number) => Promise<void>
    syncWallet: (walletId: number) => Promise<void>
    saveBybitApiKey: (apiKey: string, apiSecret: string) => Promise<void>
    fetchBybitTrades: () => Promise<void>
    calculateTax: (financialYear: string, method: string) => Promise<any>
    exportTaxReport: (financialYear: string, format: string) => Promise<string>
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
    importCsv: (filePath: string) => Promise<void>
    exportDatabase: () => Promise<string>
    getAiInsights: () => Promise<any>
    getAiPredictions: () => Promise<any>
    getWatchlist: () => Promise<any[]>
    addWatchlistItem: (item: any) => Promise<number>
    deleteWatchlistItem: (id: number) => Promise<void>
    getMarketPrices: (symbols: string[]) => Promise<any[]>
    analyzeAsset: (symbol: string) => Promise<any>
}

declare global {
    interface Window {
        api: IApi
        TradingView: any
    }
}
