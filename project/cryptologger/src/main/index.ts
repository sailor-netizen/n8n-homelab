import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { DatabaseManager } from './database/database'
import { BybitClient } from './integrations/bybit-client'
import { WalletManager } from './wallets/wallet-manager'
import { TaxCalculator } from './tax/tax-calculator'

let mainWindow: BrowserWindow | null = null
let db: DatabaseManager | null = null

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        show: false,
        autoHideMenuBar: true,
        backgroundColor: '#1a1a2e',
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow?.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    // Load the app
    const isDev = !app.isPackaged
    if (isDev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

// App lifecycle
app.whenReady().then(() => {
    app.setAppUserModelId('com.cryptologger.app')

    // Initialize database
    db = new DatabaseManager()

    // Set up IPC handlers
    setupIpcHandlers()

    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        db?.close()
        app.quit()
    }
})

// IPC Handlers
function setupIpcHandlers() {
    // Database operations
    ipcMain.handle('db:get-settings', async () => {
        return db?.getSettings()
    })

    ipcMain.handle('db:update-setting', async (_, key: string, value: string) => {
        return db?.updateSetting(key, value)
    })

    // Trades
    ipcMain.handle('db:get-trades', async (_, filters?: any) => {
        return db?.getTrades(filters)
    })

    ipcMain.handle('db:add-trade', async (_, trade: any) => {
        return db?.addTrade(trade)
    })

    ipcMain.handle('db:delete-trade', async (_, id: number) => {
        return db?.deleteTrade(id)
    })

    // Wallets
    ipcMain.handle('db:get-wallets', async () => {
        return db?.getWallets()
    })

    ipcMain.handle('db:add-wallet', async (_, wallet: any) => {
        return db?.addWallet(wallet)
    })

    ipcMain.handle('db:delete-wallet', async (_, id: number) => {
        return db?.deleteWallet(id)
    })

    // Bybit integration
    ipcMain.handle('bybit:save-api-key', async (_, apiKey: string, apiSecret: string) => {
        return db?.saveApiKey('bybit', apiKey, apiSecret)
    })

    ipcMain.handle('bybit:fetch-trades', async () => {
        const apiKeys = await db?.getApiKey('bybit')
        if (!apiKeys) throw new Error('Bybit API keys not configured')

        const bybit = new BybitClient(apiKeys.api_key, apiKeys.api_secret)
        const trades = await bybit.fetchTradeHistory()

        // Save trades to database
        for (const trade of trades) {
            await db?.addTrade(trade)
        }

        return trades.length
    })

    // Wallet sync
    ipcMain.handle('wallet:sync', async (_, walletId: number) => {
        const wallet = await db?.getWallet(walletId)
        if (!wallet) throw new Error('Wallet not found')

        const walletManager = new WalletManager(db!)
        const transactions = await walletManager.syncWallet(wallet)

        return transactions.length
    })

    // Tax calculations
    ipcMain.handle('tax:calculate', async (_, financialYear: string, method: string) => {
        const calculator = new TaxCalculator(db!, method)
        return await calculator.calculateForFinancialYear(financialYear)
    })

    ipcMain.handle('tax:export', async (_, financialYear: string, format: string) => {
        const calculator = new TaxCalculator(db!, 'FIFO')
        return await calculator.exportReport(financialYear, format)
    })

    // Import/Export
    ipcMain.handle('import:csv', async (_, filePath: string) => {
        // TODO: Implement CSV import
        return { success: true, count: 0 }
    })

    ipcMain.handle('export:database', async () => {
        return db?.exportDatabase()
    })
}
