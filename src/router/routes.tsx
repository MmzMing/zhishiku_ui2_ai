/**
 * 路由配置
 */

import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AdminGuard } from './guard';

// 懒加载组件
const Home = React.lazy(() => import('../pages/front/home/Home'));

// 前台页面
const VideoList = React.lazy(() => import('../pages/front/video/VideoList'));
const VideoDetail = React.lazy(() => import('../pages/front/video/VideoDetail'));
const DocumentList = React.lazy(() => import('../pages/front/document/DocumentList'));
const DocumentDetail = React.lazy(() => import('../pages/front/document/DocumentDetail'));
const Profile = React.lazy(() => import('../pages/front/profile/Profile'));
const SearchResults = React.lazy(() => import('../pages/front/search/SearchResults'));

// 后台管理 - 控制台
const AdminDashboard = React.lazy(() => import('../pages/admin/dashboard/Dashboard'));

// 后台管理 - 用户管理子页面
const AdminUserList = React.lazy(() => import('../pages/admin/user/UserList'));
const AdminRolePermission = React.lazy(() => import('../pages/admin/user/RolePermission'));
const AdminDepartment = React.lazy(() => import('../pages/admin/user/Department'));
const AdminUserBehavior = React.lazy(() => import('../pages/admin/user/UserBehavior'));

// 后台管理 - 视频管理子页面
const AdminVideoList = React.lazy(() => import('../pages/admin/video/VideoList'));
const AdminVideoUpload = React.lazy(() => import('../pages/admin/video/VideoUpload'));
const AdminVideoCategory = React.lazy(() => import('../pages/admin/video/VideoCategory'));
const AdminVideoAudit = React.lazy(() => import('../pages/admin/video/VideoAudit'));
const AdminVideoStats = React.lazy(() => import('../pages/admin/video/VideoStats'));

// 后台管理 - 内容管理子页面
const AdminContentList = React.lazy(() => import('../pages/admin/content/ContentList'));
const AdminContentCategory = React.lazy(() => import('../pages/admin/content/ContentCategory'));
const AdminContentTag = React.lazy(() => import('../pages/admin/content/ContentTag'));
const AdminContentStats = React.lazy(() => import('../pages/admin/content/ContentStats'));
const AdminBlogList = React.lazy(() => import('../pages/admin/content/BlogList'));
const AdminBlogEdit = React.lazy(() => import('../pages/admin/content/BlogEdit'));
const AdminCommentAudit = React.lazy(() => import('../pages/admin/content/CommentAudit'));

// 后台管理 - 字典管理子页面
const AdminDictCategory = React.lazy(() => import('../pages/admin/dictionary/DictCategory'));
const AdminDictItems = React.lazy(() => import('../pages/admin/dictionary/DictItems'));
const AdminDictUsage = React.lazy(() => import('../pages/admin/dictionary/DictUsage'));

// 后台管理 - 积分管理子页面
const AdminPointRules = React.lazy(() => import('../pages/admin/point/PointRules'));
const AdminPointRecords = React.lazy(() => import('../pages/admin/point/PointRecords'));
const AdminPointShop = React.lazy(() => import('../pages/admin/point/PointShop'));
const AdminPointRanking = React.lazy(() => import('../pages/admin/point/PointRanking'));

// 后台管理 - 系统管理子页面
const AdminServerMonitor = React.lazy(() => import('../pages/admin/system/ServerMonitor'));
const AdminAppMonitor = React.lazy(() => import('../pages/admin/system/AppMonitor'));
const AdminLogManage = React.lazy(() => import('../pages/admin/system/LogManage'));
const AdminAuditTrail = React.lazy(() => import('../pages/admin/system/AuditTrail'));
const AdminSystemConfig = React.lazy(() => import('../pages/admin/system/SystemConfig'));

// 布局组件 - 不使用懒加载，避免 Suspense 问题
import LayoutProvider from '../components/layout/LayoutProvider';

// 登录注册页面
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));

// 错误页面
const NotFound = React.lazy(() => import('../pages/error/NotFound'));

