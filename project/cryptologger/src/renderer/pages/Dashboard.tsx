import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import WalletConnectModal from '../components/WalletConnectModal'
import AddAssetModal from '../components/AddAssetModal'
import { navItems } from '../config/nav'

interface WatchlistItem {
    id: number
    symbol: string
    name: string
    type: 'crypto' | 'stock'
}

interface MarketData {
    symbol: string
    price: number
    change24h: number
    marketCap: number
    volume24h: number
    history: { time: number; value: number }[]
}

interface AssetAnalysis {
    symbol: string
    sentiment: string
    score: number
    verdict: string
    kpis: { rsi: number; volatility: string; support: string }
}

export default function Dashboard() {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
    const [marketData, setMarketData] = useState<Record<string, MarketData>>({})
    const [hoveredNode, setHoveredNode] = useState<string | null>(null)
    const [activeAsset, setActiveAsset] = useState<string | null>(null)
    const [analysis, setAnalysis] = useState<AssetAnalysis | null>(null)
    const [loading, setLoading] = useState(true)
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false)

    // Initial load
    useEffect(() => {
        const init = async () => {
            const list = await window.api.getWatchlist() as WatchlistItem[]
            setWatchlist(list)
            if (list.length > 0) {
                setActiveAsset(list[0].symbol)
                updateMarketData(list.map((i: WatchlistItem) => i.symbol))
            }
            setLoading(false)
        }
        init()
    }, [])

    // Polling for real-time data
    useEffect(() => {
        if (watchlist.length === 0) return

        const interval = setInterval(() => {
            updateMarketData(watchlist.map((i: WatchlistItem) => i.symbol))
        }, 5000)

        return () => clearInterval(interval)
    }, [watchlist])

    // Update analysis when active asset changes
    useEffect(() => {
        if (activeAsset) {
            window.api.analyzeAsset(activeAsset).then(setAnalysis)
        }
    }, [activeAsset])

    const updateMarketData = async (symbols: string[]) => {
        const data = await window.api.getMarketPrices(symbols)
        const dataMap: Record<string, MarketData> = {}
        data.forEach((item: MarketData) => {
            dataMap[item.symbol] = item
        })
        setMarketData((prev: Record<string, MarketData>) => ({ ...prev, ...dataMap }))
    }

    const handleNodeHover = (label: string | null) => {
        setHoveredNode(label)
    }

    const handleAddAsset = async (symbol: string, name: string, type: 'crypto' | 'stock') => {
        await window.api.addWatchlistItem({ symbol, name, type })
        const newList = await window.api.getWatchlist()
        setWatchlist(newList)
        setActiveAsset(symbol)
        updateMarketData([symbol])
    }

    const handleDeleteAsset = async (id: number) => {
        await window.api.deleteWatchlistItem(id)
        setWatchlist((prev: WatchlistItem[]) => prev.filter((item: WatchlistItem) => item.id !== id))
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Mainframe Console</h1>
                <p className="page-description">
                    {hoveredNode
                        ? `SCANNING NODE: ${hoveredNode.toUpperCase()}`
                        : 'MARKET_INTELLIGENCE: SECURE_LINE_ACTIVE'}
                </p>
            </div>

            {/* Compact Top Toolbar */}
            <div className="hub-toolbar">
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`node-tile-sm ${hoveredNode === item.label ? 'active' : ''}`}
                        style={{ '--tile-color': item.color, '--tile-color-rgb': item.color.replace('var(', '').replace(')', '') } as any}
                        onMouseEnter={() => handleNodeHover(item.label)}
                        onMouseLeave={() => handleNodeHover(null)}
                    >
                        <div className="tile-icon">{item.icon}</div>
                        <div className="tile-label">{item.label}</div>
                    </Link>
                ))}

                <div
                    className="node-tile-sm"
                    style={{ '--tile-color': 'var(--color-green)' } as any}
                    onClick={() => setIsWalletModalOpen(true)}
                >
                    <div className="tile-icon">🔌</div>
                    <div className="tile-label">SYNC</div>
                </div>
            </div>

            {/* Intelligence Canvas */}
            <div className="intelligence-canvas">
                <div className="asset-column">
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>BOOTING_MARKET_INTELLIGENCE...</p>
                        </div>
                    ) : (
                        <>
                            {watchlist.map(asset => {
                                const data = marketData[asset.symbol]
                                return (
                                    <div
                                        key={asset.symbol}
                                        className={`asset-card ${activeAsset === asset.symbol ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveAsset(asset.symbol)}
                                    >
                                        <div className="asset-id">
                                            <span className="asset-symbol">{asset.symbol}</span>
                                            <span className="asset-name">{asset.name}</span>
                                        </div>

                                        <div className="asset-kpis">
                                            <div className="asset-price">
                                                ${data?.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <div className={`asset-change ${data?.change24h >= 0 ? 'text-green' : 'text-red'}`}>
                                                    {data?.change24h >= 0 ? '▲' : '▼'} {Math.abs(data?.change24h || 0).toFixed(2)}%
                                                </div>
                                                <button
                                                    className="btn-link text-red"
                                                    style={{ fontSize: '0.6rem', padding: 0 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (asset.id) handleDeleteAsset(asset.id)
                                                    }}
                                                >
                                                    [DELETE]
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bar-chart-container">
                                            {data?.history?.map((h, i) => (
                                                <div
                                                    key={i}
                                                    className={`bar ${data.change24h < 0 ? 'negative' : ''}`}
                                                    style={{ height: `${(h.value / data.price) * 50}%` }}
                                                ></div>
                                            ))}
                                        </div>

                                        <div className="asset-status" style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                                            VOL: {(data?.volume24h / 1000000).toFixed(1)}M<br />
                                            MCAP: {(data?.marketCap / 1000000).toFixed(0)}M
                                        </div>
                                    </div>
                                )
                            })}

                            <button className="asset-card btn-add-asset" onClick={() => setIsAddAssetModalOpen(true)}>
                                <span className="terminal-prompt">+</span> ADD_NEW_NODE_TO_WATCHLIST
                            </button>
                        </>
                    )}
                </div>

                {/* AI Analysis Sidebar */}
                <div className="analysis-sidebar">
                    <div className="sidebar-section">
                        <h3 className="section-title text-cyan" style={{ fontSize: '0.8rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '5px' }}>
                            NEURAL_SNAPSHOT: {activeAsset}
                        </h3>
                        {analysis ? (
                            <div className="analysis-content mt-3">
                                <div className="sentiment-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={analysis.sentiment === 'BULLISH' ? 'text-green' : 'text-yellow'}>
                                        {analysis.sentiment}
                                    </span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-cyan)' }}>
                                        {analysis.score}%
                                    </span>
                                </div>
                                <p className="mt-3" style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: '1.4' }}>
                                    {analysis.verdict}
                                </p>

                                <div className="kpi-grid mt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div className="kpi-item">
                                        <div className="text-muted" style={{ fontSize: '0.6rem' }}>RSI (14)</div>
                                        <div className="text-cyan">{analysis.kpis.rsi}</div>
                                    </div>
                                    <div className="kpi-item">
                                        <div className="text-muted" style={{ fontSize: '0.6rem' }}>VOLATILITY</div>
                                        <div className="text-pink">{analysis.kpis.volatility}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted mt-3" style={{ fontSize: '0.8rem' }}>SELECT_NODE_FOR_ANALYSIS...</p>
                        )}
                    </div>

                    <div className="sidebar-section mt-auto" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                        <div className="text-muted" style={{ fontSize: '0.6rem' }}>MARKET_STATUS</div>
                        <div className="text-green" style={{ fontSize: '0.8rem' }}>● ALL_SYSTEMS_OPTIMAL</div>
                        <div className="scanline-mini" style={{ height: '2px', background: 'var(--color-cyan)', opacity: 0.2, marginTop: '5px' }}></div>
                    </div>
                </div>
            </div>

            <AddAssetModal
                isOpen={isAddAssetModalOpen}
                onClose={() => setIsAddAssetModalOpen(false)}
                onAdd={handleAddAsset}
            />

            <WalletConnectModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
                onSuccess={() => { }}
            />
        </div>
    )
}
