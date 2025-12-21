/**
 * 首页组件
 * - Banner区域：全屏背景图、欢迎语、打字机特效、搜索框
 * - 分类导航：知识库/视频分类快捷入口
 * - 推荐内容：热门内容展示
 * - 用户评价：瀑布流展示
 * - 侧边栏：热门标签、最新更新、推荐分类、站点统计
 * - 滚动触发动画
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Input, 
  Tag, 
  Avatar, 
  Space, 
  Button,
  Divider,
  List,
  Skeleton
} from 'antd';
import { 
  SearchOutlined, 
  PlayCircleOutlined, 
  FileTextOutlined,
  EyeOutlined,
  LikeOutlined,
  StarOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RightOutlined,
  BookOutlined,
  CodeOutlined,
  CloudOutlined,
  DatabaseOutlined,
  MobileOutlined,
  DesktopOutlined,
  SafetyOutlined,
  ToolOutlined,
  MessageOutlined,
  UserOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as homeApi from '../../../api/front/homeApi';
import HotCarousel from './HotCarousel';
import ArticleShowcase from './ArticleShowcase';
import './Home.css';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

// 打字机效果Hook - 支持延迟开始
const useTypewriter = (text: string, speed: number = 150, delay: number = 0) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0 && !started) {
      const delayTimer = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(delayTimer);
    }
  }, [delay, started]);

  useEffect(() => {
    if (started && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, started]);

  return displayText;
};

// 滚动触发显示Hook
const useScrollReveal = (threshold: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
};

// 滚动显示组件
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// 分类数据
const categories = [
  { id: 1, name: 'Java', icon: <CodeOutlined />, count: 256, color: '#f5222d' },
  { id: 2, name: '前端开发', icon: <DesktopOutlined />, count: 189, color: '#1890ff' },
  { id: 3, name: 'Python', icon: <CodeOutlined />, count: 145, color: '#52c41a' },
  { id: 4, name: '数据库', icon: <DatabaseOutlined />, count: 98, color: '#722ed1' },
  { id: 5, name: '云计算', icon: <CloudOutlined />, count: 76, color: '#13c2c2' },
  { id: 6, name: '移动开发', icon: <MobileOutlined />, count: 67, color: '#fa8c16' },
  { id: 7, name: '安全', icon: <SafetyOutlined />, count: 54, color: '#eb2f96' },
  { id: 8, name: '运维', icon: <ToolOutlined />, count: 43, color: '#2f54eb' },
];

// 热门内容数据
const hotContents = [
  {
    id: 1,
    title: 'Spring Boot 3.0 完整教程：从入门到精通',
    type: 'document',
    cover: '/default/fileDefaultPc.jpg',
    author: '技术达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    views: 12580,
    likes: 856,
    stars: 423,
    duration: '',
  },
  {
    id: 2,
    title: 'React 18 新特性详解与实战应用',
    type: 'video',
    cover: '/default/fileDefaultPc.jpg',
    author: '前端工程师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    views: 9876,
    likes: 654,
    stars: 321,
    duration: '45:30',
  },
  {
    id: 3,
    title: 'MySQL 性能优化实战指南',
    type: 'document',
    cover: '/default/fileDefaultPc.jpg',
    author: 'DBA专家',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    views: 8765,
    likes: 543,
    stars: 287,
    duration: '',
  },
  {
    id: 4,
    title: 'Docker + Kubernetes 容器化部署实战',
    type: 'video',
    cover: '/default/fileDefaultPc.jpg',
    author: '运维大师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    views: 7654,
    likes: 432,
    stars: 198,
    duration: '1:23:45',
  },
  {
    id: 5,
    title: 'Vue 3 组合式API深度解析',
    type: 'document',
    cover: '/default/fileDefaultPc.jpg',
    author: '全栈开发者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    views: 6543,
    likes: 321,
    stars: 156,
    duration: '',
  },
  {
    id: 6,
    title: 'Python 数据分析与可视化教程',
    type: 'video',
    cover: '/default/fileDefaultPc.jpg',
    author: '数据分析师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    views: 5432,
    likes: 234,
    stars: 123,
    duration: '2:15:00',
  },
];

// 最新更新数据
const latestUpdates = [
  { id: 1, title: 'TypeScript 5.0 新特性解读', type: 'document', time: '12-19' },
  { id: 2, title: 'Redis 7.0 集群搭建教程', type: 'video', time: '12-19' },
  { id: 3, title: 'Nginx 高并发配置优化', type: 'document', time: '12-18' },
  { id: 4, title: 'Git 高级操作技巧', type: 'video', time: '12-18' },
  { id: 5, title: 'Linux 常用命令大全', type: 'document', time: '12-17' },
];

// 热门标签
const hotTags = [
  { name: 'Java', count: 1256 },
  { name: 'Python', count: 987 },
  { name: 'JavaScript', count: 876 },
  { name: 'React', count: 654 },
  { name: 'Vue', count: 543 },
  { name: 'Spring Boot', count: 432 },
  { name: 'MySQL', count: 321 },
  { name: 'Docker', count: 234 },
];

// 用户评价数据
const userReviews = [
  { id: 1, name: '神秘人', content: '作者太优秀了，看到年轻人那么努力，我这个88年大叔又已能躺平一躺拜一' },
  { id: 2, name: 'Bear', content: '花了两个小时把你的大学生活篇章看完，真的太感动，太励志人心了' },
  { id: 3, name: '我很强，我知道', content: '大佬太励志了，我把你博客从21年到25年的经历全看了，真的不容易' },
  { id: 4, name: '往事流年', content: '我觉得你很厉害，Python、Java、前端这些都会，感觉你很热爱代码，要不也不会日日夜Commit' },
  { id: 5, name: '神秘人', content: '虽然咱俩专业不太一样，但是从你身上感受到了一股强大的力量，继续加油，未来可期' },
  { id: 6, name: '神秘人', content: '兄弟你那华中温的可惜学历是硬伤。' },
  { id: 7, name: '学海如海', content: '虽然，我不懂，但是看着你这几年的变化真的，太棒啦！' },
  { id: 8, name: 'kuorao', content: '太顶了哥们，已经秒杀99.99%的985大学生了，有志者事竟成，祝事业有成' },
  { id: 9, name: '神秘人', content: '从别人哪里看到了你的博客，太励志了，感觉自己就是个废材' },
  { id: 10, name: '椭圆很圆', content: '大佬你好，没有谁能不会说话的，(doge,再次膜拜，也是正在建站中，好复杂，努力的补技术找中55555，真的页面好好看！' },
  { id: 11, name: '神秘人', content: '励志啊，看了你几年，没想到你这个学历真人行了，这几年做到这些太不容易了' },
  { id: 12, name: '神秘人', content: '你这个水平，月薪过万很轻松的，加油！' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [avatarVisible, setAvatarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 头像显示后延迟1秒开始打字机效果
  const introText = useTypewriter(
    '专注底层原理与工程实践，这长以缘构化思维拆解复杂知识，无具有JVM、框架源码等方向有系统积累，我的梦想是做一名技术顶尖的架构师。这是我搭建的知识站，聚焦技术人核心能力提升，以 “原理 + 实战” 为核心，分享 Java 底层逻辑、框架注解、性能优化等干货，同时解析版本差异与实战坑点，帮助大家精准构建体系化知识，高效解决实际开发问题。欢迎一起交流探讨，共同成长！', 
    80, 
    avatarVisible ? 1000 : 0
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // 页面加载后延迟显示头像
  useEffect(() => {
    const timer = setTimeout(() => {
      setAvatarVisible(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (value: string) => {
    const query = value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/search');
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/document?category=${categoryId}`);
  };

  const handleContentClick = (content: typeof hotContents[0]) => {
    if (content.type === 'video') {
      navigate(`/video/${content.id}`);
    } else {
      navigate(`/document/${content.id}`);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  const getReviewColumns = () => {
    const columns: typeof userReviews[] = [[], [], [], [], []];
    userReviews.forEach((review, index) => {
      columns[index % 5].push(review);
    });
    return columns;
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="home-page" style={{ minHeight: '100vh' }}>
      {/* Banner区域 - 全屏 */}
      <div style={{
        height: '100vh',
        marginTop: '-64px',
        paddingTop: '64px',
        backgroundImage: 'url(/home/preview.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* 遮罩层 */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.28)',
        }} />
        
        {/* 左右布局内容 */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          maxWidth: 1200, 
          width: '100%',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 60,
        }}>
          {/* 左侧介绍 */}
          <div style={{ flex: 1 }}>
            <Title level={1} style={{ 
              color: '#fff', 
              marginBottom: 24, 
              fontSize: 42,
              fontWeight: 600,
            }}>
              Hello, 我叫吴华明👋
            </Title>
            
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18 }}>
                我是一名 99 年的
              </Text>
              <Tag color="#1890ff" style={{ fontSize: 16, padding: '4px 0px', borderRadius: 4,border: 0 ,background: '#0f1318'}}>
                后端工程师
              </Tag>
            </div>
            
            <Paragraph style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: 16, 
              marginBottom: 50,
              maxWidth: 600,
              minHeight: 80,
              lineHeight: 1.6,
            }}>
              {introText}<span style={{ animation: introText.length > 0 && introText.length < 100 ? 'blink 1s infinite' : 'none' }}>|</span>
            </Paragraph>
            
            <Space size="middle">
              <Button 
                type="primary" 
                size="large"
                style={{ borderRadius: 6, height: 44, paddingLeft: 24, paddingRight: 24 }}
                onClick={() => window.open('https://blog.csdn.net/qq_45096531?type=blog', '_blank')}
              >
                个人博客
              </Button>
              <Button 
                size="large"
                style={{ 
                  borderRadius: 6, 
                  height: 44, 
                  paddingLeft: 24, 
                  paddingRight: 24,
                  background: 'transparent',
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: '#fff',
                }}
                onClick={() => window.open('https://github.com/MmzMing', '_blank')}
              >
                GitHub
              </Button>
            </Space>
          </div>
          
          {/* 右侧头像 */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              width: 380,
              height: 380,
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              opacity: avatarVisible ? 1 : 0,
              transform: avatarVisible ? 'scale(1)' : 'scale(0.8)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}>
              <img 
                src="/avatar.png" 
                alt="头像"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  // 如果图片加载失败，显示默认头像
                  (e.target as HTMLImageElement).src = '/headPic/55b6284ecdf362e87d33791b23c6950b_720.jpg';
                }}
              />
            </div>
          </div>
        </div>

        {/* 向下滚动提示 */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: 40, 
            left: '50%', 
            transform: 'translateX(-50%)',
            cursor: 'pointer',
            animation: 'bounce 2s infinite',
          }}
          onClick={scrollToContent}
        >
          <ArrowDownOutlined style={{ fontSize: 32, color: '#fff' }} />
        </div>
      </div>

      {/* 全屏轮播区域 */}
      <div className="full-width-section">
        <ScrollReveal>
          <HotCarousel />
        </ScrollReveal>
      </div>

      {/* 文章展示区域 */}
      <div className="full-width-section">
        <ScrollReveal delay={0.2}>
          <ArticleShowcase />
        </ScrollReveal>
      </div>

      {/* 用户评价区域 - 瀑布流 */}
      <ScrollReveal>
        <div style={{ 
          padding: '60px 24px',
        }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <ScrollReveal>
              <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: 'var(--text-color-primary)' }}>
                <MessageOutlined /> 来自诸多网友对我的评价
              </Title>
            </ScrollReveal>
            
            {/* 瀑布流布局 */}
            <div style={{ display: 'flex', gap: 16 }}>
              {getReviewColumns().map((column, colIndex) => (
                <div key={colIndex} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {column.map((review, reviewIndex) => (
                    <ScrollReveal key={review.id} delay={colIndex * 0.05 + reviewIndex * 0.1}>
                      <Card
                        className="review-card"
                        size="small"
                        bodyStyle={{ padding: 16 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                          <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginRight: 8 }} />
                          <Text strong style={{ color: 'var(--text-color-primary)' }}>{review.name}</Text>
                        </div>
                        <Paragraph style={{ color: 'var(--text-color-secondary)', margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                          {review.content}
                        </Paragraph>
                      </Card>
                    </ScrollReveal>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 动画样式 */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-15px); }
          60% { transform: translateX(-50%) translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default Home;
