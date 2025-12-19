/**
 * 前台业务类型定义
 */

import { ContentType, AuditStatus, PublishStatus } from './common';

// 视频信息
export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  cover: string;
  url: string;
  duration: number;
  size: number;
  format: string;
  resolution: string;
  quality: 'sd' | 'hd' | 'fhd' | '4k';
  categoryId: string;
  categoryName: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  viewCount: number;
  likeCount: number;
  collectCount: number;
  commentCount: number;
  shareCount: number;
  downloadCount: number;
  points: number; // 观看所需积分
  isFree: boolean;
  status: PublishStatus;
  auditStatus: AuditStatus;
  isTop: boolean;
  isRecommend: boolean;
  publishTime: string;
  createTime: string;
  updateTime: string;
}

// 文档信息
export interface DocumentInfo {
  id: string;
  title: string;
  description: string;
  content: string;
  cover: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  viewCount: number;
  likeCount: number;
  collectCount: number;
  commentCount: number;
  shareCount: number;
  downloadCount: number;
  points: number; // 下载所需积分
  isFree: boolean;
  status: PublishStatus;
  auditStatus: AuditStatus;
  isTop: boolean;
  isRecommend: boolean;
  publishTime: string;
  createTime: string;
  updateTime: string;
}

// 分类信息
export interface CategoryInfo {
  id: string;
  name: string;
  code: string;
  icon: string;
  cover: string;
  description: string;
  parentId?: string;
  level: number;
  sort: number;
  contentCount: number;
  status: 'active' | 'inactive';
  children?: CategoryInfo[];
}

// 标签信息
export interface TagInfo {
  id: string;
  name: string;
  color: string;
  useCount: number;
  status: 'active' | 'inactive';
  createTime: string;
}

// 评论信息
export interface CommentInfo {
  id: string;
  contentId: string;
  contentType: ContentType;
  parentId?: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
  status: 'normal' | 'hidden' | 'deleted';
  createTime: string;
  replies?: CommentInfo[];
}

// 搜索结果
export interface SearchResult {
  videos: VideoInfo[];
  documents: DocumentInfo[];
  total: number;
  videoTotal: number;
  documentTotal: number;
}

// 搜索建议
export interface SearchSuggestion {
  keyword: string;
  type: 'history' | 'hot' | 'suggest';
  count?: number;
}

// 轮播图信息
export interface BannerInfo {
  id: string;
  title: string;
  image: string;
  link: string;
  linkType: 'internal' | 'external';
  sort: number;
  status: 'active' | 'inactive';
  startTime: string;
  endTime: string;
}

// 推荐内容
export interface RecommendContent {
  id: string;
  type: ContentType;
  title: string;
  cover: string;
  description: string;
  authorName: string;
  viewCount: number;
  likeCount: number;
  publishTime: string;
  reason: string; // 推荐理由
}

// 热门内容
export interface HotContent {
  id: string;
  type: ContentType;
  title: string;
  cover: string;
  viewCount: number;
  likeCount: number;
  rank: number;
  trend: 'up' | 'down' | 'same';
}

// 收藏夹信息
export interface CollectionInfo {
  id: string;
  name: string;
  description: string;
  cover: string;
  isPublic: boolean;
  contentCount: number;
  createTime: string;
  updateTime: string;
}

// 收藏内容
export interface CollectedContent {
  id: string;
  collectionId: string;
  contentId: string;
  contentType: ContentType;
  title: string;
  cover: string;
  authorName: string;
  collectTime: string;
}

// 浏览历史
export interface BrowseHistory {
  id: string;
  contentId: string;
  contentType: ContentType;
  title: string;
  cover: string;
  authorName: string;
  progress?: number; // 观看进度（视频）
  browseTime: string;
}

// 用户互动记录
export interface UserInteraction {
  id: string;
  userId: string;
  contentId: string;
  contentType: ContentType;
  type: 'view' | 'like' | 'collect' | 'share' | 'comment' | 'download';
  createTime: string;
}

// 积分记录
export interface PointRecord {
  id: string;
  userId: string;
  type: 'earn' | 'spend';
  amount: number;
  balance: number;
  reason: string;
  relatedId?: string;
  relatedType?: string;
  createTime: string;
}

// 积分规则
export interface PointRule {
  id: string;
  name: string;
  type: 'earn' | 'spend';
  action: string;
  amount: number;
  dailyLimit?: number;
  description: string;
  status: 'active' | 'inactive';
}

// 视频播放器配置
export interface VideoPlayerConfig {
  autoplay: boolean;
  volume: number;
  playbackRate: number;
  quality: string;
  subtitle: boolean;
  pip: boolean; // 画中画
}

// 文档阅读器配置
export interface DocumentReaderConfig {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  theme: 'light' | 'dark';
  showToc: boolean; // 显示目录
}

// 搜索筛选条件
export interface SearchFilters {
  contentType?: ContentType;
  categoryId?: string;
  tags?: string[];
  dateRange?: [string, string];
  sortBy?: 'relevance' | 'time' | 'view' | 'like';
  sortOrder?: 'asc' | 'desc';
  isFree?: boolean;
  quality?: string;
  duration?: [number, number];
}

// 首页数据
export interface HomePageData {
  banners: BannerInfo[];
  categories: CategoryInfo[];
  hotTags: TagInfo[];
  recommendContent: RecommendContent[];
  latestContent: (VideoInfo | DocumentInfo)[];
  hotContent: HotContent[];
}

// 内容详情页数据
export interface ContentDetailData {
  content: VideoInfo | DocumentInfo;
  author: {
    id: string;
    name: string;
    avatar: string;
    signature: string;
    followCount: number;
    isFollowed: boolean;
  };
  relatedContent: (VideoInfo | DocumentInfo)[];
  comments: CommentInfo[];
  isLiked: boolean;
  isCollected: boolean;
}