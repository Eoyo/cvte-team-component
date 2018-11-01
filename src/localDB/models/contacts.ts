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
import { baseModel } from "../baseModel";
/* ======== schema字段 start ========== */
export type person = {
  avatar: string;
  createTime: string | number;
  mobile: string;
  email: string;
};
export type user = {
  _id?: string;
  avatar: string;
  createTime: string | number;
  mobile: string;
  email: string;
  systemId?: string;
  isMailCOnfig: boolean | string | any;
};
export interface Fields {
  userId: string;
  remark: string;
  createTime: string | number;
  from: 0 | 1;
  person: person;
}
export interface Additional {}
export interface VirtualFields {}
/* ======== schema字段 end ========== */

export type ContactsState = TableState<Fields & ORMId & Additional>;
export interface ContactsORMModels {
  Contacts: typeof Contacts;
}
export const modelPrefixName = "Contacts";
import { contacts as ContactsAction } from "../actions";
import { getTheBodyData, commonSelector } from "../utils";

export class Contacts extends baseModel<Fields, Additional, VirtualFields> {
  static modelName = modelPrefixName;

  static fields = {
    userId: attr(),
    remark: attr(),
    createTime: attr(),
    from: attr(),
    person: attr(),
  };

  static reducer(action: any, model: any, allSession: any) {
    console.group(
      `%c localDB model ${modelPrefixName} reducer`,
      "color: #3296FA;background-color: #ffffff;"
    );
    const { type, payload } = action;
    switch (action.type) {
      case ContactsAction.ADD_CONTACT: {
        const { remark, createTime, from, person, _id: id } = getTheBodyData(
          payload
        );
        model.create({ userId: id, remark, createTime, from, person });
        break;
      }
      case ContactsAction.DELETE_CONTACT: {
        const { _id: id } = getTheBodyData(payload);
        model.withId(id).delete();
        break;
      }
      case ContactsAction.MODIFY_CONTACT_REMARK: {
        const { remark, _id: id } = getTheBodyData(payload);
        model.withId(id).set(remark, remark);
        break;
      }

      default:
        // this && this.create({ test: action.payload.test });

        break;
    }
    console.groupEnd();
  }
}

//使用者可以主动获取到数据
export const getContactInfo = (id: string) => {
  commonSelector((session: any) => {
    const data = session.Contacts.withId(id);
    if (data) {
      return data.ref;
    } else {
      return data;
    }
  });
};
