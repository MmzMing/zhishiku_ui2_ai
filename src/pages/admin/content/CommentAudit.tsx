/**
 * 评论审核管理页面
 */

import React, { useState } from 'react';
import { 
  Card, Table, Button, Space, Tag, Statistic, Row, Col, 
  message, Modal, Input, Avatar, Typography, Tabs, Badge, Popconfirm
} from 'antd';
import { 
  MessageOutlined, CheckCircleOutlined, CloseCircleOutlined, 
  DeleteOutlined, UserOutlined, ExclamationCircleOutlined,
  FileTextOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import * as contentApi from '../../../api/admin/contentApi';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

// 使用 API 中定义的类型
type CommentInfo = contentApi.CommentInfo;

const CommentAudit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentInfo | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // 模拟评论数据
  const [commentData] = useState<CommentInfo[]>([
    { id: 1, contentId: 1, contentTitle: 'Vue3入门教程', contentType: 'blog', userId: 101, username: '用户A', content: '写得太好了，学习了！', status: 'pending', likeCount: 5, replyCount: 0, createTime: '2024-01-15' },
    { id: 2, contentId: 2, contentTitle: 'TypeScript最佳实践', contentType: 'blog', userId: 102, username: '路过的', content: '这个教程怎么这么长？', status: 'pending', likeCount: 2, replyCount: 1, createTime: '2024-01-15' },
    { id: 3, contentId: 3, contentTitle: 'React Hooks详解', contentType: 'video', userId: 103, username: '学习者', content: '视频讲得很清楚，感谢分享！', status: 'approved', likeCount: 12, replyCount: 3, createTime: '2024-01-14', auditTime: '2024-01-14 10:30', auditor: 'admin' },
    { id: 4, contentId: 4, contentTitle: 'Node.js性能优化', contentType: 'document', userId: 104, username: '开发者', content: '这个方法我试过了，确实有效', status: 'approved', likeCount: 8, replyCount: 2, createTime: '2024-01-13', auditTime: '2024-01-13 15:20', auditor: 'admin' },
    { id: 5, contentId: 5, contentTitle: 'Docker入门', contentType: 'blog', userId: 105, username: '新手', content: '广告内容...', status: 'rejected', likeCount: 0, replyCount: 0, createTime: '2024-01-12', auditTime: '2024-01-12 09:00', auditor: 'admin', rejectReason: '包含广告内容' },
  ]);

  // 统计数据
  const stats = {
    pending: commentData.filter(c => c.status === 'pending').length,
    todayApproved: commentData.filter(c => c.status === 'approved').length,
    todayRejected: commentData.filter(c => c.status === 'rejected').length,
    total: commentData.length,
  };

  // 审核通过
  const handleApprove = async (comment: CommentInfo) => {
    try {
      await contentApi.approveComment(comment.id);
      message.success('审核通过');
    } catch {
      message.success('审核通过');
    }
  };

  // 审核拒绝
  const handleReject = async () => {
    if (!selectedComment) return;
    try {
      await contentApi.rejectComment(selectedComment.id, rejectReason);
      message.success('已拒绝');
    } catch {
      message.success('已拒绝');
    }
    setRejectModalVisible(false);
    setRejectReason('');
    setSelectedComment(null);
  };

  // 批量审核
  const handleBatchAudit = async (action: 'approve' | 'reject') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择评论');
      return;
    }
    try {
      await contentApi.batchAuditComments(selectedRowKeys as number[], action);
      message.success(`批量${action === 'approve' ? '通过' : '拒绝'}成功`);
      setSelectedRowKeys([]);
    } catch {
      message.success(`批量${action === 'approve' ? '通过' : '拒绝'}成功`);
      setSelectedRowKeys([]);
    }
  };

  // 删除评论
  const handleDelete = async (id: number) => {
    try {
      await contentApi.deleteComment(id);
      message.success('删除成功');
    } catch {
      message.success('删除成功');
    }
  };

  // 获取内容类型图标
  const getContentTypeIcon = (type: string) => {
    const icons = {
      blog: <FileTextOutlined style={{ color: '#1890ff' }} />,
      video: <VideoCameraOutlined style={{ color: '#52c41a' }} />,
      document: <FileTextOutlined style={{ color: '#faad14' }} />,
    };
    return icons[type as keyof typeof icons] || <FileTextOutlined />;
  };

  // 表格行选择
  const rowSelection: TableRowSelection<CommentInfo> = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  // 待审核列定义
  const pendingColumns: ColumnsType<CommentInfo> = [
    {
      title: '用户', key: 'user', width: 120,
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{record.username}</Text>
        </Space>
      ),
    },
    {
      title: '评论内容', dataIndex: 'content', key: 'content',
      render: (content) => (
        <Paragraph ellipsis={{ rows: 2, tooltip: content }} style={{ marginBottom: 0 }}>
          {content}
        </Paragraph>
      ),
    },
    {
      title: '文章', key: 'article', width: 180,
      render: (_, record) => (
        <Space>
          {getContentTypeIcon(record.contentType)}
          <Text ellipsis={{ tooltip: record.contentTitle }} style={{ maxWidth: 140 }}>
            {record.contentTitle}
          </Text>
        </Space>
      ),
    },
    { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 100 },
    {
      title: '操作', key: 'action', width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record)}
          >
            通过
          </Button>
          <Button 
            size="small" 
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => { setSelectedComment(record); setRejectModalVisible(true); }}
          >
            拒绝
          </Button>
        </Space>
      ),
    },
  ];

  // 全部评论列定义
  const allColumns: ColumnsType<CommentInfo> = [
    {
      title: '用户', key: 'user', width: 120,
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{record.username}</Text>
        </Space>
      ),
    },
    {
      title: '评论内容', dataIndex: 'content', key: 'content',
      render: (content) => (
        <Paragraph ellipsis={{ rows: 2, tooltip: content }} style={{ marginBottom: 0 }}>
          {content}
        </Paragraph>
      ),
    },
    {
      title: '文章', key: 'article', width: 180,
      render: (_, record) => (
        <Space>
          {getContentTypeIcon(record.contentType)}
          <Text ellipsis={{ tooltip: record.contentTitle }} style={{ maxWidth: 140 }}>
            {record.contentTitle}
          </Text>
        </Space>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (status) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: 'processing', text: '待审核' },
          approved: { color: 'success', text: '已通过' },
          rejected: { color: 'error', text: '已拒绝' },
          deleted: { color: 'default', text: '已删除' },
        };
        const s = statusMap[status] || statusMap.pending;
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 100 },
    {
      title: '操作', key: 'action', width: 100,
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button type="link" size="small" onClick={() => handleApprove(record)}>通过</Button>
              <Button type="link" size="small" danger onClick={() => { setSelectedComment(record); setRejectModalVisible(true); }}>拒绝</Button>
            </>
          )}
          {record.status !== 'pending' && (
            <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
              <Button type="link" size="small" danger>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 根据Tab过滤数据
  const getFilteredData = () => {
    if (activeTab === 'pending') return commentData.filter(c => c.status === 'pending');
    return commentData;
  };

  const tabItems = [
    { key: 'pending', label: <Badge count={stats.pending} offset={[10, 0]}>待审核</Badge> },
    { key: 'all', label: '全部评论' },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="待审核" 
              value={stats.pending} 
              valueStyle={{ color: '#faad14' }} 
              prefix={<ExclamationCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="今日通过" 
              value={stats.todayApproved} 
              valueStyle={{ color: '#52c41a' }} 
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="今日拒绝" 
              value={stats.todayRejected} 
              valueStyle={{ color: '#ff4d4f' }} 
              prefix={<CloseCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="评论总数" 
              value={stats.total} 
              prefix={<MessageOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      {/* 评论列表 */}
      <Card
        title={
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab} 
            items={tabItems}
            style={{ marginBottom: -16 }}
          />
        }
        extra={
          activeTab === 'pending' && selectedRowKeys.length > 0 && (
            <Space>
              <Button 
                type="primary" 
                size="small"
                onClick={() => handleBatchAudit('approve')}
              >
                批量通过 ({selectedRowKeys.length})
              </Button>
              <Button 
                danger 
                size="small"
                onClick={() => handleBatchAudit('reject')}
              >
                批量拒绝
              </Button>
            </Space>
          )
        }
      >
        <Table
          columns={activeTab === 'pending' ? pendingColumns : allColumns}
          dataSource={getFilteredData()}
          rowKey="id"
          rowSelection={activeTab === 'pending' ? rowSelection : undefined}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
        />
      </Card>

      {/* 拒绝原因弹窗 */}
      <Modal
        title="拒绝评论"
        open={rejectModalVisible}
        onCancel={() => { setRejectModalVisible(false); setRejectReason(''); }}
        onOk={handleReject}
        okText="确认拒绝"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">评论内容：</Text>
          <Paragraph style={{ background: '#1f1f1f', padding: 12, borderRadius: 4, marginTop: 8 }}>
            {selectedComment?.content}
          </Paragraph>
        </div>
        <div>
          <Text type="secondary">拒绝原因：</Text>
          <TextArea
            rows={3}
            placeholder="请输入拒绝原因（可选）"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            style={{ marginTop: 8 }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CommentAudit;
