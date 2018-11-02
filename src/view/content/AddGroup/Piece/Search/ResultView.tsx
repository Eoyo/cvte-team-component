import * as React from "react";
import { SFC } from "react";
import { Spin } from "antd";
import {
  isFriendInMembersSelector,
  isFriendInContactAdd,
  getPersonSelectorIconTypeInMemberManager,
  getPersonSelectorIconTypeInAddContact,
} from "./interaction";
import "./style.scss";
import {
  iAvatarProps,
  Avatar,
} from "../../../../common/component/Avatar/Avatar";
import { ExtraErrorText } from "../../../common/ExtraErrorText/ExtraErrorText";
import { message } from "antd";
import {
  TypeAddContactRes,
  TypeSearchResultItem,
  SearchResultViewV2Args,
  SearchResultViewV2AState,
  TypeResultItemOperatorProps,
  Type_resultListsItem,
  SearchStatus,
} from "./SearchPeopleTypes";
import { Component } from "react";
import { ScrollbarContain } from "src/view/content/common/ScrollbarContain/ScrollbarContain";
import { PersonSelector } from "../Person/PersonSelector";
import { isResOK } from "src/utils/Restful";
import { app } from "src/stores/app/app";
import { HingerTypes } from "src/stores/DataHinger/DataHingerTypes";
import { S } from "src/stores";
import { arrCss } from "../../../../../utils/export";

const Style2lineClamp = {
  display: "-webkit-box",
  webkitBoxOrient: "vertical",
};

export const ResultItemOperator: SFC<TypeResultItemOperatorProps> = props => {
  const {
    isInMemberSelector,
    isFriend,
    memberSelectHandler,
    personSelectoriconType,
    addContactByIdRequest,
  } = props;
  if (isInMemberSelector) {
    return isFriend ? (
      <PersonSelector
        onClick={() => {
          memberSelectHandler();
        }}
        select={personSelectoriconType}
        opeType="select"
      />
    ) : (
      <div className="search-result-add-status">
        <i
          className="teams-icon icon-add"
          onClick={() => {
            addContactByIdRequest();
          }}
        />
      </div>
    );
  } else {
    return isFriend ? (
      <div className="search-result-add-text">已添加</div>
    ) : (
      <div className="search-result-add-status">
        <i
          className="teams-icon icon-add"
          onClick={() => {
            addContactByIdRequest();
          }}
        />
      </div>
    );
  }
};
// 搜索结果item
export class SearchRusultItem extends Component<
  TypeSearchResultItem,
  {
    addLoading: boolean;
  }
> {
  state = {
    addLoading: false,
  };
  render() {
    const {
      className,
      addContactByIdRequest,
      memberSelectHandler,
      avatar,
      displayName,
      department,
      jobTitle,
      _id,
      personSelectoriconType,
      isFriend,
      type,
    } = this.props;
    const info: iAvatarProps = {
      avatarUrl: avatar,
    };
    let id = app.get("userData")._id;
    let isSelf = false;
    if (id === _id) {
      isSelf = true;
    }
    const isInMemberSelector = type === "manage";
    return (
      <div
        className={`search-result ${className || ""} ${
          isInMemberSelector ? "" : "add-contact-style"
        }`}
      >
        <div className="search-result-info">
          <Avatar
            className={isInMemberSelector ? "small-avatar" : "middle-avatar"}
            {...info}
          />
          <div className="search-result-text-info">
            <div className="result-text-info__name">{displayName}</div>
            <div className="result-text-info__symbol" style={Style2lineClamp}>
              {department || "未录入"}/{jobTitle || "未录入"}
            </div>
          </div>
        </div>
        {isSelf ? null : (
          <ResultItemOperator
            isInMemberSelector={isInMemberSelector}
            isFriend={isFriend}
            memberSelectHandler={memberSelectHandler}
            personSelectoriconType={personSelectoriconType}
            addContactByIdRequest={addContactByIdRequest}
          />
        )}
      </div>
    );
  }
}

// 搜索结果
export class SearchResultViewV2 extends Component<
  SearchResultViewV2Args & SearchResultViewV2AState
