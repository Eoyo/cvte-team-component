import { MeetingTypes } from "../MeetingTypes";
import { Act } from "../../../../stores/Actor/actor";
import { resOK } from "../../../../utils/DataControl/ApiHelper";
import { resLog } from "../Tools/log";
import { message } from "antd";
import { auto } from "../../../../services/auto/spore";
import { Meeting } from "../MeetingActor";

export const justEnd = Act<MeetingTypes.InitState>()({
  sendSummary: {},
  setSummary: { data: "" },
  setSummaryFocus: {
    focus: false,
  },
})({
  setSummary: (s, a) => {
    return {
      meetingData: {
        summary: a.data,
      },
      meetingPage: {
        isSummaryEdit: true,
      },
    };
  },
  setSummaryFocus: (s, a) => {
    return {
      meetingPage: {
        isSummaryFocus: a.focus,
      },
    };
  },
  sendSummary: function*(s, a) {
    if (s.meetingPerson.role === "compere") {
      yield {
        meetingPage: {
          loading: {
            ...s.meetingPage.loading,
            // summary loading
          },
        },
      };
      console.log("meeting summary");
      const res = yield auto.publishSummary(
        { meetingId: s.meetingData.meetingId },
        {
          data: {
            subject: s.meetingData.body.subject + "-会议纪要",
            content: s.meetingData.summary,
          },
        }
      );
      message.destroy();
      if (resOK(res)) {
        message.success("纪要发出成功!");
        yield {
          meetingPage: {
            isSummarySend: true,
            isSummaryLoad: false,
          },
        };
        Meeting.fetchAimMeeting({ aimId: s.aimAtMeetingId });
      }
      lock.sendSummary = false;
      resLog(res);
    } else {
      yield {};
    }
  },
});

const lock = {
  sendSummary: false,
};
