import { ipcMain } from 'electron';
import { DatabaseManager } from '../database/database';
import { WalletManager } from '../wallets/wallet-manager';

export function setupWalletHandlers(db: DatabaseManager) {
    ipcMain.handle('db:get-wallets', async () => {
        return db.getWallets();
    });

    ipcMain.handle('db:add-wallet', async (_, wallet: any) => {
        return db.addWallet(wallet);
    });

    ipcMain.handle('db:delete-wallet', async (_, id: number) => {
        return db.deleteWallet(id);
    });

    ipcMain.handle('wallet:sync', async (_, walletId: number) => {
        const wallet = await db.getWallet(walletId);
        if (!wallet) throw new Error('Wallet not found');

        const walletManager = new WalletManager(db);
        const transactions = await walletManager.syncWallet(wallet);

        return transactions.length;
    });
}
