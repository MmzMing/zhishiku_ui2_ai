/**
 * 用户行为分析页面 - 增强版
 */

import React, { useState } from 'react';
import { 
  Card, Table, Tag, Button, Space, Statistic, Row, Col, Input, Select, 
  Tabs, Avatar, Badge, Tooltip, Progress, Modal, message, Popconfirm, List
} from 'antd';
import { 
  BarChartOutlined, SearchOutlined, WarningOutlined, UserOutlined,
  ExclamationCircleOutlined, CheckCircleOutlined, ClockCircleOutlined,
  RiseOutlined, FallOutlined, MinusOutlined, ExportOutlined,
  SafetyOutlined, StopOutlined, ReloadOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import * as userApi from '../../../api/admin/userApi';

const { Option } = Select;

// 使用 API 中定义的类型
type OperationLog = userApi.OperationLog;
type AbnormalBehavior = userApi.AbnormalBehavior;
type LoginRankItem = userApi.LoginRankItem;

const UserBehavior: React.FC = () => {
  const [activeTab, setActiveTab] = useState('logs');
  const [rankPeriod, setRankPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [abnormalDetailVisible, setAbnormalDetailVisible] = useState(false);
  const [selectedAbnormal, setSelectedAbnormal] = useState<AbnormalBehavior | null>(null);
  const [detecting, setDetecting] = useState(false);

  // 模拟操作日志数据
  const [operationLogs] = useState<OperationLog[]>([
    { id: 1, userId: 1, username: '张三', avatar: '', action: '系统登录', actionType: 'login', ip: '192.168.1.100', location: '北京', time: '2024-01-15 14:30:00', result: 'success' },
    { id: 2, userId: 2, username: '李四', avatar: '', action: '编辑: Vue3入门教程', actionType: 'edit', target: 'doc_123', ip: '192.168.1.101', location: '上海', time: '2024-01-15 14:25:00', result: 'success' },
    { id: 3, userId: 3, username: '王五', avatar: '', action: '转存: TypeScript最佳实践', actionType: 'download', target: 'video_456', ip: '192.168.1.102', location: '广州', time: '2024-01-15 14:15:00', result: 'success' },
    { id: 4, userId: 4, username: '赵六', avatar: '', action: '评论: AI2345', actionType: 'other', target: 'comment_789', ip: '192.168.1.103', location: '深圳', time: '2024-01-15 14:10:00', result: 'success' },
    { id: 5, userId: 5, username: '钱七', avatar: '', action: '系统登录', actionType: 'login', ip: '45.32.12.89', location: '美国', time: '2024-01-15 14:10:00', result: 'success' },
  ]);

  // 模拟异常行为数据
  const [abnormalBehaviors] = useState<AbnormalBehavior[]>([
    { id: 1, userId: 101, username: '可疑用户A', behaviorType: 'frequent_login_fail', riskLevel: 'high', description: '频繁登录失败', detail: '1小时内登录失败次数: 23次', ip: '45.32.12.89', location: '境外IP', time: '2024-01-15 14:30', status: 'pending' },
    { id: 2, userId: 102, username: '异常用户B', behaviorType: 'unusual_location', riskLevel: 'medium', description: '异地登录', detail: '从异常地点登录，与常用地点相距1500km', ip: '103.235.46.5', location: '越南', time: '2024-01-15 13:20', status: 'pending' },
    { id: 3, userId: 103, username: '用户C', behaviorType: 'suspicious_operation', riskLevel: 'low', description: '批量下载', detail: '短时间内下载文件数量: 156个', ip: '192.168.1.150', location: '北京', time: '2024-01-15 12:00', status: 'resolved', handler: 'admin', handleTime: '2024-01-15 12:30' },
  ]);

  // 模拟登录排行榜数据
  const [loginRanking] = useState<LoginRankItem[]>([
    { rank: 1, userId: 1, username: '技术达人', avatar: '', loginCount: 156, lastLoginTime: '2024-01-15 14:30', lastLoginIp: '192.168.1.100', lastLoginLocation: '北京', trend: 'up', trendValue: 12 },
    { rank: 2, userId: 2, username: '知识分享者', avatar: '', loginCount: 89, lastLoginTime: '2024-01-15 13:20', lastLoginIp: '192.168.1.101', lastLoginLocation: '上海', trend: 'same' },
    { rank: 3, userId: 3, username: '学习先锋', avatar: '', loginCount: 67, lastLoginTime: '2024-01-15 12:00', lastLoginIp: '192.168.1.102', lastLoginLocation: '广州', trend: 'down', trendValue: 5 },
    { rank: 4, userId: 4, username: '资深用户', avatar: '', loginCount: 45, lastLoginTime: '2024-01-15 11:30', lastLoginIp: '192.168.1.103', lastLoginLocation: '深圳', trend: 'up', trendValue: 3 },
    { rank: 5, userId: 5, username: '热爱学习', avatar: '', loginCount: 34, lastLoginTime: '2024-01-15 10:00', lastLoginIp: '192.168.1.104', lastLoginLocation: '杭州', trend: 'down', trendValue: 2 },
  ]);

  // 活跃度数据
  const activityData = [
    { label: '上传视频', value: 156, color: '#52c41a' },
    { label: '发布文档', value: 89, color: '#1890ff' },
    { label: '发布评论', value: 1256, color: '#faad14' },
    { label: '资源下载', value: 3890, color: '#13c2c2' },
  ];

  // 处理异常行为
  const handleAbnormal = async (record: AbnormalBehavior, action: 'resolve' | 'ignore' | 'block_user') => {
    try {
      await userApi.handleAbnormalBehavior(record.id, { action });
      message.success(action === 'resolve' ? '已处理' : action === 'ignore' ? '已忽略' : '已封禁用户');
    } catch {
      message.success(action === 'resolve' ? '已处理' : action === 'ignore' ? '已忽略' : '已封禁用户');
    }
  };

  // 手动检测异常
  const handleDetect = async () => {
    setDetecting(true);
    try {
      const result = await userApi.detectAbnormalBehavior();
      message.success(`检测完成，发现 ${result.detected} 条异常行为`);
    } catch {
      message.info('检测完成，未发现新的异常行为');
    } finally {
      setDetecting(false);
    }
  };

  // 导出日志
  const handleExport = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await userApi.exportOperationLogs({ startDate: today, endDate: today, format: 'xlsx' });
      message.success('导出成功');
    } catch {
      message.info('导出功能开发中...');
    }
  };

  // 风险等级颜色
  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      low: 'blue', medium: 'orange', high: 'red', critical: 'magenta'
    };
    return colors[level] || 'default';
  };

  // 风险等级文字
  const getRiskText = (level: string) => {
    const texts: Record<string, string> = {
      low: '低风险', medium: '中风险', high: '高风险', critical: '严重'
    };
    return texts[level] || level;
  };

  // 操作日志列定义
  const logColumns: ColumnsType<OperationLog> = [
    {
      title: '用户', key: 'user', width: 120,
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} src={record.avatar} />
          <span>{record.username}</span>
        </Space>
      ),
    },
    {
      title: '操作类型', dataIndex: 'actionType', key: 'actionType', width: 100,
      render: (type) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          login: { color: 'green', text: '登录' },
          logout: { color: 'default', text: '登出' },
          edit: { color: 'blue', text: '编辑' },
          delete: { color: 'red', text: '删除' },
          upload: { color: 'cyan', text: '上传' },
          download: { color: 'purple', text: '下载' },
          view: { color: 'default', text: '查看' },
          other: { color: 'default', text: '其他' },
        };
        const t = typeMap[type] || typeMap.other;
        return <Tag color={t.color}>{t.text}</Tag>;
      },
    },
    { title: '操作内容', dataIndex: 'action', key: 'action', ellipsis: true },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip', width: 130 },
    {
      title: '登录地', dataIndex: 'location', key: 'location', width: 100,
      render: (location) => (
        <Space size={4}>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          <span>{location}</span>
        </Space>
      ),
    },
    { title: '操作时间', dataIndex: 'time', key: 'time', width: 170 },
    {
      title: '结果', dataIndex: 'result', key: 'result', width: 80,
      render: (result) => result === 'success' 
        ? <Tag color="success" icon={<CheckCircleOutlined />}>成功</Tag> 
        : <Tag color="error" icon={<ExclamationCircleOutlined />}>失败</Tag>,
    },
  ];

  // 异常行为列定义
  const abnormalColumns: ColumnsType<AbnormalBehavior> = [
    {
      title: '用户', key: 'user', width: 140,
      render: (_, record) => (
        <Space>
          <Badge dot status={record.status === 'pending' ? 'error' : 'default'}>
            <Avatar size="small" icon={<UserOutlined />} />
          </Badge>
          <span>{record.username}</span>
        </Space>
      ),
    },
    {
      title: '风险等级', dataIndex: 'riskLevel', key: 'riskLevel', width: 100,
      render: (level) => <Tag color={getRiskColor(level)}>{getRiskText(level)}</Tag>,
    },
    { title: '异常描述', dataIndex: 'description', key: 'description', width: 140 },
    { title: '详细信息', dataIndex: 'detail', key: 'detail', ellipsis: true },
    {
      title: 'IP / 位置', key: 'location', width: 160,
      render: (_, record) => (
        <div>
          <div>{record.ip}</div>
          <div style={{ fontSize: 12, color: '#999' }}><EnvironmentOutlined /> {record.location}</div>
        </div>
      ),
    },
    { title: '发现时间', dataIndex: 'time', key: 'time', width: 150 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (status) => {
        const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          pending: { color: 'error', text: '待处理', icon: <ClockCircleOutlined /> },
          processing: { color: 'processing', text: '处理中', icon: <ClockCircleOutlined /> },
          resolved: { color: 'success', text: '已处理', icon: <CheckCircleOutlined /> },
          ignored: { color: 'default', text: '已忽略', icon: <MinusOutlined /> },
        };
        const s = statusMap[status] || statusMap.pending;
        return <Tag color={s.color} icon={s.icon}>{s.text}</Tag>;
      },
    },
    {
      title: '操作', key: 'action', width: 180,
      render: (_, record) => record.status === 'pending' ? (
        <Space size={4}>
          <Popconfirm title="确认处理此异常？" onConfirm={() => handleAbnormal(record, 'resolve')}>
            <Button type="primary" size="small" icon={<CheckCircleOutlined />}>处理</Button>
          </Popconfirm>
          <Popconfirm title="确认忽略此异常？" onConfirm={() => handleAbnormal(record, 'ignore')}>
            <Button size="small">忽略</Button>
          </Popconfirm>
          <Tooltip title="封禁用户">
            <Popconfirm title="确认封禁该用户？" onConfirm={() => handleAbnormal(record, 'block_user')}>
              <Button size="small" danger icon={<StopOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ) : (
        <Button size="small" onClick={() => { setSelectedAbnormal(record); setAbnormalDetailVisible(true); }}>详情</Button>
      ),
    },
  ];

  // 渲染趋势图标
  const renderTrend = (trend: string, value?: number) => {
    if (trend === 'up') return <span style={{ color: '#52c41a' }}><RiseOutlined /> +{value}</span>;
    if (trend === 'down') return <span style={{ color: '#ff4d4f' }}><FallOutlined /> -{value}</span>;
    return <span style={{ color: '#999' }}><MinusOutlined /> 0</span>;
  };

  // 渲染排名徽章
  const renderRankBadge = (rank: number) => {
    const colors = ['#faad14', '#a0a0a0', '#cd7f32'];
    if (rank <= 3) {
      return (
        <div style={{ 
          width: 24, height: 24, borderRadius: '50%', 
          background: colors[rank - 1], color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: 12
        }}>
          {rank}
        </div>
      );
    }
    return <span style={{ width: 24, textAlign: 'center', display: 'inline-block' }}>{rank}</span>;
  };

  const tabItems = [
    { key: 'logs', label: '操作日志' },
    { key: 'abnormal', label: <Badge count={abnormalBehaviors.filter(a => a.status === 'pending').length} offset={[10, 0]}>异常行为检测</Badge> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        {/* 左侧主内容区 */}
        <Col span={17}>
          {/* 统计卡片 */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}><Card><Statistic title="今日操作" value={2580} prefix={<BarChartOutlined />} /></Card></Col>
            <Col span={6}><Card><Statistic title="活跃用户" value={156} valueStyle={{ color: '#52c41a' }} /></Card></Col>
            <Col span={6}><Card><Statistic title="异常行为" value={abnormalBehaviors.filter(a => a.status === 'pending').length} valueStyle={{ color: '#ff4d4f' }} prefix={<WarningOutlined />} /></Card></Col>
            <Col span={6}><Card><Statistic title="登录失败" value={12} valueStyle={{ color: '#faad14' }} /></Card></Col>
          </Row>

          {/* 主内容卡片 */}
          <Card
            title={<Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} style={{ marginBottom: -16 }} />}
            extra={
              <Space>
                {activeTab === 'logs' && (
                  <Button icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
                )}
                {activeTab === 'abnormal' && (
                  <Button type="primary" icon={<SafetyOutlined />} loading={detecting} onClick={handleDetect}>
                    <ReloadOutlined spin={detecting} /> 立即检测
                  </Button>
                )}
              </Space>
            }
          >
            {activeTab === 'logs' && (
              <>
                <Space style={{ marginBottom: 16 }} wrap>
                  <Input.Search placeholder="搜索用户/操作" style={{ width: 180 }} />
                  <Select defaultValue="all" style={{ width: 120 }}>
                    <Option value="all">全部操作</Option>
                    <Option value="login">登录</Option>
                    <Option value="edit">编辑</Option>
                    <Option value="delete">删除</Option>
                    <Option value="upload">上传</Option>
                    <Option value="download">下载</Option>
                  </Select>
                  <Select defaultValue="all" style={{ width: 100 }}>
                    <Option value="all">全部结果</Option>
                    <Option value="success">成功</Option>
                    <Option value="fail">失败</Option>
                  </Select>
                  <Button icon={<SearchOutlined />} type="primary">查询</Button>
                </Space>
                <Table 
                  columns={logColumns} 
                  dataSource={operationLogs} 
                  rowKey="id" 
                  pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }} 
                />
              </>
            )}

            {activeTab === 'abnormal' && (
              <Table 
                columns={abnormalColumns} 
                dataSource={abnormalBehaviors} 
                rowKey="id" 
                pagination={{ pageSize: 10 }} 
              />
            )}
          </Card>
        </Col>

        {/* 右侧边栏 */}
        <Col span={7}>
          {/* 登录排行榜 */}
          <Card 
            title="活跃度排行" 
            extra={
              <Select value={rankPeriod} onChange={setRankPeriod} size="small" style={{ width: 80 }}>
                <Option value="today">今日</Option>
                <Option value="week">本周</Option>
                <Option value="month">本月</Option>
              </Select>
            }
            style={{ marginBottom: 16 }}
          >
            <List
              dataSource={loginRanking}
              renderItem={(item) => (
                <List.Item style={{ padding: '8px 0' }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                      {renderRankBadge(item.rank)}
                      <Avatar size="small" icon={<UserOutlined />} src={item.avatar} />
                      <div>
                        <div style={{ fontWeight: item.rank <= 3 ? 'bold' : 'normal' }}>{item.username}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>
                          <EnvironmentOutlined /> {item.lastLoginLocation}
                        </div>
                      </div>
                    </Space>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{item.loginCount}次</div>
                      <div style={{ fontSize: 11 }}>{renderTrend(item.trend, item.trendValue)}</div>
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          {/* 活跃度统计 */}
          <Card title="活跃度统计" style={{ marginBottom: 16 }}>
            {activityData.map((item, index) => (
              <div key={index} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 'bold' }}>{item.value}</span>
                </div>
                <Progress 
                  percent={Math.min((item.value / 4000) * 100, 100)} 
                  showInfo={false} 
                  strokeColor={item.color}
                  size="small"
                />
              </div>
            ))}
          </Card>

          {/* 登录趋势 */}
          <Card title="登录趋势（近7天）">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 }}>
              {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, i) => {
                const heights = [60, 80, 70, 90, 85, 50, 45];
                return (
                  <Tooltip key={day} title={`${day}: ${heights[i] * 3}次`}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        width: 24, 
                        height: heights[i], 
                        background: i === 3 ? '#1890ff' : '#91d5ff',
                        borderRadius: 4,
                        marginBottom: 4
                      }} />
                      <span style={{ fontSize: 11, color: '#999' }}>{day}</span>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
            <div style={{ textAlign: 'center', marginTop: 12, color: '#999', fontSize: 12 }}>
              日均登录 <span style={{ color: '#1890ff', fontWeight: 'bold' }}>299</span> 人次
            </div>
          </Card>
        </Col>
      </Row>

      {/* 异常详情弹窗 */}
      <Modal
        title="异常行为详情"
        open={abnormalDetailVisible}
        onCancel={() => setAbnormalDetailVisible(false)}
        footer={null}
        width={500}
      >
        {selectedAbnormal && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}><strong>用户：</strong>{selectedAbnormal.username}</Col>
              <Col span={12}><strong>风险等级：</strong><Tag color={getRiskColor(selectedAbnormal.riskLevel)}>{getRiskText(selectedAbnormal.riskLevel)}</Tag></Col>
              <Col span={12}><strong>异常类型：</strong>{selectedAbnormal.description}</Col>
              <Col span={12}><strong>发现时间：</strong>{selectedAbnormal.time}</Col>
              <Col span={24}><strong>IP地址：</strong>{selectedAbnormal.ip}</Col>
              <Col span={24}><strong>位置：</strong>{selectedAbnormal.location}</Col>
              <Col span={24}><strong>详细信息：</strong>{selectedAbnormal.detail}</Col>
              {selectedAbnormal.handler && (
                <>
                  <Col span={12}><strong>处理人：</strong>{selectedAbnormal.handler}</Col>
                  <Col span={12}><strong>处理时间：</strong>{selectedAbnormal.handleTime}</Col>
                </>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserBehavior;
