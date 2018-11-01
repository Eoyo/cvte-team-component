/**
 * 检查子的开发思想
 * 通过检查子包装需要验证的数据, 让数据具有自我描述性;
 */

export type checki<T> = {
  value: T;
  message: string;
  result: boolean;
  code?: string | number;
};

export function checki<T>(value: T): checki<T> {
  return {
    value,
    message: "",
    result: false,
    code: undefined,
  };
}
