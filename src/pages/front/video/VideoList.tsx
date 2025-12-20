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
  Spin,
  Drawer,
  Form,
  DatePicker,
  Slider,
  Checkbox,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  PlayCircleOutlined, 
  EyeOutlined, 
  LikeOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import * as videoApi from '../../../api/front/videoApi';

const { Search } = Input;
const { RangePicker } = DatePicker;

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

interface FilterValues {
  dateRange?: [any, any];
  durationRange?: [number, number];
  viewsRange?: [number, number];
  selectedTags?: string[];
  authors?: string[];
}

const VideoList: React.FC = () => {
  const [loading] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [form] = Form.useForm();

  // 模拟视频数据
  const mockVideos: VideoItem[] = [
    {
      id: '1',
      title: 'React 18 新特性详解',
      description: '深入了解React 18的并发特性、Suspense改进和新的Hooks',
      thumbnail: '/default/fileDefaultPc.jpg',
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
      thumbnail: '/default/fileDefaultPc.jpg',
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
      thumbnail: '/default/fileDefaultPc.jpg',
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

  const allTags = ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'Go', '性能优化', '架构设计', '微服务'];
  const allAuthors = ['前端大师', 'TS专家', '后端架构师', 'AI研究员', '全栈工程师'];

  const handleSearch = (value: string) => {
    setCurrentPage(1);
    // TODO: 实际搜索逻辑
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
    if (filterValues.durationRange && (filterValues.durationRange[0] > 0 || filterValues.durationRange[1] < 120)) count++;
    if (filterValues.viewsRange && (filterValues.viewsRange[0] > 0 || filterValues.viewsRange[1] < 100000)) count++;
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

  const VideoCard: React.FC<{ video: VideoItem }> = ({ video }) => (
    <Card
      hoverable
      style={{ 
        marginBottom: '16px',
        cursor: 'pointer',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
      onClick={() => window.location.href = `/video/${video.id}`}
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
            padding: '4px 8px',
            borderRadius: '8px',
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
        <Space key="views" onClick={(e) => e.stopPropagation()}>
          <EyeOutlined />
          {formatNumber(video.views)}
        </Space>,
        <Space key="likes" onClick={(e) => e.stopPropagation()}>
          <LikeOutlined />
          {formatNumber(video.likes)}
        </Space>,
        <Space key="time" onClick={(e) => e.stopPropagation()}>
          <ClockCircleOutlined />
          {video.publishTime}
        </Space>
      ]}
    >
      <Card.Meta
        title={video.title}
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
                  <Tag 
                    key={tag} 
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearch(tag);
                    }}
                    style={{ 
                      cursor: 'pointer',
                      borderRadius: '12px'
                    }}
                  >
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
      <Card style={{ marginBottom: '24px', borderRadius: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索视频标题、标签..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ borderRadius: '12px' }}
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
                style={{ borderRadius: '12px' }}
              >
                高级筛选
                {getActiveFilterCount() > 0 && (
                  <Tag color="blue" style={{ marginLeft: 8, borderRadius: '12px' }}>
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

          <Form.Item name="durationRange" label="视频时长（分钟）">
            <Slider
              range
              min={0}
              max={120}
              defaultValue={[0, 120]}
              marks={{
                0: '0',
                30: '30',
                60: '60',
                90: '90',
                120: '120+'
              }}
            />
          </Form.Item>

          <Divider />

          <Form.Item name="viewsRange" label="播放量">
            <Slider
              range
              min={0}
              max={100000}
              step={1000}
              defaultValue={[0, 100000]}
              tooltip={{ formatter: (value: number | undefined) => formatNumber(value || 0) }}
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
            description="暂无视频内容"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Spin>

      <style>{`
        .ant-card:hover .play-icon {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default VideoList;
