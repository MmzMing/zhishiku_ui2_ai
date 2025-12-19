/**
 * 文档详情页面
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
  Anchor,
  BackTop,
  message,
  Modal,
  Input,
  Rate
} from 'antd';
import { 
  LikeOutlined, 
  StarOutlined, 
  ShareAltOutlined, 
  DownloadOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MenuOutlined,
  LikeFilled,
  StarFilled,
  CommentOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface DocumentDetail {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  publishTime: string;
  updateTime: string;
  views: number;
  likes: number;
  stars: number;
  downloads: number;
  category: string;
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
  avatar?: string;
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [tocVisible, setTocVisible] = useState(false);

  // 模拟文档数据
  useEffect(() => {
    const mockDocument: DocumentDetail = {
      id: id || '1',
      title: 'JavaScript异步编程详解',
      content: `# JavaScript异步编程详解

## 1. 引言

JavaScript是一门单线程语言，但它能够处理异步操作，这是通过事件循环机制实现的。本文将深入探讨JavaScript中的异步编程概念和实践。

## 2. 回调函数

回调函数是最早的异步编程解决方案：

\`\`\`javascript
function fetchData(callback) {
  setTimeout(() => {
    callback('数据获取成功');
  }, 1000);
}

fetchData((data) => {
  console.log(data);
});
\`\`\`

### 2.1 回调地狱

当多个异步操作需要依次执行时，会出现回调地狱：

\`\`\`javascript
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      // 嵌套过深，难以维护
    });
  });
});
\`\`\`

## 3. Promise

Promise是ES6引入的异步编程解决方案：

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

promise
  .then(result => {
    // 处理成功结果
  })
  .catch(error => {
    // 处理错误
  });
\`\`\`

### 3.1 Promise链式调用

\`\`\`javascript
fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => {
    console.log(comments);
  })
  .catch(error => {
    console.error(error);
  });
\`\`\`

## 4. async/await

async/await是ES2017引入的语法糖，让异步代码看起来像同步代码：

\`\`\`javascript
async function fetchData() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    return comments;
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

## 5. 事件循环

JavaScript的事件循环机制是理解异步编程的关键：

1. 调用栈（Call Stack）
2. 任务队列（Task Queue）
3. 微任务队列（Microtask Queue）

## 6. 最佳实践

1. 优先使用 async/await
2. 合理处理错误
3. 避免阻塞主线程
4. 使用 Promise.all 并行处理
5. 注意内存泄漏问题

## 7. 总结

异步编程是 JavaScript 的核心特性之一，掌握好异步编程对于编写高质量的 JavaScript 代码至关重要。`,
      author: '前端专家',
      authorAvatar: '/api/placeholder/40/40',
      publishTime: '2024-01-15',
      updateTime: '2024-01-16',
      views: 2580,
      likes: 156,
      stars: 89,
      downloads: 67,
      category: 'frontend',
      tags: ['JavaScript', '异步编程', 'Promise', 'async/await'],
      isFree: true,
      rating: 4.8,
      isLiked: false,
      isStarred: false,
    };

    const mockComments: Comment[] = [
      {
        id: '1',
        user: '学习者A',
        avatar: '/api/placeholder/32/32',
        content: '写得很详细，对Promise的解释特别清楚！',
        time: '2024-01-16 10:30',
        likes: 12,
        isLiked: false,
      },
      {
        id: '2',
        user: '开发者B',
        avatar: '/api/placeholder/32/32',
        content: 'async/await的示例代码很实用，已经收藏了。',
        time: '2024-01-16 14:20',
        likes: 8,
        isLiked: true,
      },
    ];

    setTimeout(() => {
      setDocument(mockDocument);
      setComments(mockComments);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleLike = () => {
    if (!document) return;
    
    setDocument({
      ...document,
      isLiked: !document.isLiked,
      likes: document.isLiked ? document.likes - 1 : document.likes + 1,
    });
    
    message.success(document.isLiked ? '取消点赞' : '点赞成功');
  };

  const handleStar = () => {
    if (!document) return;
    
    setDocument({
      ...document,
      isStarred: !document.isStarred,
      stars: document.isStarred ? document.stars - 1 : document.stars + 1,
    });
    
    message.success(document.isStarred ? '取消收藏' : '收藏成功');
  };

  const handleDownload = () => {
    if (!document) return;
    
    if (document.isFree) {
      message.success('下载中，请稍候...');
      // TODO: 实际下载逻辑
    } else {
      Modal.confirm({
        title: '下载需要积分',
        content: `下载此文档需要消耗 ${document.points} 积分，是否确认？`,
        onOk: () => {
          message.success('积分扣除成功，开始下载...');
          // TODO: 扣除积分并下载
        },
      });
    }
  };

  const handleShare = () => {
    setShareModalVisible(true);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('链接已复制到剪贴板');
    });
  };

  if (loading || !document) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>加载中...</div>;
  }

  // 生成目录
  const tocItems = document.content
    .split('\n')
    .filter(line => line.startsWith('#'))
    .map((line, index) => {
      const level = line.match(/^#+/)?.[0].length || 1;
      const title = line.replace(/^#+\s*/, '');
      const href = `#heading-${index}`;
      
      return {
        key: href,
        href,
        title,
        level,
      };
    });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {/* 主内容区 */}
        <Col xs={24} lg={18}>
          <Card>
            {/* 文档头部信息 */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={1} style={{ marginBottom: '16px' }}>
                {document.title}
              </Title>
              
              <Space wrap style={{ marginBottom: '16px' }}>
                {document.tags.map(tag => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </Space>

              <Row gutter={[16, 8]} align="middle">
                <Col>
                  <Space>
                    <Avatar 
                      src={document.authorAvatar} 
                      icon={<UserOutlined />}
                    />
                    <Text strong>{document.author}</Text>
                  </Space>
                </Col>
                <Col>
                  <Space split={<Divider type="vertical" />}>
                    <Space size="small">
                      <ClockCircleOutlined />
                      <Text type="secondary">{document.publishTime}</Text>
                    </Space>
                    <Space size="small">
                      <EyeOutlined />
                      <Text type="secondary">{document.views}</Text>
                    </Space>
                    <Space size="small">
                      <Rate disabled defaultValue={document.rating} allowHalf />
                      <Text type="secondary">({document.rating})</Text>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </div>

            {/* 操作按钮 */}
            <div style={{ marginBottom: '24px' }}>
              <Space wrap>
                <Button 
                  type={document.isLiked ? "primary" : "default"}
                  icon={document.isLiked ? <LikeFilled /> : <LikeOutlined />}
                  onClick={handleLike}
                >
                  点赞 ({document.likes})
                </Button>
                <Button 
                  type={document.isStarred ? "primary" : "default"}
                  icon={document.isStarred ? <StarFilled /> : <StarOutlined />}
                  onClick={handleStar}
                >
                  收藏 ({document.stars})
                </Button>
                <Button 
                  icon={<ShareAltOutlined />}
                  onClick={handleShare}
                >
                  分享
                </Button>
                <Button 
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                >
                  下载 {!document.isFree && `(${document.points}积分)`}
                </Button>
              </Space>
            </div>

            <Divider />

            {/* 文档内容 */}
            <div 
              style={{ 
                lineHeight: '1.8',
                fontSize: '16px'
              }}
              dangerouslySetInnerHTML={{
                __html: document.content
                  .replace(/^# (.*$)/gim, '<h1 id="heading-$1">$1</h1>')
                  .replace(/^## (.*$)/gim, '<h2 id="heading-$1">$1</h2>')
                  .replace(/^### (.*$)/gim, '<h3 id="heading-$1">$1</h3>')
                  .replace(/```javascript\n([\s\S]*?)\n```/g, '<pre style="background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto;"><code>$1</code></pre>')
                  .replace(/`([^`]+)`/g, '<code style="background: #f6f8fa; padding: 2px 4px; border-radius: 3px;">$1</code>')
                  .replace(/\n/g, '<br>')
              }}
            />
          </Card>

          {/* 评论区 */}
          <Card title="评论" style={{ marginTop: '24px' }}>
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
            {comments.map(comment => (
              <div key={comment.id} style={{ marginBottom: '16px' }}>
                <Space align="start">
                  <Avatar 
                    src={comment.avatar} 
                    icon={<UserOutlined />}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '4px' }}>
                      <Text strong>{comment.user}</Text>
                      <Text type="secondary" style={{ marginLeft: '8px' }}>
                        {comment.time}
                      </Text>
                    </div>
                    <Paragraph style={{ marginBottom: '8px' }}>
                      {comment.content}
                    </Paragraph>
                    <Space>
                      <Button 
                        type="text" 
                        size="small"
                        icon={comment.isLiked ? <LikeFilled /> : <LikeOutlined />}
                      >
                        {comment.likes}
                      </Button>
                      <Button type="text" size="small" icon={<CommentOutlined />}>
                        回复
                      </Button>
                    </Space>
                  </div>
                </Space>
                <Divider />
              </div>
            ))}
          </Card>
        </Col>

        {/* 侧边栏 */}
        <Col xs={24} lg={6}>
          {/* 目录 */}
          <Card 
            title={
              <Space>
                <MenuOutlined />
                目录
              </Space>
            }
            size="small"
            style={{ position: 'sticky', top: '24px' }}
          >
            <Anchor
              items={tocItems}
              offsetTop={80}
            />
          </Card>
        </Col>
      </Row>

      {/* 分享弹窗 */}
      <Modal
        title="分享文档"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            block 
            onClick={() => copyToClipboard(window.location.href)}
          >
            复制链接
          </Button>
          <Button block>分享到微信</Button>
          <Button block>分享到QQ</Button>
        </Space>
      </Modal>

      <BackTop />
    </div>
  );
};

export default DocumentDetail;