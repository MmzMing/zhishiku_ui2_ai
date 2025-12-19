/**
 * 响应拦截器
 */

import { AxiosResponse, AxiosError } from 'axios';
import { message, notification } from 'antd';
import { removeToken, removeUserInfo, removePermissions } from '../../utils/storage';
import { ResponseData } from '../../utils/request';

// 响应成功拦截器
export const responseInterceptor = (response: AxiosResponse<ResponseData>): any => {
  const { config, data } = response;
  
  // 开发环境日志
  if (process.env.NODE_ENV === 'development') {
    console.group(`✅ Response: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data:', data);
    console.groupEnd();
  }
  
  // 检查业务状态码
  if (data && typeof data === 'object' && 'code' in data) {
    const { code, message: msg, success } = data;
    
    // 成功响应
    if (code === 200 || code === 0 || success === true) {
      // 显示成功提示（如果配置了）
      if ((config as any).showSuccess && msg) {
        message.success(msg);
      }
      
      return data;
    }
    
    // 业务错误处理
    return handleBusinessError(data, config);
  }
  
  // 直接返回响应数据（非标准格式）
  return response.data;
};

// 响应错误拦截器
export const responseErrorInterceptor = (error: AxiosError): Promise<any> => {
  const { config, response, code, message: errorMessage } = error;
  
  // 开发环境日志
  if (process.env.NODE_ENV === 'development') {
    console.group(`❌ Response Error: ${config?.method?.toUpperCase()} ${config?.url}`);
    console.log('Error Code:', code);
    console.log('Error Message:', errorMessage);
    console.log('Response:', response);
    console.groupEnd();
  }
  
  // 网络错误处理
  if (!response) {
    return handleNetworkError(error);
  }
  
  // HTTP状态码错误处理
  return handleHttpError(error);
};

// 处理业务错误
const handleBusinessError = (data: ResponseData, config: any): Promise<any> => {
  const { code, message: msg } = data;
  
  // 特殊业务状态码处理
  switch (code) {
    case 401:
      return handleUnauthorized(msg);
    case 403:
      return handleForbidden(msg);
    case 404:
      return handleNotFound(msg);
    case 429:
      return handleTooManyRequests(msg);
    case 500:
      return handleServerError(msg);
    default:
      // 通用业务错误处理
      if (!config.skipErrorHandler) {
        message.error(msg || '操作失败');
      }
      return Promise.reject(new Error(msg || '操作失败'));
  }
};

// 处理网络错误
const handleNetworkError = (error: AxiosError): Promise<any> => {
  let errorMessage = '网络错误，请稍后重试';
  
  if (error.code === 'ECONNABORTED') {
    errorMessage = '请求超时，请稍后重试';
  } else if (error.message.includes('Network Error')) {
    errorMessage = '网络连接失败，请检查网络设置';
  } else if (!navigator.onLine) {
    errorMessage = '网络连接已断开，请检查网络设置';
  }
  
  if (!(error.config as any)?.skipErrorHandler) {
    message.error(errorMessage);
  }
  
  return Promise.reject(error);
};

// 处理HTTP错误
const handleHttpError = (error: AxiosError): Promise<any> => {
  const { response, config } = error;
  const status = response?.status;
  let errorMessage = '请求失败';
  
  switch (status) {
    case 400:
      errorMessage = '请求参数错误';
      break;
    case 401:
      return handleUnauthorized('登录已过期，请重新登录');
    case 403:
      return handleForbidden('没有权限访问该资源');
    case 404:
      errorMessage = '请求的资源不存在';
      break;
    case 405:
      errorMessage = '请求方法不被允许';
      break;
    case 408:
      errorMessage = '请求超时';
      break;
    case 409:
      errorMessage = '请求冲突';
      break;
    case 422:
      errorMessage = '请求参数验证失败';
      break;
    case 429:
      return handleTooManyRequests('请求过于频繁，请稍后重试');
    case 500:
      return handleServerError('服务器内部错误');
    case 502:
      errorMessage = '网关错误';
      break;
    case 503:
      errorMessage = '服务不可用';
      break;
    case 504:
      errorMessage = '网关超时';
      break;
    default:
      errorMessage = `服务器错误 ${status}`;
      break;
  }
  
  if (!(config as any)?.skipErrorHandler) {
    message.error(errorMessage);
  }
  
  return Promise.reject(error);
};

// 处理401未授权
const handleUnauthorized = (msg?: string): Promise<any> => {
  const errorMessage = msg || '登录已过期，请重新登录';
  
  // 清除用户数据
  removeToken();
  removeUserInfo();
  removePermissions();
  
  // 显示错误提示
  message.error(errorMessage);
  
  // 延迟跳转到登录页，避免重复跳转
  setTimeout(() => {
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, 1000);
  
  return Promise.reject(new Error(errorMessage));
};

// 处理403禁止访问
const handleForbidden = (msg?: string): Promise<any> => {
  const errorMessage = msg || '没有权限访问该资源';
  
  message.error(errorMessage);
  
  // 跳转到403页面
  setTimeout(() => {
    if (window.location.pathname !== '/403') {
      window.location.href = '/403';
    }
  }, 1000);
  
  return Promise.reject(new Error(errorMessage));
};

// 处理404资源不存在
const handleNotFound = (msg?: string): Promise<any> => {
  const errorMessage = msg || '请求的资源不存在';
  message.error(errorMessage);
  return Promise.reject(new Error(errorMessage));
};

// 处理429请求过于频繁
const handleTooManyRequests = (msg?: string): Promise<any> => {
  const errorMessage = msg || '请求过于频繁，请稍后重试';
  
  notification.warning({
    message: '请求限制',
    description: errorMessage,
    duration: 5,
  });
  
  return Promise.reject(new Error(errorMessage));
};

// 处理500服务器错误
const handleServerError = (msg?: string): Promise<any> => {
  const errorMessage = msg || '服务器内部错误，请稍后重试';
  
  notification.error({
    message: '服务器错误',
    description: errorMessage,
    duration: 5,
  });
  
  // 可以在这里添加错误上报逻辑
  reportError({
    type: 'server_error',
    message: errorMessage,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  });
  
  return Promise.reject(new Error(errorMessage));
};

// 错误上报
const reportError = (errorInfo: any): void => {
  // 这里可以集成错误监控服务，如Sentry
  if (process.env.NODE_ENV === 'production') {
    console.error('Error reported:', errorInfo);
    // 实际项目中可以调用错误上报接口
    // errorReportingService.report(errorInfo);
  }
};

// 响应数据转换器
export const responseTransformer = (data: any): any => {
  // 如果是字符串，尝试解析为JSON
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }
  
  // 日期字符串转换为Date对象
  if (data && typeof data === 'object') {
    const dateFields = ['createTime', 'updateTime', 'publishTime', 'loginTime'];
    
    const transformDates = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(transformDates);
      }
      
      if (obj && typeof obj === 'object') {
        const result: any = {};
        Object.keys(obj).forEach(key => {
          const value = obj[key];
          
          // 转换日期字段
          if (dateFields.includes(key) && typeof value === 'string') {
            result[key] = new Date(value);
          } else if (typeof value === 'object') {
            result[key] = transformDates(value);
          } else {
            result[key] = value;
          }
        });
        return result;
      }
      
      return obj;
    };
    
    return transformDates(data);
  }
  
  return data;
};

// 响应缓存管理
class ResponseCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  
  // 设置缓存
  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
  
  // 获取缓存
  get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    // 检查是否过期
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  // 删除缓存
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  // 清空缓存
  clear(): void {
    this.cache.clear();
  }
  
  // 清理过期缓存
  cleanup(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// 创建响应缓存实例
export const responseCache = new ResponseCache();

// 定期清理过期缓存
setInterval(() => {
  responseCache.cleanup();
}, 60 * 1000); // 每分钟清理一次