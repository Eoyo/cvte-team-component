import * as moment from "moment";
import { U } from "../../../utils";

export const MeetingTool = {
  // 默认时间的选择
  getDefaultDate() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const mm = moment(now);

    // 开始的日期
    const date = hour <= 18 ? mm : mm.add(1, "d");
    const oneHour = 60 * 60 * 1000;
    const halfHour = oneHour / 2;

    let startTime!: moment.Moment;
    let endTime!: moment.Moment;

    // 以半个小时为单位计算就近的整点 + 半个小时
    const startMoment =
      Math.ceil(date.valueOf() / halfHour) * halfHour + halfHour;

    if (hour <= 18) {
      startTime = moment(startMoment);
      endTime = moment(startMoment).add(30, "m");
    } else {
      // 第二天的会议默认为09点
      startTime = moment(date.format("YYYY-M-D") + "/09:00", "YYYY-M-D/HH:mm");
      endTime = startTime.clone().add(30, "m");
    }

    const rus = {
      date,
      startTime,
      endTime,
    };

    return rus;
  },
};

export function getDefaultTimePick() {
  const date = MeetingTool.getDefaultDate();
  return {
    beginTime: U.formDate.getTimeStick(date.date, date.startTime).valueOf(),
    endTime: U.formDate.getTimeStick(date.date, date.endTime).valueOf(),
  };
}
