/**
 * NoticeIcon,
 * MeetingStatusToast's icon;
 */
import * as React from "react";
import styled from "styled-components";
import { Iconsvg } from "../../../../../common/component/Iconsvg";

export const S_NoticeIcon = styled(Iconsvg)`
  --styled: "S_NoticeIcon";
  width: 24px;
  height: 24px;
`;

export type NoticeIconProps = {
  type: "alert" | "ok" | "runningClock" | "waitClock";
};

// sfc
export const NoticeIcon: React.SFC<NoticeIconProps> = p => {
  return <S_NoticeIcon url={"meetingStatusHint/" + p.type + ".svg"} />;
};
