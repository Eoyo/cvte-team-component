import * as React from "react";
import { contactListTypes } from "./ContactListTypes";
import { SFC } from "react";
import { Menu } from "antd";
import ContactItem from "./ContactItem/ContactItemPaint";
import "./style.scss";
import { S } from "../../../../../stores";
import { U } from "../../../../../utils";
import { FusionPro } from "../../../../../stores/utils/fusion";
import { arrCss } from "../../../../../utils/export";
import { AppPivot } from "../../../../../pivot";
const SubMenu = Menu.SubMenu;

interface IContactListProps {
  info: contactListTypes.state;
  contactOpen: boolean;
  contactSelectKey: string;
  teamSelectKey: string;
}

interface ITeamListProps {
  info: contactListTypes.state;
  teamOpen: boolean;
  contactSelectKey: string;
  teamSelectKey: string;
}

let topFontClassName = "contactlist-top-font";
let topShowNumClassName = "contactlist-top-num";

S.Hinger.subscribe(ns => {
  if (ns.opeType === "updateContact") {
    let contacts = [] as contactListTypes.contactInfo[];
    for (let i in ns.personList) {
      let contact: contactListTypes.contactInfo = {
        avatar: ns.personList[i].avatar,
        id: ns.personList[i].id,
        sex: ns.personList[i].sex,
        remark: ns.personList[i].remark,
        phone: ns.personList[i].personalMessage.phone,
        email: ns.personList[i].personalMessage.email,
        displayName: ns.personList[i].displayName,
        department: ns.personList[i].personalMessage.department,
        jobTitle: ns.personList[i].personalMessage.jobTitle,
      };
      contacts.push(contact);
    }
    S.contactListOperation.updateContact({
      contacts: contacts,
    });
    let teams = [] as contactListTypes.teamInfo[];
    for (let i in ns.groupList) {
      let members: any[] = [];
      for (let j in ns.groupList[i].members) {
        let changeMember = ns.groupList[i].members[j];
        members.push({
          id: changeMember.user.id,
          remark: changeMember.user.remark,
          avatar: changeMember.user.avatar,
          registed: changeMember.registed,
          email: changeMember.user.personalMessage.email,
          phone: changeMember.user.personalMessage.phone,
          displayName: changeMember.user.displayName,
          department: changeMember.user.personalMessage.department,
          jobTitle: changeMember.user.personalMessage.jobTitle,
        });
      }
      let teamInfo = {} as contactListTypes.teamInfo;
      teamInfo = {
        members: members,
        id: ns.groupList[i].groupId,
        createTime: ns.groupList[i].createTimeStick,
        name: ns.groupList[i].groupName,
      };
      teams.push(teamInfo);
    }
    S.contactListOperation.updateTeams({
      teams: teams,
    });
  }
});

//排序显示：通过先对每一个name进行排序，重新获取数组。定义两个显示的数组变量，一个是名字开头的组（如：属于#开头的所有联系人的数组），一个是包含的所有组（#,a,b...的数组）
//名字开头的数组通过Menu.groupItem进行包裹即可，所有组把名字开头的组都包含进来即可

