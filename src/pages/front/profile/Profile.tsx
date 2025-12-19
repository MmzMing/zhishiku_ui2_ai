/**
 * 个人中心页面
 * 按照技术文档5.1.4要求实现
 * 包含：个人信息、我的内容、积分中心、设置中心
 */

import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Button,
  Tabs,
  List,
  Tag,
  Space,
  Row,
  Col,
  Switch,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Radio,
  Divider
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  FileTextOutlined,
  StarOutlined,
  HistoryOutlined,
  WalletOutlined,
  SettingOutlined,
  DeleteOutlined,
  EyeOutlined,
  BellOutlined,
  SkinOutlined,
  SafetyOutlined,
  CameraOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 模拟用户数据
const mockUserInfo = {
  id: 1,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
  nickname: '技术达人',
  phone: '138****1234',
  email: 'te****@example.com',
  registerTime: '2024-01-15',
  points: 1280,
};

// 模拟上传内容
const mockUploads = {
  documents: [
    { id: 1, title: 'Spring Boot 入门教程', status: 'online', views: 1256, cover: 'https://picsum.photos/120/80?random=21', createTime: '2024-12-15' },
    { id: 2, title: 'MySQL 性能优化指南', status: 'online', views: 892, cover: 'https://picsum.photos/120/80?random=22', createTime: '2024-12-10' },
    { id: 3, title: 'Docker 容器化部署', status: 'offline', views: 456, cover: 'https://picsum.photos/120/80?random=23', createTime: '2024-12-05' },
  ],
  videos: [
    { id: 1, title: 'React 18 新特性详解', status: 'online', views: 2345, cover: 'https://picsum.photos/120/80?random=24', duration: '45:30', createTime: '2024-12-18' },
    { id: 2, title: 'Vue 3 组合式API教程', status: 'reviewing', views: 0, cover: 'https://picsum.photos/120/80?random=25', duration: '1:23:00', createTime: '2024-12-19' },
  ],
};

// 模拟收藏
const mockCollections = [
  { id: 1, title: 'TypeScript 高级教程', type: 'document', author: '前端专家', cover: 'https://picsum.photos/120/80?random=31', collectTime: '2024-12-18' },
  { id: 2, title: 'Node.js 实战视频', type: 'video', author: '全栈工程师', cover: 'https://picsum.photos/120/80?random=32', collectTime: '2024-12-17' },
  { id: 3, title: 'Redis 缓存设计', type: 'document', author: 'DBA专家', cover: 'https://picsum.photos/120/80?random=33', collectTime: '2024-12-16' },
];

// 模拟浏览历史
const mockHistory = [
  { id: 1, title: 'Kubernetes 集群搭建', type: 'video', cover: 'https://picsum.photos/120/80?random=41', viewTime: '2024-12-19 14:30' },
  { id: 2, title: 'Nginx 配置优化', type: 'document', cover: 'https://picsum.photos/120/80?random=42', viewTime: '2024-12-19 10:15' },
  { id: 3, title: 'Git 高级操作', type: 'video', cover: 'https://picsum.photos/120/80?random=43', viewTime: '2024-12-18 16:45' },
];

