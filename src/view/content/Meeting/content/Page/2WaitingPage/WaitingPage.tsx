/**
 * WaitingPage,
 */
import * as React from "react";
import { MeetingStatusToast } from "../../common/StatusToast/MeetingStatusToast";
import { MeetingConnect } from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { U } from "../../../../../../utils";
import { C_MeetingDetailMessageCard } from "../../MeetingDetail/MessageShower/MeetingDetailMessageCard";
import { C_FileViewerCard } from "../../FileListViewer/FileViewer";
import { MeetingMemberCard } from "../../AttendingList/MeetingMemberCard";
import { NoticeIcon } from "../../common/StatusToast/NoticeIcon";
import { C_NoteEditorCard } from "../../Editor/NoteEditor/NoteEditorCard";
export type WaitingPageProps = {};

export const WaitingToast = MeetingConnect(s => {
  return { waitingTimeStr: U.formDate.remainTime(s.meetingPage.waitingTime) };
})(p => {
  return (
    <MeetingStatusToast
      noticeIcon={<NoticeIcon type={"waitClock"} />}
      description={`离会议开始还剩: ${p.waitingTimeStr}`}
      tool={null}
    />
  );
});

// sfc
export const WaitingPage: React.SFC<WaitingPageProps> = p => {
  return (
    <>
      <WaitingToast />
      <C_MeetingDetailMessageCard />
      <C_NoteEditorCard />
      <MeetingMemberCard />
      <C_FileViewerCard />
    </>
  );
};
