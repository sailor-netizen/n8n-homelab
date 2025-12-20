import { useState, useEffect } from 'react'

export default function Settings() {
    const [settings, setSettings] = useState({
        tax_method: 'FIFO',
        base_currency: 'AUD',
        theme: 'dark',
        auto_sync: 'false'
    })
    const [bybitKeys, setBybitKeys] = useState({
        apiKey: '',
        apiSecret: ''
    })
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState('')

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            const data = await window.api.getSettings()
            setSettings(data)
        } catch (error) {
            console.error('Error loading settings:', error)
        }
    }

    const saveSetting = async (key: string, value: string) => {
        try {
            await window.api.updateSetting(key, value)
            setSettings({ ...settings, [key]: value })
            showSuccess('Setting saved successfully')
        } catch (error) {
            console.error('Error saving setting:', error)
            alert('Failed to save setting')
        }
    }

    const saveBybitKeys = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            await window.api.saveBybitApiKey(bybitKeys.apiKey, bybitKeys.apiSecret)
            setBybitKeys({ apiKey: '', apiSecret: '' })
            showSuccess('Bybit API keys saved successfully')
        } catch (error) {
            console.error('Error saving Bybit keys:', error)
            alert('Failed to save API keys')
        } finally {
            setSaving(false)
        }
    }

    const fetchBybitTrades = async () => {
        if (!confirm('This will fetch all trades from Bybit. Continue?')) return

        setSaving(true)
        try {
            const count = await window.api.fetchBybitTrades()
            showSuccess(`Successfully imported ${count} trades from Bybit`)
        } catch (error) {
            console.error('Error fetching Bybit trades:', error)
            alert('Failed to fetch trades. Please check your API keys.')
        } finally {
            setSaving(false)
        }
    }

    const exportDatabase = async () => {
        try {
            const path = await window.api.exportDatabase()
            showSuccess(`Database exported to: ${path}`)
        } catch (error) {
            console.error('Error exporting database:', error)
            alert('Failed to export database')
        }
    }

    const showSuccess = (message: string) => {
        setSuccess(message)
        setTimeout(() => setSuccess(''), 3000)
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-description">
                    Configure your application preferences and integrations
                </p>
            </div>

            {success && (
                <div className="alert alert-success">
                    ✓ {success}
                </div>
            )}

            <div className="card mb-3">
                <div className="card-header">
                    <h2 className="card-title">Tax Calculation Settings</h2>
                </div>

                <div className="form-group">
                    <label className="form-label">Cost Basis Method</label>
                    <select
                        className="form-select"
                        value={settings.tax_method}
                        onChange={(e) => saveSetting('tax_method', e.target.value)}
                    >
                        <option value="FIFO">FIFO (First In, First Out)</option>
                        <option value="LIFO">LIFO (Last In, First Out)</option>
                        <option value="SPECIFIC_ID">Specific Identification</option>
                    </select>
                    <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Choose how to match cost basis when selling crypto. FIFO is most common.
                    </p>
                </div>

                <div className="form-group">
                    <label className="form-label">Base Currency</label>
                    <select
                        className="form-select"
                        value={settings.base_currency}
                        onChange={(e) => saveSetting('base_currency', e.target.value)}
                    >
                        <option value="AUD">AUD (Australian Dollar)</option>
                        <option value="USD">USD (US Dollar)</option>
                    </select>
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-header">
                    <h2 className="card-title">Bybit Integration</h2>
                </div>

                <div className="alert alert-warning">
                    <strong>Security:</strong> Create a READ-ONLY API key on Bybit for safety.
                    Your keys are encrypted and stored locally.
                </div>

                <form onSubmit={saveBybitKeys}>
                    <div className="form-group">
                        <label className="form-label">API Key</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter your Bybit API key..."
                            value={bybitKeys.apiKey}
                            onChange={(e) => setBybitKeys({ ...bybitKeys, apiKey: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">API Secret</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your Bybit API secret..."
                            value={bybitKeys.apiSecret}
                            onChange={(e) => setBybitKeys({ ...bybitKeys, apiSecret: e.target.value })}
                        />
                    </div>

                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : '✓ Save API Keys'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={fetchBybitTrades}
                            disabled={saving}
                        >
                            {saving ? 'Fetching...' : '⬇ Fetch Trades'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="card mb-3">
                <div className="card-header">
                    <h2 className="card-title">Application Settings</h2>
                </div>

                <div className="form-group">
                    <label className="form-label">Theme</label>
                    <select
                        className="form-select"
                        value={settings.theme}
                        onChange={(e) => saveSetting('theme', e.target.value)}
                    >
                        <option value="dark">Dark Mode</option>
                        <option value="light">Light Mode (Coming Soon)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Auto-Sync Wallets on Startup</label>
                    <select
                        className="form-select"
                        value={settings.auto_sync}
                        onChange={(e) => saveSetting('auto_sync', e.target.value)}
                    >
                        <option value="false">Disabled</option>
                        <option value="true">Enabled</option>
                    </select>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Data Management</h2>
                </div>

                <div className="alert alert-info">
                    <strong>Backup:</strong> Regularly export your database to keep a backup of your data.
                </div>

                <button className="btn btn-secondary" onClick={exportDatabase}>
                    💾 Export Database Backup
                </button>
            </div>
        </div>
    )
}
