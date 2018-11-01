import { AirCastInitState, stepStatus } from "./AirCastState";

import { airCastInputActor } from "./zActor/input";
import { Actor } from "../../../../../stores/Actor/actor";

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
    return { ...s, step: stepStatus.MODE };
  },
  airCastStartLoading(s, d) {
    return { ...s, step: stepStatus.STATUS, status: "startLoading" };
  },
  airCastConnectError(s, d) {
    return { ...s, step: stepStatus.STATUS, status: "connectError" };
  },
  airCastNetworkError(s, d) {
    return { ...s, step: stepStatus.STATUS, status: "networkError" };
  },
  airCastConnectLoading(s, d) {
    return { ...s, step: stepStatus.STATUS, status: "connectLoading" };
  },
  airCastStart(s, d) {
    return { ...s, step: stepStatus.STATUS, status: "connected" };
  },
  airCastStop(s, d) {
    return { ...s, step: stepStatus.MODE, show: true };
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
    return { ...s, step: stepStatus.INPUT };
  },
  always(s) {
    return { ...s };
  },
});
