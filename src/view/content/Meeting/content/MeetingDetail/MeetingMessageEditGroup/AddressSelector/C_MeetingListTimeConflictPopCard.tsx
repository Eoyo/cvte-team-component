import * as React from "react";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";
import { PopCard } from "../../../../../../common/component/Pop/PopCard";
import { Ele } from "../../../../../../common/ts-styled/ele";
import "./C_MeetingListTimeConflictPopCard.scss";

export const C_MeetingListTimeConflictPopCard = MeetingConnect(s => {
  return {
    show: s.showMeetingListTimeConflictPopCard,
    contents: s.conflictContents,
  };
})(p => {
  let content = "与" + `\"${p.contents[0]}\"`;
  if (p.contents.length > 1) {
    content += "等";
  }
  content += "会议存在时间冲突，是否继续预约？";
  return (
    <PopCard
      visible={p.show}
      onClickBg={() => {
        Meeting.setMeetingListConflictPopCard({ show: false });
      }}
      popContentClassName={"conflict-meeting-pop-content"}
    >
      <div className="conflict-meeting-title">会议时间冲突提醒</div>
      <p className="conflict-meeting-message">{content}</p>
      <div className="conflict-meeting-btn-group">
        <Ele.secondBtn
          onClick={() => {
            Meeting.setMeetingListConflictPopCard({ show: false });
          }}
        >
          取消
        </Ele.secondBtn>
        <div className="btn-space" />
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            Meeting.sendSchedule({});
            Meeting.setMeetingListConflictPopCard({ show: false });
          }}
        >
          继续
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
});
