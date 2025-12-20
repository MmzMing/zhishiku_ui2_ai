/**
 * 视频统计分析页面
 */

import React from 'react';
import { Card, Table, Statistic, Row, Col, Badge } from 'antd';
import { EyeOutlined, LikeOutlined, StarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import * as videoApi from '../../../api/admin/videoApi';

const VideoStats: React.FC = () => {
  const videoData = [
    { id: 1, title: 'React 18 新特性详解', views: 12580, likes: 856 },
    { id: 2, title: 'Node.js 微服务架构', views: 8920, likes: 623 },
    { id: 3, title: 'Vue 3 组合式API教程', views: 6540, likes: 412 },
    { id: 4, title: 'Docker 容器化部署', views: 4230, likes: 298 },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="总播放量" value={1256800} prefix={<EyeOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="总点赞数" value={89560} prefix={<LikeOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="总收藏数" value={45230} prefix={<StarOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="平均时长" value="32:45" prefix={<ClockCircleOutlined />} /></Card></Col>
      </Row>

      <Card title="热门视频排行">
        <Table
          dataSource={videoData.sort((a, b) => b.views - a.views)}
          columns={[
            { title: '排名', render: (_, __, i) => <Badge count={i + 1} style={{ backgroundColor: i < 3 ? '#ff4d4f' : '#999' }} /> },
            { title: '视频标题', dataIndex: 'title' },
            { title: '播放量', dataIndex: 'views', render: (v) => v.toLocaleString() },
            { title: '点赞数', dataIndex: 'likes', render: (v) => v.toLocaleString() },
          ]}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default VideoStats;
