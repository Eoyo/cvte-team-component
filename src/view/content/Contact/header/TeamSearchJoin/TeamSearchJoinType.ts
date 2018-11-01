import { avatarType } from "../../../../common/component/Avatar/Avatar";
import { SearchStatus } from "../../../AddGroup/Piece/Search/SearchPeopleTypes";

export type searchType = {
  keyword: string;
  searchAble: boolean;
  searchStatus: SearchStatus;
  searchResult: {
    name: string;
    symbol: string;
    addLoading: boolean;
    info: avatarType;
    isAdded: boolean;
    _id: string;
    addErrorText: string;
  };
  popoverVisble: boolean;
};

export interface ISearchProps extends searchType {}

// init state
export const TeamSearchJoinInitState: ISearchProps = {
  keyword: "",
  searchAble: false,
  searchStatus: "none",
  popoverVisble: false,
  searchResult: {
    name: "",
    symbol: "",
    addLoading: false,
    info: {
      name: "",
      members: [{ name: "", avatarUrl: "", userId: "" }],
    },
    addErrorText: "",
    _id: "",
    isAdded: false,
  },
};
