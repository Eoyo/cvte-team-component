import { AutoApi } from "../../utils/DataControl/AutoApi";
import { app } from "../../stores/app/app";

const meetingroom = AutoApi({
  baseURL: () => app.get("baseURL") + "/room",
  headers: {
    Authorization: () => `Bearer ${app.get("access_token")}`,
    accept: "application/json;version=1",
    "server-name": () => app.get("server_name") || "",
  },
});

export const meetingLoader = {
  orderNoGetInfo: meetingroom("/api/user/orders/{orderNo}").get,
  meetingConflict: meetingroom(
    "/api/user/orders/conflict?roomId={roomId}&startTime={startTime}&endTime={endTime}&repeat={repeat}&repeatDate={repeatDate}&repeatEndDate={repeatEndDate}"
  ).get,
};
