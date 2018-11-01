import { redux } from "../utils/redux";
import * as R from "ramda";
import {
  StatePeopleList,
  MemberListCodezi,
  PeopleListInit,
  OneGroup,
  Person,
} from "./PeopleListTypes";
import { Various } from "../utils/various";

const tool = {
  memberGet(
    s: StatePeopleList,
    m: MemberListCodezi
  ) {
    // 返回找到的人;
    const rus: Person[] = [];

    // 删除不对的memberId;
    const restId: string[] = [];
    m.memberId.forEach(d => {
      const onePerson = R.find<Person>(
        R.propEq("id", d),
        s.members.data
      );
      if (onePerson) {
        restId.push(d);
        rus.push(onePerson);
      }
    });
    m.memberId = restId;
    return rus;
  },
};

const PeopleList = redux.Ac(
  PeopleListInit,
  {
    addGroup: {
      groupId: "",
      memberId: "",
    },
    addPeople: {
      memberId: "",
    },
  },

  // reducers,
  {
    addGroup(s, d) {
      // 检查成员
      if (
        !R.find<Person>(
          R.propEq("id", d.memberId),
          s.members.data
        )
      ) {
        return s;
      }

      // 更据groupName提取group
      const group = R.find<OneGroup>(
        R.propEq("id", d.groupId)
      )(s.groups);

      // 将memberId放入对应的groupName的group中;
      if (group !== undefined) {
        if (group.memberList.memberId) {
          group.memberList.memberId.push(
            d.memberId
          );
        }
        return s;
      } else {
        return s;
      }
    },
    addPeople(s, d) {
      return Various(s)(ns => {
        ns.people.memberList.memberId.push(
          d.memberId
        );
      });
    },
    // always 锁定codezi 和 对应的 data;
    always(s) {
      console.log(s);
      // 把group的codezi to data数据映射出来;
      s.groups.forEach(d => {
        d.data = tool.memberGet(s, d.memberList);
      });

      // peoplelist 的codezi to data;
      s.people.data = tool.memberGet(
        s,
        s.people.memberList
      );
      return s;
    },
  }
);
export { PeopleList };
