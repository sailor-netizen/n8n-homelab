import { DatabaseManager, Trade } from '../database/database'
import { FIFOCalculator } from './methods/fifo-calculator'
import { LIFOCalculator } from './methods/lifo-calculator'
import { SpecificIDCalculator } from './methods/specific-id-calculator'
import { ReportGenerator } from './report-generator'

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

export class TaxCalculator {
    private db: DatabaseManager
    private method: string

    constructor(db: DatabaseManager, method: string = 'FIFO') {
        this.db = db
        this.method = method
    }

    async calculateForFinancialYear(financialYear: string): Promise<TaxSummary> {
        // Australian financial year: July 1 - June 30
        const [startYear, endYear] = financialYear.split('-').map(Number)
        const startDate = new Date(`${startYear}-07-01T00:00:00Z`)
        const endDate = new Date(`${endYear}-06-30T23:59:59Z`)

        // Get all trades up to end date (we need historical data for cost basis)
        const allTrades = this.db.getTrades({
            endDate: endDate.toISOString()
        })

        // Calculate disposals based on selected method
        let calculator
        switch (this.method) {
            case 'LIFO':
                calculator = new LIFOCalculator(this.db)
                break
            case 'SPECIFIC_ID':
                calculator = new SpecificIDCalculator(this.db)
                break
            case 'FIFO':
            default:
                calculator = new FIFOCalculator(this.db)
                break
        }

        await calculator.processAllTrades(allTrades)

        // Get disposals for this financial year
        const disposals = this.db.getTaxDisposals(financialYear)

        // Calculate summary
        let totalCapitalGains = 0
        let totalCapitalLosses = 0
        let cgtDiscountAmount = 0

        const disposalSummaries: DisposalSummary[] = []

        for (const disposal of disposals) {
            // Skip personal use exemption (transactions under $10,000 AUD)
            if (disposal.is_personal_use) continue

            let capitalGain = disposal.capital_gain

            // Apply 50% CGT discount for assets held > 12 months
            if (disposal.qualifies_for_discount && capitalGain > 0) {
                const discountAmount = capitalGain * 0.5
                cgtDiscountAmount += discountAmount
                capitalGain -= discountAmount
            }

            if (capitalGain > 0) {
                totalCapitalGains += capitalGain
            } else {
                totalCapitalLosses += Math.abs(capitalGain)
            }

            disposalSummaries.push({
                date: disposal.disposal_date,
                asset: disposal.asset,
                amount: disposal.amount,
                proceeds: disposal.proceeds,
                costBasis: disposal.cost_basis,
                capitalGain: disposal.capital_gain,
                holdingPeriodDays: disposal.holding_period_days,
                qualifiesForDiscount: disposal.qualifies_for_discount === 1,
                isPersonalUse: disposal.is_personal_use === 1
            })
        }

        const netCapitalGain = totalCapitalGains - totalCapitalLosses

        return {
            financialYear,
            totalCapitalGains,
            totalCapitalLosses,
            netCapitalGain,
            cgtDiscountAmount,
            disposals: disposalSummaries
        }
    }

    async exportReport(financialYear: string, format: 'csv' | 'json' | 'pdf'): Promise<string> {
        const summary = await this.calculateForFinancialYear(financialYear)
        const generator = new ReportGenerator()

        switch (format) {
            case 'csv':
                return generator.generateCSV(summary)
            case 'json':
                return generator.generateJSON(summary)
            case 'pdf':
                return generator.generatePDF(summary)
            default:
                throw new Error(`Unsupported format: ${format}`)
        }
    }

    /**
     * Determines the Australian financial year for a given date
     * FY runs from July 1 to June 30
     */
    static getFinancialYear(date: Date): string {
        const year = date.getFullYear()
        const month = date.getMonth() + 1 // 1-12

        if (month >= 7) {
            // July-December: FY is current year to next year
            return `${year}-${year + 1}`
        } else {
            // January-June: FY is previous year to current year
            return `${year - 1}-${year}`
        }
    }

    /**
     * Checks if a transaction qualifies for personal use exemption
     * Personal use: transaction value < $10,000 AUD
     */
    static isPersonalUse(proceedsAUD: number): boolean {
        return proceedsAUD < 10000
    }

    /**
     * Checks if asset qualifies for 50% CGT discount
     * Must be held for more than 12 months
     */
    static qualifiesForCGTDiscount(holdingPeriodDays: number): boolean {
        return holdingPeriodDays > 365
    }
}
