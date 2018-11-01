import { AddGroupTypes as Types } from "./AddGroupTypes";
import * as R from "ramda";
import { lium } from "../../../utils/personalLogger/logger";
const MapArrayToObjBy = <K>(idfoo: (d: K) => string) => {
  return <T extends K>(arr: T[]) => {
    const rus = {} as { [x: string]: T };
    arr.forEach(d => {
      rus[idfoo(d)] = d;
    });
    return rus;
  };
};
// 定义基本的操作;
const tool = {
  getSymbol(p: { email?: string; phone?: string }) {
    return p.email || p.phone || "none";
  },
  breakObj(obj: object) {
    const rus: any[] = [];
    for (const prop in obj) {
      rus.push(obj[prop]);
    }
    return rus;
  },
  findOneGroup: (s: Types.InitState, groupId: string) => {
    return R.find<Types.OneGroup>(
      R.propEq("groupId", groupId),
      s.myContact.myGroups.groupList
    );
  },
  setSelectState(s: Types.InitState, id: string, d: Types.selectState) {
    const onep =
      s.consistentData.IdMemberList && s.consistentData.IdMemberList[id];
    // tslint:disable-next-line:no-console
    lium.log("onep", onep);
    if (onep && onep.select !== ("exited" as Types.selectState)) {
      onep.select = d;
    } // else

    return tool;
  },
  checkSelectId(s: Types.InitState, selectId: string) {
    if (
      s.consistentData.IdMemberList &&
      s.consistentData.IdMemberList[selectId] &&
      s.consistentData.IdMemberList[selectId].select === "exited"
    ) {
      return true;
    } else {
      return false;
    }
  },
  addSelect(s: Types.InitState, selectId: string) {
    const arr = s.selectGroup.containMemberId;
    if (tool.checkSelectId(s, selectId)) {
      return tool;
    }
    // 没有就放在第一位;
    if (arr.indexOf(selectId) < 0) {
      arr.unshift(selectId);
      s.selectGroup.adding += 1;
    } // else
    s.selectGroup.containMemberId = arr;
    return tool;
  },
  removeSelect(s: Types.InitState, selectId: string) {
    if (tool.checkSelectId(s, selectId)) {
      return tool;
    }
    let startLength = s.selectGroup.containMemberId.length;
    s.selectGroup.containMemberId = s.selectGroup.containMemberId.filter(d => {
      return d !== selectId;
    });
    let endLength = s.selectGroup.containMemberId.length;
    s.selectGroup.adding += endLength - startLength;
    return tool;
  },
  mapId: MapArrayToObjBy<{ id: string }>(d => d.id),
  mapIdToMemmberList(
    sourceState: Types.InitState,
    // 规则记录
    oneNode: Types.IdValuer
  ) {
    const newMemberList = [] as Types.PersonSelector[];
    if (sourceState.consistentData.IdMemberList) {
      oneNode.containMemberId.forEach(id => {
        if (sourceState.consistentData.IdMemberList) {
          const a = sourceState.consistentData.IdMemberList[id];
          newMemberList.push(a);
        }
      });
    }
    oneNode.memberList = newMemberList;
    // todo @liumiao : 未注册的用户如何显示
    // const notRegisted: AddGroupTypes.PersonSelector[] = [];
    // oneNode.memberList.forEach(d => {
    //   if (!d.registed) {
    //     notRegisted.push(d);
    //   }
    // });
    // oneNode.memberList = newMemberList.concat(
    //   notRegisted
    // );
  },

  lockGroupSelectType(s: Types.InitState) {
    s.myContact.myGroups.groupList.forEach(d => {
      let all = true,
        allexist = true,
        none = true;
      for (const person of d.memberList) {
        if (person.select === "static") {
          all = false;
        } else {
          none = false;
        }
        if (person.select !== "exited") {
          allexist = false;
        }
      }

      if (allexist) {
        d.selectType = "allexist";
      } else {
        if (!all && !none) {
          d.selectType = "some";
        } else if (all && !none) {
          d.selectType = "all";
        } else if (!all && none) {
          d.selectType = "none";
        }
      }
    });
  },
};

export { tool as AddGroupTool };
