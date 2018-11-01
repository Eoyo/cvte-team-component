import * as React from "react";
import { InputWrapper } from "../../../../../../common/component/InputLike/InputWrapper";
import { Ele } from "../../../../../../common/ts-styled/ele";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";
import _ from "lodash";

class AddressInput extends React.Component<{
  roomId: string | undefined;
  addressStr: string;
  onInput: (str: string) => void;
  orderNo: string;
}> {
  ele;
  select = false;
  componentDidMount() {
    if (this.props.roomId && this.props.roomId.length > 0) {
      this.select = true;
    } else if (this.props.orderNo && this.props.orderNo.length > 0) {
      this.select = true;
    } else {
      this.select = false;
    }
  }
  componentDidUpdate() {
    if (this.props.roomId && this.props.roomId.length > 0) {
      this.select = true;
    } else if (this.props.orderNo && this.props.orderNo.length > 0) {
      this.select = true;
    } else {
      this.select = false;
    }
  }
  //对于有预约会议室部分，就需要有全选操作
  selectAll = _.debounce(() => {
    if (this.ele && this.select) {
      this.ele.select();
    }
  }, 0);
  render() {
    const p = this.props;
    return (
      <Ele.input
        onClick={ev => {
          this.selectAll();
        }}
        onMouseDown={ev => {
          this.selectAll();
        }}
        innerRef={ele => {
          if (ele) {
            this.ele = ele;
            if (p.addressStr !== ele.value) {
              ele.value = p.addressStr;
            }
          }
        }}
        onChange={ev => {
          p.onInput(ev.target.value);
        }}
        placeholder="请输入会议地点"
        className="one-date-input teams-input"
      />
    );
  }
}

export const C_AddressInput = MeetingConnect(s => {
  return {
    onInput(addressStr: string) {
      Meeting.setMeetingBaseMessage({
        room: addressStr,
      });
      // 如果事件的回调中直接同步的执行两个归约
      // 会造成就算是使用ref操作dom也不行!!
      // so: 将setMeetingBeUsed 使用setTimeOut 推后.
      setTimeout(() => {
        Meeting.setMeetingBeUsed({ beUsed: false });
      });
    },
    addressStr: s.editingDetail.address,
    roomId: s.editingDetail.roomId,
    meetingBeUsed: s.meetingBeUsed,
    orderNo: s.meetingData.body.orderNo,
  };
})(p => (
  <InputWrapper>
    地点
    <AddressInput
      orderNo={p.orderNo}
      roomId={p.roomId}
      addressStr={p.addressStr}
      onInput={p.onInput}
    />
    <>
      {p.meetingBeUsed === true ? (
        <div className="input-line-meeting-be-used-string">
          会议室已被占用，请重新选择
        </div>
      ) : null}
    </>
    {p.roomId ? (
      <Ele.secondBtn
        type={"primary"}
        onClick={() => {
          console.log("showAddressSelector click");
          Meeting.setAddressSelector({ show: true });
        }}
        className="meeting-address-choose-btn"
      >
        <i className="teams-icon icon-address" />
        <div>已选会议室</div>
      </Ele.secondBtn>
    ) : (
      <Ele.secondBtn
        onClick={() => {
          console.log("showAddressSelector click");
          Meeting.setAddressSelector({ show: true });
        }}
        className="meeting-address-btn"
      >
        <i className="teams-icon icon-address" />
        <div>选择会议室</div>
      </Ele.secondBtn>
    )}
  </InputWrapper>
));
