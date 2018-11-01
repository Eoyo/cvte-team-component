import * as React from "react";
import { C_MeetingPageSwitcher } from "./ContentSwitch/PageSwitch";
import { SchedulePage } from "./Page/0SchedulePage/SchedulePage";
import { PageContentBox, PageContent } from "../../common/Layout";
import { ScrollbarContain } from "../../common/ScrollbarContain/ScrollbarContain";
import { InvitingPage } from "./Page/1InvitingPage/InvitingPage";
import { WaitingPage } from "./Page/2WaitingPage/WaitingPage";
import { InMeetingPage } from "./Page/3InMeetingPage/InMeetingPage";
import { EndMeetingPage } from "./Page/4EndMeetingPage/EndMeetingPage";
import { OnePicBg } from "../../common/BackGroudHolder/OnePicBg";
import { Ele } from "../../../common/ts-styled/ele";
import {
  Meeting,
  MeetingConnect,
} from "../../../../pivot/Meeting/Actor/MeetingActor";

const NonePage = () => {
  return (
    <OnePicBg content="邀请参会人、邮件通知、文件同步、会议记录、纪要输出……从预约会议开始">
      <Ele.mainBtn
        style={{ marginTop: "30px" }}
        onClick={() => {
          Meeting.createSchedule({});
        }}
        type="primary"
      >
        预约会议
      </Ele.mainBtn>
    </OnePicBg>
  );
};

export const MeetingContent = MeetingConnect(s => {
  return {
    status: s.meetingData.status,
    // status: 'inviting' ,
  };
})(p => {
  let content: any = null;
  if (p.status === "none") {
    content = <NonePage />;
  } else {
    content = (
      <ScrollbarContain>
        <PageContent>
          <C_MeetingPageSwitcher
            {...{
              schedule: <SchedulePage />,
              inviting: <InvitingPage />,
              waiting: <WaitingPage />,
              inMeeting: <InMeetingPage />,
              justEnd: <EndMeetingPage />,
            }}
          />
        </PageContent>
      </ScrollbarContain>
    );
  }
  return <PageContentBox>{content}</PageContentBox>;
});
