/**
 * 认证相关API
 */

import { get, post } from '../../utils/request';

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
  code: string;
  uuid: string;
  rememberMe?: boolean;
}

// 手机登录参数
export interface PhoneLoginParams {
  phone: string;
  code: string;
}

// 注册请求参数
export interface RegisterParams {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  code: string;
  agreement: boolean;
}

// 用户信息
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  registerTime: string;
  points: number;
  roles: string[];
  permissions: string[];
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: UserInfo;
  expiresIn: number;
}

// 图形验证码响应
export interface CaptchaResponse {
  captchaOnOff: boolean;
  uuid: string;
  img: string;
}

/**
 * 获取图形验证码
 */
export const getCaptcha = (): Promise<CaptchaResponse> => {
  return get('/graph/code');
};

/**
 * 用户名密码登录
 */
export const login = (params: LoginParams): Promise<LoginResponse> => {
  return post('/auth/login', params);
};

/**
 * 手机号验证码登录
 */
export const phoneLogin = (params: PhoneLoginParams): Promise<LoginResponse> => {
  return post('/auth/phone-login', params);
};

/**
 * 用户注册
 */
export const register = (params: RegisterParams): Promise<void> => {
  return post('/auth/register', params);
};

/**
 * 发送短信验证码
 */
export const sendSmsCode = (phone: string): Promise<void> => {
  return post('/auth/send-sms-code', { phone });
};

/**
 * 发送邮箱验证码
 */
export const sendEmailCode = (email: string): Promise<void> => {
  return post('/auth/send-email-code', { email });
};

/**
 * 退出登录
 */
export const logout = (): Promise<void> => {
  return post('/auth/logout');
};

/**
 * 刷新token
 */
export const refreshToken = (): Promise<{ token: string; expiresIn: number }> => {
  return post('/auth/refresh-token');
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = (): Promise<UserInfo> => {
  return get('/auth/current-user');
};

/**
 * 修改密码
 */
export const changePassword = (params: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> => {
  return post('/auth/change-password', params);
};

/**
 * 忘记密码
 */
export const forgotPassword = (params: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<void> => {
  return post('/auth/forgot-password', params);
};

/**
 * 更新用户信息
 */
export const updateProfile = (params: Partial<UserInfo>): Promise<UserInfo> => {
  return post('/auth/update-profile', params);
};

/**
 * 上传头像
 */
export const uploadAvatar = (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('avatar', file);
  return post('/auth/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
