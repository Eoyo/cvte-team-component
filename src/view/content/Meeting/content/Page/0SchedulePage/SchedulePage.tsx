/**
 * SchedultPage,
 */
import * as React from "react";
import {
  MeetingBlockCard,
  BlockCardContent,
} from "../../common/Layout/MeetingBlockCard";
import { MeetingMemberContent } from "../../AttendingList/MeetingMemberCard";
import styled from "styled-components";
import { SchedulePageTitle } from "./SchedulePageTitle";
import { MeetingEditGroup } from "../../MeetingDetail/MeetingMessageEditGroup/MeetingEditGroup";
import {
  TitleName,
  S_TitleLine,
  HrLine,
  TitleLineWrap,
} from "../../common/Layout/TitleLine";
// import { C_FileViewer } from "../../FileListViewer/FileViewer";
import {
  MeetingContentEditor,
  S_MeetingContentEditor,
} from "../../Editor/MeetingContentEditor/MeetingContentEditor";
import {
  C_FileViewerCard,
  FileViewerContent,
} from "../../FileListViewer/FileViewer";
export type SchedultPageProps = {};

export const ScheduleBlock = styled("div")`
  --styled: "ScheduleBlock";
  width: 100%;
  ${S_MeetingContentEditor} {
    margin-bottom: 0px;
  }
  &&:last-child {
    margin-bottom: 0px;
  }
`;

export const S_SchedulePageCard = styled(MeetingBlockCard)`
  --styled: "S_SchedulePage";
  ${HrLine} {
    display: none;
  }
  ${TitleName} {
    font-size: 14px;
  }
  ${FileViewerContent} {
    padding: 8px 30px 38px;
  }
`;

// sfc
export const SchedulePage: React.SFC<SchedultPageProps> = p => {
  return (
    <S_SchedulePageCard>
      <SchedulePageTitle />

      {/* 基本信息的编辑 */}
      <MeetingEditGroup />

      {/* 会议内容 */}
      <MeetingContentEditor />

      {/* 会议成员 */}
      <MeetingMemberContent />

      {/* 会议文件 */}
      <ScheduleBlock>
        <C_FileViewerCard noCard={true} />
      </ScheduleBlock>
    </S_SchedulePageCard>
  );
};
