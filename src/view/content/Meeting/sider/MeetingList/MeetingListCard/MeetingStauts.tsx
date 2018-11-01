/**
 * Meeting卡片的底部的其他信息, 标明地点or会议状态;
 */

import * as React from "react";
import { MeetingListCardProps } from "./MeetingListCardTypes";

export type MeetingStatusProps = MeetingListCardProps;
export const MeetingStatus: React.SFC<MeetingStatusProps> = p => {
  let result;
  const pos = (
    <div className="meeting-status-content meeting-status-pos">
      {p.meetingPosition || "待定"}
    </div>
  );
  //   const note = <div className="meeting-status-content meeting-status-note">
  //   笔记：
  //   {p.note}
  // </div>
  if (p.status === "inviting" || p.status === "inviting-conflict") {
    let invitingContent = "来自 " + p.invitingPerson + " 的邀请";
    result = (
      <div className="meeting-status-inviting">
        {pos}
        <div className="meeting-status-inviting-status">{invitingContent}</div>
      </div>
    );
  } else if (p.status === "waiting" || p.status === "waiting-update") {
    result = (
      <div className="meeting-status-org">
        {pos}
        <div className="meeting-status-backup-status">待开始</div>
      </div>
    );
  } else if (p.status === "inMeeting") {
    result = (
      <div className="meeting-status-org">
        {pos}
        <div className="meeting-status-org-status">开会中</div>
      </div>
    );
  } else if (p.status === "inMeeting-summary") {
    result = (
      <div className="meeting-status-org">
        {pos}
        <div className="meeting-status-org-status">开会中</div>
      </div>
    );
  } else if (p.status === "inMeeting-delay") {
    result = (
      <div className="meeting-status-org">
        {pos}
        <div className="meeting-status-meeting-delay">延时中</div>
      </div>
    );
  } else if (p.status === "justEnd-summary") {
    result = (
      <div className="meeting-status-org">
        {pos}
        <div className="meeting-status-backup-status">会议结束</div>
      </div>
    );
  } else if (p.status === "justEnd") {
    result = (
      <div className="meeting-status-org">
        {pos}
        <div className="meeting-status-backup-status">会议结束</div>
      </div>
    );
  } else if (p.status === "summarySend") {
    result = (
      <div className="meeting-status-org">
        {pos}
        <div className="meeting-status-backup-status">已归档</div>
      </div>
    );
  } else {
    result = null;
  }
  return <div className="meeting-status">{result}</div>;
};
