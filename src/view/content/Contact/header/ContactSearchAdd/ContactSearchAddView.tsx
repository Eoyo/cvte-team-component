import "./style.scss";
import { Component } from "react";
import * as React from "react";
import { Popover } from "antd";
import { isResOK } from "../../../../../utils/Restful";
import { SearchInput } from "../../../common/SearchInput/SearchInput";
import _ from "lodash";
import {
  TypeSearchPersonByKeywordTypesResponse,
  TypeSearchResultRes,
  TypeSearchPeopleProp,
  TypeSearchPeopleState,
  SearchStatus,
} from "src/view/content/AddGroup/Piece/Search/SearchPeopleTypes";
import {
  searchByKewordByRequest,
  addContactRequest,
} from "src/view/content/AddGroup/Piece/Search/interaction";
import { SearchResultViewV2 } from "src/view/content/AddGroup/Piece/Search/ResultView";

export class ContactSearchAdd extends Component<
  TypeSearchPeopleProp,
  TypeSearchPeopleState & {
    resultVisible: boolean;
  }
> {
  state = {
    popoverVisble: false,
    keyword: "",
    keywordType: "" as "",
    searchAble: false,
    searchResult: [] as TypeSearchPersonByKeywordTypesResponse,
    searchStatus: "none" as SearchStatus,
    resultVisible: false,
  };
  onSearch = _.debounce(() => {
    this._searchByKeyWord();
  }, 500);
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
  async _searchByKeyWord() {
    //如果不符合要求，则直接返回notfound
    if (!this.checkKeyWordValid("" + this.state.keyword)) {
      this.setState({
        searchStatus: "notFound",
        searchResult: [],
        resultVisible: true,
      });
      return;
    }
    this.setState(
      {
        searchStatus: "loading",
      },
      () => {
        this.setState({
          resultVisible: true,
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
  }
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
        resultVisible: false,
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
  render() {
    const {
      popoverVisble,
      keyword,
      searchStatus,
      searchResult,
      resultVisible,
    } = this.state;
    const {
      currentSelectData,
      onConfirm,
      onCancel,
      resutlItemClass,
    } = this.props;
    let className = "";
    if (searchStatus === "found") {
      className = "contact-search-add";
    } else if (searchStatus === "loading") {
      className = "search-people-loading-result";
    }
    return (
      <Popover
        placement="bottom"
        overlayClassName="searchInput-popover add-contact-popover"
        openClassName="searchInput-popover-open"
        visible={popoverVisble}
        onVisibleChange={visible => {
          this.setState({ popoverVisble: visible }, () => {
            if (!visible) {
              this.reset();
            }
          });
        }}
        trigger="click"
        content={
          <div className="contact-add-popover__innter">
            <div className="search-picker">
              <SearchInput
                clear={() => {
                  this.reset();
                }}
                keyword={keyword}
                onKeyUp={ev => {
                  if (ev.keyCode === 13) {
                    this._searchByKeyWord();
                  }
                }}
                onChange={ev => {
                  if (this.checkKeyWordValid(ev.target.value)) {
                    this.onSearch();
                  }
                  this.checkKeyword(ev.target.value);
                }}
                searchkeyWord={this._searchByKeyWord}
                placeholder={"手机号/邮箱/用户名"}
                prefixIcon={"search"}
                focus={true}
              />
            </div>
            {resultVisible ? (
              <SearchResultViewV2
                {...{
                  className: className,
                  resultLists: searchResult,
                  contactAddRequest: addContactRequest,
                  memberSelectOnConfirm: onConfirm,
                  memberSelectOnCancel: onCancel,
                  searchStatus: searchStatus,
                  type: "add",
                  currentSelectData,
                  resutlItemClass,
                }}
              />
            ) : null // 当前成员选择器确认选择成员
            }
          </div>
        }
      >
        <div className="main-content-header__nav-item">
          <i className="teams-icon icon-add-contact" />
          添加联系人
        </div>
      </Popover>
    );
  }
}
