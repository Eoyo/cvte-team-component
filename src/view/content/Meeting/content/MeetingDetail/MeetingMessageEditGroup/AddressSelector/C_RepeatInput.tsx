/**
 * 使用打包了的TimePicker;
 */

import * as React from "react";
import { InputWrapper } from "../../../../../../common/component/InputLike/InputWrapper";
import { Ele } from "../../../../../../common/ts-styled/ele";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";
import * as moment from "moment";
import { U } from "../../../../../../../utils";

export const C_RepeatInput = MeetingConnect(s => {
  const body = s.editingDetail;
  let repeatType = 0 as 0 | 1 | 2;
  if (body.repeatType === 0) {
    repeatType = 1;
  } else if (body.repeatType === 1) {
    repeatType = 2;
  }
  let repeatDateArr = [] as number[];
  if (repeatType === 2 && body.repeatValue) {
    let arr = body.repeatValue.split(",");
    for (let i in arr) {
      repeatDateArr.push(parseInt(arr[i]));
    }
  }
  let repeatEndDate = moment(body.repeatEndTime || 0).format("YYYY-M-D");
  let repeatString = "";
  //每周重复
  if (repeatType === 2) {
    repeatDateArr.sort((param1, param2) => {
      return param1 > param2 ? 1 : -1;
    });
    for (let i = 0; i < repeatDateArr.length; ++i) {
      if (i !== repeatDateArr.length - 1) {
        repeatString +=
          "周" + U.formDate.numberTransToWeek(repeatDateArr[i]) + "，";
      } else {
        repeatString += "周" + U.formDate.numberTransToWeek(repeatDateArr[i]);
      }
    }
  } else {
    repeatString += "每天";
  }
  repeatString += "，截至";
  repeatString += repeatEndDate;
  function onClick() {
    console.log("showAddressSelector click");
    const {
      editingDetail: { repeatEndTime },
    } = Meeting.grab();
    if (repeatEndTime) {
      Meeting.setRepeatEndTime({
        repeatEndTime: repeatEndTime,
      });
    }
    Meeting.setRepeatSelector({ show: true });
  }
  return {
    repeatString: repeatString,
    repeatType: repeatType,
    onClick: onClick,
  };
})(
  p =>
    //如果不是重复会议，就不用显示该input
    p.repeatType === 0 ? null : (
      <InputWrapper
        innerRightDecorator={
          <i
            className="teams-icon icon-edit repeat-edit-icon"
            onClick={p.onClick}
          />
        }
      >
        重复
        <Ele.input
          onChange={ev => {}}
          innerRef={ele => {
            if (ele) {
              ele.value = p.repeatString;
            }
          }}
          className="one-date-input teams-input"
          onClick={p.onClick}
        />
      </InputWrapper>
    )
);
