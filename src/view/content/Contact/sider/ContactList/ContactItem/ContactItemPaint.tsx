import * as React from "react";
import { SFC } from "react";
import { contactItem } from "./ContactItemPaintTypes";
import { Menu, Dropdown } from "antd";
import { Avatar } from "../../../../../common/component/Avatar/Avatar";
import { S } from "../../../../../../stores";
interface iContactItemProps {
  info: contactItem.contactItemType;
  type: string;
}
const ContactItem: SFC<iContactItemProps> = ({
  info: { members, name, id },
  type: type,
}) => {
  let tmpMembers: any[] = [];
  for (let i in members) {
    tmpMembers.push({
      userId: members[i].id || "",
      name: members[i].name,
      avatarUrl: members[i].avatar,
    });
  }
  let avatarInfo = {
    name: name,
    members: tmpMembers,
  };
  let menu;
  if (type === "contact") {
    menu = (
      <Menu>
        <Menu.Item className="contactInfomationCard-startInfo-more-wrapper">
          <div
            className="contactInfomationCard-startInfo-more-operation"
            onClick={() => {
              S.contactListOperation.merge({
                deleteContactPopCard: true,
                rightClickContactId: id,
              });
            }}
          >
            删除联系人
          </div>
        </Menu.Item>
      </Menu>
    );
  } else if (type === "team") {
    menu = (
      <Menu>
        <Menu.Item className="contactInfomationCard-startInfo-more-wrapper">
          {/* <div className="contactInfomationCard-startInfo-more-operation contactInfomationCard-startInfo-teams-btn">
            发起团队会议
          </div> */}
          <div
            className="contactInfomationCard-startInfo-more-operation contactInfomationCard-startInfo-teams-btn"
            onClick={() => {
              S.contactListOperation.merge({
                deleteTeamPopCard: true,
                rightClickTeamId: id,
              });
            }}
          >
            退出团队
          </div>
        </Menu.Item>
      </Menu>
    );
  }
  return (
    <Dropdown
      trigger={["contextMenu"]}
      overlay={menu}
      getPopupContainer={() => {
        return (
          document.querySelector(".contacts-menu-wrapper") || document.body
        );
      }}
    >
      <div className="contactitem-wrapper">
        <div className="contactitem-item">
          {(() => {
            if (type === "team") {
              return (
                <Avatar
                  teamsName={name}
                  teamsId={id}
                  className="small-avatar"
                />
              );
            } else {
              return (
                <Avatar
                  avatarUrl={avatarInfo.members[0].avatarUrl}
                  className="small-avatar"
                />
              );
            }
          })()}
          <span className="contactitem-name-font">{name}</span>
        </div>
      </div>
    </Dropdown>
  );
};

export default ContactItem;
