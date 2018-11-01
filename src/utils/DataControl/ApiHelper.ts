import { checki } from "../checkOperator";

export function isResOK<T>(One: checki<any> | checki<T>): One is checki<T> {
  if (One.code !== "6-0000" && One.result) {
    return true;
  } else {
    return false;
  }
}
export function resOK<T>(One: checki<any> | checki<T>): One is checki<T> {
  if (One.code !== "6-0000" && One.result) {
    return true;
  } else {
    return false;
  }
}
