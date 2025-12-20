/**
 * 文档详情页面 - 优化版
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, Row, Col, Button, Space, Typography, Tag, Avatar, Divider,
  Anchor, BackTop, message, Modal, Input, Rate, Skeleton
} from 'antd';
import { 
  LikeOutlined, StarOutlined, ShareAltOutlined, DownloadOutlined,
  EyeOutlined, ClockCircleOutlined, UserOutlined, MenuOutlined,
  LikeFilled, StarFilled, CommentOutlined, SendOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/common/useAuth';
import * as documentApi from '../../../api/front/documentApi';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface DocumentDetail {
  id: string;
  title: string;
  content: string;
  author: string;
  publishTime: string;
  views: number;
  likes: number;
  stars: number;
  downloads: number;
  tags: string[];
  isFree: boolean;
  points?: number;
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

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { canLike, canFavorite, canComment, canDownload } = useAuth();

  // 模拟数据 - 优化加载
  const mockData = useMemo(() => ({
    document: {
      id: id || '1',
      title: 'JavaScript异步编程详解',
      content: `# JavaScript异步编程详解

## 1. 引言
JavaScript是一门单线程语言，但它能够处理异步操作，这是通过事件循环机制实现的。

## 2. 回调函数
回调函数是最早的异步编程解决方案：

\`\`\`javascript
function fetchData(callback) {
  setTimeout(() => callback('数据获取成功'), 1000);
}
\`\`\`

## 3. Promise
Promise是ES6引入的异步编程解决方案：

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  if (success) resolve(result);
  else reject(error);
});
\`\`\`

## 4. async/await
async/await让异步代码看起来像同步代码：

\`\`\`javascript
async function fetchData() {
  try {
    const result = await fetch('/api/data');
    return result.json();
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

## 5. 最佳实践
1. 优先使用 async/await
2. 合理处理错误
3. 避免阻塞主线程`,
      author: '前端专家',
      publishTime: '2024-01-15',
      views: 2580,
      likes: 156,
      stars: 89,
      downloads: 67,
      tags: ['JavaScript', '异步编程', 'Promise'],
      isFree: true,
      rating: 4.8,
      isLiked: false,
      isStarred: false,
    } as DocumentDetail,
    comments: [
      { id: '1', user: '学习者A', content: '写得很详细，对Promise的解释特别清楚！', time: '2024-01-16 10:30', likes: 12, isLiked: false },
      { id: '2', user: '开发者B', content: 'async/await的示例代码很实用，已经收藏了。', time: '2024-01-16 14:20', likes: 8, isLiked: true },
    ] as Comment[],
  }), [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDocument(mockData.document);
      setComments(mockData.comments);
      setLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [id, mockData]);

  const handleLike = () => {
    if (!document || !canLike()) return;
    setDocument({ ...document, isLiked: !document.isLiked, likes: document.isLiked ? document.likes - 1 : document.likes + 1 });
    message.success(document.isLiked ? '取消点赞' : '点赞成功');
  };

  const handleStar = () => {
    if (!document || !canFavorite()) return;
    setDocument({ ...document, isStarred: !document.isStarred, stars: document.isStarred ? document.stars - 1 : document.stars + 1 });
    message.success(document.isStarred ? '取消收藏' : '收藏成功');
  };

  const handleDownload = () => {
    if (!document || !canDownload()) return;
    if (document.isFree) {
      message.success('下载中，请稍候...');
    } else {
      Modal.confirm({
        title: '下载需要积分',
        content: `下载此文档需要消耗 ${document.points} 积分，是否确认？`,
        onOk: () => message.success('积分扣除成功，开始下载...'),
      });
    }
  };

  const handleComment = () => {
    if (!canComment() || !commentText.trim()) {
      if (!commentText.trim()) message.warning('请输入评论内容');
      return;
    }
    setComments([{ id: Date.now().toString(), user: '当前用户', content: commentText, time: new Date().toLocaleString(), likes: 0, isLiked: false }, ...comments]);
    setCommentText('');
    message.success('评论发布成功');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => message.success('链接已复制到剪贴板'));
  };

  // 生成目录
  const tocItems = useMemo(() => 
    document?.content.split('\n')
      .filter(line => line.startsWith('#'))
      .map((line, index) => ({
        key: `#heading-${index}`,
        href: `#heading-${index}`,
        title: line.replace(/^#+\s*/, ''),
        level: line.match(/^#+/)?.[0].length || 1,
      })) || []
  , [document?.content]);

  if (loading) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            <Card><Skeleton active paragraph={{ rows: 8 }} /></Card>
          </Col>
          <Col xs={24} lg={6}>
            <Card><Skeleton active paragraph={{ rows: 4 }} /></Card>
          </Col>
        </Row>
      </div>
    );
  }

  if (!document) return null;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={18}>
          <Card style={{ borderRadius: '16px' }}>
            <div style={{ marginBottom: '24px' }}>
              <Title level={1} style={{ marginBottom: '16px' }}>{document.title}</Title>
              <Space wrap style={{ marginBottom: '16px' }}>
                {document.tags.map(tag => <Tag key={tag} color="blue" style={{ borderRadius: '8px' }}>{tag}</Tag>)}
              </Space>
              <Row gutter={[16, 8]} align="middle">
                <Col>
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <Text strong>{document.author}</Text>
                  </Space>
                </Col>
                <Col>
                  <Space split={<Divider type="vertical" />}>
                    <Space size="small"><ClockCircleOutlined /><Text type="secondary">{document.publishTime}</Text></Space>
                    <Space size="small"><EyeOutlined /><Text type="secondary">{document.views}</Text></Space>
                    <Space size="small"><Rate disabled defaultValue={document.rating} allowHalf /><Text type="secondary">({document.rating})</Text></Space>
                  </Space>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <Space wrap>
                <Button type={document.isLiked ? "primary" : "default"} icon={document.isLiked ? <LikeFilled /> : <LikeOutlined />} onClick={handleLike} style={{ borderRadius: '8px' }}>
                  点赞 ({document.likes})
                </Button>
                <Button type={document.isStarred ? "primary" : "default"} icon={document.isStarred ? <StarFilled /> : <StarOutlined />} onClick={handleStar} style={{ borderRadius: '8px' }}>
                  收藏 ({document.stars})
                </Button>
                <Button icon={<ShareAltOutlined />} onClick={() => setShareModalVisible(true)} style={{ borderRadius: '8px' }}>分享</Button>
                <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} style={{ borderRadius: '8px' }}>
                  下载 {!document.isFree && `(${document.points}积分)`}
                </Button>
              </Space>
            </div>

            <Divider />

            <div 
              style={{ lineHeight: '1.8', fontSize: '16px' }}
              dangerouslySetInnerHTML={{
                __html: document.content
                  .replace(/^# (.*$)/gim, '<h1 id="heading-$1" style="margin-top: 32px; margin-bottom: 16px; font-size: 28px;">$1</h1>')
                  .replace(/^## (.*$)/gim, '<h2 id="heading-$1" style="margin-top: 24px; margin-bottom: 12px; font-size: 24px;">$1</h2>')
                  .replace(/```javascript\n([\s\S]*?)\n```/g, '<pre style="background: #f6f8fa; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0;"><code style="font-family: Consolas, Monaco, monospace;">$1</code></pre>')
                  .replace(/`([^`]+)`/g, '<code style="background: #f6f8fa; padding: 2px 6px; border-radius: 4px; font-family: Consolas, Monaco, monospace;">$1</code>')
                  .replace(/\n/g, '<br>')
              }}
            />
          </Card>

          <Card title="评论" style={{ marginTop: '24px', borderRadius: '16px' }}>
            <div style={{ marginBottom: '24px' }}>
              <TextArea rows={3} placeholder="写下你的评论..." value={commentText} onChange={(e) => setCommentText(e.target.value)} style={{ marginBottom: '12px', borderRadius: '8px' }} />
              <div style={{ textAlign: 'right' }}>
                <Button type="primary" icon={<SendOutlined />} onClick={handleComment} style={{ borderRadius: '8px' }}>发表评论</Button>
              </div>
            </div>
            <Divider />
            {comments.map(comment => (
              <div key={comment.id} style={{ marginBottom: '16px' }}>
                <Space align="start">
                  <Avatar icon={<UserOutlined />} />
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '4px' }}>
                      <Text strong>{comment.user}</Text>
                      <Text type="secondary" style={{ marginLeft: '8px' }}>{comment.time}</Text>
                    </div>
                    <Paragraph style={{ marginBottom: '8px' }}>{comment.content}</Paragraph>
                    <Space>
                      <Button type="text" size="small" icon={comment.isLiked ? <LikeFilled /> : <LikeOutlined />}>{comment.likes}</Button>
                      <Button type="text" size="small" icon={<CommentOutlined />}>回复</Button>
                    </Space>
                  </div>
                </Space>
                <Divider />
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <Card title={<Space><MenuOutlined />目录</Space>} size="small" style={{ position: 'sticky', top: '24px', borderRadius: '16px' }}>
            <Anchor items={tocItems} offsetTop={80} />
          </Card>
        </Col>
      </Row>

      <Modal title="分享文档" open={shareModalVisible} onCancel={() => setShareModalVisible(false)} footer={null}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button block onClick={() => copyToClipboard(window.location.href)}>复制链接</Button>
          <Button block>分享到微信</Button>
          <Button block>分享到QQ</Button>
        </Space>
      </Modal>

      <BackTop />
    </div>
  );
};

export default DocumentDetail;