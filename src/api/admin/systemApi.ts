/**
 * 系统管理相关API
 */

import { get, post, put, del } from '../../utils/request';

// ==================== 类型定义 ====================

/** 系统配置项 */
export interface SystemConfig {
  id: number;
  category: string;
  key: string;
  value: string;
  name: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'file';
  options?: string[];
  required: boolean;
  sort: number;
  updateTime?: string;
  updater?: string;
}

/** 系统日志 */
export interface SystemLog {
  id: number;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  module: string;
  action: string;
  message: string;
  detail?: string;
  userId?: number;
  username?: string;
  ip?: string;
  userAgent?: string;
  createTime: string;
  traceId?: string;
}

/** 审计追踪 */
export interface AuditTrail {
  id: number;
  userId: number;
  username: string;
  action: string;
  resource: string;
  resourceId?: string;
  method: string;
  url: string;
  ip: string;
  userAgent?: string;
  requestData?: string;
  responseData?: string;
  status: 'success' | 'failed';
  duration: number;
  createTime: string;
}

/** 服务器信息 */
export interface ServerInfo {
  hostname: string;
  platform: string;
  arch: string;
  nodeVersion: string;
  uptime: number;
  loadAverage: number[];
  cpu: {
    model: string;
    cores: number;
    usage: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    upload: number;
    download: number;
  };
}

/** 分页响应 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== 系统配置API ====================

/**
 * 获取系统配置列表
 */
export const getSystemConfigs = async (params?: {
  category?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<SystemConfig>> => {
  return get('/admin/system/configs', { params });
};

/**
 * 获取系统配置分类
 */
export const getConfigCategories = async (): Promise<{
  category: string;
  name: string;
  count: number;
}[]> => {
  return get('/admin/system/config-categories');
};

/**
 * 获取配置项详情
 */
export const getSystemConfigDetail = async (id: number): Promise<SystemConfig> => {
  return get(`/admin/system/configs/${id}`);
};

/**
 * 更新系统配置
 */
export const updateSystemConfig = async (id: number, value: string): Promise<{ message: string }> => {
  return put(`/admin/system/configs/${id}`, { value });
};

/**
 * 批量更新系统配置
 */
export const batchUpdateConfigs = async (configs: { id: number; value: string }[]): Promise<{ 
  success: number; 
  failed: number; 
}> => {
  return post('/admin/system/configs/batch-update', { configs });
};

/**
 * 重置配置为默认值
 */
export const resetConfigToDefault = async (id: number): Promise<{ message: string }> => {
  return post(`/admin/system/configs/${id}/reset`);
};

/**
 * 导出系统配置
 */
export const exportSystemConfigs = async (category?: string): Promise<{ downloadUrl: string }> => {
  return post('/admin/system/configs/export', { category });
};

/**
 * 导入系统配置
 */
export const importSystemConfigs = async (file: File): Promise<{
  success: number;
  failed: number;
  errors?: string[];
}> => {
  const formData = new FormData();
  formData.append('file', file);
  return post('/admin/system/configs/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ==================== 系统日志API ====================

/**
 * 获取系统日志列表
 */
export const getSystemLogs = async (params?: {
  level?: string;
  module?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<SystemLog>> => {
  return get('/admin/system/logs', { params });
};

/**
 * 获取日志统计
 */
export const getLogStatistics = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<{
  totalLogs: number;
  levelDistribution: { level: string; count: number }[];
  moduleDistribution: { module: string; count: number }[];
  hourlyTrend: { hour: string; count: number }[];
}> => {
  return get('/admin/system/log-statistics', { params });
};

/**
 * 清理系统日志
 */
export const cleanSystemLogs = async (params: {
  beforeDate: string;
  level?: string;
  module?: string;
}): Promise<{ deletedCount: number; message: string }> => {
  return post('/admin/system/logs/clean', params);
};

/**
 * 导出系统日志
 */
export const exportSystemLogs = async (params: {
  level?: string;
  module?: string;
  startDate?: string;
  endDate?: string;
  format?: 'xlsx' | 'csv' | 'txt';
}): Promise<{ downloadUrl: string }> => {
  return post('/admin/system/logs/export', params);
};

// ==================== 审计追踪API ====================

/**
 * 获取审计追踪列表
 */
export const getAuditTrails = async (params?: {
  userId?: number;
  username?: string;
  action?: string;
  resource?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<AuditTrail>> => {
  return get('/admin/system/audit-trails', { params });
};

/**
 * 获取审计统计
 */
export const getAuditStatistics = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<{
  totalOperations: number;
  successRate: number;
  topUsers: { username: string; count: number }[];
  topActions: { action: string; count: number }[];
  hourlyTrend: { hour: string; count: number }[];
}> => {
  return get('/admin/system/audit-statistics', { params });
};

/**
 * 导出审计日志
 */
export const exportAuditTrails = async (params: {
  userId?: number;
  action?: string;
  startDate?: string;
  endDate?: string;
  format?: 'xlsx' | 'csv';
}): Promise<{ downloadUrl: string }> => {
  return post('/admin/system/audit-trails/export', params);
};

// ==================== 服务器监控API ====================

/**
 * 获取服务器信息
 */
export const getServerInfo = async (): Promise<ServerInfo> => {
  return get('/admin/system/server-info');
};

/**
 * 获取服务器性能历史数据
 */
export const getServerPerformanceHistory = async (params: {
  metric: 'cpu' | 'memory' | 'disk' | 'network';
  period: 'hour' | 'day' | 'week';
}): Promise<{
  time: string;
  value: number;
}[]> => {
  return get('/admin/system/server-performance', { params });
};

/**
 * 获取服务状态
 */
export const getServiceStatus = async (): Promise<{
  service: string;
  status: 'running' | 'stopped' | 'error';
  uptime?: number;
  memory?: number;
  cpu?: number;
}[]> => {
  return get('/admin/system/service-status');
};

/**
 * 重启服务
 */
export const restartService = async (serviceName: string): Promise<{ message: string }> => {
  return post(`/admin/system/services/${serviceName}/restart`);
};

/**
 * 清理系统缓存
 */
export const clearSystemCache = async (cacheType?: string): Promise<{ message: string }> => {
  return post('/admin/system/clear-cache', { cacheType });
};

/**
 * 系统健康检查
 */
export const systemHealthCheck = async (): Promise<{
  status: 'healthy' | 'warning' | 'error';
  checks: {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message?: string;
    duration: number;
  }[];
}> => {
  return get('/admin/system/health-check');
};

// ==================== 系统维护API ====================

/**
 * 数据库备份
 */
export const backupDatabase = async (): Promise<{ 
  backupId: string;
  filename: string;
  size: number;
  message: string;
}> => {
  return post('/admin/system/backup-database');
};

/**
 * 获取备份列表
 */
export const getBackupList = async (): Promise<{
  id: string;
  filename: string;
  size: number;
  createTime: string;
  type: 'manual' | 'auto';
}[]> => {
  return get('/admin/system/backups');
};

/**
 * 恢复数据库
 */
export const restoreDatabase = async (backupId: string): Promise<{ message: string }> => {
  return post(`/admin/system/restore-database/${backupId}`);
};

/**
 * 删除备份文件
 */
export const deleteBackup = async (backupId: string): Promise<{ message: string }> => {
  return del(`/admin/system/backups/${backupId}`);
};

/**
 * 系统更新检查
 */
export const checkSystemUpdate = async (): Promise<{
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion?: string;
  updateNotes?: string;
  downloadUrl?: string;
}> => {
  return get('/admin/system/check-update');
};