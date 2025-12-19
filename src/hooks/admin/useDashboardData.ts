/**
 * Dashboard数据Hook - 提供模拟数据用于开发测试
 */

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { 
  VisitTrendData, 
  CategoryData, 
  StatsOverview, 
  RecentActivity, 
  TodoItem 
} from '../../api/admin/dashboardApi';

// 生成模拟的访问趋势数据
const generateVisitTrendData = (days: number): VisitTrendData[] => {
  const data: VisitTrendData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    const baseVisits = 800 + Math.random() * 400;
    data.push({
      date,
      visits: Math.floor(baseVisits + Math.sin(i / 7) * 200), // 添加周期性波动
      users: Math.floor(baseVisits * 0.7 + Math.random() * 100),
      pageViews: Math.floor(baseVisits * 2.5 + Math.random() * 300),
    });
  }
  return data;
};

// 生成模拟的分类数据
const generateCategoryData = (): CategoryData[] => {
  return [
    { category: '前端开发', value: 1256, percentage: 35.2 },
    { category: '后端开发', value: 892, percentage: 25.0 },
    { category: '移动开发', value: 634, percentage: 17.8 },
    { category: '数据科学', value: 445, percentage: 12.5 },
    { category: '人工智能', value: 223, percentage: 6.3 },
    { category: '其他', value: 120, percentage: 3.2 },
  ];
};

// 生成模拟的统计概览数据
const generateStatsOverview = (): StatsOverview => {
  return {
    totalUsers: 1328,
    totalDocuments: 1256,
    totalVideos: 892,
    totalPoints: 156800,
    todayVisits: 234,
    todayUsers: 89,
    growthRate: {
      users: 12.5,
      documents: 8.3,
      videos: 15.7,
      visits: 6.2,
    },
  };
};

// 生成模拟的最近活动数据
const generateRecentActivities = (): RecentActivity[] => {
  const actions = [
    { action: '编辑视频', target: 'React入门教程', type: 'video' as const },
    { action: '新增文档', target: 'JavaScript异步编程详解', type: 'document' as const },
    { action: '用户注册', target: '新用户 user123', type: 'user' as const },
    { action: '积分兑换', target: '用户兑换下载权限', type: 'point' as const },
    { action: '发布视频', target: 'Vue3组件开发实战', type: 'video' as const },
    { action: '更新文档', target: 'TypeScript高级类型', type: 'document' as const },
    { action: '用户登录', target: '用户 admin', type: 'user' as const },
    { action: '积分获得', target: '完成每日任务', type: 'point' as const },
  ];

  const users = ['管理员', '编辑员', '系统', 'user456', 'admin', 'editor01'];
  const times = ['10分钟前', '30分钟前', '1小时前', '2小时前', '3小时前', '5小时前', '1天前', '2天前'];

  return actions.map((item, index) => ({
    id: `activity_${index}`,
    action: item.action,
    target: item.target,
    user: users[index % users.length],
    time: times[index % times.length],
    type: item.type,
  }));
};

// 生成模拟的待办事项数据
const generateTodoList = (): TodoItem[] => {
  return [
    {
      id: 'todo_1',
      title: '审核待发布视频',
      count: 5,
      priority: 'high',
      link: '/admin/video/audit',
    },
    {
      id: 'todo_2',
      title: '处理用户反馈',
      count: 12,
      priority: 'medium',
      link: '/admin/feedback',
    },
    {
      id: 'todo_3',
      title: '更新系统公告',
      count: 1,
      priority: 'low',
      link: '/admin/system/config',
    },
    {
      id: 'todo_4',
      title: '审核新注册用户',
      count: 8,
      priority: 'medium',
      link: '/admin/user/list',
    },
  ];
};

export const useDashboardData = (days: number = 30) => {
  const [loading, setLoading] = useState(false);
  const [visitTrendData, setVisitTrendData] = useState<VisitTrendData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [statsOverview, setStatsOverview] = useState<StatsOverview | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [todoList, setTodoList] = useState<TodoItem[]>([]);

  const loadData = async () => {
    setLoading(true);
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      setVisitTrendData(generateVisitTrendData(days));
      setCategoryData(generateCategoryData());
      setStatsOverview(generateStatsOverview());
      setRecentActivities(generateRecentActivities());
      setTodoList(generateTodoList());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [days]);

  return {
    loading,
    visitTrendData,
    categoryData,
    statsOverview,
    recentActivities,
    todoList,
    refreshData: loadData,
  };
};