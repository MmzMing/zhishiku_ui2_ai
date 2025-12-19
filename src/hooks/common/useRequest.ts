/**
 * 通用请求Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';

interface UseRequestOptions<T> {
  manual?: boolean; // 是否手动触发
  defaultParams?: any[]; // 默认参数
  onSuccess?: (data: T, params: any[]) => void;
  onError?: (error: Error, params: any[]) => void;
  refreshDeps?: any[]; // 依赖项变化时重新请求
}

interface UseRequestResult<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
  run: (...params: any[]) => Promise<T>;
  refresh: () => Promise<T>;
  cancel: () => void;
}

export function useRequest<T = any>(
  service: (...args: any[]) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestResult<T> {
  const {
    manual = false,
    defaultParams = [],
    onSuccess,
    onError,
    refreshDeps = [],
  } = options;

  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState<boolean>(!manual);
  const [error, setError] = useState<Error | undefined>();
  const [params, setParams] = useState<any[]>(defaultParams);

  let cancelFlag = false;

  const run = useCallback(async (...args: any[]): Promise<T> => {
    setLoading(true);
    setError(undefined);
    setParams(args.length > 0 ? args : defaultParams);

    try {
      const result = await service(...(args.length > 0 ? args : defaultParams));
      
      if (!cancelFlag) {
        setData(result);
        setLoading(false);
        onSuccess?.(result, args.length > 0 ? args : defaultParams);
      }
      
      return result;
    } catch (err) {
      if (!cancelFlag) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setLoading(false);
        onError?.(error, args.length > 0 ? args : defaultParams);
        
        // 默认错误提示
        if (!onError) {
          message.error(error.message || '请求失败');
        }
      }
      throw err;
    }
  }, [service, defaultParams, onSuccess, onError]);

  const refresh = useCallback(() => {
    return run(...params);
  }, [run, params]);

  const cancel = useCallback(() => {
    cancelFlag = true;
    setLoading(false);
  }, []);

  // 自动执行
  useEffect(() => {
    if (!manual) {
      run();
    }
    
    return () => {
      cancelFlag = true;
    };
  }, [manual, run]);

  // 依赖项变化时重新请求
  useEffect(() => {
    if (!manual && refreshDeps.length > 0) {
      run();
    }
  }, refreshDeps);

  return {
    data,
    loading,
    error,
    run,
    refresh,
    cancel,
  };
}

export default useRequest;