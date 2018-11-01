/**
 * TeamSearchAdd,
 */
// import "./TeamSearchAdd.scss";
import { C_TeamSearchInput } from "./TeamSearchInput";
import { Popover } from "antd";
import * as React from "react";
import { Fusion } from "../../../../../stores/Actor/fusion";
import { S } from "../../../../../stores";

export type TeamSearchAddProps = {
  onChangeVisible(visible: boolean): void;
  popVisible: boolean;
};

// sfc
export const TeamSearchAdd: React.SFC<TeamSearchAddProps> = p => {
  return (
    <Popover
      placement="bottomRight"
      overlayClassName="searchInput-popover team-search-add"
      openClassName="searchInput-popover-open"
      visible={p.popVisible}
      onVisibleChange={b => {
        p.onChangeVisible(b);
      }}
      content={<C_TeamSearchInput />}
      trigger="click"
    >
      <div className="main-content-header__nav-item">
        <i className="teams-icon icon-create-team" />
        创建团队
      </div>
    </Popover>
  );
};

// connect
export const C_TeamSearchAdd = Fusion(S.TeamSearchAdd.getStore())<
  TeamSearchAddProps
>(s => {
  const add = S.TeamSearchAdd;
  return {
    onChangeVisible(visible) {
      add.changePopover({
        popoverVisible: visible,
      });
    },
    popVisible: s.popVisible,
  };
})(p => <TeamSearchAdd {...p} />);
