import React from 'react';
import { useTranslation } from 'react-i18next';
import './HeaderBar.less';

interface HeaderBarProps {
  searchText: string;
  onSearchChange: (val: string) => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ searchText, onSearchChange }) => {
  const { t } = useTranslation();

  return (
    <header className="app-header">
      <input
        type="text"
        className="header-search-input"
        placeholder={t('search')}
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </header>
  );
};

export default HeaderBar; 