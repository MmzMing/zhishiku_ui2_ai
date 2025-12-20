/**
 * 注册页面 - 圆角卡片样式
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Checkbox, Steps, message } from 'antd';
import { 
  MailOutlined, 
  LockOutlined, 
  SafetyOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../../api/auth/authApi';
import './Register.css';

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // 验证码状态
  const [captcha, setCaptcha] = useState<authApi.CaptchaResponse | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // 获取图形验证码
  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const response = await authApi.getCaptcha();
      setCaptcha(response);
      form.setFieldValue('uuid', response.uuid);
    } catch (error) {
      // 使用模拟数据
      const mockCaptcha: authApi.CaptchaResponse = {
        captchaOnOff: true,
        uuid: `mock-${Date.now()}`,
        img: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAA8AKADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//Z'
      };
      setCaptcha(mockCaptcha);
      form.setFieldValue('uuid', mockCaptcha.uuid);
    } finally {
      setCaptchaLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  // 发送邮箱验证码
  const handleSendCode = async () => {
    try {
      await form.validateFields(['email']);
      const email = form.getFieldValue('email');
      
      setCodeLoading(true);
      await authApi.sendEmailCode(email);
      message.success('验证码已发送到您的邮箱');
      
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
    } catch (error: any) {
      if (error?.errorFields) {
        message.error('请先填写正确的邮箱地址');
      } else {
        message.error(error?.message || '验证码发送失败');
      }
    } finally {
      setCodeLoading(false);
    }
  };

  // 下一步
  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['email', 'password', 'confirmPassword', 'captcha']);
        setCurrentStep(1);
      } else if (currentStep === 1) {
        await form.validateFields(['emailCode']);
        handleRegister();
      }
    } catch (error) {
      // 表单验证失败
    }
  };

  // 注册
  const handleRegister = async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      await authApi.register({
        username: values.email, // Using email as username for now
        email: values.email,
        phone: '', // Not collected in this form
        password: values.password,
        confirmPassword: values.password,
        code: values.emailCode,
        agreement: true // Assuming agreement is checked
      });
      
      setCurrentStep(2);
      message.success('注册成功！');
      
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error: any) {
      message.error(error?.message || '注册失败，请重试');
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const stepItems = [
    { title: '基本信息' },
    { title: '邮箱验证' },
    { title: '完成注册' },
  ];

  return (
    <div className="register-container">
      <div className="register-card">
        {/* 返回登录 */}
        <Link to="/auth/login" className="back-link">
          <LeftOutlined /> 返回登录
        </Link>

        {/* Logo */}
        <div className="register-logo">
          <span>知</span>
        </div>

        {/* 标题 */}
        <h1 className="register-title">创建新账户</h1>
        <p className="register-subtitle">加入知识库学习平台，开启学习之旅</p>

        {/* 步骤条 */}
        <Steps 
          current={currentStep} 
          items={stepItems}
          className="register-steps"
          size="small"
        />

        {/* 表单 */}
        <Form
          form={form}
          name="register"
          autoComplete="off"
          className="register-form"
        >
          {currentStep === 0 && (
            <>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入正确的邮箱格式' },
                ]}
              >
                <Input 
                  prefix={<MailOutlined className="input-icon" />} 
                  placeholder="请输入邮箱地址" 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请设置密码' },
                  { min: 6, message: '密码至少6位' },
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="input-icon" />} 
                  placeholder="请设置密码 (6-20个字符)" 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请再次输入密码' },
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
                  prefix={<LockOutlined className="input-icon" />} 
                  placeholder="请再次输入密码" 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="captcha"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <div className="captcha-row">
                  <Input 
                    prefix={<SafetyOutlined className="input-icon" />} 
                    placeholder="请输入验证码"
                    size="large"
                    className="captcha-input"
                  />
                  <div 
                    className="captcha-image" 
                    onClick={fetchCaptcha}
                    title="点击刷新验证码"
                  >
                    {captchaLoading ? (
                      <span className="captcha-loading">加载中</span>
                    ) : captcha?.img ? (
                      <img 
                        src={captcha.img.startsWith('data:') ? captcha.img : `data:image/jpeg;base64,${captcha.img}`}
                        alt="验证码"
                      />
                    ) : (
                      <span className="captcha-placeholder">点击获取</span>
                    )}
                  </div>
                </div>
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  { 
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('请同意用户协议')),
                  },
                ]}
              >
                <Checkbox className="agreement-checkbox">
                  我已阅读并同意 
                  <a href="/terms" target="_blank">用户协议</a> 
                  和 
                  <a href="/privacy" target="_blank">隐私政策</a>
                </Checkbox>
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              <div className="verify-tip">
                验证码已发送至 <span className="email-highlight">{form.getFieldValue('email')}</span>
              </div>
              <Form.Item
                name="emailCode"
                rules={[
                  { required: true, message: '请输入邮箱验证码' },
                  { len: 6, message: '验证码为6位数字' },
                ]}
              >
                <div className="code-row">
                  <Input 
                    prefix={<SafetyOutlined className="input-icon" />} 
                    placeholder="请输入6位验证码"
                    size="large"
                    maxLength={6}
                    className="code-input"
                  />
                  <Button 
                    onClick={handleSendCode}
                    loading={codeLoading}
                    disabled={countdown > 0}
                    className="code-button"
                    size="large"
                  >
                    {countdown > 0 ? `${countdown}s` : '重新发送'}
                  </Button>
                </div>
              </Form.Item>
            </>
          )}

          {currentStep === 2 && (
            <div className="success-content">
              <div className="success-icon">✓</div>
              <h3>注册成功！</h3>
              <p>正在跳转到登录页面...</p>
            </div>
          )}

          {currentStep < 2 && (
            <Form.Item>
              <Button 
                type="primary" 
                onClick={currentStep === 0 ? handleNext : handleNext}
                loading={loading}
                block
                size="large"
                className="submit-button"
              >
                {currentStep === 0 ? '下一步' : '完成注册'}
              </Button>
            </Form.Item>
          )}
        </Form>

        {/* 登录链接 */}
        {currentStep < 2 && (
          <div className="login-link">
            已有账户？<Link to="/auth/login">立即登录</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
