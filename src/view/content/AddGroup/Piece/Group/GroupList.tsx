import * as React from "react";
import { S } from "../../../../../stores";
import { DirIcon } from "../Bijous/DirIcon";
import { U } from "../../../../../utils";
import { AddGroupTypes } from "../../AddGroupTypes";
import { OneGroup } from "./OneGroup";
import { OpenClose } from "../../utils";

const MapGroup = (arr: AddGroupTypes.OneGroup[], aimGroupId: string) => {
  let res: any = [];
  let lastWord = "";
  let newWord = "";
  for (let i in arr) {
    let perGroup = arr[i];
    newWord = U.getFirstLetter(perGroup.groupName);
    if (newWord !== lastWord) {
      res.push(
        <div className="member-sub-group" key={i}>
          <div className="member-symbol-group-title">{newWord}</div>
          <OneGroup {...perGroup} key={perGroup.groupId} />
        </div>
      );
    } else {
      res.push(
        <div className="member-sub-group" key={i}>
          <OneGroup {...perGroup} key={perGroup.groupId} />
        </div>
      );
    }
    lastWord = newWord;
  }
  return res;
};

export const GroupList = (p: { group: AddGroupTypes.myGroups }) => {
  const aimGroupId = S.addGroup.grab(s => s.aimGroupId);
  return (
    <div className="group-list">
      <div
        className="group-list-wrapper"
        onClick={() => {
          S.addGroup.setGroupListOpen({
            newOpen: !p.group.open,
          });
        }}
      >
        <div className="group-list-pre">
          <DirIcon open={p.group.open} />
          <span className="group-list-title">我的团队</span>
        </div>
        <span className="group-list-num">{p.group.groupList.length}</span>
      </div>
      {p.group.open ? (
        <div className={OpenClose("group-list-container", p.group.open)}>
          {MapGroup(p.group.groupList, aimGroupId)}
        </div>
      ) : null}
    </div>
  );
};
