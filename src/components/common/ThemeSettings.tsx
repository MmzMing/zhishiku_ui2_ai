/**
 * 主题设置组件
 */

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Space,
  Divider,
  Switch,
  Select,
  Radio,
  Button,
  ColorPicker,
  Typography,
  message,
  Tooltip,
} from 'antd';
import {
  SettingOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LayoutOutlined,
  CloseOutlined,
  ReloadOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';

const { Title, Text } = Typography;
const { Option } = Select;

interface ThemeSettingsProps {
  visible: boolean;
  onClose: () => void;
}

interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'loose';
  sidebarCollapsed: boolean;
  showTopLoadingBar: boolean;
  showLogo: boolean;
  showNavButtons: boolean;
  showBreadcrumb: boolean;
  keepTabsAlive: boolean;
  showFooter: boolean;
  enablePageTransition: boolean;
  allowTextSelection: boolean;
}

const DEFAULT_CONFIG: ThemeConfig = {
  mode: 'light',
  primaryColor: '#1890ff',
  fontSize: 'medium',
  spacing: 'normal',
  sidebarCollapsed: false,
  showTopLoadingBar: true,
  showLogo: true,
  showNavButtons: true,
  showBreadcrumb: true,
  keepTabsAlive: false,
  showFooter: true,
  enablePageTransition: true,
  allowTextSelection: true,
};

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ visible, onClose }) => {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [hasChanges, setHasChanges] = useState(false);

  // 预设主题颜色
  const presetColors = [
    { label: '拂晓蓝', value: '#1890ff' },
    { label: '薄暮', value: '#f5222d' },
    { label: '火山', value: '#fa541c' },
    { label: '日暮', value: '#faad14' },
    { label: '明青', value: '#13c2c2' },
    { label: '极光绿', value: '#52c41a' },
    { label: '极客蓝', value: '#2f54eb' },
    { label: '酱紫', value: '#722ed1' },
  ];

  // 加载已保存的配置
  useEffect(() => {
    if (visible) {
      const savedConfig = localStorage.getItem('theme-config');
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setConfig({ ...DEFAULT_CONFIG, ...parsed });
        } catch (e) {
          console.error('Failed to parse theme config:', e);
        }
      }
      setHasChanges(false);
    }
  }, [visible]);

  const handleConfigChange = <K extends keyof ThemeConfig>(
    key: K,
    value: ThemeConfig[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // 保存配置到localStorage
    localStorage.setItem('theme-config', JSON.stringify(config));
    
    // 触发主题变化事件，让App.tsx重新应用主题
    window.dispatchEvent(new Event('theme-change'));
    
    message.success('主题设置已保存');
    setHasChanges(false);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setHasChanges(true);
    message.info('已重置为默认设置');
  };

  return (
    <Drawer
      title={
        <Space>
          <SettingOutlined />
          <span>主题设置</span>
        </Space>
      }
      placement="right"
      width={360}
      open={visible}
      onClose={onClose}
      extra={
        <Space>
          <Tooltip title="重置">
            <Button type="text" icon={<ReloadOutlined />} onClick={handleReset} />
          </Tooltip>
          <Tooltip title="关闭">
            <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
          </Tooltip>
        </Space>
      }
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleSave}
              disabled={!hasChanges}
            >
              保存设置
            </Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '0 8px' }}>
        {/* 系统外观设置 */}
        <Title level={5}>
          <BgColorsOutlined /> 系统外观
        </Title>
        
        {/* 主题模式 */}
        <div style={{ marginBottom: 24 }}>
          <Text strong>主题模式</Text>
          <div style={{ marginTop: 8 }}>
            <Radio.Group
              value={config.mode}
              onChange={(e) => handleConfigChange('mode', e.target.value)}
              buttonStyle="solid"
              style={{ width: '100%' }}
            >
              <Radio.Button value="light" style={{ width: '33.33%', textAlign: 'center' }}>
                浅色
              </Radio.Button>
              <Radio.Button value="dark" style={{ width: '33.33%', textAlign: 'center' }}>
                深色
              </Radio.Button>
              <Radio.Button value="auto" style={{ width: '33.33%', textAlign: 'center' }}>
                跟随系统
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>

        {/* 主色调 */}
        <div style={{ marginBottom: 24 }}>
          <Text strong>主色调</Text>
          <div style={{ marginTop: 8 }}>
            <Space wrap>
              {presetColors.map(color => (
                <Tooltip key={color.value} title={color.label}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      backgroundColor: color.value,
                      cursor: 'pointer',
                      border: config.primaryColor === color.value ? '2px solid #000' : '2px solid transparent',
                      transition: 'all 0.3s',
                    }}
                    onClick={() => handleConfigChange('primaryColor', color.value)}
                  />
                </Tooltip>
              ))}
              <ColorPicker
                value={config.primaryColor}
                onChange={(color: Color) => handleConfigChange('primaryColor', color.toHexString())}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    border: '2px dashed #d9d9d9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  +
                </div>
              </ColorPicker>
            </Space>
          </div>
        </div>

        {/* 字体大小 */}
        <div style={{ marginBottom: 24 }}>
          <Text strong>字体大小</Text>
          <div style={{ marginTop: 8 }}>
            <Select
              value={config.fontSize}
              onChange={(value) => handleConfigChange('fontSize', value)}
              style={{ width: '100%' }}
            >
              <Option value="small">小 (14px)</Option>
              <Option value="medium">中 (16px)</Option>
              <Option value="large">大 (18px)</Option>
            </Select>
          </div>
        </div>

        {/* 间距 */}
        <div style={{ marginBottom: 24 }}>
          <Text strong>间距</Text>
          <div style={{ marginTop: 8 }}>
            <Radio.Group
              value={config.spacing}
              onChange={(e) => handleConfigChange('spacing', e.target.value)}
              buttonStyle="solid"
              style={{ width: '100%' }}
            >
              <Radio.Button value="compact" style={{ width: '33.33%', textAlign: 'center' }}>
                紧凑
              </Radio.Button>
              <Radio.Button value="normal" style={{ width: '33.33%', textAlign: 'center' }}>
                常规
              </Radio.Button>
              <Radio.Button value="loose" style={{ width: '33.33%', textAlign: 'center' }}>
                宽松
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <Divider />

        {/* 布局自定义设置 */}
        <Title level={5}>
          <LayoutOutlined /> 布局设置
        </Title>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>侧边栏展开状态</Text>
            <Switch
              checked={!config.sidebarCollapsed}
              onChange={(checked) => handleConfigChange('sidebarCollapsed', !checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>顶部加载条显示</Text>
            <Switch
              checked={config.showTopLoadingBar}
              onChange={(checked) => handleConfigChange('showTopLoadingBar', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>系统 Logo 显示</Text>
            <Switch
              checked={config.showLogo}
              onChange={(checked) => handleConfigChange('showLogo', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>导航按钮显示</Text>
            <Switch
              checked={config.showNavButtons}
              onChange={(checked) => handleConfigChange('showNavButtons', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>面包屑导航显示</Text>
            <Switch
              checked={config.showBreadcrumb}
              onChange={(checked) => handleConfigChange('showBreadcrumb', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>标签页常显设置</Text>
            <Switch
              checked={config.keepTabsAlive}
              onChange={(checked) => handleConfigChange('keepTabsAlive', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>底部信息显示</Text>
            <Switch
              checked={config.showFooter}
              onChange={(checked) => handleConfigChange('showFooter', checked)}
            />
          </div>
        </div>

        <Divider />

        {/* 页面功能设置 */}
        <Title level={5}>
          <FontSizeOutlined /> 页面功能
        </Title>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>导航过渡效果</Text>
            <Switch
              checked={config.enablePageTransition}
              onChange={(checked) => handleConfigChange('enablePageTransition', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>文字选中功能</Text>
            <Switch
              checked={config.allowTextSelection}
              onChange={(checked) => handleConfigChange('allowTextSelection', checked)}
            />
          </div>
        </div>

        <Divider />

        {/* 提示信息 */}
        <div style={{ 
          padding: 12, 
          background: 'var(--bg-color-secondary)', 
          borderRadius: 4,
          fontSize: 12,
        }}>
          <Text type="secondary">
            💡 提示：修改设置后需要点击"保存设置"按钮才会生效。
          </Text>
        </div>
      </div>
    </Drawer>
  );
};

export default ThemeSettings;
