import * as React from "react";
import { S_EditorCard } from "../common/EditorCard";
import {
  TitleLine,
  TitleTool,
  S_TitleLine,
  HrLine,
} from "../../common/Layout/TitleLine";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import {
  ReactEditorPro,
  ReactEditorProProps,
  EditorPlaceHolderStyled,
} from "../../common/EditorPro/ReactEditorPro";
import { S } from "../../../../../../stores";
import { AddSomethingBtn } from "../../common/FileSelector/InputFile";
import styled from "../../../../../../../node_modules/styled-components";
import { BlockCardContent } from "../../common/Layout/MeetingBlockCard";

export const TitleLineWrapper = styled("div")`
  --styled: "TitleLineWrapper";
`;

export const NoBottomBorder = styled(S_EditorCard)`
  --styled: "NoBottomBorder";
  padding-bottom: 6px;
  ${HrLine} {
    display: none;
  }
`;

// export const EditorCardContent = styled(BlockCardContent)`
//   --styled: "EditorCardContent";
//   && {
//     padding: 0px 30px;
//   }
// `

export const C_NoteEditor = MeetingConnect<ReactEditorProProps>(s => {
  return {
    onValueChange: str => {
      S.Meeting.savingNote({
        noteStr: str,
      });
    },
    onFocus: (focus, lastFocus) => {
      if (
        lastFocus === true &&
        focus === false &&
        s.meetingPerson.noteStr === ""
      ) {
        S.Meeting.closeNote({});
      } else if (focus) {
        S.Meeting.startNote({});
      }
    },
    defaultText: s.meetingPerson.noteStr,
    placeHolder: "请输入您的笔记...",
    // toFocus: s.sign.indexOf("startNote") >= 0,
  };
})(p => <ReactEditorPro {...p} autoFocus={true} />);

export const EditorContent = styled(BlockCardContent)`
  --styled: "EditorContent";
  padding-top: 0px;
  padding-bottom: 0px;
  .content-viewer,
  .simditor {
    user-select: text;
    min-height: 20px;
    padding: 10px 0px 18px;
  }
  ${EditorPlaceHolderStyled} {
    padding: 10px 0px 18px;
  }
`;

export const C_NoteEditorCard = MeetingConnect(s => {
  return {
    showEditor: !s.meetingPerson.isNoteFirst || s.meetingPerson.noteStr,
  };
})(p => {
  let content;
  if (p.showEditor) {
    content = (
      <>
        <TitleLine name="笔记" />
        <EditorContent>
          <C_NoteEditor />
        </EditorContent>
      </>
    );
    return <S_EditorCard> {content}</S_EditorCard>;
  } else {
    content = (
      <TitleLine
        name="笔记"
        tool={
          <TitleTool
            onClick={() => {
              setTimeout(() => {
                Meeting.startNote({});
              }, 100);
            }}
          >
            <i className="teams-icon icon-edit" />
          </TitleTool>
        }
      />
    );
    return <NoBottomBorder>{content}</NoBottomBorder>;
  }
});
