/**
 * 会议的卡片,
 */

import * as React from "react";
import { MeetingListCardProps } from "./MeetingListCardTypes";
import { MeetingStatus } from "./MeetingStauts";
import { MeetingTime } from "./MeetingTime";
import { MeetingTitle } from "./MeetingTitle";
import { Dropdown } from "antd";
import { ClickShower } from "./RightClickShower";
import { S } from "../../../../../../stores";
export class MeetingListCard extends React.Component<MeetingListCardProps> {
  render() {
    const p = this.props;
    return (
      <Dropdown
        trigger={["contextMenu"]}
        visible={p.rightClickMenu}
        onVisibleChange={(visible: boolean) => {
          S.Meeting.setRightClickState({
            meetingId: p.meetingId,
            rightClickMenu: visible,
          });
        }}
        overlay={<ClickShower {...p} />}
      >
        <div
          className="meeting-list-card"
          onClick={ev => {
            ev.button === 0 && p.onSelectMeeting(p.meetingId);
          }}
        >
          <MeetingTitle {...p} />
          <MeetingTime {...p} />
          <MeetingStatus {...p} />
        </div>
      </Dropdown>
    );
  }
}
