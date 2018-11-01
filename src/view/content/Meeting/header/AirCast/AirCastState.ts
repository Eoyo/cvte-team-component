import { TypeConnectStatus, CONNECTED } from "./Types/ConnectStatusTypes";
import { TypePincode } from "./Types/InputTypes";
import { TypeAirCastMode } from "./Types/OpreationTypes";
import { connectStatus } from "./Types/ConnectStatusTypes";

const [INPUT, STATUS, MODE] = ["input", "status", "mode"];

export const stepStatus = {
  INPUT,
  STATUS,
  MODE,
};

export type TypeAirCast = {
  show: boolean;
  step: string;
} & TypeConnectStatus &
  TypePincode &
  TypeAirCastMode;

export const AirCastInitState: TypeAirCast = {
  show: false,
  step: INPUT,
  status: connectStatus.CONNECT_LOADING,
  errorCode: 0,
  pincode: "",
  isConfirmToConnect: false,
  isPinCodevalid: false,
  mode: "single",
};
