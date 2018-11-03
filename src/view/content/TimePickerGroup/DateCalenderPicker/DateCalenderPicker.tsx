import * as React from "react";
import { DateCalenderWrapper } from "./DateCalenderPickerStyled";
import * as moment from "moment";
import Calender from "rc-calendar";
export type DateCalenderPickerProps = {
  onChange(cur: moment.Moment): void;
  endTime?: number;
  startTime?: number;
  value: moment.Moment;
};
export class DateCalenderPicker extends React.Component<
  DateCalenderPickerProps
> {
  state = {
    value: this.props.value
  };
  componentDidMount() {
    this.setState({ value: this.props.value });
  }
  componentWillReceiveProps(nextPorps) {
    this.setState({ value: nextPorps.value });
  }
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
      return rus;
    } else {
      return true;
    }
  };
  onSelect = (cur: any) => {
    let flag = false;
    if (this.props.endTime && this.props.startTime) {
      flag =
        cur.valueOf() >= this.props.startTime &&
        cur.valueOf() <= this.props.endTime;
    } else if (this.props.endTime) {
      flag =
        cur.valueOf() >= this.disableNow && cur.valueOf() <= this.props.endTime;
    } else if (this.props.startTime) {
      flag = cur.valueOf() >= this.props.startTime;
    } else {
      flag = cur.valueOf() >= this.disableNow;
    }
    if (flag) {
      this.props.onChange(cur);
    }
  };
  onChange = (cur: moment.Moment) => {
    let time = moment(0);
    let startTime = moment(this.props.startTime || this.disableNow);
    let endTime = undefined as any;
    let disableEndMonthTime = undefined as any;
    if (this.props.endTime) {
      endTime = moment(this.props.endTime).add(1, "months");
      disableEndMonthTime = moment(
        endTime.format("YYYY-M") + "-" + time.format("D/HH:mm")
      ).valueOf();
    }
    let disableStartMonthTime = moment(
      startTime.format("YYYY-M") + "-" + time.format("D/HH:mm"),
      "YYYY-M-D/HH:mm"
    ).valueOf();
    let flag = true;
    if (disableEndMonthTime && disableEndMonthTime < cur.valueOf()) {
      flag = false;
    }
    if (disableStartMonthTime > cur.valueOf()) {
      flag = false;
    }
    if (flag === true) {
      this.setState({ value: cur });
    }
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
    const { value } = this.state;
    return (
      <DateCalenderWrapper>
        <Calender
          prefixCls="ant-calendar"
          disabledDate={this.disableDate}
          showDateInput={false}
          // @ts-ignore
          dateRender={this.renderDate}
          // @ts-ignore
          format={"YYYY-MM-DD"}
          onSelect={this.onSelect}
          onChange={this.onChange}
          value={value}
        />
      </DateCalenderWrapper>
    );
  }
}
