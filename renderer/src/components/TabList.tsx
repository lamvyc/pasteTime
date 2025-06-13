import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TabListProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTab: (tabName: string) => void;
}

const TabList: React.FC<TabListProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onAddTab,
}) => {
  const { t } = useTranslation();
  const [showAddTab, setShowAddTab] = useState(false);
  const [newTabName, setNewTabName] = useState('');

  const handleAddTab = () => {
    if (newTabName.trim()) {
      onAddTab(newTabName.trim());
      setNewTabName('');
      setShowAddTab(false);
    }
  };

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {t(`tab.${tab}`)}
        </button>
      ))}

      {showAddTab ? (
        <div className="tab-add-form">
          <input
            type="text"
            className="input"
            value={newTabName}
            onChange={(e) => setNewTabName(e.target.value)}
            placeholder={t('newTabPlaceholder')}
            autoFocus
          />
          <button className="button" onClick={handleAddTab}>
            {t('add')}
          </button>
          <button
            className="button"
            onClick={() => setShowAddTab(false)}
          >
            {t('cancel')}
          </button>
        </div>
      ) : (
        <button
          className="tab"
          onClick={() => setShowAddTab(true)}
        >
          {t('addTab')}
        </button>
      )}
    </div>
  );
};

export default TabList; 