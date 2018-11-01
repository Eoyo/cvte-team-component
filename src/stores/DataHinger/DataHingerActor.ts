import { redux } from "../utils/redux";
import { Various } from "../utils/various";
import { DataHingerTool } from "./DataHingerTool";
import { cloneDeep } from "lodash";
import { HingerTypes } from "./DataHingerTypes";
import { Actor } from "../Actor/actor";

const initState: HingerTypes.initState = {
  personList: [],
  personChangeIds: [],
  groupList: [],
  groupChangeIds: [],
  self: {
    id: "",
    avatar: "",
    remark: "",
    displayName: "",
    personalMessage: {
      email: "",
      phone: "",
      department: "",
      jobTitle: "",
    },
  },
  opeType: "",
};

export const Hinger = Actor(initState)({
  setSelfInfo: {
    self: {} as HingerTypes.person,
  },
  //设置所有的的联系人信息，用于拉取列表
  setContactsData: {
    personList: [] as HingerTypes.person[],
  },
  //插入联系人信息
  insertContactData: {
    person: {} as HingerTypes.person,
  },
  //更新联系人的一些属性
  updateContactProperty: {
    id: "",
    changeProperty: {} as Partial<HingerTypes.person>,
  },
  //移除联系人
  removeContact: {
    id: "",
  },
  //清空所有联系人
  clearContacts: {},
  setTeamsData: {
    groupList: [] as HingerTypes.group[],
  },
  insertTeamData: {
    group: {} as HingerTypes.group,
  },
  //团队增加人
  teamInsertPerson: {
    groupId: "",
    person: {} as HingerTypes.person,
    registed: false,
  },
  //团队移除人
  teamRemovePerson: {
    groupId: "",
    personId: "",
  },
  updateTeamProperty: {
    groupId: "",
    //要修改的属性，使用者自定义
    changeProperty: {} as Partial<HingerTypes.group>,
    //改变用户的属性，可以为空
    members: [
      {
        id: "",
        changeProperty: {} as Partial<HingerTypes.person>,
      },
    ],
  } as {
    members?: {
      id: string;
      changeProperty: Partial<HingerTypes.person>;
    }[];
    groupId: string;
    //要修改的属性，使用者自定义
    changeProperty: Partial<HingerTypes.group>;
  },
  removeTeam: {
    groupId: "",
  },
  clearTeams: {},
})({
  setSelfInfo(s, d) {
    return Various(s)(ns => {
      ns.self = d.self;
    });
  },
  //增删改
  setContactsData(s, d) {
    return Various(s)(ns => {
      ns.personList = d.personList;
      let changeIdsMap = {};
      for (let i in d.personList) {
        d.personList[i].isFriend = true;
        let changeIds: any[] = [];
        changeIds = DataHingerTool.updateTeamContactFromContact(
          ns,
          d.personList[i].id
        );
        for (let i in changeIds) {
          changeIdsMap[changeIds[i]] = 1;
        }
      }
      ns.groupChangeIds = [];
      for (let key in changeIdsMap) {
        ns.groupChangeIds.push(key);
      }
      ns.opeType = "updateContact";
    });
  },
  insertContactData(s, d) {
    return Various(s)(ns => {
      ns.personChangeIds = [];
      ns.groupChangeIds = [];
      d.person.isFriend = true;
      ns.personList.push(d.person);
      ns.groupChangeIds = DataHingerTool.updateTeamContactFromContact(
        ns,
        d.person.id
      );
      ns.personChangeIds.push(d.person.id);
      ns.opeType = "updateContact";
    });
  },
  updateContactProperty(s, d) {
    return Various(s)(ns => {
      ns.personChangeIds = [];
      ns.groupChangeIds = [];
      let id = d.id;
      ns.personChangeIds.push(id);
      let index;
      //查找要改变的id
      for (let i in ns.personList) {
        if (ns.personList[i].id === id) {
          index = i;
          break;
        }
      }
      //遍历所有要改变的类型，并且进行改变
      for (let key in d.changeProperty) {
        if (index !== undefined) {
          let person: HingerTypes.person = ns.personList[index];
          person[key] = d.changeProperty[key];
        }
      }
      ns.opeType = "updateContact";
    });
  },
  //目前删除联系人不改变团队改联系人的信息，会等待轮询拉取时才改变
  removeContact(s, d) {
    return Various(s)(ns => {
      ns.personChangeIds = [];
      ns.groupChangeIds = [];
      //查找要删除的id
      let pos = DataHingerTool.getContactListPosition(ns, d.id);
      DataHingerTool.removeContact(ns, d.id);
      ns.personChangeIds.push(d.id);
      ns.opeType = "updateContact";
      if (pos === undefined) {
        return;
      }
      ns.personList.splice(pos, 1);
    });
  },
  clearContacts(s, d) {
    return Various(s)(ns => {
      for (let i in ns.personList) {
        ns.personList[i].isFriend = false;
      }
      ns.personList = [];
      ns.opeType = "updateContact";
    });
  },
  setTeamsData: (s, d) => {
    return Various(s)(ns => {
      let lastGroupList = cloneDeep(ns.groupList);
      ns.groupList = d.groupList;
      for (let i in d.groupList) {
        let findSelf = false;
        for (let j in d.groupList[i].members) {
          let member = d.groupList[i].members[j];
          let personId = member.user.id;
          if (personId === s.self.id) {
            findSelf = true;
          }
        }
        //如果团队中没有自己，就把自己加到团队中
        if (findSelf === false) {
          ns.groupList[i].members.push({
            user: s.self,
            registed: true,
          });
        }
      }
      //更新团队中的联系人为联系人列表中的联系人
      for (let i in ns.personList) {
        DataHingerTool.updateTeamContactFromContact(ns, ns.personList[i].id);
      }
      DataHingerTool.alwaysUpdateContactInfo(ns);
      //比较之前的grouplist和目前拉取到的grouplist
      ns.groupChangeIds = DataHingerTool.compareGroups(
        lastGroupList,
        ns.groupList
      );
      //如果有改变，那么就设置opeType
      if (ns.groupChangeIds.length !== 0) {
        ns.opeType = "updateContact";
      } else {
        ns.opeType = "";
      }
    });
  },
  insertTeamData: (s, d) => {
    return Various(s)(ns => {
      ns.personChangeIds = [];
      ns.groupChangeIds = [];
      ns.groupList.push(d.group);
      let findSelf = false;
      for (let i in d.group.members) {
        let id = d.group.members[i].user.id;
        if (id === ns.self.id) {
          findSelf = true;
        }
        DataHingerTool.updateTeamContactFromContact(ns, id, d.group.groupId);
      }
      //如果team中没有加用户自己，就把用户自己加到团队中
      if (findSelf === false) {
        ns.groupList[ns.groupList.length - 1].members.push({
          registed: true,
          user: ns.self,
        });
      }
      ns.groupChangeIds.push(d.group.groupId);
      ns.opeType = "updateContact";
    });
  },
  updateTeamProperty(s, d) {
    return Various(s)(ns => {
      ns.personChangeIds = [];
      ns.groupChangeIds = [];
      let id = d.groupId;
      let index: string | undefined = undefined;
      ns.groupChangeIds.push(id);
      //查找要改变的id
      for (let i in ns.groupList) {
        if (ns.groupList[i].groupId === id) {
          index = i;
          break;
        }
      }
      //遍历所有要改变的类型，并且进行改变
      for (let key in d.changeProperty) {
        if (index !== undefined) {
          let group: HingerTypes.group = ns.groupList[index];
          group[key] = d.changeProperty[key];
          if (key === "members") {
            for (let i in group[key]) {
              DataHingerTool.updateTeamContactFromContact(
                ns,
                group[key][i].user.id,
                ns.groupList[index].groupId
              );
            }
          }
        }
      }
      if (index !== undefined && d.members) {
        //改变成员的属性
        for (let i in d.members) {
          let changeMember = d.members[i];
          let members = ns.groupList[index].members;
          for (let j in members) {
            if (members[j].id === changeMember.id) {
              let orgPerson = members[j];
              for (let key in changeMember.changeProperty) {
                orgPerson[key] = changeMember.changeProperty[key];
              }
            }
          }
        }
      }
      ns.opeType = "updateContact";
    });
  },
  teamInsertPerson(s, d) {
    return Various(s)(ns => {
      ns.personChangeIds = [];
      ns.groupChangeIds = [d.groupId];
      for (let i in ns.groupList) {
        if (ns.groupList[i].groupId === d.groupId) {
          ns.groupList[i].members.push({
            user: d.person,
            registed: d.registed,
            from: "",
          });
          DataHingerTool.updateTeamContactFromContact(
            ns,
            d.person.id,
            d.groupId
          );
        }
      }
      ns.opeType = "updateContact";
    });
  },
  teamRemovePerson(s, d) {
    return Various(s)(ns => {
      ns.personChangeIds = [];
      ns.groupChangeIds = [d.groupId];
      //查找等于给定groupid的团队
      for (let i in ns.groupList) {
        if (ns.groupList[i].groupId === d.groupId) {
          let members = ns.groupList[i].members;
          //查找等于给定personId的人
          for (let j = 0; j < members.length; ++j) {
            if (d.personId === members[j].user.id) {
              //删除找到的人
              ns.groupList[i].members.splice(j, 1);
              break;
            }
          }
        }
      }
      ns.opeType = "updateContact";
    });
  },
  removeTeam(s, d) {
    return Various(s)(ns => {
      ns.personChangeIds = [];
      ns.groupChangeIds = [d.groupId];
      let index: number | undefined = undefined;
      //查找要删除的id
      for (let i = 0; i < ns.groupList.length; ++i) {
        if (ns.groupList[i].groupId === d.groupId) {
          index = i;
          break;
        }
      }
      if (index !== undefined) {
        ns.groupList.splice(index, 1);
      }
      ns.opeType = "updateContact";
    });
  },
  clearTeams: (s, d) => {
    return Various(s)(ns => {
      ns.groupList = [];
      ns.opeType = "updateContact";
    });
  },
  always: s => {
    return Various(s)(ns => {
      //如果是更新联系人的操作，那么就更新联系人相关内容
      if (ns.opeType === "updateContact") {
        DataHingerTool.alwaysUpdateContactInfo(ns);
      }
    });
  },
});
