/**
 * 登录页面 - 左右分栏布局
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Checkbox, Tabs, message } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MobileOutlined, 
  SafetyOutlined,
  WechatOutlined,
  QqOutlined,
  GithubOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../../api/auth/authApi';
import './Login.css';

interface LoginForm {
  username: string;
  password: string;
  code: string;
  uuid: string;
  rememberMe: boolean;
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
  const [activeTab, setActiveTab] = useState('account');
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
      console.error('获取验证码失败:', error);
      // 使用模拟数据作为fallback
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

  // 初始化获取验证码
  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  // 账号密码登录
  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 检查模拟账号
      if (values.username === 'admin' && values.password === '123456' && values.code === '1234') {
        // 模拟登录成功
        const mockResponse = {
          token: `mock_token_${Date.now()}`,
          user: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            email: 'admin@example.com',
            roles: ['admin']
          }
        };

        localStorage.setItem('auth_token', mockResponse.token);
        localStorage.setItem('user_info', JSON.stringify(mockResponse.user));
        
        if (values.rememberMe) {
          const expireTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
          localStorage.setItem('auth_expire_time', expireTime.toString());
        }
        
        localStorage.setItem('isLoggedIn', 'true');
        window.dispatchEvent(new Event('login-change'));
        message.success('登录成功');
        navigate('/admin');
        return;
      }

      const loginData = {
        username: values.username,
        password: values.password,
        code: values.code,
        uuid: captcha?.uuid || values.uuid,
        rememberMe: values.rememberMe
      };
      
      // 调用登录API
      const response = await authApi.login(loginData);
      
      // 保存登录状态到 localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_info', JSON.stringify(response.user));
      
      // 如果选择7天自动登录，设置过期时间
      if (values.rememberMe) {
        const expireTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem('auth_expire_time', expireTime.toString());
      }
      
      localStorage.setItem('isLoggedIn', 'true');
      window.dispatchEvent(new Event('login-change'));
      message.success('登录成功');
      navigate('/admin');
    } catch (error: any) {
      message.error(error?.message || '登录失败，请检查用户名和密码');
      // 登录失败刷新验证码
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // 手机号登录
  const handlePhoneLogin = async (values: PhoneLoginForm) => {
    setPhoneLoading(true);
    try {
      const response = await authApi.phoneLogin(values);
      
      // 保存登录状态到 localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_info', JSON.stringify(response.user));
      
      localStorage.setItem('isLoggedIn', 'true');
      window.dispatchEvent(new Event('login-change'));
      message.success('登录成功');
      navigate('/admin');
    } catch (error: any) {
      message.error(error?.message || '登录失败，请检查手机号和验证码');
    } finally {
      setPhoneLoading(false);
    }
  };

  // 发送短信验证码
  const handleSendCode = async () => {
    const phone = phoneForm.getFieldValue('phone');
    if (!phone) {
      message.error('请输入手机号');
      return;
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      message.error('请输入正确的手机号');
      return;
    }

    setCodeLoading(true);
    try {
      await authApi.sendSmsCode(phone);
      message.success('验证码已发送');
      
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
      message.error(error?.message || '验证码发送失败');
    } finally {
      setCodeLoading(false);
    }
  };

  // 第三方登录
  const handleThirdPartyLogin = (type: string) => {
    message.info(`${type}登录功能开发中...`);
  };

  const tabItems = [
    {
      key: 'account',
      label: (
        <span className="tab-label">
          <UserOutlined />
          账号登录
        </span>
      ),
    },
    {
      key: 'phone',
      label: (
        <span className="tab-label">
          <MobileOutlined />
          手机号登录
        </span>
      ),
    },
  ];

  return (
    <div className="login-container">
      {/* 左侧介绍区域 */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="logo-circle">
            <div className="logo-inner"></div>
          </div>
          <h1 className="platform-title">知识库学习平台</h1>
          <p className="platform-subtitle">一站式视频、博客、学习资源管理平台</p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>海量视频教程</span>
            </div>
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>精品技术博客</span>
            </div>
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>积分激励体系</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧登录区域 */}
      <div className="login-right">
        <div className="login-form-container">
          {/* 主题切换按钮位置预留 */}
          <div className="theme-toggle-placeholder"></div>
          
          <div className="login-header">
            <h2>欢迎回来</h2>
            <p>请登录您的账户继续学习</p>
          </div>

          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            centered
            className="login-tabs"
          />

          {activeTab === 'account' ? (
            <Form
              form={form}
              name="login"
              onFinish={handleLogin}
              autoComplete="off"
              size="large"
              className="login-form"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名/邮箱' }]}
              >
                <Input 
                  prefix={<UserOutlined className="input-icon" />} 
                  placeholder="请输入用户名/邮箱" 
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
                  prefix={<LockOutlined className="input-icon" />} 
                  placeholder="请输入密码" 
                />
              </Form.Item>

              <Form.Item
                name="code"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <div className="captcha-row">
                  <Input 
                    prefix={<SafetyOutlined className="input-icon" />} 
                    placeholder="请输入验证码"
                    className="captcha-input"
                  />
                  <div 
                    className="captcha-image" 
                    onClick={fetchCaptcha}
                    title="点击刷新验证码"
                  >
                    {captchaLoading ? (
                      <span className="captcha-loading">加载中...</span>
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

              <Form.Item name="uuid" hidden>
                <Input />
              </Form.Item>

              <Form.Item>
                <div className="form-options">
                  <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                    <Checkbox>7天内自动登录</Checkbox>
                  </Form.Item>
                  <Link to="/auth/reset-password" className="forgot-link">
                    忘记密码?
                  </Link>
                </div>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  block
                  className="login-button"
                >
                  登 录
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form
              form={phoneForm}
              name="phoneLogin"
              onFinish={handlePhoneLogin}
              autoComplete="off"
              size="large"
              className="login-form"
            >
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input 
                  prefix={<MobileOutlined className="input-icon" />} 
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
                <div className="sms-code-row">
                  <Input 
                    prefix={<SafetyOutlined className="input-icon" />} 
                    placeholder="验证码" 
                    className="sms-input"
                  />
                  <Button 
                    onClick={handleSendCode}
                    loading={codeLoading}
                    disabled={countdown > 0}
                    className="sms-button"
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
                  className="login-button"
                >
                  登 录
                </Button>
              </Form.Item>
            </Form>
          )}

          {/* 注册链接 */}
          <div className="register-link">
            <span>还没有账户？</span>
            <Link to="/auth/register">立即注册</Link>
          </div>

          {/* 第三方登录 */}
          <div className="third-party-login">
            <div className="divider">
              <span>其他登录方式</span>
            </div>
            <div className="social-icons">
              <div 
                className="social-icon wechat"
                onClick={() => handleThirdPartyLogin('微信')}
                title="微信登录"
              >
                <WechatOutlined />
              </div>
              <div 
                className="social-icon qq"
                onClick={() => handleThirdPartyLogin('QQ')}
                title="QQ登录"
              >
                <QqOutlined />
              </div>
              <div 
                className="social-icon github"
                onClick={() => handleThirdPartyLogin('GitHub')}
                title="GitHub登录"
              >
                <GithubOutlined />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
