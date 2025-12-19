/**
 * 重置密码页面
 */

import React, { useState } from 'react';
import { Form, Input, Button, Steps, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';

const { Step } = Steps;

interface ResetFormData {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [countdown, setCountdown] = useState(0);

  // 发送验证码
  const handleSendCode = async () => {
    try {
      const email = form.getFieldValue('email');
      if (!email) {
        message.error('请先输入邮箱地址');
        return;
      }

      setLoading(true);
      // 这里调用发送验证码的API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('验证码已发送到您的邮箱');
      setCurrentStep(1);
      
      // 开始倒计时
      let count = 60;
      setCountdown(count);
      const timer = setInterval(() => {
        count--;
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
        }
      }, 1000);
      
    } catch (error) {
      message.error('发送验证码失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 验证验证码
  const handleVerifyCode = async () => {
    try {
      const { email, code } = form.getFieldsValue(['email', 'code']);
      if (!code) {
        message.error('请输入验证码');
        return;
      }

      setLoading(true);
      // 这里调用验证验证码的API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('验证码验证成功');
      setCurrentStep(2);
      
    } catch (error) {
      message.error('验证码错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置密码
  const handleResetPassword = async (values: ResetFormData) => {
    try {
      setLoading(true);
      // 这里调用重置密码的API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('密码重置成功，请使用新密码登录');
      navigate('/auth/login');
      
    } catch (error) {
      message.error('密码重置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: '输入邮箱',
      icon: <MailOutlined />,
    },
    {
      title: '验证身份',
      icon: <SafetyOutlined />,
    },
    {
      title: '重置密码',
      icon: <LockOutlined />,
    },
  ];

  return (
    <Card className="reset-password-card">
      <div className="reset-password-header">
        <h2>重置密码</h2>
        <p>请按照以下步骤重置您的密码</p>
      </div>

      <Steps current={currentStep} className="reset-steps">
        {steps.map((step, index) => (
          <Step key={index} title={step.title} icon={step.icon} />
        ))}
      </Steps>

      <Form
        form={form}
        name="resetPassword"
        onFinish={handleResetPassword}
        autoComplete="off"
        layout="vertical"
        className="reset-form"
      >
        {/* 步骤1: 输入邮箱 */}
        {currentStep === 0 && (
          <div className="step-content">
            <Form.Item
              name="email"
              label="邮箱地址"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="请输入注册时使用的邮箱"
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleSendCode}
              block
            >
              发送验证码
            </Button>
          </div>
        )}

        {/* 步骤2: 验证身份 */}
        {currentStep === 1 && (
          <div className="step-content">
            <Form.Item
              name="code"
              label="验证码"
              rules={[
                { required: true, message: '请输入验证码' },
                { len: 6, message: '验证码为6位数字' },
              ]}
            >
              <Input
                prefix={<SafetyOutlined />}
                placeholder="请输入6位验证码"
                size="large"
                maxLength={6}
              />
            </Form.Item>

            <div className="code-actions">
              <Button
                type="link"
                disabled={countdown > 0}
                onClick={handleSendCode}
              >
                {countdown > 0 ? `${countdown}秒后重新发送` : '重新发送验证码'}
              </Button>
            </div>

            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleVerifyCode}
              block
            >
              验证
            </Button>
          </div>
        )}

        {/* 步骤3: 重置密码 */}
        {currentStep === 2 && (
          <div className="step-content">
            <Form.Item
              name="password"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 8, message: '密码至少8位字符' },
                {
                  pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
                  message: '密码必须包含字母和数字',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入新密码"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认新密码' },
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
                placeholder="请再次输入新密码"
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              重置密码
            </Button>
          </div>
        )}
      </Form>

      <div className="reset-footer">
        <Button type="link" onClick={() => navigate('/auth/login')}>
          返回登录
        </Button>
      </div>
    </Card>
  );
};

export default ResetPassword;