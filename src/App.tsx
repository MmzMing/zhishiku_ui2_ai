/**
 * 根组件
 */

import React, { useEffect, useMemo } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';
import AppRouter from './router';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { getSystemTheme, watchSystemTheme, applyThemeConfig } from './config/theme/themeConfig';

// 主应用内容组件
const AppContent: React.FC = () => {
  const { config } = useTheme();
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
    if (config.mode === 'auto') {
      return getSystemTheme();
    }
    return config.mode;
  }, [config.mode]);

  const isDarkMode = actualMode === 'dark';

  useEffect(() => {
    // 设置页面标题
    document.title = '个人管理知识库';
    
    // 监听系统主题变化
    const unwatch = watchSystemTheme((theme) => {
      if (config.mode === 'auto') {
        applyThemeConfig({ ...config, mode: 'auto' });
      }
    });
    
    return () => {
      unwatch();
    };
  }, [config]);

  // Ant Design 主题配置
  const antdThemeConfig = useMemo(() => {
    const algorithms = [];
    
    // 基础主题算法
    if (isDarkMode) {
      algorithms.push(antdTheme.darkAlgorithm);
    } else {
      algorithms.push(antdTheme.defaultAlgorithm);
    }
    
    // 紧凑模式算法
    if (config.spacing === 'compact') {
      algorithms.push(antdTheme.compactAlgorithm);
    }
    
    // 映射字体大小
    const fontSizeMap = {
      small: 14,
      medium: 16,
      large: 18,
    };
    
    // 映射间距缩放
    const spacingScaleMap = {
      compact: 0.8,
      normal: 1,
      loose: 1.2,
    };
    const scale = spacingScaleMap[config.spacing] || 1;
    
    return {
      algorithm: algorithms,
      token: {
        colorPrimary: config.primaryColor,
        borderRadius: 6,
        fontSize: fontSizeMap[config.fontSize] || 16,
        // 通过调整基础步长来影响所有 Ant Design 组件的间距
        sizeUnit: 4 * scale,
        sizeStep: 4 * scale,
      },
    };
  }, [isDarkMode, config.primaryColor, config.spacing, config.fontSize]);

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
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
