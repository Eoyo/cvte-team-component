import { appDataTypes } from "./appDataTypes";
let userData;
// @start xutao
const xutaoData = {
  displayName: "徐涛",
  mobile: "136****4226",
  avatar:
    "https://store-tg1.cvte.com/d5cc19af1aaabe15b818361d0d5596948ba5ce4ba49fe681dfded6342f1fdb88.png",
  createTime: 1533815561877,
  isMailConfig: false,
  _id: "43e8f153-8634-46a1-8265-396f8c32ecea",
};
userData = xutaoData;
// @end xutao

// @start liumiao
const liumiaoData = {
  displayName: "173xxxx0507",
  mobile: "173****0507",
  email: "liumiao@cvte.com",
  avatar: null,
  createTime: 1533818320184,
  isMailConfig: false,
  _id: "5b7abea8ca837b001693ac9b",
};
userData = liumiaoData;
// @end liumiao

// @start hzy
const hzyData = {
  displayName: "haozeyu",
  mobile: "186****9207",
  email: "haozeyu@cvte.com",
  avatar:
    "https://store-tg1.cvte.com/88b7cb68e89b10740a623285a950f02c794eaad2bbf0b9d8cf4e8684dfe92f4a.jpg",
  createTime: 1533822314059,
  isMailConfig: false,
  _id: "425084e8-0d2f-48c8-b006-5762059044cf",
};
userData = hzyData;
//@end hzy

// @start test
const testUserData = {
  displayName: "测试用户1",
  mobile: "188****8888",
  email: "1014996602@qq.com",
  avatar:
    "https://store-tg1.cvte.com/88b7cb68e89b10740a623285a950f02c794eaad2bbf0b9d8cf4e8684dfe92f4a.jpg",
  createTime: 1533813934402,
  isMailConfig: false,
  _id: "5b768264128dab001586c8c8",
};
userData = testUserData;
//@end test

// @start luhui
const luhuiData = {
  displayName: "luhui",
  mobile: "13929561885",
  email: "luhui@cvte.com",
  avatar:
    "https://store-g1.seewo.com/maxhub-teams%2F5a35eb3f86414760969c105477e2d591",
  createTime: 1533813934402,
  isMailConfig: false,
  _id: "3a942c1c-d3f5-423d-96d2-255a8ad52f79",
};

// userData = luhuiData;
// @end luhui

// userData = liumiaoData;

userData = hzyData;
// userData = liumiaoData;

export const appData: appDataTypes = {
  userData,
  contactLists: { contacts: [], teams: [] },
  access_token: "b89b65cb-f21c-4044-bd97-5570a1c894c4",
  // @ts-ignore
  baseURL: API_PROXY,
  // @ts-ignore
  mrbsServer: MRBS_WEB,
  server_name: "",
};
