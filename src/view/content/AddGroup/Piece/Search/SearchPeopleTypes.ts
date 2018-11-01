import { AddGroupTypes } from "../../AddGroupTypes";
import {
  searchPersonByKeywordTypes,
  addContactPersonTypes,
} from "src/services/auto/spore";
import { checki } from "src/utils/checkOperator";
// searchPeopleType
// TypeSearchPeopleProp
export type TypeSearchPeopleViewProps = {
  [P in keyof AddGroupTypes.searchPeopleType]?: Partial<
    AddGroupTypes.searchPeopleType[P]
  >
} &
  TypeSearchPeopleProp;
export type TypeSearchPersonByKeywordTypesResponse = searchPersonByKeywordTypes.response;

export type SearchStatus =
  | "none"
  | "loading"
  | "networkFailed"
  | "systemError"
  | "found"
  | "notFound";

export type TypeSearchPeopleState = {
  keywordType: "mobile" | "email" | "";
  keyword: string;
  popoverVisble: boolean;
  searchAble: boolean;
  searchResult: TypeSearchPersonByKeywordTypesResponse;
  searchStatus: SearchStatus;
};

export type ConfirmRusType = {
  isRegister: boolean;
  mobile: string;
  avatar: string;
  email: string;
  id: string;
  name: string;
  jobTitle: string;
  department: string;
};
export type TypeSearchPeopleProp = {
  onConfirm: (res: ConfirmRusType) => void;
  onCancel: (id: string) => void;
  currentSelectData: TypeCurrentSelectData;
  overlayClassName?: string;
  placement?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom"
    | undefined;
  arrowPointAtCenter?: boolean;
  resutlItemClass?: string;
  placeholder?: string;
  openClassName?: string;
};

export type TypeCurrentSelectData = AddGroupTypes.PersonSelector[];
export type TypePersonSelectState = AddGroupTypes.selectState;
// 整理类型

export type TypeAddContactRes = checki<addContactPersonTypes.response>;
export type TypeSearchResultRes = checki<
  TypeSearchPersonByKeywordTypesResponse
>;

export type TypeSearchResultItem = {
  type?: string;
  className?: string;
  // isAdded: boolean;
  addContactByIdRequest: () => void;
  memberSelectHandler: () => void;
  _id: string;
  email: string;
  mobile: string;
  createTime: string;
  avatar: string;
  displayName: string;
  systemId: string;
  department: string;
  jobTitle: string;
  isFriend: boolean;
  personSelectoriconType: AddGroupTypes.selectState;
};
export type SearchResultViewV2Args = {
  className: string;
  resutlItemClass?: string;
  resultLists: TypeSearchPersonByKeywordTypesResponse;
  contactAddRequest: Function;
  memberSelectOnConfirm: (res: ConfirmRusType) => void;
  memberSelectOnCancel: (id: string) => void;
  currentSelectData: AddGroupTypes.PersonSelector[];
  type: "add" | "manage";
}; // 搜索的结果，一种是用于添加用户，一种是用于在成员管理器
export type GetArrayType<P> = P extends (infer R)[] ? R : "noArray";
export type Type_resultListsItem = GetArrayType<
  TypeSearchPersonByKeywordTypesResponse
> & {
  isFriend: boolean;
  personSelectoriconType: TypePersonSelectState;
};

export type SearchResultViewV2AState = {
  searchStatus: SearchStatus;
};

// type ss = GetArrayType<TypeSearchPersonByKeywordTypesResponse>;

export type TypeResultItemOperatorProps = {
  isInMemberSelector: boolean;
  isFriend: boolean;
  memberSelectHandler: () => void;
  personSelectoriconType: TypePersonSelectState;
  addContactByIdRequest: () => void;
};
