import * as React from "react";
import { Popover, Icon, message } from "antd";
import { AddGroupTypes } from "../../../../../../AddGroup/AddGroupTypes";
import { showContactInfo } from "../../../../../utils";
import { S } from "../../../../../../../../stores";
import { http } from "../../../../../../../../services/http";
import { app } from "../../../../../../../../stores/app/app";
import { isResOK } from "../../../../../../../../utils/DataControl/ApiHelper";
import { HingerTypes } from "../../../../../../../../stores/DataHinger/DataHingerTypes";
import { Avatar } from "../../../../../../../common/component/Avatar/Avatar";
import { PersonMessagePopover } from "./PersonMessagePopCard";

export class OnePersonWithPop extends React.Component<
  {
    onepData: AddGroupTypes.OnePerson;
  },
  { visible: boolean }
> {
  state = {
    visible: false,
  };
  hide = () => {
    this.setState({
      visible: false,
    });
  };
  toggle = () => {
    this.setState(s => {
      return {
        visible: !s.visible,
      };
    });
  };
  handleVisibleChange = () => {
    this.setState({
      visible: true,
    });
  };
  render() {
    const onep = this.props.onepData;
    let registedShow;
    if (!onep.registed) {
      registedShow = <div className="person-not-regiter">未注册</div>;
    }
    function getBottomBtn(isFriend: boolean | undefined) {
      if (isFriend) {
        return (
          <div className="btn-group-member-info-btn is-friend">
            {/* <a className="icon-words common-disable">邀请会议</a> */}
            <a
              className="icon-words"
              onClick={() => {
                S.contactInfomationCardOperation.showOperation({
                  id: onep.id,
                });
                showContactInfo(onep.id);
                window.location.hash = "/contact/friends/" + onep.id;
              }}
            >
              查看详情
            </a>
          </div>
        );
      } else {
        return onep.registed ? (
          <div className="btn-group-member-info-btn not-friend">
            <a
              className="icon-words"
              onClick={() => {
                const { userData } = app.get();
                message.loading("正在添加联系人");
                http.contacts
                  .addContact(
                    { urluserId: userData._id },
                    {
                      headers: {
                        "x-user-id": userData._id,
                      },
                      data: {
                        mobile: "" + onep.userPersonalMessage.phone,
                        email: onep.userPersonalMessage.email,
                      },
                    }
                  )
                  .then(res => {
                    message.destroy();
                    if (isResOK(res)) {
                      message.success("添加成功");
                      let contact: HingerTypes.person = {
                        avatar: res.value.person.avatar,
                        displayName: res.value.person.displayName,
                        remark: "",
                        id: res.value.person._id,
                        createTime: res.value.person.createTime,
                        isMailConfig: res.value.person.isMailConfig,
                        personalMessage: {
                          phone: res.value.person.mobile,
                          email: res.value.person.email,
                          department: res.value.person.department,
                          jobTitle: res.value.person.jobTitle,
                        },
                        isFriend: true,
                      };

                      // 增加联系人信息，并且跳转到联系人详情页面
                      S.Hinger.insertContactData({
                        person: contact,
                      });
                    } else {
                      message.error("添加失败");
                    }
                  });
              }}
            >
              加为联系人
            </a>
          </div>
        ) : null;
      }
    }
    let result;
    //区分已注册用户和未注册用户
    //未注册用户点击头像不应该看到联系人卡片的信息
    if (onep.registed) {
      result = (
        <PersonMessagePopover onep={onep}>
          <Avatar
            onClick={this.toggle}
            className="middle-avatar"
            avatarUrl={onep.headIconUrl}
          />
        </PersonMessagePopover>
      );
    } else {
      result = (
        <Avatar
          onClick={this.toggle}
          className="middle-avatar"
          avatarUrl={onep.headIconUrl}
        />
      );
    }
    return (
      <div className="group-memeber-info">
        <div className="flex-one-row">
          {result}
          <div className="person-body">
            <div className="person-name">
              {onep.name ||
                onep.userPersonalMessage.phone ||
                onep.userPersonalMessage.email}
            </div>
            {registedShow}
          </div>
        </div>
      </div>
    );
  }
}
