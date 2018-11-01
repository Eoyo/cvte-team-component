/*
 * @file 团队部分的更改
 * @Date: 2018-09-09 21:53:58 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-10-30 17:22:41
 */
// 返回值body 类型
import { TypeMessageBody } from "../../pushMessageType";
// local DB reducer action
import {
  TEAM_NAME_MODIFY,
  OTHER_JOIN_TEAM,
  LEAVE_TEAM,
} from "../../../../localDB/actions/teams";
// route key
import { teamsSystem } from "../../contants";
import { S } from "../../../../stores";
// user 模型
import { user } from "../../../../localDB/models/contacts";
import { showTeamInfo } from "../../../../view/content/Contact/utils";
import { AddGroupTypes } from "../../../../view/content/AddGroup/AddGroupTypes";
/* ==================== body type ==================== */
// 他人加入团队
export type TypeOtherJoinTeamsMessageBodyData = {
  _id: string;
  team: string;
  user: user;
  from: number;
  createTime: number;
  invitor: user;
}; //teamid //被邀请者的信息 //邀请者的信息

// 团队名称修改
export type TypeTeamsNameModifyMessageBodyData = {
  _id: string;
  name: string;
};
// 退出团队
export type TypeLeaveTeamsMessageBodyData = {
  _id: string; //${teamId}-${memberId}
};

// 推送-团队邀请通知
export type TypeTeamsInviteMessageBodyData = {
  teamId: string;
};

/* ==================== body type ==================== */

// 修改团队名称
export const teamsNameModify = {
  messageRouteKey: teamsSystem.TEAMS__TEAMS__UPDATE,
  reducerActionKey: TEAM_NAME_MODIFY,
  actorTrigger: (data: TypeMessageBody<TypeTeamsNameModifyMessageBodyData>) => {
    console.log(data, "修改团队名称");
    S.GroupMessage.onModifyGroupName({
      groupId: data.data._id,
      name: data.data.name,
    });
    S.addGroup.onModifyGroupName({
      groupId: data.data._id,
      name: data.data.name,
    });
    S.contactListOperation.onModifyGroupName({
      groupId: data.data._id,
      name: data.data.name,
    });
  },
};

// 他人加入团队
export const OtherJoinTeams = {
  messageRouteKey: teamsSystem.TEAMS__TEAM_MEMBERS__ADD,
  reducerActionKey: OTHER_JOIN_TEAM,
  actorTrigger: (data: TypeMessageBody<TypeOtherJoinTeamsMessageBodyData>) => {
    console.log(data, "他人加入团队");
    const { _id: combieIdWithMeetingAndUser, user } = data.data;
    const [teamID, userID] = combieIdWithMeetingAndUser.split("-");
    //todo(ezleo):目前user的name是未知的
    const joinUser: AddGroupTypes.OnePerson = {
      name: "",
      headIconUrl: user.avatar,
      registed: user.systemId ? true : false,
      hasTrueId: false,
      id: user._id || "",
      userPersonalMessage: {
        phone: user.mobile,
        email: user.email,
        department: "",
        jobTitle: "",
      },
    };
    S.GroupMessage.onJoinGroup({ groupId: teamID, user: joinUser });
    S.addGroup.onJoinGroup({ groupId: teamID, user: joinUser });
    S.contactListOperation.onJoinGroup({
      groupId: teamID,
      user: {
        id: user._id || "",
        avatar: user.avatar,
        registed: user.systemId ? true : false,
        email: user.email,
        phone: user.mobile,
        displayName: "",
        remark: "",
        department: "",
        jobTitle: "",
      },
    });
  },
};
// 成员退出团队
export const leaveTeams = {
  messageRouteKey: teamsSystem.TEAMS__TEAM_MEMBERS__DELETE,
  reducerActionKey: LEAVE_TEAM,
  actorTrigger: (data: TypeMessageBody<TypeLeaveTeamsMessageBodyData>) => {
    console.log(data, "成员退出团队");
    let ids = data.data._id.split("-");
    S.GroupMessage.onLeaveGroup({
      groupId: ids[0],
      userId: ids[1],
    });
    S.addGroup.onLeaveGroup({
      groupId: ids[0],
      userId: ids[1],
    });
    S.GroupMessage.onLeaveGroup({
      groupId: ids[0],
      userId: ids[1],
    });
  },
};
