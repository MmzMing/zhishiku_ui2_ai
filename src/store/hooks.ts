/**
 * Redux Hooks
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// 类型化的hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 用户相关hooks
export const useUser = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  
  return {
    ...user,
    dispatch,
  };
};

// 主题相关hooks
export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);
  
  return {
    ...theme,
    dispatch,
  };
};

// 权限相关hooks
export const usePermissions = () => {
  const permissions = useAppSelector((state) => state.user.permissions);
  
  const hasPermission = (permission: string | string[]): boolean => {
    if (Array.isArray(permission)) {
      return permission.some(p => permissions.includes(p));
    }
    return permissions.includes(permission);
  };
  
  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission));
  };
  
  return {
    permissions,
    hasPermission,
    hasAllPermissions,
  };
};