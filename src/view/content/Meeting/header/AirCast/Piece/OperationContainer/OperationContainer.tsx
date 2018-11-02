/*
 * @File:  连接后投屏操作容器
 * @Date: 2018-08-16 22:19:26 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-08-24 17:18:28
 */
import * as React from "react";
import {
  airStartCast,
  airDisConnect,
  utilsLog,
  airOnStarted,
} from "../../../../../../../services/native";
import { S } from "../../../../../../../stores";
import { Popover } from "antd";

export const OperationContainer = () => {
  const disconnectAir = () => {
    airDisConnect()
      .then(() => {})
      .catch(() => {
        // error handler
      });
  };
  const chooseAirCastMode = (mode: number) => {
    airOnStarted(() => {
      S.AirCastActor.airCastStart({});
    });
    airStartCast({
      is_occupy: mode,
    })
      .then(({ ret }: { ret: number }) => {
        utilsLog({ msg: ret + "" });
        if (ret === 0) {
          S.AirCastActor.airCastStartLoading({});
        } else {
          // error
        }
      })
      .catch(() => {
        // error
      });
  };
  return (
    <div className="aircast-page-container">
      <div className="aircast-connect-status-area">
        <p className="tip-message info-message">选择投屏方式</p>
        <div className="aircast-connect-status">
          <span className="connect-info">
            已连接: <span className="maxhub-name">MAXHUB</span>
          </span>
          <span className="airconnect-disconnect-btn" onClick={disconnectAir}>
            断开
          </span>
        </div>
        <div className="aircast-connect-status-icon">
          <div className="aircast-opeation-wrapper">
            <div className="operation-btn" onClick={() => chooseAirCastMode(1)}>
              <Popover
                placement="bottom"
                overlayClassName="tip-popover"
                content={
                  <div className="tip-popover-text operation-popover-text">
                    仅显示当前设备的镜像内容
                  </div>
                }
              >
                <div className="operation-btn-image-wrapper">
                  <img
                    src={"./assets/images/air_cast/single.png"}
                    alt="单屏镜像"
                  />
                </div>
              </Popover>
              <span className="operation-text">单屏镜像</span>
            </div>
            <div className="operation-btn" onClick={() => chooseAirCastMode(0)}>
              <Popover
                placement="bottom"
                overlayClassName="tip-popover"
                content={
                  <div className="tip-popover-text operation-popover-text">
                    加入一个正在进行中的镜像内容
                  </div>
                }
              >
                <div className="operation-btn-image-wrapper">
                  <img
                    src={"./assets/images/air_cast/multiple.png"}
                    alt="多屏镜像"
                  />
                </div>
              </Popover>
              <span className="operation-text">多屏镜像</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
