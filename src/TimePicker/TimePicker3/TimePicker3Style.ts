type TimePickerStyleValue = {
  co_normal_primary: string;
  co_hover_primary: string;
  co_bg_default: string;
  co_bg_darker: string;
  co_darker_grey: string;
  main_fs: string;
  title_fs: string;
};

function StyleCssRender(p: TimePickerStyleValue) {
  return `
  .ant-calendar-selected-date .ant-calendar-date,
  .ant-calendar-selected-start-date .ant-calendar-date,
  .ant-calendar-selected-end-date .ant-calendar-date {
    background-color: ${p.co_normal_primary};
    color: ${p.co_bg_default};
  }
  .ant-calendar-selected-date .ant-calendar-date:hover,
  .ant-calendar-selected-start-date .ant-calendar-date:hover,
  .ant-calendar-selected-end-date .ant-calendar-date:hover {
    cursor: pointer;
    background-color: ${p.co_hover_primary};
  }
  
  .ant-calendar-today.ant-calendar-selected-date .ant-calendar-date {
    border-color: ${p.co_normal_primary};
    color: ${p.co_bg_default};
    font-weight: bold;
    border-radius: 50%;
  }
  .ant-calendar-today .ant-calendar-date {
    border-color: ${p.co_normal_primary};
    color: ${p.co_normal_primary};
  }
  
  .ant-calendar-date {
    border-radius: 50%;
  }
  .ant-calendar-date:hover {
    cursor: pointer;
    background-color: ${p.co_hover_primary};
  }
  
  .schedule-time-picker {
    display: flex;
    position: relative;
    width: 100%;
  }
  .schedule-time-picker .faker-datepicker {
    position: relative;
    z-index: 10;
  }
  .schedule-time-picker .faker-datepicker .teams-input {
    padding-right: 25px;
  }
  .schedule-time-picker .faker-datepicker-calendar-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  .schedule-time-picker .hidden-datepicker {
    opacity: 0;
    z-index: 1;
    height: 1px;
    position: absolute;
    left: 0;
    top: 3px;
    width: 200%;
    display: flex;
    overflow: hidden;
  }
  .schedule-time-picker .hidden-datepicker .one-data-input.date-picker {
    margin-left: 1px;
  }
  .schedule-time-picker .hidden-datepicker .one-data-input.start-time-picker,
  .schedule-time-picker .hidden-datepicker .one-data-input .end-time-picker {
    margin-top: -1px;
  }
  .schedule-time-picker .hidden-datepicker .one-data-input.end-time-picker {
    margin-left: 2px;
  }
  
  .meeting-date {
    width: 290px;
  }
  
  .start-time,
  .end-time {
    width: 115px;
  }
  
  .picker-popup-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 522px;
    background-color: ${p.co_bg_default};
    height: 397px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid ${p.co_bg_darker};
    /* $co-dark*/
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  .picker-popup-wrapper.wrapper-hidden {
    height: 0;
    overflow: hidden;
    border: none;
    outline: none;
    box-shadow: none;
  }
  .picker-popup-wrapper .picker-popup-info-wrapper {
    display: flex;
    justify-content: space-between;
    height: 70px;
    padding: 0 30px 0 47px;
    box-sizing: border-box;
    line-height: 70px;
    border-top: 1px solid ${p.co_bg_darker};
    width: 100%;
    z-index: 2000;
  }
  .picker-popup-wrapper .picker-popup-info-wrapper .picker-popup-btn {
    margin-left: 10px;
  }
  .picker-popup-wrapper .picker-popup-info-wrapper .picker-popup-info-text {
    font-weight: bold;
    font-size: ${p.title_fs};
    color: ${p.co_darker_grey};
    font-weight: normal;
  }
  .picker-popup-wrapper .picker-popup-title-wrapper {
    display: flex;
    height: 50px;
    position: relative;
    top: 0;
    left: 0;
    z-index: 1080;
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid ${p.co_bg_darker};
  }
  .picker-popup-wrapper .picker-popup-body-wrapper {
    height: 278px;
    position: relative;
    flex: 1;
    overflow: hidden;
  }
  .picker-popup-wrapper .ant-calendar-header {
    height: 50px;
    line-height: 50px;
  }
  .picker-popup-wrapper .ant-calendar {
    width: 290px;
  }
  .picker-popup-wrapper .ant-time-picker-panel-inner,
  .picker-popup-wrapper .ant-time-picker-panel-combobox,
  .picker-popup-wrapper .ant-time-picker-panel-select {
    height: 100%;
    max-height: 100%;
  }
  .picker-popup-wrapper .ant-time-picker-panel-inner {
    left: 0;
  }
  .picker-popup-wrapper .ant-time-picker-panel-select {
    width: 57px;
  }
  .picker-popup-wrapper .ant-time-picker-panel-select li {
    width: 57px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .picker-popup-wrapper .ant-time-picker-panel-select li:hover {
    cursor: pointer;
    background-color: ${p.co_hover_primary};
  }
  .picker-popup-wrapper .ant-time-picker-panel-select ul {
    padding-bottom: 228px;
  }
  .picker-popup-wrapper .ant-time-picker-panel-select-option-selected {
    /*background-color: ${p.co_hover_primary};*/
    font-weight: normal;
    height: 50px;
    line-height: 50px;
  }
  .picker-popup-wrapper .ant-calendar-picker-container {
    width: 290px;
  }
  .picker-popup-wrapper .ant-calendar-prev-year-btn,
  .picker-popup-wrapper .ant-calendar-prev-month-btn,
  .picker-popup-wrapper .ant-calendar-next-month-btn,
  .picker-popup-wrapper .ant-calendar-next-year-btn {
    line-height: 50px;
  }
  .picker-popup-wrapper .ant-time-picker-panel {
    width: 115px;
    box-shadow: -1px 0 0 0 ${p.co_bg_darker};
  }
  .picker-popup-wrapper .ant-time-picker-panel-input-wrap {
    padding: 0;
    max-width: 115px;
    border-bottom: none;
    display: none;
  }
  .picker-popup-wrapper .ant-time-picker-panel-input {
    height: 49px;
    line-height: 49px;
    padding-left: 20px;
    font-weight: bold;
    background-color: ${p.co_bg_default};
    font-size: ${p.main_fs};
    color: ${p.co_darker_grey};
  }
  
  .schedule-time-picker-instance {
    box-shadow: none;
    border: none;
    height: 278px;
  }
  .schedule-time-picker-instance .ant-time-picker-panel-inner,
  .schedule-time-picker-instance .ant-calendar {
    box-shadow: none;
    border: none;
  }
  .schedule-time-picker-instance .ant-calendar-input-wrap {
    display: none;
  }`;
}

let style: HTMLStyleElement;
const defaultValue: TimePickerStyleValue = {
  co_normal_primary: "#3ac3c8",
  co_hover_primary: "#cdeeef",
  co_bg_default: "#ffffff",
  co_bg_darker: "#e9e9e9",
  co_darker_grey: "#343434",
  main_fs: "14px",
  title_fs: "18px"
};

/**
 *
 * @param p
 * co_normal_primary: string;
 *
 * co_hover_primary: string;
 *
 * co_bg_default: string;
 *
 * co_bg_darker: string;
 *
 * co_darker_grey: string;
 *
 * main_fs: 正文字体大小;
 *
 * title_fs: 标题字体大小;
 */
export function TimePicker3Style(p: Partial<TimePickerStyleValue> = {}) {
  if (style) {
    document.body.removeChild(style);
  }
  const fullP = Object.assign({}, defaultValue, p);
  style = document.createElement("style");
  let css = StyleCssRender(fullP);

  document.body.appendChild(style);
  return;
}
