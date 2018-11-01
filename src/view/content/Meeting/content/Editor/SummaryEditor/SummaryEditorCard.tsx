import { template } from "../../common/EditorPro/DefaultTemplate";
import { app } from "../../../../../../stores/app/app";
import {
  ReactEditorProProps,
  ReactEditorPro,
} from "../../common/EditorPro/ReactEditorPro";
import * as React from "react";
import { S } from "../../../../../../stores";
import { C_SendSummary } from "./SendSummary";
import { S_EditorCard } from "../common/EditorCard";
import { TitleLine, TitleTool } from "../../common/Layout/TitleLine";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { ContentViewer } from "../../common/EditorPro/ContentViewer";
import "./SummaryEditorCard.scss";
import { BlockCardContent } from "../../common/Layout/MeetingBlockCard";
import { U } from "src/utils";
import { Counter } from "../../common/Counter/Counter";
import { arrCss } from "src/utils/export";
import { EditorContent } from "../NoteEditor/NoteEditorCard";
/**
 * SummaryEditorCard,
 */
export const C_SummaryEditor = MeetingConnect<ReactEditorProProps>(s => {
  let summary = s.meetingData.summary;
  if (!s.meetingPage.isSummaryEdit) {
    summary = "";
  }
  return {
    defaultText: summary,
    onValueChange: str => {
      S.Meeting.setSummary({
        data: str,
      });
    },
    onFocus(type) {
      if (type === s.meetingPage.isSummaryFocus) {
        return;
      }
      Meeting.setSummaryFocus({
        focus: type,
      });
    },
  };
})(p => (
  <ReactEditorPro
    {...p}
    placeHolder={"请输入会议决议..."}
    stopAutoResize={true}
  />
));

export const SummaryContentShow = MeetingConnect(s => {
  let summary = s.meetingData.summary;
  return {
    summary,
  };
})(p => <ContentViewer htmlStr={p.summary} type="dangerous" />);

export const SummaryEditorCard = MeetingConnect(s => {
  return {
    role: s.meetingPerson.role,
    isSummarySend: s.meetingPage.isSummarySend,
    time:
      U.formDate.summaryDate(s.meetingData.body.beginTime) +
      "~" +
      U.formDate.hourMinute(s.meetingData.body.endTime),
    compere: s.meetingData.fromName || app.get("userData").displayName,
    isSummaryFocus: s.meetingPage.isSummaryFocus,
  };
})(p => {
  const TitleName = (
    <>
      <span>纪要</span>
      <Counter
        num={
          <span
            className={arrCss([
              "summary-message",
              p.isSummaryFocus && "hide-message",
            ])}
          >
            会议时间：
            {p.time}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;记录人：
            {p.compere}
          </span>
        }
        noWrap={true}
      />
    </>
  );
  if (p.role === "compere" && !p.isSummarySend) {
    return (
      <S_EditorCard className="summary-editor-card">
        <TitleLine
          name={TitleName}
          tool={
            <TitleTool>
              <C_SendSummary />
            </TitleTool>
          }
        />
        <EditorContent>
          <C_SummaryEditor />
        </EditorContent>
      </S_EditorCard>
    );
  } else if (p.isSummarySend) {
    return (
      <S_EditorCard>
        <TitleLine name={TitleName} tool={null} />
        <BlockCardContent>
          <SummaryContentShow />
        </BlockCardContent>
      </S_EditorCard>
    );
  } else {
    // attendee, while summart is not send yet;
    return null;
  }
});
