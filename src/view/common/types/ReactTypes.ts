import * as React from "react";
import * as H from "history";
export type Mouse<T = HTMLDivElement> = React.MouseEventHandler<T>;

export type History = {
  history: H.History;
};
