import * as React from "react";
import styled from "styled-components";
import { windowDrag } from "../../../common/component/WindowDrag/Index";
import { WindowToolbar } from "../WindowToolbar/WindowToolbar";

const dragDiv = windowDrag("div");
export const HeaderWrapper = styled(dragDiv)`
  --styled: "HeaderWrapper";
  flex-shrink: 0;
  height: 45px;
  width: 100%;
  line-height: 44px;
  display: flex;
  justify-content: flex-end;
  background: #fff;
  z-index: 1;
  border-bottom: 0;
  align-items: center;
  border-bottom: 1px #e9e9e9 solid;
  position: relative;
`;

export const HeaderInner = styled("div")`
  --styled: "HeaderInner";
  position: relative;
`;

export const Header: React.SFC<any> = p => {
  return (
    <HeaderWrapper>
      <HeaderInner>{p.children}</HeaderInner>
      <WindowToolbar />
    </HeaderWrapper>
  );
};
