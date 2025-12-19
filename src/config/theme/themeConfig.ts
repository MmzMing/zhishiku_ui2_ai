/**
 * 主题配置文件
 * 定义主题类型、预设主题和主题切换逻辑
 */

// 主题类型定义
export type ThemeType = 'light' | 'dark' | 'auto';

// 主题配置接口
export interface ThemeConfig {
  // 系统外观
  mode: ThemeType;
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'loose';
  
  // 布局设置
  sidebarCollapsed: boolean;
  showTopLoadingBar: boolean;
  showLogo: boolean;
  showNavButtons: boolean;
  showBreadcrumb: boolean;
  keepTabsAlive: boolean;
  showFooter: boolean;
  
  // 页面功能
  enablePageTransition: boolean;
  allowTextSelection: boolean;
}

// 预设主题颜色
export const PRESET_COLORS = [
  { label: '拂晓蓝', value: '#1890ff' },
  { label: '薄暮', value: '#f5222d' },
  { label: '火山', value: '#fa541c' },
  { label: '日暮', value: '#faad14' },
  { label: '明青', value: '#13c2c2' },
  { label: '极光绿', value: '#52c41a' },
  { label: '极客蓝', value: '#2f54eb' },
  { label: '酱紫', value: '#722ed1' },
];

// 默认主题配置
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  // 系统外观
  mode: 'light',
  primaryColor: '#1890ff',
  fontSize: 'medium',
  spacing: 'normal',
  
  // 布局设置
  sidebarCollapsed: false,
  showTopLoadingBar: true,
  showLogo: true,
  showNavButtons: true,
  showBreadcrumb: true,
  keepTabsAlive: false,
  showFooter: true,
  
  // 页面功能
  enablePageTransition: true,
  allowTextSelection: true,
};

// 浅色主题预设
export const LIGHT_THEME = {
  mode: 'light' as ThemeType,
  colors: {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',
    
    bgPrimary: '#ffffff',
    bgSecondary: '#f0f2f5',
    bgTertiary: '#fafafa',
    
    textPrimary: 'rgba(0, 0, 0, 0.85)',
    textSecondary: 'rgba(0, 0, 0, 0.65)',
    textTertiary: 'rgba(0, 0, 0, 0.45)',
    textDisabled: 'rgba(0, 0, 0, 0.25)',
    
    borderBase: '#d9d9d9',
    borderLight: '#e8e8e8',
    borderSplit: '#f0f0f0',
  },
};

// 深色主题预设
export const DARK_THEME = {
  mode: 'dark' as ThemeType,
  colors: {
    primary: '#177ddc',
    success: '#49aa19',
    warning: '#d89614',
    error: '#d32029',
    info: '#177ddc',
    
    bgPrimary: '#141414',
    bgSecondary: '#1f1f1f',
    bgTertiary: '#2a2a2a',
    
    textPrimary: 'rgba(255, 255, 255, 0.85)',
    textSecondary: 'rgba(255, 255, 255, 0.65)',
    textTertiary: 'rgba(255, 255, 255, 0.45)',
    textDisabled: 'rgba(255, 255, 255, 0.25)',
    
    borderBase: '#434343',
    borderLight: '#303030',
    borderSplit: '#262626',
  },
};

// 主题存储键
export const THEME_STORAGE_KEY = 'theme-config';

/**
 * 获取当前主题配置
 */
export const getThemeConfig = (): ThemeConfig => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to get theme config:', e);
  }
  return DEFAULT_THEME_CONFIG;
};

/**
 * 保存主题配置
 */
export const saveThemeConfig = (config: ThemeConfig): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save theme config:', e);
  }
};

/**
 * 应用主题配置到DOM
 */
export const applyThemeConfig = (config: ThemeConfig): void => {
  const root = document.documentElement;
  
  // 应用主题模式
  root.setAttribute('data-theme', config.mode);
  
  // 应用主色调
  root.style.setProperty('--primary-color', config.primaryColor);
  
  // 应用字体大小
  const fontSizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px',
  };
  root.style.setProperty('--base-font-size', fontSizeMap[config.fontSize]);
  
  // 应用间距
  const spacingMap = {
    compact: '0.8',
    normal: '1',
    loose: '1.2',
  };
  root.style.setProperty('--spacing-scale', spacingMap[config.spacing]);
  
  // 应用布局设置
  root.classList.toggle('sidebar-collapsed', config.sidebarCollapsed);
  
  // 应用页面功能设置
  root.classList.toggle('no-text-selection', !config.allowTextSelection);
  root.classList.toggle('page-transition-enabled', config.enablePageTransition);
};

/**
 * 获取系统主题偏好
 */
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

/**
 * 监听系统主题变化
 */
export const watchSystemTheme = (callback: (theme: 'light' | 'dark') => void): (() => void) => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handler = (e: MediaQueryListEvent) => {
      callback(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handler);
    
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }
  
  return () => {};
};

/**
 * 重置主题配置
 */
export const resetThemeConfig = (): void => {
  saveThemeConfig(DEFAULT_THEME_CONFIG);
  applyThemeConfig(DEFAULT_THEME_CONFIG);
};

/**
 * 切换主题模式
 */
export const switchThemeMode = (mode: ThemeType): void => {
  const config = getThemeConfig();
  config.mode = mode;
  saveThemeConfig(config);
  applyThemeConfig(config);
  
  // 触发主题变化事件
  window.dispatchEvent(new Event('theme-change'));
};

/**
 * 更新主题配置
 */
export const updateThemeConfig = (updates: Partial<ThemeConfig>): void => {
  const config = getThemeConfig();
  const newConfig = { ...config, ...updates };
  saveThemeConfig(newConfig);
  applyThemeConfig(newConfig);
  
  // 触发主题变化事件
  window.dispatchEvent(new Event('theme-change'));
};
