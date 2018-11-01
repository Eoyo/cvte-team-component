import { nativeCaller, nativeListener } from ".";
import {
  AIR_CONNECT,
  AIR_STARTCAST,
  AIR_DISCONNECT,
  AIR_STOPCAST,
  AIR_ONCONNECTED,
  AIR_ONDISCONNECTED,
  AIR_ONSTOPPED,
  AIR_ONSTARTED,
  AIR_ONERROR,
} from "./_native_method_key";

// @ts-ignore
// 连接状态回调接口
/*
   0     操作成功
  -1     心跳丢失
  -2     心跳发送失败
  -3     连接意外被迫关闭
  -4     CRCP版本不匹配
  -5     密钥错误，认证失败
  -6     向远程认证失败
  -7     Socket连接建立失败
  -8     损坏的消息，无法解析
  -9     非法消息，服务器无法响应此消息
  -10    未知的消息ID
  -11    未知错误
  -12    消息超时
  -13    会议建立失败
  -100   独占投屏失败
 */
// enum connectErrorCodeEnum {
//   OPERATION_IS_SUCCESSFUL = 0,
//   HEART_IS_MISSING = -1,
//   HEARTBEAT_SENDING = -2,
//   ACCIDENT_FORCED_TO_SHUT_DOWN = -3,
//   CRCP_VERSION_MISMATCH = -4,
//   KEY_ERROR_AUTHENTICATION_FAILED = -5,
//   TO_REMOTE_AUTHENTICATION_FAILURE = -6,
//   SOCKET_AFTER_ESTABLISHING_FAILURE = -7,
//   CANNOT_RESOLVE_CORRUPTED_NEWS = -8,
//   ILLEGAL_MESSAGE = -9,
//   UNKNOWN_NEWS = -10,
//   AN_UNKNOWN_ERROR = -11,
//   NEWS_TIMEOUT = -12,
//   MEETING_SET_UP_FAILURE = -13,
//   EXCLUSIVE_SCREEN_FAILURE = -100,
//   SHARING_SCREEN_FAILURE = -101,
// }
export type connectErrorCodeType = {
  errorCode:
    | 0
    | -1
    | -2
    | -3
    | -4
    | -5
    | -6
    | -7
    | -8
    | -9
    | -10
    | -11
    | -12
    | -13
    | -100
    | -101;
};

// 停止投屏状态
/*
   0     操作成功
  -1     操作失败，原因未知
  -99    参数错误
  -1000  用户未登录
  -2000  连接投屏失败
 */

export type stopAirCastErrorCodeType = {
  errorCode: 0 | -1 | -99 | -1000 | -2000;
};

// 投屏连接
export type AIRCONNECT_DATA_TYPE = {
  pin_code: string;
};
export type AIRCONNECT_RESPONSE_TYPE = {
  ret: number;
  data: any;
};
// 开始投屏
export type AIRSTARTCAST_DATA_TYPE = {
  is_occupy: number;
};
export type AIRSTARTCAST_RESPONSE_TYPE = {
  ret: number;
  data: any;
};

// 停止投屏连接
export type AIRDISCONNECT_DATA_TYPE = {};
export type AIRDISCONNECT_RESPONSE_TYPE = {
  ret: number;
};

// 停止投屏
export type AIRSTOPCAST_DATA_TYPE = {};
export type AIRSTOPCAST_RESPONSE_TYPE = {
  ret: number;
};

// 投屏链接状态回调
export type AIRONCONNECTED_DATA_TYPE = Function;
export type AIRONCONNECTED_RESPONSE_TYPE = {
  errorCode?: number;
};

// 投屏断开链接回调
export type AIRONDISCONNECTED_DATA_TYPE = Function;
export type AIRONDISCONNECTED_RESPONSE_TYPE = {};

// 开始投屏回调
export type AIRONSTARTED_DATA_TYPE = Function;
export type AIRONSTARTED_RESPONSE_TYPE = {};
// 停止投屏回调
export type AIRONSTOPED_DATA_TYPE = Function;
export type AIRONSTOPED_RESPONSE_TYPE = {};

//投屏中途错误回调
export type AIRONERROR_DATA_TYPE = Function;
export type AIRONERROR_RESPONSE_TYPE = {
  errorCode?: number;
};
/* ========================== type end ========================== */
// @ts-ignore
// 连接投屏
export const airConnect = (data: AIRCONNECT_DATA_TYPE) => {
  return nativeCaller<AIRCONNECT_DATA_TYPE, AIRCONNECT_RESPONSE_TYPE>(
    AIR_CONNECT,
    data
  );
};
// @ts-ignore
// 开始投屏
export const airStartCast = (data: AIRSTARTCAST_DATA_TYPE) => {
  return nativeCaller<AIRSTARTCAST_DATA_TYPE, AIRSTARTCAST_RESPONSE_TYPE>(
    AIR_STARTCAST,
    data
  );
};

// @ts-ignore
// 停止投屏连接
export const airDisConnect = () => {
  return nativeCaller<AIRDISCONNECT_DATA_TYPE, AIRDISCONNECT_RESPONSE_TYPE>(
    AIR_DISCONNECT
  );
};

// @ts-ignore
// 停止投屏
export const airStopCast = () => {
  return nativeCaller<AIRSTOPCAST_DATA_TYPE, AIRSTOPCAST_RESPONSE_TYPE>(
    AIR_STOPCAST
  );
};
// @ts-ignore
// 连接状态回调接口
export const airOnConnected = (callback: AIRONCONNECTED_DATA_TYPE) => {
  return nativeListener<AIRONCONNECTED_RESPONSE_TYPE>(
    AIR_ONCONNECTED,
    callback
  );
};
// @ts-ignore
// 断开连接回调接口
export const airOnDisconnected = (callback: AIRONDISCONNECTED_DATA_TYPE) => {
  return nativeListener<AIRONDISCONNECTED_RESPONSE_TYPE>(
    AIR_ONDISCONNECTED,
    callback
  );
};

// @ts-ignore
// 投屏开始回调接口
export const airOnStarted = (callback: AIRONSTARTED_DATA_TYPE) => {
  return nativeListener<AIRONSTARTED_RESPONSE_TYPE>(AIR_ONSTARTED, callback);
};

// @ts-ignore
// 投屏停止回调接口
export const airOnStopped = (callback: AIRONSTOPED_DATA_TYPE) => {
  return nativeListener<AIRONSTOPED_RESPONSE_TYPE>(AIR_ONSTOPPED, callback);
};

// @ts-ignore
// 投屏中途出错回调接口
export const airOnError = (callback: AIRONERROR_DATA_TYPE) => {
  return nativeListener<AIRONERROR_RESPONSE_TYPE>(AIR_ONERROR, callback);
};
