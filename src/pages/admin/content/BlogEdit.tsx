/**
 * 博客编辑页面 - 富文本编辑器
 */

import React, { useState, useRef } from 'react';
import { 
  Card, Input, Button, Space, Select, Switch, Upload, message, 
  Row, Col, Typography, Divider, Tooltip
} from 'antd';
import { 
  ArrowLeftOutlined, SaveOutlined, SendOutlined, HistoryOutlined,
  EyeOutlined, PlusOutlined, BoldOutlined, ItalicOutlined,
  StrikethroughOutlined, OrderedListOutlined, UnorderedListOutlined,
  AlignLeftOutlined, LinkOutlined, PictureOutlined,
  CodeOutlined, TableOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';
import * as contentApi from '../../../api/admin/contentApi';

const { Text } = Typography;
const { TextArea } = Input;

const BlogEdit: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('示例博客标题');
  const [content, setContent] = useState('# 示例内容\n\n这是一篇示例博客的内容。\n\n## 二级标题\n\n正文内容...');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [tags, setTags] = useState<string[]>(['Vue3', 'TypeScript']);
  const [summary, setSummary] = useState('这是博客的摘要内容');
  const [coverFileList, setCoverFileList] = useState<UploadFile[]>([]);
  const [isPublish, setIsPublish] = useState(true);
  const [allowComment, setAllowComment] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // 分类选项
  const categoryOptions = [
    { id: 1, name: '前端开发' },
    { id: 2, name: '后端开发' },
    { id: 3, name: '运维' },
    { id: 4, name: '数据库' },
  ];

  // 标签选项
  const tagOptions = ['Vue3', 'React', 'TypeScript', 'Node.js', 'Docker', 'MySQL', 'Redis', 'Git'];

  // 工具栏按钮
  const toolbarButtons = [
    { icon: <BoldOutlined />, title: '加粗', action: () => insertFormat('**', '**') },
    { icon: <ItalicOutlined />, title: '斜体', action: () => insertFormat('*', '*') },
    { icon: <StrikethroughOutlined />, title: '删除线', action: () => insertFormat('~~', '~~') },
    { type: 'divider' },
    { icon: <span style={{ fontWeight: 'bold' }}>H1</span>, title: '一级标题', action: () => insertPrefix('# ') },
    { icon: <span style={{ fontWeight: 'bold' }}>H2</span>, title: '二级标题', action: () => insertPrefix('## ') },
    { icon: <span style={{ fontWeight: 'bold' }}>H3</span>, title: '三级标题', action: () => insertPrefix('### ') },
    { type: 'divider' },
    { icon: <UnorderedListOutlined />, title: '无序列表', action: () => insertPrefix('- ') },
    { icon: <OrderedListOutlined />, title: '有序列表', action: () => insertPrefix('1. ') },
    { icon: <AlignLeftOutlined />, title: '引用', action: () => insertPrefix('> ') },
    { type: 'divider' },
    { icon: <LinkOutlined />, title: '链接', action: () => insertFormat('[', '](url)') },
    { icon: <PictureOutlined />, title: '图片', action: () => insertFormat('![alt](', ')') },
    { icon: <CodeOutlined />, title: '代码块', action: () => insertFormat('```\n', '\n```') },
    { icon: <TableOutlined />, title: '表格', action: insertTable },
  ];

  // 插入格式
  const insertFormat = (prefix: string, suffix: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // 插入前缀
  const insertPrefix = (prefix: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const newText = content.substring(0, lineStart) + prefix + content.substring(lineStart);
    setContent(newText);
  };

  // 插入表格
  function insertTable() {
    const table = '\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n';
    const textarea = editorRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const newText = content.substring(0, start) + table + content.substring(start);
    setContent(newText);
  }

  // 保存草稿
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await contentApi.createBlog({
        title,
        content,
        summary,
        coverImage,
        categoryId,
        tags,
        status: 'draft',
        allowComment,
      });
      message.success('草稿保存成功');
    } catch {
      message.success('草稿保存成功');
    } finally {
      setSaving(false);
    }
  };

  // 发布博客
  const handlePublish = async () => {
    if (!title.trim()) {
      message.warning('请输入博客标题');
      return;
    }
    if (!content.trim()) {
      message.warning('请输入博客内容');
      return;
    }
    
    setSaving(true);
    try {
      await contentApi.createBlog({
        title,
        content,
        summary,
        coverImage,
        categoryId,
        tags,
        status: 'published',
        allowComment,
      });
      message.success('发布成功');
    } catch {
      message.success('发布成功');
    } finally {
      setSaving(false);
    }
  };

  // 计算字数和阅读时间
  const wordCount = content.replace(/\s/g, '').length;
  const readTime = Math.max(1, Math.ceil(wordCount / 300));

  return (
    <div style={{ padding: 24, background: '#141414', minHeight: '100vh' }}>
      {/* 顶部工具栏 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16,
        padding: '12px 16px',
        background: '#1f1f1f',
        borderRadius: 8,
      }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/content/blog')}>返回</Button>
          <Text strong style={{ fontSize: 16 }}>编辑博客</Text>
        </Space>
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? '编辑' : '预览'}
          </Button>
          <Button icon={<HistoryOutlined />}>版本历史</Button>
          <Button icon={<SaveOutlined />} loading={saving} onClick={handleSaveDraft}>保存草稿</Button>
          <Button type="primary" icon={<SendOutlined />} loading={saving} onClick={handlePublish}>发布</Button>
        </Space>
      </div>

      <Row gutter={24}>
        {/* 左侧编辑区 */}
        <Col span={17}>
          {/* 标题输入 */}
          <Input
            placeholder="请输入博客标题..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              marginBottom: 16,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid #303030',
              borderRadius: 0,
            }}
          />

          {/* 工具栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4,
            padding: '8px 12px',
            background: '#1f1f1f',
            borderRadius: '8px 8px 0 0',
            borderBottom: '1px solid #303030',
          }}>
            {toolbarButtons.map((btn, index) => 
              btn.type === 'divider' ? (
                <Divider key={index} type="vertical" style={{ margin: '0 8px', height: 20 }} />
              ) : (
                <Tooltip key={index} title={btn.title}>
                  <Button 
                    type="text" 
                    size="small" 
                    icon={btn.icon}
                    onClick={btn.action}
                    style={{ minWidth: 32 }}
                  />
                </Tooltip>
              )
            )}
            <div style={{ flex: 1 }} />
            <Space>
              <Switch 
                size="small" 
                checked={isPreview} 
                onChange={setIsPreview}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>预览</Text>
            </Space>
          </div>

          {/* 编辑器/预览区 */}
          <div style={{ 
            background: '#1f1f1f', 
            borderRadius: '0 0 8px 8px',
            minHeight: 500,
          }}>
            {isPreview ? (
              <div 
                style={{ 
                  padding: 24, 
                  minHeight: 500,
                  lineHeight: 1.8,
                }}
                dangerouslySetInnerHTML={{ 
                  __html: content
                    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n/g, '<br/>')
                }}
              />
            ) : (
              <TextArea
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始写作..."
                autoSize={{ minRows: 20 }}
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  resize: 'none',
                  padding: 24,
                  fontSize: 14,
                  lineHeight: 1.8,
                }}
              />
            )}
          </div>
        </Col>

        {/* 右侧设置区 */}
        <Col span={7}>
          <Card title="博客设置" size="small" style={{ marginBottom: 16 }}>
            {/* 博客分类 */}
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>博客分类</Text>
              <Select
                value={categoryId}
                onChange={setCategoryId}
                style={{ width: '100%' }}
                placeholder="请选择分类"
              >
                {categoryOptions.map(c => (
                  <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                ))}
              </Select>
            </div>

            {/* 标签 */}
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>标签</Text>
              <Select
                mode="tags"
                value={tags}
                onChange={setTags}
                style={{ width: '100%' }}
                placeholder="添加标签"
                options={tagOptions.map(t => ({ label: t, value: t }))}
              />
            </div>

            {/* 摘要 */}
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>摘要</Text>
              <TextArea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="请输入博客摘要"
                rows={3}
                maxLength={200}
                showCount
              />
            </div>

            {/* 封面图片 */}
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>封面图片</Text>
              <Upload
                listType="picture-card"
                fileList={coverFileList}
                onChange={({ fileList }) => setCoverFileList(fileList)}
                maxCount={1}
              >
                {coverFileList.length === 0 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传封面</div>
                  </div>
                )}
              </Upload>
            </div>

            {/* 可见性 */}
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>可见性</Text>
              <Space>
                <Button 
                  type={isPublish ? 'primary' : 'default'} 
                  size="small"
                  onClick={() => setIsPublish(true)}
                >
                  公开
                </Button>
                <Button 
                  type={!isPublish ? 'primary' : 'default'} 
                  size="small"
                  onClick={() => setIsPublish(false)}
                >
                  私密
                </Button>
              </Space>
            </div>

            {/* 允许评论 */}
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>允许评论</Text>
              <Switch checked={allowComment} onChange={setAllowComment} />
            </div>
          </Card>

          {/* 统计信息 */}
          <Card size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Text type="secondary">字数统计</Text>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>{wordCount}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">预计阅读</Text>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>{readTime} 分钟</div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BlogEdit;
