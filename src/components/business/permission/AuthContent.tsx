/**
 * 权限控制内容组件
 */

import React from 'react';

interface AuthContentProps {
  permission?: string; // 权限标识
  permissions?: string[]; // 当前用户权限列表
  fallback?: React.ReactNode; // 无权限时的替代内容
  children: React.ReactNode;
}

const AuthContent: React.FC<AuthContentProps> = ({
  permission,
  permissions = [], // TODO: 从状态管理获取用户权限
  fallback = null,
  children,
}) => {
  // 检查权限
  const hasPermission = () => {
    if (!permission) return true; // 没有设置权限要求，默认有权限
    return permissions.includes(permission);
  };

  // 无权限时返回替代内容或null
  if (!hasPermission()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuthContent;