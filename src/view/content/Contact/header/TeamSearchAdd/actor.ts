import { TeamSearchAddState } from "./TeamSearchAddType";
import { Actor } from "../../../../../stores/Actor/actor";
import { checki } from "../../../../../utils/checkOperator";
import { resOK } from "../../../../../utils/DataControl/ApiHelper";
import { S } from "../../../../../stores";
import { http } from "../../../../../services/http";
import { showTeamInfo } from "../../utils";
import { HingerTypes } from "../../../../../stores/DataHinger/DataHingerTypes";

export const TeamSearchAdd = Actor(new TeamSearchAddState())({
  checkKeyword: { keyword: "" },
  changePopover: {
    popoverVisible: false,
  },
  createTeam: {},
  clear: {},
})({
  checkKeyword: (s, a) => {
    return {
      keyword: a.keyword,
      searchAble: !!a.keyword,
    };
  },
  changePopover: (s, a) => {
    // 关闭清除所有状态
    if (!a.popoverVisible) {
      return {
        ...new TeamSearchAddState(),
      };
    } else {
      return {
        popVisible: a.popoverVisible,
      };
    }
  },
  createTeam: function*(s, a) {
    yield {
      addLoading: true,
    };
    const res:
      | checki<any>
      | checki<{
          name: string;
          _id: string;
        }> = yield http.group.create(
      {},
      {
        data: {
          name: s.keyword,
        },
      }
    );

    if (resOK(res)) {
      yield {
        addLoading: false,
        searchStatus: "none",
      };

      S.TeamSearchAdd.changePopover({
        popoverVisible: false,
      });

      const { value } = res;
      showTeamInfo(value._id);
      window.location.hash = "/contact/teams/" + value._id;
      let time = Math.floor(Date.now());
      let group: HingerTypes.group = {
        members: [],
        groupName: value.name,
        createTimeStick: time,
        masterId: "",
        groupId: value._id.toString(),
      };
      S.Hinger.insertTeamData({
        group: group,
      });
    } else {
      const { code: errorCode } = res;
      if (errorCode === "6-0000") {
        yield {
          searchStatus: "networkFailed",
        };
      }
      yield { addLoading: false };
    }
  },
  clear: (s, a) => {
    return {
      ...new TeamSearchAddState(),
      popVisible: false,
    };
  },
});
