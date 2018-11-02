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
  let tenMinutes = 10 * 60 * 1000;
  //如果小于等于10分钟，并且还没定会议室，就需要提醒
  if (
    s.meetingData.orderStatus === 1 &&
    s.meetingPage.waitingTime <= tenMinutes
  ) {
    return {
      needOrder: true,
      waitingTimeStr: U.formDate.remainTime(s.meetingPage.waitingTime),
    };
  } else {
    return {
      needOrder: false,
      waitingTimeStr: U.formDate.remainTime(s.meetingPage.waitingTime),
    };
  }
})(p => {
  return (
    <MeetingStatusToast
      noticeIcon={<NoticeIcon type={"waitClock"} />}
      description={
        p.needOrder === false
          ? `离会议开始还剩: ${p.waitingTimeStr}`
          : `${p.waitingTimeStr}后开启，请尽快去会议室签到！`
      }
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
