/**
 * 生产环境配置
 */

export const productionConfig = {
  // API配置
  apiBaseUrl: 'https://api.knowledge-base.com/api',
  
  // 上传配置
  uploadUrl: 'https://api.knowledge-base.com/api/upload',
  maxFileSize: 50 * 1024 * 1024, // 50MB
  
  // 日志配置
  logLevel: 'error',
  enableConsoleLog: false,
  
  // 功能开关
  enableMockData: false,
  enableDevTools: false,
  
  // 第三方服务
  ossConfig: {
    region: 'oss-cn-hangzhou',
    bucket: 'prod-knowledge-base',
    accessKeyId: process.env.VITE_OSS_ACCESS_KEY_ID || '',
    accessKeySecret: process.env.VITE_OSS_ACCESS_KEY_SECRET || '',
  },
  
  // 分页配置
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
  },
  
  // 缓存配置
  cache: {
    tokenExpiry: 30 * 24 * 60 * 60 * 1000, // 30天
    userInfoExpiry: 7 * 24 * 60 * 60 * 1000, // 7天
  },
};