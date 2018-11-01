import styled, { css } from "styled-components";
import { size } from "../../../common/ts-styled/style-tool";

const FlexCenter = styled.div`
  --styled: "FlexCenter";
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const OnePicBgDiv = styled(FlexCenter)`
  --styled: "OnePicBgDiv";
  width: 100%;
  height: 100%;
  min-height: 500px;
`;

export const RoudImg = styled.img`
  --styled: "RoudImg";
  border-radius: 50%;
  background: none;
  border: none;
  ${size("200px")};
`;

export const BgLogoTitle = styled.span`
  --styled: "BgLogoText";
  font-family: "Arial Black" !important;
  font-weight: bold;
  line-height: 26px;
  font-size: 18px;
  color: #cccccc;
  letter-spacing: 0;
  text-align: center;
  margin: 20px;
`;

export const BgLogoContent = styled.p`
  color: #b2b2b2;
  font-size: 12px;
  margin-top: 20px;
  margin-bottom: 0px;
  width: 300px;
  text-align: center;
`;
