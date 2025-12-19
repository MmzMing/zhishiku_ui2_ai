/**
 * 应用监控页面
 */

import React from 'react';
import { Card, Statistic, Row, Col, Progress } from 'antd';
import { ApiOutlined, BugOutlined } from '@ant-design/icons';

const AppMonitor: React.FC = () => {
  const appMetrics = {
    fp: 1.2, fcp: 1.8, lcp: 2.5, cls: 0.05,
    apiCalls: 15420, successRate: 99.2, avgResponseTime: 156,
    jsErrors: 23, apiErrors: 5,
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="API调用量" value={appMetrics.apiCalls} prefix={<ApiOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="成功率" value={appMetrics.successRate} suffix="%" valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="平均响应" value={appMetrics.avgResponseTime} suffix="ms" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="错误数" value={appMetrics.jsErrors + appMetrics.apiErrors} valueStyle={{ color: '#ff4d4f' }} prefix={<BugOutlined />} /></Card>
        </Col>
      </Row>

      <Card title="前端性能指标">
        <Row gutter={24}>
          <Col span={6}>
            <Statistic title="FP (首次绘制)" value={appMetrics.fp} suffix="s" />
            <Progress percent={Math.min(appMetrics.fp / 3 * 100, 100)} status={appMetrics.fp > 2 ? 'exception' : 'success'} />
          </Col>
          <Col span={6}>
            <Statistic title="FCP (首次内容绘制)" value={appMetrics.fcp} suffix="s" />
            <Progress percent={Math.min(appMetrics.fcp / 3 * 100, 100)} status={appMetrics.fcp > 2 ? 'exception' : 'success'} />
          </Col>
          <Col span={6}>
            <Statistic title="LCP (最大内容绘制)" value={appMetrics.lcp} suffix="s" />
            <Progress percent={Math.min(appMetrics.lcp / 4 * 100, 100)} status={appMetrics.lcp > 2.5 ? 'exception' : 'success'} />
          </Col>
          <Col span={6}>
            <Statistic title="CLS (累积布局偏移)" value={appMetrics.cls} />
            <Progress percent={Math.min(appMetrics.cls / 0.25 * 100, 100)} status={appMetrics.cls > 0.1 ? 'exception' : 'success'} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AppMonitor;
