/*
 * @File:  消息中心入口
 * @Date: 2018-09-05 11:31:03 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-10-30 22:07:10
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
  pushRealTimeMessage((realTimeMessage: any) => {
    nativeLogMessage("pushRealTimeMessage", realTimeMessage);
    queueInstance.add(transformFn(realTimeMessage, false));
  });
  // 监听推送
  pushNotificationMessage((notificationMessage: any) => {
    utilsLog({ msg: JSON.stringify(notificationMessage) });
    nativeLogMessage("pushNotificationMessage", notificationMessage);
    queueInstance.add(transformFn(notificationMessage, true));
  });
};
// @ts-ignore
window.pushMessageStart = pushMessageStart;
export { pushMessageStart };
