/**
 * 用户行为管理相关API
 */

import { get, post } from '../../utils/request';

// ==================== 类型定义 ====================

/** 操作日志 */
export interface OperationLog {
  id: number;
  userId: number;
  username: string;
  avatar?: string;
  action: string;
  actionType: 'login' | 'logout' | 'edit' | 'delete' | 'upload' | 'download' | 'view' | 'other';
  target?: string;
  targetType?: string;
  ip: string;
  location: string;
  device?: string;
  browser?: string;
  time: string;
  result: 'success' | 'fail';
  remark?: string;
  duration?: number;
}

/** 异常行为记录 */
export interface AbnormalBehavior {
  id: number;
  userId: number;
  username: string;
  avatar?: string;
  behaviorType: 'frequent_login_fail' | 'unusual_location' | 'suspicious_operation' | 'brute_force' | 'data_leak_risk';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detail: string;
  ip: string;
  location: string;
  time: string;
  status: 'pending' | 'processing' | 'resolved' | 'ignored';
  handler?: string;
  handleTime?: string;
  handleResult?: string;
}

/** 登录排行榜项 */
export interface LoginRankItem {
  rank: number;
  userId: number;
  username: string;
  avatar?: string;
  loginCount: number;
  lastLoginTime: string;
  lastLoginIp: string;
  lastLoginLocation: string;
  trend: 'up' | 'down' | 'same';
  trendValue?: number;
}

/** 用户行为统计 */
export interface BehaviorStatistics {
  todayOperations: number;
  activeUsers: number;
  abnormalCount: number;
  loginFailCount: number;
  weeklyTrend: { date: string; count: number }[];
  actionDistribution: { action: string; count: number }[];
}

/** 分页响应 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== API 接口 ====================

/**
 * 获取用户行为统计
 */
export const getBehaviorStatistics = async (): Promise<BehaviorStatistics> => {
  return get('/admin/user/behavior/statistics');
};

/**
 * 获取操作日志列表
 */
