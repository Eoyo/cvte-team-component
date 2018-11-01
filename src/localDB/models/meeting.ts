import { attr, fk, TableState, Model } from "redux-orm";
import { getTheBodyData } from "../utils";
import { commonSelector } from "../utils";

/* ======== schema字段 start ========== */
export type TypeMeetingMember = {
  user: any;
  meeting: string;
  createTime: number;
  state: 0 | 1;
  from: 0 | 1;
  invitor: any;
};
export type TypeAttachment = {
  meetingId: string;
  url: string;
  resId: string;
};
export interface Fields {
  // ${teamId}-${memberid}
  _id: string;
  subject: string;
  content: number;
  beginTime: number;
  address: string;
  master: string;
  state: any;
  creator: any;
  meetingMember: Array<TypeMeetingMember>;
  attachment: Array<TypeAttachment>;
}
export interface Additional {}
export interface VirtualFields {}
/* ======== schema字段 end ========== */

export type MeetingsState = TableState<Fields & Additional>;
export interface MeetingsORMModels {
  Meetings: typeof Meetings;
}
export const modelPrefixName = "Meetings";
import { meetings as MeetingsAction } from "../actions";

export class Meetings extends Model<Fields, Additional, VirtualFields> {
  static modelName = modelPrefixName;

  static fields = {
    _id: attr(),
    user: attr(),
    mobile: attr(),
    email: attr(),
    from: attr(),
    createTime: attr(),
  };
  static options() {
    return { idAttribute: "_id" };
  }

  static reducer(action: any, model: typeof Model, allSession: any) {
    console.group(
      `%c localDB model ${modelPrefixName} reducer`,
      "color: #3296FA;background-color: #ffffff;"
    );
    const { type, payload } = action;
    switch (type) {
      // 会议信息修改
      case MeetingsAction.MEETING_INFO_MODIFY: {
      }
      // 添加成员
      case MeetingsAction.MEETING_MEMBERS_ADD: {
      }
      // 成员退出会议
      case MeetingsAction.MEETING_MEMBERS_DELETE: {
      }
      // 纪要发布
      case MeetingsAction.MEETING_SUMMARIES_PUBLISH: {
      }
      // 成员邀请状态更改
      case MeetingsAction.MEETING_MEMBERS_FEEDBACK: {
      }
      // 会议结束
      case MeetingsAction.MEETINGS_FINISH: {
      }
    }
    console.groupEnd();
  }
}
