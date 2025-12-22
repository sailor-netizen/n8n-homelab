import { useState, useEffect } from 'react'
import WalletConnectModal from '../components/WalletConnectModal'

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
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

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
            <WalletConnectModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
                onSuccess={() => {
                    loadDashboardData()
                    alert('Wallet connected successfully!')
                }}
            />

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

            <div className="card-grid mt-4">
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h2 className="card-title">Neural Insights</h2>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.2)' }}>
                        <p className="text-cyan mb-2" style={{ fontSize: '0.8rem' }}>&gt; AI ORACLE STATUS: ONLINE</p>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Run neural analysis to scan your trade vectors for entry and exit discrepancies.</p>
                        <button className="btn btn-primary mt-3" onClick={() => window.location.href = '/ai-oracle'}>
                            🧠 ACCESS AI ORACLE
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Quick Actions</h2>
                    </div>

                    <div className="btn-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/manual-entry'}>
                            ✏️ Add Manual Trade
                        </button>
                        <button className="btn btn-success" onClick={() => setIsWalletModalOpen(true)}>
                            👛 Connect Wallet
                        </button>
                        <button className="btn btn-secondary" onClick={() => window.location.href = '/reports'}>
                            📄 Generate Report
                        </button>
                    </div>
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
