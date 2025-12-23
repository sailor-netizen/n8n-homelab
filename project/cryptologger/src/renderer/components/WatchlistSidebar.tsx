import { useState, useEffect, useMemo } from 'react';


interface WatchlistItem {
    id: number;
    symbol: string;
    name: string;
    type: 'crypto' | 'stock';
    added_at: string;
    perf?: string;
}

// Re-export wizard for the layout to use
export { default as WatchlistWizard } from './WatchlistWizard';

interface WatchlistSidebarProps {
    isOpen: boolean;
    activeAsset: string | null;
    activeListName: string;
    watchlists: string[];
    onAssetSelect: (symbol: string) => void;
    onListSelect: (name: string) => void;
    refreshWatchlists: () => Promise<void>;
    onOpenWizard: () => void;
    onClose: () => void;
}

export default function WatchlistSidebar({
    isOpen,
    activeAsset,
    activeListName,
    watchlists,
    onAssetSelect,
    onListSelect,
    refreshWatchlists,
    onOpenWizard,
    onClose
}: WatchlistSidebarProps) {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Only load if we have an active list
        if (activeListName) {
            loadItems(activeListName);
        }
    }, [activeListName]);

    const loadItems = async (name: string) => {
        const data = await (window as any).api.getWatchlist(name);
        const itemsWithPerf = data.map((item: any) => ({
            ...item,
            perf: (Math.random() * 10 - 5).toFixed(2)
        }));
        setItems(itemsWithPerf);
    };



    const handleDeleteItem = async (id: number) => {
        await (window as any).api.deleteWatchlistItem(id, activeListName);
        await loadItems(activeListName);
    };

    const handleDeleteList = async () => {
        if (activeListName === 'Default') {
            alert('SYSTEM_PROTECTED: DEFAULT_VECTOR_CANNOT_BE_TERMINATED');
            return;
        }

        const confirmed = window.confirm(`CRITICAL_ACTION: TERMINATE_VECTOR "${activeListName}"?`);
        if (confirmed) {
            await (window as any).api.deleteWatchlist(activeListName);
            await refreshWatchlists();
            onListSelect('Default');
        }
    };

    const filteredItems = useMemo(() => {
        return items.filter(item =>
            item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [items, searchQuery]);

    return (
        <aside className={`watchlist-sidebar ${!isOpen ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {/* Row 1: Brand/Context */}
                <div className="sidebar-brand">
                    <div className="sidebar-label">MARKET_WATCH</div>
                    <div className="sidebar-sublabel text-muted">LIVE_DATA_SYNC_ON</div>
                </div>

                {/* Row 2: Operation Actions */}
                <div className="sidebar-toolbar">
                    <button
                        className="toolbar-btn create"
                        onClick={onOpenWizard}
                        title="Initialize New Watchlist"
                    >
                        <span className="plus-icon">+</span> NEW_VECTOR
                    </button>
                    {activeListName !== 'Default' && (
                        <button
                            className="toolbar-btn terminate-list"
                            onClick={handleDeleteList}
                            title="Terminate Current Watchlist"
                        >
                            <span className="icon">🗑️</span>
                        </button>
                    )}
                    <button
                        className="toolbar-btn close"
                        onClick={onClose}
                        title="Close Watchlist"
                    >
                        <span className="close-icon">×</span>
                    </button>
                </div>

                {/* Row 3: Selector */}
                <div className="sidebar-selector-row">
                    <div className="label text-muted">ACTIVE_VECTOR:</div>
                    <select
                        className="vector-select-dropdown"
                        value={activeListName}
                        onChange={(e) => onListSelect(e.target.value)}
                    >
                        {watchlists.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Row 4: Search/Filter */}
            <div className="search-layer">
                <div className="terminal-prompt">{'>'}</div>
                <input
                    type="text"
                    placeholder="SEARCH_TICKERS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="asset-list scrolling-pane thin-scrollbar">
                {filteredItems.length === 0 ? (
                    <div className="empty-state">
                        <div className="pulse"></div>
                        <span>NO_ASSETS_ADDED_YET</span>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <div
                            key={item.id}
                            className={`asset-card ${activeAsset === item.symbol ? 'active' : ''}`}
                            onClick={() => onAssetSelect(item.symbol)}
                        >
                            <div className="asset-card-main">
                                <div className="asset-identity">
                                    <div className="ticker-icon-container">
                                        <img
                                            src={`https://s3-symbol-logo.tradingview.com/crypto/XTVC${item.symbol}.svg`}
                                            alt=""
                                            className="ticker-logo"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://s3-symbol-logo.tradingview.com/crypto/XTVC${item.symbol === 'BTC' ? 'BTC' : item.symbol === 'ETH' ? 'ETH' : 'GENERIC'}.svg`;
                                                (e.target as HTMLImageElement).onerror = null;
                                            }}
                                        />
                                    </div>
                                    <div className="symbol-info">
                                        <span className="asset-symbol">{item.symbol}</span>
                                        <span className="asset-name">{item.name}</span>
                                    </div>
                                </div>
                                <div className={`asset-metric ${parseFloat(item.perf!) >= 0 ? 'bullish' : 'bearish'}`}>
                                    {parseFloat(item.perf!) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(item.perf!))}%
                                </div>
                            </div>
                            <div className="asset-heatmap">
                                <div
                                    className="heatmap-bar"
                                    style={{
                                        width: `${Math.min(100, Math.abs(parseFloat(item.perf!)) * 20)}%`,
                                        opacity: 0.3 + (Math.abs(parseFloat(item.perf!)) / 10)
                                    }}
                                ></div>
                            </div>
                            <button
                                className="asset-action-btn delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteItem(item.id!);
                                }}
                            >TERMINATE</button>
                        </div>
                    ))
                )}
            </div>

            <div className="sidebar-footer">
                <div className="telemetry-bar">
                    <span className="text-cyan">Uptime: 99.9%</span>
                    <span className="text-muted">|</span>
                    <span className="text-yellow">RAM: 42MB</span>
                </div>
                <div className="scanline-mini"></div>
            </div>
        </aside>
    );
}
