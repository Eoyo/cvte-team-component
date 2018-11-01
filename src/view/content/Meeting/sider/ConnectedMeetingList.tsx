import * as React from "react";
import { app } from "../../../../stores/app/app";
import { OneMeeting, MeetingListProps } from "./MeetingList/MeetingListTypes";
import { S } from "../../../../stores";
import { U } from "../../../../utils";
import { MeetingTypes } from "../../../../pivot/Meeting/Actor/MeetingTypes";
import { MeetingConnect } from "../../../../pivot/Meeting/Actor/MeetingActor";
import { ScrollbarContain } from "../../common/ScrollbarContain/ScrollbarContain";
import { MeetingList } from "./MeetingList/MeetingList";

function getMeetingCardStatus(s: MeetingTypes.OneMeetingSnapshot) {
  const d = s.meetingData;
  const p = s.meetingPage;
  if (d.status === "justEnd" && p.isSummarySend) {
    return "summarySend";
  } else if (d.status === "inMeeting" && p.isDelay) {
    return "inMeeting-delay";
  } else {
    return d.status;
  }
}

function getMeetingCardNote(s: MeetingTypes.OneMeetingSnapshot) {
  const p = s.meetingPage;
  const d = s.meetingData;
  if (p.isSummarySend) {
    return U.getHTMlContent(d.summary);
  } else {
    return U.getHTMlContent(s.meetingPerson.noteStr);
  }
}

export const C_MeetingList = MeetingConnect<MeetingListProps>(s => {
  return {
    selectedKeys: [s.aimAtMeetingId],
    meetings: s.meetingSnapshot.map(m => {
      const data = m.meetingData;
      const me = app.get("userData");
      const status = getMeetingCardStatus(m);
      const rus: OneMeeting = {
        role: me._id === data.masterId ? "compere" : "attendee",
        meetingId: data.meetingId,
        status,
        title: data.body.subject,
        startTime: data.body.beginTime,
        endTime: data.body.endTime,
        note: getMeetingCardNote(m),
        invitingPerson: data.fromName,
        meetingPosition: data.body.address,
        conflictMeetings: [],
        rightClickMenu: data.rightClickMenu,
        lastMeetingInfo: {
          startTime: NaN,
          endTime: NaN,
          meetingPosition: "",
        },
        onSelectMeeting(id) {
          S.Meeting.focusOneMeeting({
            aimId: id,
          });
        },
        onRightClick(type, id) {
          S.Meeting.rightClick({
            opeType: type,
            meetingId: id,
          });
        },
      };
      return rus;
    }),
  };
})(p => {
  return <MeetingList {...p} />;
});

// sfc
export const ScrollableMeetingList: React.SFC = p => {
  return (
    <ScrollbarContain
      className="menu-content-scroll"
      niceScrollConfig={{
        railpadding: {
          right: 3,
        },
      }}
    >
      <C_MeetingList />
    </ScrollbarContain>
  );
};
