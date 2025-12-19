/**
 * 格式化工具函数
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 格式化数字
 */
export const formatNumber = (num: number): string => {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(1)}亿`;
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * 格式化时间
 */
export const formatTime = (time: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(time).format(format);
};

/**
 * 格式化相对时间
 */
export const formatRelativeTime = (time: string | number | Date): string => {
  return dayjs(time).fromNow();
};

/**
 * 格式化日期范围
 */
export const formatDateRange = (start: string | Date, end: string | Date): string => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  
  if (startDate.isSame(endDate, 'day')) {
    return startDate.format('YYYY-MM-DD');
  }
  
  return `${startDate.format('YYYY-MM-DD')} ~ ${endDate.format('YYYY-MM-DD')}`;
};

/**
 * 格式化时长（秒转换为时分秒）
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * 格式化手机号（脱敏）
 */
export const formatPhone = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
};

/**
 * 格式化邮箱（脱敏）
 */
export const formatEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  const maskedUsername = `${username.slice(0, 2)}****${username.slice(-1)}`;
  return `${maskedUsername}@${domain}`;
};

/**
 * 格式化价格
 */
export const formatPrice = (price: number, currency = '¥'): string => {
  return `${currency}${price.toFixed(2)}`;
};

/**
 * 格式化百分比
 */
export const formatPercent = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * 截断文本
 */
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + suffix;
};

/**
 * 高亮关键词
 */
export const highlightKeyword = (text: string, keyword: string): string => {
  if (!keyword) return text;
  
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<mark style="background: #fff2b8; padding: 0 2px;">$1</mark>');
};

/**
 * 格式化标签
 */
export const formatTags = (tags: string[]): string => {
  return tags.join(', ');
};

/**
 * 格式化评分
 */
export const formatRating = (rating: number, maxRating = 5): string => {
  return `${rating.toFixed(1)}/${maxRating}`;
};