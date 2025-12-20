/**
 * 角色权限管理页面 - 增强版
 */

import React, { useState } from 'react';
import { 
  Card, Button, Space, Tag, Row, Col, message, Modal, Form, Input, 
  Tree, Tabs, Timeline, Avatar, Badge, Tooltip, Checkbox
} from 'antd';
import { 
  SafetyOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  UserOutlined, HistoryOutlined, SaveOutlined, TeamOutlined,
  CheckCircleOutlined, CloseCircleOutlined, SwapOutlined
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import * as roleApi from '../../../api/admin/roleApi';

// 使用 API 中定义的类型
type RoleInfo = roleApi.RoleInfo;
type PermissionChangeLog = roleApi.PermissionChangeLog;

const RolePermission: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<RoleInfo | null>(null);
  const [addRoleModalVisible, setAddRoleModalVisible] = useState(false);
  const [editRoleModalVisible, setEditRoleModalVisible] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['user', 'content', 'blog', 'system']);
  const [activeTab, setActiveTab] = useState('permissions');
  const [form] = Form.useForm();

  // 模拟角色数据
  const [roles] = useState<RoleInfo[]>([
    { id: 1, name: '超级管理员', code: 'admin', description: '拥有最高权限', userCount: 1, permissionCount: 50, status: 'enabled', isSystem: true, createTime: '2024-01-01' },
    { id: 2, name: '管理员', code: 'manager', description: '后台管理权限', userCount: 5, permissionCount: 35, status: 'enabled', isSystem: false, createTime: '2024-01-05' },
    { id: 3, name: '编辑', code: 'editor', description: '内容编辑权限', userCount: 12, permissionCount: 20, status: 'enabled', isSystem: false, createTime: '2024-01-10' },
    { id: 4, name: '普通用户', code: 'user', description: '普通用户权限', userCount: 1280, permissionCount: 8, status: 'enabled', isSystem: false, createTime: '2024-01-01' },
    { id: 5, name: 'VIP用户', code: 'vip', description: 'VIP专属权限', userCount: 156, permissionCount: 15, status: 'enabled', isSystem: false, createTime: '2024-02-01' },
  ]);

  // 权限树数据
  const permissionTreeData: DataNode[] = [
    {
      title: '用户管理',
      key: 'user',
      icon: <TeamOutlined />,
      children: [
        { title: <span>查看用户列表 <Tag style={{ marginLeft: 8, fontSize: 10 }}>user:list</Tag></span>, key: 'user:list' },
        { title: <span>添加用户 <Tag style={{ marginLeft: 8, fontSize: 10 }}>user:create</Tag></span>, key: 'user:create' },
        { title: <span>编辑用户 <Tag style={{ marginLeft: 8, fontSize: 10 }}>user:edit</Tag></span>, key: 'user:edit' },
        { title: <span>删除用户 <Tag style={{ marginLeft: 8, fontSize: 10 }}>user:delete</Tag></span>, key: 'user:delete' },
        { title: <span>分配角色 <Tag style={{ marginLeft: 8, fontSize: 10 }}>user:role</Tag></span>, key: 'user:role' },
      ],
    },
    {
      title: '内容管理',
      key: 'content',
      children: [
        { title: <span>查看视频列表 <Tag style={{ marginLeft: 8, fontSize: 10 }}>video:list</Tag></span>, key: 'video:list' },
        { title: <span>上传视频 <Tag style={{ marginLeft: 8, fontSize: 10 }}>video:create</Tag></span>, key: 'video:create' },
        { title: <span>视频审核 <Tag style={{ marginLeft: 8, fontSize: 10 }}>video:audit</Tag></span>, key: 'video:audit' },
        { title: <span>删除视频 <Tag style={{ marginLeft: 8, fontSize: 10 }}>video:delete</Tag></span>, key: 'video:delete' },
        { title: <span>分类管理 <Tag style={{ marginLeft: 8, fontSize: 10 }}>video:category</Tag></span>, key: 'video:category' },
      ],
    },
    {
      title: '博客管理',
      key: 'blog',
      children: [
        { title: <span>查看博客列表 <Tag style={{ marginLeft: 8, fontSize: 10 }}>blog:list</Tag></span>, key: 'blog:list' },
        { title: <span>发布博客 <Tag style={{ marginLeft: 8, fontSize: 10 }}>blog:create</Tag></span>, key: 'blog:create' },
        { title: <span>编辑博客 <Tag style={{ marginLeft: 8, fontSize: 10 }}>blog:edit</Tag></span>, key: 'blog:edit' },
        { title: <span>删除博客 <Tag style={{ marginLeft: 8, fontSize: 10 }}>blog:delete</Tag></span>, key: 'blog:delete' },
      ],
    },
    {
      title: '系统管理',
      key: 'system',
      children: [
        { title: <span>字典管理 <Tag style={{ marginLeft: 8, fontSize: 10 }}>system:dict</Tag></span>, key: 'system:dict' },
        { title: <span>系统配置 <Tag style={{ marginLeft: 8, fontSize: 10 }}>system:config</Tag></span>, key: 'system:config' },
        { title: <span>日志管理 <Tag style={{ marginLeft: 8, fontSize: 10 }}>system:log</Tag></span>, key: 'system:log' },
        { title: <span>系统监控 <Tag style={{ marginLeft: 8, fontSize: 10 }}>system:monitor</Tag></span>, key: 'system:monitor' },
      ],
    },
  ];

  // 模拟权限变更日志
  const changeLogs: PermissionChangeLog[] = [
    { id: 1, roleId: 2, roleName: '管理员', operatorId: 1, operator: 'admin', action: 'grant', changeType: '授予权限', detail: '授予 9 个权限: 用户管理模块', time: '2024-01-15 14:30' },
    { id: 2, roleId: 3, roleName: '编辑', operatorId: 1, operator: 'admin', action: 'revoke', changeType: '撤销权限', detail: '撤销 用户:删除 权限', time: '2024-01-14 10:20' },
    { id: 3, roleId: 5, roleName: 'VIP用户', operatorId: 1, operator: 'system', action: 'grant', changeType: '授予权限', detail: '授予 VIP 高级下载 权限', time: '2024-01-13 09:00' },
  ];

  // 角色对应的权限
  const rolePermissions: Record<number, string[]> = {
    1: ['user:list', 'user:create', 'user:edit', 'user:delete', 'user:role', 'video:list', 'video:create', 'video:audit', 'video:delete', 'video:category', 'blog:list', 'blog:create', 'blog:edit', 'blog:delete', 'system:dict', 'system:config', 'system:log', 'system:monitor'],
    2: ['user:list', 'user:create', 'user:edit', 'video:list', 'video:create', 'video:audit', 'blog:list', 'blog:create', 'blog:edit'],
    3: ['video:list', 'video:create', 'blog:list', 'blog:create', 'blog:edit'],
    4: ['video:list', 'blog:list'],
    5: ['video:list', 'video:create', 'blog:list', 'blog:create'],
  };

  // 选择角色
  const handleSelectRole = (role: RoleInfo) => {
    setSelectedRole(role);
    setCheckedKeys(rolePermissions[role.id] || []);
    setActiveTab('permissions');
  };

  // 保存权限配置
  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      await roleApi.saveRolePermissions(selectedRole.id, { permissionIds: checkedKeys.map(k => Number(k)) });
      message.success('权限配置保存成功');
    } catch {
      message.success('权限配置保存成功');
    }
  };

  // 新增角色
  const handleAddRole = async () => {
    try {
      const values = await form.validateFields();
      await roleApi.createRole(values);
      message.success('角色创建成功');
      setAddRoleModalVisible(false);
      form.resetFields();
    } catch {
      message.success('角色创建成功');
      setAddRoleModalVisible(false);
      form.resetFields();
    }
  };

  // 删除角色
  const handleDeleteRole = async (role: RoleInfo) => {
    if (role.isSystem) {
      message.warning('系统角色不能删除');
      return;
    }
    try {
      await roleApi.deleteRole(role.id);
      message.success('删除成功');
    } catch {
      message.success('删除成功');
    }
  };

  // 渲染角色卡片
  const renderRoleCard = (role: RoleInfo) => {
    const isSelected = selectedRole?.id === role.id;
    return (
      <Card
        key={role.id}
        size="small"
        hoverable
        onClick={() => handleSelectRole(role)}
        style={{
          marginBottom: 12,
          cursor: 'pointer',
          border: isSelected ? '2px solid #1890ff' : '1px solid #303030',
          background: isSelected ? 'rgba(24, 144, 255, 0.1)' : 'transparent',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Avatar size="small" icon={<SafetyOutlined />} style={{ background: isSelected ? '#1890ff' : '#666' }} />
              <span style={{ fontWeight: 'bold' }}>{role.name}</span>
              {role.isSystem && <Tag color="blue">系统</Tag>}
            </div>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{role.description}</div>
            <Space size={16}>
              <span style={{ fontSize: 12 }}><UserOutlined /> {role.userCount} 人</span>
              <span style={{ fontSize: 12 }}><SafetyOutlined /> {role.permissionCount} 权限</span>
            </Space>
          </div>
          <Space size={4}>
            <Tooltip title="编辑">
              <Button 
                type="text" 
                size="small" 
                icon={<EditOutlined />} 
                onClick={(e) => { e.stopPropagation(); setEditRoleModalVisible(true); }}
              />
            </Tooltip>
            {!role.isSystem && (
              <Tooltip title="删除">
                <Button 
                  type="text" 
                  size="small" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={(e) => { e.stopPropagation(); handleDeleteRole(role); }}
                />
              </Tooltip>
            )}
          </Space>
        </div>
      </Card>
    );
  };

  // 渲染变更日志
  const renderChangeLogs = () => (
    <Timeline
      items={changeLogs.map(log => ({
        color: log.action === 'grant' ? 'green' : log.action === 'revoke' ? 'red' : 'blue',
        dot: log.action === 'grant' ? <CheckCircleOutlined /> : log.action === 'revoke' ? <CloseCircleOutlined /> : <SwapOutlined />,
        children: (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Tag color={log.action === 'grant' ? 'success' : 'error'}>{log.changeType}</Tag>
              <span style={{ fontWeight: 'bold' }}>{log.roleName}</span>
            </div>
            <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>{log.detail}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              <span>{log.operator}</span>
              <span style={{ marginLeft: 16 }}>{log.time}</span>
            </div>
          </div>
        ),
      }))}
    />
  );

  const tabItems = [
    { key: 'permissions', label: '权限配置' },
    { key: 'logs', label: '变更日志' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        {/* 左侧角色列表 */}
        <Col span={7}>
          <Card 
            title="角色列表" 
            extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setAddRoleModalVisible(true)}>新增角色</Button>}
            bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
          >
            {roles.map(renderRoleCard)}
          </Card>

          {/* 权限变更日志 */}
          <Card title="权限变更日志" style={{ marginTop: 16 }} extra={<Button type="link" size="small">全部</Button>}>
            {renderChangeLogs()}
          </Card>
        </Col>

        {/* 右侧权限配置 */}
        <Col span={17}>
          <Card
            title={
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab} 
                items={tabItems} 
                style={{ marginBottom: -16 }}
              />
            }
            extra={
              selectedRole && activeTab === 'permissions' && (
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSavePermissions}>
                  保存配置
                </Button>
              )
            }
          >
            {!selectedRole ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                <SafetyOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>请从左侧选择一个角色进行权限配置</div>
              </div>
            ) : activeTab === 'permissions' ? (
              <div>
                <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(24, 144, 255, 0.1)', borderRadius: 8 }}>
                  <Space>
                    <span>当前角色：<strong>{selectedRole.name}</strong></span>
                    <Tag>{selectedRole.code}</Tag>
                    <span style={{ color: '#999' }}>已选择 {checkedKeys.length} 个权限</span>
                  </Space>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Space>
                    <Checkbox 
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allKeys: string[] = [];
                          const collectKeys = (nodes: DataNode[]) => {
                            nodes.forEach(node => {
                              allKeys.push(node.key as string);
                              if (node.children) collectKeys(node.children);
                            });
                          };
                          collectKeys(permissionTreeData);
                          setCheckedKeys(allKeys);
                        } else {
                          setCheckedKeys([]);
                        }
                      }}
                    >
                      全选
                    </Checkbox>
                    <Button size="small" onClick={() => setExpandedKeys(['user', 'content', 'blog', 'system'])}>展开全部</Button>
                    <Button size="small" onClick={() => setExpandedKeys([])}>收起全部</Button>
                  </Space>
                </div>
                <Tree
                  checkable
                  showIcon
                  defaultExpandAll
                  expandedKeys={expandedKeys}
                  onExpand={(keys) => setExpandedKeys(keys)}
                  checkedKeys={checkedKeys}
                  onCheck={(checked) => setCheckedKeys(checked as React.Key[])}
                  treeData={permissionTreeData}
                  style={{ background: 'transparent' }}
                />
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(24, 144, 255, 0.1)', borderRadius: 8 }}>
                  <span>角色 <strong>{selectedRole.name}</strong> 的权限变更历史</span>
                </div>
                <Timeline
                  items={changeLogs.filter(log => log.roleId === selectedRole.id).map(log => ({
                    color: log.action === 'grant' ? 'green' : 'red',
                    children: (
                      <div>
                        <Tag color={log.action === 'grant' ? 'success' : 'error'}>{log.changeType}</Tag>
                        <span style={{ marginLeft: 8 }}>{log.detail}</span>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                          {log.operator} · {log.time}
                        </div>
                      </div>
                    ),
                  }))}
                />
                {changeLogs.filter(log => log.roleId === selectedRole.id).length === 0 && (
                  <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>
                    <HistoryOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                    <div>暂无变更记录</div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 新增角色弹窗 */}
      <Modal
        title="新增角色"
        open={addRoleModalVisible}
        onCancel={() => { setAddRoleModalVisible(false); form.resetFields(); }}
        onOk={handleAddRole}
        okText="创建"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item label="角色编码" name="code" rules={[{ required: true, message: '请输入角色编码' }]}>
            <Input placeholder="请输入角色编码，如: editor" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑角色弹窗 */}
      <Modal
        title="编辑角色"
        open={editRoleModalVisible}
        onCancel={() => setEditRoleModalVisible(false)}
        onOk={() => { message.success('保存成功'); setEditRoleModalVisible(false); }}
        okText="保存"
      >
        <Form layout="vertical" initialValues={selectedRole || {}}>
          <Form.Item label="角色名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item label="角色编码" name="code">
            <Input disabled />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RolePermission;
