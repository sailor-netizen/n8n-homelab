import { useState } from 'react'
import Modal from './Modal'
import TradingViewSymbolInfo from './TradingViewSymbolInfo'

interface AddAssetModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (symbol: string, name: string, type: 'crypto' | 'stock') => void
}

export default function AddAssetModal({ isOpen, onClose, onAdd }: AddAssetModalProps) {
    const [symbol, setSymbol] = useState('')
    const [name, setName] = useState('')
    const [type, setType] = useState<'crypto' | 'stock'>('crypto')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (symbol && name) {
            onAdd(symbol.toUpperCase(), name, type)
            setSymbol('')
            setName('')
            onClose()
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Initialize New Market Node">
            <div style={{ display: 'flex', gap: '20px' }}>
                <form onSubmit={handleSubmit} className="terminal-form" style={{ flex: '1' }}>
                    <div className="form-group">
                        <label>NODE_SYMBOL</label>
                        <input
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="e.g. BTC, AAPL, TSLA"
                            required
                            className="terminal-input"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label>NODE_LABEL</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Bitcoin, Apple Inc"
                            required
                            className="terminal-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>NODE_TYPE</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="terminal-input"
                        >
                            <option value="crypto">CRYPTO_ASSET</option>
                            <option value="stock">EQUITY_STOCK</option>
                        </select>
                    </div>

                    <div className="modal-footer mt-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            CANCEL
                        </button>
                        <button type="submit" className="btn btn-primary">
                            INITIALIZE_NODE
                        </button>
                    </div>
                </form>

                <div className="symbol-preview-pane" style={{ width: '300px', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div className="preview-label" style={{ background: 'var(--color-surface)', padding: '5px 10px', fontSize: '0.6rem', borderBottom: '1px solid var(--color-border)' }}>
                        NEURAL_VERIFICATION
                    </div>
                    <div className="preview-content" style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {symbol.length >= 2 ? (
                            <TradingViewSymbolInfo symbol={symbol} />
                        ) : (
                            <div className="text-muted" style={{ fontSize: '0.7rem', textAlign: 'center' }}>
                                AWAITING_SYMBOL_INPUT...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
}
