/*
 * @File:  连接状态容器
 * @Date: 2018-08-16 22:19:26 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-08-25 10:07:09
 */
import * as React from "react";
import { connectStatus as connectStatusMAP } from "../../Types/ConnectStatusTypes";
import {
  airDisConnect,
  airStopCast,
} from "../../../../../../../services/native";
import { S } from "../../../../../../../stores";
import { message } from "antd";
import { Ele } from "../../../../../../common/ts-styled/ele";

//loading有两种状态，一个是连接时的loading（输入连接码后的状态），另一个是开启时的loading（点击单屏/多屏后的状态）
// "connectLoading" | "startLoading" | "connected" | "error";

const connectMap = {
  connectLoading: {
    icon: "./assets/images/air_cast/loading.png",
    text: "正在配置网络设置",
    isDisconnectShow: false,
  },
  startLoading: {
    icon: "./assets/images/air_cast/loading.png",
    text: "正在配置网络设置",
    isDisconnectShow: false,
  },
  connected: {
    icon: "./assets/images/air_cast/connected.png",
    text: "正在投屏中…",
    isDisconnectShow: false,
  },
  connectError: {
    icon: "./assets/images/air_cast/error.png",
    subText: "连接失败",
    text: "设备连接异常",
    isDisconnectShow: false,
  },
  networkError: {
    icon: "./assets/images/air_cast/error.png",
    text: "请检查网络设置",
    subText: "请保持设备在同一网络状态下",
    isDisconnectShow: false,
  },
};

// 图标  + 提示文字
const ConnectStatus2Views = (status: string) => {
  const disconnectAir = () => {
    airDisConnect()
      .then(({ ret }: { ret: number }) => {
        //失败弹出toast提示，成功则不需要处理
        if (ret === -1) {
          message.destroy();
          message.error("操作失败");
        }
      })
      .catch(() => {
        // error handler
        message.destroy();
        message.error("操作失败");
      });
  };
  return (
    <div className="aircast-connect-status-area">
      <p className="tip-message info-message">{connectMap[status].text}</p>
      <div className="aircast-connect-status">
        <span className="airconnect-disconnect-btn" onClick={disconnectAir}>
          {connectMap[status].isDisconnectShow ? "断开" : ""}
        </span>
      </div>
      <div className="aircast-connect-status-icon">
        <div>
          <img src={connectMap[status].icon} alt="connecing" />
          <p className="sub-tip-message">{connectMap[status].subText}</p>
        </div>
      </div>
    </div>
  );
};

export const ConnectStatusContainer = ({
  connectStatus,
}: {
  connectStatus: string;
}) => {
  const cancelHandler = (status: string) => {
    // 连接状态loading 状态未连接直接返回输入，保留记录
    if (status === connectStatusMAP.CONNECT_LOADING) {
      S.AirCastActor.airCastBack({});
    } else if (status === connectStatusMAP.START_LOADING) {
      S.AirCastActor.airCastStop({});
    } else if (status === connectStatusMAP.CONNECTED) {
      // 结束投屏，返回选择投屏方式
      S.AirCastActor.connectStart({});
    } else {
      // 错误返回输入，保留记录
      S.AirCastActor.airCastBack({});
    }
    airStopCast()
      .then(({ ret }: { ret: number }) => {
        if (ret === -1) {
          message.destroy();
          message.error("操作失败");
        }
      })
      .catch(() => {
        // error handler
        message.destroy();
        message.error("操作失败");
      });
  };

  return (
    <div className="aircast-page-container aircast-connect-status-container">
      {ConnectStatus2Views(connectStatus)}
      <Ele.mainBtn
        className={connectStatus === "connected" ? "aircast-finish-btn" : ""}
        type={"primary"}
        onClick={() => {
          cancelHandler(connectStatus);
        }}
      >
        {connectStatus === "connected" ? "结束投屏" : "取消"}
      </Ele.mainBtn>
    </div>
  );
};
