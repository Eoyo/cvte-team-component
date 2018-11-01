import { message } from "antd";
import { checki } from "../../../../utils/checkOperator";

export function resLog(res: checki<any>) {
  if (res && res.result) {
    console.log(res);
  } else {
    console.error(res);
    message.error(res.message || "操作失败");
  }
}
