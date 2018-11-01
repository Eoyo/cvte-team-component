import * as React from "react";
import {
  MeetingEditGroup,
  S_MeetingEditGroup,
} from "../MeetingMessageEditGroup/MeetingEditGroup";
import { MeetingContentEditor } from "../../Editor/MeetingContentEditor/MeetingContentEditor";
import styled from "styled-components";

/**
 * 可编辑时的
 */
/* ${S_MeetingEditGroup} {
  margin-bottom: 20px;
} */
export const S_EditingDetailContent = styled("div")`
  --styled: "S_EditingDetailContent";
  padding-bottom: 20px;
`;
// 编辑状态的
export const EditingMeetingDetail: React.SFC<{}> = p => (
  <S_EditingDetailContent>
    <MeetingEditGroup />
    <MeetingContentEditor />
  </S_EditingDetailContent>
);
