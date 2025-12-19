/**
 * 后台统计分析相关API
 */

import { get, post, put, del } from '../../utils/request';
import type { ApiResponse } from '../../types/common';

// 用户统计数据接口
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowthTrend: Array<{
    date: string;
    total: number;
    new: number;
    active: number;
  }>;
  userDistribution: Array<{
    region: string;
    count: number;
  }>;
}

// 内容统计数据接口
export interface ContentStats {
  totalDocuments: number;
  totalVideos: number;
  publishedToday: number;
  contentTrend: Array<{
    date: string;
    documents: number;
    videos: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    documents: number;
    videos: number;
  }>;
}

// 访问统计数据接口
export interface VisitStats {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  visitTrend: Array<{
    date: string;
    visits: number;
    visitors: number;
    pageViews: number;
  }>;
  topPages: Array<{
    path: string;
    title: string;
    visits: number;
  }>;
}

// 热门内容数据接口
export interface PopularContent {
  documents: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    category: string;
  }>;
  videos: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    duration: number;
    category: string;
  }>;
}

/**
 * 获取用户统计数据
 * @param timeRange 时间范围：7d, 30d, 90d, 1y
 */
export const getUserStats = (timeRange: string = '30d'): Promise<ApiResponse<UserStats>> => {
  return get('/api/admin/statistics/users', {
    params: { timeRange }
  });
};

/**
 * 获取内容统计数据
 * @param timeRange 时间范围
 */
export const getContentStats = (timeRange: string = '30d'): Promise<ApiResponse<ContentStats>> => {
  return get('/api/admin/statistics/content', {
    params: { timeRange }
  });
};

/**
 * 获取访问统计数据
 * @param timeRange 时间范围
 */
export const getVisitStats = (timeRange: string = '30d'): Promise<ApiResponse<VisitStats>> => {
  return get('/api/admin/statistics/visits', {
    params: { timeRange }
  });
};

/**
 * 获取热门内容数据
 * @param limit 限制数量
 */
export const getPopularContent = (limit: number = 10): Promise<ApiResponse<PopularContent>> => {
  return get('/api/admin/statistics/popular-content', {
    params: { limit }
  });
};

/**
 * 获取搜索关键词统计
 * @param limit 限制数量
 */
export const getSearchKeywords = (limit: number = 20): Promise<ApiResponse<Array<{
  keyword: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}>>> => {
  return get('/api/admin/statistics/search-keywords', {
    params: { limit }
  });
};

/**
 * 获取设备统计数据
 */
export const getDeviceStats = (): Promise<ApiResponse<{
  devices: Array<{ type: string; count: number; percentage: number }>;
  browsers: Array<{ name: string; count: number; percentage: number }>;
  os: Array<{ name: string; count: number; percentage: number }>;
}>> => {
  return get('/api/admin/statistics/devices');
};