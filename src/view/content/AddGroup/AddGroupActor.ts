import { Various } from "../../../stores/utils/various";
import { AddGroupTool } from "./AddGroupTool";
import { Actor } from "../../../stores/Actor/actor";
import { group } from "./zAct/group";
import { person } from "./zAct/person";
import { search } from "./zAct/search";
import { ormOperateGroup } from "./zAct/ormOperateGroup";
import { AddGroupInit, AddGroupTypes } from "./AddGroupTypes";
import { outskirt } from "./zAct/outskirt";

export const addGroup = Actor(AddGroupInit)({
  ...group.actions,
  ...person.actions,
  ...search.actions,
  ...outskirt.actions,
  ...ormOperateGroup.actions,
})({
  ...group.reducers,
  ...person.reducers,
  ...search.reducers,
  ...outskirt.reducers,
  ...ormOperateGroup.reducers,
  always(s) {
    return Various(s)(s => {
      // is in current group?
      const oneGroup = AddGroupTool.findOneGroup(s, s.aimGroupId);
      s.consistentData.memberList.forEach(d => {
        if (d.select === "exited") {
          d.select = "static";
        }
      });
      if (oneGroup) {
        oneGroup.containMemberId.forEach(id => {
          s.consistentData.memberList.forEach(member => {
            const {
              id: memberId,
              userPersonalMessage: { phone, email },
            } = member;
            //如果没有id，就用电话，如果没有电话，就用邮箱
            let dId = "" + memberId || phone || email;
            if (dId === id) {
              member.select = "exited";
            }
          });
        });
      }

      // 手动标记已经添加的
      if (
        s.exitedId.indexOf(
          s.searchPeopleModel.searchResult._id ||
            s.searchPeopleModel.searchResult.symbol
        ) >= 0 ||
        s.selectGroup.containMemberId.indexOf(
          s.searchPeopleModel.searchResult._id ||
            s.searchPeopleModel.searchResult.symbol
        ) >= 0
      ) {
        s.searchPeopleModel.searchResult.isAdded = true;
      } else {
        s.searchPeopleModel.searchResult.isAdded = false;
      }
      if (s.exitedId.length > 0) {
        s.exitedId.forEach(id => {
          s.consistentData.memberList.forEach(member => {
            const {
              id: memberId,
              userPersonalMessage: { phone, email },
            } = member;
            //如果没有id，就用电话，如果没有电话，就用邮箱
            let dId = "" + memberId || phone || email;
            if (dId === id) {
              member.select = "exited";
            }
          });
        });
      }

      // 将MemberList转成IdMemberList;
      s.consistentData.IdMemberList = AddGroupTool.mapId(
        s.consistentData.memberList
      );

      // refine the id of memeber
      const rus = {} as {
        [x: string]: AddGroupTypes.PersonSelector;
      };
      // @liumiao 可以使用 Array.reduce 转化
      for (let i in s.consistentData.memberList) {
        let member = s.consistentData.memberList[i];
        let tmpPhone = "";
        let phone = member.userPersonalMessage.phone;
        if (typeof phone === "number") {
          tmpPhone = phone.toString();
        } else if (typeof phone === "string") {
          tmpPhone = phone;
        }
        let dId =
          member.id || tmpPhone || member.userPersonalMessage.email || "";
        rus[dId] = member;
      }
      s.consistentData.IdMemberList = rus;

      // breakObj;
      s.consistentData.memberList = AddGroupTool.breakObj(
        s.consistentData.IdMemberList
      );
      // @liumiao 三个方法需要整改一下
      // lock myFriend IdValue;
      AddGroupTool.mapIdToMemmberList(s, s.myContact.myFriend);

      // lock myGroup IdValue;
      s.myContact.myGroups.groupList.forEach(oneGroup => {
        AddGroupTool.mapIdToMemmberList(s, oneGroup);
      });

      // lock selectGroup id to memberlist;
      AddGroupTool.mapIdToMemmberList(s, s.selectGroup);

      //containMemberId去重
      // @liumiao 去重封装
      let newMemberMap: any = {};
      for (let i in s.selectGroup.containMemberId) {
        newMemberMap[s.selectGroup.containMemberId[i]] = 0;
      }
      let newMemberId: string[] = [];
      for (let key in newMemberMap) {
        newMemberId.push(key);
      }
      s.selectGroup.containMemberId = newMemberId;

      // lock selected type;
      s.consistentData.memberList.forEach(d => {
        d.select !== "exited" && (d.select = "static");
      });
      s.selectGroup.containMemberId.forEach(id => {
        s.consistentData.IdMemberList[id].select !== "exited" &&
          (s.consistentData.IdMemberList[id].select = "selected");
      });

      // lock groupSelectType;
      AddGroupTool.lockGroupSelectType(s);
      return s;
    });
  },
});

// 188888888888
