import { Component } from "react";
import * as React from "react";
import { Modal } from "antd";
import { ModalProps } from "antd/lib/modal";
type MainContentModalPropType = {
  [propName: string]: any;
} & ModalProps;

export class MainContentModal extends Component<MainContentModalPropType> {
  render() {
    return (
      <Modal
        {...this.props}
        width={246}
        centered={true}
        style={{
          left: `${310 / 2}px`,
          //   transform: `translateY(-${50 / 2}px)`,
          //   top: `${50 / 2}px`,
        }}
        getContainer={() => {
          return (
            document.querySelector("." + this.props.container) || document.body
          );
        }}
      >
        {this.props.children}
      </Modal>
    );
  }
}
