import styled, { css, ThemedStyledFunction } from "styled-components";
import * as React from "react";
export const size = (s: string) => css`
  width: ${s};
  height: ${s};
`;

type StyledComponentProp = { children?: React.ReactNode; className?: string };
// 将statelessComponent 转换成StyledComponent;
export function Slc<P>(
  Func: (p: P & StyledComponentProp) => JSX.Element
): {
  styled<
    TTag extends keyof JSX.IntrinsicElements,
    Ps = P & StyledComponentProp
  >(
    a: TTag
  ): ThemedStyledFunction<Ps, any, Ps & JSX.IntrinsicElements[TTag]>;
} {
  const rus: any = {
    styled(a: any) {
      const tag = styled(a);
      return (a: any, ...args: any[]) => {
        const Ele = tag(a, ...args);
        return (p: any) => {
          return (
            <Ele {...p}>
              <Func {...p} />
            </Ele>
          );
        };
      };
    },
  };
  return rus;
}
