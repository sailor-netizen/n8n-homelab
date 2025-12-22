import { ipcMain } from 'electron';
import { DatabaseManager } from '../database/database';
import { BybitClient } from '../integrations/bybit-client';

export function setupIntegrationHandlers(db: DatabaseManager) {
    ipcMain.handle('bybit:save-api-key', async (_, apiKey: string, apiSecret: string) => {
        return db.saveApiKey('bybit', apiKey, apiSecret);
    });

    ipcMain.handle('bybit:fetch-trades', async () => {
        const apiKeys = await db.getApiKey('bybit');
        if (!apiKeys) throw new Error('Bybit API keys not configured');

        const bybit = new BybitClient(apiKeys.api_key, apiKeys.api_secret);
        const trades = await bybit.fetchTradeHistory();

        // Save trades to database
        for (const trade of trades) {
            await db.addTrade(trade);
        }

        return trades.length;
    });
}
