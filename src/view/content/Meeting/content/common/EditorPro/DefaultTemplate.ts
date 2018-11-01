/* 
 * 构建文档的模版
 */
import { U } from "../../../../../../utils";
export const template = {
  getSummary(
    beginTime: number,
    endTime: number,
    master: string,
    subject: string,
    meetingContent: string = "",
    meetingNote: string = ""
  ) {
    // let theme = subject + "-会议纪要";
    let time =
      U.formDate.summaryDate(beginTime) + "~" + U.formDate.hourMinute(endTime);

    let compere = master;
    return `<p>
      <span style="color: rgb(153, 153, 153);">会议时间：${time}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;记录人：${compere}</span> </p>
    <h4>会议内容</h4>
    <p>${meetingContent ? meetingContent : "<br/>"}</p>
    <h4>会议决议</h4>
    <p>${meetingNote ? meetingNote : "<br/>"}</p>`;
  },
};
