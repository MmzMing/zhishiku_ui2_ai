/**
 * 角色权限管理页面
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, Popconfirm, message, Modal, Form, Input, Badge } from 'antd';
import { SafetyOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';

const { Text } = Typography;

const RolePermission: React.FC = () => {
  const [addRoleModalVisible, setAddRoleModalVisible] = useState(false);

  const roleData = [
    { id: 1, name: '超级管理员', code: 'admin', userCount: 1, permissions: 128, status: 'enabled', remark: '拥有所有权限' },
    { id: 2, name: '编辑员', code: 'editor', userCount: 5, permissions: 45, status: 'enabled', remark: '内容编辑权限' },
    { id: 3, name: '普通用户', code: 'user', userCount: 1320, permissions: 12, status: 'enabled', remark: '基础浏览权限' },
    { id: 4, name: 'VIP用户', code: 'vip', userCount: 156, permissions: 25, status: 'enabled', remark: 'VIP专属权限' },
  ];

  const columns: ColumnsType<typeof roleData[0]> = [
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '角色编码', dataIndex: 'code', key: 'code', render: (code) => <Text code>{code}</Text> },
    { title: '用户数', dataIndex: 'userCount', key: 'userCount' },
    { title: '权限数', dataIndex: 'permissions', key: 'permissions' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => status === 'enabled' ? <Badge status="success" text="启用" /> : <Badge status="default" text="禁用" /> },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">权限配置</Button>
          <Button type="text" size="small" icon={<EditOutlined />} />
          {record.code !== 'admin' && (
            <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}>
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="角色总数" value={roleData.length} prefix={<SafetyOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="权限点总数" value={128} /></Card></Col>
        <Col span={6}><Card><Statistic title="已分配用户" value={1328} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日变更" value={3} /></Card></Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddRoleModalVisible(true)}>新增角色</Button>
          <Button icon={<ReloadOutlined />}>刷新</Button>
        </Space>
        <Table columns={columns} dataSource={roleData} rowKey="id" pagination={false} />
      </Card>

      <Modal title="新增角色" open={addRoleModalVisible} onCancel={() => setAddRoleModalVisible(false)} onOk={() => { message.success('新增成功'); setAddRoleModalVisible(false); }}>
        <Form layout="vertical">
          <Form.Item label="角色名称" required><Input placeholder="请输入角色名称" /></Form.Item>
          <Form.Item label="角色编码" required><Input placeholder="请输入角色编码" /></Form.Item>
          <Form.Item label="备注"><Input.TextArea rows={3} placeholder="请输入备注" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RolePermission;
