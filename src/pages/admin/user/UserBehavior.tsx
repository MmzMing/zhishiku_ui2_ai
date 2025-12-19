/**
 * 用户行为分析页面
 */

import React from 'react';
import { Card, Table, Tag, Button, Space, Statistic, Row, Col, Input, Select } from 'antd';
import { BarChartOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

const UserBehavior: React.FC = () => {
  const behaviorData = [
    { id: 1, user: 'admin', action: '登录系统', ip: '192.168.1.100', time: '2024-12-19 14:30:00', result: '成功' },
    { id: 2, user: 'editor', action: '编辑文档', ip: '192.168.1.101', time: '2024-12-19 14:25:00', result: '成功', target: 'doc_123' },
    { id: 3, user: 'user001', action: '上传视频', ip: '192.168.1.102', time: '2024-12-19 14:20:00', result: '成功', target: 'video_456' },
    { id: 4, user: 'admin', action: '修改用户权限', ip: '192.168.1.100', time: '2024-12-19 14:15:00', result: '成功', target: 'user_002' },
    { id: 5, user: 'unknown', action: '登录系统', ip: '192.168.1.200', time: '2024-12-19 14:10:00', result: '失败', remark: '密码错误' },
  ];

  const columns: ColumnsType<typeof behaviorData[0]> = [
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '操作', dataIndex: 'action', key: 'action' },
    { title: '操作对象', dataIndex: 'target', key: 'target', render: (t) => t || '-' },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '结果', dataIndex: 'result', key: 'result', render: (result) => result === '成功' ? <Tag color="success">成功</Tag> : <Tag color="error">失败</Tag> },
    { title: '备注', dataIndex: 'remark', key: 'remark', render: (r) => r || '-' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="今日操作" value={2580} prefix={<BarChartOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="活跃用户" value={156} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="异常操作" value={5} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="登录失败" value={12} valueStyle={{ color: '#faad14' }} /></Card></Col>
      </Row>

      <Card title="操作日志">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search placeholder="搜索用户" style={{ width: 150 }} />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部操作</Option>
            <Option value="login">登录</Option>
            <Option value="edit">编辑</Option>
            <Option value="delete">删除</Option>
          </Select>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部结果</Option>
            <Option value="success">成功</Option>
            <Option value="fail">失败</Option>
          </Select>
          <Button icon={<SearchOutlined />} type="primary">查询</Button>
        </Space>
        <Table columns={columns} dataSource={behaviorData} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default UserBehavior;
