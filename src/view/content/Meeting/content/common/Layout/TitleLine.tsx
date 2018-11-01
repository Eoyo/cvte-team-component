/**
 * TitleLine,
 * 卡片的标题的布局
 */
import * as React from "react";
import styled from "styled-components";
import { flex, pos } from "../../../../../common/ts-styled/flex";

export const TitleName = styled("span")`
  --styled: "TitleName";
  font-size: 18px;
  line-height: 18px;
  font-weight: normal;
  display: inline-flex;
  color: #1e1e1e;
  align-items: flex-end;
`;

export const TitleTool = styled("div")`
  --styled: "TitleTool";
  ${pos.RowRight};
  right: 0px;
  display: flex;
  align-items: center;
  height: 100%;
`;
export type TitleLineProps = {
  name: any;
  titleNameClassName?: string;
  tool?: any;
  toolRef?: React.RefObject<any>;
};
export const S_TitleLine = styled("div")`
  --styled: "S_TitleLine";
  ${flex.rowLeft};
  width: 100%;
  align-items: flex-end;
  height: 18px;
  margin-bottom: 12px;
`;

export const HrLine = styled("div")`
  --styled: "HrLine";
  height: 1px;
  background: #f1f1f1;
  width: 100%;
`;

export const TitleLineWrap = styled("div")`
  --styled: "TitleLineWrap";
  padding: 18px 30px 0px;
`;

export const TitleLine: React.SFC<TitleLineProps> = p => (
  <TitleLineWrap>
    <S_TitleLine>
      <TitleName className={p.titleNameClassName}>{p.name}</TitleName>
      {p.children}
      {p.tool}
    </S_TitleLine>
    <HrLine />
  </TitleLineWrap>
);
