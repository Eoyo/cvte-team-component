/*
 * @file 团队部分的更改
 * @Date: 2018-09-09 21:53:58 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-10-30 17:41:36
 */
// 返回值body 类型
import { TypePushNotificationMessageBody } from "../../pushMessageType";
// local DB reducer action
// import {
//   TEAM_NAME_MODIFY,
//   OTHER_JOIN_TEAM,
//   LEAVE_TEAM,
// } from "../../../../localDB/actions/teams";
// route key
import { pushserviceSystem } from "../../contants";
// user 模型
import { showTeamInfo } from "../../../../view/content/Contact/utils";
/* ==================== body type ==================== */
// 推送-团队邀请通知
export type TypeTeamsInviteMessageBodyData = {
  teamId: string;
};

/* ==================== body type ==================== */

// 推送 - 团队邀请推送通知回调
export const teamsinvitepush = {
  messageRouteKey: pushserviceSystem.PUSH__TEAMS__INVITE,
  reducerActionKey: "",
  actorTrigger: (
    data: TypePushNotificationMessageBody<TypeTeamsInviteMessageBodyData>
  ) => {
    // data.action true 查看 false关闭
    // data.extras.teamId
    console.log("团队邀请推送通知回调", data);
    const {
      action,
      extras: { teamId },
    } = data;
    if (action) {
      showTeamInfo(teamId);
      window.location.hash = `/contact/teams/${teamId}`;
    }
  },
};
