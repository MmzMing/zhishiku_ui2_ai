/**
 * 用户状态管理
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface UserState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  token: string | null;
  permissions: string[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  userInfo: null,
  token: localStorage.getItem('auth_token'),
  permissions: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 登录开始
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // 登录成功
    loginSuccess: (state, action: PayloadAction<{ user: UserInfo; token: string }>) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.permissions = action.payload.user.permissions;
      state.error = null;
      
      // 保存到localStorage
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('user_info', JSON.stringify(action.payload.user));
    },
    
    // 登录失败
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isLoggedIn = false;
      state.userInfo = null;
      state.token = null;
      state.permissions = [];
      state.error = action.payload;
      
      // 清除localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    },
    
    // 退出登录
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.token = null;
      state.permissions = [];
      state.error = null;
      
      // 清除localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    },
    
    // 更新用户信息
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
        localStorage.setItem('user_info', JSON.stringify(state.userInfo));
      }
    },
    
    // 更新积分
    updatePoints: (state, action: PayloadAction<number>) => {
      if (state.userInfo) {
        state.userInfo.points = action.payload;
        localStorage.setItem('user_info', JSON.stringify(state.userInfo));
      }
    },
    
    // 设置权限
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
    
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    
    // 初始化用户状态（从localStorage恢复）
    initializeUser: (state) => {
      const token = localStorage.getItem('auth_token');
      const userInfoStr = localStorage.getItem('user_info');
      
      if (token && userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          state.isLoggedIn = true;
          state.userInfo = userInfo;
          state.token = token;
          state.permissions = userInfo.permissions || [];
        } catch (error) {
          // 解析失败，清除无效数据
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_info');
        }
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserInfo,
  updatePoints,
  setPermissions,
  clearError,
  initializeUser,
} = userSlice.actions;

export default userSlice.reducer;