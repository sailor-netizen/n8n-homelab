import ccxt from 'ccxt'
import { Trade } from '../database/database'

export class BybitClient {
    private exchange: ccxt.bybit

    constructor(apiKey: string, apiSecret: string) {
        this.exchange = new ccxt.bybit({
            apiKey,
            secret: apiSecret,
            enableRateLimit: true,
            options: {
                defaultType: 'spot' // Can be 'spot', 'linear', 'inverse'
            }
        })
    }

    async fetchTradeHistory(since?: number, limit: number = 1000): Promise<Trade[]> {
        try {
            const trades: Trade[] = []

            // Fetch spot trades
            const spotTrades = await this.exchange.fetchMyTrades(undefined, since, limit)

            for (const trade of spotTrades) {
                trades.push(this.normalizeTrade(trade))
            }

            return trades
        } catch (error) {
            console.error('Error fetching Bybit trades:', error)
            throw new Error(`Failed to fetch Bybit trades: ${error.message}`)
        }
    }

    async fetchAllTradeHistory(): Promise<Trade[]> {
        const allTrades: Trade[] = []
        let since = undefined
        const limit = 1000

        try {
            while (true) {
                const trades = await this.fetchTradeHistory(since, limit)

                if (trades.length === 0) break

                allTrades.push(...trades)

                // If we got fewer trades than the limit, we've reached the end
                if (trades.length < limit) break

                // Set 'since' to the timestamp of the last trade for pagination
                const lastTrade = trades[trades.length - 1]
                since = new Date(lastTrade.timestamp).getTime()

                // Add a small delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 1000))
            }

            return allTrades
        } catch (error) {
            console.error('Error fetching all Bybit trades:', error)
            throw error
        }
    }

    private normalizeTrade(ccxtTrade: ccxt.Trade): Trade {
        // Determine trade type (buy or sell)
        const tradeType = ccxtTrade.side === 'buy' ? 'buy' : 'sell'

        // Parse symbol (e.g., 'BTC/USDT' -> base: BTC, quote: USDT)
        const [baseAsset, quoteAsset] = ccxtTrade.symbol.split('/')

        return {
            source: 'bybit',
            source_id: ccxtTrade.id,
            trade_type: tradeType,
            timestamp: new Date(ccxtTrade.timestamp).toISOString(),
            base_asset: baseAsset,
            quote_asset: quoteAsset,
            base_amount: ccxtTrade.amount,
            quote_amount: ccxtTrade.cost,
            price: ccxtTrade.price,
            fee_amount: ccxtTrade.fee?.cost || 0,
            fee_asset: ccxtTrade.fee?.currency || quoteAsset,
            raw_data: JSON.stringify(ccxtTrade)
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.exchange.fetchBalance()
            return true
        } catch (error) {
            console.error('Bybit connection test failed:', error)
            return false
        }
    }

    async getBalance(): Promise<Record<string, number>> {
        try {
            const balance = await this.exchange.fetchBalance()
            const result: Record<string, number> = {}

            for (const [currency, amount] of Object.entries(balance.total)) {
                if (typeof amount === 'number' && amount > 0) {
                    result[currency] = amount
                }
            }

            return result
        } catch (error) {
            console.error('Error fetching Bybit balance:', error)
            throw error
        }
    }
}
