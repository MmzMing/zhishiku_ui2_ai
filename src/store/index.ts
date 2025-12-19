/**
 * Redux Store配置
 */

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// 导入reducers
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';

// 持久化配置
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['theme'], // 只持久化主题状态
};

// 用户状态持久化配置
const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: ['loading', 'error', 'loginLoading', 'registerLoading', 'updateProfileLoading'], // 不持久化加载状态
};

// 合并reducers
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  theme: themeReducer,
});

// 创建持久化reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 配置store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// 创建persistor
export const persistor = persistStore(store);

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 导出store
export default store;