/**
 * 首页相关API
 */

import { get } from '../../utils/request';

// 统计数据
export interface SiteStats {
  userCount: number;
  documentCount: number;
  videoCount: number;
  totalViews: number;
  runningDays: number;
}

// 分类信息
export interface Category {
  id: string;
  name: string;
  icon?: string;
  count: number;
  description?: string;
}

// 推荐内容
export interface RecommendContent {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video';
  thumbnail?: string;
  views: number;
  likes: number;
  author: string;
  publishTime: string;
  tags: string[];
}

// 最新更新
export interface LatestUpdate {
  id: string;
  title: string;
  type: 'document' | 'video';
  author: string;
  updateTime: string;
  isNew: boolean;
}

// 热门标签
export interface HotTag {
  name: string;
  count: number;
  color?: string;
}

/**
 * 获取网站统计数据
 */
export const getSiteStats = (): Promise<SiteStats> => {
  return get('/home/stats');
};

/**
 * 获取分类列表
 */
export const getCategories = (): Promise<Category[]> => {
  return get('/home/categories');
};

/**
 * 获取推荐内容
 */
export const getRecommendContent = (params?: {
  type?: 'document' | 'video';
  limit?: number;
}): Promise<RecommendContent[]> => {
  return get('/home/recommend', { params });
};

/**
 * 获取最新更新
 */
export const getLatestUpdates = (params?: {
  type?: 'document' | 'video';
  limit?: number;
}): Promise<LatestUpdate[]> => {
  return get('/home/latest', { params });
};

/**
 * 获取热门标签
 */
export const getHotTags = (limit = 20): Promise<HotTag[]> => {
  return get('/home/hot-tags', { params: { limit } });
};

/**
 * 获取轮播图
 */
export const getBanners = (): Promise<{
  id: string;
  title: string;
  image: string;
  link?: string;
  description?: string;
}[]> => {
  return get('/home/banners');
};

/**
 * 搜索建议
 */
export const getSearchSuggestions = (keyword: string): Promise<string[]> => {
  return get('/home/search-suggestions', { params: { keyword } });
};