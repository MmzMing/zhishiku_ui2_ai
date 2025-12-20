/**
 * 认证相关 Hook
 * 用于检查登录状态和保护需要登录的操作
 */

import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { isAuthenticated, clearAuthData, AuthRequiredAction, checkActionAuth } from '../../router/guard';

/**
 * 认证 Hook - 不依赖 Redux
 */
export const useAuth = () => {
  const navigate = useNavigate();
  
  // 是否已登录
  const isLoggedIn = useMemo(() => {
    return isAuthenticated();
  }, []);
  
  // 用户信息 - 从 localStorage 获取
  const userInfo = useMemo(() => {
    try {
      const userInfoStr = localStorage.getItem('user_info');
      return userInfoStr ? JSON.parse(userInfoStr) : null;
    } catch {
      return null;
    }
  }, []);
  
  /**
   * 检查登录状态
   * @param actionName 操作名称，用于提示
   * @returns 是否已登录
   */
  const checkAuth = useCallback((actionName: string = '此操作'): boolean => {
    if (!isAuthenticated()) {
      message.warning(`请先登录后再${actionName}`);
      return false;
    }
    return true;
  }, []);
  
  /**
   * 检查特定操作的登录状态
   */
  const checkAction = useCallback((action: AuthRequiredAction): boolean => {
    return checkActionAuth(action);
  }, []);
  
  /**
   * 需要登录才能执行的操作包装器
   * @param callback 要执行的回调函数
   * @param actionName 操作名称
   */
  const requireAuth = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    actionName: string = '此操作'
  ): ((...args: Parameters<T>) => ReturnType<T> | void) => {
    return (...args: Parameters<T>) => {
      if (checkAuth(actionName)) {
        return callback(...args);
      }
    };
  }, [checkAuth]);
  
  /**
   * 跳转到登录页
   * @param redirectPath 登录后重定向的路径
   */
  const goToLogin = useCallback((redirectPath?: string) => {
    const state = redirectPath ? { from: { pathname: redirectPath } } : undefined;
    navigate('/auth/login', { state });
  }, [navigate]);
  
  /**
   * 退出登录
   */
  const logout = useCallback(() => {
    clearAuthData();
    window.dispatchEvent(new Event('login-change'));
    message.success('已退出登录');
    navigate('/home');
  }, [navigate]);
  
  /**
   * 评论操作检查
   */
  const canComment = useCallback((): boolean => {
    return checkAction('comment');
  }, [checkAction]);
  
  /**
   * 点赞操作检查
   */
  const canLike = useCallback((): boolean => {
    return checkAction('like');
  }, [checkAction]);
  
  /**
   * 收藏操作检查
   */
  const canFavorite = useCallback((): boolean => {
    return checkAction('favorite');
  }, [checkAction]);
  
  /**
   * 关注操作检查
   */
  const canFollow = useCallback((): boolean => {
    return checkAction('follow');
  }, [checkAction]);
  
  /**
   * 下载操作检查
   */
  const canDownload = useCallback((): boolean => {
    return checkAction('download');
  }, [checkAction]);
  
  return {
    isLoggedIn,
    userInfo,
    checkAuth,
    checkAction,
    requireAuth,
    goToLogin,
    logout,
    canComment,
    canLike,
    canFavorite,
    canFollow,
    canDownload
  };
};

export default useAuth;