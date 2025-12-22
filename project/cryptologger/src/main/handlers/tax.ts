import { ipcMain } from 'electron';
import { DatabaseManager } from '../database/database';
import { TaxCalculator } from '../tax/tax-calculator';

export function setupTaxHandlers(db: DatabaseManager) {
    ipcMain.handle('tax:calculate', async (_, financialYear: string, method: string) => {
        const calculator = new TaxCalculator(db, method);
        return await calculator.calculateForFinancialYear(financialYear);
    });

    ipcMain.handle('tax:export', async (_, financialYear: string, format: string) => {
        const calculator = new TaxCalculator(db, 'FIFO');
        return await calculator.exportReport(financialYear, format as "csv" | "json" | "pdf");
    });
}
