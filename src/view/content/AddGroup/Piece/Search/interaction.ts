import { auto } from "src/services/auto/spore";
import { S } from "src/stores";
import {
  TypeCurrentSelectData,
  TypePersonSelectState,
} from "./SearchPeopleTypes";

export const searchByKewordByRequest = (keyword: string) => {
  return auto.searchPersonByKeyword({
    keyword,
  });
  // try {
  //   const res: checki<TypeSearchResult> = await auto.searchPersonByKeyword({
  //     keyword,
  //   });
  //   return res;
  // } catch (e) {
  //   return e;
  // }
};

export const addContactRequest = (personId: string, email: string) => {
  return auto.addContactPerson(
    {
      userId: personId,
    },
    {
      headers: {
        "x-user-id": personId,
      },
      data: {
        mobile: "",
        email,
      },
    }
  );
  // try {
  //   const res: checki<
  //     addContactPersonTypes.response
  //   > = await auto.addContactPerson({
  //     userId: id,
  //   });
  //   return res;
  // } catch (e) {
  //   return e;
  // }
};

// 成员选择器中的是否为好友判断
export const isFriendInMembersSelector = (id: string) => {
  // 每次触发重新渲染即重新拉取当前好友
  const contacts = S.addGroup.getStore().getState().myContact.myFriend
    .memberList;
  //判断是否是好友
  // let contact = contacts.find(param => {
  //   return param.id === a.user.id;
  // });
  return contacts.find(param => {
    return param.id === id;
  });
};
// 添加联系人中的是否为好友判断
export const isFriendInContactAdd = (id: string) => {
  const { personList, self } = S.Hinger.grab();
  return (
    personList.find(person => {
      return person.id === id;
    }) || self.id === id
  );
};

// 成员选择器的图标类型
export const getPersonSelectorIconTypeInMemberManager: (
  personSelector: TypeCurrentSelectData,
  item: {
    _id: string;
    email: string;
    mobile: string;
    createTime: string;
    avatar: string;
    displayName: string;
    systemId: string;
  }
) => TypePersonSelectState = (
  personSelector: TypeCurrentSelectData,
  item: {
    _id: string;
    email: string;
    mobile: string;
    createTime: string;
    avatar: string;
    displayName: string;
    systemId: string;
  }
) => {
  const inPersonSelectorData = personSelector.find(exitedDataItem => {
    return exitedDataItem.id === item._id;
  });
  if (inPersonSelectorData) {
    // const { select } = inPersonSelectorData;
    // 如在选择器中已被选择的成员, 也存在结果列表
    // if (select === "exited") {
    //   return "exited";
    // } else {
    return inPersonSelectorData.select;
    // }
  } else {
    return "static";
  }
};

// 添加联系人判断图标
export const getPersonSelectorIconTypeInAddContact: (
  isFriend: boolean,
  item: {
    _id: string;
    email: string;
    mobile: string;
    createTime: string;
    avatar: string;
    displayName: string;
    systemId: string;
  }
) => TypePersonSelectState = (
  isFriend: boolean,
  item: {
    _id: string;
    email: string;
    mobile: string;
    createTime: string;
    avatar: string;
    displayName: string;
    systemId: string;
  }
) => {
  if (isFriend) {
    return "exited";
  } else {
    return "exited";
  }

  return "selected";
};
