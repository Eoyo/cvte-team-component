import { ContactSearchAddInitState } from "./ContactSearchAddType";
import { redux } from "../../../../../stores/utils/redux";
import { isMobile, isEmail } from "../../../../../utils/_tools";
import { Actor } from "src/stores/Actor/actor";

export const ContactSearchAdd = Actor(ContactSearchAddInitState)({
  checkKeyword: { keyword: "" },
  // changeSearchStatus: {},
  changePopover: {
    popoverVisble: false,
  },
})({
  checkKeyword: (s, p) => {
    s.keyword = p.keyword;
    const isMobileType = isMobile(p.keyword);
    const isEmailType = isEmail(p.keyword);
    if (!isMobileType && !isEmailType) {
      s.searchAble = false;
      return s;
    } else {
      if (isMobileType) {
        s.keywordType = "mobile";
      } else if (isEmailType) {
        s.keywordType = "email";
      } else {
        s.keywordType = "";
      }
      s.searchAble = true;
    }
    return s;
  },
  // changeSearchStatus: (s, p) => {
  //   s = {
  //     ...s,
  //     ...p,
  //   };
  //   return s;
  // },
  changePopover: (s, p) => {
    // 关闭清除所有状态
    if (!p.popoverVisble) {
      s = {
        ...s,
        ...ContactSearchAddInitState,
      };
    }
    s.popoverVisble = p.popoverVisble;
    return s;
  },
  always(s) {
    return { ...s };
  },
});
