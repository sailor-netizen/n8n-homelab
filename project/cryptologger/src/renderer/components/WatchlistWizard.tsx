import { useState } from 'react';

interface Archetype {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    symbols: { symbol: string; name: string }[];
}

const ALL_ARCHETYPES: Archetype[] = [
    {
        id: 'ai',
        name: 'AI_&_DATA_PROTOCOLS',
        description: 'Advanced machine learning and data processing networks.',
        icon: '🧠',
        color: 'var(--color-cyan)',
        symbols: [
            { symbol: 'FET', name: 'Fetch.ai' },
            { symbol: 'RNDR', name: 'Render Token' },
            { symbol: 'AGIX', name: 'SingularityNET' },
            { symbol: 'OCEAN', name: 'Ocean Protocol' }
        ]
    },
    {
        id: 'defi',
        name: 'DEFI_&_BANKING',
        description: 'Decentralized exchanges and financial lending platforms.',
        icon: '🏦',
        color: 'var(--color-green)',
        symbols: [
            { symbol: 'UNI', name: 'Uniswap' },
            { symbol: 'AAVE', name: 'Aave' },
            { symbol: 'MKR', name: 'Maker' },
            { symbol: 'CRV', name: 'Curve DAO' }
        ]
    },
    {
        id: 'metaverse',
        name: 'METAVERSE_&_GAMING',
        description: 'Virtual economies, digital land, and gaming tokens.',
        icon: '🌐',
        color: 'var(--color-pink)',
        symbols: [
            { symbol: 'MANA', name: 'Decentraland' },
            { symbol: 'SAND', name: 'The Sandbox' },
            { symbol: 'AXS', name: 'Axie Infinity' },
            { symbol: 'ENJ', name: 'Enjin Coin' }
        ]
    },
    {
        id: 'legacy',
        name: 'BLUE_CHIP_ASSETS',
        description: 'Large-cap foundational assets with high market trust.',
        icon: '🏛️',
        color: 'var(--color-yellow)',
        symbols: [
            { symbol: 'BTC', name: 'Bitcoin' },
            { symbol: 'ETH', name: 'Ethereum' },
            { symbol: 'SOL', name: 'Solana' },
            { symbol: 'XRP', name: 'XRP' }
        ]
    },
    {
        id: 'privacy',
        name: 'PRIVACY_NETWORKS',
        description: 'Secure, anonymity-focused digital cash and protocols.',
        icon: '🕵️',
        color: '#9c27b0',
        symbols: [
            { symbol: 'XMR', name: 'Monero' },
            { symbol: 'ZEC', name: 'Zcash' },
            { symbol: 'DASH', name: 'Dash' },
            { symbol: 'SCRT', name: 'Secret Network' }
        ]
    },
    {
        id: 'web3',
        name: 'WEB3_INFRASTRUCTURE',
        description: 'Decentralized storage and data connectivity layers.',
        icon: '🛰️',
        color: '#03a9f4',
        symbols: [
            { symbol: 'LINK', name: 'Chainlink' },
            { symbol: 'FIL', name: 'Filecoin' },
            { symbol: 'GRT', name: 'The Graph' },
            { symbol: 'AR', name: 'Arweave' }
        ]
    }
];

interface WatchlistWizardProps {
    onClose: () => void;
    onDeploy: (name: string, symbols: { symbol: string; name: string }[]) => Promise<void>;
}

