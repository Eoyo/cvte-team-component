import { AutoApi } from "../../utils/DataControl/AutoApi";
import { app } from "../../stores/app/app";
const Base64 = require("js-base64").Base64;

const user = "maxhub";
const passwd = "maxhub@123";
const file = AutoApi({
  baseURL: () => app.get("baseURL") + "/airdisk",
  headers: {
    accept: "application/json;version=1",
    Authorization: () => "Basic " + Base64.encode(user + ":" + passwd),
    "server-name": () => app.get("server_name") || "",
  },
});

export const fileLoader = {
  saveFile: file("/api/teams/files").post,
  shareFile: file("/api/shares/{shareId}/resources").post,
  deleteFile: file("/api/shares/{shareId}/resources/{itemId}").del,
  fetchShareFiles: file("/api/shares/{shareId}/resources/teams").get,
};
