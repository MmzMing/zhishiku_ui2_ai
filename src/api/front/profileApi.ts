/**
 * 个人中心相关API
 */

import { get, post, put, del } from '../../utils/request';

// ==================== 类型定义 ====================

/** 用户个人信息 */
export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  location?: string;
  bio?: string;
  website?: string;
  points: number;
  level: number;
  levelName: string;
  nextLevelPoints: number;
  registerTime: string;
  lastLoginTime?: string;
  isVip: boolean;
  vipExpireTime?: string;
}

/** 用户内容 */
export interface UserContent {
  id: string;
  title: string;
  type: 'document' | 'video' | 'blog';
  thumbnail?: string;
  status: 'published' | 'draft' | 'pending' | 'rejected';
  views: number;
  likes: number;
  comments: number;
  publishTime: string;
  updateTime?: string;
}

/** 用户收藏 */
export interface UserFavorite {
  id: string;
  contentId: string;
  title: string;
  type: 'document' | 'video' | 'blog';
  thumbnail?: string;
  author: string;
  collectTime: string;
  tags: string[];
}

/** 浏览历史 */
export interface BrowseHistory {
  id: string;
  contentId: string;
  title: string;
  type: 'document' | 'video' | 'blog';
  thumbnail?: string;
  author: string;
  browseTime: string;
  progress?: number;
}

/** 积分记录 */
export interface UserPointRecord {
  id: string;
  action: string;
  points: number;
  type: 'earn' | 'spend';
  description: string;
  createTime: string;
  relatedContent?: string;
}

/** 消息通知 */
export interface UserNotification {
  id: string;
  type: 'system' | 'comment' | 'like' | 'follow' | 'point';
  title: string;
  content: string;
  isRead: boolean;
  createTime: string;
  relatedId?: string;
  relatedType?: string;
}

/** 分页响应 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== 个人信息API ====================

/**
 * 获取用户个人信息
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  return get('/profile/info');
};

/**
 * 更新用户个人信息
 */
export const updateUserProfile = async (data: Partial<UserProfile>): Promise<{ message: string }> => {
  return put('/profile/info', data);
};

/**
 * 上传头像
 */
export const uploadAvatar = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('avatar', file);
  return post('/profile/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * 修改密码
 */
export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  return post('/profile/change-password', data);
};

/**
 * 绑定手机号
 */
export const bindPhone = async (data: {
  phone: string;
  code: string;
}): Promise<{ message: string }> => {
  return post('/profile/bind-phone', data);
};

/**
 * 绑定邮箱
 */
export const bindEmail = async (data: {
  email: string;
  code: string;
}): Promise<{ message: string }> => {
  return post('/profile/bind-email', data);
};

// ==================== 用户内容API ====================

/**
 * 获取用户发布的内容
 */
