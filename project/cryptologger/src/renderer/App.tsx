import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import TradeHistory from './pages/TradeHistory'
import ManualEntry from './pages/ManualEntry'
import Wallets from './pages/Wallets'
import Settings from './pages/Settings'
import Reports from './pages/Reports'
import AIOracle from './pages/AIOracle'

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/trades" element={<TradeHistory />} />
                    <Route path="/manual-entry" element={<ManualEntry />} />
                    <Route path="/wallets" element={<Wallets />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/ai-oracle" element={<AIOracle />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
