import { contactListTypes } from "../ContactListTypes";
import { Act } from "../../../../../../stores/Actor/actor";
import { Various } from "../../../../../../stores/utils/various";

export const teams = Act<contactListTypes.state>()({
  updateTeams: {
    teams: [] as contactListTypes.teamInfo[],
  },
  selectMenuItem: {
    contactType: "",
    key: "",
  },
  showTeams: {
    teamsShow: false,
  },
})({
  updateTeams: (s, d) => {
    return Various(s)(s => {
      s.teams = d.teams;
    });
  },
  selectMenuItem: (s, d) => {
    return Various(s)(s => {
      if (d.contactType === "contact") {
        s.contactSelectKey = d.key;
        s.teamSelectKey = "";
      } else if (d.contactType === "team") {
        s.teamSelectKey = d.key;
        s.contactSelectKey = "";
      }
    });
  },
  showTeams: (s, d) => {
    return Various(s)(s => {
      s.teamsShow = d.teamsShow;
    });
  },
});
