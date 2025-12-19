/**
 * 通用输入框组件
 */

import React from 'react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './style.less';

const { TextArea, Password, Search } = AntInput;

// 扩展输入框属性
export interface InputProps extends AntInputProps {
  // 防抖延迟（毫秒）
  debounceDelay?: number;
  // 格式化输入值
  formatter?: (value: string) => string;
  // 解析输入值
  parser?: (value: string) => string;
  // 验证规则
  validator?: (value: string) => boolean | string;
  // 是否显示字符计数
  showCount?: boolean;
  // 是否自动去除首尾空格
  trim?: boolean;
}

const Input: React.FC<InputProps> = ({
  debounceDelay,
  formatter,
  parser,
  validator,
  showCount,
  trim = true,
  onChange,
  onBlur,
  className,
  ...props
}) => {
  const [value, setValue] = React.useState<string>(props.value || props.defaultValue || '');
  const [error, setError] = React.useState<string>('');
  const timerRef = React.useRef<NodeJS.Timeout>();

  // 处理值变化
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      // 格式化处理
      if (formatter) {
        newValue = formatter(newValue);
      }

      // 解析处理
      if (parser) {
        newValue = parser(newValue);
      }

      setValue(newValue);

      // 验证处理
      if (validator) {
        const validationResult = validator(newValue);
        if (typeof validationResult === 'string') {
          setError(validationResult);
        } else if (!validationResult) {
          setError('输入格式不正确');
        } else {
          setError('');
        }
      }

      // 防抖处理
      if (debounceDelay) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          onChange?.(e);
        }, debounceDelay);
      } else {
        onChange?.(e);
      }
    },
    [onChange, debounceDelay, formatter, parser, validator]
  );

  // 处理失焦事件
  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      // 自动去除首尾空格
      if (trim) {
        newValue = newValue.trim();
        if (newValue !== e.target.value) {
          setValue(newValue);
          // 创建新的事件对象
          const newEvent = {
            ...e,
            target: { ...e.target, value: newValue }
          };
          onChange?.(newEvent as any);
        }
      }

      onBlur?.(e);
    },
    [onBlur, onChange, trim]
  );

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 同步外部value
  React.useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <div className={`common-input-wrapper ${error ? 'has-error' : ''}`}>
      <AntInput
        {...props}
        value={value}
        className={`common-input ${className || ''}`}
        onChange={handleChange}
        onBlur={handleBlur}
        status={error ? 'error' : undefined}
      />
      {showCount && props.maxLength && (
        <div className="input-count">
          {value.length}/{props.maxLength}
        </div>
      )}
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

// TextArea组件
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  debounceDelay?: number;
  showCount?: boolean;
  trim?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
}

export const InputTextArea: React.FC<TextAreaProps> = ({
  debounceDelay,
  showCount,
  trim = true,
  onChange,
  onBlur,
  className,
  ...props
}) => {
  const [value, setValue] = React.useState<string>(props.value as string || props.defaultValue as string || '');
  const timerRef = React.useRef<NodeJS.Timeout>();

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (debounceDelay) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          onChange?.(e);
        }, debounceDelay);
      } else {
        onChange?.(e);
      }
    },
    [onChange, debounceDelay]
  );

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (trim) {
        const newValue = e.target.value.trim();
        if (newValue !== e.target.value) {
          setValue(newValue);
          const newEvent = {
            ...e,
            target: { ...e.target, value: newValue }
          };
          onChange?.(newEvent as any);
        }
      }
      onBlur?.(e);
    },
    [onBlur, onChange, trim]
  );

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value as string);
    }
  }, [props.value]);

  return (
    <div className="common-textarea-wrapper">
      <TextArea
        {...props}
        value={value}
        className={`common-textarea ${className || ''}`}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {showCount && props.maxLength && (
        <div className="textarea-count">
          {value.length}/{props.maxLength}
        </div>
      )}
    </div>
  );
};

// Password组件
export const InputPassword: React.FC<InputProps> = (props) => (
  <Password
    {...props}
    className={`common-password ${props.className || ''}`}
    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
  />
);

// Search组件
export interface SearchProps extends InputProps {
  onSearch?: (value: string) => void;
  enterButton?: boolean | React.ReactNode;
}

export const InputSearch: React.FC<SearchProps> = (props) => (
  <Search
    {...props}
    className={`common-search ${props.className || ''}`}
  />
);

export default Input;