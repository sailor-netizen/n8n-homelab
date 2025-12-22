import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface MarketData {
    symbol: string
    price: number
    change24h: number
    marketCap: number
    volume24h: number
    history: { time: number; value: number }[]
    volumeHistory?: { time: number; value: number }[]
    sentimentHistory?: { time: number; value: number }[]
}

interface TickerCardProps {
    asset: { id: number; symbol: string; name: string }
    data: MarketData | undefined
    isActive: boolean
    onSelect: () => void
    onDelete: (id: number) => void
    activeMetric?: 'PRICE' | 'VOLUME' | 'SENTIMENT'
}

export default function TickerCard({ asset, data, isActive, onSelect, onDelete, activeMetric = 'PRICE' }: TickerCardProps) {
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsDropdownOpen(!isDropdownOpen)
    }

    return (
        <div
            className={`asset-card ${isActive ? 'active' : ''}`}
            onMouseEnter={onSelect}
            onClick={onSelect}
            style={{ cursor: 'pointer' }}
        >
            <div className="asset-id">
                <span className="asset-symbol">{asset.symbol}</span>
                <span className="asset-name">{asset.name}</span>
            </div>

            <div className="asset-kpis">
                <div className="asset-price">
                    ${data?.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
                </div>
                <div className="asset-meta" style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
                    <div className={`asset-change ${data && data.change24h >= 0 ? 'text-green' : 'text-red'}`}>
                        {data && data.change24h >= 0 ? '▲' : '▼'} {Math.abs(data?.change24h || 0).toFixed(2)}%
                    </div>

                    <div
                        className={`dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                        onClick={toggleDropdown}
                        ref={dropdownRef}
                    >
                        ▼
                    </div>

                    {isDropdownOpen && (
                        <div className="asset-context-menu" onClick={(e) => e.stopPropagation()}>
                            <div className="menu-item" onClick={() => navigate(`/dashboard/charts?symbol=${asset.symbol}`)}>
                                [ VIEW_FULL_CHART ]
                            </div>
                            <div className="menu-item" onClick={() => navigate(`/dashboard/watchlist`)}>
                                [ CONFIGURE_NODE ]
                            </div>
                            <div className="menu-item text-red" onClick={() => {
                                onDelete(asset.id)
                                setIsDropdownOpen(false)
                            }}>
                                [ REMOVE_NODE ]
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bar-chart-container">
                {(() => {
                    const history = activeMetric === 'VOLUME' ? data?.volumeHistory :
                        activeMetric === 'SENTIMENT' ? data?.sentimentHistory :
                            data?.history;

                    const slice = history?.slice(-20) || [];

                    return slice.map((h, i) => {
                        let barClass = ''
                        let multiplier = 50
                        let denominator = data?.price || 1

                        if (activeMetric === 'PRICE') {
                            barClass = (data?.change24h || 0) < 0 ? 'negative' : ''
                        } else if (activeMetric === 'VOLUME') {
                            barClass = 'volume'
                            denominator = 50000000 // Max volume for normalization
                        } else if (activeMetric === 'SENTIMENT') {
                            barClass = 'sentiment'
                            denominator = 100 // Max sentiment
                        }

                        const height = (h.value / denominator) * multiplier

                        return (
                            <div
                                key={i}
                                className={`bar ${barClass}`}
                                style={{ height: `${height}%` }}
                            ></div>
                        )
                    })
                })()}
            </div>
        </div>
    )
}
