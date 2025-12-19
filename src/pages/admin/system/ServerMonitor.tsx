/**
 * 服务器监控页面
 */

import React from 'react';
import { Card, Table, Progress, Tag, Button, Statistic, Row, Col, Space } from 'antd';
import { CloudServerOutlined, ReloadOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const ServerMonitor: React.FC = () => {
  const serverData = [
    { id: 1, name: '主服务器', ip: '192.168.1.100', cpu: 45, memory: 62, disk: 38, status: 'online', responseTime: 23 },
    { id: 2, name: '备用服务器', ip: '192.168.1.101', cpu: 32, memory: 48, disk: 55, status: 'online', responseTime: 18 },
    { id: 3, name: '数据库服务器', ip: '192.168.1.102', cpu: 78, memory: 85, disk: 72, status: 'warning', responseTime: 45 },
    { id: 4, name: '缓存服务器', ip: '192.168.1.103', cpu: 0, memory: 0, disk: 0, status: 'offline', responseTime: 0 },
  ];

  const columns: ColumnsType<typeof serverData[0]> = [
    { title: '服务器名称', dataIndex: 'name', key: 'name' },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    {
      title: 'CPU使用率', dataIndex: 'cpu', key: 'cpu',
      render: (val) => <Progress percent={val} size="small" status={val > 80 ? 'exception' : 'normal'} />,
    },
    {
      title: '内存使用率', dataIndex: 'memory', key: 'memory',
      render: (val) => <Progress percent={val} size="small" status={val > 80 ? 'exception' : 'normal'} />,
    },
    {
      title: '磁盘使用率', dataIndex: 'disk', key: 'disk',
      render: (val) => <Progress percent={val} size="small" status={val > 80 ? 'exception' : 'normal'} />,
    },
    { title: '响应时间', dataIndex: 'responseTime', key: 'responseTime', render: (val) => val > 0 ? `${val}ms` : '-' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status) => {
        const config: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          online: { color: 'success', text: '在线', icon: <CheckCircleOutlined /> },
          warning: { color: 'warning', text: '告警', icon: <WarningOutlined /> },
          offline: { color: 'error', text: '离线', icon: <CloseCircleOutlined /> },
        };
        const { color, text, icon } = config[status] || config.offline;
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
    },
    {
      title: '操作', key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small">重启</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="在线服务器" value={3} suffix="/ 4" valueStyle={{ color: '#52c41a' }} prefix={<CloudServerOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="平均CPU" value={38.75} suffix="%" valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="平均内存" value={48.75} suffix="%" valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="告警数" value={1} valueStyle={{ color: '#ff4d4f' }} prefix={<WarningOutlined />} /></Card>
        </Col>
      </Row>

      <Card title="服务器列表" extra={<Button icon={<ReloadOutlined />}>刷新</Button>}>
        <Table columns={columns} dataSource={serverData} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
};

export default ServerMonitor;
