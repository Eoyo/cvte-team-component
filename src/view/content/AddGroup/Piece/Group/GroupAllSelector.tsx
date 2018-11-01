import * as React from "react";
import { AddGroupTypes } from "../../AddGroupTypes";
import { S } from "../../../../../stores";
import { PersonSelector, TypePersonSelector } from "../Person/PersonSelector";

export const GroupAllSelector = (p: {
  seletType: AddGroupTypes.GroupSelectType;
  groupId: string;
}) => {
  const selector = {
    all: () => {
      S.addGroup.operateGroup({
        groupId: p.groupId,
        opeType: "selectAll",
      });
    },
    cancel: () => {
      S.addGroup.operateGroup({
        groupId: p.groupId,
        opeType: "cancelAll",
      });
    },
  };
  const event = {
    onClick() {
      if (p.seletType === "all") {
        selector.cancel();
      } else {
        selector.all();
      }
    },
  };
  let select: AddGroupTypes.selectState;
  if (p.seletType === "all") {
    select = "selected";
  } else if (p.seletType === "allexist") {
    select = "exited";
  } else {
    select = "static";
  }
  const PersonSelectorProps: TypePersonSelector = {
    opeType: "select",
    select,
  };
  return (
    <div
      className={
        "member-list-group-item-memberList-item_all-selector " + p.seletType
      }
      onClick={event.onClick}
    >
      <span className="all-selector-text">全选</span>
      <PersonSelector {...PersonSelectorProps} />
    </div>
  );
};
