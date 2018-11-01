import * as React from "react";
import { ContainAddGroup } from "../../AddGroupPaint";
import { U } from "../../../../../utils";
import { AddGroupViewerProps } from "./AddGroupViewerTypes";
import "./AddGroupViewer.scss";

export const AddGroupViewer: React.SFC<AddGroupViewerProps> = p => {
  return (
    <div
      className={U.arrCss(["add-group-viewer", p.visible ? "show" : "close"])}
    >
      <div className="content">
        <ContainAddGroup {...p} />
      </div>
    </div>
  );
};
