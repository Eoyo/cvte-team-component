import * as React from "react";
import { AddGroupTypes } from "../../AddGroupTypes";
import { DirIcon } from "../Bijous/DirIcon";
import { GroupAllSelector } from "./GroupAllSelector";
import { OnePerson } from "../Person/OnePerson";
import { S } from "../../../../../stores";
import { U } from "../../../../../utils";
import { uuid } from "../../../../../stores/DataHinger/utils";
import { Avatar } from "../../../../common/component/Avatar/Avatar";
import { OpenClose } from "../../utils";

export const OneGroup = (p: AddGroupTypes.OneGroup) => {
  return (
    <div className="member-list-group-item">
      <div
        className="member-list-group-item-body"
        onClick={() => {
          S.addGroup.setOneGroupOpen({
            groupId: p.groupId,
            newOpen: !p.open,
          });
        }}
      >
        <Avatar
          className="small-avatar"
          teamsName={p.groupName}
          teamsId={p.groupId}
        />
        <div className="member-list-group-item-memberList-item-group">
          <div className="member-list-group-item-memberList-item-name">
            {p.groupName}
          </div>
          <DirIcon open={p.open} />
        </div>
      </div>
      <div className={OpenClose("group-list-content", p.open)}>
        <GroupAllSelector
          {...{
            seletType: p.selectType,
            groupId: p.groupId,
          }}
        />
        {p.memberList.map(onep => {
          return <OnePerson {...onep} key={onep.id || uuid()} />;
        })}
      </div>
    </div>
  );
};
