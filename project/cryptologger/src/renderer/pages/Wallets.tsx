import { useState, useEffect } from 'react'
import WalletConnectModal from '../components/WalletConnectModal'

interface Wallet {
    id: number
    chain: string
    address: string
    label?: string
    is_active: boolean
    last_synced?: string
}

export default function Wallets() {
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [syncing, setSyncing] = useState<number | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [newWallet, setNewWallet] = useState({
        chain: 'BTC',
        address: '',
        label: ''
    })

    useEffect(() => {
        loadWallets()
    }, [])

    const loadWallets = async () => {
        try {
            if (window.api && window.api.getWallets) {
                const data = await window.api.getWallets()
                setWallets(data)
            }
        } catch (error) {
            console.error('Error loading wallets:', error)
        } finally {
            setLoading(false)
        }
    }

    const addWallet = async (e: React.FormEvent) => {
        e.preventDefault()
        await saveWallet(newWallet.chain, newWallet.address, newWallet.label)
        setNewWallet({ chain: 'BTC', address: '', label: '' })
        setShowAddForm(false)
    }

    const saveWallet = async (chain: string, address: string, label?: string) => {
        try {
            await window.api.addWallet({
                chain,
                address,
                label: label || null,
                is_active: true
            })
            await loadWallets()
        } catch (error) {
            console.error('Error adding wallet:', error)
            alert('Failed to add wallet. Please check the address.')
        }
    }

    const syncWallet = async (walletId: number) => {
        setSyncing(walletId)
        try {
            const count = await window.api.syncWallet(walletId)
            alert(`Successfully synced ${count} transactions`)
            await loadWallets()
        } catch (error) {
            console.error('Error syncing wallet:', error)
            alert('Failed to sync wallet. Please try again.')
        } finally {
            setSyncing(null)
        }
    }

    const deleteWallet = async (id: number) => {
        if (!confirm('Are you sure you want to remove this wallet?')) return

        try {
            await window.api.deleteWallet(id)
            await loadWallets()
        } catch (error) {
            console.error('Error deleting wallet:', error)
            alert('Failed to delete wallet')
        }
    }

    const getChainIcon = (chain: string) => {
        const icons: Record<string, string> = {
            'BTC': '₿',
            'SOL': '◎',
            'ETH': 'Ξ'
        }
        return icons[chain] || '🔗'
    }

    return (
        <div className="page">
            <WalletConnectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => loadWallets()}
            />

            <div className="page-header">
                <h1 className="page-title">Wallets</h1>
                <p className="page-description">
                    Connect and manage your cryptocurrency wallets
                </p>
            </div>

            <div className="card mb-3">
                <div className="card-header">
                    <h2 className="card-title">Add New Wallet</h2>
                </div>

                {/* Integration Buttons */}
                <div className="mb-4 text-center">
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsModalOpen(true)}
                        style={{ fontSize: '1.2rem', padding: '1rem 2rem', border: '1px dashed var(--color-cyan)' }}
                    >
                        🔗 Connect via WalletConnect
                    </button>
                    <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
                        Scan QR code with MetaMask, Trust Wallet, etc.
                    </p>
                </div>

                <div className="text-center mb-3">
                    <span className="text-muted">- OR -</span>
                </div>

                {!showAddForm ? (
                    <div className="text-center">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowAddForm(true)}
                        >
                            + Enter Address Manually
                        </button>
                    </div>
                ) : (
                    <form onSubmit={addWallet}>
                        <div className="form-group">
                            <label className="form-label">Blockchain *</label>
                            <select
                                className="form-select"
                                value={newWallet.chain}
                                onChange={(e) => setNewWallet({ ...newWallet, chain: e.target.value })}
                                required
                            >
                                <option value="BTC">Bitcoin (BTC)</option>
                                <option value="SOL">Solana (SOL)</option>
                                <option value="ETH">Ethereum (ETH)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Wallet Address *</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter wallet address..."
                                value={newWallet.address}
                                onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Label (Optional)</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., My Main Wallet"
                                value={newWallet.label}
                                onChange={(e) => setNewWallet({ ...newWallet, label: e.target.value })}
                            />
                        </div>

                        <div className="btn-group">
                            <button type="submit" className="btn btn-success">
                                ✓ Add Wallet
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowAddForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Connected Wallets ({wallets.length})</h2>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : wallets.length === 0 ? (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <p className="text-muted">No wallets connected. Add a wallet to get started.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Chain</th>
                                    <th>Address</th>
                                    <th>Label</th>
                                    <th>Last Synced</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wallets.map(wallet => (
                                    <tr key={wallet.id}>
                                        <td>
                                            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
                                                {getChainIcon(wallet.chain)}
                                            </span>
                                            {wallet.chain}
                                        </td>
                                        <td>
                                            <code style={{ fontSize: '0.875rem' }}>
                                                {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                                            </code>
                                        </td>
                                        <td>{wallet.label || '-'}</td>
                                        <td>
                                            {wallet.last_synced
                                                ? new Date(wallet.last_synced).toLocaleString('en-AU')
                                                : 'Never'
                                            }
                                        </td>
                                        <td>
                                            <span className={`badge ${wallet.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                {wallet.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                    onClick={() => syncWallet(wallet.id)}
                                                    disabled={syncing === wallet.id}
                                                >
                                                    {syncing === wallet.id ? '⟳ Syncing...' : '⟳ Sync'}
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                    onClick={() => deleteWallet(wallet.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="card mt-4">
                <div className="card-header">
                    <h2 className="card-title">Important Notes</h2>
                </div>

                <div className="alert alert-info">
                    <strong>Privacy:</strong> Your wallet addresses are stored locally on your computer.
                    We only fetch transaction history from public blockchain APIs.
                </div>

                <div className="alert alert-warning">
                    <strong>Rate Limits:</strong> Public APIs have rate limits. If you have many transactions,
                    syncing may take some time. Be patient and avoid syncing too frequently.
                </div>
            </div>
        </div>
    )
}
