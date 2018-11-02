/**
 * 点击右键的操作的弹窗, 绑定操作的回调
 */
import * as React from "react";
import { MeetingListCardProps } from "./MeetingListCardTypes";
import {
  RUl,
  RLi,
} from "../../../../../common/component/RightClickMenu/RightClikMenuStyled";
import { Meeting } from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { fridayPushData } from "src/friday";

// 使用参数透传, MeetingListCard的组件共用同一个参数
export type ClickShowerProps = MeetingListCardProps;

const handleAttendee = (p: ClickShowerProps) => {
  let result: JSX.Element | null;

  let status = p.status;
  if (
    status === "justEnd" ||
    status === "summarySend" ||
    status === "justEnd-summary"
  ) {
    result = (
      <RUl>
        <RLi
          key="deleteMeeting"
          onClick={() => {
            //关闭右键弹出的内容
            Meeting.setRightClickState({
              meetingId: p.meetingId,
              rightClickMenu: false,
            });
            Meeting.setRightClickInfo({
              meetingId: p.meetingId,
              clickType: "delete",
              content: "",
              showRightClickPopCard: true,
              title: "删除后无法恢复，您确定要删除吗？",
              onConfirm: () => {
                p.onRightClick("delete", p.meetingId);
                Meeting.setRightClickInfo({
                  meetingId: p.meetingId,
                  content: "",
                  clickType: "delete",
                  showRightClickPopCard: false,
                  title: "",
                  onConfirm: () => {},
                  onCancel: () => {},
                });
              },
              onCancel: () => {
                Meeting.setRightClickInfo({
                  meetingId: p.meetingId,
                  clickType: "delete",
                  showRightClickPopCard: false,
                  content: "",
                  title: "",
                  onConfirm: () => {},
                  onCancel: () => {},
                });
              },
            });
          }}
          className="menu-item"
        >
          <div className="contactInfomationCard-startInfo-more-operation">
            删除会议
          </div>
        </RLi>
      </RUl>
    );
  } else if (status === "inviting" || status === "inviting-conflict") {
    result = (
      <RUl>
        <RLi
          onClick={() => {
            Meeting.setRightClickState({
              meetingId: p.meetingId,
              rightClickMenu: false,
            });
            p.onRightClick("attending", p.meetingId);
          }}
        >
          加入会议
        </RLi>
        <RLi
          onClick={() => {
            Meeting.setRightClickState({
              meetingId: p.meetingId,
              rightClickMenu: false,
            });
            p.onRightClick("reject", p.meetingId);
          }}
        >
          拒绝会议
        </RLi>
      </RUl>
    );
  } else if (
    status === "waiting" ||
    status === "waiting-update" ||
    status === "inMeeting" ||
    status === "inMeeting-delay" ||
    status === "inMeeting-summary"
  ) {
    result = (
      <RUl>
        <RLi
          onClick={() => {
            Meeting.setRightClickState({
              meetingId: p.meetingId,
              rightClickMenu: false,
            });
            Meeting.setRightClickInfo({
              clickType: "exit",
              meetingId: p.meetingId,
              content: "",
              showRightClickPopCard: true,
              title: "您确定要退出该会议吗？",
              onConfirm: () => {
                p.onRightClick("exit", p.meetingId);
                Meeting.setRightClickInfo({
                  content: "",
                  meetingId: p.meetingId,
                  clickType: "exit",
                  showRightClickPopCard: false,
                  title: "",
                  onConfirm: () => {},
                  onCancel: () => {},
                });
                // 点击退出会议按钮
                fridayPushData({
                  event: "click",
                  attr: {
                    meetingId: p.meetingId,
                  },
                  eventName: "QUIT_MEETING_BUTTON_CLICK",
                });
              },
              onCancel: () => {
                Meeting.setRightClickInfo({
                  clickType: "exit",
                  content: "",
                  showRightClickPopCard: false,
                  meetingId: p.meetingId,
                  title: "",
                  onConfirm: () => {},
                  onCancel: () => {},
                });
              },
            });
          }}
        >
          退出会议
        </RLi>
      </RUl>
    );
  } else {
    result = null;
  }

  return result;
};

const handleCompere = (p: ClickShowerProps) => {
  let result: JSX.Element | null;
  let status = p.status;
  if (
    status === "justEnd" ||
    status === "summarySend" ||
    status === "justEnd-summary"
  ) {
    result = (
      <RUl>
        <RLi
          onClick={() => {
            Meeting.setRightClickState({
              meetingId: p.meetingId,
              rightClickMenu: false,
            });
            Meeting.setRightClickState({
              meetingId: p.meetingId,
              rightClickMenu: false,
            });
            Meeting.setRightClickInfo({
              meetingId: p.meetingId,
              clickType: "delete",
              showRightClickPopCard: true,
              content: "",
              title: "删除后无法恢复，您确定要删除吗？",
              onConfirm: () => {
                p.onRightClick("delete", p.meetingId);
                Meeting.setRightClickInfo({
                  meetingId: p.meetingId,
                  clickType: "delete",
                  showRightClickPopCard: false,
                  content: "",
                  title: "",
                  onConfirm: () => {},
                  onCancel: () => {},
                });
              },
              onCancel: () => {
                Meeting.setRightClickInfo({
                  meetingId: p.meetingId,
                  clickType: "delete",
                  showRightClickPopCard: false,
                  title: "",
                  content: "",
                  onConfirm: () => {},
                  onCancel: () => {},
                });
              },
            });
          }}
        >
          删除会议
        </RLi>
      </RUl>
    );
  } else if (
    status === "waiting" ||
    status === "waiting-update" ||
    status === "inMeeting"
  ) {
    result = (
      <RUl>
        <RLi
          onClick={() => {
            Meeting.setRightClickState({
              meetingId: p.meetingId,
              rightClickMenu: false,
            });
            Meeting.setRightClickInfo({
              meetingId: p.meetingId,
              clickType: "cancel",
              showRightClickPopCard: true,
              title: "您确定要取消此会议？",
              content: "取消后将通知各个参会人，且无法恢复",
              onConfirm: () => {
                p.onRightClick("cancel", p.meetingId);
                Meeting.setRightClickInfo({
                  meetingId: p.meetingId,
                  clickType: "cancel",
                  showRightClickPopCard: false,
                  content: "",
                  title: "",
                  onConfirm: () => {},
                  onCancel: () => {},
                });
              },
              onCancel: () => {
                Meeting.setRightClickInfo({
                  meetingId: p.meetingId,
                  clickType: "cancel",
                  showRightClickPopCard: false,
                  title: "",
                  content: "",
                  onConfirm: () => {},
                  onCancel: () => {},
                });
              },
            });
          }}
        >
          取消预约
        </RLi>
      </RUl>
    );
  } else if (status === "inMeeting-delay" || status === "inMeeting-summary") {
    result = (
      <RUl>
        <RLi
          onClick={() => {
            Meeting.setRightClickState({
              meetingId: p.meetingId,
              rightClickMenu: false,
            });
            p.onRightClick("stop", p.meetingId);
          }}
        >
          结束会议
        </RLi>
      </RUl>
    );
  } else {
    result = null;
  }

  return result;
};

export const ClickShower: React.SFC<ClickShowerProps> = p => {
  let result: JSX.Element | null;
  //参与者
  if (p.role === "attendee") {
    result = handleAttendee(p);
  } else if (p.role === "compere") {
    //发起者
    result = handleCompere(p);
  } else {
    result = null;
  }
  return result;
};
