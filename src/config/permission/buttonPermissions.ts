/**
 * 按钮权限配置
 * 定义页面中按钮对应的权限标识
 */

// 按钮权限映射表
export const BUTTON_PERMISSIONS = {
  // 视频相关按钮权限
  VIDEO: {
    UPLOAD: 'video:upload',
    EDIT: 'video:edit',
    DELETE: 'video:delete',
    AUDIT_PASS: 'video:audit:pass',
    AUDIT_REJECT: 'video:audit:reject',
    CATEGORY_CREATE: 'video:category:create',
    CATEGORY_EDIT: 'video:category:edit',
    CATEGORY_DELETE: 'video:category:delete',
    BATCH_DELETE: 'video:batch:delete',
    EXPORT: 'video:export'
  },
  
  // 文档相关按钮权限
  DOCUMENT: {
    UPLOAD: 'document:upload',
    EDIT: 'document:edit',
    DELETE: 'document:delete',
    DOWNLOAD: 'document:download',
    SHARE: 'document:share',
    COLLECT: 'document:collect',
    CATEGORY_CREATE: 'document:category:create',
    CATEGORY_EDIT: 'document:category:edit',
    CATEGORY_DELETE: 'document:category:delete',
    BATCH_DELETE: 'document:batch:delete',
    EXPORT: 'document:export'
  },
  
  // 用户管理按钮权限
  USER: {
    CREATE: 'user:create',
    EDIT: 'user:edit',
    DELETE: 'user:delete',
    RESET_PASSWORD: 'user:password:reset',
    ENABLE: 'user:enable',
    DISABLE: 'user:disable',
    ASSIGN_ROLE: 'user:role:assign',
    BATCH_DELETE: 'user:batch:delete',
    EXPORT: 'user:export',
    IMPORT: 'user:import'
  },
  
  // 角色权限管理按钮权限
  ROLE: {
    CREATE: 'role:create',
    EDIT: 'role:edit',
    DELETE: 'role:delete',
    ASSIGN_PERMISSION: 'role:permission:assign',
    COPY: 'role:copy'
  },
  
  // 权限管理按钮权限
  PERMISSION: {
    CREATE: 'permission:create',
    EDIT: 'permission:edit',
    DELETE: 'permission:delete',
    BATCH_ASSIGN: 'permission:batch:assign'
  },
  
  // 系统管理按钮权限
  SYSTEM: {
    SERVER_RESTART: 'system:server:restart',
    SERVER_SHUTDOWN: 'system:server:shutdown',
    LOG_CLEAR: 'system:log:clear',
    LOG_DOWNLOAD: 'system:log:download',
    CACHE_CLEAR: 'system:cache:clear',
    CONFIG_EDIT: 'system:config:edit',
    BACKUP_CREATE: 'system:backup:create',
    BACKUP_RESTORE: 'system:backup:restore'
  },
  
  // 字典管理按钮权限
  DICTIONARY: {
    CREATE: 'dict:create',
    EDIT: 'dict:edit',
    DELETE: 'dict:delete',
    ENABLE: 'dict:enable',
    DISABLE: 'dict:disable',
    IMPORT: 'dict:import',
    EXPORT: 'dict:export',
    SORT: 'dict:sort'
  },
  
  // 积分管理按钮权限
  POINT: {
    RULE_CREATE: 'point:rule:create',
    RULE_EDIT: 'point:rule:edit',
    RULE_DELETE: 'point:rule:delete',
    RULE_ENABLE: 'point:rule:enable',
    RULE_DISABLE: 'point:rule:disable',
    RECORD_VIEW: 'point:record:view',
    RECORD_EXPORT: 'point:record:export',
    MALL_ITEM_CREATE: 'point:mall:item:create',
    MALL_ITEM_EDIT: 'point:mall:item:edit',
    MALL_ITEM_DELETE: 'point:mall:item:delete',
    EXCHANGE_AUDIT: 'point:exchange:audit'
  },
  
  // 内容管理按钮权限
  CONTENT: {
    CREATE: 'content:create',
    EDIT: 'content:edit',
    DELETE: 'content:delete',
    PUBLISH: 'content:publish',
    UNPUBLISH: 'content:unpublish',
    TOP: 'content:top',
    UNTOP: 'content:untop',
    BATCH_DELETE: 'content:batch:delete',
    BATCH_PUBLISH: 'content:batch:publish',
    EXPORT: 'content:export'
  },
  
  // 评论管理按钮权限
  COMMENT: {
    DELETE: 'comment:delete',
    AUDIT_PASS: 'comment:audit:pass',
    AUDIT_REJECT: 'comment:audit:reject',
    BATCH_DELETE: 'comment:batch:delete',
    REPLY: 'comment:reply'
  },
  
  // 个人中心按钮权限
  PROFILE: {
    EDIT_INFO: 'profile:info:edit',
    CHANGE_PASSWORD: 'profile:password:change',
    UPLOAD_AVATAR: 'profile:avatar:upload',
    BIND_PHONE: 'profile:phone:bind',
    BIND_EMAIL: 'profile:email:bind',
    DELETE_ACCOUNT: 'profile:account:delete'
  }
};

