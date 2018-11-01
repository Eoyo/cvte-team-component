import * as React from "react";
import { Component } from "react";
import { utilsLog } from "../../../../../services/native";
import { PageContentBox } from "../../../common/Layout";
import { ContactInfomationCard } from "./ContactInfomationCard/ContactInfomationCardPaint";

export class FriendsPage extends Component {
  componentDidMount() {
    utilsLog({
      msg: "detail page init" + window.location.hash,
    });
  }
  componentDidCatch(error: Error, msg: React.ErrorInfo) {
    utilsLog({
      msg: `contact friends detail page error message ==> ${
        error.message
      } ==== ${msg}`,
    });
  }

  public render() {
    return (
      <PageContentBox paddingInTopAndBottom={true}>
        <ContactInfomationCard className="contact-list-card friend-style" />
      </PageContentBox>
    );
  }
}
