import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TradeHistory from './pages/TradeHistory'
import ManualEntry from './pages/ManualEntry'
import Wallets from './pages/Wallets'
import Settings from './pages/Settings'
import Reports from './pages/Reports'

function App() {
    return (
        <Router>
            <div className="app">
                <Sidebar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/trades" element={<TradeHistory />} />
                        <Route path="/manual-entry" element={<ManualEntry />} />
                        <Route path="/wallets" element={<Wallets />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

function Sidebar() {
    const location = useLocation()

    const navItems = [
        { path: '/', icon: '📊', label: 'Dashboard' },
        { path: '/trades', icon: '📈', label: 'Trade History' },
        { path: '/manual-entry', icon: '✏️', label: 'Manual Entry' },
        { path: '/wallets', icon: '👛', label: 'Wallets' },
        { path: '/reports', icon: '📄', label: 'Reports' },
        { path: '/settings', icon: '⚙️', label: 'Settings' }
    ]

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1 className="app-title">💰 Crypto Tax Logger</h1>
                <p className="app-subtitle">Australian Tax Compliance</p>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p className="disclaimer">
                    ⚠️ This tool is for record-keeping only. Consult a tax professional for advice.
                </p>
            </div>
        </aside>
    )
}

export default App
