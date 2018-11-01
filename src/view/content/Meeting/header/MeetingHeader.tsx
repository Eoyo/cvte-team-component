import * as React from "react";
import { Component } from "react";
import { Tooltip } from "antd";
import { S } from "../../../../stores";
import styled from "styled-components";
import { HeaderUl, HeaderLi } from "../../common/Layout/Header";
import { AirCast } from "./AirCast/Paint";

export const MainContentHeader = styled("div")`
  --styled: "MainContentHeader";
  width: 100%;
  height: 100%;
`;

export const MeetingHeader = class MeetingHeader extends Component {
  state = {
    tooltipVisible: false,
  };
  componentDidMount() {
    const meetingSnapshotList = S.Meeting.grab().meetingSnapshot;

    // 初次加载提示 开始预研一个会议.
    if (meetingSnapshotList && meetingSnapshotList.length === 0) {
      setTimeout(() => {
        this.setState({
          tooltipVisible: true,
        });
      });
      setTimeout(() => {
        this.setState({
          tooltipVisible: false,
        });
      }, 3000);
    }
  }
  public render() {
    return (
      <HeaderUl>
        <HeaderLi
          key="schedulemeeting"
          className="header_nav_item"
          onClick={() => {
            S.Meeting.createSchedule({});
          }}
        >
          <Tooltip
            placement="bottom"
            title="想要同步纪要与文件？来约个会吧！"
            trigger={"focus"}
            visible={this.state.tooltipVisible}
          >
            <div className="main-content-header__nav-item">
              <i className="teams-icon icon-apply-meeting" />
              预约会议
            </div>
          </Tooltip>
        </HeaderLi>
        <HeaderLi className="header_nav_item no-class_header_nav">
          <div className="aircast-diver" />
        </HeaderLi>
        <HeaderLi key="aircast" className="header_nav_item">
          <div className="main-content-header__nav-item">
            <AirCast />
          </div>
        </HeaderLi>
      </HeaderUl>
    );
  }
};
