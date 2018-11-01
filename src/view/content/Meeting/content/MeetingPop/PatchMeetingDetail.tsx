/**
 * PatchMeetingDetail,
 */
import "./PatchMeetingDetail.scss";
import "./common/MeetingPop.scss";
import * as React from "react";
import { ModalClose } from "../../../common/MainContentModal/ModalClose";
import { Meeting } from "../../../../../pivot/Meeting/Actor/MeetingActor";
import { Fusion } from "../../../../../stores/Actor/fusion";
import { S } from "../../../../../stores";
import { Ele } from "../../../../common/ts-styled/ele";
import { PopCard } from "../../../../common/component/Pop/PopCard";
export type PatchMeetingDetailProps = {
  visible: boolean;
  onClose(): void;
  onOperateOne(): void;
  onOperateAll(): void;
};

// sfc
export const PatchMeetingDetail: React.SFC<PatchMeetingDetailProps> = p => {
  let config = {
    onClickClose: function() {
      p.onClose();
    },
    className: "modify-repeat-meeting-close",
  };
  return (
    <PopCard
      visible={p.visible}
      onClickBg={() => {
        p.onClose();
      }}
      popContentClassName={"modify-repeat-meeting-pop-content"}
    >
      <div className="modify-repeat-meeting-content">
        <ModalClose {...config} />
        <div className="modify-repeat-meeting-title">
          您正在修改重复会议信息
        </div>
        <div className="modify-repeat-meeting-message">
          您是要修改该会议的仅这一个重复，还是修改它的所有重复？
        </div>
        <div className="modify-repeat-meeting-btn-group">
          <Ele.secondBtn onClick={p.onOperateAll}>全部</Ele.secondBtn>
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
export const C_PatchMeetingDetail = Fusion(S.Meeting.getStore())<
  PatchMeetingDetailProps
>(s => {
  return {
    visible: s.showModifyRepeatPopCard,
    onClose() {
      Meeting.showModifyPopCard({ view: false });
    },
    onOperateAll() {
      Meeting.modifyRepeatMeetings({});
    },
    onOperateOne() {
      Meeting.modifyOneMeeting({});
    },
  };
})(p => <PatchMeetingDetail {...p} />);
