import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import WatchlistPage from './pages/dashboard/WatchlistPage'
import ChartsPage from './pages/dashboard/ChartsPage'
import TradeHistory from './pages/TradeHistory'
import ManualEntry from './pages/ManualEntry'
import Wallets from './pages/Wallets'
import Reports from './pages/Reports'
import AIOracle from './pages/AIOracle'
import Settings from './pages/Settings'

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard">
                        <Route index element={<Navigate to="/" replace />} />
                        <Route path="watchlist" element={<WatchlistPage />} />
                        <Route path="charts" element={<ChartsPage />} />
                        <Route path="trending" element={<div>Trending Node: Under Construction</div>} />
                    </Route>
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
