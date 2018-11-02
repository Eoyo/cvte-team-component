/*
 * @file 会议部分的更改   
 * @Date: 2018-09-09 21:24:39 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-11-01 17:54:29
 */

import { S } from "../../../../stores";

// 会议 model reducer key
// import { MEETING_SUMMARIES_PUBLISH } from "../../../../localDB/actions/meeting";

import { TypePushNotificationMessageBody } from "../../pushMessageType";
import { pushserviceSystem } from "../../contants";

// 推送系统消息推送
export type TypeSystemPushMessageBodyData = {};
// 会议邀请通知推送
export type TypeMeetingInviteMessageBodyData = {
  meetingId: string;
};
export type TypeMeetingSummaryPublishBodyData = {
  meetingId: string;
};
// 会议结束提醒
export type TypeMeetingFinishBodyData = {
  meetingId: string;
};
// 取消
export type TypeMeetingCancelBodyData = {
  meetingId: string;
};

// 推送 - 系统推送通知回调
export const meetingpush = {
  messageRouteKey: pushserviceSystem.PUSH__MESSAGE__PUSH,
  reducerActionKey: "",
  actorTrigger: (
    data: TypePushNotificationMessageBody<TypeSystemPushMessageBodyData>
  ) => {
    console.log("普通消息推送通知");
  },
};
// 推送 - 会议邀请通知回调
export const meetinginvite = {
  messageRouteKey: pushserviceSystem.PUSH__MEETINGS__INVITE,
  reducerActionKey: "",
  actorTrigger: (
    data: TypePushNotificationMessageBody<TypeMeetingInviteMessageBodyData>
  ) => {
    const {
      action,
      extras: { meetingId },
    } = data;
    if (action) {
      window.location.hash = "meeting";
      setTimeout(() => {
        S.Meeting.acceptMeeting({ meetingId });
      });
      // hardcode 就这样吧 = =
      setTimeout(() => {
        S.Meeting.focusOneMeeting({ aimId: meetingId });
      }, 500);
    } else {
      S.Meeting.rejectMeeting({ meetingId });
    }
    // data.action true false同意和拒绝
    console.log("会议邀请通知");
  },
};
export const meetingSummaryPunblish = {
  messageRouteKey: pushserviceSystem.PUSH__MEETING_SUMMARIES__PUBLISH,
  reducerActionKey: "",
  actorTrigger: (
    data: TypePushNotificationMessageBody<TypeMeetingSummaryPublishBodyData>
  ) => {
    console.log(data, "发布纪要");
    const {
      action,
      extras: { meetingId },
    } = data;
    if (action) {
      window.location.hash = "meeting";
      setTimeout(() => {
        S.Meeting.onSummaryPublish({
          meetingId: meetingId,
        });
        // 强制刷新列表
        S.Meeting.fetchMeetingList({});
      });
    }
  },
};

export const meetingFinishNotify = {
  messageRouteKey: pushserviceSystem.PUSH__MEETING__FINISH,
  reducerActionKey: "",
  actorTrigger: (
    data: TypePushNotificationMessageBody<TypeMeetingFinishBodyData>
  ) => {
    console.log(data, "会议结束提醒");
    const {
      action,
      extras: { meetingId },
    } = data;
    if (action) {
      window.location.hash = "meeting";
      setTimeout(() => {
        S.Meeting.stopMeeting({
          meetingId,
        });
        // 强制刷新列表
        S.Meeting.fetchMeetingList({});
      });
    }
  },
};

export const meetingCancel = {
  messageRouteKey: pushserviceSystem.PUSH__MEETING__CANCEL,
  reducerActionKey: "",
  actorTrigger: (
    data: TypePushNotificationMessageBody<TypeMeetingFinishBodyData>
  ) => {
    console.log(data, "会议取消提醒");
    const {
      action,
      extras: { meetingId },
    } = data;
    // window.location.hash = "meeting";
    // setTimeout(() => {
    // S.Meeting.stopMeeting({
    //   meetingId,
    // });
    // 强制刷新列表
    S.Meeting.fetchMeetingList({});
    // });
  },
};
