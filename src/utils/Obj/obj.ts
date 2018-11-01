type ValuePicker = {
  <Src, T1 extends keyof Src>(obj: Src, prop1: T1): string;
  <Src, T1 extends keyof Src, T2 extends keyof Src[T1]>(
    obj: Src,
    prop1: T1,
    prop2: T2
  ): string;
};

/**
 * 深度试探性取值
 * @example
 * const obj = {a : { b: 'wantedValue'}}
 * const value = getValue('none')(obj, 'a', 'b');
 */
export const getValue = (wrongMessage: string) => {
  // // @ts-ignore;
  // if (!wrongMessage) wrongMessage = "undefined" as string;
  return <ValuePicker>((one: any, ...args: string[]) => {
    let rus = one;
    for (const prop of args) {
      if (rus[prop]) {
        rus = rus[prop];
      } else {
        return wrongMessage;
      }
    }
    return rus;
  });
};

/**
 *  依次, 尝试获取对象的值
 *  @example pickValue('undefined')(obj, 'prop1', 'prop2')
 */
export const pickValue = (er: string) => {
  return <T>(obj: T, ...args: (keyof T)[]) => {
    for (const a of args) {
      if (obj[a]) {
        return obj[a];
      }
    }
    return er;
  };
};

// 获取普通对象的自有keys
export const getNames = <T extends object>(obj: T): (keyof T)[] => {
  return Object.getOwnPropertyNames(obj) as any;
};

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
