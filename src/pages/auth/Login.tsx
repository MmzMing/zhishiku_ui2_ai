/**
 * 登录页面
 */

import React, { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, Tabs, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

interface PhoneLoginForm {
  phone: string;
  code: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [phoneForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // 账号密码登录
  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 保存登录状态
      localStorage.setItem('isLoggedIn', 'true');
      window.dispatchEvent(new Event('login-change'));
      message.success('登录成功');
      navigate('/admin');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  // 手机号登录
  const handlePhoneLogin = async (values: PhoneLoginForm) => {
    setPhoneLoading(true);
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 保存登录状态
      localStorage.setItem('isLoggedIn', 'true');
      window.dispatchEvent(new Event('login-change'));
      message.success('登录成功');
      navigate('/admin');
    } catch (error) {
      message.error('登录失败，请检查手机号和验证码');
    } finally {
      setPhoneLoading(false);
    }
  };

  // 发送验证码
  const handleSendCode = async () => {
    const phone = phoneForm.getFieldValue('phone');
    if (!phone) {
      message.error('请输入手机号');
      return;
    }

    setCodeLoading(true);
    try {
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('验证码已发送');
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      message.error('验证码发送失败');
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff', margin: 0 }}>
            个人知识库
          </h1>
          <p style={{ color: '#666', marginTop: 8 }}>
            欢迎回来，请登录您的账户
          </p>
        </div>

        <Tabs defaultActiveKey="account" centered>
          <TabPane 
            tab={
              <span>
                <UserOutlined />
                账号登录
              </span>
            } 
            key="account"
          >
            <Form
              form={form}
              name="login"
              onFinish={handleLogin}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名/邮箱/手机号' },
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名/邮箱/手机号" 
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6位' },
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="密码" 
                />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <Link to="/auth/reset-password" style={{ color: '#1890ff' }}>
                    忘记密码？
                  </Link>
                </div>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  block
                  size="large"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <MobileOutlined />
                手机登录
              </span>
            } 
            key="phone"
          >
            <Form
              form={phoneForm}
              name="phoneLogin"
              onFinish={handlePhoneLogin}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input 
                  prefix={<MobileOutlined />} 
                  placeholder="手机号" 
                />
              </Form.Item>

              <Form.Item
                name="code"
                rules={[
                  { required: true, message: '请输入验证码' },
                  { len: 6, message: '验证码为6位数字' },
                ]}
              >
                <div style={{ display: 'flex', gap: 8 }}>
                  <Input 
                    prefix={<SafetyOutlined />} 
                    placeholder="验证码" 
                    style={{ flex: 1 }}
                  />
                  <Button 
                    onClick={handleSendCode}
                    loading={codeLoading}
                    disabled={countdown > 0}
                    style={{ width: 120 }}
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Button>
                </div>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={phoneLoading}
                  block
                  size="large"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <Divider>其他登录方式</Divider>

        <div style={{ textAlign: 'center' }}>
          <Button type="default" style={{ marginRight: 8 }}>
            微信登录
          </Button>
          <Button type="default">
            GitHub登录
          </Button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span style={{ color: '#666' }}>还没有账户？</span>
          <Link to="/auth/register" style={{ color: '#1890ff', marginLeft: 8 }}>
            立即注册
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;