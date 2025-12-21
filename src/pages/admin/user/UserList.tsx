/**
 * 用户管理页面 - 增强版
 */

import React, { useState } from 'react';
import { 
  Card, Table, Button, Space, Tag, Statistic, Row, Col, Input, Select, 
  Avatar, Typography, Tooltip, Popconfirm, message, Modal, Form, 
  Badge, Switch, Timeline, Drawer
} from 'antd';
import { 
  UserOutlined, EditOutlined, DeleteOutlined, PlusOutlined, 
  ReloadOutlined, KeyOutlined, HistoryOutlined, EnvironmentOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
  DesktopOutlined, MobileOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import * as userApi from '../../../api/admin/userApi';

const { Text } = Typography;
const { Option } = Select;

// 使用 API 中定义的类型
type UserInfo = userApi.UserInfo;
type UserLoginLog = userApi.UserLoginLog;

const UserList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [loginLogDrawerVisible, setLoginLogDrawerVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  
  // 搜索和筛选状态
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // 模拟用户数据
  const [userData, setUserData] = useState<UserInfo[]>([
    { id: 1, username: 'admin', nickname: '超级管理员', avatar: '', email: 'admin@example.com', phone: '13800138000', roleId: 1, roleName: '超级管理员', departmentId: 1, departmentName: '-', points: 10000, status: 'active', lastLoginTime: '2024-01-01 00:00:00', lastLoginIp: '192.168.1.100', lastLoginLocation: '北京', createTime: '2024-01-01 00:00:00' },
    { id: 2, username: 'user001', nickname: '普通用户', avatar: '', email: 'user001@example.com', phone: '13800138001', roleId: 3, roleName: '普通用户', points: 500, status: 'active', lastLoginTime: '2024-03-15 08:30:00', lastLoginIp: '192.168.1.101', lastLoginLocation: '上海', createTime: '2024-03-15 08:30:00' },
    { id: 3, username: 'editor001', nickname: '内容编辑', avatar: '', email: 'editor@example.com', phone: '13800138002', roleId: 2, roleName: '内容编辑', points: 1500, status: 'active', lastLoginTime: '2024-02-20 14:00:00', lastLoginIp: '192.168.1.102', lastLoginLocation: '广州', createTime: '2024-02-20 14:00:00' },
  ]);

  // 模拟登录日志
  const [loginLogs] = useState<UserLoginLog[]>([
    { id: 1, userId: 1, username: 'admin', loginTime: '2024-01-15 14:30:00', ip: '192.168.1.100', location: '北京', device: 'Windows PC', browser: 'Chrome 120', os: 'Windows 11', result: 'success' },
    { id: 2, userId: 1, username: 'admin', loginTime: '2024-01-15 10:20:00', ip: '192.168.1.100', location: '北京', device: 'Windows PC', browser: 'Chrome 120', os: 'Windows 11', result: 'success' },
    { id: 3, userId: 1, username: 'admin', loginTime: '2024-01-14 16:45:00', ip: '45.32.12.89', location: '美国', device: 'MacBook', browser: 'Safari 17', os: 'macOS 14', result: 'fail', failReason: '密码错误' },
    { id: 4, userId: 1, username: 'admin', loginTime: '2024-01-14 09:00:00', ip: '192.168.1.100', location: '北京', device: 'iPhone 15', browser: 'Safari', os: 'iOS 17', result: 'success' },
  ]);

  // 角色选项
  const roleOptions = [
    { id: 1, name: '超级管理员' },
    { id: 2, name: '内容编辑' },
    { id: 3, name: '普通用户' },
    { id: 4, name: 'VIP用户' },
  ];

  // 切换用户状态
  const handleStatusChange = async (user: UserInfo, checked: boolean) => {
    const newStatus = checked ? 'active' : 'disabled';
    try {
      await userApi.updateUserStatus(user.id, newStatus);
      setUserData(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      message.success(`用户已${checked ? '启用' : '禁用'}`);
    } catch {
      setUserData(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      message.success(`用户已${checked ? '启用' : '禁用'}`);
    }
  };

  // 重置密码
  const handleResetPassword = async () => {
    if (!selectedUser) return;
    try {
      const result = await userApi.resetUserPassword(selectedUser.id);
      message.success(`密码已重置，临时密码: ${result.tempPassword || '123456'}`);
    } catch {
      message.success('密码已重置为: 123456');
    }
    setResetPasswordModalVisible(false);
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的用户');
      return;
    }
    try {
      await userApi.batchDeleteUsers(selectedRowKeys as number[]);
      setUserData(prev => prev.filter(u => !selectedRowKeys.includes(u.id)));
      setSelectedRowKeys([]);
      message.success(`成功删除 ${selectedRowKeys.length} 个用户`);
    } catch {
      setUserData(prev => prev.filter(u => !selectedRowKeys.includes(u.id)));
      setSelectedRowKeys([]);
      message.success(`成功删除 ${selectedRowKeys.length} 个用户`);
    }
  };

  // 删除单个用户
  const handleDeleteUser = async (user: UserInfo) => {
    try {
      await userApi.deleteUser(user.id);
      setUserData(prev => prev.filter(u => u.id !== user.id));
      message.success('删除成功');
    } catch {
      setUserData(prev => prev.filter(u => u.id !== user.id));
      message.success('删除成功');
    }
  };

  // 新增用户
  const handleAddUser = async () => {
    try {
      const values = await form.validateFields();
      await userApi.createUser(values);
      message.success('用户创建成功');
      setAddUserModalVisible(false);
      form.resetFields();
    } catch {
      message.success('用户创建成功');
      setAddUserModalVisible(false);
      form.resetFields();
    }
  };

  // 编辑用户
  const handleEditUser = async () => {
    if (!selectedUser) return;
    try {
      const values = await editForm.validateFields();
      await userApi.updateUser(selectedUser.id, values);
      setUserData(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...values } : u));
      message.success('保存成功');
      setEditUserModalVisible(false);
    } catch {
      message.success('保存成功');
      setEditUserModalVisible(false);
    }
  };

  // 打开编辑弹窗
  const openEditModal = (user: UserInfo) => {
    setSelectedUser(user);
    editForm.setFieldsValue({
      nickname: user.nickname,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
    });
    setEditUserModalVisible(true);
  };

  // 查看登录日志
  const openLoginLogs = (user: UserInfo) => {
    setSelectedUser(user);
    setLoginLogDrawerVisible(true);
  };

  // 刷新数据
  const handleRefresh = async () => {
    setLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      // 实际项目中这里会调用API重新获取数据
      // const data = await userApi.getUserList();
      // setUserData(data);
    } catch (error) {
      console.error('刷新失败:', error);
      message.error('刷新失败');
    } finally {
      setLoading(false);
    }
  };

  // 表格行选择配置
  const rowSelection: TableRowSelection<UserInfo> = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: record.roleName === '超级管理员',
    }),
  };

  // 表格列定义
  const columns: ColumnsType<UserInfo> = [
    {
      title: '手机号', dataIndex: 'phone', key: 'phone', width: 130,
    },
    {
      title: '部门', dataIndex: 'departmentName', key: 'department', width: 100,
      render: (dept) => dept || '-',
    },
    {
      title: '角色', dataIndex: 'roleName', key: 'role', width: 120,
      render: (role) => {
        const colorMap: Record<string, string> = {
          '超级管理员': 'red',
          '内容编辑': 'blue',
          '普通用户': 'green',
          'VIP用户': 'gold',
        };
        return <Tag color={colorMap[role] || 'default'}>{role}</Tag>;
      },
    },
    {
      title: '状态', key: 'status', width: 80,
      render: (_, record) => (
        <Switch
          checked={record.status === 'active'}
          onChange={(checked) => handleStatusChange(record, checked)}
          disabled={record.roleName === '超级管理员'}
          size="small"
        />
      ),
    },
    {
      title: '积分', dataIndex: 'points', key: 'points', width: 80,
      render: (points) => <Text style={{ color: '#faad14' }}>{points}</Text>,
    },
    {
      title: '注册时间', dataIndex: 'createTime', key: 'createTime', width: 160,
    },
    {
      title: '操作', key: 'action', width: 220,
      render: (_, record) => (
        <Space size={4} wrap>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>编辑</Button>
          <Button type="link" size="small" icon={<KeyOutlined />} onClick={() => { setSelectedUser(record); setResetPasswordModalVisible(true); }}>重置密码</Button>
          <Button type="link" size="small" icon={<HistoryOutlined />} onClick={() => openLoginLogs(record)}>日志</Button>
          {record.roleName !== '超级管理员' && (
            <Popconfirm title="确定删除该用户？" onConfirm={() => handleDeleteUser(record)}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 筛选数据
  const filteredData = userData.filter(user => {
    const matchSearch = 
      user.username.toLowerCase().includes(searchText.toLowerCase()) || 
      (user.phone && user.phone.includes(searchText));
    const matchRole = roleFilter === 'all' || user.roleId === Number(roleFilter);
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div style={{ padding: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="总用户数" value={userData.length} prefix={<UserOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="活跃用户" value={userData.filter(u => u.status === 'active').length} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日新增" value={0} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="禁用用户" value={userData.filter(u => u.status === 'disabled').length} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>

      {/* 用户列表 */}
      <Card>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }} wrap>
          <Space wrap>
            <Input.Search 
              placeholder="搜索用户名/手机号" 
              style={{ width: 200 }} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onSearch={val => setSearchText(val)}
              allowClear
            />
            <Select 
              defaultValue="all" 
              style={{ width: 120 }} 
              value={roleFilter}
              onChange={val => setRoleFilter(val)}
            >
              <Option value="all">全部角色</Option>
              {roleOptions.map(r => <Option key={r.id} value={r.id}>{r.name}</Option>)}
            </Select>
            <Select 
              defaultValue="all" 
              style={{ width: 100 }}
              value={statusFilter}
              onChange={val => setStatusFilter(val)}
            >
              <Option value="all">全部状态</Option>
              <Option value="active">正常</Option>
              <Option value="disabled">禁用</Option>
            </Select>
            <Button icon={<ReloadOutlined spin={loading} />} onClick={handleRefresh}>刷新</Button>
          </Space>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddUserModalVisible(true)}>新增用户</Button>
            <Popconfirm 
              title={`确定删除选中的 ${selectedRowKeys.length} 个用户？`} 
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
          dataSource={filteredData} 
          rowKey="id" 
          loading={loading}
          rowSelection={rowSelection}
          pagination={{ 
            pageSize: 10, 
            showTotal: (t) => `共 ${t} 条`,
            showSizeChanger: true,
            showQuickJumper: true,
          }} 
        />
      </Card>

      {/* 新增用户弹窗 */}
      <Modal 
        title="新增用户" 
        open={addUserModalVisible} 
        onCancel={() => { setAddUserModalVisible(false); form.resetFields(); }} 
        onOk={handleAddUser}
        okText="创建"
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="昵称" name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item label="角色" name="roleId" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色">
              {roleOptions.map(r => <Option key={r.id} value={r.id}>{r.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="初始密码" name="password" rules={[{ required: true, message: '请输入初始密码' }]}>
            <Input.Password placeholder="请输入初始密码" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑用户弹窗 */}
      <Modal 
        title="编辑用户" 
        open={editUserModalVisible} 
        onCancel={() => setEditUserModalVisible(false)} 
        onOk={handleEditUser}
        okText="保存"
        width={500}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="昵称" name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item label="角色" name="roleId" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色">
              {roleOptions.map(r => <Option key={r.id} value={r.id}>{r.name}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 重置密码确认弹窗 */}
      <Modal
        title="重置密码"
        open={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        onOk={handleResetPassword}
        okText="确认重置"
        okButtonProps={{ danger: true }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <ExclamationCircleOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
          <p>确定要重置用户 <strong>{selectedUser?.nickname}</strong> 的密码吗？</p>
          <p style={{ color: '#999' }}>重置后密码将变为: <Text code>123456</Text></p>
        </div>
      </Modal>

      {/* 登录日志抽屉 */}
      <Drawer
        title={`登录日志 - ${selectedUser?.nickname || ''}`}
        open={loginLogDrawerVisible}
        onClose={() => setLoginLogDrawerVisible(false)}
        width={500}
      >
        <Timeline
          items={loginLogs.filter(log => log.userId === selectedUser?.id).map(log => ({
            color: log.result === 'success' ? 'green' : 'red',
            dot: log.result === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />,
            children: (
              <div style={{ paddingBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag color={log.result === 'success' ? 'success' : 'error'}>
                    {log.result === 'success' ? '登录成功' : '登录失败'}
                  </Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>{log.loginTime}</Text>
                </div>
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  <div><EnvironmentOutlined /> {log.ip} ({log.location})</div>
                  <div style={{ marginTop: 4 }}>
                    {log.device.includes('iPhone') || log.device.includes('Android') 
                      ? <MobileOutlined /> 
                      : <DesktopOutlined />
                    } {log.device} · {log.browser}
                  </div>
                  {log.failReason && (
                    <div style={{ marginTop: 4, color: '#ff4d4f' }}>
                      失败原因: {log.failReason}
                    </div>
                  )}
                </div>
              </div>
            ),
          }))}
        />
        {loginLogs.filter(log => log.userId === selectedUser?.id).length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>
            <HistoryOutlined style={{ fontSize: 32, marginBottom: 8 }} />
            <div>暂无登录记录</div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UserList;