export const getUserContents = async (params?: {
  type?: 'document' | 'video' | 'blog';
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<UserContent>> => {
  return get('/profile/contents', { params });
};

/**
 * 删除用户内容
 */
export const deleteUserContent = async (id: string): Promise<{ message: string }> => {
  return del(`/profile/contents/${id}`);
};

/**
 * 更新内容状态
 */
export const updateContentStatus = async (id: string, status: 'published' | 'draft'): Promise<{ message: string }> => {
  return put(`/profile/contents/${id}/status`, { status });
};

// ==================== 收藏管理API ====================

/**
 * 获取用户收藏列表
 */
export const getUserFavorites = async (params?: {
  type?: 'document' | 'video' | 'blog';
  keyword?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<UserFavorite>> => {
  return get('/profile/favorites', { params });
};

/**
 * 取消收藏
 */
export const removeFavorite = async (id: string): Promise<{ message: string }> => {
  return del(`/profile/favorites/${id}`);
};

/**
 * 批量取消收藏
 */
export const batchRemoveFavorites = async (ids: string[]): Promise<{ 
  success: number; 
  failed: number; 
}> => {
  return post('/profile/favorites/batch-remove', { ids });
};

/**
 * 创建收藏夹
 */
export const createFavoriteFolder = async (data: {
  name: string;
  description?: string;
  isPublic?: boolean;
}): Promise<{ id: string; message: string }> => {
  return post('/profile/favorite-folders', data);
};

/**
 * 获取收藏夹列表
 */
export const getFavoriteFolders = async (): Promise<{
  id: string;
  name: string;
  description?: string;
  count: number;
  isPublic: boolean;
  createTime: string;
}[]> => {
  return get('/profile/favorite-folders');
};

// ==================== 浏览历史API ====================

/**
 * 获取浏览历史
 */
export const getBrowseHistory = async (params?: {
  type?: 'document' | 'video' | 'blog';
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<BrowseHistory>> => {
  return get('/profile/browse-history', { params });
};

/**
 * 清空浏览历史
 */
export const clearBrowseHistory = async (type?: 'document' | 'video' | 'blog'): Promise<{ message: string }> => {
  return post('/profile/browse-history/clear', { type });
};

/**
 * 删除单条浏览记录
 */
export const removeBrowseRecord = async (id: string): Promise<{ message: string }> => {
  return del(`/profile/browse-history/${id}`);
};

// ==================== 积分记录API ====================

/**
 * 获取用户积分记录
 */
export const getUserPointRecords = async (params?: {
  type?: 'earn' | 'spend';
  action?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<UserPointRecord>> => {
  return get('/profile/point-records', { params });
};

/**
 * 获取积分统计
 */
export const getPointStatistics = async (): Promise<{
  totalPoints: number;
  todayEarned: number;
  monthEarned: number;
  totalEarned: number;
  totalSpent: number;
  ranking: number;
  nextLevelPoints: number;
}> => {
  return get('/profile/point-statistics');
};

// ==================== 消息通知API ====================

/**
 * 获取用户通知列表
 */
export const getUserNotifications = async (params?: {
  type?: string;
  isRead?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<UserNotification>> => {
  return get('/profile/notifications', { params });
};

/**
 * 标记通知为已读
 */
export const markNotificationRead = async (id: string): Promise<{ message: string }> => {
  return put(`/profile/notifications/${id}/read`);
};

/**
 * 批量标记通知为已读
 */
export const batchMarkNotificationsRead = async (ids: string[]): Promise<{ message: string }> => {
  return post('/profile/notifications/batch-read', { ids });
};

/**
 * 全部标记为已读
 */
export const markAllNotificationsRead = async (): Promise<{ message: string }> => {
  return post('/profile/notifications/read-all');
};

/**
 * 删除通知
 */
export const deleteNotification = async (id: string): Promise<{ message: string }> => {
  return del(`/profile/notifications/${id}`);
};

/**
 * 获取未读通知数量
 */
export const getUnreadNotificationCount = async (): Promise<{ count: number }> => {
  return get('/profile/notifications/unread-count');
};

// ==================== 账户安全API ====================

/**
 * 获取登录日志
 */
export const getLoginLogs = async (params?: {
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<{
  id: string;
  ip: string;
  location: string;
  device: string;
  browser: string;
  loginTime: string;
  status: 'success' | 'failed';
}>> => {
  return get('/profile/login-logs', { params });
};

/**
 * 获取安全设置
 */
export const getSecuritySettings = async (): Promise<{
  twoFactorEnabled: boolean;
  loginNotification: boolean;
  securityQuestions: boolean;
  trustedDevices: number;
}> => {
  return get('/profile/security-settings');
};

/**
 * 更新安全设置
 */
export const updateSecuritySettings = async (data: {
  twoFactorEnabled?: boolean;
  loginNotification?: boolean;
}): Promise<{ message: string }> => {
  return put('/profile/security-settings', data);
};

/**
 * 注销账户
 */
export const deactivateAccount = async (data: {
  password: string;
  reason: string;
}): Promise<{ message: string }> => {
  return post('/profile/deactivate', data);
};