import { AddGroupTypes } from "../AddGroupTypes";
import { Act } from "../../../../stores/Actor/actor";
import { AddGroupTool } from "../AddGroupTool";
import { message } from "antd";
import { ConfirmRusType } from "../Piece/Search/SearchPeopleTypes";
export const search = Act<AddGroupTypes.InitState>()({
  selectedUnregistedOne: { personData: {} as ConfirmRusType },
  addSelectedPerson: {
    personData: {} as ConfirmRusType,
  },
  resetAddGroup: {},
  clearAddGroupSearch: {},
})({
  selectedUnregistedOne(s, d) {
    // 检查是否存在group中
    let exited = true;
    const oneGroup = AddGroupTool.findOneGroup(s, s.aimGroupId);
    const person = d.personData;
    const symbolId = AddGroupTool.getSymbol({
      email: person.email,
      phone: person.mobile,
    });
    if (oneGroup) {
      if (oneGroup.containMemberId.indexOf(symbolId) < 0) {
        exited = false;
      }
    } else {
      // 团队找不到，在会议成员管理也适用
      exited = false;
    }
    // 添加到数据中;
    if (!exited) {
      s.selectGroup.containMemberId.push(symbolId);
      s.consistentData.memberList.push({
        id: person.id || symbolId,
        hasTrueId: !!person.id,
        userPersonalMessage: {
          email: person.email,
          phone: person.mobile,
          department: person.department,
          jobTitle: person.jobTitle,
        },
        select: "selected",
        registed: false,
        name: symbolId,
        headIconUrl: "",
      });
    } else {
      message.error("该用户已被加入");
    }
    return s;
  },
  addSelectedPerson: (s, d) => {
    const p = d.personData;

    const memberList = [...s.consistentData.memberList];
    const containMemberId = [...s.selectGroup.containMemberId];
    let flag = false;
    for (let i in memberList) {
      if (memberList[i].id === p.id) {
        flag = true;
      }
    }
    //如果没有重复的，就插入
    if (flag === false) {
      memberList.push({
        id: p.id,
        userPersonalMessage: {
          email: p.email,
          phone: p.mobile,
          department: p.department,
          jobTitle: p.jobTitle,
        },
        select: "selected",
        registed: p.isRegister,
        hasTrueId: !!p.id,
        name: p.name,
        headIconUrl: p.avatar,
      });
    }
    containMemberId.push(p.id);

    return { consistentData: { memberList }, selectGroup: { containMemberId } };
  },
  resetAddGroup: (s, d) => {
    return {
      ...s,
      selectGroup: {
        memberList: [],
        containMemberId: [],
        adding: 0,
      },
      searchPeopleModel: AddGroupTypes.createSearchPeopleModel(),
    };
  },
  clearAddGroupSearch: (s, d) => {
    return {
      ...s,
      searchPeopleModel: AddGroupTypes.createSearchPeopleModel(),
    };
  },
});
