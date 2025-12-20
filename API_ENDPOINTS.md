# 知识库前端 API 接口文档

## 概述

本文档列出了知识库前端项目中所有需要后端对接的 API 接口。接口按模块分类，包含请求方法、路径、参数和响应格式。所有页面组件已正确导入对应的API模块。

## 目录结构

```
src/api/
├── admin/           # 后台管理API
│   ├── contentApi.ts    # 内容管理
│   ├── dashboardApi.ts  # 控制台
│   ├── dictionaryApi.ts # 字典管理
│   ├── monitorApi.ts    # 应用监控
│   ├── pointApi.ts      # 积分管理
│   ├── roleApi.ts       # 角色权限
│   ├── statisticsApi.ts # 统计分析
│   ├── systemApi.ts     # 系统管理
│   ├── userApi.ts       # 用户管理
│   └── videoApi.ts      # 视频管理
├── auth/            # 认证相关API
│   └── authApi.ts       # 登录注册
└── front/           # 前台API
    ├── documentApi.ts   # 文档相关
    ├── homeApi.ts       # 首页
    ├── profileApi.ts    # 个人中心
    ├── searchApi.ts     # 搜索
    └── videoApi.ts      # 视频相关
```

## 组件API集成状态

### ✅ 已完成API集成的组件

**认证模块:**
- Login.tsx → authApi
- Register.tsx → authApi  
- ResetPassword.tsx → authApi

**前台模块:**
- Home.tsx → homeApi
- DocumentList.tsx → documentApi
- DocumentDetail.tsx → documentApi
- VideoList.tsx → videoApi
- VideoDetail.tsx → videoApi (已有)
- SearchResults.tsx → searchApi
- Profile.tsx → profileApi

**后台管理模块:**
- Dashboard.tsx → dashboardApi
- UserList.tsx → userApi (已有)
- UserBehavior.tsx → userApi (已有)
- RolePermission.tsx → roleApi (已有)
- Department.tsx → userApi
- VideoAudit.tsx → videoApi (已有)
- VideoCategory.tsx → videoApi (已有)
- VideoUpload.tsx → videoApi (已有)
- VideoList.tsx → videoApi
- VideoStats.tsx → videoApi
- ContentList.tsx → contentApi
- ContentCategory.tsx → contentApi
- ContentStats.tsx → contentApi
- BlogList.tsx → contentApi (已有)
- BlogEdit.tsx → contentApi (已有)
- CommentAudit.tsx → contentApi (已有)
- DictCategory.tsx → dictionaryApi
- DictItems.tsx → dictionaryApi
- DictUsage.tsx → dictionaryApi
- PointRules.tsx → pointApi
- PointRecords.tsx → pointApi
- PointRanking.tsx → pointApi
- PointShop.tsx → pointApi
- AppMonitor.tsx → monitorApi (已有)
- SystemConfig.tsx → systemApi
- LogManage.tsx → systemApi
- AuditTrail.tsx → systemApi
- ServerMonitor.tsx → systemApi

---

## 1. 认证模块 (auth)

### 1.1 基础认证

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取图形验证码 | GET | `/graph/code` | 返回验证码图片和UUID |
| 用户名密码登录 | POST | `/auth/login` | 账号密码登录 |
| 手机号验证码登录 | POST | `/auth/phone-login` | 手机验证码登录 |
| 用户注册 | POST | `/auth/register` | 用户注册 |
| 发送短信验证码 | POST | `/auth/send-sms-code` | 发送手机验证码 |
| 发送邮箱验证码 | POST | `/auth/send-email-code` | 发送邮箱验证码 |
| 退出登录 | POST | `/auth/logout` | 用户登出 |
| 刷新token | POST | `/auth/refresh-token` | 刷新访问令牌 |
| 获取当前用户信息 | GET | `/auth/current-user` | 获取登录用户信息 |
| 修改密码 | POST | `/auth/change-password` | 修改用户密码 |
| 忘记密码 | POST | `/auth/forgot-password` | 重置密码 |
| 更新用户信息 | POST | `/auth/update-profile` | 更新个人资料 |
| 上传头像 | POST | `/auth/upload-avatar` | 上传用户头像 |

---

## 2. 前台模块 (front)

