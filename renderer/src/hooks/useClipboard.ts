import { useState, useEffect, useCallback } from 'react';

interface ClipboardItem {
  id: string;
  content: string;
  type: string;
  timestamp: number;
  tab?: string;
}

export const useClipboard = () => {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);

  const handleClipboardChange = useCallback((_event: any, data: ClipboardItem) => {
    console.log('Received clipboard data:', data); // 调试日志
    const content = (data as any).content ?? (data as any).data;
    if (!content) {
      console.log('Empty content received, ignoring'); // 调试日志
      return;
    }

    const newItem: ClipboardItem = {
      id: Date.now().toString(),
      content,
      type: data.type,
      timestamp: data.timestamp ?? Date.now()
    };
    
    console.log('Adding new item:', newItem); // 调试日志
    setClipboardItems(prev => {
      // 检查是否已存在相同内容
      const isDuplicate = prev.some(item => item.content === content);
      if (isDuplicate) {
        console.log('Duplicate content, ignoring'); // 调试日志
        return prev;
      }
      const newItems = [newItem, ...prev];
      console.log('Updated items:', newItems); // 调试日志
      return newItems;
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setClipboardItems(prev => prev.filter(item => item.id !== id));
  }, []);

  useEffect(() => {
    console.log('Setting up clipboard listener'); // 调试日志
    if (window.electron?.ipcRenderer) {
      // 先移除可能存在的旧监听器
      window.electron.ipcRenderer.removeListener('clipboard-changed', handleClipboardChange);
      
      // 添加新的监听器
      window.electron.ipcRenderer.on('clipboard-changed', handleClipboardChange);
      
      // 请求初始剪贴板内容
      window.electron.ipcRenderer.invoke('get-initial-clipboard').then((data: ClipboardItem) => {
        if (data && data.content) {
          console.log('Received initial clipboard data:', data); // 调试日志
          handleClipboardChange(null, data);
        }
      });

      return () => {
        console.log('Cleaning up clipboard listener'); // 调试日志
        window.electron.ipcRenderer.removeListener('clipboard-changed', handleClipboardChange);
      };
    }
  }, [handleClipboardChange]);

  const copyToClipboard = (content: string) => {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.invoke('copy-to-clipboard', content);
    }
  };

  return { clipboardItems, copyToClipboard, handleDelete };
}; 