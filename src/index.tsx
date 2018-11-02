import * as React from "react";
import { render } from "react-dom";
// 返回操作函数
export function TimePicker3Render(ele) {
  var memeryProps;
  function Render() {
    render(
      <div className="time-picker3-render">
        <TimePickerPopCard {...memeryProps} />
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
  return function(p: TimePickerPopCardProps) {
    checkProps(p);
    Render();
    // 返回局部更新函数
    return function(p: Partial<TimePickerPopCardProps>) {
      checkProps(p);
      Render();
    };
  };
}
