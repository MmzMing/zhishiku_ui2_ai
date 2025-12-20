/**
 * 审计追踪页面
 */

import React from 'react';
import { Card, Table, Tag, Button, Statistic, Row, Col } from 'antd';
import { AuditOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import * as systemApi from '../../../api/admin/systemApi';

const AuditTrail: React.FC = () => {
  const auditData = [
    { id: 1, operator: 'admin', action: '修改用户权限', target: 'user_456', result: '成功', time: '2024-12-19 14:30:00', ip: '192.168.1.10' },
    { id: 2, operator: 'editor', action: '删除文档', target: 'doc_789', result: '成功', time: '2024-12-19 14:25:00', ip: '192.168.1.11' },
    { id: 3, operator: 'admin', action: '新增角色', target: 'role_vip', result: '成功', time: '2024-12-19 14:20:00', ip: '192.168.1.10' },
    { id: 4, operator: 'system', action: '自动备份', target: 'database', result: '成功', time: '2024-12-19 14:00:00', ip: '192.168.1.100' },
  ];

  const columns: ColumnsType<typeof auditData[0]> = [
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
    { title: '操作类型', dataIndex: 'action', key: 'action' },
    { title: '操作对象', dataIndex: 'target', key: 'target' },
    { title: '结果', dataIndex: 'result', key: 'result', render: (result) => <Tag color={result === '成功' ? 'success' : 'error'}>{result}</Tag> },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    { title: '操作', key: 'action2', render: () => <Button type="link" size="small">详情</Button> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="今日操作" value={856} prefix={<AuditOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="敏感操作" value={23} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="异常操作" value={2} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="活跃用户" value={45} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card title="审计记录" extra={<Button icon={<DownloadOutlined />}>导出报告</Button>}>
        <Table columns={columns} dataSource={auditData} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default AuditTrail;
