/**
 * 系统配置页面
 */

import React from 'react';
import { Card, Tabs, Form, Input, InputNumber, Switch, Button, message } from 'antd';

const SystemConfig: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Tabs defaultActiveKey="api" items={[
          {
            key: 'api',
            label: 'API配置',
            children: (
              <Form layout="vertical" style={{ maxWidth: 600 }}>
                <Form.Item label="后端API地址" tooltip="开发/测试/生产环境分别配置">
                  <Input defaultValue="https://api.example.com" />
                </Form.Item>
                <Form.Item label="接口前缀">
                  <Input defaultValue="/api/v1" />
                </Form.Item>
                <Form.Item label="请求超时时间">
                  <InputNumber defaultValue={30000} addonAfter="ms" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={() => message.success('配置已保存')}>保存配置</Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: 'alert',
            label: '告警配置',
            children: (
              <Form layout="vertical" style={{ maxWidth: 600 }}>
                <Form.Item label="CPU告警阈值">
                  <InputNumber defaultValue={80} addonAfter="%" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="内存告警阈值">
                  <InputNumber defaultValue={85} addonAfter="%" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="磁盘告警阈值">
                  <InputNumber defaultValue={90} addonAfter="%" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="启用邮件通知">
                  <Switch defaultChecked />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={() => message.success('配置已保存')}>保存配置</Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: 'storage',
            label: '存储配置',
            children: (
              <Form layout="vertical" style={{ maxWidth: 600 }}>
                <Form.Item label="文件存储路径">
                  <Input defaultValue="/data/uploads" />
                </Form.Item>
                <Form.Item label="最大上传大小">
                  <InputNumber defaultValue={100} addonAfter="MB" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="启用CDN加速">
                  <Switch defaultChecked />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={() => message.success('配置已保存')}>保存配置</Button>
                </Form.Item>
              </Form>
            ),
          },
        ]} />
      </Card>
    </div>
  );
};

export default SystemConfig;
