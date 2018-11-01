/**
 * EditorCard,
 */
import { MeetingBlockCard } from "../../common/Layout/MeetingBlockCard";
import * as React from "react";
import "./EditorCard.scss";
import { arrCss } from "../../../../../../utils/export";
export type EditorCardProps = {
  title: string;
};

//编辑器卡片的样式, 使得simditor的悬浮出来
export const S_EditorCard: React.SFC<{ className?: string }> = p => {
  return (
    <MeetingBlockCard className={arrCss(["S-editor-card", p.className])}>
      {p.children}
    </MeetingBlockCard>
  );
};
