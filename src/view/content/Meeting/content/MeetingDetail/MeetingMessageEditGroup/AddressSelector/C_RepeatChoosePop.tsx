import * as React from "react";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";
import { Switch, Checkbox, Popover } from "antd";
import { Ele } from "../../../../../../common/ts-styled/ele";
import { PopCard } from "../../../../../../common/component/Pop/PopCard";
import * as moment from "moment";
import "./C_RepeatChoosePop.scss";
import { HrLine } from "../../../common/Layout/TitleLine";
import { DateCalenderPicker } from "../TimePickerGroup/DateCalenderPicker/DateCalenderPicker";
import { U } from "../../../../../../../utils";
import styled from "../../../../../../../../node_modules/styled-components";

const CheckboxGroup = Checkbox.Group;

const S_CheckboxGroup = styled(CheckboxGroup)`
  && .ant-checkbox-wrapper {
    &:hover,
    &:focus {
      .ant-checkbox-inner {
        border-color: #3ac3c8 !important;
      }
    }
  }
  .ant-checkbox-group-item {
    margin-right: 10px;
    > span {
      padding-left: 5px;
      padding-right: 0px;
      font-size: 12px;
    }
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #3ac3c8;
      border-color: #3ac3c8;
    }
    .ant-checkbox-checked {
      &::after {
        border: 1px solid #3ac3c8;
      }
    }
    .ant-checkbox {
      .ant-checkbox-inner {
        border-radius: 50%;
        height: 16px;
        width: 16px;
      }
      padding-left: 0px;
      &:hover,
      &:focus {
        .ant-checkbox-inner {
          border-color: #3ac3c8 !important;
        }
      }
    }
  }
`;

export const C_RepeatChoosePop = MeetingConnect(s => {
  let options = [
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期日",
  ];
  const thirtyDay = 30 * 24 * 60 * 60 * 1000;
  let repeatStartTime = s.editingDetail.repeatStartTime || 0;
  let repeatEndTime = s.editingDetail.repeatEndTime || 0;
  let shouldSetRepeatTime = false;
  //重复会议开始时间和结束时间超过30天，或者开始时间大于结束时间
  if (s.editingDetail.repeatType !== undefined) {
    let overThirtyDay =
      repeatEndTime - repeatStartTime > thirtyDay ? true : false;
    let beginOverEnd = repeatStartTime - repeatEndTime > 0 ? true : false;
    if (overThirtyDay || beginOverEnd) {
      shouldSetRepeatTime = true;
    }
  }
  return {
    show: s.showRepeatTimeSelectorPopCard,
    options: options,
    repeatEndTime: s.updateInfo && s.updateInfo.updateRepeatEndTime,
    repeatType: s.editingDetail.repeatType,
    repeatValue: s.editingDetail.repeatValue,
    shouldSetRepeatTime: shouldSetRepeatTime,
  };
})(p => <RepeatChoosePop {...p} />);

type RepeatChoosePopProps = {
  show: boolean;
  options: string[];
  shouldSetRepeatTime: boolean;
  repeatEndTime?: number;
  repeatType?: 0 | 1;
  repeatValue?: string;
};

