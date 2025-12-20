/**
 * 应用监控相关API
 */

import { get, post } from '../../utils/request';

// ==================== 类型定义 ====================

/** Core Web Vitals 指标 */
export interface WebVitals {
  fp: number;      // First Paint
  fcp: number;     // First Contentful Paint
  lcp: number;     // Largest Contentful Paint
  cls: number;     // Cumulative Layout Shift
  fid?: number;    // First Input Delay
  ttfb?: number;   // Time to First Byte
}

/** API监控项 */
export interface ApiMonitorItem {
  id: number;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'healthy' | 'warning' | 'error';
  callCount: number;
  avgResponseTime: number;
  successRate: number;
  lastCallTime?: string;
  errorCount?: number;
}

/** 错误追踪记录 */
export interface ErrorTraceItem {
  id: number;
  errorType: 'TypeError' | 'NetworkError' | 'ChunkLoadError' | 'SyntaxError' | 'ReferenceError' | 'ApiError';
  message: string;
  stack?: string;
  source?: string;
  lineNo?: number;
  colNo?: number;
  url: string;
  userAgent?: string;
  userId?: number;
  username?: string;
  count: number;
  firstOccur: string;
  lastOccur: string;
  status: 'open' | 'resolved' | 'ignored';
  assignee?: string;
}

/** 用户会话记录 */
export interface UserSession {
  id: number;
  sessionId: string;
  userId?: number;
  username?: string;
  avatar?: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os?: string;
  startTime: string;
  duration: string;
  durationMs: number;
  pageViews: number;
  apiCalls: number;
  errorCount: number;
  status: 'active' | 'ended';
  ip?: string;
  location?: string;
  lastActivity?: string;
  entryPage?: string;
  exitPage?: string;
}

/** 会话详情 */
export interface SessionDetail extends UserSession {
  activities: {
    time: string;
    type: 'pageview' | 'click' | 'api' | 'error';
    detail: string;
  }[];
}

/** 监控统计 */
export interface MonitorStatistics {
  totalApiCalls: number;
  avgResponseTime: number;
  successRate: number;
  errorCount: number;
  activeUsers: number;
  activeSessions: number;
}

/** 分页响应 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== Web Vitals API ====================

/**
 * 获取 Core Web Vitals 指标
 */
export const getWebVitals = async (): Promise<WebVitals> => {
  return get('/admin/monitor/web-vitals');
};

/**
 * 获取 Web Vitals 历史趋势
 */
export const getWebVitalsTrend = async (params: {
  metric: 'fp' | 'fcp' | 'lcp' | 'cls';
  period: 'day' | 'week' | 'month';
}): Promise<{ time: string; value: number }[]> => {
  return get('/admin/monitor/web-vitals/trend', { params });
};

// ==================== API监控 API ====================

/**
 * 获取API监控列表
 */
export const getApiMonitorList = async (params?: {
  status?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<ApiMonitorItem>> => {
  return get('/admin/monitor/api/list', { params });
};

/**
 * 获取API详细统计
 */
export const getApiDetail = async (endpoint: string): Promise<{
  endpoint: string;
  hourlyStats: { hour: string; calls: number; avgTime: number; errorRate: number }[];
  recentErrors: { time: string; status: number; message: string }[];
}> => {
  return get('/admin/monitor/api/detail', { params: { endpoint } });
};

/**
 * 获取API调用趋势
 */
export const getApiTrend = async (period: 'hour' | 'day' | 'week'): Promise<{
  time: string;
  calls: number;
  avgResponseTime: number;
}[]> => {
  return get('/admin/monitor/api/trend', { params: { period } });
};

// ==================== 错误追踪 API ====================

/**
 * 获取错误列表
 */
export const getErrorList = async (params?: {
  errorType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<ErrorTraceItem>> => {
  return get('/admin/monitor/errors', { params });
};

/**
 * 获取错误详情
 */
export const getErrorDetail = async (errorId: number): Promise<ErrorTraceItem & {
  occurrences: { time: string; userId?: number; url: string; userAgent: string }[];
}> => {
  return get(`/admin/monitor/errors/${errorId}`);
};

/**
 * 更新错误状态
 */
export const updateErrorStatus = async (
  errorId: number, 
  status: 'resolved' | 'ignored'
): Promise<{ message: string }> => {
  return post(`/admin/monitor/errors/${errorId}/status`, { status });
};

/**
 * 批量处理错误
 */
export const batchUpdateErrors = async (
  errorIds: number[], 
  status: 'resolved' | 'ignored'
): Promise<{ success: number; failed: number }> => {
  return post('/admin/monitor/errors/batch', { errorIds, status });
};

/**
 * 分配错误给处理人
 */
export const assignError = async (
  errorId: number, 
  assignee: string
): Promise<{ message: string }> => {
  return post(`/admin/monitor/errors/${errorId}/assign`, { assignee });
};

// ==================== 用户会话 API ====================

/**
 * 获取用户会话列表
 */
export const getSessionList = async (params?: {
  status?: 'active' | 'ended';
  device?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<UserSession>> => {
  return get('/admin/monitor/sessions', { params });
};

/**
 * 获取会话详情
 */
export const getSessionDetail = async (sessionId: string): Promise<SessionDetail> => {
  return get(`/admin/monitor/sessions/${sessionId}`);
};

/**
 * 获取实时在线会话
 */
export const getActiveSessions = async (): Promise<{
  count: number;
  sessions: UserSession[];
}> => {
  return get('/admin/monitor/sessions/active');
};

/**
 * 强制结束会话
 */
export const terminateSession = async (sessionId: string): Promise<{ message: string }> => {
  return post(`/admin/monitor/sessions/${sessionId}/terminate`);
};

// ==================== 统计 API ====================

/**
 * 获取监控统计概览
 */
export const getMonitorStatistics = async (): Promise<MonitorStatistics> => {
  return get('/admin/monitor/statistics');
};

/**
 * 导出监控报告
 */
export const exportMonitorReport = async (params: {
  type: 'api' | 'error' | 'session';
  startDate: string;
  endDate: string;
  format?: 'xlsx' | 'csv';
}): Promise<{ downloadUrl: string }> => {
  return post('/admin/monitor/export', params);
};
