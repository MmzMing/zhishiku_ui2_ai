/**
 * 字典分类管理页面
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, Input, Select, Popconfirm, message, Modal, Form, Badge, Upload, Typography } from 'antd';
import { FolderOutlined, FileTextOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, UploadOutlined, DownloadOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import * as dictionaryApi from '../../../api/admin/dictionaryApi';

const { Text } = Typography;
const { Option } = Select;

const DictCategory: React.FC = () => {
  const navigate = useNavigate();
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);

  const categoryData = [
    { id: '1', code: 'sys_user_sex', name: '用户性别', type: 'system', itemCount: 3, status: 'enabled', remark: '系统内置字典' },
    { id: '2', code: 'sys_normal_disable', name: '状态', type: 'system', itemCount: 2, status: 'enabled', remark: '系统内置字典' },
    { id: '3', code: 'video_category', name: '视频分类', type: 'business', itemCount: 15, status: 'enabled', remark: '视频分类字典' },
    { id: '4', code: 'doc_category', name: '文档分类', type: 'business', itemCount: 12, status: 'enabled', remark: '文档分类字典' },
    { id: '5', code: 'point_type', name: '积分类型', type: 'business', itemCount: 8, status: 'enabled', remark: '积分变动类型' },
  ];

  const columns: ColumnsType<typeof categoryData[0]> = [
    { title: '字典编码', dataIndex: 'code', key: 'code', render: (code) => <Text code>{code}</Text> },
    { title: '字典名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type) => type === 'system' ? <Tag icon={<LockOutlined />} color="blue">系统字典</Tag> : <Tag color="green">业务字典</Tag> },
    { title: '字典项数', dataIndex: 'itemCount', key: 'itemCount' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => status === 'enabled' ? <Badge status="success" text="启用" /> : <Badge status="default" text="禁用" /> },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate('/admin/dictionary/items')}>字典项</Button>
          {record.type !== 'system' && (
            <>
              <Button type="text" size="small" icon={<EditOutlined />} />
              <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}>
                <Button type="text" size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="字典分类" value={categoryData.length} prefix={<FolderOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="系统字典" value={categoryData.filter(c => c.type === 'system').length} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="业务字典" value={categoryData.filter(c => c.type === 'business').length} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="字典项总数" value={40} prefix={<FileTextOutlined />} /></Card></Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search placeholder="搜索字典" style={{ width: 200 }} />
          <Select defaultValue="all" style={{ width: 120 }}><Option value="all">全部类型</Option><Option value="system">系统字典</Option><Option value="business">业务字典</Option></Select>
          <Button icon={<ReloadOutlined />}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddCategoryModalVisible(true)}>新增字典</Button>
          <Upload accept=".xlsx,.xls" showUploadList={false} beforeUpload={() => { message.info('导入中...'); return false; }}><Button icon={<UploadOutlined />}>导入</Button></Upload>
          <Button icon={<DownloadOutlined />}>导出</Button>
        </Space>
        <Table columns={columns} dataSource={categoryData} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title="新增字典分类" open={addCategoryModalVisible} onCancel={() => setAddCategoryModalVisible(false)} onOk={() => { message.success('新增成功'); setAddCategoryModalVisible(false); }}>
        <Form layout="vertical">
          <Form.Item label="字典编码" required><Input placeholder="请输入字典编码，如：video_category" /></Form.Item>
          <Form.Item label="字典名称" required><Input placeholder="请输入字典名称" /></Form.Item>
          <Form.Item label="备注"><Input.TextArea rows={3} placeholder="请输入备注" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DictCategory;
