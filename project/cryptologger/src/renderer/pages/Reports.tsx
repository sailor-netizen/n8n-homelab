import { useState } from 'react'

interface TaxSummary {
    financialYear: string
    totalCapitalGains: number
    totalCapitalLosses: number
    netCapitalGain: number
    cgtDiscountAmount: number
    disposals: any[]
}

export default function Reports() {
    const [financialYear, setFinancialYear] = useState(() => {
        const now = new Date()
        const year = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
        return `${year}-${year + 1}`
    })
    const [taxMethod, setTaxMethod] = useState('FIFO')
    const [summary, setSummary] = useState<TaxSummary | null>(null)
    const [loading, setLoading] = useState(false)
    const [exporting, setExporting] = useState(false)

    const generateReport = async () => {
        setLoading(true)
        try {
            const data = await window.api.calculateTax(financialYear, taxMethod)
            setSummary(data)
        } catch (error) {
            console.error('Error generating report:', error)
            alert('Failed to generate report')
        } finally {
            setLoading(false)
        }
    }

    const exportReport = async (format: 'csv' | 'json' | 'pdf') => {
        setExporting(true)
        try {
            const path = await window.api.exportTaxReport(financialYear, format)
            alert(`Report exported to: ${path}`)
        } catch (error) {
            console.error('Error exporting report:', error)
            alert('Failed to export report')
        } finally {
            setExporting(false)
        }
    }

    const getFinancialYearOptions = () => {
        const options = []
        const currentYear = new Date().getFullYear()
        for (let i = 0; i < 10; i++) {
            const year = currentYear - i
            options.push(`${year}-${year + 1}`)
        }
        return options
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Tax Reports</h1>
                <p className="page-description">
                    Generate tax reports for Australian financial years
                </p>
            </div>

            <div className="card mb-3">
                <div className="card-header">
                    <h2 className="card-title">Generate Report</h2>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Financial Year</label>
                        <select
                            className="form-select"
                            value={financialYear}
                            onChange={(e) => setFinancialYear(e.target.value)}
                        >
                            {getFinancialYearOptions().map(fy => (
                                <option key={fy} value={fy}>
                                    FY {fy} (July 1, {fy.split('-')[0]} - June 30, {fy.split('-')[1]})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Calculation Method</label>
                        <select
                            className="form-select"
                            value={taxMethod}
                            onChange={(e) => setTaxMethod(e.target.value)}
                        >
                            <option value="FIFO">FIFO</option>
                            <option value="LIFO">LIFO</option>
                            <option value="SPECIFIC_ID">Specific ID</option>
                        </select>
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={generateReport}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : '📊 Generate Report'}
                </button>
            </div>

            {summary && (
                <>
                    <div className="card-grid mb-3">
                        <div className="stat-card">
                            <div className="stat-label">Total Capital Gains</div>
                            <div className="stat-value text-success">
                                ${summary.totalCapitalGains.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-label">Total Capital Losses</div>
                            <div className="stat-value text-danger">
                                ${summary.totalCapitalLosses.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-label">CGT Discount</div>
                            <div className="stat-value">
                                ${summary.cgtDiscountAmount.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="stat-change text-muted">50% for assets held &gt;12 months</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-label">Net Capital Gain</div>
                            <div className={`stat-value ${summary.netCapitalGain >= 0 ? 'text-success' : 'text-danger'}`}>
                                ${Math.abs(summary.netCapitalGain).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className={`stat-change ${summary.netCapitalGain >= 0 ? 'positive' : 'negative'}`}>
                                {summary.netCapitalGain >= 0 ? 'Taxable Gain' : 'Loss'}
                            </div>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-header">
                            <h2 className="card-title">Export Report</h2>
                        </div>

                        <div className="btn-group">
                            <button
                                className="btn btn-success"
                                onClick={() => exportReport('csv')}
                                disabled={exporting}
                            >
                                📄 Export CSV
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={() => exportReport('json')}
                                disabled={exporting}
                            >
                                📄 Export JSON
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={() => exportReport('pdf')}
                                disabled={exporting}
                            >
                                📄 Export PDF
                            </button>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Disposals ({summary.disposals.length})</h2>
                        </div>

                        {summary.disposals.length === 0 ? (
                            <div className="text-center" style={{ padding: '3rem' }}>
                                <p className="text-muted">No disposals found for this financial year.</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Asset</th>
                                            <th>Amount</th>
                                            <th>Proceeds</th>
                                            <th>Cost Basis</th>
                                            <th>Capital Gain</th>
                                            <th>Holding Period</th>
                                            <th>CGT Discount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summary.disposals.map((disposal, index) => (
                                            <tr key={index}>
                                                <td>{new Date(disposal.date).toLocaleDateString('en-AU')}</td>
                                                <td><strong>{disposal.asset}</strong></td>
                                                <td>{disposal.amount.toFixed(8)}</td>
                                                <td>${disposal.proceeds.toFixed(2)}</td>
                                                <td>${disposal.costBasis.toFixed(2)}</td>
                                                <td className={disposal.capitalGain >= 0 ? 'text-success' : 'text-danger'}>
                                                    ${disposal.capitalGain.toFixed(2)}
                                                </td>
                                                <td>{disposal.holdingPeriodDays} days</td>
                                                <td>
                                                    {disposal.qualifiesForDiscount ? (
                                                        <span className="badge badge-success">Yes</span>
                                                    ) : (
                                                        <span className="badge badge-danger">No</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className="card mt-4">
                <div className="card-header">
                    <h2 className="card-title">Important Tax Information</h2>
                </div>

                <div className="alert alert-info">
                    <strong>Australian Financial Year:</strong> Runs from July 1 to June 30.
                </div>

                <div className="alert alert-warning">
                    <strong>Capital Gains Tax (CGT):</strong> Applies to crypto-to-crypto and crypto-to-fiat trades.
                    Assets held for more than 12 months qualify for a 50% CGT discount.
                </div>

                <div className="alert alert-info">
                    <strong>Personal Use Exemption:</strong> Transactions under $10,000 AUD may qualify for exemption
                    if the crypto was used for personal purposes.
                </div>

                <div className="alert alert-danger">
                    <strong>Disclaimer:</strong> This tool is for record-keeping purposes only and does not constitute
                    tax advice. Please consult with a qualified tax professional or accountant before lodging your tax return.
                </div>
            </div>
        </div>
    )
}