const ContactListSfc: SFC<IContactListProps> = ({
  info: { contacts },
  contactOpen: contactOpen,
  contactSelectKey: contactSelectKey,
  teamSelectKey: teamSelectKey,
}) => {
  let showList: any = [];
  let contactsList: any = [];
  let lastWord = "";
  let newWord = "";
  //按照姓名进行排序
  let sortContacts = contacts.sort((param1, param2) => {
    let name1 = param1.remark || param1.displayName;
    let name2 = param2.remark || param2.displayName;
    return U.compareName(name1, name2);
  });
  for (let i = 0; i < sortContacts.length; ++i) {
    let perContact = sortContacts[i];
    let name = perContact.remark || perContact.displayName;
    newWord = U.getFirstLetter(name);
    let member = {
      id: perContact.id,
      name: name,
      avatar: perContact.avatar,
    };
    let info = {
      members: [member],
      name: name,
      id: perContact.id,
    };
    let handleClickLi = () => {
      // window.location.hash = "/contact/friends/" + perContact.id;
      AppPivot.writeRoutes({ routes: ["contact", "friends", perContact.id] });
    };
    //不同的开头单词放入不同的数组中，每组都放到自己的Menu.ItemGroup中
    if (newWord !== lastWord) {
      //如果同一开头的列表存在，就把该数组放到showList中
      if (contactsList.length) {
        showList.push(
          <Menu.ItemGroup key={lastWord} title={lastWord.toLocaleUpperCase()}>
            {contactsList}
          </Menu.ItemGroup>
        );
      }
      contactsList = [];
    }
    contactsList.push(
      <Menu.Item key={perContact.id} onClick={handleClickLi}>
        <ContactItem info={info} type="contact" />
      </Menu.Item>
    );
    lastWord = newWord;
  }
  if (contactsList.length) {
    showList.push(
      <Menu.ItemGroup key={lastWord} title={lastWord.toLocaleUpperCase()}>
        {contactsList}
      </Menu.ItemGroup>
    );
  }
  function handleClickListContacts() {
    S.contactListOperation.showContacts({
      contactsShow: !contactOpen,
    });
  }
  let contactOpenKeys: string[] = [];
  if (contactOpen) {
    contactOpenKeys.push("contactMenu");
  }
  let showClassName = "contactlist-show";
  let hideClassName = "contactlist-hide";
  let selectKeys: string[] = [];
  if (teamSelectKey === "" && contactSelectKey !== "") {
    selectKeys.push(contactSelectKey);
  }
  return (
    <div className="contacts-list">
      <Menu
        className="contactlist-wrap"
        openKeys={contactOpenKeys}
        selectedKeys={[contactSelectKey]}
        mode="inline"
      >
        <SubMenu
          key="contactMenu"
          className="contactlist-contacts"
          onTitleClick={handleClickListContacts}
          title={
            <div className="menu-list-title">
              <span className={topFontClassName}>联系人</span>
              <span className={topFontClassName + " " + topShowNumClassName}>
                {contacts.length}
              </span>
            </div>
          }
        >
          {showList}
          <Menu.Item
            className={
              contacts.length === 0
                ? "contactlist-empty-li " + showClassName
                : hideClassName
            }
            disabled={true}
          >
            <div>暂无联系人</div>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
};

const TeamListSfc: SFC<ITeamListProps> = ({
  info: { teams },
  teamOpen: teamOpen,
  contactSelectKey: contactSelectKey,
  teamSelectKey: teamSelectKey,
}) => {
  function handleClickListTeams() {
    S.contactListOperation.showTeams({
      teamsShow: !teamOpen,
    });
  }
  let teamOpenKeys: string[] = [];
  if (teamOpen) {
    teamOpenKeys.push("teamMenu");
  }
  let lastWord = "";
  let newWord = "";
  let showClassName = "contactlist-show";
  let hideClassName = "contactlist-hide";
  let selectKeys: string[] = [];
  if (teamSelectKey !== "" && contactSelectKey === "") {
    selectKeys.push(teamSelectKey);
  }

  let teamList: JSX.Element[] = [];
  let showList: JSX.Element[] = [];
  for (let i = 0; i < teams.length; ++i) {
    let perTeam = teams[i];
    let members = [] as any[];
    for (let i in perTeam.members) {
      members.push({
        name: perTeam.members[i].remark || perTeam.members[i].displayName,
        id: perTeam.members[i].id,
        avatar: perTeam.members[i].avatar,
      });
    }
    let info = {
      name: perTeam.name,
      id: perTeam.id,
      members: members,
    };
    newWord = U.getFirstLetter(perTeam.name);
    //不同的开头单词放入不同的数组中，每组都放到自己的Menu.ItemGroup中
    if (newWord !== lastWord) {
      //如果同一开头的列表存在，就把该数组放到showList中
      if (teamList.length) {
        showList.push(
          <Menu.ItemGroup key={lastWord} title={lastWord.toLocaleUpperCase()}>
            {teamList}
          </Menu.ItemGroup>
        );
      }
      teamList = [];
    }
    teamList.push(
      <Menu.Item
        key={perTeam.id}
        className="contactlist-per-info"
        onClick={() => {
          AppPivot.writeRoutes({ routes: ["contact", "teams", perTeam.id] });
        }}
      >
        <ContactItem info={info} type="team" />
      </Menu.Item>
    );
    lastWord = newWord;
  }
  if (teamList.length) {
    showList.push(
      <Menu.ItemGroup key={lastWord} title={lastWord.toLocaleUpperCase()}>
        {teamList}
      </Menu.ItemGroup>
    );
  }

  return (
    <div className="teams-list">
      <Menu
        className="contactlist-wrap"
        openKeys={teamOpenKeys}
        selectedKeys={selectKeys}
        mode="inline"
      >
        <SubMenu
          key="teamMenu"
          className="contactlist-contacts"
          onTitleClick={handleClickListTeams}
          title={
            <div className="menu-list-title">
              <span className={topFontClassName}>团队</span>
              <span className={topFontClassName + " " + topShowNumClassName}>
                {teams.length}
              </span>
            </div>
          }
        >
          {showList}
          <Menu.Item
            className={
              teams.length === 0
                ? "contactlist-empty-li " + showClassName
                : hideClassName
            }
            disabled={true}
          >
            <div>暂无团队</div>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
};

// fusion生成redux的容器组件;
const FriendListFusion = FusionPro(
  S.contactListOperation.getStore(),
  s => {
    return {
      contacts: s.contacts,
      contactsShow: s.contactsShow,
      contactSelectKey: s.contactSelectKey,
      teamSelectKey: s.teamSelectKey,
      teams: s.teams,
      teamsShow: s.teamsShow,
      deleteContactPopCard: s.deleteContactPopCard,
      rightClickContactId: s.rightClickContactId,
      deleteTeamPopCard: s.deleteTeamPopCard,
      rightClickTeamId: s.rightClickTeamId,
    };
  },
  function(c) {
    //todo(ezLeo):后面如果联系人列表和团队列表隔离，就要把type也进行隔离
    let info = {
      contacts: c.contacts,
      contactsShow: c.contactsShow,
      contactSelectKey: c.contactSelectKey,
      teamSelectKey: c.teamSelectKey,
      teams: [],
      teamsShow: false,
      deleteContactPopCard: c.deleteContactPopCard,
      rightClickContactId: c.rightClickContactId,
      deleteTeamPopCard: c.deleteTeamPopCard,
      rightClickTeamId: c.rightClickTeamId,
    };
    return (
      <ContactListSfc
        info={info}
        contactOpen={c.contactsShow}
        contactSelectKey={c.contactSelectKey}
        teamSelectKey={c.teamSelectKey}
      />
    );
  }
);

const TeamListFusion = FusionPro(
  S.contactListOperation.getStore(),
  s => {
    return {
      contacts: s.contacts,
      contactsShow: s.contactsShow,
      contactSelectKey: s.contactSelectKey,
      teamSelectKey: s.teamSelectKey,
      teams: s.teams,
      teamsShow: s.teamsShow,
      deleteContactPopCard: s.deleteContactPopCard,
      rightClickContactId: s.rightClickContactId,
      deleteTeamPopCard: s.deleteTeamPopCard,
      rightClickTeamId: s.rightClickTeamId,
    };
  },
  function(c) {
    let info = {
      contacts: [],
      contactsShow: false,
      contactSelectKey: "",
      teamSelectKey: "",
      teams: c.teams,
      teamsShow: c.teamsShow,
      deleteContactPopCard: c.deleteContactPopCard,
      rightClickContactId: c.rightClickContactId,
      deleteTeamPopCard: c.deleteTeamPopCard,
      rightClickTeamId: c.rightClickTeamId,
    };
    return (
      <TeamListSfc
        info={info}
        teamOpen={c.teamsShow}
        contactSelectKey={c.contactSelectKey}
        teamSelectKey={c.teamSelectKey}
      />
    );
  }
);

interface IFriendList {
  className?: string;
}

class FriendList extends React.Component<IFriendList> {
  state = { current: "1" };

  render() {
    return (
      <div className={arrCss(["menu-list-wrapper", this.props.className])}>
        <FriendListFusion />
      </div>
    );
  }
}

interface ITeamList {
  className?: string;
}

class TeamList extends React.Component<ITeamList> {
  state = { current: "1" };

  render() {
    return (
      <div className={arrCss(["menu-list-wrapper", this.props.className])}>
        <TeamListFusion />
      </div>
    );
  }
}

interface IContactList {
  className?: string;
}

class ContactList extends React.Component<IContactList> {
  state = { current: "1" };

  render() {
    return (
      <div className={`contacts-menu-wrapper ${this.props.className}`}>
        <FriendList />
        <TeamList />
      </div>
    );
  }
}

export { ContactList };
