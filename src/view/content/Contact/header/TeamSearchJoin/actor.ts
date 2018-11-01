import { TeamSearchJoinInitState } from "./TeamSearchJoinType";
import { checki } from "../../../../../utils/checkOperator";
import { resOK } from "../../../../../utils/DataControl/ApiHelper";
import { S } from "../../../../../stores";
import { http } from "../../../../../services/http";
import { showTeamInfo } from "../../utils";
import { HingerTypes } from "../../../../../stores/DataHinger/DataHingerTypes";
import { Actor } from "../../../../../stores/Actor/actor";
import { TeamRes } from "../../../../../services/http/export";

export const TeamSearchJoin = Actor(TeamSearchJoinInitState)({
  checkKeyword: { keyword: "" },
  changePopover: {
    popVisible: false,
  },
  searchkeyWord: {},
  joinTeam: {},
  clear: {},
})({
  clear: (s, a) => {
    return {
      ...TeamSearchJoinInitState,
      popoverVisble: true,
    };
  },
  checkKeyword: (s, p) => {
    return {
      keyword: p.keyword,
      searchAble: !!p.keyword,
    };
  },
  changePopover: (s, p) => {
    // 关闭清除所有状态
    if (!p.popVisible) {
      return {
        ...s,
        ...TeamSearchJoinInitState,
      };
    }
    return {
      popoverVisble: p.popVisible,
    };
  },
  searchkeyWord: function*(s, a) {
    yield {
      searchStatus: "loading",
    };
    const res: checki<any> | checki<TeamRes> = yield http.group.getTeamMessage(
      {
        teamId: s.keyword,
      },
      {}
    );
    const { value, code } = res;
    if (resOK(res)) {
      let isAdded = false;
      const { groupList } = S.Hinger.grab();
      //从当前的团队列表中查找id是否存在，如果存在，则设置isAdded为true
      for (let i = 0; i < groupList.length; ++i) {
        if (groupList[i].groupId === s.keyword) {
          isAdded = true;
          break;
        }
      }
      if (code) {
      } else {
        const members = value.members || [];
        // 设置团队信息
        yield {
          searchStatus: "found",
          searchResult: {
            name: value.name,
            symbol: value._id,
            isAdded: isAdded,
            _id: value._id,
            info: {
              name: value.name,
              members: members.map((item: any) => {
                return {
                  name: "",
                  avatarUrl: "",
                  userId: item._id,
                };
              }),
            },
          },
        };
      }
    } else {
      const { code: errorCode } = res;
      if (errorCode === "6-0000") {
        yield {
          searchStatus: "networkFailed",
        };
      } else if (errorCode === 404406000) {
        yield {
          searchStatus: "notFound",
        };
      } else {
        yield {
          searchStatus: "systemError",
        };
      }
    }
  },

  joinTeam: function*(s, a) {
    yield {
      searchResult: {
        addLoading: true,
      },
    };
    const r = s.searchResult;

    const res: checki<any> | checki<http.TeamRes> = yield http.group.joinTeam(
      {
        teamId: s.searchResult._id,
      },
      {}
    );

    if (resOK(res)) {
      // const { value } = res;
      console.log(res);
      yield {
        searchResult: {
          isAdded: true,
          addLoading: false,
        },
        popoverVisble: false,
      };
      let members = [] as any[];
      for (let i in res.value.members) {
        let member = res.value.members[i];
        members.push({
          from: member.from,
          registed: member.user.systemId ? true : false,
          user: {
            id: member.user._id,
            avatar: member.user.avatar,
            displayName: member.user.displayName,
            remark: "",
            personalMessage: {
              email: member.user.email,
              phone: member.user.mobile,
              department: member.user.department,
              jobTitle: member.user.jobTitle,
            },
          },
        });
      }
      let time = Math.floor(Date.now());
      let group: HingerTypes.group = {
        members: members,
        groupName: res.value.name,
        createTimeStick: time,
        masterId: res.value.master,
        groupId: "" + res.value._id,
      };
      S.Hinger.insertTeamData({
        group: group,
      });
      showTeamInfo(res.value._id);
      // 跳转到团队详情
      location.hash = `/#/contact/teams/${res.value._id}`;
    } else {
      const { code: errorCode } = res;
      // OFFLINE
      if (errorCode === "6-0000") {
        yield {
          searchStatus: "networkFailed",
          searchResult: {
            addLoading: false,
            addErrorText: "",
          },
        };
      } else {
        yield {
          searchStatus: "systemError",
        };
      }
    }
  },
});
