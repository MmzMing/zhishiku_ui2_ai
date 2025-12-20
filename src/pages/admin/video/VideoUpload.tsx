/**
 * 视频上传页面 - 增强版
 */

import React, { useState } from 'react';
import { 
  Card, Row, Col, Upload, Progress, Form, Input, Select, Button, Typography, 
  message, Switch, Slider, InputNumber, Table, Space, Tabs, Empty, Image,
  Radio, Popconfirm, Tag, Tooltip, Divider
} from 'antd';
import { 
  CloudUploadOutlined, PlusOutlined, DeleteOutlined, EditOutlined,
  PlayCircleOutlined, PictureOutlined, FontSizeOutlined, SaveOutlined,
  SendOutlined, ClockCircleOutlined, GlobalOutlined, LockOutlined,
  EyeOutlined, DownloadOutlined, CommentOutlined, CrownOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { ChapterMark, SubtitleInfo, WatermarkSettings, PermissionSettings } from '../../../api/admin/videoApi';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Text, Title } = Typography;

const VideoUpload: React.FC = () => {
  const [form] = Form.useForm();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<UploadFile | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [coverFile, setCoverFile] = useState<UploadFile | null>(null);
  const [chapters, setChapters] = useState<ChapterMark[]>([]);
  const [subtitles, setSubtitles] = useState<SubtitleInfo[]>([]);
  const [editingChapter, setEditingChapter] = useState<ChapterMark | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 水印设置
  const [watermark, setWatermark] = useState<WatermarkSettings>({
    enabled: false,
    type: 'text',
    content: '',
    position: 'bottomRight',
    opacity: 50,
    size: 16,
  });

  // 权限设置
  const [permission, setPermission] = useState<PermissionSettings>({
    visibility: 'public',
    allowDownload: false,
    allowComment: true,
    requireVip: false,
    requirePoints: 0,
  });

  // 视频上传处理
  const handleVideoUpload = (file: File) => {
    // 模拟上传进度
    setVideoFile({ uid: '-1', name: file.name, status: 'uploading' } as UploadFile);
    let progress = 0;
    const timer = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        setVideoFile({ uid: '-1', name: file.name, status: 'done' } as UploadFile);
        message.success('视频上传成功');
      }
      setUploadProgress(Math.min(progress, 100));
    }, 300);
    return false;
  };

  // 封面上传处理
  const handleCoverUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverUrl(e.target?.result as string);
      setCoverFile({ uid: '-1', name: file.name, status: 'done' } as UploadFile);
    };
    reader.readAsDataURL(file);
    message.success('封面上传成功');
    return false;
  };

  // 添加章节
  const handleAddChapter = () => {
    const newChapter: ChapterMark = {
      id: Date.now(),
      title: `章节 ${chapters.length + 1}`,
      startTime: chapters.length > 0 ? (chapters[chapters.length - 1].startTime || 0) + 60 : 0,
      description: '',
    };
    setChapters([...chapters, newChapter]);
  };

  // 更新章节
  const handleUpdateChapter = (id: number, field: keyof ChapterMark, value: any) => {
    setChapters(chapters.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // 删除章节
  const handleDeleteChapter = (id: number) => {
    setChapters(chapters.filter(c => c.id !== id));
  };

  // 字幕上传处理
  const handleSubtitleUpload = (file: File, language: string, languageCode: string) => {
    const newSubtitle: SubtitleInfo = {
      id: Date.now(),
      language,
      languageCode,
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      isDefault: subtitles.length === 0,
    };
    setSubtitles([...subtitles, newSubtitle]);
    message.success(`${language}字幕上传成功`);
    return false;
  };

  // 删除字幕
  const handleDeleteSubtitle = (id: number) => {
    setSubtitles(subtitles.filter(s => s.id !== id));
  };

  // 设置默认字幕
  const handleSetDefaultSubtitle = (id: number) => {
    setSubtitles(subtitles.map(s => ({ ...s, isDefault: s.id === id })));
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields(['title']);
      message.success('草稿保存成功');
    } catch {
      message.warning('请至少填写视频标题');
    }
  };

  // 提交审核
  const handleSubmit = async () => {
    try {
      await form.validateFields();
      if (!videoFile) {
        message.error('请先上传视频文件');
        return;
      }
      setSubmitting(true);
      // 模拟提交
      setTimeout(() => {
        setSubmitting(false);
        message.success('视频已提交审核');
      }, 1500);
    } catch {
      message.error('请完善必填信息');
    }
  };

  // 章节表格列
  const chapterColumns = [
    {
      title: '章节标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: ChapterMark) => (
        <Input 
          value={title} 
          onChange={(e) => handleUpdateChapter(record.id!, 'title', e.target.value)}
          placeholder="输入章节标题"
          style={{ width: 200 }}
        />
      ),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 150,
      render: (time: number, record: ChapterMark) => (
        <Space>
          <InputNumber 
            min={0} 
            value={time} 
            onChange={(v) => handleUpdateChapter(record.id!, 'startTime', v || 0)}
            style={{ width: 80 }}
          />
          <Text type="secondary">{formatTime(time)}</Text>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string, record: ChapterMark) => (
        <Input 
          value={desc} 
          onChange={(e) => handleUpdateChapter(record.id!, 'description', e.target.value)}
          placeholder="章节描述（可选）"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: ChapterMark) => (
        <Popconfirm title="确定删除此章节？" onConfirm={() => handleDeleteChapter(record.id!)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  // 字幕表格列
  const subtitleColumns = [
    { title: '语言', dataIndex: 'language', key: 'language' },
    { title: '文件名', dataIndex: 'fileName', key: 'fileName', ellipsis: true },
    {
      title: '默认',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault: boolean, record: SubtitleInfo) => (
        <Switch checked={isDefault} onChange={() => handleSetDefaultSubtitle(record.id!)} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SubtitleInfo) => (
        <Popconfirm title="确定删除此字幕？" onConfirm={() => handleDeleteSubtitle(record.id!)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const languageOptions = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁体中文' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        {/* 左侧主要内容 */}
        <Col span={17}>
          {/* 基本信息 */}
          <Card title="基本信息" style={{ marginBottom: 24 }}>
            <Form form={form} layout="vertical">
              <Form.Item name="title" label="视频标题" rules={[{ required: true, message: '请输入视频标题' }]}>
                <Input placeholder="请输入视频标题" maxLength={100} showCount />
              </Form.Item>
              <Form.Item name="categoryId" label="视频分类" rules={[{ required: true, message: '请选择分类' }]}>
                <Select placeholder="请选择视频分类">
                  <Select.Option value={1}>前端开发</Select.Option>
                  <Select.Option value={2}>后端开发</Select.Option>
                  <Select.Option value={3}>数据库</Select.Option>
                  <Select.Option value={4}>运维部署</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="description" label="视频简介" rules={[{ required: true, message: '请输入视频简介' }]}>
                <TextArea rows={4} placeholder="请输入视频简介" maxLength={500} showCount />
              </Form.Item>
              <Form.Item name="tags" label="标签">
                <Select mode="tags" placeholder="输入标签后回车添加" />
              </Form.Item>
            </Form>
          </Card>

          {/* 视频文件 */}
          <Card title="视频文件" style={{ marginBottom: 24 }}>
            <Dragger
              accept="video/*"
              multiple={false}
              showUploadList={false}
              beforeUpload={handleVideoUpload}
              disabled={!!videoFile}
            >
              {videoFile ? (
                <div style={{ padding: '20px 0' }}>
                  <PlayCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                  <p style={{ marginTop: 16 }}><Text strong>{videoFile.name}</Text></p>
                  <Progress percent={Math.round(uploadProgress)} status={uploadProgress < 100 ? 'active' : 'success'} style={{ width: '60%', margin: '16px auto 0' }} />
                  {uploadProgress >= 100 && (
                    <Button type="link" onClick={() => { setVideoFile(null); setUploadProgress(0); }}>重新上传</Button>
                  )}
                </div>
              ) : (
                <>
                  <p className="ant-upload-drag-icon"><CloudUploadOutlined style={{ fontSize: 48, color: '#1890ff' }} /></p>
                  <p className="ant-upload-text">将视频拖到此处，或 <a>点击上传</a></p>
                  <p className="ant-upload-hint">支持 mp4, mov, avi, mkv, webm 格式，最大 4GB</p>
                </>
              )}
            </Dragger>
          </Card>

          {/* 章节标记 */}
          <Card 
            title="章节标记" 
            style={{ marginBottom: 24 }}
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddChapter}>添加章节</Button>}
          >
            {chapters.length > 0 ? (
              <Table 
                dataSource={chapters} 
                columns={chapterColumns} 
                rowKey="id" 
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="暂无章节，点击上方按钮添加" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          {/* 字幕管理 */}
          <Card 
            title="字幕管理" 
            style={{ marginBottom: 24 }}
            extra={
              <Upload
                accept=".srt,.vtt,.ass"
                showUploadList={false}
                beforeUpload={(file) => {
                  const lang = languageOptions[0];
                  handleSubtitleUpload(file, lang.label, lang.value);
                  return false;
                }}
              >
                <Button type="primary" icon={<PlusOutlined />}>上传字幕</Button>
              </Upload>
            }
          >
            {subtitles.length > 0 ? (
              <Table 
                dataSource={subtitles} 
                columns={subtitleColumns} 
                rowKey="id" 
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="暂无字幕，支持 srt, vtt, ass 格式" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* 右侧设置 */}
        <Col span={7}>
          {/* 封面设置 */}
          <Card title="视频封面" style={{ marginBottom: 24 }}>
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleCoverUpload}
            >
              {coverUrl ? (
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                  <Image src={coverUrl} preview={false} style={{ width: '100%', borderRadius: 8 }} />
                  <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                    <Button size="small" icon={<EditOutlined />}>更换</Button>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  border: '1px dashed #d9d9d9', 
                  borderRadius: 8, 
                  padding: '40px 20px', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(0,0,0,0.02)'
                }}>
                  <PlusOutlined style={{ fontSize: 24, color: '#999' }} />
                  <div style={{ marginTop: 8, color: '#666' }}>上传封面</div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>建议尺寸 1280x720，支持 jpg/png 格式</div>
                </div>
              )}
            </Upload>
          </Card>

          {/* 权限设置 */}
          <Card title="权限设置" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">可见性</Text>
              <Radio.Group 
                value={permission.visibility} 
                onChange={(e) => setPermission({ ...permission, visibility: e.target.value })}
                style={{ display: 'flex', marginTop: 8 }}
              >
                <Radio.Button value="public"><GlobalOutlined /> 公开</Radio.Button>
                <Radio.Button value="private"><LockOutlined /> 私有</Radio.Button>
                <Radio.Button value="password"><EyeOutlined /> 密码</Radio.Button>
              </Radio.Group>
            </div>
            {permission.visibility === 'password' && (
              <Form.Item label="访问密码" style={{ marginBottom: 16 }}>
                <Input.Password 
                  value={permission.password}
                  onChange={(e) => setPermission({ ...permission, password: e.target.value })}
                  placeholder="设置访问密码"
                />
              </Form.Item>
            )}
            <div style={{ marginBottom: 12 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text><DownloadOutlined /> 允许下载</Text>
                <Switch checked={permission.allowDownload} onChange={(v) => setPermission({ ...permission, allowDownload: v })} />
              </Space>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text><CommentOutlined /> 允许评论</Text>
                <Switch checked={permission.allowComment} onChange={(v) => setPermission({ ...permission, allowComment: v })} />
              </Space>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text><CrownOutlined /> VIP专属</Text>
                <Switch checked={permission.requireVip} onChange={(v) => setPermission({ ...permission, requireVip: v })} />
              </Space>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div>
              <Text type="secondary">积分设置</Text>
              <InputNumber 
                min={0} 
                value={permission.requirePoints}
                onChange={(v) => setPermission({ ...permission, requirePoints: v || 0 })}
                style={{ width: '100%', marginTop: 8 }}
                addonAfter="积分"
                placeholder="0表示免费"
              />
            </div>
          </Card>

          {/* 水印设置 */}
          <Card title="水印设置" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text>启用水印</Text>
                <Switch checked={watermark.enabled} onChange={(v) => setWatermark({ ...watermark, enabled: v })} />
              </Space>
            </div>
            {watermark.enabled && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">水印类型</Text>
                  <Radio.Group 
                    value={watermark.type} 
                    onChange={(e) => setWatermark({ ...watermark, type: e.target.value })}
                    style={{ display: 'flex', marginTop: 8 }}
                  >
                    <Radio.Button value="text"><FontSizeOutlined /> 文字</Radio.Button>
                    <Radio.Button value="image"><PictureOutlined /> 图片</Radio.Button>
                  </Radio.Group>
                </div>
                {watermark.type === 'text' ? (
                  <Form.Item label="水印文字" style={{ marginBottom: 16 }}>
                    <Input 
                      value={watermark.content}
                      onChange={(e) => setWatermark({ ...watermark, content: e.target.value })}
                      placeholder="输入水印文字"
                    />
                  </Form.Item>
                ) : (
                  <Upload accept="image/*" showUploadList={false}>
                    <Button icon={<CloudUploadOutlined />} block style={{ marginBottom: 16 }}>上传水印图片</Button>
                  </Upload>
                )}
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">水印位置</Text>
                  <Select 
                    value={watermark.position}
                    onChange={(v) => setWatermark({ ...watermark, position: v })}
                    style={{ width: '100%', marginTop: 8 }}
                  >
                    <Select.Option value="topLeft">左上角</Select.Option>
                    <Select.Option value="topRight">右上角</Select.Option>
                    <Select.Option value="bottomLeft">左下角</Select.Option>
                    <Select.Option value="bottomRight">右下角</Select.Option>
                    <Select.Option value="center">居中</Select.Option>
                  </Select>
                </div>
                <div>
                  <Text type="secondary">透明度: {watermark.opacity}%</Text>
                  <Slider 
                    min={10} 
                    max={100} 
                    value={watermark.opacity}
                    onChange={(v) => setWatermark({ ...watermark, opacity: v })}
                  />
                </div>
              </>
            )}
          </Card>

          {/* 操作按钮 */}
          <Card>
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              block 
              size="large"
              loading={submitting}
              onClick={handleSubmit}
              style={{ marginBottom: 12 }}
            >
              提交审核
            </Button>
            <Button 
              icon={<SaveOutlined />} 
              block
              onClick={handleSaveDraft}
              style={{ marginBottom: 12 }}
            >
              保存草稿
            </Button>
            <Button block>取消</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VideoUpload;
