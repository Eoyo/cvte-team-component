import { AddGroupTypes } from "../AddGroupTypes";
import { Act } from "../../../../stores/Actor/actor";

export const ormOperateGroup = Act<AddGroupTypes.InitState>()({
  onModifyGroupName: {
    groupId: "",
    name: "",
  },
  onJoinGroup: {
    groupId: "",
    user: {} as AddGroupTypes.OnePerson,
  },
  onLeaveGroup: {
    groupId: "",
    userId: "",
  },
})({
  onModifyGroupName: (s, a) => {
    let groupList = [...s.myContact.myGroups.groupList];
    let group = groupList.find(param => {
      return param.groupId === a.groupId;
    });
    if (group) {
      group.groupName = a.name;
    }
    return {
      myContact: {
        myGroups: {
          groupList: [...groupList],
        },
      },
    };
  },
  onJoinGroup: (s, a) => {
    let groupList = [...s.myContact.myGroups.groupList];
    let consistentData = { ...s.consistentData };
    let group = groupList.find(param => {
      return param.groupId === a.groupId;
    });
    if (group) {
      let contacts = s.myContact.myFriend.memberList;
      //判断是否是好友
      let contact = contacts.find(param => {
        return param.id === a.user.id;
      });
      let isFriend = false;
      if (contact) {
        isFriend = true;
      }
      a.user.isFriend = isFriend;
      let addUser: AddGroupTypes.PersonSelector = {
        ...a.user,
        select: "static",
      };
      group.memberList.push(addUser);
      group.containMemberId.push(a.user.id);
      consistentData.memberList.push(addUser);
    }
    return {
      myContact: {
        myGroups: {
          groupList,
        },
      },
      consistentData: consistentData,
    };
  },
  onLeaveGroup: (s, a) => {
    let groupList = [...s.myContact.myGroups.groupList];
    let group = groupList.find(param => {
      return param.groupId === a.groupId;
    });
    if (group) {
      let index = group.memberList.findIndex(param => {
        return param.id === a.userId;
      });
      if (index !== -1) {
        group.memberList.splice(index, 1);
      }
    }
    return {
      myContact: {
        myGroups: {
          groupList,
        },
      },
    };
  },
});
