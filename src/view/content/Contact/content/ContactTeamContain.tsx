import * as React from "react";
import "./common/style/contact.scss";
import { OnePicBg } from "../../common/BackGroudHolder/OnePicBg";
import { Fusion } from "../../../../stores/Actor/fusion";
import { Hinger } from "../../../../stores/DataHinger/DataHingerActor";

export const ContactTeamContain = Fusion(Hinger.getStore())(s => {
  let content = "";
  if (s.groupList.length === 0 || s.personList.length === 0) {
    content = "添加联系人或团队，都能为您的会议预约或纪要发送节省找人的时间";
  }
  return { content };
})(p => {
  return <OnePicBg content={p.content} />;
});