class RepeatChoosePop extends React.Component<RepeatChoosePopProps> {
  state = {
    day: moment(Date.now()),
    chooseValue: [],
    showSwitch: true,
    showDay: false,
  };
  componentDidMount() {
    this.setState({
      day: moment(this.props.repeatEndTime || Date.now()),
      chooseValue: this.transToChooseValue(this.props.repeatValue || ""),
      showSwitch: this.props.repeatType === undefined ? false : true,
      showDay: this.props.repeatEndTime ? true : false,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      day: moment(nextProps.repeatEndTime || Date.now()),
      chooseValue: this.transToChooseValue(nextProps.repeatValue || ""),
      showSwitch: nextProps.repeatType === undefined ? false : true,
      showDay: nextProps.repeatEndTime ? true : false,
    });
  }
  transToChooseValue(repeatValue: string) {
    let repeatArr = repeatValue.split(",");
    let resArr = [] as string[];
    for (let i in repeatArr) {
      if (repeatArr[i] === "1") {
        resArr.push("星期一");
      } else if (repeatArr[i] === "2") {
        resArr.push("星期二");
      } else if (repeatArr[i] === "3") {
        resArr.push("星期三");
      } else if (repeatArr[i] === "4") {
        resArr.push("星期四");
      } else if (repeatArr[i] === "5") {
        resArr.push("星期五");
      } else if (repeatArr[i] === "6") {
        resArr.push("星期六");
      } else if (repeatArr[i] === "7") {
        resArr.push("星期日");
      }
    }
    return resArr;
  }
  transToRepeatValue(options: string[]) {
    let ret = "";
    let retArr = [] as number[];
    for (let i = 0; i < options.length; ++i) {
      if (options[i] === "星期一") {
        retArr.push(1);
      } else if (options[i] === "星期二") {
        retArr.push(2);
      } else if (options[i] === "星期三") {
        retArr.push(3);
      } else if (options[i] === "星期四") {
        retArr.push(4);
      } else if (options[i] === "星期五") {
        retArr.push(5);
      } else if (options[i] === "星期六") {
        retArr.push(6);
      } else if (options[i] === "星期日") {
        retArr.push(7);
      }
    }
    for (let i = 0; i < retArr.length; ++i) {
      if (i !== retArr.length - 1) {
        ret += retArr[i] + ",";
      } else {
        ret += retArr[i];
      }
    }
    return ret;
  }
  pickDay = (cur: moment.Moment) => {
    this.setState({
      showDay: true,
      day: cur.clone(),
    });
  };
  render() {
    const { show, options, shouldSetRepeatTime } = this.props;
    const { day, chooseValue, showSwitch, showDay } = this.state;
    let btnDisable = true;
    const {
      editingDetail: { repeatStartTime, beginTime },
    } = Meeting.grab();
    let endTime = 0;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (repeatStartTime) {
      endTime = repeatStartTime + thirtyDays;
    }
    if ((chooseValue.length > 0 && showDay === true) || showSwitch === false) {
      btnDisable = false;
    }
    let content = null as any;
    if (showSwitch) {
      content = (
        <>
          <HrLine />
          <div className="repeat-time-selector-middle-content-wrapper">
            <S_CheckboxGroup
              className="repeat-time-selector-checkbox-group"
              options={options}
              value={chooseValue}
              onChange={ev => {
                this.setState({ chooseValue: ev });
              }}
            />
            <div
              className={
                "repeat-time-selector-date-wrapper" +
                (showDay
                  ? " repeat-time-selector-normal"
                  : " repeat-time-selector-error")
              }
            >
              <span className="repeat-time-selector-date-title">重复截止</span>
              <Popover
                trigger="click"
                placement="bottom"
                overlayClassName="repeat-time-select-date-picker-wrapper"
                content={
                  <DateCalenderPicker
                    onChange={this.pickDay}
                    value={day}
                    endTime={endTime === 0 ? undefined : endTime}
                    startTime={beginTime}
                  />
                }
              >
                <input
                  value={showDay ? day.format("YYYY-MM-DD") : ""}
                  placeholder="请选择日期"
                  className="repeat-time-selector-date-picker"
                />
                <i className="teams-icon icon-calendar repeat-time-select-date-picker-icon" />
              </Popover>
            </div>
            {showDay ? null : (
              <div className="repeat-time-selector-no-day-tips">
                请选择结束日期
              </div>
            )}
          </div>
        </>
      );
    }
    return (
      <PopCard
        visible={show}
        popContentClassName={"repeat-time-selector-wrapper"}
        onClickBg={() => {
          if (!shouldSetRepeatTime) {
            Meeting.setRepeatSelector({ show: false });
          }
        }}
      >
        <div className="repeat-time-selector-title">
          <div className="repeat-time-selector-title-content">重复预约</div>
          <Switch
            className="repeat-time-selector-title-switch"
            checked={showSwitch}
            onChange={ev => {
              this.setState({
                showSwitch: ev,
              });
            }}
          />
        </div>
        {content}
        <HrLine />
        <div className="repeat-time-selector-btns-group">
          {shouldSetRepeatTime ? null : (
            <Ele.secondBtn
              className="repeat-time-selector-btn"
              onClick={() => {
                Meeting.setRepeatSelector({ show: false });
              }}
            >
              取消
            </Ele.secondBtn>
          )}
          <Ele.secondBtn
            className="repeat-time-selector-btn"
            type={"primary"}
            disable={btnDisable}
            onClick={() => {
              if (!btnDisable) {
                const s = Meeting.grab();
                Meeting.checkAndSetRepeatDate({
                  date: {
                    repeatType: showSwitch === false ? undefined : 1,
                    repeatEndTime: U.formDate.getTimeStick(
                      day,
                      moment(s.editingDetail.endTime)
                    ),
                    repeatValue: this.transToRepeatValue(chooseValue),
                  },
                });
                Meeting.setRepeatSelector({ show: false });
              }
            }}
          >
            确定
          </Ele.secondBtn>
        </div>
      </PopCard>
    );
  }
}
