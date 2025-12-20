/**
 * 积分商城管理页面
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Statistic, Row, Col, Popconfirm, message, Modal, Form, Input, InputNumber, Select, Upload, Image, Typography } from 'antd';
import { GiftOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, UploadOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import * as pointApi from '../../../api/admin/pointApi';

const { Option } = Select;
const { Text } = Typography;

const PointShop: React.FC = () => {
  const [addGoodsModalVisible, setAddGoodsModalVisible] = useState(false);
  const [editGoodsModalVisible, setEditGoodsModalVisible] = useState(false);
  const [selectedGoods, setSelectedGoods] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // 刷新数据
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await pointApi.getPointProducts({ page: 1, pageSize: 100 });
      message.success('刷新成功');
    } catch (error) {
      message.error('刷新失败');
    } finally {
      setLoading(false);
    }
  };

  // 新增商品
  const handleAddGoods = async () => {
    try {
      const values = await form.validateFields();
      await pointApi.createPointProduct({
        name: values.name,
        description: values.description || '',
        price: values.points,
        stock: values.stock,
        category: values.category,
        type: values.category === 'virtual' ? 'virtual' : 'physical'
      });
      message.success('新增成功');
      setAddGoodsModalVisible(false);
      form.resetFields();
      handleRefresh();
    } catch (error) {
      message.error('新增失败');
    }
  };

  // 编辑商品
  const handleEditGoods = async () => {
    try {
      const values = await editForm.validateFields();
      await pointApi.updatePointProduct(selectedGoods.id, {
        name: values.name,
        description: values.description,
        price: values.points,
        stock: values.stock
      });
      message.success('保存成功');
      setEditGoodsModalVisible(false);
      handleRefresh();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 删除商品
  const handleDeleteGoods = async (id: number) => {
    try {
      await pointApi.deletePointProduct(id);
      message.success('删除成功');
      handleRefresh();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 切换商品状态
  const handleToggleStatus = async (record: any) => {
    try {
      const newStatus = record.status === 'online' ? 'soldout' : 'available';
      await pointApi.updatePointProduct(record.id, { status: newStatus });
      message.success(newStatus === 'available' ? '已上架' : '已下架');
      handleRefresh();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  // 编辑按钮点击
  const handleEditClick = (record: any) => {
    setSelectedGoods(record);
    editForm.setFieldsValue({
      name: record.name,
      category: record.category,
      points: record.points,
      stock: record.stock,
      description: record.description
    });
    setEditGoodsModalVisible(true);
  };
  const goodsData = [
    { id: 1, name: 'VIP会员月卡', category: 'virtual', points: 500, stock: 999, exchanged: 156, status: 'online', image: 'https://via.placeholder.com/60' },
    { id: 2, name: '精品课程优惠券', category: 'virtual', points: 200, stock: 500, exchanged: 89, status: 'online', image: 'https://via.placeholder.com/60' },
    { id: 3, name: '定制笔记本', category: 'physical', points: 1000, stock: 50, exchanged: 23, status: 'online', image: 'https://via.placeholder.com/60' },
    { id: 4, name: '技术书籍', category: 'physical', points: 800, stock: 30, exchanged: 12, status: 'online', image: 'https://via.placeholder.com/60' },
    { id: 5, name: '限量版T恤', category: 'physical', points: 1500, stock: 0, exchanged: 20, status: 'offline', image: 'https://via.placeholder.com/60' },
  ];

  const columns: ColumnsType<typeof goodsData[0]> = [
    { title: '商品图片', dataIndex: 'image', key: 'image', render: (url) => <Image src={url} width={50} height={50} style={{ objectFit: 'cover' }} /> },
    { title: '商品名称', dataIndex: 'name', key: 'name' },
    { title: '分类', dataIndex: 'category', key: 'category', render: (cat) => cat === 'virtual' ? <Tag color="blue">虚拟商品</Tag> : <Tag color="orange">实物商品</Tag> },
    { title: '所需积分', dataIndex: 'points', key: 'points', render: (points) => <Text strong style={{ color: '#faad14' }}>{points}</Text> },
    { title: '库存', dataIndex: 'stock', key: 'stock', render: (stock) => stock === 0 ? <Text type="danger">已售罄</Text> : stock },
    { title: '已兑换', dataIndex: 'exchanged', key: 'exchanged' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status) => status === 'online' ? <Tag color="success">上架</Tag> : <Tag color="default">下架</Tag> },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditClick(record)} />
          <Button type="text" size="small" onClick={() => handleToggleStatus(record)}>
            {record.status === 'online' ? '下架' : '上架'}
          </Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDeleteGoods(record.id)}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="商品总数" value={goodsData.length} prefix={<GiftOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="上架商品" value={goodsData.filter(g => g.status === 'online').length} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="总兑换次数" value={goodsData.reduce((sum, g) => sum + g.exchanged, 0)} prefix={<ShoppingOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="今日兑换" value={15} /></Card></Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddGoodsModalVisible(true)}>新增商品</Button>
          <Select placeholder="商品分类" style={{ width: 120 }} allowClear>
            <Option value="virtual">虚拟商品</Option>
            <Option value="physical">实物商品</Option>
          </Select>
          <Select placeholder="状态" style={{ width: 100 }} allowClear>
            <Option value="online">上架</Option>
            <Option value="offline">下架</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>刷新</Button>
        </Space>
        <Table columns={columns} dataSource={goodsData} rowKey="id" loading={loading} pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 件商品` }} />
      </Card>

      <Modal 
        title="新增商品" 
        open={addGoodsModalVisible} 
        onCancel={() => setAddGoodsModalVisible(false)} 
        onOk={handleAddGoods}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="商品名称" name="name" rules={[{ required: true, message: '请输入商品名称' }]}>
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item label="商品分类" name="category" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="请选择分类">
              <Option value="virtual">虚拟商品</Option>
              <Option value="physical">实物商品</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="所需积分" name="points" rules={[{ required: true, message: '请输入积分' }]}>
                <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入积分" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="库存数量" name="stock" rules={[{ required: true, message: '请输入库存' }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入库存" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="商品图片" name="image">
            <Upload listType="picture-card" maxCount={1}>
              <div><UploadOutlined /><div style={{ marginTop: 8 }}>上传</div></div>
            </Upload>
          </Form.Item>
          <Form.Item label="商品描述" name="description">
            <Input.TextArea rows={3} placeholder="请输入商品描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal 
        title="编辑商品" 
        open={editGoodsModalVisible} 
        onCancel={() => setEditGoodsModalVisible(false)} 
        onOk={handleEditGoods}
        confirmLoading={loading}
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="商品名称" name="name" rules={[{ required: true, message: '请输入商品名称' }]}>
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item label="商品分类" name="category" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="请选择分类" disabled>
              <Option value="virtual">虚拟商品</Option>
              <Option value="physical">实物商品</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="所需积分" name="points" rules={[{ required: true, message: '请输入积分' }]}>
                <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入积分" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="库存数量" name="stock" rules={[{ required: true, message: '请输入库存' }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入库存" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="商品描述" name="description">
            <Input.TextArea rows={3} placeholder="请输入商品描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointShop;
