/**
 * 搜索结果页面
 * 按照技术文档5.1.4要求实现
 * 包含：多条件筛选、结果分类展示、关键词高亮、空结果处理
 */

import React, { useState, useEffect } from 'react';
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
  Typography,
  Checkbox,
  Drawer,
  Divider,
  Rate
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  PlayCircleOutlined, 
  EyeOutlined, 
  LikeOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  CloseOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './SearchResults.css';

const { Search } = Input;
const { Title, Text } = Typography;

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video';
  thumbnail?: string;
  views: number;
  likes: number;
  author: string;
  publishTime: string;
  tags: string[];
  rating: number;
  duration?: string;
}

interface FilterState {
  contentType: 'all' | 'document' | 'video';
  timeRange: string;
  minViews: number[];
  minRating: number[];
}

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  
  // 筛选状态
  const [filters, setFilters] = useState<FilterState>({
    contentType: 'all',
    timeRange: 'all',
    minViews: [],
    minRating: [],
  });
  
  // 已选筛选条件标签
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);

  const query = searchParams.get('q') || '';

  // 模拟搜索结果
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'JavaScript异步编程详解',
      description: '深入理解Promise、async/await、事件循环等异步编程概念，包含大量实战案例和最佳实践...',
      type: 'document',
      views: 12580,
      likes: 156,
      author: '前端专家',
      publishTime: '2024-12-15',
      tags: ['JavaScript', '异步编程', 'Promise'],
      rating: 4.5,
    },
    {
      id: '2',
      title: 'React Hooks 完全指南视频教程',
      description: '从基础到高级，全面掌握React Hooks的使用方法和设计模式，包含useState、useEffect、useContext等核心Hook...',
      type: 'video',
      views: 18900,
      likes: 234,
      author: 'React大师',
      publishTime: '2024-12-12',
      tags: ['React', 'Hooks', '组件'],
      rating: 4.8,
      duration: '2:15:30',
    },
    {
      id: '3',
      title: 'Node.js 微服务架构实战',
      description: '构建可扩展的微服务系统，包含服务发现、负载均衡、监控等核心技术，适合有一定Node.js基础的开发者...',
      type: 'document',
      views: 32000,
      likes: 298,
      author: '架构师',
      publishTime: '2024-12-10',
      tags: ['Node.js', '微服务', '架构'],
      rating: 4.2,
    },
    {
      id: '4',
      title: 'Vue 3 组合式API深度解析',
      description: '详细讲解Vue 3的Composition API，包括setup函数、响应式原理、生命周期钩子等核心概念...',
      type: 'video',
      views: 8500,
      likes: 189,
      author: 'Vue专家',
      publishTime: '2024-12-08',
      tags: ['Vue', 'Composition API', '前端'],
      rating: 4.6,
      duration: '1:45:00',
    },
    {
      id: '5',
      title: 'TypeScript高级类型编程',
      description: '掌握TypeScript的高级类型系统，包括泛型、条件类型、映射类型等，提升代码类型安全性...',
      type: 'document',
      views: 5600,
      likes: 145,
      author: 'TS达人',
      publishTime: '2024-12-05',
      tags: ['TypeScript', '类型系统', '前端'],
      rating: 4.3,
    },
  ];

  // 热门搜索关键词
  const hotKeywords = ['React', 'Vue', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'Spring Boot'];

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, filters, currentPage]);

  // 更新筛选标签
  useEffect(() => {
    const tags: string[] = [];
    if (filters.contentType !== 'all') {
      tags.push(filters.contentType === 'document' ? '文档' : '视频');
    }
    if (filters.timeRange !== 'all') {
      const timeMap: Record<string, string> = {
        '1': '最近1天',
        '7': '最近7天',
        '30': '最近30天',
      };
      tags.push(timeMap[filters.timeRange]);
    }
    if (filters.minViews.length > 0) {
      filters.minViews.forEach(v => {
        if (v === 1000) tags.push('浏览量≥1000');
        if (v === 10000) tags.push('浏览量≥1万');
        if (v === 100000) tags.push('浏览量≥10万');
      });
    }
    if (filters.minRating.length > 0) {
      filters.minRating.forEach(r => {
        if (r === 3) tags.push('评分≥3星');
        if (r === 4) tags.push('评分≥4星');
      });
    }
    setSelectedFilterTags(tags);
  }, [filters]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let filteredResults = [...mockResults];
      
      // 按内容类型筛选
      if (filters.contentType !== 'all') {
        filteredResults = filteredResults.filter(item => item.type === filters.contentType);
      }
      
      // 按时间筛选
      if (filters.timeRange !== 'all') {
        const days = parseInt(filters.timeRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        filteredResults = filteredResults.filter(item => 
          new Date(item.publishTime) >= cutoffDate
        );
      }
      
      // 按浏览量筛选
      if (filters.minViews.length > 0) {
        const maxMinViews = Math.max(...filters.minViews);
        filteredResults = filteredResults.filter(item => item.views >= maxMinViews);
      }
      
      // 按评分筛选
      if (filters.minRating.length > 0) {
        const maxMinRating = Math.max(...filters.minRating);
        filteredResults = filteredResults.filter(item => item.rating >= maxMinRating);
      }
      
      setResults(filteredResults);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    if (value.trim()) {
      setSearchParams({ q: value });
      setCurrentPage(1);
    }
  };

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      contentType: 'all',
      timeRange: 'all',
      minViews: [],
      minRating: [],
    });
    setCurrentPage(1);
  };

  const removeFilterTag = (tag: string) => {
    if (tag === '文档' || tag === '视频') {
      handleFilterChange('contentType', 'all');
    } else if (tag.includes('最近')) {
      handleFilterChange('timeRange', 'all');
    } else if (tag.includes('浏览量')) {
      const viewsMap: Record<string, number> = {
        '浏览量≥1000': 1000,
        '浏览量≥1万': 10000,
        '浏览量≥10万': 100000,
      };
      handleFilterChange('minViews', filters.minViews.filter(v => v !== viewsMap[tag]));
    } else if (tag.includes('评分')) {
      const ratingMap: Record<string, number> = {
        '评分≥3星': 3,
        '评分≥4星': 4,
      };
      handleFilterChange('minRating', filters.minRating.filter(r => r !== ratingMap[tag]));
    }
  };

  // 关键词高亮
  const highlightKeyword = (text: string, keyword: string) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="highlight-keyword">$1</mark>');
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  // 分离文档和视频结果
  const documentResults = results.filter(item => item.type === 'document');
  const videoResults = results.filter(item => item.type === 'video');

  // 结果卡片组件
  const ResultCard: React.FC<{ result: SearchResult }> = ({ result }) => (
    <Card 
      className="result-card" 
      hoverable
      onClick={() => navigate(`/${result.type}/${result.id}`)}
    >
      <div className="result-card-content">
        <div className="result-thumbnail">
          {result.thumbnail ? (
            <img src={result.thumbnail} alt={result.title} />
          ) : (
            <div className="thumbnail-placeholder">
              {result.type === 'document' ? (
                <FileTextOutlined />
              ) : (
                <PlayCircleOutlined />
              )}
            </div>
          )}
          {result.type === 'video' && result.duration && (
            <span className="video-duration">{result.duration}</span>
          )}
        </div>
        
        <div className="result-info">
          <h3 
            className="result-title"
            dangerouslySetInnerHTML={{ __html: highlightKeyword(result.title, query) }}
          />
          
          <p 
            className="result-description"
            dangerouslySetInnerHTML={{ __html: highlightKeyword(result.description, query) }}
          />
          
          <div className="result-tags">
            {result.tags.slice(0, 3).map(tag => (
              <Tag key={tag} color="blue">{tag}</Tag>
            ))}
          </div>
          
          <div className="result-meta">
            <span className="meta-item">
              <Text type="secondary">{result.author}</Text>
            </span>
            <span className="meta-item">
              <ClockCircleOutlined />
              <Text type="secondary">{result.publishTime}</Text>
            </span>
            <span className="meta-item">
              <EyeOutlined />
              <Text type="secondary">{formatNumber(result.views)}</Text>
            </span>
            <span className="meta-item">
              <LikeOutlined />
              <Text type="secondary">{formatNumber(result.likes)}</Text>
            </span>
            <span className="meta-item">
              <Rate disabled defaultValue={result.rating} allowHalf style={{ fontSize: 12 }} />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );

  // 筛选面板内容
  const FilterPanel = () => (
    <div className="filter-panel">
      {/* 内容类型 */}
      <div className="filter-group">
        <Title level={5}>内容类型</Title>
        <Select
          value={filters.contentType}
          onChange={(value) => handleFilterChange('contentType', value)}
          style={{ width: '100%' }}
        >
          <Select.Option value="all">全部</Select.Option>
          <Select.Option value="document">文档</Select.Option>
          <Select.Option value="video">视频</Select.Option>
        </Select>
      </div>

      {/* 发布时间 */}
      <div className="filter-group">
        <Title level={5}>发布时间</Title>
        <Select
          value={filters.timeRange}
          onChange={(value) => handleFilterChange('timeRange', value)}
          style={{ width: '100%' }}
        >
          <Select.Option value="all">全部时间</Select.Option>
          <Select.Option value="1">最近1天</Select.Option>
          <Select.Option value="7">最近7天</Select.Option>
          <Select.Option value="30">最近30天</Select.Option>
        </Select>
      </div>

      {/* 热度筛选 */}
      <div className="filter-group">
        <Title level={5}>热度</Title>
        <Checkbox.Group
          value={filters.minViews}
          onChange={(values) => handleFilterChange('minViews', values as number[])}
        >
          <Space direction="vertical">
            <Checkbox value={1000}>浏览量≥1000</Checkbox>
            <Checkbox value={10000}>浏览量≥1万</Checkbox>
            <Checkbox value={100000}>浏览量≥10万</Checkbox>
          </Space>
        </Checkbox.Group>
      </div>

      {/* 评分筛选 */}
      <div className="filter-group">
        <Title level={5}>评分</Title>
        <Checkbox.Group
          value={filters.minRating}
          onChange={(values) => handleFilterChange('minRating', values as number[])}
        >
          <Space direction="vertical">
            <Checkbox value={3}>≥3星</Checkbox>
            <Checkbox value={4}>≥4星</Checkbox>
          </Space>
        </Checkbox.Group>
      </div>

      <Divider />
      
      <Button onClick={handleResetFilters} block>
        重置筛选
      </Button>
    </div>
  );

  // 空结果组件
  const EmptyResult = () => (
    <div className="empty-result">
      <Empty
        description={
          <div className="empty-content">
            <Text>未找到与 "<Text strong>{query}</Text>" 相关的内容</Text>
            <div className="empty-suggestions">
              <Text type="secondary">试试这些建议：</Text>
              <ul>
                <li>检查输入的关键词是否正确</li>
                <li>尝试使用更通用的关键词</li>
                <li>尝试使用不同的关键词组合</li>
              </ul>
            </div>
          </div>
        }
      />
      
      <div className="hot-keywords-section">
        <Title level={5}><StarOutlined /> 热门搜索</Title>
        <div className="hot-keywords">
          {hotKeywords.map(keyword => (
            <Tag 
              key={keyword} 
              className="hot-keyword-tag"
              onClick={() => handleSearch(keyword)}
            >
              {keyword}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="search-results-page">
      {/* 搜索框 */}
      <Card className="search-header-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={18}>
            <Search
              placeholder="搜索文档、视频..."
              allowClear
              enterButton={<><SearchOutlined /> 搜索</>}
              size="large"
              defaultValue={query}
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={24} md={6}>
            <Button 
              icon={<FilterOutlined />} 
              size="large"
              className="filter-btn-mobile"
              onClick={() => setFilterDrawerVisible(true)}
              block
            >
              筛选 {selectedFilterTags.length > 0 && `(${selectedFilterTags.length})`}
            </Button>
          </Col>
        </Row>
        
        {/* 已选筛选条件 */}
        {selectedFilterTags.length > 0 && (
          <div className="selected-filters">
            <Text type="secondary">已选条件：</Text>
            {selectedFilterTags.map(tag => (
              <Tag 
                key={tag} 
                closable 
                onClose={() => removeFilterTag(tag)}
              >
                {tag}
              </Tag>
            ))}
            <Button type="link" size="small" onClick={handleResetFilters}>
              重置筛选
            </Button>
          </div>
        )}
      </Card>

      {query && (
        <Row gutter={24} className="search-content">
          {/* PC端筛选栏 */}
          <Col xs={0} lg={6} className="filter-sidebar">
            <Card title="筛选条件" size="small">
              <FilterPanel />
            </Card>
          </Col>

          {/* 搜索结果 */}
          <Col xs={24} lg={18}>
            <Spin spinning={loading}>
              {results.length > 0 ? (
                <div className="results-container">
                  <div className="results-summary">
                    <Text type="secondary">
                      搜索 "{query}" 找到约 {results.length} 条结果
                    </Text>
                  </div>

                  {/* 文档结果区 */}
                  {documentResults.length > 0 && (
                    <div className="results-section">
                      <div className="section-header">
                        <FileTextOutlined />
                        <Title level={5}>文档结果（{documentResults.length}）</Title>
                      </div>
                      <div className="results-list">
                        {documentResults.map(result => (
                          <ResultCard key={result.id} result={result} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 视频结果区 */}
                  {videoResults.length > 0 && (
                    <div className="results-section">
                      <div className="section-header">
                        <PlayCircleOutlined />
                        <Title level={5}>视频结果（{videoResults.length}）</Title>
                      </div>
                      <div className="results-list">
                        {videoResults.map(result => (
                          <ResultCard key={result.id} result={result} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 分页 */}
                  <div className="pagination-wrapper">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={results.length}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) =>
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                      }
                      onChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                </div>
              ) : (
                <EmptyResult />
              )}
            </Spin>
          </Col>
        </Row>
      )}

      {!query && (
        <div className="no-query">
          <Empty
            description="请输入关键词开始搜索"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <div className="hot-keywords-section">
            <Title level={5}><StarOutlined /> 热门搜索</Title>
            <div className="hot-keywords">
              {hotKeywords.map(keyword => (
                <Tag 
                  key={keyword} 
                  className="hot-keyword-tag"
                  onClick={() => handleSearch(keyword)}
                >
                  {keyword}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 移动端筛选抽屉 */}
      <Drawer
        title="筛选条件"
        placement="bottom"
        height="60%"
        open={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        extra={
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={() => setFilterDrawerVisible(false)}
          />
        }
      >
        <FilterPanel />
      </Drawer>
    </div>
  );
};

export default SearchResults;
