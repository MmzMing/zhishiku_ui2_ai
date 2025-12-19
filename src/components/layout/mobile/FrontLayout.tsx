/**
 * 前台移动端布局组件
 */

import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Avatar, Dropdown, Space, FloatButton, Drawer } from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  HomeOutlined, 
  PlayCircleOutlined, 
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
  BgColorsOutlined,
  UserAddOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import ThemeSettings from '../../common/ThemeSettings';

const { Content, Footer } = Layout;
const { Search } = Input;

const FrontLayoutMobile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [themeSettingsVisible, setThemeSettingsVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 从 localStorage 获取登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // 判断是否在首页
  const isHomePage = location.pathname === '/home' || location.pathname === '/';

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        const bannerHeight = window.innerHeight;
        setIsScrolled(window.scrollY > bannerHeight - 100);
      } else {
        setIsScrolled(window.scrollY > 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  // 监听登录状态变化
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('login-change', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login-change', handleStorageChange);
    };
  }, []);

  // 用户下拉菜单（已登录）
  const loggedInMenuItems: MenuProps['items'] = [
    {
      key: 'front',
      icon: <HomeOutlined />,
      label: '前台页面',
      onClick: () => navigate('/home'),
    },
    {
      key: 'admin',
      icon: <SettingOutlined />,
      label: '后台管理',
      onClick: () => navigate('/admin'),
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

  // 用户下拉菜单（未登录）
  const guestMenuItems: MenuProps['items'] = [
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: '登录',
      onClick: () => navigate('/auth/login'),
    },
    {
      key: 'register',
      icon: <UserAddOutlined />,
      label: '注册',
      onClick: () => navigate('/auth/register'),
    },
  ];

  // 搜索处理
  const handleSearch = (value: string) => {
    const query = value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/search');
    }
  };

  // 页头类名
  const headerClassName = `mobile-front-header ${isScrolled ? 'mobile-front-header-scrolled' : ''}`;

  // 设置 body 的 data-route 属性
  useEffect(() => {
    document.body.setAttribute('data-route', location.pathname);
    return () => {
      document.body.removeAttribute('data-route');
    };
  }, [location.pathname]);

  return (
    <Layout className="mobile-front-layout">
      {/* 移动端页头 */}
      <header className={headerClassName}>
        <div className="mobile-header-inner">
          <div className="mobile-header-content">
            {/* 菜单按钮 */}
            <Button 
              type="text" 
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              className="mobile-menu-btn"
            />

            {/* Logo */}
            <div className="mobile-header-logo">
              <Link to="/home">
                <h1>知识库</h1>
              </Link>
            </div>

            {/* 用户头像 */}
            <div className="mobile-header-user">
              {isLoggedIn ? (
                <Dropdown 
                  menu={{ items: loggedInMenuItems }} 
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Avatar 
                    icon={<UserOutlined />} 
                    size="small"
                    style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
                  />
                </Dropdown>
              ) : (
                <Dropdown 
                  menu={{ items: guestMenuItems }} 
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Button type="primary" size="small">
                    登录
                  </Button>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 侧边抽屉菜单 */}
      <Drawer
        title="菜单"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        className="mobile-drawer"
      >
        <div className="mobile-drawer-content">
          {/* 搜索框 */}
          <div className="mobile-search-section">
            <Search
              placeholder="搜索文档/视频"
              allowClear
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
            />
          </div>

          {/* 导航菜单 */}
          <div className="mobile-nav-section">
            <div className="mobile-nav-item" onClick={() => {
              navigate('/home');
              setDrawerVisible(false);
            }}>
              <HomeOutlined />
              <span>首页</span>
            </div>
            <div className="mobile-nav-item" onClick={() => {
              navigate('/video');
              setDrawerVisible(false);
            }}>
              <PlayCircleOutlined />
              <span>视频</span>
            </div>
            <div className="mobile-nav-item" onClick={() => {
              navigate('/document');
              setDrawerVisible(false);
            }}>
              <FileTextOutlined />
              <span>文档</span>
            </div>
          </div>

          {/* 设置按钮 */}
          <div className="mobile-settings-section">
            <Button 
              block
              icon={<BgColorsOutlined />} 
              onClick={() => {
                setThemeSettingsVisible(true);
                setDrawerVisible(false);
              }}
            >
              主题设置
            </Button>
          </div>
        </div>
      </Drawer>

      <Content className="mobile-front-content">
        <Outlet />
      </Content>

      <Footer className="mobile-front-footer">
        <div className="mobile-footer-links">
          <Space size="small" wrap>
            <Link to="/about">关于</Link>
            <Link to="/contact">联系</Link>
            <Link to="/privacy">隐私</Link>
            <Link to="/terms">协议</Link>
            <Link to="/feedback">反馈</Link>
          </Space>
        </div>
        <div className="mobile-footer-copyright">
          个人管理知识库 ©2024
        </div>
      </Footer>

      {/* 主题设置抽屉 */}
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

export default FrontLayoutMobile;