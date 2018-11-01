type integer = number;
export type response = {
  user: string; // 用户 id
  meeting: {
    _id: string; // 会议 id
    subject: string; // 会议主题
    content: string; // 会议的内容描述
    beginTime: string; // 会议开始时间
    endTime: string; // 会议结束时间
    address: string; // 会议地点
    masterId: string; // 主持人 id
    state: integer;
    noteState: integer;
    note: string; // 会议纪要内容
    members: {
      user: {
        _id: string; // 用户 id
        email: string; // 邮箱
        mobile: string; // 手机号
        createTime: string; // 用户创建时间
        isMailConfig: string; // 邮箱是否配置
        avatar: string; // 头像地址
        displayName: string; // 用户昵称
        systemId: string; // 对应账号系统的 id
      };
      meeting: string; // 会议 id
      createTime: string; // 加入会议的时间
      state: integer;
      from: integer;
      invitor: {
        _id: string; // 用户 id
        email: string; // 邮箱
        mobile: string; // 手机号
        createTime: string; // 用户创建时间
        isMailConfig: string; // 邮箱是否配置
        avatar: string; // 头像地址
        displayName: string; // 用户昵称
        systemId: string; // 对应账号系统的 id
      };
    }[];
  };
  member: {
    user: {
      _id: string; // 用户 id
      email: string; // 邮箱
      mobile: string; // 手机号
      createTime: string; // 用户创建时间
      isMailConfig: string; // 邮箱是否配置
      avatar: string; // 头像地址
      displayName: string; // 用户昵称
      systemId: string; // 对应账号系统的 id
    };
    meeting: string; // 会议 id
    createTime: string; // 加入会议的时间
    state: integer;
    from: integer;
    invitor: {
      _id: string; // 用户 id
      email: string; // 邮箱
      mobile: string; // 手机号
      createTime: string; // 用户创建时间
      isMailConfig: string; // 邮箱是否配置
      avatar: string; // 头像地址
      displayName: string; // 用户昵称
      systemId: string; // 对应账号系统的 id
    };
  };
  noteContent: string; // 我的会议笔记
  noteSubject: string; // 我的会议笔记主题
  inviteState: integer;
  summaryState: integer;
  invitor: {
    _id: string; // 用户 id
    email: string; // 邮箱
    mobile: string; // 手机号
    createTime: string; // 用户创建时间
    isMailConfig: string; // 邮箱是否配置
    avatar: string; // 头像地址
    displayName: string; // 用户昵称
    systemId: string; // 对应账号系统的 id
  };
}[];
