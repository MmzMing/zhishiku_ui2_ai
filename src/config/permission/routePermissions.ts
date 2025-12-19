/**
 * 路由权限配置
 * 定义每个路由对应的权限标识
 */

// 权限标识类型
export type PermissionCode = string;

// 路由权限映射表
export const ROUTE_PERMISSIONS: Record<string, PermissionCode[]> = {
  // 前台路由（无需权限）
  '/': [],
  '/login': [],
  '/register': [],
  '/reset-password': [],
  '/video': [],
  '/video/:id': [],
  '/document': [],
  '/document/:id': [],
  '/search': [],
  
  // 个人中心（需要登录）
  '/profile': ['user:profile:view'],
  '/profile/info': ['user:profile:edit'],
  '/profile/collection': ['user:collection:view'],
  '/profile/history': ['user:history:view'],
  '/profile/points': ['user:points:view'],
  '/profile/settings': ['user:settings:edit'],
  
  // 后台管理（需要管理员权限）
  '/admin': ['admin:dashboard:view'],
  
  // 控制台
  '/admin/dashboard': ['admin:dashboard:view'],
  '/admin/dashboard/overview': ['admin:dashboard:overview'],
  '/admin/dashboard/statistics': ['admin:dashboard:statistics'],
  
  // 系统模块
  '/admin/system': ['admin:system:view'],
  '/admin/system/server': ['admin:system:server:view'],
  '/admin/system/monitor': ['admin:system:monitor:view'],
  '/admin/system/logs': ['admin:system:logs:view'],
  '/admin/system/audit': ['admin:system:audit:view'],
  
  // 视频管理
  '/admin/video': ['admin:video:view'],
  '/admin/video/list': ['admin:video:list'],
  '/admin/video/upload': ['admin:video:upload'],
  '/admin/video/category': ['admin:video:category:manage'],
  '/admin/video/audit': ['admin:video:audit'],
  
  // 字典管理
  '/admin/dictionary': ['admin:dict:view'],
  '/admin/dictionary/category': ['admin:dict:category:manage'],
  '/admin/dictionary/items': ['admin:dict:items:manage'],
  
  // 人员管理
  '/admin/user': ['admin:user:view'],
  '/admin/user/list': ['admin:user:list'],
  '/admin/user/roles': ['admin:user:roles:manage'],
  '/admin/user/permissions': ['admin:user:permissions:manage'],
  '/admin/user/departments': ['admin:user:departments:manage'],
  
  // 积分管理
  '/admin/point': ['admin:point:view'],
  '/admin/point/rules': ['admin:point:rules:manage'],
  '/admin/point/records': ['admin:point:records:view'],
  '/admin/point/mall': ['admin:point:mall:manage'],
  '/admin/point/ranking': ['admin:point:ranking:view'],
  
  // 内容管理
  '/admin/content': ['admin:content:view'],
  '/admin/content/documents': ['admin:content:documents:manage'],
  '/admin/content/editor': ['admin:content:editor:use'],
  '/admin/content/categories': ['admin:content:categories:manage'],
  '/admin/content/statistics': ['admin:content:statistics:view']
};

// 权限分组
export const PERMISSION_GROUPS = {
  // 用户权限
  USER: {
    name: '用户权限',
    permissions: [
      'user:profile:view',
      'user:profile:edit',
      'user:collection:view',
      'user:history:view',
      'user:points:view',
      'user:settings:edit'
    ]
  },
  
  // 管理员权限
  ADMIN: {
    name: '管理员权限',
    permissions: [
      'admin:dashboard:view',
      'admin:dashboard:overview',
      'admin:dashboard:statistics'
    ]
  },
  
  // 系统管理权限
  SYSTEM: {
    name: '系统管理',
    permissions: [
      'admin:system:view',
      'admin:system:server:view',
      'admin:system:monitor:view',
      'admin:system:logs:view',
      'admin:system:audit:view'
    ]
  },
  
  // 视频管理权限
  VIDEO: {
    name: '视频管理',
    permissions: [
      'admin:video:view',
      'admin:video:list',
      'admin:video:upload',
      'admin:video:edit',
      'admin:video:delete',
      'admin:video:category:manage',
      'admin:video:audit'
    ]
  },
  
  // 字典管理权限
  DICTIONARY: {
    name: '字典管理',
    permissions: [
      'admin:dict:view',
      'admin:dict:category:manage',
      'admin:dict:items:manage'
    ]
  },
  
  // 用户管理权限
  USER_MANAGEMENT: {
    name: '用户管理',
    permissions: [
      'admin:user:view',
      'admin:user:list',
      'admin:user:create',
      'admin:user:edit',
      'admin:user:delete',
      'admin:user:roles:manage',
      'admin:user:permissions:manage',
      'admin:user:departments:manage'
    ]
  },
  
  // 积分管理权限
  POINT: {
    name: '积分管理',
    permissions: [
      'admin:point:view',
      'admin:point:rules:manage',
      'admin:point:records:view',
      'admin:point:mall:manage',
      'admin:point:ranking:view'
    ]
  },
  
  // 内容管理权限
  CONTENT: {
    name: '内容管理',
    permissions: [
      'admin:content:view',
      'admin:content:documents:manage',
      'admin:content:editor:use',
      'admin:content:categories:manage',
      'admin:content:statistics:view'
    ]
  }
};

// 角色权限映射
export const ROLE_PERMISSIONS = {
  // 普通用户
  USER: PERMISSION_GROUPS.USER.permissions,
  
  // 管理员
  ADMIN: [
    ...PERMISSION_GROUPS.USER.permissions,
    ...PERMISSION_GROUPS.ADMIN.permissions,
    ...PERMISSION_GROUPS.SYSTEM.permissions,
    ...PERMISSION_GROUPS.VIDEO.permissions,
    ...PERMISSION_GROUPS.DICTIONARY.permissions,
    ...PERMISSION_GROUPS.USER_MANAGEMENT.permissions,
    ...PERMISSION_GROUPS.POINT.permissions,
    ...PERMISSION_GROUPS.CONTENT.permissions
  ],
  
  // 内容管理员
  CONTENT_ADMIN: [
    ...PERMISSION_GROUPS.USER.permissions,
    ...PERMISSION_GROUPS.VIDEO.permissions,
    ...PERMISSION_GROUPS.CONTENT.permissions
  ],
  
  // 系统管理员
  SYSTEM_ADMIN: [
    ...PERMISSION_GROUPS.USER.permissions,
    ...PERMISSION_GROUPS.ADMIN.permissions,
    ...PERMISSION_GROUPS.SYSTEM.permissions,
    ...PERMISSION_GROUPS.USER_MANAGEMENT.permissions
  ]
};

// 获取路由所需权限
export const getRoutePermissions = (path: string): PermissionCode[] => {
  return ROUTE_PERMISSIONS[path] || [];
};

// 检查路由是否需要权限
export const isRouteNeedPermission = (path: string): boolean => {
  const permissions = getRoutePermissions(path);
  return permissions.length > 0;
};