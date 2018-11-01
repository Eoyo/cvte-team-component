import { avatarType } from "../../../../common/component/Avatar/Avatar";
import { S } from "../../../../../stores";

export type searchType = {
  keyword: string;
  searchAble: boolean;
  keywordType: "mobile" | "email" | "";
  searchStatus: "init" | "notfound" | "fail" | "found" | "loading";
  searchResult: {
    name: string;
    symbol: string;
    addLoading: boolean;
    info: avatarType;
    isAdded: boolean;
    _id: string;
    addStatus: "init" | "offline" | "custom";
    addErrorText: string;
  };
  popoverVisble: boolean;
  // changeSearchStatus: Function;
  onCheckKeyWord: Function;
};

export interface ISearchProps extends searchType {}

// init state
export const ContactSearchAddInitState: ISearchProps = {
  keyword: "",
  keywordType: "",
  searchAble: false,
  searchStatus: "init",
  popoverVisble: false,
  searchResult: {
    name: "",
    symbol: "",
    addLoading: false,
    info: {
      name: "",
      members: [{ name: "", avatarUrl: "", userId: "" }],
    },
    addStatus: "init",
    addErrorText: "",
    _id: "",
    isAdded: false,
  },
  // changeSearchStatus: (value: object) =>
  //   S.ContactSearchAdd.changeSearchStatus(value),
  onCheckKeyWord: (value: { keyword: string }) =>
    S.ContactSearchAdd.checkKeyword(value),
};
