/**
 * 搜索结果页面
 */

import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const SearchResult: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>搜索结果</Title>
        <Paragraph>
          搜索结果页面正在开发中...
        </Paragraph>
      </Card>
    </div>
  );
};

export default SearchResult;