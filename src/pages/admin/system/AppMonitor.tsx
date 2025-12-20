/**
 * 应用监控页面 - 增强版
 */

import React, { useState } from 'react';
import { 
  Card, Statistic, Row, Col, Table, Tag, Space, Button, Switch, 
  Progress, Badge, Avatar, Tooltip, Typography, Drawer, Timeline
} from 'antd';
import { 
  ApiOutlined, BugOutlined, UserOutlined, DesktopOutlined, 
  MobileOutlined, TabletOutlined, CheckCircleOutlined, 
  ExclamationCircleOutlined, CloseCircleOutlined, EyeOutlined,
  ReloadOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import * as monitorApi from '../../../api/admin/monitorApi';

const { Text } = Typography;

// 使用 API 中定义的类型
type ApiMonitorItem = monitorApi.ApiMonitorItem;
type ErrorTraceItem = monitorApi.ErrorTraceItem;
type UserSession = monitorApi.UserSession;

const AppMonitor: React.FC = () => {
  const [sessionDrawerVisible, setSessionDrawerVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);

  // Core Web Vitals 数据
  const webVitals = {
    fp: { value: 800, unit: 'ms', threshold: 1000, status: 'good' as const },
    fcp: { value: 1200, unit: 'ms', threshold: 1800, status: 'good' as const },
    lcp: { value: 2500, unit: 'ms', threshold: 2500, status: 'warning' as const },
    cls: { value: 0.08, unit: '', threshold: 0.1, status: 'good' as const },
  };

  // 错误追踪数据
  const [errorList] = useState<ErrorTraceItem[]>([
    { id: 1, errorType: 'TypeError', message: 'Cannot read properties of undefined (reading \'id\')', source: '/Components/VideoCard.tsx', lineNo: 45, colNo: 12, url: '/video/list', count: 15, firstOccur: '2024-01-15 10:00:00', lastOccur: '2024-01-15 14:30:00', status: 'open' },
    { id: 2, errorType: 'NetworkError', message: 'Failed to fetch /api/users', source: '/api/userApi.ts', url: '/admin/users', count: 8, firstOccur: '2024-01-15 09:20:00', lastOccur: '2024-01-15 12:50:00', status: 'open' },
    { id: 3, errorType: 'ChunkLoadError', message: 'Loading chunk 7 failed', source: 'webpack/bootstrap', url: '/dashboard', count: 3, firstOccur: '2024-01-14 16:00:00', lastOccur: '2024-01-15 14:20:00', status: 'ignored' },
  ]);

  // API监控数据
  const [apiList] = useState<ApiMonitorItem[]>([
    { id: 1, endpoint: '/api/users', method: 'GET', status: 'healthy', callCount: 1520, avgResponseTime: 85, successRate: 99.8 },
    { id: 2, endpoint: '/api/videos', method: 'GET', status: 'healthy', callCount: 890, avgResponseTime: 120, successRate: 99.5 },
    { id: 3, endpoint: '/api/blogs', method: 'POST', status: 'warning', callCount: 36, avgResponseTime: 350, successRate: 98.2 },
    { id: 4, endpoint: '/api/upload', method: 'POST', status: 'error', callCount: 25, avgResponseTime: 1500, successRate: 88.6 },
    { id: 5, endpoint: '/api/auth/login', method: 'POST', status: 'healthy', callCount: 256, avgResponseTime: 85, successRate: 100 },
  ]);

  // 用户会话数据
  const [sessionList] = useState<UserSession[]>([
    { id: 1, sessionId: 'sess_abc123', userId: 1, username: '张三', device: 'Desktop', browser: 'Chrome', startTime: '2024-01-15 09:00:00', duration: '5h 30m', durationMs: 19800000, pageViews: 45, apiCalls: 120, errorCount: 0, status: 'active' },
    { id: 2, sessionId: 'sess_def456', userId: 2, username: '李四', device: 'Mobile', browser: 'Safari', startTime: '2024-01-15 10:30:00', duration: '2h 15m', durationMs: 8100000, pageViews: 28, apiCalls: 65, errorCount: 1, status: 'active' },
    { id: 3, sessionId: 'sess_ghi789', userId: 3, username: '王五', device: 'Tablet', browser: 'Firefox', startTime: '2024-01-15 08:00:00', duration: '1h 45m', durationMs: 6300000, pageViews: 15, apiCalls: 35, errorCount: 0, status: 'active' },
  ]);

  // 处理错误状态
  const handleErrorStatus = async (error: ErrorTraceItem, status: 'resolved' | 'ignored') => {
    try {
      await monitorApi.updateErrorStatus(error.id, status);
    } catch {
      // 模拟成功
    }
  };

  // 查看会话详情
  const viewSessionDetail = (session: UserSession) => {
    setSelectedSession(session);
    setSessionDrawerVisible(true);
  };

  // 渲染 Web Vitals 卡片
  const renderVitalCard = (
    title: string, 
    label: string, 
    data: { value: number; unit: string; threshold: number; status: 'good' | 'warning' | 'poor' }
  ) => {
    const statusColor = data.status === 'good' ? '#52c41a' : data.status === 'warning' ? '#faad14' : '#ff4d4f';
    const statusText = data.status === 'good' ? '良好' : data.status === 'warning' ? '需优化' : '较差';
    
    return (
      <Card size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>{title}</Text>
          <Tag color={statusColor} style={{ margin: 0 }}>{statusText}</Tag>
        </div>
        <div style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>
          {data.value}{data.unit}
        </div>
        <div style={{ fontSize: 12, color: '#999' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>阈值: {data.threshold}{data.unit}</div>
      </Card>
    );
  };

  // 错误列表列定义
  const errorColumns: ColumnsType<ErrorTraceItem> = [
    {
      title: '错误信息', key: 'error', width: 400,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Tag color={record.errorType === 'TypeError' ? 'red' : record.errorType === 'NetworkError' ? 'orange' : 'gold'}>
              {record.errorType}
            </Tag>
            <Text strong style={{ marginLeft: 8 }}>{record.message}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.source && `${record.source}`}
            {record.lineNo && `:${record.lineNo}`}
            {record.colNo && `:${record.colNo}`}
          </Text>
        </div>
      ),
    },
    {
      title: '次数', dataIndex: 'count', key: 'count', width: 80,
      render: (count) => <Text style={{ color: count > 10 ? '#ff4d4f' : '#666' }}>{count}</Text>,
    },
    { title: '最后发生', dataIndex: 'lastOccur', key: 'lastOccur', width: 160 },
    {
      title: '操作', key: 'action', width: 180,
      render: (_, record) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => handleErrorStatus(record, 'resolved')}>已解决</Button>
          <Button type="link" size="small" onClick={() => handleErrorStatus(record, 'ignored')}>忽略</Button>
          <Button type="link" size="small">详情</Button>
        </Space>
      ),
    },
  ];

  // API监控列定义
  const apiColumns: ColumnsType<ApiMonitorItem> = [
    {
      title: '接口', key: 'endpoint', width: 200,
      render: (_, record) => (
        <Space>
          <Tag color={record.method === 'GET' ? 'blue' : record.method === 'POST' ? 'green' : 'orange'}>
            {record.method}
          </Tag>
          <Text code style={{ fontSize: 12 }}>{record.endpoint}</Text>
        </Space>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (status) => {
        const config = {
          healthy: { color: 'success', icon: <CheckCircleOutlined /> },
          warning: { color: 'warning', icon: <ExclamationCircleOutlined /> },
          error: { color: 'error', icon: <CloseCircleOutlined /> },
        };
        const c = config[status as keyof typeof config];
        return <Badge status={c.color as any} />;
      },
    },
    { title: '调用次数', dataIndex: 'callCount', key: 'callCount', width: 100 },
    {
      title: '平均响应', dataIndex: 'avgResponseTime', key: 'avgResponseTime', width: 100,
      render: (time) => (
        <Text style={{ color: time > 500 ? '#ff4d4f' : time > 200 ? '#faad14' : '#52c41a' }}>
          {time}ms
        </Text>
      ),
    },
    {
      title: '成功率', dataIndex: 'successRate', key: 'successRate', width: 120,
      render: (rate) => (
        <Progress 
          percent={rate} 
          size="small" 
          strokeColor={rate >= 99 ? '#52c41a' : rate >= 95 ? '#faad14' : '#ff4d4f'}
          format={(p) => `${p}%`}
        />
      ),
    },
    {
      title: '监控', key: 'monitor', width: 80,
      render: () => <Switch size="small" defaultChecked />,
    },
  ];

  // 会话列表列定义
  const sessionColumns: ColumnsType<UserSession> = [
    { title: '会话ID', dataIndex: 'sessionId', key: 'sessionId', width: 120, render: (id) => <Text code style={{ fontSize: 11 }}>{id}</Text> },
    {
      title: '用户', key: 'user', width: 100,
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{record.username || '匿名'}</span>
        </Space>
      ),
    },
    {
      title: '设备', dataIndex: 'device', key: 'device', width: 80,
      render: (device) => {
        const icons = { Desktop: <DesktopOutlined />, Mobile: <MobileOutlined />, Tablet: <TabletOutlined /> };
        return <Tooltip title={device}>{icons[device as keyof typeof icons]}</Tooltip>;
      },
    },
    { title: '浏览器', dataIndex: 'browser', key: 'browser', width: 80 },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 150 },
    { title: '时长', dataIndex: 'duration', key: 'duration', width: 80 },
    { title: '页面浏览', dataIndex: 'pageViews', key: 'pageViews', width: 80 },
    { title: '请求数', dataIndex: 'apiCalls', key: 'apiCalls', width: 80 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (status) => (
        <Badge status={status === 'active' ? 'processing' : 'default'} text={status === 'active' ? '在线' : '离线'} />
      ),
    },
    {
      title: '操作', key: 'action', width: 100,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => viewSessionDetail(record)}>详情</Button>
          <Button type="link" size="small" danger>结束</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Core Web Vitals */}
      <Card 
        title={<><ClockCircleOutlined /> 前端性能监控 (Core Web Vitals)</>} 
        size="small" 
        style={{ marginBottom: 16 }}
        extra={<Button size="small" icon={<ReloadOutlined />}>刷新</Button>}
      >
        <Row gutter={16}>
          <Col span={6}>{renderVitalCard('FP', 'First Paint 首次绘制', webVitals.fp)}</Col>
          <Col span={6}>{renderVitalCard('FCP', 'First Contentful Paint', webVitals.fcp)}</Col>
          <Col span={6}>{renderVitalCard('LCP', 'Largest Contentful Paint', webVitals.lcp)}</Col>
          <Col span={6}>{renderVitalCard('CLS', 'Cumulative Layout Shift', webVitals.cls)}</Col>
        </Row>
      </Card>

      <Row gutter={16}>
        {/* 错误追踪 */}
        <Col span={12}>
          <Card 
            title={<><BugOutlined /> 错误追踪 (Sentry)</>} 
            size="small"
            extra={<Button type="primary" size="small">查看全部</Button>}
            bodyStyle={{ padding: 0 }}
          >
            <Table 
              columns={errorColumns} 
              dataSource={errorList} 
              rowKey="id" 
              size="small"
              pagination={false}
              scroll={{ y: 240 }}
            />
          </Card>
        </Col>

        {/* API监控 */}
        <Col span={12}>
          <Card 
            title={<><ApiOutlined /> API接口监控</>} 
            size="small"
            bodyStyle={{ padding: 0 }}
          >
            <Table 
              columns={apiColumns} 
              dataSource={apiList} 
              rowKey="id" 
              size="small"
              pagination={false}
              scroll={{ y: 240 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 用户会话跟踪 */}
      <Card 
        title={<><UserOutlined /> 用户会话跟踪</>} 
        size="small" 
        style={{ marginTop: 16 }}
        extra={
          <Space>
            <Text type="secondary">当前在线: <Text strong style={{ color: '#1890ff' }}>{sessionList.filter(s => s.status === 'active').length}</Text></Text>
            <Button size="small" icon={<ReloadOutlined />}>刷新</Button>
          </Space>
        }
      >
        <Table 
          columns={sessionColumns} 
          dataSource={sessionList} 
          rowKey="id" 
          size="small"
          pagination={{ pageSize: 5, showTotal: (t) => `共 ${t} 条` }}
        />
      </Card>

      {/* 会话详情抽屉 */}
      <Drawer
        title={`会话详情 - ${selectedSession?.sessionId || ''}`}
        open={sessionDrawerVisible}
        onClose={() => setSessionDrawerVisible(false)}
        width={450}
      >
        {selectedSession && (
          <>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={12}><Text type="secondary">用户:</Text> {selectedSession.username || '匿名'}</Col>
                <Col span={12}><Text type="secondary">设备:</Text> {selectedSession.device}</Col>
                <Col span={12}><Text type="secondary">浏览器:</Text> {selectedSession.browser}</Col>
                <Col span={12}><Text type="secondary">时长:</Text> {selectedSession.duration}</Col>
                <Col span={12}><Text type="secondary">页面浏览:</Text> {selectedSession.pageViews}</Col>
                <Col span={12}><Text type="secondary">API请求:</Text> {selectedSession.apiCalls}</Col>
              </Row>
            </Card>
            <Card title="活动轨迹" size="small">
              <Timeline
                items={[
                  { color: 'green', children: <><Text type="secondary">09:00:00</Text> 进入首页</> },
                  { color: 'blue', children: <><Text type="secondary">09:02:15</Text> 浏览视频列表</> },
                  { color: 'blue', children: <><Text type="secondary">09:05:30</Text> 播放视频 #123</> },
                  { color: 'blue', children: <><Text type="secondary">09:15:00</Text> 发表评论</> },
                  { color: 'green', children: <><Text type="secondary">09:20:00</Text> 进入个人中心</> },
                ]}
              />
            </Card>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default AppMonitor;
