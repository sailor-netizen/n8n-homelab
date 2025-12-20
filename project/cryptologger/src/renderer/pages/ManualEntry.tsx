import { useState } from 'react'

export default function ManualEntry() {
    const [formData, setFormData] = useState({
        tradeType: 'buy',
        baseAsset: '',
        quoteAsset: 'AUD',
        baseAmount: '',
        quoteAmount: '',
        price: '',
        feeAmount: '',
        feeAsset: '',
        timestamp: new Date().toISOString().slice(0, 16),
        notes: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setSuccess(false)

        try {
            const trade = {
                source: 'manual',
                trade_type: formData.tradeType,
                timestamp: new Date(formData.timestamp).toISOString(),
                base_asset: formData.baseAsset.toUpperCase(),
                quote_asset: formData.quoteAsset || null,
                base_amount: parseFloat(formData.baseAmount),
                quote_amount: formData.quoteAmount ? parseFloat(formData.quoteAmount) : null,
                price: formData.price ? parseFloat(formData.price) : null,
                fee_amount: formData.feeAmount ? parseFloat(formData.feeAmount) : 0,
                fee_asset: formData.feeAsset || null,
                notes: formData.notes || null
            }

            await window.api.addTrade(trade)
            setSuccess(true)

            // Reset form
            setFormData({
                tradeType: 'buy',
                baseAsset: '',
                quoteAsset: 'AUD',
                baseAmount: '',
                quoteAmount: '',
                price: '',
                feeAmount: '',
                feeAsset: '',
                timestamp: new Date().toISOString().slice(0, 16),
                notes: ''
            })

            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            console.error('Error adding trade:', error)
            alert('Failed to add trade. Please check your inputs.')
        } finally {
            setSubmitting(false)
        }
    }

    const calculateQuoteAmount = () => {
        if (formData.baseAmount && formData.price) {
            const amount = parseFloat(formData.baseAmount) * parseFloat(formData.price)
            setFormData({ ...formData, quoteAmount: amount.toFixed(2) })
        }
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Manual Trade Entry</h1>
                <p className="page-description">
                    Manually add trades that weren't automatically imported
                </p>
            </div>

            {success && (
                <div className="alert alert-success">
                    ✓ Trade added successfully!
                </div>
            )}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Trade Type *</label>
                        <select
                            className="form-select"
                            value={formData.tradeType}
                            onChange={(e) => setFormData({ ...formData, tradeType: e.target.value })}
                            required
                        >
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                            <option value="swap">Swap</option>
                            <option value="transfer_in">Transfer In</option>
                            <option value="transfer_out">Transfer Out</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Base Asset *</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., BTC, ETH, SOL"
                                value={formData.baseAsset}
                                onChange={(e) => setFormData({ ...formData, baseAsset: e.target.value.toUpperCase() })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Quote Asset</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., AUD, USDT"
                                value={formData.quoteAsset}
                                onChange={(e) => setFormData({ ...formData, quoteAsset: e.target.value.toUpperCase() })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Amount *</label>
                            <input
                                type="number"
                                step="any"
                                className="form-input"
                                placeholder="0.00000000"
                                value={formData.baseAmount}
                                onChange={(e) => setFormData({ ...formData, baseAmount: e.target.value })}
                                onBlur={calculateQuoteAmount}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Price per Unit</label>
                            <input
                                type="number"
                                step="any"
                                className="form-input"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                onBlur={calculateQuoteAmount}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Total Value</label>
                            <input
                                type="number"
                                step="any"
                                className="form-input"
                                placeholder="0.00"
                                value={formData.quoteAmount}
                                onChange={(e) => setFormData({ ...formData, quoteAmount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Fee Amount</label>
                            <input
                                type="number"
                                step="any"
                                className="form-input"
                                placeholder="0.00"
                                value={formData.feeAmount}
                                onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Fee Asset</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., BTC, AUD"
                                value={formData.feeAsset}
                                onChange={(e) => setFormData({ ...formData, feeAsset: e.target.value.toUpperCase() })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date & Time *</label>
                        <input
                            type="datetime-local"
                            className="form-input"
                            value={formData.timestamp}
                            onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Optional notes about this trade..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Adding...' : '✓ Add Trade'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => window.location.href = '/trades'}
                        >
                            View All Trades
                        </button>
                    </div>
                </form>
            </div>

            <div className="card mt-4">
                <div className="card-header">
                    <h2 className="card-title">Tips</h2>
                </div>

                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                    <li>For buys: Enter the amount of crypto purchased and the price paid</li>
                    <li>For sells: Enter the amount of crypto sold and the proceeds received</li>
                    <li>For transfers: Only the amount is required (no price needed)</li>
                    <li>Always use AUD for quote asset to simplify tax calculations</li>
                </ul>
            </div>
        </div>
    )
}
