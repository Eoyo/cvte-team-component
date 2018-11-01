/* =================== 消息 =================== */

// 会议信息修改
export const TEAMS__MEETINGS__UPDATE = "meetings.update";
// 会议成员邀请
export const TEAMS__MEETING_MEMBERS__ADD = "meeting_members.add";
// 他人加入团队
export const TEAMS__TEAM_MEMBERS__ADD = "team_members.add";
// 团队名称修改
export const TEAMS__TEAMS__UPDATE = "teams.update";
// 退出会议
export const TEAMS__MEETING_MEMBERS__DELETE = "meeting_members.delete";
// 退出团队
export const TEAMS__TEAM_MEMBERS__DELETE = "team_members.delete";
// 纪要发布
export const TEAMS__MEETING_SUMMARIES__PUBLISH = "meeting_summaries.publish";
// 会议结束
export const TEAMS__MEETINGS__FINISH = "meetings.finish";
// 会议成员确认、拒绝通知
export const TEAMS__MEETING_MEMBERS__FEEDBACK = "meeting_members.feedback";
// 会议归档
export const TEAMS__MEETINGS__ARCHIVE = "meetings.archive";
// 会议开始
export const TEAMS__MEETINGS__BEGIN = "meetings.begin";
// 会议取消
export const TEAMS__MEETINGS__CANCEL = "meetings.cancel";

// 增加联系人
export const TEAMS__CONTACTS__ADD = "contacts.add";
// 修改联系人的备注
export const TEAMS__CONTACTS__MODIFY_REMARK = "contacts.modify_remark";
// 删除联系人
export const TEAMS__CONTACTS__DELETE = "contacts.delete";

/* =================== 推送 =================== */
// 普通的消息推送
export const PUSH__MESSAGE__PUSH = "message.push";
// 团队邀请通知
export const PUSH__TEAMS__INVITE = "teams.invite";
// 会议邀请通知
export const PUSH__MEETINGS__INVITE = "meetings.invite";
// 会议即将开始通知
export const PUSH__MEETINGS__WILLBE_START = "meetings.willBeStart";
// 会议纪要发布通知
export const PUSH__MEETING_SUMMARIES__PUBLISH = "meeting_summaries.publish";
// 会议取消通知
export const PUSH__MEETING__CANCEL = "meetings.cancel";
// 会议结束通知
export const PUSH__MEETING__FINISH = "meetings.finish";

export const teamsSystem = {
  TEAMS__MEETINGS__UPDATE,
  TEAMS__MEETING_MEMBERS__ADD,
  TEAMS__TEAM_MEMBERS__ADD,
  TEAMS__TEAMS__UPDATE,
  TEAMS__MEETING_MEMBERS__DELETE,
  TEAMS__TEAM_MEMBERS__DELETE,
  TEAMS__MEETINGS__FINISH,
  TEAMS__MEETING_MEMBERS__FEEDBACK,
  TEAMS__CONTACTS__ADD,
  TEAMS__CONTACTS__MODIFY_REMARK,
  TEAMS__CONTACTS__DELETE,
};
export const pushserviceSystem = {
  PUSH__MESSAGE__PUSH,
  PUSH__TEAMS__INVITE,
  PUSH__MEETINGS__INVITE,
  PUSH__MEETINGS__WILLBE_START,
  PUSH__MEETING_SUMMARIES__PUBLISH,
  PUSH__MEETING__CANCEL,
  PUSH__MEETING__FINISH,
};
// 消息 domain
export const allRouteKeyByDomain = {
  teams: teamsSystem,
  pushservice: pushserviceSystem,
};
