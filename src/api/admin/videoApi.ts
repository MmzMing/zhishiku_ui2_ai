/**
 * 视频管理相关API
 */

import { get, post, put, del } from '../../utils/request';

// ==================== 类型定义 ====================

/** 视频基本信息 */
export interface VideoInfo {
  id?: number;
  title: string;
  categoryId: number;
  description: string;
  tags: string[];
  coverUrl?: string;
}

/** 章节标记 */
export interface ChapterMark {
  id?: number;
  videoId?: number;
  title: string;
  startTime: number; // 秒
  endTime?: number;
  description?: string;
}

/** 字幕信息 */
export interface SubtitleInfo {
  id?: number;
  videoId?: number;
  language: string;
  languageCode: string;
  fileUrl: string;
  fileName: string;
  isDefault: boolean;
}

/** 水印设置 */
export interface WatermarkSettings {
  enabled: boolean;
  type: 'text' | 'image';
  content?: string; // 文字水印内容
  imageUrl?: string; // 图片水印URL
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  opacity: number; // 0-100
  size: number; // 字体大小或图片缩放比例
}

/** 权限设置 */
export interface PermissionSettings {
  visibility: 'public' | 'private' | 'password';
  password?: string;
  allowDownload: boolean;
  allowComment: boolean;
  requireVip: boolean;
  requirePoints: number; // 需要的积分，0表示免费
}

/** 视频上传完整数据 */
export interface VideoUploadData {
  basicInfo: VideoInfo;
  videoFileId?: string; // 上传后的视频文件ID
  coverFileId?: string; // 封面文件ID
  chapters: ChapterMark[];
  subtitles: SubtitleInfo[];
  watermark: WatermarkSettings;
  permission: PermissionSettings;
  isDraft: boolean;
}

/** 上传进度回调 */
export type UploadProgressCallback = (percent: number) => void;

// ==================== API 接口 ====================

/**
 * 上传视频文件
 */
export const uploadVideoFile = async (
  file: File, 
  onProgress?: UploadProgressCallback
): Promise<{ fileId: string; url: string; duration: number }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return post('/admin/video/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent: any) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
};

/**
 * 上传封面图片
 */
