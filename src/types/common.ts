/**
 * 通用类型定义
 */

// 基础响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  timestamp: number;
}

// 分页请求参数
export interface PaginationParams {
  current: number;
  pageSize: number;
  total?: number;
}

// 分页响应数据
export interface PaginationResponse<T = any> {
  list: T[];
  total: number;
  current: number;
  pageSize: number;
  pages: number;
}

// 排序参数
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

// 筛选参数
export interface FilterParams {
  [key: string]: any;
}

// 搜索参数
export interface SearchParams extends PaginationParams {
  keyword?: string;
  sort?: SortParams;
  filters?: FilterParams;
}

// 文件上传响应
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// 选项类型
export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
  children?: Option[];
}

// 树形数据类型
export interface TreeNode {
  key: string | number;
  title: string;
  value?: string | number;
  children?: TreeNode[];
  disabled?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  isLeaf?: boolean;
  icon?: React.ReactNode;
}

// 表格列配置
export interface TableColumn {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  sorter?: boolean;
  filterable?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

// 表单字段配置
export interface FormField {
  name: string;
  label: string;
  type: 'input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'upload' | 'custom';
  required?: boolean;
  rules?: any[];
  options?: Option[];
  placeholder?: string;
  disabled?: boolean;
  render?: () => React.ReactNode;
}

// 菜单项类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permission?: string;
  hidden?: boolean;
}

// 面包屑项类型
export interface BreadcrumbItem {
  title: string;
  path?: string;
}

// 标签页类型
export interface TabItem {
  key: string;
  label: string;
  closable?: boolean;
  path: string;
}

// 通知类型
export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createTime: string;
}

// 统计数据类型
export interface StatisticItem {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  precision?: number;
  valueStyle?: React.CSSProperties;
  trend?: 'up' | 'down';
  trendValue?: number;
}

// 图表数据类型
export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

// 时间范围类型
export type TimeRange = [string, string] | null;

// 主题类型
export type ThemeType = 'light' | 'dark';

// 设备类型
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 状态类型
export type Status = 'active' | 'inactive' | 'pending' | 'disabled';

// 性别类型
export type Gender = 'male' | 'female' | 'unknown';

// 文件类型
export type FileType = 'image' | 'video' | 'document' | 'audio' | 'other';

// 内容类型
export type ContentType = 'video' | 'document' | 'article';

// 审核状态
export type AuditStatus = 'pending' | 'approved' | 'rejected';

// 发布状态
export type PublishStatus = 'draft' | 'published' | 'archived';

// 用户角色
export type UserRole = 'user' | 'admin' | 'content_admin' | 'system_admin';

// 权限类型
export type PermissionType = 'menu' | 'button' | 'api';

// 操作类型
export type ActionType = 'create' | 'read' | 'update' | 'delete' | 'export' | 'import';

// 日志级别
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// 通用枚举
export const COMMON_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  DISABLED: 'disabled'
} as const;

export const AUDIT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const PUBLISH_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  CONTENT_ADMIN: 'content_admin',
  SYSTEM_ADMIN: 'system_admin'
} as const;