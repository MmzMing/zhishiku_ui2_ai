/**
 * 布局提供器 - 根据设备类型自动选择布局
 */

import React, { Suspense } from 'react';
import { Spin } from 'antd';
import { useDevice } from '../../hooks/common/useDevice';

// PC端布局
const FrontLayoutPC = React.lazy(() => import('./pc/FrontLayout'));
const AdminLayoutPC = React.lazy(() => import('./pc/AdminLayout'));
const AuthLayoutPC = React.lazy(() => import('./pc/AuthLayout'));

// 移动端布局
const FrontLayoutMobile = React.lazy(() => import('./mobile/FrontLayout'));
const AdminLayoutMobile = React.lazy(() => import('./mobile/AdminLayout'));
const AuthLayoutMobile = React.lazy(() => import('./mobile/AuthLayout'));

interface LayoutProviderProps {
  type: 'front' | 'admin' | 'auth';
  children?: React.ReactNode;
}

const LayoutProvider: React.FC<LayoutProviderProps> = ({ type }) => {
  const { isMobile } = useDevice();

  // 根据设备类型和布局类型选择对应的布局组件
  const getLayoutComponent = () => {
    if (isMobile) {
      switch (type) {
        case 'front':
          return <FrontLayoutMobile />;
        case 'admin':
          return <AdminLayoutMobile />;
        case 'auth':
          return <AuthLayoutMobile />;
        default:
          return <FrontLayoutMobile />;
      }
    } else {
      switch (type) {
        case 'front':
          return <FrontLayoutPC />;
        case 'admin':
          return <AdminLayoutPC />;
        case 'auth':
          return <AuthLayoutPC />;
        default:
          return <FrontLayoutPC />;
      }
    }
  };

  return (
    <Suspense 
      fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <Spin size="large" />
        </div>
      }
    >
      {getLayoutComponent()}
    </Suspense>
  );
};

export default LayoutProvider;