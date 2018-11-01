/**
 * 会议的时间显示, 及是否有冲突.
 */
import * as React from "react";
import { MeetingListCardProps } from "./MeetingListCardTypes";
import { U } from "../../../../../../utils";

export type MeetingTimeProps = MeetingListCardProps;
export const MeetingTime: React.SFC<MeetingTimeProps> = p => {
  let result: JSX.Element | null = null;
  if (
    p.status === "inviting" ||
    p.status === "inviting-conflict" ||
    p.status === "waiting" ||
    p.status === "waiting-update" ||
    p.status === "inMeeting" ||
    p.status === "inMeeting-delay" ||
    p.status === "inMeeting-summary" ||
    p.status === "justEnd" ||
    p.status === "justEnd-summary"
  ) {
    if (p.startTime && p.endTime) {
      let time =
        U.formDate.hourMinute(p.startTime) +
        "~" +
        U.formDate.hourMinute(p.endTime);
      result = <div className="meeting-time-hour-minute">{time}</div>;
    }
  } else if (p.status === "summarySend") {
    if (p.startTime && p.endTime) {
      let time = U.formDate.normalDay2(p.startTime);
      let show = "归档日期：" + time;
      result = <div className="meeting-time-send-summary">{show}</div>;
    } else {
      result = null;
    }
  } else {
    result = null;
  }
  return <div className="meeting-time">{result}</div>;
};
