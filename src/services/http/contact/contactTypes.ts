export type addContactURLType = {
  urluserId: string;
};
export type addContactBodyType = {
  mobile?: string;
  email?: string;
  id?: string;
};
export type addContactResponseType = {
  person: {
    _id: string;
    email: string;
    displayName: string;
    mobile: string | number;
    createTime: number | string;
    isMailConfig: boolean;
    avatar: string;
    jobTitle: string;
    department: string;
  };
  remark: string;
  from: number;
  createTime: number | string;
  userId: string;
};
export type getContactURLType = {
  urluserId: string;
};
export type getContactBodyType = {};

export type getContactResponseType = [
  {
    person: {
      _id: string;
      email: string;
      displayName: string;
      mobile: string | number;
      createTime: number | string;
      isMailConfig: boolean;
      avatar: string;
      jobTitle: string;
      department: string;
    };
    remark: string;
    from: string;
    createTime: number | string;
    userId: string;
  }
];

export type deleteContactURLType = {
  urluserId: string;
  urlpersonId: string;
};

export type deleteContactBodyType = {};

export type deleteContactResponseType = {};
export type searchContactBodyType = {
  mobile?: string;
  email?: string;
};

// 创建团队
export type createTeamBodyType = {
  name: string;
};
// 搜索团队
export type searchTeamURLType = {
  teamId: string;
};
export type searchTeamResponseType = {
  _id: string;
  name: string;
  createTime: string | number;
  masterId: string;
  members: [
    {
      userId: string;
      mobile: string | number;
      email: string;
      from: string;
      createTime: string | number;
    }
  ];
};
export type joinTeamURLType = {
  teamId: string;
};
export type leaveTeamURLType = {
  teamId: string;
  userId: string;
};
export type getTeamListURLType = {
  userId: string;
};

export type getTeamListResponseType = {
  _id: number;
  name: string;
  createTime: number | string;
  creatorId: string;
  masterId: string;
  members: {
    from: number;
    _id: string;
    team: number;
    createTime: number | string;
    user?: {
      _id: string;
      displayName?: string;
      email?: string;
      mobile?: number | string;
      avatar?: string;
      createTime?: number | string;
      isMailConfig?: boolean;
      systemId?: string;
      department: string;
      jobTitle: string;
    };
  }[];
};

export type changeRemarkURLType = {
  userId: string;
  personId: string;
};
