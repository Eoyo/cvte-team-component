import { message } from "antd";
import * as React from "react";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";

// 修改会议详情的按钮.
export const C_ModifyMeetingDetail = MeetingConnect(s => {
  return {
    onClickModify() {
      Meeting.setDetailStatus({
        status: "editing",
      });
    },
    isModifyOK: s.meetingPage.loading.detailEditing < 1,
  };
})(p => {
  return (
    <div className="btn-group">
      <div
        onClick={
          p.isModifyOK
            ? () => {
                p.onClickModify();
              }
            : () => {
                message.error("详情正在修改中");
              }
        }
        className={"group-members-addmembers-button"}
      >
        <i
          className="teams-icon icon-edit"
          style={{
            margin: 0,
          }}
        />
        {/* <span className="group-members-addmembers-text">修改会议详情</span> */}
      </div>
    </div>
  );
});
