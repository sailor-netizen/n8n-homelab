// Temporary mock database for testing without better-sqlite3
import { app } from 'electron'
import { join } from 'path'

export interface Trade {
    id?: number
    source: string
    source_id?: string
    trade_type: string
    timestamp: string
    base_asset: string
    quote_asset?: string
    base_amount: number
    quote_amount?: number
    price?: number
    fee_amount?: number
    fee_asset?: string
    wallet_id?: number
    notes?: string
    raw_data?: string
}

export interface Wallet {
    id?: number
    chain: string
    address: string
    label?: string
    is_active: boolean
    last_synced?: string
}

// Mock in-memory storage
let trades: Trade[] = []
let wallets: Wallet[] = []
let settings: Record<string, string> = {
    tax_method: 'FIFO',
    base_currency: 'AUD',
    theme: 'dark',
    auto_sync: 'false'
}

export class DatabaseManager {
    constructor() {
        console.log('Using mock database (better-sqlite3 not available)')
    }

    // Settings
    getSettings(): Record<string, string> {
        return { ...settings }
    }

    updateSetting(key: string, value: string): void {
        settings[key] = value
    }

    // API Keys (mock - not secure)
    saveApiKey(exchange: string, apiKey: string, apiSecret: string): void {
        console.log(`Saved API keys for ${exchange}`)
    }

    getApiKey(exchange: string): { api_key: string; api_secret: string } | null {
        return null
    }

    // Trades
    getTrades(filters?: any): Trade[] {
        return [...trades]
    }

    addTrade(trade: Trade): number {
        const id = trades.length + 1
        trades.push({ ...trade, id })
        return id
    }

    deleteTrade(id: number): void {
        trades = trades.filter(t => t.id !== id)
    }

    // Wallets
    getWallets(): Wallet[] {
        return [...wallets]
    }

    getWallet(id: number): Wallet | null {
        return wallets.find(w => w.id === id) || null
    }

    addWallet(wallet: Wallet): number {
        const id = wallets.length + 1
        wallets.push({ ...wallet, id })
        return id
    }

    updateWalletSyncTime(id: number): void {
        const wallet = wallets.find(w => w.id === id)
        if (wallet) {
            wallet.last_synced = new Date().toISOString()
        }
    }

    deleteWallet(id: number): void {
        wallets = wallets.filter(w => w.id !== id)
    }

    // Tax lots (mock)
    addTaxLot(lot: any): number {
        return 1
    }

    getTaxLots(asset: string, notFullyDisposed: boolean = true): any[] {
        return []
    }

    updateTaxLot(id: number, remainingAmount: number, isFullyDisposed: boolean): void {
        // Mock
    }

    addTaxDisposal(disposal: any): number {
        return 1
    }

    getTaxDisposals(financialYear?: string): any[] {
        return []
    }

    // Export
    exportDatabase(): string {
        const userDataPath = app.getPath('userData')
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const backupPath = join(userDataPath, `cryptologger-backup-${timestamp}.json`)

        console.log(`Mock export to: ${backupPath}`)
        return backupPath
    }

    close(): void {
        console.log('Mock database closed')
    }
}
