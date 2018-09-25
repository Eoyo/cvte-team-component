import * as React from "react";
import { render } from "react-dom";
import { ScheduleTimePicker, ScheduleTimePickProps } from "./TimePicker3";

// 返回操作函数
export function TimePicker3Render(ele: HTMLElement) {
  let memeryProps: any;
  function Render() {
    render(
      <div className="time-picker3-render">
        <ScheduleTimePicker {...memeryProps} />
      </div>,
      ele
    );
  }
  function checkProps(p: any) {
    if (p && memeryProps) {
      memeryProps = Object.assign(memeryProps, p);
    } else {
      memeryProps = p;
    }
  }
  return (p: ScheduleTimePickProps) => {
    checkProps(p);
    Render();

    // 返回局部更新函数
    return (p: Partial<ScheduleTimePickProps>) => {
      checkProps(p);
      Render();
    };
  };
}
