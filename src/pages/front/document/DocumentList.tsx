/**
 * 文档列表页面
 */

import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Space, 
  Pagination,
  Empty,
  Spin,
  Avatar,
  Typography,
  Drawer,
  Form,
  DatePicker,
  Slider,
  Checkbox,
  Divider,
  Radio
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  EyeOutlined, 
  LikeOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  StarOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

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
  authorAvatar?: string;
  publishTime: string;
  category: string;
  tags: string[];
  isFree: boolean;
  points?: number;
  rating: number;
}

interface FilterValues {
  dateRange?: [any, any];
  priceType?: 'all' | 'free' | 'paid';
  pointsRange?: [number, number];
  ratingRange?: number;
  selectedTags?: string[];
  authors?: string[];
}

const DocumentList: React.FC = () => {
  const [loading] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [form] = Form.useForm();

  // 模拟文档数据
  const mockDocuments: DocumentItem[] = [
    {
      id: '1',
      title: 'JavaScript异步编程详解',
      description: '深入理解Promise、async/await、事件循环等异步编程概念，包含大量实战案例和最佳实践。',
      thumbnail: '/default/fileDefaultPc.jpg',
      views: 2580,
      likes: 156,
      downloads: 89,
      author: '前端专家',
      authorAvatar: '/api/placeholder/32/32',
      publishTime: '2024-01-15',
      category: 'frontend',
      tags: ['JavaScript', '异步编程', 'Promise'],
      isFree: true,
      rating: 4.8,
    },
    {
      id: '2',
      title: 'React Hooks 完全指南',
      description: '从基础到高级，全面掌握React Hooks的使用方法和设计模式。',
      thumbnail: '/default/fileDefaultPc.jpg',
      views: 1890,
      likes: 234,
      downloads: 156,
      author: 'React大师',
      authorAvatar: '/api/placeholder/32/32',
      publishTime: '2024-01-12',
      category: 'frontend',
      tags: ['React', 'Hooks', '组件'],
      isFree: false,
      points: 5,
      rating: 4.9,
    },
    {
      id: '3',
      title: 'Node.js 微服务架构实战',
      description: '构建可扩展的微服务系统，包含服务发现、负载均衡、监控等核心技术。',
      thumbnail: '/default/fileDefaultPc.jpg',
      views: 3200,
      likes: 298,
      downloads: 201,
      author: '架构师',
      authorAvatar: '/api/placeholder/32/32',
      publishTime: '2024-01-10',
      category: 'backend',
      tags: ['Node.js', '微服务', '架构'],
      isFree: false,
      points: 8,
      rating: 4.7,
    },
  ];

  const categories = [
    { value: 'all', label: '全部分类' },
    { value: 'frontend', label: '前端开发' },
    { value: 'backend', label: '后端开发' },
    { value: 'mobile', label: '移动开发' },
    { value: 'ai', label: '人工智能' },
    { value: 'database', label: '数据库' },
    { value: 'devops', label: '运维部署' },
  ];

  const sortOptions = [
    { value: 'latest', label: '最新发布' },
    { value: 'popular', label: '最热浏览' },
    { value: 'rating', label: '最高评分' },
    { value: 'downloads', label: '下载最多' },
  ];

  const allTags = ['JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'Python', 'Java', 'Go', '微服务', '架构设计', '数据库', 'DevOps'];
  const allAuthors = ['前端专家', 'React大师', '架构师', 'AI研究员', '全栈工程师', '数据库专家'];

  const handleSearch = (value: string) => {
    setCurrentPage(1);
    console.log('搜索:', value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleFilterApply = () => {
    const values = form.getFieldsValue();
    setFilterValues(values);
    setFilterVisible(false);
    setCurrentPage(1);
    console.log('筛选条件:', values);
  };

  const handleFilterReset = () => {
    form.resetFields();
    setFilterValues({});
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterValues.dateRange) count++;
    if (filterValues.priceType && filterValues.priceType !== 'all') count++;
    if (filterValues.pointsRange && (filterValues.pointsRange[0] > 0 || filterValues.pointsRange[1] < 50)) count++;
    if (filterValues.ratingRange && filterValues.ratingRange > 0) count++;
    if (filterValues.selectedTags && filterValues.selectedTags.length > 0) count++;
    if (filterValues.authors && filterValues.authors.length > 0) count++;
    return count;
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarOutlined key={i} style={{ color: '#faad14' }} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarOutlined key="half" style={{ color: '#faad14', opacity: 0.5 }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarOutlined key={`empty-${i}`} style={{ color: '#d9d9d9' }} />);
    }

    return stars;
  };

  const DocumentCard: React.FC<{ document: DocumentItem }> = ({ document }) => (
    <Card
      hoverable
      cover={
        <div style={{ position: 'relative' }}>
          <img
            alt={document.title}
            src={document.thumbnail}
            style={{ 
              width: '100%', 
              height: '160px', 
              objectFit: 'cover',
              background: '#f0f0f0'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0xMjAgNjBIMTgwVjEwMEgxMjBWNjBaIiBmaWxsPSIjOTk5OTk5Ii8+CjxwYXRoIGQ9Ik0xMzAgNzBIMTcwVjc1SDEzMFY3MFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHA+CjxwYXRoIGQ9Ik0xMzAgODBIMTcwVjg1SDEzMFY4MFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHA+CjxwYXRoIGQ9Ik0xMzAgOTBIMTcwVjk1SDEzMFY5MFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+Cg==';
            }}
          />
          {!document.isFree && (
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#faad14',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {document.points}积分
            </div>
          )}
          {document.isFree && (
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#52c41a',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              免费
            </div>
          )}
        </div>
      }
      actions={[
        <Space key="views">
          <EyeOutlined />
          <Text type="secondary">{formatNumber(document.views)}</Text>
        </Space>,
        <Space key="likes">
          <LikeOutlined />
          <Text type="secondary">{formatNumber(document.likes)}</Text>
        </Space>,
        <Space key="downloads">
          <DownloadOutlined />
          <Text type="secondary">{formatNumber(document.downloads)}</Text>
        </Space>
      ]}
      style={{ marginBottom: '16px' }}
    >
      <Card.Meta
        title={
          <Link 
            to={`/document/${document.id}`}
            style={{ 
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            <Text strong style={{ fontSize: '16px' }}>
              {document.title}
            </Text>
          </Link>
        }
        description={
          <div>
            <Paragraph 
              ellipsis={{ rows: 2 }}
              style={{ 
                margin: '8px 0',
                color: '#666',
                fontSize: '13px',
                lineHeight: '1.4'
              }}
            >
              {document.description}
            </Paragraph>
            
            {/* 评分 */}
            <div style={{ marginBottom: '8px' }}>
              <Space>
                {renderStars(document.rating)}
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {document.rating}
                </Text>
              </Space>
            </div>

            {/* 标签 */}
            <div style={{ marginBottom: '8px' }}>
              <Space wrap>
                {document.tags.map(tag => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>

            {/* 作者信息 */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px'
            }}>
              <Space>
                <Avatar 
                  size="small" 
                  src={document.authorAvatar}
                  icon={<FileTextOutlined />}
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {document.author}
                </Text>
              </Space>
              <Space>
                <ClockCircleOutlined style={{ fontSize: '12px', color: '#999' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {document.publishTime}
                </Text>
              </Space>
            </div>
          </div>
        }
      />
    </Card>
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* 搜索和筛选区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索文档标题、内容、标签..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={category}
              onChange={handleCategoryChange}
              style={{ width: '100%' }}
              size="large"
            >
              {categories.map(cat => (
                <Select.Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              style={{ width: '100%' }}
              size="large"
            >
              {sortOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'right' }}>
              <Button 
                icon={<FilterOutlined />}
                onClick={() => setFilterVisible(true)}
              >
                高级筛选
                {getActiveFilterCount() > 0 && (
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    {getActiveFilterCount()}
                  </Tag>
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 高级筛选抽屉 */}
      <Drawer
        title="高级筛选"
        placement="right"
        onClose={() => setFilterVisible(false)}
        open={filterVisible}
        width={360}
        extra={
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={() => setFilterVisible(false)}
          />
        }
        footer={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={handleFilterReset} style={{ flex: 1 }}>
              重置
            </Button>
            <Button type="primary" onClick={handleFilterApply} style={{ flex: 1 }}>
              应用筛选
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="dateRange" label="发布时间">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Divider />

          <Form.Item name="priceType" label="价格类型">
            <Radio.Group>
              <Radio value="all">全部</Radio>
              <Radio value="free">免费</Radio>
              <Radio value="paid">付费</Radio>
            </Radio.Group>
          </Form.Item>

          <Divider />

          <Form.Item name="pointsRange" label="积分范围">
            <Slider
              range
              min={0}
              max={50}
              defaultValue={[0, 50]}
              marks={{
                0: '0',
                10: '10',
                20: '20',
                30: '30',
                40: '40',
                50: '50+'
              }}
            />
          </Form.Item>

          <Divider />

          <Form.Item name="ratingRange" label="最低评分">
            <Slider
              min={0}
              max={5}
              step={0.5}
              defaultValue={0}
              marks={{
                0: '不限',
                3: '3星',
                4: '4星',
                5: '5星'
              }}
            />
          </Form.Item>

          <Divider />

          <Form.Item name="selectedTags" label="标签筛选">
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[8, 8]}>
                {allTags.map(tag => (
                  <Col span={12} key={tag}>
                    <Checkbox value={tag}>{tag}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Divider />

          <Form.Item name="authors" label="作者筛选">
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[8, 8]}>
                {allAuthors.map(author => (
                  <Col span={24} key={author}>
                    <Checkbox value={author}>{author}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Drawer>

      {/* 文档列表 */}
      <Spin spinning={loading}>
        {mockDocuments.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {mockDocuments.map(document => (
                <Col xs={24} sm={12} md={8} lg={6} key={document.id}>
                  <DocumentCard document={document} />
                </Col>
              ))}
            </Row>

            {/* 分页 - 放在底部 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #f0f0f0'
            }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={100}
                showSizeChanger
                showQuickJumper
                pageSizeOptions={['12', '24', '36', '48']}
                showTotal={(total, range) =>
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                }
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <Empty
            description="暂无文档内容"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Spin>
    </div>
  );
};

export default DocumentList;
