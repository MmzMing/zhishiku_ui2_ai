# 后台管理API接口文档

## 控制台相关API

### 1. 获取访问趋势数据
- **接口地址**: `GET /api/admin/dashboard/visit-trend`
- **请求参数**: 
  - `days`: 天数，默认30天
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": [
    {
      "date": "2024-01-01",
      "visits": 1200,
      "users": 800,
      "pageViews": 3000
    }
  ]
}
```

### 2. 获取观看分类占比数据
- **接口地址**: `GET /api/admin/dashboard/category-stats`
- **响应数据**:
```json
{
  "code": 200,
  "message": "success", 
  "success": true,
  "data": [
    {
      "category": "前端开发",
      "value": 1256,
      "percentage": 35.2
    }
  ]
}
```

### 3. 获取统计概览数据
- **接口地址**: `GET /api/admin/dashboard/stats-overview`
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": {
    "totalUsers": 1328,
    "totalDocuments": 1256,
    "totalVideos": 892,
    "totalPoints": 156800,
    "todayVisits": 234,
    "todayUsers": 89,
    "growthRate": {
      "users": 12.5,
      "documents": 8.3,
      "videos": 15.7,
      "visits": 6.2
    }
  }
}
```

### 4. 获取最近活动数据
- **接口地址**: `GET /api/admin/dashboard/recent-activities`
- **请求参数**:
  - `limit`: 限制数量，默认10条
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": [
    {
      "id": "activity_1",
      "action": "编辑视频",
      "target": "React入门教程",
      "user": "管理员",
      "time": "10分钟前",
      "type": "video"
    }
  ]
}
```

### 5. 获取待办事项数据
- **接口地址**: `GET /api/admin/dashboard/todo-list`
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": [
    {
      "id": "todo_1",
      "title": "审核待发布视频",
      "count": 5,
      "priority": "high",
      "link": "/admin/video/audit"
    }
  ]
}
```

### 6. 获取实时在线用户数
- **接口地址**: `GET /api/admin/dashboard/online-users`
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": {
    "count": 45,
    "list": []
  }
}
```

### 7. 获取系统性能数据
- **接口地址**: `GET /api/admin/dashboard/system-performance`
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": {
    "cpu": 65.5,
    "memory": 78.2,
    "disk": 45.8,
    "network": {
      "upload": 1024,
      "download": 2048
    }
  }
}
```

## 统计分析相关API

### 1. 获取用户统计数据
- **接口地址**: `GET /api/admin/statistics/users`
- **请求参数**:
  - `timeRange`: 时间范围 (7d, 30d, 90d, 1y)
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": {
    "totalUsers": 1328,
    "activeUsers": 892,
    "newUsers": 45,
    "userGrowthTrend": [
      {
        "date": "2024-01-01",
        "total": 1200,
        "new": 12,
        "active": 800
      }
    ],
    "userDistribution": [
      {
        "region": "北京",
        "count": 234
      }
    ]
  }
}
```

### 2. 获取内容统计数据
- **接口地址**: `GET /api/admin/statistics/content`
- **请求参数**:
  - `timeRange`: 时间范围
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": {
    "totalDocuments": 1256,
    "totalVideos": 892,
    "publishedToday": 12,
    "contentTrend": [
      {
        "date": "2024-01-01",
        "documents": 45,
        "videos": 23
      }
    ],
    "categoryDistribution": [
      {
        "category": "前端开发",
        "documents": 456,
        "videos": 234
      }
    ]
  }
}
```

### 3. 获取访问统计数据
- **接口地址**: `GET /api/admin/statistics/visits`
- **请求参数**:
  - `timeRange`: 时间范围
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": {
    "totalVisits": 15680,
    "uniqueVisitors": 8934,
    "pageViews": 45678,
    "bounceRate": 35.6,
    "avgSessionDuration": 245,
    "visitTrend": [
      {
        "date": "2024-01-01",
        "visits": 1200,
        "visitors": 800,
        "pageViews": 3000
      }
    ],
    "topPages": [
      {
        "path": "/home",
        "title": "首页",
        "visits": 5678
      }
    ]
  }
}
```

### 4. 获取热门内容数据
- **接口地址**: `GET /api/admin/statistics/popular-content`
- **请求参数**:
  - `limit`: 限制数量，默认10
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc_1",
        "title": "React入门教程",
        "views": 1234,
        "likes": 89,
        "category": "前端开发"
      }
    ],
    "videos": [
      {
        "id": "video_1",
        "title": "Vue3实战教程",
        "views": 2345,
        "likes": 156,
        "duration": 1800,
        "category": "前端开发"
      }
    ]
  }
}
```

### 5. 获取搜索关键词统计
- **接口地址**: `GET /api/admin/statistics/search-keywords`
- **请求参数**:
  - `limit`: 限制数量，默认20
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": [
    {
      "keyword": "React",
      "count": 234,
      "trend": "up"
    }
  ]
}
```

### 6. 获取设备统计数据
- **接口地址**: `GET /api/admin/statistics/devices`
- **响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "success": true,
  "data": {
    "devices": [
      {
        "type": "Desktop",
        "count": 1234,
        "percentage": 65.2
      }
    ],
    "browsers": [
      {
        "name": "Chrome",
        "count": 1567,
        "percentage": 78.3
      }
    ],
    "os": [
      {
        "name": "Windows",
        "count": 1234,
        "percentage": 56.7
      }
    ]
  }
}
```

## 通用响应格式

所有API接口都遵循统一的响应格式：

```json
{
  "code": 200,           // 状态码
  "message": "success",  // 消息
  "success": true,       // 是否成功
  "data": {},           // 数据
  "timestamp": 1640995200000  // 时间戳
}
```

## 错误码说明

- `200`: 成功
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器内部错误

## 认证说明

所有后台管理API都需要在请求头中携带认证token：

```
Authorization: Bearer <token>
```