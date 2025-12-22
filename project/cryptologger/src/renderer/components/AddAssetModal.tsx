import { useState } from 'react'
import Modal from './Modal'

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
            <form onSubmit={handleSubmit} className="terminal-form">
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
        </Modal>
    )
}
