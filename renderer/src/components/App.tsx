import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/themes.css';
import Toolbar from './Toolbar';
import TabList from './TabList';
import HistoryList from './HistoryList';
import { useClipboard } from '../hooks/useClipboard';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [tabs, setTabs] = useState<string[]>(['all']);
  const { copyToClipboard } = useClipboard();

  // 主题切换
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // 语言切换
  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    // 这里需要调用i18n的切换语言方法
  };

  // 添加新标签
  const addTab = (tabName: string) => {
    if (!tabs.includes(tabName)) {
      setTabs([...tabs, tabName]);
    }
  };

  // 归档到新标签
  const archiveToTab = (itemId: string, tabName: string) => {
    // 这里需要实现归档逻辑
    console.log(`Archive item ${itemId} to tab ${tabName}`);
  };

  return (
    <div className="container">
      <Toolbar
        onCopy={copyToClipboard}
        onThemeToggle={toggleTheme}
        onLanguageToggle={toggleLanguage}
        theme={theme}
        language={language}
      />
      <TabList
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTab={addTab}
      />
      <HistoryList
        activeTab={activeTab}
        onArchive={archiveToTab}
      />
    </div>
  );
};

export default App; 