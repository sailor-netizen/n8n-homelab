import { useState, useEffect } from 'react'
import AddAssetModal from '../../components/AddAssetModal'

interface WatchlistItem {
    id: number
    symbol: string
    name: string
    type: 'crypto' | 'stock'
}

export default function WatchlistPage() {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
    const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadWatchlist()
    }, [])

    const loadWatchlist = async () => {
        const list = await window.api.getWatchlist() as WatchlistItem[]
        setWatchlist(list)
        setLoading(false)
    }

    const handleAddAsset = async (symbol: string, name: string, type: 'crypto' | 'stock') => {
        await window.api.addWatchlistItem({ symbol, name, type })
        loadWatchlist()
    }

    const handleDeleteAsset = async (id: number) => {
        await window.api.deleteWatchlistItem(id)
        setWatchlist(prev => prev.filter(item => item.id !== id))
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Watchlist Manager</h1>
                <p className="page-description">SAVE_NODES: CONFIGURE_STRATEGIC_MONITORING_SUITE</p>
            </div>

            <div className="asset-grid mt-4" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '15px'
            }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div className="text-muted">ACCESSING_SECURE_STORAGE...</div>
                    </div>
                ) : (
                    <>
                        {watchlist.length === 0 ? (
                            <div className="asset-card" style={{ gridColumn: '1 / -1', padding: '40px', borderStyle: 'dashed', textAlign: 'center' }}>
                                <p className="text-muted">NO_NODES_CONFIGURED. INITIALIZE_SUITE_TO_BEGIN.</p>
                            </div>
                        ) : (
                            watchlist.map(asset => (
                                <div key={asset.id} className="asset-card" style={{
                                    padding: '20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid var(--color-border)',
                                    background: 'rgba(0,0,0,0.2)'
                                }}>
                                    <div className="asset-info">
                                        <div className="asset-symbol" style={{ color: 'var(--color-cyan)', fontWeight: 'bold' }}>{asset.symbol}</div>
                                        <div className="asset-name" style={{ fontSize: '0.7rem', opacity: 0.6 }}>{asset.name}</div>
                                        <div className="asset-type" style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>[{asset.type.toUpperCase()}]</div>
                                    </div>
                                    <button
                                        className="btn-link text-red"
                                        onClick={() => handleDeleteAsset(asset.id)}
                                        style={{ fontSize: '0.7rem' }}
                                    >
                                        [OFFLINE]
                                    </button>
                                </div>
                            ))
                        )}
                        <button className="asset-card btn-add-asset" onClick={() => setIsAddAssetModalOpen(true)} style={{ height: 'auto', padding: '20px', borderStyle: 'dashed' }}>
                            <span className="terminal-prompt">+</span> INITIALIZE_NEW_NODE
                        </button>
                    </>
                )}
            </div>

            <AddAssetModal
                isOpen={isAddAssetModalOpen}
                onClose={() => setIsAddAssetModalOpen(false)}
                onAdd={handleAddAsset}
            />
        </div>
    )
}
