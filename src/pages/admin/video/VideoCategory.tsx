/**
 * 视频分类管理页面
 */

import React from 'react';
import { Card, Row, Col, Tree, Table, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const VideoCategory: React.FC = () => {
  const categoryTreeData: DataNode[] = [
    {
      title: '前端开发', key: '1', children: [
        { title: 'React', key: '1-1' },
        { title: 'Vue', key: '1-2' },
        { title: 'Angular', key: '1-3' },
      ],
    },
    {
      title: '后端开发', key: '2', children: [
        { title: 'Java', key: '2-1' },
        { title: 'Python', key: '2-2' },
        { title: 'Node.js', key: '2-3' },
      ],
    },
    {
      title: '运维', key: '3', children: [
        { title: 'Docker', key: '3-1' },
        { title: 'Kubernetes', key: '3-2' },
      ],
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col span={8}>
          <Card title="分类树" extra={<Button type="primary" size="small" icon={<PlusOutlined />}>新增</Button>}>
            <Tree
              showLine
              defaultExpandAll
              treeData={categoryTreeData}
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
          <Card title="分类统计">
            <Table
              dataSource={[
                { key: '1', name: '前端开发', count: 256, views: 125800 },
                { key: '2', name: '后端开发', count: 189, views: 98500 },
                { key: '3', name: '运维', count: 78, views: 45200 },
              ]}
              columns={[
                { title: '分类名称', dataIndex: 'name' },
                { title: '视频数量', dataIndex: 'count' },
                { title: '总播放量', dataIndex: 'views', render: (v) => v.toLocaleString() },
                { title: '操作', render: () => <Button type="link" size="small">查看视频</Button> },
              ]}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VideoCategory;
