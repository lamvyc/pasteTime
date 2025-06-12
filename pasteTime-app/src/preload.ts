// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel: string, listener: (...args: any[]) => void) => ipcRenderer.on(channel, listener),
    removeListener: (channel: string, listener: (...args: any[]) => void) => ipcRenderer.removeListener(channel, listener),
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    // 可根据需要暴露更多方法
  }
});
