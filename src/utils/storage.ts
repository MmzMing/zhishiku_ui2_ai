/**
 * 本地存储工具
 */

import Cookies from 'js-cookie';
import { APP_CONFIG } from '../config/app';

// 存储类型
type StorageType = 'localStorage' | 'sessionStorage' | 'cookie';

// 存储选项
interface StorageOptions {
  expires?: number; // 过期时间（天）
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

// 通用存储类
class Storage {
  private type: StorageType;

  constructor(type: StorageType = 'localStorage') {
    this.type = type;
  }

  // 设置存储
  set(key: string, value: any, options?: StorageOptions): void {
    try {
      const serializedValue = JSON.stringify(value);

      switch (this.type) {
        case 'localStorage':
          localStorage.setItem(key, serializedValue);
          break;
        case 'sessionStorage':
          sessionStorage.setItem(key, serializedValue);
          break;
        case 'cookie':
          Cookies.set(key, serializedValue, {
            expires: options?.expires || 7,
            domain: options?.domain,
            secure: options?.secure,
            sameSite: options?.sameSite || 'lax',
          });
          break;
      }
    } catch (error) {
      console.error(`Failed to set ${this.type}:`, error);
    }
  }

  // 获取存储
  get<T = any>(key: string): T | null {
    try {
      let value: string | null = null;

      switch (this.type) {
        case 'localStorage':
          value = localStorage.getItem(key);
          break;
        case 'sessionStorage':
          value = sessionStorage.getItem(key);
          break;
        case 'cookie':
          value = Cookies.get(key) || null;
          break;
      }

      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Failed to get ${this.type}:`, error);
      return null;
    }
  }

  // 删除存储
  remove(key: string): void {
    try {
      switch (this.type) {
        case 'localStorage':
          localStorage.removeItem(key);
          break;
        case 'sessionStorage':
          sessionStorage.removeItem(key);
          break;
        case 'cookie':
          Cookies.remove(key);
          break;
      }
    } catch (error) {
      console.error(`Failed to remove ${this.type}:`, error);
    }
  }

  // 清空存储
  clear(): void {
    try {
      switch (this.type) {
        case 'localStorage':
          localStorage.clear();
          break;
        case 'sessionStorage':
          sessionStorage.clear();
          break;
        case 'cookie':
          // Cookie没有clear方法，需要逐个删除
          document.cookie.split(';').forEach((cookie) => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            Cookies.remove(name);
          });
          break;
      }
    } catch (error) {
      console.error(`Failed to clear ${this.type}:`, error);
    }
  }

  // 检查是否存在
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // 获取所有键
  keys(): string[] {
    try {
      switch (this.type) {
        case 'localStorage':
          return Object.keys(localStorage);
        case 'sessionStorage':
          return Object.keys(sessionStorage);
        case 'cookie':
          return document.cookie
            .split(';')
            .map((cookie) => cookie.split('=')[0].trim())
            .filter(Boolean);
        default:
          return [];
      }
    } catch (error) {
      console.error(`Failed to get ${this.type} keys:`, error);
      return [];
    }
  }
}

// 创建存储实例
export const localStorageUtil = new Storage('localStorage');
export const sessionStorageUtil = new Storage('sessionStorage');
export const cookieStorage = new Storage('cookie');

// Token相关操作
export const getToken = (): string | null => {
  return cookieStorage.get(APP_CONFIG.CACHE.TOKEN_KEY);
};

export const setToken = (token: string, expires?: number): void => {
  cookieStorage.set(APP_CONFIG.CACHE.TOKEN_KEY, token, {
    expires: expires || 7,
    secure: location.protocol === 'https:',
    sameSite: 'lax',
  });
};

export const removeToken = (): void => {
  cookieStorage.remove(APP_CONFIG.CACHE.TOKEN_KEY);
};

// 用户信息相关操作
export const getUserInfo = (): any => {
  return localStorageUtil.get(APP_CONFIG.CACHE.USER_INFO_KEY);
};

export const setUserInfo = (userInfo: any): void => {
  localStorageUtil.set(APP_CONFIG.CACHE.USER_INFO_KEY, userInfo);
};

export const removeUserInfo = (): void => {
  localStorageUtil.remove(APP_CONFIG.CACHE.USER_INFO_KEY);
};

// 主题相关操作
export const getTheme = (): string => {
  return localStorageUtil.get(APP_CONFIG.CACHE.THEME_KEY) || 'light';
};

export const setTheme = (theme: string): void => {
  localStorageUtil.set(APP_CONFIG.CACHE.THEME_KEY, theme);
};

// 语言相关操作
export const getLanguage = (): string => {
  return localStorageUtil.get(APP_CONFIG.CACHE.LANGUAGE_KEY) || 'zh-CN';
};

export const setLanguage = (language: string): void => {
  localStorageUtil.set(APP_CONFIG.CACHE.LANGUAGE_KEY, language);
};

// 权限相关操作
export const getPermissions = (): string[] => {
  return localStorageUtil.get(APP_CONFIG.CACHE.PERMISSIONS_KEY) || [];
};

export const setPermissions = (permissions: string[]): void => {
  localStorageUtil.set(APP_CONFIG.CACHE.PERMISSIONS_KEY, permissions);
};

export const removePermissions = (): void => {
  localStorageUtil.remove(APP_CONFIG.CACHE.PERMISSIONS_KEY);
};

// 搜索历史相关操作
export const getSearchHistory = (): string[] => {
  return localStorageUtil.get('search_history') || [];
};

export const addSearchHistory = (keyword: string): void => {
  const history = getSearchHistory();
  const newHistory = [keyword, ...history.filter(item => item !== keyword)].slice(0, 10);
  localStorageUtil.set('search_history', newHistory);
};

export const clearSearchHistory = (): void => {
  localStorageUtil.remove('search_history');
};

// 浏览历史相关操作
export const getBrowseHistory = (): any[] => {
  return localStorageUtil.get('browse_history') || [];
};

export const addBrowseHistory = (item: any): void => {
  const history = getBrowseHistory();
  const newHistory = [item, ...history.filter(h => h.id !== item.id)].slice(0, 100);
  localStorageUtil.set('browse_history', newHistory);
};

export const clearBrowseHistory = (): void => {
  localStorageUtil.remove('browse_history');
};

// 用户设置相关操作
export const getUserSettings = (): any => {
  return localStorageUtil.get('user_settings') || {};
};

export const setUserSettings = (settings: any): void => {
  const currentSettings = getUserSettings();
  localStorageUtil.set('user_settings', { ...currentSettings, ...settings });
};

// 清除所有用户数据
export const clearUserData = (): void => {
  removeToken();
  removeUserInfo();
  removePermissions();
  localStorageUtil.remove('user_settings');
  localStorageUtil.remove('browse_history');
  // 保留主题和语言设置
};

// 存储大小计算
export const getStorageSize = (type: StorageType = 'localStorage'): number => {
  try {
    let total = 0;
    const storage = type === 'localStorage' ? window.localStorage : window.sessionStorage;
    
    for (const key in storage) {
      if (storage.hasOwnProperty(key)) {
        total += storage[key].length + key.length;
      }
    }
    
    return total;
  } catch (error) {
    console.error('Failed to calculate storage size:', error);
    return 0;
  }
};

// 存储容量检查
export const checkStorageQuota = (type: StorageType = 'localStorage'): boolean => {
  try {
    const testKey = '__storage_test__';
    const testValue = 'test';
    const storage = type === 'localStorage' ? window.localStorage : window.sessionStorage;
    
    storage.setItem(testKey, testValue);
    storage.removeItem(testKey);
    
    return true;
  } catch (error) {
    console.error('Storage quota exceeded:', error);
    return false;
  }
};