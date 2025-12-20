// Shared types used across main and renderer processes

export interface Trade {
    id?: number
    source: string
    source_id?: string
    trade_type: 'buy' | 'sell' | 'swap' | 'transfer_in' | 'transfer_out'
    timestamp: string
    base_asset: string
    quote_asset?: string
    base_amount: number
    quote_amount?: number
    price?: number
    fee_amount?: number
    fee_asset?: string
    wallet_id?: number
    notes?: string
    raw_data?: string
}

export interface Wallet {
    id?: number
    chain: 'BTC' | 'SOL' | 'ETH'
    address: string
    label?: string
    is_active: boolean
    last_synced?: string
    created_at?: string
}

export interface Settings {
    tax_method: 'FIFO' | 'LIFO' | 'SPECIFIC_ID'
    base_currency: 'AUD' | 'USD'
    theme: 'dark' | 'light'
    auto_sync: 'true' | 'false'
}

export interface TaxSummary {
    financialYear: string
    totalCapitalGains: number
    totalCapitalLosses: number
    netCapitalGain: number
    cgtDiscountAmount: number
    disposals: DisposalSummary[]
}

export interface DisposalSummary {
    date: string
    asset: string
    amount: number
    proceeds: number
    costBasis: number
    capitalGain: number
    holdingPeriodDays: number
    qualifiesForDiscount: boolean
    isPersonalUse: boolean
}
