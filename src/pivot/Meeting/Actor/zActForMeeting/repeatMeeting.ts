import { Act } from "../../../../stores/Actor/actor";
import { MeetingTypes } from "../MeetingTypes";
import { resOK } from "../../../../utils/DataControl/ApiHelper";
import {
  cancelRepeatMeetingTypes,
  auto,
  patchRepeatMeetingTypes,
  getRepeatMeetingMessageTypes,
} from "../../../../services/auto/spore";
import { checki } from "../../../../utils/checkOperator";
import { Meeting } from "../MeetingActor";
import { message } from "antd";
import {
  findSnapshot,
  dumpMeeting,
  dumpRepeatMeeting,
} from "../Tools/findSnapshot";
import { app } from "../../../../stores/app/app";
import { resLog } from "../Tools/log";
import { U } from "../../../../utils";
import { S } from "../../../../stores";

//重复会议的actor

export const repeatMeeting = Act<MeetingTypes.InitState>()({
  //需要判断是否是master，如果是master，就会删除会议
  //如果不是master，就退出会议
  cancelRepeatMeetings: {
    meetingId: "",
  },
  cancelOneMeeting: {
    meetingId: "",
  },
  fetchRepeatMeeting: { repeatMeeting: "", aimId: "" },
  modifyRepeatMeetings: {},
  modifyOneMeeting: {},
  showCancelRepeatPopCard: { view: false },
  showModifyPopCard: { view: false },
})({
  fetchRepeatMeeting: function*(s, a) {
    const res:
      | checki<getRepeatMeetingMessageTypes.response>
      | checki<
          getRepeatMeetingMessageTypes.ominous
        > = yield auto.getRepeatMeetingMessage({
      repeat_meeting_id: a.repeatMeeting,
    });
    if (resOK(res)) {
      const snap = [...S.Meeting.grab().meetingSnapshot];
      const oneSnap = findSnapshot(snap, a.aimId);
      if (oneSnap) {
        oneSnap.meetingData.body.repeatStartTime = res.value.repeatStartTime;
        oneSnap.meetingData.body.repeatEndTime = res.value.repeatEndTime;
        oneSnap.meetingData.body.repeatType = res.value
          .repeatType as MeetingTypes.RepeatMeetingType;
        oneSnap.meetingData.body.repeatValue = res.value.repeatValue;
        oneSnap.meetingData.body.roomId = res.value.room;
        yield {
          meetingSnapshot: snap,
          sign: ["readSnapshot"],
        };
      }
    }
    resLog(res);
    yield {};
  },

  showCancelRepeatPopCard: function*(s, a) {
    yield {
      showCancelRepeatPopCard: a.view,
    };
  },
  showModifyPopCard: function*(s, a) {
    yield {
      showModifyRepeatPopCard: a.view,
    };
  },
  cancelRepeatMeetings: function*(s, a) {
    const snapshot = findSnapshot(s.meetingSnapshot, a.meetingId);
    if (snapshot && snapshot.meetingData.repeatMeetingId) {
      const res:
        | checki<cancelRepeatMeetingTypes.response>
        | checki<
            cancelRepeatMeetingTypes.ominous
          > = yield auto.cancelRepeatMeeting({
        repeat_meeting_id: snapshot.meetingData.repeatMeetingId,
      });
      if (resOK(res)) {
        yield {
          sign: ["readSnapshot"],
          ...dumpRepeatMeeting(s, snapshot.meetingData.repeatMeetingId),
        };
        Meeting.fetchMeetingList({});
      } else {
      }
      resLog(res);
    }
    Meeting.showCancelRepeatPopCard({ view: false });
  },
  cancelOneMeeting: function*(s, a) {
    const meetingId = a.meetingId;
    const res = yield auto.cancelSchedule({
      meetingId,
    });

    if (resOK(res)) {
      yield {
        sign: ["readSnapshot"],
        ...dumpMeeting(s, meetingId),
      };
      Meeting.fetchMeetingList({});
    }
    resLog(res);
    Meeting.showCancelRepeatPopCard({ view: false });
    yield {};
  },
  modifyRepeatMeetings: function*(s, a) {
    const repeatMeetingId = s.meetingData.repeatMeetingId;
    yield {
      meetingPerson: {
        detailEdit: "editing",
      },
      meetingPage: {
        loading: {
          ...s.meetingPage.loading,
          detailEditing: 1,
        },
      },
    };
    const body = s.editingDetail;
    if (repeatMeetingId) {
      const reqData = {
        subject: body.subject,
        content: body.content,
        beginTime: U.formDate.hourMinute(body.beginTime),
        endTime: U.formDate.hourMinute(body.endTime),
        address: body.address,
        repeatStartTime: body.repeatStartTime,
        repeatEndTime: body.repeatEndTime,
        repeatType: body.repeatType,
        repeatValue: body.repeatValue,
        peopleNum: 10,
        roomId: body.roomId,
      } as patchRepeatMeetingTypes.body;
      const res:
        | checki<patchRepeatMeetingTypes.response>
        | checki<
            patchRepeatMeetingTypes.ominous
          > = yield auto.patchRepeatMeeting(
        {
          repeat_meeting_id: repeatMeetingId,
        },
        {
          data: reqData,
        }
      );
      message.destroy();
      if (resOK(res)) {
        message.success("修改成功!");
        yield {
          meetingPerson: {
            detailEdit: "notEditable",
          },
          meetingPage: {
            loading: {
              ...s.meetingPage.loading,
              detailEditing: 0,
            },
          },
        };
        Meeting.fetchMeetingList({});
      } else {
      }
      resLog(res);
    }

    Meeting.showModifyPopCard({ view: false });
  },
  modifyOneMeeting: function*(s, a) {
    yield {
      meetingPerson: {
        detailEdit: "editing",
      },
      meetingPage: {
        loading: {
          ...s.meetingPage.loading,
          detailEditing: 1,
        },
      },
    };

    const b = s.editingDetail;

    // @auto, 发起会议修改
    const res = yield auto.modifyMeetingMeesage(
      {
        meetingId: s.aimAtMeetingId,
      },
      {
        data: {
          subject: b.subject,
          content: b.content,
          beginTime: b.beginTime as any,
          endTime: b.endTime as any,
          address: b.address,
          roomId: b.roomId || "",
        },
      }
    );

    message.destroy();
    if (resOK(res)) {
      message.success("修改成功!");
      yield {
        meetingPerson: {
          detailEdit: "notEditable",
        },
        meetingPage: {
          loading: {
            ...s.meetingPage.loading,
            detailEditing: 0,
          },
        },
      };
    } else {
      //冲突
      if (res.code === 400403002) {
        yield {
          meetingPage: {
            loading: {
              ...s.meetingPage.loading,
              schedule: 0,
            },
          },
        };
        yield {
          showMeetingBeUsedPopCard: true,
          meetingBeUsed: true,
        };
      } else {
        message.error(res.message);
      }
    }
    resLog(res);
    Meeting.fetchAimMeeting({ aimId: s.aimAtMeetingId });
    Meeting.showModifyPopCard({ view: false });
  },
});
