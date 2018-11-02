/**
 * TeamSearchInput,
 */
// import "./TeamSearchInput.scss";
import * as React from "react";
import { SearchInput } from "../../../common/SearchInput/SearchInput";
import { Fusion } from "../../../../../stores/Actor/fusion";
import { S } from "../../../../../stores";
import { Ele } from "src/view/common/ts-styled/ele";
import { SearchStatus } from "../../../AddGroup/Piece/Search/SearchPeopleTypes";
import { ExtraErrorText } from "../../../common/ExtraErrorText/ExtraErrorText";

const searchStatus2Views = (status: SearchStatus) => {
  if (status === "none") {
    return "";
  } else if (status === "networkFailed") {
    return (
      <div className="team-search-input-network-failed">
        <ExtraErrorText text={"网络异常"} level="error" />
      </div>
    );
  } else {
    return "";
  }
};

export type TeamSearchInputProps = {
  keyword: string;
  searchAble: boolean;
  searchStatus: SearchStatus;
  onKeyUp(ev: React.KeyboardEvent<HTMLInputElement>): void;
  onChange(str: React.ChangeEvent<HTMLInputElement>): void;
  onCreateTeam(): void;
  onClear(): void;
};

// sfc
export const TeamSearchInput: React.SFC<TeamSearchInputProps> = p => {
  return (
    <div className="team-search-input">
      <div className="search-picker-input">
        <SearchInput
          placeholder={"请输入团队名称"}
          clear={p.onClear}
          maxLength={30}
          searchkeyWord={p.onCreateTeam}
          keyword={p.keyword}
          onKeyDown={p.onKeyUp}
          onChange={p.onChange}
          prefixIcon={""}
          focus={true}
        />
        <Ele.secondBtn
          type={"primary"}
          className="teams-search-add-btn-text"
          onClick={() => {
            if (p.searchAble) {
              p.onCreateTeam();
            }
          }}
          disable={!p.searchAble}
        >
          创建
        </Ele.secondBtn>
      </div>
      {searchStatus2Views(p.searchStatus)}
    </div>
  );
};

// connect
export const C_TeamSearchInput = Fusion(S.TeamSearchAdd.getStore())<
  TeamSearchInputProps
>(s => {
  const add = S.TeamSearchAdd;
  return {
    keyword: s.keyword,
    searchAble: s.searchAble,
    searchStatus: s.searchStatus,
    onKeyUp: (ev): void => {
      if (ev.keyCode === 13) {
        s.searchAble && add.createTeam({});
      }
    },
    onChange(ev) {
      add.checkKeyword({
        keyword: ev.target.value,
      });
    },
    onCreateTeam() {
      add.createTeam({});
    },
    onClear() {
      add.clear({});
    },
  };
})(p => <TeamSearchInput {...p} />);