// 后台管理布局包装器（带路由守卫）
const AdminLayoutWithGuard: React.FC = () => {
  return (
    <AdminGuard>
      <LayoutProvider type="admin" />
    </AdminGuard>
  );
};

// 路由配置
export const routes: RouteObject[] = [
  // 根路径重定向到首页
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  
  // 前台路由
  {
    path: '/',
    element: <LayoutProvider type="front" />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'video', element: <VideoList /> },
      { path: 'video/:id', element: <VideoDetail /> },
      { path: 'document', element: <DocumentList /> },
      { path: 'document/:id', element: <DocumentDetail /> },
      { path: 'profile', element: <Profile /> },
      { path: 'search', element: <SearchResults /> },
    ],
  },
  
  // 登录注册路由
  {
    path: '/auth',
    element: <LayoutProvider type="auth" />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  
  // 后台管理路由（需要登录）
  {
    path: '/admin',
    element: <AdminLayoutWithGuard />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      
      // 用户管理子路由
      { path: 'user/list', element: <AdminUserList /> },
      { path: 'user/role', element: <AdminRolePermission /> },
      { path: 'user/department', element: <AdminDepartment /> },
      { path: 'user/behavior', element: <AdminUserBehavior /> },
      
      // 视频管理子路由
      { path: 'video/list', element: <AdminVideoList /> },
      { path: 'video/upload', element: <AdminVideoUpload /> },
      { path: 'video/category', element: <AdminVideoCategory /> },
      { path: 'video/audit', element: <AdminVideoAudit /> },
      { path: 'video/stats', element: <AdminVideoStats /> },
      
      // 内容管理子路由
      { path: 'content/list', element: <AdminContentList /> },
      { path: 'content/blog', element: <AdminBlogList /> },
      { path: 'content/blog/edit', element: <AdminBlogEdit /> },
      { path: 'content/blog/edit/:id', element: <AdminBlogEdit /> },
      { path: 'content/comment', element: <AdminCommentAudit /> },
      { path: 'content/category', element: <AdminContentCategory /> },
      { path: 'content/tag', element: <AdminContentTag /> },
      { path: 'content/stats', element: <AdminContentStats /> },
      
      // 字典管理子路由
      { path: 'dictionary/category', element: <AdminDictCategory /> },
      { path: 'dictionary/items', element: <AdminDictItems /> },
      { path: 'dictionary/usage', element: <AdminDictUsage /> },
      
      // 积分管理子路由
      { path: 'point/rules', element: <AdminPointRules /> },
      { path: 'point/records', element: <AdminPointRecords /> },
      { path: 'point/shop', element: <AdminPointShop /> },
      { path: 'point/ranking', element: <AdminPointRanking /> },
      
      // 系统管理子路由
      { path: 'system/server', element: <AdminServerMonitor /> },
      { path: 'system/app', element: <AdminAppMonitor /> },
      { path: 'system/log', element: <AdminLogManage /> },
      { path: 'system/audit', element: <AdminAuditTrail /> },
      { path: 'system/config', element: <AdminSystemConfig /> },
    ],
  },
  
  // 404页面
  {
    path: '*',
    element: <NotFound />,
  },
];

