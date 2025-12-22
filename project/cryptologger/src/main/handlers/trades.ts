import { ipcMain } from 'electron';
import { DatabaseManager } from '../database/database';

export function setupTradeHandlers(db: DatabaseManager) {
    ipcMain.handle('db:get-trades', async (_, filters?: any) => {
        return db.getTrades(filters);
    });

    ipcMain.handle('db:add-trade', async (_, trade: any) => {
        return db.addTrade(trade);
    });

    ipcMain.handle('db:delete-trade', async (_, id: number) => {
        return db.deleteTrade(id);
    });
}