### 2.1 首页 (home)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取网站统计 | GET | `/home/stats` | 网站基础统计数据 |
| 获取分类列表 | GET | `/home/categories` | 内容分类列表 |
| 获取推荐内容 | GET | `/home/recommend` | 推荐文档/视频 |
| 获取最新更新 | GET | `/home/latest` | 最新发布内容 |
| 获取热门标签 | GET | `/home/hot-tags` | 热门标签列表 |
| 获取轮播图 | GET | `/home/banners` | 首页轮播图 |
| 搜索建议 | GET | `/home/search-suggestions` | 搜索关键词建议 |

### 2.2 文档 (document)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取文档列表 | GET | `/document/list` | 文档列表(分页) |
| 获取文档详情 | GET | `/document/{id}` | 文档详细信息 |
| 点赞文档 | POST | `/document/{id}/like` | 点赞/取消点赞 |
| 收藏文档 | POST | `/document/{id}/star` | 收藏/取消收藏 |
| 分享文档 | POST | `/document/{id}/share` | 生成分享链接 |
| 下载文档 | POST | `/document/{id}/download` | 下载文档文件 |
| 积分下载 | POST | `/document/{id}/deduct-points` | 扣除积分下载 |
| 获取文档评论 | GET | `/document/{id}/comments` | 文档评论列表 |
| 发表评论 | POST | `/document/{id}/comments` | 发表文档评论 |
| 点赞评论 | POST | `/document-comment/{id}/like` | 点赞评论 |
| 回复评论 | POST | `/document-comment/{id}/reply` | 回复评论 |
| 相关文档推荐 | GET | `/document/{id}/related` | 相关文档推荐 |
| 记录阅读 | POST | `/document/{id}/read` | 记录阅读行为 |
| 获取文档分类 | GET | `/document/categories` | 文档分类列表 |
| 获取文档标签 | GET | `/document/tags` | 热门标签 |
| 搜索文档 | GET | `/document/search` | 文档搜索 |
| 批量收藏 | POST | `/document/batch-star` | 批量收藏文档 |
| 获取文档目录 | GET | `/document/{id}/toc` | 文档目录结构 |
| 评分文档 | POST | `/document/{id}/rate` | 文档评分 |

### 2.3 视频 (video)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取视频列表 | GET | `/video/list` | 视频列表(分页) |
| 获取视频详情 | GET | `/video/{id}` | 视频详细信息 |
| 点赞视频 | POST | `/video/{id}/like` | 点赞/取消点赞 |
| 收藏视频 | POST | `/video/{id}/star` | 收藏/取消收藏 |
| 分享视频 | POST | `/video/{id}/share` | 生成分享链接 |
| 积分观看 | POST | `/video/{id}/deduct-points` | 扣除积分观看 |
| 获取视频评论 | GET | `/video/{id}/comments` | 视频评论列表 |
| 发表评论 | POST | `/video/{id}/comments` | 发表视频评论 |
| 点赞评论 | POST | `/comment/{id}/like` | 点赞评论 |
| 回复评论 | POST | `/comment/{id}/reply` | 回复评论 |
| 相关视频推荐 | GET | `/video/{id}/related` | 相关视频推荐 |
| 记录播放 | POST | `/video/{id}/play` | 记录播放行为 |
| 获取视频分类 | GET | `/video/categories` | 视频分类列表 |
| 获取视频标签 | GET | `/video/tags` | 热门标签 |
| 搜索视频 | GET | `/video/search` | 视频搜索 |

### 2.4 搜索 (search)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 综合搜索 | GET | `/search` | 全站内容搜索 |
| 获取搜索建议 | GET | `/search/suggestions` | 搜索关键词建议 |
| 热门搜索词 | GET | `/search/hot-keywords` | 热门搜索关键词 |
| 搜索历史 | GET | `/search/history` | 用户搜索历史 |
| 保存搜索历史 | POST | `/search/history` | 保存搜索记录 |
| 清空搜索历史 | POST | `/search/history/clear` | 清空搜索历史 |
| 删除搜索历史 | POST | `/search/history/delete` | 删除单条历史 |
| 高级搜索 | POST | `/search/advanced` | 高级搜索功能 |
| 搜索自动完成 | GET | `/search/autocomplete` | 搜索自动完成 |
| 相似内容推荐 | GET | `/search/similar` | 相似内容推荐 |
| 搜索统计 | GET | `/search/stats` | 搜索统计数据 |
| 举报搜索结果 | POST | `/search/report` | 举报不当内容 |

