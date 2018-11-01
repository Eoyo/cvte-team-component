/**
 * common;
 * 控制内容切换的高阶函数.
 */
import * as React from "react";

export type ContentSwitcherProps<T> = {
  case: T;
};
export type ContentSwitcherArgs<T extends string> = {
  [x in T]?: JSX.Element | null
};

export function ContentSwitcherBuilder<T extends string>(
  Wrapper: (ele: JSX.Element) => JSX.Element = ele => ele
) {
  const ContentSwitcher: React.SFC<
    ContentSwitcherProps<T> & ContentSwitcherArgs<T>
  > = p => {
    return <div className="content-switcher">{Wrapper(p[p.case] as any)}</div>;
  };
  return ContentSwitcher;
}
