import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      copy: 'Copy',
      search: 'Search...',
      settings: 'Settings',
      theme: 'Theme',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      language: 'Language',
      addTab: '+ Add Tab',
      newTabPlaceholder: 'Enter tab name',
      add: 'Add',
      cancel: 'Cancel',
      archive: 'Archive',
      delete: 'Delete',
      copied: 'Copied to clipboard',
      tab: {
        all: 'All',
      },
    },
  },
  zh: {
    translation: {
      copy: '复制',
      search: '搜索...',
      settings: '设置',
      theme: '主题',
      darkMode: '深色模式',
      lightMode: '浅色模式',
      language: '语言',
      addTab: '+ 添加标签',
      newTabPlaceholder: '输入标签名称',
      add: '添加',
      cancel: '取消',
      archive: '归档',
      delete: '删除',
      copied: '已复制到剪贴板',
      tab: {
        all: '全部',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 