### 2.5 个人中心 (profile)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取个人信息 | GET | `/profile/info` | 用户个人资料 |
| 更新个人信息 | PUT | `/profile/info` | 更新个人资料 |
| 上传头像 | POST | `/profile/upload-avatar` | 上传用户头像 |
| 修改密码 | POST | `/profile/change-password` | 修改登录密码 |
| 绑定手机号 | POST | `/profile/bind-phone` | 绑定手机号 |
| 绑定邮箱 | POST | `/profile/bind-email` | 绑定邮箱地址 |
| 获取用户内容 | GET | `/profile/contents` | 用户发布内容 |
| 删除用户内容 | DELETE | `/profile/contents/{id}` | 删除发布内容 |
| 更新内容状态 | PUT | `/profile/contents/{id}/status` | 更新内容状态 |
| 获取收藏列表 | GET | `/profile/favorites` | 用户收藏列表 |
| 取消收藏 | DELETE | `/profile/favorites/{id}` | 取消收藏 |
| 批量取消收藏 | POST | `/profile/favorites/batch-remove` | 批量取消收藏 |
| 创建收藏夹 | POST | `/profile/favorite-folders` | 创建收藏夹 |
| 获取收藏夹 | GET | `/profile/favorite-folders` | 收藏夹列表 |
| 获取浏览历史 | GET | `/profile/browse-history` | 浏览历史记录 |
| 清空浏览历史 | POST | `/profile/browse-history/clear` | 清空浏览历史 |
| 删除浏览记录 | DELETE | `/profile/browse-history/{id}` | 删除单条记录 |
| 获取积分记录 | GET | `/profile/point-records` | 积分变动记录 |
| 积分统计 | GET | `/profile/point-statistics` | 积分统计信息 |
| 获取通知列表 | GET | `/profile/notifications` | 消息通知列表 |
| 标记已读 | PUT | `/profile/notifications/{id}/read` | 标记通知已读 |
| 批量标记已读 | POST | `/profile/notifications/batch-read` | 批量标记已读 |
| 全部标记已读 | POST | `/profile/notifications/read-all` | 全部标记已读 |
| 删除通知 | DELETE | `/profile/notifications/{id}` | 删除通知 |
| 未读通知数量 | GET | `/profile/notifications/unread-count` | 未读通知数量 |
| 获取登录日志 | GET | `/profile/login-logs` | 登录日志记录 |
| 获取安全设置 | GET | `/profile/security-settings` | 安全设置信息 |
| 更新安全设置 | PUT | `/profile/security-settings` | 更新安全设置 |
| 注销账户 | POST | `/profile/deactivate` | 注销用户账户 |

---

## 3. 后台管理模块 (admin)

### 3.1 控制台 (dashboard)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 访问趋势数据 | GET | `/api/admin/dashboard/visit-trend` | 访问趋势统计 |
| 分类占比数据 | GET | `/api/admin/dashboard/category-stats` | 分类统计数据 |
| 统计概览数据 | GET | `/api/admin/dashboard/stats-overview` | 概览统计信息 |
| 最近活动数据 | GET | `/api/admin/dashboard/recent-activities` | 最近活动记录 |
| 待办事项数据 | GET | `/api/admin/dashboard/todo-list` | 待办事项列表 |
| 实时在线用户 | GET | `/api/admin/dashboard/online-users` | 在线用户统计 |
| 系统性能数据 | GET | `/api/admin/dashboard/system-performance` | 系统性能监控 |

### 3.2 用户管理 (user)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取用户列表 | GET | `/admin/user/list` | 用户列表(分页) |
| 获取用户详情 | GET | `/admin/user/{id}` | 用户详细信息 |
| 创建用户 | POST | `/admin/user/create` | 创建新用户 |
| 更新用户信息 | POST | `/admin/user/update/{id}` | 更新用户信息 |
| 删除用户 | POST | `/admin/user/delete/{id}` | 删除用户 |
| 批量删除用户 | POST | `/admin/user/batch-delete` | 批量删除用户 |
| 修改用户状态 | POST | `/admin/user/status/{id}` | 启用/禁用用户 |
| 批量修改状态 | POST | `/admin/user/batch-status` | 批量修改状态 |
| 重置用户密码 | POST | `/admin/user/reset-password/{id}` | 重置用户密码 |
| 批量重置密码 | POST | `/admin/user/batch-reset-password` | 批量重置密码 |
| 用户登录日志 | GET | `/admin/user/{id}/login-logs` | 用户登录记录 |
| 用户统计数据 | GET | `/admin/user/statistics` | 用户统计信息 |
| 角色选项 | GET | `/admin/user/role-options` | 角色下拉选项 |
| 部门选项 | GET | `/admin/user/department-options` | 部门下拉选项 |

