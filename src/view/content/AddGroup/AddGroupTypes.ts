import { member } from "../../common/component/Avatar/Avatar";

export type AddGroupProps = {
  onGroupAddConfirm: (
    confirm: boolean,
    selectedPerson?: AddGroupTypes.PersonSelector[]
  ) => void;
  title?: string;
};

export namespace AddGroupTypes {
  export type selectState = "selected" | "exited" | "static";

  export type GroupSelectType = "all" | "some" | "none" | "allexist";

  export type OnePerson = {
    name: string;
    headIconUrl: string;
    registed: boolean;
    hasTrueId: boolean;
    id: string;
    userPersonalMessage: {
      phone?: string | number;
      email?: string;
      department: string;
      jobTitle: string;
    };
    isFriend?: boolean;
  };

  export type PersonSelector = OnePerson & {
    select: selectState;
  };

  export type OneGroup = IdValuer & {
    groupName: string;
    groupId: string;
    open: boolean;
    selectType: GroupSelectType;
  };

  export interface IdValuer {
    memberList: PersonSelector[];
    containMemberId: string[];
  }
  export type myGroups = {
    open: boolean;
    groupList: OneGroup[];
  };
  export type myFriend = {
    open: boolean;
  } & IdValuer;
  export type searchPeopleType = {
    searchAble: boolean;
    keywordType: "mobile" | "email" | "";
    searchResult: {
      name: string;
      mobile: string;
      email: string;
      symbol: string;
      addLoading: boolean;
      info: { name: string; members: member[] };
      isAdded: boolean;
      _id: string;
      addStatus: string;
      avatar: string;
      addErrorText: string;
    };
    keyword: string;
  };
  export function createSearchPeopleModel() {
    return <searchPeopleType>{
      searchAble: false,
      keywordType: "",
      searchResult: {
        name: "",
        mobile: "",
        email: "",
        symbol: "",
        addLoading: false,
        info: {
          name: "",
          members: [],
        },
        isAdded: false,
        _id: "",
        addStatus: "",
        addErrorText: "",
        avatar: "",
      },
      keyword: "",
    };
  }
  export type InitState = {
    aimDescription: string;
    exitedId: string[];
    aimGroupId: string;
    onceType: "setGroupId" | "";
    ajaxStatus: {
      type: "fetching" | "done" | "static";
      message: string;
    };
    selectGroup: IdValuer & {
      adding: number;
    };
    myContact: {
      myFriend: myFriend;
      myGroups: myGroups;
    };
    consistentData: {
      memberList: PersonSelector[];
      IdMemberList: {
        [x: string]: PersonSelector;
      };
    };
    searchPeopleModel: searchPeopleType;
  };
}
export const AddGroupInit: AddGroupTypes.InitState = {
  aimDescription: "",
  aimGroupId: "",
  exitedId: [],
  onceType: "",
  selectGroup: {
    memberList: [],
    containMemberId: [],
    adding: 0,
  },
  ajaxStatus: { type: "static", message: "" },
  myContact: {
    myFriend: {
      open: true,
      memberList: [],
      containMemberId: [],
    },
    myGroups: {
      open: false,
      groupList: [],
    },
  },
  consistentData: {
    memberList: [],
    IdMemberList: undefined as any,
  },
  searchPeopleModel: AddGroupTypes.createSearchPeopleModel(),
};
