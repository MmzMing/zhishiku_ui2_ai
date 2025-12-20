/**
 * 内容统计分析页面
 */

import React from 'react';
import { Card, Statistic, Row, Col, Table, Tag, Progress, Select, DatePicker, Space, Typography } from 'antd';
import { FileTextOutlined, EyeOutlined, DownloadOutlined, RiseOutlined, UserOutlined, LikeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import * as contentApi from '../../../api/admin/contentApi';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const ContentStats: React.FC = () => {
  const topContentData = [
    { rank: 1, title: 'MySQL索引优化技巧', views: 2100, downloads: 156, likes: 89, category: '数据库' },
    { rank: 2, title: 'React 18新特性详解', views: 1250, downloads: 89, likes: 67, category: '前端开发' },
    { rank: 3, title: 'TypeScript高级类型指南', views: 980, downloads: 56, likes: 45, category: '前端开发' },
    { rank: 4, title: 'Docker容器化部署指南', views: 850, downloads: 78, likes: 52, category: '运维' },
    { rank: 5, title: 'Redis缓存实战', views: 720, downloads: 45, likes: 38, category: '数据库' },
  ];

  const categoryStatsData = [
    { category: '前端开发', count: 156, views: 45600, downloads: 2890, percent: 35 },
    { category: '后端开发', count: 98, views: 32100, downloads: 1560, percent: 22 },
    { category: '数据库', count: 67, views: 28900, downloads: 1890, percent: 15 },
    { category: '运维', count: 45, views: 15600, downloads: 980, percent: 10 },
    { category: '其他', count: 80, views: 12800, downloads: 680, percent: 18 },
  ];

  const topColumns: ColumnsType<typeof topContentData[0]> = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60, render: (rank) => <Text strong style={{ color: rank <= 3 ? '#faad14' : undefined }}>{rank}</Text> },
    { title: '文档标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '分类', dataIndex: 'category', key: 'category', render: (cat) => <Tag>{cat}</Tag> },
    { title: '浏览量', dataIndex: 'views', key: 'views', render: (v) => <span><EyeOutlined /> {v}</span> },
    { title: '下载量', dataIndex: 'downloads', key: 'downloads', render: (d) => <span><DownloadOutlined /> {d}</span> },
    { title: '点赞数', dataIndex: 'likes', key: 'likes', render: (l) => <span><LikeOutlined /> {l}</span> },
  ];

  const categoryColumns: ColumnsType<typeof categoryStatsData[0]> = [
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '文档数', dataIndex: 'count', key: 'count' },
    { title: '浏览量', dataIndex: 'views', key: 'views', render: (v) => v.toLocaleString() },
    { title: '下载量', dataIndex: 'downloads', key: 'downloads', render: (d) => d.toLocaleString() },
    { title: '占比', dataIndex: 'percent', key: 'percent', render: (p) => <Progress percent={p} size="small" /> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}><Card><Statistic title="文档总数" value={446} prefix={<FileTextOutlined />} /></Card></Col>
        <Col span={4}><Card><Statistic title="总浏览量" value={135000} prefix={<EyeOutlined />} /></Card></Col>
        <Col span={4}><Card><Statistic title="总下载量" value={8000} prefix={<DownloadOutlined />} /></Card></Col>
        <Col span={4}><Card><Statistic title="今日新增" value={12} prefix={<RiseOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={4}><Card><Statistic title="活跃作者" value={86} prefix={<UserOutlined />} /></Card></Col>
        <Col span={4}><Card><Statistic title="总点赞数" value={5680} prefix={<LikeOutlined />} /></Card></Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="热门文档TOP5" extra={
            <Space>
              <Select defaultValue="views" size="small" style={{ width: 100 }}>
                <Option value="views">按浏览</Option>
                <Option value="downloads">按下载</Option>
                <Option value="likes">按点赞</Option>
              </Select>
            </Space>
          }>
            <Table columns={topColumns} dataSource={topContentData} rowKey="rank" pagination={false} size="small" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分类统计">
            <Table columns={categoryColumns} dataSource={categoryStatsData} rowKey="category" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>

      <Card title="趋势分析" extra={
        <Space>
          <RangePicker size="small" />
          <Select defaultValue="7d" size="small" style={{ width: 100 }}>
            <Option value="7d">近7天</Option>
            <Option value="30d">近30天</Option>
            <Option value="90d">近90天</Option>
          </Select>
        </Space>
      }>
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
          <Text type="secondary">趋势图表区域 (可集成 ECharts 或 Ant Design Charts)</Text>
        </div>
      </Card>
    </div>
  );
};

export default ContentStats;
