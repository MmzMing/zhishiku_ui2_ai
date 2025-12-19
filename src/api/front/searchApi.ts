/**
 * 搜索相关API
 */

import { get, post } from '../../utils/request';

// 搜索结果项
export interface SearchResultItem {
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
  matchScore: number;
  highlightTitle?: string;
  highlightDescription?: string;
}

// 搜索参数
export interface SearchParams {
  keyword: string;
  type?: 'all' | 'document' | 'video';
  page?: number;
  pageSize?: number;
  sortBy?: 'relevance' | 'latest' | 'popular';
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

// 搜索响应
export interface SearchResponse {
  list: SearchResultItem[];
  total: number;
  page: number;
  pageSize: number;
  keyword: string;
  suggestions?: string[];
  facets?: {
    categories: { name: string; count: number }[];
    tags: { name: string; count: number }[];
    authors: { name: string; count: number }[];
  };
}

// 搜索建议
export interface SearchSuggestion {
  keyword: string;
  count: number;
  type: 'history' | 'hot' | 'related';
}

/**
 * 综合搜索
 */
export const search = (params: SearchParams): Promise<SearchResponse> => {
  return get('/search', { params });
};

/**
 * 获取搜索建议
 */
export const getSearchSuggestions = (keyword: string): Promise<SearchSuggestion[]> => {
  return get('/search/suggestions', { params: { keyword } });
};

/**
 * 获取热门搜索词
 */
export const getHotSearchKeywords = (limit = 10): Promise<{
  keyword: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}[]> => {
  return get('/search/hot-keywords', { params: { limit } });
};

/**
 * 获取搜索历史
 */
export const getSearchHistory = (limit = 10): Promise<{
  keyword: string;
  searchTime: string;
  resultCount: number;
}[]> => {
  return get('/search/history', { params: { limit } });
};

/**
 * 保存搜索历史
 */
export const saveSearchHistory = (keyword: string, resultCount: number): Promise<void> => {
  return post('/search/history', { keyword, resultCount });
};

/**
 * 清空搜索历史
 */
export const clearSearchHistory = (): Promise<void> => {
  return post('/search/history/clear');
};

/**
 * 删除单条搜索历史
 */
export const deleteSearchHistory = (keyword: string): Promise<void> => {
  return post('/search/history/delete', { keyword });
};

/**
 * 高级搜索
 */
export const advancedSearch = (params: {
  keywords: string[];
  mustInclude?: string[];
  mustExclude?: string[];
  exactPhrase?: string;
  type?: 'all' | 'document' | 'video';
  category?: string;
  author?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  minViews?: number;
  minRating?: number;
  sortBy?: 'relevance' | 'latest' | 'popular' | 'rating';
  page?: number;
  pageSize?: number;
}): Promise<SearchResponse> => {
  return post('/search/advanced', params);
};

/**
 * 搜索自动完成
 */
export const searchAutocomplete = (keyword: string): Promise<{
  completions: string[];
  suggestions: string[];
}> => {
  return get('/search/autocomplete', { params: { keyword } });
};

/**
 * 相似内容推荐
 */
export const getSimilarContent = (params: {
  id: string;
  type: 'document' | 'video';
  limit?: number;
}): Promise<SearchResultItem[]> => {
  return get('/search/similar', { params });
};

/**
 * 搜索统计
 */
export const getSearchStats = (): Promise<{
  totalSearches: number;
  todaySearches: number;
  topKeywords: { keyword: string; count: number }[];
  searchTrends: { date: string; count: number }[];
}> => {
  return get('/search/stats');
};

/**
 * 举报搜索结果
 */
export const reportSearchResult = (params: {
  resultId: string;
  resultType: 'document' | 'video';
  reason: string;
  description?: string;
}): Promise<void> => {
  return post('/search/report', params);
};