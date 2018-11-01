import { Component } from "react";
import * as React from "react";
import { Meeting } from "../../../../pivot/Meeting/Actor/MeetingActor";

export type ModalCloseProps = {
  onClickClose(): void;
  className?: string;
};

export class ModalClose extends Component<ModalCloseProps> {
  state = {
    clickClose: false,
  };
  render() {
    return (
      <i
        onClick={e => {
          this.props.onClickClose();
          Meeting.setAddressSelector({ show: false });
        }}
        onMouseEnter={e => {
          this.setState({
            clickClose: true,
          });
        }}
        onMouseLeave={e => {
          this.setState({
            clickClose: false,
          });
        }}
        className={
          this.props.className +
          " " +
          (this.state.clickClose ? "icon-close-pressed" : "icon-close-normal")
        }
      />
    );
  }
}
