import * as React from "react";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { PopCard } from "../../../../../common/component/Pop/PopCard";
import { Ele } from "../../../../../common/ts-styled/ele";
import "./SummaryConfirmPopover.scss";

export const C_SummaryConfirmPop = MeetingConnect(s => {
  let attendingList = s.meetingData.attendingList;
  let memberNum = attendingList.length - 1;
  return {
    show: s.showSendSummaryPopCard,
    memberNum: memberNum,
  };
})(p => {
  let content: JSX.Element | null = null;
  if (p.memberNum > 0) {
    content = (
      <>
        <div className="summary-confirm-title">
          {"您确定要将会议纪要发给" + p.memberNum + "个参会人？"}
        </div>
        <div className="summary-confirm-btn-group">
          <Ele.secondBtn
            onClick={() => {
              Meeting.setSendSummaryPopState({ show: false });
            }}
          >
            取消
          </Ele.secondBtn>
          <div className="btn-space" />
          <Ele.secondBtn
            type={"primary"}
            onClick={() => {
              Meeting.sendSummary({});
              Meeting.setSendSummaryPopState({ show: false });
            }}
          >
            确认
          </Ele.secondBtn>
        </div>
      </>
    );
  } else if (p.memberNum === 0) {
    content = (
      <>
        <div className="summary-confirm-title">请添加参会人</div>
        <div className="summary-confirm-btn-group">
          <Ele.secondBtn
            type={"primary"}
            onClick={() => {
              Meeting.setSendSummaryPopState({ show: false });
            }}
          >
            好的
          </Ele.secondBtn>
        </div>
      </>
    );
  }
  return (
    <PopCard
      visible={p.show}
      onClickBg={() => {
        Meeting.setSendSummaryPopState({ show: false });
      }}
      popContentClassName={"summary-confirm-pop-content"}
    >
      {content}
    </PopCard>
  );
});
