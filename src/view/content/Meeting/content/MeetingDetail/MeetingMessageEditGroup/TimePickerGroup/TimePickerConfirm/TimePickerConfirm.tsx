import * as React from "react";
import { Ele } from "src/view/common/ts-styled/ele";
import { arrCss } from "src/utils/export";
import "./TimePickerConfirm.scss";

export const TimePickerConfirmGroup: React.SFC<{
  timeStr?: any;
  onClose?(): void;
  onConfirm?(): void;
  onClear?(): void;
  className?: string;
}> = p => {
  return (
    <div className={arrCss([p.className, "picker-popup-info-wrapper"])}>
      <div className="picker-popup-info-text">
        {/* {getValue(dateState, startTimeState, endTimeState)} */}
        {p.timeStr}
        {p.onClear ? (
          <span className="clear-span" onClick={p.onClear}>
            清空
          </span>
        ) : null}
      </div>
      <div className="picker-popup-btn-wrapper">
        <div className="picker-popup-btn-space" />
        <Ele.secondBtn onClick={p.onClose}>取消</Ele.secondBtn>
        <div className="picker-popup-btn-space" />
        <Ele.secondBtn type={"primary"} disable={false} onClick={p.onConfirm}>
          确定
        </Ele.secondBtn>
      </div>
    </div>
  );
};
