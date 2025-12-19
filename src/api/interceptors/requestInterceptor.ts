/**
 * 请求拦截器
 */

import { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { getToken, getLanguage } from '../../utils/storage';
import { appConfig } from '../../config/app';

// 请求队列管理
class RequestQueue {
  private queue: Map<string, boolean> = new Map();
  
  // 生成请求唯一标识
  private generateKey(config: AxiosRequestConfig): string {
    const { method, url, params, data } = config;
    return `${method}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`;
  }
  
  // 检查是否重复请求
  isDuplicate(config: AxiosRequestConfig): boolean {
    const key = this.generateKey(config);
    return this.queue.has(key);
  }
  
  // 添加请求到队列
  add(config: AxiosRequestConfig): void {
    const key = this.generateKey(config);
    this.queue.set(key, true);
  }
  
  // 从队列中移除请求
  remove(config: AxiosRequestConfig): void {
    const key = this.generateKey(config);
    this.queue.delete(key);
  }
  
  // 清空队列
  clear(): void {
    this.queue.clear();
  }
}

// 创建请求队列实例
const requestQueue = new RequestQueue();

// 请求拦截器配置
export const requestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  // 防重复请求检查
  if (requestQueue.isDuplicate(config)) {
    console.warn('Duplicate request detected:', config.url);
    return Promise.reject(new Error('重复请求'));
  }
  
  // 添加到请求队列
  requestQueue.add(config);
  
  // 添加认证token
  const token = getToken();
  if (token && !config.headers?.skipAuth) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  
  // 添加语言标识
  const language = getLanguage();
  if (language) {
    config.headers = {
      ...config.headers,
      'Accept-Language': language,
    };
  }
  
  // 添加请求ID用于追踪
  config.headers = {
    ...config.headers,
    'X-Request-ID': generateRequestId(),
    'X-Client-Version': appConfig.APP_VERSION,
    'X-Client-Platform': 'web',
  };
  
  // 添加时间戳防止缓存（GET请求）
  if (config.method?.toLowerCase() === 'get' && !config.params?._nocache) {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }
  
  // 请求参数预处理
  if (config.data) {
    config.data = preprocessRequestData(config.data);
  }
  
  // 超时设置
  if (!config.timeout) {
    config.timeout = 30000; // 默认30秒超时
  }
  
  // 开发环境日志
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Config:', config);
    console.log('Headers:', config.headers);
    console.log('Params:', config.params);
    console.log('Data:', config.data);
    console.groupEnd();
  }
  
  return config;
};

// 请求错误拦截器
export const requestErrorInterceptor = (error: any): Promise<any> => {
  console.error('Request interceptor error:', error);
  
  // 从队列中移除失败的请求
  if (error.config) {
    requestQueue.remove(error.config);
  }
  
  // 网络错误处理
  if (!navigator.onLine) {
    message.error('网络连接已断开，请检查网络设置');
  }
  
  return Promise.reject(error);
};

// 生成请求ID
const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 请求数据预处理
const preprocessRequestData = (data: any): any => {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  // 深拷贝数据
  const processedData = JSON.parse(JSON.stringify(data));
  
  // 移除空值字段
  const removeEmptyFields = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(removeEmptyFields).filter(item => item !== null && item !== undefined);
    }
    
    if (obj && typeof obj === 'object') {
      const result: any = {};
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value !== null && value !== undefined && value !== '') {
          result[key] = removeEmptyFields(value);
        }
      });
      return result;
    }
    
    return obj;
  };
  
  return removeEmptyFields(processedData);
};

// 请求重试配置
export const retryConfig = {
  retries: 3,
  retryDelay: 1000,
  retryCondition: (error: any) => {
    // 网络错误或5xx错误时重试
    return !error.response || (error.response.status >= 500 && error.response.status <= 599);
  },
};

// 请求缓存配置
export const cacheConfig = {
  // 缓存时间（毫秒）
  ttl: 5 * 60 * 1000, // 5分钟
  // 需要缓存的请求方法
  methods: ['GET'],
  // 缓存键生成函数
  keyGenerator: (config: AxiosRequestConfig) => {
    return `${config.method}-${config.url}-${JSON.stringify(config.params)}`;
  },
};

// 请求限流配置
export const rateLimitConfig = {
  // 每秒最大请求数
  maxRequests: 10,
  // 时间窗口（毫秒）
  windowMs: 1000,
};

// 清理请求队列（用于组件卸载时）
export const clearRequestQueue = (): void => {
  requestQueue.clear();
};

// 获取当前请求队列状态
export const getRequestQueueStatus = () => {
  return {
    size: requestQueue['queue'].size,
    requests: Array.from(requestQueue['queue'].keys()),
  };
};