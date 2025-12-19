/**
 * Markdown渲染组件
 */

import React, { useState } from 'react';
import { Button, Select, Space, Divider } from 'antd';
import { 
  FontSizeOutlined, 
  BgColorsOutlined, 
  CopyOutlined,
  FullscreenOutlined 
} from '@ant-design/icons';

const { Option } = Select;

interface MarkdownRendererProps {
  content: string;
  showToolbar?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark';
  onFontSizeChange?: (size: 'small' | 'medium' | 'large') => void;
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  showToolbar = true,
  fontSize = 'medium',
  theme = 'light',
  onFontSizeChange,
  onThemeChange,
}) => {
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [currentTheme, setCurrentTheme] = useState(theme);

  // 字体大小映射
  const fontSizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px',
  };

  // 处理字体大小变化
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setCurrentFontSize(size);
    onFontSizeChange?.(size);
  };

  // 处理主题变化
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setCurrentTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  // 复制代码块
  const copyCodeBlock = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      // message.success('代码已复制');
    });
  };

  // 简单的Markdown解析（实际项目中建议使用专业的Markdown解析库）
  const parseMarkdown = (text: string) => {
    return text
      // 标题
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      
      // 代码块
      .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
        const language = lang || 'text';
        return `
          <div class="code-block">
            <div class="code-header">
              <span class="language">${language}</span>
              <button class="copy-btn" onclick="copyCode('${encodeURIComponent(code)}')">
                <span>复制</span>
              </button>
            </div>
            <pre><code class="language-${language}">${code}</code></pre>
          </div>
        `;
      })
      
      // 行内代码
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      
      // 粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // 斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // 列表
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      
      // 数字列表
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')
      
      // 换行
      .replace(/\n/g, '<br>');
  };

  const renderedContent = parseMarkdown(content);

  const containerStyle: React.CSSProperties = {
    fontSize: fontSizeMap[currentFontSize],
    lineHeight: '1.8',
    color: currentTheme === 'dark' ? '#ffffff' : '#333333',
    backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  };

  return (
    <div>
      {/* 工具栏 */}
      {showToolbar && (
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px 16px',
          background: '#f5f5f5',
          borderRadius: '6px',
          border: '1px solid #d9d9d9'
        }}>
          <Space split={<Divider type="vertical" />}>
            <Space>
              <FontSizeOutlined />
              <Select
                value={currentFontSize}
                onChange={handleFontSizeChange}
                size="small"
                style={{ width: '80px' }}
              >
                <Option value="small">小</Option>
                <Option value="medium">中</Option>
                <Option value="large">大</Option>
              </Select>
            </Space>
            
            <Space>
              <BgColorsOutlined />
              <Select
                value={currentTheme}
                onChange={handleThemeChange}
                size="small"
                style={{ width: '80px' }}
              >
                <Option value="light">浅色</Option>
                <Option value="dark">深色</Option>
              </Select>
            </Space>
            
            <Button 
              size="small" 
              icon={<FullscreenOutlined />}
              onClick={() => {
                // 全屏阅读功能
                const element = document.querySelector('.markdown-content');
                if (element && element.requestFullscreen) {
                  element.requestFullscreen();
                }
              }}
            >
              全屏阅读
            </Button>
          </Space>
        </div>
      )}

      {/* 内容区域 */}
      <div 
        className="markdown-content"
        style={containerStyle}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />

      {/* 样式 */}
      <style jsx>{`
        .markdown-content h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 24px 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #eee;
        }
        
        .markdown-content h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 20px 0 12px 0;
          padding-bottom: 6px;
          border-bottom: 1px solid #eee;
        }
        
        .markdown-content h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 16px 0 8px 0;
        }
        
        .markdown-content p {
          margin: 12px 0;
          line-height: 1.8;
        }
        
        .markdown-content ul, .markdown-content ol {
          margin: 12px 0;
          padding-left: 24px;
        }
        
        .markdown-content li {
          margin: 4px 0;
          line-height: 1.6;
        }
        
        .markdown-content a {
          color: #1890ff;
          text-decoration: none;
        }
        
        .markdown-content a:hover {
          text-decoration: underline;
        }
        
        .markdown-content .inline-code {
          background: #f6f8fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
        }
        
        .markdown-content .code-block {
          margin: 16px 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e1e4e8;
        }
        
        .markdown-content .code-header {
          background: #f6f8fa;
          padding: 8px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e1e4e8;
        }
        
        .markdown-content .language {
          font-size: 12px;
          color: #586069;
          font-weight: 500;
        }
        
        .markdown-content .copy-btn {
          background: none;
          border: 1px solid #d1d5da;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          cursor: pointer;
          color: #586069;
        }
        
        .markdown-content .copy-btn:hover {
          background: #f3f4f6;
        }
        
        .markdown-content pre {
          background: #f6f8fa;
          padding: 16px;
          margin: 0;
          overflow-x: auto;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
          line-height: 1.5;
        }
        
        .markdown-content code {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        
        /* 深色主题样式 */
        .markdown-content[data-theme="dark"] {
          background: #1f1f1f;
          color: #ffffff;
        }
        
        .markdown-content[data-theme="dark"] h1,
        .markdown-content[data-theme="dark"] h2 {
          border-bottom-color: #444;
        }
        
        .markdown-content[data-theme="dark"] .inline-code {
          background: #2d2d2d;
          color: #e6e6e6;
        }
        
        .markdown-content[data-theme="dark"] .code-block {
          border-color: #444;
        }
        
        .markdown-content[data-theme="dark"] .code-header {
          background: #2d2d2d;
          border-bottom-color: #444;
        }
        
        .markdown-content[data-theme="dark"] pre {
          background: #2d2d2d;
          color: #e6e6e6;
        }
      `}</style>

      {/* 全局复制函数 */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.copyCode = function(encodedCode) {
            const code = decodeURIComponent(encodedCode);
            navigator.clipboard.writeText(code).then(() => {
              // 可以添加成功提示
            });
          }
        `
      }} />
    </div>
  );
};

export default MarkdownRenderer;