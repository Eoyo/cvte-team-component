// 编辑开始和结束时间的.
import * as React from "react";
import * as moment from "moment";
import { DatePicker, TimePicker } from "antd";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
import { ScheduleTimePickProps } from "./SchedulTimePickerTypes";
import _ from "lodash";
import { U } from "../../../../../../../utils";
import locale from "antd/lib/date-picker/locale/zh_CN";
import {
  a,
  ScrollbarContainConfig,
} from "../../../../../common/ScrollbarContain/ScrollbarContain";
import { TimePickerConfirmGroup } from "../TimePickerGroup/TimePickerConfirm/TimePickerConfirm";
// faker 组件显示时间
const getValue = (date: any, startTime: any, endTime: any) => {
  const now = moment().locale("zh-ch");
  const _date = (date || now).format("YYYY-MM-DD");
  const _startTime = (startTime || now).format("HH:mm");
  const _endTime = (endTime || now).format("HH:mm");
  return `${_date}  ${_startTime}~${_endTime}`;
};

const timePickerFormat = "HH     :   mm";
export class ScheduleTimePicker extends React.Component<ScheduleTimePickProps> {
  constructor(props: any) {
    super(props);
  }
  ele: HTMLElement | null = null;
  state = {
    dateVisible: false,
    date: moment(),
    startTime: moment(),
    endTime: moment(),
  };
  componentDidMount() {
    const {
      dateValue: { date, startTime, endTime },
    } = this.props;

    this.setState({
      date,
      startTime,
      endTime,
    });
  }
  setDatePickerShow = () => {
    this.setState(
      {
        dateVisible: true,
      },
      this.setNiceScroll
    );
  };
  setNiceScroll = _.debounce(() => {
    if (this.ele) {
      const toScroll = a(this.ele).find(".ant-time-picker-panel-select");
      toScroll.niceScroll({
        ...ScrollbarContainConfig,
        cursorcolor: "#ddd",
        cursorfixedheight: 30,
      });
    }
  }, 100);

  confirmTimePicker = () => {
    const { onChange, dateValue } = this.props;
    onChange({
      ...dateValue,
      date: this.state.date,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
    });
    this.setState({
      dateVisible: false,
    });
  };

  // 设置日期的
  setLocalDate = (
    date: moment.Moment,
    type: "date" | "startTime" | "endTime"
  ) => {
    const s = { ...this.state };
    s[type] = date;

    let now = Date.now();
    let setStartTime = U.formDate.getTimeStick(s.date, s.startTime);
    if (setStartTime < now) {
      s.date = moment(now);
      s.startTime = moment(now);
      setStartTime = now;
    } // else {};

    let setEndTime = U.formDate.getTimeStick(s.date, s.endTime);
    if (setStartTime >= setEndTime) {
      let startTimeHour = s.startTime.format("HH");
      let startTimeMinute = s.startTime.format("mm");
      //如果大于等于23:30分，就不能直接加30分钟了，只加1分钟
      let flag =
        parseInt(startTimeHour) === 23 && parseInt(startTimeMinute) >= 30;
      if (type === "startTime" && !flag) {
        s.endTime.add(30, "m");
      } else {
        s.endTime = s.startTime.clone().add(1, "m");
      }
    } // else {}

    this.setState(s);
  };
  render() {
    const { dateVisible } = this.state;
    const { dateValue, startTimeLessThanNow } = this.props;
    const { date, startTime, endTime } = dateValue;
    const {
      date: dateState,
      startTime: startTimeState,
      endTime: endTimeState,
    } = this.state;
    return (
      <div
        className="schedule-time-picker"
        ref={ele => {
          ele && (this.ele = ele);
        }}
      >
        <div
          className="faker-datepicker"
          onClick={() => {
            this.setDatePickerShow();
          }}
        >
          <input
            className="teams-input"
            placeholder="请输入会议时间"
            disabled={true}
            onChange={() => {}}
            value={getValue(date, startTime, endTime)}
          />
          {startTimeLessThanNow === true ? (
            <div className="input-line-begintime-lessthan-nowtime">
              开会时间不可早于当前时间
            </div>
          ) : null}
          <i className="teams-icon icon-calendar faker-datepicker-calendar-icon" />
        </div>
        <div
          className={`picker-popup-wrapper ${
            dateVisible ? "" : "wrapper-hidden"
          }`}
        >
          <div className="picker-popup-title-wrapper">
            <div className="meeting-date">会议日期</div>
            <div className="start-time">开始时间</div>
            <div className="end-time">结束时间</div>
          </div>
          <div className="picker-popup-body-wrapper">
            <div className="hidden-datepicker">
              <div className="one-data-input date-picker meeting-date">
                <DatePicker
                  onChange={mm => {
                    this.setLocalDate(mm, "date");
                  }}
                  popupStyle={{ top: 0, left: 0 }}
                  allowClear={false}
                  dropdownClassName="schedule-time-picker-instance"
                  value={dateState}
                  format={"YYYY-MM-DD"}
                  placeholder={"请选择日期"}
                  showToday={false}
                  open={dateVisible}
                  getCalendarContainer={() => {
                    return (
                      document.querySelector(".picker-popup-body-wrapper") ||
                      document.body
                    );
                  }}
                  locale={locale}
                />
              </div>
              <div className="one-data-input start-time-picker start-time">
                {/* 开始时间 */}
                <TimePicker
                  popupClassName="schedule-time-picker-instance"
                  onChange={mm => {
                    this.setLocalDate(mm, "startTime");
                  }}
                  minuteStep={15}
                  placeholder={"请选择开始时间"}
                  format={timePickerFormat}
                  value={startTimeState}
                  open={dateVisible}
                  allowEmpty={false}
                  getPopupContainer={() => {
                    return (
                      document.querySelector(".picker-popup-body-wrapper") ||
                      document.body
                    );
                  }}
                  inputReadOnly={true}
                />
              </div>
              <div className="one-data-input end-time-picker end-time">
                {/* 结束时间 */}
                <TimePicker
                  popupClassName="schedule-time-picker-instance"
                  inputReadOnly={true}
                  onChange={mm => {
                    this.setLocalDate(mm, "endTime");
                  }}
                  minuteStep={15}
                  placeholder={"请选择结束时间"}
                  open={dateVisible}
                  format={timePickerFormat}
                  allowEmpty={false}
                  value={endTimeState}
                  getPopupContainer={() => {
                    return (
                      document.querySelector(".picker-popup-body-wrapper") ||
                      document.body
                    );
                  }}
                />
              </div>
            </div>
            <div className="temp-confirm">
              <TimePickerConfirmGroup />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
