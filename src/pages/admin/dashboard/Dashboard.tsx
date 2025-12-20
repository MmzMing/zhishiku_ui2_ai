/**
 * 控制台页面
 */

import React, { useState } from 'react';
import { Card, Row, Col, Statistic, List, Typography, Space, Tag, Button, DatePicker } from 'antd';
import { Line, Pie } from '@ant-design/charts';
import { 
  UserOutlined, 
  FileTextOutlined, 
  PlayCircleOutlined, 
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  LikeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useDashboardData } from '../../../hooks/admin/useDashboardData';
import * as dashboardApi from '../../../api/admin/dashboardApi';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  // 日期范围状态
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [loading, setLoading] = useState(false);

  // 使用Dashboard数据Hook
  const {
    visitTrendData,
    categoryData,
    statsOverview,
    recentActivities,
    todoList,
    refreshData
  } = useDashboardData(dateRange[1].diff(dateRange[0], 'day'));

  // 手动刷新数据
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await Promise.all([
        dashboardApi.getVisitTrend(),
        dashboardApi.getCategoryStats(),
        dashboardApi.getStatsOverview(),
        dashboardApi.getRecentActivities(),
        dashboardApi.getTodoList()
      ]);
      refreshData();
    } catch (error) {
      console.error('刷新数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理日期范围变化
  const handleDateRangeChange = async (dates: any) => {
    if (dates) {
      setDateRange([dates[0]!, dates[1]!]);
      setLoading(true);
      try {
        // 根据新的日期范围重新获取数据
        await dashboardApi.getVisitTrend({
          startDate: dates[0].format('YYYY-MM-DD'),
          endDate: dates[1].format('YYYY-MM-DD')
        });
        refreshData();
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // 访问趋势图表配置
  const visitTrendConfig = {
    data: visitTrendData,
    xField: 'date',
    yField: 'visits',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    point: {
      size: 3,
      shape: 'circle',
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: '访问人数',
          value: `${datum.visits} 人`,
        };
      },
    },
    color: ['#1890ff'],
  };

  // 分类占比饼图配置
  const categoryPieConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'category',
    radius: 0.8,
    innerRadius: 0.4,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    legend: {
      position: 'bottom',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.category,
          value: `${datum.value} (${datum.percentage}%)`,
        };
      },
    },
  };

  // 统计卡片数据
  const getStatsCards = () => {
    if (!statsOverview) return [];
    
    return [
      {
        title: '用户总数',
        value: statsOverview.totalUsers,
        precision: 0,
        valueStyle: { color: '#3f8600' },
        prefix: <ArrowUpOutlined />,
        suffix: '人',
        growth: statsOverview.growthRate.users,
      },
      {
        title: '文档总数',
        value: statsOverview.totalDocuments,
        precision: 0,
        valueStyle: { color: '#1890ff' },
        prefix: <FileTextOutlined />,
        suffix: '篇',
        growth: statsOverview.growthRate.documents,
      },
      {
        title: '视频总数',
        value: statsOverview.totalVideos,
        precision: 0,
        valueStyle: { color: '#722ed1' },
        prefix: <PlayCircleOutlined />,
        suffix: '个',
        growth: statsOverview.growthRate.videos,
      },
      {
        title: '积分总额',
        value: statsOverview.totalPoints,
        precision: 0,
        valueStyle: { color: '#faad14' },
        prefix: <TrophyOutlined />,
        suffix: '分',
        growth: 0,
      },
    ];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircleOutlined style={{ color: '#722ed1' }} />;
      case 'document':
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'user':
        return <UserOutlined style={{ color: '#52c41a' }} />;
      case 'point':
        return <TrophyOutlined style={{ color: '#faad14' }} />;
      default:
        return <EyeOutlined />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>
          控制台
        </Title>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
          />
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading}
          >
            刷新
          </Button>
        </Space>
      </div>

      <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        {/* 数据统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          {getStatsCards().map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  precision={stat.precision}
                  valueStyle={stat.valueStyle}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
                {stat.growth !== undefined && (
                  <div style={{ marginTop: 8, fontSize: 12, color: stat.growth >= 0 ? '#52c41a' : '#ff4d4f' }}>
                    {stat.growth >= 0 ? '↗' : '↘'} {Math.abs(stat.growth)}% 较上期
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>

        {/* 图表区域 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          {/* 访问趋势折线图 */}
          <Col xs={24} lg={16}>
            <Card 
              title="访问趋势" 
              extra={<Button type="link">查看详情</Button>}
              bodyStyle={{ padding: '20px', height: '360px' }}
            >
              {visitTrendData.length > 0 ? (
                <Line {...visitTrendConfig} height={320} />
              ) : (
                <div style={{ 
                  height: 320, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#999'
                }}>
                  暂无数据
                </div>
              )}
            </Card>
          </Col>

          {/* 观看分类占比饼图 */}
          <Col xs={24} lg={8}>
            <Card 
              title="观看分类占比" 
              extra={<Button type="link">查看详情</Button>}
              bodyStyle={{ padding: '20px', height: '360px' }}
            >
              {categoryData.length > 0 ? (
                <Pie {...categoryPieConfig} height={320} />
              ) : (
                <div style={{ 
                  height: 320, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#999'
                }}>
                  暂无数据
                </div>
              )}
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* 最近操作 */}
          <Col xs={24} lg={12}>
            <Card 
              title="最近操作" 
              extra={<Button type="link">查看全部</Button>}
              bodyStyle={{ padding: '20px', height: '360px', overflow: 'auto' }}
            >
              <List
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getTypeIcon(item.type)}
                      title={
                        <Space>
                          <Text strong>{item.action}</Text>
                          <Text type="secondary">{item.target}</Text>
                        </Space>
                      }
                      description={
                        <Space>
                          <Text type="secondary">操作人: {item.user}</Text>
                          <Text type="secondary">{item.time}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* 待办事项 */}
          <Col xs={24} lg={12}>
            <Card 
              title="待办事项" 
              extra={<Button type="link">查看全部</Button>}
              bodyStyle={{ padding: '20px', height: '360px', overflow: 'auto' }}
            >
              <List
                dataSource={todoList}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="link" href={item.link}>
                        处理
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{item.title}</Text>
                          <Tag color={getPriorityColor(item.priority)}>
                            {item.priority === 'high' ? '高' : 
                             item.priority === 'medium' ? '中' : '低'}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Text type="secondary">
                          待处理数量: {item.count}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;