import { contactListTypes } from "../ContactListTypes";
import { Act } from "../../../../../../stores/Actor/actor";

export const ormOperateGroup = Act<contactListTypes.state>()({
  onModifyGroupName: {
    groupId: "",
    name: "",
  },
  onJoinGroup: {
    groupId: "",
    user: {} as contactListTypes.contactInfo,
  },
  onLeaveGroup: {
    groupId: "",
    userId: "",
  },
})({
  onModifyGroupName: (s, a) => {
    let teams = [...s.teams];
    let team = teams.find(param => {
      return param.id === a.groupId;
    });
    if (team) {
      team.name = a.name;
    }
    return {
      teams: teams,
    };
  },
  onJoinGroup: (s, a) => {
    let teams = [...s.teams];
    let team = teams.find(param => {
      return param.id === a.groupId;
    });
    if (team) {
      let user = team.members.find(param => {
        return param.id === a.user.id;
      });
      if (!user) {
        team.members.push({
          id: a.user.id,
          displayName: a.user.displayName,
          remark: a.user.remark,
          avatar: a.user.avatar,
          registed: a.user.registed,
          email: a.user.email,
          phone: a.user.phone,
          department: a.user.department,
          jobTitle: a.user.jobTitle,
        });
      }
    }
    return {
      teams,
    };
  },
  onLeaveGroup: (s, a) => {
    let teams = [...s.teams];
    let team = teams.find(param => {
      return param.id === a.groupId;
    });
    if (team) {
      let index = team.members.findIndex(param => {
        return param.id === a.userId;
      });
      if (index !== -1) {
        team.members.splice(index, 1);
      }
    }
    return {
      teams,
    };
  },
});
