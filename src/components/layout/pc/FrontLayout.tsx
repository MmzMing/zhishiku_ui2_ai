/**
 * 前台PC端布局组件
 */

import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Avatar, Dropdown, Space, FloatButton } from 'antd';
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
  UserAddOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import ThemeSettings from '../../common/ThemeSettings';
import { useTheme } from '../../../contexts/ThemeContext';
import './FrontLayout.less';

const { Content, Footer } = Layout;
const { Search } = Input;

const FrontLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { config: themeConfig } = useTheme();
  const [themeSettingsVisible, setThemeSettingsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 从 localStorage 获取登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // 判断是否在首页
  const isHomePage = location.pathname === '/home' || location.pathname === '/';

  // 监听滚动 - 所有前台页面都生效
  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        // 首页：滚动超过 Banner 高度时触发
        const bannerHeight = window.innerHeight;
        setIsScrolled(window.scrollY > bannerHeight - 100);
      } else {
        // 其他页面：滚动超过 100px 时触发
        setIsScrolled(window.scrollY > 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查

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

  // 搜索处理 - 空搜索也跳转到搜索页
  const handleSearch = (value: string) => {
    const query = value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/search');
    }
  };

  // 页头类名 - 所有前台页面都支持滚动效果
  const headerClassName = `front-header ${isScrolled ? 'front-header-scrolled' : ''}`;

  // 设置 body 的 data-route 属性
  useEffect(() => {
    document.body.setAttribute('data-route', location.pathname);
    return () => {
      document.body.removeAttribute('data-route');
    };
  }, [location.pathname]);

  return (
    <Layout className="front-layout">
      {/* 自定义页头 */}
      <header className={headerClassName}>
        <div className="header-inner">
          <div className="header-content">
            {/* Logo */}
            {themeConfig.showLogo && (
              <div className="header-logo">
                <Link to="/home">
                  <h1>个人知识库</h1>
                </Link>
              </div>
            )}

            {/* 导航按钮 */}
            {themeConfig.showNavButtons && (
              <Space size="middle" className="header-nav">
                <Button 
                  type="text" 
                  icon={<HomeOutlined />}
                  onClick={() => navigate('/home')}
                >
                  首页
                </Button>
                <Button 
                  type="text" 
                  icon={<PlayCircleOutlined />}
                  onClick={() => navigate('/video')}
                >
                  视频
                </Button>
                <Button 
                  type="text" 
                  icon={<FileTextOutlined />}
                  onClick={() => navigate('/document')}
                >
                  文档
                </Button>
              </Space>
            )}

            {/* 搜索和用户操作 */}
            <Space size="middle" className="header-actions">
              <Search
                placeholder="搜索文档/视频"
                allowClear
                onSearch={handleSearch}
                style={{ width: 200 }}
                enterButton={<SearchOutlined />}
              />
              
              <Button 
                shape="circle"
                icon={<BgColorsOutlined />} 
                onClick={() => setThemeSettingsVisible(true)}
                title="主题设置"
                style={{ 
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
              
              {isLoggedIn ? (
                <Dropdown 
                  menu={{ items: loggedInMenuItems }} 
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
                  />
                </Dropdown>
              ) : (
                <Dropdown 
                  menu={{ items: guestMenuItems }} 
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Button type="primary">
                    登录
                  </Button>
                </Dropdown>
              )}
            </Space>
          </div>
        </div>
      </header>

      <Content className="front-content">
        <Outlet />
      </Content>

      {themeConfig.showFooter && (
        <Footer className="front-footer">
          <div className="footer-links">
            <Space size="large">
              <Link to="/about">关于我们</Link>
              <Link to="/contact">联系方式</Link>
              <Link to="/privacy">隐私政策</Link>
              <Link to="/terms">用户协议</Link>
              <Link to="/feedback">意见反馈</Link>
            </Space>
          </div>
          <div className="footer-copyright">
            个人管理知识库 ©2024 Created by Knowledge Base Team
          </div>
          <div className="footer-stats">
            📅 运行 365 天 | 👥 累计用户 1,328 | 📊 累计访问 15,680 次
          </div>
        </Footer>
      )}

      {/* 主题设置抽屉 */}
      <ThemeSettings 
        visible={themeSettingsVisible} 
        onClose={() => setThemeSettingsVisible(false)} 
      />

      {/* 返回顶部按钮 */}
      <FloatButton.BackTop 
        visibilityHeight={300}
        style={{ right: 24, bottom: 24 }}
      />
    </Layout>
  );
};

export default FrontLayout;
