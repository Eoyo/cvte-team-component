/*
 * @file 会议部分的更改   
 * @Date: 2018-09-09 21:24:39 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-10-30 17:42:06
 */

import { S } from "../../../../stores";

// 会议 model reducer key
import { MEETING_SUMMARIES_PUBLISH } from "../../../../localDB/actions/meeting";

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
      // S.Meeting.focusOneMeeting({ aimId: meetingId });
    } else {
      S.Meeting.rejectMeeting({ meetingId });
    }
    // data.action true false同意和拒绝
    console.log("会议邀请通知");
  },
};
export const meetingSummaryPunblish = {
  messageRouteKey: pushserviceSystem.PUSH__MEETING_SUMMARIES__PUBLISH,
  reducerActionKey: MEETING_SUMMARIES_PUBLISH,
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
      });
    }
  },
};
