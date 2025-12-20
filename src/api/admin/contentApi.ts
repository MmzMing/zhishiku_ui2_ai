/**
 * 内容管理相关API
 */

import { get, post, put, del } from '../../utils/request';

// ==================== 类型定义 ====================

/** 博客文章 */
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  categoryId: number;
  categoryName: string;
  tags: string[];
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isTop: boolean;
  isRecommend: boolean;
  allowComment: boolean;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  publishTime?: string;
  createTime: string;
  updateTime?: string;
  wordCount?: number;
  readTime?: number;
}

/** 评论信息 */
export interface CommentInfo {
  id: number;
  contentId: number;
  contentTitle: string;
  contentType: 'blog' | 'video' | 'document';
  userId: number;
  username: string;
  userAvatar?: string;
  content: string;
  parentId?: number;
  replyTo?: string;
  ip?: string;
  location?: string;
  status: 'pending' | 'approved' | 'rejected' | 'deleted';
  likeCount: number;
  replyCount: number;
  createTime: string;
  auditTime?: string;
  auditor?: string;
  rejectReason?: string;
}

/** 评论审核统计 */
export interface CommentAuditStats {
  pendingCount: number;
  todayApproved: number;
  todayRejected: number;
  totalComments: number;
}

/** 分页响应 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== 博客管理API ====================

/**
 * 获取博客列表
 */
export const getBlogList = async (params?: {
  keyword?: string;
  categoryId?: number;
  status?: string;
  authorId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<BlogPost>> => {
  return get('/admin/content/blog/list', { params });
};

/**
 * 获取博客详情
 */
export const getBlogDetail = async (id: number): Promise<BlogPost> => {
  return get(`/admin/content/blog/${id}`);
};

/**
 * 创建博客
 */
export const createBlog = async (data: {
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  categoryId: number;
  tags?: string[];
  status?: 'draft' | 'published';
  isTop?: boolean;
  isRecommend?: boolean;
  allowComment?: boolean;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}): Promise<{ id: number; message: string }> => {
  return post('/admin/content/blog/create', data);
};

/**
 * 更新博客
 */
export const updateBlog = async (id: number, data: Partial<BlogPost>): Promise<{ message: string }> => {
  return put(`/admin/content/blog/${id}`, data);
};

/**
 * 删除博客
 */
export const deleteBlog = async (id: number): Promise<{ message: string }> => {
  return del(`/admin/content/blog/${id}`);
};

/**
 * 批量删除博客
 */
export const batchDeleteBlogs = async (ids: number[]): Promise<{ success: number; failed: number }> => {
  return post('/admin/content/blog/batch-delete', { ids });
};

/**
 * 更新博客状态
 */
export const updateBlogStatus = async (id: number, status: 'draft' | 'published'): Promise<{ message: string }> => {
  return post(`/admin/content/blog/${id}/status`, { status });
};

/**
 * 设置博客置顶
 */
export const setBlogTop = async (id: number, isTop: boolean): Promise<{ message: string }> => {
  return post(`/admin/content/blog/${id}/top`, { isTop });
};

/**
 * 设置博客推荐
 */
export const setBlogRecommend = async (id: number, isRecommend: boolean): Promise<{ message: string }> => {
  return post(`/admin/content/blog/${id}/recommend`, { isRecommend });
};

/**
 * 获取博客版本历史
 */
export const getBlogVersions = async (id: number): Promise<{
  id: number;
  version: number;
  title: string;
  updateTime: string;
  operator: string;
}[]> => {
  return get(`/admin/content/blog/${id}/versions`);
};

/**
 * 恢复博客版本
 */
export const restoreBlogVersion = async (id: number, version: number): Promise<{ message: string }> => {
  return post(`/admin/content/blog/${id}/restore`, { version });
};

/**
 * 上传博客图片
 */
export const uploadBlogImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  return post('/admin/content/blog/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ==================== 评论审核API ====================

/**
 * 获取评论审核统计
 */
export const getCommentAuditStats = async (): Promise<CommentAuditStats> => {
  return get('/admin/content/comment/stats');
};

/**
 * 获取评论列表
 */
export const getCommentList = async (params?: {
  contentType?: string;
  status?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<CommentInfo>> => {
  return get('/admin/content/comment/list', { params });
};

/**
 * 审核通过评论
 */
export const approveComment = async (id: number): Promise<{ message: string }> => {
  return post(`/admin/content/comment/${id}/approve`);
};

/**
 * 审核拒绝评论
 */
export const rejectComment = async (id: number, reason?: string): Promise<{ message: string }> => {
  return post(`/admin/content/comment/${id}/reject`, { reason });
};

/**
 * 批量审核评论
 */
export const batchAuditComments = async (
  ids: number[], 
  action: 'approve' | 'reject',
  reason?: string
): Promise<{ success: number; failed: number }> => {
  return post('/admin/content/comment/batch-audit', { ids, action, reason });
};

/**
 * 删除评论
 */
export const deleteComment = async (id: number): Promise<{ message: string }> => {
  return del(`/admin/content/comment/${id}`);
};

/**
 * 批量删除评论
 */
export const batchDeleteComments = async (ids: number[]): Promise<{ success: number; failed: number }> => {
  return post('/admin/content/comment/batch-delete', { ids });
};

/**
 * 获取评论详情（含回复）
 */
export const getCommentDetail = async (id: number): Promise<CommentInfo & {
  replies: CommentInfo[];
}> => {
  return get(`/admin/content/comment/${id}`);
};

// ==================== 分类管理API ====================

/**
 * 获取博客分类列表
 */
export const getBlogCategories = async (): Promise<{
  id: number;
  name: string;
  parentId?: number;
  sort: number;
  postCount: number;
}[]> => {
  return get('/admin/content/blog/categories');
};

/**
 * 获取博客标签列表
 */
export const getBlogTags = async (): Promise<{
  name: string;
  count: number;
}[]> => {
  return get('/admin/content/blog/tags');
};
