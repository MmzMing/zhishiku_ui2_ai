/**
 * 根组件
 */

import React, { useEffect, useState, useMemo } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';
import AppRouter from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// 主题配置接口
interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'loose';
  sidebarCollapsed: boolean;
  showTopLoadingBar: boolean;
  showLogo: boolean;
  showNavButtons: boolean;
  showBreadcrumb: boolean;
  keepTabsAlive: boolean;
  showFooter: boolean;
  enablePageTransition: boolean;
  allowTextSelection: boolean;
}

// 默认主题配置
const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: 'light',
  primaryColor: '#1890ff',
  fontSize: 'medium',
  spacing: 'normal',
  sidebarCollapsed: false,
  showTopLoadingBar: true,
  showLogo: true,
  showNavButtons: true,
  showBreadcrumb: true,
  keepTabsAlive: false,
  showFooter: true,
  enablePageTransition: true,
  allowTextSelection: true,
};

// 主应用内容组件
const AppContent: React.FC = () => {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const { currentLanguage } = useLanguage();

  // 获取Ant Design语言包
  const getAntdLocale = () => {
    switch (currentLanguage) {
      case 'en-US':
        return enUS;
      case 'ja-JP':
        return jaJP;
      default:
        return zhCN;
    }
  };

  // 获取实际主题模式（处理auto模式）
  const actualMode = useMemo(() => {
    if (themeConfig.mode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeConfig.mode;
  }, [themeConfig.mode]);

  const isDarkMode = actualMode === 'dark';

  useEffect(() => {
    // 设置页面标题
    document.title = '个人管理知识库';
    
    // 初始化主题
    initializeTheme();
    
    // 监听主题变化事件
    const handleThemeChange = () => {
      loadThemeConfig();
    };
    
    window.addEventListener('theme-change', handleThemeChange);
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (themeConfig.mode === 'auto') {
        applyThemeToDOM(themeConfig);
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [themeConfig.mode]);

  const loadThemeConfig = () => {
    const savedConfig = localStorage.getItem('theme-config');
    if (savedConfig) {
      try {
        const config = { ...DEFAULT_THEME_CONFIG, ...JSON.parse(savedConfig) };
        setThemeConfig(config);
        applyThemeToDOM(config);
      } catch (e) {
        console.error('Failed to parse theme config:', e);
        applyThemeToDOM(DEFAULT_THEME_CONFIG);
      }
    }
  };

  const initializeTheme = () => {
    loadThemeConfig();
  };

  const applyThemeToDOM = (config: ThemeConfig) => {
    const root = document.documentElement;
    
    // 计算实际主题模式
    let mode = config.mode;
    if (mode === 'auto') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // 应用主题模式
    root.setAttribute('data-theme', mode);
    
    // 应用主色调
    root.style.setProperty('--primary-color', config.primaryColor);
    
    // 计算主色调的hover和active颜色
    const primaryHover = adjustColor(config.primaryColor, 20);
    const primaryActive = adjustColor(config.primaryColor, -20);
    root.style.setProperty('--primary-color-hover', primaryHover);
    root.style.setProperty('--primary-color-active', primaryActive);
    
    // 应用字体大小
    const fontSizeMap: Record<string, string> = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.setProperty('--base-font-size', fontSizeMap[config.fontSize] || '16px');
    
    // 应用间距
    const spacingMap: Record<string, string> = {
      compact: '0.8',
      normal: '1',
      loose: '1.2',
    };
    root.style.setProperty('--spacing-scale', spacingMap[config.spacing] || '1');
    
    // 应用布局设置
    root.classList.toggle('sidebar-collapsed', config.sidebarCollapsed);
    root.classList.toggle('no-text-selection', !config.allowTextSelection);
    root.classList.toggle('page-transition-enabled', config.enablePageTransition);
    root.classList.toggle('hide-top-loading-bar', !config.showTopLoadingBar);
    root.classList.toggle('hide-logo', !config.showLogo);
    root.classList.toggle('hide-nav-buttons', !config.showNavButtons);
    root.classList.toggle('hide-breadcrumb', !config.showBreadcrumb);
    root.classList.toggle('keep-tabs-alive', config.keepTabsAlive);
    root.classList.toggle('hide-footer', !config.showFooter);
  };

  // 调整颜色亮度
  const adjustColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // Ant Design 主题配置
  const antdThemeConfig = useMemo(() => ({
    algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: themeConfig.primaryColor,
      borderRadius: 6,
    },
  }), [isDarkMode, themeConfig.primaryColor]);

  return (
    <ConfigProvider 
      locale={getAntdLocale()}
      theme={antdThemeConfig}
    >
      <AppRouter />
    </ConfigProvider>
  );
};

// 根应用组件
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
