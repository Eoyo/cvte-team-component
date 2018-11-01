import * as React from "react";
import styled from "styled-components";
import { MeetingBlockCard } from "../Layout/MeetingBlockCard";
import { flex, pos } from "../../../../../common/ts-styled/flex";

const MeesageToastBlock = styled(MeetingBlockCard)`
  padding: 18px 30px;
`;

const ToastLine = styled("div")`
  ${flex.rowLeft};
  position: static;
`;

export const ToastTool = styled("div")`
  --styled: "toast";
  ${pos.RowRight};
  top: 20px;
  right: 40px;
`;
export const Description = styled("span")`
  --styled: "description";
  margin-left: 20px;
`;
/**
 * MeetingStatusToast,
 */
export type MeetingStatusToastProps = {
  description: any;
  tool: any;
  noticeIcon: any;
};

// sfc
export const MeetingStatusToast: React.SFC<
  MeetingStatusToastProps & { className?: string }
> = p => {
  return (
    <MeesageToastBlock className={p.className}>
      <ToastLine>
        {p.noticeIcon}
        <Description>{p.description}</Description>
        {p.tool}
      </ToastLine>
      {p.children}
    </MeesageToastBlock>
  );
};
