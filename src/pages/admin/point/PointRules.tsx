/**
 * 积分规则配置页面
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, Popconfirm, message, Modal, Form, Input, InputNumber, Select, Switch, Typography } from 'antd';
import { SettingOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;
const { Option } = Select;

const PointRules: React.FC = () => {
  const [addRuleModalVisible, setAddRuleModalVisible] = useState(false);

  const ruleData = [
    { id: 1, name: '每日签到', type: 'earn', points: 10, limit: '每日1次', status: 'enabled', remark: '每日首次登录奖励' },
    { id: 2, name: '上传文档', type: 'earn', points: 50, limit: '每日5次', status: 'enabled', remark: '上传文档审核通过后奖励' },
    { id: 3, name: '上传视频', type: 'earn', points: 100, limit: '每日3次', status: 'enabled', remark: '上传视频审核通过后奖励' },
    { id: 4, name: '评论互动', type: 'earn', points: 5, limit: '每日10次', status: 'enabled', remark: '发表评论奖励' },
    { id: 5, name: '下载文档', type: 'spend', points: -10, limit: '无限制', status: 'enabled', remark: '下载付费文档消耗' },
    { id: 6, name: '观看付费视频', type: 'spend', points: -20, limit: '无限制', status: 'enabled', remark: '观看付费视频消耗' },
  ];

  const columns: ColumnsType<typeof ruleData[0]> = [
    { title: '规则名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type) => type === 'earn' ? <Tag color="success" icon={<ArrowUpOutlined />}>获取</Tag> : <Tag color="error" icon={<ArrowDownOutlined />}>消耗</Tag> },
    { title: '积分值', dataIndex: 'points', key: 'points', render: (points) => <Text strong style={{ color: points > 0 ? '#52c41a' : '#ff4d4f' }}>{points > 0 ? `+${points}` : points}</Text> },
    { title: '限制', dataIndex: 'limit', key: 'limit' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => <Switch checked={status === 'enabled'} checkedChildren="启用" unCheckedChildren="禁用" onChange={(checked) => message.success(checked ? '已启用' : '已禁用')} /> },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
    {
      title: '操作', key: 'action',
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Popconfirm title="确定删除？" onConfirm={() => message.success('删除成功')}><Button type="text" size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="获取规则" value={ruleData.filter(r => r.type === 'earn').length} prefix={<ArrowUpOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="消耗规则" value={ruleData.filter(r => r.type === 'spend').length} prefix={<ArrowDownOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="启用规则" value={ruleData.filter(r => r.status === 'enabled').length} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日触发" value={2580} /></Card></Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddRuleModalVisible(true)}>新增规则</Button>
          <Button icon={<ReloadOutlined />}>刷新</Button>
        </Space>
        <Table columns={columns} dataSource={ruleData} rowKey="id" pagination={false} />
      </Card>

      <Modal title="新增积分规则" open={addRuleModalVisible} onCancel={() => setAddRuleModalVisible(false)} onOk={() => { message.success('新增成功'); setAddRuleModalVisible(false); }}>
        <Form layout="vertical">
          <Form.Item label="规则名称" required><Input placeholder="请输入规则名称" /></Form.Item>
          <Form.Item label="规则类型" required><Select placeholder="请选择类型"><Option value="earn">获取积分</Option><Option value="spend">消耗积分</Option></Select></Form.Item>
          <Form.Item label="积分值" required><InputNumber style={{ width: '100%' }} placeholder="请输入积分值" /></Form.Item>
          <Form.Item label="每日限制"><Input placeholder="如：每日5次，无限制" /></Form.Item>
          <Form.Item label="备注"><Input.TextArea rows={3} placeholder="请输入备注" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointRules;
