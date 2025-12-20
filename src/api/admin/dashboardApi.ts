/**
 * 后台控制台相关API
 */

import { get, post, put, del } from '../../utils/request';
import type { ApiResponse } from '../../types/common';

// 访问趋势数据接口
export interface VisitTrendData {
  date: string;
  visits: number;
  users: number;
  pageViews: number;
}

// 分类占比数据接口
export interface CategoryData {
  category: string;
  value: number;
  percentage: number;
}

// 统计概览数据接口
export interface StatsOverview {
  totalUsers: number;
  totalDocuments: number;
  totalVideos: number;
  totalPoints: number;
  todayVisits: number;
  todayUsers: number;
  growthRate: {
    users: number;
    documents: number;
    videos: number;
    visits: number;
  };
}

// 最近活动数据接口
export interface RecentActivity {
  id: string;
  action: string;
  target: string;
  user: string;
  time: string;
  type: 'video' | 'document' | 'user' | 'point';
}

// 待办事项数据接口
export interface TodoItem {
  id: string;
  title: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
  link: string;
}

/**
 * 获取访问趋势数据
 * @param params 查询参数
 */
export const getVisitTrend = (params?: {
  days?: number;
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<VisitTrendData[]>> => {
  return get('/api/admin/dashboard/visit-trend', {
    params: params || { days: 30 }
  });
};

/**
 * 获取观看分类占比数据
 */
export const getCategoryStats = (): Promise<ApiResponse<CategoryData[]>> => {
  return get('/api/admin/dashboard/category-stats');
};

/**
 * 获取统计概览数据
 */
export const getStatsOverview = (): Promise<ApiResponse<StatsOverview>> => {
  return get('/api/admin/dashboard/stats-overview');
};

/**
 * 获取最近活动数据
 * @param limit 限制数量，默认10条
 */
export const getRecentActivities = (limit: number = 10): Promise<ApiResponse<RecentActivity[]>> => {
  return get('/api/admin/dashboard/recent-activities', {
    params: { limit }
  });
};

/**
 * 获取待办事项数据
 */
export const getTodoList = (): Promise<ApiResponse<TodoItem[]>> => {
  return get('/api/admin/dashboard/todo-list');
};

/**
 * 获取实时在线用户数
 */
export const getOnlineUsers = (): Promise<ApiResponse<{ count: number; list: any[] }>> => {
  return get('/api/admin/dashboard/online-users');
};

/**
 * 获取系统性能数据
 */
export const getSystemPerformance = (): Promise<ApiResponse<{
  cpu: number;
  memory: number;
  disk: number;
  network: { upload: number; download: number };
}>> => {
  return get('/api/admin/dashboard/system-performance');
};