export const uploadCoverImage = async (file: File): Promise<{ fileId: string; url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  return post('/admin/video/cover/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * 上传字幕文件
 */
export const uploadSubtitleFile = async (
  file: File, 
  language: string, 
  languageCode: string
): Promise<SubtitleInfo> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);
  formData.append('languageCode', languageCode);
  return post('/admin/video/subtitle/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * 上传水印图片
 */
export const uploadWatermarkImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  return post('/admin/video/watermark/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * 保存视频（发布或草稿）
 */
export const saveVideo = async (data: VideoUploadData): Promise<{ id: number; message: string }> => {
  return post('/admin/video/save', data);
};

/**
 * 更新视频
 */
export const updateVideo = async (id: number, data: VideoUploadData): Promise<{ message: string }> => {
  return put(`/admin/video/${id}`, data);
};

/**
 * 获取视频详情（用于编辑）
 */
export const getVideoDetail = async (id: number): Promise<VideoUploadData> => {
  return get(`/admin/video/${id}`);
};

/**
 * 获取草稿列表
 */
export const getDraftList = async (): Promise<VideoUploadData[]> => {
  return get('/admin/video/drafts');
};

/**
 * 删除草稿
 */
export const deleteDraft = async (id: number): Promise<{ message: string }> => {
  return del(`/admin/video/draft/${id}`);
};

/**
 * 获取视频分类列表
 */
export const getVideoCategories = async (): Promise<{ id: number; name: string; parentId?: number }[]> => {
  return get('/admin/video/categories');
};

/**
 * 获取标签列表
 */
export const getVideoTags = async (): Promise<string[]> => {
  return get('/admin/video/tags');
};

/**
 * AI生成章节标记
 */
export const generateChaptersAI = async (videoFileId: string): Promise<ChapterMark[]> => {
  return post('/admin/video/chapters/generate', { videoFileId });
};

/**
 * AI生成字幕
 */
export const generateSubtitleAI = async (
  videoFileId: string, 
  language: string
): Promise<SubtitleInfo> => {
  return post('/admin/video/subtitle/generate', { videoFileId, language });
};

/**
 * 从视频截取封面
 */
export const extractCoverFromVideo = async (
  videoFileId: string, 
  timestamp: number
): Promise<{ url: string; fileId: string }> => {
  return post('/admin/video/cover/extract', { videoFileId, timestamp });
};


// ==================== 视频审核相关 ====================

/** 审核视频信息 */
export interface AuditVideo {
  id: number;
  title: string;
  cover: string;
  author: string;
  authorId: number;
  submitTime: string;
  duration: string;
  fileSize: number;
  aiResult: 'pass' | 'warning' | 'reject' | 'pending';
  aiScore?: number;
  aiDetail?: string;
  auditStatus: 'pending' | 'auditing' | 'completed';
  auditor?: string;
  auditorId?: number;
  auditTime?: string;
  finalResult?: 'pass' | 'reject';
  rejectReason?: string;
}

/** 审核日志 */
export interface AuditLog {
  id: number;
  videoId: number;
  videoTitle: string;
  action: 'submit' | 'ai_audit' | 'manual_pass' | 'manual_reject' | 'appeal' | 'resubmit';
  operator: string;
  operatorId?: number;
  time: string;
  detail: string;
  result?: string;
  ipAddress?: string;
}

/** 违规记录 */
export interface ViolationRecord {
  id: number;
  videoId: number;
  videoTitle: string;
  author: string;
  authorId: number;
  violationType: string;
  violationCode: string;
  description: string;
  evidence?: string;
  time: string;
  handler?: string;
  handlerId?: number;
  handleTime?: string;
  handleResult?: string;
  status: 'pending' | 'processed' | 'appealing';
  penalty?: string;
}

/** 审核统计 */
export interface AuditStatistics {
  pendingCount: number;
  auditingCount: number;
  todayPassCount: number;
  todayRejectCount: number;
  violationCount: number;
  aiPassRate: number;
}

/** 审核队列查询参数 */
export interface AuditQueueParams {
  status?: 'pending' | 'auditing' | 'completed';
  aiResult?: 'pass' | 'warning' | 'reject' | 'pending';
  startDate?: string;
  endDate?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

/** 分页响应 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== 审核API接口 ====================

/**
 * 获取审核统计数据
 */
export const getAuditStatistics = async (): Promise<AuditStatistics> => {
  return get('/admin/video/audit/statistics');
};

/**
 * 获取审核队列列表
 */
export const getAuditQueue = async (params: AuditQueueParams): Promise<PageResponse<AuditVideo>> => {
  return get('/admin/video/audit/queue', { params });
};

/**
 * 获取单个视频审核详情
 */
export const getAuditVideoDetail = async (videoId: number): Promise<AuditVideo> => {
  return get(`/admin/video/audit/${videoId}`);
};

/**
 * AI审核视频
 */
export const aiAuditVideo = async (videoId: number): Promise<{
  result: 'pass' | 'warning' | 'reject';
  score: number;
  detail: string;
  suggestions?: string[];
}> => {
  return post(`/admin/video/audit/ai/${videoId}`);
};

/**
 * AI批量审核
 */
export const aiAuditBatch = async (videoIds: number[]): Promise<{
  success: number;
  failed: number;
  results: { videoId: number; result: string; error?: string }[];
}> => {
  return post('/admin/video/audit/ai/batch', { videoIds });
};

/**
 * 人工审核通过
 */
export const manualPassVideo = async (videoId: number, comment?: string): Promise<{ message: string }> => {
  return post(`/admin/video/audit/pass/${videoId}`, { comment });
};

/**
 * 人工审核驳回
 */
export const manualRejectVideo = async (
  videoId: number, 
  reason: string, 
  violationType?: string
): Promise<{ message: string }> => {
  return post(`/admin/video/audit/reject/${videoId}`, { reason, violationType });
};

/**
 * 开始审核（锁定视频）
 */
export const startAudit = async (videoId: number): Promise<{ message: string }> => {
  return post(`/admin/video/audit/start/${videoId}`);
};

/**
 * 取消审核（解锁视频）
 */
export const cancelAudit = async (videoId: number): Promise<{ message: string }> => {
  return post(`/admin/video/audit/cancel/${videoId}`);
};

/**
 * 获取视频审核日志
 */
export const getVideoAuditLogs = async (videoId: number): Promise<AuditLog[]> => {
  return get(`/admin/video/audit/logs/${videoId}`);
};

/**
 * 获取所有审核日志（分页）
 */
export const getAllAuditLogs = async (params: {
  videoId?: number;
  action?: string;
  operator?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<AuditLog>> => {
  return get('/admin/video/audit/logs', { params });
};

/**
 * 获取违规记录列表
 */
export const getViolationRecords = async (params: {
  status?: 'pending' | 'processed' | 'appealing';
  violationType?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse<ViolationRecord>> => {
  return get('/admin/video/audit/violations', { params });
};

/**
 * 获取违规记录详情
 */
export const getViolationDetail = async (id: number): Promise<ViolationRecord> => {
  return get(`/admin/video/audit/violation/${id}`);
};

/**
 * 处理违规记录
 */
export const handleViolation = async (
  id: number, 
  data: {
    handleResult: string;
    penalty?: string;
    notifyAuthor?: boolean;
  }
): Promise<{ message: string }> => {
  return post(`/admin/video/audit/violation/handle/${id}`, data);
};

/**
 * 添加违规记录
 */
export const addViolationRecord = async (data: {
  videoId: number;
  violationType: string;
  violationCode: string;
  description: string;
  evidence?: string;
  penalty?: string;
}): Promise<{ id: number; message: string }> => {
  return post('/admin/video/audit/violation/add', data);
};

/**
 * 获取违规类型列表
 */
export const getViolationTypes = async (): Promise<{
  code: string;
  name: string;
  description: string;
  defaultPenalty: string;
}[]> => {
  return get('/admin/video/audit/violation/types');
};

/**
 * 预览视频（获取预览地址）
 */
export const getVideoPreviewUrl = async (videoId: number): Promise<{ url: string; expireTime: number }> => {
  return get(`/admin/video/audit/preview/${videoId}`);
};

/**
 * 导出审核报告
 */
export const exportAuditReport = async (params: {
  startDate: string;
  endDate: string;
  format?: 'xlsx' | 'csv';
}): Promise<{ downloadUrl: string }> => {
  return post('/admin/video/audit/export', params);
};

// ==================== 视频列表管理相关 ====================

/** 视频列表项 */
export interface VideoListItem {
  id: number;
  title: string;
  cover: string;
  category: string;
  categoryId: number;
  duration: string;
  views: number;
  likes: number;
  status: 'online' | 'offline' | 'reviewing' | 'rejected';
  author: string;
  authorId: number;
  createTime: string;
  updateTime?: string;
  description?: string;
  tags: string[];
}

/** 视频列表查询参数 */
export interface VideoListParams {
  keyword?: string;
  category?: string;
  status?: string;
  authorId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'createTime' | 'views' | 'likes' | 'title';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 获取视频列表
 */
export const getVideoList = async (params: VideoListParams): Promise<PageResponse<VideoListItem>> => {
  return get('/admin/video/list', { params });
};

/**
 * 搜索视频
 */
export const searchVideos = async (params: VideoListParams): Promise<PageResponse<VideoListItem>> => {
  return get('/admin/video/search', { params });
};

/**
 * 删除视频
 */
export const deleteVideo = async (id: number): Promise<{ message: string }> => {
  return del(`/admin/video/${id}`);
};

/**
 * 批量删除视频
 */
export const batchDeleteVideos = async (ids: number[]): Promise<{
  success: number;
  failed: number;
  errors?: string[];
}> => {
  return post('/admin/video/batch-delete', { ids });
};

/**
 * 更新视频状态
 */
export const updateVideoStatus = async (id: number, status: 'online' | 'offline'): Promise<{ message: string }> => {
  return put(`/admin/video/${id}/status`, { status });
};

/**
 * 批量更新视频状态
 */
export const batchUpdateVideoStatus = async (ids: number[], status: 'online' | 'offline'): Promise<{
  success: number;
  failed: number;
}> => {
  return post('/admin/video/batch-status', { ids, status });
};

/**
 * 获取视频统计数据
 */
export const getVideoStatistics = async (): Promise<{
  totalVideos: number;
  onlineVideos: number;
  reviewingVideos: number;
  todayViews: number;
  todayUploads: number;
  categoryStats: { category: string; count: number }[];
  viewsTrend: { date: string; views: number }[];
}> => {
  return get('/admin/video/statistics');
};
