import * as React from "react";
import { Component } from "react";
import { utilsLog } from "../../../../../services/native";
import { PageContentBox } from "../../../common/Layout";
import { ContainGroupMessage } from "./GroupMessage/GroupMessagePaint";

export class TeamsPage extends Component {
  info: any;
  componentDidMount() {
    utilsLog({ msg: "teams detail init" });
  }
  componentDidCatch(error: Error, msg: React.ErrorInfo) {
    utilsLog({
      msg: `contact teams detail error message ==> ${
        error.message
      } ==== ${msg}`,
    });
  }
  public render() {
    return (
      <PageContentBox paddingInTopAndBottom={true}>
        <div className="contact-list-card team-style">
          <ContainGroupMessage />
        </div>
      </PageContentBox>
    );
  }
}
