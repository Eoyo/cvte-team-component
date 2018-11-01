import { cloneDeep } from "lodash";
import { U } from "../../utils";
import { HingerTypes } from "./DataHingerTypes";

const tool = {
  // 给定id找到某个人的信息
  findOnePerson(s: HingerTypes.initState, id: string) {
    const one = s.personList.find(onep => {
      return onep.id === id;
    });
    return one;
  },

  removeContact(s: HingerTypes.initState, id: string) {
    for (let i in s.groupList) {
      for (let j in s.groupList[i].members) {
        let member = s.groupList[i].members[j];
        if (member.user.id === id) {
          member.user.isFriend = false;
          member.user.remark = "";
        }
      }
    }
  },
  //获取给定id在联系人列表中的位置
  getContactListPosition(s: HingerTypes.initState, id: string) {
    let position = -1;
    for (let i = 0; i < s.personList.length; ++i) {
      if (s.personList[i].id === id) {
        position = i;
        break;
      }
    }
    return position;
  },
  //把团队内和联系人列表中一致的联系人做成一致的
  updateTeamContactFromContact(
    s: HingerTypes.initState,
    id: string,
    teamId?: string
  ) {
    let pos = this.getContactListPosition(s, id);
    let changeIds: any = [];
    if (pos < 0) {
      return changeIds;
    }
    for (let i in s.groupList) {
      //如果给定teamid,并且找到了改team，那么就进行赋值操作，然后break
      if (teamId && s.groupList[i].groupId === teamId) {
        for (let j in s.groupList[i].members) {
          let member = s.groupList[i].members[j];
          //如果团队中有该联系人，那么就设置为列表中的引用
          if (member.user.id === id) {
            changeIds.push(s.groupList[i].groupId);
            member.user = s.personList[pos];
          }
        }
        break;
      } else if (!teamId) {
        //没有给定teamId，那就遍历所有的团队
        for (let j in s.groupList[i].members) {
          let member = s.groupList[i].members[j];
          //如果团队中有该联系人，那么就设置为列表中的引用
          if (member.user.id === id) {
            changeIds.push(s.groupList[i].groupId);
            member.user = s.personList[pos];
          }
        }
      }
    }
    return changeIds;
  },
  //比较两个团队的内容的差距，然后返回有改变的团队id
  compareGroups(
    lastGroups: HingerTypes.group[],
    newGroups: HingerTypes.group[]
  ) {
    let changeIds: string[] = [];
    let lastGroupsMap = {},
      newGroupsMap = {};
    for (let i = 0; i < lastGroups.length; ++i) {
      let id = lastGroups[i].groupId;
      lastGroupsMap[id] = lastGroups[i];
    }
    for (let i = 0; i < newGroups.length; ++i) {
      let id = newGroups[i].groupId;
      newGroupsMap[id] = newGroups[i];
    }
    for (let id in newGroupsMap) {
      if (lastGroupsMap[id]) {
        let str1 = JSON.stringify(newGroupsMap[id]);
        let str2 = JSON.stringify(lastGroupsMap[id]);
        if (str1 !== str2) {
          changeIds.push(id);
        }
      } else {
        changeIds.push(id);
      }
    }
    return changeIds;
  },
  alwaysUpdateContactInfo(ns: HingerTypes.initState) {
    for (let i in ns.personList) {
      //显示的名字没有则显示电话,或邮箱
      let name =
        ns.personList[i].displayName ||
        "" + ns.personList[i].personalMessage.phone ||
        ns.personList[i].personalMessage.email;
      ns.personList[i].displayName = name;
    }
    //排序团队
    ns.groupList = ns.groupList.sort((param1, param2) => {
      return U.compareName(param1.groupName, param2.groupName);
    });
  },
};

export { tool as DataHingerTool };
