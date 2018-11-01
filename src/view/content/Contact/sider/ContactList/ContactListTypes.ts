export namespace contactListTypes {
  export type contactInfo = {
    avatar: string;
    id: string; //每个用户的唯一标识
    sex?: string;
    remark: string;
    displayName: string;
    phone?: string | number;
    registed?: boolean;
    email?: string;
    department: string;
    jobTitle: string;
  };

  export type teamInfo = {
    members: contactInfo[];
    name: string;
    id: string;
    createTime: number | string;
  };

  export type state = {
    //todo(ezLeo):把数组改成key value是不是会更好
    contacts: contactInfo[];
    contactsShow: boolean;
    contactSelectKey: string; //当前选中显示的menu item
    deleteContactPopCard: boolean;
    rightClickContactId: string;
    teamSelectKey: string;
    teams: teamInfo[];
    teamsShow: boolean;
    deleteTeamPopCard: boolean;
    rightClickTeamId: string;
  };
}

export const ContactListInit: contactListTypes.state = {
  contacts: [],
  contactsShow: true,
  contactSelectKey: "",
  deleteContactPopCard: false,
  rightClickContactId: "",
  teamSelectKey: "",
  teams: [],
  teamsShow: true,
  deleteTeamPopCard: false,
  rightClickTeamId: "",
};
