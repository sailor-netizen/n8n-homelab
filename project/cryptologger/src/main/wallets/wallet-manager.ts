import { DatabaseManager, Wallet, Trade } from '../database/database'
import { BitcoinTracker } from './bitcoin-tracker'
import { SolanaTracker } from './solana-tracker'
import { EthereumTracker } from './ethereum-tracker'

export class WalletManager {
    private db: DatabaseManager

    constructor(db: DatabaseManager) {
        this.db = db
    }

    async syncWallet(wallet: Wallet): Promise<Trade[]> {
        let transactions: Trade[] = []

        try {
            switch (wallet.chain.toUpperCase()) {
                case 'BTC':
                    const btcTracker = new BitcoinTracker()
                    transactions = await btcTracker.fetchTransactions(wallet.address)
                    break

                case 'SOL':
                    const solTracker = new SolanaTracker()
                    transactions = await solTracker.fetchTransactions(wallet.address)
                    break

                case 'ETH':
                    const ethTracker = new EthereumTracker()
                    transactions = await ethTracker.fetchTransactions(wallet.address)
                    break

                default:
                    throw new Error(`Unsupported chain: ${wallet.chain}`)
            }

            // Save transactions to database
            for (const tx of transactions) {
                tx.wallet_id = wallet.id
                this.db.addTrade(tx)
            }

            // Update last synced time
            this.db.updateWalletSyncTime(wallet.id!)

            return transactions
        } catch (error) {
            console.error(`Error syncing wallet ${wallet.address}:`, error)
            throw error
        }
    }

    async syncAllWallets(): Promise<number> {
        const wallets = this.db.getWallets().filter(w => w.is_active)
        let totalTransactions = 0

        for (const wallet of wallets) {
            try {
                const transactions = await this.syncWallet(wallet)
                totalTransactions += transactions.length

                // Add delay between wallet syncs to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 2000))
            } catch (error) {
                console.error(`Failed to sync wallet ${wallet.address}:`, error)
                // Continue with other wallets even if one fails
            }
        }

        return totalTransactions
    }
}
