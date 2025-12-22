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
  Dropdown,
} from 'antd';
import {
  SettingOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LayoutOutlined,
  CloseOutlined,
  ReloadOutlined,
  CheckOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';
import type { MenuProps } from 'antd';
import { useLanguage } from '../../contexts/LanguageContext';

import { 
  ThemeConfig, 
  DEFAULT_THEME_CONFIG as DEFAULT_CONFIG, 
  THEME_STORAGE_KEY,
  PRESET_COLORS
} from '../../config/theme/themeConfig';

const { Title, Text } = Typography;
const { Option } = Select;

interface ThemeSettingsProps {
  visible: boolean;
  onClose: () => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ visible, onClose }) => {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [hasChanges, setHasChanges] = useState(false);
  const { currentLanguage, setLanguage, t } = useLanguage();

  // 语言选项
  const languageOptions: MenuProps['items'] = [
    {
      key: 'zh-CN',
      label: (
        <Space>
          <span>🇨🇳</span>
          <span>{t('language.chinese')}</span>
        </Space>
      ),
      onClick: () => setLanguage('zh-CN'),
    },
    {
      key: 'en-US',
      label: (
        <Space>
          <span>🇺🇸</span>
          <span>{t('language.english')}</span>
        </Space>
      ),
      onClick: () => setLanguage('en-US'),
    },
    {
      key: 'ja-JP',
      label: (
        <Space>
          <span>🇯🇵</span>
          <span>{t('language.japanese')}</span>
        </Space>
      ),
      onClick: () => setLanguage('ja-JP'),
    },
  ];

  // 预设主题颜色
  const presetColors = PRESET_COLORS;

  // 加载已保存的配置
  useEffect(() => {
    if (visible) {
      const savedConfig = localStorage.getItem(THEME_STORAGE_KEY);
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
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
    
    // 触发主题变化事件，让App.tsx重新应用主题
    window.dispatchEvent(new Event('theme-change'));
    
    message.success(t('theme.saved'));
    setHasChanges(false);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setHasChanges(true);
    message.info(t('theme.reset.success'));
  };

  return (
    <Drawer
      title={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 8px'
        }}>
          {/* 左侧：语言切换 */}
          <Dropdown 
            menu={{ items: languageOptions }} 
            placement="bottomLeft"
            trigger={['click']}
          >
            <Button 
              type="text" 
              icon={<GlobalOutlined />}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '4px 8px',
                borderRadius: '6px'
              }}
            />
          </Dropdown>

          {/* 中间：主题设置图标 */}
          <SettingOutlined 
            style={{ 
              fontSize: '18px',
              color: 'var(--text-color-primary)'
            }} 
          />

          {/* 右侧：操作按钮 */}
          <Space size="small">
            <Tooltip title={t('theme.reset')}>
              <Button 
                type="text" 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
              />
            </Tooltip>
            <Tooltip title={t('theme.close')}>
              <Button 
                type="text" 
                icon={<CloseOutlined />} 
                onClick={onClose}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
              />
            </Tooltip>
          </Space>
        </div>
      }
      placement="right"
      width={400}
      open={visible}
      onClose={onClose}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>{t('theme.cancel')}</Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleSave}
              disabled={!hasChanges}
            >
              {t('theme.save')}
            </Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '0 8px' }}>
        {/* 系统外观设置 */}
        <Title level={5}>
          <BgColorsOutlined /> {t('theme.appearance')}
        </Title>
        
        {/* 主题模式 */}
        <div style={{ marginBottom: 24 }}>
          <Text strong>{t('theme.mode')}</Text>
          <div style={{ marginTop: 8 }}>
            <Radio.Group
              value={config.mode}
              onChange={(e) => handleConfigChange('mode', e.target.value)}
              buttonStyle="solid"
              style={{ width: '100%', display: 'flex' }}
            >
              <Radio.Button value="light" style={{ flex: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {t('theme.mode.light')}
              </Radio.Button>
              <Radio.Button value="dark" style={{ flex: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {t('theme.mode.dark')}
              </Radio.Button>
              <Radio.Button value="auto" style={{ flex: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {t('theme.mode.auto')}
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>

        {/* 主色调 */}
        <div style={{ marginBottom: 24 }}>
          <Text strong>{t('theme.primaryColor')}</Text>
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
          <Text strong>{t('theme.fontSize')}</Text>
          <div style={{ marginTop: 8 }}>
            <Select
              value={config.fontSize}
              onChange={(value) => handleConfigChange('fontSize', value)}
              style={{ width: '100%' }}
            >
              <Option value="small">{t('theme.fontSize.small')}</Option>
              <Option value="medium">{t('theme.fontSize.medium')}</Option>
              <Option value="large">{t('theme.fontSize.large')}</Option>
            </Select>
          </div>
        </div>

        {/* 间距 */}
        <div style={{ marginBottom: 24 }}>
          <Text strong>{t('theme.spacing')}</Text>
          <div style={{ marginTop: 8 }}>
            <Radio.Group
              value={config.spacing}
              onChange={(e) => handleConfigChange('spacing', e.target.value)}
              buttonStyle="solid"
              style={{ width: '100%', display: 'flex' }}
            >
              <Radio.Button value="compact" style={{ flex: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {t('theme.spacing.compact')}
              </Radio.Button>
              <Radio.Button value="normal" style={{ flex: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {t('theme.spacing.normal')}
              </Radio.Button>
              <Radio.Button value="loose" style={{ flex: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {t('theme.spacing.loose')}
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <Divider />

        {/* 布局自定义设置 */}
        <Title level={5}>
          <LayoutOutlined /> {t('theme.layout')}
        </Title>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>{t('theme.sidebar.expanded')}</Text>
            <Switch
              checked={!config.sidebarCollapsed}
              onChange={(checked) => handleConfigChange('sidebarCollapsed', !checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>{t('theme.topLoadingBar')}</Text>
            <Switch
              checked={config.showTopLoadingBar}
              onChange={(checked) => handleConfigChange('showTopLoadingBar', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>{t('theme.showLogo')}</Text>
            <Switch
              checked={config.showLogo}
              onChange={(checked) => handleConfigChange('showLogo', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>{t('theme.showNavButtons')}</Text>
            <Switch
              checked={config.showNavButtons}
              onChange={(checked) => handleConfigChange('showNavButtons', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>{t('theme.showBreadcrumb')}</Text>
            <Switch
              checked={config.showBreadcrumb}
              onChange={(checked) => handleConfigChange('showBreadcrumb', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>{t('theme.keepTabsAlive')}</Text>
            <Switch
              checked={config.keepTabsAlive}
              onChange={(checked) => handleConfigChange('keepTabsAlive', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>{t('theme.showFooter')}</Text>
            <Switch
              checked={config.showFooter}
              onChange={(checked) => handleConfigChange('showFooter', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>{t('theme.showFullscreenButton')}</Text>
            <Switch
              checked={config.showFullscreenButton}
              onChange={(checked) => handleConfigChange('showFullscreenButton', checked)}
            />
          </div>
        </div>

        <Divider />

        {/* 页面功能设置 */}
        <Title level={5}>
          <FontSizeOutlined /> {t('theme.pageFeatures')}
        </Title>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>{t('theme.pageTransition')}</Text>
            <Switch
              checked={config.enablePageTransition}
              onChange={(checked) => handleConfigChange('enablePageTransition', checked)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text>{t('theme.textSelection')}</Text>
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
            💡 {t('theme.tip')}
          </Text>
        </div>
      </div>
    </Drawer>
  );
};

export default ThemeSettings;
