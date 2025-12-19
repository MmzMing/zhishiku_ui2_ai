/**
 * 登录/注册相关类型定义
 */

import { UserRole } from './common';

// 登录表单数据
export interface LoginForm {
  username: string;
  password: string;
  remember?: boolean;
  captcha?: string;
}

// 手机号登录表单数据
export interface PhoneLoginForm {
  phone: string;
  code: string;
}

// 注册表单数据
export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  phone: string;
  email: string;
  code: string;
  agreement: boolean;
}

// 重置密码表单数据
export interface ResetPasswordForm {
  phone?: string;
  email?: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

// 修改密码表单数据
export interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 用户信息
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  phone: string;
  email: string;
  gender: 'male' | 'female' | 'unknown';
  birthday: string;
  signature: string;
  status: 'active' | 'inactive' | 'disabled';
  role: UserRole;
  permissions: string[];
  points: number;
  level: number;
  registerTime: string;
  lastLoginTime: string;
  loginCount: number;
}

// 登录响应数据
export interface LoginResponse {
  token: string;
  refreshToken: string;
  userInfo: UserInfo;
  permissions: string[];
  expiresIn: number;
}

// Token信息
export interface TokenInfo {
  token: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

// 验证码响应
export interface CaptchaResponse {
  captchaId: string;
  captchaImage: string;
}

// 短信验证码请求
export interface SmsCodeRequest {
  phone: string;
  type: 'login' | 'register' | 'reset_password' | 'bind_phone';
  captchaId?: string;
  captcha?: string;
}

// 邮箱验证码请求
export interface EmailCodeRequest {
  email: string;
  type: 'register' | 'reset_password' | 'bind_email';
  captchaId?: string;
  captcha?: string;
}

// 第三方登录信息
export interface ThirdPartyLoginInfo {
  provider: 'wechat' | 'qq' | 'github' | 'google';
  code: string;
  state?: string;
}

// 绑定第三方账号
export interface BindThirdPartyAccount {
  provider: 'wechat' | 'qq' | 'github' | 'google';
  openId: string;
  unionId?: string;
  nickname: string;
  avatar: string;
}

// 用户设置
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  notifications: {
    comment: boolean;
    like: boolean;
    follow: boolean;
    system: boolean;
  };
  privacy: {
    showPhone: boolean;
    showEmail: boolean;
    allowSearch: boolean;
  };
}

// 用户统计信息
export interface UserStatistics {
  uploadCount: number;
  viewCount: number;
  likeCount: number;
  collectCount: number;
  commentCount: number;
  followCount: number;
  fanCount: number;
}

// 登录日志
export interface LoginLog {
  id: string;
  userId: string;
  loginTime: string;
  loginIp: string;
  loginLocation: string;
  userAgent: string;
  device: string;
  status: 'success' | 'failed';
  failReason?: string;
}

// 在线用户信息
export interface OnlineUser {
  userId: string;
  username: string;
  nickname: string;
  avatar: string;
  loginTime: string;
  lastActiveTime: string;
  ip: string;
  location: string;
  device: string;
}

// 权限信息
export interface Permission {
  id: string;
  code: string;
  name: string;
  type: 'menu' | 'button' | 'api';
  parentId?: string;
  path?: string;
  icon?: string;
  sort: number;
  status: 'active' | 'inactive';
  description?: string;
  children?: Permission[];
}

// 角色信息
export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  permissions: string[];
  status: 'active' | 'inactive';
  sort: number;
  createTime: string;
  updateTime: string;
}

// 部门信息
export interface Department {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  leaderId?: string;
  leaderName?: string;
  phone?: string;
  email?: string;
  sort: number;
  status: 'active' | 'inactive';
  description?: string;
  children?: Department[];
}

// 用户详细信息（包含角色、部门等）
export interface UserDetail extends UserInfo {
  roles: Role[];
  department?: Department;
  settings: UserSettings;
  statistics: UserStatistics;
  thirdPartyAccounts: BindThirdPartyAccount[];
}