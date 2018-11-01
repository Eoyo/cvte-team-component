import { MeetingConnect } from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { MeetingStatusToast } from "../../common/StatusToast/MeetingStatusToast";
import * as React from "react";
import { table } from "../../../../../../utils/String/strTable";
import { NoticeIcon } from "../../common/StatusToast/NoticeIcon";

export const EndMeetingToast = MeetingConnect(s => {
  return {
    toastStr: summaryTable({
      master: s.meetingPerson.role === "compere",
      summaryOK: s.meetingPage.isSummarySend,
    }),
    type: (s.meetingPage.isSummarySend ? "ok" : "alert") as "ok" | "alert",
  };
})(p => (
  <MeetingStatusToast
    noticeIcon={<NoticeIcon type={p.type} />}
    description={p.toastStr}
    tool={null}
  />
));

const summaryTable = table(["master", "summaryOK"], {
  "10": "会议已结束，请确认会议纪要并发送",
  "11": "会议已归档",
  "01": "会议已归档",
  "00": "发起人已结束会议，请等待纪要输出",
});
