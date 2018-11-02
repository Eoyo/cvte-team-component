/**
 * TeamJoinInput,
 */
import * as React from "react";
import { Fusion } from "../../../../../stores/Actor/fusion";
import { S } from "../../../../../stores";
import {
  SearchInputProps,
  SearchInput,
} from "../../../common/SearchInput/SearchInput";
import {
  SearchResultSFCProps,
  SearchResultSFC,
} from "../../../common/SearchResult/SearchResult";

// connect
export const C_TeamJoinSearchInput = Fusion(S.TeamSearchJoin.getStore())<
  SearchInputProps
>(s => {
  const join = S.TeamSearchJoin;
  return {
    clear() {
      join.clear({});
    },
    keyword: s.keyword,
    searchkeyWord: () => {
      join.searchkeyWord({});
    },
    onKeyDown: (ev: any): void => {
      if (ev.keyCode === 13) {
        join.searchkeyWord({});
      }
    },
    onChange(ev) {
      if (!ev.target.value) {
        join.clear({});
      }
      join.checkKeyword({
        keyword: ev.currentTarget.value,
      });
    },
    maxLength: 8,
    prefixIcon: "search",
    placeholder: "请输入团队ID",
  };
})(p => <SearchInput {...p} focus={true} />);

// connect
export const C_JoinTeamSearchResultSFC = Fusion(S.TeamSearchJoin.getStore())<
  SearchResultSFCProps
>(s => {
  const r = s.searchResult;
  return {
    isAdded: r.isAdded,
    symbol: r.symbol,
    name: r.name,
    addLoading: r.addLoading,
    info: r.info,
    status: s.searchStatus,
    notfoundText: "团队不存在",
    addUserAction() {
      S.TeamSearchJoin.joinTeam({});
    },
    _id: r._id,
    addedText: "已添加",
  };
})(p => (
  <SearchResultSFC
    {...p}
    avatarType="team"
    className="searchResult-in-picker"
  />
));

export type TeamJoinInputProps = {};

// sfc
export const TeamJoinInput: React.SFC<TeamJoinInputProps> = p => {
  return (
    <div className="search-picker">
      <C_TeamJoinSearchInput />
      <C_JoinTeamSearchResultSFC />
    </div>
  );
};
