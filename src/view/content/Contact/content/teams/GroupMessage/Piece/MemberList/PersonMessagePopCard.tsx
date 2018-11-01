import * as React from "react";
import { Popover, Icon, message } from "antd";
import { showContactInfo } from "../../../../../utils";
import { S } from "../../../../../../../../stores";
import { http } from "../../../../../../../../services/http";
import { app } from "../../../../../../../../stores/app/app";
import { isResOK } from "../../../../../../../../utils/DataControl/ApiHelper";
import { HingerTypes } from "../../../../../../../../stores/DataHinger/DataHingerTypes";
import { Avatar } from "../../../../../../../common/component/Avatar/Avatar";
import { U } from "../../../../../../../../utils";
import { AddGroupTypes } from "src/view/content/AddGroup/AddGroupTypes";
import "./PersonMessagePopCard.scss";
import { arrCss } from "src/utils/export";

export const PersonOperateBtn: React.SFC<{
  isFriend?: boolean;
  isShelf: boolean;
  onep: AddGroupTypes.OnePerson;
}> = p => {
  const { isFriend, onep } = p;

  if (p.isShelf) {
    return (
      // <div className="btn-group-member-info-btn">
      //   <a className="icon-words"> 我自己 </a>
      // </div>
      null
    );
  }

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
                    remark: res.value.remark,
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
};

// 人员信息的Popover;
// Dependents(2) : meeting memberlist, Team memebrelist;
export const PersonMessagePopover: React.SFC<{
  onep?: AddGroupTypes.OnePerson;
}> = p => {
  const { onep } = p;
  if (onep) {
    const isShelf = onep.id === S.Hinger.grab().self.id;
    return (
      <Popover
        style={{ padding: "5px" }}
        overlayClassName={arrCss([
          "group-member-info-popover",
          isShelf && "myself",
        ])}
        openClassName="group-member-info-popover-open"
        title={
          <div className="member-title">
            <div className="member-main-info">
              <div className="member-main-info-name">{onep.name}</div>
              <Avatar className="big-avatar" avatarUrl={onep.headIconUrl} />
            </div>
            <div className="member-baseinfo">
              <div className="member-baseinfo-item">
                <span className="member-baseinfo-item-title">用户账号</span>
                <span className="member-baseinfo-item-value">
                  {U.getValue("未绑定")(onep, "userPersonalMessage", "phone")}
                </span>
              </div>
              <div className="member-baseinfo-item">
                <span className="member-baseinfo-item-title">电子邮箱</span>
                <span className="member-baseinfo-item-value">
                  {U.getValue("未绑定")(onep, "userPersonalMessage", "email")}
                </span>
              </div>
              <div className="member-baseinfo-item">
                <span className="member-baseinfo-item-title">所属部门</span>
                <span className="member-baseinfo-item-value">
                  {U.getValue("未录入")(
                    onep,
                    "userPersonalMessage",
                    "department"
                  )}
                  /
                  {U.getValue("未录入")(
                    onep,
                    "userPersonalMessage",
                    "jobTitle"
                  )}
                </span>
              </div>
            </div>
          </div>
        }
        content={
          <div className="person-viewer-content">
            <PersonOperateBtn
              isShelf={isShelf}
              isFriend={onep.isFriend}
              onep={onep}
            />
          </div>
        }
        trigger="click"
      >
        {p.children}
      </Popover>
    );
  } else {
    return (
      <Popover
        style={{ padding: "5px" }}
        overlayClassName="group-member-info-popover"
        openClassName="group-member-info-popover-open"
        title={
          <div className="member-title">
            <div className="member-main-info">未找到该用户的信息</div>
          </div>
        }
        trigger="click"
      >
        {p.children}
      </Popover>
    );
  }
};
