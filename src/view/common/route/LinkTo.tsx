/**
 * LinkTo,
 */
import "./LinkTo.scss";
import * as React from "react";
import { route } from "./Router";
import { arrCss } from "../../../utils/export";
export type LinkToProps = {
  path: string[];
  className?: string;
};

type route = ["meeting", { join: string }, "name"];

// not a site link , not A
// sfc
export const LinkTo: React.SFC<LinkToProps> = p => {
  return (
    <div
      className={arrCss(["link-to", p.className])}
      onClick={() => {
        route.setRoute(p.path);
      }}
      title={p.path.join("/")}
    >
      {p.children}
    </div>
  );
};
