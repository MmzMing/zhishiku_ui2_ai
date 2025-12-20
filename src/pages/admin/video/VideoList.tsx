/**
 * 视频列表页面
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, Input, Select, Image, Typography, Tooltip, Popconfirm, message, Modal, Form } from 'antd';
import { PlayCircleOutlined, EyeOutlined, LikeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import * as videoApi from '../../../api/admin/videoApi';

const { Text } = Typography;
const { Option } = Select;

const VideoList: React.FC = () => {
  const navigate = useNavigate();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form] = Form.useForm();

  // 搜索视频
  const handleSearch = async (value: string) => {
    setSearchKeyword(value);
    setLoading(true);
    try {
      // 调用搜索API
      await videoApi.searchVideos({
        keyword: value,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: 1,
        pageSize: 10
      });
      message.success('搜索完成');
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  // 刷新数据
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await videoApi.getVideoList({
        page: 1,
        pageSize: 10,
        keyword: searchKeyword,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      message.success('刷新成功');
    } catch (error) {
      message.error('刷新失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除视频
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await videoApi.deleteVideo(id);
      message.success('删除成功');
      handleRefresh();
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 编辑视频
  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      await videoApi.updateVideo(selectedVideo.id, values);
      message.success('保存成功');
      setEditModalVisible(false);
      handleRefresh();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 预览视频
  const handlePreview = (record: any) => {
    window.open(`/video/${record.id}`, '_blank');
  };

  // 分类筛选
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    handleSearch(searchKeyword);
  };

  // 状态筛选
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    handleSearch(searchKeyword);
  };
  const videoData = [
    { id: 1, title: 'React 18 新特性详解', cover: 'https://picsum.photos/160/90?random=1', category: '前端开发', duration: '45:30', views: 12580, likes: 856, status: 'online', author: '前端专家', createTime: '2024-12-18' },
    { id: 2, title: 'Node.js 微服务架构', cover: 'https://picsum.photos/160/90?random=2', category: '后端开发', duration: '1:23:00', views: 8920, likes: 623, status: 'online', author: '架构师', createTime: '2024-12-17' },
    { id: 3, title: 'Vue 3 组合式API教程', cover: 'https://picsum.photos/160/90?random=3', category: '前端开发', duration: '58:20', views: 6540, likes: 412, status: 'reviewing', author: 'Vue专家', createTime: '2024-12-19' },
    { id: 4, title: 'Docker 容器化部署', cover: 'https://picsum.photos/160/90?random=4', category: '运维', duration: '1:05:00', views: 4230, likes: 298, status: 'offline', author: '运维工程师', createTime: '2024-12-15' },
  ];

  const columns: ColumnsType<typeof videoData[0]> = [
    {
      title: '视频信息', key: 'info', width: 350,
      render: (_, record) => (
        <Space>
          <div style={{ position: 'relative' }}>
            <Image src={record.cover} width={120} height={68} style={{ borderRadius: 4, objectFit: 'cover' }} preview={false} />
            <span style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0 4px', borderRadius: 2, fontSize: 12 }}>{record.duration}</span>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>{record.title}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.author} · {record.createTime}</Text>
          </div>
        </Space>
      ),
    },
    { title: '分类', dataIndex: 'category', key: 'category', render: (cat) => <Tag>{cat}</Tag> },
    {
      title: '数据', key: 'stats',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text><EyeOutlined /> {record.views.toLocaleString()}</Text>
          <Text><LikeOutlined /> {record.likes.toLocaleString()}</Text>
        </Space>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status) => {
        const config: Record<string, { color: string; text: string }> = {
          online: { color: 'success', text: '已上架' },
          offline: { color: 'default', text: '已下架' },
          reviewing: { color: 'processing', text: '审核中' },
        };
        return <Tag color={config[status]?.color}>{config[status]?.text}</Tag>;
      },
    },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="编辑"><Button type="text" icon={<EditOutlined />} onClick={() => { setSelectedVideo(record); form.setFieldsValue(record); setEditModalVisible(true); }} /></Tooltip>
          <Tooltip title="预览"><Button type="text" icon={<EyeOutlined />} onClick={() => handlePreview(record)} /></Tooltip>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Tooltip title="删除"><Button type="text" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="视频总数" value={892} prefix={<PlayCircleOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="已上架" value={756} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="待审核" value={45} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日播放" value={25800} prefix={<EyeOutlined />} /></Card></Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search 
            placeholder="搜索视频" 
            style={{ width: 200 }} 
            onSearch={handleSearch}
            loading={loading}
          />
          <Select 
            defaultValue="all" 
            style={{ width: 120 }}
            onChange={handleCategoryChange}
          >
            <Option value="all">全部分类</Option>
            <Option value="frontend">前端开发</Option>
            <Option value="backend">后端开发</Option>
            <Option value="devops">运维</Option>
          </Select>
          <Select 
            defaultValue="all" 
            style={{ width: 120 }}
            onChange={handleStatusChange}
          >
            <Option value="all">全部状态</Option>
            <Option value="online">已上架</Option>
            <Option value="offline">已下架</Option>
            <Option value="reviewing">审核中</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/video/upload')}>上传视频</Button>
        </Space>
        <Table 
          columns={columns} 
          dataSource={videoData} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }} 
        />
      </Card>

      <Modal 
        title="编辑视频" 
        open={editModalVisible} 
        onCancel={() => setEditModalVisible(false)} 
        onOk={handleEdit}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="视频标题" name="title" rules={[{ required: true, message: '请输入视频标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="视频分类" name="category" rules={[{ required: true, message: '请选择视频分类' }]}>
            <Select>
              <Option value="前端开发">前端开发</Option>
              <Option value="后端开发">后端开发</Option>
              <Option value="运维">运维</Option>
            </Select>
          </Form.Item>
          <Form.Item label="视频状态" name="status" rules={[{ required: true, message: '请选择视频状态' }]}>
            <Select>
              <Option value="online">上架</Option>
              <Option value="offline">下架</Option>
              <Option value="reviewing">审核中</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VideoList;
