/**
 * 成员选择器的弹窗
 */
import "./PopShowAddGroup.scss";
import * as React from "react";
import { AddGroupTypes } from "./AddGroupTypes";
import { ContainAddGroup } from "./AddGroupPaint";
import { PopCard } from "../../common/component/Pop/PopCard";
export type PopShowAddGroupProps = {
  visible: boolean;
  onGroupAddConfirm: (
    confirm: boolean,
    selectedPerson?: AddGroupTypes.PersonSelector[]
  ) => void;
};

// 成员选择器弹窗的原型
export const PopShowAddGroup: React.SFC<PopShowAddGroupProps> = p => {
  return (
    <PopCard
      visible={p.visible}
      onClickBg={() => {
        p.onGroupAddConfirm(false);
      }}
      popContentClassName={"add-group-wrapper"}
    >
      <div style={{ width: "100%", height: "100%" }}>
        {p.visible ? (
          <ContainAddGroup onGroupAddConfirm={p.onGroupAddConfirm} />
        ) : null}
      </div>
    </PopCard>
  );
};
