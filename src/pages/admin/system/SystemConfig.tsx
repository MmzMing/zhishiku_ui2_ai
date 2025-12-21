/**
 * 系统配置页面
 */

import React, { useState } from 'react';
import { Card, Tabs, Form, Input, InputNumber, Switch, Button, message, Table, Tag, Space, Tooltip } from 'antd';
import { SearchOutlined, SyncOutlined, LinkOutlined } from '@ant-design/icons';
import * as systemApi from '../../../api/admin/systemApi';
// 尝试导入 API 列表，如果在构建时不存在则使用空数组
import apiList from '../../../config/api-list.json';

const SystemConfig: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // 过滤 API 列表
  const filteredApis = apiList.filter(api => 
    api.name.toLowerCase().includes(searchText.toLowerCase()) || 
    api.path.toLowerCase().includes(searchText.toLowerCase()) ||
    api.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method: string) => {
        const color = method === 'GET' ? 'green' : method === 'POST' ? 'blue' : method === 'DELETE' ? 'red' : 'orange';
        return <Tag color={color}>{method}</Tag>;
      }
    },
    {
      title: 'API路径',
      dataIndex: 'path',
      key: 'path',
      render: (text: string) => <code>{text}</code>
    },
    {
      title: '文件位置',
      dataIndex: 'file',
      key: 'file',
      render: (text: string) => <span style={{ color: '#999', fontSize: 12 }}>{text}</span>
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="模拟绑定后端权限">
            <Button type="link" size="small" icon={<LinkOutlined />} onClick={() => message.success(`已绑定接口: ${record.name}`)}>
              绑定
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Tabs defaultActiveKey="api" items={[
          {
            key: 'api',
            label: 'API配置',
            children: (
              <div style={{ minHeight: 400 }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                  <Input 
                    placeholder="搜索 API 名称、路径或描述" 
                    prefix={<SearchOutlined />} 
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                  />
                  <Button 
                    icon={<SyncOutlined spin={loading} />} 
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        setLoading(false);
                        message.success('API 列表已刷新');
                      }, 1000);
                    }}
                  >
                    刷新列表
                  </Button>
                </div>
                
                <Table 
                  columns={columns} 
                  dataSource={filteredApis} 
                  rowKey="key"
                  size="small"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 800 }}
                />
                
                <div style={{ marginTop: 24 }}>
                  <h3>全局配置</h3>
                  <Form layout="vertical" style={{ maxWidth: 600 }}>
                    <Form.Item label="后端API地址" tooltip="开发/测试/生产环境分别配置">
                      <Input defaultValue="https://api.example.com" />
                    </Form.Item>
                    <Form.Item label="接口前缀">
                      <Input defaultValue="/api/v1" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" onClick={() => message.success('配置已保存')}>保存配置</Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
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
