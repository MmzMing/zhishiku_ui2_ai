/**
 * 积分排行榜页面
 */

import React, { useState } from 'react';
import { Card, Table, Avatar, Tag, Statistic, Row, Col, Select, DatePicker, Space, Typography, Tabs } from 'antd';
import { TrophyOutlined, CrownOutlined, UserOutlined, RiseOutlined, FireOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import * as pointApi from '../../../api/admin/pointApi';

const { Option } = Select;
const { Text } = Typography;

const PointRanking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('total');

  const rankingData = [
    { rank: 1, userId: 'U001', username: '张三', avatar: '', points: 12580, level: 'VIP3', trend: 'up', change: 350 },
    { rank: 2, userId: 'U002', username: '李四', avatar: '', points: 10890, level: 'VIP2', trend: 'up', change: 280 },
    { rank: 3, userId: 'U003', username: '王五', avatar: '', points: 9650, level: 'VIP2', trend: 'down', change: -50 },
    { rank: 4, userId: 'U004', username: '赵六', avatar: '', points: 8420, level: 'VIP1', trend: 'up', change: 120 },
    { rank: 5, userId: 'U005', username: '钱七', avatar: '', points: 7890, level: 'VIP1', trend: 'same', change: 0 },
    { rank: 6, userId: 'U006', username: '孙八', avatar: '', points: 6540, level: '普通', trend: 'up', change: 200 },
    { rank: 7, userId: 'U007', username: '周九', avatar: '', points: 5680, level: '普通', trend: 'down', change: -80 },
    { rank: 8, userId: 'U008', username: '吴十', avatar: '', points: 4920, level: '普通', trend: 'up', change: 150 },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <CrownOutlined style={{ color: '#faad14', fontSize: 20 }} />;
    if (rank === 2) return <CrownOutlined style={{ color: '#bfbfbf', fontSize: 18 }} />;
    if (rank === 3) return <CrownOutlined style={{ color: '#d48806', fontSize: 16 }} />;
    return <Text type="secondary">{rank}</Text>;
  };

  const columns: ColumnsType<typeof rankingData[0]> = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 80, align: 'center', render: (rank) => getRankIcon(rank) },
    { title: '用户', dataIndex: 'username', key: 'username', render: (name, record) => (
      <Space>
        <Avatar icon={<UserOutlined />} src={record.avatar} />
        <span>{name}</span>
      </Space>
    )},
    { title: '等级', dataIndex: 'level', key: 'level', render: (level) => {
      const colors: Record<string, string> = { 'VIP3': 'gold', 'VIP2': 'purple', 'VIP1': 'blue', '普通': 'default' };
      return <Tag color={colors[level] || 'default'}>{level}</Tag>;
    }},
    { title: '积分', dataIndex: 'points', key: 'points', render: (points) => <Text strong style={{ color: '#faad14' }}>{points.toLocaleString()}</Text> },
    { title: '变化', dataIndex: 'change', key: 'change', render: (change, record) => {
      if (record.trend === 'up') return <Text style={{ color: '#52c41a' }}>↑ +{change}</Text>;
      if (record.trend === 'down') return <Text style={{ color: '#ff4d4f' }}>↓ {change}</Text>;
      return <Text type="secondary">-</Text>;
    }},
  ];

  const tabItems = [
    { key: 'total', label: '总榜', icon: <TrophyOutlined /> },
    { key: 'month', label: '月榜', icon: <FireOutlined /> },
    { key: 'week', label: '周榜', icon: <RiseOutlined /> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="榜首积分" value={12580} prefix={<CrownOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="上榜用户" value={100} prefix={<UserOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="平均积分" value={5680} /></Card></Col>
        <Col span={6}><Card><Statistic title="本周新晋" value={12} prefix={<RiseOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems.map(item => ({ key: item.key, label: <span>{item.icon} {item.label}</span> }))} />
        <Space style={{ marginBottom: 16 }}>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部等级</Option>
            <Option value="vip3">VIP3</Option>
            <Option value="vip2">VIP2</Option>
            <Option value="vip1">VIP1</Option>
            <Option value="normal">普通</Option>
          </Select>
          {activeTab === 'month' && <DatePicker picker="month" placeholder="选择月份" />}
          {activeTab === 'week' && <DatePicker picker="week" placeholder="选择周" />}
        </Space>
        <Table columns={columns} dataSource={rankingData} rowKey="userId" pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 名用户` }} />
      </Card>
    </div>
  );
};

export default PointRanking;
