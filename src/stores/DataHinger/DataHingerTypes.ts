export declare namespace HingerTypes {
  type person = {
    id: string;
    avatar: string;
    displayName: string;
    remark: string;
    sex?: string;
    createTime?: number | string;
    isMailConfig?: boolean;
    personalMessage: {
      email: string;
      phone: string | number;
      department: string;
      jobTitle: string;
    };
    isFriend?: boolean;
  };
  type member = {
    user: person;
    registed: boolean;
    from?: string;
  };
  type group = {
    groupName: string;
    groupId: string;
    createTimeStick: number | string;
    masterId: string;
    members: member[];
  };
  type initState = {
    personList: person[];
    //增，删，改 personId都会放入该数组，
    personChangeIds: string[];
    groupList: group[];
    groupChangeIds: string[];
    //用户自己的信息
    self: person;
    opeType: string;
  };
}
