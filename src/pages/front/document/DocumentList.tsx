/**
 * 文档列表页面 - 优化版
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, Row, Col, Input, Select, Button, Tag, Space, Pagination,
  Empty, Skeleton, Avatar, Typography, Drawer, Form, DatePicker,
  Slider, Checkbox, Divider, Radio
} from 'antd';
import { 
  SearchOutlined, FileTextOutlined, EyeOutlined, LikeOutlined,
  DownloadOutlined, ClockCircleOutlined, FilterOutlined, StarOutlined, CloseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as documentApi from '../../../api/front/documentApi';

const { Search } = Input;
const { Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  views: number;
  likes: number;
  downloads: number;
  author: string;
  publishTime: string;
  category: string;
  tags: string[];
  isFree: boolean;
  points?: number;
  rating: number;
}

const DEFAULT_THUMBNAIL = 'default/fileDefaultPc.jpg';

const DocumentList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<any>({});
  const [form] = Form.useForm();

  // 模拟数据 - 使用 useMemo 优化
  const mockDocuments = useMemo((): DocumentItem[] => [
    {
      id: '1', title: 'JavaScript异步编程详解', description: '深入理解Promise、async/await、事件循环等异步编程概念。',
      thumbnail: DEFAULT_THUMBNAIL, views: 2580, likes: 156, downloads: 89, author: '前端专家',
      publishTime: '2024-01-15', category: 'frontend', tags: ['JavaScript', '异步编程'], isFree: true, rating: 4.8,
    },
    {
      id: '2', title: 'React Hooks 完全指南', description: '从基础到高级，全面掌握React Hooks的使用方法。',
      thumbnail: DEFAULT_THUMBNAIL, views: 1890, likes: 234, downloads: 156, author: 'React大师',
      publishTime: '2024-01-12', category: 'frontend', tags: ['React', 'Hooks'], isFree: false, points: 5, rating: 4.9,
    },
    {
      id: '3', title: 'Node.js 微服务架构实战', description: '构建可扩展的微服务系统，包含服务发现、负载均衡等。',
      thumbnail: DEFAULT_THUMBNAIL, views: 3200, likes: 298, downloads: 201, author: '架构师',
      publishTime: '2024-01-10', category: 'backend', tags: ['Node.js', '微服务'], isFree: false, points: 8, rating: 4.7,
    },
  ], []);

  const categories = [
    { value: 'all', label: '全部分类' }, { value: 'frontend', label: '前端开发' },
    { value: 'backend', label: '后端开发' }, { value: 'mobile', label: '移动开发' },
  ];

  const sortOptions = [
    { value: 'latest', label: '最新发布' }, { value: 'popular', label: '最热浏览' },
    { value: 'rating', label: '最高评分' }, { value: 'downloads', label: '下载最多' },
  ];

  // 快速加载数据
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (value: string) => setCurrentPage(1);
  const handleSortChange = (value: string) => { setSortBy(value); setCurrentPage(1); };
  const handleCategoryChange = (value: string) => { setCategory(value); setCurrentPage(1); };
  const handleFilterApply = () => { setFilterValues(form.getFieldsValue()); setFilterVisible(false); setCurrentPage(1); };
  const handleFilterReset = () => { form.resetFields(); setFilterValues({}); };
  const handlePageChange = (page: number, size: number) => { setCurrentPage(page); setPageSize(size); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const fmt = (n: number) => n >= 10000 ? `${(n / 10000).toFixed(1)}万` : n.toString();

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<StarOutlined key={i} style={{ color: i < Math.floor(rating) ? '#faad14' : '#d9d9d9' }} />);
    }
    return stars;
  };

  const DocumentCard: React.FC<{ document: DocumentItem }> = ({ document }) => (
    <Card
      hoverable
      style={{ marginBottom: '16px', cursor: 'pointer', borderRadius: '16px' }}
      onClick={() => navigate(`/document/${document.id}`)}
      cover={
        <div style={{ position: 'relative', height: '160px', background: '#f5f5f5' }}>
          <img
            alt={document.title}
            src={document.thumbnail}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_THUMBNAIL; }}
          />
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            background: document.isFree ? '#52c41a' : '#faad14',
            color: 'white', padding: '4px 10px', borderRadius: '16px',
            fontSize: '12px', fontWeight: 'bold'
          }}>
            {document.isFree ? '免费' : `${document.points}积分`}
          </div>
        </div>
      }
      actions={[
        <Space key="views" onClick={(e) => e.stopPropagation()}>
          <EyeOutlined /><Text type="secondary">{fmt(document.views)}</Text>
        </Space>,
        <Space key="likes" onClick={(e) => e.stopPropagation()}>
          <LikeOutlined /><Text type="secondary">{fmt(document.likes)}</Text>
        </Space>,
        <Space key="downloads" onClick={(e) => e.stopPropagation()}>
          <DownloadOutlined /><Text type="secondary">{fmt(document.downloads)}</Text>
        </Space>
      ]}
    >
      <Card.Meta
        title={<Text strong style={{ fontSize: '16px' }}>{document.title}</Text>}
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '8px 0', color: '#666', fontSize: '13px' }}>
              {document.description}
            </Paragraph>
            <div style={{ marginBottom: '8px' }}>
              <Space>{renderStars(document.rating)}<Text type="secondary" style={{ fontSize: '12px' }}>{document.rating}</Text></Space>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Space wrap>
                {document.tags.map(tag => (
                  <Tag key={tag} color="blue" onClick={(e) => { e.stopPropagation(); handleSearch(tag); }} style={{ cursor: 'pointer', borderRadius: '12px' }}>
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <Space>
                <Avatar size="small" icon={<FileTextOutlined />} />
                <Text type="secondary" style={{ fontSize: '12px' }}>{document.author}</Text>
              </Space>
              <Space>
                <ClockCircleOutlined style={{ fontSize: '12px', color: '#999' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>{document.publishTime}</Text>
              </Space>
            </div>
          </div>
        }
      />
    </Card>
  );

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <Card style={{ marginBottom: '24px' }}><Skeleton active /></Card>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map(i => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <Card><Skeleton active /></Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px', borderRadius: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search placeholder="搜索文档..." allowClear enterButton={<SearchOutlined />} size="large" onSearch={handleSearch} />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select value={category} onChange={handleCategoryChange} style={{ width: '100%' }} size="large">
              {categories.map(cat => <Select.Option key={cat.value} value={cat.value}>{cat.label}</Select.Option>)}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select value={sortBy} onChange={handleSortChange} style={{ width: '100%' }} size="large">
              {sortOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'right' }}>
              <Button icon={<FilterOutlined />} onClick={() => setFilterVisible(true)} style={{ borderRadius: '12px' }}>
                高级筛选
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      <Drawer
        title="高级筛选" placement="right" onClose={() => setFilterVisible(false)} open={filterVisible} width={360}
        footer={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={handleFilterReset} style={{ flex: 1 }}>重置</Button>
            <Button type="primary" onClick={handleFilterApply} style={{ flex: 1 }}>应用筛选</Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="dateRange" label="发布时间"><RangePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="priceType" label="价格类型">
            <Radio.Group><Radio value="all">全部</Radio><Radio value="free">免费</Radio><Radio value="paid">付费</Radio></Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>

      {mockDocuments.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {mockDocuments.map(doc => (
              <Col xs={24} sm={12} md={8} lg={6} key={doc.id}><DocumentCard document={doc} /></Col>
            ))}
          </Row>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
            <Pagination
              current={currentPage} pageSize={pageSize} total={100} showSizeChanger showQuickJumper
              pageSizeOptions={['12', '24', '36']} onChange={handlePageChange} onShowSizeChange={handlePageChange}
              showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
            />
          </div>
        </>
      ) : (
        <Empty description="暂无文档内容" />
      )}
    </div>
  );
};

export default DocumentList;