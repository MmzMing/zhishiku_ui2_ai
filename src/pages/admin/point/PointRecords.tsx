/**
 * 积分流水记录页面
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, DatePicker, Select, Input, Typography } from 'antd';
import { HistoryOutlined, SearchOutlined, ExportOutlined, ArrowUpOutlined, ArrowDownOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const PointRecords: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const recordData = [
    { id: 1, userId: 'U001', username: '张三', type: 'earn', action: '每日签到', points: 10, balance: 1250, time: '2024-01-15 09:30:00', remark: '签到奖励' },
    { id: 2, userId: 'U002', username: '李四', type: 'earn', action: '上传文档', points: 50, balance: 890, time: '2024-01-15 10:15:00', remark: '文档审核通过' },
    { id: 3, userId: 'U001', username: '张三', type: 'spend', action: '下载文档', points: -10, balance: 1240, time: '2024-01-15 11:00:00', remark: '下载《React教程》' },
    { id: 4, userId: 'U003', username: '王五', type: 'earn', action: '上传视频', points: 100, balance: 2100, time: '2024-01-15 14:20:00', remark: '视频审核通过' },
    { id: 5, userId: 'U002', username: '李四', type: 'spend', action: '观看付费视频', points: -20, balance: 870, time: '2024-01-15 15:45:00', remark: '观看《Vue3实战》' },
    { id: 6, userId: 'U004', username: '赵六', type: 'earn', action: '评论互动', points: 5, balance: 455, time: '2024-01-15 16:30:00', remark: '发表评论' },
  ];

  const columns: ColumnsType<typeof recordData[0]> = [
    { title: '流水号', dataIndex: 'id', key: 'id', render: (id) => `#${String(id).padStart(6, '0')}` },
    { title: '用户ID', dataIndex: 'userId', key: 'userId' },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type) => type === 'earn' ? <Tag color="success" icon={<ArrowUpOutlined />}>获取</Tag> : <Tag color="error" icon={<ArrowDownOutlined />}>消耗</Tag> },
    { title: '行为', dataIndex: 'action', key: 'action' },
    { title: '积分变动', dataIndex: 'points', key: 'points', render: (points) => <Text strong style={{ color: points > 0 ? '#52c41a' : '#ff4d4f' }}>{points > 0 ? `+${points}` : points}</Text> },
    { title: '余额', dataIndex: 'balance', key: 'balance' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="今日获取总量" value={3250} prefix={<ArrowUpOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日消耗总量" value={1580} prefix={<ArrowDownOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日交易笔数" value={486} prefix={<HistoryOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="活跃用户数" value={128} /></Card></Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <RangePicker placeholder={['开始日期', '结束日期']} />
          <Select placeholder="交易类型" style={{ width: 120 }} allowClear>
            <Option value="earn">获取</Option>
            <Option value="spend">消耗</Option>
          </Select>
          <Select placeholder="行为类型" style={{ width: 140 }} allowClear>
            <Option value="signin">每日签到</Option>
            <Option value="upload_doc">上传文档</Option>
            <Option value="upload_video">上传视频</Option>
            <Option value="download">下载文档</Option>
            <Option value="watch">观看视频</Option>
          </Select>
          <Input placeholder="用户名/用户ID" style={{ width: 150 }} />
          <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>刷新</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
        <Table columns={columns} dataSource={recordData} rowKey="id" loading={loading} pagination={{ total: 486, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条记录` }} />
      </Card>
    </div>
  );
};

export default PointRecords;
