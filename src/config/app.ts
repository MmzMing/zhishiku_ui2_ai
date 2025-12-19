/**
 * 应用通用配置
 */

import { developmentConfig } from './env/development';
import { productionConfig } from './env/production';

// 根据环境变量选择配置
const isDevelopment = import.meta.env.DEV;
const envConfig = isDevelopment ? developmentConfig : productionConfig;

export const appConfig = {
  ...envConfig,
  
  // 应用信息
  appName: '个人管理知识库',
  appVersion: '1.0.0',
  appDescription: '基于React + Ant Design的知识管理系统',
  
  // 路由配置
  routes: {
    defaultRoute: '/home',
    loginRoute: '/auth/login',
    adminRoute: '/admin/dashboard',
  },
  
  // 主题配置
  theme: {
    primaryColor: '#1890ff',
    borderRadius: 6,
    colorBgContainer: '#ffffff',
  },
  
  // 文件类型配置
  fileTypes: {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    video: ['mp4', 'avi', 'mov', 'wmv', 'flv'],
    document: ['pdf', 'doc', 'docx', 'txt', 'md'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz'],
  },
  
  // 积分配置
  points: {
    register: 100, // 注册奖励
    dailyLogin: 5, // 每日登录
    uploadDocument: 10, // 上传文档
    uploadVideo: 20, // 上传视频
    downloadCost: 5, // 下载消耗
  },
  
  // 内容限制
  limits: {
    titleMaxLength: 100,
    descriptionMaxLength: 500,
    commentMaxLength: 500,
    tagMaxCount: 10,
    uploadMaxSize: envConfig.maxFileSize,
  },
  
  // 搜索配置
  search: {
    minKeywordLength: 2,
    maxKeywordLength: 50,
    suggestionCount: 10,
    historyCount: 10,
  },
  
  // 缓存键名
  cacheKeys: {
    token: 'auth_token',
    userInfo: 'user_info',
    theme: 'app_theme',
    searchHistory: 'search_history',
    viewHistory: 'view_history',
  },
  
  // 错误码映射
  errorCodes: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT',
  },
  
  // 正则表达式
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^1[3-9]\d{9}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
  },
};

export default appConfig;