/**
 * 积分管理相关API
 */

import { get, post, put, del } from '../../utils/request';

// ==================== 类型定义 ====================

/** 积分规则 */
export interface PointRule {
  id: number;
  name: string;
  code: string;
  description: string;
  actionType: 'login' | 'register' | 'upload' | 'download' | 'comment' | 'like' | 'share' | 'invite' | 'task' | 'other';
  points: number;
  maxDaily?: number;
  maxTotal?: number;
  status: 'enabled' | 'disabled';
  validFrom?: string;
  validTo?: string;
  createTime: string;
  updateTime?: string;
}

/** 积分记录 */
export interface PointRecord {
  id: number;
  userId: number;
  username: string;
  userAvatar?: string;
  ruleId?: number;
  ruleName?: string;
  actionType: string;
  points: number;
  type: 'earn' | 'spend';
  description: string;
  relatedId?: string;
  relatedType?: string;
  createTime: string;
  ip?: string;
}

/** 积分商品 */
export interface PointProduct {
  id: number;
  name: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  soldCount: number;
  category: string;
  type: 'virtual' | 'physical';
  status: 'available' | 'soldout' | 'disabled';
  sort: number;
  createTime: string;
  updateTime?: string;
}

/** 积分兑换记录 */
export interface PointExchange {
  id: number;
  userId: number;
  username: string;
  productId: number;
  productName: string;
  productImage?: string;
  points: number;
  quantity: number;
  totalPoints: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  exchangeTime: string;
  completeTime?: string;
  remark?: string;
}

/** 积分排行榜 */
export interface PointRanking {
  rank: number;
  userId: number;
  username: string;
  avatar?: string;
  totalPoints: number;
  monthPoints: number;
  weekPoints: number;
  trend: 'up' | 'down' | 'same';
  trendValue?: number;
}

/** 积分统计 */
export interface PointStatistics {
  totalUsers: number;
  totalPoints: number;
  todayEarned: number;
  todaySpent: number;
  monthlyTrend: { date: string; earned: number; spent: number }[];
  actionDistribution: { action: string; count: number; points: number }[];
}

/** 分页响应 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== 积分规则API ====================

/**
 * 获取积分规则列表
 */
export const getPointRules = async (params?: {
  keyword?: string;
  actionType?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<PointRule>> => {
  return get('/admin/point/rules', { params });
};

/**
 * 获取积分规则详情
 */
export const getPointRuleDetail = async (id: number): Promise<PointRule> => {
  return get(`/admin/point/rules/${id}`);
};

/**
 * 创建积分规则
 */
export const createPointRule = async (data: {
  name: string;
  code: string;
  description: string;
  actionType: string;
  points: number;
  maxDaily?: number;
  maxTotal?: number;
  validFrom?: string;
  validTo?: string;
}): Promise<{ id: number; message: string }> => {
  return post('/admin/point/rules', data);
};

/**
 * 更新积分规则
 */
export const updatePointRule = async (id: number, data: Partial<PointRule>): Promise<{ message: string }> => {
  return put(`/admin/point/rules/${id}`, data);
};

/**
 * 删除积分规则
 */
export const deletePointRule = async (id: number): Promise<{ message: string }> => {
  return del(`/admin/point/rules/${id}`);
};

/**
 * 更新积分规则状态
 */
export const updatePointRuleStatus = async (id: number, status: 'enabled' | 'disabled'): Promise<{ message: string }> => {
  return put(`/admin/point/rules/${id}/status`, { status });
};

// ==================== 积分记录API ====================

/**
 * 获取积分记录列表
 */
export const getPointRecords = async (params?: {
  userId?: number;
  username?: string;
  actionType?: string;
  type?: 'earn' | 'spend';
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<PointRecord>> => {
  return get('/admin/point/records', { params });
};

/**
 * 手动调整用户积分
 */
export const adjustUserPoints = async (data: {
  userId: number;
  points: number;
  type: 'earn' | 'spend';
  description: string;
}): Promise<{ message: string }> => {
  return post('/admin/point/adjust', data);
};

/**
 * 批量调整用户积分
 */
export const batchAdjustPoints = async (data: {
  userIds: number[];
  points: number;
  type: 'earn' | 'spend';
  description: string;
}): Promise<{ success: number; failed: number }> => {
  return post('/admin/point/batch-adjust', data);
};

// ==================== 积分商城API ====================

/**
 * 获取积分商品列表
 */
export const getPointProducts = async (params?: {
  keyword?: string;
  category?: string;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<PointProduct>> => {
  return get('/admin/point/products', { params });
};

/**
 * 获取积分商品详情
 */
export const getPointProductDetail = async (id: number): Promise<PointProduct> => {
  return get(`/admin/point/products/${id}`);
};

/**
 * 创建积分商品
 */
export const createPointProduct = async (data: {
  name: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  type: 'virtual' | 'physical';
  sort?: number;
}): Promise<{ id: number; message: string }> => {
  return post('/admin/point/products', data);
};

/**
 * 更新积分商品
 */
export const updatePointProduct = async (id: number, data: Partial<PointProduct>): Promise<{ message: string }> => {
  return put(`/admin/point/products/${id}`, data);
};

/**
 * 删除积分商品
 */
export const deletePointProduct = async (id: number): Promise<{ message: string }> => {
  return del(`/admin/point/products/${id}`);
};

/**
 * 更新商品库存
 */
export const updateProductStock = async (id: number, stock: number): Promise<{ message: string }> => {
  return put(`/admin/point/products/${id}/stock`, { stock });
};

// ==================== 积分兑换API ====================

/**
 * 获取兑换记录列表
 */
export const getPointExchanges = async (params?: {
  userId?: number;
  username?: string;
  productId?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<PointExchange>> => {
  return get('/admin/point/exchanges', { params });
};

/**
 * 处理兑换订单
 */
export const processExchange = async (id: number, data: {
  status: 'processing' | 'completed' | 'cancelled';
  remark?: string;
}): Promise<{ message: string }> => {
  return put(`/admin/point/exchanges/${id}/process`, data);
};

/**
 * 批量处理兑换订单
 */
export const batchProcessExchanges = async (ids: number[], status: 'completed' | 'cancelled'): Promise<{ success: number; failed: number }> => {
  return post('/admin/point/exchanges/batch-process', { ids, status });
};

// ==================== 积分排行榜API ====================

/**
 * 获取积分排行榜
 */
export const getPointRanking = async (params: {
  type: 'total' | 'month' | 'week';
  limit?: number;
}): Promise<PointRanking[]> => {
  return get('/admin/point/ranking', { params });
};

/**
 * 刷新排行榜
 */
export const refreshPointRanking = async (): Promise<{ message: string }> => {
  return post('/admin/point/ranking/refresh');
};

// ==================== 积分统计API ====================

/**
 * 获取积分统计数据
 */
export const getPointStatistics = async (): Promise<PointStatistics> => {
  return get('/admin/point/statistics');
};

/**
 * 导出积分数据
 */
export const exportPointData = async (params: {
  type: 'records' | 'exchanges' | 'ranking';
  startDate?: string;
  endDate?: string;
  format?: 'xlsx' | 'csv';
}): Promise<{ downloadUrl: string }> => {
  return post('/admin/point/export', params);
};