import { Component } from "react";
import * as React from "react";
import styled from "styled-components";
import { Iconsvg } from "../../../common/component/Iconsvg";
import {
  system,
  utilsCloseWindow,
  utilsMaximizeWindow,
  utilsNormalizeWindow,
  utilsMinimizeWindow,
  utilsOnWindowStateChanged,
  UTILS_ON_WINDOW_STATE_CHANGED_RESPONSE_TYPE,
} from "../../../../services/native";
/**
 * 兼容mac 或者 window的特定样式
 */

export const WindowTopToolbar = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 135px;
  height: 100%;
  padding: 0 13px 0 38px;
`;
const Icon = styled(Iconsvg)`
  --styled: "Mac-Toolbar";
  width: 10px;
  height: 10px;
`;

class Close extends Component {
  render() {
    return (
      <Icon
        url={"toolbar/window/close/"}
        type={"square"}
        onClick={utilsCloseWindow}
      />
    );
  }
}
class Max extends Component {
  state = {
    currentStatus: 0,
  };
  componentDidMount() {
    utilsOnWindowStateChanged(
      (ret: UTILS_ON_WINDOW_STATE_CHANGED_RESPONSE_TYPE) => {
        this.setState({
          currentStatus: Number(ret.state),
        });
      }
    );
  }
  render() {
    const flag = this.state.currentStatus === 2;
    return flag ? (
      <Icon
        url={"toolbar/window/normal/"}
        type={"square"}
        onClick={() => {
          utilsNormalizeWindow();
        }}
      />
    ) : (
      <Icon
        url={"toolbar/window/max/"}
        type={"square"}
        onClick={() => {
          utilsMaximizeWindow();
        }}
      />
    );
  }
}

class Min extends Component {
  render() {
    return (
      <Icon
        url={"toolbar/window/min/"}
        type={"square"}
        onClick={utilsMinimizeWindow}
      />
    );
  }
}

// class WindowToolBar extends Comment {
export const WindowToolbar: React.SFC<any> = p => {
  return system.win ? (
    <WindowTopToolbar>
      <Min />
      <Max />
      <Close />
    </WindowTopToolbar>
  ) : (
    <div />
  );
};
