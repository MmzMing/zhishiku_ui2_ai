/**
 * 主题状态管理
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ThemeType } from '../../config/theme/themeConfig';
import { setTheme, getTheme } from '../../utils/storage';

// 主题状态接口
interface ThemeState {
  // 当前主题
  currentTheme: ThemeType;
  // 是否跟随系统
  followSystem: boolean;
  // 自定义主题配置
  customConfig: {
    primaryColor?: string;
    fontSize?: number;
    borderRadius?: number;
    compactMode?: boolean;
  };
  // 布局配置
  layoutConfig: {
    sidebarCollapsed: boolean;
    showBreadcrumb: boolean;
    showTabs: boolean;
    showFooter: boolean;
    fixedHeader: boolean;
    fixedSidebar: boolean;
  };
  // 动画配置
  animationConfig: {
    enableTransition: boolean;
    transitionDuration: number;
  };
}

// 初始状态
const initialState: ThemeState = {
  currentTheme: (getTheme() as ThemeType) || 'light',
  followSystem: false,
  customConfig: {
    primaryColor: '#1890ff',
    fontSize: 14,
    borderRadius: 4,
    compactMode: false,
  },
  layoutConfig: {
    sidebarCollapsed: false,
    showBreadcrumb: true,
    showTabs: true,
    showFooter: true,
    fixedHeader: true,
    fixedSidebar: true,
  },
  animationConfig: {
    enableTransition: true,
    transitionDuration: 300,
  },
};

// 创建主题切片
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // 切换主题
    switchTheme: (state, action: PayloadAction<ThemeType>) => {
      state.currentTheme = action.payload;
      state.followSystem = false;
      
      // 持久化存储
      setTheme(action.payload);
      
      // 触发全局主题变化事件，让 ThemeContext 处理 DOM 应用
      window.dispatchEvent(new Event('theme-change'));
    },
    
    // 切换跟随系统
    toggleFollowSystem: (state) => {
      state.followSystem = !state.followSystem;
      
      if (state.followSystem) {
        // 获取系统主题
        const systemTheme = getSystemTheme();
        state.currentTheme = systemTheme;
        setTheme(systemTheme);
        window.dispatchEvent(new Event('theme-change'));
      }
    },
    
    // 更新自定义配置
    updateCustomConfig: (state, action: PayloadAction<Partial<ThemeState['customConfig']>>) => {
      state.customConfig = { ...state.customConfig, ...action.payload };
      window.dispatchEvent(new Event('theme-change'));
    },
    
    // 更新布局配置
    updateLayoutConfig: (state, action: PayloadAction<Partial<ThemeState['layoutConfig']>>) => {
      state.layoutConfig = { ...state.layoutConfig, ...action.payload };
    },
    
    // 切换侧边栏折叠状态
    toggleSidebar: (state) => {
      state.layoutConfig.sidebarCollapsed = !state.layoutConfig.sidebarCollapsed;
    },
    
    // 更新动画配置
    updateAnimationConfig: (state, action: PayloadAction<Partial<ThemeState['animationConfig']>>) => {
      state.animationConfig = { ...state.animationConfig, ...action.payload };
    },
    
    // 切换主题（在light和dark之间切换）
    toggleTheme: (state) => {
      const newTheme: ThemeType = state.currentTheme === 'light' ? 'dark' : 'light';
      state.currentTheme = newTheme;
      state.followSystem = false;
      
      // 持久化存储
      setTheme(newTheme);
      
      window.dispatchEvent(new Event('theme-change'));
    },
    
    // 重置主题配置
    resetThemeConfig: (state) => {
      state.customConfig = initialState.customConfig;
      state.layoutConfig = initialState.layoutConfig;
      state.animationConfig = initialState.animationConfig;
      
      window.dispatchEvent(new Event('theme-change'));
    },
    
    // 初始化主题（从本地存储恢复）
    initializeTheme: (state) => {
      const savedTheme = getTheme() as ThemeType;
      if (savedTheme) {
        state.currentTheme = savedTheme;
      }
      
      // 如果跟随系统，检查系统主题变化
      if (state.followSystem) {
        const systemTheme = getSystemTheme();
        if (systemTheme !== state.currentTheme) {
          state.currentTheme = systemTheme;
          setTheme(systemTheme);
        }
      }
      
      window.dispatchEvent(new Event('theme-change'));
    },
  },
});

// 辅助函数：获取系统主题
const getSystemTheme = (): ThemeType => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// 辅助函数：更新主题类名
const updateThemeClass = (theme: ThemeType) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${theme}`);
    
    // 设置CSS变量
    root.setAttribute('data-theme', theme);
  }
};

// 辅助函数：应用自定义配置
const applyCustomConfig = (config: ThemeState['customConfig']) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    
    if (config.primaryColor) {
      root.style.setProperty('--primary-color', config.primaryColor);
    }
    
    if (config.fontSize) {
      root.style.setProperty('--font-size-base', `${config.fontSize}px`);
    }
    
    if (config.borderRadius) {
      root.style.setProperty('--border-radius-base', `${config.borderRadius}px`);
    }
    
    if (config.compactMode !== undefined) {
      root.classList.toggle('compact-mode', config.compactMode);
    }
  }
};

// 辅助函数：清除自定义配置
const clearCustomConfig = () => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.style.removeProperty('--primary-color');
    root.style.removeProperty('--font-size-base');
    root.style.removeProperty('--border-radius-base');
    root.classList.remove('compact-mode');
  }
};

// 监听系统主题变化
if (typeof window !== 'undefined' && window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', (e) => {
    // 这里需要通过store dispatch来更新状态
    // 实际使用时需要在组件中监听并dispatch action
    const systemTheme = e.matches ? 'dark' : 'light';
    console.log('System theme changed to:', systemTheme);
  });
}

// 导出actions
export const {
  switchTheme,
  toggleTheme,
  toggleFollowSystem,
  updateCustomConfig,
  updateLayoutConfig,
  toggleSidebar,
  updateAnimationConfig,
  resetThemeConfig,
  initializeTheme,
} = themeSlice.actions;

// 导出reducer
export default themeSlice.reducer;

// 选择器
export const selectCurrentTheme = (state: { theme: ThemeState }) => state.theme.currentTheme;
export const selectFollowSystem = (state: { theme: ThemeState }) => state.theme.followSystem;
export const selectCustomConfig = (state: { theme: ThemeState }) => state.theme.customConfig;
export const selectLayoutConfig = (state: { theme: ThemeState }) => state.theme.layoutConfig;
export const selectAnimationConfig = (state: { theme: ThemeState }) => state.theme.animationConfig;
export const selectSidebarCollapsed = (state: { theme: ThemeState }) => state.theme.layoutConfig.sidebarCollapsed;