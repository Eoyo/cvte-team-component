import * as React from "react";
import { AddGroupTypes } from "../../AddGroupTypes";
export type TypePersonSelector = {
  select: AddGroupTypes.selectState;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  opeType: "delete" | "select";
};
export const PersonSelector = (p: TypePersonSelector) => {
  return (
    <div className="person-selector" onClick={p.onClick}>
      {p.opeType === "select" && (
        <div className={`persion-selector-icon ${p.select}`}>
          <i className="teams-icon icon-checked" />
        </div>
      )}
      {p.opeType === "delete" && <i className="teams-icon icon-del" />}
    </div>
  );
};
