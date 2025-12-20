import { DatabaseManager, Trade } from '../../database/database'
import { TaxCalculator } from '../tax-calculator'

export class FIFOCalculator {
    private db: DatabaseManager

    constructor(db: DatabaseManager) {
        this.db = db
    }

    async processAllTrades(trades: Trade[]): Promise<void> {
        // Sort trades by timestamp (oldest first)
        const sortedTrades = trades.sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )

        for (const trade of sortedTrades) {
            await this.processTrade(trade)
        }
    }

    private async processTrade(trade: Trade): Promise<void> {
        const isAcquisition = trade.trade_type === 'buy' || trade.trade_type === 'transfer_in'
        const isDisposal = trade.trade_type === 'sell' || trade.trade_type === 'transfer_out'

        if (isAcquisition) {
            await this.processAcquisition(trade)
        } else if (isDisposal) {
            await this.processDisposal(trade)
        } else if (trade.trade_type === 'swap') {
            // Swap is both a disposal and acquisition
            await this.processDisposal(trade) // Dispose of base asset
            // TODO: Handle acquisition of quote asset
        }
    }

    private async processAcquisition(trade: Trade): Promise<void> {
        // Calculate cost basis in AUD
        let costBasisPerUnit = 0

        if (trade.quote_asset === 'AUD') {
            costBasisPerUnit = trade.price || 0
        } else if (trade.quote_amount && trade.base_amount) {
            // If not in AUD, we'd need to convert (simplified here)
            // In production, you'd fetch historical exchange rates
            costBasisPerUnit = trade.quote_amount / trade.base_amount
        }

        const totalCostBasis = costBasisPerUnit * trade.base_amount

        // Create tax lot
        this.db.addTaxLot({
            asset: trade.base_asset,
            acquisition_date: trade.timestamp,
            acquisition_trade_id: trade.id,
            original_amount: trade.base_amount,
            remaining_amount: trade.base_amount,
            cost_basis_per_unit: costBasisPerUnit,
            total_cost_basis: totalCostBasis
        })
    }

    private async processDisposal(trade: Trade): Promise<void> {
        let remainingToDispose = trade.base_amount
        const financialYear = TaxCalculator.getFinancialYear(new Date(trade.timestamp))

        // Calculate proceeds in AUD
        let proceedsAUD = 0
        if (trade.quote_asset === 'AUD') {
            proceedsAUD = trade.quote_amount || 0
        } else if (trade.quote_amount) {
            // Simplified: In production, convert to AUD using historical rates
            proceedsAUD = trade.quote_amount
        }

        // Get available tax lots for this asset (FIFO: oldest first)
        const taxLots = this.db.getTaxLots(trade.base_asset, true)

        for (const lot of taxLots) {
            if (remainingToDispose <= 0) break

            const amountFromThisLot = Math.min(remainingToDispose, lot.remaining_amount)
            const costBasisForThisDisposal = amountFromThisLot * lot.cost_basis_per_unit
            const proceedsForThisDisposal = (proceedsAUD / trade.base_amount) * amountFromThisLot

            // Calculate holding period
            const acquisitionDate = new Date(lot.acquisition_date)
            const disposalDate = new Date(trade.timestamp)
            const holdingPeriodDays = Math.floor(
                (disposalDate.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24)
            )

            // Calculate capital gain/loss
            const capitalGain = proceedsForThisDisposal - costBasisForThisDisposal

            // Check for personal use exemption and CGT discount
            const isPersonalUse = TaxCalculator.isPersonalUse(proceedsForThisDisposal)
            const qualifiesForDiscount = TaxCalculator.qualifiesForCGTDiscount(holdingPeriodDays)

            // Record disposal
            this.db.addTaxDisposal({
                disposal_trade_id: trade.id,
                tax_lot_id: lot.id,
                disposal_date: trade.timestamp,
                asset: trade.base_asset,
                amount: amountFromThisLot,
                proceeds: proceedsForThisDisposal,
                cost_basis: costBasisForThisDisposal,
                capital_gain: capitalGain,
                holding_period_days: holdingPeriodDays,
                qualifies_for_discount: qualifiesForDiscount,
                is_personal_use: isPersonalUse,
                financial_year: financialYear
            })

            // Update tax lot
            const newRemainingAmount = lot.remaining_amount - amountFromThisLot
            const isFullyDisposed = newRemainingAmount <= 0.00000001 // Account for floating point

            this.db.updateTaxLot(lot.id, newRemainingAmount, isFullyDisposed)

            remainingToDispose -= amountFromThisLot
        }

        if (remainingToDispose > 0.00000001) {
            console.warn(
                `Warning: Insufficient tax lots for ${trade.base_asset}. ` +
                `Remaining to dispose: ${remainingToDispose}`
            )
        }
    }
}
