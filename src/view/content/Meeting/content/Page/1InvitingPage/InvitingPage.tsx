/**
 * SchedultPage,
 */
import * as React from "react";
import { InvitingToast } from "./InvitingToast";
import { C_MeetingDetailMessageCard } from "../../MeetingDetail/MessageShower/MeetingDetailMessageCard";
import { MeetingMemberCard } from "../../AttendingList/MeetingMemberCard";
import { C_FileViewerCard } from "../../FileListViewer/FileViewer";

// sfc
export const InvitingPage: React.SFC<{}> = p => {
  return (
    <>
      <InvitingToast />
      <C_MeetingDetailMessageCard />
      <MeetingMemberCard />
      <C_FileViewerCard />
    </>
  );
};
