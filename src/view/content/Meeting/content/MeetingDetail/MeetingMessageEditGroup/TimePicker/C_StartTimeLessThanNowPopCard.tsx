import * as React from "react";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";
import { PopCard } from "../../../../../../common/component/Pop/PopCard";
import { Ele } from "../../../../../../common/ts-styled/ele";
import "./C_StartTimeLessThanNowPopCard.scss";

export const C_StartTimeLessThanNowPopCard = MeetingConnect(s => {
  return {
    show: s.showStartTimeLessThanNowPopCard,
  };
})(p => {
  return (
    <PopCard
      visible={p.show}
      onClickBg={() => {
        Meeting.setStartTimeLessThanNowPopCard({ show: false });
      }}
      popContentClassName={"schedule-time-pop-content"}
    >
      <div className="schedule-time-title">开会时间不早于当前时间</div>
      <div className="schedule-time-btn-group">
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            Meeting.setStartTimeLessThanNowPopCard({ show: false });
          }}
        >
          好的
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
});
