# 主题系统使用指南

## 概述

个人管理知识库前端项目的主题系统提供了完整的主题定制功能，支持浅色/深色主题切换、自定义颜色、字体大小调整、间距控制等多项配置。

## 功能特性

### 1. 主题模式
- **浅色主题**：适配日间使用，默认主题
- **深色主题**：适配夜间/低光环境使用
- **自动跟随系统**：根据操作系统设置自动切换

### 2. 自定义配置

#### 系统外观
- **主色调**：8种预设颜色 + 自定义颜色选择器
  - 拂晓蓝 (#1890ff)
  - 薄暮 (#f5222d)
  - 火山 (#fa541c)
  - 日暮 (#faad14)
  - 明青 (#13c2c2)
  - 极光绿 (#52c41a)
  - 极客蓝 (#2f54eb)
  - 酱紫 (#722ed1)

- **字体大小**
  - 小 (14px)
  - 中 (16px) - 默认
  - 大 (18px)

- **间距**
  - 紧凑 (0.8倍)
  - 常规 (1倍) - 默认
  - 宽松 (1.2倍)

#### 布局设置
- 侧边栏展开状态
- 顶部加载条显示
- 系统Logo显示
- 导航按钮显示
- 面包屑导航显示
- 标签页常显设置
- 底部信息显示

#### 页面功能
- 导航过渡效果
- 文字选中功能

## 使用方法

### 用户使用

1. **打开主题设置**
   - 前台：点击顶部导航栏右侧的调色板图标
   - 后台：点击顶部右侧的"主题设置"按钮

2. **配置主题**
   - 在弹出的抽屉中选择主题模式
   - 选择主色调
   - 调整字体大小和间距
   - 配置布局显示选项
   - 设置页面功能选项

3. **保存设置**
   - 点击底部"保存设置"按钮
   - 配置自动保存到浏览器
   - 下次访问自动应用

4. **重置设置**
   - 点击顶部重置按钮
   - 恢复为默认配置

### 开发者使用

#### 1. 使用 useTheme Hook

```typescript
import { useTheme } from '@/hooks/common/useTheme';

const MyComponent = () => {
  const { 
    themeConfig,      // 当前主题配置
    switchTheme,      // 切换主题模式
    setPrimaryColor,  // 设置主色调
    setFontSize,      // 设置字体大小
    setCompact,       // 设置紧凑模式
    resetTheme,       // 重置主题
    getThemeConfig,   // 获取主题配置
    isDark            // 是否深色模式
  } = useTheme();
  
  // 切换主题
  const handleToggle = () => {
    switchTheme(isDark ? 'light' : 'dark');
  };
  
  // 设置主色调
  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
  };
  
  return (
    <div>
      <button onClick={handleToggle}>
        切换到{isDark ? '浅色' : '深色'}主题
      </button>
      <button onClick={() => handleColorChange('#52c41a')}>
        设置为绿色主题
      </button>
    </div>
  );
};
```

#### 2. 使用 Redux 状态

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { 
  switchTheme, 
  toggleTheme,
  updateCustomConfig,
  selectCurrentTheme,
  selectCustomConfig 
} from '@/store/slices/themeSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectCurrentTheme);
  const customConfig = useSelector(selectCustomConfig);
  
  // 切换主题
  const handleSwitch = () => {
    dispatch(switchTheme('dark'));
  };
  
  // 在浅色和深色之间切换
  const handleToggle = () => {
    dispatch(toggleTheme());
  };
  
  // 更新自定义配置
  const handleUpdateConfig = () => {
    dispatch(updateCustomConfig({
      primaryColor: '#52c41a',
      fontSize: 16,
      compactMode: true
    }));
  };
  
  return (
    <div>
      <p>当前主题: {currentTheme}</p>
      <p>主色调: {customConfig.primaryColor}</p>
    </div>
  );
};
```

#### 3. 使用主题配置工具函数

```typescript
import {
  getThemeConfig,
  saveThemeConfig,
  applyThemeConfig,
  switchThemeMode,
  updateThemeConfig,
  resetThemeConfig,
  getSystemTheme,
  watchSystemTheme
} from '@/config/theme/themeConfig';

// 获取当前主题配置
const config = getThemeConfig();

// 切换主题模式
switchThemeMode('dark');

// 更新主题配置
updateThemeConfig({
  primaryColor: '#52c41a',
  fontSize: 'large'
});

// 重置主题配置
resetThemeConfig();

// 获取系统主题
const systemTheme = getSystemTheme();

// 监听系统主题变化
const unwatch = watchSystemTheme((theme) => {
  console.log('系统主题变化:', theme);
});

// 取消监听
unwatch();
```

#### 4. 在CSS中使用主题变量

```css
/* 使用主题颜色 */
.my-component {
  color: var(--text-color-primary);
  background-color: var(--bg-color-primary);
  border-color: var(--border-color-base);
}

/* 使用主色调 */
.my-button {
  background-color: var(--primary-color);
}

.my-button:hover {
  background-color: var(--primary-color-hover);
}

/* 使用字体大小 */
.my-text {
  font-size: var(--base-font-size);
}

/* 使用间距 */
.my-container {
  padding: var(--spacing-md);
  margin: var(--spacing-lg);
}

/* 使用圆角 */
.my-card {
  border-radius: var(--border-radius-md);
}

/* 使用阴影 */
.my-box {
  box-shadow: var(--shadow-md);
}
```

#### 5. 深色主题适配

```css
/* 浅色主题样式 */
[data-theme="light"] .my-component {
  background-color: #ffffff;
  color: #000000;
}

/* 深色主题样式 */
[data-theme="dark"] .my-component {
  background-color: #141414;
  color: #ffffff;
}

/* 自动跟随系统 */
[data-theme="auto"] .my-component {
  /* 会根据系统设置自动应用对应样式 */
}
```

## 主题配置结构

```typescript
interface ThemeConfig {
  // 系统外观
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'loose';
  
  // 布局设置
  sidebarCollapsed: boolean;
  showTopLoadingBar: boolean;
  showLogo: boolean;
  showNavButtons: boolean;
  showBreadcrumb: boolean;
  keepTabsAlive: boolean;
  showFooter: boolean;
  
  // 页面功能
  enablePageTransition: boolean;
  allowTextSelection: boolean;
}
```

## CSS变量列表

### 颜色变量
```css
--primary-color              /* 主色调 */
--primary-color-hover        /* 主色调悬停 */
--primary-color-active       /* 主色调激活 */

--bg-color-primary           /* 主背景色 */
--bg-color-secondary         /* 次背景色 */
--bg-color-tertiary          /* 三级背景色 */

--text-color-primary         /* 主文字颜色 */
--text-color-secondary       /* 次文字颜色 */
--text-color-tertiary        /* 三级文字颜色 */
--text-color-disabled        /* 禁用文字颜色 */

--border-color-base          /* 基础边框颜色 */
--border-color-light         /* 浅色边框 */
--border-color-split         /* 分割线颜色 */

--link-color                 /* 链接颜色 */
--link-hover-color           /* 链接悬停颜色 */
--link-active-color          /* 链接激活颜色 */

--success-color              /* 成功颜色 */
--warning-color              /* 警告颜色 */
--error-color                /* 错误颜色 */
--info-color                 /* 信息颜色 */
```

### 尺寸变量
```css
--base-font-size             /* 基础字体大小 */
--font-size-sm               /* 小字体 */
--font-size-lg               /* 大字体 */

--spacing-scale              /* 间距比例 */
--spacing-xs                 /* 超小间距 */
--spacing-sm                 /* 小间距 */
--spacing-md                 /* 中等间距 */
--spacing-lg                 /* 大间距 */
--spacing-xl                 /* 超大间距 */

--border-radius-sm           /* 小圆角 */
--border-radius-md           /* 中等圆角 */
--border-radius-lg           /* 大圆角 */
```

### 效果变量
```css
--shadow-sm                  /* 小阴影 */
--shadow-md                  /* 中等阴影 */
--shadow-lg                  /* 大阴影 */

--transition-fast            /* 快速过渡 */
--transition-normal          /* 正常过渡 */
--transition-slow            /* 慢速过渡 */
```

## 响应式断点

```css
/* 移动端 */
@media (max-width: 768px) {
  /* 移动端样式 */
}

/* 平板端 */
@media (min-width: 769px) and (max-width: 1024px) {
  /* 平板端样式 */
}

/* PC端 */
@media (min-width: 1025px) {
  /* PC端样式 */
}
```

## 文件结构

```
src/
├── assets/
│   └── styles/
│       └── theme.css                    # 全局主题样式
├── components/
│   ├── common/
│   │   └── ThemeSettings.tsx            # 主题设置组件
│   └── layout/
│       └── pc/
│           ├── FrontLayout.tsx          # 前台布局（已集成）
│           └── AdminLayout.tsx          # 后台布局（已集成）
├── config/
│   └── theme/
│       └── themeConfig.ts               # 主题配置文件
├── hooks/
│   └── common/
│       └── useTheme.ts                  # 主题Hook
├── store/
│   └── slices/
│       └── themeSlice.ts                # 主题状态管理
└── App.tsx                              # 应用根组件（已集成）
```

## 最佳实践

### 1. 主题切换
- 使用 `useTheme` Hook 进行主题切换
- 避免直接操作 DOM
- 使用事件驱动的方式更新主题

### 2. 样式编写
- 优先使用 CSS 变量
- 为深色主题提供适配样式
- 使用语义化的变量名

### 3. 性能优化
- 主题配置持久化到 localStorage
- 避免频繁切换主题
- 使用 CSS 过渡动画提升体验

### 4. 兼容性
- 测试不同浏览器的兼容性
- 提供降级方案
- 处理不支持 CSS 变量的情况

## 常见问题

### Q: 主题切换后部分组件样式没有更新？
A: 确保组件使用了 CSS 变量，并且监听了主题变化事件。

### Q: 如何添加新的预设主题颜色？
A: 在 `themeConfig.ts` 的 `PRESET_COLORS` 数组中添加新颜色。

### Q: 深色主题下某些组件显示异常？
A: 检查组件是否有针对深色主题的样式适配，在 `theme.css` 中添加对应样式。

### Q: 主题配置丢失？
A: 检查浏览器是否禁用了 localStorage，或者清除了浏览器缓存。

### Q: 如何禁用主题切换功能？
A: 在布局组件中移除主题设置按钮，或者在 `ThemeSettings` 组件中禁用相关选项。

## 技术支持

如有问题或建议，请联系开发团队或提交 Issue。

---

**主题系统版本**: 1.0.0  
**最后更新**: 2024-12-19  
**文档维护**: 开发团队
