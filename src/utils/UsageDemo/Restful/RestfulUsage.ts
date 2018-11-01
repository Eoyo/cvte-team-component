import { RestDemo } from "./RestfulBuild";
import { isResOK } from "../../Restful";
import {
  GetNameSource,
  GetNameBody,
  GetNameResponse,
  putNameSource,
  putNameBody,
  putNameResponse,
} from "./DemoTypes";

// 定义某个api集合
export const demo = {
  getName: RestDemo("/").get,

  // 定义类型
  setNameWithType: RestDemo<
    // restful api 的参数, 使用其他文件定义的interface
    GetNameSource,
    // body 的参数
    {
      name: string;
    },
    // 返回的类型
    {
      status: boolean;
    }
  >("/setName/:id").post,
  deleteNameWithInterface: RestDemo<
    GetNameSource,
    GetNameBody,
    GetNameResponse
  >("/deleteName/:id").delete,
  putName: RestDemo<
    putNameSource,
    putNameBody,
    putNameResponse
  >("/putName/:id").put,
};

export const sayHello = {};

// 调用
demo
  .getName(
    {},
    {
      data: {
        name: "lium",
      },
    }
  )
  .then(res => {
    if (isResOK(res)) {
      console.log("getName", res.message);
    } else {
      console.log("getName", res.message);
    }
  });

demo
  .setNameWithType(
    {
      id: "24",
    },
    {
      data: {
        name: "XuTao",
      },
    }
  )
  .then(d => {
    if (isResOK(d)) {
      console.log("setName", d.value);
    } else {
      console.log("setName", d.message);
    }
  });

demo
  .setNameWithType(
    {
      id: "66",
    },
    {
      data: {
        name: "Fei",
      },
    }
  )
  .then(res => {
    console.log("resetName", res.message);
  });

demo
  .deleteNameWithInterface({ id: "" }, {})
  .then(res => {
    if (isResOK(res)) {
      console.log("deletaName", res.message);
    } else {
      console.log("deletaName", res.message);
    }
  });

demo
  .putName(
    { id: "", type: "admin" },
    { data: { name: "wode" } }
  )
  .then(res => {
    if (isResOK(res)) {
      console.log("putName", res.message);
    } else {
      console.log("putName", res.message);
    }
  });
