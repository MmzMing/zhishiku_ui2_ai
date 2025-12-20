/**
 * 角色权限管理相关API
 */

import { get, post, put, del } from '../../utils/request';

// ==================== 类型定义 ====================

/** 角色信息 */
export interface RoleInfo {
  id: number;
  name: string;
  code: string;
  description?: string;
  userCount: number;
  permissionCount: number;
  status: 'enabled' | 'disabled';
  isSystem: boolean;
  createTime: string;
  updateTime?: string;
}

/** 权限节点 */
export interface PermissionNode {
  id: number;
  key: string;
  name: string;
  code: string;
  type: 'menu' | 'button' | 'api';
  parentId: number | null;
  path?: string;
  icon?: string;
  sort: number;
  status: 'enabled' | 'disabled';
  children?: PermissionNode[];
}

/** 权限变更日志 */
export interface PermissionChangeLog {
  id: number;
  roleId: number;
  roleName: string;
  operatorId: number;
  operator: string;
  action: 'grant' | 'revoke' | 'create_role' | 'delete_role' | 'update_role';
  changeType: string;
  beforePermissions?: string[];
  afterPermissions?: string[];
  detail: string;
  time: string;
  ip?: string;
}

/** 角色权限配置 */
export interface RolePermissionConfig {
  roleId: number;
  roleName: string;
  permissionIds: number[];
  permissionKeys: string[];
}

/** 分页响应 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== 角色管理API ====================

/**
 * 获取角色列表
 */
export const getRoleList = async (params?: {
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<RoleInfo>> => {
  return get('/admin/role/list', { params });
};

/**
 * 获取角色详情
 */
export const getRoleDetail = async (roleId: number): Promise<RoleInfo> => {
  return get(`/admin/role/${roleId}`);
};

/**
 * 创建角色
 */
export const createRole = async (data: {
  name: string;
  code: string;
  description?: string;
  permissionIds?: number[];
}): Promise<{ id: number; message: string }> => {
  return post('/admin/role/create', data);
};

/**
 * 更新角色
 */
export const updateRole = async (roleId: number, data: {
  name?: string;
  description?: string;
  status?: 'enabled' | 'disabled';
}): Promise<{ message: string }> => {
  return put(`/admin/role/${roleId}`, data);
};

/**
 * 删除角色
 */
export const deleteRole = async (roleId: number): Promise<{ message: string }> => {
  return del(`/admin/role/${roleId}`);
};

// ==================== 权限管理API ====================

/**
 * 获取权限树
 */
export const getPermissionTree = async (): Promise<PermissionNode[]> => {
  return get('/admin/permission/tree');
};

/**
 * 获取角色已分配的权限
 */
export const getRolePermissions = async (roleId: number): Promise<{
  roleId: number;
  permissionIds: number[];
  permissionKeys: string[];
}> => {
  return get(`/admin/role/${roleId}/permissions`);
};

/**
 * 保存角色权限配置
 */
export const saveRolePermissions = async (roleId: number, data: {
  permissionIds: number[];
}): Promise<{ message: string }> => {
  return post(`/admin/role/${roleId}/permissions`, data);
};

/**
 * 批量授权
 */
export const batchGrantPermissions = async (data: {
  roleIds: number[];
  permissionIds: number[];
}): Promise<{ success: number; failed: number }> => {
  return post('/admin/role/batch-grant', data);
};

/**
 * 批量撤销权限
 */
export const batchRevokePermissions = async (data: {
  roleIds: number[];
  permissionIds: number[];
}): Promise<{ success: number; failed: number }> => {
  return post('/admin/role/batch-revoke', data);
};

// ==================== 权限变更日志API ====================

/**
 * 获取权限变更日志
 */
export const getPermissionChangeLogs = async (params?: {
  roleId?: number;
  operator?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<PermissionChangeLog>> => {
  return get('/admin/permission/change-logs', { params });
};

/**
 * 获取角色的权限变更历史
 */
export const getRoleChangeLogs = async (roleId: number): Promise<PermissionChangeLog[]> => {
  return get(`/admin/role/${roleId}/change-logs`);
};

/**
 * 导出权限变更日志
 */
export const exportChangeLogs = async (params: {
  startDate: string;
  endDate: string;
  format?: 'xlsx' | 'csv';
}): Promise<{ downloadUrl: string }> => {
  return post('/admin/permission/change-logs/export', params);
};

// ==================== 统计API ====================

/**
 * 获取角色权限统计
 */
export const getRolePermissionStats = async (): Promise<{
  totalRoles: number;
  totalPermissions: number;
  assignedUsers: number;
  todayChanges: number;
}> => {
  return get('/admin/role/statistics');
};
