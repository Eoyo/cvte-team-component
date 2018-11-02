/*
 * @File:  消息中心入口
 * @Date: 2018-09-05 11:31:03 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-11-01 17:08:27
 */
import { transformAction } from "./transform";
import { queueInstance } from "./queue";
import {
  pushRealTimeMessage,
  pushNotificationMessage,
  nativeLogMessage,
  utilsLog,
} from "../native";
// import "./test";
import {
  TypeMessageheader,
  TypeProperties,
  TypeMessageBody,
  TypepushRealTimeMessage,
} from "./pushMessageType";
const pushMessageConfig = {
  dbSync: false,
};

const transformFn = transformAction(pushMessageConfig);
const pushMessageStart = () => {
  utilsLog({
    msg: "begin listen==============================================",
  });
  // 监听 pushRealTimeMessage
  // 先关闭实时消息
  // pushRealTimeMessage((realTimeMessage: any) => {
  //   nativeLogMessage("pushRealTimeMessage", realTimeMessage);
  //   utilsLog({
  //     level: "info",
  //     msg: "pushRealTimeMessage==========>\n" + JSON.stringify(realTimeMessage),
  //   });
  //   queueInstance.add(transformFn(realTimeMessage, false));
  // });
  // 监听推送
  pushNotificationMessage((notificationMessage: any) => {
    utilsLog({
      msg:
        "notificationMessage=============>\n" +
        JSON.stringify(notificationMessage),
      level: "info",
    });
    nativeLogMessage("pushNotificationMessage", notificationMessage);
    queueInstance.add(transformFn(notificationMessage, true));
  });
};
// @ts-ignore
window.pushMessageStart = pushMessageStart;
export { pushMessageStart };