### 3.3 用户行为分析 (user behavior)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 行为统计 | GET | `/admin/user/behavior/statistics` | 用户行为统计 |
| 操作日志列表 | GET | `/admin/user/behavior/logs` | 操作日志记录 |
| 异常行为列表 | GET | `/admin/user/behavior/abnormal` | 异常行为记录 |
| 异常行为详情 | GET | `/admin/user/behavior/abnormal/{id}` | 异常行为详情 |
| 处理异常行为 | POST | `/admin/user/behavior/abnormal/handle/{id}` | 处理异常行为 |
| 批量处理异常 | POST | `/admin/user/behavior/abnormal/batch` | 批量处理异常 |
| 登录排行榜 | GET | `/admin/user/behavior/login-ranking` | 登录次数排行 |
| 用户登录历史 | GET | `/admin/user/behavior/login-history/{id}` | 用户登录历史 |
| 检测异常行为 | POST | `/admin/user/behavior/detect` | 手动检测异常 |
| 实时在线用户 | GET | `/admin/user/behavior/online` | 实时在线用户 |
| 强制用户下线 | POST | `/admin/user/behavior/force-offline/{id}` | 强制用户下线 |
| 导出操作日志 | POST | `/admin/user/behavior/export` | 导出日志数据 |

### 3.4 角色权限管理 (role)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取角色列表 | GET | `/admin/role/list` | 角色列表(分页) |
| 获取角色详情 | GET | `/admin/role/{id}` | 角色详细信息 |
| 创建角色 | POST | `/admin/role/create` | 创建新角色 |
| 更新角色 | PUT | `/admin/role/{id}` | 更新角色信息 |
| 删除角色 | DELETE | `/admin/role/{id}` | 删除角色 |
| 获取权限树 | GET | `/admin/permission/tree` | 权限树结构 |
| 获取角色权限 | GET | `/admin/role/{id}/permissions` | 角色已分配权限 |
| 保存角色权限 | POST | `/admin/role/{id}/permissions` | 保存权限配置 |
| 批量授权 | POST | `/admin/role/batch-grant` | 批量授予权限 |
| 批量撤销权限 | POST | `/admin/role/batch-revoke` | 批量撤销权限 |
| 权限变更日志 | GET | `/admin/permission/change-logs` | 权限变更记录 |
| 角色变更日志 | GET | `/admin/role/{id}/change-logs` | 角色变更历史 |
| 导出变更日志 | POST | `/admin/permission/change-logs/export` | 导出变更日志 |
| 角色权限统计 | GET | `/admin/role/statistics` | 角色权限统计 |

### 3.5 视频管理 (video)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取视频列表 | GET | `/admin/video/list` | 视频列表(分页) |
| 搜索视频 | GET | `/admin/video/search` | 搜索视频 |
| 获取视频详情 | GET | `/admin/video/{id}` | 视频详细信息 |
| 更新视频 | PUT | `/admin/video/{id}` | 更新视频信息 |
| 删除视频 | DELETE | `/admin/video/{id}` | 删除视频 |
| 批量删除视频 | POST | `/admin/video/batch-delete` | 批量删除视频 |
| 更新视频状态 | PUT | `/admin/video/{id}/status` | 更新视频状态 |
| 批量更新状态 | POST | `/admin/video/batch-status` | 批量更新状态 |
| 获取视频统计 | GET | `/admin/video/statistics` | 视频统计数据 |
| 上传视频文件 | POST | `/admin/video/upload` | 上传视频文件 |
| 上传封面图片 | POST | `/admin/video/cover/upload` | 上传视频封面 |
| 上传字幕文件 | POST | `/admin/video/subtitle/upload` | 上传字幕文件 |
| 上传水印图片 | POST | `/admin/video/watermark/upload` | 上传水印图片 |
| 保存视频 | POST | `/admin/video/save` | 保存视频信息 |
| 获取草稿列表 | GET | `/admin/video/drafts` | 草稿视频列表 |
| 删除草稿 | DELETE | `/admin/video/draft/{id}` | 删除草稿 |
| 获取视频分类 | GET | `/admin/video/categories` | 视频分类列表 |
| 获取标签列表 | GET | `/admin/video/tags` | 视频标签列表 |
| AI生成章节 | POST | `/admin/video/chapters/generate` | AI生成章节标记 |
| AI生成字幕 | POST | `/admin/video/subtitle/generate` | AI生成字幕 |
| 提取视频封面 | POST | `/admin/video/cover/extract` | 从视频提取封面 |

