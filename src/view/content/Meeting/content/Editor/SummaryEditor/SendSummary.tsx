/**
 * @发出纪要
 */

import * as React from "react";
import styled, { css } from "styled-components";
import { Ele } from "../../../../../common/ts-styled/ele";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { Iconsvg } from "../../../../../common/component/Iconsvg";

export const S_Button = styled(Ele.secondBtn)`
  --styled: "S_Button";
  transition: all 0.3s;
  width: 88px;
  text-overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  ${(p: { displayType: "text" | "ok-btn" }) => {
    if (p.displayType === "text") {
      return css`
        width: 64px;
        height: 26px;
      `;
    } else if (p.displayType === "ok-btn") {
      return css`
        width: 20px;
        height: 20px;
      `;
    } else {
      return;
    }
  }};
`;

const IconBtn = styled(Iconsvg)`
  width: 18px;
  height: 18px;
`;

// connected component;
// 只是用connected后的组件
export type SendSummaryProps = {
  onSend: () => void;
  type: "text" | "ok-btn";
};
export const C_SendSummary = MeetingConnect<SendSummaryProps>(s => {
  return {
    onSend() {
      Meeting.setSendSummaryPopState({ show: true });
    },
    type: s.meetingPage.isSummaryFocus ? "ok-btn" : "text",
  };
})(p => {
  return (
    <S_Button onClick={p.onSend} type="primary" displayType={p.type}>
      {p.type === "text" && "发送"}
      {p.type === "ok-btn" && (
        <IconBtn url="/meetingStatusHint/ok.svg" onClick={p.onSend} />
      )}
    </S_Button>
  );
});
