-- Crypto Tax Logger Database Schema
-- SQLite database for storing trades, wallets, and tax calculations

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value) VALUES 
    ('tax_method', 'FIFO'),
    ('base_currency', 'AUD'),
    ('theme', 'dark'),
    ('auto_sync', 'false');

-- API Keys table (encrypted storage)
CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exchange TEXT NOT NULL UNIQUE,
    api_key TEXT NOT NULL,
    api_secret TEXT NOT NULL,
    encrypted BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chain TEXT NOT NULL, -- 'BTC', 'SOL', 'ETH'
    address TEXT NOT NULL,
    label TEXT,
    is_active BOOLEAN DEFAULT 1,
    last_synced DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chain, address)
);

CREATE INDEX idx_wallets_chain ON wallets(chain);
CREATE INDEX idx_wallets_active ON wallets(is_active);

-- Trades table (unified for exchange and wallet transactions)
CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL, -- 'bybit', 'manual', 'wallet_btc', 'wallet_sol', 'wallet_eth'
    source_id TEXT, -- External ID from exchange/blockchain
    trade_type TEXT NOT NULL, -- 'buy', 'sell', 'swap', 'transfer_in', 'transfer_out'
    timestamp DATETIME NOT NULL,
    
    -- Asset information
    base_asset TEXT NOT NULL, -- e.g., 'BTC', 'ETH', 'SOL'
    quote_asset TEXT, -- e.g., 'USDT', 'AUD' (null for transfers)
    
    -- Amounts
    base_amount REAL NOT NULL,
    quote_amount REAL,
    price REAL, -- Price per unit
    
    -- Fees
    fee_amount REAL DEFAULT 0,
    fee_asset TEXT,
    
    -- Additional data
    wallet_id INTEGER,
    notes TEXT,
    raw_data TEXT, -- JSON of original data
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (wallet_id) REFERENCES wallets(id),
    UNIQUE(source, source_id)
);

CREATE INDEX idx_trades_timestamp ON trades(timestamp);
CREATE INDEX idx_trades_source ON trades(source);
CREATE INDEX idx_trades_base_asset ON trades(base_asset);
CREATE INDEX idx_trades_type ON trades(trade_type);

-- Tax lots table (for cost basis tracking)
CREATE TABLE IF NOT EXISTS tax_lots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset TEXT NOT NULL,
    acquisition_date DATETIME NOT NULL,
    acquisition_trade_id INTEGER NOT NULL,
    
    -- Original amounts
    original_amount REAL NOT NULL,
    remaining_amount REAL NOT NULL,
    
    -- Cost basis
    cost_basis_per_unit REAL NOT NULL, -- In base currency (AUD)
    total_cost_basis REAL NOT NULL,
    
    -- Disposal tracking
    is_fully_disposed BOOLEAN DEFAULT 0,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (acquisition_trade_id) REFERENCES trades(id)
);

CREATE INDEX idx_tax_lots_asset ON tax_lots(asset);
CREATE INDEX idx_tax_lots_date ON tax_lots(acquisition_date);
CREATE INDEX idx_tax_lots_disposed ON tax_lots(is_fully_disposed);

-- Tax disposals table (records of sales/swaps for tax purposes)
CREATE TABLE IF NOT EXISTS tax_disposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    disposal_trade_id INTEGER NOT NULL,
    tax_lot_id INTEGER NOT NULL,
    
    -- Disposal details
    disposal_date DATETIME NOT NULL,
    asset TEXT NOT NULL,
    amount REAL NOT NULL,
    
    -- Financial calculations
    proceeds REAL NOT NULL, -- Sale price in AUD
    cost_basis REAL NOT NULL, -- Original cost in AUD
    capital_gain REAL NOT NULL, -- proceeds - cost_basis
    
    -- Tax treatment
    holding_period_days INTEGER,
    qualifies_for_discount BOOLEAN DEFAULT 0, -- 50% CGT discount if held >12 months
    is_personal_use BOOLEAN DEFAULT 0, -- Personal use exemption
    
    financial_year TEXT, -- e.g., '2024-2025'
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (disposal_trade_id) REFERENCES trades(id),
    FOREIGN KEY (tax_lot_id) REFERENCES tax_lots(id)
);

CREATE INDEX idx_tax_disposals_fy ON tax_disposals(financial_year);
CREATE INDEX idx_tax_disposals_date ON tax_disposals(disposal_date);

-- Export history table
CREATE TABLE IF NOT EXISTS export_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    export_type TEXT NOT NULL, -- 'csv', 'json', 'pdf'
    financial_year TEXT,
    file_path TEXT,
    record_count INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_export_history_date ON export_history(created_at);
