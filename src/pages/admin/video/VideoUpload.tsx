/**
 * 视频上传页面
 */

import React from 'react';
import { Card, Row, Col, Upload, Progress, Form, Input, Select, Button, Typography, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

const VideoUpload: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card title="视频上传">
        <Row gutter={24}>
          <Col span={12}>
            <Dragger
              accept="video/*"
              multiple={false}
              beforeUpload={() => { message.info('开始上传...'); return false; }}
            >
              <p className="ant-upload-drag-icon"><CloudUploadOutlined style={{ fontSize: 48, color: '#1890ff' }} /></p>
              <p className="ant-upload-text">点击或拖拽视频文件到此区域上传</p>
              <p className="ant-upload-hint">支持 MP4、MOV、AVI、MKV 格式，单文件最大 2GB</p>
            </Dragger>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">上传进度</Text>
              <Progress percent={0} status="active" />
            </div>
            <Card size="small" style={{ marginTop: 16 }} title="上传说明">
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>支持分片上传和断点续传</li>
                <li>上传后自动进行转码处理</li>
                <li>可添加水印（文字/图片）</li>
                <li>AI自动识别标签和分类</li>
              </ul>
            </Card>
          </Col>
          <Col span={12}>
            <Form layout="vertical">
              <Form.Item label="视频标题" required><Input placeholder="请输入视频标题" /></Form.Item>
              <Form.Item label="视频分类" required>
                <Select placeholder="请选择分类">
                  <Option value="1">前端开发</Option>
                  <Option value="2">后端开发</Option>
                  <Option value="3">运维</Option>
                  <Option value="4">数据库</Option>
                </Select>
              </Form.Item>
              <Form.Item label="视频简介"><TextArea rows={4} placeholder="请输入视频简介" /></Form.Item>
              <Form.Item label="标签"><Select mode="tags" placeholder="输入标签后回车" /></Form.Item>
              <Form.Item label="权限设置">
                <Select defaultValue="public">
                  <Option value="public">公开</Option>
                  <Option value="private">私有</Option>
                  <Option value="password">密码访问</Option>
                </Select>
              </Form.Item>
              <Form.Item><Button type="primary" block size="large">提交审核</Button></Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default VideoUpload;
