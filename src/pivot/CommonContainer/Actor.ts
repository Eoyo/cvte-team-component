import { Actor } from "../../stores/Actor/actor";
import { CommonContainerInitState } from "./store";

export const CommonContainerActor = Actor(CommonContainerInitState)({
  showContent: {
    content: null as any,
  },
  hideContent: {},
})({
  showContent: (state, payload) => {
    return {
      ...state,
      content: payload.content,
      show: true,
    };
  },
  hideContent: (state, payload) => {
    return { ...CommonContainerInitState };
  },
});
