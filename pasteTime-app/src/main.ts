import { app, BrowserWindow, ipcMain, clipboard } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let clipboardInterval: NodeJS.Timeout | null = null;
let lastClipboardContent = '';
let lastImageDataUrl = '';
let isWindowDestroyed = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // 等待窗口加载完成后再启动剪贴板监听
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window loaded, starting clipboard monitor');
    startClipboardMonitor();
  });

  mainWindow.on('closed', () => {
    isWindowDestroyed = true;
    if (clipboardInterval) {
      clearInterval(clipboardInterval);
      clipboardInterval = null;
    }
    mainWindow = null;
  });
}

function startClipboardMonitor() {
  if (clipboardInterval) {
    clearInterval(clipboardInterval);
  }

  // 立即检查一次当前剪贴板内容
  const initialContent = clipboard.readText();
  console.log('Initial clipboard content:', initialContent);
  if (initialContent) {
    lastClipboardContent = initialContent;
    if (mainWindow && !mainWindow.isDestroyed()) {
      const data = {
        content: initialContent,
        type: 'text',
        timestamp: Date.now(),
      };
      console.log('Sending initial content to renderer:', data);
      mainWindow.webContents.send('clipboard-changed', data);
    }
  }

  clipboardInterval = setInterval(() => {
    try {
      if (isWindowDestroyed || !mainWindow) {
        if (clipboardInterval) {
          clearInterval(clipboardInterval);
          clipboardInterval = null;
        }
        return;
      }

      const currentContent = clipboard.readText();
      const currentImage = clipboard.readImage();
      let hasChanged = false;

      if (currentImage && !currentImage.isEmpty()) {
        const dataURL = currentImage.toDataURL();
        if (dataURL !== lastImageDataUrl) {
          lastImageDataUrl = dataURL;
          hasChanged = true;
          const data = {
            content: dataURL,
            type: 'image',
            timestamp: Date.now(),
          };
          console.log('Sending image to renderer:', data);
          mainWindow.webContents.send('clipboard-changed', data);
        }
      } else if (currentContent && currentContent !== lastClipboardContent) {
        lastClipboardContent = currentContent;
        hasChanged = true;
        const data = {
          content: currentContent,
          type: 'text',
          timestamp: Date.now(),
        };
        console.log('Sending text to renderer:', data);
        mainWindow.webContents.send('clipboard-changed', data);
      }
      
      if (hasChanged) {
        // 你可以在这里执行额外的操作
      }
    } catch (error) {
      console.error('Clipboard monitor error:', error);
    }
  }, 100);
}

// 设置 IPC 处理程序
ipcMain.handle('get-initial-clipboard', () => {
  const currentContent = clipboard.readText();
  const currentImage = clipboard.readImage();
  const timestamp = Date.now();
  
  if (currentImage && !currentImage.isEmpty()) {
    return {
      content: currentImage.toDataURL(),
      type: 'image',
      timestamp
    };
  } else if (currentContent) {
    return {
      content: currentContent,
      type: 'text',
      timestamp
    };
  }
  return null;
});

// 写入剪贴板内容
ipcMain.handle('copy-to-clipboard', (_event, content: string) => {
  if (typeof content === 'string' && content.startsWith('data:image')) {
    const { nativeImage } = require('electron');
    const img = nativeImage.createFromDataURL(content);
    clipboard.writeImage(img);
  } else {
    clipboard.writeText(content);
  }
  return { success: true };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  isWindowDestroyed = true;
  if (clipboardInterval) {
    clearInterval(clipboardInterval);
    clipboardInterval = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    isWindowDestroyed = false;
    createWindow();
  }
}); 