// 页面按钮权限映射
export const PAGE_BUTTON_PERMISSIONS = {
  // 视频管理页面
  '/admin/video/list': [
    BUTTON_PERMISSIONS.VIDEO.UPLOAD,
    BUTTON_PERMISSIONS.VIDEO.EDIT,
    BUTTON_PERMISSIONS.VIDEO.DELETE,
    BUTTON_PERMISSIONS.VIDEO.BATCH_DELETE,
    BUTTON_PERMISSIONS.VIDEO.EXPORT
  ],
  
  // 视频审核页面
  '/admin/video/audit': [
    BUTTON_PERMISSIONS.VIDEO.AUDIT_PASS,
    BUTTON_PERMISSIONS.VIDEO.AUDIT_REJECT
  ],
  
  // 用户管理页面
  '/admin/user/list': [
    BUTTON_PERMISSIONS.USER.CREATE,
    BUTTON_PERMISSIONS.USER.EDIT,
    BUTTON_PERMISSIONS.USER.DELETE,
    BUTTON_PERMISSIONS.USER.RESET_PASSWORD,
    BUTTON_PERMISSIONS.USER.ENABLE,
    BUTTON_PERMISSIONS.USER.DISABLE,
    BUTTON_PERMISSIONS.USER.BATCH_DELETE,
    BUTTON_PERMISSIONS.USER.EXPORT,
    BUTTON_PERMISSIONS.USER.IMPORT
  ],
  
  // 角色管理页面
  '/admin/user/roles': [
    BUTTON_PERMISSIONS.ROLE.CREATE,
    BUTTON_PERMISSIONS.ROLE.EDIT,
    BUTTON_PERMISSIONS.ROLE.DELETE,
    BUTTON_PERMISSIONS.ROLE.ASSIGN_PERMISSION,
    BUTTON_PERMISSIONS.ROLE.COPY
  ],
  
  // 系统监控页面
  '/admin/system/monitor': [
    BUTTON_PERMISSIONS.SYSTEM.SERVER_RESTART,
    BUTTON_PERMISSIONS.SYSTEM.SERVER_SHUTDOWN,
    BUTTON_PERMISSIONS.SYSTEM.CACHE_CLEAR
  ],
  
  // 系统日志页面
  '/admin/system/logs': [
    BUTTON_PERMISSIONS.SYSTEM.LOG_CLEAR,
    BUTTON_PERMISSIONS.SYSTEM.LOG_DOWNLOAD
  ],
  
  // 字典管理页面
  '/admin/dictionary/items': [
    BUTTON_PERMISSIONS.DICTIONARY.CREATE,
    BUTTON_PERMISSIONS.DICTIONARY.EDIT,
    BUTTON_PERMISSIONS.DICTIONARY.DELETE,
    BUTTON_PERMISSIONS.DICTIONARY.ENABLE,
    BUTTON_PERMISSIONS.DICTIONARY.DISABLE,
    BUTTON_PERMISSIONS.DICTIONARY.IMPORT,
    BUTTON_PERMISSIONS.DICTIONARY.EXPORT,
    BUTTON_PERMISSIONS.DICTIONARY.SORT
  ],
  
  // 积分规则页面
  '/admin/point/rules': [
    BUTTON_PERMISSIONS.POINT.RULE_CREATE,
    BUTTON_PERMISSIONS.POINT.RULE_EDIT,
    BUTTON_PERMISSIONS.POINT.RULE_DELETE,
    BUTTON_PERMISSIONS.POINT.RULE_ENABLE,
    BUTTON_PERMISSIONS.POINT.RULE_DISABLE
  ],
  
  // 内容管理页面
  '/admin/content/documents': [
    BUTTON_PERMISSIONS.CONTENT.CREATE,
    BUTTON_PERMISSIONS.CONTENT.EDIT,
    BUTTON_PERMISSIONS.CONTENT.DELETE,
    BUTTON_PERMISSIONS.CONTENT.PUBLISH,
    BUTTON_PERMISSIONS.CONTENT.UNPUBLISH,
    BUTTON_PERMISSIONS.CONTENT.TOP,
    BUTTON_PERMISSIONS.CONTENT.BATCH_DELETE,
    BUTTON_PERMISSIONS.CONTENT.BATCH_PUBLISH,
    BUTTON_PERMISSIONS.CONTENT.EXPORT
  ]
};

// 获取页面按钮权限
export const getPageButtonPermissions = (path: string): string[] => {
  return PAGE_BUTTON_PERMISSIONS[path] || [];
};

// 检查按钮是否有权限
export const hasButtonPermission = (buttonPermission: string, userPermissions: string[]): boolean => {
  return userPermissions.includes(buttonPermission);
};