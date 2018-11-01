import * as React from "react";
import { Component } from "react";
import { utilsLog } from "../../../../../services/native";
import { PageContentBox } from "../../../common/Layout";
import { ContactTeamContain } from "../ContactTeamContain";

export class FriendsDefaultPage extends Component {
  componentDidMount() {
    utilsLog({
      msg: "contact friends page init" + window.location.hash,
    });
  }
  componentDidCatch(error: Error, msg: React.ErrorInfo) {
    utilsLog({
      msg: `contact friends index page error message ==> ${
        error.message
      } ==== ${msg}`,
    });
  }
  public render() {
    return (
      <PageContentBox paddingInTopAndBottom={true}>
        <ContactTeamContain />
      </PageContentBox>
    );
  }
}
