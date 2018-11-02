/*
 * @File:  输入链接码容器
 * @Date: 2018-08-16 22:19:26 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-11-01 16:13:39
 */
import * as React from "react";
import { TypePincode } from "../../Types/InputTypes";
import { PincodeInput } from "./PincodeInput";
import { Ele } from "../../../../../../common/ts-styled/ele";
import { S } from "../../../../../../../stores";
import "./InputContainer.scss";
import {
  airOnConnected,
  AIRONCONNECTED_RESPONSE_TYPE,
  airConnect,
  airOnError,
  AIRONERROR_RESPONSE_TYPE,
  utilsLog,
  airOnDisconnected,
  airOnStopped,
} from "../../../../../../../services/native";
import { AirCastActor } from "../../AirCastActor";
import { fridayPushData } from "src/friday";

// 容器
export class InputContainer extends React.Component<TypePincode> {
  forID = "vcode";
  state = {
    codeNum: 8, //连接码个数
    pincode: "", // 链接码
  };
  connectAirCast(pincode: string) {
    // 镜像投屏（点击连接按钮
    fridayPushData({
      event: "click",
      eventName: "AIR_CAST_CONNECT_BUTTON_CLICK",
    });
    function connectErrorHandler() {
      S.AirCastActor.merge({
        isPinCodevalid: false,
      });
      setTimeout(() => {
        S.AirCastActor.merge({
          isPinCodevalid: true,
          pincode: "",
        });
      }, 1500);
    }
    function errorCodeHandler(errorCode: number | undefined) {
      if (
        errorCode === -1 ||
        errorCode === -2 ||
        errorCode === -7 ||
        errorCode === -12 ||
        errorCode === -13
      ) {
        S.AirCastActor.airCastNetworkError({});
      } else {
        S.AirCastActor.airCastConnectError({});
      }
    }
    // 开始连接
    S.AirCastActor.merge({
      isConfirmToConnect: true,
      isPinCodevalid: true,
      pincode: pincode,
    });
    airOnConnected((ret: AIRONCONNECTED_RESPONSE_TYPE) => {
      if (0 === ret.errorCode) {
        S.AirCastActor.connectStart({});
      } else {
        errorCodeHandler(ret.errorCode);
      }
    });
    airOnError((ret: AIRONERROR_RESPONSE_TYPE) => {
      utilsLog({ msg: "air on error" });
      if (0 === ret.errorCode) {
        //do nothing
      } else {
        errorCodeHandler(ret.errorCode);
      }
    });
    airOnDisconnected(() => {
      S.AirCastActor.airCastReset({});
    });
    airOnStopped(() => {
      S.AirCastActor.airCastStop({});
    });
    // 投屏开始连接
    airConnect({
      pin_code: pincode.toUpperCase(),
    })
      .then(({ ret }: { ret: number }) => {
        // 连接完后开始监听
        if (ret === 0) {
          S.AirCastActor.airCastConnectLoading({});
        } else if (ret !== 0) {
          connectErrorHandler();
        }
      })
      .catch((e: any) => {
        connectErrorHandler();
      });
  }
  onChangeCodeNum(codeNum: number) {
    this.setState({
      codeNum: codeNum,
    });
    AirCastActor.merge({
      pincode: "",
    });
  }
  onRender() {
    const p = { ...this.props };
    this.state.pincode = this.props.pincode;
  }
  render() {
    const p = { ...this.props };
    this.onRender();
    let buttonCanUse = p.pincode.length === this.state.codeNum ? true : false;

    return (
      <div
        className={`pincode-container aircast-page-container ${
          p.isConfirmToConnect &&
          p.pincode.length === this.state.codeNum &&
          !p.isPinCodevalid
            ? "is-error"
            : ""
        }`}
      >
        <p className="tip-message">请输入连接码</p>
        <p className="info-message-content">
          <span className="info-message-content-normal">连接码需从</span>
          <span className="info-message-content-tips">会议平板/传屏盒子</span>
          <span className="info-message-content-normal">处获得</span>
        </p>
        <div
          className={
            "pincode-group" +
            (this.state.codeNum === 8 ? " pincode-group-8code" : "") +
            (this.state.codeNum === 6 ? " pincode-group-6code" : "")
          }
        >
          <PincodeInput
            forID={this.forID}
            pincode={this.state.pincode}
            codeNum={this.state.codeNum}
            connectAirCast={this.connectAirCast}
            show={p.show}
          />
          <p className="tip-message-error-code invalid-message">连接码错误</p>
          <p
            className="tip-message-change-code info-message-content-normal"
            onClick={() => {
              this.onChangeCodeNum(this.state.codeNum === 8 ? 6 : 8);
            }}
          >
            {`切换 ${this.state.codeNum === 8 ? 6 : 8} 位连接码 >`}
          </p>
        </div>
        <Ele.mainBtn
          type="primary"
          disable={buttonCanUse ? false : true}
          onClick={() => {
            if (buttonCanUse) {
              this.connectAirCast(p.pincode);
            }
          }}
        >
          连接设备
        </Ele.mainBtn>
      </div>
    );
  }
}
