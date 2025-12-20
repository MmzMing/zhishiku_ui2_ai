/**
 * 文档管理页面
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, Popconfirm, message, Modal, Form, Input, Select, Upload, DatePicker, Typography } from 'antd';
import { FileTextOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, ReloadOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import * as contentApi from '../../../api/admin/contentApi';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

const ContentList: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const contentData = [
    { id: 1, title: 'React 18新特性详解', category: '前端开发', author: '张三', status: 'published', views: 1250, downloads: 89, createTime: '2024-01-10', fileType: 'md' },
    { id: 2, title: 'TypeScript高级类型指南', category: '前端开发', author: '李四', status: 'published', views: 980, downloads: 56, createTime: '2024-01-12', fileType: 'pdf' },
    { id: 3, title: 'Node.js性能优化实践', category: '后端开发', author: '王五', status: 'draft', views: 0, downloads: 0, createTime: '2024-01-14', fileType: 'md' },
    { id: 4, title: 'Docker容器化部署指南', category: '运维', author: '赵六', status: 'pending', views: 0, downloads: 0, createTime: '2024-01-15', fileType: 'docx' },
    { id: 5, title: 'MySQL索引优化技巧', category: '数据库', author: '钱七', status: 'published', views: 2100, downloads: 156, createTime: '2024-01-08', fileType: 'pdf' },
  ];

  const statusMap: Record<string, { color: string; text: string }> = {
    published: { color: 'success', text: '已发布' },
    draft: { color: 'default', text: '草稿' },
    pending: { color: 'processing', text: '待审核' },
  };

  const columns: ColumnsType<typeof contentData[0]> = [
    { title: '文档标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '分类', dataIndex: 'category', key: 'category', render: (cat) => <Tag>{cat}</Tag> },
    { title: '作者', dataIndex: 'author', key: 'author' },
    { title: '格式', dataIndex: 'fileType', key: 'fileType', render: (type) => <Tag color="blue">{type.toUpperCase()}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag> },
    { title: '浏览', dataIndex: 'views', key: 'views' },
    { title: '下载', dataIndex: 'downloads', key: 'downloads' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '操作', key: 'action', width: 180,
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button type="text" size="small" icon={<DownloadOutlined />} />
          <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="文档总数" value={contentData.length} prefix={<FileTextOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="已发布" value={contentData.filter(c => c.status === 'published').length} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="总浏览量" value={contentData.reduce((sum, c) => sum + c.views, 0)} /></Card></Col>
        <Col span={6}><Card><Statistic title="总下载量" value={contentData.reduce((sum, c) => sum + c.downloads, 0)} /></Card></Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>新增文档</Button>
          <Input placeholder="搜索文档标题" style={{ width: 200 }} prefix={<SearchOutlined />} />
          <Select placeholder="分类" style={{ width: 120 }} allowClear>
            <Option value="frontend">前端开发</Option>
            <Option value="backend">后端开发</Option>
            <Option value="database">数据库</Option>
            <Option value="devops">运维</Option>
          </Select>
          <Select placeholder="状态" style={{ width: 100 }} allowClear>
            <Option value="published">已发布</Option>
            <Option value="draft">草稿</Option>
            <Option value="pending">待审核</Option>
          </Select>
          <RangePicker placeholder={['开始日期', '结束日期']} />
          <Button icon={<ReloadOutlined />}>刷新</Button>
        </Space>
        <Table columns={columns} dataSource={contentData} rowKey="id" pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 篇文档` }} />
      </Card>

      <Modal title="新增文档" open={addModalVisible} onCancel={() => setAddModalVisible(false)} onOk={() => { message.success('新增成功'); setAddModalVisible(false); }} width={600}>
        <Form layout="vertical">
          <Form.Item label="文档标题" required><Input placeholder="请输入文档标题" /></Form.Item>
          <Form.Item label="分类" required><Select placeholder="请选择分类"><Option value="frontend">前端开发</Option><Option value="backend">后端开发</Option><Option value="database">数据库</Option><Option value="devops">运维</Option></Select></Form.Item>
          <Form.Item label="上传文件"><Upload><Button icon={<UploadOutlined />}>选择文件</Button></Upload><Text type="secondary" style={{ marginLeft: 8 }}>支持 md, pdf, docx 格式</Text></Form.Item>
          <Form.Item label="文档描述"><Input.TextArea rows={3} placeholder="请输入文档描述" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentList;
