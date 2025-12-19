/**
 * 字典使用统计页面
 */

import React from 'react';
import { Card, Table, Button, Statistic, Row, Col, Typography } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

const DictUsage: React.FC = () => {
  const usageData = [
    { id: '1', dictCode: 'video_category', dictName: '视频分类', usageCount: 892, lastUsed: '2024-12-19 14:30:00' },
    { id: '2', dictCode: 'doc_category', dictName: '文档分类', usageCount: 1256, lastUsed: '2024-12-19 14:25:00' },
    { id: '3', dictCode: 'sys_user_sex', dictName: '用户性别', usageCount: 1328, lastUsed: '2024-12-19 14:20:00' },
    { id: '4', dictCode: 'point_type', dictName: '积分类型', usageCount: 15680, lastUsed: '2024-12-19 14:15:00' },
  ];

  const columns: ColumnsType<typeof usageData[0]> = [
    { title: '字典编码', dataIndex: 'dictCode', key: 'dictCode', render: (code) => <Text code>{code}</Text> },
    { title: '字典名称', dataIndex: 'dictName', key: 'dictName' },
    { title: '使用次数', dataIndex: 'usageCount', key: 'usageCount', render: (count) => count.toLocaleString(), sorter: (a, b) => a.usageCount - b.usageCount },
    { title: '最后使用', dataIndex: 'lastUsed', key: 'lastUsed' },
    { title: '操作', key: 'action', render: () => <Button type="link" size="small">查看详情</Button> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="今日调用" value={2304} prefix={<BarChartOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="本周调用" value={15680} /></Card></Col>
        <Col span={6}><Card><Statistic title="本月调用" value={68920} /></Card></Col>
        <Col span={6}><Card><Statistic title="缓存命中率" value={98.5} suffix="%" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card title="字典使用排行">
        <Table columns={columns} dataSource={usageData} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default DictUsage;
