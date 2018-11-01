/**
 * 使用了一个图片为Background
 */

/**
 * OnePicBg,
 */
import * as React from "react";
import {
  OnePicBgDiv,
  RoudImg,
  BgLogoTitle,
  BgLogoContent,
} from "./OnePicBgStyled";

const PlaceHolderPic = () => (
  <RoudImg src={"./assets/images/placeholder-bg.png"} alt="Hello Teams" />
);

export type OnePicBgProps = {
  content?: string;
};

// sfc
export const OnePicBg: React.SFC<OnePicBgProps> = p => {
  return (
    <OnePicBgDiv>
      <PlaceHolderPic />
      <BgLogoTitle>MAXHUB TEAMS</BgLogoTitle>
      {p.content ? <BgLogoContent>{p.content}</BgLogoContent> : null}
      {p.children}
    </OnePicBgDiv>
  );
};
