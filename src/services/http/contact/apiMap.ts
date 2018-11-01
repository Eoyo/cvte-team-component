import { Api } from "../region";
import {
  addContactURLType,
  addContactBodyType,
  addContactResponseType,
  getContactBodyType,
  getContactURLType,
  getContactResponseType,
  deleteContactURLType,
  deleteContactBodyType,
  deleteContactResponseType,
  searchContactBodyType,
  getTeamListURLType,
  changeRemarkURLType,
  getTeamListResponseType,
} from "./contactTypes";
export const contacts = {
  addContact: Api<
    addContactURLType,
    addContactBodyType,
    {},
    addContactResponseType
  >("/api/personal_contacts/{urluserId}/persons").post,

  getContact: Api<
    getContactURLType,
    getContactBodyType,
    {},
    getContactResponseType
  >("/api/personal_contacts/{urluserId}/persons").get,

  deleteContact: Api<
    deleteContactURLType,
    deleteContactBodyType,
    {},
    deleteContactResponseType
  >("/api/personal_contacts/{urluserId}/persons/{urlpersonId}").del,
  searchContact: Api<
    {},
    searchContactBodyType,
    {},
    {
      avatar: string;
      createTime: number | string;
      isMailConfig: boolean;
      displayName: string;
      mobile: string | number;
      email?: string;
      _id: string;
      systemId?: string;
    }[]
  >("/api/users").get,
  // 暂时为实现 ?page=:page&row=:row
  getTeamList: Api<getTeamListURLType, {}, {}, getTeamListResponseType[]>(
    "/api/personal_contacts/{userId}/teams"
  ).get,
  changeRemark: Api<changeRemarkURLType, {}, {}, {}>(
    "/api/personal_contacts/{userId}/persons/{personId}"
  ).patch,
};
