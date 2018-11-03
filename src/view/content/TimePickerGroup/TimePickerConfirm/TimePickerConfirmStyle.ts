import styled from "styled-components";

export const TimePickerWrapper = styled("div")`
  --styled: "TimePickerWrapper";
  display: flex;
  justify-content: space-between;
  height: 70px;
  padding: 0 30px 0 30px;
  box-sizing: border-box;
  line-height: 70px;
  border-top: 1px solid #e9e9e9;
  width: 100%;
  z-index: 2000;
  user-select: none;
  .picker-popup-btn-wrapper {
    display: flex;
    align-items: center;
    .picker-popup-btn-space {
      margin-left: 10px;
    }
  }
  .picker-popup-info-text {
    font-family: "PingFangSC-Semibold";
    font-size: 14px;
    color: #1e1e1e;
    letter-spacing: 0;
    width: auto;
    min-width: 224px;
    text-align: center;
    font-weight: bold;
    .clear-span {
      font-family: "PingFangSC-Regular";
      cursor: pointer;
      font-size: 14px;
      color: #3ac3c8;
      text-align: center;
      margin-left: 20px;
      font-weight: 200;
    }
  }
`;
