/**
 * 确认是否需有是否保存编辑
 */
import * as React from "react";

import "./ConfirmDetailModify.scss";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";
import { Ele } from "../../../../../../common/ts-styled/ele";
import { checkMeetingInfo } from "../../../../../../../pivot/Meeting/Actor/Tools/checkMeetingInfo";
export type ConfirmDetailModifyProps = {
  onConfirm(decide: boolean): void;
  disable: boolean;
};

export const C_ConfirmModify = MeetingConnect<ConfirmDetailModifyProps>(s => {
  return {
    onConfirm(decide) {
      decide ? Meeting.modifyDetail({}) : Meeting.cancelModifyDetail({});
    },
    disable: !checkMeetingInfo(s),
  };
})(p => {
  return (
    <div className="btn-group place-right">
      <Ele.secondBtn
        onClick={() => {
          p.onConfirm(false);
        }}
      >
        取消
      </Ele.secondBtn>
      <Ele.secondBtn
        onClick={() => {
          //如果按钮可用，才可以进行操作
          if (p.disable === false) {
            p.onConfirm(true);
          }
        }}
        disable={p.disable}
        type="primary"
      >
        确认修改
      </Ele.secondBtn>
    </div>
  );
});
