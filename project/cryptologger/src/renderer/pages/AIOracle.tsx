import { useState } from 'react'

interface AIInsights {
    summary: string
    stats: {
        health: number
        efficiency: number
        danger: number
    }
    suggestions: string[]
}

interface Prediction {
    asset: string
    action: string
    zone: string
    confidence: number
}

export default function AIOracle() {
    const [insights, setInsights] = useState<AIInsights | null>(null)
    const [predictions, setPredictions] = useState<Prediction[]>([])
    const [analyzing, setAnalyzing] = useState(false)
    const [displayedText, setDisplayedText] = useState('')

    const runAnalysis = async () => {
        setAnalyzing(true)
        setDisplayedText('')
        try {
            const [newInsights, newPredictions] = await Promise.all([
                window.api.getAiInsights(),
                window.api.getAiPredictions()
            ])
            setInsights(newInsights)
            setPredictions(newPredictions)

            // Typewriter effect for summary
            let i = 0
            const text = newInsights.summary
            const interval = setInterval(() => {
                setDisplayedText(prev => prev + text[i])
                i++
                if (i >= text.length) clearInterval(interval)
            }, 30)
        } catch (error) {
            console.error('AI Analysis Error:', error)
        } finally {
            setAnalyzing(false)
        }
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">AI Oracle</h1>
                <p className="page-description">
                    Neural network analysis of your trading activity and market vectors
                </p>
            </div>

            <div className="card-grid mb-4">
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h2 className="card-title">Neural Output Stream</h2>
                    </div>
                    <div className="terminal-log" style={{ minHeight: '150px', background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', border: '1px solid var(--color-border)', fontFamily: 'monospace' }}>
                        {displayedText ? (
                            <div className="text-success">{displayedText}<span className="cursor-blink">_</span></div>
                        ) : (
                            <div className="text-muted">SYSTEM READY. AWAITING INPUT...</div>
                        )}
                    </div>
                    <button
                        className="btn btn-primary mt-3 w-100"
                        onClick={runAnalysis}
                        disabled={analyzing}
                    >
                        {analyzing ? 'SYNCING NEURAL PATHWAYS...' : '📡 RUN NEURAL ANALYSIS'}
                    </button>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">System Metrics</h2>
                    </div>
                    {insights ? (
                        <div className="metrics-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem' }}>PORTFOLIO HEALTH</span>
                                    <span className="text-cyan">{insights.stats.health}%</span>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${insights.stats.health}%`, background: 'var(--color-cyan)', boxShadow: '0 0 10px var(--color-cyan)' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem' }}>TRADE EFFICIENCY</span>
                                    <span className="text-pink">{insights.stats.efficiency}%</span>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${insights.stats.efficiency}%`, background: 'var(--color-pink)', boxShadow: '0 0 10px var(--color-pink)' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem' }}>RISK VECTOR</span>
                                    <span className="text-warning">{insights.stats.danger}%</span>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${insights.stats.danger}%`, background: 'var(--color-warning)', boxShadow: '0 0 10px var(--color-warning)' }}></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted py-4">NO DATA LOADED</div>
                    )}
                </div>
            </div>

            <div className="card-grid">
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h2 className="card-title">Data-Driven Suggestions</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {insights?.suggestions.map((suggestion, index) => (
                            <div key={index} className="alert alert-info" style={{ margin: 0, borderLeft: '4px solid var(--color-cyan)' }}>
                                <span className="text-cyan mr-2">»</span> {suggestion}
                            </div>
                        )) || (
                                <div className="text-center text-muted py-4">AWAITING ANALYSIS</div>
                            )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Neural Entry/Exit Ideation</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {predictions.length > 0 ? predictions.map((pred, index) => (
                            <div key={index} style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--color-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong className="text-cyan">{pred.asset}</strong>
                                    <span className={`badge ${pred.action === 'HOLD' ? 'badge-info' : pred.action === 'ACCUMULATE' ? 'badge-success' : 'badge-warning'}`}>
                                        {pred.action}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.75rem' }} className="text-muted">ZONE: {pred.zone}</div>
                                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>CONFIDENCE: {pred.confidence}%</div>
                            </div>
                        )) : (
                            <div className="text-center text-muted py-4">INSUFFICIENT VECTORS</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
