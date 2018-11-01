/**
 * ??
 */
import { SFC } from "react";
import * as React from "react";
import "./style.scss";
type extraErrorTextPropsType = {
  text: string;
  level: "warning" | "error";
};
export const ExtraErrorText: SFC<extraErrorTextPropsType> = props => {
  const { text, level } = props;
  return (
    <div className="extra-error-text">
      <i className={`teams-icon icon-${level || "warning"}`} />
      {text}
    </div>
  );
};
