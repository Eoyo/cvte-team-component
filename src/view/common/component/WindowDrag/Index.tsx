import { Component } from "react";
import * as React from "react";
import { message } from "antd";
import {
  utilsStartWindowDrag,
  utilsStopWindowDrag,
} from "../../../../services/native";
import hoistStatics from "hoist-non-react-statics";

export const windowDrag = (Component: any) => {
  class WindowDrag extends React.Component<any, any> {
    state = { dragId: Math.random() };
    componentDidMount() {
      const dom = document.getElementById(`drag-${this.state.dragId}`);
      if (dom) {
        dom.addEventListener("mouseenter", () => {
          utilsStartWindowDrag();
        });
        dom.addEventListener("mousemove", (ev: any) => {
          if (ev.target !== dom) {
            utilsStopWindowDrag();
          } else {
            utilsStartWindowDrag();
          }
          // ev.stopPropagation();
          // ev.preventDefault();
        });
        dom.addEventListener("mouseleave", () => {
          utilsStopWindowDrag();
        });
      }
    }

    render() {
      const props = { ...this.props, id: `drag-${this.state.dragId}` };

      return React.createElement(Component, props);
    }
  }

  return hoistStatics(WindowDrag, Component);
};
