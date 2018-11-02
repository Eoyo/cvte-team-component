import { AirCastInitState, stepStatus, Step } from "./AirCastState";

import { airCastInputActor } from "./zActor/input";
import { Actor } from "../../../../../stores/Actor/actor";
import { ConnectStatus } from "./Types/ConnectStatusTypes";

export const AirCastActor = Actor(AirCastInitState)({
  ...airCastInputActor.actions,
  connectStart: {},
  airCastConnectLoading: {},
  airCastConnectError: {},
  airCastNetworkError: {},
  airCastStartLoading: {},
  airCastStart: {},
  airCastStop: {},
  airCastReset: {},
  showModal: {},
  airCastBack: {},
  closeModal: {},
})({
  ...airCastInputActor.reducers,
  connectStart(s, d) {
    return { ...s, step: Step.mode };
  },
  airCastStartLoading(s, d) {
    return { ...s, step: Step.status, status: ConnectStatus.connect_loading };
  },
  airCastConnectError(s, d) {
    return { ...s, step: Step.status, status: ConnectStatus.connect_error };
  },
  airCastNetworkError(s, d) {
    return { ...s, step: Step.status, status: ConnectStatus.network_error };
  },
  airCastConnectLoading(s, d) {
    return { ...s, step: Step.status, status: ConnectStatus.connect_loading };
  },
  airCastStart(s, d) {
    return { ...s, step: Step.status, status: ConnectStatus.connected };
  },
  airCastStop(s, d) {
    return { ...s, step: Step.mode, show: true };
  },
  showModal(s, d) {
    return { ...s, show: true };
  },
  closeModal(s, d) {
    return { ...s, show: false, pincode: "" };
  },
  airCastReset(s, d) {
    return { ...s, ...AirCastInitState };
  },
  airCastBack(s, d) {
    return { ...s, step: Step.input };
  },
  always(s) {
    return { ...s };
  },
});
