import { RestfulApi } from "../../utils/Restful";
import { AutoApi } from "../../utils/DataControl/AutoApi";
import { app } from "../../stores/app/app";
export const Api = AutoApi({
  baseURL: () => app.get("baseURL") + "/teams",
  headers: {
    accept: "application/json;version=1",
    Authorization: () => `Bearer ${app.get("access_token")}`,
    "server-name": () => app.get("server_name") || "",
  },
});

export const testDemo = RestfulApi({
  baseURL: "http://api-maxweb.gz.cvte.cn/project/45",
});

// 对接自动生成的api的Spore;
export const Spore = AutoApi({
  baseURL: () => app.get("baseURL") + "/teams",
  headers: {
    accept: "application/json;version=1",
    Authorization: () => `Bearer ${app.get("access_token")}`,
    "server-name": () => app.get("server_name") || "",
  },
});
