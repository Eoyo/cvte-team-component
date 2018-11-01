import { AddGroupTypes } from "../../../../AddGroup/AddGroupTypes";

export type GroupMessageState = {
  groupMessage: {
    groupName: string;
    groupId: string;
    createTimeStick: number | string;
    isEditable: boolean; //是否正在编辑的状态
    lastEditName: string; //如果是编译状态，那么编辑的内容是啥
  };
  groupMemberlist: {
    value: AddGroupTypes.OnePerson[];
  };
  showCreateGroup: boolean;
};
export const GroupMessageInitState: GroupMessageState = {
  groupMemberlist: { value: [] },
  groupMessage: {
    groupName: "",
    groupId: "",
    createTimeStick: Date.now(),
    isEditable: false,
    lastEditName: "",
  },
  showCreateGroup: false,
};
