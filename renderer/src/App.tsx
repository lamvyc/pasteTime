import './App.less';
import { useState } from 'react';
import ClipboardPreview from './components/ClipboardPreview';
import HistoryList from './components/HistoryList';
import HeaderBar from './components/HeaderBar';

function App() {
  const [activeTab] = useState('all');
  const [searchText, setSearchText] = useState('');

  const handleArchive = (itemId: string, tabName: string) => {
    console.log('Archive:', itemId, tabName);
  };

  return (
    <div className="App">
      <HeaderBar searchText={searchText} onSearchChange={setSearchText} />
      <div className="main-area">
        <HistoryList 
          activeTab={activeTab}
          searchText={searchText}
          onArchive={handleArchive}
        />
      </div>
      <footer className="app-footer">
        {/* 预留底部区域，可放按钮或信息 */}
      </footer>
    </div>
  );
}

export default App;