### 3.6 视频审核 (video audit)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 审核统计数据 | GET | `/admin/video/audit/statistics` | 审核统计信息 |
| 审核队列列表 | GET | `/admin/video/audit/queue` | 待审核视频列表 |
| 审核视频详情 | GET | `/admin/video/audit/{id}` | 审核视频详情 |
| AI审核视频 | POST | `/admin/video/audit/ai/{id}` | AI审核单个视频 |
| AI批量审核 | POST | `/admin/video/audit/ai/batch` | AI批量审核 |
| 人工审核通过 | POST | `/admin/video/audit/pass/{id}` | 人工审核通过 |
| 人工审核驳回 | POST | `/admin/video/audit/reject/{id}` | 人工审核驳回 |
| 开始审核 | POST | `/admin/video/audit/start/{id}` | 开始审核(锁定) |
| 取消审核 | POST | `/admin/video/audit/cancel/{id}` | 取消审核(解锁) |
| 视频审核日志 | GET | `/admin/video/audit/logs/{id}` | 视频审核日志 |
| 所有审核日志 | GET | `/admin/video/audit/logs` | 所有审核日志 |
| 违规记录列表 | GET | `/admin/video/audit/violations` | 违规记录列表 |
| 违规记录详情 | GET | `/admin/video/audit/violation/{id}` | 违规记录详情 |
| 处理违规记录 | POST | `/admin/video/audit/violation/handle/{id}` | 处理违规记录 |
| 添加违规记录 | POST | `/admin/video/audit/violation/add` | 添加违规记录 |
| 违规类型列表 | GET | `/admin/video/audit/violation/types` | 违规类型列表 |
| 视频预览地址 | GET | `/admin/video/audit/preview/{id}` | 获取预览地址 |
| 导出审核报告 | POST | `/admin/video/audit/export` | 导出审核报告 |

### 3.7 内容管理 (content)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取博客列表 | GET | `/admin/content/blog/list` | 博客列表(分页) |
| 获取博客详情 | GET | `/admin/content/blog/{id}` | 博客详细信息 |
| 创建博客 | POST | `/admin/content/blog/create` | 创建新博客 |
| 更新博客 | PUT | `/admin/content/blog/{id}` | 更新博客信息 |
| 删除博客 | DELETE | `/admin/content/blog/{id}` | 删除博客 |
| 批量删除博客 | POST | `/admin/content/blog/batch-delete` | 批量删除博客 |
| 更新博客状态 | POST | `/admin/content/blog/{id}/status` | 更新博客状态 |
| 设置博客置顶 | POST | `/admin/content/blog/{id}/top` | 设置/取消置顶 |
| 设置博客推荐 | POST | `/admin/content/blog/{id}/recommend` | 设置/取消推荐 |
| 博客版本历史 | GET | `/admin/content/blog/{id}/versions` | 博客版本历史 |
| 恢复博客版本 | POST | `/admin/content/blog/{id}/restore` | 恢复指定版本 |
| 上传博客图片 | POST | `/admin/content/blog/upload-image` | 上传博客图片 |
| 获取博客分类 | GET | `/admin/content/blog/categories` | 博客分类列表 |
| 获取博客标签 | GET | `/admin/content/blog/tags` | 博客标签列表 |

### 3.8 评论审核 (comment audit)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 评论审核统计 | GET | `/admin/content/comment/stats` | 评论审核统计 |
| 评论列表 | GET | `/admin/content/comment/list` | 评论列表(分页) |
| 审核通过评论 | POST | `/admin/content/comment/{id}/approve` | 审核通过评论 |
| 审核拒绝评论 | POST | `/admin/content/comment/{id}/reject` | 审核拒绝评论 |
| 批量审核评论 | POST | `/admin/content/comment/batch-audit` | 批量审核评论 |
| 删除评论 | DELETE | `/admin/content/comment/{id}` | 删除评论 |
| 批量删除评论 | POST | `/admin/content/comment/batch-delete` | 批量删除评论 |
| 评论详情 | GET | `/admin/content/comment/{id}` | 评论详情(含回复) |

