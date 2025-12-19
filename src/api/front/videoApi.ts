/**
 * 视频相关API
 */

import { get, post } from '../../utils/request';

// 视频信息
export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  author: string;
  authorAvatar?: string;
  publishTime: string;
  views: number;
  likes: number;
  stars: number;
  category: string;
  tags: string[];
  needPoints: number;
  rating: number;
  isLiked: boolean;
  isStarred: boolean;
}

// 视频列表查询参数
export interface VideoListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  sortBy?: 'latest' | 'popular' | 'rating';
  tags?: string[];
}

// 视频列表响应
export interface VideoListResponse {
  list: VideoInfo[];
  total: number;
  page: number;
  pageSize: number;
}

// 评论信息
export interface Comment {
  id: string;
  user: string;
  avatar?: string;
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

/**
 * 获取视频列表
 */
export const getVideoList = (params: VideoListParams): Promise<VideoListResponse> => {
  return get('/video/list', { params });
};

/**
 * 获取视频详情
 */
export const getVideoDetail = (id: string): Promise<VideoInfo> => {
  return get(`/video/${id}`);
};

/**
 * 点赞视频
 */
export const likeVideo = (id: string): Promise<{ liked: boolean; count: number }> => {
  return post(`/video/${id}/like`);
};

/**
 * 收藏视频
 */
export const starVideo = (id: string): Promise<{ starred: boolean; count: number }> => {
  return post(`/video/${id}/star`);
};

/**
 * 分享视频
 */
export const shareVideo = (id: string): Promise<{ shareUrl: string }> => {
  return post(`/video/${id}/share`);
};

/**
 * 扣除积分观看视频
 */
export const deductPointsForVideo = (id: string, points: number): Promise<{ success: boolean; remainingPoints: number }> => {
  return post(`/video/${id}/deduct-points`, { points });
};

/**
 * 获取视频评论
 */
export const getVideoComments = (id: string, params?: {
  page?: number;
  pageSize?: number;
  sortBy?: 'latest' | 'popular';
}): Promise<{
  list: Comment[];
  total: number;
}> => {
  return get(`/video/${id}/comments`, { params });
};

/**
 * 发表视频评论
 */
export const addVideoComment = (id: string, content: string): Promise<Comment> => {
  return post(`/video/${id}/comments`, { content });
};

/**
 * 点赞评论
 */
export const likeComment = (commentId: string): Promise<{ liked: boolean; count: number }> => {
  return post(`/comment/${commentId}/like`);
};

/**
 * 回复评论
 */
export const replyComment = (commentId: string, content: string): Promise<Comment> => {
  return post(`/comment/${commentId}/reply`, { content });
};

/**
 * 获取相关视频推荐
 */
export const getRelatedVideos = (id: string, limit = 10): Promise<VideoInfo[]> => {
  return get(`/video/${id}/related`, { params: { limit } });
};

/**
 * 记录视频播放
 */
export const recordVideoPlay = (id: string): Promise<void> => {
  return post(`/video/${id}/play`);
};

/**
 * 获取视频分类
 */
export const getVideoCategories = (): Promise<{
  id: string;
  name: string;
  count: number;
}[]> => {
  return get('/video/categories');
};

/**
 * 获取热门标签
 */
export const getVideoTags = (limit = 20): Promise<{
  name: string;
  count: number;
}[]> => {
  return get('/video/tags', { params: { limit } });
};

/**
 * 搜索视频
 */
export const searchVideos = (params: {
  keyword: string;
  page?: number;
  pageSize?: number;
  category?: string;
  sortBy?: 'relevance' | 'latest' | 'popular';
}): Promise<VideoListResponse> => {
  return get('/video/search', { params });
};