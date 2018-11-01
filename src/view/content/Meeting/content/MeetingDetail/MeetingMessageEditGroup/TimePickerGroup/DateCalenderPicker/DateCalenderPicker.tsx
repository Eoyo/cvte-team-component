import * as React from "react";
import moment from "moment";
import "moment/locale/zh-cn";
import locale from "rc-calendar/lib/locale/en_US";
moment.locale("zh-cn");
import Calender from "rc-calendar";
import "./DateCalenderPicker.scss";
import { timeValue } from "src/utils/String/timeTick/Tick";

export type DateCalenderPickerProps = {
  onChange(cur: moment.Moment): void;
  endTime?: number;
  startTime?: number;
  value: moment.Moment;
};
export class DateCalenderPicker extends React.Component<
  DateCalenderPickerProps
> {
  getDayStart(mom: moment.Moment) {
    return moment(
      mom.format("YYYY-MM-DD") + "/00:00",
      "YYYY-MM-DD/HH:mm"
    ).valueOf();
  }

  disableNow = this.getDayStart(moment(new Date()));
  // disableNow = new Date().valueOf();
  disableDate = (cur: moment.Moment) => {
    if (cur) {
      let rus = false;
      if (this.props.endTime && this.props.startTime) {
        rus =
          cur.valueOf() <= this.props.startTime ||
          cur.valueOf() >= this.props.endTime;
      } else if (this.props.endTime) {
        rus =
          cur.valueOf() <= this.disableNow ||
          cur.valueOf() >= this.props.endTime;
      } else if (this.props.startTime) {
        rus = cur.valueOf() <= this.props.startTime;
      } else {
        rus = cur.valueOf() <= this.disableNow;
      }
      // if (rus) {
      //   console.log(rus, cur.format("DD"));
      // } else {
      //   console.log(cur.format("DD"), rus);
      // }

      // if (cur.format("DD") === "21") {
      //   console.log(
      //     cur.format("YYYY-MM-DD/HH:mm"),
      //     moment(this.disableNow).format("YYYY-MM-DD/HH:mm")
      //   );
      // }
      return rus;
    } else {
      return true;
    }
  };
  onChange = (cur: moment.Moment) => {
    this.props.onChange(cur);
  };
  getDay(cur: moment.Moment) {
    let mnow = moment(Date.now()).format("YYYY-MM-DD");
    let tomorrow = moment(Date.now())
      .add(1, "d")
      .format("YYYY-MM-DD");

    let day = cur.format("D");
    let curStr = cur.format("YYYY-MM-DD");
    if (curStr === mnow) {
      day = "今";
    } else if (curStr === tomorrow) {
      day = "明";
    }
    return day;
  }
  renderDate = (cur: moment.Moment) => {
    return (
      <div
        className="ant-calendar-date"
        aria-selected="true"
        aria-disabled="false"
      >
        {this.getDay(cur)}
      </div>
    );
  };
  render() {
    return (
      <div className="date-picker-from-antd">
        <Calender
          prefixCls="ant-calendar"
          disabledDate={this.disableDate}
          showDateInput={false}
          // @ts-ignore
          dateRender={this.renderDate}
          // @ts-ignore
          format={"YYYY-MM-DD"}
          locale={locale}
          onChange={this.onChange}
          value={this.props.value}
        />
      </div>
    );
  }
}