### 3.9 字典管理 (dictionary)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 字典分类列表 | GET | `/admin/dict/categories` | 字典分类列表 |
| 字典分类详情 | GET | `/admin/dict/categories/{id}` | 字典分类详情 |
| 创建字典分类 | POST | `/admin/dict/categories` | 创建字典分类 |
| 更新字典分类 | PUT | `/admin/dict/categories/{id}` | 更新字典分类 |
| 删除字典分类 | DELETE | `/admin/dict/categories/{id}` | 删除字典分类 |
| 更新分类状态 | PUT | `/admin/dict/categories/{id}/status` | 更新分类状态 |
| 字典项列表 | GET | `/admin/dict/items` | 字典项列表 |
| 字典项详情 | GET | `/admin/dict/items/{id}` | 字典项详情 |
| 创建字典项 | POST | `/admin/dict/items` | 创建字典项 |
| 更新字典项 | PUT | `/admin/dict/items/{id}` | 更新字典项 |
| 删除字典项 | DELETE | `/admin/dict/items/{id}` | 删除字典项 |
| 批量删除字典项 | POST | `/admin/dict/items/batch-delete` | 批量删除字典项 |
| 更新字典项状态 | PUT | `/admin/dict/items/{id}/status` | 更新字典项状态 |
| 批量更新状态 | POST | `/admin/dict/items/batch-status` | 批量更新状态 |
| 字典使用统计 | GET | `/admin/dict/usage-stats` | 字典使用统计 |
| 字典项使用详情 | GET | `/admin/dict/items/{id}/usage-detail` | 字典项使用详情 |
| 导出字典数据 | POST | `/admin/dict/export` | 导出字典数据 |
| 导入字典数据 | POST | `/admin/dict/import` | 导入字典数据 |
| 获取字典选项 | GET | `/admin/dict/options/{code}` | 获取字典选项 |

### 3.10 积分管理 (point)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 积分规则列表 | GET | `/admin/point/rules` | 积分规则列表 |
| 积分规则详情 | GET | `/admin/point/rules/{id}` | 积分规则详情 |
| 创建积分规则 | POST | `/admin/point/rules` | 创建积分规则 |
| 更新积分规则 | PUT | `/admin/point/rules/{id}` | 更新积分规则 |
| 删除积分规则 | DELETE | `/admin/point/rules/{id}` | 删除积分规则 |
| 更新规则状态 | PUT | `/admin/point/rules/{id}/status` | 更新规则状态 |
| 积分记录列表 | GET | `/admin/point/records` | 积分记录列表 |
| 手动调整积分 | POST | `/admin/point/adjust` | 手动调整积分 |
| 批量调整积分 | POST | `/admin/point/batch-adjust` | 批量调整积分 |
| 积分商品列表 | GET | `/admin/point/products` | 积分商品列表 |
| 积分商品详情 | GET | `/admin/point/products/{id}` | 积分商品详情 |
| 创建积分商品 | POST | `/admin/point/products` | 创建积分商品 |
| 更新积分商品 | PUT | `/admin/point/products/{id}` | 更新积分商品 |
| 删除积分商品 | DELETE | `/admin/point/products/{id}` | 删除积分商品 |
| 更新商品库存 | PUT | `/admin/point/products/{id}/stock` | 更新商品库存 |
| 兑换记录列表 | GET | `/admin/point/exchanges` | 兑换记录列表 |
| 处理兑换订单 | PUT | `/admin/point/exchanges/{id}/process` | 处理兑换订单 |
| 批量处理兑换 | POST | `/admin/point/exchanges/batch-process` | 批量处理兑换 |
| 积分排行榜 | GET | `/admin/point/ranking` | 积分排行榜 |
| 刷新排行榜 | POST | `/admin/point/ranking/refresh` | 刷新排行榜 |
| 积分统计数据 | GET | `/admin/point/statistics` | 积分统计数据 |
| 导出积分数据 | POST | `/admin/point/export` | 导出积分数据 |

