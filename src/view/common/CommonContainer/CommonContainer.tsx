import * as React from "react";
import { Fusion } from "src/stores/Actor/fusion";
import { CommonContainerActor } from "../../../pivot/CommonContainer/Actor";
// acehi
export type CommonContainerProps = {};

export const CommonContainerFunsion = Fusion(CommonContainerActor.getStore())(
  state => {
    return { content: state.content, show: state.show };
  }
)(topProps => {
  return topProps.show ? (
    <div className="common-container">{topProps.content}</div>
  ) : null;
});
