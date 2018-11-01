/*
 * @file 联系人部分的更改   
 * @Date: 2018-09-09 21:24:39 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-10-30 17:12:29
 */
import {
  ADD_CONTACT,
  MODIFY_CONTACT_REMARK,
  DELETE_CONTACT,
} from "../../../../localDB/actions/contacts";
import { TypeMessageBody } from "../../pushMessageType";
import { S } from "../../../../stores";
import { teamsSystem } from "../../contants";

// 联系人remark修改
export type TypeContactsRemarkModifyMessageBodyData = {
  _id: string;
  remark: string;
};

// 删除联系人
export type TypeContactsDeleteMessageBodyData = {
  _id: string;
};

// 增加联系人
export type TypeContactsAddMessageBodyData = {
  _id: string;
  remark: string;
  createTime: number | string;
  from: number | string;
  person: string;
};

//增加联系人
export const contactsAdd = {
  messageRouteKey: teamsSystem.TEAMS__CONTACTS__ADD,
  reducerActionKey: ADD_CONTACT,
  actorTrigger: (data: TypeMessageBody<TypeContactsAddMessageBodyData>) => {},
};

export const contactsModifyRemark = {
  messageRouteKey: teamsSystem.TEAMS__CONTACTS__MODIFY_REMARK,
  reducerActionKey: MODIFY_CONTACT_REMARK,
  actorTrigger: (
    data: TypeMessageBody<TypeContactsRemarkModifyMessageBodyData>
  ) => {},
};

export const contactsDelete = {
  messageRouteKey: teamsSystem.TEAMS__CONTACTS__DELETE,
  reducerActionKey: DELETE_CONTACT,
  actorTrigger: (
    data: TypeMessageBody<TypeContactsDeleteMessageBodyData>
  ) => {},
};
