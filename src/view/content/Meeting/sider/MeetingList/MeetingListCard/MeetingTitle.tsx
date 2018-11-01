/**
 * 会议的标题
 */

import * as React from "react";
import { MeetingListCardProps } from "./MeetingListCardTypes";
import { Popover } from "antd";
import { U } from "../../../../../../utils";

export type MeetingTitleProps = MeetingListCardProps;
export const MeetingTitle: React.SFC<MeetingTitleProps> = p => {
  let result;
  //被邀请状态时，title需要高亮
  if (p.status === "inviting") {
    result = (
      <div className="meeting-title-flex">
        <div className="meeting-title-red-point" />
        <div className="meeting-title-inviting">{p.title}</div>
      </div>
    );
  } else if (p.status === "inviting-conflict") {
    if (p.startTime && p.endTime) {
      let content = p.conflictMeetings.map(m => {
        let time =
          U.formDate.hourMinute(m.startTime) +
          "~" +
          U.formDate.hourMinute(m.endTime);
        return (
          <div className="meeting-title-popover-flex" key={m.meetingId}>
            <div className="meeting-title-inviting-time">{time}</div>
            <div className="meeting-title-inviting-title">{m.title}</div>
          </div>
        );
      });
      result = (
        <div className="meeting-title-flex">
          <div className="meeting-title-red-point" />
          <div className="meeting-title-conflict-title">{p.title}</div>
          <Popover
            placement="topLeft"
            overlayClassName="meeting-title-conflict-popover"
            title=""
            content={content}
          >
            <div className="meeting-title-conflict" />
          </Popover>
        </div>
      );
    }
  } else if (p.status === "waiting-update") {
    let timeChange: JSX.Element | null = null;
    //如果上一次的会议时间存在，并且和这次的时间有差别，那么就显示出来
    if (p.lastMeetingInfo.startTime && p.lastMeetingInfo.endTime) {
      if (
        p.lastMeetingInfo.startTime !== p.startTime ||
        p.lastMeetingInfo.endTime !== p.endTime
      ) {
        let nowTime =
          U.formDate.hourMinute(p.startTime) +
          "~" +
          U.formDate.hourMinute(p.endTime);
        let lastTime =
          U.formDate.hourMinute(p.lastMeetingInfo.startTime) +
          "~" +
          U.formDate.hourMinute(p.lastMeetingInfo.endTime);
        timeChange = (
          <div className="meeting-title-popover-flex">
            <div className="meeting-title-update-content">{lastTime}</div>
            <div className="meeting-title-update-change">改为</div>
            <div className="meeting-title-update-content">{nowTime}</div>
          </div>
        );
      }
    }
    let posChange: JSX.Element | null = null;
    if (p.lastMeetingInfo.meetingPosition !== p.meetingPosition) {
      posChange = (
        <div className="meeting-title-popover-flex">
          <div className="meeting-title-update-content">
            {p.lastMeetingInfo.meetingPosition}
          </div>
          <div className="meeting-title-update-change">改为</div>
          <div className="meeting-title-update-content">
            {p.meetingPosition}
          </div>
        </div>
      );
    }
    let content = (
      <div>
        <div>{timeChange}</div>
        <div>{posChange}</div>
      </div>
    );
    result = (
      <div className="meeting-title-flex">
        <div className="meeting-title-update-title">{p.title}</div>
        <Popover
          placement="topLeft"
          overlayClassName="meeting-title-update-popover"
          title=""
          content={content}
        >
          <div className="meeting-title-update" />
        </Popover>
      </div>
    );
  } else {
    result = <div className="meeting-title-other">{p.title}</div>;
  }
  return <div className="meeting-title">{result}</div>;
};
