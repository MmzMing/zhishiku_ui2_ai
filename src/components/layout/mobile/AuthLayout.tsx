/**
 * 登录/注册移动端布局组件
 */

import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const AuthLayoutMobile: React.FC = () => {
  return (
    <Layout className="mobile-auth-layout" style={{ minHeight: '100vh' }}>
      <Content className="mobile-auth-content">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AuthLayoutMobile;