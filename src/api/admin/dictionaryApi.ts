/**
 * 字典管理相关API
 */

import { get, post, put, del } from '../../utils/request';

// ==================== 类型定义 ====================

/** 字典分类 */
export interface DictCategory {
  id: number;
  name: string;
  code: string;
  description?: string;
  sort: number;
  status: 'enabled' | 'disabled';
  itemCount: number;
  createTime: string;
  updateTime?: string;
}

/** 字典项 */
export interface DictItem {
  id: number;
  categoryId: number;
  categoryName: string;
  label: string;
  value: string;
  sort: number;
  status: 'enabled' | 'disabled';
  description?: string;
  createTime: string;
  updateTime?: string;
}

/** 字典使用统计 */
export interface DictUsageStats {
  categoryId: number;
  categoryName: string;
  totalItems: number;
  usageCount: number;
  lastUsedTime?: string;
  popularItems: {
    id: number;
    label: string;
    value: string;
    usageCount: number;
  }[];
}

/** 分页响应 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== 字典分类API ====================

/**
 * 获取字典分类列表
 */
export const getDictCategories = async (params?: {
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<DictCategory>> => {
  return get('/admin/dict/categories', { params });
};

/**
 * 获取字典分类详情
 */
export const getDictCategoryDetail = async (id: number): Promise<DictCategory> => {
  return get(`/admin/dict/categories/${id}`);
};

/**
 * 创建字典分类
 */
export const createDictCategory = async (data: {
  name: string;
  code: string;
  description?: string;
  sort?: number;
}): Promise<{ id: number; message: string }> => {
  return post('/admin/dict/categories', data);
};

/**
 * 更新字典分类
 */
export const updateDictCategory = async (id: number, data: Partial<DictCategory>): Promise<{ message: string }> => {
  return put(`/admin/dict/categories/${id}`, data);
};

/**
 * 删除字典分类
 */
export const deleteDictCategory = async (id: number): Promise<{ message: string }> => {
  return del(`/admin/dict/categories/${id}`);
};

/**
 * 更新字典分类状态
 */
export const updateDictCategoryStatus = async (id: number, status: 'enabled' | 'disabled'): Promise<{ message: string }> => {
  return put(`/admin/dict/categories/${id}/status`, { status });
};

// ==================== 字典项API ====================

/**
 * 获取字典项列表
 */
export const getDictItems = async (params?: {
  categoryId?: number;
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<DictItem>> => {
  return get('/admin/dict/items', { params });
};

/**
 * 获取字典项详情
 */
export const getDictItemDetail = async (id: number): Promise<DictItem> => {
  return get(`/admin/dict/items/${id}`);
};

/**
 * 创建字典项
 */
export const createDictItem = async (data: {
  categoryId: number;
  label: string;
  value: string;
  sort?: number;
  description?: string;
}): Promise<{ id: number; message: string }> => {
  return post('/admin/dict/items', data);
};

/**
 * 更新字典项
 */
export const updateDictItem = async (id: number, data: Partial<DictItem>): Promise<{ message: string }> => {
  return put(`/admin/dict/items/${id}`, data);
};

/**
 * 删除字典项
 */
export const deleteDictItem = async (id: number): Promise<{ message: string }> => {
  return del(`/admin/dict/items/${id}`);
};

/**
 * 批量删除字典项
 */
export const batchDeleteDictItems = async (ids: number[]): Promise<{ success: number; failed: number }> => {
  return post('/admin/dict/items/batch-delete', { ids });
};

/**
 * 更新字典项状态
 */
export const updateDictItemStatus = async (id: number, status: 'enabled' | 'disabled'): Promise<{ message: string }> => {
  return put(`/admin/dict/items/${id}/status`, { status });
};

/**
 * 批量更新字典项状态
 */
export const batchUpdateDictItemStatus = async (ids: number[], status: 'enabled' | 'disabled'): Promise<{ success: number; failed: number }> => {
  return post('/admin/dict/items/batch-status', { ids, status });
};

// ==================== 字典使用统计API ====================

/**
 * 获取字典使用统计
 */
export const getDictUsageStats = async (params?: {
  categoryId?: number;
  startDate?: string;
  endDate?: string;
}): Promise<DictUsageStats[]> => {
  return get('/admin/dict/usage-stats', { params });
};

/**
 * 获取字典项使用详情
 */
export const getDictItemUsageDetail = async (itemId: number): Promise<{
  item: DictItem;
  usageHistory: {
    date: string;
    count: number;
  }[];
  usageLocations: {
    module: string;
    count: number;
  }[];
}> => {
  return get(`/admin/dict/items/${itemId}/usage-detail`);
};

/**
 * 导出字典数据
 */
export const exportDictData = async (params: {
  categoryIds?: number[];
  format?: 'xlsx' | 'csv' | 'json';
}): Promise<{ downloadUrl: string }> => {
  return post('/admin/dict/export', params);
};

/**
 * 导入字典数据
 */
export const importDictData = async (file: File): Promise<{
  success: number;
  failed: number;
  errors?: string[];
}> => {
  const formData = new FormData();
  formData.append('file', file);
  return post('/admin/dict/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * 获取字典选项（用于下拉选择）
 */
export const getDictOptions = async (categoryCode: string): Promise<{
  label: string;
  value: string;
}[]> => {
  return get(`/admin/dict/options/${categoryCode}`);
};