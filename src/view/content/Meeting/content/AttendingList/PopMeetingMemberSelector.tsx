import { MeetingConnect } from "../../../../../pivot/Meeting/Actor/MeetingActor";
import {
  PopShowAddGroupProps,
  PopShowAddGroup,
} from "../../../AddGroup/PopShowAddGroup";
import { S } from "../../../../../stores";
import * as React from "react";

/**
 * 参会人选择器.
 */
export const C_PopMeetingMemberSelector = MeetingConnect<PopShowAddGroupProps>(
  s => {
    return {
      onGroupAddConfirm(decide, value) {
        if (decide && value) {
          S.Meeting.setPeopleListAndClose({
            data: value,
          });

          // 确定后也去除选择器的选择数据
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
      visible: s.meetingPage.showAddGroup,
    };
  }
)(p => <PopShowAddGroup {...p} />);
