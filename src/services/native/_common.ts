import { nativeCaller, nativeListener } from ".";
import {
  UTIL_LOG,
  UTILS_CLEANALLCOOKIES,
  UTILS_OPENURL,
  CONFIG_GETSERVERNAME,
  CONFIG_GETSERVERDOMAIN,
  PUSH_REAL_TIME_MESSAGE,
  PUSH_NOTIFICATION_MESSAGE,
  UTILS_START_WINDOW_DRAG,
  UTILS_STOP_WINDOW_DRAG,
  UTILS_CLOSE_WINDOW,
  UTILS_MAXIMIZE_WINDOW,
  UTILS_NORMALIZE_WINDOW,
  UTILS_MINIMIZEWINDOW,
  UTILS_ON_WINDOW_STATE_CHANGED,
  UTILS_GET_APP_VERSION,
  CONFIG_GETMRBSDOMAIN,
  UTILS_GET_REALTIME_MESSAGE_EVENTS,
  CONFIG_GET_FRIDAY_APPID,
  CONFIG_SETWEBVIEWCONFIG,
} from "./_native_method_key";
import {
  TypePushNotificationMessage,
  TypepushRealTimeMessage,
} from "../pushmessage/pushMessageType";
/* 日志log type */
export type UTIL_LOG_DATA_TYPE = {
  msg: string;
  level?: "verbose" | "info" | "debug" | "warning" | "error";
};
// 清除cookie
export type UTILS_CLEAN_ALL_COOKIES_DATA_TYPE = {};

// 获取域名返回数据type
export type GETSERVERDOMAIN_RESPONSE_TYPE = {
  ret?: number;
  domain: string;
};

// 获取客户端server_name返回数据type
export type CONFIG_GETSERVERDOMAIN_RESPONSE_TYPE = {
  ret: number;
  server_name: string;
};
export type CONFIG_GETMRBSDOMAIN_RESPONSE_TYPE = {
  ret: number;
  domain: string;
};

export type UTILS_OPENURL_DATA_TYPE = {
  url: string;
};

export type UTILS_OPENURL_RESPONSE_TYPE = {
  ret: number;
};

export type UTILS_PUSH_REAL_TIME_MESSAGE_DATA_TYPE = TypepushRealTimeMessage<
  any
>;

export type UTILS_PUSH_NOTIFICATION_MESSAGE_RESPONSE_TYPE = TypePushNotificationMessage<
  any
>;

export type UTILS_ON_WINDOW_STATE_CHANGED_RESPONSE_TYPE = {
  // <状态枚举：0: 常规状态，1: 最大化，2: 最小化>
  state: 0 | 1 | 2;
};

// 版本参数
export type UTILS_GET_APP_VERSION_RESPONSE_TYPE = {
  version: string;
  frontEndCommit: string;
  frontEndGitCount: string;
};

// 获取需要侦听的实时推送事件列表
export type UTILS_GET_REALTIME_MESSAGE_EVENTS_PARAMS_TYPE = {
  events: string[];
};
// { "events": ["event1", "event2", ...] }

// FRIDAY appid
export type GET_FRIDAY_APPID_RESPONSE_TYPE = {
  appId: string;
};

export type CONFIG_SETWEBVIEWCONFIG_PARAMS_TYPE = {
  allowedFileTypes: string[];
};
/* ===================== function ===================== */
// 添加日志
export const utilsLog = (data: UTIL_LOG_DATA_TYPE) =>
  nativeCaller<UTIL_LOG_DATA_TYPE, {}>(UTIL_LOG, data);
// 清除cookie
export const utils_cleanAllCookies = () =>
  nativeCaller<UTILS_CLEAN_ALL_COOKIES_DATA_TYPE, {}>(
    UTILS_CLEANALLCOOKIES,
    {}
  );

