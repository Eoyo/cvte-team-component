import { contactListTypes } from "../ContactListTypes";
import { Act } from "../../../../../../stores/Actor/actor";
import { Various } from "../../../../../../stores/utils/various";
export const contacts = Act<contactListTypes.state>()({
  showContacts: {
    contactsShow: false,
  },
  updateContact: {
    contacts: [] as contactListTypes.contactInfo[],
  },
})({
  showContacts: (s, d) => {
    return Various(s)(s => {
      s.contactsShow = d.contactsShow;
    });
  },
  updateContact: (s, d) => {
    return Various(s)(s => {
      s.contacts = d.contacts;
    });
  },
});
