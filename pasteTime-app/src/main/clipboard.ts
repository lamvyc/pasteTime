import { app, BrowserWindow, ipcMain, clipboard } from 'electron';
import { platform } from 'os';
import { addRecord } from './db';

let lastText = '';
let lastImage = '';

function sendClipboardToRenderer(win: BrowserWindow, type: 'text' | 'image', data: string) {
  win.webContents.send('clipboard-changed', { type, data, timestamp: Date.now() });
}

export function startClipboardWatcher(win: BrowserWindow) {
  if (platform() === 'win32') {
    // Windows: 使用轮询+后续可集成原生事件监听
    setInterval(() => {
      const text = clipboard.readText();
      const image = clipboard.readImage();
      if (text && text !== lastText) {
        lastText = text;
        sendClipboardToRenderer(win, 'text', text);
        addRecord('text', text).catch(console.error);
      }
      if (!image.isEmpty()) {
        const imgData = image.toDataURL();
        if (imgData !== lastImage) {
          lastImage = imgData;
          sendClipboardToRenderer(win, 'image', imgData);
          addRecord('image', imgData).catch(console.error);
        }
      }
    }, 800);
  } else if (platform() === 'darwin') {
    // macOS: 轮询 NSPasteboard，首次主动读取触发权限
    setInterval(() => {
      const text = clipboard.readText();
      const image = clipboard.readImage();
      if (text && text !== lastText) {
        lastText = text;
        sendClipboardToRenderer(win, 'text', text);
        addRecord('text', text).catch(console.error);
      }
      if (!image.isEmpty()) {
        const imgData = image.toDataURL();
        if (imgData !== lastImage) {
          lastImage = imgData;
          sendClipboardToRenderer(win, 'image', imgData);
          addRecord('image', imgData).catch(console.error);
        }
      }
    }, 800);
  }
} 