> {
  state = {
    searchStatus: this.props.searchStatus,
    _resultLists: [] as Type_resultListsItem[],
  };
  constructor(props) {
    super(props);
  }

  dealResultLists = props => {
    const { resultLists, type, currentSelectData } = props;
    // 是否在成员管理中
    const isInMemberSelector = type === "manage";
    return resultLists.map(item => {
      // 判断是否为好友
      // 判断是否已经添加
      const isFriend = isInMemberSelector
        ? !!isFriendInMembersSelector(item._id)
        : !!isFriendInContactAdd(item._id);
      // 获取选择图标类型
      const personSelectoriconType = isInMemberSelector
        ? getPersonSelectorIconTypeInMemberManager(currentSelectData, item)
        : getPersonSelectorIconTypeInAddContact(isFriend, item);
      return { ...item, isFriend, personSelectoriconType };
    });
  };
  componentWillReceiveProps(nextProps, curState) {
    this.setState({
      _resultLists: this.dealResultLists(nextProps),
      searchStatus: nextProps.searchStatus,
    });
  }
  componentDidMount() {
    this.setState({
      _resultLists: this.dealResultLists(this.props),
    });
  }

  async addContactRequest(id: string, data: Type_resultListsItem) {
    const { contactAddRequest: addContactByIdRequest } = this.props;
    const { _resultLists } = this.state;
    const { _id: myId } = app.get("userData");
    const res: TypeAddContactRes = await addContactByIdRequest(
      myId,
      data.email
    );
    if (isResOK(res)) {
      const {
        value: {
          person: {
            avatar,
            displayName,
            _id,
            createTime,
            mobile,
            email,
            department,
            jobTitle,
          },
        },
      } = res;

      const contact: HingerTypes.person = {
        avatar: avatar,
        displayName: displayName,
        remark: "",
        id: _id,
        createTime: createTime,
        isMailConfig: true,
        personalMessage: {
          phone: mobile,
          email: email,
          department,
          jobTitle,
        },
        isFriend: true,
      };
      // 增加联系人信息，并且跳转到联系人详情页面
      S.Hinger.insertContactData({
        person: contact,
      });
      const index = _resultLists.findIndex(item => {
        return item._id === id;
      });
      // 将是否好友状态更改
      const result = _resultLists[index];
      _resultLists.splice(index, 1, {
        ...result,
        isFriend: true,
      });
      this.setState(
        {
          _resultLists: [..._resultLists],
        },
        () => {
          this.memberSelectChangeHandler(id, data);
        }
      );
    } else {
      message.destroy();
      message.warning("网络异常");
      await this.setState({});
    }
  }
  async memberSelectChangeHandler(id: string, data: Type_resultListsItem) {
    const { memberSelectOnConfirm, memberSelectOnCancel } = this.props;
    const { personSelectoriconType } = data;
    // 非已存在的
    if (personSelectoriconType !== "exited") {
      personSelectoriconType === "static"
        ? // 确认选择成员加入
          memberSelectOnConfirm({
            isRegister: true,
            mobile: data.mobile,
            avatar: data.avatar,
            email: data.email,
            id: data._id,
            name: data.displayName,
            department: data.department,
            jobTitle: data.jobTitle,
          })
        : // 取消选择成员
          memberSelectOnCancel(data._id);
    }
  }

  render() {
    const { className, resutlItemClass, type } = this.props;
    const { _resultLists, searchStatus } = this.state;
    let content = null as JSX.Element | null;
    let first = true;
    if (searchStatus === "loading") {
      content = (
        <div className="search-loading-wrapper">
          <div className="search-loading-svg" />
          <div className="search-loading-content">正在加载...</div>
        </div>
      );
    } else if (searchStatus === "notFound") {
      content = <ExtraErrorText text="未找到该用户" level="error" />;
    } else if (searchStatus === "systemError") {
      content = <ExtraErrorText text="系统出错" level="error" />;
    } else if (searchStatus === "found") {
      content = (
        <ScrollbarContain>
          {_resultLists.map(item => {
            let className =
              first === false
                ? " add-contact-not-first-style"
                : " add-contact-first-style";
            if (first === true) {
              first = false;
            }
            return (
              <SearchRusultItem
                type={type}
                className={arrCss([resutlItemClass, className])}
                key={item._id}
                addContactByIdRequest={() => {
                  this.addContactRequest(item._id, item);
                }}
                memberSelectHandler={() => {
                  this.memberSelectChangeHandler(item._id, item);
                }}
                {...item}
              />
            );
          })}
        </ScrollbarContain>
      );
    } else if (searchStatus === "networkFailed") {
      content = <ExtraErrorText text="网络异常" level="error" />;
    }
    return (
      <div className={`search-result-container-v2 ${className}`}>{content}</div>
    );
  }
}
