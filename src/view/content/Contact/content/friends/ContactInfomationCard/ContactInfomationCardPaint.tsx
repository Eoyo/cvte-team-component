import "./ContactInfomationCard.scss";
import * as React from "react";
import { FusionPro } from "../../../../../../stores/utils/fusion";
import { S } from "../../../../../../stores";
import { Avatar } from "../../../../../common/component/Avatar/Avatar";
import { EditRemarkComponents } from "./editRemark/editRemarkPaint";

const ContactInfomationCardFusion = FusionPro(
  S.contactInfomationCardOperation.getStore(),
  s => {
    return {
      displayName: s.displayName,
      sex: s.sex,
      avatar: s.avatar,
      remark: s.remark,
      phone: s.phone,
      email: s.email,
      id: s.id,
      editRemark: s.editRemark,
      editResult: s.editResult,
      showCard: s.showCard,
      moreActive: s.moreActive,
      department: s.department,
      jobTitle: s.jobTitle,
    };
  },
  function(c) {
    function handleEditRemark() {
      S.contactInfomationCardOperation.editRemarkOperation({});
    }
    let showType = false;
    let sexType = "man";
    if (c.sex === "man") {
      sexType = "man";
      showType = true;
    } else if (c.sex === "woman") {
      sexType = "woman";
      showType = true;
    }
    let remark = !c.remark ? "添加备注名" : c.remark;
    let phone = c.phone ? c.phone : "未配置";
    let email = c.email ? c.email : "未配置";
    let avatarInfo = {
      name: c.remark || "",
      members: [
        {
          userId: c.id,
          name: c.remark || "",
          avatarUrl: c.avatar,
        },
      ],
    };
    //如果不要显示卡片，那么就返回一个div
    if (c.showCard === false) {
      return <div className="contactInfomationCard" />;
    } else {
      return (
        <div className="contactInfomationCard">
          <div className="contactInfomationCard-startInfo">
            <Avatar avatarUrl={avatarInfo.members[0].avatarUrl} />
            <div className="contentInfomationCard-startInfo-name-wrapper">
              {/* 如果没有设置remark，就显示name，remark可以为空 */}
              <div className="contactInfomationCard-startInfo-remark">
                {c.remark || c.displayName}
              </div>
              <div className="contactInfomationCard-startInfo-name">
                用户名：
                {c.displayName}
              </div>
            </div>
          </div>
          <div className="contactInfomationCard-baseInfos">
            <ul className="contactInfomationCard-baseInfos-lists">
              <li className="contactInfomationCard-baseInfos-item">
                <span className="contactInfomationCard-baseInfos-item-title">
                  备注名称
                </span>
                {/* 显示的备注名和编辑备注名会只存其一 */}
                <div className="contactInfomationCard-baseInfos-item-value">
                  {!c.editRemark ? (
                    <div className="remark-wrapper">
                      <span className="remark-wrapper-text">{remark}</span>
                      <i
                        className="teams-icon icon-edit"
                        onClick={handleEditRemark}
                      />
                    </div>
                  ) : (
                    <EditRemarkComponents
                      id={c.id}
                      name={c.displayName}
                      editResult={c.editResult}
                      remark={c.remark}
                      style={{ marginTop: "-9px" }}
                    />
                  )}
                </div>
              </li>
              <li className="contactInfomationCard-baseInfos-item">
                <span className="contactInfomationCard-baseInfos-item-title">
                  联系电话
                </span>
                <span className="contactInfomationCard-baseInfos-item-value">
                  {phone}
                </span>
              </li>
              <li className="contactInfomationCard-baseInfos-item">
                <span className="contactInfomationCard-baseInfos-item-title">
                  电子邮箱
                </span>
                <span className="contactInfomationCard-baseInfos-item-value">
                  {email}
                </span>
              </li>
              <li className="contactInfomationCard-baseInfos-item">
                <span className="contactInfomationCard-baseInfos-item-title">
                  所属部门
                </span>
                <span className="contactInfomationCard-baseInfos-item-value clamp-text">
                  {c.department ? c.department : "未录入"}/
                  {c.jobTitle ? c.jobTitle : "未录入"}
                </span>
              </li>
            </ul>
          </div>
          {/* <div className="contactInfomationCard-invitemeeting-btn">
            <Ele.mainBtn className="disable">邀请会议</Ele.mainBtn>
          </div> */}
        </div>
      );
    }
  }
);

interface IContactInfomationCard {
  className?: string;
}

class ContactInfomationCard extends React.Component<IContactInfomationCard> {
  render() {
    return (
      <div className={this.props.className}>
        <ContactInfomationCardFusion />
      </div>
    );
  }
}

export { ContactInfomationCard };
