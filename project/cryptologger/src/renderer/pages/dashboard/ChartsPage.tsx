import { useEffect } from 'react'
import { useSearchParams, useOutletContext } from 'react-router-dom'
import TradingViewChart from '../../components/TradingViewChart'

interface ChartsContext {
    activeAsset: string | null
    setActiveAsset: (symbol: string | null) => void
}

export default function ChartsPage() {
    const [searchParams] = useSearchParams()
    const urlSymbol = searchParams.get('symbol')
    const { activeAsset, setActiveAsset } = useOutletContext<ChartsContext>()

    useEffect(() => {
        if (urlSymbol) setActiveAsset(urlSymbol)
    }, [urlSymbol])

    return (
        <div className="page" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
                <div>
                    <h1 className="page-title">Intelligence Charts</h1>
                    <p className="page-description">TRADINGVIEW_WIDGET_ACTIVE: {activeAsset || 'NONE'}_VECTOR_SCAN</p>
                </div>
            </div>

            <div className="chart-layout" style={{ flex: 1, minHeight: 0 }}>
                <div className="chart-main-area" style={{ flex: 1, minHeight: 0 }}>
                    {activeAsset ? (
                        <TradingViewChart symbol={activeAsset} />
                    ) : (
                        <div className="loading-container">
                            <p className="text-muted">SELECT_NODE_FROM_WATCHLIST</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
