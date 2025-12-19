/**
 * 日志管理页面
 */

import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Input, DatePicker } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

const LogManage: React.FC = () => {
  const [logLevel, setLogLevel] = useState<string>('all');

  const logData = [
    { id: 1, level: 'ERROR', module: '用户模块', message: '登录验证失败：Token过期', time: '2024-12-19 14:30:25', ip: '192.168.1.50' },
    { id: 2, level: 'INFO', module: '视频模块', message: '视频上传成功：video_123.mp4', time: '2024-12-19 14:28:10', ip: '192.168.1.51' },
    { id: 3, level: 'WARN', module: '积分模块', message: '积分余额不足，扣减失败', time: '2024-12-19 14:25:33', ip: '192.168.1.52' },
    { id: 4, level: 'DEBUG', module: '系统模块', message: '缓存刷新完成', time: '2024-12-19 14:20:00', ip: '192.168.1.100' },
    { id: 5, level: 'FATAL', module: '数据库模块', message: '数据库连接池耗尽', time: '2024-12-19 14:15:00', ip: '192.168.1.102' },
  ];

  const columns: ColumnsType<typeof logData[0]> = [
    {
      title: '级别', dataIndex: 'level', key: 'level', width: 100,
      render: (level) => {
        const colors: Record<string, string> = { DEBUG: 'default', INFO: 'blue', WARN: 'orange', ERROR: 'red', FATAL: 'magenta' };
        return <Tag color={colors[level]}>{level}</Tag>;
      },
    },
    { title: '模块', dataIndex: 'module', key: 'module', width: 120 },
    { title: '日志内容', dataIndex: 'message', key: 'message', ellipsis: true },
    { title: '时间', dataIndex: 'time', key: 'time', width: 180 },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 130 },
    { title: '操作', key: 'action', width: 100, render: () => <Button type="link" size="small">详情</Button> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select value={logLevel} onChange={setLogLevel} style={{ width: 120 }}>
            <Option value="all">全部级别</Option>
            <Option value="DEBUG">DEBUG</Option>
            <Option value="INFO">INFO</Option>
            <Option value="WARN">WARN</Option>
            <Option value="ERROR">ERROR</Option>
            <Option value="FATAL">FATAL</Option>
          </Select>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部模块</Option>
            <Option value="user">用户模块</Option>
            <Option value="video">视频模块</Option>
            <Option value="system">系统模块</Option>
          </Select>
          <RangePicker showTime />
          <Input.Search placeholder="搜索日志内容" style={{ width: 200 }} />
          <Button icon={<SearchOutlined />} type="primary">查询</Button>
          <Button icon={<DownloadOutlined />}>导出</Button>
        </Space>
      </Card>

      <Card title="日志列表">
        <Table columns={columns} dataSource={logData} rowKey="id" pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }} />
      </Card>
    </div>
  );
};

export default LogManage;
