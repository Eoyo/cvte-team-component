/**
 * MeetingMessageShower,
 */
import * as React from "react";
import {
  MeetingBlockCard,
  BlockCardContent,
} from "../../common/Layout/MeetingBlockCard";
import { TitleLine, TitleTool } from "../../common/Layout/TitleLine";
import { C_ModifyMeetingDetail } from "./DetailCardActions/ModifyMeetingDetail";
import { C_ConfirmModify } from "./DetailCardActions/ConfirmDetailModify";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { EditingMeetingDetail } from "./MeetingDetailEditing";
import { MeetingDetailShower } from "./MeetingDetailShower";
import styled from "styled-components";
import { co } from "../../../../../common/ts-styled/co";
import "./MeetingDetailMessageCard.scss";
export type MeetingMessageShowerProps = {};

/**
 * 改变编辑状态的按钮.
 */
export const C_ChangeEditStatus = MeetingConnect(s => {
  return { isEditing: s.meetingPerson.detailEdit === "editing" };
})(p => (p.isEditing ? <C_ConfirmModify /> : <C_ModifyMeetingDetail />));

export const ThemePlaceHolder = styled("span")`
  color: ${co.lighterGray};
`;

/**
 * 会议详情卡片
 */
export const C_MeetingDetailMessageCard = MeetingConnect(s => {
  const body = s.meetingData.body;
  //如果不是正在编辑状态，就置"会议室已被关闭"的条件为false
  if (s.meetingPerson.detailEdit !== "editing" && s.meetingBeUsed) {
    Meeting.setMeetingBeUsed({ beUsed: false });
  }
  const isEditing = s.meetingPerson.detailEdit === "editing";
  const canEdit =
    s.meetingPerson.role === "compere" &&
    s.meetingPerson.detailEdit !== "notEditable";
  let titleNameClassName = "";
  //可以编辑状态（会有一个编辑按钮）
  if (canEdit && !isEditing) {
    titleNameClassName = "meeting-subject-title-editable";
  } else if (isEditing) {
    //正在编辑状态
    titleNameClassName = "meeting-subject-title-editing";
  }
  return {
    theme: body.subject,
    canEdit: canEdit,
    isEditing: isEditing,
    titleNameClassName: titleNameClassName,
  };
})(p => (
  <MeetingBlockCard>
    <TitleLine
      name={p.theme || <ThemePlaceHolder>(无会议主题)</ThemePlaceHolder>}
      //分为正在编辑状态（会有两个按钮），可以编辑状态（会有一个编辑按钮），以及不可编辑状态（啥都没有）
      titleNameClassName={p.titleNameClassName}
      tool={<TitleTool>{p.canEdit && <C_ChangeEditStatus />}</TitleTool>}
    />
    {p.isEditing ? (
      <EditingMeetingDetail />
    ) : (
      <BlockCardContent>
        <MeetingDetailShower />
      </BlockCardContent>
    )}
  </MeetingBlockCard>
));
