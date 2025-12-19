/**
 * 主题切换Hook
 */

import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeConfig {
  mode: ThemeMode;
  primaryColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
  compact?: boolean;
}

const THEME_STORAGE_KEY = 'app-theme-config';

const defaultThemeConfig: ThemeConfig = {
  mode: 'light',
  primaryColor: '#1890ff',
  fontSize: 'medium',
  compact: false,
};

export function useTheme() {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    // 从localStorage读取主题配置
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultThemeConfig, ...JSON.parse(stored) };
      } catch (e) {
        console.error('Failed to parse theme config:', e);
      }
    }
    return defaultThemeConfig;
  });

  // 应用主题到DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // 设置主题模式
    root.setAttribute('data-theme', themeConfig.mode);
    
    // 设置主色调
    if (themeConfig.primaryColor) {
      root.style.setProperty('--primary-color', themeConfig.primaryColor);
    }
    
    // 设置字体大小
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.setProperty('--base-font-size', fontSizeMap[themeConfig.fontSize || 'medium']);
    
    // 设置紧凑模式
    if (themeConfig.compact) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    // 保存到localStorage
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeConfig));
  }, [themeConfig]);

  // 切换主题模式
  const switchTheme = useCallback((mode?: ThemeMode) => {
    setThemeConfig(prev => ({
      ...prev,
      mode: mode || (prev.mode === 'light' ? 'dark' : 'light'),
    }));
  }, []);

  // 设置主色调
  const setPrimaryColor = useCallback((color: string) => {
    setThemeConfig(prev => ({
      ...prev,
      primaryColor: color,
    }));
  }, []);

  // 设置字体大小
  const setFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
    setThemeConfig(prev => ({
      ...prev,
      fontSize: size,
    }));
  }, []);

  // 设置紧凑模式
  const setCompact = useCallback((compact: boolean) => {
    setThemeConfig(prev => ({
      ...prev,
      compact,
    }));
  }, []);

  // 重置主题
  const resetTheme = useCallback(() => {
    setThemeConfig(defaultThemeConfig);
  }, []);

  // 获取当前主题配置
  const getThemeConfig = useCallback(() => {
    return themeConfig;
  }, [themeConfig]);

  return {
    themeConfig,
    switchTheme,
    setPrimaryColor,
    setFontSize,
    setCompact,
    resetTheme,
    getThemeConfig,
    isDark: themeConfig.mode === 'dark',
  };
}

export default useTheme;