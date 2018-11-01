import * as React from "react";
import { SummaryEditorCard } from "../../Editor/SummaryEditor/SummaryEditorCard";
import { EndMeetingToast } from "./EndMeetingToast";
import { C_MeetingDetailMessageCard } from "../../MeetingDetail/MessageShower/MeetingDetailMessageCard";
import { MeetingMemberCard } from "../../AttendingList/MeetingMemberCard";
import { C_FileViewerCard } from "../../FileListViewer/FileViewer";
import { C_NoteEditorCard } from "../../Editor/NoteEditor/NoteEditorCard";

export const EndMeetingPage: React.SFC<{}> = p => {
  return (
    <>
      <EndMeetingToast />
      <C_MeetingDetailMessageCard />
      <SummaryEditorCard />
      <C_NoteEditorCard />
      <MeetingMemberCard />
      <C_FileViewerCard />
    </>
  );
};
