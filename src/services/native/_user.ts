import { nativeCaller } from ".";
import {
  AUTH_GETACCESSTOKEN,
  AUTH_GETUSERINFO,
  LOGOUT,
} from "./_native_method_key";
export type AUTHGETACCESSTOKEN_RESPONSE_TYPE = {
  access_token: string;
};
export type AUTH_GETUSERINFO_RESPONSE_TYPE = {
  ret?: number;
  data: any;
};
export type LOGOUT_RESPONSE_TYPE = {};
// @ts-ignore
// 获取用户token
export const authGetAccessToken = () =>
  nativeCaller<{}, AUTHGETACCESSTOKEN_RESPONSE_TYPE>(AUTH_GETACCESSTOKEN);

// @ts-ignore
// 获取用户信息
export const authGetUserInfo = () =>
  nativeCaller<{}, AUTH_GETUSERINFO_RESPONSE_TYPE>(AUTH_GETUSERINFO);

// 退出登录

export const authLogout = () => {
  nativeCaller<{}, LOGOUT_RESPONSE_TYPE>(LOGOUT);
};
