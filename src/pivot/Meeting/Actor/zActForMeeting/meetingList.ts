import { Act } from "../../../../stores/Actor/actor";
import { MeetingTypes } from "../MeetingTypes";
import { findSnapshot, dumpMeeting } from "../Tools/findSnapshot";
import { S } from "../../../../stores";
import { app } from "../../../../stores/app/app";
import { resOK } from "../../../../utils/DataControl/ApiHelper";
import { resLog } from "../Tools/log";
import { auto } from "../../../../services/auto/spore";
import { Meeting } from "../MeetingActor";

export const meetingList = Act<MeetingTypes.InitState>()({
  rightClick: {
    opeType: "" as MeetingTypes.MeetingRightClick,
    meetingId: "",
  },
  setRightClickInfo: {
    meetingId: "",
    showRightClickPopCard: false,
    title: "",
    content: "",
    onConfirm: () => {},
    onCancel: () => {},
    clickType: "schedule" as MeetingTypes.MeetingRightClick,
  },
  exitMeeting: {} as { meetingId?: string },
  cancelMeeting: {} as { meetingId?: string },
  deleteMeetingRecord: {} as {
    meetingId?: string;
  },
})({
  setRightClickInfo: function*(s, a) {
    //如果是重复会议，需要判断是否是取消和退出会议，如果是，则弹出框和其他的不同
    let snapshot = findSnapshot(s.meetingSnapshot, a.meetingId);
    if (snapshot && snapshot.meetingData.repeatMeetingId) {
      if (a.clickType === "cancel") {
        yield {
          meetingListRightClickInfo: {
            meetingId: a.meetingId,
            showRightClickPopCard: false,
          },
        };
        Meeting.showCancelRepeatPopCard({ view: true });
      } else {
        yield {
          meetingListRightClickInfo: {
            ...a,
          },
        };
      }
    } else {
      yield {
        meetingListRightClickInfo: {
          ...a,
        },
      };
    }
  },
  rightClick: function*(s, a) {
    const one = findSnapshot(s.meetingSnapshot, a.meetingId);
    if (one) {
      if (a.opeType === "exit") {
        S.Meeting.exitMeeting({
          meetingId: one.meetingData.meetingId,
        });
      } else if (a.opeType === "reject") {
        S.Meeting.rejectMeeting({
          meetingId: one.meetingData.meetingId,
        });
      } else if (a.opeType === "attending") {
        S.Meeting.acceptMeeting({
          meetingId: one.meetingData.meetingId,
        });
      } else if (a.opeType === "stop") {
        S.Meeting.stopMeeting({
          meetingId: one.meetingData.meetingId,
        });
      } else if (a.opeType === "cancel") {
        S.Meeting.cancelMeeting({
          meetingId: one.meetingData.meetingId,
        });
      } else if (a.opeType === "delete") {
        S.Meeting.deleteMeetingRecord({
          meetingId: one.meetingData.meetingId,
        });
      } // else {} // 无法匹配的操作
    } // else {} // 没有snapshot
    yield {};
  },

  exitMeeting: function*(s, a) {
    let meetingId = a.meetingId || s.aimAtMeetingId;
    const res = yield auto.exitMeeting({
      meetingId,
      memberId: app.get("userData")._id,
    });

    if (resOK(res)) {
      yield {
        sign: ["readSnapshot"],
        ...dumpMeeting(s, meetingId),
      };
    }
    resLog(res);
    yield {};
  },
  cancelMeeting: function*(s, a) {
    let meetingId = a.meetingId || s.aimAtMeetingId;
    const res = yield auto.cancelSchedule({
      meetingId,
    });
    if (resOK(res)) {
      yield {
        sign: ["readSnapshot"],
        ...dumpMeeting(s, meetingId),
      };
    }
    resLog(res);
    yield {};
  },
  deleteMeetingRecord: function*(s, a) {
    let meetingId = a.meetingId || s.aimAtMeetingId;
    const res = yield auto.deletMeetingRecord({
      meetingId,
      userId: app.get("userData")._id,
    });

    if (resOK(res)) {
      yield {
        sign: ["readSnapshot"],
        ...dumpMeeting(s, meetingId),
      };
    }
    resLog(res);
    yield {};
  },
});
