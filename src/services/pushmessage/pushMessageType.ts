// 消息和推送 数据header
export type TypeMessageheader = {
  domain: string;
  system: string;
  topic: string;
  type: string;
  description: string;
};
// 消息和推送 数据properties
export type TypeProperties = {
  "message-id": string;
  timestamp: string;
  "content-type": string;
  "content-encoding": string;
  routingkey?: string;
  headers: TypeMessageheader;
};
// 推送数据body
export type TypeMessageBody<dataType> = {
  updateTime: number;
  uri: string;
  resource: string;
  action: string | number;
  data: dataType;
};
// 推送整体数据
export type TypepushRealTimeMessage<TypepushRealTimedataType> = {
  properties: TypeProperties;
  body: TypeMessageBody<TypepushRealTimedataType>;
};

// 关联数据
export type TypeRelation = {
  messageRouteKey: string;
  reducerActionKey: string;
  actorTrigger: Function;
};
// action 本地DB的触发函数
// data 数据
// actor 的触发器
export type TypeMulipleAction = {
  action: string;
  data: object;
  actorTrigger?: Function;
};

// 由客户端返回的用户操作（action）和后端集合（data）
export type TypePushNotificationMessage<pushNotificationMessagedataType> = {
  action: boolean;
  data: {
    properties: TypeProperties;
    body: TypePushNotificationMessageBody<pushNotificationMessagedataType>;
  };
};
// 客户端系统推送显示的信息
export type TypePushNotificationMessageBody<dataType> = {
  subject: string;
  content: string;
  extras: {
    subTitle: string;
    positiveButtonTitle: string;
    passiveButtonTitle: string;
    type: string;
  } & dataType;
  action: boolean;
};
