import * as React from "react";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";
import { PopCard } from "../../../../../../common/component/Pop/PopCard";
import { Ele } from "../../../../../../common/ts-styled/ele";
import * as moment from "moment";
import "./C_MeetingAddressConflictPopCard.scss";

export const C_MeetingAddressConflictPopCard = MeetingConnect(s => {
  return {
    show: s.showMeetingAddressConflictPopCard,
  };
})(p => {
  return (
    <PopCard
      visible={p.show}
      onClickBg={() => {
        Meeting.setMeetingAddressConflictPopCard({ show: false });
      }}
      popContentClassName={"conflict-meeting-pop-content"}
    >
      <p className="conflict-meeting-message">
        修改时间后，需要重新选择会议室，是否确定修改
      </p>
      <div className="conflict-meeting-btn-group">
        <Ele.secondBtn
          onClick={() => {
            Meeting.setMeetingAddressConflictPopCard({ show: false });
          }}
        >
          否
        </Ele.secondBtn>
        <div className="btn-space" />
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            Meeting.setAddressSelector({ show: true });
            const s = Meeting.grab();
            //如果点击是，则需要把修改的时间改到editingDetail中
            Meeting.setMeetingBaseMessage({
              date: {
                day: s.updateInfo && moment(s.updateInfo.updateStartTime),
                startTime: s.updateInfo && moment(s.updateInfo.updateStartTime),
                endTime: s.updateInfo && moment(s.updateInfo.updateEndTime),
              },
            });
            Meeting.setMeetingAddressConflictPopCard({ show: false });
          }}
        >
          是
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
});
