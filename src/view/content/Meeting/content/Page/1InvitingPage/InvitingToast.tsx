import {
  MeetingStatusToast,
  ToastTool,
} from "../../common/StatusToast/MeetingStatusToast";
import * as React from "react";
import { MeetingConnect } from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { S } from "../../../../../../stores";
import styled from "styled-components";
import { InlineBtnSpan } from "../../common/StatusToast/InlineBtnSpan";
import { TitleTool } from "../../common/Layout/TitleLine";
import { Avatar } from "src/view/common/component/Avatar/Avatar";

export const InviteAvatar = styled(Avatar)`
  --styled: "InviteFrom";
  && {
    height: 40px;
    width: 40px;
  }
`;

export const S_InvitingToast = styled(MeetingStatusToast)`
  --styled: "S_InvitingToast";
  padding: 10px 30px;
`;

export const InvitingToastLine = styled(ToastTool)`
  --styled: "InvitingToastLine";
  top: 20px;
`;

export const InvitingToast = MeetingConnect(s => {
  return {
    onConfirm(decide: boolean) {
      if (!decide) {
        S.Meeting.rejectMeeting({});
      } else {
        S.Meeting.acceptMeeting({});
      }
    },
    inviteFrom: s.meetingData.fromName,
    inviteAvatar: s.meetingData.fromAvatar,
  };
})(p => {
  return (
    <S_InvitingToast
      description={
        <span>
          {p.inviteFrom}
          &nbsp; 邀请您加入以下会议
        </span>
      }
      tool={
        <ToastTool>
          <InlineBtnSpan
            onClick={() => {
              p.onConfirm(false);
            }}
            type={"warn"}
          >
            拒绝
          </InlineBtnSpan>
          <InlineBtnSpan
            type={"primary"}
            onClick={() => {
              p.onConfirm(true);
            }}
          >
            加入
          </InlineBtnSpan>
        </ToastTool>
      }
      noticeIcon={<InviteAvatar avatarUrl={p.inviteAvatar} />}
    />
  );
});
