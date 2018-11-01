/**
 * MeetingEditGroup,
 * 会议的详情编辑
 * 1. 主题
 * 2. 时间, 地点,
 * 3. 内容
 */
import * as React from "react";
import styled from "styled-components";
import { S_InpWrapper } from "../../../../../common/component/InputLike/InputWrapper";
import { flex } from "../../../../../common/ts-styled/flex";
import { Ele } from "../../../../../common/ts-styled/ele";
import { C_MeetingThemeInput } from "./MeetingThemeInput";
import { C_ScheduleTimeInput } from "./TimePicker/NpmSchedultTimePicker";
import { C_AddressInput } from "./AddressSelector/C_AddressInput";
import { C_RepeatInput } from "./AddressSelector/C_RepeatInput";
import { BlockCardContent } from "../../common/Layout/MeetingBlockCard";

export type MeetingEditGroupProps = {};

export const InputLine = styled("div")`
  --styled: "InputLine";
  width: 570px;
  font-size: 14px;
  font-weight: normal;
  color: #1e1e1e;
  letter-spacing: 0;
  margin-bottom: 12px;
  ${S_InpWrapper} {
    ${flex.rowLeft};
  }
  ${Ele.input} {
    width: 532px;
    margin-left: 10px;
  }
`;

export const AddressInputLine = styled("div")`
  --styled: "AddressInputLine";
  width: 570px;
  font-size: 14px;
  font-weight: normal;
  color: #1e1e1e;
  letter-spacing: 0;
  margin-bottom: 12px;
  ${S_InpWrapper} {
    ${flex.rowLeft};
  }
  ${Ele.input} {
    width: 396px;
    margin-left: 10px;
  }
`;
export const S_MeetingEditGroup = styled(BlockCardContent)`
  --styled: "S_MeetingEditGroup";
  padding-bottom: 8px;
`;

// sfc
export const MeetingEditGroup: React.SFC<MeetingEditGroupProps> = p => {
  return (
    <S_MeetingEditGroup>
      <InputLine>
        <C_MeetingThemeInput />
      </InputLine>

      <InputLine>
        <C_ScheduleTimeInput />
      </InputLine>

      <AddressInputLine>
        <C_AddressInput />
      </AddressInputLine>

      <InputLine>
        <C_RepeatInput />
      </InputLine>
    </S_MeetingEditGroup>
  );
};
