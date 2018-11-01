import { testDemo } from "../region";
import { getUserInfo, getUserInfoResponse } from "./demoTypes";
export const testRequestDemo = {
  getUserInfo: testDemo<getUserInfo, {}, getUserInfoResponse>(
    "/api/client/auth/userinfo?access_token={access_token}"
  ).get,
};
