import axios from 'axios'
import { Trade } from '../database/database'

interface BlockchairTransaction {
    hash: string
    time: string
    balance_change: number
    inputs: Array<{ recipient: string; value: number }>
    outputs: Array<{ recipient: string; value: number }>
}

export class BitcoinTracker {
    private apiUrl = 'https://api.blockchair.com/bitcoin'

    async fetchTransactions(address: string): Promise<Trade[]> {
        try {
            const response = await axios.get(
                `${this.apiUrl}/dashboards/address/${address}`,
                {
                    params: {
                        limit: 100,
                        offset: 0
                    }
                }
            )

            const data = response.data.data[address]
            if (!data || !data.transactions) {
                return []
            }

            const trades: Trade[] = []

            for (const txHash of data.transactions) {
                const txDetails = await this.fetchTransactionDetails(txHash)
                if (txDetails) {
                    const trade = this.normalizeTransaction(txDetails, address)
                    if (trade) trades.push(trade)
                }

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 500))
            }

            return trades
        } catch (error) {
            console.error('Error fetching Bitcoin transactions:', error)
            throw new Error(`Failed to fetch Bitcoin transactions: ${error.message}`)
        }
    }

    private async fetchTransactionDetails(txHash: string): Promise<any> {
        try {
            const response = await axios.get(
                `${this.apiUrl}/dashboards/transaction/${txHash}`
            )
            return response.data.data[txHash]
        } catch (error) {
            console.error(`Error fetching transaction ${txHash}:`, error)
            return null
        }
    }

    private normalizeTransaction(tx: any, address: string): Trade | null {
        try {
            // Calculate if this is a receive or send
            let balanceChange = 0
            let isReceive = false

            // Check outputs for our address
            for (const output of tx.outputs || []) {
                if (output.recipient === address) {
                    balanceChange += output.value
                    isReceive = true
                }
            }

            // Check inputs for our address
            for (const input of tx.inputs || []) {
                if (input.recipient === address) {
                    balanceChange -= input.value
                }
            }

            // Convert satoshis to BTC
            const btcAmount = Math.abs(balanceChange) / 100000000

            if (btcAmount === 0) return null

            return {
                source: 'wallet_btc',
                source_id: tx.hash,
                trade_type: isReceive ? 'transfer_in' : 'transfer_out',
                timestamp: tx.time,
                base_asset: 'BTC',
                base_amount: btcAmount,
                fee_amount: (tx.fee || 0) / 100000000,
                fee_asset: 'BTC',
                raw_data: JSON.stringify(tx)
            }
        } catch (error) {
            console.error('Error normalizing Bitcoin transaction:', error)
            return null
        }
    }

    async getBalance(address: string): Promise<number> {
        try {
            const response = await axios.get(
                `${this.apiUrl}/dashboards/address/${address}`
            )
            const balance = response.data.data[address]?.address?.balance || 0
            return balance / 100000000 // Convert satoshis to BTC
        } catch (error) {
            console.error('Error fetching Bitcoin balance:', error)
            return 0
        }
    }
}
