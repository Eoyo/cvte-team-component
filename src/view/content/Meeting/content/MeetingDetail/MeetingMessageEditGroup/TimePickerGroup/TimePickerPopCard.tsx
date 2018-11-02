import * as React from "react";
import { getTimeArray } from "src/utils/String/timeTick/TimeArray";
import { timeValue } from "src/utils/String/timeTick/Tick";
import { NumberPicker } from "./NumberPicker/NumberPicker";
import { TimePickerConfirmGroup } from "./TimePickerConfirm/TimePickerConfirm";
import { DateCalenderPicker } from "./DateCalenderPicker/DateCalenderPicker";
import moment from "moment";
import _ from "lodash";
import { U } from "src/utils";
import { TimePickerContent } from "./TimePickerPopCardStyle";

export type TimePickerPopCardProps = {
  visibale: boolean;
  showClear?: boolean;
  defaultValue: DateValue;
  onChange(date: {
    day: moment.Moment;
    startTime: moment.Moment;
    endTime: moment.Moment;
  }): any;
  onVisibleChange?(show: boolean): void;
};

type DateValue = {
  day: moment.Moment;
  startTime: moment.Moment;
  endTime: moment.Moment;
} | null;
export class TimePickerPopCard extends React.Component<TimePickerPopCardProps> {
  minTimePick = this.props.showClear ? 0 : 1;
  state = {
    visibale: true,
    startTimePick: this.minTimePick,
    endTimePick: this.minTimePick,
    day: moment(Date.now()),
    isClear: false,
    startTimeEnableWindow: [this.minTimePick, 100] as [number, number],
    endTimeEnableWindow: [this.minTimePick, 100] as [number, number],
  };
  startTimeArr = getTimeArray(15, "minute")(0, 24 * timeValue.hour - 1);
  endTimeArr = getTimeArray(15, "minute")(1, 24 * timeValue.hour);
  getEndTimePick(startTimePick: number) {
    let rus = startTimePick + 1;

    // 防止越界; 实际上有个占位符号在上面.
    if (rus > this.endTimeArr.length) {
      rus = this.endTimeArr.length;
    }
    return rus;
  }
  pickStartTime = (i: number) => {
    if (i <= 0) {
      this.toClear();
    } else if (i >= this.minTimePick) {
      let startTimePick = i;
      let endTimePick =
        this.state.endTimePick >= startTimePick + 1
          ? this.state.endTimePick
          : this.getEndTimePick(startTimePick);

      this.setState({
        startTimePick,
        endTimePick,
        endTimeEnableWindow: [startTimePick, 100],
      });
    }
  };
  pickEndTime = (i: number) => {
    if (i <= 0) {
      this.toClear();
    } else if (i >= this.minTimePick) {
      // startTime 和 endTime的 限制
      if (i < this.state.startTimePick) {
        this.setState({
          startTimePick: i,
          endTimePick: i,
        });
      } else {
        this.setState({
          endTimePick: i,
        });
      }
    }
  };

  getDayStart(mom: moment.Moment) {
    return moment(
      mom.format("YYYY-MM-DD") + "/00:00",
      "YYYY-MM-DD/HH:mm"
    ).valueOf();
  }
  diffTimeValueToPick(diff: number) {
    // 计算一个最近的事件pick;
    return ((diff / (15 * timeValue.minute)) | 0) + 1;
  }
  pickDay = (cur: moment.Moment) => {
    let todayStart = this.getDayStart(moment(new Date()));
    let selectDayStart = this.getDayStart(cur);
    this.setState({
      day: cur.clone(),
    });

    if (selectDayStart > todayStart) {
      // 选择的是今天以后, startTime的窗口就是全开的.
      this.setStartTimeWindow([this.minTimePick, 100]);
    } else if (selectDayStart === todayStart) {
      // 计算今天过去了多久.
      let diff = Date.now() - todayStart;
      // 开头有占位符, 需要额外+1;
      this.setStartTimeWindow([this.diffTimeValueToPick(diff) + 1, 100]);
    } else {
      console.warn("can' select this day", cur.format("YYYY-MM-DD"));
    }
  };

