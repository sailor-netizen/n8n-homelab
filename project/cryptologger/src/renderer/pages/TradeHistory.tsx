import { useState, useEffect } from 'react'

interface Trade {
    id: number
    source: string
    trade_type: string
    timestamp: string
    base_asset: string
    quote_asset?: string
    base_amount: number
    quote_amount?: number
    price?: number
    fee_amount?: number
    fee_asset?: string
}

export default function TradeHistory() {
    const [trades, setTrades] = useState<Trade[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        source: '',
        baseAsset: '',
        tradeType: ''
    })

    useEffect(() => {
        loadTrades()
    }, [filters])

    const loadTrades = async () => {
        try {
            setLoading(true)
            const filterParams = {
                source: filters.source || undefined,
                baseAsset: filters.baseAsset || undefined,
                tradeType: filters.tradeType || undefined
            }
            const data = await window.api.getTrades(filterParams)
            setTrades(data)
        } catch (error) {
            console.error('Error loading trades:', error)
        } finally {
            setLoading(false)
        }
    }

    const deleteTrade = async (id: number) => {
        if (!confirm('Are you sure you want to delete this trade?')) return

        try {
            await window.api.deleteTrade(id)
            await loadTrades()
        } catch (error) {
            console.error('Error deleting trade:', error)
            alert('Failed to delete trade')
        }
    }

    const getTradeTypeBadge = (type: string) => {
        const badges: Record<string, string> = {
            'buy': 'badge-success',
            'sell': 'badge-danger',
            'swap': 'badge-info',
            'transfer_in': 'badge-success',
            'transfer_out': 'badge-warning'
        }
        return badges[type] || 'badge-info'
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Trade History</h1>
                <p className="page-description">
                    View and manage all your cryptocurrency trades
                </p>
            </div>

            <div className="card mb-3">
                <div className="card-header">
                    <h2 className="card-title">Filters</h2>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Source</label>
                        <select
                            className="form-select"
                            value={filters.source}
                            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                        >
                            <option value="">All Sources</option>
                            <option value="bybit">Bybit</option>
                            <option value="manual">Manual</option>
                            <option value="wallet_btc">Bitcoin Wallet</option>
                            <option value="wallet_sol">Solana Wallet</option>
                            <option value="wallet_eth">Ethereum Wallet</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Asset</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g., BTC, ETH, SOL"
                            value={filters.baseAsset}
                            onChange={(e) => setFilters({ ...filters, baseAsset: e.target.value.toUpperCase() })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Trade Type</label>
                        <select
                            className="form-select"
                            value={filters.tradeType}
                            onChange={(e) => setFilters({ ...filters, tradeType: e.target.value })}
                        >
                            <option value="">All Types</option>
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                            <option value="swap">Swap</option>
                            <option value="transfer_in">Transfer In</option>
                            <option value="transfer_out">Transfer Out</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Trades ({trades.length})</h2>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : trades.length === 0 ? (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <p className="text-muted">No trades found. Add trades manually or sync your wallets.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Asset</th>
                                    <th>Amount</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Source</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trades.map(trade => (
                                    <tr key={trade.id}>
                                        <td>{new Date(trade.timestamp).toLocaleString('en-AU')}</td>
                                        <td>
                                            <span className={`badge ${getTradeTypeBadge(trade.trade_type)}`}>
                                                {trade.trade_type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <strong>{trade.base_asset}</strong>
                                            {trade.quote_asset && ` / ${trade.quote_asset}`}
                                        </td>
                                        <td>{trade.base_amount.toFixed(8)}</td>
                                        <td>
                                            {trade.price ? `$${trade.price.toFixed(2)}` : '-'}
                                        </td>
                                        <td>
                                            {trade.quote_amount ? `$${trade.quote_amount.toFixed(2)}` : '-'}
                                        </td>
                                        <td>
                                            <span className="text-muted">{trade.source}</span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                onClick={() => deleteTrade(trade.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