// 模拟积分记录
const mockPointRecords = [
  { id: 1, type: 'earn', amount: 50, reason: '上传文档奖励', time: '2024-12-19 10:00' },
  { id: 2, type: 'spend', amount: -10, reason: '下载文档消耗', time: '2024-12-18 15:30' },
  { id: 3, type: 'earn', amount: 100, reason: '视频审核通过奖励', time: '2024-12-17 09:00' },
  { id: 4, type: 'spend', amount: -20, reason: '观看付费视频', time: '2024-12-16 14:20' },
  { id: 5, type: 'earn', amount: 30, reason: '每日签到奖励', time: '2024-12-15 08:00' },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('uploads');
  const [contentTab, setContentTab] = useState('documents');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 设置状态
  const [settings, setSettings] = useState({
    theme: 'light',
    commentNotify: true,
    likeNotify: true,
    collectNotify: true,
  });

  // 编辑个人信息
  const handleEditInfo = () => {
    form.setFieldsValue({
      nickname: '技术达人',
      phone: '13812341234',
      email: 'test@example.com',
    });
    setEditModalVisible(true);
  };

  // 保存个人信息
  const handleSaveInfo = async () => {
    try {
      await form.validateFields();
      message.success('信息修改成功');
      setEditModalVisible(false);
    } catch (error) {
      // 验证失败
    }
  };

  // 删除内容
  const handleDeleteContent = (id: number, type: string) => {
    message.success('删除成功');
  };

  // 下架/上架内容
  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'online' ? '已下架' : '已上架';
    message.success(newStatus);
  };

  // 清空浏览历史
  const handleClearHistory = () => {
    message.success('浏览历史已清空');
  };

  // 取消收藏
  const handleCancelCollect = (id: number) => {
    message.success('已取消收藏');
  };

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      online: { color: 'green', text: '已上架' },
      offline: { color: 'default', text: '已下架' },
      reviewing: { color: 'orange', text: '审核中' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  return (
    <div className="profile-page">
      <Row gutter={[24, 24]}>
        {/* 左侧个人信息卡片 */}
        <Col xs={24} lg={8}>
          <Card className="profile-card">
            {/* 个人信息区 - PC端左图右文 */}
            <div className="user-info-section">
              <div className="avatar-wrapper">
                <Avatar 
                  size={80} 
                  src={mockUserInfo.avatar}
                  icon={<UserOutlined />}
                />
                <Button 
                  className="avatar-edit-btn"
                  icon={<CameraOutlined />}
                  shape="circle"
                  size="small"
                />
              </div>
              <div className="user-details">
                <Title level={4} className="nickname">{mockUserInfo.nickname}</Title>
                <div className="info-item">
                  <Text type="secondary">手机号：</Text>
                  <Text>{mockUserInfo.phone}</Text>
                </div>
                <div className="info-item">
                  <Text type="secondary">邮箱：</Text>
                  <Text>{mockUserInfo.email}</Text>
                </div>
                <div className="info-item">
                  <Text type="secondary">注册时间：</Text>
                  <Text>{mockUserInfo.registerTime}</Text>
                </div>
              </div>
            </div>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={handleEditInfo}
              block
              style={{ marginTop: 16 }}
            >
              编辑信息
            </Button>
          </Card>

          {/* 积分中心 */}
          <Card className="points-card" style={{ marginTop: 24 }}>
            <div className="points-header">
              <WalletOutlined className="points-icon" />
              <div className="points-info">
                <Text type="secondary">积分余额</Text>
                <Title level={2} className="points-balance">{mockUserInfo.points}</Title>
              </div>
            </div>
            <Text type="secondary" className="points-desc">
              1积分 = 1次付费下载
            </Text>
            <Button type="primary" ghost block style={{ marginTop: 16 }}>
              积分兑换
            </Button>
          </Card>
        </Col>

        {/* 右侧内容区 */}
        <Col xs={24} lg={16}>
          <Card className="content-card">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              {/* 我的内容 */}
              <TabPane 
                tab={<span><FileTextOutlined /> 我的内容</span>} 
                key="uploads"
              >
                <Tabs 
                  activeKey={contentTab} 
                  onChange={setContentTab}
                  size="small"
                  style={{ marginBottom: 16 }}
                >
                  <TabPane tab="文档" key="documents" />
                  <TabPane tab="视频" key="videos" />
                </Tabs>

                <List
                  dataSource={contentTab === 'documents' ? mockUploads.documents : mockUploads.videos}
                  renderItem={(item: any) => (
                    <List.Item
                      className="content-item"
                      actions={[
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => navigate(contentTab === 'documents' ? `/document/${item.id}/edit` : `/video/${item.id}/edit`)}
                        >
                          编辑
                        </Button>,
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => handleToggleStatus(item.id, item.status)}
                        >
                          {item.status === 'online' ? '下架' : '上架'}
                        </Button>,
                        <Popconfirm
                          title="确定删除该内容？"
                          description="删除后不可恢复"
                          onConfirm={() => handleDeleteContent(item.id, contentTab)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button type="link" size="small" danger>删除</Button>
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div className="content-cover">
                            <img src={item.cover} alt={item.title} />
                            {contentTab === 'videos' && (
                              <span className="duration">{item.duration}</span>
                            )}
                          </div>
                        }
                        title={
                          <Space>
                            <Text strong>{item.title}</Text>
                            {renderStatusTag(item.status)}
                          </Space>
                        }
                        description={
                          <Space>
                            <Text type="secondary"><EyeOutlined /> {item.views}</Text>
                            <Text type="secondary">{item.createTime}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>

              {/* 我的收藏 */}
              <TabPane 
                tab={<span><StarOutlined /> 我的收藏</span>} 
                key="collections"
              >
                <div className="collection-filter">
                  <Radio.Group defaultValue="all" size="small">
                    <Radio.Button value="all">全部</Radio.Button>
                    <Radio.Button value="document">文档</Radio.Button>
                    <Radio.Button value="video">视频</Radio.Button>
                  </Radio.Group>
                </div>

                <List
                  dataSource={mockCollections}
                  renderItem={(item) => (
                    <List.Item
                      className="content-item"
                      onClick={() => navigate(item.type === 'video' ? `/video/${item.id}` : `/document/${item.id}`)}
                      actions={[
                        <Popconfirm
                          title="确定取消收藏？"
                          onConfirm={(e) => {
                            e?.stopPropagation();
                            handleCancelCollect(item.id);
                          }}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button 
                            type="link" 
                            size="small" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            取消收藏
                          </Button>
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div className="content-cover">
                            <img src={item.cover} alt={item.title} />
                          </div>
                        }
                        title={
                          <Space>
                            <Text strong>{item.title}</Text>
                            <Tag color={item.type === 'video' ? 'orange' : 'blue'}>
                              {item.type === 'video' ? '视频' : '文档'}
                            </Tag>
                          </Space>
                        }
                        description={
                          <Space>
                            <Text type="secondary">{item.author}</Text>
                            <Text type="secondary">收藏于 {item.collectTime}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>

              {/* 浏览历史 */}
              <TabPane 
                tab={<span><HistoryOutlined /> 浏览历史</span>} 
                key="history"
              >
                <div className="history-header">
                  <Text type="secondary">最近30天浏览记录</Text>
                  <Popconfirm
                    title="确定清空所有浏览历史？"
                    onConfirm={handleClearHistory}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="link" size="small" danger>
                      <DeleteOutlined /> 清空历史
                    </Button>
                  </Popconfirm>
                </div>

                <List
                  dataSource={mockHistory}
                  renderItem={(item) => (
                    <List.Item
                      className="content-item"
                      onClick={() => navigate(item.type === 'video' ? `/video/${item.id}` : `/document/${item.id}`)}
                      actions={[
                        <Button 
                          type="link" 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            message.success('已删除');
                          }}
                        >
                          删除
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div className="content-cover">
                            <img src={item.cover} alt={item.title} />
                          </div>
                        }
                        title={
                          <Space>
                            <Text strong>{item.title}</Text>
                            <Tag color={item.type === 'video' ? 'orange' : 'blue'}>
                              {item.type === 'video' ? '视频' : '文档'}
                            </Tag>
                          </Space>
                        }
                        description={
                          <Text type="secondary">浏览于 {item.viewTime}</Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>

              {/* 积分记录 */}
              <TabPane 
                tab={<span><WalletOutlined /> 积分记录</span>} 
                key="points"
              >
                <div className="points-filter">
                  <Select defaultValue="all" style={{ width: 120 }} size="small">
                    <Select.Option value="all">全部时间</Select.Option>
                    <Select.Option value="7">近7天</Select.Option>
                    <Select.Option value="30">近30天</Select.Option>
                  </Select>
                </div>

                <List
                  dataSource={mockPointRecords}
                  renderItem={(item) => (
                    <List.Item className="point-item">
                      <div className="point-info">
                        <Text strong>{item.reason}</Text>
                        <Text type="secondary">{item.time}</Text>
                      </div>
                      <Text 
                        strong 
                        className={item.type === 'earn' ? 'point-earn' : 'point-spend'}
                      >
                        {item.type === 'earn' ? '+' : ''}{item.amount}
                      </Text>
                    </List.Item>
                  )}
                />
              </TabPane>

              {/* 设置中心 */}
              <TabPane 
                tab={<span><SettingOutlined /> 设置</span>} 
                key="settings"
              >
                <div className="settings-section">
                  {/* 主题偏好 */}
                  <div className="settings-group">
                    <Title level={5}><SkinOutlined /> 主题偏好</Title>
                    <div className="setting-item">
                      <Text>主题模式</Text>
                      <Radio.Group 
                        value={settings.theme}
                        onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                      >
                        <Radio value="light">亮色</Radio>
                        <Radio value="dark">暗黑</Radio>
                        <Radio value="auto">跟随系统</Radio>
                      </Radio.Group>
                    </div>
                  </div>

                  <Divider />

                  {/* 消息通知 */}
                  <div className="settings-group">
                    <Title level={5}><BellOutlined /> 消息通知</Title>
                    <div className="setting-item">
                      <Text>评论提醒</Text>
                      <Switch 
                        checked={settings.commentNotify}
                        onChange={(checked) => setSettings({ ...settings, commentNotify: checked })}
                      />
                    </div>
                    <div className="setting-item">
                      <Text>点赞提醒</Text>
                      <Switch 
                        checked={settings.likeNotify}
                        onChange={(checked) => setSettings({ ...settings, likeNotify: checked })}
                      />
                    </div>
                    <div className="setting-item">
                      <Text>收藏提醒</Text>
                      <Switch 
                        checked={settings.collectNotify}
                        onChange={(checked) => setSettings({ ...settings, collectNotify: checked })}
                      />
                    </div>
                  </div>

                  <Divider />

                  {/* 账号安全 */}
                  <div className="settings-group">
                    <Title level={5}><SafetyOutlined /> 账号安全</Title>
                    <div className="setting-item">
                      <Text>修改密码</Text>
                      <Button 
                        type="link" 
                        onClick={() => setPasswordModalVisible(true)}
                      >
                        修改
                      </Button>
                    </div>
                    <div className="setting-item">
                      <Text>绑定手机</Text>
                      <Button type="link">更换</Button>
                    </div>
                    <div className="setting-item">
                      <Text>绑定邮箱</Text>
                      <Button type="link">更换</Button>
                    </div>
                    <div className="setting-item">
                      <Text>账号注销</Text>
                      <Button type="link" danger>注销</Button>
                    </div>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* 编辑信息弹窗 */}
      <Modal
        title="编辑个人信息"
        open={editModalVisible}
        onOk={handleSaveInfo}
        onCancel={() => setEditModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onOk={() => {
          message.success('密码修改成功');
          setPasswordModalVisible(false);
        }}
        onCancel={() => setPasswordModalVisible(false)}
        okText="确认修改"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码至少8位' }
            ]}
          >
            <Input.Password placeholder="请输入新密码（至少8位）" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[{ required: true, message: '请确认新密码' }]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
