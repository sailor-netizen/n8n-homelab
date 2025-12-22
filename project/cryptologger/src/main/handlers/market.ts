import { ipcMain } from 'electron'
import { DatabaseManager } from '../database/database'

export function setupMarketHandlers(db: DatabaseManager) {
    // Watchlist Management
    ipcMain.handle('market:get-watchlist', async () => {
        return db.getWatchlist()
    })

    ipcMain.handle('market:add-watchlist-item', async (_event, item) => {
        return db.addWatchlistItem(item)
    })

    ipcMain.handle('market:delete-watchlist-item', async (_event, id) => {
        return db.deleteWatchlistItem(id)
    })

    // Real-time Market Data (Mocked for now with volatility simulation)
    ipcMain.handle('market:get-prices', async (_event, symbols: string[]) => {
        // In a real app, this would call a public API like CoinCap or Binance
        return symbols.map(symbol => {
            const basePrice = symbol === 'BTC' ? 65000 : symbol === 'ETH' ? 3500 : symbol === 'SOL' ? 140 : 170
            const change = (Math.random() - 0.5) * 2 // -1% to +1%
            const price = basePrice * (1 + (change / 100))

            return {
                symbol,
                price,
                change24h: (Math.random() - 0.4) * 5, // -2% to +3%
                marketCap: Math.random() * 1000000000,
                volume24h: Math.random() * 50000000,
                // Generate mock bar data (last 20 intervals)
                history: Array.from({ length: 20 }, (_, i) => ({
                    time: i,
                    value: price * (1 + (Math.random() - 0.5) * 0.02)
                }))
            }
        })
    })

    // AI Asset Analysis
    ipcMain.handle('ai:analyze-asset', async (_event, symbol: string) => {
        const sentiment = Math.random() > 0.5 ? 'BULLISH' : 'NEUTRAL'
        const score = Math.floor(Math.random() * 40) + 60 // 60-100

        return {
            symbol,
            sentiment,
            score,
            verdict: sentiment === 'BULLISH'
                ? `Neural scan of ${symbol} shows strong accumulation patterns in the 4H quadrant. RSI holding steady at 58. Oracle suggests long exposure.`
                : `Target ${symbol} is currently oscillating in a high-variance range. Technical markers indicate a liquidity sweep. Exercise caution.`,
            kpis: {
                rsi: Math.floor(Math.random() * 30) + 40,
                volatility: 'MEDIUM',
                support: '0.00' // Mocked
            }
        }
    })
}
