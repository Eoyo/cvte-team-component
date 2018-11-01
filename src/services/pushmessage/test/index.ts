import io from "socket.io-client";
import { transformAction } from "../transform";
import { queueInstance } from "../queue";
import { nativeListener, utilsLog } from "../../native";
import { teamsSystem } from "../contants";
import {
  TypepushRealTimeMessage,
  TypePushNotificationMessage,
} from "../pushMessageType";
import { TypeTeamsNameModifyMessageBodyData } from "../relation/realTimeRelation/teams";
import { TypeTeamsInviteMessageBodyData } from "../relation/notificationMessageRelation/teams";
const pushMessageConfig = {
  dbSync: false,
};
console.log("socket test");
const transformFn = transformAction(pushMessageConfig);
/* =============== test =============== */
// const socket2 = io("http://apis-dev.gz.cvte.cn/meeting_teams_v1", {
//   transports: ["websocket"],
//   query: {
//     clientId: "clientId1234567",
//     rooms: "clientId1234567",
//   },
// });
// Object.keys(teamsSystem).forEach((key: string) => {
//   socket2.on(teamsSystem[key], (msg: any) => {
//     if (typeof msg === "string") {
//       try {
//         console.group(
//           `%c 收到${teamsSystem[key]}消息`,
//           "color: #3296FA;background-color: #ffffff;"
//         );
//         console.log(`对应的常量是 ${key}\n`);
//         console.log(`收到的数据${msg}`);
//         console.groupEnd();
//         const realTimeMessage = JSON.parse(msg);
//         queueInstance.add(transformFn(realTimeMessage, false));
//       } catch (e) {
//         utilsLog({
//           msg: `the push message error ======>>>> ${msg}`,
//           level: "error",
//         });
//       }
//     } else {
//       queueInstance.add(transformFn(msg, false));
//     }
//   });
// });
/* =============== test =============== */

// @ts-ignore
window.pushRealTimeMessage = (
  realTimeMessage: TypepushRealTimeMessage<any>
) => {
  console.log("pushRealTimeMessage");
  queueInstance.add(transformFn(realTimeMessage, false));
};
// @ts-ignore
window.pushNotificationMessage = (
  notificationMessage: TypePushNotificationMessage<any>
) => {
  console.log("pushNotificationMessage");
  queueInstance.add(transformFn(notificationMessage, true));
};

const testRealTimeData: TypepushRealTimeMessage<
  TypeTeamsNameModifyMessageBodyData
> = {
  properties: {
    "message-id": "123",
    timestamp: "123123132",
    "content-type": "123123",
    "content-encoding": "12313",
    routingkey: "meeting.teams.teams.update",
    headers: {
      domain: "meeting",
      system: "teams",
      topic: "teams.update",
      description: "团队信息修改",
      type: "",
    },
  },
  body: {
    updateTime: 123123,
    uri: "",
    resource: "",
    action: 2,
    data: {
      _id: "18537745",
      name: "teams测试小对12313123",
    },
  },
};
// @ts-ignore
window.testRealTime = () => {
  // @ts-ignore
  window.pushRealTimeMessage(testRealTimeData);
};

const testNotificationData: TypePushNotificationMessage<
  TypeTeamsInviteMessageBodyData
> = {
  action: true,
  data: {
    properties: {
      "message-id": "",
      timestamp: "123123",
      "content-type": "",
      "content-encoding": "",
      routingkey: "system.pushservice.message.push",
      headers: {
        domain: "system",
        system: "pushservice",
        topic: "message.push",
        description: "团队邀请通知",
        type: "",
        // to: '12345678',
        // policy: 1,
        // version=1
      },
    },
    body: {
      action: true,
      subject: "邀请人",
      content: "这个是内容",
      extras: {
        subTitle: "二级标题",
        positiveButtonTitle: "查看团队",
        passiveButtonTitle: "关闭",
        type: "teams.invite",
        teamId: "123456",
      },
    },
  },
};
// @ts-ignore
window.testNotification = () => {
  // @ts-ignore
  window.pushNotificationMessage(testNotificationData);
};
