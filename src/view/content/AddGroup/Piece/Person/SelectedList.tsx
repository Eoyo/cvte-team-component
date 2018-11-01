import { AddGroupTypes } from "../../AddGroupTypes";
import * as React from "react";
import { SelectedPerson } from "./OnePerson";
export const SelectedList = (p: {
  memberList: AddGroupTypes.PersonSelector[];
}) => (
  <div className="selected-list">
    {p.memberList.map(onep => {
      return (
        <SelectedPerson {...onep} key={onep.id} />
      );
    })}
  </div>
);
