/**
 * 内容分类管理页面
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, Popconfirm, message, Modal, Form, Input, Select, Tree, Typography } from 'antd';
import { FolderOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import * as contentApi from '../../../api/admin/contentApi';

const { Option } = Select;
const { Text } = Typography;

const ContentCategory: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const categoryData = [
    { id: 1, name: '前端开发', parent: '-', count: 156, sort: 1, status: 'enabled' },
    { id: 2, name: 'React', parent: '前端开发', count: 45, sort: 1, status: 'enabled' },
    { id: 3, name: 'Vue', parent: '前端开发', count: 38, sort: 2, status: 'enabled' },
    { id: 4, name: '后端开发', parent: '-', count: 98, sort: 2, status: 'enabled' },
    { id: 5, name: 'Node.js', parent: '后端开发', count: 32, sort: 1, status: 'enabled' },
    { id: 6, name: 'Java', parent: '后端开发', count: 28, sort: 2, status: 'enabled' },
    { id: 7, name: '数据库', parent: '-', count: 67, sort: 3, status: 'enabled' },
    { id: 8, name: '运维', parent: '-', count: 45, sort: 4, status: 'enabled' },
  ];

  const treeData: DataNode[] = [
    { title: '前端开发 (156)', key: '1', icon: <FolderOutlined />, children: [
      { title: 'React (45)', key: '2', icon: <FolderOutlined /> },
      { title: 'Vue (38)', key: '3', icon: <FolderOutlined /> },
    ]},
    { title: '后端开发 (98)', key: '4', icon: <FolderOutlined />, children: [
      { title: 'Node.js (32)', key: '5', icon: <FolderOutlined /> },
      { title: 'Java (28)', key: '6', icon: <FolderOutlined /> },
    ]},
    { title: '数据库 (67)', key: '7', icon: <FolderOutlined /> },
    { title: '运维 (45)', key: '8', icon: <FolderOutlined /> },
  ];

  const columns: ColumnsType<typeof categoryData[0]> = [
    { title: '分类名称', dataIndex: 'name', key: 'name' },
    { title: '父级分类', dataIndex: 'parent', key: 'parent', render: (parent) => parent === '-' ? <Text type="secondary">顶级分类</Text> : parent },
    { title: '文档数量', dataIndex: 'count', key: 'count' },
    { title: '排序', dataIndex: 'sort', key: 'sort' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'enabled' ? 'success' : 'default'}>{status === 'enabled' ? '启用' : '禁用'}</Tag> },
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
        <Col span={6}><Card><Statistic title="分类总数" value={categoryData.length} prefix={<FolderOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="顶级分类" value={categoryData.filter(c => c.parent === '-').length} /></Card></Col>
        <Col span={6}><Card><Statistic title="子分类" value={categoryData.filter(c => c.parent !== '-').length} /></Card></Col>
        <Col span={6}><Card><Statistic title="关联文档" value={categoryData.reduce((sum, c) => sum + c.count, 0)} /></Card></Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="分类树" extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>新增</Button>}>
            <Tree showIcon defaultExpandAll treeData={treeData} />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="分类列表">
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>新增分类</Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
            </Space>
            <Table columns={columns} dataSource={categoryData} rowKey="id" pagination={false} />
          </Card>
        </Col>
      </Row>

      <Modal title="新增分类" open={addModalVisible} onCancel={() => setAddModalVisible(false)} onOk={() => { message.success('新增成功'); setAddModalVisible(false); }}>
        <Form layout="vertical">
          <Form.Item label="分类名称" required><Input placeholder="请输入分类名称" /></Form.Item>
          <Form.Item label="父级分类"><Select placeholder="请选择父级分类" allowClear><Option value="">顶级分类</Option><Option value="1">前端开发</Option><Option value="4">后端开发</Option><Option value="7">数据库</Option><Option value="8">运维</Option></Select></Form.Item>
          <Form.Item label="排序"><Input type="number" placeholder="请输入排序号" /></Form.Item>
          <Form.Item label="描述"><Input.TextArea rows={2} placeholder="请输入分类描述" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentCategory;
