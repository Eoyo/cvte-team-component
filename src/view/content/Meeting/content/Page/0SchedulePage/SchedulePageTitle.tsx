import {
  TitleLine,
  S_TitleLine,
  TitleTool,
  TitleName,
  TitleLineWrap,
} from "../../common/Layout/TitleLine";
import { Ele } from "../../../../../common/ts-styled/ele";
import * as React from "react";
import styled from "styled-components";
import { S } from "../../../../../../stores";
import { MeetingConnect } from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { BtnGroup } from "../../common/Layout/ButtonGroup";
import { checkMeetingInfo } from "../../../../../../pivot/Meeting/Actor/Tools/checkMeetingInfo";

export const C_ScheduleAction = MeetingConnect(s => {
  return {
    disable: !checkMeetingInfo(s),
    onScheduleConfirm(decide: boolean) {
      if (decide) {
        S.Meeting.checkInfoAndSchedule({});
        console.log("resetAddGroup");
        S.addGroup.resetAddGroup({});
      } else {
        S.Meeting.cancelSchedule({});
      }
    },
  };
})(p => (
  <BtnGroup>
    <Ele.secondBtn
      onClick={() => {
        p.onScheduleConfirm(false);
      }}
    >
      取消
    </Ele.secondBtn>
    <Ele.secondBtn
      type={"primary"}
      disable={p.disable}
      onClick={() => {
        if (p.disable === false) {
          p.onScheduleConfirm(true);
        }
      }}
    >
      发出预约
    </Ele.secondBtn>
  </BtnGroup>
));

export const S_SchedulePageTitle = styled("div")`
  --styled: "SchedulteTitle";
  ${TitleLineWrap} {
    padding-top: 30px;
  }
  ${S_TitleLine} {
    margin-bottom: 6px;
    ${Ele.secondBtn} {
      width: 88px;
      height: 30px;
      border-radius: 15px;
    }
  }
  ${TitleName} {
    font-size: 18px !important;
  }
`;

export const SchedulePageTitle = () => (
  <S_SchedulePageTitle>
    <TitleLine
      name="预约会议"
      tool={
        <TitleTool>
          <C_ScheduleAction />
        </TitleTool>
      }
    />
  </S_SchedulePageTitle>
);
