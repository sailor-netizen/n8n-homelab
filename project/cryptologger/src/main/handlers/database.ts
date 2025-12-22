import { ipcMain } from 'electron';
import { DatabaseManager } from '../database/database';

export function setupDatabaseHandlers(db: DatabaseManager) {
    // Settings
    ipcMain.handle('db:get-settings', async () => {
        return db.getSettings();
    });

    ipcMain.handle('db:update-setting', async (_, key: string, value: string) => {
        return db.updateSetting(key, value);
    });

    // Import/Export
    ipcMain.handle('import:csv', async (_, _filePath: string) => {
        // TODO: Implement CSV import
        return { success: true, count: 0 };
    });

    ipcMain.handle('export:database', async () => {
        return db.exportDatabase();
    });
}
