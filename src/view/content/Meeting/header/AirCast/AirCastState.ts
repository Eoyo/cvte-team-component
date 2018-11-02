import { TypeConnectStatus, ConnectStatus } from "./Types/ConnectStatusTypes";
import { TypePincode } from "./Types/InputTypes";
import { TypeAirCastMode } from "./Types/OpreationTypes";

const [INPUT, STATUS, MODE] = ["input", "status", "mode"];
// const INPUT = 'input';

export const stepStatus = {
  INPUT,
  STATUS,
  MODE,
};

export enum Step {
  input,
  status,
  mode, // 选择链接方式
}

export type TypeAirCast = {
  show: boolean;
  step: Step;
} & TypeConnectStatus &
  TypePincode &
  TypeAirCastMode;

// 使用限制值得类型
export const AirCastInitState: TypeAirCast = {
  show: false,
  step: Step.input,
  status: ConnectStatus.start_loading,
  errorCode: 0,
  pincode: "",
  isConfirmToConnect: false,
  isPinCodevalid: false,
  mode: "single",
};
