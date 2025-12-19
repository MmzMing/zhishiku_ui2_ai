/**
 * 主题配置上下文
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeConfig {
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

interface ThemeContextType {
  config: ThemeConfig;
  updateConfig: (newConfig: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);

  // 加载保存的配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('theme-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...DEFAULT_THEME_CONFIG, ...parsed });
      } catch (e) {
        console.error('Failed to parse theme config:', e);
      }
    }
  }, []);

  // 监听主题变化事件
  useEffect(() => {
    const handleThemeChange = () => {
      const savedConfig = localStorage.getItem('theme-config');
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setConfig({ ...DEFAULT_THEME_CONFIG, ...parsed });
        } catch (e) {
          console.error('Failed to parse theme config:', e);
        }
      }
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, []);

  const updateConfig = (newConfig: Partial<ThemeConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    localStorage.setItem('theme-config', JSON.stringify(updatedConfig));
    window.dispatchEvent(new Event('theme-change'));
  };

  return (
    <ThemeContext.Provider value={{ config, updateConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};