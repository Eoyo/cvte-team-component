/**
 * MeetingMemberCard,
 */
import * as React from "react";
import styled from "styled-components";
import {
  MeetingBlockCard,
  BlockCardContent,
} from "../common/Layout/MeetingBlockCard";
import { TitleLine, TitleTool } from "../common/Layout/TitleLine";
import { AddSomethingBtn } from "../common/FileSelector/InputFile";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../pivot/Meeting/Actor/MeetingActor";
import { C_AttendingList } from "./AttendingList";
import { Counter } from "../common/Counter/Counter";
import { MeetingTypes } from "../../../../../pivot/Meeting/Actor/MeetingTypes";

export type MeetingMemberCardProps = {};

const getAddGroupCase = (s: MeetingTypes.InitState) => {
  if (s.meetingPerson.role === "compere") {
    //如果是创建者，预约，待开始，开会中，会议结束(还未发送纪要)都是可以添加参会人
    if (
      s.meetingData.status === "schedule" ||
      s.meetingData.status === "waiting" ||
      s.meetingData.status === "inMeeting" ||
      (s.meetingData.status === "justEnd" && !s.meetingPage.isSummarySend)
    ) {
      return true;
    }
    return false;
  } else {
    //如果是参与者，待开始，开会中，会议结束(还未发送纪要)都是可以添加参会人
    if (
      s.meetingData.status === "waiting" ||
      s.meetingData.status === "inMeeting" ||
      (s.meetingData.status === "justEnd" && !s.meetingPage.isSummarySend)
    ) {
      return true;
    }
    return false;
  }
};

// 添加成员的按钮.
const AddPerson = MeetingConnect(s => {
  return {
    show: getAddGroupCase(s),
    onOpenAddGroup() {
      Meeting.troggleAddGroup({
        show: true,
      });
    },
  };
})(p => {
  if (p.show) {
    return (
      <TitleTool onClick={p.onOpenAddGroup}>
        <AddSomethingBtn words="" />
      </TitleTool>
    );
  } else {
    return null;
  }
});

const S_MeetingMemberContent = styled("div")`
  --styled: "S_MeetingMemberContent";
  margin-bottom: -10px;
`;

const MeetingMemberCounter = MeetingConnect(s => {
  return {
    number: s.meetingData.attendingList.length || 0,
  };
})(p => {
  return <Counter num={p.number} />;
});

export const AttendingListWrapper = styled("div")`
  --styled: "AttendingListWrapper";
  padding: 0px 30px 10px;
`;

// 与会人的基本内容.
export const MeetingMemberContent: React.SFC<{}> = p => {
  return (
    <S_MeetingMemberContent>
      <TitleLine
        tool={<AddPerson />}
        name={
          <span>
            参会人
            <MeetingMemberCounter />
          </span>
        }
      />
      <AttendingListWrapper>
        <C_AttendingList />
      </AttendingListWrapper>
    </S_MeetingMemberContent>
  );
};

export const S_MeetingMemberCard = styled(MeetingBlockCard)`
  --styled: "S_MeetingMemberCard";
`;

/**
 * 单独的与会人卡片.
 */
export const MeetingMemberCard: React.SFC<{}> = p => {
  return (
    <S_MeetingMemberCard>
      <TitleLine
        tool={<AddPerson />}
        name={
          <span>
            参会人
            <MeetingMemberCounter />
          </span>
        }
      />
      <BlockCardContent>
        <C_AttendingList />
      </BlockCardContent>
    </S_MeetingMemberCard>
  );
};
