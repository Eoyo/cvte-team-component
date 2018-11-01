import { MeetingListCardProps } from "./MeetingListCard/MeetingListCardTypes";

// 使用类作为类型??
export type OneMeeting = MeetingListCardProps;

export type MeetingListProps = {
  meetings: OneMeeting[];
  selectedKeys: string[];
};

//把年月天做成了一个key，value对应一天内的所有会议。
export type PerMeetingDate = {
  date: string;
  meetings: OneMeeting[];
};
//每一天会议列表的集合
export type MeetingDateArr = PerMeetingDate[];
