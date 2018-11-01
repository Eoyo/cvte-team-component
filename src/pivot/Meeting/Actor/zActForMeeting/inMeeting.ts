import { MeetingTypes } from "../MeetingTypes";
import { resLog } from "../Tools/log";
import { message } from "antd";
import { auto } from "../../../../services/auto/spore";
import { Meeting } from "../MeetingActor";
import { Act } from "../../../../stores/Actor/actor";
import { resOK } from "../../../../utils/DataControl/ApiHelper";

// 防止重复停止同一个会议
let stoping = "";

export const inMeeting = Act<MeetingTypes.InitState>()({
  stopMeeting: {} as { meetingId?: string },
})({
  stopMeeting: function*(s, a) {
    let meetingId = a.meetingId || s.aimAtMeetingId;
    if (stoping === meetingId) {
      return;
    } else {
      stoping = meetingId;
    }
    message.loading("正在结束会议");
    const res = yield auto.endTheMeeting({
      meetingId,
    });
    if (resOK(res)) {
      message.destroy();
      message.success("会议结束成功");
    } else {
      // 失败了, 结束stoping标记
      stoping = "";
    }
    resLog(res);
    Meeting.fetchAimMeeting({ aimId: meetingId });
  },
});
