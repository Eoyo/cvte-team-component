import * as React from "react";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";
import { PopCard } from "../../../../../../common/component/Pop/PopCard";
import { Ele } from "../../../../../../common/ts-styled/ele";
import "./C_RepeatTimeOverThirtyDayPopCard.scss";

export const C_RepeatTimeOverThirtyDayPopCard = MeetingConnect(s => {
  return {
    show: s.showRepeatTimeOverThirtyDayPopCard,
  };
})(p => {
  return (
    <PopCard
      visible={p.show}
      onClickBg={() => {
        Meeting.setRepeatTimeOverThirtyDayPopCard({ show: false });
      }}
      popContentClassName={"conflict-meeting-pop-content"}
    >
      <p className="conflict-meeting-message">
        修改时间后，需要重新选择重复截止日期，是否确定修改
      </p>
      <div className="conflict-meeting-btn-group">
        <Ele.secondBtn
          onClick={() => {
            Meeting.setRepeatTimeOverThirtyDayPopCard({ show: false });
          }}
        >
          否
        </Ele.secondBtn>
        <div className="btn-space" />
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            const { updateInfo } = Meeting.grab();
            let startTime = 0;
            if (updateInfo && updateInfo.updateStartTime) {
              startTime = updateInfo.updateStartTime.valueOf();
            }
            Meeting.setRepeatEndTime({ repeatEndTime: undefined });
            Meeting.setRepeatStartTime({
              startTime: startTime,
            });
            Meeting.setRepeatSelector({ show: true });
            Meeting.setRepeatTimeOverThirtyDayPopCard({ show: false });
          }}
        >
          是
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
});
