import * as React from "react";
import { Component } from "react";
import { utilsLog } from "../../../../../services/native";
import { PageContentBox } from "../../../common/Layout";
import { ContactTeamContain } from "../ContactTeamContain";

export class TeamsDefaultPage extends Component {
  componentDidMount() {
    utilsLog({ msg: "teams index init" });
  }
  componentDidCatch(error: Error, msg: React.ErrorInfo) {
    utilsLog({
      msg: `contact teams index error message ==> ${error.message} ==== ${msg}`,
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
