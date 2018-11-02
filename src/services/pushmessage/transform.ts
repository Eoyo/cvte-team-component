/*
 * @File: 消息数据转化为队列数据
 * @Date: 2018-09-06 16:31:21 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-10-31 21:59:23
 */
// import { db } from "../../localDB";
import * as Actions from "./relation";
import {
  TypepushRealTimeMessage,
  TypePushNotificationMessage,
  TypeRelation,
  TypeMulipleAction,
} from "./pushMessageType";
import { utilsLog, system as APPSystem } from "../native";
import { allRouteKeyByDomain } from "./contants";
// 消息和推送的key 集合
const {
  teams: TeamsSystem,
  pushservice: pushserviceSystem,
} = allRouteKeyByDomain;
const { pushServiceSystemHandlers, teamsSystemHandlers } = Actions;

const teamsSystemRelation = Object.keys(TeamsSystem).reduce(
  (map: any, topic: string) => {
    const topicValue = TeamsSystem[topic];
    // action
    Object.keys(teamsSystemHandlers).forEach((actionKey: string) => {
      const action = teamsSystemHandlers[actionKey];
      if (topicValue && topicValue === action.messageRouteKey) {
        map[topicValue] = action;
      }
    });
    return map;
  },
  {}
);

const pushserviceSystemRelation = Object.keys(pushserviceSystem).reduce(
  (map: any, topic: string) => {
    const topicValue = pushserviceSystem[topic];
    // action
    Object.keys(pushServiceSystemHandlers).forEach((actionKey: string) => {
      const action = pushServiceSystemHandlers[actionKey];
      if (topicValue && topicValue === action.messageRouteKey) {
        map[topicValue] = action;
      }
    });
    return map;
  },
  {}
);
// console.log(pushserviceSystemRelation, teamsSystemRelation);
// let allRelation = Object.keys(teams).reduce(
//   (result: any, systemKey: string) => {
//     // system
//     result[systemKey] = Object.keys(allRouteKeyByDomain[systemKey]).reduce(
//       (map: any, topic: string) => {
//         const topicValue = allRouteKeyByDomain[systemKey][topic];
//         // action
//         Object.keys(Actions).forEach((actionKey: string) => {
//           const action = Actions[actionKey];
//           if (topicValue && topicValue === action.messageRouteKey) {
//             map[topicValue] = action;
//           }
//         });
//         return map;
//       },
//       {}
//     );
//     return result;
//   },
//   {}
// );

// 暂时
const findRelation = (data: any, isPushMessage: boolean) => {
  utilsLog({ msg: JSON.stringify(data) + "=====>" + isPushMessage });
  if (isPushMessage) {
    const {
      action,
      data: {
        properties: {
          headers: { system },
        },
        body: {
          extras: { type },
        },
      },
    }: TypePushNotificationMessage<any> = data;
    const _result = pushserviceSystemRelation[type];
    return _result;
  } else {
    const {
      properties: {
        headers: { topic, system },
      },
    }: TypepushRealTimeMessage<any> = data;
    return teamsSystemRelation[topic];
  }
};
// 处理数据，兼容window 传参格式
const dealData = (data: any, isPushMessage: boolean) => {
  console.log(typeof data);
  if (APPSystem.osx) {
    return data;
  } else {
    if (isPushMessage) {
      return {
        ...data,
        data: JSON.parse(data.data),
      };
    } else {
      return data;
    }
  }
};

//
export type TypetransformAction = ((
  config: {
    dbSync: boolean;
  }
) => (data: any, isPushMessage: boolean) => () => Promise<TypeMulipleAction>);
// 数据转化
export const transformAction: TypetransformAction = (config: {
  dbSync: boolean;
}) => {
  const isDbSync = config.dbSync;
  return (data: any, isPushMessage: false) => {
    return () => {
      return new Promise((resolve, reject) => {
        // 兼容window 格式
        const dataAfterDeal = dealData(data, isPushMessage);
        //
        const relation: TypeRelation = findRelation(
          dataAfterDeal,
          isPushMessage
        );
        if (relation) {
          if (isPushMessage) {
            const _data: TypePushNotificationMessage<any> = dataAfterDeal;
            _data.data.body.action = dataAfterDeal.action;
          }
          try {
            (async () => {
              // db操作
              if (isDbSync) {
                console.log("db 同步中");
                // await db.applyModify({
                //   action: relation.reducerActionKey,
                //   data: data,
                // });
              }
              // actor 操作
              await (typeof relation.actorTrigger === "function" &&
                relation.actorTrigger(
                  isPushMessage ? dataAfterDeal.data.body : dataAfterDeal.body
                ));
              console.log("actor 操作");
            })();
          } catch (e) {
            utilsLog({
              msg: "push Message transform error" + e.mssage,
              level: "error",
            });
          }
        } else {
          console.error("not relation");
        }
      });
    };
  };
};
