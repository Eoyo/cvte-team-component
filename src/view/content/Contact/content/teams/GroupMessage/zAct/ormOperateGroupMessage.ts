import { GroupMessageState } from "../GroupMessageTypes";
import { Act } from "../../../../../../../stores/Actor/actor";
import { AddGroupTypes } from "../../../../../AddGroup/AddGroupTypes";
import { S } from "../../../../../../../stores";

export const ormOperateGroupMessage = Act<GroupMessageState>()({
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
    const groupMessage = { ...s.groupMessage };
    if (a.groupId === groupMessage.groupId) {
      groupMessage.groupName = a.name;
    }
    return {
      groupMessage,
    };
  },
  onJoinGroup: (s, a) => {
    const groupMessage = { ...s.groupMessage };
    const groupMemberList = { ...s.groupMemberlist };
    const isFriend = !!S.contactListOperation
      .grab()
      .contacts.find((item: any) => {
        return item.id === a.user.id;
      });
    // todo @zeyu 头像和昵称信息不全
    const userData: AddGroupTypes.OnePerson = { ...a.user };
    if (a.groupId === groupMessage.groupId) {
      const user = groupMemberList.value.find(param => {
        return param.id === a.user.id;
      });
      userData.isFriend = isFriend;
      userData.registed = !!userData.id;
      if (!user) {
        groupMemberList.value.push(userData);
      }
    }

    return {
      groupMemberlist: groupMemberList,
    };
  },
  onLeaveGroup: (s, a) => {
    const groupMessage = { ...s.groupMessage };
    const groupMemberList = { ...s.groupMemberlist };
    if (a.groupId === groupMessage.groupId) {
      const index = groupMemberList.value.findIndex(param => {
        return param.id === a.userId;
      });
      if (index !== -1) {
        groupMemberList.value.splice(index, 1);
      }
    }
    return {
      groupMemberlist: groupMemberList,
    };
  },
});
