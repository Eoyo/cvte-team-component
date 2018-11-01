import * as React from "react";
import "./MessageShower.scss";
import CopyToClipboard from "react-copy-to-clipboard";
import { message } from "antd";
import { Editable } from "./Bijous/Editable";
import { U } from "../../../../../../../utils";
export type GroupMessageShowData = {
  groupName: string;
  groupId: string;
  createTimeStick: number | string;
  isEditable: boolean;
  lastEditName: string;
};

export const MessageShower = (p: { data: GroupMessageShowData }) => {
  const { data } = p;
  let time: number;
  if (typeof data.createTimeStick === "string") {
    time = parseInt(data.createTimeStick);
  } else {
    time = data.createTimeStick;
  }
  return (
    <div className="group-message-shower">
      <div className="group-message-line full-line">
        <Editable
          isEditable={data.isEditable}
          description={data.lastEditName || data.groupName}
          id={data.groupId}
        />
      </div>
      <div className="group-message-line">
        <div className="group-message-words">团队ID</div>
        <div className="descript">{data.groupId}</div>
        <CopyToClipboard
          text={data.groupId}
          onCopy={() => {
            message.destroy();
            message.success("团队ID已复制");
          }}
        >
          <div className="option">
            <i className="teams-icon icon-copy" />
          </div>
        </CopyToClipboard>
      </div>
      <div className="group-message-line">
        <div className="group-message-words">创建时间</div>
        <div className="descript">{U.formDate.normalDay(time)}</div>
        {/* <div className="option"></div> */}
      </div>
    </div>
  );
};
