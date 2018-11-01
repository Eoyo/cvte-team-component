import { MeetingTypes } from "../MeetingTypes";

export function findSnapshot(s: MeetingTypes.OneMeetingSnapshot[], id: string) {
  for (const one of s) {
    if (one.meetingData.meetingId === id) {
      return one;
    }
  }
  return;
}

export function dumpMeeting(s: MeetingTypes.InitState, toDeletId: string) {
  if (s.aimAtMeetingId === toDeletId) {
    return {
      meetingData: MeetingTypes.createOneMeetingData("none"),
      meetingSnapshot: s.meetingSnapshot.filter(d => {
        return d.meetingData.meetingId !== toDeletId;
      }),
      aimAtMeetingId: s.aimAtMeetingId === toDeletId ? "" : s.aimAtMeetingId,
    };
  } else {
    return {
      meetingSnapshot: s.meetingSnapshot.filter(d => {
        return d.meetingData.meetingId !== toDeletId;
      }),
    };
  }
}

export function dumpRepeatMeeting(
  s: MeetingTypes.InitState,
  deleteRepeatId: string
) {
  let deleteAimMeeting = false;
  return {
    meetingData: MeetingTypes.createOneMeetingData("none"),
    meetingSnapshot: s.meetingSnapshot.filter(d => {
      if (d.meetingData.repeatMeetingId === deleteRepeatId) {
        deleteAimMeeting = true;
        return true;
      } else {
        return false;
      }
    }),
    aimAtMeetingId: deleteAimMeeting ? "" : s.aimAtMeetingId,
  };
}
