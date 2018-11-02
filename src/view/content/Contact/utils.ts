import { app as AppStore } from "../../../stores/app/app";
import { http } from "../../../services/http";
import { S } from "../../../stores";
import { isResOK } from "../../../utils/Restful";
import { HingerTypes } from "../../../stores/DataHinger/DataHingerTypes";
import { AddGroupTypes } from "../AddGroup/AddGroupTypes";

function getSelfInfo() {
  let data = AppStore.get("userData");
  let self: HingerTypes.person = {
    id: data._id,
    avatar: data.avatar,
    displayName: data.displayName,
    remark: data.remark,
    createTime: data.createTime,
    isMailConfig: data.isMailConfig,
    personalMessage: {
      phone: data.mobile,
      email: "",
      department: data.department || "",
      jobTitle: data.jobTitle || "",
    },
  };
  S.Hinger.setSelfInfo({
    self: self,
  });
}

export async function getContact() {
  getSelfInfo();
  let data = AppStore.get("userData");
  //获取联系人列表
  let d = await http.contacts.getContact(
    { urluserId: data._id },
    {
      headers: {
        "x-user-id": data._id,
      },
    }
  );

  if (isResOK(d)) {
    let personList: HingerTypes.person[] = [];
    for (let i in d.value) {
      let contactInfo: HingerTypes.person = {
        id: d.value[i].person._id,
        displayName: d.value[i].person.displayName,
        remark: d.value[i].remark,
        avatar: d.value[i].person.avatar,
        personalMessage: {
          email: d.value[i].person.email,
          phone: d.value[i].person.mobile,
          department: d.value[i].person.department,
          jobTitle: d.value[i].person.jobTitle,
        },
        isFriend: true,
      };
      personList.push(contactInfo);
    }
    S.Hinger.setContactsData({
      personList: personList,
    });
    setTimeout(() => {
      // 获取了数据后同不选择的teams
      showContactInfos(
        S.contactListOperation.grab(s => {
          return s.contactSelectKey;
        })
      );
    });
  }
  //TODO: (ezLeo):目前没做错误处理
}

export async function getTeam() {
  let data = AppStore.get("userData");
  //获取联系人列表
  let d = await http.contacts.getTeamList(
    { userId: data._id },
    {
      headers: {
        "x-user-id": data._id,
      },
    }
  );

  if (isResOK(d)) {
    let groupInfos: HingerTypes.group[] = [];
    for (let i in d.value) {
      let value = d.value[i];
      let members: HingerTypes.member[] = [];
      for (let j in value.members) {
        let member: HingerTypes.member = {
          user: {
            id: "",
            avatar: "",
            displayName: "",
            remark: "",
            personalMessage: {
              email: "",
              phone: "",
              department: "",
              jobTitle: "",
            },
          },
          registed: false,
        };
        let user = value.members[j].user;
        if (user) {
          if (user.systemId) {
            member.user.id = user._id;
            member.user.avatar = user.avatar || "";
            member.user.displayName = user.displayName || "";
            member.user.remark = "";
            member.user.personalMessage.phone = user.mobile || "";
            // if (user.isMailConfig) {
            //@ts-ignore; mail is config;
            member.user.personalMessage.email = user.email;
            member.user.personalMessage.jobTitle = user.jobTitle;
            member.user.personalMessage.department = user.department;
            // }
            member.registed = true;
          } else {
            // 电话邀请的使用电话为id;
            member.user.id = user._id;
            member.user.avatar = user.avatar || "";
            member.user.displayName = "";
            member.user.remark = "";
            member.registed = false;
            member.user.personalMessage.phone = user.mobile || "";
            member.user.personalMessage.email = user.email || "";
            member.user.personalMessage.jobTitle = user.jobTitle;
            member.user.personalMessage.department = user.department;
          }
          members.push(member);
        }
      }
      let groupInfo: HingerTypes.group = {
        groupName: value.name,
        groupId: value._id.toString(),
        createTimeStick: value.createTime,
        masterId: value.masterId,
        members: members,
      };

      groupInfos.push(groupInfo);
    }
    S.Hinger.setTeamsData({
      groupList: groupInfos,
    });

    setTimeout(() => {
      // 获取了数据后同不选择的teams
      showTeamInfos(
        S.contactListOperation.grab(s => {
          return s.teamSelectKey;
        })
      );
    });
  }
  //todo(ezLeo):目前没做错误处理
}

function showTeamInfos(key: string) {
  if (!key) return;
  const { teams, contacts } = S.contactListOperation.grab();
  const team = teams.find(item => item.id === key);
  if (team) {
    const members: AddGroupTypes.OnePerson[] = team.members.map(member => {
      return {
        id: member.id,
        name: member.remark || member.displayName,
        headIconUrl: member.avatar,
        registed: member.registed || false,
        hasTrueId: !!member.id,
        userPersonalMessage: {
          email: member.email || "",
          phone: member.phone || "",
          department: member.department,
          jobTitle: member.jobTitle,
        },
        isFriend: !!contacts.find(contact => contact.id === member.id),
      };
    });
    S.GroupMessage.merge({
      groupMessage: {
        groupName: team.name,
        groupId: team.id,
        createTimeStick: team.createTime,
      },
      groupMemberlist: {
        value: members,
      },
    });
  } else {
    // fetch 获取团队信息
    getTeam();
  }
  // for (let i in teams) {
  //   if (teams[i].id === key) {
  //     let members: AddGroupTypes.OnePerson[] = [];
  //     for (let j in teams[i].members) {
  //       let isFriend = false;
  //       let member = teams[i].members[j];
  //       if (
  //         contacts.find(param => {
  //           return param.id === member.id;
  //         })
  //       ) {
  //         isFriend = true;
  //       }
  //       let tmpMember: AddGroupTypes.OnePerson = {
  //         id: member.id,
  //         name: member.remark || member.displayName,
  //         headIconUrl: member.avatar,
  //         registed: member.registed || false,
  //         hasTrueId: !!member.id,
  //         userPersonalMessage: {
  //           email: member.email || "",
  //           phone: member.phone || "",
  //           department: member.department,
  //           jobTitle: member.jobTitle,
  //         },
  //         isFriend: isFriend,
  //       };
  //       members.push(tmpMember);
  //     }
  // S.GroupMessage.merge({
  //   groupMessage: {
  //     groupName: teams[i].name,
  //     groupId: teams[i].id,
  //     createTimeStick: teams[i].createTime,
  //   },
  //   groupMemberlist: {
  //     value: members,
  //   },
  // });
  // break;
  // }
  // }
}

export function showTeamInfo(key: string) {
  //让列表显示聚焦在新增加的内容
  S.contactListOperation.selectMenuItem({
    contactType: "team",
    key: key,
  });
  showTeamInfos(key);
}
function showContactInfos(key: string) {
  if (!key) return;

  setTimeout(() => {
    S.contactInfomationCardOperation.showOperation({
      id: key,
    });
  });
  setTimeout(() => {
    S.contactListOperation.showContacts({
      contactsShow: true,
    });
  });
}
export function showContactInfo(key: string) {
  S.contactListOperation.selectMenuItem({
    contactType: "contact",
    key: key,
  });
  showContactInfos(key);
}
