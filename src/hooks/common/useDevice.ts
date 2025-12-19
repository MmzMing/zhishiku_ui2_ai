/**
 * 设备检测Hook
 */

import { useState, useEffect } from 'react';
import { getDeviceType, getViewportSize, isMobile, isTablet, isDesktop, isTouchDevice } from '../../utils/device';
import type { DeviceType } from '../../types/common';

interface DeviceInfo {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  viewportSize: {
    width: number;
    height: number;
  };
}

/**
 * 设备信息Hook
 */
export const useDevice = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // 在服务端渲染时使用默认的桌面设备配置
    if (typeof window === 'undefined') {
      return {
        deviceType: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        viewportSize: { width: 1920, height: 1080 },
      };
    }
    
    return {
      deviceType: getDeviceType(),
      isMobile: isMobile(),
      isTablet: isTablet(),
      isDesktop: isDesktop(),
      isTouchDevice: isTouchDevice(),
      viewportSize: getViewportSize(),
    };
  });

  useEffect(() => {
    // 在客户端挂载后立即更新设备信息
    if (typeof window !== 'undefined') {
      setDeviceInfo({
        deviceType: getDeviceType(),
        isMobile: isMobile(),
        isTablet: isTablet(),
        isDesktop: isDesktop(),
        isTouchDevice: isTouchDevice(),
        viewportSize: getViewportSize(),
      });
    }

    const updateDeviceInfo = () => {
      setDeviceInfo({
        deviceType: getDeviceType(),
        isMobile: isMobile(),
        isTablet: isTablet(),
        isDesktop: isDesktop(),
        isTouchDevice: isTouchDevice(),
        viewportSize: getViewportSize(),
      });
    };

    // 监听窗口大小变化
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

/**
 * 响应式断点Hook
 */
export const useBreakpoint = () => {
  const { viewportSize } = useDevice();
  
  return {
    xs: viewportSize.width < 576,      // 超小屏幕
    sm: viewportSize.width >= 576 && viewportSize.width < 768,  // 小屏幕
    md: viewportSize.width >= 768 && viewportSize.width < 992,  // 中等屏幕
    lg: viewportSize.width >= 992 && viewportSize.width < 1200, // 大屏幕
    xl: viewportSize.width >= 1200 && viewportSize.width < 1600, // 超大屏幕
    xxl: viewportSize.width >= 1600,  // 超超大屏幕
  };
};

/**
 * 移动端方向Hook
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      setOrientation(newOrientation);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientation;
};