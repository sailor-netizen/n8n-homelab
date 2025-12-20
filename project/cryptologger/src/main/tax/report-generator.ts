import { app } from 'electron'
import { join } from 'path'
import { writeFileSync } from 'fs'
import { TaxSummary } from './tax-calculator'

export class ReportGenerator {
    generateCSV(summary: TaxSummary): string {
        const userDataPath = app.getPath('userData')
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const filename = `tax-report-${summary.financialYear}-${timestamp}.csv`
        const filepath = join(userDataPath, 'reports', filename)

        // CSV header
        let csv = 'Date,Asset,Amount,Proceeds (AUD),Cost Basis (AUD),Capital Gain (AUD),Holding Period (Days),CGT Discount Eligible,Personal Use\n'

        // Add each disposal
        for (const disposal of summary.disposals) {
            csv += [
                disposal.date,
                disposal.asset,
                disposal.amount,
                disposal.proceeds.toFixed(2),
                disposal.costBasis.toFixed(2),
                disposal.capitalGain.toFixed(2),
                disposal.holdingPeriodDays,
                disposal.qualifiesForDiscount ? 'Yes' : 'No',
                disposal.isPersonalUse ? 'Yes' : 'No'
            ].join(',') + '\n'
        }

        // Add summary
        csv += '\n'
        csv += `Total Capital Gains,${summary.totalCapitalGains.toFixed(2)}\n`
        csv += `Total Capital Losses,${summary.totalCapitalLosses.toFixed(2)}\n`
        csv += `CGT Discount Amount,${summary.cgtDiscountAmount.toFixed(2)}\n`
        csv += `Net Capital Gain,${summary.netCapitalGain.toFixed(2)}\n`

        writeFileSync(filepath, csv, 'utf-8')
        return filepath
    }

    generateJSON(summary: TaxSummary): string {
        const userDataPath = app.getPath('userData')
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const filename = `tax-report-${summary.financialYear}-${timestamp}.json`
        const filepath = join(userDataPath, 'reports', filename)

        writeFileSync(filepath, JSON.stringify(summary, null, 2), 'utf-8')
        return filepath
    }

    generatePDF(summary: TaxSummary): string {
        // PDF generation would require a library like pdfkit or puppeteer
        // For now, return a placeholder
        const userDataPath = app.getPath('userData')
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const filename = `tax-report-${summary.financialYear}-${timestamp}.pdf`
        const filepath = join(userDataPath, 'reports', filename)

        // TODO: Implement PDF generation
        console.warn('PDF generation not yet implemented')

        // For now, generate a text file as placeholder
        let content = `CRYPTO TAX REPORT\n`
        content += `Financial Year: ${summary.financialYear}\n\n`
        content += `SUMMARY\n`
        content += `=======\n`
        content += `Total Capital Gains: $${summary.totalCapitalGains.toFixed(2)} AUD\n`
        content += `Total Capital Losses: $${summary.totalCapitalLosses.toFixed(2)} AUD\n`
        content += `CGT Discount Amount: $${summary.cgtDiscountAmount.toFixed(2)} AUD\n`
        content += `Net Capital Gain: $${summary.netCapitalGain.toFixed(2)} AUD\n\n`
        content += `DISPOSALS\n`
        content += `=========\n`

        for (const disposal of summary.disposals) {
            content += `\nDate: ${disposal.date}\n`
            content += `Asset: ${disposal.asset}\n`
            content += `Amount: ${disposal.amount}\n`
            content += `Proceeds: $${disposal.proceeds.toFixed(2)} AUD\n`
            content += `Cost Basis: $${disposal.costBasis.toFixed(2)} AUD\n`
            content += `Capital Gain: $${disposal.capitalGain.toFixed(2)} AUD\n`
            content += `Holding Period: ${disposal.holdingPeriodDays} days\n`
            content += `CGT Discount: ${disposal.qualifiesForDiscount ? 'Yes' : 'No'}\n`
            content += `Personal Use: ${disposal.isPersonalUse ? 'Yes' : 'No'}\n`
            content += `---\n`
        }

        writeFileSync(filepath.replace('.pdf', '.txt'), content, 'utf-8')
        return filepath.replace('.pdf', '.txt')
    }
}
