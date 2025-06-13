import React, { useEffect, useState } from 'react';
import './ClipboardPreview.less';

const ipcRenderer = (window as any).electron?.ipcRenderer;

const ClipboardPreview: React.FC = () => {
  const [clip, setClip] = useState<{ type: string; data: string } | null>(null);
  const [imgModal, setImgModal] = useState(false);

  useEffect(() => {
    console.log('ipcRenderer', ipcRenderer);
    if (!ipcRenderer) return;
    const handler = (_: any, payload: { type: string; data: string }) => {
      console.log('收到主进程事件', payload);
      setClip(payload);
    };
    ipcRenderer.on('clipboard-changed', handler);
    return () => {
      ipcRenderer.removeListener('clipboard-changed', handler);
    };
  }, []);

  if (!clip) return <div className="clipboard-preview">暂无剪贴板内容</div>;
  if (clip.type === 'text') {
    return <div className="clipboard-preview"><pre>{clip.data}</pre></div>;
  }
  if (clip.type === 'image') {
    return (
      <div className="clipboard-preview">
        <img src={clip.data} alt="剪贴板图片" onClick={() => setImgModal(true)} />
        {imgModal && (
          <div className="img-modal" onClick={() => setImgModal(false)}>
            <img src={clip.data} alt="放大图片" />
          </div>
        )}
      </div>
    );
  }
  return <div className="clipboard-preview">未知类型</div>;
};

export default ClipboardPreview; 