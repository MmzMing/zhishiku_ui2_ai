/**
 * 用户管理页面
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, Input, Select, Avatar, Typography, Tooltip, Popconfirm, message, Modal, Form, Badge, Descriptions } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, EyeOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;
const { Option } = Select;

const UserList: React.FC = () => {
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [userDetailModalVisible, setUserDetailModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const userData = [
    { id: 1, username: 'admin', nickname: '超级管理员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', email: 'admin@example.com', phone: '138****1234', role: '超级管理员', department: '技术部', status: 'active', lastLogin: '2024-12-19 14:30:00', createTime: '2024-01-01' },
    { id: 2, username: 'editor', nickname: '内容编辑', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor', email: 'editor@example.com', phone: '139****5678', role: '编辑员', department: '内容部', status: 'active', lastLogin: '2024-12-19 10:15:00', createTime: '2024-03-15' },
    { id: 3, username: 'user001', nickname: '普通用户', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', email: 'user001@example.com', phone: '137****9012', role: '普通用户', department: '市场部', status: 'active', lastLogin: '2024-12-18 16:45:00', createTime: '2024-06-20' },
    { id: 4, username: 'user002', nickname: '测试用户', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', email: 'user002@example.com', phone: '136****3456', role: '普通用户', department: '测试部', status: 'disabled', lastLogin: '2024-12-10 09:00:00', createTime: '2024-08-10' },
  ];

  const columns: ColumnsType<typeof userData[0]> = [
    {
      title: '用户信息', key: 'info', width: 250,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong>{record.nickname}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>@{record.username}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式', key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text><MailOutlined /> {record.email}</Text>
          <Text><PhoneOutlined /> {record.phone}</Text>
        </Space>
      ),
    },
    { title: '角色', dataIndex: 'role', key: 'role', render: (role) => <Tag color="blue">{role}</Tag> },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => status === 'active' ? <Badge status="success" text="正常" /> : <Badge status="error" text="禁用" /> },
    { title: '最后登录', dataIndex: 'lastLogin', key: 'lastLogin' },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情"><Button type="text" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedUser(record); setUserDetailModalVisible(true); }} /></Tooltip>
          <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} /></Tooltip>
          <Tooltip title={record.status === 'active' ? '禁用' : '启用'}><Button type="text" size="small" icon={record.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />} /></Tooltip>
          <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}><Tooltip title="删除"><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Tooltip></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="总用户数" value={1328} prefix={<UserOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="活跃用户" value={1156} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日新增" value={12} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="禁用用户" value={45} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search placeholder="搜索用户" style={{ width: 200 }} />
          <Select defaultValue="all" style={{ width: 120 }}><Option value="all">全部角色</Option><Option value="admin">管理员</Option><Option value="user">普通用户</Option></Select>
          <Select defaultValue="all" style={{ width: 120 }}><Option value="all">全部状态</Option><Option value="active">正常</Option><Option value="disabled">禁用</Option></Select>
          <Button icon={<ReloadOutlined />}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddUserModalVisible(true)}>新增用户</Button>
        </Space>
        <Table columns={columns} dataSource={userData} rowKey="id" pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }} />
      </Card>

      <Modal title="新增用户" open={addUserModalVisible} onCancel={() => setAddUserModalVisible(false)} onOk={() => { message.success('新增成功'); setAddUserModalVisible(false); }} width={600}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item label="用户名" required><Input placeholder="请输入用户名" /></Form.Item></Col>
            <Col span={12}><Form.Item label="昵称" required><Input placeholder="请输入昵称" /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="邮箱"><Input placeholder="请输入邮箱" /></Form.Item></Col>
            <Col span={12}><Form.Item label="手机号"><Input placeholder="请输入手机号" /></Form.Item></Col>
          </Row>
          <Form.Item label="初始密码" required><Input.Password placeholder="请输入初始密码" /></Form.Item>
        </Form>
      </Modal>

      <Modal title="用户详情" open={userDetailModalVisible} onCancel={() => setUserDetailModalVisible(false)} footer={null} width={600}>
        {selectedUser && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="头像" span={2}><Avatar src={selectedUser.avatar} size={64} /></Descriptions.Item>
            <Descriptions.Item label="用户名">{selectedUser.username}</Descriptions.Item>
            <Descriptions.Item label="昵称">{selectedUser.nickname}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="手机号">{selectedUser.phone}</Descriptions.Item>
            <Descriptions.Item label="角色">{selectedUser.role}</Descriptions.Item>
            <Descriptions.Item label="部门">{selectedUser.department}</Descriptions.Item>
            <Descriptions.Item label="状态">{selectedUser.status === 'active' ? <Badge status="success" text="正常" /> : <Badge status="error" text="禁用" />}</Descriptions.Item>
            <Descriptions.Item label="注册时间">{selectedUser.createTime}</Descriptions.Item>
            <Descriptions.Item label="最后登录" span={2}>{selectedUser.lastLogin}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default UserList;
