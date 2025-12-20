/**
 * 视频详情页面 - 优化版
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, Row, Col, Button, Space, Typography, Tag, Avatar, Divider,
  List, message, Input, Rate, BackTop, Skeleton
} from 'antd';
import { 
  LikeOutlined, StarOutlined, ShareAltOutlined, EyeOutlined,
  ClockCircleOutlined, UserOutlined, LikeFilled, StarFilled,
  CommentOutlined, SendOutlined, PlayCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../../../components/business/video/VideoPlayer';
import { useAuth } from '../../../hooks/common/useAuth';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface VideoDetailData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  author: string;
  publishTime: string;
  views: number;
  likes: number;
  stars: number;
  tags: string[];
  needPoints: number;
  rating: number;
  isLiked: boolean;
  isStarred: boolean;
}

interface Comment {
  id: string;
  user: string;
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
}

interface RelatedVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  author: string;
}

const DEFAULT_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI0YwRjBGMCIvPjxwYXRoIGQ9Ik0xMjAgNDBMMTgwIDYwTDEyMCA4MFY0MFoiIGZpbGw9IiM5OTkiLz48L3N2Zz4=';

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoDetailData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<RelatedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const { canLike, canFavorite, canComment } = useAuth();

  const goToVideo = (vid: string) => navigate(`/video/${vid}`);

  // 模拟数据
  const mockData = useMemo(() => ({
    video: {
      id: id || '1',
      title: `React 18 新特性详解 - 视频 ${id}`,
      description: '本视频深入讲解React 18的核心新特性，包括并发特性、新Hooks等。',
      videoUrl: '/api/video/react18.mp4',
      thumbnail: DEFAULT_IMG,
      duration: '25:30',
      author: '前端大师',
      publishTime: '2024-01-15',
      views: 12580,
      likes: 856,
      stars: 432,
      tags: ['React', 'JavaScript', '前端'],
      needPoints: 5,
      rating: 4.8,
      isLiked: false,
      isStarred: false,
    } as VideoDetailData,
    comments: [
      { id: '1', user: '学习者A', content: '讲解得很清楚！', time: '2024-01-16 10:30', likes: 24, isLiked: false },
      { id: '2', user: '前端新手', content: '代码演示很棒。', time: '2024-01-16 14:20', likes: 18, isLiked: true },
    ] as Comment[],
    related: [
      { id: id === '2' ? '1' : '2', title: 'React Hooks 深度解析', thumbnail: DEFAULT_IMG, duration: '18:45', views: 8900, author: '前端大师' },
      { id: id === '3' ? '1' : '3', title: 'TypeScript + React 最佳实践', thumbnail: DEFAULT_IMG, duration: '32:15', views: 15600, author: 'TS专家' },
      { id: id === '4' ? '1' : '4', title: 'React 性能优化技巧', thumbnail: DEFAULT_IMG, duration: '22:30', views: 11200, author: '性能优化师' },
    ] as RelatedVideo[],
  }), [id]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setVideo(mockData.video);
      setComments(mockData.comments);
      setRelatedVideos(mockData.related);
      setLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [id, mockData]);

  const handleLike = () => {
    if (!video || !canLike()) return;
    setVideo({ ...video, isLiked: !video.isLiked, likes: video.isLiked ? video.likes - 1 : video.likes + 1 });
    message.success(video.isLiked ? '取消点赞' : '点赞成功');
  };

  const handleStar = () => {
    if (!video || !canFavorite()) return;
    setVideo({ ...video, isStarred: !video.isStarred, stars: video.isStarred ? video.stars - 1 : video.stars + 1 });
    message.success(video.isStarred ? '取消收藏' : '收藏成功');
  };

  const handlePointsDeduct = async (): Promise<boolean> => Promise.resolve(true);

  const handleComment = () => {
    if (!canComment() || !commentText.trim()) {
      if (!commentText.trim()) message.warning('请输入评论内容');
      return;
    }
    setComments([{ id: Date.now().toString(), user: '当前用户', content: commentText, time: new Date().toLocaleString(), likes: 0, isLiked: false }, ...comments]);
    setCommentText('');
    message.success('评论发布成功');
  };

  const handleCommentLike = (cid: string) => {
    if (!canLike()) return;
    setComments(comments.map(c => c.id === cid ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c));
  };

  const fmt = (n: number) => n >= 10000 ? `${(n / 10000).toFixed(1)}万` : n.toString();

  if (loading) {
    return (
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            <Card style={{ marginBottom: '24px' }}><Skeleton.Image active style={{ width: '100%', height: 400 }} /></Card>
            <Card><Skeleton active paragraph={{ rows: 4 }} /></Card>
          </Col>
          <Col xs={24} lg={6}><Card><Skeleton active paragraph={{ rows: 6 }} /></Card></Col>
        </Row>
      </div>
    );
  }

  if (!video) return null;


  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={18}>
          <Card style={{ marginBottom: '24px', borderRadius: '16px' }}>
            <VideoPlayer src={video.videoUrl} poster={video.thumbnail} title={video.title} needPoints={video.needPoints} onPointsDeduct={handlePointsDeduct} width="100%" height="500px" />
          </Card>

          <Card style={{ borderRadius: '16px' }}>
            <Title level={3} style={{ marginBottom: '12px' }}>{video.title}</Title>
            <Space wrap style={{ marginBottom: '16px' }}>
              {video.tags.map(tag => <Tag key={tag} color="blue" style={{ borderRadius: '8px' }}>{tag}</Tag>)}
            </Space>

            <Row gutter={[16, 8]} align="middle" style={{ marginBottom: '16px' }}>
              <Col>
                <Space>
                  <Avatar icon={<UserOutlined />} size={40} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{video.author}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{video.publishTime}</Text>
                  </div>
                </Space>
              </Col>
              <Col>
                <Space split={<Divider type="vertical" />}>
                  <Space size="small"><EyeOutlined /><Text type="secondary">{fmt(video.views)} 播放</Text></Space>
                  <Space size="small"><ClockCircleOutlined /><Text type="secondary">{video.duration}</Text></Space>
                  <Space size="small"><Rate disabled defaultValue={video.rating} allowHalf style={{ fontSize: '14px' }} /><Text type="secondary">({video.rating})</Text></Space>
                </Space>
              </Col>
            </Row>

            <Space wrap style={{ marginBottom: '16px' }}>
              <Button type={video.isLiked ? "primary" : "default"} icon={video.isLiked ? <LikeFilled /> : <LikeOutlined />} onClick={handleLike} style={{ borderRadius: '8px' }}>{fmt(video.likes)}</Button>
              <Button type={video.isStarred ? "primary" : "default"} icon={video.isStarred ? <StarFilled /> : <StarOutlined />} onClick={handleStar} style={{ borderRadius: '8px' }}>{fmt(video.stars)}</Button>
              <Button icon={<ShareAltOutlined />} style={{ borderRadius: '8px' }}>分享</Button>
            </Space>

            <Divider />
            <Title level={4}>视频简介</Title>
            <Paragraph style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>{video.description}</Paragraph>
          </Card>

          <Card title={`评论 (${comments.length})`} style={{ marginTop: '24px', borderRadius: '16px' }}>
            <div style={{ marginBottom: '24px' }}>
              <TextArea rows={3} placeholder="写下你的评论..." value={commentText} onChange={(e) => setCommentText(e.target.value)} style={{ marginBottom: '12px', borderRadius: '8px' }} />
              <div style={{ textAlign: 'right' }}>
                <Button type="primary" icon={<SendOutlined />} onClick={handleComment} style={{ borderRadius: '8px' }}>发表评论</Button>
              </div>
            </div>
            <Divider />
            <List
              dataSource={comments}
              renderItem={(c) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<Space><Text strong>{c.user}</Text><Text type="secondary" style={{ fontSize: '12px' }}>{c.time}</Text></Space>}
                    description={
                      <div>
                        <Paragraph style={{ marginBottom: '8px' }}>{c.content}</Paragraph>
                        <Space>
                          <Button type="text" size="small" icon={c.isLiked ? <LikeFilled /> : <LikeOutlined />} onClick={() => handleCommentLike(c.id)}>{c.likes}</Button>
                          <Button type="text" size="small" icon={<CommentOutlined />}>回复</Button>
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>


        <Col xs={24} lg={6}>
          <Card title="相关推荐" size="small" style={{ borderRadius: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {relatedVideos.map(item => (
                <div
                  key={item.id}
                  onClick={() => goToVideo(item.id)}
                  className="related-video-card"
                  style={{ 
                    cursor: 'pointer', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.transform = 'translateY(-2px)'; 
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = 'translateY(0)'; 
                  }}
                >
                  {/* 缩略图区域 */}
                  <div className="thumbnail-bg" style={{ position: 'relative', height: '100px' }}>
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        opacity: 0.9
                      }} 
                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMG; }} 
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '6px', 
                      right: '6px', 
                      background: 'rgba(0,0,0,0.8)', 
                      color: 'white', 
                      padding: '3px 8px', 
                      borderRadius: '6px', 
                      fontSize: '11px',
                      fontWeight: '500',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {item.duration}
                    </div>
                    <div className="play-icon" style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)', 
                      fontSize: '32px', 
                      color: 'rgba(255,255,255,0.9)', 
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      opacity: 0.8,
                      transition: 'opacity 0.3s'
                    }}>
                      <PlayCircleOutlined />
                    </div>
                  </div>
                  {/* 视频信息区域 */}
                  <div style={{ padding: '12px' }}>
                    <div className="video-title" style={{ 
                      fontSize: '13px', 
                      fontWeight: 600,
                      lineHeight: '1.4',
                      marginBottom: '8px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.title}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span className="video-meta" style={{ fontSize: '11px' }}>
                        {item.author}
                      </span>
                      <span className="video-meta" style={{ fontSize: '11px' }}>
                        {fmt(item.views)} 播放
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
      <BackTop />
      
      <style>{`
        .related-video-card:hover .play-icon {
          opacity: 1 !important;
        }
        
        /* 亮色主题适配 */
        [data-theme="light"] .related-video-card {
          background: rgba(0,0,0,0.02) !important;
          border: 1px solid rgba(0,0,0,0.06) !important;
        }
        
        [data-theme="light"] .related-video-card:hover {
          background: rgba(0,0,0,0.04) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
        }
        
        [data-theme="light"] .related-video-card .video-title {
          color: rgba(0,0,0,0.85) !important;
        }
        
        [data-theme="light"] .related-video-card .video-meta {
          color: rgba(0,0,0,0.45) !important;
        }
        
        [data-theme="light"] .related-video-card .thumbnail-bg {
          background: rgba(0,0,0,0.05) !important;
        }
        
        /* 暗色主题适配 */
        [data-theme="dark"] .related-video-card {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        [data-theme="dark"] .related-video-card:hover {
          background: rgba(255,255,255,0.08) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
        }
        
        [data-theme="dark"] .related-video-card .video-title {
          color: rgba(255,255,255,0.9) !important;
        }
        
        [data-theme="dark"] .related-video-card .video-meta {
          color: rgba(255,255,255,0.6) !important;
        }
        
        [data-theme="dark"] .related-video-card .thumbnail-bg {
          background: rgba(0,0,0,0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default VideoDetail;
