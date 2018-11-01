import { attr, TableState, Model, ORMId } from "redux-orm";
import {
  getTheBodyData,
  findItemByCustomIndex,
  commonSelector,
} from "../utils";

/* ======== schema字段 start ========== */
export type TypeTeamMember = {
  // ${teamId}-${memberid}
  _id: string;
  team: string;
  user: any;
  mobile: string;
  email: string;
  from: 0 | 1;
  createTime: number;
};
export interface Fields {
  _id: string;
  createTime: string | number;
  name: string;
  masterId: string;
  teamMembers: Array<TypeTeamMember>;
}
export interface Additional {}
export interface VirtualFields {}
/* ======== schema字段 end ========== */

export type TeamsState = TableState<Fields & ORMId & Additional>;
export interface TeamsORMModels {
  Teams: typeof Teams;
}
export const modelPrefixName = "Teams";
import { teams as TeamsAction } from "../actions";

export class Teams extends Model<Fields, Additional, VirtualFields> {
  static modelName = modelPrefixName;

  static fields = {
    _id: attr(),
    createTime: attr(),
    name: attr(),
    masterId: attr(),
    teamMembers: attr({
      getDefault: () => {
        return [];
      },
    }),
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
      // 创建一个团队
      case TeamsAction.CREATE_TEAM: {
        const { createTime, name, masterId, teamMembers, _id } = getTheBodyData(
          payload
        );
        const _targetTeam = model.withId(_id);
        if (_targetTeam) {
          model
            .withId(_id)
            .update({ _id, createTime, name, masterId, teamMembers });
        } else {
          model.create({ _id, createTime, name, masterId, teamMembers });
        }
        break;
      }
      // 删除一个团队
      case TeamsAction.DELETE_TEAM: {
        const { _id: id } = getTheBodyData(payload);
        const _targetTeam = model.withId(id);
        if (_targetTeam) {
          _targetTeam.delete();
        }
        break;
      }
      // 修改团队名称
      case TeamsAction.TEAM_NAME_MODIFY: {
        const { name, _id: id } = getTheBodyData(payload);
        const _targetTeam = findItemByCustomIndex(model, id);
        console.log(_targetTeam);
        if (_targetTeam) {
          _targetTeam.update({ name });
        }
        break;
      }
      // 他人加入团队，团队成员邀请
      case TeamsAction.OTHER_JOIN_TEAM: {
        const {
          name,
          _id: teamCombinepersonId,
          team: teamId,
          user,
          from,
          createTime,
        } = getTheBodyData(payload);
        const _targetTeam = model.withId(teamId);
        console.log(_targetTeam, teamId);
        if (_targetTeam) {
          const originData: Array<TypeTeamMember> =
            _targetTeam.teamMembers || [];
          originData.push({
            _id: teamCombinepersonId,
            team: teamId,
            user,
            mobile: "",
            email: "",
            from,
            createTime,
          });
          _targetTeam.update({ teamMembers: originData });
        }
        break;
      }
      // 退出团队
      case TeamsAction.LEAVE_TEAM: {
        const { _id: teamCombinepersonId } = getTheBodyData(payload);
        const teamId = teamCombinepersonId.split("-")[0];
        const _targetTeam = model.withId(teamId);
        console.log(_targetTeam, teamId);
        if (_targetTeam) {
          let originData: Array<TypeTeamMember> = _targetTeam.teamMembers || [];
          originData = originData.filter(item => {
            item._id !== teamCombinepersonId;
          });
          _targetTeam.update({ teamMembers: originData });
        }
        break;
      }
    }
    console.groupEnd();
  }
}

export const getTeamsInfo = (id: string) =>
  commonSelector((session: any) => {
    const _data = findItemByCustomIndex(session.Teams, id);
    console.log(_data);
    if (_data) {
      return _data.ref;
    } else {
      return _data;
    }
  });
