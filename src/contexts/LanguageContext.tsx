/**
 * 语言管理上下文
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'zh-CN' | 'en-US' | 'ja-JP';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 多语言文本配置
const translations = {
  'zh-CN': {
    // 主题设置
    'theme.title': '主题设置',
    'theme.reset': '重置',
    'theme.close': '关闭',
    'theme.save': '保存设置',
    'theme.cancel': '取消',
    'theme.saved': '主题设置已保存',
    'theme.reset.success': '已重置为默认设置',
    
    // 系统外观
    'theme.appearance': '系统外观',
    'theme.mode': '主题模式',
    'theme.mode.light': '浅色',
    'theme.mode.dark': '深色',
    'theme.mode.auto': '跟随系统',
    'theme.primaryColor': '主色调',
    'theme.fontSize': '字体大小',
    'theme.fontSize.small': '小 (14px)',
    'theme.fontSize.medium': '中 (16px)',
    'theme.fontSize.large': '大 (18px)',
    'theme.spacing': '间距',
    'theme.spacing.compact': '紧凑',
    'theme.spacing.normal': '常规',
    'theme.spacing.loose': '宽松',
    
    // 布局设置
    'theme.layout': '布局设置',
    'theme.sidebar.expanded': '侧边栏展开状态',
    'theme.topLoadingBar': '顶部加载条显示',
    'theme.showLogo': '系统 Logo 显示',
    'theme.showNavButtons': '导航按钮显示',
    'theme.showBreadcrumb': '面包屑导航显示',
    'theme.keepTabsAlive': '标签页常显设置',
    'theme.showFooter': '底部信息显示',
    'theme.showFullscreenButton': '全屏按钮显示',
    'common.fullscreen': '全屏',
    'common.exitFullscreen': '退出全屏',
    
    // 页面功能
    'theme.pageFeatures': '页面功能',
    'theme.pageTransition': '导航过渡效果',
    'theme.textSelection': '文字选中功能',
    
    // 提示信息
    'theme.tip': '提示：修改设置后需要点击"保存设置"按钮才会生效。',
    
    // 语言选项
    'language.chinese': '简体中文',
    'language.english': 'English',
    'language.japanese': '日本語',
  },
  'en-US': {
    // Theme Settings
    'theme.title': 'Theme Settings',
    'theme.reset': 'Reset',
    'theme.close': 'Close',
    'theme.save': 'Save Settings',
    'theme.cancel': 'Cancel',
    'theme.saved': 'Theme settings saved',
    'theme.reset.success': 'Reset to default settings',
    
    // System Appearance
    'theme.appearance': 'System Appearance',
    'theme.mode': 'Theme Mode',
    'theme.mode.light': 'Light',
    'theme.mode.dark': 'Dark',
    'theme.mode.auto': 'Follow System',
    'theme.primaryColor': 'Primary Color',
    'theme.fontSize': 'Font Size',
    'theme.fontSize.small': 'Small (14px)',
    'theme.fontSize.medium': 'Medium (16px)',
    'theme.fontSize.large': 'Large (18px)',
    'theme.spacing': 'Spacing',
    'theme.spacing.compact': 'Compact',
    'theme.spacing.normal': 'Normal',
    'theme.spacing.loose': 'Loose',
    
    // Layout Settings
    'theme.layout': 'Layout Settings',
    'theme.sidebar.expanded': 'Sidebar Expanded State',
    'theme.topLoadingBar': 'Top Loading Bar Display',
    'theme.showLogo': 'System Logo Display',
    'theme.showNavButtons': 'Navigation Buttons Display',
    'theme.showBreadcrumb': 'Breadcrumb Navigation Display',
    'theme.keepTabsAlive': 'Keep Tabs Alive Setting',
    'theme.showFooter': 'Footer Information Display',
    'theme.showFullscreenButton': 'Fullscreen Button Display',
    'common.fullscreen': 'Fullscreen',
    'common.exitFullscreen': 'Exit Fullscreen',
    
    // Page Features
    'theme.pageFeatures': 'Page Features',
    'theme.pageTransition': 'Navigation Transition Effect',
    'theme.textSelection': 'Text Selection Function',
    
    // Tip
    'theme.tip': 'Tip: Click "Save Settings" button to apply changes.',
    
    // Language Options
    'language.chinese': '简体中文',
    'language.english': 'English',
    'language.japanese': '日本語',
  },
  'ja-JP': {
    // テーマ設定
    'theme.title': 'テーマ設定',
    'theme.reset': 'リセット',
    'theme.close': '閉じる',
    'theme.save': '設定を保存',
    'theme.cancel': 'キャンセル',
    'theme.saved': 'テーマ設定が保存されました',
    'theme.reset.success': 'デフォルト設定にリセットしました',
    
    // システム外観
    'theme.appearance': 'システム外観',
    'theme.mode': 'テーマモード',
    'theme.mode.light': 'ライト',
    'theme.mode.dark': 'ダーク',
    'theme.mode.auto': 'システムに従う',
    'theme.primaryColor': 'プライマリカラー',
    'theme.fontSize': 'フォントサイズ',
    'theme.fontSize.small': '小 (14px)',
    'theme.fontSize.medium': '中 (16px)',
    'theme.fontSize.large': '大 (18px)',
    'theme.spacing': 'スペーシング',
    'theme.spacing.compact': 'コンパクト',
    'theme.spacing.normal': '通常',
    'theme.spacing.loose': 'ゆったり',
    
    // レイアウト設定
    'theme.layout': 'レイアウト設定',
    'theme.sidebar.expanded': 'サイドバー展開状態',
    'theme.topLoadingBar': 'トップローディングバー表示',
    'theme.showLogo': 'システムロゴ表示',
    'theme.showNavButtons': 'ナビゲーションボタン表示',
    'theme.showBreadcrumb': 'パンくずナビ表示',
    'theme.keepTabsAlive': 'タブ常時表示設定',
    'theme.showFooter': 'フッター情報表示',
    'theme.showFullscreenButton': '全画面ボタン表示',
    'common.fullscreen': '全画面表示',
    'common.exitFullscreen': '全画面表示を終了',
    
    // ページ機能
    'theme.pageFeatures': 'ページ機能',
    'theme.pageTransition': 'ナビゲーション遷移効果',
    'theme.textSelection': 'テキスト選択機能',
    
    // ヒント
    'theme.tip': 'ヒント：設定を変更した後、「設定を保存」ボタンをクリックして適用してください。',
    
    // 言語オプション
    'language.chinese': '简体中文',
    'language.english': 'English',
    'language.japanese': '日本語',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'zh-CN';
  });

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('app-language', language);
    
    // 触发语言变化事件
    window.dispatchEvent(new CustomEvent('language-change', { detail: language }));
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key as keyof typeof translations[typeof currentLanguage]] || key;
  };

  useEffect(() => {
    // 监听语言变化事件
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail);
    };

    window.addEventListener('language-change', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('language-change', handleLanguageChange as EventListener);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};