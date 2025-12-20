/**
 * 视频分类管理页面 - 增强版
 */

import React, { useState } from 'react';
import { 
  Card, Row, Col, Tree, Table, Button, Space, Modal, Form, Input, 
  InputNumber, Switch, Select, message, Popconfirm, Tag, Statistic, Typography
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined, 
  FolderOpenOutlined, PlayCircleOutlined, EyeOutlined
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { TextArea } = Input;
const { Text } = Typography;

interface CategoryItem {
  key: string;
  title: string;
  parentKey?: string;
  icon?: string;
  sort: number;
  description?: string;
  status: boolean;
  videoCount: number;
  views: number;
  children?: CategoryItem[];
}

const VideoCategory: React.FC = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>('');

  // 分类数据
  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      key: '1', title: '前端开发', sort: 1, status: true, videoCount: 256, views: 125800,
      description: '前端开发相关视频教程',
      children: [
        { key: '1-1', title: 'React', parentKey: '1', sort: 1, status: true, videoCount: 89, views: 45000, description: 'React框架教程' },
        { key: '1-2', title: 'Vue', parentKey: '1', sort: 2, status: true, videoCount: 102, views: 52000, description: 'Vue框架教程' },
        { key: '1-3', title: 'Angular', parentKey: '1', sort: 3, status: true, videoCount: 45, views: 18000, description: 'Angular框架教程' },
        { key: '1-4', title: 'TypeScript', parentKey: '1', sort: 4, status: true, videoCount: 20, views: 10800, description: 'TypeScript教程' },
      ],
    },
    {
      key: '2', title: '后端开发', sort: 2, status: true, videoCount: 189, views: 98500,
      description: '后端开发相关视频教程',
      children: [
        { key: '2-1', title: 'Node.js', parentKey: '2', sort: 1, status: true, videoCount: 56, views: 32000, description: 'Node.js教程' },
        { key: '2-2', title: 'Java', parentKey: '2', sort: 2, status: true, videoCount: 78, views: 41000, description: 'Java教程' },
        { key: '2-3', title: 'Python', parentKey: '2', sort: 3, status: true, videoCount: 55, views: 25500, description: 'Python教程' },
      ],
    },
    {
      key: '3', title: '数据库', sort: 3, status: true, videoCount: 78, views: 45200,
      description: '数据库相关视频教程',
      children: [
        { key: '3-1', title: 'MySQL', parentKey: '3', sort: 1, status: true, videoCount: 45, views: 28000, description: 'MySQL教程' },
        { key: '3-2', title: 'Redis', parentKey: '3', sort: 2, status: true, videoCount: 33, views: 17200, description: 'Redis教程' },
      ],
    },
    {
      key: '4', title: '运维部署', sort: 4, status: true, videoCount: 52, views: 31000,
      description: '运维部署相关视频教程',
      children: [
        { key: '4-1', title: 'Docker', parentKey: '4', sort: 1, status: true, videoCount: 28, views: 18000, description: 'Docker教程' },
        { key: '4-2', title: 'Kubernetes', parentKey: '4', sort: 2, status: true, videoCount: 24, views: 13000, description: 'K8s教程' },
      ],
    },
  ]);

  // 转换为树形数据
  const convertToTreeData = (data: CategoryItem[]): DataNode[] => {
    return data.map(item => ({
      key: item.key,
      title: item.title,
      icon: item.children ? <FolderOutlined /> : <PlayCircleOutlined />,
      children: item.children ? convertToTreeData(item.children) : undefined,
    }));
  };

  // 获取所有父级分类选项
  const getParentOptions = () => {
    return [
      { value: '', label: '无（作为一级分类）' },
      ...categories.map(cat => ({ value: cat.key, label: cat.title })),
    ];
  };

  // 查找分类
  const findCategory = (key: string, data: CategoryItem[] = categories): CategoryItem | null => {
    for (const item of data) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findCategory(key, item.children);
        if (found) return found;
      }
    }
    return null;
  };

  // 打开新增弹窗
  const handleAdd = (parentKey?: string) => {
    setModalType('add');
    setSelectedCategory(null);
    form.resetFields();
    form.setFieldsValue({ 
      parentKey: parentKey || '', 
      sort: 0, 
      status: true 
    });
    setModalVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = (category: CategoryItem) => {
    setModalType('edit');
    setSelectedCategory(category);
    form.setFieldsValue({
      title: category.title,
      parentKey: category.parentKey || '',
      description: category.description,
      sort: category.sort,
      status: category.status,
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (modalType === 'add') {
        // 新增分类
        const newKey = `${Date.now()}`;
        const newCategory: CategoryItem = {
          key: newKey,
          title: values.title,
          parentKey: values.parentKey || undefined,
          description: values.description,
          sort: values.sort,
          status: values.status,
          videoCount: 0,
          views: 0,
        };

        if (values.parentKey) {
          // 添加为子分类
          setCategories(prev => prev.map(cat => {
            if (cat.key === values.parentKey) {
              return {
                ...cat,
                children: [...(cat.children || []), newCategory],
              };
            }
            return cat;
          }));
        } else {
          // 添加为一级分类
          setCategories(prev => [...prev, newCategory]);
        }
        message.success('分类添加成功');
      } else {
        // 编辑分类
        const updateCategory = (data: CategoryItem[]): CategoryItem[] => {
          return data.map(item => {
            if (item.key === selectedCategory?.key) {
              return {
                ...item,
                title: values.title,
                description: values.description,
                sort: values.sort,
                status: values.status,
              };
            }
            if (item.children) {
              return { ...item, children: updateCategory(item.children) };
            }
            return item;
          });
        };
        setCategories(updateCategory(categories));
        message.success('分类更新成功');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除分类
  const handleDelete = (key: string) => {
    const deleteFromTree = (data: CategoryItem[]): CategoryItem[] => {
      return data.filter(item => {
        if (item.key === key) return false;
        if (item.children) {
          item.children = deleteFromTree(item.children);
        }
        return true;
      });
    };
    setCategories(deleteFromTree(categories));
    message.success('分类删除成功');
  };

  // 选中分类
  const handleSelect = (keys: React.Key[]) => {
    if (keys.length > 0) {
      setSelectedKey(keys[0] as string);
      const cat = findCategory(keys[0] as string);
      setSelectedCategory(cat);
    }
  };

  // 获取统计数据
  const getStats = () => {
    let totalCategories = 0;
    let totalVideos = 0;
    let totalViews = 0;

    const count = (data: CategoryItem[]) => {
      data.forEach(item => {
        totalCategories++;
        totalVideos += item.videoCount;
        totalViews += item.views;
        if (item.children) count(item.children);
      });
    };
    count(categories);

    return { totalCategories, totalVideos, totalViews };
  };

  const stats = getStats();

  // 树节点渲染
  const renderTreeTitle = (node: DataNode) => {
    const category = findCategory(node.key as string);
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 8 }}>
        <Space>
          <span>{node.title as string}</span>
          <Tag color="blue" style={{ fontSize: 11 }}>{category?.videoCount || 0}</Tag>
        </Space>
        <Space size={0} onClick={(e) => e.stopPropagation()}>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => category && handleEdit(category)} />
          <Popconfirm title="确定删除此分类？" onConfirm={() => handleDelete(node.key as string)}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card><Statistic title="分类总数" value={stats.totalCategories} prefix={<FolderOutlined />} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="视频总数" value={stats.totalVideos} prefix={<PlayCircleOutlined />} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="总播放量" value={stats.totalViews} prefix={<EyeOutlined />} /></Card>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* 左侧分类树 */}
        <Col span={10}>
          <Card 
            title="分类列表" 
            extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => handleAdd()}>新增分类</Button>}
          >
            <Tree
              showLine={{ showLeafIcon: false }}
              showIcon
              defaultExpandAll
              selectedKeys={selectedKey ? [selectedKey] : []}
              onSelect={handleSelect}
              treeData={convertToTreeData(categories)}
              titleRender={renderTreeTitle}
              style={{ minHeight: 400 }}
            />
          </Card>
        </Col>

        {/* 右侧详情和表格 */}
        <Col span={14}>
          {/* 选中分类详情 */}
          {selectedCategory && (
            <Card 
              title={`分类详情 - ${selectedCategory.title}`} 
              style={{ marginBottom: 24 }}
              extra={
                <Space>
                  <Button icon={<EditOutlined />} onClick={() => handleEdit(selectedCategory)}>编辑</Button>
                  <Button icon={<PlusOutlined />} onClick={() => handleAdd(selectedCategory.key)}>添加子分类</Button>
                </Space>
              }
            >
              <Row gutter={[16, 16]}>
                <Col span={8}><Text type="secondary">分类名称：</Text><Text strong>{selectedCategory.title}</Text></Col>
                <Col span={8}><Text type="secondary">排序：</Text><Text>{selectedCategory.sort}</Text></Col>
                <Col span={8}><Text type="secondary">状态：</Text><Tag color={selectedCategory.status ? 'success' : 'default'}>{selectedCategory.status ? '启用' : '禁用'}</Tag></Col>
                <Col span={8}><Text type="secondary">视频数量：</Text><Text strong>{selectedCategory.videoCount}</Text></Col>
                <Col span={8}><Text type="secondary">总播放量：</Text><Text strong>{selectedCategory.views.toLocaleString()}</Text></Col>
                <Col span={8}><Text type="secondary">父级分类：</Text><Text>{selectedCategory.parentKey ? findCategory(selectedCategory.parentKey)?.title : '无'}</Text></Col>
                <Col span={24}><Text type="secondary">描述：</Text><Text>{selectedCategory.description || '暂无描述'}</Text></Col>
              </Row>
            </Card>
          )}

          {/* 分类统计表格 */}
          <Card title="分类统计">
            <Table
              dataSource={categories}
              rowKey="key"
              pagination={false}
              columns={[
                { 
                  title: '分类名称', 
                  dataIndex: 'title', 
                  key: 'title',
                  render: (title, record) => (
                    <Space>
                      <FolderOpenOutlined />
                      <span>{title}</span>
                      {record.children && <Tag>{record.children.length}个子分类</Tag>}
                    </Space>
                  ),
                },
                { title: '视频数量', dataIndex: 'videoCount', key: 'videoCount' },
                { title: '总播放量', dataIndex: 'views', key: 'views', render: (v) => v.toLocaleString() },
                { 
                  title: '状态', 
                  dataIndex: 'status', 
                  key: 'status',
                  render: (status) => <Tag color={status ? 'success' : 'default'}>{status ? '启用' : '禁用'}</Tag>,
                },
                { 
                  title: '操作', 
                  key: 'action',
                  render: (_, record) => (
                    <Space>
                      <Button type="link" size="small" onClick={() => { setSelectedKey(record.key); setSelectedCategory(record); }}>查看</Button>
                      <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增分类' : '编辑分类'}
        open={modalVisible}
        onCancel={() => { setModalVisible(false); form.resetFields(); }}
        onOk={handleSubmit}
        okText={modalType === 'add' ? '添加' : '保存'}
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item
            name="parentKey"
            label="父级分类"
          >
            <Select 
              placeholder="请选择父级分类" 
              options={getParentOptions()}
              disabled={modalType === 'edit'}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="分类描述"
          >
            <TextArea rows={3} placeholder="请输入分类描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sort"
                label="排序"
                rules={[{ required: true, message: '请输入排序' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="数字越小越靠前" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default VideoCategory;
