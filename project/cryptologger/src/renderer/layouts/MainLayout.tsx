import { Link, useLocation, Outlet } from 'react-router-dom';
import { navItems } from '../config/nav';
import NodeToolbar from '../components/NodeToolbar';
import WalletConnectModal from '../components/WalletConnectModal';
import TradingViewTickerTape from '../components/TradingViewTickerTape';
import { useState } from 'react';


export function MainLayout() {
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

    return (
        <div className="terminal-window">
            <div className="terminal-header">
                <div className="terminal-controls">
                    <span className="control close" onClick={() => (window as any).api.close()}></span>
                    <span className="control minimize" onClick={() => (window as any).api.minimize()}></span>
                    <span className="control maximize" onClick={() => (window as any).api.maximize()}></span>
                </div>
                <div className="terminal-title">user@cryptologger:~/main</div>
            </div>
            <div className="terminal-body" style={{ display: 'flex', flexDirection: 'column' }}>
                <TradingViewTickerTape />
                <header className="console-nav">
                    <NodeToolbar onSyncClick={() => setIsWalletModalOpen(true)} />
                    <HubHeader />
                </header>
                <div className="console-main">
                    <SideNav />
                    <main className="main-content">
                        <div className="scanline"></div>
                        <Outlet />
                    </main>
                </div>
            </div>

            <WalletConnectModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
                onSuccess={() => { }}
            />
        </div>
    );
}

function SideNav() {
    const location = useLocation();
    const currentMain = navItems.find(item => {
        if (item.path === '/') return location.pathname === '/' || location.pathname.startsWith('/dashboard');
        return location.pathname.startsWith(item.path);
    });

    if (!currentMain?.subItems) return null;

    return (
        <aside className="sub-sidebar">
            <div className="sidebar-label">SUB_NODES</div>
            <nav className="sub-nav">
                {currentMain.subItems.map(sub => (
                    <Link
                        key={sub.path}
                        to={sub.path}
                        className={`sub-nav-item ${location.pathname === sub.path ? 'active' : ''}`}
                    >
                        <span className="terminal-prompt">::</span> {sub.label}
                    </Link>
                ))}
            </nav>
            <div className="sidebar-footer">
                <div className="scanline-mini"></div>
            </div>
        </aside>
    );
}

function HubHeader() {
    const location = useLocation();
    const currentItem = navItems.find(item => item.path === location.pathname);

    return (
        <div className="hub-meta">
            <div className="hub-title">
                <span className="text-muted">NODE_PATH:</span> {currentItem?.label || 'SYSTEM_ROOT'}
            </div>
            <div className="hub-status">
                <span className="status-dot"></span> SECURE_LINE_ACTIVE
            </div>
        </div>
    );
}

// Sidebar component removed as per Option 1 redesign
