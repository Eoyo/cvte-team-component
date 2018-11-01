import { Component } from "react";
import * as React from "react";
import { utilsLog } from "../../../services/native";
import { getTeam, getContact } from "./utils";
import { Layout_HSC1 } from "../common/Layout";
import { ContactHeader } from "./header/Header";
import { Route } from "react-router";
import { Switch } from "react-router-dom";
import { ScrollbarContain } from "../common/ScrollbarContain/ScrollbarContain";
import { ContactList } from "./sider/ContactList/ContactListPaint";
import { FriendsPage } from "./content/friends/DetailPage";
import { TeamsPage } from "./content/teams/DetailPage";
import { FriendsDefaultPage } from "./content/friends/IndexPage";
import { TeamsDefaultPage } from "./content/teams/IndexPage";
import { C_PopGroupMemberSelector } from "./content/teams/GroupMessage/PopGroupMemberSelector";
import { C_TeamDeletePop } from "./sider/DeletePopCard/TeamDeletePop";
import { C_ContactDeletePop } from "./sider/DeletePopCard/ContactDeletePop";

export class CantactPage extends Component {
  constructor(props: any) {
    super(props);
  }
  async componentDidMount() {
    await getContact();
    await getTeam();
    utilsLog({ msg: "contact page init" });
  }
  componentDidCatch(error: Error, msg: React.ErrorInfo) {
    utilsLog({
      msg: `contact page error message ==> ${error.message} ==== ${msg}`,
    });
  }
  public render() {
    return (
      <Layout_HSC1
        Header={<ContactHeader />}
        Sider={
          <ScrollbarContain
            className="contact-list-scroll"
            niceScrollConfig={{
              railpadding: {
                right: 3,
              },
            }}
          >
            <ContactList className="contact-list-section" />
          </ScrollbarContain>
        }
        Content={
          <Switch>
            <Route path="/contact/friends/:friendId" component={FriendsPage} />
            <Route path="/contact/teams/:teamId" component={TeamsPage} />
            <Route path="/contact/friends" component={FriendsDefaultPage} />
            <Route path="/contact/teams" component={TeamsDefaultPage} />
            <Route path="/" component={TeamsDefaultPage} />
          </Switch>
        }
        footer={
          <>
            <C_PopGroupMemberSelector />
            <C_TeamDeletePop />
            <C_ContactDeletePop />
          </>
        }
      />
    );
  }
}
