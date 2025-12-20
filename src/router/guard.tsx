/**
 * 路由守卫 - 保护需要登录的路由
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { message } from 'antd';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * 检查用户是否已登录
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  if (!token && !isLoggedIn) {
    return false;
  }
  
  // 检查7天自动登录是否过期
  const expireTime = localStorage.getItem('auth_expire_time');
  if (expireTime) {
    const expireTimestamp = parseInt(expireTime, 10);
    if (Date.now() > expireTimestamp) {
      // 已过期，清除登录状态
      clearAuthData();
      return false;
    }
  }
  
  return true;
};

/**
 * 清除认证数据
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('auth_expire_time');
};

/**
 * 路由守卫组件
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ children, requireAuth = false }) => {
  const location = useLocation();
  
  if (requireAuth && !isAuthenticated()) {
    message.warning('请先登录');
    // 保存当前路径，登录后可以跳转回来
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

/**
 * 后台管理路由守卫
 */
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = isAuthenticated();
  
  useEffect(() => {
    if (!isLoggedIn) {
      message.warning('请先登录后访问后台管理');
    }
  }, [isLoggedIn]);
  
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

/**
 * 检查是否需要登录才能执行操作的Hook
 */
export const useAuthCheck = () => {
  const isLoggedIn = isAuthenticated();
  
  /**
   * 检查登录状态，未登录时显示提示
   * @param action 操作名称，用于提示
   * @returns 是否已登录
   */
  const checkAuth = (action: string = '此操作'): boolean => {
    if (!isLoggedIn) {
      message.warning(`请先登录后再${action}`);
      return false;
    }
    return true;
  };
  
  /**
   * 需要登录才能执行的操作包装器
   * @param callback 要执行的回调函数
   * @param action 操作名称
   */
  const requireAuth = <T extends (...args: any[]) => any>(
    callback: T,
    action: string = '此操作'
  ): ((...args: Parameters<T>) => ReturnType<T> | void) => {
    return (...args: Parameters<T>) => {
      if (checkAuth(action)) {
        return callback(...args);
      }
    };
  };
  
  return {
    isLoggedIn,
    checkAuth,
    requireAuth
  };
};

/**
 * 需要登录的操作类型
 */
export type AuthRequiredAction = 'comment' | 'like' | 'favorite' | 'follow' | 'download';

/**
 * 操作名称映射
 */
const actionNameMap: Record<AuthRequiredAction, string> = {
  comment: '评论',
  like: '点赞',
  favorite: '收藏',
  follow: '关注',
  download: '下载'
};

/**
 * 检查特定操作是否需要登录
 */
export const checkActionAuth = (action: AuthRequiredAction): boolean => {
  if (!isAuthenticated()) {
    message.warning(`请先登录后再${actionNameMap[action]}`);
    return false;
  }
  return true;
};

export default RouteGuard;
