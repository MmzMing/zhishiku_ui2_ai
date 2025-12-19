/**
 * 标签管理页面
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, Popconfirm, message, Modal, Form, Input, Select, Typography } from 'antd';
import { TagOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { Text } = Typography;

const ContentTag: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const tagData = [
    { id: 1, name: 'React', color: '#1890ff', count: 45, status: 'enabled', createTime: '2024-01-01' },
    { id: 2, name: 'Vue', color: '#52c41a', count: 38, status: 'enabled', createTime: '2024-01-01' },
    { id: 3, name: 'TypeScript', color: '#722ed1', count: 56, status: 'enabled', createTime: '2024-01-02' },
    { id: 4, name: 'Node.js', color: '#13c2c2', count: 32, status: 'enabled', createTime: '2024-01-03' },
    { id: 5, name: 'Docker', color: '#fa8c16', count: 28, status: 'enabled', createTime: '2024-01-05' },
    { id: 6, name: 'MySQL', color: '#eb2f96', count: 41, status: 'enabled', createTime: '2024-01-06' },
    { id: 7, name: 'Redis', color: '#f5222d', count: 23, status: 'enabled', createTime: '2024-01-08' },
    { id: 8, name: '微服务', color: '#faad14', count: 19, status: 'disabled', createTime: '2024-01-10' },
  ];

  const colorOptions = [
    { value: '#1890ff', label: '蓝色' },
    { value: '#52c41a', label: '绿色' },
    { value: '#722ed1', label: '紫色' },
    { value: '#13c2c2', label: '青色' },
    { value: '#fa8c16', label: '橙色' },
    { value: '#eb2f96', label: '粉色' },
    { value: '#f5222d', label: '红色' },
    { value: '#faad14', label: '黄色' },
  ];

  const columns: ColumnsType<typeof tagData[0]> = [
    { title: '标签名称', dataIndex: 'name', key: 'name', render: (name, record) => <Tag color={record.color}>{name}</Tag> },
    { title: '颜色', dataIndex: 'color', key: 'color', render: (color) => <div style={{ width: 20, height: 20, background: color, borderRadius: 4 }} /> },
    { title: '关联文档', dataIndex: 'count', key: 'count' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'enabled' ? 'success' : 'default'}>{status === 'enabled' ? '启用' : '禁用'}</Tag> },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '操作', key: 'action',
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="标签总数" value={tagData.length} prefix={<TagOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="启用标签" value={tagData.filter(t => t.status === 'enabled').length} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="关联文档" value={tagData.reduce((sum, t) => sum + t.count, 0)} /></Card></Col>
        <Col span={6}><Card><Statistic title="热门标签" value="TypeScript" valueStyle={{ fontSize: 16 }} /></Card></Col>
      </Row>

      <Card title="热门标签" style={{ marginBottom: 16 }}>
        <Space wrap>
          {tagData.sort((a, b) => b.count - a.count).slice(0, 10).map(tag => (
            <Tag key={tag.id} color={tag.color} style={{ padding: '4px 12px', fontSize: 14 }}>{tag.name} ({tag.count})</Tag>
          ))}
        </Space>
      </Card>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>新增标签</Button>
          <Input placeholder="搜索标签" style={{ width: 200 }} prefix={<SearchOutlined />} />
          <Select placeholder="状态" style={{ width: 100 }} allowClear>
            <Option value="enabled">启用</Option>
            <Option value="disabled">禁用</Option>
          </Select>
          <Button icon={<ReloadOutlined />}>刷新</Button>
        </Space>
        <Table columns={columns} dataSource={tagData} rowKey="id" pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 个标签` }} />
      </Card>

      <Modal title="新增标签" open={addModalVisible} onCancel={() => setAddModalVisible(false)} onOk={() => { message.success('新增成功'); setAddModalVisible(false); }}>
        <Form layout="vertical">
          <Form.Item label="标签名称" required><Input placeholder="请输入标签名称" /></Form.Item>
          <Form.Item label="标签颜色" required>
            <Select placeholder="请选择颜色">
              {colorOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  <Space><div style={{ width: 16, height: 16, background: opt.value, borderRadius: 2 }} />{opt.label}</Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="描述"><Input.TextArea rows={2} placeholder="请输入标签描述" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentTag;
