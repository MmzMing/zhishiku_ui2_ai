/**
 * 视频列表页面
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
  Spin
} from 'antd';
import { 
  SearchOutlined, 
  PlayCircleOutlined, 
  EyeOutlined, 
  LikeOutlined,
  ClockCircleOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  author: string;
  publishTime: string;
  category: string;
  tags: string[];
}

const VideoList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // 模拟视频数据
  const mockVideos: VideoItem[] = [
    {
      id: '1',
      title: 'React 18 新特性详解',
      description: '深入了解React 18的并发特性、Suspense改进和新的Hooks',
      thumbnail: 'public/default/fileDefaultPc.jpg',
      duration: '15:30',
      views: 1250,
      likes: 89,
      author: '前端大师',
      publishTime: '2024-01-15',
      category: 'frontend',
      tags: ['React', 'JavaScript', '前端'],
    },
    {
      id: '2',
      title: 'TypeScript 高级类型系统',
      description: '掌握TypeScript的高级类型特性，提升代码质量',
      thumbnail: 'public/default/fileDefaultPc.jpg',
      duration: '22:45',
      views: 980,
      likes: 67,
      author: 'TS专家',
      publishTime: '2024-01-12',
      category: 'frontend',
      tags: ['TypeScript', '类型系统'],
    },
    {
      id: '3',
      title: 'Node.js 性能优化实战',
      description: '从内存管理到集群部署，全面提升Node.js应用性能',
      thumbnail: 'public/default/fileDefaultPc.jpg',
      duration: '28:15',
      views: 1580,
      likes: 124,
      author: '后端架构师',
      publishTime: '2024-01-10',
      category: 'backend',
      tags: ['Node.js', '性能优化', '后端'],
    },
  ];

  const categories = [
    { value: 'all', label: '全部分类' },
    { value: 'frontend', label: '前端开发' },
    { value: 'backend', label: '后端开发' },
    { value: 'mobile', label: '移动开发' },
    { value: 'ai', label: '人工智能' },
    { value: 'database', label: '数据库' },
  ];

  const sortOptions = [
    { value: 'latest', label: '最新发布' },
    { value: 'popular', label: '最热播放' },
    { value: 'rating', label: '最高评分' },
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

  const VideoCard: React.FC<{ video: VideoItem }> = ({ video }) => (
    <Card
      hoverable
      cover={
        <div style={{ position: 'relative' }}>
          <img
            alt={video.title}
            src={video.thumbnail}
            style={{ 
              width: '100%', 
              height: '180px', 
              objectFit: 'cover',
              background: '#f0f0f0'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0xNDAgODBMMTgwIDEwMEwxNDAgMTIwVjgwWiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K';
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {video.duration}
          </div>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '32px',
            color: 'rgba(255,255,255,0.8)',
            opacity: 0,
            transition: 'opacity 0.3s'
          }} className="play-icon">
            <PlayCircleOutlined />
          </div>
        </div>
      }
      actions={[
        <Space key="views">
          <EyeOutlined />
          {formatNumber(video.views)}
        </Space>,
        <Space key="likes">
          <LikeOutlined />
          {formatNumber(video.likes)}
        </Space>,
        <Space key="time">
          <ClockCircleOutlined />
          {video.publishTime}
        </Space>
      ]}
      style={{ marginBottom: '16px' }}
    >
      <Card.Meta
        title={
          <Link 
            to={`/video/${video.id}`}
            style={{ 
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            {video.title}
          </Link>
        }
        description={
          <div>
            <p style={{ 
              margin: '8px 0',
              color: '#666',
              fontSize: '13px',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {video.description}
            </p>
            <div style={{ marginTop: '8px' }}>
              <Space wrap>
                {video.tags.map(tag => (
                  <Tag key={tag} size="small" color="blue">
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
            <div style={{ 
              marginTop: '8px',
              fontSize: '12px',
              color: '#999'
            }}>
              作者: {video.author}
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
              placeholder="搜索视频标题、标签..."
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
              <Button icon={<FilterOutlined />}>
                高级筛选
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 视频列表 */}
      <Spin spinning={loading}>
        {mockVideos.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {mockVideos.map(video => (
                <Col xs={24} sm={12} md={8} lg={6} key={video.id}>
                  <VideoCard video={video} />
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
            description="暂无视频内容"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Spin>

      <style jsx>{`
        .ant-card:hover .play-icon {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default VideoList;