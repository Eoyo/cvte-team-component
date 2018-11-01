import { Fusion } from "../../../../stores/Actor/fusion";
import { S } from "../../../../stores";
import { Modal, Button } from "antd";
import * as React from "react";
import "./SchduleMeetingModal.scss";
import { Meeting } from "../../../../pivot/Meeting/Actor/MeetingActor";
import { Ele } from "../../../common/ts-styled/ele";
import { PopCard } from "../../../common/component/Pop/PopCard";

export const C_SchduleMeetingModal = Fusion(S.Meeting.getStore())<{
  viewScheduleMeeting: boolean;
}>(s => {
  return {
    viewScheduleMeeting: s.showSchedulePopCard,
  };
})(p => (
  <PopCard
    visible={p.viewScheduleMeeting}
    popContentClassName={"schedule-pop-content"}
    onClickBg={() => {}}
  >
    <div className="schdule-meeting-content">
      <div className="schdule-meeting-content-title">
        是否继续使用上次的草稿？
      </div>
      <div className="schdule-meeting-content-btns">
        <Ele.secondBtn
          onClick={() => {
            //清空上次的内容
            Meeting.resetSchedule({});
          }}
        >
          不使用
        </Ele.secondBtn>
        <div className="btn-space" />
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            //使用上次填写的内容
            Meeting.useOldSchedule({});
          }}
        >
          使用
        </Ele.secondBtn>
      </div>
    </div>
  </PopCard>
));
