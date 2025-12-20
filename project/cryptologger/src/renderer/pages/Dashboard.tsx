import { useState, useEffect } from 'react'

interface DashboardStats {
    totalTrades: number
    connectedWallets: number
    currentFYGain: number
    lastSync: string
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalTrades: 0,
        connectedWallets: 0,
        currentFYGain: 0,
        lastSync: 'Never'
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            const trades = await window.api.getTrades()
            const wallets = await window.api.getWallets()

            // Get current financial year
            const now = new Date()
            const fyYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
            const financialYear = `${fyYear}-${fyYear + 1}`

            // Calculate tax for current FY
            const taxSummary = await window.api.calculateTax(financialYear, 'FIFO')

            setStats({
                totalTrades: trades.length,
                connectedWallets: wallets.filter((w: any) => w.is_active).length,
                currentFYGain: taxSummary.netCapitalGain || 0,
                lastSync: wallets.length > 0 ? 'Recently' : 'Never'
            })
        } catch (error) {
            console.error('Error loading dashboard:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="page">
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-description">
                    Overview of your crypto trading activity and tax obligations
                </p>
            </div>

            <div className="card-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Trades</div>
                    <div className="stat-value">{stats.totalTrades.toLocaleString()}</div>
                    <div className="stat-change text-muted">All time</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Connected Wallets</div>
                    <div className="stat-value">{stats.connectedWallets}</div>
                    <div className="stat-change text-muted">Active wallets</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Current FY Net Gain</div>
                    <div className="stat-value">
                        ${Math.abs(stats.currentFYGain).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`stat-change ${stats.currentFYGain >= 0 ? 'positive' : 'negative'}`}>
                        {stats.currentFYGain >= 0 ? '▲' : '▼'} {stats.currentFYGain >= 0 ? 'Gain' : 'Loss'}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Last Sync</div>
                    <div className="stat-value">{stats.lastSync}</div>
                    <div className="stat-change text-muted">Wallet sync status</div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Quick Actions</h2>
                </div>

                <div className="btn-group">
                    <button className="btn btn-primary" onClick={() => window.location.href = '/manual-entry'}>
                        ✏️ Add Manual Trade
                    </button>
                    <button className="btn btn-success" onClick={() => window.location.href = '/wallets'}>
                        👛 Connect Wallet
                    </button>
                    <button className="btn btn-secondary" onClick={() => window.location.href = '/reports'}>
                        📄 Generate Report
                    </button>
                </div>
            </div>

            <div className="card mt-4">
                <div className="card-header">
                    <h2 className="card-title">Important Information</h2>
                </div>

                <div className="alert alert-info">
                    <strong>Australian Financial Year:</strong> Runs from July 1 to June 30.
                    Make sure to generate your tax report before lodging your tax return.
                </div>

                <div className="alert alert-warning">
                    <strong>CGT Discount:</strong> Assets held for more than 12 months qualify for a 50% capital gains tax discount.
                </div>

                <div className="alert alert-info">
                    <strong>Personal Use Exemption:</strong> Transactions under $10,000 AUD may qualify for personal use exemption.
                </div>
            </div>
        </div>
    )
}
