import { TeamJoinInput } from "./TeamJoinInput";

/**
 * TeamSearchJoin,
 */
import * as React from "react";
import { Popover } from "antd";
import { Fusion } from "../../../../../stores/Actor/fusion";
import { S } from "../../../../../stores";
export type TeamSearchJoinProps = {
  onChangeVisible(visible: boolean): void;
  popVisible: boolean;
};

// sfc
export const TeamSearchJoin: React.SFC<TeamSearchJoinProps> = p => {
  return (
    <Popover
      placement="bottom"
      overlayClassName="searchInput-popover"
      openClassName="searchInput-popover-open"
      visible={p.popVisible}
      onVisibleChange={p.onChangeVisible}
      trigger="click"
      content={<TeamJoinInput />}
    >
      <div className="main-content-header__nav-item">
        <i className="teams-icon icon-join-team" />
        加入团队
      </div>
    </Popover>
  );
};

// connect
export const C_TeamSearchJoin = Fusion(S.TeamSearchJoin.getStore())<
  TeamSearchJoinProps
>(s => {
  return {
    popVisible: s.popoverVisble,
    onChangeVisible(visible) {
      S.TeamSearchJoin.changePopover({
        popVisible: visible,
      });
    },
  };
})(p => <TeamSearchJoin {...p} />);