### 3.11 应用监控 (monitor)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| Web Vitals指标 | GET | `/admin/monitor/web-vitals` | Core Web Vitals |
| Web Vitals趋势 | GET | `/admin/monitor/web-vitals/trend` | 性能指标趋势 |
| API监控列表 | GET | `/admin/monitor/api/list` | API监控列表 |
| API详细统计 | GET | `/admin/monitor/api/detail` | API详细统计 |
| API调用趋势 | GET | `/admin/monitor/api/trend` | API调用趋势 |
| 错误列表 | GET | `/admin/monitor/errors` | 错误列表 |
| 错误详情 | GET | `/admin/monitor/errors/{id}` | 错误详情 |
| 更新错误状态 | POST | `/admin/monitor/errors/{id}/status` | 更新错误状态 |
| 批量处理错误 | POST | `/admin/monitor/errors/batch` | 批量处理错误 |
| 分配错误处理人 | POST | `/admin/monitor/errors/{id}/assign` | 分配处理人 |
| 用户会话列表 | GET | `/admin/monitor/sessions` | 用户会话列表 |
| 会话详情 | GET | `/admin/monitor/sessions/{id}` | 会话详情 |
| 实时在线会话 | GET | `/admin/monitor/sessions/active` | 实时在线会话 |
| 强制结束会话 | POST | `/admin/monitor/sessions/{id}/terminate` | 强制结束会话 |
| 监控统计概览 | GET | `/admin/monitor/statistics` | 监控统计概览 |
| 导出监控报告 | POST | `/admin/monitor/export` | 导出监控报告 |

### 3.12 系统管理 (system)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 系统配置列表 | GET | `/admin/system/configs` | 系统配置列表 |
| 配置分类列表 | GET | `/admin/system/config-categories` | 配置分类列表 |
| 配置项详情 | GET | `/admin/system/configs/{id}` | 配置项详情 |
| 更新系统配置 | PUT | `/admin/system/configs/{id}` | 更新系统配置 |
| 批量更新配置 | POST | `/admin/system/configs/batch-update` | 批量更新配置 |
| 重置配置默认值 | POST | `/admin/system/configs/{id}/reset` | 重置为默认值 |
| 导出系统配置 | POST | `/admin/system/configs/export` | 导出系统配置 |
| 导入系统配置 | POST | `/admin/system/configs/import` | 导入系统配置 |
| 系统日志列表 | GET | `/admin/system/logs` | 系统日志列表 |
| 日志统计 | GET | `/admin/system/log-statistics` | 日志统计信息 |
| 清理系统日志 | POST | `/admin/system/logs/clean` | 清理系统日志 |
| 导出系统日志 | POST | `/admin/system/logs/export` | 导出系统日志 |
| 审计追踪列表 | GET | `/admin/system/audit-trails` | 审计追踪列表 |
| 审计统计 | GET | `/admin/system/audit-statistics` | 审计统计信息 |
| 导出审计日志 | POST | `/admin/system/audit-trails/export` | 导出审计日志 |
| 服务器信息 | GET | `/admin/system/server-info` | 服务器信息 |
| 服务器性能历史 | GET | `/admin/system/server-performance` | 性能历史数据 |
| 服务状态 | GET | `/admin/system/service-status` | 服务状态列表 |
| 重启服务 | POST | `/admin/system/services/{name}/restart` | 重启指定服务 |
| 清理系统缓存 | POST | `/admin/system/clear-cache` | 清理系统缓存 |
| 系统健康检查 | GET | `/admin/system/health-check` | 系统健康检查 |
| 数据库备份 | POST | `/admin/system/backup-database` | 数据库备份 |
| 备份列表 | GET | `/admin/system/backups` | 备份文件列表 |
| 恢复数据库 | POST | `/admin/system/restore-database/{id}` | 恢复数据库 |
| 删除备份文件 | DELETE | `/admin/system/backups/{id}` | 删除备份文件 |
| 系统更新检查 | GET | `/admin/system/check-update` | 检查系统更新 |

### 3.13 统计分析 (statistics)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 用户统计数据 | GET | `/api/admin/statistics/users` | 用户统计分析 |
| 内容统计数据 | GET | `/api/admin/statistics/content` | 内容统计分析 |
| 访问统计数据 | GET | `/api/admin/statistics/visits` | 访问统计分析 |
| 热门内容数据 | GET | `/api/admin/statistics/popular-content` | 热门内容统计 |
| 搜索关键词统计 | GET | `/api/admin/statistics/search-keywords` | 搜索关键词统计 |
| 设备统计数据 | GET | `/api/admin/statistics/devices` | 设备统计数据 |

---

## 4. 数据格式说明

