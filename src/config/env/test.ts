/**
 * 测试环境配置
 */
export const testConfig = {
  // API基础地址
  API_BASE_URL: 'https://test-api.zhishiku.com/api',
  
  // 日志级别
  LOG_LEVEL: 'info',
  
  // 是否启用Mock数据
  ENABLE_MOCK: false,
  
  // 上传文件大小限制（MB）
  MAX_FILE_SIZE: 50,
  
  // 分页默认配置
  PAGE_SIZE: 20,
  
  // Token过期时间（小时）
  TOKEN_EXPIRE_HOURS: 12,
  
  // 是否启用调试工具
  ENABLE_DEBUG_TOOLS: false,
  
  // CDN地址
  CDN_BASE_URL: 'https://test-cdn.zhishiku.com',
  
  // WebSocket地址
  WS_BASE_URL: 'wss://test-api.zhishiku.com/ws'
};