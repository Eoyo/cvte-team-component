import "./TeamsMessage.scss";
import * as React from "react";
export type TeamsMessageProps = {
  text: string;
  type: "loading" | "warning" | "success";
};
export const TeamsMessage: React.SFC<TeamsMessageProps> = p => {
  const map = {
    loading: "./assets/images/toast/teams-loading.svg",
    success: "./assets/images/toast/success.svg",
    warning: "./assets/images/toast/warning.svg",
  };
  return (
    <div className="teams-message">
      <img src={map[p.type]} alt={p.type} className={"teams-message-icon"} />
      <div className="teams-message-text">{p.text}</div>
    </div>
  );
};
