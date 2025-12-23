import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import TradingViewSymbolOverview from '../components/TradingViewSymbolOverview'
import TradingViewSymbolInfo from '../components/TradingViewSymbolInfo'
import TradingViewTechnicalAnalysis from '../components/TradingViewTechnicalAnalysis'

interface DashboardContext {
    activeAsset: string | null
    setActiveAsset: (symbol: string | null) => void
}

export default function Dashboard() {
    const { activeAsset, setActiveAsset } = useOutletContext<DashboardContext>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simplified boot sequence
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [])

    // Format symbols for TradingView Overview widget
    const formatTVSymbols = () => {
        return [
            ["Market Overview", [
                ["BINANCE:BTCUSDT"],
                ["BINANCE:ETHUSDT"],
                ["BINANCE:SOLUSDT"],
                ["BINANCE:SOLBTC"],
                ["INDEX:DXY"],
                ["BINANCE:XRPUSDT"]
            ]]
        ];
    }

    // Format symbols for TradingView Overview widget
    const formatTVSymbols = () => {
        const cryptos = watchlist.filter(i => i.type === 'crypto').map(i => [`BINANCE:${i.symbol}USDT`]);
        const stocks = watchlist.filter(i => i.type === 'stock').map(i => [`${i.symbol}`]);

        const tabs: [string, string[][]][] = [];
        if (cryptos.length > 0) tabs.push(["My Crypto", cryptos]);
        if (stocks.length > 0) tabs.push(["My Stocks", stocks]);

        // Add defaults if empty
        if (tabs.length === 0) {
            tabs.push(["Market Overview", [["BINANCE:BTCUSDT"], ["BINANCE:ETHUSDT"], ["INDEX:DXY"]]]);
        }

        return tabs;
    }

    return (
        <div className="page" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
                <div>
                    <h1 className="page-title">Mainframe Console</h1>
                    <p className="page-description">TRADINGVIEW_INTELLIGENCE: SECURE_LINE_ACTIVE</p>
                </div>
            </div>

            <div className="intelligence-canvas" style={{ flex: 1, minHeight: 0, display: 'flex', gap: '15px' }}>
                <div className="main-overview-area" style={{ flex: 1, background: 'rgba(0,0,0,0.4)', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>BOOTING_TRADINGVIEW_WIDGETS...</p>
                        </div>
                    ) : (
                        <TradingViewSymbolOverview symbols={formatTVSymbols() as any} />
                    )}
                </div>

                <div className="analysis-sidebar" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="sidebar-section" style={{ flex: '0 0 auto', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', border: '1px solid var(--color-border)', padding: '10px' }}>
                        <h3 className="section-title text-cyan" style={{ fontSize: '0.7rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '10px' }}>
                            NODE_INFO: {activeAsset || 'NONE'}
                        </h3>
                        {activeAsset ? (
                            <TradingViewSymbolInfo symbol={activeAsset} />
                        ) : (
                            <p className="text-muted" style={{ fontSize: '0.7rem' }}>SELECT_NODE_IN_OVERVIEW</p>
                        )}
                    </div>

                    <div className="sidebar-section" style={{ flex: '1', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', border: '1px solid var(--color-border)', padding: '10px', overflow: 'hidden' }}>
                        <h3 className="section-title text-cyan" style={{ fontSize: '0.7rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '10px' }}>
                            TECHNICAL_ANALYSIS
                        </h3>
                        {activeAsset ? (
                            <TradingViewTechnicalAnalysis symbol={activeAsset} />
                        ) : (
                            <p className="text-muted" style={{ fontSize: '0.7rem' }}>SCANNING_VECTORS...</p>
                        )}
                    </div>

                    <div className="sidebar-section mt-auto" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                        <div className="text-muted" style={{ fontSize: '0.6rem' }}>MARKET_STATUS</div>
                        <div className="text-green" style={{ fontSize: '0.8rem' }}>● TRADINGVIEW_WIDGETS_OPTIMAL</div>
                        <div className="scanline-mini" style={{ height: '2px', background: 'var(--color-cyan)', opacity: 0.2, marginTop: '5px' }}></div>
                    </div>
                </div>
            </div>

            <AddAssetModal
                isOpen={isAddAssetModalOpen}
                onClose={() => setIsAddAssetModalOpen(false)}
                onAdd={handleAddAsset}
            />
        </div>
    )
}
