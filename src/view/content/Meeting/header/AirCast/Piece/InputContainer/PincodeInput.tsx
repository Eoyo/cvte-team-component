import * as React from "react";
import { Component } from "react";
import { S } from "../../../../../../../stores";
import "./PincodeInput.scss";
import { labelArray } from "./LabelGrid";
import _ from "lodash";
import { arrCss } from "src/utils/export";

type PincodeInputProps = {
  forID: string;
  pincode: string;
  codeNum: number;
  show: boolean;
  connectAirCast: (pincode: string) => void;
};
// 连接码输入框
export class PincodeInput extends Component<PincodeInputProps> {
  isInIme = false;
  // 标记是否使用过Pincode
  isUsedPincode = false;
  public state = {
    pincode: this.props.pincode,
    showPinCode: "",
    isFocusing: true,
  };
  onShouldInput = (inputStr: string) => {
    // 将inputStr记录到state;
    this.setState({
      pincode: inputStr,
    });

    // 计算限定的Pincode;
    this.calcPincode(inputStr);
  };
  calcPincode = _.debounce((inputStr: string) => {
    // 处于输入法中
    if (this.isInIme) {
      return;
    }
    // afterIME;
    //限定输入数字，英文
    let value = inputStr.replace(/[^a-zA-Z0-9]/g, "");
    this.setState({ pincode: value, showPinCode: value });
    this.isUsedPincode = false;
    if (value.length === this.props.codeNum) {
      S.AirCastActor.merge({
        pincode: value,
      });
    } else {
      S.AirCastActor.merge({
        pincode: value,
      });
    }
  }, 10);
  toStopArrowMove(code: number) {
    if (code <= 40 && code >= 37) {
      return true;
    } else {
      return false;
    }
  }
  componentWillReceiveProps(nextProps: PincodeInputProps, objStates: any) {
    // 需要读取数据, 外部需要
    this.setState({
      pincode: nextProps.pincode || "",
      showPinCode: nextProps.pincode || "",
    });

    if (nextProps.show) {
      this.onFocus();
    }
    if (!nextProps.show) {
      this.setState({
        pincode: "",
        showPinCode: "",
      });
    }
    setTimeout(() => {
      if (nextProps.pincode !== this.state.pincode && this.input) {
        // 使用dom回传.
        this.input.value = this.state.pincode;
      }
    });
  }
  componentDidMount() {
    this.onFocus();
    this.setState({
      pincode: "",
      isFocusing: true,
    });
  }
  onConfirmThePincode() {
    this.props.connectAirCast(this.state.pincode);
  }
  onEnter = (code: string) => {
    const s = this.state;
    if (s.pincode.length >= this.props.codeNum) {
      this.onConfirmThePincode();
    }
  };
  onFocus() {
    // receiveProps的时候, input 元素可能要更新
    setTimeout(() => {
      if (this.input) {
        let val = this.input.value + "";
        this.input.value = "";
        this.input.focus();
        this.input.value = val;
      }
    });
  }

  input = null as HTMLInputElement | null;
  render() {
    const p = this.props;
    const s = this.state;
    return (
      <div
        className={arrCss(["pincode-input", s.isFocusing && "is-focus"])}
        onClick={() => {
          this.onFocus();
        }}
      >
        <input
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          autoFocus={true}
          ref={ele => {
            if (ele) {
              this.input = ele;
            }
          }}
          value={s.pincode}
          style={{
            imeMode: "disabled",
          }}
          // 部分浏览器可以通过password阻止输入法.
          type="password"
          // type="text"
          className="hidden-input"
          id={p.forID}
          maxLength={p.codeNum}
          disabled={false}
          onBlur={() => {
            this.setState({
              isFocusing: false,
            });
          }}
          onFocus={() => {
            this.setState({
              isFocusing: true,
            });
          }}
          onKeyDown={ev => {
            // message.info("keydown");
            if (ev.keyCode === 13 && !this.isInIme) {
              this.onEnter(s.pincode);
            }

            if (this.toStopArrowMove(ev.keyCode)) {
              ev.preventDefault();
            }
            // 使用Focus 阻止移动光标 , 会导致输入法bug;
            // this.onFocus();
          }}
          onCompositionStart={ev => {
            // message.info("start");
            this.isInIme = true;
          }}
          onCompositionUpdate={ev => {
            // message.warning("update");
            console.log(ev.currentTarget.value);
          }}
          // 参数回传导致了事件丢失??, 出现输入法bug时, 出现CompositionEnd事件丢失
          onCompositionEnd={ev => {
            // message.info("end");
            this.isInIme = false;

            // CompositionEnd 和 change的事件的顺序未知, 推后获取组合后的值;
            setTimeout(() => {
              // 输入法退出时内容可能没有发生改变. 所以在CompositionEnd的时候触发input;
              this.input && this.onShouldInput(this.input.value);
            });
          }}
          onChange={ev => {
            this.onShouldInput(ev.target.value);
          }}
        />
        {labelArray(p.codeNum, p.forID, s.showPinCode)}
      </div>
    );
  }
}
