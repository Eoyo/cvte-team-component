import * as React from "react";
import { AddGroupTypes, AddGroupProps } from "./AddGroupTypes";
import { FusionPro } from "../../../stores/utils/fusion";
import { S } from "../../../stores";
import { PersonList } from "./Piece/Person/PersonList";
import { Button } from "antd";
import { SelectDescription } from "./Piece/Bijous/SelectDescription";
import { GroupList } from "./Piece/Group/GroupList";
import { SelectedList } from "./Piece/Person/SelectedList";
import { ConfirmRusType } from "./Piece/Search/SearchPeopleTypes";
import { SearchPeople } from "./Piece/Search/SearchPeopleView";
import "./style.scss";
import { ScrollbarContain } from "../common/ScrollbarContain/ScrollbarContain";
import { Ele } from "../../common/ts-styled/ele";

// react 渲染前的初始化工作
// 同步联系人的信息
S.Hinger.subscribe(s => {
  if (s.opeType === "updateContact") {
    const { myContact, selectGroup, consistentData } = S.addGroup.grab();
    let open = myContact.myFriend.open;
    const myFriend: AddGroupTypes.myFriend = {
      memberList: [],
      containMemberId: [],
      open: open,
    };

    // 所有的可联系到的人
    const contactBulk = consistentData.memberList;
    s.personList.map(d => {
      myFriend.containMemberId.push(d.id);
      let flag = false;
      //只增加增量部分，不删除
      for (let i in consistentData.memberList) {
        if (consistentData.memberList[i].id === d.id) {
          flag = true;
        }
        break;
      }
      if (flag === false) {
        contactBulk.push({
          id: d.id,
          name: d.remark || d.displayName,
          headIconUrl: d.avatar,
          registed: true,
          userPersonalMessage: {
            phone: d.personalMessage.phone,
            email: d.personalMessage.email,
            department: d.personalMessage.department,
            jobTitle: d.personalMessage.jobTitle,
          },
          select: "static",
        } as AddGroupTypes.PersonSelector);
      }
    });
    const groupList = s.groupList.map(d => {
      const containMemberId = d.members.map(d => {
        let flag = false;
        for (let i in contactBulk) {
          if (contactBulk[i].id === d.user.id) {
            flag = true;
            break;
          }
        }
        //如果有已经插入的了，就不要重复插入
        if (flag === true) {
          return d.user.id;
        }
        contactBulk.push({
          id: d.user.id,
          name: d.user.remark || d.user.displayName,
          headIconUrl: d.user.avatar,
          registed: d.registed,
          hasTrueId: !!d.user.id,
          userPersonalMessage: {
            email: d.user.personalMessage.email,
            phone: d.user.personalMessage.phone,
            department: d.user.personalMessage.department,
            jobTitle: d.user.personalMessage.jobTitle,
          },
          select: "static",
        });
        return d.user.id;
      });
      let open = false;
      for (let i in myContact.myGroups.groupList) {
        let group = myContact.myGroups.groupList[i];
        if (group.groupId === d.groupId) {
          open = group.open;
          break;
        }
      }
      return {
        groupName: d.groupName,
        open: open,
        selectType: "none",
        containMemberId,
        memberList: [],
        groupId: d.groupId,
      } as AddGroupTypes.OneGroup;
    });
    open = myContact.myGroups.open;
    // 更新数据
    S.addGroup.merge({
      myContact: {
        myFriend,
        myGroups: {
          open: open,
          groupList,
        },
      },
      selectGroup: {
        memberList: [],
        containMemberId: selectGroup.containMemberId,
        adding: selectGroup.adding,
      },
      consistentData: {
        memberList: contactBulk,
      },
    });
  }
});

export const ContainAddGroup = FusionPro(
  S.addGroup.getStore(),
  (s, ownProps: AddGroupProps) => {
    return {
      person: s.myContact.myFriend,
      group: s.myContact.myGroups,
      select: s.selectGroup,
      searchPeopleModel: s.searchPeopleModel,
    };
  },
  function ContainAddGroup(p) {
    const me = {
      doneSelect() {
        p.onGroupAddConfirm(true, p.select.memberList);
        S.addGroup.clearAddGroupSearch({});
      },
      cancelSelect() {
        p.onGroupAddConfirm(false);
        S.addGroup.clearAddGroupSearch({});
      },
      addPerson(p: ConfirmRusType) {
        //如果没有id，就注册电话或邮箱
        if (!p.id) {
          S.addGroup.selectedUnregistedOne({
            personData: p,
          });
        } else {
          S.addGroup.addSelectedPerson({
            personData: p,
          });
        }
      },
    };
    console.log(
      "p.select.memberList",
      p.select.memberList,
      p.select.memberList.length
    );
    return (
      <div className="add-group-modal-wrapper">
        <div className="add-group-grid view-member-adding">
          <div className="add-group-view-top">
            <SearchPeople
              overlayClassName="over-modal-popover addgroud-search-people"
              {...p.searchPeopleModel}
              onConfirm={me.addPerson}
              onCancel={(id: string) => {
                S.addGroup.operatePerson({
                  id: id,
                  opeType: "cancel",
                });
              }}
              placeholder="手机号/邮箱/用户名"
              currentSelectData={p.person.memberList}
            />
          </div>
          <div className="view-content">
            <ScrollbarContain
              niceScrollConfig={{
                // railhoffset: -20,
                railpadding: {
                  right: -15,
                },
              }}
            >
              <PersonList
                {...{ open: p.person.open, memberList: p.person.memberList }}
              />
              <GroupList group={p.group} />
            </ScrollbarContain>
          </div>
        </div>

        <div className="add-group-grid view-member-selected">
          <div className="view-top view-member-selectd-top">
            <SelectDescription
              sum={p.select.containMemberId.length}
              adding={p.select.adding}
            />
          </div>
          <div className="view-content">
            <ScrollbarContain
              niceScrollConfig={{
                railpadding: {
                  right: -15,
                },
              }}
            >
              <SelectedList memberList={p.select.memberList} />
            </ScrollbarContain>
          </div>
          <div className="btn-list">
            <div className="btn-space" />
            <Ele.secondBtn onClick={me.cancelSelect}>取消</Ele.secondBtn>
            <div className="btn-space" />
            <Ele.secondBtn
              type={"primary"}
              disable={false}
              onClick={me.doneSelect}
            >
              确定
            </Ele.secondBtn>
          </div>
        </div>
      </div>
    );
  }
);
