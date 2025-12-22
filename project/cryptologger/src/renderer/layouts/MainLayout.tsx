import { Link, useLocation, Outlet } from 'react-router-dom';
import { navItems } from '../config/nav';


export function MainLayout() {
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
            <div className="terminal-body">
                <HubHeader />
                <main className="main-content">
                    <div className="scanline"></div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function HubHeader() {
    const location = useLocation();
    const isDashboard = location.pathname === '/';

    if (isDashboard) return null;

    const currentItem = navItems.find(item => item.path === location.pathname);

    return (
        <header className="hub-header">
            <Link to="/" className="btn-hub-return">
                <span className="terminal-prompt">[</span> RET_HUB <span className="terminal-prompt">]</span>
            </Link>
            <div className="hub-title">
                <span className="text-muted">LOCATION:</span> {currentItem?.label || 'UNKNOWN_NODE'}
            </div>
            <div className="hub-status">
                <span className="status-dot"></span> SECURE_LINE
            </div>
        </header>
    );
}

// Sidebar component removed as per Option 1 redesign
