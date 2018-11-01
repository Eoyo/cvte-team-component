import { MeetingTypes } from "../MeetingTypes";

export function checkTimeDelay(
  s: MeetingTypes.OneMeetingSnapshot
) {
  if (Date.now() > s.meetingData.body.endTime) {
    s.meetingPage.consistentTime =
      Date.now() - s.meetingData.body.endTime;
    s.meetingPage.isDelay = true;
  } else {
    s.meetingPage.consistentTime =
      Date.now() - s.meetingData.body.beginTime;
    s.meetingPage.isDelay = false;
  }
}
