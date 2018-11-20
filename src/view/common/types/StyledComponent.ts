import { ReactNode, ReactElement, ValidationMap } from "react";
import { StyledComponentClass } from "styled-components";

export interface WithStyled<P = {}> {
  (
    props: P & { children?: ReactNode; className?: string },
    context?: any
  ): ReactElement<any> | null;
  propTypes?: ValidationMap<P>;
  contextTypes?: ValidationMap<any>;
  defaultProps?: Partial<P>;
  displayName?: string;
}

export type StyledPropsEle<
  Props,
  tagName extends keyof JSX.IntrinsicElements
> = StyledComponentClass<Props, any, Props & JSX.IntrinsicElements[tagName]>;
