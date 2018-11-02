import * as React from "react";
import { MessageShower } from "./Piece/MessageShower";
import { MemberList } from "./Piece/MemberList/MemberList";
import "./GroupMessage.scss";
import { S } from "../../../../../../stores";
import {
  AddGroupTypes,
  AddGroupInit,
} from "../../../../AddGroup/AddGroupTypes";
import { Fusion } from "../../../../../../stores/Actor/fusion";
import { U } from "../../../../../../utils";
import { Counter } from "src/view/content/Meeting/content/common/Counter/Counter";
import { HrLine } from "src/view/content/Meeting/content/common/Layout/TitleLine";
import { ScrollbarContain } from "src/view/content/common/ScrollbarContain/ScrollbarContain";

S.Hinger.subscribe(s => {
  const { groupMessage } = S.GroupMessage.grab();
  //如果hinger有改变，那么就在hinger中找到当前显示的groupid对应的group重新渲染
  if (s.opeType === "updateContact") {
    //在改变的group中查找要显示的id，如果没找到，说明当前显示的groupmessage暂无更新，不用重新渲染
    let index = s.groupChangeIds.findIndex(id => {
      return id === groupMessage.groupId;
    });
    if (index === -1) {
      return;
    }
    for (let i in s.groupList) {
      //找到当前团队信息卡片对应的group
      if (s.groupList[i].groupId === groupMessage.groupId) {
        let members: AddGroupTypes.OnePerson[] = [];
        for (let j in s.groupList[i].members) {
          let member = s.groupList[i].members[j];
          let tmpMember: AddGroupTypes.OnePerson = {
            id: member.user.id,
            name: member.user.remark || member.user.displayName,
            headIconUrl: member.user.avatar,
            registed: member.registed,
            userPersonalMessage: {
              email: member.user.personalMessage.email,
              phone: member.user.personalMessage.phone,
              department: member.user.personalMessage.department,
              jobTitle: member.user.personalMessage.jobTitle,
            },
            hasTrueId: !!member.user.id,
            // @ts-ignore;
            isFriend: member.user.isFriend,
          };
          members.push(tmpMember);
        }
        S.GroupMessage.merge({
          groupMessage: {
            groupName: s.groupList[i].groupName,
            groupId: s.groupList[i].groupId,
            createTimeStick: s.groupList[i].createTimeStick,
          },
          groupMemberlist: {
            value: members,
          },
        });
        break;
      }
    }
  }
});
export const ContainGroupMessage = Fusion(S.GroupMessage.getStore())(s => {
  return {
    memberList: s.groupMemberlist,
    groupMessage: s.groupMessage,
  };
})(function GroupMessageView(p) {
  const me = {
    show() {
      S.GroupMessage.merge({
        showCreateGroup: true,
      });
      S.addGroup.merge({
        onceType: "setGroupId",
        aimGroupId: p.groupMessage.groupId,
      });

      S.addGroup.merge({
        searchPeopleModel: AddGroupInit.searchPeopleModel,
        exitedId: p.memberList.value.map(p => {
          return (
            p.id ||
            p.userPersonalMessage.phone + "" ||
            p.userPersonalMessage.email
          );
        }),
      });
    },
    getLength() {
      const len = U.getValue("")(p.memberList, "value", "length");
      return len ? `(${len})` : "";
    },
  };
  return (
    <div className="group-message team-info-card">
      <div className="group-base-message">
        <div className="group-base-body">
          <MessageShower data={p.groupMessage} />
        </div>
      </div>
      <div className="group-members">
        <div className="group-members-title">
          <div className="group-members-line">
            <div className="group-members-info-title">
              团队成员
              <Counter num={p.memberList.value.length} />
            </div>
            <div className="group-members-addmembers-button" onClick={me.show}>
              <i className="teams-icon icon-add-members" />
              <span className="group-members-addmembers-text" />
            </div>
          </div>
          <HrLine className={"memberlist-line"} />
        </div>
        <div className="group-base-body group-base-body-memberList">
          <ScrollbarContain>
            <MemberList data={p.memberList.value} />
          </ScrollbarContain>
        </div>
      </div>
      {/* <div className="group-message-btns">
        <Ele.mainBtn disable={true} type="primary">
          发起团队会议
        </Ele.mainBtn>
      </div> */}
    </div>
  );
});
