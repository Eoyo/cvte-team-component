import { Moment } from "moment";
export type TimePickerDateType = {
  date: Moment | undefined;
  startTime: Moment | undefined;
  endTime: Moment | undefined;
};
export type ScheduleTimePickAction = "setDefault" | "setValue";
export type ScheduleTimePickProps = {
  action: ScheduleTimePickAction;
  dateValue: TimePickerDateType;
  onChange(data: TimePickerDateType): void;
  startTimeLessThanNow: boolean; //是否显示“开会时间不可早于当前时间”文案
};
