import * as React from "react";
import { PersonSelector } from "./PersonSelector";
import { AddGroupTypes } from "../../AddGroupTypes";
import { S } from "../../../../../stores";
import { U } from "../../../../../utils";
import { Avatar } from "../../../../common/component/Avatar/Avatar";

const PersonHead = (p: { icon: string; email?: string }) => {
  return (
    <div className="person-head">
      <Avatar avatarUrl={p.icon} className="small-avatar" email={p.email} />
    </div>
  );
};
export const OnePerson = (p: AddGroupTypes.PersonSelector) => {
  return (
    <div
      className="member-list-one-person"
      onClick={ev => {
        if (p.select === "selected") {
          S.addGroup.operatePerson({
            id: p.id,
            opeType: "cancel",
          });
        } else if (p.select === "static") {
          S.addGroup.operatePerson({
            id: p.id,
            opeType: "select",
          });
        }
      }}
    >
      <PersonHead
        icon={p.headIconUrl}
        // email={p.userPersonalMessage.email || ""}
      />
      <div className="person-body">
        <div className="person-name">
          {p.name || p.userPersonalMessage.phone || p.userPersonalMessage.email}
        </div>
      </div>
      <PersonSelector opeType="select" select={p.select} />
    </div>
  );
};

export const SelectedPerson = (p: AddGroupTypes.PersonSelector) => {
  const me = {
    getName() {
      if (p.registed) {
        return p.name;
      } else {
        const newName =
          U.pickValue("")(p.userPersonalMessage, "phone", "email") || "";
        return newName + " (未注册)";
      }
    },
  };
  return (
    <div
      className="member-list-one-person person-selected"
      onClick={ev => {
        S.addGroup.operatePerson({
          id: p.id,
          opeType: "cancel",
        });
      }}
    >
      <PersonHead
        icon={p.headIconUrl}
        email={p.userPersonalMessage.email || ""}
      />
      <div className="person-body">
        <div className="person-name">{me.getName()}</div>
      </div>
      <PersonSelector select={p.select} opeType="delete" />
    </div>
  );
};
