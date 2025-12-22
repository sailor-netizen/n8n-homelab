import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import TradingViewChart from '../../components/TradingViewChart'

export default function ChartsPage() {
    const [searchParams] = useSearchParams()
    const urlSymbol = searchParams.get('symbol')

    const [activeSymbol, setActiveSymbol] = useState(urlSymbol || 'BTC')
    const [showSidebar, setShowSidebar] = useState(true)
    const [watchlist, setWatchlist] = useState<any[]>([])

    // Load watchlist for the sidebar
    useEffect(() => {
        const fetchData = async () => {
            const list = await window.api.getWatchlist()
            setWatchlist(list)
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (urlSymbol) setActiveSymbol(urlSymbol)
    }, [urlSymbol])

    return (
        <div className="page" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
                <div>
                    <h1 className="page-title">Intelligence Charts</h1>
                    <p className="page-description">TRADINGVIEW_WIDGET_ACTIVE: {activeSymbol}_VECTOR_SCAN</p>
                </div>

                <button
                    className="sidebar-toggle-btn"
                    onClick={() => setShowSidebar(!showSidebar)}
                >
                    {showSidebar ? '[ CLOSE_NAV ]' : '[ OPEN_NAV ]'}
                </button>
            </div>

            <div className="chart-layout" style={{ flex: 1, minHeight: 0 }}>
                <div className="chart-main-area" style={{ flex: 1, minHeight: 0 }}>
                    <TradingViewChart symbol={activeSymbol} />
                </div>

                <div className={`chart-watchlist-sidebar ${showSidebar ? '' : 'hidden'}`}>
                    <div className="sidebar-header" style={{ padding: '10px', fontSize: '0.6rem', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
                        NEURAL_WATCHLIST
                    </div>
                    <div className="sidebar-nav-list" style={{ overflowY: 'auto' }}>
                        {watchlist.map(item => (
                            <div
                                key={item.symbol}
                                className={`sidebar-nav-item ${activeSymbol === item.symbol ? 'active' : ''}`}
                                onClick={() => setActiveSymbol(item.symbol)}
                            >
                                <span className="symbol">{item.symbol}</span>
                                <span className="name" style={{ fontSize: '0.6rem', opacity: 0.5 }}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
