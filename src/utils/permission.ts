/**
 * 权限工具函数
 */

// 权限类型定义
export type Permission = string;
export type Role = string;

// 权限检查结果
export interface PermissionCheckResult {
  hasPermission: boolean;
  missingPermissions?: Permission[];
}

/**
 * 检查单个权限
 */
export const hasPermission = (
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean => {
  if (!requiredPermission) return true;
  return userPermissions.includes(requiredPermission);
};

/**
 * 检查多个权限（需要全部满足）
 */
export const hasAllPermissions = (
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): PermissionCheckResult => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return { hasPermission: true };
  }

  const missingPermissions = requiredPermissions.filter(
    permission => !userPermissions.includes(permission)
  );

  return {
    hasPermission: missingPermissions.length === 0,
    missingPermissions: missingPermissions.length > 0 ? missingPermissions : undefined,
  };
};

/**
 * 检查多个权限（满足任意一个即可）
 */
export const hasAnyPermission = (
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  return requiredPermissions.some(permission =>
    userPermissions.includes(permission)
  );
};

/**
 * 检查角色权限
 */
export const hasRole = (
  userRoles: Role[],
  requiredRole: Role
): boolean => {
  if (!requiredRole) return true;
  return userRoles.includes(requiredRole);
};

/**
 * 检查多个角色（需要全部满足）
 */
export const hasAllRoles = (
  userRoles: Role[],
  requiredRoles: Role[]
): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  return requiredRoles.every(role => userRoles.includes(role));
};

/**
 * 检查多个角色（满足任意一个即可）
 */
export const hasAnyRole = (
  userRoles: Role[],
  requiredRoles: Role[]
): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  return requiredRoles.some(role => userRoles.includes(role));
};

/**
 * 过滤有权限的路由
 */
export const filterRoutesByPermission = <T extends { permission?: Permission }>(
  routes: T[],
  userPermissions: Permission[]
): T[] => {
  return routes.filter(route => {
    if (!route.permission) return true;
    return hasPermission(userPermissions, route.permission);
  });
};

/**
 * 过滤有权限的菜单项
 */
export const filterMenusByPermission = <T extends { 
  permission?: Permission;
  children?: T[];
}>(
  menus: T[],
  userPermissions: Permission[]
): T[] => {
  return menus
    .filter(menu => {
      if (!menu.permission) return true;
      return hasPermission(userPermissions, menu.permission);
    })
    .map(menu => ({
      ...menu,
      children: menu.children 
        ? filterMenusByPermission(menu.children, userPermissions)
        : undefined,
    }))
    .filter(menu => !menu.children || menu.children.length > 0);
};

/**
 * 权限常量定义
 */
export const PERMISSIONS = {
  // 用户管理
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_EXPORT: 'user:export',

  // 角色管理
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_EDIT: 'role:edit',
  ROLE_DELETE: 'role:delete',

  // 视频管理
  VIDEO_VIEW: 'video:view',
  VIDEO_CREATE: 'video:create',
  VIDEO_EDIT: 'video:edit',
  VIDEO_DELETE: 'video:delete',
  VIDEO_PUBLISH: 'video:publish',
  VIDEO_AUDIT: 'video:audit',

  // 文档管理
  DOCUMENT_VIEW: 'document:view',
  DOCUMENT_CREATE: 'document:create',
  DOCUMENT_EDIT: 'document:edit',
  DOCUMENT_DELETE: 'document:delete',
  DOCUMENT_PUBLISH: 'document:publish',
  DOCUMENT_AUDIT: 'document:audit',

  // 内容管理
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',

  // 字典管理
  DICT_VIEW: 'dict:view',
  DICT_CREATE: 'dict:create',
  DICT_EDIT: 'dict:edit',
  DICT_DELETE: 'dict:delete',

  // 积分管理
  POINT_VIEW: 'point:view',
  POINT_CREATE: 'point:create',
  POINT_EDIT: 'point:edit',
  POINT_DELETE: 'point:delete',
  POINT_GRANT: 'point:grant',

  // 系统管理
  SYSTEM_VIEW: 'system:view',
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_LOG: 'system:log',
  SYSTEM_MONITOR: 'system:monitor',

  // 统计分析
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
} as const;

/**
 * 角色常量定义
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user',
  GUEST: 'guest',
} as const;

/**
 * 角色权限映射
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.VIDEO_VIEW,
    PERMISSIONS.VIDEO_CREATE,
    PERMISSIONS.VIDEO_EDIT,
    PERMISSIONS.VIDEO_DELETE,
    PERMISSIONS.VIDEO_PUBLISH,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_EDIT,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.DOCUMENT_PUBLISH,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_DELETE,
    PERMISSIONS.DICT_VIEW,
    PERMISSIONS.DICT_CREATE,
    PERMISSIONS.DICT_EDIT,
    PERMISSIONS.DICT_DELETE,
    PERMISSIONS.POINT_VIEW,
    PERMISSIONS.POINT_CREATE,
    PERMISSIONS.POINT_EDIT,
    PERMISSIONS.POINT_DELETE,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.VIDEO_VIEW,
    PERMISSIONS.VIDEO_CREATE,
    PERMISSIONS.VIDEO_EDIT,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_EDIT,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
  ],
  [ROLES.USER]: [],
  [ROLES.GUEST]: [],
};

/**
 * 根据角色获取权限列表
 */
export const getPermissionsByRoles = (roles: Role[]): Permission[] => {
  const permissions = new Set<Permission>();
  
  roles.forEach(role => {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    rolePermissions.forEach(permission => permissions.add(permission));
  });
  
  return Array.from(permissions);
};