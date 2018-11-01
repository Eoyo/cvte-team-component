import * as React from "react";
import { Fusion } from "../../../../../../stores/Actor/fusion";
import { S } from "../../../../../../stores";
import { message } from "antd";
import { http } from "../../../../../../services/http";
import { isResOK } from "../../../../../../utils/Restful";
import { HingerTypes } from "../../../../../../stores/DataHinger/DataHingerTypes";
import { AddGroupTypes } from "../../../../AddGroup/AddGroupTypes";
import { app } from "../../../../../../stores/app/app";
import { PopShowAddGroup } from "../../../../AddGroup/PopShowAddGroup";
import { getITAvatarUrl } from "src/services/avatar";

function selectGroupMemeber(
  teamId: string,
  selected: AddGroupTypes.PersonSelector[]
) {
  // 添加查询数据
  let search = {
    emails: [] as string[],
    mobiles: [] as any[],
    ids: [] as string[],
  };
  selected.forEach(d => {
    if (d.registed) {
      search.ids.push(d.id);
    } else {
      if (d.hasTrueId) {
        search.ids.push(d.id);
      } else if (d.userPersonalMessage.email) {
        search.emails.push(d.userPersonalMessage.email);
      } else if (d.userPersonalMessage.phone) {
        search.mobiles.push(d.userPersonalMessage.phone + "");
      }
    }
  });
  http.group
    .inviteMembers(
      { teamId: teamId },
      {
        data: search,
        headers: {
          "x-user-id": app.get("userData")._id,
        },
      }
    )
    .then(res => {
      const mes = {
        success: `添加成功`,
      };
      message.destroy();
      if (isResOK(res)) {
        const { value } = res;
        let members: HingerTypes.member[] = [];
        const { personList } = S.Hinger.grab();
        for (let i in value.members) {
          let member: HingerTypes.member = {
            user: {
              id: "",
              avatar: "",
              displayName: "",
              remark: "",
              personalMessage: {
                email: "",
                phone: "",
                department: "",
                jobTitle: "",
              },
            },
            registed: false,
          };
          let user = value.members[i].user;
          let isFriend: boolean = false;
          let person;
          for (let j in personList) {
            if (personList[j].id === user._id) {
              person = personList[j];
              isFriend = true;
            }
          }
          //如果有systemId就是已注册用户
          if (user.systemId) {
            member.user.id = user._id;
            member.user.avatar = user.avatar || "";
            // member.user.avatar = user.avatar || "";

            // user.email
            //   ? getITAvatarUrl(user.email)
            //   : user.avatar || "";
            member.user.displayName = user.displayName;
            member.user.personalMessage.phone = user.mobile + "";
            if (user.isMailConfig) {
              //@ts-ignore; mail is config;
              member.personalMessage.email = user.email;
            }
            member.user.remark = person && person.remark;
            member.registed = true;
            member.user.isFriend = isFriend;
            // 通过电话邀请的
          } else {
            // 电话邀请的使用电话为id;
            member.user.id = user._id;
            member.user.avatar = user.avatar || "";
            /*
              user.email
              ? getITAvatarUrl(user.email)
              : user.avatar || "";
             */
            member.user.displayName = "";
            member.registed = false;
            member.user.personalMessage.phone = user.mobile;
            member.user.personalMessage.email = user.email;
            member.user.isFriend = isFriend;
          }
          members.push(member);
        }
        S.Hinger.updateTeamProperty({
          groupId: value._id.toString(),
          changeProperty: {
            members: members,
          },
        });
        let persons: AddGroupTypes.OnePerson[] = [];
        for (let i in members) {
          let member = members[i];
          let tmpMember: AddGroupTypes.OnePerson = {
            id: member.user.id,
            hasTrueId: !!member.user.id,
            name: member.user.remark || member.user.displayName,
            headIconUrl: member.user.avatar,
            registed: member.registed,
            userPersonalMessage: {
              email: member.user.personalMessage.email,
              phone: member.user.personalMessage.phone,
              department: member.user.personalMessage.department,
              jobTitle: member.user.personalMessage.jobTitle,
            },
            isFriend: member.user.isFriend,
          };
          persons.push(tmpMember);
        }
        S.GroupMessage.merge({
          groupMemberlist: {
            value: persons,
          },
        });
        message.destroy();
        message.success(mes.success);
        S.addGroup.resetAddGroup({});
      } else {
        message.error("添加失败");
      }
    });
}

/**
 * 团队成员选择器.
 */
export const C_PopGroupMemberSelector = Fusion(S.GroupMessage.getStore())(s => {
  return {
    onGroupAddConfirm(decide: boolean, value?: AddGroupTypes.PersonSelector[]) {
      if (decide && value && value.length > 0) {
        selectGroupMemeber(s.groupMessage.groupId, value);
        S.GroupMessage.merge({
          showCreateGroup: false,
        });
        S.addGroup.merge({
          selectGroup: {
            containMemberId: [],
            adding: 0,
          },
          aimGroupId: "",
        });
      } else {
        S.Meeting.troggleAddGroup({
          show: false,
        });
        S.GroupMessage.merge({
          showCreateGroup: false,
        });
        S.addGroup.merge({
          selectGroup: {
            containMemberId: [],
            adding: 0,
          },
          aimGroupId: "",
        });
      }
      S.addGroup.clearAddGroupSearch({});
    },
    visible: s.showCreateGroup,
  };
})(p => <PopShowAddGroup {...p} />);
