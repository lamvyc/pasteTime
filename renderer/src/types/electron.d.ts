declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on(channel: string, callback: (event: any, ...args: any[]) => void): void;
        removeListener(channel: string, callback: (event: any, ...args: any[]) => void): void;
        invoke(channel: string, ...args: any[]): Promise<any>;
      };
    };
  }
}

export {}; 