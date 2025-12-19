/**
 * 控制台页面
 */

import React from 'react';
import { Card, Row, Col, Statistic, List, Typography, Space, Tag, Button } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined, 
  PlayCircleOutlined, 
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  LikeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  // 模拟数据
  const statsData = [
    {
      title: '用户总数',
      value: 1328,
      precision: 0,
      valueStyle: { color: '#3f8600' },
      prefix: <ArrowUpOutlined />,
      suffix: '人',
    },
    {
      title: '文档总数',
      value: 1256,
      precision: 0,
      valueStyle: { color: '#1890ff' },
      prefix: <FileTextOutlined />,
      suffix: '篇',
    },
    {
      title: '视频总数',
      value: 892,
      precision: 0,
      valueStyle: { color: '#722ed1' },
      prefix: <PlayCircleOutlined />,
      suffix: '个',
    },
    {
      title: '积分总额',
      value: 156800,
      precision: 0,
      valueStyle: { color: '#faad14' },
      prefix: <TrophyOutlined />,
      suffix: '分',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: '编辑视频',
      target: 'React入门教程',
      user: '管理员',
      time: '10分钟前',
      type: 'video',
    },
    {
      id: 2,
      action: '新增文档',
      target: 'JavaScript异步编程详解',
      user: '编辑员',
      time: '30分钟前',
      type: 'document',
    },
    {
      id: 3,
      action: '用户注册',
      target: '新用户 user123',
      user: '系统',
      time: '1小时前',
      type: 'user',
    },
    {
      id: 4,
      action: '积分兑换',
      target: '用户兑换下载权限',
      user: 'user456',
      time: '2小时前',
      type: 'point',
    },
  ];

  const todoList = [
    {
      id: 1,
      title: '审核待发布视频',
      count: 5,
      priority: 'high',
      link: '/admin/video',
    },
    {
      id: 2,
      title: '处理用户反馈',
      count: 12,
      priority: 'medium',
      link: '/admin/feedback',
    },
    {
      id: 3,
      title: '更新系统公告',
      count: 1,
      priority: 'low',
      link: '/admin/system',
    },
  ];

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
      <Title level={2} style={{ marginBottom: '24px' }}>
        控制台
      </Title>

      {/* 数据统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statsData.map((stat, index) => (
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
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最近操作 */}
        <Col xs={24} lg={12}>
          <Card 
            title="最近操作" 
            extra={<Button type="link">查看全部</Button>}
            style={{ height: '400px' }}
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
            style={{ height: '400px' }}
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
  );
};

export default Dashboard;