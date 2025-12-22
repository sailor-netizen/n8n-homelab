import { Link, useLocation, Outlet } from 'react-router-dom';
import { navItems } from '../config/nav';
import { CSSProperties } from 'react';

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
                <Sidebar />
                <main className="main-content">
                    <div className="scanline"></div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function Sidebar() {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1 className="app-title">
                    <span style={{ color: 'var(--color-green)' }}>$</span> CRYPTO_LOGGER
                </h1>
                <p className="app-subtitle">v2.0.0 [STABLE]</p>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => {
                    const isActive = location.pathname === item.path;
                    const style = {
                        '--item-color': item.color,
                        borderColor: isActive ? item.color : 'transparent',
                        color: isActive ? item.color : 'var(--color-text-muted)'
                    } as CSSProperties;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            style={style}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            {isActive && <span className="cursor-blink">_</span>}
                        </Link>
                    )
                })}
            </nav>

            <div className="sidebar-footer">
                <p className="sys-status">
                    <span className="status-dot"></span> SYSTEM ONLINE
                </p>
            </div>
        </aside>
    );
}
