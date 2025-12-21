/**
 * 主题配置上下文
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ThemeConfig, 
  DEFAULT_THEME_CONFIG, 
  THEME_STORAGE_KEY,
  applyThemeConfig,
  getThemeConfig,
  saveThemeConfig
} from '../config/theme/themeConfig';

interface ThemeContextType {
  config: ThemeConfig;
  updateConfig: (newConfig: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(getThemeConfig());

  // 初始化主题
  useEffect(() => {
    applyThemeConfig(config);
  }, []);

  // 监听主题变化事件
  useEffect(() => {
    const handleThemeChange = () => {
      const startTime = performance.now();
      try {
        const newConfig = getThemeConfig();
        setConfig(newConfig);
        applyThemeConfig(newConfig);
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        if (duration > 100) { // 如果切换超过100ms，记录为性能异常
          console.warn(`[Theme] Theme switch took ${duration.toFixed(2)}ms, which is longer than expected.`);
        }
      } catch (error) {
        console.error('[Theme] Failed to apply theme change:', error);
      }
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, []);

  const updateConfig = (newConfig: Partial<ThemeConfig>) => {
    const startTime = performance.now();
    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      saveThemeConfig(updatedConfig);
      applyThemeConfig(updatedConfig);
      window.dispatchEvent(new Event('theme-change'));
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      if (duration > 100) {
        console.warn(`[Theme] updateConfig took ${duration.toFixed(2)}ms`);
      }
    } catch (error) {
      console.error('[Theme] Error updating theme config:', error);
    }
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