// 路由元信息
export const routeMeta = {
  '/home': { title: '首页', breadcrumb: ['首页'] },
  '/admin/dashboard': { title: '控制台', icon: 'DashboardOutlined', breadcrumb: ['后台管理', '控制台'] },
  // 用户管理
  '/admin/user/list': { title: '用户管理', icon: 'UserOutlined', breadcrumb: ['后台管理', '用户管理', '用户管理'] },
  '/admin/user/role': { title: '角色权限', icon: 'SafetyOutlined', breadcrumb: ['后台管理', '用户管理', '角色权限'] },
  '/admin/user/department': { title: '部门架构', icon: 'TeamOutlined', breadcrumb: ['后台管理', '用户管理', '部门架构'] },
  '/admin/user/behavior': { title: '用户行为', icon: 'BarChartOutlined', breadcrumb: ['后台管理', '用户管理', '用户行为'] },
  // 视频管理
  '/admin/video/list': { title: '视频列表', icon: 'PlayCircleOutlined', breadcrumb: ['后台管理', '视频管理', '视频列表'] },
  '/admin/video/upload': { title: '视频上传', icon: 'UploadOutlined', breadcrumb: ['后台管理', '视频管理', '视频上传'] },
  '/admin/video/category': { title: '分类管理', icon: 'FolderOutlined', breadcrumb: ['后台管理', '视频管理', '分类管理'] },
  '/admin/video/audit': { title: '审核管理', icon: 'AuditOutlined', breadcrumb: ['后台管理', '视频管理', '审核管理'] },
  '/admin/video/stats': { title: '统计分析', icon: 'BarChartOutlined', breadcrumb: ['后台管理', '视频管理', '统计分析'] },
  // 内容管理
  '/admin/content/list': { title: '文档管理', icon: 'FileTextOutlined', breadcrumb: ['后台管理', '内容管理', '文档管理'] },
  '/admin/content/blog': { title: '博客管理', icon: 'EditOutlined', breadcrumb: ['后台管理', '内容管理', '博客管理'] },
  '/admin/content/blog/edit': { title: '写博客', icon: 'EditOutlined', breadcrumb: ['后台管理', '内容管理', '写博客'] },
  '/admin/content/comment': { title: '评论审核', icon: 'MessageOutlined', breadcrumb: ['后台管理', '内容管理', '评论审核'] },
  '/admin/content/category': { title: '分类标签', icon: 'FolderOutlined', breadcrumb: ['后台管理', '内容管理', '分类标签'] },
  '/admin/content/tag': { title: '标签管理', icon: 'TagOutlined', breadcrumb: ['后台管理', '内容管理', '标签管理'] },
  '/admin/content/stats': { title: '统计分析', icon: 'BarChartOutlined', breadcrumb: ['后台管理', '内容管理', '统计分析'] },
  // 字典管理
  '/admin/dictionary/category': { title: '字典分类', icon: 'FolderOutlined', breadcrumb: ['后台管理', '字典管理', '字典分类'] },
  '/admin/dictionary/items': { title: '字典项管理', icon: 'FileTextOutlined', breadcrumb: ['后台管理', '字典管理', '字典项管理'] },
  '/admin/dictionary/usage': { title: '使用统计', icon: 'BarChartOutlined', breadcrumb: ['后台管理', '字典管理', '使用统计'] },
  // 积分管理
  '/admin/point/rules': { title: '积分规则', icon: 'SettingOutlined', breadcrumb: ['后台管理', '积分管理', '积分规则'] },
  '/admin/point/records': { title: '积分流水', icon: 'HistoryOutlined', breadcrumb: ['后台管理', '积分管理', '积分流水'] },
  '/admin/point/shop': { title: '积分商城', icon: 'GiftOutlined', breadcrumb: ['后台管理', '积分管理', '积分商城'] },
  '/admin/point/ranking': { title: '排行榜', icon: 'TrophyOutlined', breadcrumb: ['后台管理', '积分管理', '排行榜'] },
  // 系统管理
  '/admin/system/server': { title: '服务器监控', icon: 'CloudServerOutlined', breadcrumb: ['后台管理', '系统管理', '服务器监控'] },
  '/admin/system/app': { title: '应用监控', icon: 'MonitorOutlined', breadcrumb: ['后台管理', '系统管理', '应用监控'] },
  '/admin/system/log': { title: '日志管理', icon: 'FileTextOutlined', breadcrumb: ['后台管理', '系统管理', '日志管理'] },
  '/admin/system/audit': { title: '审计追踪', icon: 'SafetyOutlined', breadcrumb: ['后台管理', '系统管理', '审计追踪'] },
  '/admin/system/config': { title: '系统配置', icon: 'SettingOutlined', breadcrumb: ['后台管理', '系统管理', '系统配置'] },
};
