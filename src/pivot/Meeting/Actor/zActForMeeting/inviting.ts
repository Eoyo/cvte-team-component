import { MeetingTypes } from "../MeetingTypes";
import { message } from "antd";
import { resOK } from "../../../../utils/DataControl/ApiHelper";
import { findSnapshot, dumpMeeting } from "../Tools/findSnapshot";
import { app } from "../../../../stores/app/app";
import { auto, confirmInivitingTypes } from "../../../../services/auto/spore";
import { Act } from "../../../../stores/Actor/actor";
import { S } from "../../../../stores";

export const invite = Act<MeetingTypes.InitState>()({
  rejectMeeting: {} as { meetingId?: string },
  acceptMeeting: {} as { meetingId?: string },
  changeToWaiting: { id: "" },
})({
  acceptMeeting: function*(s, a) {
    const meetingId = a.meetingId || s.aimAtMeetingId;
    message.destroy();
    message.info("已经发送加入请求");

    const res = yield auto.confirmIniviting(
      {
        meetingId,
        memberId: app.get("userData")._id,
      },
      {
        data: {
          state: 2,
        },
      }
    );
    message.destroy();
    if (resOK(res)) {
      message.success("成功加入!");
      S.Meeting.fetchAimMeeting({ aimId: meetingId });
      S.Meeting.changeToWaiting({
        id: meetingId,
      });
    } else {
      message.error(res.message);
    }
    yield {};
  },

  changeToWaiting: (s, a) => {
    const meetingSnapshot = s.meetingSnapshot;

    const one = findSnapshot(meetingSnapshot, a.id);

    // 使用attending 标记 人员列表中自己的状态.
    if (one) {
      one.meetingPage.loading.attending = 1;
      one.meetingData.status = "waiting";

      return {
        sign: ["readSnapshot"],
        meetingSnapshot,
        aimAtMeetingId: a.id,
      };
    }

    return {};
  },
  rejectMeeting: function*(s, a) {
    if (s.meetingData.status === "inviting") {
      let aimMeetingId = a.meetingId || s.meetingData.meetingId;

      message.destroy();
      message.info("已经发出了拒绝请求");
      const res: confirmInivitingTypes.checked = yield auto.confirmIniviting(
        {
          meetingId: aimMeetingId,
          memberId: app.get("userData")._id,
        },
        {
          data: {
            state: 1,
          },
        }
      );
      message.destroy();
      if (resOK(res)) {
        message.success("成功拒绝!");
        yield {
          sign: ["readSnapshot"],
          ...dumpMeeting(s, aimMeetingId),
        };
      } else {
        message.error(res.message);
        yield {};
      }
    } else {
      const rejectMeetingId = "" + a.meetingId;
      const oneSnapShot = findSnapshot(s.meetingSnapshot, "" + rejectMeetingId);
      message.destroy();
      message.info("已经发出了拒绝请求");
      const res: confirmInivitingTypes.checked = yield auto.confirmIniviting(
        {
          meetingId: rejectMeetingId,
          memberId: app.get("userData")._id,
        },
        {
          data: {
            state: 1,
          },
        }
      );
      message.destroy();
      if (resOK(res)) {
        message.success("成功拒绝!");
        yield {
          sign: ["readSnapshot"],
          ...dumpMeeting(s, rejectMeetingId),
        };
      } else {
        message.error(res.message);
        yield {};
      }
    }

    yield {};
  },
});
