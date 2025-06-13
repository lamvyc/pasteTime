import { ipcMain } from 'electron';
import { searchRecords, deleteRecord, clearAll, SearchFilters } from './db';

export function registerIpcHandlers() {
  console.log('[Main] Registering IPC handlers');
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

  // 将内容写入系统剪贴板（文本或图片）
  ipcMain.handle('copy-to-clipboard', (_event, content: string) => {
    const { clipboard, nativeImage } = require('electron');
    if (typeof content === 'string' && content.startsWith('data:image')) {
      const image = nativeImage.createFromDataURL(content);
      clipboard.writeImage(image);
    } else {
      clipboard.writeText(content);
    }
    return { success: true };
  });

  // 处理获取初始剪贴板内容的请求
  ipcMain.handle('get-initial-clipboard', () => {
    const { clipboard } = require('electron');
    const text = clipboard.readText();
    const image = clipboard.readImage();
    const timestamp = Date.now();

    if (!image.isEmpty()) {
      return {
        type: 'image',
        data: image.toDataURL(),
        timestamp,
      };
    } else if (text) {
      return {
        type: 'text',
        data: text,
        timestamp,
      };
    }
    return null;
  });
} 