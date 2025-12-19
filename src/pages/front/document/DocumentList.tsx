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
  Typography
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  EyeOutlined, 
  LikeOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  StarOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;
const { Text, Paragraph } = Typography;

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

const DocumentList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // 模拟文档数据
  const mockDocuments: DocumentItem[] = [
    {
      id: '1',
      title: 'JavaScript异步编程详解',
      description: '深入理解Promise、async/await、事件循环等异步编程概念，包含大量实战案例和最佳实践。',
      thumbnail: 'public/default/fileDefaultPc.jpg',
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
      thumbnail: 'public/default/fileDefaultPc.jpg',
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
      thumbnail: 'public/default/fileDefaultPc.jpg',
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

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
    // TODO: 实际搜索逻辑
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    // TODO: 排序逻辑
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
    // TODO: 分类筛选逻辑
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
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
        <Space key="views" size="small">
          <EyeOutlined />
          <Text type="secondary">{formatNumber(document.views)}</Text>
        </Space>,
        <Space key="likes" size="small">
          <LikeOutlined />
          <Text type="secondary">{formatNumber(document.likes)}</Text>
        </Space>,
        <Space key="downloads" size="small">
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
              <Space size="small">
                {renderStars(document.rating)}
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {document.rating}
                </Text>
              </Space>
            </div>

            {/* 标签 */}
            <div style={{ marginBottom: '8px' }}>
              <Space wrap size="small">
                {document.tags.map(tag => (
                  <Tag key={tag} size="small" color="blue">
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
              <Space size="small">
                <Avatar 
                  size="small" 
                  src={document.authorAvatar}
                  icon={<FileTextOutlined />}
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {document.author}
                </Text>
              </Space>
              <Space size="small">
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
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
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
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button icon={<FilterOutlined />}>
                  高级筛选
                </Button>
                <Text type="secondary">
                  共找到 {mockDocuments.length} 篇文档
                </Text>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

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

            {/* 分页 */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={100} // 模拟总数
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                }
                onChange={(page, size) => {
                  setCurrentPage(page);
                  // TODO: 分页逻辑
                }}
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