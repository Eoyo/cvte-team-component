import * as React from "react";
import { HeaderUl, HeaderLi } from "../../common/Layout/Header";
import { ContactSearchAdd } from "./ContactSearchAdd/ContactSearchAddView";
import { C_TeamSearchJoin } from "./TeamSearchJoin/TeamSearchJoin";
import { C_TeamSearchAdd } from "./TeamSearchAdd/TeamSearchAdd";
import { Tooltip } from "antd";
import { S } from "../../../../stores";

export class ContactHeader extends React.Component<{}> {
  state = {
    visible: false,
  };
  componentDidMount() {
    const info = S.Hinger.grab();
    if (info.personList.length === 0 || info.groupList.length === 0) {
      this.setState({ visible: true });
      //设置3s后文案消失
      setTimeout(() => {
        this.setState({ visible: false });
      }, 3000);
    }
  }

  render() {
    return (
      <HeaderUl>
        <HeaderLi key="addContact" className="header_nav_item">
          <Tooltip
            placement="bottom"
            title="在这里添加联系人"
            visible={this.state.visible}
          >
            <ContactSearchAdd
              onConfirm={() => {}}
              onCancel={() => {}}
              currentSelectData={[]}
            />
          </Tooltip>
        </HeaderLi>
        <HeaderLi key="joinTeams" className="header_nav_item">
          <C_TeamSearchJoin />
        </HeaderLi>
        <HeaderLi key="createTeams" className="header_nav_item">
          <C_TeamSearchAdd />
        </HeaderLi>
      </HeaderUl>
    );
  }
}