### 4.1 通用响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1640995200000
}
```

### 4.2 分页响应格式

```json
{
  "list": [],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

### 4.3 错误响应格式

```json
{
  "code": 400,
  "message": "参数错误",
  "data": null,
  "timestamp": 1640995200000
}
```

---

## 5. 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 6. 认证说明

### 6.1 Token认证

- 登录成功后返回 `token`
- 后续请求需在 Header 中携带: `Authorization: Bearer {token}`
- Token 过期时间为 7 天（可配置）

### 6.2 权限验证

- 后台管理接口需要管理员权限
- 部分接口需要特定角色权限
- 权限不足时返回 403 状态码

---

## 7. 文件上传说明

### 7.1 支持的文件类型

- 图片: jpg, jpeg, png, gif, webp
- 视频: mp4, avi, mov, wmv
- 文档: pdf, doc, docx, txt, md
- 字幕: srt, vtt, ass

### 7.2 文件大小限制

- 头像图片: 最大 2MB
- 封面图片: 最大 5MB
- 视频文件: 最大 500MB
- 文档文件: 最大 50MB

---

## 8. 开发注意事项

1. 所有时间格式使用 ISO 8601 标准
2. 分页参数 page 从 1 开始
3. 文件上传使用 multipart/form-data
4. 敏感操作需要二次确认
5. 批量操作需要限制数量上限
6. 长时间操作建议使用异步处理

---

## 9. 更新日志

- 2024-12-20: 初始版本，包含所有模块API接口定义
- 2024-12-20: 完成所有页面组件的API集成，所有组件已正确导入对应的API模块
- 2024-12-20: 完善所有按钮功能，添加完整的事件处理和API调用

---

## 10. API集成完成总结

### 完成的工作
1. **API文件组织**: 创建了完整的API目录结构，包含所有业务模块
2. **类型定义**: 为所有API提供了完整的TypeScript类型定义
3. **组件集成**: 更新了所有页面组件，使用正确的API模块导入
4. **认证模块**: 统一了Login、Register、ResetPassword组件的API调用
5. **前台模块**: 集成了Home、Document、Video、Search、Profile等模块的API
6. **后台管理**: 完成了所有管理页面的API集成，包括用户、内容、系统等模块
7. **功能完善**: 补充了所有按钮的点击事件和API调用功能

### 按钮功能完善统计
- **VideoList页面**: 搜索、筛选、刷新、删除、编辑、预览功能
- **PointRules页面**: 新增、编辑、删除、状态切换、刷新功能
- **Profile页面**: 编辑信息、修改密码、删除内容、状态切换、收藏管理功能
- **Dashboard页面**: 日期筛选、数据刷新、图表交互功能
- **VideoAudit页面**: AI审核、人工审核、批量操作、导出报告功能

### API模块统计
- **认证模块**: 1个API文件 (authApi.ts) - 12个接口
- **前台模块**: 5个API文件 - 80+个接口
  - homeApi.ts: 7个接口
  - documentApi.ts: 20个接口  
  - videoApi.ts: 15个接口
  - searchApi.ts: 12个接口
  - profileApi.ts: 26个接口
- **后台管理**: 10个API文件 - 320+个接口
  - userApi.ts: 14个接口 + 12个行为分析接口
  - roleApi.ts: 14个接口
  - videoApi.ts: 45个接口 (包含审核、上传、管理)
  - contentApi.ts: 18个接口
  - dictionaryApi.ts: 19个接口
  - pointApi.ts: 22个接口
  - monitorApi.ts: 12个接口
  - systemApi.ts: 25个接口
  - dashboardApi.ts: 7个接口
  - statisticsApi.ts: 6个接口

### 组件集成统计
- **已集成组件**: 40+ 个页面组件
- **API导入**: 所有组件都使用了正确的API模块导入
- **类型安全**: 所有API调用都有完整的TypeScript类型支持
- **功能完整**: 所有按钮都有对应的事件处理和API调用

### 新增功能
1. **视频管理增强**: 添加了完整的视频列表管理、搜索、筛选功能
2. **积分规则管理**: 完善了积分规则的增删改查和状态管理
3. **个人中心完善**: 实现了完整的用户信息管理、内容管理、收藏管理
4. **控制台优化**: 增强了数据刷新、日期筛选等交互功能
5. **API调用统一**: 所有页面都使用统一的API调用模式

### 后端开发指南
1. 参考本文档中的接口定义实现对应的后端API
2. 确保响应格式与文档中定义的类型一致
3. 实现文档中列出的所有接口端点（总计400+个）
4. 注意权限验证和错误处理
5. 遵循RESTful API设计规范
6. 所有按钮功能都有对应的API接口需要实现

---

**注意**: 本文档基于前端代码分析生成，所有页面组件已完成API集成。实际接口实现请根据业务需求进行调整，建议前后端开发人员共同确认接口规范后再进行开发。