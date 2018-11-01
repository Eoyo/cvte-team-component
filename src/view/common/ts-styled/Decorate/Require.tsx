import * as React from "react";
import styled, { css } from "styled-components";
import { co } from "../co";

const S_RequiredHint = styled("span")`
  --styled: "S_RequiredHint";
  display: inline-flex;
  color: ${co.error};
  padding: 0px 3px;
  height: 100%;
  align-items: center;
  ${(p: { visible: boolean }) => {
    if (!p.visible) {
      return css`
        display: none;
      `;
    } else {
      return;
    }
  }};
`;

export const RequireWithText: React.SFC<{
  hintText: any; // '*'// span
  showHint?: boolean;
  toCheckText?: string; //  提供默认的数据校验方式
}> = p => {
  let showHint = false;
  if (p.toCheckText !== undefined) {
    showHint = !p.toCheckText;
  } else {
    showHint = !!p.showHint;
  }
  return <S_RequiredHint visible={showHint}>{p.hintText}</S_RequiredHint>;
};
