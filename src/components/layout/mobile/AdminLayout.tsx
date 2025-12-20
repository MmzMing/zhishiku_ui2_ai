/**
 * 后台移动端布局组件
 */

import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Avatar, Dropdown, FloatButton, Drawer, Menu, Breadcrumb } from 'antd';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { routeMeta } from '../../../router/routes';
import {
  DashboardOutlined,
  UserOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  BookOutlined,
  TrophyOutlined,
  SettingOutlined,
  BgColorsOutlined,
  TeamOutlined,
  SafetyOutlined,
  BarChartOutlined,
  FolderOutlined,
  UploadOutlined,
  AuditOutlined,
  HistoryOutlined,
  GiftOutlined,
  TagOutlined,
  MonitorOutlined,
  CloudServerOutlined,
  HomeOutlined,
  LogoutOutlined,
  DesktopOutlined,
  MenuOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import ThemeSettings from '../../common/ThemeSettings';

const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const AdminLayoutMobile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [themeSettingsVisible, setThemeSettingsVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 监听主题变化
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };
    
    checkTheme();
    window.addEventListener('theme-change', checkTheme);
    
    return () => {
      window.removeEventListener('theme-change', checkTheme);
    };
  }, []);

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'front',
      icon: <HomeOutlined />,
      label: '前台页面',
      onClick: () => navigate('/home'),
    },
    {
      key: 'admin',
      icon: <DesktopOutlined />,
      label: '后台管理',
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        localStorage.removeItem('isLoggedIn');
        window.dispatchEvent(new Event('login-change'));
        navigate('/home');
      },
    },
  ];

  // 菜单配置
  const menuItems: MenuItem[] = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: '控制台',
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '用户管理',
      children: [
        { key: '/admin/user/list', icon: <UserOutlined />, label: '用户管理' },
        { key: '/admin/user/role', icon: <SafetyOutlined />, label: '角色权限' },
        { key: '/admin/user/department', icon: <TeamOutlined />, label: '部门架构' },
        { key: '/admin/user/behavior', icon: <BarChartOutlined />, label: '用户行为' },
      ],
    },
    {
      key: 'video',
      icon: <PlayCircleOutlined />,
      label: '视频管理',
      children: [
        { key: '/admin/video/list', icon: <PlayCircleOutlined />, label: '视频列表' },
        { key: '/admin/video/upload', icon: <UploadOutlined />, label: '视频上传' },
        { key: '/admin/video/category', icon: <FolderOutlined />, label: '分类管理' },
        { key: '/admin/video/audit', icon: <AuditOutlined />, label: '审核管理' },
        { key: '/admin/video/stats', icon: <BarChartOutlined />, label: '统计分析' },
      ],
    },
    {
      key: 'content',
      icon: <FileTextOutlined />,
      label: '内容管理',
      children: [
        { key: '/admin/content/list', icon: <FileTextOutlined />, label: '文档管理' },
        { key: '/admin/content/blog', icon: <FileTextOutlined />, label: '博客管理' },
        { key: '/admin/content/comment', icon: <AuditOutlined />, label: '评论审核' },
        { key: '/admin/content/category', icon: <FolderOutlined />, label: '分类标签' },
        { key: '/admin/content/tag', icon: <TagOutlined />, label: '标签管理' },
        { key: '/admin/content/stats', icon: <BarChartOutlined />, label: '统计分析' },
      ],
    },
    {
      key: 'dictionary',
      icon: <BookOutlined />,
      label: '字典管理',
      children: [
        { key: '/admin/dictionary/category', icon: <FolderOutlined />, label: '字典分类' },
        { key: '/admin/dictionary/items', icon: <FileTextOutlined />, label: '字典项管理' },
        { key: '/admin/dictionary/usage', icon: <BarChartOutlined />, label: '使用统计' },
      ],
    },
    {
      key: 'point',
      icon: <TrophyOutlined />,
      label: '积分管理',
      children: [
        { key: '/admin/point/rules', icon: <SettingOutlined />, label: '积分规则' },
        { key: '/admin/point/records', icon: <HistoryOutlined />, label: '积分流水' },
        { key: '/admin/point/shop', icon: <GiftOutlined />, label: '积分商城' },
        { key: '/admin/point/ranking', icon: <TrophyOutlined />, label: '排行榜' },
      ],
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        { key: '/admin/system/server', icon: <CloudServerOutlined />, label: '服务器监控' },
        { key: '/admin/system/app', icon: <MonitorOutlined />, label: '应用监控' },
        { key: '/admin/system/log', icon: <FileTextOutlined />, label: '日志管理' },
        { key: '/admin/system/audit', icon: <SafetyOutlined />, label: '审计追踪' },
        { key: '/admin/system/config', icon: <SettingOutlined />, label: '系统配置' },
      ],
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
    setDrawerVisible(false);
  };

  // 获取当前选中的菜单key
  const getSelectedKeys = () => {
    return [location.pathname];
  };

  // 获取当前展开的菜单key
  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/admin/user')) return ['user'];
    if (path.startsWith('/admin/video')) return ['video'];
    if (path.startsWith('/admin/content')) return ['content'];
    if (path.startsWith('/admin/dictionary')) return ['dictionary'];
    if (path.startsWith('/admin/point')) return ['point'];
    if (path.startsWith('/admin/system')) return ['system'];
    return [];
  };

  // 获取当前路由的面包屑
  const getBreadcrumb = () => {
    const currentRoute = routeMeta[location.pathname as keyof typeof routeMeta];
    if (currentRoute && currentRoute.breadcrumb) {
      return currentRoute.breadcrumb.slice(1); // 去掉第一个"后台管理"
    }
    return ['控制台']; // 默认显示控制台
  };

  return (
    <Layout className="mobile-admin-layout">
      <Header className="mobile-admin-header">
        <div className="mobile-admin-header-content">
          {/* 菜单按钮 */}
          <Button 
            type="text" 
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            className="mobile-menu-btn"
          />

          {/* 面包屑导航 */}
          <div className="mobile-admin-title">
            {getBreadcrumb().join(' / ')}
          </div>

          {/* 用户操作 */}
          <Space size="small">
            <Button 
              shape="circle"
              type="text"
              icon={<BgColorsOutlined />} 
              onClick={() => setThemeSettingsVisible(true)}
              size="small"
              style={{ 
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
            <Dropdown 
              menu={{ items: userMenuItems }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Avatar 
                icon={<UserOutlined />} 
                size="small"
                style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
              />
            </Dropdown>
          </Space>
        </div>
      </Header>

      {/* 侧边抽屉菜单 */}
      <Drawer
        title="管理菜单"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        className="mobile-admin-drawer"
      >
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none' }}
        />
      </Drawer>

      <Content className="mobile-admin-content">
        <Outlet />
      </Content>

      <ThemeSettings 
        visible={themeSettingsVisible} 
        onClose={() => setThemeSettingsVisible(false)} 
      />

      {/* 返回顶部按钮 */}
      <FloatButton.BackTop 
        visibilityHeight={300}
        style={{ right: 16, bottom: 16 }}
      />
    </Layout>
  );
};

export default AdminLayoutMobile;