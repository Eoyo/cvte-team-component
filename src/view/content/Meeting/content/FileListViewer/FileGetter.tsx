import * as React from "react";
import {
  DragDropProps,
  DragDrop,
  DragDropArgs,
} from "../common/FileSelector/DragDrop";
import {
  getFileMenuCan,
  getMeetingStatus,
} from "../../../../../pivot/Meeting/Actor/utils";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../pivot/Meeting/Actor/MeetingActor";
import { InputFileProps, InputFile } from "../common/FileSelector/InputFile";

// 拖拽上传的数据
export const C_fileDragDrop = MeetingConnect<DragDropProps>(s => {
  //如果是正在被邀请中，就不能进行文件的拖拽
  let isInvited =
    s.meetingData.status === "inviting" && s.meetingPerson.role === "attendee"
      ? true
      : false;
  return {
    onInputFiles(files) {
      console.log(files);
      Meeting.addUploaderFile({ files });
    },
    onChangeDragState() {},
    allowDragDrop:
      !isInvited &&
      getFileMenuCan(s.meetingPerson.role, getMeetingStatus(s)).upload,
  };
})<DragDropArgs>((p => <DragDrop {...p}>{p.children}</DragDrop>) as React.SFC<
  DragDropProps & DragDropArgs
>);

// Input上传
export const C_fileLableInput = MeetingConnect<InputFileProps>(s => {
  return {
    onAddFile(files) {
      console.log(files);
      Meeting.addUploaderFile({ files });
    },
  };
})(p => <InputFile {...p} />);
