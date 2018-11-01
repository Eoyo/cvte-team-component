import * as React from "react";
import { U } from "../../../../../utils";
import { S } from "../../../../../stores";
import { AddGroupTypes } from "../../AddGroupTypes";
import { DirIcon } from "../Bijous/DirIcon";
import { OnePerson } from "./OnePerson";
import { uuid } from "../../../../../stores/DataHinger/utils";
import { OpenClose } from "../../utils";

const MapPerson = (arr: AddGroupTypes.PersonSelector[]) => {
  let res: any = [];
  let lastWord = "";
  let newWord = "";
  for (let i in arr) {
    let perContact = arr[i];
    newWord = U.getFirstLetter(perContact.name);
    if (newWord !== lastWord) {
      res.push(
        <div className="member-sub-group" key={perContact.id || uuid()}>
          <div className="member-symbol-group-title">{newWord}</div>
          <OnePerson {...perContact} />
        </div>
      );
    } else {
      res.push(
        <div className="member-sub-group" key={perContact.id || uuid()}>
          <OnePerson {...perContact} />
        </div>
      );
    }
    lastWord = newWord;
  }
  return res;
};

export const PersonList = (p: {
  open: boolean;
  memberList: AddGroupTypes.PersonSelector[];
}) => {
  let sortMemberList = p.memberList.sort((param1, param2) => {
    return U.compareName(param1.name, param2.name);
  });
  return (
    <div className="person-list">
      <div
        className="person-list-wrapper"
        onClick={() => {
          S.addGroup.setPersonListOpen({
            newOpen: !p.open,
          });
        }}
      >
        <div className="person-list-pre">
          <DirIcon open={p.open} />
          <span className="person-list-title">联系人</span>
        </div>
        <span className="person-list-num">{sortMemberList.length}</span>
      </div>
      {p.open ? (
        <div className={OpenClose("person-list-content", p.open)}>
          {MapPerson(sortMemberList)}
        </div>
      ) : null}
    </div>
  );
};
