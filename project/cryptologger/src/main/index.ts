import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { DatabaseManager } from './database/database'
import { setupDatabaseHandlers } from './handlers/database'
import { setupTradeHandlers } from './handlers/trades'
import { setupWalletHandlers } from './handlers/wallets'
import { setupTaxHandlers } from './handlers/tax'
import { setupIntegrationHandlers } from './handlers/integrations'
import { setupAiHandlers } from './handlers/ai'
import { setupMarketHandlers } from './handlers/market'

let mainWindow: BrowserWindow | null = null
let db: DatabaseManager | null = null

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        show: false,
        frame: false, // <--- Frameless window
        autoHideMenuBar: true,
        backgroundColor: '#0d1117', // Match new bg color
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

    // Window Control Handlers
    ipcMain.handle('window:minimize', () => {
        mainWindow?.minimize();
    });

    ipcMain.handle('window:maximize', () => {
        if (mainWindow?.isMaximized()) {
            mainWindow?.unmaximize();
        } else {
            mainWindow?.maximize();
        }
    });

    ipcMain.handle('window:close', () => {
        mainWindow?.close();
    });

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
    setupIpcHandlers(db)

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
function setupIpcHandlers(db: DatabaseManager) {
    setupDatabaseHandlers(db)
    setupTradeHandlers(db)
    setupWalletHandlers(db)
    setupTaxHandlers(db)
    setupIntegrationHandlers(db)
    setupAiHandlers(db)
    setupMarketHandlers(db)
}
