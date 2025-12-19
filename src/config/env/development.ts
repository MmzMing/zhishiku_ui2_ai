/**
 * 开发环境配置
 */

export const developmentConfig = {
  // API配置
  apiBaseUrl: 'http://localhost:8080/api',
  
  // 上传配置
  uploadUrl: 'http://localhost:8080/api/upload',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  
  // 日志配置
  logLevel: 'debug',
  enableConsoleLog: true,
  
  // 功能开关
  enableMockData: true,
  enableDevTools: true,
  
  // 第三方服务
  ossConfig: {
    region: 'oss-cn-hangzhou',
    bucket: 'dev-knowledge-base',
    accessKeyId: 'dev-access-key',
    accessKeySecret: 'dev-access-secret',
  },
  
  // 分页配置
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100'],
  },
  
  // 缓存配置
  cache: {
    tokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7天
    userInfoExpiry: 24 * 60 * 60 * 1000, // 1天
  },
};