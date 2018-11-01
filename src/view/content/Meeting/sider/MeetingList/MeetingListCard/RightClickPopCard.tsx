import * as React from "react";
import { MeetingConnect } from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { PopCard } from "../../../../../common/component/Pop/PopCard";
import { Ele } from "../../../../../common/ts-styled/ele";
import "./RightClickPopCard.scss";

export const C_RightClickPopCard = MeetingConnect(s => {
  return {
    visible: s.meetingListRightClickInfo.showRightClickPopCard,
    onConfirm: s.meetingListRightClickInfo.onConfirm,
    onCancel: s.meetingListRightClickInfo.onCancel,
    title: s.meetingListRightClickInfo.title,
    content: s.meetingListRightClickInfo.content,
  };
})(p => {
  return (
    <PopCard
      visible={p.visible}
      popContentClassName={"meetinglist-right-click-pop-content"}
      onClickBg={() => {
        p.onCancel();
      }}
    >
      <p className="meetinglist-right-click-title">{p.title}</p>
      {p.content ? (
        <p className="meetinglist-right-click-content">{p.content}</p>
      ) : null}
      <div className="meetinglist-right-click-btn-group">
        <Ele.secondBtn
          onClick={() => {
            p.onCancel();
          }}
        >
          点错了
        </Ele.secondBtn>
        <div className="btn-space" />
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            p.onConfirm();
          }}
        >
          确定
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
});
