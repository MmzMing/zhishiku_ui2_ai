import React, { useState, useRef, useEffect } from 'react';
import { Typography, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './ArticleShowcase.css';

const { Title, Paragraph, Text } = Typography;

// Mock Data mimicking the "Science" section content structure
const articles = [
  {
    id: 1,
    category: 'Database',
    title: 'MySQL: 开源关系型数据库',
    description: '主流开源关系型数据库，基于SQL，支持事务与ACID特性，广泛用于Web应用数据存储。',
    date: '2025-11-20',
    image: '/default/fileDefaultPc.jpg',
    color: '#c0392b'
  },
  {
    id: 2,
    category: 'Technology',
    title: 'Gemini 3.0: 多模态AI的新高度',
    description: '新一代 Gemini 模型在理解视频、音频和图像方面展现了惊人的能力，为通用人工智能（AGI）的实现迈出了坚实的一步。',
    date: '2025-12-05',
    image: '/default/fileDefaultPc.jpg',
    color: '#8e44ad'
  },
  {
    id: 3,
    category: 'JAVA',
    title: 'JavaScript异步编程详解',
    description: '适配知识库场景的网页字体配置，核心以清晰易读、跨平台兼容为原则，优先选用系统默认无衬线字体栈。',
    date: '2025-10-15',
    image: '/default/fileDefaultPc.jpg',
    color: '#e67e22'
  },
  {
    id: 4,
    category: 'Environment',
    title: 'AlphaEarth: 精准气候预测',
    description: '利用深度学习模型分析全球气象数据，提供比传统模型更准确、更长期的气候预测，帮助人类应对极端天气挑战。',
    date: '2025-09-28',
    image: '/default/fileDefaultPc.jpg',
    color: '#27ae60'
  },
  {
    id: 5,
    category: 'Database',
    title: 'Redis: 高性能键值数据库',
    description: '基于内存的开源键值对数据库，支持多种数据结构，常用于缓存、消息队列等高性能场景。',
    date: '2025-08-10',
    image: '/default/fileDefaultPc.jpg',
    color: '#c0392b'
  },
  {
    id: 6,
    category: 'Frontend',
    title: 'React: 前端声明式UI框架',
    description: 'Facebook开源的前端UI库，基于组件化、声明式编程，用于构建交互式用户界面。',
    date: '2025-07-22',
    image: '/default/fileDefaultPc.jpg',
    color: '#e74c3c'
  },
  {
    id: 7,
    category: 'DevOps',
    title: 'Docker+Jenkins+Git: DevOps自动化工具链',
    description: 'DevOps核心工具组合，Git管理代码、Docker容器化、Jenkins实现自动化构建部署。',
    date: '2025-06-15',
    image: '/default/fileDefaultPc.jpg',
    color: '#34495e'
  }
];

const ArticleShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(articles[0].id);
  const activeArticle = articles.find(a => a.id === activeId) || articles[0];

  return (
    <div className="article-showcase-container">
      <div className="showcase-content">
        {/* Left Column: Sticky positioning */}
        <div className="showcase-left">
          <div className="detail-wrapper">
            <div className="detail-content fade-in-key" key={activeArticle.id}>
              <Text className="detail-category" style={{ color: activeArticle.color }}>{activeArticle.category}</Text>
              <Title level={1} className="detail-title">
                {activeArticle.title}
              </Title>
              <Paragraph className="detail-desc">
                {activeArticle.description}
              </Paragraph>
              <div className="detail-meta">
                <Text className="item-date">{activeArticle.date}</Text>
                <Button type="link" style={{ marginLeft: 'auto' }} onClick={() => navigate(`/document/${activeArticle.id}`)}>
                  阅读全文 <ArrowRightOutlined />
                </Button>
              </div>
            </div>
            {/* 卡片形式的图片 */}
            <div className="detail-image-card">
               <img src={activeArticle.image} alt={activeArticle.title} className="card-image" />
            </div>
          </div>
        </div>

        {/* Right Column: Static List */}
        <div className="showcase-right">
          <div className="list-header">
            <Title level={2} style={{ margin: 0 }}>最新动态</Title>
            <Button type="link">全部 <ArrowRightOutlined /></Button>
          </div>
          
          <div className="list-items">
            {articles.map((article) => (
              <div 
                key={article.id} 
                className={`article-list-item ${activeId === article.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveId(article.id)}
                onClick={() => navigate(`/document/${article.id}`)}
              >
                <div className="list-item-image">
                  <img src={article.image} alt={article.title} />
                </div>
                <div className="list-item-content">
                  <div className="list-item-meta">
                     <Text className="item-category" style={{ color: article.color }}>{article.category}</Text>
                     <Text className="item-date">{article.date}</Text>
                  </div>
                  <Title level={4} className="item-title">
                    {article.title}
                  </Title>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleShowcase;
