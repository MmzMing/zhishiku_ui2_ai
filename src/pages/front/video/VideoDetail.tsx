/**
 * 视频详情页面
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Avatar, 
  Divider,
  List,
  message,
  Input,
  Rate,
  BackTop
} from 'antd';
import { 
  LikeOutlined, 
  StarOutlined, 
  ShareAltOutlined, 
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  LikeFilled,
  StarFilled,
  CommentOutlined,
  SendOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../../../components/business/video/VideoPlayer';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface VideoDetail {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  author: string;
  authorAvatar?: string;
  publishTime: string;
  views: number;
  likes: number;
  stars: number;
  category: string;
  tags: string[];
  needPoints: number;
  rating: number;
  isLiked: boolean;
  isStarred: boolean;
}

interface Comment {
  id: string;
  user: string;
  avatar?: string;
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface RelatedVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  author: string;
}

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<RelatedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  // 模拟视频数据
  useEffect(() => {
    const mockVideo: VideoDetail = {
      id: id || '1',
      title: 'React 18 新特性详解 - 并发特性与Suspense改进',
      description: `本视频深入讲解React 18的核心新特性，包括：

1. 并发特性（Concurrent Features）
   - 自动批处理（Automatic Batching）
   - 过渡更新（Transitions）
   - Suspense改进

2. 新的Hooks
   - useId
   - useDeferredValue
   - useTransition
   - useSyncExternalStore

3. 严格模式的变化
4. 服务端渲染改进
5. 最佳实践和迁移指南

适合有React基础的开发者学习，通过实际代码演示帮助理解新特性的使用场景和优势。`,
      videoUrl: '/api/video/react18-features.mp4',
      thumbnail: '/api/placeholder/800/450',
      duration: '25:30',
      author: '前端大师',
      authorAvatar: '/api/placeholder/40/40',
      publishTime: '2024-01-15',
      views: 12580,
      likes: 856,
      stars: 432,
      category: 'frontend',
      tags: ['React', 'JavaScript', '前端', '新特性'],
      needPoints: 5,
      rating: 4.8,
      isLiked: false,
      isStarred: false,
    };

    const mockComments: Comment[] = [
      {
        id: '1',
        user: '学习者A',
        avatar: '/api/placeholder/32/32',
        content: '讲解得很清楚，特别是并发特性的部分，终于理解了useTransition的使用场景！',
        time: '2024-01-16 10:30',
        likes: 24,
        isLiked: false,
      },
      {
        id: '2',
        user: '前端新手',
        avatar: '/api/placeholder/32/32',
        content: '代码演示很棒，跟着敲了一遍，收获很大。希望能出更多React相关的教程。',
        time: '2024-01-16 14:20',
        likes: 18,
        isLiked: true,
      },
      {
        id: '3',
        user: '资深开发',
        avatar: '/api/placeholder/32/32',
        content: '对于Suspense的改进讲解得很到位，在实际项目中确实能感受到性能提升。',
        time: '2024-01-16 16:45',
        likes: 31,
        isLiked: false,
      },
    ];

    const mockRelatedVideos: RelatedVideo[] = [
      {
        id: '2',
        title: 'React Hooks 深度解析',
        thumbnail: '/api/placeholder/200/120',
        duration: '18:45',
        views: 8900,
        author: '前端大师',
      },
      {
        id: '3',
        title: 'TypeScript + React 最佳实践',
        thumbnail: '/api/placeholder/200/120',
        duration: '32:15',
        views: 15600,
        author: 'TS专家',
      },
      {
        id: '4',
        title: 'React 性能优化技巧',
        thumbnail: '/api/placeholder/200/120',
        duration: '22:30',
        views: 11200,
        author: '性能优化师',
      },
    ];

    setTimeout(() => {
      setVideo(mockVideo);
      setComments(mockComments);
      setRelatedVideos(mockRelatedVideos);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleLike = () => {
    if (!video) return;
    
    setVideo({
      ...video,
      isLiked: !video.isLiked,
      likes: video.isLiked ? video.likes - 1 : video.likes + 1,
    });
    
    message.success(video.isLiked ? '取消点赞' : '点赞成功');
  };

  const handleStar = () => {
    if (!video) return;
    
    setVideo({
      ...video,
      isStarred: !video.isStarred,
      stars: video.isStarred ? video.stars - 1 : video.stars + 1,
    });
    
    message.success(video.isStarred ? '取消收藏' : '收藏成功');
  };

  const handlePointsDeduct = async (points: number): Promise<boolean> => {
    // 模拟积分扣除
    return new Promise((resolve) => {
      setTimeout(() => {
        // 这里应该调用实际的积分扣除API
        resolve(true);
      }, 1000);
    });
  };

  const handleComment = () => {
    if (!commentText.trim()) {
      message.warning('请输入评论内容');
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      user: '当前用户',
      content: commentText,
      time: new Date().toLocaleString(),
      likes: 0,
      isLiked: false,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    message.success('评论发布成功');
  };

  const handleCommentLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      return comment;
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  if (loading || !video) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>加载中...</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {/* 主内容区 */}
        <Col xs={24} lg={18}>
          {/* 视频播放器 */}
          <Card style={{ marginBottom: '24px' }}>
            <VideoPlayer
              src={video.videoUrl}
              poster={video.thumbnail}
              title={video.title}
              needPoints={video.needPoints}
              onPointsDeduct={handlePointsDeduct}
              width="100%"
              height="500px"
            />
          </Card>

          {/* 视频信息 */}
          <Card>
            <div style={{ marginBottom: '16px' }}>
              <Title level={2} style={{ marginBottom: '12px' }}>
                {video.title}
              </Title>
              
              <Space wrap style={{ marginBottom: '16px' }}>
                {video.tags.map(tag => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </Space>

              <Row gutter={[16, 8]} align="middle" style={{ marginBottom: '16px' }}>
                <Col>
                  <Space>
                    <Avatar 
                      src={video.authorAvatar} 
                      icon={<UserOutlined />}
                      size={40}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{video.author}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {video.publishTime}
                      </Text>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Space split={<Divider type="vertical" />}>
                    <Space size="small">
                      <EyeOutlined />
                      <Text type="secondary">{formatNumber(video.views)} 播放</Text>
                    </Space>
                    <Space size="small">
                      <ClockCircleOutlined />
                      <Text type="secondary">{video.duration}</Text>
                    </Space>
                    <Space size="small">
                      <Rate disabled defaultValue={video.rating} allowHalf size="small" />
                      <Text type="secondary">({video.rating})</Text>
                    </Space>
                  </Space>
                </Col>
              </Row>

              {/* 操作按钮 */}
              <Space wrap style={{ marginBottom: '16px' }}>
                <Button 
                  type={video.isLiked ? "primary" : "default"}
                  icon={video.isLiked ? <LikeFilled /> : <LikeOutlined />}
                  onClick={handleLike}
                >
                  {formatNumber(video.likes)}
                </Button>
                <Button 
                  type={video.isStarred ? "primary" : "default"}
                  icon={video.isStarred ? <StarFilled /> : <StarOutlined />}
                  onClick={handleStar}
                >
                  {formatNumber(video.stars)}
                </Button>
                <Button icon={<ShareAltOutlined />}>
                  分享
                </Button>
              </Space>
            </div>

            <Divider />

            {/* 视频描述 */}
            <div>
              <Title level={4}>视频简介</Title>
              <Paragraph style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                {video.description}
              </Paragraph>
            </div>
          </Card>

          {/* 评论区 */}
          <Card title={`评论 (${comments.length})`} style={{ marginTop: '24px' }}>
            {/* 发表评论 */}
            <div style={{ marginBottom: '24px' }}>
              <TextArea
                rows={4}
                placeholder="写下你的评论..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ marginBottom: '12px' }}
              />
              <div style={{ textAlign: 'right' }}>
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  onClick={handleComment}
                >
                  发表评论
                </Button>
              </div>
            </div>

            <Divider />

            {/* 评论列表 */}
            <List
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        src={comment.avatar} 
                        icon={<UserOutlined />}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{comment.user}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {comment.time}
                        </Text>
                      </Space>
                    }
                    description={
                      <div>
                        <Paragraph style={{ marginBottom: '8px' }}>
                          {comment.content}
                        </Paragraph>
                        <Space>
                          <Button 
                            type="text" 
                            size="small"
                            icon={comment.isLiked ? <LikeFilled /> : <LikeOutlined />}
                            onClick={() => handleCommentLike(comment.id)}
                          >
                            {comment.likes}
                          </Button>
                          <Button type="text" size="small" icon={<CommentOutlined />}>
                            回复
                          </Button>
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 侧边栏 */}
        <Col xs={24} lg={6}>
          {/* 相关推荐 */}
          <Card title="相关推荐" size="small">
            <List
              dataSource={relatedVideos}
              renderItem={(item) => (
                <List.Item style={{ padding: '8px 0' }}>
                  <List.Item.Meta
                    avatar={
                      <div style={{ position: 'relative' }}>
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          style={{ 
                            width: '120px', 
                            height: '68px', 
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjY4IiB2aWV3Qm94PSIwIDAgMTIwIDY4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjY4IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik00OCAyOEw3MiAzNkw0OCA0NFYyOFoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+Cg==';
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '4px',
                          right: '4px',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '2px 4px',
                          borderRadius: '2px',
                          fontSize: '10px'
                        }}>
                          {item.duration}
                        </div>
                      </div>
                    }
                    title={
                      <div>
                        <Text strong style={{ fontSize: '13px', lineHeight: '1.4' }}>
                          {item.title}
                        </Text>
                        <div style={{ marginTop: '4px' }}>
                          <Space split={<Divider type="vertical" />}>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {item.author}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {formatNumber(item.views)} 播放
                            </Text>
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <BackTop />
    </div>
  );
};

export default VideoDetail;