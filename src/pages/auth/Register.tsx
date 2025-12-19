/**
 * 注册页面
 */

import React, { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, Steps, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

interface RegisterForm {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  code: string;
  agreement: boolean;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // 发送验证码
  const handleSendCode = async () => {
    try {
      await form.validateFields(['phone']);
      const phone = form.getFieldValue('phone');
      
      setCodeLoading(true);
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
      message.error('请先填写正确的手机号');
    } finally {
      setCodeLoading(false);
    }
  };

  // 注册
  const handleRegister = async (values: RegisterForm) => {
    setLoading(true);
    try {
      // 模拟注册请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('注册成功，即将跳转到登录页面');
      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);
    } catch (error) {
      message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: '填写信息',
      description: '基本信息',
    },
    {
      title: '验证手机',
      description: '手机验证',
    },
    {
      title: '完成注册',
      description: '注册成功',
    },
  ];

  // 处理注册步骤
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
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
          maxWidth: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff', margin: 0 }}>
            创建账户
          </h1>
          <p style={{ color: '#666', marginTop: 8 }}>
            加入我们，开始您的知识管理之旅
          </p>
        </div>

        <Steps 
          current={currentStep} 
          style={{ marginBottom: 32 }}
          items={steps}
          onChange={handleStepChange}
        />

        <Form
          form={form}
          name="register"
          onFinish={handleRegister}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3位' },
              { max: 20, message: '用户名最多20位' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入用户名" 
            />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' },
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="请输入邮箱" 
            />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input 
              prefix={<MobileOutlined />} 
              placeholder="请输入手机号" 
            />
          </Form.Item>

          <Form.Item
            label="验证码"
            name="code"
            rules={[
              { required: true, message: '请输入验证码' },
              { len: 6, message: '验证码为6位数字' },
            ]}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <Input 
                prefix={<SafetyOutlined />} 
                placeholder="请输入验证码" 
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

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码至少8位' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '密码必须包含大小写字母和数字' },
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入密码" 
            />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请再次输入密码" 
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { 
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请同意用户协议和隐私政策')),
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意
              <Link to="/terms" target="_blank" style={{ color: '#1890ff' }}>
                《用户协议》
              </Link>
              和
              <Link to="/privacy" target="_blank" style={{ color: '#1890ff' }}>
                《隐私政策》
              </Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              注册
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span style={{ color: '#666' }}>已有账户？</span>
          <Link to="/auth/login" style={{ color: '#1890ff', marginLeft: 8 }}>
            立即登录
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;