import { contactListTypes } from "../../sider/ContactList/ContactListTypes";

type TypeAppcontactList = Pick<contactListTypes.state, "contacts" | "teams">;

export const tools = {
  _findId(s: TypeAppcontactList, id: string) {
    let result = {
      flag: false,
      index: 0,
      type: "",
    };
    s.contacts.forEach((perContact, index) => {
      if (perContact.id === id) {
        result.flag = true;
        result.index = index;
        result.type = "contact";
        return result;
      }
      return result;
    });
    s.teams.forEach((perContact, index) => {
      if (perContact.id === id) {
        result.flag = true;
        result.index = index;
        result.type = "team";
        return result;
      }
      return result;
    });
    return result;
  },
};