// 获取客户端配置中的 域名config_getServerDomain
export const getServerDomain = () =>
  nativeCaller<{}, GETSERVERDOMAIN_RESPONSE_TYPE>(CONFIG_GETSERVERDOMAIN, {});

// 获取客户端配置中的 server name config_getServerName
export const getServerServerName = () =>
  nativeCaller<{}, CONFIG_GETSERVERDOMAIN_RESPONSE_TYPE>(CONFIG_GETSERVERNAME);
// 获取
export const getMRBSServerName = () =>
  nativeCaller<{}, CONFIG_GETMRBSDOMAIN_RESPONSE_TYPE>(CONFIG_GETMRBSDOMAIN);
//浏览器打开链接
export const utilsOpenUrl = (data: UTILS_OPENURL_DATA_TYPE) =>
  nativeCaller<UTILS_OPENURL_DATA_TYPE, UTILS_OPENURL_RESPONSE_TYPE>(
    UTILS_OPENURL,
    data
  );

// 消息通知
export const pushRealTimeMessage = (callback: Function) => {
  nativeListener<UTILS_PUSH_REAL_TIME_MESSAGE_DATA_TYPE>(
    PUSH_REAL_TIME_MESSAGE,
    callback
  );
};

// 推送通知
export const pushNotificationMessage = (callback: Function) => {
  nativeListener<UTILS_PUSH_NOTIFICATION_MESSAGE_RESPONSE_TYPE>(
    PUSH_NOTIFICATION_MESSAGE,
    callback
  );
};

// 开始拖拽
export const utilsStartWindowDrag = () => {
  nativeCaller<{}, {}>(UTILS_START_WINDOW_DRAG);
};
// 结束拖拽
export const utilsStopWindowDrag = () => {
  nativeCaller<{}, {}>(UTILS_STOP_WINDOW_DRAG);
};
// 关闭窗口
export const utilsCloseWindow = () => {
  nativeCaller<{}, {}>(UTILS_CLOSE_WINDOW);
};
// 最大化
export const utilsMaximizeWindow = () => {
  nativeCaller<{}, {}>(UTILS_MAXIMIZE_WINDOW);
};
// 正常化
export const utilsNormalizeWindow = () => {
  nativeCaller<{}, {}>(UTILS_NORMALIZE_WINDOW);
};
// 最小化
export const utilsMinimizeWindow = () => {
  nativeCaller<{}, {}>(UTILS_MINIMIZEWINDOW);
};
// 窗口回调
export const utilsOnWindowStateChanged = (callback: Function) => {
  nativeListener<UTILS_ON_WINDOW_STATE_CHANGED_RESPONSE_TYPE>(
    UTILS_ON_WINDOW_STATE_CHANGED,
    callback
  );
};

// 获取版本
export const utilsGetAppVersion = () =>
  nativeCaller<{}, UTILS_GET_APP_VERSION_RESPONSE_TYPE>(UTILS_GET_APP_VERSION);

// 实时消息推送事件[WINDOWS ONLY]
export const utilsSetRealtimeMessageEvents = (
  data: UTILS_GET_REALTIME_MESSAGE_EVENTS_PARAMS_TYPE
) => {
  nativeCaller<UTILS_GET_REALTIME_MESSAGE_EVENTS_PARAMS_TYPE, {}>(
    UTILS_GET_REALTIME_MESSAGE_EVENTS,
    data
  );
};

// 获取friday appid
export const utilsGetFridayAppId = () =>
  nativeCaller<{}, GET_FRIDAY_APPID_RESPONSE_TYPE>(CONFIG_GET_FRIDAY_APPID);

// 更新webview文件上传配置
export const utilssetWebViewConfig = (
  data: CONFIG_SETWEBVIEWCONFIG_PARAMS_TYPE
) =>
  nativeCaller<CONFIG_SETWEBVIEWCONFIG_PARAMS_TYPE, {}>(
    CONFIG_SETWEBVIEWCONFIG,
    data
  );
