/**
 * 路由守卫
 */

import React from 'react';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  // 这里可以添加路由守卫逻辑
  // 比如检查用户登录状态、权限等
  
  return <>{children}</>;
};