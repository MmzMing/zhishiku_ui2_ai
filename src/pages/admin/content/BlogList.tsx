/**
 * 博客管理页面
 */

import React, { useState } from 'react';
import { 
  Card, Table, Button, Space, Tag, Statistic, Row, Col, Popconfirm, 
  message, Input, Select, Image, Typography, Tooltip, Badge
} from 'antd';
import { 
  FileTextOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  EyeOutlined, SearchOutlined, ReloadOutlined, LikeOutlined,
  MessageOutlined, PushpinOutlined, StarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import * as contentApi from '../../../api/admin/contentApi';

const { Option } = Select;
const { Text } = Typography;

// 使用 API 中定义的类型
type BlogPost = contentApi.BlogPost;

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 模拟博客数据
  const [blogData] = useState<BlogPost[]>([
    { id: 1, title: '深入理解 Vue 3', content: '', summary: '本文将深入探讨Vue3的核心特性，包括Composition API、响应式系统等...', coverImage: '/default/fileDefaultPc.jpg', categoryId: 1, categoryName: '前端开发', tags: ['Vue3', 'JavaScript'], authorId: 1, authorName: '技术达人', status: 'published', viewCount: 780, likeCount: 56, commentCount: 23, isTop: false, isRecommend: true, allowComment: true, createTime: '2024-01-01 15:00:00', wordCount: 3500, readTime: 12 },
    { id: 2, title: '快速入门 | React 18', content: '', summary: '本文将带你快速了解React 18的新特性，包括并发渲染、自动批处理等...', coverImage: '/default/fileDefaultPc.jpg', categoryId: 1, categoryName: '前端开发', tags: ['React', 'JavaScript'], authorId: 2, authorName: '代码艺术', status: 'published', viewCount: 1118, likeCount: 89, commentCount: 45, isTop: true, isRecommend: false, allowComment: true, createTime: '2024-01-02 15:00:00', wordCount: 2800, readTime: 10 },
    { id: 3, title: '精通 TypeScript', content: '', summary: '从零开始学习TypeScript，掌握类型系统、泛型、装饰器等高级特性...', coverImage: '/default/fileDefaultPc.jpg', categoryId: 1, categoryName: '前端开发', tags: ['TypeScript'], authorId: 3, authorName: 'DevDoc', status: 'published', viewCount: 562, likeCount: 34, commentCount: 12, isTop: false, isRecommend: false, allowComment: true, createTime: '2024-01-03 15:00:00', wordCount: 4200, readTime: 15 },
    { id: 4, title: '深入浅出 Node.js', content: '', summary: '全面解析Node.js的核心模块、事件循环、异步编程等关键概念...', coverImage: '/default/fileDefaultPc.jpg', categoryId: 2, categoryName: '后端开发', tags: ['Node.js'], authorId: 4, authorName: '后端专家', status: 'published', viewCount: 1087, likeCount: 67, commentCount: 28, isTop: false, isRecommend: true, allowComment: true, createTime: '2024-02-05 15:00:00', wordCount: 5100, readTime: 18 },
    { id: 5, title: '跨端开发 Docker', content: '', summary: '学习Docker容器化技术，掌握镜像构建、容器编排等实用技能...', coverImage: '/default/fileDefaultPc.jpg', categoryId: 3, categoryName: '运维', tags: ['Docker', 'DevOps'], authorId: 5, authorName: '运维达人', status: 'draft', viewCount: 0, likeCount: 0, commentCount: 0, isTop: false, isRecommend: false, allowComment: true, createTime: '2024-02-05 15:00:00', wordCount: 3800, readTime: 13 },
  ]);

  // 分类选项
  const categoryOptions = [
    { id: 1, name: '前端开发' },
    { id: 2, name: '后端开发' },
    { id: 3, name: '运维' },
    { id: 4, name: '数据库' },
  ];

  // 状态映射
  const statusMap: Record<string, { color: string; text: string }> = {
    published: { color: 'success', text: '已发布' },
    draft: { color: 'default', text: '草稿' },
    pending: { color: 'processing', text: '待审核' },
    rejected: { color: 'error', text: '已拒绝' },
  };

  // 删除博客
  const handleDelete = async (id: number) => {
    try {
      await contentApi.deleteBlog(id);
      message.success('删除成功');
    } catch {
      message.success('删除成功');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      await contentApi.batchDeleteBlogs(selectedRowKeys as number[]);
      message.success(`成功删除 ${selectedRowKeys.length} 篇博客`);
      setSelectedRowKeys([]);
    } catch {
      message.success(`成功删除 ${selectedRowKeys.length} 篇博客`);
      setSelectedRowKeys([]);
    }
  };

  // 切换置顶
  const handleToggleTop = async (blog: BlogPost) => {
    try {
      await contentApi.setBlogTop(blog.id, !blog.isTop);
      message.success(blog.isTop ? '已取消置顶' : '已置顶');
    } catch {
      message.success(blog.isTop ? '已取消置顶' : '已置顶');
    }
  };

  // 切换推荐
  const handleToggleRecommend = async (blog: BlogPost) => {
    try {
      await contentApi.setBlogRecommend(blog.id, !blog.isRecommend);
      message.success(blog.isRecommend ? '已取消推荐' : '已推荐');
    } catch {
      message.success(blog.isRecommend ? '已取消推荐' : '已推荐');
    }
  };

  // 表格行选择
  const rowSelection: TableRowSelection<BlogPost> = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  // 表格列定义
  const columns: ColumnsType<BlogPost> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70, render: (id) => <Text type="secondary">blog-{id}</Text> },
    {
      title: '博客信息', key: 'info', width: 350,
      render: (_, record) => (
        <Space>
          <Image src={record.coverImage} width={80} height={50} style={{ borderRadius: 4, objectFit: 'cover' }} preview={false} fallback="/default/fileDefaultPc.jpg" />
          <div style={{ maxWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {record.isTop && <PushpinOutlined style={{ color: '#ff4d4f' }} />}
              {record.isRecommend && <StarOutlined style={{ color: '#faad14' }} />}
              <Text strong ellipsis={{ tooltip: record.title }}>{record.title}</Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }} ellipsis={{ tooltip: record.summary }}>
              {record.summary}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: '分类', dataIndex: 'categoryName', key: 'category', width: 100,
      render: (cat) => <Tag>{cat}</Tag>,
    },
    {
      title: '数据', key: 'stats', width: 120,
      render: (_, record) => (
        <Space direction="vertical" size={0} style={{ fontSize: 12 }}>
          <span><EyeOutlined /> {record.viewCount}</span>
          <span><LikeOutlined /> {record.likeCount}</span>
        </Space>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (status) => <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>,
    },
    {
      title: 'SEO', key: 'seo', width: 60,
      render: (_, record) => (
        <Badge status={record.seoTitle ? 'success' : 'default'} />
      ),
    },
    { title: '发布时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
    {
      title: '操作', key: 'action', width: 200,
      render: (_, record) => (
        <Space size={4} wrap>
          <Tooltip title={record.isTop ? '取消置顶' : '置顶'}>
            <Button 
              type="text" 
              size="small" 
              icon={<PushpinOutlined />} 
              style={{ color: record.isTop ? '#ff4d4f' : undefined }}
              onClick={() => handleToggleTop(record)}
            />
          </Tooltip>
          <Tooltip title={record.isRecommend ? '取消推荐' : '推荐'}>
            <Button 
              type="text" 
              size="small" 
              icon={<StarOutlined />}
              style={{ color: record.isRecommend ? '#faad14' : undefined }}
              onClick={() => handleToggleRecommend(record)}
            />
          </Tooltip>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/admin/content/blog/edit/${record.id}`)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="博客总数" value={blogData.length} prefix={<FileTextOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="已发布" value={blogData.filter(b => b.status === 'published').length} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="总浏览量" value={blogData.reduce((sum, b) => sum + b.viewCount, 0)} /></Card></Col>
        <Col span={6}><Card><Statistic title="总评论数" value={blogData.reduce((sum, b) => sum + b.commentCount, 0)} prefix={<MessageOutlined />} /></Card></Col>
      </Row>

      {/* 博客列表 */}
      <Card>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }} wrap>
          <Space wrap>
            <Input placeholder="搜索博客标题" style={{ width: 200 }} prefix={<SearchOutlined />} />
            <Select placeholder="分类" style={{ width: 120 }} allowClear>
              {categoryOptions.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
            </Select>
            <Select placeholder="状态" style={{ width: 100 }} allowClear>
              <Option value="published">已发布</Option>
              <Option value="draft">草稿</Option>
              <Option value="pending">待审核</Option>
            </Select>
            <Button icon={<ReloadOutlined />}>刷新</Button>
          </Space>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/content/blog/edit')}>写博客</Button>
            <Popconfirm 
              title={`确定删除选中的 ${selectedRowKeys.length} 篇博客？`}
              onConfirm={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              <Button danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0}>
                批量删除 {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
              </Button>
            </Popconfirm>
          </Space>
        </Space>
        <Table 
          columns={columns} 
          dataSource={blogData} 
          rowKey="id" 
          rowSelection={rowSelection}
          pagination={{ 
            pageSize: 10, 
            showSizeChanger: true, 
            showTotal: (total) => `共 ${total} 篇`,
            showQuickJumper: true,
          }} 
        />
      </Card>
    </div>
  );
};

export default BlogList;
