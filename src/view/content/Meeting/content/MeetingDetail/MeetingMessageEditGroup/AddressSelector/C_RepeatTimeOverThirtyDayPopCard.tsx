import * as React from "react";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";
import { PopCard } from "../../../../../../common/component/Pop/PopCard";
import { Ele } from "../../../../../../common/ts-styled/ele";
import "./C_RepeatTimeOverThirtyDayPopCard.scss";
import * as moment from "moment";

export const C_RepeatTimeOverThirtyDayPopCard = MeetingConnect(s => {
  return {
    show: s.showRepeatTimeOverThirtyDayPopCard,
    updateStartTime: s.updateInfo && s.updateInfo.updateStartTime,
    updateEndTime: s.updateInfo && s.updateInfo.updateEndTime,
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
            let startTime = Date.now();
            if (p.updateStartTime) {
              startTime = p.updateStartTime;
            }
            let endTime = Date.now();
            if (p.updateEndTime) {
              endTime = p.updateEndTime;
            }
            Meeting.setRepeatEndTime({ repeatEndTime: undefined });
            Meeting.setMeetingBaseMessage({
              date: {
                day: moment(startTime),
                startTime: moment(startTime),
                endTime: moment(endTime),
              },
            });
            //因为setMeetingBaseMessage是generator函数，会在下面几个函数之后才触发，所以设置
            //间隔时间，保证触发顺序，不然会有bug
            setTimeout(() => {
              Meeting.setRepeatStartTime({
                startTime: startTime,
              });
              Meeting.setRepeatTimeOverThirtyDayPopCard({ show: false });
              Meeting.setRepeatSelector({ show: true });
            }, 100);
          }}
        >
          是
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
});