export default function WatchlistWizard({ onClose, onDeploy }: WatchlistWizardProps) {
    const [step, setStep] = useState<'archetype' | 'config' | 'deploying' | 'complete'>('archetype');
    const [displayArchetypes, setDisplayArchetypes] = useState<Archetype[]>(ALL_ARCHETYPES.slice(0, 4));
    const [customName, setCustomName] = useState('');
    const [tempSymbols, setTempSymbols] = useState<{ symbol: string; name: string }[]>([]);
    const [newSymbol, setNewSymbol] = useState('');
    const [newName, setNewName] = useState('');
    const [deployProgress, setDeployProgress] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false);

    const handleArchetypeSelect = (arch: Archetype) => {
        setCustomName(arch.name);
        setTempSymbols([...arch.symbols]);
        setStep('config');
    };

    const handleAddTicker = () => {
        if (!newSymbol.trim()) return;
        setTempSymbols([...tempSymbols, {
            symbol: newSymbol.toUpperCase(),
            name: newName.trim() || newSymbol.toUpperCase()
        }]);
        setNewSymbol('');
        setNewName('');
    };

    const handleRemoveTicker = (symbol: string) => {
        setTempSymbols(tempSymbols.filter(s => s.symbol !== symbol));
    };

    const handleRecalibrate = () => {
        setIsShuffling(true);
        setTimeout(() => {
            const shuffled = [...ALL_ARCHETYPES].sort(() => 0.5 - Math.random());
            setDisplayArchetypes(shuffled.slice(0, 4));
            setIsShuffling(false);
        }, 600);
    };

    const handleDeploy = async () => {
        if (!customName.trim()) return;
        setStep('deploying');

        // Simulating boot sequence
        for (let i = 0; i <= 100; i += 5) {
            setDeployProgress(i);
            await new Promise(r => setTimeout(r, 50));
        }

        await onDeploy(customName, tempSymbols);
        setStep('complete');
    };

    return (
        <div className="wizard-modal-overlay">
            <div className="wizard-modal-container">
                <button className="wizard-close-btn" onClick={onClose}>×</button>

                <div className="wizard-header">
                    <h2 className="text-cyan">WATCHLIST_CREATION_PORTAL</h2>
                    <div className="text-muted text-xs uppercase letter-spacing-1">MISSION_ASSET_INITIALIZATION</div>
                </div>

                <div className="wizard-body thin-scrollbar">
                    {step === 'archetype' && (
                        <div className="wizard-sub-header">
                            <button
                                className={`terminal-btn btn-xs recalibrate-btn ${isShuffling ? 'active' : ''}`}
                                onClick={handleRecalibrate}
                                disabled={isShuffling}
                            >
                                <span className="refresh-icon">↻</span> REFRESH_OPTIONS
                            </button>
                        </div>
                    )}

                    <div className="wizard-content">
                        {step === 'archetype' && (
                            <div className={`archetype-grid ${isShuffling ? 'shuffling' : ''}`}>
                                {displayArchetypes.map((arch: Archetype) => (
                                    <div
                                        key={arch.id}
                                        className="archetype-card"
                                        style={{ '--accent-color': arch.color } as any}
                                        onClick={() => handleArchetypeSelect(arch)}
                                    >
                                        <div className="arch-icon">{arch.icon}</div>
                                        <div className="arch-info">
                                            <div className="arch-name">{arch.name}</div>
                                            <div className="arch-desc text-muted text-xs">{arch.description}</div>
                                        </div>
                                        <div className="arch-tickers">
                                            {arch.symbols.map((s: { symbol: string; name: string }) => (
                                                <span key={s.symbol} className="symbol-pill">{s.symbol}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="archetype-card custom" onClick={() => {
                                    setCustomName('NEW_WATCHLIST_01');
                                    setTempSymbols([]);
                                    setStep('config');
                                }}>
                                    <div className="arch-icon">➕</div>
                                    <div className="arch-info">
                                        <div className="arch-name">CREATE_FROM_SCRATCH</div>
                                        <div className="arch-desc text-muted text-xs">Start with a blank list and add your own tickers manually.</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'config' && (
                            <div className="config-view">
                                <div className="input-group">
                                    <label className="text-muted text-xs">WATCHLIST_NAME</label>
                                    <input
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && tempSymbols.length > 0 && handleDeploy()}
                                        className="terminal-input-large"
                                        autoFocus
                                    />
                                </div>

                                <div className="preview-section">
                                    <div className="text-muted text-xs mb-2">WATCHLIST_PREVIEW</div>
                                    <div className="symbols-preview thin-scrollbar">
                                        {tempSymbols.map(s => (
                                            <div key={s.symbol} className="preview-item">
                                                <div className="preview-ticker-info">
                                                    <span className="text-cyan">{s.symbol}</span>
                                                    <span className="text-muted">_IN_TEMPLATE</span>
                                                </div>
                                                <button
                                                    className="remove-ticker-btn"
                                                    onClick={() => handleRemoveTicker(s.symbol)}
                                                    title="Remove Ticker"
                                                >[×]</button>
                                            </div>
                                        ))}
                                        {tempSymbols.length === 0 && (
                                            <div className="empty-preview text-muted">AWAITING_MANUAL_SELECTION</div>
                                        )}
                                    </div>
                                </div>

                                <div className="injection-console">
                                    <div className="text-muted text-xs mb-2">TICKER_INJECTION_CONSOLE</div>
                                    <div className="injection-inputs">
                                        <input
                                            type="text"
                                            placeholder="SYMBOL"
                                            value={newSymbol}
                                            onChange={(e) => setNewSymbol(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTicker()}
                                            className="terminal-input-small"
                                        />
                                        <input
                                            type="text"
                                            placeholder="NAME (OPTIONAL)"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTicker()}
                                            className="terminal-input-small"
                                        />
                                        <button className="terminal-btn btn-xs" onClick={handleAddTicker}>[INJECT]</button>
                                    </div>
                                </div>

                                <div className="wizard-actions">
                                    <button className="terminal-btn btn-secondary" onClick={() => setStep('archetype')}>[BACK]</button>
                                    <button className="terminal-btn btn-primary" onClick={handleDeploy}>[CREATE_WATCHLIST]</button>
                                </div>
                            </div>
                        )}

                        {step === 'deploying' && (
                            <div className="deploy-view">
                                <div className="boot-sequence">
                                    <div className="matrix-text">
                                        INITIALIZING_WATCHLIST... OK<br />
                                        CONNECTING_TO_MARKET_DATA... OK<br />
                                        PREPARING_TICKER_FEED... {deployProgress}%<br />
                                        SYNCING_LIVE_PRICES... {deployProgress > 50 ? 'OK' : 'WAITING'}
                                    </div>
                                    <div className="boot-progress-container">
                                        <div className="boot-progress-bar" style={{ width: `${deployProgress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'complete' && (
                            <div className="completion-view">
                                <div className="success-icon-large">✓</div>
                                <h3 className="text-cyan mb-2">DEPLOYMENT_SUCCESSFUL</h3>
                                <p className="text-muted text-sm mb-4">
                                    Watchlist <span className="text-cyan">"{customName}"</span> has been successfully initialized with {tempSymbols.length} tickers.
                                </p>

                                <div className="deployment-summary">
                                    {tempSymbols.slice(0, 8).map(s => (
                                        <span key={s.symbol} className="summary-pill">{s.symbol}</span>
                                    ))}
                                    {tempSymbols.length > 8 && <span className="summary-pill text-muted">+{tempSymbols.length - 8}</span>}
                                </div>

                                <button className="terminal-btn btn-primary btn-large glow-cyan mt-6" onClick={onClose}>
                                    [ DONE ]
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
