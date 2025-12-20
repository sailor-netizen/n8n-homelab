import { ethers } from 'ethers'
import axios from 'axios'
import { Trade } from '../database/database'

interface EtherscanTransaction {
    hash: string
    timeStamp: string
    from: string
    to: string
    value: string
    gasUsed: string
    gasPrice: string
    isError: string
}

interface TokenTransfer {
    hash: string
    timeStamp: string
    from: string
    to: string
    value: string
    tokenSymbol: string
    tokenDecimal: string
}

export class EthereumTracker {
    private provider: ethers.JsonRpcProvider
    private etherscanApiUrl = 'https://api.etherscan.io/api'
    private apiKey: string = '' // Optional: Add your Etherscan API key for higher rate limits

    constructor(rpcUrl: string = 'https://eth.llamarpc.com') {
        this.provider = new ethers.JsonRpcProvider(rpcUrl)
    }

    async fetchTransactions(address: string): Promise<Trade[]> {
        try {
            const trades: Trade[] = []

            // Fetch ETH transactions
            const ethTxs = await this.fetchEthTransactions(address)
            trades.push(...ethTxs)

            // Fetch ERC-20 token transactions
            const tokenTxs = await this.fetchTokenTransactions(address)
            trades.push(...tokenTxs)

            return trades
        } catch (error) {
            console.error('Error fetching Ethereum transactions:', error)
            throw new Error(`Failed to fetch Ethereum transactions: ${error.message}`)
        }
    }

    private async fetchEthTransactions(address: string): Promise<Trade[]> {
        try {
            const response = await axios.get(this.etherscanApiUrl, {
                params: {
                    module: 'account',
                    action: 'txlist',
                    address,
                    startblock: 0,
                    endblock: 99999999,
                    page: 1,
                    offset: 100,
                    sort: 'desc',
                    apikey: this.apiKey
                }
            })

            if (response.data.status !== '1') {
                console.error('Etherscan API error:', response.data.message)
                return []
            }

            const transactions: EtherscanTransaction[] = response.data.result
            const trades: Trade[] = []

            for (const tx of transactions) {
                const trade = this.normalizeEthTransaction(tx, address)
                if (trade) trades.push(trade)
            }

            return trades
        } catch (error) {
            console.error('Error fetching ETH transactions:', error)
            return []
        }
    }

    private async fetchTokenTransactions(address: string): Promise<Trade[]> {
        try {
            const response = await axios.get(this.etherscanApiUrl, {
                params: {
                    module: 'account',
                    action: 'tokentx',
                    address,
                    startblock: 0,
                    endblock: 99999999,
                    page: 1,
                    offset: 100,
                    sort: 'desc',
                    apikey: this.apiKey
                }
            })

            if (response.data.status !== '1') {
                console.error('Etherscan API error:', response.data.message)
                return []
            }

            const transactions: TokenTransfer[] = response.data.result
            const trades: Trade[] = []

            for (const tx of transactions) {
                const trade = this.normalizeTokenTransaction(tx, address)
                if (trade) trades.push(trade)
            }

            return trades
        } catch (error) {
            console.error('Error fetching token transactions:', error)
            return []
        }
    }

    private normalizeEthTransaction(
        tx: EtherscanTransaction,
        address: string
    ): Trade | null {
        try {
            // Skip failed transactions
            if (tx.isError === '1') return null

            const value = parseFloat(ethers.formatEther(tx.value))

            // Skip zero-value transactions (likely contract interactions)
            if (value === 0) return null

            const isReceive = tx.to.toLowerCase() === address.toLowerCase()
            const timestamp = new Date(parseInt(tx.timeStamp) * 1000).toISOString()

            // Calculate gas fee
            const gasUsed = BigInt(tx.gasUsed)
            const gasPrice = BigInt(tx.gasPrice)
            const gasFee = parseFloat(ethers.formatEther(gasUsed * gasPrice))

            return {
                source: 'wallet_eth',
                source_id: tx.hash,
                trade_type: isReceive ? 'transfer_in' : 'transfer_out',
                timestamp,
                base_asset: 'ETH',
                base_amount: value,
                fee_amount: isReceive ? 0 : gasFee,
                fee_asset: 'ETH',
                raw_data: JSON.stringify(tx)
            }
        } catch (error) {
            console.error('Error normalizing ETH transaction:', error)
            return null
        }
    }

    private normalizeTokenTransaction(
        tx: TokenTransfer,
        address: string
    ): Trade | null {
        try {
            const decimals = parseInt(tx.tokenDecimal)
            const value = parseFloat(tx.value) / Math.pow(10, decimals)

            if (value === 0) return null

            const isReceive = tx.to.toLowerCase() === address.toLowerCase()
            const timestamp = new Date(parseInt(tx.timeStamp) * 1000).toISOString()

            return {
                source: 'wallet_eth',
                source_id: tx.hash,
                trade_type: isReceive ? 'transfer_in' : 'transfer_out',
                timestamp,
                base_asset: tx.tokenSymbol,
                base_amount: value,
                fee_amount: 0, // Token transfers have ETH gas fees, but we track those separately
                fee_asset: 'ETH',
                raw_data: JSON.stringify(tx)
            }
        } catch (error) {
            console.error('Error normalizing token transaction:', error)
            return null
        }
    }

    async getBalance(address: string): Promise<number> {
        try {
            const balance = await this.provider.getBalance(address)
            return parseFloat(ethers.formatEther(balance))
        } catch (error) {
            console.error('Error fetching Ethereum balance:', error)
            return 0
        }
    }

    async getTokenBalance(address: string, tokenAddress: string): Promise<number> {
        try {
            const erc20Abi = [
                'function balanceOf(address owner) view returns (uint256)',
                'function decimals() view returns (uint8)'
            ]

            const contract = new ethers.Contract(tokenAddress, erc20Abi, this.provider)
            const balance = await contract.balanceOf(address)
            const decimals = await contract.decimals()

            return parseFloat(ethers.formatUnits(balance, decimals))
        } catch (error) {
            console.error('Error fetching token balance:', error)
            return 0
        }
    }
}
