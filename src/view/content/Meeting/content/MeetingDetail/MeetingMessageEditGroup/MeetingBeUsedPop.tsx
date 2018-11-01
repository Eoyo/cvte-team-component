import { PopCard } from "../../../../../common/component/Pop/PopCard";
import * as React from "react";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { Button } from "antd";
import { Ele } from "../../../../../common/ts-styled/ele";

export const C_MeetingBeUsedPop = MeetingConnect(s => {
  return {
    viewMeetingBeUsed: s.showMeetingBeUsedPopCard,
  };
})(p => (
  <PopCard
    visible={p.viewMeetingBeUsed}
    popContentClassName={"file-pop-content"}
    onClickBg={() => {
      Meeting.closeMeetingBeUsedModal({});
    }}
  >
    <p className="p-title">您选择的会议室已被占用</p>
    <div className="btn-line">
      <Ele.secondBtn
        type={"primary"}
        disable={false}
        onClick={() => {
          Meeting.closeMeetingBeUsedModal({});
        }}
      >
        好的
      </Ele.secondBtn>
    </div>
  </PopCard>
));
