/**
 * 使用卡片布局的
 */
import styled from "styled-components";
import * as React from "react";
import { S_TitleLine } from "./TitleLine";
export const S_MeetingBlockCard = styled("div")`
  --styled: "MeetingBlockCard";
  width: 630px;
  padding: 0px;
  border: 1px solid #e9e9e9;
  background: #fff;
  margin-bottom: 14px;
  position: relative;
  transition: all 0.5s;
  border-radius: 4px;
`;

export const BlockCardContent = styled("div")`
  --styled: "BlockCardContent";
  padding: 18px 30px;
`;

export const MeetingBlockCard: React.SFC<{ className?: string }> = p => {
  return (
    <S_MeetingBlockCard className={p.className}>
      {p.children}
    </S_MeetingBlockCard>
  );
};
