import * as React from "react";
import { TimePickerWrapper } from "./TimePickerConfirmStyle";
import { Ele } from "../../../common/ts-styled/ele";

export const TimePickerConfirmGroup: React.SFC<{
  timeStr?: any;
  onClose?(): void;
  onConfirm?(): void;
  onClear?(): void;
  className?: string;
}> = p => {
  return (
    <TimePickerWrapper className={p.className}>
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
    </TimePickerWrapper>
  );
};
