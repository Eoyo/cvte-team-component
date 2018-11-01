import { MeetingTypes } from "../../../../../../pivot/Meeting/Actor/MeetingTypes";

//状态：预约会议，被邀请，被邀请-冲突，待开始，待开始-更新，开会中，开会中-添加了笔记，开会中-延时未结束，已结束，已发纪要

//目前有状态，但无特殊处理：已结束-添加了笔记
export type MeetingCardStatus =
  | MeetingTypes.MeetingStatus
  | "inviting-conflict"
  | "waiting-update"
  | "inMeeting-summary"
  | "inMeeting-delay"
  | "justEnd-summary"
  | "summarySend";

//时间冲突的会议，目前只有参与者，被邀请状态有
export type ConflictMeeting = {
  title: string;
  startTime: number;
  endTime: number;
  meetingId: string;
};

export type LastMeetingInfo = {
  startTime: number;
  endTime: number;
  meetingPosition: string;
};

export type MeetingListCardProps = {
  status: MeetingCardStatus;
  role: MeetingTypes.PersonRole;
  title: string;
  invitingPerson: string; //如果是被邀请状态，是需要有邀请人名字的
  startTime: number;
  endTime: number;
  note: string;
  meetingPosition: string;
  meetingId: string;
  rightClickMenu: boolean;
  conflictMeetings: ConflictMeeting[];
  lastMeetingInfo: LastMeetingInfo;
  onSelectMeeting(id: string): void;
  onRightClick(type: MeetingTypes.MeetingRightClick, id: string): void;
};