export const getOperationLogs = async (params: {
  username?: string;
  actionType?: string;
  result?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<OperationLog>> => {
  return get('/admin/user/behavior/logs', { params });
};

/**
 * 获取异常行为列表
 */
export const getAbnormalBehaviors = async (params: {
  riskLevel?: string;
  behaviorType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<AbnormalBehavior>> => {
  return get('/admin/user/behavior/abnormal', { params });
};

/**
 * 获取异常行为详情
 */
export const getAbnormalBehaviorDetail = async (id: number): Promise<AbnormalBehavior> => {
  return get(`/admin/user/behavior/abnormal/${id}`);
};

/**
 * 处理异常行为
 */
export const handleAbnormalBehavior = async (
  id: number,
  data: {
    action: 'resolve' | 'ignore' | 'block_user' | 'reset_password';
    remark?: string;
  }
): Promise<{ message: string }> => {
  return post(`/admin/user/behavior/abnormal/handle/${id}`, data);
};

/**
 * 批量处理异常行为
 */
export const batchHandleAbnormal = async (
  ids: number[],
  action: 'resolve' | 'ignore'
): Promise<{ success: number; failed: number }> => {
  return post('/admin/user/behavior/abnormal/batch', { ids, action });
};

/**
 * 获取登录次数排行榜
 */
export const getLoginRanking = async (params: {
  period: 'today' | 'week' | 'month';
  limit?: number;
}): Promise<LoginRankItem[]> => {
  return get('/admin/user/behavior/login-ranking', { params });
};

/**
 * 获取用户登录历史
 */
export const getUserLoginHistory = async (
  userId: number,
  params?: { page?: number; pageSize?: number }
): Promise<PageResponse<OperationLog>> => {
  return get(`/admin/user/behavior/login-history/${userId}`, { params });
};

/**
 * 检测异常行为（手动触发）
 */
export const detectAbnormalBehavior = async (): Promise<{
  detected: number;
  newAlerts: AbnormalBehavior[];
}> => {
  return post('/admin/user/behavior/detect');
};

/**
 * 获取实时在线用户
 */
export const getOnlineUsers = async (): Promise<{
  count: number;
  users: { userId: number; username: string; loginTime: string; ip: string; location: string }[];
}> => {
  return get('/admin/user/behavior/online');
};

/**
 * 强制用户下线
 */
export const forceUserOffline = async (userId: number): Promise<{ message: string }> => {
  return post(`/admin/user/behavior/force-offline/${userId}`);
};

/**
 * 导出操作日志
 */
export const exportOperationLogs = async (params: {
  startDate: string;
  endDate: string;
  format?: 'xlsx' | 'csv';
}): Promise<{ downloadUrl: string }> => {
  return post('/admin/user/behavior/export', params);
};


// ==================== 用户管理类型定义 ====================

/** 用户信息 */
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  phone: string;
  roleId: number;
  roleName: string;
  departmentId?: number;
  departmentName?: string;
  points: number;
  status: 'active' | 'disabled';
  lastLoginTime?: string;
  lastLoginIp?: string;
  lastLoginLocation?: string;
  createTime: string;
  updateTime?: string;
}

/** 用户登录日志 */
export interface UserLoginLog {
  id: number;
  userId: number;
  username: string;
  loginTime: string;
  ip: string;
  location: string;
  device: string;
  browser: string;
  os: string;
  result: 'success' | 'fail';
  failReason?: string;
}

/** 用户统计 */
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  todayNewUsers: number;
  disabledUsers: number;
}

// ==================== 用户管理API ====================

/**
 * 获取用户列表
 */
export const getUserList = async (params?: {
  keyword?: string;
  roleId?: number;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<UserInfo>> => {
  return get('/admin/user/list', { params });
};

/**
 * 获取用户详情
 */
export const getUserDetail = async (userId: number): Promise<UserInfo> => {
  return get(`/admin/user/${userId}`);
};

/**
 * 创建用户
 */
export const createUser = async (data: {
  username: string;
  nickname: string;
  password: string;
  email?: string;
  phone?: string;
  roleId: number;
  departmentId?: number;
}): Promise<{ id: number; message: string }> => {
  return post('/admin/user/create', data);
};

/**
 * 更新用户信息
 */
export const updateUser = async (userId: number, data: {
  nickname?: string;
  email?: string;
  phone?: string;
  roleId?: number;
  departmentId?: number;
  avatar?: string;
}): Promise<{ message: string }> => {
  return post(`/admin/user/update/${userId}`, data);
};

/**
 * 删除用户
 */
export const deleteUser = async (userId: number): Promise<{ message: string }> => {
  return post(`/admin/user/delete/${userId}`);
};

/**
 * 批量删除用户
 */
export const batchDeleteUsers = async (userIds: number[]): Promise<{ 
  success: number; 
  failed: number;
  message: string;
}> => {
  return post('/admin/user/batch-delete', { userIds });
};

/**
 * 修改用户状态
 */
export const updateUserStatus = async (userId: number, status: 'active' | 'disabled'): Promise<{ message: string }> => {
  return post(`/admin/user/status/${userId}`, { status });
};

/**
 * 批量修改用户状态
 */
export const batchUpdateUserStatus = async (userIds: number[], status: 'active' | 'disabled'): Promise<{
  success: number;
  failed: number;
}> => {
  return post('/admin/user/batch-status', { userIds, status });
};

/**
 * 重置用户密码
 */
export const resetUserPassword = async (userId: number, newPassword?: string): Promise<{ 
  message: string;
  tempPassword?: string;
}> => {
  return post(`/admin/user/reset-password/${userId}`, { newPassword });
};

/**
 * 批量重置密码
 */
export const batchResetPassword = async (userIds: number[]): Promise<{
  success: number;
  failed: number;
  results: { userId: number; tempPassword: string }[];
}> => {
  return post('/admin/user/batch-reset-password', { userIds });
};

/**
 * 获取用户登录日志
 */
export const getUserLoginLogs = async (userId: number, params?: {
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<UserLoginLog>> => {
  return get(`/admin/user/${userId}/login-logs`, { params });
};

/**
 * 获取用户统计数据
 */
export const getUserStatistics = async (): Promise<UserStatistics> => {
  return get('/admin/user/statistics');
};

/**
 * 获取角色列表（用于下拉选择）
 */
export const getRoleOptions = async (): Promise<{ id: number; name: string }[]> => {
  return get('/admin/user/role-options');
};

/**
 * 获取部门列表（用于下拉选择）
 */
export const getDepartmentOptions = async (): Promise<{ id: number; name: string }[]> => {
  return get('/admin/user/department-options');
};
