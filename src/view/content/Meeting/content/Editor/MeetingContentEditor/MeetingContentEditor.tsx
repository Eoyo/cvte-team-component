import * as React from "react";
import { S_EditorCard } from "../common/EditorCard";
import styled from "styled-components";
import {
  TitleLine,
  TitleName,
  S_TitleLine,
  HrLine,
  TitleLineWrap,
} from "../../common/Layout/TitleLine";
import { MeetingConnect } from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import {
  ReactEditorProProps,
  ReactEditorPro,
  EditorPlaceHolderStyled,
} from "../../common/EditorPro/ReactEditorPro";
import { S } from "../../../../../../stores";
import "./MeetingContentEditor.scss";
import { BlockCardContent } from "../../common/Layout/MeetingBlockCard";

export const C_ContentEditor = MeetingConnect<ReactEditorProProps>(s => {
  return {
    defaultText: s.editingDetail.content,
    onValueChange: str => {
      S.Meeting.addMeetingContent({
        data: str,
      });
    },
  };
})(p => (
  <ReactEditorPro
    {...p}
    placeHolder={"请输入议程（3000字以内)"}
    maxLength={3000}
  />
));

// MeetingContentEditor是在卡片内的模块
export const S_MeetingContentEditor = styled(S_EditorCard)`
  --styled: "S_MeetingContentEditor";
  ${EditorPlaceHolderStyled} {
    padding: 6px 10px;
  }
  ${TitleName} {
    font-size: 14px;
  }
  ${S_TitleLine} {
    margin-bottom: 10px;
    padding-top: 0px;
  }
  ${BlockCardContent} {
    padding-top: 0px;
    padding-bottom: 0px;
  }
  ${HrLine} {
    display: none;
  }

  ${TitleLineWrap} {
    padding-top: 0px;
  }

  && {
    :last-child {
      margin-bottom: 0px;
    }
    padding: 0px;
    margin: 0px;
    width: 100%;
    border: none;
  }
`;

// 用于SchedulePage;
export const MeetingContentEditor: React.SFC<{}> = p => (
  <S_MeetingContentEditor className={"meeting-content-editor"}>
    <TitleLine name={<span>议程</span>} />
    <BlockCardContent>
      <C_ContentEditor />
    </BlockCardContent>
  </S_MeetingContentEditor>
);
