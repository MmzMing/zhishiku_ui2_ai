/**
 * 部门架构管理页面
 */

import React from 'react';
import { Card, Row, Col, Tree, Table, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const Department: React.FC = () => {
  const departmentTreeData: DataNode[] = [
    {
      title: '总公司', key: '0', children: [
        {
          title: '技术部', key: '1', children: [
            { title: '前端组', key: '1-1' },
            { title: '后端组', key: '1-2' },
            { title: '运维组', key: '1-3' },
          ],
        },
        {
          title: '内容部', key: '2', children: [
            { title: '编辑组', key: '2-1' },
            { title: '审核组', key: '2-2' },
          ],
        },
        { title: '市场部', key: '3' },
        { title: '测试部', key: '4' },
      ],
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col span={8}>
          <Card title="部门架构" extra={<Button type="primary" size="small" icon={<PlusOutlined />}>新增</Button>}>
            <Tree
              showLine
              defaultExpandAll
              treeData={departmentTreeData}
              titleRender={(node) => (
                <Space>
                  <span>{node.title as string}</span>
                  <Button type="text" size="small" icon={<EditOutlined />} />
                  <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                </Space>
              )}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="部门统计">
            <Table
              dataSource={[
                { key: '1', name: '技术部', userCount: 45, activeCount: 42 },
                { key: '2', name: '内容部', userCount: 28, activeCount: 25 },
                { key: '3', name: '市场部', userCount: 15, activeCount: 14 },
                { key: '4', name: '测试部', userCount: 8, activeCount: 7 },
              ]}
              columns={[
                { title: '部门名称', dataIndex: 'name' },
                { title: '总人数', dataIndex: 'userCount' },
                { title: '活跃人数', dataIndex: 'activeCount' },
                { title: '活跃率', render: (_, r) => `${((r.activeCount / r.userCount) * 100).toFixed(1)}%` },
                { title: '操作', render: () => <Button type="link" size="small">查看成员</Button> },
              ]}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Department;
