/**
 * 通用按钮组件
 */

import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { usePermissions } from '../../../store/hooks';
import './style.less';

// 扩展按钮属性
export interface ButtonProps extends AntButtonProps {
  // 权限控制
  permission?: string | string[];
  // 是否显示加载状态
  loading?: boolean;
  // 确认操作
  confirm?: {
    title?: string;
    content?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  };
  // 防抖延迟（毫秒）
  debounceDelay?: number;
  // 节流延迟（毫秒）
  throttleDelay?: number;
}

const Button: React.FC<ButtonProps> = ({
  permission,
  confirm,
  debounceDelay,
  throttleDelay,
  onClick,
  children,
  className,
  ...props
}) => {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout>();
  const lastClickTimeRef = React.useRef<number>(0);

  // 权限检查
  if (permission && !hasPermission(permission)) {
    return null;
  }

  // 处理点击事件
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // 防抖处理
      if (debounceDelay) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          onClick?.(e);
        }, debounceDelay);
        return;
      }

      // 节流处理
      if (throttleDelay) {
        const now = Date.now();
        if (now - lastClickTimeRef.current < throttleDelay) {
          return;
        }
        lastClickTimeRef.current = now;
      }

      // 确认操作
      if (confirm) {
        // 这里可以集成确认对话框组件
        const isConfirmed = window.confirm(confirm.content || '确定要执行此操作吗？');
        if (isConfirmed) {
          confirm.onConfirm?.();
          onClick?.(e);
        } else {
          confirm.onCancel?.();
        }
        return;
      }

      onClick?.(e);
    },
    [onClick, debounceDelay, throttleDelay, confirm]
  );

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <AntButton
      {...props}
      className={`common-button ${className || ''}`}
      loading={loading || props.loading}
      onClick={handleClick}
    >
      {children}
    </AntButton>
  );
};

// 预设按钮类型
export const PrimaryButton: React.FC<ButtonProps> = (props) => (
  <Button type="primary" {...props} />
);

export const DangerButton: React.FC<ButtonProps> = (props) => (
  <Button danger {...props} />
);

export const GhostButton: React.FC<ButtonProps> = (props) => (
  <Button ghost {...props} />
);

export const LinkButton: React.FC<ButtonProps> = (props) => (
  <Button type="link" {...props} />
);

export const TextButton: React.FC<ButtonProps> = (props) => (
  <Button type="text" {...props} />
);

export default Button;