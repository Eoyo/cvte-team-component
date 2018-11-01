/**
 * InMeetingPage,
 */
import * as React from "react";
import { InMeetingToast } from "./InMeetingToast";
import { C_MeetingDetailMessageCard } from "../../MeetingDetail/MessageShower/MeetingDetailMessageCard";
import { MeetingMemberCard } from "../../AttendingList/MeetingMemberCard";
import { C_FileViewerCard } from "../../FileListViewer/FileViewer";
import { C_NoteEditorCard } from "../../Editor/NoteEditor/NoteEditorCard";

export type InMeetingPageProps = {};

// sfc
export const InMeetingPage: React.SFC<InMeetingPageProps> = p => {
  return (
    <>
      <InMeetingToast />
      <C_MeetingDetailMessageCard />
      <C_NoteEditorCard />
      <MeetingMemberCard />
      <C_FileViewerCard />
    </>
  );
};
