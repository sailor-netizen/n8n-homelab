import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js'
import { Trade } from '../database/database'

export class SolanaTracker {
    private connection: Connection

    constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
        this.connection = new Connection(rpcUrl, 'confirmed')
    }

    async fetchTransactions(address: string): Promise<Trade[]> {
        try {
            const publicKey = new PublicKey(address)
            const signatures = await this.connection.getSignaturesForAddress(publicKey, {
                limit: 100
            })

            const trades: Trade[] = []

            for (const sig of signatures) {
                const tx = await this.connection.getParsedTransaction(sig.signature, {
                    maxSupportedTransactionVersion: 0
                })

                if (tx) {
                    const trade = this.normalizeTransaction(tx, address)
                    if (trade) trades.push(trade)
                }

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 300))
            }

            return trades
        } catch (error) {
            console.error('Error fetching Solana transactions:', error)
            throw new Error(`Failed to fetch Solana transactions: ${error.message}`)
        }
    }

    private normalizeTransaction(
        tx: ParsedTransactionWithMeta,
        address: string
    ): Trade | null {
        try {
            if (!tx.meta || !tx.blockTime) return null

            const timestamp = new Date(tx.blockTime * 1000).toISOString()
            const fee = (tx.meta.fee || 0) / 1e9 // Convert lamports to SOL

            // Get pre and post balances
            const accountIndex = tx.transaction.message.accountKeys.findIndex(
                key => key.pubkey.toString() === address
            )

            if (accountIndex === -1) return null

            const preBalance = (tx.meta.preBalances[accountIndex] || 0) / 1e9
            const postBalance = (tx.meta.postBalances[accountIndex] || 0) / 1e9
            const balanceChange = postBalance - preBalance

            // Skip if no balance change (might be a failed tx or contract interaction)
            if (Math.abs(balanceChange) < 0.000001) return null

            const isReceive = balanceChange > 0
            const amount = Math.abs(balanceChange)

            // Check for token transfers (SPL tokens)
            const tokenTransfers = this.extractTokenTransfers(tx, address)
            if (tokenTransfers.length > 0) {
                // For now, just log the first token transfer
                const tokenTransfer = tokenTransfers[0]
                return {
                    source: 'wallet_sol',
                    source_id: tx.transaction.signatures[0],
                    trade_type: tokenTransfer.isReceive ? 'transfer_in' : 'transfer_out',
                    timestamp,
                    base_asset: tokenTransfer.mint,
                    base_amount: tokenTransfer.amount,
                    fee_amount: fee,
                    fee_asset: 'SOL',
                    raw_data: JSON.stringify(tx)
                }
            }

            // Regular SOL transfer
            return {
                source: 'wallet_sol',
                source_id: tx.transaction.signatures[0],
                trade_type: isReceive ? 'transfer_in' : 'transfer_out',
                timestamp,
                base_asset: 'SOL',
                base_amount: amount,
                fee_amount: fee,
                fee_asset: 'SOL',
                raw_data: JSON.stringify(tx)
            }
        } catch (error) {
            console.error('Error normalizing Solana transaction:', error)
            return null
        }
    }

    private extractTokenTransfers(
        tx: ParsedTransactionWithMeta,
        address: string
    ): Array<{ mint: string; amount: number; isReceive: boolean }> {
        const transfers: Array<{ mint: string; amount: number; isReceive: boolean }> = []

        try {
            if (!tx.meta?.preTokenBalances || !tx.meta?.postTokenBalances) return transfers

            // Match pre and post token balances
            for (const postBalance of tx.meta.postTokenBalances) {
                const preBalance = tx.meta.preTokenBalances.find(
                    pre => pre.accountIndex === postBalance.accountIndex
                )

                if (!preBalance || !postBalance.uiTokenAmount || !preBalance.uiTokenAmount) continue

                const preAmount = preBalance.uiTokenAmount.uiAmount || 0
                const postAmount = postBalance.uiTokenAmount.uiAmount || 0
                const change = postAmount - preAmount

                if (Math.abs(change) > 0) {
                    transfers.push({
                        mint: postBalance.mint,
                        amount: Math.abs(change),
                        isReceive: change > 0
                    })
                }
            }
        } catch (error) {
            console.error('Error extracting token transfers:', error)
        }

        return transfers
    }

    async getBalance(address: string): Promise<number> {
        try {
            const publicKey = new PublicKey(address)
            const balance = await this.connection.getBalance(publicKey)
            return balance / 1e9 // Convert lamports to SOL
        } catch (error) {
            console.error('Error fetching Solana balance:', error)
            return 0
        }
    }
}
