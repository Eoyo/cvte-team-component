import * as React from "react";
import { InputWrapper } from "../../../../../../common/component/InputLike/InputWrapper";
import { RequireWithText } from "../../../../../../common/ts-styled/Decorate/Require";
import { Ele } from "../../../../../../common/ts-styled/ele";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";
import * as moment from "moment";
import { TimePickerPopCard } from "../TimePickerGroup/TimePickerPopCard";
import styled from "styled-components";
import { PopCard } from "src/view/common/component/Pop/PopCard";
import { flex } from "src/view/common/ts-styled/flex";

const getValue = (day: any, startTime: any, endTime: any) => {
  const now = moment().locale("zh-ch");
  const _date = (day || now).format("YYYY-MM-DD");
  const _startTime = (startTime || now).format("HH:mm");
  const _endTime = (endTime || now).format("HH:mm");
  return `${_date}  ${_startTime}~${_endTime}`;
};

export const TimeInputDecorator = styled("span")`
  --styled: "TimeInputDecorator";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  ${flex.rowCenter};
  .input-line-begintime-lessthan-nowtime {
    top: 4px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #ffffff;
    margin-left: 10px;
    right: 20px;
    color: #d96d5b;
    font-size: 12px;
  }
`;

export const C_ScheduleTimeInput = MeetingConnect(s => {
  return {
    value: getValue(
      moment(s.editingDetail.beginTime),
      moment(s.editingDetail.beginTime),
      moment(s.editingDetail.endTime)
    ),
    startTimeLessThanNow: s.startTimeLessThanNow,
    showTimePick() {
      Meeting.setMeetingTimePickePopCard({
        show: true,
      });
    },
  };
})(p => (
  <InputWrapper
    innerRightDecorator={
      <TimeInputDecorator onClick={p.showTimePick}>
        {p.startTimeLessThanNow === true ? (
          <span className="input-line-begintime-lessthan-nowtime">
            开会时间不可早于当前时间
          </span>
        ) : null}
        <i className="teams-icon icon-calendar faker-datepicker-calendar-icon" />
      </TimeInputDecorator>
    }
    leftDecorator={<RequireWithText hintText="*" toCheckText={p.value} />}
  >
    时间
    <Ele.input
      onClick={p.showTimePick}
      value={p.value}
      className="one-date-input teams-input"
      placeholder={"请输入时间"}
      onChange={value => {
        // 忽略输入
      }}
    />
  </InputWrapper>
));

export const C_ScheduleTimePopCard = MeetingConnect(s => {
  return {
    onChangeTime(date: { day: any; startTime: any; endTime: any }) {
      Meeting.checkAndSetDate({ date: date });
    },
    defaultValue: {
      day: moment(s.editingDetail.beginTime),
      startTime: moment(s.editingDetail.beginTime),
      endTime: moment(s.editingDetail.endTime),
    },
    show: s.showMeetingTimePickerPopCard,
    onVisibleChange(show: boolean) {
      Meeting.setMeetingTimePickePopCard({ show });
    },
  };
})(p => {
  return (
    <PopCard
      visible={p.show}
      onClickBg={() => {
        p.onVisibleChange(false);
      }}
    >
      {p.show ? (
        <TimePickerPopCard
          visibale={p.show}
          onChange={date => {
            p.onChangeTime(date);
          }}
          defaultValue={p.defaultValue}
          onVisibleChange={p.onVisibleChange}
        />
      ) : null}
    </PopCard>
  );
});
