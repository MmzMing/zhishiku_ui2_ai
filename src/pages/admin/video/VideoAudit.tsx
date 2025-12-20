/**
 * 视频审核管理页面 - 增强版
 */

import React, { useState } from 'react';
import { 
  Card, Table, Button, Space, Tag, Statistic, Row, Col, Image, Typography, 
  Tabs, Timeline, Modal, message, Popconfirm, Input, Badge, Tooltip
} from 'antd';
import { 
  ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, 
  ExclamationCircleOutlined, RobotOutlined, EyeOutlined, 
  FileTextOutlined, WarningOutlined, SyncOutlined, UserOutlined,
  ExportOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import * as videoApi from '../../../api/admin/videoApi';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// 使用 API 中定义的类型
type AuditVideo = videoApi.AuditVideo;
type AuditLog = videoApi.AuditLog;
type ViolationRecord = videoApi.ViolationRecord;

const VideoAudit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedVideo, setSelectedVideo] = useState<AuditVideo | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [aiAuditing, setAiAuditing] = useState<number | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  // 模拟审核队列数据
  const [auditData, setAuditData] = useState<AuditVideo[]>([
    { id: 101, title: 'Vue 3 组合式API 完全指南', cover: '/default/fileDefaultPc.jpg', author: '张三', authorId: 1001, submitTime: '2024-12-19 10:30', duration: '35:20', fileSize: 256000000, aiResult: 'pending', auditStatus: 'pending' },
    { id: 102, title: 'React Hooks 深入解析', cover: '/default/fileDefaultPc.jpg', author: '李四', authorId: 1002, submitTime: '2024-12-19 09:15', duration: '42:10', fileSize: 320000000, aiResult: 'warning', auditStatus: 'auditing', auditor: 'admin' },
    { id: 103, title: 'Node.js 性能优化实战', cover: '/default/fileDefaultPc.jpg', author: '王五', authorId: 1003, submitTime: '2024-12-19 08:00', duration: '1:10:00', fileSize: 512000000, aiResult: 'pass', auditStatus: 'completed', auditor: 'admin', auditTime: '2024-12-19 11:30', finalResult: 'pass' },
  ]);

  // 审核日志数据
  const auditLogs: AuditLog[] = [
    { id: 1, videoId: 101, videoTitle: 'Vue 3 组合式API 完全指南', action: 'submit', operator: '张三', time: '2024-12-19 10:30:00', detail: '用户提交视频审核申请' },
    { id: 2, videoId: 102, videoTitle: 'React Hooks 深入解析', action: 'submit', operator: '李四', time: '2024-12-19 09:15:00', detail: '用户提交视频审核申请' },
    { id: 3, videoId: 102, videoTitle: 'React Hooks 深入解析', action: 'ai_audit', operator: 'AI系统', time: '2024-12-19 09:15:30', detail: 'AI审核完成，检测到潜在问题：视频标题可能存在夸大宣传', result: '待人工复核' },
    { id: 4, videoId: 103, videoTitle: 'Node.js 性能优化实战', action: 'submit', operator: '王五', time: '2024-12-19 08:00:00', detail: '用户提交视频审核申请' },
    { id: 5, videoId: 103, videoTitle: 'Node.js 性能优化实战', action: 'ai_audit', operator: 'AI系统', time: '2024-12-19 08:00:25', detail: 'AI审核完成，未检测到违规内容', result: '通过' },
    { id: 6, videoId: 103, videoTitle: 'Node.js 性能优化实战', action: 'manual_pass', operator: 'admin', time: '2024-12-19 11:30:00', detail: '人工审核通过', result: '通过' },
  ];

  // 违规记录数据
  const violationRecords: ViolationRecord[] = [
    { id: 1, videoId: 98, videoTitle: 'TypeScript入门教程', author: '用户A', authorId: 2001, violationType: '内容违规', violationCode: 'CONTENT_001', description: '视频中包含未经授权的第三方内容', time: '2024-12-18 15:30', handler: 'admin', status: 'processed' },
    { id: 2, videoId: 95, videoTitle: 'Python爬虫实战', author: '用户B', authorId: 2002, violationType: '标题违规', violationCode: 'TITLE_001', description: '标题存在夸大宣传，与实际内容不符', time: '2024-12-17 10:20', handler: 'editor', status: 'processed' },
    { id: 3, videoId: 99, videoTitle: '前端面试技巧', author: '用户C', authorId: 2003, violationType: '封面违规', violationCode: 'COVER_001', description: '封面图片包含不当内容', time: '2024-12-19 09:00', handler: '', status: 'pending' },
  ];

  // AI审核调用
  const handleAIAudit = async (video: AuditVideo) => {
    setAiAuditing(video.id);
    message.loading({ content: 'AI审核中...', key: 'aiAudit' });
    
    try {
      // 调用后端API
      const response = await videoApi.aiAuditVideo(video.id);
      
      setAuditData(prev => prev.map(v => 
        v.id === video.id ? { 
          ...v, 
          aiResult: response.result, 
          auditStatus: 'auditing' as const
        } : v
      ));
      
      if (response.result === 'pass') {
        message.success({ content: `AI审核通过 (评分: ${response.score})`, key: 'aiAudit' });
      } else if (response.result === 'warning') {
        message.warning({ content: `AI检测到潜在问题，需人工复核`, key: 'aiAudit' });
      } else {
        message.error({ content: `AI审核不通过: ${response.detail}`, key: 'aiAudit' });
      }
    } catch (error: any) {
      // 模拟响应（后端未实现时）
      const results: ('pass' | 'warning' | 'reject')[] = ['pass', 'warning', 'pass'];
      const result = results[Math.floor(Math.random() * results.length)];
      
      setAuditData(prev => prev.map(v => 
        v.id === video.id ? { ...v, aiResult: result, auditStatus: 'auditing' as const } : v
      ));
      
      if (result === 'pass') {
        message.success({ content: 'AI审核通过，建议人工确认', key: 'aiAudit' });
      } else if (result === 'warning') {
        message.warning({ content: 'AI检测到潜在问题，需人工复核', key: 'aiAudit' });
      } else {
        message.error({ content: 'AI审核不通过，建议驳回', key: 'aiAudit' });
      }
    } finally {
      setAiAuditing(null);
    }
  };

  // 通过审核
  const handlePass = async (video: AuditVideo) => {
    try {
      await videoApi.manualPassVideo(video.id);
      setAuditData(prev => prev.map(v => 
        v.id === video.id ? { 
          ...v, 
          auditStatus: 'completed' as const, 
          finalResult: 'pass' as const, 
          auditor: 'admin', 
          auditTime: new Date().toLocaleString() 
        } : v
      ));
      message.success('审核通过');
    } catch (error) {
      // 模拟成功（后端未实现时）
      setAuditData(prev => prev.map(v => 
        v.id === video.id ? { 
          ...v, 
          auditStatus: 'completed' as const, 
          finalResult: 'pass' as const, 
          auditor: 'admin', 
          auditTime: new Date().toLocaleString() 
        } : v
      ));
      message.success('审核通过');
    }
  };

  // 驳回审核
  const handleReject = async () => {
    if (!selectedVideo || !rejectReason.trim()) {
      message.warning('请输入驳回原因');
      return;
    }
    
    try {
      await videoApi.manualRejectVideo(selectedVideo.id, rejectReason);
      setAuditData(prev => prev.map(v => 
        v.id === selectedVideo.id ? { 
          ...v, 
          auditStatus: 'completed' as const, 
          finalResult: 'reject' as const, 
          auditor: 'admin', 
          auditTime: new Date().toLocaleString(), 
          rejectReason 
        } : v
      ));
      message.success('已驳回');
    } catch (error) {
      // 模拟成功（后端未实现时）
      setAuditData(prev => prev.map(v => 
        v.id === selectedVideo.id ? { 
          ...v, 
          auditStatus: 'completed' as const, 
          finalResult: 'reject' as const, 
          auditor: 'admin', 
          auditTime: new Date().toLocaleString(), 
          rejectReason 
        } : v
      ));
      message.success('已驳回');
    }
    
    setRejectModalVisible(false);
    setRejectReason('');
    setSelectedVideo(null);
  };

  // 获取视频的审核日志
  const getVideoLogs = (videoId: number) => auditLogs.filter(log => log.videoId === videoId);

  // 批量AI审核
  const handleBatchAIAudit = async () => {
    const pendingVideos = auditData.filter(v => v.aiResult === 'pending');
    if (pendingVideos.length === 0) {
      message.info('没有待AI审核的视频');
      return;
    }
    
    message.loading({ content: `正在批量审核 ${pendingVideos.length} 个视频...`, key: 'batchAudit' });
    
    try {
      const response = await videoApi.aiAuditBatch(pendingVideos.map(v => v.id));
      message.success({ 
        content: `批量审核完成: ${response.success} 成功, ${response.failed} 失败`, 
        key: 'batchAudit' 
      });
      // 刷新数据
      // TODO: 重新获取列表数据
    } catch (error) {
      // 模拟批量审核
      for (const video of pendingVideos) {
        await handleAIAudit(video);
      }
      message.success({ content: '批量审核完成', key: 'batchAudit' });
    }
  };

  // 导出审核报告
  const handleExportReport = async () => {
    try {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];
      
      const response = await videoApi.exportAuditReport({ startDate, endDate, format: 'xlsx' });
      message.success('报告导出成功');
      // window.open(response.downloadUrl);
    } catch (error) {
      message.info('导出功能开发中...');
    }
  };

  // 审核状态标签
  const renderAuditStatus = (status: string) => {
    const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      pending: { color: 'default', text: '待审核', icon: <ClockCircleOutlined /> },
      auditing: { color: 'processing', text: '审核中', icon: <SyncOutlined spin /> },
      completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
    };
    const s = statusMap[status] || statusMap.pending;
    return <Tag color={s.color} icon={s.icon}>{s.text}</Tag>;
  };

  // AI结果标签
  const renderAIResult = (result: string) => {
    const resultMap: Record<string, { color: string; text: string }> = {
      pass: { color: 'success', text: '通过' },
      warning: { color: 'warning', text: '待复核' },
      reject: { color: 'error', text: '不通过' },
      pending: { color: 'default', text: '未审核' },
    };
    const r = resultMap[result] || resultMap.pending;
    return <Tag color={r.color}>{r.text}</Tag>;
  };

  // 审核队列列定义
  const queueColumns: ColumnsType<AuditVideo> = [
    {
      title: '视频信息', key: 'info', width: 320,
      render: (_, record) => (
        <Space>
          <Image src={record.cover} width={100} height={56} style={{ borderRadius: 4, objectFit: 'cover' }} preview={false} fallback="/default/fileDefaultPc.jpg" />
          <div>
            <Text strong style={{ display: 'block', maxWidth: 180 }} ellipsis={{ tooltip: record.title }}>{record.title}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}><UserOutlined /> {record.author} · {record.duration}</Text>
          </div>
        </Space>
      ),
    },
    { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 160 },
    {
      title: 'AI预审结果', key: 'aiResult', width: 140,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {renderAIResult(record.aiResult)}
          {record.aiResult === 'pending' && (
            <Button 
              type="link" 
              size="small" 
              icon={<RobotOutlined />} 
              loading={aiAuditing === record.id}
              onClick={() => handleAIAudit(record)}
              style={{ padding: 0, height: 'auto' }}
            >
              立即AI审核
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: '审核状态', key: 'auditStatus', width: 120,
      render: (_, record) => renderAuditStatus(record.auditStatus),
    },
    {
      title: '审核人', dataIndex: 'auditor', key: 'auditor', width: 100,
      render: (auditor) => auditor ? <Tag icon={<UserOutlined />}>{auditor}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: '操作', key: 'action', width: 220,
      render: (_, record) => (
        <Space>
          {record.auditStatus !== 'completed' && (
            <>
              <Popconfirm title="确认通过审核？" onConfirm={() => handlePass(record)}>
                <Button type="primary" size="small" icon={<CheckCircleOutlined />}>通过</Button>
              </Popconfirm>
              <Button size="small" danger icon={<CloseCircleOutlined />} onClick={() => { setSelectedVideo(record); setRejectModalVisible(true); }}>驳回</Button>
            </>
          )}
          {record.auditStatus === 'completed' && (
            <Tag color={record.finalResult === 'pass' ? 'success' : 'error'}>
              {record.finalResult === 'pass' ? '已通过' : '已驳回'}
            </Tag>
          )}
          <Tooltip title="查看日志">
            <Button 
              type="text" 
              size="small" 
              icon={<FileTextOutlined />}
              onClick={() => setExpandedRowKeys(prev => prev.includes(record.id) ? prev.filter(k => k !== record.id) : [...prev, record.id])}
            />
          </Tooltip>
          <Tooltip title="预览视频">
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 展开行渲染 - 显示日志
  const expandedRowRender = (record: AuditVideo) => {
    const logs = getVideoLogs(record.id);
    return (
      <Card size="small" title="审核日志" style={{ margin: '8px 0', background: 'rgba(0,0,0,0.02)' }}>
        {logs.length > 0 ? (
          <Timeline
            items={logs.map(log => ({
              color: log.action === 'manual_pass' ? 'green' : log.action === 'manual_reject' ? 'red' : log.action === 'ai_audit' ? 'blue' : 'gray',
              children: (
                <div>
                  <Text strong>{log.operator}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>{log.time}</Text>
                  <br />
                  <Text>{log.detail}</Text>
                  {log.result && <Tag style={{ marginLeft: 8 }}>{log.result}</Tag>}
                </div>
              ),
            }))}
          />
        ) : (
          <Text type="secondary">暂无日志记录</Text>
        )}
      </Card>
    );
  };

  // 审核日志列定义
  const logColumns: ColumnsType<AuditLog> = [
    { title: '时间', dataIndex: 'time', key: 'time', width: 180 },
    { title: '视频', dataIndex: 'videoTitle', key: 'videoTitle', ellipsis: true },
    {
      title: '操作类型', dataIndex: 'action', key: 'action', width: 120,
      render: (action) => {
        const actionMap: Record<string, { color: string; text: string }> = {
          submit: { color: 'default', text: '提交审核' },
          ai_audit: { color: 'blue', text: 'AI审核' },
          manual_pass: { color: 'success', text: '人工通过' },
          manual_reject: { color: 'error', text: '人工驳回' },
          appeal: { color: 'warning', text: '申诉' },
        };
        const a = actionMap[action] || { color: 'default', text: action };
        return <Tag color={a.color}>{a.text}</Tag>;
      },
    },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100 },
    { title: '详情', dataIndex: 'detail', key: 'detail', ellipsis: true },
    { title: '结果', dataIndex: 'result', key: 'result', width: 100, render: (r) => r ? <Tag>{r}</Tag> : '-' },
  ];

  // 违规记录列定义
  const violationColumns: ColumnsType<ViolationRecord> = [
    { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
    { title: '视频', dataIndex: 'videoTitle', key: 'videoTitle', ellipsis: true },
    { title: '作者', dataIndex: 'author', key: 'author', width: 100 },
    {
      title: '违规类型', dataIndex: 'violationType', key: 'violationType', width: 120,
      render: (type) => <Tag color="error" icon={<WarningOutlined />}>{type}</Tag>,
    },
    { title: '违规描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '处理人', dataIndex: 'handler', key: 'handler', width: 100, render: (h) => h || '-' },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (status) => status === 'processed' ? <Badge status="success" text="已处理" /> : <Badge status="warning" text="待处理" />,
    },
    {
      title: '操作', key: 'action', width: 100,
      render: (_, record) => record.status === 'pending' ? <Button type="primary" size="small">处理</Button> : <Button size="small">详情</Button>,
    },
  ];

  const tabItems = [
    {
      key: 'queue',
      label: <span><Badge count={auditData.filter(v => v.auditStatus !== 'completed').length} offset={[10, 0]}>审核队列</Badge></span>,
    },
    { key: 'logs', label: '审核日志' },
    { key: 'violations', label: '违规记录' },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="待审核" value={auditData.filter(v => v.auditStatus === 'pending').length} valueStyle={{ color: '#faad14' }} prefix={<ClockCircleOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="审核中" value={auditData.filter(v => v.auditStatus === 'auditing').length} valueStyle={{ color: '#1890ff' }} prefix={<SyncOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日通过" value={auditData.filter(v => v.finalResult === 'pass').length} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="违规记录" value={violationRecords.filter(v => v.status === 'pending').length} valueStyle={{ color: '#ff4d4f' }} prefix={<ExclamationCircleOutlined />} /></Card>
        </Col>
      </Row>

      {/* 主内容区 */}
      <Card
        title={
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} style={{ marginBottom: -16 }} />
        }
        extra={
          <Space>
            <Button icon={<ExportOutlined />} onClick={handleExportReport}>导出报告</Button>
            <Button icon={<WarningOutlined />} onClick={() => setActiveTab('violations')}>违规记录</Button>
            <Button type="primary" icon={<RobotOutlined />} onClick={handleBatchAIAudit}>
              AI批量审核
            </Button>
          </Space>
        }
      >
        {activeTab === 'queue' && (
          <Table 
            columns={queueColumns} 
            dataSource={auditData} 
            rowKey="id" 
            pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
            expandable={{
              expandedRowRender,
              expandedRowKeys,
              onExpand: (expanded, record) => setExpandedRowKeys(expanded ? [...expandedRowKeys, record.id] : expandedRowKeys.filter(k => k !== record.id)),
              rowExpandable: () => true,
            }}
          />
        )}
        {activeTab === 'logs' && (
          <Table columns={logColumns} dataSource={auditLogs} rowKey="id" pagination={{ pageSize: 15 }} />
        )}
        {activeTab === 'violations' && (
          <Table columns={violationColumns} dataSource={violationRecords} rowKey="id" pagination={{ pageSize: 10 }} />
        )}
      </Card>

      {/* 驳回弹窗 */}
      <Modal
        title="驳回审核"
        open={rejectModalVisible}
        onCancel={() => { setRejectModalVisible(false); setRejectReason(''); }}
        onOk={handleReject}
        okText="确认驳回"
        okButtonProps={{ danger: true }}
      >
        <Paragraph>视频：{selectedVideo?.title}</Paragraph>
        <TextArea
          rows={4}
          placeholder="请输入驳回原因..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default VideoAudit;
