/**
 * 文档相关API
 */

import { get, post } from '../../utils/request';

// 文档信息
export interface DocumentInfo {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail?: string;
  author: string;
  authorAvatar?: string;
  publishTime: string;
  updateTime: string;
  views: number;
  likes: number;
  stars: number;
  downloads: number;
  category: string;
  tags: string[];
  isFree: boolean;
  points?: number;
  rating: number;
  isLiked: boolean;
  isStarred: boolean;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
}

// 文档列表查询参数
export interface DocumentListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  sortBy?: 'latest' | 'popular' | 'rating' | 'downloads';
  tags?: string[];
  isFree?: boolean;
}

// 文档列表响应
export interface DocumentListResponse {
  list: DocumentInfo[];
  total: number;
  page: number;
  pageSize: number;
}

// 评论信息
export interface DocumentComment {
  id: string;
  user: string;
  avatar?: string;
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
  replies?: DocumentComment[];
}

/**
 * 获取文档列表
 */
export const getDocumentList = (params: DocumentListParams): Promise<DocumentListResponse> => {
  return get('/document/list', { params });
};

/**
 * 获取文档详情
 */
export const getDocumentDetail = (id: string): Promise<DocumentInfo> => {
  return get(`/document/${id}`);
};

/**
 * 点赞文档
 */
export const likeDocument = (id: string): Promise<{ liked: boolean; count: number }> => {
  return post(`/document/${id}/like`);
};

/**
 * 收藏文档
 */
export const starDocument = (id: string): Promise<{ starred: boolean; count: number }> => {
  return post(`/document/${id}/star`);
};

/**
 * 分享文档
 */
export const shareDocument = (id: string): Promise<{ shareUrl: string }> => {
  return post(`/document/${id}/share`);
};

/**
 * 下载文档
 */
export const downloadDocument = (id: string): Promise<{ downloadUrl: string; filename: string }> => {
  return post(`/document/${id}/download`);
};

/**
 * 扣除积分下载文档
 */
export const deductPointsForDocument = (id: string, points: number): Promise<{ 
  success: boolean; 
  remainingPoints: number;
  downloadUrl: string;
  filename: string;
}> => {
  return post(`/document/${id}/deduct-points`, { points });
};

/**
 * 获取文档评论
 */
export const getDocumentComments = (id: string, params?: {
  page?: number;
  pageSize?: number;
  sortBy?: 'latest' | 'popular';
}): Promise<{
  list: DocumentComment[];
  total: number;
}> => {
  return get(`/document/${id}/comments`, { params });
};

/**
 * 发表文档评论
 */
export const addDocumentComment = (id: string, content: string): Promise<DocumentComment> => {
  return post(`/document/${id}/comments`, { content });
};

/**
 * 点赞评论
 */
export const likeDocumentComment = (commentId: string): Promise<{ liked: boolean; count: number }> => {
  return post(`/document-comment/${commentId}/like`);
};

/**
 * 回复评论
 */
export const replyDocumentComment = (commentId: string, content: string): Promise<DocumentComment> => {
  return post(`/document-comment/${commentId}/reply`, { content });
};

/**
 * 获取相关文档推荐
 */
export const getRelatedDocuments = (id: string, limit = 10): Promise<DocumentInfo[]> => {
  return get(`/document/${id}/related`, { params: { limit } });
};

/**
 * 记录文档阅读
 */
export const recordDocumentRead = (id: string): Promise<void> => {
  return post(`/document/${id}/read`);
};

/**
 * 获取文档分类
 */
export const getDocumentCategories = (): Promise<{
  id: string;
  name: string;
  count: number;
}[]> => {
  return get('/document/categories');
};

/**
 * 获取热门标签
 */
export const getDocumentTags = (limit = 20): Promise<{
  name: string;
  count: number;
}[]> => {
  return get('/document/tags', { params: { limit } });
};

/**
 * 搜索文档
 */
export const searchDocuments = (params: {
  keyword: string;
  page?: number;
  pageSize?: number;
  category?: string;
  sortBy?: 'relevance' | 'latest' | 'popular' | 'rating';
  isFree?: boolean;
}): Promise<DocumentListResponse> => {
  return get('/document/search', { params });
};

/**
 * 批量收藏文档
 */
export const batchStarDocuments = (ids: string[]): Promise<{ 
  success: number; 
  failed: number; 
  results: { id: string; success: boolean; message?: string }[] 
}> => {
  return post('/document/batch-star', { ids });
};

/**
 * 获取文档目录
 */
export const getDocumentToc = (id: string): Promise<{
  id: string;
  title: string;
  level: number;
  anchor: string;
}[]> => {
  return get(`/document/${id}/toc`);
};

/**
 * 评分文档
 */
export const rateDocument = (id: string, rating: number): Promise<{ 
  success: boolean; 
  averageRating: number;
  totalRatings: number;
}> => {
  return post(`/document/${id}/rate`, { rating });
};