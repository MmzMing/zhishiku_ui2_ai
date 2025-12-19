/**
 * 设备检测工具函数
 */

import type { DeviceType } from '../types/common';

/**
 * 获取用户代理字符串
 */
const getUserAgent = (): string => {
  return typeof navigator !== 'undefined' ? navigator.userAgent : '';
};

/**
 * 获取视口尺寸
 */
export const getViewportSize = () => {
  if (typeof window === 'undefined') {
    return { width: 1920, height: 1080 }; // 服务端渲染默认值 - 使用桌面尺寸
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * 检测是否为移动设备
 */
export const isMobile = (): boolean => {
  // 在服务端渲染时默认为桌面设备
  if (typeof window === 'undefined') {
    return false;
  }
  
  const { width } = getViewportSize();
  const userAgent = getUserAgent();
  
  // 基于屏幕宽度判断
  const isSmallScreen = width <= 768;
  
  // 基于用户代理判断
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(userAgent);
  
  return isSmallScreen || isMobileUA;
};

/**
 * 检测是否为平板设备
 */
export const isTablet = (): boolean => {
  const { width } = getViewportSize();
  const userAgent = getUserAgent();
  
  // 基于屏幕宽度判断
  const isTabletScreen = width > 768 && width <= 1024;
  
  // 基于用户代理判断
  const tabletRegex = /iPad|Android(?!.*Mobile)/i;
  const isTabletUA = tabletRegex.test(userAgent);
  
  return isTabletScreen || isTabletUA;
};

/**
 * 检测是否为桌面设备
 */
export const isDesktop = (): boolean => {
  return !isMobile() && !isTablet();
};

/**
 * 检测是否为触摸设备
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * 获取设备类型
 */
export const getDeviceType = (): DeviceType => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

/**
 * 检测是否为iOS设备
 */
export const isIOS = (): boolean => {
  const userAgent = getUserAgent();
  return /iPad|iPhone|iPod/.test(userAgent);
};

/**
 * 检测是否为Android设备
 */
export const isAndroid = (): boolean => {
  const userAgent = getUserAgent();
  return /Android/.test(userAgent);
};

/**
 * 检测是否为Safari浏览器
 */
export const isSafari = (): boolean => {
  const userAgent = getUserAgent();
  return /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
};

/**
 * 检测是否为Chrome浏览器
 */
export const isChrome = (): boolean => {
  const userAgent = getUserAgent();
  return /Chrome/.test(userAgent);
};

/**
 * 检测是否为Firefox浏览器
 */
export const isFirefox = (): boolean => {
  const userAgent = getUserAgent();
  return /Firefox/.test(userAgent);
};

/**
 * 检测是否支持WebP格式
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * 检测是否支持现代图片格式
 */
export const supportsModernImageFormats = async () => {
  const webpSupported = await supportsWebP();
  
  return {
    webp: webpSupported,
    avif: false, // 可以添加AVIF检测
  };
};

/**
 * 获取设备像素比
 */
export const getDevicePixelRatio = (): number => {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
};

/**
 * 检测是否为高分辨率屏幕
 */
export const isHighDPI = (): boolean => {
  return getDevicePixelRatio() > 1;
};

/**
 * 获取屏幕方向
 */
export const getOrientation = (): 'portrait' | 'landscape' => {
  const { width, height } = getViewportSize();
  return height > width ? 'portrait' : 'landscape';
};

/**
 * 检测是否支持hover
 */
export const supportsHover = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(hover: hover)').matches;
};

/**
 * 检测网络连接类型
 */
export const getConnectionType = (): string => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown';
  }
  
  // @ts-ignore
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return connection?.effectiveType || 'unknown';
};

/**
 * 检测是否为慢速网络
 */
export const isSlowConnection = (): boolean => {
  const connectionType = getConnectionType();
  return ['slow-2g', '2g'].includes(connectionType);
};

/**
 * 获取设备信息摘要
 */
export const getDeviceInfo = () => {
  return {
    type: getDeviceType(),
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    isTouchDevice: isTouchDevice(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isSafari: isSafari(),
    isChrome: isChrome(),
    isFirefox: isFirefox(),
    pixelRatio: getDevicePixelRatio(),
    isHighDPI: isHighDPI(),
    orientation: getOrientation(),
    supportsHover: supportsHover(),
    connectionType: getConnectionType(),
    isSlowConnection: isSlowConnection(),
    viewportSize: getViewportSize(),
  };
};