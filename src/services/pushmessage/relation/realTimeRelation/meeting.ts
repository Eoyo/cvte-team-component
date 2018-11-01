/*
 * @file 会议部分的更改   
 * @Date: 2018-09-09 21:24:39 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-10-30 17:38:12
 */

import { S } from "../../../../stores";

// 会议 model reducer key
import {
  MEETING_INFO_MODIFY,
  MEETING_MEMBERS_ADD,
  MEETING_MEMBERS_DELETE,
  MEETING_SUMMARIES_PUBLISH,
  MEETINGS_FINISH,
  MEETING_MEMBERS_FEEDBACK,
} from "../../../../localDB/actions/meeting";

import {
  TypeMessageBody,
  TypePushNotificationMessageBody,
} from "../../pushMessageType";
import { teamsSystem } from "../../contants";
// user 模型
import { user } from "../../../../localDB/models/contacts";
import { app } from "../../../../stores/app/app";
// 会议信息修改
export type TypeMeetingMeesageInfoModifyMessageBodyData = {
  _id: string;
  subject: string;
  content: string;
  beginTime: number;
  endTime: number;
};

// 会议成员邀请
export type TypeMeetingMembersInviteMessageBodyData = {
  // 会议 id + memberid 组合成一个唯一的会议成员 id
  _id: string;
  user: user;
  invitor: user;
  state: number;
  meeting: string;
};

// 退出会议
export type TypeLeaveMeetingMessageBodyData = {
  _id: string;
};

// 发布纪要
export type TypeMeetingSummaryReleaseMessageBodyData = {
  _id: string;
};

// 结束会议
export type TypeMeetingFinishMessageBodyData = {
  _id: string;
  state: number;
};

// 会议成员确认、拒绝通知
export type TypeMeetingMembersOperateInvitionMessageBodyData = {
  _id: string;
  state: 1 | 2;
  // 1为拒绝，2为确认
};

// 推送系统消息推送
export type TypeSystemPushMessageBodyData = {};
// 会议邀请通知推送
export type TypeMeetingInviteMessageBodyData = {
  meetingId: string;
};
export type TypeMeetingSummaryPublishBodyData = {
  meetingId: string;
};

// 会议信息修改
export const modifyMeetingInfo = {
  messageRouteKey: teamsSystem.TEAMS__MEETINGS__UPDATE,
  reducerActionKey: MEETING_INFO_MODIFY,
  actorTrigger: (
    data: TypeMessageBody<TypeMeetingMeesageInfoModifyMessageBodyData>
  ) => {
    // TODO 补充地址
    console.log(data, "会议信息修改");
    S.Meeting.onMeetingInfoModify({
      meetingId: data.data._id,
      subject: data.data.subject,
      content: data.data.content,
      beginTime: data.data.beginTime,
      endTime: data.data.endTime,
    });
  },
};

// 会议成员邀请
export const meetingMemberChange = {
  messageRouteKey: teamsSystem.TEAMS__MEETING_MEMBERS__ADD,
  reducerActionKey: MEETING_MEMBERS_ADD,
  actorTrigger: (
    data: TypeMessageBody<TypeMeetingMembersInviteMessageBodyData>
  ) => {
    // TODO user 需要验证补全
    console.log(data, "会议成员邀请");
    let user: any = data.data.user;
    let ids = data.data._id.split("-");
    S.Meeting.onMemberInvite({
      meetingId: ids[0],
      memberId: ids[1],
      user: {
        avatar: user.avatar,
        name: user.name,
        id: user.id,
        participationStatus: "participant",
        invitationStatus: "wait",
        personalMessage: {
          email: user.email,
          phone: user.phone,
        },
        registed: user.systemId ? true : false,
        department: user.department,
        jobTitle: user.jobTitle,
      },
    });
  },
};

// 成员退出会议
export const meetingLeave = {
  messageRouteKey: teamsSystem.TEAMS__MEETING_MEMBERS__DELETE,
  reducerActionKey: MEETING_MEMBERS_DELETE,
  actorTrigger: (data: TypeMessageBody<TypeLeaveMeetingMessageBodyData>) => {
    console.log(data, "退出会议");
    let ids = data.data._id.split("-");
    const myUserData = app.get("userData");
    // @zeyu 这里是某个成员退出会议，自己本身是没有触发退出会议动作的
    if (ids[1] !== myUserData._id) {
      S.Meeting.onMemberLeave({
        meetingId: ids[0],
        memberId: ids[1],
      });
    }
  },
};

// 结束会议
export const meetingFinish = {
  messageRouteKey: teamsSystem.TEAMS__MEETINGS__FINISH,
  reducerActionKey: MEETINGS_FINISH,
  actorTrigger: (data: TypeMessageBody<TypeMeetingFinishMessageBodyData>) => {
    console.log(data, "结束会议");
    //   S.Meeting.
    S.Meeting.stopMeeting({
      meetingId: data.data._id,
    });
  },
};

// 会议成员确认、拒绝通知
export const meeting = {
  messageRouteKey: teamsSystem.TEAMS__MEETING_MEMBERS__FEEDBACK,
  reducerActionKey: MEETING_MEMBERS_FEEDBACK,
  actorTrigger: (
    data: TypeMessageBody<TypeMeetingMembersOperateInvitionMessageBodyData>
  ) => {
    console.log(data, "会议成员确认、拒绝通知");
    let ids = data.data._id.split("-");
    S.Meeting.onMemberFeedback({
      meetingId: ids[0],
      memberId: ids[1],
      state: data.data.state,
    });
  },
};
