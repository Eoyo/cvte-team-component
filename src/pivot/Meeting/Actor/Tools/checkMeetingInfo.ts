import { MeetingTypes } from "../MeetingTypes";

//检查会议的信息是否符合发出预约或修改的要求
export function checkMeetingInfo(s: MeetingTypes.InitState) {
  let res = true;
  const body = s.editingDetail;
  if (body.subject && body.beginTime && body.endTime) {
    res = true;
  } else {
    res = false;
  }
  // 控制是否全部成功文件
  const files = s.meetingPage.uploadFiles;
  files.forEach(onep => {
    if (onep.card.loadingType !== 2) {
      res = false;
    }
  });
  return res;
}
