import { ipcMain } from 'electron';
import { searchRecords, deleteRecord, clearAll, SearchFilters } from './db';

export function registerIpcHandlers() {
  ipcMain.handle('history-search', async (_event, filters: SearchFilters) => {
    return await searchRecords(filters);
  });

  ipcMain.handle('history-delete', async (_event, id: number) => {
    await deleteRecord(id);
    return { success: true };
  });

  ipcMain.handle('history-clear', async () => {
    await clearAll();
    return { success: true };
  });
} 