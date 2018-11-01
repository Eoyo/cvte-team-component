import { orm, AllORMState } from "./models";
import { createReducer, createSelector } from "redux-orm";
import {
  createStore,
  combineReducers,
  DeepPartial,
  applyMiddleware,
} from "redux";
import { TypeMulipleAction } from "../services/pushmessage/pushMessageType";
// import { call, put } from "redux-saga/effects";
// import createSagaMiddleware from "redux-saga";
// 持久化尝试
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import "./test";
// saga
// const sagaMiddleware = createSagaMiddleware();
// 将整个models 对象生成reducer 和 隐藏的state
const ormReducer = createReducer(orm);
// 持久化尝试
const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, ormReducer);

// 生成 和 export 整个store
export const store = createStore(
  persistedReducer
  // applyMiddleware(sagaMiddleware)
);
// 持久化储存，存在localstorage
persistStore(store);
// 临时选择器demo
export const dbStateSelector = (state: any) => state.db;

// 订阅变化
store.subscribe(() => {
  const data = store.getState();
});

// 使用 dispatch 进行操作
export const db = {
  applyModify: (mulAction: TypeMulipleAction) => {
    return store.dispatch({
      type: mulAction.action,
      payload: mulAction.data,
    });
  },
  // 初始化 从persist取出数据赋值
  initApp: () => {
    // 联系人数据
    // 团队数据
    // 会议列表啊数据
  },
};
