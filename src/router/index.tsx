/**
 * 路由入口文件
 */

import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Spin } from 'antd';
import { routes } from './routes';

// 创建路由器
const router = createBrowserRouter(routes);

// 加载中组件
const LoadingComponent: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" />
  </div>
);

// 路由组件
const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AppRouter;