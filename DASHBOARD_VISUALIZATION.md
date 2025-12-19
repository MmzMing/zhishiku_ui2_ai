# 后台控制台数据可视化功能

## 功能概述

后台控制台新增了数据可视化功能，包括：

1. **访问趋势折线图** - 展示用户访问数据的时间趋势
2. **观看分类占比饼图** - 展示不同内容分类的观看占比
3. **统计概览卡片** - 显示关键指标和增长率
4. **最近活动列表** - 展示系统最近的操作记录
5. **待办事项列表** - 显示需要处理的任务

## 技术实现

### 1. 图表库
使用 `@ant-design/charts` 作为图表组件库，基于 G2Plot 实现。

```bash
npm install @ant-design/charts
```

### 2. 文件结构

```
src/
├── api/admin/                    # 后台API接口
│   ├── dashboardApi.ts          # 控制台相关API
│   ├── statisticsApi.ts         # 统计分析API
│   └── index.ts                 # API入口文件
├── hooks/admin/                 # 后台相关Hooks
│   └── useDashboardData.ts      # 控制台数据Hook
└── pages/admin/dashboard/       # 控制台页面
    └── Dashboard.tsx            # 主要组件
```

### 3. API接口

所有API接口都已定义在 `src/api/admin/` 目录下：

- **dashboardApi.ts**: 控制台相关接口
- **statisticsApi.ts**: 统计分析相关接口

详细的API文档请参考 `API_ENDPOINTS.md`。

### 4. 数据Hook

`useDashboardData` Hook 提供了：
- 模拟数据生成（用于开发测试）
- 数据加载状态管理
- 数据刷新功能
- 日期范围支持

## 图表配置

### 访问趋势折线图

```typescript
const visitTrendConfig = {
  data: visitTrendData,
  xField: 'date',
  yField: 'visits',
  smooth: true,
  point: { size: 3, shape: 'circle' },
  color: ['#1890ff'],
  animation: {
    appear: { animation: 'path-in', duration: 1000 }
  }
};
```

### 分类占比饼图

```typescript
const categoryPieConfig = {
  data: categoryData,
  angleField: 'value',
  colorField: 'category',
  radius: 0.8,
  innerRadius: 0.4,
  label: {
    type: 'inner',
    offset: '-30%',
    content: ({ percent }) => `${(percent * 100).toFixed(0)}%`
  }
};
```

## 使用方法

### 1. 开发环境

当前使用模拟数据进行开发测试：

```typescript
import { useDashboardData } from '../../../hooks/admin/useDashboardData';

const Dashboard = () => {
  const {
    loading,
    visitTrendData,
    categoryData,
    statsOverview,
    recentActivities,
    todoList,
    refreshData
  } = useDashboardData(30); // 30天数据

  // 组件渲染...
};
```

### 2. 生产环境

替换为真实API调用：

```typescript
import { 
  getVisitTrend, 
  getCategoryStats, 
  getStatsOverview 
} from '../../../api/admin/dashboardApi';

// 在useEffect中调用真实API
useEffect(() => {
  const loadData = async () => {
    const [visitRes, categoryRes, statsRes] = await Promise.all([
      getVisitTrend(30),
      getCategoryStats(),
      getStatsOverview()
    ]);
    // 处理响应数据...
  };
  loadData();
}, []);
```

## 功能特性

### 1. 响应式设计
- 支持PC端和移动端自适应
- 图表自动调整大小
- 卡片布局响应式排列

### 2. 交互功能
- 日期范围选择器
- 数据刷新按钮
- 图表悬停提示
- 点击查看详情

### 3. 性能优化
- 数据懒加载
- 图表动画优化
- 防抖刷新机制

### 4. 数据格式

#### 访问趋势数据
```typescript
interface VisitTrendData {
  date: string;        // 日期 YYYY-MM-DD
  visits: number;      // 访问人数
  users: number;       // 用户数
  pageViews: number;   // 页面浏览量
}
```

#### 分类数据
```typescript
interface CategoryData {
  category: string;    // 分类名称
  value: number;       // 数值
  percentage: number;  // 百分比
}
```

#### 统计概览
```typescript
interface StatsOverview {
  totalUsers: number;
  totalDocuments: number;
  totalVideos: number;
  totalPoints: number;
  todayVisits: number;
  todayUsers: number;
  growthRate: {
    users: number;
    documents: number;
    videos: number;
    visits: number;
  };
}
```

## 后端对接

### 1. API接口实现

后端需要实现以下接口（详见 `API_ENDPOINTS.md`）：

- `GET /api/admin/dashboard/visit-trend`
- `GET /api/admin/dashboard/category-stats`
- `GET /api/admin/dashboard/stats-overview`
- `GET /api/admin/dashboard/recent-activities`
- `GET /api/admin/dashboard/todo-list`

### 2. 数据库设计

建议的数据表结构：

```sql
-- 访问统计表
CREATE TABLE visit_stats (
  id BIGINT PRIMARY KEY,
  date DATE NOT NULL,
  visits INT DEFAULT 0,
  users INT DEFAULT 0,
  page_views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 分类统计表
CREATE TABLE category_stats (
  id BIGINT PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  view_count INT DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. 缓存策略

建议使用Redis缓存热点数据：

```javascript
// 缓存访问趋势数据（1小时）
redis.setex('dashboard:visit_trend:30d', 3600, JSON.stringify(data));

// 缓存分类统计数据（30分钟）
redis.setex('dashboard:category_stats', 1800, JSON.stringify(data));
```

## 扩展功能

### 1. 更多图表类型
- 柱状图：用户增长对比
- 面积图：内容发布趋势
- 散点图：用户活跃度分布
- 热力图：访问时间分布

### 2. 实时数据
- WebSocket连接
- 实时用户在线数
- 实时访问统计

### 3. 数据导出
- Excel导出
- PDF报告生成
- 图表截图功能

### 4. 高级筛选
- 多维度筛选
- 自定义时间范围
- 数据对比功能

## 注意事项

1. **性能考虑**：大数据量时建议使用分页或数据聚合
2. **缓存策略**：合理设置缓存时间，平衡实时性和性能
3. **错误处理**：完善的错误处理和用户提示
4. **权限控制**：确保只有授权用户可以访问统计数据
5. **数据安全**：敏感数据脱敏处理

## 开发调试

### 1. 模拟数据
当前使用 `useDashboardData` Hook 提供模拟数据，便于前端开发和测试。

### 2. API切换
通过环境变量控制是否使用模拟数据：

```typescript
const USE_MOCK_DATA = process.env.NODE_ENV === 'development';
```

### 3. 调试工具
- 浏览器开发者工具
- React DevTools
- 网络请求监控