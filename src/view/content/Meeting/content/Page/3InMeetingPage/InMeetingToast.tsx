import { MeetingConnect } from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { U } from "../../../../../../utils";
import { S } from "../../../../../../stores";
import {
  MeetingStatusToast,
  ToastTool,
} from "../../common/StatusToast/MeetingStatusToast";
import * as React from "react";
import { InlineBtnSpan } from "../../common/StatusToast/InlineBtnSpan";
import { NoticeIcon } from "../../common/StatusToast/NoticeIcon";
import { TitleTool } from "../../common/Layout/TitleLine";

export const InMeetingToast = MeetingConnect(s => {
  return {
    timeStr: U.formDate.remainTime(s.meetingPage.consistentTime),
    onEndMeeting: () => {
      S.Meeting.stopMeeting({});
    },
    isDelay: s.meetingPage.isDelay,
    role: s.meetingPerson.role,
  };
})(p => {
  return (
    <MeetingStatusToast
      noticeIcon={<NoticeIcon type={p.isDelay ? "alert" : "runningClock"} />}
      description={
        <span className="descript-info">
          {p.isDelay
            ? `会议已延时 ${p.timeStr}，${
                p.role === "compere"
                  ? "请及时结束会议！"
                  : "请提醒发起人结束会议！"
              }`
            : `会议已开启 ${p.timeStr}`}
        </span>
      }
      tool={
        <ToastTool>
          {p.role === "compere" ? (
            <InlineBtnSpan
              onClick={() => {
                p.onEndMeeting();
              }}
              type={p.isDelay ? "warn" : "primary"}
            >
              结束会议
            </InlineBtnSpan>
          ) : null}
        </ToastTool>
      }
    />
  );
});
