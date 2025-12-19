/**
 * 视频审核管理页面
 */

import React from 'react';
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, Image, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

const VideoAudit: React.FC = () => {
  const auditData = [
    { id: 101, title: 'TypeScript 高级教程', cover: 'https://picsum.photos/160/90?random=11', author: '用户A', submitTime: '2024-12-19 10:30', duration: '35:20', aiResult: 'pass' },
    { id: 102, title: 'Python 数据分析', cover: 'https://picsum.photos/160/90?random=12', author: '用户B', submitTime: '2024-12-19 09:15', duration: '42:10', aiResult: 'warning' },
    { id: 103, title: 'Java Spring Boot', cover: 'https://picsum.photos/160/90?random=13', author: '用户C', submitTime: '2024-12-19 08:00', duration: '1:10:00', aiResult: 'pass' },
  ];

  const columns: ColumnsType<typeof auditData[0]> = [
    {
      title: '视频信息', key: 'info', width: 300,
      render: (_, record) => (
        <Space>
          <Image src={record.cover} width={100} height={56} style={{ borderRadius: 4 }} preview={false} />
          <div>
            <Text strong>{record.title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.author}</Text>
          </div>
        </Space>
      ),
    },
    { title: '时长', dataIndex: 'duration', key: 'duration' },
    { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime' },
    {
      title: 'AI预审', dataIndex: 'aiResult', key: 'aiResult',
      render: (result) => result === 'pass' ? <Tag color="success">通过</Tag> : <Tag color="warning">待人工复核</Tag>,
    },
    {
      title: '操作', key: 'action',
      render: () => (
        <Space>
          <Button type="primary" size="small">通过</Button>
          <Button size="small">驳回</Button>
          <Button type="link" size="small">预览</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="待审核" value={45} valueStyle={{ color: '#faad14' }} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日通过" value={23} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日驳回" value={5} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="AI预审通过率" value={89} suffix="%" /></Card></Col>
      </Row>

      <Card title="审核队列">
        <Table columns={columns} dataSource={auditData} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default VideoAudit;
