import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useClipboard } from '../hooks/useClipboard';
import './HistoryList.less';
import { message } from 'antd';

interface ClipboardItem {
  id: string;
  content: string;
  type: string;
  timestamp: number;
  tab?: string;
}

interface HistoryListProps {
  activeTab: string;
  searchText: string;
  onArchive: (itemId: string, tabName: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
  activeTab,
  searchText,
  onArchive,
}) => {
  const { t } = useTranslation();
  const { clipboardItems, handleDelete, copyToClipboard } = useClipboard();
  const [imageModalSrc, setImageModalSrc] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{visible: boolean; x: number; y: number; id?: string}>({visible: false, x: 0, y: 0});

  const filteredItems = clipboardItems.filter((item) => {
    const matchesTab = activeTab === 'all' || item.tab === activeTab;
    const matchesSearch = searchText === '' || 
      item.content.toLowerCase().includes(searchText.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const formatTimestamp = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleString();
      }
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (error) {
      return new Date().toLocaleString();
    }
  };

  const handleItemClick = (item: ClipboardItem) => {
    copyToClipboard(item.content);
    message.success(t('copied'));
  };

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, id });
  };

  useEffect(() => {
    const hide = () => setContextMenu(prev => ({ ...prev, visible: false }));
    if (contextMenu.visible) {
      window.addEventListener('click', hide);
      return () => window.removeEventListener('click', hide);
    }
  }, [contextMenu.visible]);

  return (
    <div className="history-list">
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className="history-item"
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName.toLowerCase() === 'img') return;
            handleItemClick(item);
          }}
          onContextMenu={(e) => handleContextMenu(e, item.id)}
        >
          <div className="history-item-header">
            <span className="history-item-time">
              {formatTimestamp(item.timestamp)}
            </span>
          </div>
          <div className="history-item-content">
            {item.type === 'image' ? (
              <img
                src={item.content}
                alt="Clipboard image"
                className="history-item-image"
                style={{ maxWidth: '100%', maxHeight: '200px', cursor: 'pointer' }}
                onClick={() => setImageModalSrc(item.content)}
              />
            ) : (
              <pre className="history-item-text">{item.content}</pre>
            )}
          </div>
        </div>
      ))}
      {imageModalSrc && (
        <div className="history-image-modal" onClick={() => setImageModalSrc(null)}>
          <img src={imageModalSrc} alt="Preview" />
        </div>
      )}
      {contextMenu.visible && (
        <ul
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <li
            onClick={() => {
              if (contextMenu.id) handleDelete(contextMenu.id);
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}
          >
            {t('delete')}
          </li>
        </ul>
      )}
    </div>
  );
};

export default HistoryList; 