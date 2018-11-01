import { MeetingTypes } from "../../../../../pivot/Meeting/Actor/MeetingTypes";

export type AttendingPersonInfo = {
  avatar: string;
  name: string;
  id: string;
  department: string; // 部门
  jobTitle: string; // 工作
  participationStatus: "master" | "participant"; //master表示发起人, participant表示参会人
  invitationStatus?: invitationStatus;
  personalMessage: {
    email: string;
    phone: string;
  };
  status?: MeetingTypes.MeetingStatus;

  removeParticipateCallback?: () => void;
};

export type invitationStatus = "accept" | "reject" | "wait" | "prepare"; //邀请状态，发起人无邀请状态，prepare为还未发出预约的状态，这时候可以删除人

export type AttendingListProps = {
  status: MeetingTypes.MeetingStatus;
  personList: AttendingPersonInfo[];
  onDeletePerson?(id: string): void;
};
