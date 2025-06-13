import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ToolbarProps {
  onCopy: (content: string) => void;
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}

const Toolbar: React.FC<ToolbarProps> = ({
  onCopy,
  onThemeToggle,
  onLanguageToggle,
  theme,
  language,
}) => {
  const { t } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="toolbar">
      <button className="button" onClick={() => onCopy('')}>
        {t('copy')}
      </button>
      
      <input
        type="text"
        className="input"
        placeholder={t('search')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="settings-menu">
        <button
          className="button"
          onClick={() => setShowSettings(!showSettings)}
        >
          {t('settings')}
        </button>

        {showSettings && (
          <div className="settings-dropdown">
            <div className="settings-item" onClick={onThemeToggle}>
              <span>{t('theme')}</span>
              <span>{theme === 'light' ? t('darkMode') : t('lightMode')}</span>
            </div>
            <div className="settings-item" onClick={onLanguageToggle}>
              <span>{t('language')}</span>
              <span>{language === 'zh' ? 'English' : '中文'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar; 