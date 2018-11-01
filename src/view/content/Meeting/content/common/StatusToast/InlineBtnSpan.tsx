/**
 * 文字按钮
 */

import styled, { css } from "styled-components";

export const InlineBtnSpan = styled("span")`
  --styled: "InlineBtnSpan";
  cursor: pointer;
  margin-left: 30px;
  ${(p: { type?: "primary" | "warn" }) => {
    if (p.type === "primary") {
      return css`
        color: #3ac3c8;
      `;
    } else if (p.type === "warn") {
      return css`
        color: #f58777;
      `;
    }
    return css`
      color: #1e1e1e;
    `;
  }};
`;
