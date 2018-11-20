import styled, { StyledComponentClass } from "styled-components";

export const TimePickerContent = styled("div")`
  --styled: "TimePickerContent";
  font-family: PingFangSC-Regular, Microsoft YaHei, STXihei, PingFangSC-Regular,
    Helvetica, ArialMT !important;
  width: 520px;
  height: 397px;
  .time-picker-title-line {
    height: 49px;
    border-bottom: 1px solid #e9e9e9;
    line-height: 48px;
    font-size: 14px;
    color: #1e1e1e;
    display: flex;
    text-align: center;
    .date-title {
      width: 290px;
    }
    .time-title {
      width: 115px;
    }
  }
  .time-picker3 {
    display: flex;
    flex-direction: row;
  }
  .confirm-group {
    display: flex;
    align-items: center;
  }
`;
