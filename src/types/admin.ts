/**
 * 后台管理相关类型定义
 */

import { UserInfo, Role, Department, Permission } from './auth';
import { VideoInfo, DocumentInfo, CategoryInfo, TagInfo, CommentInfo, PointRecord, PointRule } from './front';
import { Status, AuditStatus, LogLevel } from './common';

// 控制台统计数据
export interface DashboardStats {
  userCount: number;
  videoCount: number;
  documentCount: number;
  totalViews: number;
  todayViews: number;
  totalPoints: number;
  activeUsers: number;
  pendingAudits: number;
}

// 控制台图表数据
export interface DashboardCharts {
  viewTrend: Array<{ date: string; views: number; users: number }>;
  contentDistribution: Array<{ type: string; count: number }>;
  userGrowth: Array<{ date: string; count: number }>;
  topCategories: Array<{ name: string; count: number }>;
}

// 待办事项
export interface TodoItem {
  id: string;
  type: 'audit' | 'report' | 'system';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'completed';
  createTime: string;
  deadline?: string;
}

// 最近操作记录
export interface RecentOperation {
  id: string;
  userId: string;
  username: string;
  action: string;
  target: string;
  targetId: string;
  result: 'success' | 'failed';
  ip: string;
  userAgent: string;
  createTime: string;
}

// 系统监控数据
export interface SystemMonitor {
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    upload: number;
    download: number;
  };
  services: Array<{
    name: string;
    status: 'running' | 'stopped' | 'error';
    port: number;
    uptime: number;
  }>;
}

// 系统日志
export interface SystemLog {
  id: string;
  level: LogLevel;
  module: string;
  message: string;
  details?: string;
  userId?: string;
  username?: string;
  ip?: string;
  userAgent?: string;
  createTime: string;
}

// 审计日志
export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValue?: string;
  newValue?: string;
  ip: string;
  userAgent: string;
  result: 'success' | 'failed';
  failReason?: string;
  createTime: string;
}

// 视频管理扩展信息
export interface VideoManagement extends VideoInfo {
  uploadProgress?: number;
  transcodeStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  transcodeProgress?: number;
  auditReason?: string;
  auditorId?: string;
  auditorName?: string;
  auditTime?: string;
}

// 文档管理扩展信息
export interface DocumentManagement extends DocumentInfo {
  uploadProgress?: number;
  auditReason?: string;
  auditorId?: string;
  auditorName?: string;
  auditTime?: string;
}

// 用户管理扩展信息
export interface UserManagement extends UserInfo {
  department?: Department;
  roles: Role[];
  lastLoginIp?: string;
  loginCount: number;
  isOnline: boolean;
  banReason?: string;
  banEndTime?: string;
}

// 字典类型
export interface DictionaryType {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: Status;
  isSystem: boolean;
  sort: number;
  createTime: string;
  updateTime: string;
}

// 字典项
export interface DictionaryItem {
  id: string;
  typeId: string;
  typeCode: string;
  code: string;
  label: string;
  value: string;
  color?: string;
  icon?: string;
  description?: string;
  status: Status;
  sort: number;
  createTime: string;
  updateTime: string;
}

// 积分商城商品
export interface PointMallItem {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'virtual' | 'physical';
  price: number;
  stock: number;
  soldCount: number;
  status: Status;
  sort: number;
  createTime: string;
  updateTime: string;
}

// 积分兑换记录
export interface PointExchangeRecord {
  id: string;
  userId: string;
  username: string;
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  auditReason?: string;
  auditorId?: string;
  auditorName?: string;
  auditTime?: string;
  createTime: string;
}

// 内容统计
export interface ContentStatistics {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  auditingCount: number;
  rejectedCount: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  categoryStats: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  authorStats: Array<{
    authorId: string;
    authorName: string;
    count: number;
  }>;
}

// 用户行为分析
export interface UserBehaviorAnalysis {
  activeUsers: number;
  newUsers: number;
  retentionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{
    path: string;
    views: number;
    uniqueViews: number;
  }>;
  deviceStats: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  locationStats: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
}

// 系统配置
export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  name: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  group: string;
  sort: number;
  isSystem: boolean;
  createTime: string;
  updateTime: string;
}

// 备份记录
export interface BackupRecord {
  id: string;
  name: string;
  type: 'manual' | 'auto';
  size: number;
  status: 'creating' | 'completed' | 'failed';
  progress?: number;
  filePath: string;
  description?: string;
  createTime: string;
  completeTime?: string;
}

// 文件管理
export interface FileInfo {
  id: string;
  name: string;
  originalName: string;
  path: string;
  url: string;
  size: number;
  type: string;
  mimeType: string;
  hash: string;
  uploaderId: string;
  uploaderName: string;
  useCount: number;
  status: Status;
  createTime: string;
}

// 批量操作结果
export interface BatchOperationResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
}

// 导入导出任务
export interface ImportExportTask {
  id: string;
  type: 'import' | 'export';
  module: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  total: number;
  processed: number;
  filePath?: string;
  errorMessage?: string;
  createTime: string;
  completeTime?: string;
}