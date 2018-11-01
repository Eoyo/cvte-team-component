import { ContactListInit } from "./ContactListTypes";
import { ormOperateGroup } from "./zAct/ormOperateTeams";
import { contacts } from "./zAct/contacts";
import { teams } from "./zAct/teams";
import { app } from "../../../../../stores/app/app";
import { Actor } from "../../../../../stores/Actor/actor";

export const contactListOperation = Actor(ContactListInit)({
  ...ormOperateGroup.actions,
  ...contacts.actions,
  ...teams.actions,
})({
  ...ormOperateGroup.reducers,
  ...contacts.reducers,
  ...teams.reducers,
  always: s => {
    app.set("contactLists", p => {
      p.contacts = s.contacts;
      p.teams = s.teams;
      return p;
    });
    return s;
  },
});
