import { MeetingTypes } from "../MeetingTypes";
import { scheduleMeetingTypes } from "../../../../services/auto/spore";
import { Merge } from "../../../../stores/Actor/tool";
import { AttendingPersonInfo } from "../../../../view/content/Meeting/content/AttendingList/AttendingListTypes";

export function setSnapshotFromScheduleResponse(
  oneSnapShot: MeetingTypes.OneMeetingSnapshot,
  from: scheduleMeetingTypes.response
) {
  Merge<MeetingTypes.oneMeeting>(oneSnapShot.meetingData, {
    body: {
      subject: from.subject,
      content: from.content,
      address: from.address,
      beginTime: +from.beginTime,
      endTime: +from.endTime,
    },
    attendingList: from.members.map(d => {
      const u = d.user;
      const rus: AttendingPersonInfo = {
        avatar: u.avatar,
        name: u.displayName,
        id: u._id,
        participationStatus:
          d.user._id === from.master ? "master" : "participant",
        personalMessage: {
          email: d.user.email,
          phone: d.user.mobile,
        },
        department: u.department,
        jobTitle: u.jobTitle,
      };
      return rus;
    }),
    masterId: from.master,
  });
}
