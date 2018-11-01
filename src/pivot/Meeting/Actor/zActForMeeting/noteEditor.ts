import { MeetingTypes } from "../MeetingTypes";
import { Act } from "../../../../stores/Actor/actor";
import { resOK } from "../../../../utils/DataControl/ApiHelper";
import { resLog } from "../Tools/log";
import { message } from "antd";
import { U } from "../../../../utils";
import { app } from "../../../../stores/app/app";
import { auto } from "../../../../services/auto/spore";

export const note = Act<MeetingTypes.InitState>()({
  savingNote: { noteStr: "" },
  closeNote: {},
  startNote: {},
})({
  startNote: function*(s, a) {
    yield {
      meetingPerson: {
        isNoteFirst: false,
      },
      sign: ["startNote"],
    };
  },
  closeNote: (s, a) => {
    return {
      meetingPerson: {
        isNoteFirst: true,
      },
    };
  },
  savingNote: function*(s, a) {
    // 触发保存
    if (a.noteStr === s.meetingPerson.noteStr) {
      return {};
    }

    // 记录到PersonState上;
    yield {
      meetingPerson: {
        noteStr: a.noteStr,
      },
      meetingPage: {
        loading: {
          noteEidt: 1,
        },
      },
    };
    lock.delaySave += 1;
    const saveingDelyTime = lock.delaySave;

    // !! 有挂起了多个的promise的内存消耗问题.
    yield U.time(1000);

    if (saveingDelyTime < lock.delaySave) {
      return {};
    } else {
      lock.delaySave = 0;
      const res = yield auto.updateNote(
        {
          userId: app.get("userData")._id,
          meetingId: s.meetingData.meetingId,
        },
        {
          data: {
            noteSubject: s.meetingData.body.subject,
            noteContent: a.noteStr,
          },
        }
      );

      yield {
        meetingPage: {
          loading: {
            noteEidt: 2,
          },
        },
      };
      resLog(res);
      return {};
    }
  },
});

const lock = {
  sendSummary: false,
  delaySave: 0,
};