  setStartTimeWindow = (win: [number, number]) => {
    if (win[0] < this.minTimePick) {
      win[0] = this.minTimePick;
    }
    let startTimePick =
      win[0] > this.state.startTimePick ? win[0] : this.state.startTimePick;
    let endTimePick =
      this.state.endTimePick >= startTimePick
        ? this.state.endTimePick
        : startTimePick + 1;
    this.setState({
      startTimeEnableWindow: win,
      startTimePick,
      endTimePick,
      endTimeEnableWindow: [startTimePick, 100],
    });
  };
  toClear() {
    this.setState({
      startTimePick: this.minTimePick,
      endTimePick: this.minTimePick,
      endTimeEnableWindow: [this.minTimePick, 100],
      day: moment(Date.now()),
      isClear: true,
    });
  }
  getTimeStr() {
    const s = this.state;
    return (
      <span>
        <span>{s.day.format("YYYY-MM-DD")}</span>
        <span
          style={{
            marginLeft: "15px",
          }}
        >
          {this.trimStr(this.startTimeArr[s.startTimePick - 1])}
        </span>
        ~<span>{this.trimStr(this.endTimeArr[s.endTimePick - 1])}</span>
      </span>
    );
  }
  trimStr(str) {
    let rus = "";
    if (typeof str === "string") {
      for (let i = 0; i < str.length; i += 1) {
        rus += str[i] === " " ? "" : str[i];
      }
    }
    return rus;
  }

  getTimeStickOfDefaultValue(value: DateValue) {
    if (value) {
      return (
        U.formDate.getTimeStick(value.day, value.startTime) +
        "-" +
        U.formDate.getTimeStick(value.day, value.endTime)
      );
    } else {
      return "null";
    }
  }
  componentWillReceiveProps(nextProps: TimePickerPopCardProps) {
    // 归约是否可见, 和当前的状态比较!!!
    if (nextProps.visibale !== this.state.visibale) {
      this.setState({
        visibale: nextProps.visibale,
      });
    }
    // 归约时间的设置, 内部改变操作时不触发change通知外面.so:无需比较;
    // 但是有数据的轮训, 会触发数据的传入. so: 需要比对; 当绝对时间戳改变时触发更新
    if (
      !(
        this.getTimeStickOfDefaultValue(this.props.defaultValue) ===
        this.getTimeStickOfDefaultValue(nextProps.defaultValue)
      )
    ) {
      this.setValueFromProps(nextProps.defaultValue);
    }
  }
  componentWillMount() {
    // 初始化
    this.setState({
      visibale: this.props.visibale,
    });
    this.setValueFromProps(this.props.defaultValue);
  }
  componentDidMount() {
    // 如果依赖内部使用默认时间, 则触发change
    if (this.props.defaultValue === null) this.setOutChange();
  }
  setValueFromProps(value: DateValue) {
    if (value) {
      this.pickDay(value.day);

      this.pickStartTime(
        this.diffTimeValueToPick(
          U.formDate.getTimeStick(value.day, value.startTime) -
            this.getDayStart(value.startTime)
        )
      );

      // 右侧的时间排布往前面多挪了一格, so : 此处 -1
      this.pickEndTime(
        this.diffTimeValueToPick(
          U.formDate.getTimeStick(value.day, value.endTime) -
            this.getDayStart(value.endTime)
        ) - 1
      );
    } else {
      // value === null;
      // 不使用showClear时, 使用pickDay跳到默认今日的默认值.
      !this.props.showClear && this.pickDay(moment(new Date()));
    }
  }

  // 向外触发时间改变的设置
  setOutChange = () => {
    const s = this.state;
    this.props.onChange({
      day: s.day,
      startTime: moment(
        this.trimStr(this.startTimeArr[s.startTimePick - 1]),
        "HH:mm"
      ),
      endTime: moment(
        this.trimStr(this.endTimeArr[s.endTimePick - 1]),
        "HH:mm"
      ),
    });
    this.props.onVisibleChange && this.props.onVisibleChange(false);
  };

  render() {
    const p = this.props;
    const s = this.state;
    return (
      <TimePickerContent>
        <div className="time-picker-title-line">
          <div className="date-title">会议日期</div>
          <div className="time-title">开始时间</div>
          <div className="time-title">结束日期</div>
        </div>
        <div className="time-picker3">
          <DateCalenderPicker onChange={this.pickDay} value={s.day} />
          <NumberPicker
            arr={this.startTimeArr}
            pick={this.state.startTimePick}
            onPick={this.pickStartTime}
            enableWindow={this.state.startTimeEnableWindow}
          />
          <NumberPicker
            arr={this.endTimeArr}
            pick={this.state.endTimePick}
            onPick={this.pickEndTime}
            enableWindow={this.state.endTimeEnableWindow}
          />
        </div>
        <TimePickerConfirmGroup
          className="confirm-group"
          onClose={() => {
            this.setState({
              visibale: false,
            });
            p.onVisibleChange && p.onVisibleChange(false);
          }}
          timeStr={this.getTimeStr()}
          onClear={
            p.showClear
              ? () => {
                  this.toClear();
                }
              : undefined
          }
          onConfirm={this.setOutChange}
        />
      </TimePickerContent>
    );
  }
}
