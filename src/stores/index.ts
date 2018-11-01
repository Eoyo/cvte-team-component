import { addGroup } from "../view/content/AddGroup/AddGroupActor";
import { Meeting } from "../pivot/Meeting/Actor/MeetingActor";
import { contactListOperation } from "../view/content/Contact/sider/ContactList/ContactListActor";
import { Hinger } from "./DataHinger/DataHingerActor";
import { GroupMessage } from "../view/content/Contact/content/teams/GroupMessage/GroupMessageActor";
import { contactInfomationCardOperation } from "../view/content/Contact/content/friends/ContactInfomationCard/ContactInfomationCardActor";
import { TeamSearchAdd } from "../view/content/Contact/header/TeamSearchAdd/actor";
import { TeamSearchJoin } from "../view/content/Contact/header/TeamSearchJoin/actor";
import { ContactSearchAdd } from "../view/content/Contact/header/ContactSearchAdd/actor";
import { AirCastActor } from "../view/content/Meeting/header/AirCast/AirCastActor";
const S = {
  addGroup: addGroup,
  GroupMessage: GroupMessage,
  Meeting: Meeting,
  contactListOperation: contactListOperation,
  Hinger: Hinger,
  contactInfomationCardOperation: contactInfomationCardOperation,
  TeamSearchAdd: TeamSearchAdd,
  TeamSearchJoin: TeamSearchJoin,
  ContactSearchAdd: ContactSearchAdd,
  AirCastActor: AirCastActor,
};

export { S };
