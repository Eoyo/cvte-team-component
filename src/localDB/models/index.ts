import {
  attr,
  createSelector as createSelectorORM,
  ORMCommonState,
  ORMId,
  QuerySet,
  TableState,
  SessionWithModels,
  Model,
  ORM,
  Session,
} from "redux-orm";

import { ContactsState, ContactsORMModels, Contacts } from "./contacts";
import { TeamsState, TeamsORMModels, Teams } from "./teams";
import { MeetingsState, MeetingsORMModels, Meetings } from "./meeting";

export interface AllORMState extends ORMCommonState {
  Contacts: ContactsState;
  Teams: TeamsState;
  Meeting: MeetingsState;
}
export type allORMModels = {
  Contacts: ContactsORMModels;
  Teams: TeamsORMModels;
  Meeting: MeetingsORMModels;
};
// export const allModel = {
//   Contacts,
//   Teams,
//   Meetings,
// };
export const orm = new ORM<AllORMState>();
orm.register<any>(Contacts, Teams, Meetings);
