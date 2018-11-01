/**
 * CancelReaptMeeting,
 */
import "./CancelReaptMeeting.scss";
import "./common/MeetingPop.scss";
import * as React from "react";
import { closeMaskToCloseModal } from "../../../../../utils/Dom/antd-modal-close";
import { ModalClose } from "../../../common/MainContentModal/ModalClose";
import { Fusion } from "../../../../../stores/Actor/fusion";
import { S } from "../../../../../stores";
import { Meeting } from "../../../../../pivot/Meeting/Actor/MeetingActor";
import { Ele } from "../../../../common/ts-styled/ele";
import { PopCard } from "../../../../common/component/Pop/PopCard";
export type CancelReaptMeetingProps = {
  visible: boolean;
  onClose(): void;
  onOperateOne(): void;
  oneOperateAll(): void;
};

export const CancelReaptMeeting: React.SFC<CancelReaptMeetingProps> = p => {
  closeMaskToCloseModal(".cancel-repeat-meeting-modal", p.visible, () => {
    p.onClose();
  });
  let config = {
    onClickClose: function() {
      p.onClose();
    },
    className: "cancel-repeat-meeting-close",
  };
  return (
    <PopCard
      visible={p.visible}
      onClickBg={() => {
        p.onClose();
      }}
      popContentClassName={"cancel-repeat-meeting-pop-content"}
    >
      <div className="cancel-repeat-meeting-content">
        <ModalClose {...config} />
        <div className="cancel-repeat-meeting-title">
          您正在取消重复会议的预约
        </div>
        <div className="cancel-repeat-meeting-message">
          您是要取消该会议的仅这一个预约，还是取消它的所有预约？
        </div>
        <div className="cancel-repeat-meeting-btn-group">
          <Ele.secondBtn onClick={p.oneOperateAll}>全部取消</Ele.secondBtn>
          <div className="btn-space" />
          <Ele.secondBtn type={"primary"} onClick={p.onOperateOne}>
            仅此会议
          </Ele.secondBtn>
        </div>
      </div>
    </PopCard>
  );
};

// connect
export const C_CancelReaptMeeting = Fusion(S.Meeting.getStore())<
  CancelReaptMeetingProps
>(s => {
  return {
    visible: s.showCancelRepeatPopCard,
    onClose() {
      Meeting.showCancelRepeatPopCard({ view: false });
    },
    oneOperateAll() {
      Meeting.cancelRepeatMeetings({
        meetingId: s.meetingListRightClickInfo.meetingId,
      });
    },
    onOperateOne() {
      Meeting.cancelOneMeeting({
        meetingId: s.meetingListRightClickInfo.meetingId,
      });
    },
  };
})(p => <CancelReaptMeeting {...p} />);
