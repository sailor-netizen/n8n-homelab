import { DatabaseManager, Trade } from '../../database/database'

/**
 * Specific Identification Calculator
 * Allows user to manually specify which tax lot to use for each disposal
 * This is a placeholder - full implementation would require UI for lot selection
 */
export class SpecificIDCalculator {
    private db: DatabaseManager

    constructor(db: DatabaseManager) {
        this.db = db
    }

    async processAllTrades(trades: Trade[]): Promise<void> {
        // For now, fall back to FIFO behavior
        // In a full implementation, this would:
        // 1. Present available lots to the user
        // 2. Allow user to select which lot(s) to use
        // 3. Process based on user selection

        console.warn('Specific ID method requires manual lot selection - falling back to FIFO')

        const { FIFOCalculator } = await import('./fifo-calculator')
        const fifo = new FIFOCalculator(this.db)
        await fifo.processAllTrades(trades)
    }
}
