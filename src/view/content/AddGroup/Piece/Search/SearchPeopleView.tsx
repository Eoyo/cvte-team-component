import { Component } from "react";
import * as React from "react";
import { Popover } from "antd";
import { searchByKewordByRequest, addContactRequest } from "./interaction";
import { SearchResultViewV2 } from "./ResultView";
import _ from "lodash";

import {
  TypeSearchPeopleViewProps,
  TypeSearchPeopleState,
  TypeSearchResultRes,
  TypeSearchPersonByKeywordTypesResponse,
  ConfirmRusType,
  SearchStatus,
} from "./SearchPeopleTypes";
import { SearchInput } from "src/view/content/common/SearchInput/SearchInput";
import { isResOK } from "src/utils/DataControl/ApiHelper";

export class SearchPeople extends Component<
  TypeSearchPeopleViewProps,
  TypeSearchPeopleState
> {
  state = {
    popoverVisble: false,
    keyword: "",
    keywordType: "" as "",
    searchAble: false,
    searchResult: [] as TypeSearchPersonByKeywordTypesResponse,
    searchStatus: "none" as SearchStatus,
  };
  checkKeyWordValid(keyword: string) {
    if (/^[1-9]\d*|0$/.test(keyword)) {
      if (keyword.length < 4) {
        return false;
      }
    }
    if (!/[\u4e00-\u9fa5]/.test(keyword)) {
      if (keyword.length < 3) {
        return false;
      }
      if (!keyword.split("@")[0]) {
        return false;
      }
    }
    return true;
  }

  // 搜索用户
  _searchByKeyWord = async () => {
    //如果不符合要求，则直接返回notfound
    if (!this.checkKeyWordValid(this.state.keyword)) {
      this.setState({
        searchStatus: "notFound",
        searchResult: [],
        popoverVisble: true,
      });
      return;
    }
    this.setState(
      {
        searchStatus: "loading",
      },
      () => {
        this.setState({
          popoverVisble: true,
        });
      }
    );
    // 请求
    const res: TypeSearchResultRes = await searchByKewordByRequest(
      this.state.keyword
    );
    if (isResOK(res)) {
      await this.setState({
        searchStatus: "found",
        searchResult: res.value,
      });
    } else {
      let result: any = res;
      if (result.code === "6-0000") {
        await this.setState({
          searchStatus: "networkFailed",
          searchResult: [],
        });
      } else if (result.code === 4041000) {
        await this.setState({
          searchStatus: "notFound",
          searchResult: [],
        });
      } else {
        await this.setState({
          searchStatus: "systemError",
          searchResult: [],
        });
      }
    }
  };
  // keyword检查
  checkKeyword(value: string) {
    if (!value) {
      this.reset();
    } else {
      this.setState({ keyword: value, searchAble: true });
    }
  }
  // 重置搜索框
  reset() {
    this.setState(
      {
        popoverVisble: false,
        keyword: "",
      },
      () => {
        this.setState({
          searchAble: false,
          searchResult: [] as TypeSearchPersonByKeywordTypesResponse,
          searchStatus: "none",
        });
      }
    );
  }
  confirmCallback = (data: ConfirmRusType) => {
    const { onConfirm } = this.props;
    const { searchResult } = this.state;
    onConfirm(data);
    // 若列表只有一个人，则点击“添加”/“勾选”后，列表弹框消失
    if (searchResult.length === 1) {
      this.setState({
        popoverVisble: false,
      });
    }
  };
  onSearch = _.debounce(() => {
    this._searchByKeyWord();
  }, 500);

  render() {
    const {
      popoverVisble,
      keyword,
      searchAble,
      searchStatus,
      searchResult,
    } = this.state;
    const {
      currentSelectData,
      onCancel,
      overlayClassName,
      placement,
      arrowPointAtCenter,
      resutlItemClass,
      placeholder,
      openClassName,
    } = this.props;
    let className = "";
    if (searchStatus === "found") {
      className = "search-people-found-result";
    } else if (
      searchStatus === "notFound" ||
      searchStatus === "networkFailed" ||
      searchStatus === "systemError"
    ) {
      className = "search-people-not-found-result";
    } else if (searchStatus === "loading") {
      className = "search-people-loading-result";
    }
    return (
      <Popover
        openClassName={openClassName}
        overlayClassName={overlayClassName}
        placement={placement || "bottom"}
        arrowPointAtCenter={arrowPointAtCenter && true}
        onVisibleChange={visible => {
          this.setState({ popoverVisble: visible });
        }}
        content={
          <SearchResultViewV2
            {...{
              className: className,
              resultLists: searchResult,
              contactAddRequest: addContactRequest,
              // 当前成员选择器确认选择成员
              memberSelectOnConfirm: this.confirmCallback,
              memberSelectOnCancel: onCancel,
              searchStatus: searchStatus,
              type: "manage",
              currentSelectData,
              resutlItemClass,
            }}
          />
        }
        visible={searchAble && popoverVisble}
        trigger="contextMenu"
      >
        <div className="search-people-box">
          <div className="search-people-box-filter">
            <SearchInput
              clear={() => {
                this.reset();
              }}
              placeholder={placeholder}
              keyword={keyword}
              onChange={ev => {
                if (this.checkKeyWordValid(ev.target.value)) {
                  this.onSearch();
                }
                this.checkKeyword(ev.target.value);
              }}
              onKeyDown={(ev: any) => {
                if (ev.keyCode === 13) {
                  this._searchByKeyWord();
                }
              }}
              searchkeyWord={this._searchByKeyWord}
              prefixIcon={"search"}
            />
          </div>
        </div>
      </Popover>
    );
  }
}
