/**
 * 字典项管理页面
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Select, Popconfirm, message, Modal, Form, Input, Switch, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, DragOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;
const { Option } = Select;

const DictItems: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('sys_user_sex');
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);

  const categoryData = [
    { code: 'sys_user_sex', name: '用户性别' },
    { code: 'video_category', name: '视频分类' },
    { code: 'doc_category', name: '文档分类' },
    { code: 'point_type', name: '积分类型' },
  ];

  const itemData = [
    { id: '1', dictCode: 'sys_user_sex', label: '男', value: '0', sort: 1, status: 'enabled', isDefault: true },
    { id: '2', dictCode: 'sys_user_sex', label: '女', value: '1', sort: 2, status: 'enabled', isDefault: false },
    { id: '3', dictCode: 'sys_user_sex', label: '未知', value: '2', sort: 3, status: 'enabled', isDefault: false },
  ];

  const columns: ColumnsType<typeof itemData[0]> = [
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80, render: () => <DragOutlined style={{ cursor: 'move', color: '#999' }} /> },
    { title: '字典标签', dataIndex: 'label', key: 'label' },
    { title: '字典值', dataIndex: 'value', key: 'value', render: (val) => <Text code>{val}</Text> },
    { title: '默认', dataIndex: 'isDefault', key: 'isDefault', render: (isDefault) => isDefault ? <Tag color="blue">默认</Tag> : null },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => <Switch checked={status === 'enabled'} checkedChildren="启用" unCheckedChildren="禁用" onChange={(checked) => message.success(checked ? '已启用' : '已禁用')} /> },
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
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Text>当前字典：</Text>
          <Select value={selectedCategory} onChange={setSelectedCategory} style={{ width: 200 }}>
            {categoryData.map(cat => (<Option key={cat.code} value={cat.code}>{cat.name}</Option>))}
          </Select>
        </Space>
      </Card>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddItemModalVisible(true)}>新增字典项</Button>
          <Button icon={<ReloadOutlined />}>刷新</Button>
        </Space>
        <Table columns={columns} dataSource={itemData.filter(item => item.dictCode === selectedCategory)} rowKey="id" pagination={false} />
      </Card>

      <Modal title="新增字典项" open={addItemModalVisible} onCancel={() => setAddItemModalVisible(false)} onOk={() => { message.success('新增成功'); setAddItemModalVisible(false); }}>
        <Form layout="vertical">
          <Form.Item label="字典标签" required><Input placeholder="请输入字典标签" /></Form.Item>
          <Form.Item label="字典值" required><Input placeholder="请输入字典值" /></Form.Item>
          <Form.Item label="排序"><Input type="number" placeholder="请输入排序号" /></Form.Item>
          <Form.Item label="设为默认"><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DictItems;
