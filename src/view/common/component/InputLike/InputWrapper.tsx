/**
 * InputWrapper,
 * 用于加强原生的input的外围样式, 结构体.
 */
import * as React from "react";
import styled from "styled-components";
import { co } from "../../ts-styled/co";

const S_LeftDecorator = styled("div")`
  display: inline-block;
`;

const S_RightDecorator = styled("div")`
  display: inline-block;
`;

export const S_InpWrapper = styled("div")`
  display: inline-block;
  position: relative;
  ${S_LeftDecorator} {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    transform: translate(-100%, 0);
  }
  ${S_RightDecorator} {
    position: absolute;
    left: auto;
    right: 0px;
    height: 100%;
  }
`;

export const InputWrapper: React.SFC<{
  leftDecorator?: any;
  innerRightDecorator?: any;
}> = p => (
  <S_InpWrapper>
    {p.leftDecorator && <S_LeftDecorator>{p.leftDecorator}</S_LeftDecorator>}
    {p.children}
    {p.innerRightDecorator && (
      <S_RightDecorator>{p.innerRightDecorator}</S_RightDecorator>
    )}
  </S_InpWrapper>
);
