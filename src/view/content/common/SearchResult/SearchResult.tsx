// import { Component } from "react";
import * as React from "react";
import { SFC } from "react";
import { Spin } from "antd";
import { ExtraErrorText } from "../ExtraErrorText/ExtraErrorText";
import "./style.scss";
import { avatarType, Avatar } from "../../../common/component/Avatar/Avatar";
import { SearchStatus } from "../../AddGroup/Piece/Search/SearchPeopleTypes";
export type SearchResultSFCProps = {
  isAdded: boolean;
  symbol: string;
  addLoading: boolean;
  notfoundText: string;
  info: avatarType;
  status: SearchStatus;
  addedText: string;
  name?: string;
  mobile?: string;
  email?: string;
  addUserAction: Function;
  avatarType?: string;
  _id?: string;
};

export type SearchResultSFCArgs = {
  className: string;
};

export const SearchResultSFC: SFC<
  SearchResultSFCProps & SearchResultSFCArgs
> = props => {
  const {
    isAdded,
    symbol,
    addLoading,
    addedText,
    notfoundText,
    addUserAction,
    info,
    status,
    name,
    className: classname,
    mobile,
    email,
    avatarType,
    _id,
  } = props;
  const className = `search-result-container${
    classname ? " " + classname : ""
  }`;
  if (status === "none") {
    return <div className="search-result-container" />;
  } else if (status === "notFound") {
    return (
      <div className={className}>
        <ExtraErrorText text={notfoundText} level="warning" />
      </div>
    );
  } else if (status === "networkFailed") {
    return (
      <div className={className}>
        <ExtraErrorText text={"网络异常"} level="error" />
      </div>
    );
  } else if (status === "systemError") {
    return (
      <div className={className}>
        <ExtraErrorText text={"系统出错"} level="error" />
      </div>
    );
  } else if (status === "found") {
    return (
      <div className={className}>
        <div className="search-result">
          <div className="search-result-info">
            <Avatar
              className="middle-avatar"
              {...(avatarType === "team"
                ? { teamsName: name, teamsId: _id }
                : {
                    avatarUrl: info.members[0].avatarUrl,
                  })}
            />
            <div className="search-result-text-info">
              <span className="result-text-info__name">{name}</span>
              <span className="result-text-info__symbol">
                {mobile || email || symbol}
              </span>
            </div>
          </div>
          {isAdded ? (
            <div className="search-result-member-has_added">{addedText}</div>
          ) : (
            <i
              className={`teams-icon icon-add ${
                addLoading ? "disable loading" : ""
              }`}
              onClick={() => {
                addUserAction();
              }}
            />
          )}
        </div>
      </div>
    );
  } else if (status === "loading") {
    return (
      <div className={className}>
        <div className="search-loading" />;
      </div>
    );
  } else {
    return <div className="search-result-container" />;
  }
};
